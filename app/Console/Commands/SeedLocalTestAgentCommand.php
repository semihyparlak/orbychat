<?php

namespace App\Console\Commands;

use App\Models\Agent;
use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceUser;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * Spins up a "Local Test" agent pre-configured for end-to-end widget
 * testing on a sibling project. Defaults to http://localhost:8888 (the
 * php -S server we ship in tmp/local-test/serve.sh) but accepts any
 * --origin so you can point it at a Vite dev server, another Laravel
 * Herd site, etc.
 *
 * Idempotent — re-running just updates the origin and returns the
 * existing agent's id.
 *
 * Usage:
 *   php artisan orbychat:seed-local-test
 *   php artisan orbychat:seed-local-test --origin=http://localhost:5173
 *   php artisan orbychat:seed-local-test --origin=http://my-shop.test
 */
class SeedLocalTestAgentCommand extends Command
{
    protected $signature = 'orbychat:seed-local-test
        {--origin=http://localhost:8888 : The origin you will embed the widget on}
        {--workspace=local-test : Workspace slug to attach to (created if missing)}';

    protected $description = 'Create a published "Local Test" agent + script snippet for embedding on a sibling project';

    public function handle(): int
    {
        $origin = rtrim((string) $this->option('origin'), '/');
        $wsSlug = (string) $this->option('workspace');

        if ($origin === '' || ! preg_match('#^https?://#i', $origin)) {
            $this->error("--origin must be a full http:// or https:// URL (got '{$origin}')");

            return self::FAILURE;
        }

        $workspace = DB::transaction(function () use ($wsSlug): Workspace {
            $ws = Workspace::query()->withoutGlobalScopes()->where('slug', $wsSlug)->first();
            if ($ws !== null) {
                return $ws;
            }

            return Workspace::create([
                'name' => 'Local Test',
                'slug' => $wsSlug,
            ]);
        });

        // Best-effort: attach the dev admin user so the agent is visible in the UI.
        $admin = User::query()->where('email', 'admin@mail.com')->first();
        if ($admin !== null
            && ! WorkspaceUser::query()->where('workspace_id', $workspace->id)->where('user_id', $admin->id)->exists()) {
            WorkspaceUser::create([
                'workspace_id' => $workspace->id,
                'user_id' => $admin->id,
                'role' => 'owner',
                'invited_at' => now(),
                'accepted_at' => now(),
            ]);
        }

        $agent = Agent::query()->withoutGlobalScopes()
            ->where('workspace_id', $workspace->id)
            ->where('name', 'Local Test')
            ->first();

        $payload = [
            'workspace_id' => $workspace->id,
            'name' => 'Local Test',
            'language_default' => 'en',
            'allowed_origins' => [$origin],
            'is_published' => true,
            'auto_index_visited_pages' => true,
            'persona' => [
                'name' => 'OrbyChat',
                'tone' => 'friendly, concise, helpful',
                'allowed_actions' => ['answer', 'capture_email', 'recommend'],
            ],
            'theme' => [
                'primary' => '#111827',
                'accent' => '#10b981',
                'radius' => 12,
            ],
            'guardrails' => ['avoid' => [], 'max_chars' => 2500],
            'confidence_threshold' => 0.5,
        ];

        if ($agent === null) {
            $agent = Agent::create($payload);
        } else {
            $agent->forceFill($payload)->save();
        }

        $widgetUrl = rtrim((string) config('app.url'), '/').'/widget/widget.js';
        $snippet = "<script src=\"{$widgetUrl}\" data-agent-id=\"{$agent->id}\" async></script>";

        $this->newLine();
        $this->info('✔ Local test agent ready.');
        $this->line('');
        $this->line('  Agent ID:   '.$agent->id);
        $this->line('  Workspace:  '.$workspace->slug);
        $this->line('  Origin:     '.$origin);
        $this->line('  Auto-index: ON');
        $this->newLine();
        $this->line('  Paste this in the <head> of any page on '.$origin.':');
        $this->line('');
        $this->line('  '.$snippet);
        $this->newLine();
        $this->line("  Edit / add knowledge: {$widgetUrl}".' — see /app/agents/'.$agent->id);
        $this->newLine();

        return self::SUCCESS;
    }
}
