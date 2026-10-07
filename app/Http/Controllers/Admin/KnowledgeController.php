<?php

namespace App\Http\Controllers\Admin;

use App\Jobs\Crawl\CrawlPageJob;
use App\Models\Agent;
use App\Models\Document;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Customer-facing "what does the AI actually know?" view. Shows every
 * document the agent has indexed, grouped by source, with a sample of
 * the extracted text — so the owner can confirm the crawl pulled real
 * content (not a login wall, not a JS-only shell, etc.) before going
 * live.
 *
 * Distinct from the Sources page: that one is for managing inputs
 * (add/remove/reindex). Knowledge is for inspecting outputs.
 */
class KnowledgeController
{
    public function index(Request $request, Agent $agent): Response
    {
        $request->user()->can('view', $agent) || abort(403);

        $q = trim((string) $request->query('q', ''));

        // Aggregate stats across the whole agent's index.
        $totalDocs = (int) Document::query()
            ->withoutWorkspaceScope()
            ->where('agent_id', $agent->id)
            ->count();

        $totalChunks = (int) DB::table('chunks')
            ->where('agent_id', $agent->id)
            ->count();

        $totalChars = (int) DB::table('chunks')
            ->where('agent_id', $agent->id)
            ->selectRaw('COALESCE(SUM(LENGTH(text)), 0) as t')
            ->value('t');

        // The list itself — most recently fetched first, optionally filtered
        // by URL or title substring. Capped at 50 per page; chunks per
        // document are loaded separately so the JSON stays small.
        $docsQuery = Document::query()
            ->withoutWorkspaceScope()
            ->where('agent_id', $agent->id)
            ->with('source:id,type,config')
            ->orderByDesc('fetched_at');

        if ($q !== '') {
            $like = '%'.str_replace(['%', '_'], ['\%', '\_'], $q).'%';
            $docsQuery->where(fn ($qq) => $qq
                ->where('url', 'like', $like)
                ->orWhere('title', 'like', $like));
        }

        $documents = $docsQuery
            ->paginate(50)
            ->through(function (Document $d) {
                $chunkSample = DB::table('chunks')
                    ->where('document_id', $d->id)
                    ->orderBy('ord')
                    ->limit(20)
                    ->get(['id', 'ord', 'token_count', 'text']);

                $totalChunks = (int) DB::table('chunks')
                    ->where('document_id', $d->id)
                    ->count();

                $totalChars = $chunkSample
                    ->sum(fn ($c) => mb_strlen((string) $c->text));

                return [
                    'id' => $d->id,
                    'url' => $d->url,
                    'title' => $d->title,
                    'fetched_at' => $d->fetched_at?->toIso8601String(),
                    'source_type' => $d->source?->type,
                    'source_label' => $this->sourceLabel($d),
                    'crawler' => $this->crawlerLabel($d->crawler),
                    'chunks_count' => $totalChunks,
                    'preview' => mb_substr((string) ($chunkSample->first()->text ?? ''), 0, 600),
                    'chunks' => $chunkSample->map(fn ($c) => [
                        'id' => $c->id,
                        'ord' => (int) $c->ord,
                        'tokens' => (int) $c->token_count,
                        'text' => mb_substr((string) $c->text, 0, 1500),
                        'chars' => mb_strlen((string) $c->text),
                    ]),
                    'sample_chars' => $totalChars,
                ];
            });

        return Inertia::render('app/agents/knowledge', [
            'agent' => ['id' => $agent->id, 'name' => $agent->name],
            'totals' => [
                'documents' => $totalDocs,
                'chunks' => $totalChunks,
                'characters' => $totalChars,
            ],
            'documents' => $documents,
            'q' => $q,
        ]);
    }

    /**
     * Friendly label for where this document came from. Mirrors the
     * Sources page's display logic — if it's an auto-indexed visitor
     * page, say so explicitly so the owner doesn't think they added it.
     */
    /**
     * Re-run the crawl + index pipeline for a single document. Used
     * when a document was crawled (Document row exists) but indexing
     * failed and produced 0 chunks — the visible "0 chunks" state on
     * the Knowledge page invites the owner to retry without rerunning
     * every URL on the source.
     */
    public function reindex(Request $request, Document $document): RedirectResponse
    {
        $request->user()->can('view', $document->agent) || abort(403);

        if ($document->source_id === null || $document->url === null) {
            return back()->with('error', 'This document has no source URL to re-crawl.');
        }

        CrawlPageJob::dispatch($document->source_id, $document->url)->onQueue('crawl');

        return back()->with('success', 'Reindex queued — refresh in a moment.');
    }

    /**
     * Friendly label for which crawler engine pulled this HTML. Returns
     * null for non-HTML sources (text paste, Notion, Google Doc, uploads),
     * which never went through a crawler.
     */
    private function crawlerLabel(?string $engine): ?string
    {
        if ($engine === null || $engine === '') {
            return null;
        }

        return match ($engine) {
            'CloudflareBrowserClient' => 'Cloudflare Browser',
            'BrowserlessClient' => 'Browserless',
            'PlainHttpCrawler' => 'Plain HTTP',
            default => $engine,
        };
    }

    private function sourceLabel(Document $doc): string
    {
        $type = $doc->source?->type;

        return match ($type) {
            'url' => 'URL',
            'sitemap' => 'Sitemap',
            'feed' => 'Feed',
            'notion' => 'Notion',
            'google_doc' => 'Google Doc',
            'text' => 'Pasted text',
            'auto' => 'Auto-indexed (visitor visit)',
            'upload' => 'Uploaded file',
            default => $type ?: 'Source',
        };
    }
}
