<?php

namespace App\Services\Vector;

use App\Services\Vector\Contracts\QdrantClient;
use GuzzleHttp\Client as Guzzle;
use GuzzleHttp\Exception\RequestException;

/**
 * Cloudflare Vectorize — drops in for QdrantClient.
 *
 * REST API base:
 *   https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/vectorize/v2/indexes/{INDEX}
 *
 * Authoritative differences from Qdrant:
 *   - "collection" → "index"
 *   - filter syntax: {"field": {"$eq": "value"}} (Mongo-ish)
 *   - delete-by-filter is NOT native; we query, then delete_by_ids
 *   - upsert uses NDJSON of {id, values, metadata} per line
 */
class VectorizeClient implements QdrantClient
{
    public function __construct(
        private readonly Guzzle $http,
        private readonly string $accountId,
        private readonly string $apiToken,
    ) {}

    public static function default(string $accountId, string $apiToken, ?Guzzle $http = null): self
    {
        return new self(
            $http ?? new Guzzle(['timeout' => 15]),
            $accountId,
            $apiToken,
        );
    }

    public function upsertPoints(string $collection, array $points): void
    {
        if ($points === []) {
            return;
        }

        // Vectorize ingests NDJSON: one JSON object per line.
        $lines = [];
        foreach ($points as $p) {
            $lines[] = json_encode([
                'id' => (string) $p['id'],
                'values' => $p['vector'],
                'metadata' => $p['payload'] ?? [],
            ], JSON_THROW_ON_ERROR);
        }

        $this->request(
            method: 'POST',
            path: "indexes/{$collection}/upsert",
            options: [
                'headers' => ['Content-Type' => 'application/x-ndjson'],
                'body' => implode("\n", $lines),
            ],
        );
    }

    public function search(string $collection, array $vector, array $filter, int $limit): array
    {
        $body = [
            'vector' => $vector,
            'topK' => $limit,
            'returnMetadata' => 'all',
        ];

        if ($filter !== []) {
            $body['filter'] = $this->buildFilter($filter);
        }

        $response = $this->request('POST', "indexes/{$collection}/query", ['json' => $body]);
        $matches = $response['result']['matches'] ?? [];

        return array_map(fn (array $m): array => [
            'id' => (string) ($m['id'] ?? ''),
            'score' => (float) ($m['score'] ?? 0.0),
            'payload' => (array) ($m['metadata'] ?? []),
        ], $matches);
    }

    public function deleteByFilter(string $collection, array $filter): void
    {
        // Vectorize lacks a native delete-by-filter. We page through matches
        // and delete by id. Cloudflare caps topK at 50 with returnMetadata=all,
        // so we use the lighter "ids only" path (returnValues=false,
        // returnMetadata=indexed) which allows topK=100.
        $dim = $this->resolveVectorDim();
        $deleted = 0;

        for ($page = 0; $page < 20; $page++) { // hard cap ~2,000 deletions per call
            $body = [
                'vector' => array_fill(0, $dim, 0.0),
                'topK' => 100,
                'returnValues' => false,
                'returnMetadata' => 'indexed',
                'filter' => $this->buildFilter($filter),
            ];

            $response = $this->request('POST', "indexes/{$collection}/query", ['json' => $body]);
            $matches = $response['result']['matches'] ?? [];
            if ($matches === []) {
                return;
            }

            $ids = array_values(array_filter(array_map(fn ($m) => (string) ($m['id'] ?? ''), $matches)));
            if ($ids === []) {
                return;
            }

            $this->request('POST', "indexes/{$collection}/delete_by_ids", [
                'json' => ['ids' => $ids],
            ]);
            $deleted += count($ids);

            if (count($ids) < 100) {
                return; // last page
            }
        }
    }

    public function ensureCollection(string $name, int $dim, string $distance = 'Cosine'): void
    {
        $exists = false;
        try {
            $this->request('GET', "indexes/{$name}");
            $exists = true;
        } catch (\Throwable) {
            // create below
        }

        if (! $exists) {
            $this->request('POST', 'indexes', [
                'json' => [
                    'name' => $name,
                    'config' => [
                        'dimensions' => $dim,
                        'metric' => strtolower($distance),
                    ],
                ],
            ]);
        }

        // Create metadata indexes for the fields we filter by. Cloudflare
        // Vectorize will not return matches when filtering by a property
        // that has no metadata index.
        foreach (['agent_id', 'document_id', 'chunk_id'] as $property) {
            try {
                $this->request('POST', "indexes/{$name}/metadata_index/create", [
                    'json' => ['propertyName' => $property, 'indexType' => 'string'],
                ]);
            } catch (\Throwable) {
                // Already exists; that's fine.
            }
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function request(string $method, string $path, array $options = []): array
    {
        $url = "https://api.cloudflare.com/client/v4/accounts/{$this->accountId}/vectorize/v2/{$path}";

        $options['headers'] = array_merge([
            'Authorization' => "Bearer {$this->apiToken}",
            'Accept' => 'application/json',
        ], $options['headers'] ?? []);

        try {
            $response = $this->http->request($method, $url, $options);
        } catch (RequestException $e) {
            $body = $e->hasResponse() ? (string) $e->getResponse()->getBody() : $e->getMessage();
            throw new \RuntimeException("Vectorize {$method} {$path} failed: {$body}", previous: $e);
        }

        $decoded = json_decode((string) $response->getBody(), true);
        if (! is_array($decoded)) {
            throw new \RuntimeException("Vectorize returned non-JSON for {$method} {$path}");
        }

        return $decoded;
    }

    /**
     * Resolve the vector dimension from config when the Laravel app is
     * available; fall back to the Cloudflare bge-base default (768) for
     * pure-PHP unit-test contexts.
     */
    private function resolveVectorDim(): int
    {
        try {
            if (function_exists('app') && app()->bound('config')) {
                return (int) config('services.vector_dim', 768);
            }
        } catch (\Throwable) {
            // app() not booted (unit test) — fall through.
        }

        return 768;
    }

    /**
     * Convert {field => value} into Vectorize's {field: {$eq: value}}.
     */
    private function buildFilter(array $filter): array
    {
        $out = [];
        foreach ($filter as $k => $v) {
            $out[$k] = ['$eq' => $v];
        }

        return $out;
    }
}
