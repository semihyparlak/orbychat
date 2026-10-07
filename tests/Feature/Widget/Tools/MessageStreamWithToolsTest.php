<?php

use App\Models\Agent;
use App\Models\Conversation;
use App\Models\Visitor;
use App\Models\Workspace;
use App\Services\Llm\Contracts\OpenAiClient;
use App\Services\Llm\Fakes\FakeOpenAi;
use App\Services\Widget\WidgetJwt;

function makeToolConv(string $siteType = 'help_center'): array
{
    $workspace = Workspace::factory()->create();
    $agent = Agent::factory()->published()->create([
        'workspace_id' => $workspace->id,
        'confidence_threshold' => 0.0,
        'allowed_origins' => ['https://example.com'],
        'site_type' => $siteType,
    ]);
    $visitor = Visitor::factory()->create(['agent_id' => $agent->id]);
    $conv = Conversation::factory()->create(['agent_id' => $agent->id, 'visitor_id' => $visitor->id]);

    $jwt = app(WidgetJwt::class)->issue($agent->id, $visitor->id, $conv->id);

    return ['agent' => $agent, 'conv' => $conv, 'jwt' => $jwt['token']];
}

test('tool-enabled agent: stream emits tool_call + block + done', function () {
    /** @var FakeOpenAi $llm */
    $llm = app(OpenAiClient::class);

    // Hop 1: model invokes escalate_to_human.
    $llm->pushToolCall('escalate_to_human', ['reason' => 'visitor needs help'], 'call_1');
    // Hop 2: model decides it's done — returns final content (this hop's
    // chatWithTools call returns 'content', so the loop exits and the
    // streamChat path takes over for the final answer).
    $llm->pushToolFinalContent('OK, connecting you.');
    // The streamChat call (final answer) uses the default response.
    $llm->setDefaultResponse('Connecting you with a human now.');

    ['jwt' => $jwt] = makeToolConv('help_center');

    $response = $this->withHeaders(['Authorization' => "Bearer {$jwt}"])
        ->postJson('/api/v1/widget/messages/stream', ['message' => 'I need a human']);

    $response->assertOk();
    $body = $response->streamedContent();

    // tool_call event fired with the tool name.
    expect($body)->toContain('event: tool_call');
    expect($body)->toContain('escalate_to_human');

    // block event with type=escalation_button.
    expect($body)->toContain('event: block');
    expect($body)->toContain('escalation_button');

    // Final stream + done.
    expect($body)->toContain('event: token');
    expect($body)->toContain('event: done');
    expect($body)->toContain('Connecting you with a human now.');

    // FakeOpenAi recorded the chatWithTools hop with the OpenAI tools
    // payload populated.
    expect($llm->toolCalls)->not->toBe([]);
    expect($llm->toolCalls[0]['tools'])->toHaveCount(1);
    expect($llm->toolCalls[0]['tools'][0]['function']['name'])->toBe('escalate_to_human');
});

test('non-tool agent skips the tool loop entirely', function () {
    /** @var FakeOpenAi $llm */
    $llm = app(OpenAiClient::class);
    $llm->pushResponse('Hello.');

    ['jwt' => $jwt] = makeToolConv('ecommerce'); // ecommerce has no ticket_escalation

    $response = $this->withHeaders(['Authorization' => "Bearer {$jwt}"])
        ->postJson('/api/v1/widget/messages/stream', ['message' => 'Hi']);

    $response->assertOk();
    $body = $response->streamedContent();

    // No tool_call event because the agent's capability set does not
    // include ticket_escalation — the only registered tool is filtered
    // out by the registry.
    expect($body)->not->toContain('event: tool_call');
    expect($body)->toContain('Hello.');
    expect($llm->toolCalls)->toBe([]);
});
