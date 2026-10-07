<?php

namespace App\Listeners;

use App\Actions\Agents\PublishAgent;
use App\Models\Agent;
use App\Models\Source;

/**
 * The first time any source for an agent finishes indexing, auto-publish
 * the agent if it's still a draft. This removes a manual click for the
 * common happy-path: register → URL crawls → indexed → live.
 */
class AutoPublishOnFirstIndex
{
    public function __construct(private PublishAgent $publish) {}

    public function handle(Source $source): void
    {
        if ($source->status !== 'indexed') {
            return;
        }

        $agent = Agent::query()->withoutGlobalScopes()->whereKey($source->agent_id)->first();
        if ($agent === null) {
            return;
        }
        if ($agent->is_published) {
            return;
        }

        // Only auto-publish on the first ever-indexed source for this agent.
        $hasPriorIndexedSource = Source::query()->withoutWorkspaceScope()
            ->where('agent_id', $agent->id)
            ->where('id', '!=', $source->id)
            ->where('status', 'indexed')
            ->exists();

        if ($hasPriorIndexedSource) {
            return;
        }

        $this->publish->handle($agent);
    }
}
