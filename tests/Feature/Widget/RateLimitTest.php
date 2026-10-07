<?php

use App\Models\Agent;
use App\Models\Workspace;

function widgetAgentForRateLimit(): Agent
{
    $workspace = Workspace::factory()->create();

    return Agent::factory()->published()->create([
        'workspace_id' => $workspace->id,
        'allowed_origins' => ['https://example.com'],
    ]);
}

test('widget init is rate limited per ip and agent', function () {
    $agent = widgetAgentForRateLimit();

    for ($attempt = 0; $attempt < 60; $attempt++) {
        $this->withServerVariables(['REMOTE_ADDR' => '198.51.100.10'])
            ->withHeaders(['Origin' => 'https://example.com'])
            ->postJson('/api/v1/widget/init', [
                'agent_id' => $agent->id,
                'anon_id' => 'anon-rate-limit-init',
                'page_url' => 'https://example.com/pricing',
            ])
            ->assertOk();
    }

    $response = $this->withServerVariables(['REMOTE_ADDR' => '198.51.100.10'])
        ->withHeaders(['Origin' => 'https://example.com'])
        ->postJson('/api/v1/widget/init', [
            'agent_id' => $agent->id,
            'anon_id' => 'anon-rate-limit-init',
            'page_url' => 'https://example.com/pricing',
        ]);

    $response->assertStatus(429)
        ->assertJsonPath('error.code', 'rate_limited');

    expect($response->headers->get('Retry-After'))->not->toBeNull();
});

test('widget session endpoints are rate limited per widget token', function () {
    for ($attempt = 0; $attempt < 30; $attempt++) {
        $this->withServerVariables(['REMOTE_ADDR' => '198.51.100.11'])
            ->withHeaders(['Authorization' => 'Bearer widget-rate-limit-token'])
            ->postJson('/api/v1/widget/messages/stream', [
                'message' => 'Hello',
            ])
            ->assertStatus(401);
    }

    $response = $this->withServerVariables(['REMOTE_ADDR' => '198.51.100.11'])
        ->withHeaders(['Authorization' => 'Bearer widget-rate-limit-token'])
        ->postJson('/api/v1/widget/messages/stream', [
            'message' => 'Hello',
        ]);

    $response->assertStatus(429)
        ->assertJsonPath('error.code', 'rate_limited');

    expect($response->headers->get('Retry-After'))->not->toBeNull();
});

test('widget lead capture is rate limited more aggressively than chat traffic', function () {
    for ($attempt = 0; $attempt < 5; $attempt++) {
        $this->withServerVariables(['REMOTE_ADDR' => '198.51.100.12'])
            ->withHeaders(['Authorization' => 'Bearer widget-lead-rate-limit-token'])
            ->postJson('/api/v1/widget/leads', [
                'email' => 'visitor@example.com',
            ])
            ->assertStatus(401);
    }

    $response = $this->withServerVariables(['REMOTE_ADDR' => '198.51.100.12'])
        ->withHeaders(['Authorization' => 'Bearer widget-lead-rate-limit-token'])
        ->postJson('/api/v1/widget/leads', [
            'email' => 'visitor@example.com',
        ]);

    $response->assertStatus(429)
        ->assertJsonPath('error.code', 'rate_limited');

    expect($response->headers->get('Retry-After'))->not->toBeNull();
});
