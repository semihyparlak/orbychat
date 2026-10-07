<?php

namespace App\Jobs\Crawl;

use App\Models\Document;
use App\Models\Source;
use App\Services\Crawl\Contracts\Crawler;
use App\Services\Crawl\FallbackCrawler;
use App\Services\Crawl\PlainHttpCrawler;
use App\Services\Crawl\ReadabilityExtractor;
use App\Services\Crawl\RobotsTxtParser;
use App\Services\Vector\Contracts\QdrantClient;
use App\Support\CrawlDebugLog;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Str;

class CrawlPageJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 10;
    public int $timeout = 120;

    /**
     * Backoff for sequential retries after a failure (mostly 429 from CF Browser Rendering).
     * Cloudflare's per-account concurrency for Browser Rendering is small, so we wait longer.
     *
     * @return array<int, int>
     */
    public function backoff(): array
    {
        return [10, 30, 60, 120];
    }

    public function __construct(public string $sourceId, public string $url) {}

    public function handle(Crawler $crawler, ReadabilityExtractor $extractor, RobotsTxtParser $robots): void
    {
        $source = Source::query()->withoutWorkspaceScope()->findOrFail($this->sourceId);

        if (! $robots->isAllowed($this->url)) {
            $this->finalize($source, success: false, reason: "Blocked by robots.txt: {$this->url}");

            return;
        }

        $crawlerName = $crawler instanceof FallbackCrawler
            ? $crawler->lastSuccessfulName()
            : class_basename($crawler);

        try {
            $html = $crawler->content($this->url);
            $crawlerName = $crawler instanceof FallbackCrawler
                ? ($crawler->lastSuccessfulName() ?? $crawlerName)
                : class_basename($crawler);
        } catch (\Throwable $e) {
            $message = $e->getMessage();
            CrawlDebugLog::write('CrawlPageJob primary crawler failed.', [
                'source_id' => $source->id,
                'agent_id' => $source->agent_id,
                'url' => $this->url,
                'crawler' => $crawlerName,
                'error' => $message,
            ]);

            try {
                $fallback = new PlainHttpCrawler;
                $html = $fallback->content($this->url);
                $crawlerName = class_basename($fallback);

                CrawlDebugLog::write('CrawlPageJob plain HTTP fallback succeeded.', [
                    'source_id' => $source->id,
                    'agent_id' => $source->agent_id,
                    'url' => $this->url,
                    'primary_crawler' => $crawler instanceof FallbackCrawler
                        ? 'FallbackCrawler'
                        : class_basename($crawler),
                    'html_length' => mb_strlen($html),
                ]);
            } catch (\Throwable $fallbackError) {
                $reason = 'Crawl failed: '.Str::limit($message.'; Plain HTTP fallback failed: '.$fallbackError->getMessage(), 480);
                CrawlDebugLog::write('CrawlPageJob all crawlers failed.', [
                    'source_id' => $source->id,
                    'agent_id' => $source->agent_id,
                    'url' => $this->url,
                    'primary_error' => $message,
                    'fallback_error' => $fallbackError->getMessage(),
                ]);
                $this->finalize($source, success: false, reason: $reason);

                return;
            }
        }

        CrawlDebugLog::write('CrawlPageJob fetched HTML.', [
            'source_id' => $source->id,
            'agent_id' => $source->agent_id,
            'url' => $this->url,
            'crawler' => $crawlerName,
            'html_length' => mb_strlen($html),
            'html_preview' => CrawlDebugLog::preview($html),
            'has_inertia_data_page' => str_contains($html, 'data-page='),
            'has_next_data' => str_contains($html, '__NEXT_DATA__'),
            'has_next_flight' => str_contains($html, '__next_f'),
        ]);

        $extracted = $extractor->extract($html);
        $extracted = $this->rescueThinExtraction($extracted, $html);
        CrawlDebugLog::write('CrawlPageJob extracted text.', [
            'source_id' => $source->id,
            'agent_id' => $source->agent_id,
            'url' => $this->url,
            'title' => $extracted['title'] ?? null,
            'text_length' => mb_strlen((string) ($extracted['text'] ?? '')),
            'text_preview' => CrawlDebugLog::preview((string) ($extracted['text'] ?? '')),
        ]);

        if (mb_strlen($extracted['text']) < 100) {
            // SPA, login wall, or bot-challenge page rendered to empty body.
            CrawlDebugLog::write('CrawlPageJob extracted too little content.', [
                'source_id' => $source->id,
                'agent_id' => $source->agent_id,
                'url' => $this->url,
                'text_length' => mb_strlen($extracted['text']),
                'text_preview' => CrawlDebugLog::preview($extracted['text']),
            ]);
            $this->finalize(
                $source,
                success: false,
                reason: "Page returned too little content (likely a JS-only or bot-protected site): {$this->url}"
            );

            return;
        }

        // Many sites return a 200-OK "page not found" page when a URL is
        // mistyped (Startech, Shopify, etc.). Without this check we'd index
        // the 404 boilerplate as if it were real content.
        $title = (string) ($extracted['title'] ?? '');
        $text = $extracted['text'];

        if ($this->looksLike404($title, $text)) {
            $this->finalize(
                $source,
                success: false,
                reason: "Page returned a 'not found' response (check the URL is correct): {$this->url}"
            );

            return;
        }

        $blockerReason = $this->detectBlocker($title, $text);
        if ($blockerReason !== null) {
            $this->finalize(
                $source,
                success: false,
                reason: "{$blockerReason}: {$this->url}"
            );

            return;
        }
        $hash = hash('sha256', $text);

        $existing = Document::query()->withoutWorkspaceScope()
            ->where('agent_id', $source->agent_id)
            ->where('content_hash', $hash)
            ->first();

        if ($existing !== null) {
            // If the existing document was "auto-indexed" (visitor visit) but 
            // the user is now manually indexing it, take ownership of the 
            // document so it shows up under the manual source in the UI.
            $existingSource = $existing->source;
            if ($existing->source_id !== $source->id
                && $existingSource
                && ($existingSource->type === 'auto' || $source->type !== 'auto')) {
                $existing->update(['source_id' => $source->id]);
            }

            // If the existing document has no chunks (failed embedding earlier),
            // delete it and continue so we can try to index it properly this time.
            $hasChunks = \DB::table('chunks')->where('document_id', $existing->id)->exists();
            if (! $hasChunks) {
                $this->purgeVectorsForDocument($existing);
                $existing->delete();
            } else {
                $this->purgeStaleDocumentsForUrl($source, $existing->id);
                // Same content already successfully indexed.
                // Treat as success so the source isn't left in 'crawling'.
                $this->finalize($source, success: true, reason: null);

                return;
            }
        }

        Document::create([
            'source_id' => $source->id,
            'agent_id' => $source->agent_id,
            'url' => $this->url,
            'title' => $extracted['title'],
            'content_hash' => $hash,
            'text_path' => null,
            'lang' => null,
            // Tag which crawler actually pulled the HTML — useful when a
            // page comes back blank and we need to know whether it was
            // CF Browser Rendering, Browserless, or the plain HTTP fallback.
            'crawler' => $crawlerName,
            'fetched_at' => now(),
        ]);

        $document = Document::query()->withoutWorkspaceScope()
            ->where('source_id', $source->id)
            ->where('content_hash', $hash)
            ->firstOrFail();

        CrawlDebugLog::write('CrawlPageJob dispatching index job.', [
            'source_id' => $source->id,
            'document_id' => $document->id,
            'text_length' => mb_strlen($extracted['text']),
        ]);

        if ($source->type === 'url') {
            IndexDocumentJob::dispatchSync($document->id, $extracted['text']);

            return;
        }

        IndexDocumentJob::dispatch($document->id, $extracted['text'])->onQueue('index');

        $source->forceFill(['status' => 'crawling', 'error' => null])->save();
    }

    /**
     * Detect non-content pages (login walls, paywalls, JS-required shells,
     * cookie consent gates) that come through as 200-OK with a few hundred
     * chars of "please log in" copy. Returns a human-readable reason string
     * if a blocker is detected, or null if the page looks like real content.
     *
     * Each pattern is scoped to the title or first 600 chars of body — far
     * enough to catch pre-content gates, short enough that long articles
     * mentioning "login" in passing aren't false-positives.
     */
    private function detectBlocker(string $title, string $text): ?string
    {
        $head = mb_substr($text, 0, 600);
        $combined = $title.' '.$head;

        $checks = [
            'Page is behind a login wall' => '/(?:please (?:sign|log) in|sign in to (?:continue|view|read|access)|log in to (?:continue|view|read|access)|login required|you (?:must|need to) (?:be )?(?:logged|signed) in|members? only|access denied)/i',
            'Page is behind a paywall' => '/(?:subscribe to (?:read|continue|view|access)|premium (?:content|article|subscribers? only)|this (?:article|content) is for subscribers|become a (?:member|subscriber) to|paywall)/i',
            'Page requires JavaScript (the crawler couldn\'t render it)' => '/(?:javascript is (?:required|disabled|not enabled)|please enable javascript|this site requires javascript|enable javascript (?:in your browser )?to (?:continue|use|view)|you need to enable javascript)/i',
            'Page is a cookie-consent gate' => '/(?:we use cookies|this (?:site|website) uses cookies|cookie (?:notice|policy|consent)|accept cookies to continue)/i',
            'Page is a bot-challenge / verification gate' => '/(?:just a moment|checking your browser|verifying you are human|please complete the security check|cloudflare|access denied|attention required)/i',
        ];

        foreach ($checks as $reason => $pattern) {
            if (preg_match($pattern, $combined) === 1) {
                return $reason;
            }
        }

        return null;
    }

    /**
     * Detect 200-OK "page not found" pages that crawl looks like real HTML
     * but is actually a soft-404. Heuristic — only fires when the title or
     * first 500 chars of the body match common 404 phrasing.
     */
    private function looksLike404(string $title, string $text): bool
    {
        $needle = '/(?:^|\b)(?:404|page (?:not|cannot be) found|page (?:doesn\'?t|does not) exist|page unavailable|page no longer (?:exists|available)|requested page (?:was )?not found|the page you (?:requested|are looking for) (?:cannot be found|does(?:n\'?t| not) exist))/i';

        if ($title !== '' && preg_match($needle, $title) === 1) {
            return true;
        }

        if (preg_match($needle, mb_substr($text, 0, 500)) === 1) {
            return true;
        }

        return false;
    }

    public function failed(\Throwable $e): void
    {
        $source = Source::query()->withoutWorkspaceScope()->find($this->sourceId);
        if ($source === null) {
            return;
        }

        $this->finalize(
            $source,
            success: false,
            reason: 'Crawl failed: '.Str::limit($e->getMessage(), 480)
        );
    }

    /**
     * Drive the source out of the 'crawling' state once a page completes.
     *
     * Convergence rules across concurrent page jobs (e.g. sitemap fan-out):
     *  - On failure for this URL, drop any prior doc for the same URL on
     *    this source (and its vectors) — yesterday's content can become a
     *    404 today, and we must not keep serving stale chunks.
     *  - If any document still exists for the source after that → 'indexed'
     *    wins (sticky), so a sibling sitemap page that succeeded earlier
     *    isn't reverted by a sibling that failed.
     *  - Else, record the most recent failure reason as 'failed'.
     */
    private function finalize(Source $source, bool $success, ?string $reason): void
    {
        if (! $success) {
            $stale = Document::query()->withoutWorkspaceScope()
                ->where('source_id', $source->id)
                ->where('url', $this->url)
                ->get();
            foreach ($stale as $doc) {
                $this->purgeVectorsForDocument($doc);
                $doc->delete(); // chunks cascade via FK
            }
        }

        $source = $source->fresh();
        if ($source === null || $source->status === 'indexed') {
            return;
        }

        $hasSearchableDocs = Document::query()->withoutWorkspaceScope()
            ->where('documents.source_id', $source->id)
            ->whereExists(function ($query) {
                $query->selectRaw('1')
                    ->from('chunks')
                    ->whereColumn('chunks.document_id', 'documents.id');
            })
            ->exists();

        if ($success || $hasSearchableDocs) {
            $source->forceFill([
                'status' => 'indexed',
                'error' => null,
                'last_synced_at' => now(),
            ])->save();

            return;
        }

        $hasPendingDocs = Document::query()->withoutWorkspaceScope()
            ->where('source_id', $source->id)
            ->exists();

        if ($hasPendingDocs) {
            $source->forceFill(['status' => 'crawling'])->save();

            return;
        }

        $source->forceFill([
            'status' => 'failed',
            'error' => $reason ?? 'Crawl produced no content.',
        ])->save();
    }

    private function purgeStaleDocumentsForUrl(Source $source, string $keepDocumentId): void
    {
        $stale = Document::query()->withoutWorkspaceScope()
            ->where('source_id', $source->id)
            ->where('url', $this->url)
            ->where('id', '!=', $keepDocumentId)
            ->get();

        foreach ($stale as $doc) {
            $this->purgeVectorsForDocument($doc);
            $doc->delete();
        }
    }

    /**
     * Some JS/app-shell pages expose enough useful page copy in SEO tags even
     * when body extraction is thin. Use that as a last crawlable fallback
     * instead of failing with an empty knowledge document.
     *
     * @param  array{title: ?string, text: string}  $extracted
     * @return array{title: ?string, text: string}
     */
    private function rescueThinExtraction(array $extracted, string $html): array
    {
        if (mb_strlen((string) ($extracted['text'] ?? '')) >= 100) {
            return $extracted;
        }

        $pieces = [];
        if (is_string($extracted['title'] ?? null) && $extracted['title'] !== '') {
            $pieces[] = $extracted['title'];
        }

        foreach ($this->metaContents($html) as $content) {
            $pieces[] = $content;
        }

        $text = $this->mergeText($pieces);
        if (mb_strlen($text) > mb_strlen((string) ($extracted['text'] ?? ''))) {
            CrawlDebugLog::write('CrawlPageJob rescued thin extraction from metadata.', [
                'url' => $this->url,
                'rescued_text_length' => mb_strlen($text),
                'rescued_text_preview' => CrawlDebugLog::preview($text),
            ]);

            $extracted['text'] = $text;
        }

        return $extracted;
    }

    /**
     * @return array<int, string>
     */
    private function metaContents(string $html): array
    {
        $out = [];
        if (preg_match_all('/<meta\b[^>]*(?:name|property)\s*=\s*["\'](?:description|og:description|twitter:description|og:title|twitter:title)["\'][^>]*>/is', $html, $matches)) {
            foreach ($matches[0] as $tag) {
                if (preg_match('/\bcontent\s*=\s*(["\'])(.*?)\1/is', $tag, $m)) {
                    $content = html_entity_decode(trim(strip_tags($m[2])), ENT_QUOTES | ENT_HTML5);
                    if ($content !== '') {
                        $out[] = $content;
                    }
                }
            }
        }

        return $out;
    }

    /**
     * @param  array<int, string>  $pieces
     */
    private function mergeText(array $pieces): string
    {
        $seen = [];
        $out = [];

        foreach ($pieces as $piece) {
            $piece = preg_replace('/\s+/u', ' ', trim($piece)) ?? '';
            if ($piece === '') {
                continue;
            }

            $key = mb_strtolower($piece);
            if (isset($seen[$key])) {
                continue;
            }

            $seen[$key] = true;
            $out[] = $piece;
        }

        return implode(' ', $out);
    }

    private function purgeVectorsForDocument(Document $doc): void
    {
        try {
            $vector = app(QdrantClient::class);
            $collection = (string) config('services.vector_collection', 'orbychat-chunks');
            $vector->deleteByFilter($collection, ['document_id' => $doc->id]);
        } catch (\Throwable $e) {
            // Best-effort: don't fail the job (and burn retries) on vector cleanup.
            \Log::warning('purgeVectorsForDocument failed', [
                'document_id' => $doc->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
