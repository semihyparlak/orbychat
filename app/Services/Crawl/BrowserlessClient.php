<?php

namespace App\Services\Crawl;

use App\Services\Crawl\Contracts\Crawler;
use GuzzleHttp\Client as Guzzle;
use GuzzleHttp\Exception\RequestException;

class BrowserlessClient implements Crawler
{
    public function __construct(
        private readonly Guzzle $http,
        private readonly string $token,
    ) {}

    public static function default(?Guzzle $http = null): self
    {
        return new self(
            $http ?? new Guzzle(['timeout' => 30]),
            (string) config('services.browserless.token', env('BROWSERLESS_TOKEN', '')),
        );
    }

    /**
     * Fetch fully-rendered HTML for a URL.
     */
    public function content(string $url, array $opts = []): string
    {
        $endpoint = rtrim((string) config('services.browserless.url', 'https://chrome.browserless.io'), '/');

        try {
            $response = $this->http->post($endpoint."/content?token={$this->token}", [
                'json' => [
                    'url' => $url,
                    'waitFor' => $opts['waitFor'] ?? 'domcontentloaded',
                ],
                'http_errors' => false,
            ]);
        } catch (RequestException $e) {
            throw new \RuntimeException("Browserless fetch failed: {$e->getMessage()}", previous: $e);
        }

        $code = $response->getStatusCode();
        if ($code === 429) {
            throw new \RuntimeException('Browserless rate-limited (429).');
        }
        if ($code >= 400) {
            throw new \RuntimeException("Browserless returned HTTP {$code}.");
        }

        return (string) $response->getBody();
    }
}
