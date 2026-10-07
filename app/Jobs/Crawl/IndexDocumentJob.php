<?php

namespace App\Jobs\Crawl;

use App\Models\Chunk;
use App\Models\Document;
use App\Models\Source;
use App\Services\Llm\Contracts\OpenAiClient;
use App\Services\Llm\OpenAiHttpClient;
use App\Services\Rag\Chunker;
use App\Services\Vector\Contracts\QdrantClient;
use App\Support\CrawlDebugLog;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class IndexDocumentJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $backoff = 30;

    public function __construct(public string $documentId, public string $text) {}

    public function handle(Chunker $chunker, OpenAiClient $llm, QdrantClient $vector): void
    {
        $document = Document::query()->withoutWorkspaceScope()->findOrFail($this->documentId);
        $collection = (string) config('services.vector_collection', 'orbychat-chunks');

        $segments = $chunker->chunk($this->text);
        CrawlDebugLog::write('IndexDocumentJob chunked document.', [
            'document_id' => $document->id,
            'source_id' => $document->source_id,
            'agent_id' => $document->agent_id,
            'input_length' => mb_strlen($this->text),
            'segments_count' => count($segments),
            'first_segment_preview' => isset($segments[0])
                ? CrawlDebugLog::preview($segments[0], 700)
                : null,
        ]);

        if ($segments === []) {
            $this->markSourceFailed($document, 'Index failed: no searchable text chunks were created.');

            return;
        }

        $vectorBatches = [];
        foreach (array_chunk($segments, 25) as $batchTexts) {
            $vectors = $this->embedWithFallback($llm, $batchTexts);
            if (count($vectors) !== count($batchTexts)) {
                throw new \RuntimeException('Embedding provider returned '.count($vectors).' vectors for '.count($batchTexts).' chunks.');
            }
            CrawlDebugLog::write('IndexDocumentJob embedded batch.', [
                'document_id' => $document->id,
                'source_id' => $document->source_id,
                'batch_size' => count($batchTexts),
                'vectors_count' => count($vectors),
                'vector_dimensions' => isset($vectors[0]) && is_array($vectors[0]) ? count($vectors[0]) : null,
            ]);
            $vectorBatches[] = $vectors;
        }

        // Re-index only after embeddings succeeded, so a transient provider
        // failure does not wipe the last good chunks for an existing document.
        $vector->deleteByFilter($collection, ['document_id' => $document->id]);
        Chunk::query()->withoutWorkspaceScope()->where('document_id', $document->id)->delete();

        $chunkRows = [];
        foreach ($segments as $i => $segment) {
            $chunkRows[] = Chunk::create([
                'document_id' => $document->id,
                'agent_id' => $document->agent_id,
                'ord' => $i,
                'text' => $segment,
                'token_count' => (int) ceil(mb_strlen($segment) / 4),
            ]);
        }

        // Keep Vectorize upserts small. Its API can timeout on larger NDJSON
        // payloads even when embeddings succeeded.
        $batches = array_chunk($chunkRows, 25);
        foreach ($batches as $batchIndex => $batch) {
            $vectors = $vectorBatches[$batchIndex] ?? [];
            $points = [];
            foreach ($batch as $idx => $chunk) {
                $pointId = (string) Str::uuid7();
                $chunk->forceFill(['qdrant_point_id' => $pointId])->save();
                $points[] = [
                    'id' => $pointId,
                    'vector' => $vectors[$idx],
                    'payload' => [
                        'workspace_id' => $document->agent->workspace_id ?? null,
                        'agent_id' => $document->agent_id,
                        'source_id' => $document->source_id,
                        'document_id' => $document->id,
                        'chunk_id' => $chunk->id,
                        'url' => $document->url,
                        'lang' => $document->lang,
                    ],
                ];
            }
            $this->upsertWithRetry($vector, $collection, $points, $document->id, $document->source_id);
            CrawlDebugLog::write('IndexDocumentJob upserted vector points.', [
                'document_id' => $document->id,
                'source_id' => $document->source_id,
                'points_count' => count($points),
                'collection' => $collection,
            ]);
        }

        CrawlDebugLog::write('IndexDocumentJob completed document.', [
            'document_id' => $document->id,
            'source_id' => $document->source_id,
            'chunks_count' => Chunk::query()->withoutWorkspaceScope()
                ->where('document_id', $document->id)
                ->count(),
        ]);

        $this->markSourceIndexed($document);
    }

    public function failed(\Throwable $e): void
    {
        $document = Document::query()->withoutWorkspaceScope()->find($this->documentId);
        if ($document === null) {
            return;
        }

        $this->cleanupDocumentChunks($document);
        CrawlDebugLog::write('IndexDocumentJob failed.', [
            'document_id' => $document->id,
            'source_id' => $document->source_id,
            'agent_id' => $document->agent_id,
            'error' => $e->getMessage(),
        ]);
        $this->markSourceFailed($document, 'Index failed: '.Str::limit($e->getMessage(), 480));
    }

    /**
     * Embed with a built-in failover. When the configured primary client
     * (typically Cloudflare Workers AI in production) raises, we try
     * the resolved fallback (`embedding.fallback` binding — usually
     * OpenAI when OPENAI_API_KEY is set). This is the most common
     * "indexing didn't finish" failure mode: a transient CF outage
     * shouldn't strand customer documents at 0 chunks.
     *
     * @param  array<int, string>  $texts
     * @return array<int, array<int, float>>
     */
    private function embedWithFallback(OpenAiClient $primary, array $texts): array
    {
        try {
            return $primary->embed($texts);
        } catch (\Throwable $primaryError) {
            // Skip the fallback path if the primary IS the fallback (would
            // just hit the same provider twice with the same failure).
            if ($primary instanceof OpenAiHttpClient) {
                throw $primaryError;
            }

            $fallback = $this->resolveFallback();
            if ($fallback === null) {
                throw $primaryError;
            }

            Log::warning('Primary embed failed; falling back.', [
                'primary' => $primary::class,
                'fallback' => $fallback::class,
                'error' => $primaryError->getMessage(),
                'batch_size' => count($texts),
            ]);

            return $fallback->embed($texts);
        }
    }

    /**
     * @param  array<int, array{id: string, vector: array<int, float>, payload: array<string, mixed>}>  $points
     */
    private function upsertWithRetry(QdrantClient $vector, string $collection, array $points, string $documentId, string $sourceId): void
    {
        $attempts = 0;

        beginning:
        $attempts++;

        try {
            $vector->upsertPoints($collection, $points);
        } catch (\Throwable $e) {
            if ($attempts >= 3) {
                throw $e;
            }

            CrawlDebugLog::write('IndexDocumentJob vector upsert retrying.', [
                'document_id' => $documentId,
                'source_id' => $sourceId,
                'attempt' => $attempts,
                'points_count' => count($points),
                'error' => $e->getMessage(),
            ]);

            sleep($attempts);
            goto beginning;
        }
    }

    /**
     * Container-resolved fallback embedding client. Returns null when
     * no fallback is configured (production has only CF, etc.) so the
     * caller can rethrow the primary error cleanly.
     *
     * Tests bind a fake under 'embedding.fallback' to verify the
     * failover path without hitting a real provider.
     */
    private function resolveFallback(): ?OpenAiClient
    {
        if (! app()->bound('embedding.fallback')) {
            return null;
        }
        $resolved = app('embedding.fallback');

        return $resolved instanceof OpenAiClient ? $resolved : null;
    }

    private function markSourceIndexed(Document $document): void
    {
        $source = Source::query()->withoutWorkspaceScope()->find($document->source_id);
        if ($source === null) {
            return;
        }

        $source->forceFill([
            'status' => 'indexed',
            'error' => null,
            'last_synced_at' => now(),
        ])->save();
    }

    private function markSourceFailed(Document $document, string $reason): void
    {
        $source = Source::query()->withoutWorkspaceScope()->find($document->source_id);
        if ($source === null || $source->status === 'indexed') {
            return;
        }

        $hasSearchableChunks = Chunk::query()->withoutWorkspaceScope()
            ->whereIn('document_id', Document::query()->withoutWorkspaceScope()
                ->select('id')
                ->where('source_id', $source->id))
            ->exists();

        if ($hasSearchableChunks) {
            $this->markSourceIndexed($document);

            return;
        }

        $source->forceFill([
            'status' => 'failed',
            'error' => $reason,
        ])->save();
    }

    private function cleanupDocumentChunks(Document $document): void
    {
        try {
            app(QdrantClient::class)->deleteByFilter(
                (string) config('services.vector_collection', 'orbychat-chunks'),
                ['document_id' => $document->id],
            );
        } catch (\Throwable $e) {
            Log::warning('Index cleanup vector purge failed.', [
                'document_id' => $document->id,
                'error' => $e->getMessage(),
            ]);
        }

        Chunk::query()->withoutWorkspaceScope()
            ->where('document_id', $document->id)
            ->delete();
    }
}
