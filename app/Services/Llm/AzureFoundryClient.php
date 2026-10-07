<?php

namespace App\Services\Llm;

use App\Services\Llm\Contracts\OpenAiClient;
use App\Services\Llm\Exceptions\OpenAiBadRequestException;
use App\Services\Llm\Exceptions\OpenAiException;
use App\Services\Llm\Exceptions\OpenAiRateLimitException;
use App\Services\Llm\Exceptions\OpenAiTimeoutException;
use GuzzleHttp\Client as Guzzle;
use GuzzleHttp\Exception\RequestException;

/**
 * Azure AI Foundry (Azure OpenAI & Azure AI Model Inference / Serverless API) client.
 *
 * Supports both:
 *  1. Azure OpenAI Service deployments:
 *     https://{resource}.openai.azure.com/openai/deployments/{deployment}/chat/completions?api-version={api-version}
 *  2. Azure AI Foundry Model Inference endpoints (DeepSeek, Llama, Mistral, etc.):
 *     https://{resource}.{region}.models.ai.azure.com/chat/completions
 *     or https://{resource}.services.ai.azure.com/models/chat/completions
 */
class AzureFoundryClient implements OpenAiClient
{
    private Guzzle $http;

    private string $endpoint;

    public function __construct(
        string $endpoint,
        private readonly string $apiKey,
        private readonly string $deployment = 'gpt-4o',
        private readonly string $embedModel = 'text-embedding-3-small',
        private readonly string $apiVersion = '2024-06-01',
        ?Guzzle $http = null,
    ) {
        $this->endpoint = rtrim($endpoint, '/');
        $this->http = $http ?? new Guzzle([
            'timeout' => 60,
            'connect_timeout' => 5,
        ]);
    }

    private function authHeaders(): array
    {
        return [
            'api-key' => $this->apiKey,
            'Authorization' => "Bearer {$this->apiKey}",
            'Content-Type' => 'application/json',
            'User-Agent' => 'orby/azure-foundry/1.0',
        ];
    }

    private function resolveChatUrl(string $model): string
    {
        $dep = $model !== '' ? $model : $this->deployment;
        $url = $this->endpoint;

        if (str_ends_with($url, '/chat/completions')) {
            return $this->appendApiVersion($url);
        }

        if (str_contains($url, '/openai/deployments/')) {
            return $this->appendApiVersion($url.'/chat/completions');
        }

        $host = parse_url($url, PHP_URL_HOST) ?? '';
        if (str_contains($host, 'openai.azure.com')) {
            return $this->appendApiVersion("{$url}/openai/deployments/{$dep}/chat/completions");
        }

        return $this->appendApiVersion("{$url}/chat/completions");
    }

    private function resolveEmbedUrl(string $model): string
    {
        $dep = $model !== '' ? $model : $this->embedModel;
        $url = $this->endpoint;

        if (str_ends_with($url, '/embeddings')) {
            return $this->appendApiVersion($url);
        }

        if (str_contains($url, '/openai/deployments/')) {
            return $this->appendApiVersion($url.'/embeddings');
        }

        $host = parse_url($url, PHP_URL_HOST) ?? '';
        if (str_contains($host, 'openai.azure.com')) {
            return $this->appendApiVersion("{$url}/openai/deployments/{$dep}/embeddings");
        }

        return $this->appendApiVersion("{$url}/embeddings");
    }

    private function appendApiVersion(string $url): string
    {
        if ($this->apiVersion === '') {
            return $url;
        }

        $separator = str_contains($url, '?') ? '&' : '?';

        if (str_contains($url, 'api-version=')) {
            return $url;
        }

        return "{$url}{$separator}api-version={$this->apiVersion}";
    }

    public function streamChat(array $messages, array $opts = []): iterable
    {
        $model = (string) ($opts['model'] ?? $this->deployment);
        $url = $this->resolveChatUrl($model);

        try {
            $response = $this->http->post($url, [
                'headers' => $this->authHeaders(),
                'json' => [
                    'model' => $model,
                    'messages' => $messages,
                    'max_tokens' => $opts['max_tokens'] ?? 800,
                    'temperature' => $opts['temperature'] ?? 0.4,
                    'stream' => true,
                ],
                'stream' => true,
                'http_errors' => false,
            ]);
        } catch (RequestException $e) {
            throw $this->translateException($e);
        }

        $code = $response->getStatusCode();
        if ($code >= 400) {
            $body = (string) $response->getBody();
            throw match (true) {
                $code === 429 => new OpenAiRateLimitException("Azure Foundry 429: {$body}"),
                $code === 408 || $code === 504 => new OpenAiTimeoutException("Azure Foundry timeout: {$body}"),
                $code >= 500 => new OpenAiException("Azure Foundry {$code}: {$body}"),
                default => new OpenAiBadRequestException("Azure Foundry {$code}: {$body}"),
            };
        }

        $body = $response->getBody();
        $buffer = '';
        while (! $body->eof()) {
            $buffer .= $body->read(4096);
            while (($pos = strpos($buffer, "\n")) !== false) {
                $line = substr($buffer, 0, $pos);
                $buffer = substr($buffer, $pos + 1);
                $line = trim($line);
                if ($line === '') {
                    continue;
                }

                if (! str_starts_with($line, 'data:')) {
                    foreach ($this->extractTokenFromLine($line) as $token) {
                        yield $token;
                    }

                    continue;
                }

                $payload = trim(substr($line, 5));
                if ($payload === '' || $payload === '[DONE]') {
                    continue;
                }

                foreach ($this->extractTokenFromLine($payload) as $token) {
                    yield $token;
                }
            }
        }
    }

