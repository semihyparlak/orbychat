<?php

use App\Models\Agent;
use App\Models\Conversation;
use App\Models\Visitor;
use App\Models\Workspace;
use App\Services\Llm\Contracts\OpenAiClient;
use App\Services\Llm\Fakes\FakeOpenAi;
use App\Services\Widget\WidgetJwt;

function makeStreamConv(): array
{
    $workspace = Workspace::factory()->create();
    $agent = Agent::factory()->published()->create([
        'workspace_id' => $workspace->id,
        'confidence_threshold' => 0.0, // make sure retrieval passes any chunk
        'allowed_origins' => ['https://example.com'],
    ]);
    $visitor = Visitor::factory()->create(['agent_id' => $agent->id]);
    $conv = Conversation::factory()->create(['agent_id' => $agent->id, 'visitor_id' => $visitor->id]);

    $jwt = app(WidgetJwt::class)->issue($agent->id, $visitor->id, $conv->id);

    return ['agent' => $agent, 'conv' => $conv, 'jwt' => $jwt['token']];
}

test('streaming endpoint returns text/event-stream and yields token + done events', function () {
    /** @var FakeOpenAi $llm */
    $llm = app(OpenAiClient::class);
    $llm->pushResponse('Hello there.');

    ['jwt' => $jwt] = makeStreamConv();

    $response = $this->withHeaders(['Authorization' => "Bearer {$jwt}"])
        ->postJson('/api/v1/widget/messages/stream', ['message' => 'Hi']);

    $response->assertOk();
    expect($response->headers->get('Content-Type'))->toContain('text/event-stream');

    $body = $response->streamedContent();
    expect($body)->toContain('event: start');
    expect($body)->toContain('event: token');
    expect($body)->toContain('event: done');
    // Content of done event should include the assembled text
    expect($body)->toContain('Hello there.');
});

test('streaming endpoint rejects missing token with 401', function () {
    $response = $this->postJson('/api/v1/widget/messages/stream', ['message' => 'Hi']);
    expect($response->getStatusCode())->toBe(401);
});

test('streaming endpoint rejects invalid token with 401', function () {
    $response = $this->withHeaders(['Authorization' => 'Bearer not-a-valid-jwt'])
        ->postJson('/api/v1/widget/messages/stream', ['message' => 'Hi']);
    expect($response->getStatusCode())->toBe(401);
});
