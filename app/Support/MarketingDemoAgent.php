<?php

namespace App\Support;

use App\Models\Agent;
use App\Models\Workspace;
use Illuminate\Support\Facades\Cache;

/**
 * Resolves the agent id used by the live demo widget on marketing
 * pages. Single source of truth so the Inertia home page, the Blade
 * marketing pages, and any test all agree on which agent loads.
 *
 * Resolution order:
 *   1. Explicit MARKETING_DEMO_AGENT_ID env (operator override).
 *   2. The first published agent in the "orbychat-demo" workspace —
 *      automatic on a fresh install once DemoSeeder has run.
 */
final class MarketingDemoAgent
{
    public static function id(): ?string
    {
        $explicit = config('services.marketing.demo_agent_id');
        if (is_string($explicit) && $explicit !== '') {
            return $explicit;
        }

        return Cache::remember('marketing.demo_agent_id', now()->addMinutes(5), function () {
            $workspace = Workspace::query()->withoutGlobalScopes()
                ->where('slug', 'orbychat-demo')
                ->first();

            if ($workspace === null) {
                return null;
            }

            return Agent::query()->withoutGlobalScopes()
                ->where('workspace_id', $workspace->id)
                ->where('is_published', true)
                ->orderBy('created_at')
                ->value('id');
        });
    }
}
