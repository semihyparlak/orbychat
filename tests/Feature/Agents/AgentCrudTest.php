<?php

use App\Models\Agent;
use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceUser;

function asMember(string $role = 'admin'): array
{
    $user = User::factory()->create();
    $workspace = Workspace::factory()->create(['owner_user_id' => $user->id]);
    WorkspaceUser::create([
        'workspace_id' => $workspace->id,
        'user_id' => $user->id,
        'role' => $role,
        'invited_at' => now(),
        'accepted_at' => now(),
    ]);
    $user->forceFill(['default_workspace_id' => $workspace->id])->save();

    return ['user' => $user, 'workspace' => $workspace];
}

test('admin can create an agent', function () {
    ['user' => $user, 'workspace' => $workspace] = asMember('admin');

    $response = $this->actingAs($user)->post(route('agents.store'), [
        'name' => 'Sales Bot',
        'language_default' => 'en',
        'allowed_origins' => ['https://example.com'],
        'system_prompt' => 'Be helpful.',
        'confidence_threshold' => 0.78,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('agents', [
        'workspace_id' => $workspace->id,
        'name' => 'Sales Bot',
        'language_default' => 'en',
    ]);
});

test('viewer cannot create an agent', function () {
    ['user' => $user] = asMember('viewer');

    $this->actingAs($user)->post(route('agents.store'), [
        'name' => 'Should Fail',
        'language_default' => 'en',
    ])->assertForbidden();
});

test('agent index lists only the current workspace agents', function () {
    ['user' => $user, 'workspace' => $workspace] = asMember('admin');
    Agent::factory()->count(2)->create(['workspace_id' => $workspace->id]);
    Agent::factory()->create(); // different workspace

    $this->actingAs($user)->get(route('agents.index'))->assertOk();
});

test('agent index supports view, language, and sort query params', function () {
    ['user' => $user, 'workspace' => $workspace] = asMember('admin');

    Agent::factory()->create([
        'workspace_id' => $workspace->id,
        'name' => 'Zulu Bot',
        'is_published' => true,
        'language_default' => 'en',
    ]);
    Agent::factory()->create([
        'workspace_id' => $workspace->id,
        'name' => 'Alpha Bot',
        'is_published' => true,
        'language_default' => 'en',
    ]);
    Agent::factory()->create([
        'workspace_id' => $workspace->id,
        'name' => 'French Draft',
        'is_published' => false,
        'language_default' => 'fr',
    ]);

    $response = $this->actingAs($user)->get(route('agents.index', [
        'view' => 'published',
        'language' => 'en',
        'sort' => 'name_asc',
    ]));

    $response->assertOk()->assertInertia(fn ($p) => $p
        ->where('filters.view', 'published')
        ->where('filters.language', 'en')
        ->where('filters.sort', 'name_asc')
        ->has('agents', 2)
        ->where('agents.0.name', 'Alpha Bot')
        ->where('agents.1.name', 'Zulu Bot')
        ->where('filterOptions.languages', ['en', 'fr']));
});

test('agent workspace page exposes setup and embed data', function () {
    ['user' => $user, 'workspace' => $workspace] = asMember('admin');

    $agent = Agent::factory()->create([
        'workspace_id' => $workspace->id,
        'name' => 'Workspace Agent',
        'language_default' => 'en',
        'confidence_threshold' => 0.78,
    ]);

    $response = $this->actingAs($user)->get(route('agents.show', ['agent' => $agent->id]));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('app/agents/show')
        ->where('agent.id', $agent->id)
        ->where('agent.name', 'Workspace Agent')
        ->where('setup.sources_indexed', 0)
        ->where('setup.sources_total', 0)
        ->where('setup.has_messages', false)
        ->where('embed.widget_url', fn ($url) => str_contains((string) $url, '/widget/widget.js'))
        ->where('embed.snippet', fn ($snippet) => str_contains((string) $snippet, "data-agent-id=\"{$agent->id}\"")));
});

test('updating an agent works for editor role', function () {
    ['user' => $user, 'workspace' => $workspace] = asMember('editor');
    $agent = Agent::factory()->create(['workspace_id' => $workspace->id]);

    $this->actingAs($user)->patch(route('agents.update', ['agent' => $agent->id]), [
        'name' => 'Renamed Agent',
    ])->assertRedirect();

    expect($agent->fresh()->name)->toBe('Renamed Agent');
});

test('updating an agent across workspaces is forbidden', function () {
    ['user' => $user] = asMember('admin');
    $other = Workspace::factory()->create();
    $agent = Agent::factory()->create(['workspace_id' => $other->id]);

    $this->actingAs($user)->patch(route('agents.update', ['agent' => $agent->id]), [
        'name' => 'Hacked',
    ])->assertForbidden();
});

test('updating an agent persists starter_prompts as an array', function () {
    ['user' => $user, 'workspace' => $workspace] = asMember('editor');
    $agent = Agent::factory()->create(['workspace_id' => $workspace->id]);

    $this->actingAs($user)->patch(route('agents.update', ['agent' => $agent->id]), [
        'starter_prompts' => [
            'What is your pricing?',
            'Do you support SSO?',
        ],
    ])->assertRedirect();

    expect($agent->fresh()->starter_prompts)->toBe([
        'What is your pricing?',
        'Do you support SSO?',
    ]);
});

test('updating starter_prompts rejects more than 6 items', function () {
    ['user' => $user, 'workspace' => $workspace] = asMember('editor');
    $agent = Agent::factory()->create(['workspace_id' => $workspace->id]);

    $this->actingAs($user)->patch(route('agents.update', ['agent' => $agent->id]), [
        'starter_prompts' => [
            'one', 'two', 'three', 'four', 'five', 'six', 'seven',
        ],
    ])->assertSessionHasErrors('starter_prompts');
});

test('updating starter_prompts rejects entries longer than 80 chars', function () {
    ['user' => $user, 'workspace' => $workspace] = asMember('editor');
    $agent = Agent::factory()->create(['workspace_id' => $workspace->id]);

    $this->actingAs($user)->patch(route('agents.update', ['agent' => $agent->id]), [
        'starter_prompts' => [str_repeat('a', 81)],
    ])->assertSessionHasErrors('starter_prompts.0');
});

test('publishing an agent snapshots a version and sets published_version_id', function () {
    ['user' => $user, 'workspace' => $workspace] = asMember('admin');
    $agent = Agent::factory()->create(['workspace_id' => $workspace->id]);

    $this->actingAs($user)->post(route('agents.publish', ['agent' => $agent->id]))->assertRedirect();

    $fresh = $agent->fresh();
    expect($fresh->is_published)->toBeTrue();
    expect($fresh->published_version_id)->not->toBeNull();
    $this->assertDatabaseHas('agent_versions', ['agent_id' => $agent->id]);
});

test('rolling back an agent restores the snapshot', function () {
    ['user' => $user, 'workspace' => $workspace] = asMember('admin');
    $agent = Agent::factory()->create(['workspace_id' => $workspace->id, 'name' => 'Original']);

    // Publish first to create a version
    $this->actingAs($user)->post(route('agents.publish', ['agent' => $agent->id]));
    $version = $agent->fresh()->publishedVersion;

    // Mutate
    $agent->update(['name' => 'Mutated']);
    expect($agent->fresh()->name)->toBe('Mutated');

    // Rollback
    $this->actingAs($user)->post(route('agents.rollback', ['agent' => $agent->id]), [
        'version_id' => $version->id,
    ])->assertRedirect();

    expect($agent->fresh()->name)->toBe('Original');
});
