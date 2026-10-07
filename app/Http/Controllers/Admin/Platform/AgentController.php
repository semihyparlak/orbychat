<?php

namespace App\Http\Controllers\Admin\Platform;

use App\Models\Agent;
use App\Support\Pagination;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AgentController
{
    public function index(Request $request): Response
    {
        $q = trim((string) $request->query('q', ''));

        $query = Agent::query()->withoutGlobalScopes()
            ->with(['workspace:id,name,slug'])
            ->withCount(['sources', 'conversations'])
            ->latest('updated_at');

        if ($q !== '') {
            $query->where(function ($w) use ($q) {
                $like = "%{$q}%";
                $w->where('name', 'like', $like)
                    ->orWhereHas('workspace', fn ($ws) => $ws->where('name', 'like', $like));
            });
        }

        $paginator = $query->paginate(25)->withQueryString();

        $rows = collect($paginator->items())
            ->map(fn (Agent $a) => [
                'id' => $a->id,
                'name' => $a->name,
                'is_published' => $a->is_published,
                'language_default' => $a->language_default,
                'workspace' => $a->workspace?->only('id', 'name'),
                'sources_count' => $a->sources_count,
                'conversations_count' => $a->conversations_count,
                'updated_at' => $a->updated_at?->toIso8601String(),
            ]);

        return Inertia::render('admin/agents/index', [
            'agents' => $rows,
            'pagination' => Pagination::meta($paginator),
            'filters' => ['q' => $q],
        ]);
    }
}
