<?php

namespace App\Http\Controllers\Admin\Platform;

use App\Models\Lead;
use App\Support\Pagination;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeadController
{
    public function index(Request $request): Response
    {
        $q = trim((string) $request->query('q', ''));

        $query = Lead::query()->withoutGlobalScopes()
            ->with(['agent:id,name,workspace_id', 'agent.workspace:id,name'])
            ->latest();

        if ($q !== '') {
            $query->where(function ($w) use ($q) {
                $w->where('email', 'like', "%{$q}%")
                    ->orWhere('name', 'like', "%{$q}%")
                    ->orWhere('phone', 'like', "%{$q}%");
            });
        }

        $paginator = $query->paginate(25)->withQueryString();

        $rows = collect($paginator->items())
            ->map(fn (Lead $l) => [
                'id' => $l->id,
                'email' => $l->email,
                'name' => $l->name,
                'status' => $l->status,
                'agent' => $l->agent?->only('id', 'name'),
                'workspace' => $l->agent?->workspace?->only('id', 'name'),
                'created_at' => $l->created_at?->toIso8601String(),
            ]);

        return Inertia::render('admin/leads/index', [
            'leads' => $rows,
            'pagination' => Pagination::meta($paginator),
            'filters' => ['q' => $q],
        ]);
    }
}
