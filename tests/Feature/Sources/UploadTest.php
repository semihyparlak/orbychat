<?php

use App\Jobs\Crawl\IndexDocumentJob;
use App\Models\Agent;
use App\Models\Document;
use App\Models\Source;
use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceUser;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Bus;

test('admin can upload a markdown file and a document + IndexDocumentJob is created', function () {
    Bus::fake();

    $user = User::factory()->create();
    $workspace = Workspace::factory()->create();
    WorkspaceUser::create([
        'workspace_id' => $workspace->id,
        'user_id' => $user->id,
        'role' => 'admin',
        'invited_at' => now(),
        'accepted_at' => now(),
    ]);
    $user->forceFill(['default_workspace_id' => $workspace->id])->save();
    $agent = Agent::factory()->create(['workspace_id' => $workspace->id]);

    $file = UploadedFile::fake()->createWithContent('docs.md', "# Heading\n\nSome content about the product.\n\n## Another heading\n\nMore content.");

    $this->actingAs($user)->post(route('agents.uploads.store', ['agent' => $agent->id]), [
        'files' => [$file],
    ])->assertRedirect();

    expect(Source::query()->where('agent_id', $agent->id)->where('type', 'file')->exists())->toBeTrue();
    expect(Document::query()->where('agent_id', $agent->id)->count())->toBeGreaterThan(0);
    Bus::assertDispatched(IndexDocumentJob::class);
});
