<?php

namespace App\Http\Controllers\Admin;

use App\Models\Lead;
use App\Support\CurrentWorkspace;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Tiny polling endpoint the admin shell hits every ~30s to detect new
 * leads since the previous poll. Two reasons it is JSON instead of an
 * Inertia partial visit:
 *
 *   1. The shell mounts on every page; we don't want to overwrite
 *      the page's own props with a sidebar concern.
 *   2. The hook tracks the latest lead id locally, so the response
 *      stays tiny — just enough to render a sonner toast and (when
 *      the user has granted permission) a native browser notification.
 *
 * Auth is the same as every workspace-scoped controller — workspace.require
 * middleware runs before this hits the controller, so we can trust
 * CurrentWorkspace.
 */
class LeadFeedController
{
    public function __invoke(Request $request, CurrentWorkspace $current): JsonResponse
    {
        $workspace = $current->get();
        if ($workspace === null) {
            return response()->json(['data' => ['leads' => [], 'count_24h' => 0]]);
        }

        // The hook supplies "since" so we only ship leads the client hasn't
        // seen. On first poll there is no "since" — return empty + the
        // 24h count so the shell can show a passive badge without firing
        // a toast for every historical lead.
        $since = (string) $request->query('since', '');
        $sinceTs = $since !== '' ? CarbonImmutable::parse($since) : null;

        $query = Lead::query()->latest();
        if ($sinceTs !== null) {
            $query->where('created_at', '>', $sinceTs);
        }

        $rows = $query
            ->limit(10)
            ->get(['id', 'email', 'name', 'phone', 'agent_id', 'created_at'])
            ->map(fn (Lead $lead) => [
                'type' => 'lead',
                'id' => $lead->id,
                'email' => $lead->email,
                'name' => $lead->name,
                'phone' => $lead->phone,
                'agent_name' => $lead->agent?->name ?? 'agent',
                'inbox_url' => '/app/inbox/'.$lead->id,
                'created_at' => $lead->created_at?->toIso8601String(),
            ]);

        // Human requests
        $eventsQuery = \App\Models\Event::query()
            ->where('kind', 'human_requested')
            ->where('workspace_id', $workspace->id)
            ->latest();
        if ($sinceTs !== null) {
            $eventsQuery->where('created_at', '>', $sinceTs);
        }
        $humanRequests = $eventsQuery->limit(10)->get()
            ->map(fn ($event) => [
                'type' => 'human_request',
                'id' => (string) $event->id,
                'conversation_id' => $event->conversation_id,
                'agent_name' => $event->agent?->name ?? 'agent',
                'inbox_url' => '/app/inbox?conversation_id='.$event->conversation_id,
                'created_at' => $event->created_at?->toIso8601String(),
            ]);

        $all = $rows->concat($humanRequests)->sortByDesc('created_at')->values();

        $count24h = (int) Lead::query()
            ->where('created_at', '>=', now()->subDay())
            ->count();

        return response()->json([
            'data' => [
                'leads' => $all,
                'count_24h' => $count24h,
                'now' => now()->toIso8601String(),
            ],
        ]);
    }
}
