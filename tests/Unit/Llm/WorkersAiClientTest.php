<?php

use App\Services\Llm\Contracts\OpenAiClient;
use App\Services\Llm\Exceptions\OpenAiRateLimitException;
use App\Services\Llm\WorkersAiClient;
use GuzzleHttp\Client;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Middleware;
use GuzzleHttp\Psr7\Response;
use Psr\Http\Message\RequestInterface;

test('WorkersAiClient implements the OpenAiClient contract', function () {
    $client = new WorkersAiClient(
        accountId: 'acct123',
        apiToken: 'tok123',
    );

    expect($client)->toBeInstanceOf(OpenAiClient::class);
});

test('embed() POSTs to the Cloudflare embeddings endpoint and returns vectors', function () {
    $mock = new MockHandler([new Response(200, [], json_encode([
        'object' => 'list',
        'data' => [
            ['object' => 'embedding', 'embedding' => [0.1, 0.2, 0.3]],
            ['object' => 'embedding', 'embedding' => [0.4, 0.5, 0.6]],
        ],
    ]))]);
    $history = [];
    $stack = HandlerStack::create($mock);
    $stack->push(Middleware::history($history));

    $client = new WorkersAiClient(
        accountId: 'acct123',
        apiToken: 'tok123',
        http: new Client(['handler' => $stack]),
    );

    $vectors = $client->embed(['hello', 'world']);

    expect($vectors)->toHaveCount(2);
    expect($vectors[0])->toBe([0.1, 0.2, 0.3]);

    /** @var RequestInterface $req */
    $req = $history[0]['request'];
    expect((string) $req->getUri())->toContain('/accounts/acct123/ai/v1/embeddings');
    expect($req->getHeaderLine('Authorization'))->toBe('Bearer tok123');
    $body = json_decode((string) $req->getBody(), true);
    expect($body['model'])->toBe('@cf/baai/bge-base-en-v1.5');
    expect($body['input'])->toBe(['hello', 'world']);
});

test('streamChat() parses SSE and yields only string content, ignoring int 0 and missing keys', function () {
    $sse = 'data: '.json_encode(['choices' => [['delta' => ['content' => 'Hello']]]])."\n\n"
         .'data: '.json_encode(['choices' => [['delta' => ['content' => ' world']]]])."\n\n"
         .'data: '.json_encode(['choices' => [['delta' => ['content' => 0]]]])."\n\n"
         .'data: '.json_encode(['choices' => [['delta' => []]]])."\n\n"
         ."data: [DONE]\n\n";

    $mock = new MockHandler([new Response(200, [], $sse)]);
    $client = new WorkersAiClient(
        accountId: 'acct123',
        apiToken: 'tok123',
        http: new Client(['handler' => HandlerStack::create($mock)]),
    );

    $tokens = iterator_to_array($client->streamChat([['role' => 'user', 'content' => 'hi']]));
    expect($tokens)->toBe(['Hello', ' world']);
});

test('streamChat() throws OpenAiRateLimitException on 429', function () {
    $mock = new MockHandler([new Response(429, [], '{"errors":[{"message":"rate limited"}]}')]);
    $client = new WorkersAiClient(
        accountId: 'acct123',
        apiToken: 'tok123',
        http: new Client(['handler' => HandlerStack::create($mock)]),
    );

    iterator_to_array($client->streamChat([['role' => 'user', 'content' => 'hi']]));
})->throws(OpenAiRateLimitException::class);

test('honors a custom AI Gateway URL when provided', function () {
    $mock = new MockHandler([new Response(200, [], json_encode(['data' => [['embedding' => [1.0]]]]))]);
    $history = [];
    $stack = HandlerStack::create($mock);
    $stack->push(Middleware::history($history));

    $client = new WorkersAiClient(
        accountId: 'acct123',
        apiToken: 'tok123',
        aiGatewayUrl: 'https://gateway.ai.cloudflare.com/v1/acct123/orbychat/workers-ai/v1',
        http: new Client(['handler' => $stack]),
    );

    $client->embed(['hello']);

    expect((string) $history[0]['request']->getUri())
        ->toContain('gateway.ai.cloudflare.com/v1/acct123/orbychat/workers-ai/v1/embeddings');
});
