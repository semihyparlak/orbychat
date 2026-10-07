<?php

namespace App\Http\Controllers\Admin\Platform;

use App\Models\UsageEvent;
use App\Models\Workspace;
use Inertia\Inertia;
use Inertia\Response;

class UsageController
{
    public function index(): Response
    {
        $thisMonth = UsageEvent::query()
            ->where('kind', 'conversation')
            ->where('occurred_at', '>=', now()->startOfMonth())
            ->selectRaw('workspace_id, sum(quantity) as conversations')
            ->groupBy('workspace_id')
            ->get();

        $workspaces = Workspace::query()->withoutGlobalScopes()
            ->whereIn('id', $thisMonth->pluck('workspace_id'))
            ->with('plan:id,name,monthly_conversations')
            ->get()
            ->keyBy('id');

        $rows = $thisMonth->map(function ($u) use ($workspaces) {
            $w = $workspaces->get($u->workspace_id);
            $limit = (int) ($w?->plan?->monthly_conversations ?? 0);
            $used = (int) $u->conversations;

            return [
                'workspace_id' => $u->workspace_id,
                'workspace_name' => $w?->name ?? '(deleted)',
                'plan' => $w?->plan?->name ?? '—',
                'used' => $used,
                'limit' => $limit,
                'percent' => $limit > 0 ? min(100, (int) round(($used / $limit) * 100)) : 0,
            ];
        })->sortByDesc('used')->values();

        return Inertia::render('admin/usage/index', [
            'rows' => $rows,
            'window' => 'this-month',
        ]);
    }
}
