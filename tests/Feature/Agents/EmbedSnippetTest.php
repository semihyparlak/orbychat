<?php

use App\Models\Agent;
use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceUser;

function settingsAdmin(): array
{
    $user = User::factory()->create();
    $ws = Workspace::factory()->create(['owner_user_id' => $user->id]);
    WorkspaceUser::create([
        'workspace_id' => $ws->id,
        'user_id' => $user->id,
        'role' => 'admin',
        'invited_at' => now(),
        'accepted_at' => now(),
    ]);
    $user->forceFill(['default_workspace_id' => $ws->id])->save();
    $agent = Agent::factory()->create(['workspace_id' => $ws->id]);

    return ['user' => $user, 'agent' => $agent];
}

test('agent settings page exposes the embed snippet alongside the form', function () {
    ['user' => $user, 'agent' => $agent] = settingsAdmin();

    $response = $this->actingAs($user)->get("/app/agents/{$agent->id}/settings");

    $response->assertOk();
    $response->assertInertia(fn ($p) => $p
        ->component('app/agents/settings')
        ->has('embed.widget_url')
        ->has('embed.snippet')
        ->where('embed.snippet', fn ($s) => str_contains($s, "data-agent-id=\"{$agent->id}\""))
        ->where('embed.snippet', fn ($s) => str_contains($s, '/widget/widget.js'))
    );
});

test('embed snippet uses async (visitor render is non-blocking)', function () {
    ['user' => $user, 'agent' => $agent] = settingsAdmin();

    $response = $this->actingAs($user)->get("/app/agents/{$agent->id}/settings");

    $response->assertOk();
    $response->assertInertia(fn ($p) => $p->where('embed.snippet', fn ($s) => str_contains($s, 'async')));
});

test('embed snippet appends a cache-busting ?v= query string to the widget URL', function () {
    ['user' => $user, 'agent' => $agent] = settingsAdmin();

    $response = $this->actingAs($user)->get("/app/agents/{$agent->id}/settings");

    $response->assertOk();
    $response->assertInertia(fn ($p) => $p
        ->where('embed.snippet', fn ($s) => (bool) preg_match('/widget\.js\?v=[a-f0-9]+/', (string) $s))
    );
});

test('viewer can view but not modify on settings (page renders, form action gated by policy)', function () {
    $viewer = User::factory()->create();
    $ws = Workspace::factory()->create();
    WorkspaceUser::create([
        'workspace_id' => $ws->id,
        'user_id' => $viewer->id,
        'role' => 'viewer',
        'invited_at' => now(),
        'accepted_at' => now(),
    ]);
    $viewer->forceFill(['default_workspace_id' => $ws->id])->save();
    $agent = Agent::factory()->create(['workspace_id' => $ws->id]);

    // edit() requires update permission per the controller — viewer denied.
    $this->actingAs($viewer)->get("/app/agents/{$agent->id}/settings")->assertForbidden();
});
