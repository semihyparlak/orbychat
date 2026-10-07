<?php

use App\Models\Agent;
use App\Models\Conversation;
use App\Models\CuratedAnswer;
use App\Models\IntegrationConnection;
use App\Models\Lead;
use App\Models\Source;
use App\Models\User;
use App\Models\Visitor;
use App\Models\WebhookSubscription;
use App\Models\Workspace;
use App\Models\WorkspaceUser;

/**
 * Cross-tenant audit. For every endpoint we shipped this cycle, an admin
 * of workspace A must NOT be able to act on a resource owned by
 * workspace B. This complements the unit-level scope tests in
 * MultiTenancyTest by exercising the actual HTTP surface.
 */
function aliceWorkspace(): array
{
    $alice = User::factory()->create();
    $ws = Workspace::factory()->create(['owner_user_id' => $alice->id]);
    WorkspaceUser::create([
        'workspace_id' => $ws->id,
        'user_id' => $alice->id,
        'role' => 'admin',
        'invited_at' => now(),
        'accepted_at' => now(),
    ]);
    $alice->forceFill(['default_workspace_id' => $ws->id])->save();
    $agent = Agent::factory()->create(['workspace_id' => $ws->id]);

    return ['user' => $alice, 'workspace' => $ws, 'agent' => $agent];
}

test('claim/release/reply on a foreign conversation is forbidden', function () {
    ['user' => $alice] = aliceWorkspace();
    $bobWs = Workspace::factory()->create();
    $bobAgent = Agent::factory()->create(['workspace_id' => $bobWs->id]);
    $bobVisitor = Visitor::factory()->create(['agent_id' => $bobAgent->id]);
    $bobConversation = Conversation::factory()->create(['agent_id' => $bobAgent->id, 'visitor_id' => $bobVisitor->id]);

    $this->actingAs($alice)->postJson("/app/conversations/{$bobConversation->id}/claim")->assertForbidden();
    $this->actingAs($alice)->postJson("/app/conversations/{$bobConversation->id}/release")->assertForbidden();
    $this->actingAs($alice)->postJson("/app/conversations/{$bobConversation->id}/reply", ['content' => 'hi'])->assertForbidden();
});

test('source preview / discover / bulkStore on foreign agent is forbidden', function () {
    ['user' => $alice] = aliceWorkspace();
    $bobWs = Workspace::factory()->create();
    $bobAgent = Agent::factory()->create(['workspace_id' => $bobWs->id]);
    $bobSource = Source::factory()->create(['agent_id' => $bobAgent->id]);

    $this->actingAs($alice)->getJson("/app/sources/{$bobSource->id}/preview")->assertForbidden();
    $this->actingAs($alice)->postJson("/app/agents/{$bobAgent->id}/sources/discover", ['url' => 'https://x'])->assertForbidden();
    $this->actingAs($alice)->postJson("/app/agents/{$bobAgent->id}/sources/bulk", ['urls' => ['https://x']])->assertForbidden();
    $this->actingAs($alice)->postJson("/app/agents/{$bobAgent->id}/sources/notion", ['page' => 'abc'])->assertForbidden();
    $this->actingAs($alice)->postJson("/app/agents/{$bobAgent->id}/sources/google-doc", ['doc' => 'abc'])->assertForbidden();
});

test('onboarding-status for a foreign agent is forbidden', function () {
    ['user' => $alice] = aliceWorkspace();
    $bobWs = Workspace::factory()->create();
    $bobAgent = Agent::factory()->create(['workspace_id' => $bobWs->id]);

    $this->actingAs($alice)
        ->getJson("/api/v1/agents/{$bobAgent->id}/onboarding-status")
        ->assertForbidden();
});

test('approve / destroy curated-answer for a foreign agent is forbidden', function () {
    ['user' => $alice] = aliceWorkspace();
    $bobWs = Workspace::factory()->create();
    $bobAgent = Agent::factory()->create(['workspace_id' => $bobWs->id]);
    $ca = CuratedAnswer::create([
        'agent_id' => $bobAgent->id,
        'question_pattern' => 'q',
        'answer' => 'a',
        'priority' => 1,
        'enabled' => false,
        'conditions' => ['suggested' => true],
    ]);

    $this->actingAs($alice)->postJson("/app/curated-answers/{$ca->id}/approve")->assertForbidden();
    $this->actingAs($alice)->deleteJson("/app/curated-answers/{$ca->id}")->assertForbidden();
});

