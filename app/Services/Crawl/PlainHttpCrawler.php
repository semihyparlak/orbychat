<?php

namespace App\Services\Crawl;

use App\Services\Crawl\Contracts\Crawler;
use GuzzleHttp\Client as Guzzle;
use GuzzleHttp\Exception\RequestException;

/**
 * Free fallback crawler: plain Guzzle GET. Works for any server-rendered
 * page. Fails on heavy SPAs that build HTML in the browser.
 *
 * Used when neither BROWSERLESS_TOKEN nor CLOUDFLARE_API_TOKEN is set.
 */
class PlainHttpCrawler implements Crawler
{
    public function __construct(private readonly Guzzle $http = new Guzzle([
        'timeout' => 15,
        'allow_redirects' => ['max' => 5],
        'headers' => [
            'User-Agent' => 'OrbyChat/1.0 (+https://orbychat.io/bot)',
            'Accept' => 'text/html,application/xhtml+xml',
        ],
    ])) {}

    public function content(string $url, array $opts = []): string
    {
        try {
            $response = $this->http->get($url, ['http_errors' => false]);
        } catch (RequestException $e) {
            throw new \RuntimeException("Plain HTTP fetch failed: {$e->getMessage()}", previous: $e);
        }

        $code = $response->getStatusCode();
        if ($code >= 400) {
            throw new \RuntimeException("Plain HTTP returned {$code} for {$url}");
        }

        return (string) $response->getBody();
    }
}
