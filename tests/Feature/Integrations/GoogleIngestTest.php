<?php

use App\Jobs\Crawl\IndexDocumentJob;
use App\Jobs\Crawl\IngestGoogleDocJob;
use App\Models\Agent;
use App\Models\Document;
use App\Models\IntegrationConnection;
use App\Models\Source;
use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceUser;
use App\Services\Integrations\Google\GoogleClient;
use App\Services\Integrations\Google\GoogleTokenStore;
use Illuminate\Support\Facades\Bus;

function googleWorkspace(bool $connect = true): array
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

    if ($connect) {
        IntegrationConnection::create([
            'workspace_id' => $ws->id,
            'kind' => 'google',
            'credentials_encrypted' => [
                'access_token' => 'ya29.access',
                'refresh_token' => '1//refresh',
                'expires_at' => now()->addHour()->toIso8601String(),
            ],
            'status' => 'active',
        ]);
    }

    return ['user' => $user, 'workspace' => $ws, 'agent' => $agent];
}

test('storeGoogleDoc accepts a docs URL and dispatches the job', function () {
    Bus::fake();
    ['user' => $user, 'agent' => $agent] = googleWorkspace();

    $url = 'https://docs.google.com/document/d/1AbCdEfGhIjKlMnOpQrStUvWxYz0123456789/edit';

    $this->actingAs($user)
        ->post("/app/agents/{$agent->id}/sources/google-doc", ['doc' => $url])
        ->assertRedirect();

    $source = Source::query()->withoutGlobalScopes()
        ->where('agent_id', $agent->id)
        ->where('type', 'google_doc')
        ->first();

    expect($source)->not->toBeNull();
    expect($source->config['google_file_id'])->toBe('1AbCdEfGhIjKlMnOpQrStUvWxYz0123456789');
    Bus::assertDispatched(IngestGoogleDocJob::class);
});

test('storeGoogleDoc rejects when Google is not connected', function () {
    Bus::fake();
    ['user' => $user, 'agent' => $agent] = googleWorkspace(connect: false);

    $this->actingAs($user)
        ->from("/app/agents/{$agent->id}/sources")
        ->post("/app/agents/{$agent->id}/sources/google-doc", ['doc' => '1AbCdEfGhIjKlMnOpQrStUvWxYz0123456789'])
        ->assertSessionHasErrors('doc');

    Bus::assertNotDispatched(IngestGoogleDocJob::class);
});

test('IngestGoogleDocJob exports the doc, creates Document, dispatches IndexDocumentJob', function () {
    Bus::fake([IndexDocumentJob::class]);
    ['agent' => $agent] = googleWorkspace();

    $source = Source::create([
        'agent_id' => $agent->id,
        'type' => 'google_doc',
        'status' => 'pending',
        'config' => ['google_file_id' => 'doc-123'],
    ]);

    $client = Mockery::mock(GoogleClient::class);
    $client->shouldReceive('getDoc')->once()
        ->andReturn([
            'title' => 'Onboarding Runbook',
            'text' => str_repeat('This is the onboarding runbook content. ', 25),
            'modified_time' => '2026-05-01T10:00:00Z',
        ]);

    (new IngestGoogleDocJob($source->id))->handle($client, app(GoogleTokenStore::class));

    $source->refresh();
    expect($source->status)->toBe('indexed');
    expect($source->error)->toBeNull();
    $doc = Document::query()->withoutGlobalScopes()->where('source_id', $source->id)->first();
    expect($doc)->not->toBeNull();
    expect($doc->title)->toBe('Onboarding Runbook');
    expect($doc->url)->toBe('gdoc://doc-123');
    Bus::assertDispatched(IndexDocumentJob::class);
});

test('IngestGoogleDocJob fails when Google is not connected', function () {
    ['agent' => $agent] = googleWorkspace(connect: false);

    $source = Source::create([
        'agent_id' => $agent->id,
        'type' => 'google_doc',
        'status' => 'pending',
        'config' => ['google_file_id' => 'doc-x'],
    ]);

    (new IngestGoogleDocJob($source->id))->handle(
        app(GoogleClient::class),
        app(GoogleTokenStore::class),
    );

    $source->refresh();
    expect($source->status)->toBe('failed');
    expect($source->error)->toContain('Google is not connected');
});

test('GoogleTokenStore refreshes when expired and persists the new token', function () {
    ['workspace' => $ws] = googleWorkspace();
    $integration = IntegrationConnection::query()->withoutGlobalScopes()
        ->where('workspace_id', $ws->id)->where('kind', 'google')->first();

    // Mark as expired.
    $integration->update([
        'credentials_encrypted' => [
            'access_token' => 'stale',
            'refresh_token' => '1//refresh',
            'expires_at' => now()->subMinute()->toIso8601String(),
        ],
    ]);

    $client = Mockery::mock(GoogleClient::class);
    $client->shouldReceive('refresh')->once()->with('1//refresh')
        ->andReturn(['access_token' => 'fresh', 'expires_in' => 3600]);

    $store = new GoogleTokenStore($client);
    $token = $store->activeAccessToken($integration);

    expect($token)->toBe('fresh');
    $integration->refresh();
    expect($integration->credentials_encrypted['access_token'])->toBe('fresh');
});

test('GoogleTokenStore returns the cached token when not expired', function () {
    ['workspace' => $ws] = googleWorkspace();
    $integration = IntegrationConnection::query()->withoutGlobalScopes()
        ->where('workspace_id', $ws->id)->where('kind', 'google')->first();

    $client = Mockery::mock(GoogleClient::class);
    $client->shouldNotReceive('refresh');

    $store = new GoogleTokenStore($client);
    expect($store->activeAccessToken($integration))->toBe('ya29.access');
});
