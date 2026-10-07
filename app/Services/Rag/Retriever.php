<?php

namespace App\Services\Rag;

use App\Models\Chunk;
use App\Services\Llm\Contracts\OpenAiClient;
use App\Services\Rag\Contracts\Reranker;
use App\Services\Vector\Contracts\QdrantClient;
use App\Support\CanonicalUrl;
use Illuminate\Support\Facades\Cache;

class Retriever
{
    public function __construct(
        private readonly OpenAiClient $llm,
        private readonly QdrantClient $vector,
        private readonly Reranker $reranker,
    ) {}

    /**
     * Two-stage retrieval:
     *   1. ANN over Vectorize → take top (topK * fanOut) candidates by cosine similarity (recall-oriented).
     *   2. Cross-encoder reranker → reorder candidates by query relevance (precision-oriented), keep top-K.
     *
     * Threshold is applied AFTER reranking so a candidate that bge-base
     * scored borderline (0.51) but the reranker scores high (0.92) survives.
     *
     * @return array{chunks: array<int, array{text: string, url: ?string, score: float, chunk_id: string, rerank_score?: float}>, low_confidence: bool}
     */
    public function retrieve(
        string $agentId,
        string $query,
        float $threshold = 0.5,
        int $topK = 6,
        ?string $currentPageUrl = null,
    ): array {
        $collection = (string) config('services.vector_collection', 'orbychat-chunks');
        $canonicalCurrent = $currentPageUrl !== null ? CanonicalUrl::for($currentPageUrl) : null;
        // Bake the current-page hint into the cache key so a question
        // asked from /products/red-pen doesn't reuse the cached top-K
        // for the same question asked from /about — those should rank
        // different chunks higher.
        $cacheKey = 'rag:retrieve:'.$agentId.':'
            .hash('sha256', mb_strtolower(trim($query)).'|'.($canonicalCurrent ?? ''));

        $cached = Cache::get($cacheKey);
        if (is_array($cached)) {
            return $cached;
        }

        // Embed query (slow on cache miss).
        $embeddings = $this->llm->embed([$query]);
        $vector = $embeddings[0] ?? [];

        // Stage 1 — recall-oriented ANN. Pull more than we need so the
        // reranker has options to choose from.
        $fanOut = (int) config('services.rag.rerank_fan_out', 3);
        $candidatesK = max($topK, $topK * $fanOut);
        $results = $this->vector->search($collection, $vector, ['agent_id' => $agentId], $candidatesK);

        if ($results === []) {
            $payload = ['chunks' => [], 'low_confidence' => true];
            Cache::put($cacheKey, $payload, now()->addMinutes(30));

            return $payload;
        }

        // Hydrate chunk text from DB so the reranker has full content.
        $chunkIds = array_filter(array_map(fn ($r) => $r['payload']['chunk_id'] ?? null, $results));
        $byId = Chunk::query()->withoutWorkspaceScope()
            ->whereIn('id', $chunkIds)
            ->get()
            ->keyBy('id');

        $candidates = [];
        foreach ($results as $r) {
            $chunkId = $r['payload']['chunk_id'] ?? null;
            $chunk = $chunkId !== null ? ($byId[$chunkId] ?? null) : null;
            if ($chunk === null) {
                continue;
            }
            $candidates[] = [
                'text' => $chunk->text,
                'url' => $r['payload']['url'] ?? null,
                'score' => (float) $r['score'],
                'chunk_id' => $chunk->id,
            ];
        }

        // Stage 2 — precision-oriented rerank.
        $reranked = $this->reranker->rerank($query, $candidates, $topK);

        // Stage 2.5 — current-page boost. When the visitor is on a
        // specific page, chunks crawled from THAT exact page are more
        // likely to be the right answer than chunks from elsewhere on
        // the site. Bump their rerank score by 0.15 (cap at 1.0) and
        // re-sort. The threshold check below uses the boosted score so
        // a borderline same-page chunk survives where it otherwise
        // would have been filtered out.
        if ($canonicalCurrent !== null) {
            foreach ($reranked as $i => $r) {
                $candUrl = is_string($r['url'] ?? null) ? CanonicalUrl::for($r['url']) : null;
                if ($candUrl !== null && $candUrl === $canonicalCurrent) {
                    $base = (float) ($r['rerank_score'] ?? $r['score'] ?? 0);
                    // Don't cap — only relative order matters for ranking,
                    // and capping at 1.0 would tie with already-1.0 chunks
                    // and let stable-sort preserve the wrong order.
                    $reranked[$i]['rerank_score'] = $base + 0.15;
                    $reranked[$i]['boosted_for_current_page'] = true;
                }
            }
            usort(
                $reranked,
                fn ($a, $b) => ($b['rerank_score'] ?? $b['score'] ?? 0) <=> ($a['rerank_score'] ?? $a['score'] ?? 0),
            );
            $reranked = array_slice($reranked, 0, $topK);
        }

        // Threshold passes when EITHER the ANN cosine score OR the
        // rerank score clears the bar — whichever is more meaningful for
        // this provider:
        //
        //  - Real bge-reranker-base (Cloudflare): cross-encoder logits run
        //    0.001–0.5 even on perfect matches. ANN cosine (0.3–0.8) is
        //    the meaningful signal and rerank gives ordering only.
        //  - FakeReranker in tests: synthetic vectors can produce negative
        //    cosine scores; rerank_score is the deterministic 0–1 signal
        //    that survives.
        //
        // Taking max() of the two means production filters on ANN
        // (correct), tests filter on rerank (correct), and we never
        // throw away a high-confidence match because one of the two
        // signals happens to be small.
        //
        // Boosted same-page chunks always pass — current-page lift is
        // already baked into rerank_score above.
        $passing = array_values(array_filter(
            $reranked,
            function ($r) use ($threshold) {
                if (($r['boosted_for_current_page'] ?? false) === true) {
                    return true;
                }
                $best = max(
                    (float) ($r['score'] ?? 0),
                    (float) ($r['rerank_score'] ?? 0),
                );

                return $best >= $threshold;
            }
        ));

        $payload = [
            'chunks' => $passing,
            'low_confidence' => count($passing) < 2,
        ];

        Cache::put($cacheKey, $payload, now()->addMinutes(30));

        return $payload;
    }
}
