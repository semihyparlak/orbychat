<?php

namespace App\Jobs\Crawl;

use App\Models\Source;
use App\Services\Crawl\SitemapDiscoverer;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Str;

class CrawlSourceJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 1;

    public function __construct(public string $sourceId) {}

    public function handle(SitemapDiscoverer $sitemap): void
    {
        $source = Source::query()->withoutWorkspaceScope()->findOrFail($this->sourceId);
        $source->forceFill(['status' => 'crawling'])->save();

        $url = $source->config['url'] ?? null;
        if (! is_string($url)) {
            $source->forceFill(['status' => 'failed', 'error' => 'No URL configured'])->save();

            return;
        }

        $maxPages = (int) config('services.crawl.max_pages_per_source', 50);

        // Only run sitemap discovery when the user explicitly chose "sitemap".
        // For type=url, crawl exactly the URL the user provided — never expand.
        // (Some sites, e.g. startech.com.bd, return the host-root sitemap.xml
        // for any path-prefixed sitemap.xml URL, which would silently fan out
        // into pages the user never asked for.)
        if ($source->type === 'sitemap') {
            $urls = $sitemap->discover($url, $maxPages);
            if ($urls === []) {
                $urls = [$url];
            }
        } else {
            $urls = [$url];
        }

        // Stagger dispatches with a small per-page delay so we don't burst
        // Cloudflare Browser Rendering and trip its concurrency limits.
        $i = 0;
        foreach ($urls as $u) {
            CrawlPageJob::dispatch($source->id, $u)
                ->onQueue('crawl')
                ->delay(now()->addSeconds($i * 2));
            $i++;
        }
    }

    public function failed(\Throwable $e): void
    {
        $source = Source::query()->withoutWorkspaceScope()->find($this->sourceId);
        if ($source === null || $source->status === 'indexed') {
            return;
        }
        $source->forceFill([
            'status' => 'failed',
            'error' => 'Crawl setup failed: '.Str::limit($e->getMessage(), 480),
        ])->save();
    }
}
