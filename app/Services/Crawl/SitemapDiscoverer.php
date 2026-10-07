<?php

namespace App\Services\Crawl;

use GuzzleHttp\Client as Guzzle;

class SitemapDiscoverer
{
    public function __construct(private readonly Guzzle $http = new Guzzle(['timeout' => 10])) {}

    /**
     * Try /sitemap.xml at the host root. Returns up to $max URLs.
     *
     * @return array<int, string>
     */
    public function discover(string $rootUrl, int $max = 200): array
    {
        $base = rtrim($rootUrl, '/');
        $candidates = [
            $base.'/sitemap.xml',
            $base.'/sitemap_index.xml',
        ];

        foreach ($candidates as $candidate) {
            try {
                $body = (string) $this->http->get($candidate, ['http_errors' => false])->getBody();
                if ($body === '' || ! str_contains($body, '<urlset') && ! str_contains($body, '<sitemapindex')) {
                    continue;
                }

                if (preg_match_all('/<loc>([^<]+)<\/loc>/i', $body, $m)) {
                    return array_slice(array_values(array_unique($m[1])), 0, $max);
                }
            } catch (\Throwable) {
                continue;
            }
        }

        return [];
    }
}