test('disconnect a foreign integration is 404 (not found from this workspace POV)', function () {
    ['user' => $alice] = aliceWorkspace();
    $bobWs = Workspace::factory()->create();
    $bobIntegration = IntegrationConnection::create([
        'workspace_id' => $bobWs->id,
        'kind' => 'slack',
        'credentials_encrypted' => ['webhook_url' => 'https://hooks.slack.com/services/T/B/x'],
        'status' => 'active',
    ]);

    $this->actingAs($alice)
        ->deleteJson("/app/integrations/{$bobIntegration->id}")
        ->assertNotFound();

    expect(IntegrationConnection::query()->withoutGlobalScopes()->where('id', $bobIntegration->id)->exists())
        ->toBeTrue();
});

test('update or delete a foreign webhook subscription is 404', function () {
    ['user' => $alice] = aliceWorkspace();
    $bobWs = Workspace::factory()->create();
    $bobWebhook = WebhookSubscription::create([
        'workspace_id' => $bobWs->id,
        'url' => 'https://hooks.example.com/orbychat',
        'secret' => 'orbychat-secret-1234',
        'events' => ['lead.captured'],
        'enabled' => true,
    ]);

    $this->actingAs($alice)
        ->patchJson("/app/integrations/webhooks/{$bobWebhook->id}", [
            'url' => 'https://hooks.example.com/updated',
            'secret' => '',
            'events' => ['lead.captured'],
            'enabled' => false,
        ])
        ->assertNotFound();

    $this->actingAs($alice)
        ->deleteJson("/app/integrations/webhooks/{$bobWebhook->id}")
        ->assertNotFound();

    expect(WebhookSubscription::query()->withoutGlobalScopes()->where('id', $bobWebhook->id)->exists())
        ->toBeTrue();
});

test('inbox does not list foreign leads', function () {
    ['user' => $alice] = aliceWorkspace();
    $bobWs = Workspace::factory()->create();
    $bobAgent = Agent::factory()->create(['workspace_id' => $bobWs->id]);
    $bobVisitor = Visitor::factory()->create(['agent_id' => $bobAgent->id]);
    $bobConv = Conversation::factory()->create(['agent_id' => $bobAgent->id, 'visitor_id' => $bobVisitor->id]);
    $bobLead = Lead::create([
        'conversation_id' => $bobConv->id,
        'agent_id' => $bobAgent->id,
        'email' => 'theirs@example.com',
        'status' => 'new',
        'fields' => [],
    ]);

    $this->actingAs($alice)
        ->get("/app/inbox/{$bobLead->id}")
        ->assertForbidden();
});

test('agent leads page is forbidden for a foreign workspace agent', function () {
    ['user' => $alice] = aliceWorkspace();
    $bobWs = Workspace::factory()->create();
    $bobAgent = Agent::factory()->create(['workspace_id' => $bobWs->id]);

    $this->actingAs($alice)
        ->get("/app/agents/{$bobAgent->id}/leads")
        ->assertForbidden();
});

test('dashboard stats reflect zero across-tenant leakage (counts validated in DashboardStatsTest)', function () {
    ['user' => $alice] = aliceWorkspace();

    $bobWs = Workspace::factory()->create();
    $bobAgent = Agent::factory()->create(['workspace_id' => $bobWs->id]);
    $bobVisitor = Visitor::factory()->create(['agent_id' => $bobAgent->id]);
    Conversation::factory()->create(['agent_id' => $bobAgent->id, 'visitor_id' => $bobVisitor->id]);
    Source::factory()->create(['agent_id' => $bobAgent->id, 'status' => 'indexed']);

    $response = $this->actingAs($alice)->get('/dashboard');

    $response->assertOk();
    $response->assertInertia(fn ($p) => $p
        ->where('stats.conversations.total', 0)
        ->where('stats.sources.indexed', 0));
});
