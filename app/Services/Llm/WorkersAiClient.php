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
 * Cloudflare Workers AI — speaks the OpenAI-compatible REST surface but
 * with quirks that the openai-php SDK rejects (e.g. some streamed chunks
 * carry delta.content as int 0 or omit the key entirely). We bypass the
 * SDK and parse SSE directly with Guzzle.
 *
 * Endpoints:
 *   https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/v1
 * or via AI Gateway:
 *   https://gateway.ai.cloudflare.com/v1/{ACCOUNT_ID}/{GATEWAY}/workers-ai/v1
 */
class WorkersAiClient implements OpenAiClient
{
    private Guzzle $http;

    private string $baseUri;

    public function __construct(
        private readonly string $accountId,
        private readonly string $apiToken,
        private readonly string $chatModel = '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
        private readonly string $embedModel = '@cf/baai/bge-base-en-v1.5',
        ?string $aiGatewayUrl = null,
        ?Guzzle $http = null,
    ) {
        $this->baseUri = $aiGatewayUrl !== null && $aiGatewayUrl !== ''
            ? rtrim($aiGatewayUrl, '/')
            : "https://api.cloudflare.com/client/v4/accounts/{$accountId}/ai/v1";

        $this->http = $http ?? new Guzzle([
            'timeout' => 60,
            'connect_timeout' => 5,
        ]);
    }

    private function authHeaders(): array
    {
        return [
            'Authorization' => "Bearer {$this->apiToken}",
            'User-Agent' => 'orbychat/1.0',
        ];
    }

    public function streamChat(array $messages, array $opts = []): iterable
    {
        try {
            $response = $this->http->post($this->baseUri.'/chat/completions', [
                'headers' => $this->authHeaders(),
                'json' => [
                    'model' => $opts['model'] ?? $this->chatModel,
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
                $code === 429 => new OpenAiRateLimitException("Workers AI 429: {$body}"),
                $code === 408 || $code === 504 => new OpenAiTimeoutException("Workers AI timeout: {$body}"),
                default => new OpenAiBadRequestException("Workers AI {$code}: {$body}"),
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
                if ($line === '' || ! str_starts_with($line, 'data:')) {
                    continue;
                }
                $payload = trim(substr($line, 5));
                if ($payload === '' || $payload === '[DONE]') {
                    continue;
                }

                $decoded = json_decode($payload, true);
                if (! is_array($decoded)) {
                    continue;
                }
                $delta = $decoded['choices'][0]['delta']['content'] ?? null;
                if ($delta === null || $delta === '' || $delta === 0 || $delta === '0') {
                    continue;
                }
                yield (string) $delta;
            }
        }
    }

    public function chatWithTools(array $messages, array $tools, array $opts = []): array
    {
        try {
            $payload = [
                'model' => $opts['model'] ?? $this->chatModel,
                'messages' => $messages,
                'max_tokens' => $opts['max_tokens'] ?? 800,
                'temperature' => $opts['temperature'] ?? 0.4,
                'stream' => false,
            ];
            // Cloudflare's OpenAI-compat surface accepts tools / tool_choice
            // for tool-capable models (Llama 3.3 70B Hermes, etc.). For
            // models that ignore them, the request still succeeds and
            // returns a content-only response.
            if ($tools !== []) {
                $payload['tools'] = $tools;
                $payload['tool_choice'] = $opts['tool_choice'] ?? 'auto';
            }

            $response = $this->http->post($this->baseUri.'/chat/completions', [
                'headers' => $this->authHeaders(),
                'json' => $payload,
                'http_errors' => false,
            ]);
        } catch (RequestException $e) {
            throw $this->translateException($e);
        }

        $code = $response->getStatusCode();
        $body = (string) $response->getBody();
        if ($code >= 400) {
            throw match (true) {
                $code === 429 => new OpenAiRateLimitException("Workers AI 429: {$body}"),
                $code === 408 || $code === 504 => new OpenAiTimeoutException("Workers AI timeout: {$body}"),
                default => new OpenAiBadRequestException("Workers AI {$code}: {$body}"),
            };
        }

        $decoded = json_decode($body, true);
        $choice = $decoded['choices'][0] ?? null;
        if (! is_array($choice)) {
            return ['content' => '', 'finish_reason' => 'stop'];
        }

        $finish = (string) ($choice['finish_reason'] ?? 'stop');
        $msg = $choice['message'] ?? [];
        $rawTools = $msg['tool_calls'] ?? [];

        if (is_array($rawTools) && $rawTools !== []) {
            $tool_calls = [];
            foreach ($rawTools as $tc) {
                $tool_calls[] = [
                    'id' => (string) ($tc['id'] ?? ''),
                    'name' => (string) ($tc['function']['name'] ?? ''),
                    'arguments' => (string) ($tc['function']['arguments'] ?? '{}'),
                ];
            }

            return ['tool_calls' => $tool_calls, 'finish_reason' => $finish];
        }

        return [
            'content' => (string) ($msg['content'] ?? ''),
            'finish_reason' => $finish,
        ];
    }

    public function embed(array $inputs): array
    {
        try {
            $response = $this->http->post($this->baseUri.'/embeddings', [
                'headers' => $this->authHeaders(),
                'json' => [
                    'model' => $this->embedModel,
                    'input' => $inputs,
                ],
                'http_errors' => false,
            ]);
        } catch (RequestException $e) {
            throw $this->translateException($e);
        }

        $code = $response->getStatusCode();
        $body = (string) $response->getBody();

        if ($code >= 400) {
            throw new OpenAiBadRequestException("Workers AI embed {$code}: {$body}");
        }

        $decoded = json_decode($body, true);
        $data = $decoded['data'] ?? [];

        return array_values(array_map(fn ($e) => (array) ($e['embedding'] ?? []), $data));
    }

    private function translateException(RequestException $e): OpenAiException
    {
        $msg = $e->getMessage();
        if (str_contains($msg, '429')) {
            return new OpenAiRateLimitException($msg, 0, $e);
        }
        if (str_contains(strtolower($msg), 'timeout') || str_contains(strtolower($msg), 'timed out')) {
            return new OpenAiTimeoutException($msg, 0, $e);
        }

        return new OpenAiException($msg, 0, $e);
    }
}
