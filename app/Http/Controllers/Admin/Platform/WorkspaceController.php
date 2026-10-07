<?php

namespace App\Http\Controllers\Admin\Platform;

use App\Models\Agent;
use App\Models\Conversation;
use App\Models\Lead;
use App\Models\Workspace;
use App\Support\Pagination;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkspaceController
{
    public function index(Request $request): Response
    {
        $q = trim((string) $request->query('q', ''));

        $query = Workspace::query()->withoutGlobalScopes()
            ->with(['plan:id,name,slug', 'owner:id,name,email'])
            ->withCount(['agents', 'workspaceUsers as members_count'])
            ->latest();

        if ($q !== '') {
            $query->where(function ($w) use ($q) {
                $like = "%{$q}%";
                $w->where('name', 'like', $like)
                    ->orWhere('slug', 'like', $like)
                    ->orWhereHas('owner', function ($o) use ($like) {
                        $o->where('name', 'like', $like)
                            ->orWhere('email', 'like', $like);
                    });
            });
        }

        $paginator = $query->paginate(25)->withQueryString();

        $rows = collect($paginator->items())
            ->map(fn (Workspace $w) => [
                'id' => $w->id,
                'name' => $w->name,
                'slug' => $w->slug,
                'plan' => $w->plan?->only('name', 'slug'),
                'owner' => $w->owner?->only('id', 'name', 'email'),
                'agents_count' => $w->agents_count,
                'members_count' => $w->members_count,
                'created_at' => $w->created_at?->toIso8601String(),
            ]);

        return Inertia::render('admin/workspaces/index', [
            'workspaces' => $rows,
            'pagination' => Pagination::meta($paginator),
            'filters' => ['q' => $q],
        ]);
    }

    public function show(Request $request, Workspace $workspace): Response
    {
        // Workspace model has no global scope, but agents/leads/conversations under it do.
        $agents = Agent::query()->withoutGlobalScopes()
            ->where('workspace_id', $workspace->id)
            ->get(['id', 'name', 'is_published', 'language_default', 'created_at']);

        $conversationCount = Conversation::query()->withoutGlobalScopes()
            ->whereHas('agent', fn ($q) => $q->where('workspace_id', $workspace->id))
            ->count();

        $leadCount = Lead::query()->withoutGlobalScopes()
            ->whereHas('agent', fn ($q) => $q->where('workspace_id', $workspace->id))
            ->count();

        return Inertia::render('admin/workspaces/show', [
            'workspace' => [
                'id' => $workspace->id,
                'name' => $workspace->name,
                'slug' => $workspace->slug,
                'plan' => $workspace->plan?->only('name', 'slug', 'monthly_conversations', 'price_cents'),
                'owner' => $workspace->owner?->only('id', 'name', 'email'),
                'created_at' => $workspace->created_at?->toIso8601String(),
            ],
            'agents' => $agents,
            'metrics' => [
                'conversations' => $conversationCount,
                'leads' => $leadCount,
            ],
        ]);
    }
}
