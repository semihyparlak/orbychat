<?php

namespace App\Http\Controllers\Admin;

use App\Jobs\Crawl\CrawlSourceJob;
use App\Jobs\Crawl\IndexTextSourceJob;
use App\Jobs\Crawl\IngestGoogleDocJob;
use App\Jobs\Crawl\IngestNotionPageJob;
use App\Models\Agent;
use App\Models\Document;
use App\Models\IntegrationConnection;
use App\Models\Source;
use App\Services\Crawl\SiteDiscoverer;
use App\Services\Vector\Contracts\QdrantClient;
use App\Support\CrawlDebugLog;
use App\Support\Pagination;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SourceController
{
    public function index(Request $request, Agent $agent): Response
    {
        $request->user()->can('view', $agent) || abort(403);

        $q = trim((string) $request->query('q', ''));

        $sourcesQuery = $agent->sources()->latest();

        if ($q !== '') {
            // Sources don't have a `title` column themselves — searchable
            // text lives in `config` (JSON) and on related Documents. We
            // match on a few common config fields plus the type, and on
            // any indexed Document URL/title for the source.
            $like = '%'.str_replace(['%', '_'], ['\%', '\_'], $q).'%';
            $sourcesQuery->where(function ($w) use ($like) {
                $w->where('type', 'like', $like)
                    ->orWhere('status', 'like', $like)
                    ->orWhere('config', 'like', $like)
                    ->orWhereIn('id', function ($sub) use ($like) {
                        $sub->select('source_id')
                            ->from('documents')
                            ->where(function ($d) use ($like) {
                                $d->where('url', 'like', $like)
                                    ->orWhere('title', 'like', $like);
                            });
                    });
            });
        }

        $paginator = $sourcesQuery->paginate(25)->withQueryString();
        $sourceIds = collect($paginator->items())->pluck('id');

        // Pre-load the latest Document per source so we can show real titles
        // (Notion page name, Google Doc name) instead of the raw scheme URL
        // we store internally.
        $titlesBySource = Document::query()->withoutWorkspaceScope()
            ->whereIn('source_id', $sourceIds)
            ->select(['source_id', 'title', 'url'])
            ->orderByDesc('fetched_at')
            ->get()
            ->groupBy('source_id')
            ->map(fn ($group) => $group->first());

        $sources = collect($paginator->items())->map(fn (Source $s) => [
            'id' => $s->id,
            'type' => $s->type,
            'status' => $s->status,
            'config' => $s->config,
            'last_synced_at' => $s->last_synced_at?->toIso8601String(),
            'error' => $s->error,
            'created_at' => $s->created_at?->toIso8601String(),
            'progress' => $this->progressFor($s),
            'display' => $this->displayFor($s, $titlesBySource->get($s->id)),
        ]);

        return Inertia::render('app/agents/sources', [
            'agent' => $agent->only('id', 'name'),
            'sources' => $sources,
            'pagination' => Pagination::meta($paginator),
            'filters' => ['q' => $q],
        ]);
    }

    /**
     * Picks a human-friendly label + sublabel for the Sources list. For URL
     * sources the URL is already friendly. For Notion / Google Doc sources
     * we surface the indexed Document's title plus the source kind.
     *
     * @return array{title: string, subtitle: string, link: ?string}
     */
    private function displayFor(Source $source, ?Document $latestDoc): array
    {
        $config = (array) ($source->config ?? []);

        if ($source->type === 'notion') {
            return [
                'title' => $latestDoc?->title ?: 'Notion page',
                'subtitle' => 'Notion · '.($config['notion_page_id'] ?? ''),
                'link' => null,
            ];
        }

        if ($source->type === 'google_doc') {
            $fileId = $config['google_file_id'] ?? '';

            return [
                'title' => $latestDoc?->title ?: 'Google Doc',
                'subtitle' => 'Google Doc',
                'link' => $fileId !== '' ? "https://docs.google.com/document/d/{$fileId}/edit" : null,
            ];
        }

        if ($source->type === 'text') {
            $sourceUrl = $config['source_url'] ?? null;

            return [
                'title' => $latestDoc?->title ?: ($config['title'] ?? 'Pasted content'),
                'subtitle' => $sourceUrl ? 'Pasted from '.parse_url($sourceUrl, PHP_URL_HOST) : 'Pasted text',
                'link' => is_string($sourceUrl) ? $sourceUrl : null,
            ];
        }

        if ($source->type === 'auto') {
            // The "Auto-indexed from visitors" bucket — one row per agent
            // collecting every page a visitor landed on that we hadn't
            // crawled yet. No single canonical URL, so we link to the
            // most recently captured one.
            return [
                'title' => 'Auto-indexed from visitors',
                'subtitle' => 'Pages added automatically as visitors browse',
                'link' => $latestDoc?->url,
            ];
        }

        $url = $config['url'] ?? '';

        return [
            'title' => $url !== '' ? $url : '(no url)',
            'subtitle' => $source->type,
            'link' => $url !== '' ? $url : null,
        ];
    }

    public function store(Request $request, Agent $agent): RedirectResponse
    {
        $request->user()->can('update', $agent) || abort(403);

        $data = $request->validate([
            'type' => ['required', 'in:url,sitemap,feed'],
            'url' => ['required', 'url', 'max:2000'],
        ]);

        if ($data['type'] === 'sitemap'
            && ! preg_match('/\.xml($|\?)/i', $data['url'])
            && ! str_contains(strtolower($data['url']), 'sitemap')) {
            return back()->withErrors([
                'url' => 'Sitemap URL should end in .xml or contain "sitemap" in the path. For a single page, choose "Single URL" instead.',
            ])->withInput();
        }

        $source = Source::create([
            'agent_id' => $agent->id,
            'type' => $data['type'],
            'status' => 'pending',
            'config' => ['url' => $data['url']],
        ]);

        // Automatically whitelist the origin so the widget works on this site.
        $parsed = parse_url($data['url']);
        if (isset($parsed['scheme'], $parsed['host'])) {
            $origin = $parsed['scheme'].'://'.$parsed['host'];
            if (isset($parsed['port'])) {
                $origin .= ':'.$parsed['port'];
            }

            $origins = $agent->allowed_origins ?? [];
            if (! in_array($origin, $origins)) {
                $origins[] = $origin;
                $agent->update(['allowed_origins' => $origins]);
            }
        }

        CrawlSourceJob::dispatch($source->id)->onQueue('crawl');

        return back()->with('success', __('Source added; crawl started.'));
    }

    /**
     * Plain-text paste source — the bulletproof escape hatch when crawling
     * a URL doesn't work (anti-bot challenges, JS-only SPAs, paywalls).
     * The user just dumps the content into a textarea; we skip the crawler
     * entirely and feed it straight into the index pipeline.
     */
    public function storeText(Request $request, Agent $agent): RedirectResponse
    {
        $request->user()->can('update', $agent) || abort(403);

        $data = $request->validate([
            'title' => ['nullable', 'string', 'max:250'],
            'body' => ['required', 'string', 'min:50', 'max:200000'],
            'source_url' => ['nullable', 'url', 'max:2000'],
        ]);

        $title = $data['title'] ?? mb_substr(trim((string) preg_replace('/\s+/u', ' ', $data['body'])), 0, 80);

        $source = Source::create([
            'agent_id' => $agent->id,
            'type' => 'text',
            'status' => 'pending',
            'config' => [
                'title' => $title,
                'source_url' => $data['source_url'] ?? null,
            ],
        ]);

        IndexTextSourceJob::dispatch($source->id, $title, $data['body'], $data['source_url'] ?? null)
            ->onQueue('index');

        return back()->with('success', __('Content added — indexing now.'));
    }

    /**
     * Add a Notion page as a source. Accepts either a notion.so URL
     * (we extract the trailing 32-char id) or a raw page ID.
     *
     * The workspace must already have an active 'notion' IntegrationConnection
     * for this to be useful — otherwise the ingest job will fail with a
     * helpful "Notion is not connected" error and the source flips to
     * status='failed'.
     */
    public function storeNotion(Request $request, Agent $agent): RedirectResponse
    {
        $request->user()->can('update', $agent) || abort(403);

        $data = $request->validate([
            'page' => ['required', 'string', 'max:500'],
        ]);

        $pageId = $this->normalizeNotionPageId($data['page']);
        if ($pageId === null) {
            return back()->withErrors(['page' => __('Could not find a Notion page id in that URL.')])->withInput();
        }

        $hasConnection = IntegrationConnection::query()
            ->where('workspace_id', $agent->workspace_id)
            ->where('kind', 'notion')
            ->where('status', 'active')
            ->exists();

        if (! $hasConnection) {
            return back()->withErrors([
                'page' => __('Notion is not connected for this workspace. Connect it in Integrations first.'),
            ])->withInput();
        }

        $source = Source::create([
            'agent_id' => $agent->id,
            'type' => 'notion',
            'status' => 'pending',
            'config' => ['notion_page_id' => $pageId],
        ]);
        IngestNotionPageJob::dispatch($source->id)->onQueue('crawl');

        return back()->with('success', __('Notion page queued for indexing.'));
    }

    /**
     * Add a Google Doc as a source. Accepts a docs.google.com/document/d/{id}
     * URL or a raw file id.
     */
    public function storeGoogleDoc(Request $request, Agent $agent): RedirectResponse
    {
        $request->user()->can('update', $agent) || abort(403);

        $data = $request->validate([
            'doc' => ['required', 'string', 'max:500'],
        ]);

        $fileId = $this->normalizeGoogleFileId($data['doc']);
        if ($fileId === null) {
            return back()->withErrors(['doc' => __('Could not find a Google Doc id in that URL.')])->withInput();
        }

        $hasConnection = IntegrationConnection::query()
            ->where('workspace_id', $agent->workspace_id)
            ->where('kind', 'google')
            ->where('status', 'active')
            ->exists();

        if (! $hasConnection) {
            return back()->withErrors([
                'doc' => __('Google is not connected for this workspace. Connect it in Integrations first.'),
            ])->withInput();
        }

        $source = Source::create([
            'agent_id' => $agent->id,
            'type' => 'google_doc',
            'status' => 'pending',
            'config' => ['google_file_id' => $fileId],
        ]);
        IngestGoogleDocJob::dispatch($source->id)->onQueue('crawl');

        return back()->with('success', __('Google Doc queued for indexing.'));
    }

    private function normalizeGoogleFileId(string $input): ?string
    {
        // URL form: https://docs.google.com/document/d/{file_id}/edit
        if (preg_match('#/document/d/([a-zA-Z0-9_-]+)#', $input, $m) === 1) {
            return $m[1];
        }
        // Raw id (Google file IDs are typically 25-44 base64url-safe chars).
        if (preg_match('/^[a-zA-Z0-9_-]{25,}$/', trim($input)) === 1) {
            return trim($input);
        }

        return null;
    }

    private function normalizeNotionPageId(string $input): ?string
    {
        // Accept raw 32-char id, or the URL form ".../page-name-{32-char-id}".
        $hex = preg_replace('/[^a-f0-9]/i', '', $input) ?? '';
        if (strlen($hex) >= 32) {
            $tail = substr($hex, -32);

            // Format with hyphens: 8-4-4-4-12
            return substr($tail, 0, 8).'-'.substr($tail, 8, 4).'-'.substr($tail, 12, 4).'-'.substr($tail, 16, 4).'-'.substr($tail, 20, 12);
        }

        return null;
    }

    public function destroy(Request $request, Source $source): RedirectResponse
    {
        $request->user()->can('delete', $source) || abort(403);

        $source->delete();

        return back()->with('success', __('Source removed.'));
    }

    /**
     * Auto-discover crawlable URLs for a domain — robots.txt sitemaps,
     * /sitemap.xml, plus probed common paths. Used by the onboarding flow
     * so the user doesn't have to paste URLs one-by-one.
     */
    public function discover(Request $request, Agent $agent, SiteDiscoverer $discoverer): JsonResponse
    {
        $request->user()->can('update', $agent) || abort(403);

        $data = $request->validate([
            'url' => ['required', 'url', 'max:2000'],
            'max' => ['nullable', 'integer', 'min:1', 'max:200'],
        ]);

        $result = $discoverer->discover($data['url'], (int) ($data['max'] ?? 50));

        // Automatically add the origin of the discovered URL to allowed_origins
        // so the user doesn't hit CORS issues when embedding the widget later.
        $parsed = parse_url($data['url']);
        if (isset($parsed['scheme'], $parsed['host'])) {
            $origin = $parsed['scheme'].'://'.$parsed['host'];
            if (isset($parsed['port'])) {
                $origin .= ':'.$parsed['port'];
            }

            $origins = $agent->allowed_origins ?? [];
            if (! in_array($origin, $origins)) {
                $origins[] = $origin;
                $agent->update(['allowed_origins' => $origins]);
            }
        }

        return response()->json([
            'data' => [
                'root' => $result['root'],
                'sitemap_urls' => $result['sitemap_urls'],
                'probed_urls' => $result['probed_urls'],
                'total' => count($result['sitemap_urls']) + count($result['probed_urls']),
            ],
        ]);
    }

    /**
     * Bulk-add the URLs the user picked from /discover. Each URL becomes its
     * own type=url Source so the existing CrawlPageJob → IndexDocumentJob
     * pipeline takes over.
     */
    public function bulkStore(Request $request, Agent $agent): RedirectResponse
    {
        $request->user()->can('update', $agent) || abort(403);

        $data = $request->validate([
            'urls' => ['required', 'array', 'min:1', 'max:200'],
            'urls.*' => ['required', 'url', 'max:2000'],
        ]);

        $addedOrigins = [];
        foreach ($data['urls'] as $url) {
            $source = Source::create([
                'agent_id' => $agent->id,
                'type' => 'url',
                'status' => 'pending',
                'config' => ['url' => $url],
            ]);
            CrawlSourceJob::dispatch($source->id)->onQueue('crawl');

            // Collect origins for bulk whitelisting
            $parsed = parse_url($url);
            if (isset($parsed['scheme'], $parsed['host'])) {
                $origin = $parsed['scheme'].'://'.$parsed['host'];
                if (isset($parsed['port'])) {
                    $origin .= ':'.$parsed['port'];
                }
                $addedOrigins[] = $origin;
            }
        }

        if (! empty($addedOrigins)) {
            $origins = $agent->allowed_origins ?? [];
            $newOrigins = array_unique(array_merge($origins, $addedOrigins));
            if (count($newOrigins) !== count($origins)) {
                $agent->update(['allowed_origins' => array_values($newOrigins)]);
            }
        }

        return back()->with('success', __(':count source(s) queued.', ['count' => count($data['urls'])]));
    }

    public function reindex(Request $request, Source $source): RedirectResponse
    {
        $request->user()->can('update', $source) || abort(403);

        $this->purgeDocumentsForSource($source);
        $source->forceFill(['status' => 'pending', 'error' => null])->save();
        CrawlSourceJob::dispatch($source->id)->onQueue('crawl');

        return back()->with('success', __('Reindex queued.'));
    }

    /**
     * Returns a sample of what was actually extracted for this source so the
     * user can sanity-check whether the AI is seeing real content. Used by
     * the "Preview" button on the Sources page.
     */
    public function preview(Request $request, Source $source): JsonResponse
    {
        $request->user()->can('view', $source) || abort(403);

        $documents = Document::query()->withoutWorkspaceScope()
            ->where('source_id', $source->id)
            ->orderByDesc('fetched_at')
            ->limit(5)
            ->get();

        $payload = $documents->map(function (Document $d) {
            $chunks = \DB::table('chunks')
                ->where('document_id', $d->id)
                ->orderBy('ord')
                ->limit(20)
                ->get(['id', 'ord', 'token_count', 'text']);

            return [
                'id' => $d->id,
                'url' => $d->url,
                'title' => $d->title,
                'fetched_at' => $d->fetched_at?->toIso8601String(),
                'chunks_count' => \DB::table('chunks')->where('document_id', $d->id)->count(),
                // First chunk preview kept for back-compat with the legacy UI.
                'first_chunk_preview' => mb_substr((string) ($chunks->first()->text ?? ''), 0, 800),
                'chunks' => $chunks->map(fn ($c) => [
                    'id' => $c->id,
                    'ord' => (int) $c->ord,
                    'tokens' => (int) $c->token_count,
                    'text' => mb_substr((string) $c->text, 0, 1200),
                ]),
            ];
        });

        return response()->json([
            'data' => [
                'source' => [
                    'id' => $source->id,
                    'type' => $source->type,
                    'status' => $source->status,
                    'error' => $source->error,
                ],
                'progress' => $this->progressFor($source),
                'documents' => $payload,
            ],
        ]);
    }

    /**
     * Per-source progress: number of unique URLs that produced documents
     * (= pages successfully indexed). For type=url this is 0 or 1; for
     * type=sitemap it's 0..N where N is the page cap.
     *
     * @return array{pages_indexed: int, pages_total: ?int}
     */
    private function progressFor(Source $source): array
    {
        $indexed = (int) Document::query()->withoutWorkspaceScope()
            ->where('source_id', $source->id)
            ->distinct()
            ->count('url');

        return [
            'pages_indexed' => $indexed,
            'pages_total' => $source->type === 'sitemap'
                ? (int) config('services.crawl.max_pages_per_source', 25)
                : ($source->type === 'url' ? 1 : null),
        ];
    }

    private function purgeDocumentsForSource(Source $source): void
    {
        $documents = Document::query()->withoutWorkspaceScope()
            ->where('source_id', $source->id)
            ->get();

        foreach ($documents as $document) {
            try {
                app(QdrantClient::class)->deleteByFilter(
                    (string) config('services.vector_collection', 'orbychat-chunks'),
                    ['document_id' => $document->id],
                );
            } catch (\Throwable $e) {
                \Log::warning('Source reindex vector purge failed.', [
                    'source_id' => $source->id,
                    'document_id' => $document->id,
                    'error' => $e->getMessage(),
                ]);
            }

            $document->delete();
        }

        CrawlDebugLog::write('Source reindex purged existing documents.', [
            'source_id' => $source->id,
            'agent_id' => $source->agent_id,
            'documents_count' => $documents->count(),
        ]);
    }
}