    /**
     * @return list<string>
     */
    private function extractTokenFromLine(string $json): array
    {
        try {
            $decoded = json_decode($json, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            return [];
        }

        if (! is_array($decoded)) {
            return [];
        }

        $delta = $decoded['choices'][0]['delta'] ?? null;
        if (is_array($delta)) {
            $content = $delta['content'] ?? null;
            if (is_string($content) && $content !== '') {
                return [$content];
            }
        }

        $msg = $decoded['choices'][0]['message'] ?? null;
        if (is_array($msg)) {
            $content = $msg['content'] ?? null;
            if (is_string($content) && $content !== '') {
                return [$content];
            }
        }

        return [];
    }

    public function chatWithTools(array $messages, array $tools, array $opts = []): array
    {
        $model = (string) ($opts['model'] ?? $this->deployment);
        $url = $this->resolveChatUrl($model);

        $payload = [
            'model' => $model,
            'messages' => $messages,
            'max_tokens' => $opts['max_tokens'] ?? 800,
            'temperature' => $opts['temperature'] ?? 0.4,
        ];

        if ($tools !== []) {
            $payload['tools'] = $tools;
            $payload['tool_choice'] = $opts['tool_choice'] ?? 'auto';
        }

        try {
            $response = $this->http->post($url, [
                'headers' => $this->authHeaders(),
                'json' => $payload,
                'http_errors' => false,
                'timeout' => 25,
            ]);
        } catch (RequestException $e) {
            throw $this->translateException($e);
        }

        $code = $response->getStatusCode();
        if ($code >= 400) {
            $body = (string) $response->getBody();
            throw match (true) {
                $code === 429 => new OpenAiRateLimitException("Azure Foundry 429: {$body}"),
                $code === 408 || $code === 504 => new OpenAiTimeoutException("Azure Foundry timeout: {$body}"),
                $code >= 500 => new OpenAiException("Azure Foundry {$code}: {$body}"),
                default => new OpenAiBadRequestException("Azure Foundry {$code}: {$body}"),
            };
        }

        $decoded = json_decode((string) $response->getBody(), true);
        $choice = $decoded['choices'][0] ?? null;
        if (! is_array($choice)) {
            return ['content' => '', 'finish_reason' => 'stop'];
        }

        $msg = $choice['message'] ?? [];
        $finish = (string) ($choice['finish_reason'] ?? 'stop');
        $rawTools = $msg['tool_calls'] ?? [];

        $parsedTools = [];
        if (is_array($rawTools)) {
            foreach ($rawTools as $tc) {
                if (isset($tc['id'], $tc['function']['name'])) {
                    $args = $tc['function']['arguments'] ?? '{}';
                    $parsedTools[] = [
                        'id' => (string) $tc['id'],
                        'name' => (string) $tc['function']['name'],
                        'arguments' => is_string($args) ? $args : json_encode($args),
                    ];
                }
            }
        }

        $content = (string) ($msg['content'] ?? '');

        $result = [
            'content' => $content,
            'finish_reason' => $finish,
        ];
        if ($parsedTools !== []) {
            $result['tool_calls'] = $parsedTools;
        }

        return $result;
    }

    public function embed(array $inputs): array
    {
        if ($inputs === []) {
            return [];
        }

        $url = $this->resolveEmbedUrl($this->embedModel);

        try {
            $response = $this->http->post($url, [
                'headers' => $this->authHeaders(),
                'json' => [
                    'model' => $this->embedModel,
                    'input' => $inputs,
                ],
                'http_errors' => false,
                'timeout' => 15,
            ]);
        } catch (RequestException $e) {
            throw $this->translateException($e);
        }

        $code = $response->getStatusCode();
        if ($code >= 400) {
            $body = (string) $response->getBody();
            throw match (true) {
                $code === 429 => new OpenAiRateLimitException("Azure Foundry embed 429: {$body}"),
                $code === 408 || $code === 504 => new OpenAiTimeoutException("Azure Foundry embed timeout: {$body}"),
                $code >= 500 => new OpenAiException("Azure Foundry embed {$code}: {$body}"),
                default => new OpenAiBadRequestException("Azure Foundry embed {$code}: {$body}"),
            };
        }

        $decoded = json_decode((string) $response->getBody(), true);
        $data = $decoded['data'] ?? [];
        if (! is_array($data)) {
            throw new OpenAiBadRequestException('Azure Foundry embed returned malformed data');
        }

        $vectors = [];
        foreach ($data as $item) {
            if (isset($item['embedding']) && is_array($item['embedding'])) {
                $vectors[] = array_map('floatval', $item['embedding']);
            }
        }

        return $vectors;
    }

    private function translateException(RequestException $e): \Throwable
    {
        $msg = $e->getMessage();
        if (str_contains(strtolower($msg), 'timed out') || str_contains(strtolower($msg), 'timeout')) {
            return new OpenAiTimeoutException("Azure Foundry request timeout: {$msg}", 0, $e);
        }

        return new OpenAiException("Azure Foundry transport error: {$msg}", 0, $e);
    }
}
