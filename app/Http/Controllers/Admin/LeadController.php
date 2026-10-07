<?php

namespace App\Http\Controllers\Admin;

use App\Models\Agent;
use App\Models\Lead;
use App\Support\Pagination;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeadController
{
    public function agentIndex(Request $request, Agent $agent): Response
    {
        $request->user()->can('view', $agent) || abort(403);

        $q = trim((string) $request->query('q', ''));

        $query = Lead::query()
            ->where('agent_id', $agent->id)
            ->with(['conversation:id,page_url,started_at'])
            ->latest();

        if ($q !== '') {
            $like = '%'.str_replace(['%', '_'], ['\\%', '\\_'], $q).'%';
            $query->where(function ($where) use ($like) {
                $where->where('email', 'like', $like)
                    ->orWhere('name', 'like', $like)
                    ->orWhere('phone', 'like', $like)
                    ->orWhereHas('conversation', fn ($conversationQuery) => $conversationQuery->where('page_url', 'like', $like));
            });
        }

        $paginator = $query->paginate(25)->withQueryString();

        $leads = collect($paginator->items())
            ->map(fn (Lead $lead) => [
                'id' => $lead->id,
                'email' => $lead->email,
                'name' => $lead->name,
                'phone' => $lead->phone,
                'status' => $lead->status,
                'page_url' => $lead->conversation?->page_url,
                'created_at' => $lead->created_at?->toIso8601String(),
            ])
            ->values();

        return Inertia::render('app/agents/leads', [
            'agent' => [
                'id' => $agent->id,
                'name' => $agent->name,
            ],
            'totals' => [
                'leads' => (int) Lead::query()->where('agent_id', $agent->id)->count(),
                'qualified' => (int) Lead::query()
                    ->where('agent_id', $agent->id)
                    ->whereIn('status', ['qualified', 'contacted', 'won'])
                    ->count(),
                'with_email' => (int) Lead::query()
                    ->where('agent_id', $agent->id)
                    ->whereNotNull('email')
                    ->where('email', '!=', '')
                    ->count(),
                'with_phone' => (int) Lead::query()
                    ->where('agent_id', $agent->id)
                    ->whereNotNull('phone')
                    ->where('phone', '!=', '')
                    ->count(),
            ],
            'leads' => $leads,
            'pagination' => Pagination::meta($paginator),
            'filters' => ['q' => $q],
        ]);
    }

    public function index(Request $request): Response
    {
        $q = trim((string) $request->query('q', ''));
        $view = (string) $request->query('view', 'all');
        $sort = (string) $request->query('sort', 'created_desc');
        $phone = (string) $request->query('phone', 'all');

        if (! in_array($view, ['all', 'new', 'qualified', 'contacted', 'won', 'lost'], true)) {
            $view = 'all';
        }

        if (! in_array($sort, ['created_desc', 'created_asc', 'name_asc', 'name_desc'], true)) {
            $sort = 'created_desc';
        }

        if (! in_array($phone, ['all', 'with_phone', 'without_phone'], true)) {
            $phone = 'all';
        }

        $query = Lead::query()
            ->with(['conversation:id,page_url,started_at']);

        if ($q !== '') {
            $query->where(function ($w) use ($q) {
                $like = "%{$q}%";
                $w->where('email', 'like', $like)
                    ->orWhere('name', 'like', $like)
                    ->orWhere('phone', 'like', $like);
            });
        }

        if ($view !== 'all') {
            $query->where('status', $view);
        }

        if ($phone === 'with_phone') {
            $query->whereNotNull('phone')->where('phone', '!=', '');
        }

        if ($phone === 'without_phone') {
            $query->where(function ($where) {
                $where->whereNull('phone')->orWhere('phone', '');
            });
        }

        match ($sort) {
            'created_asc' => $query->oldest(),
            'name_asc' => $query->orderByRaw('coalesce(name, email) asc'),
            'name_desc' => $query->orderByRaw('coalesce(name, email) desc'),
            default => $query->latest(),
        };

        $paginator = $query->paginate(25)->withQueryString();

        $leads = collect($paginator->items())
            ->map(fn (Lead $l) => [
                'id' => $l->id,
                'email' => $l->email,
                'name' => $l->name,
                'phone' => $l->phone,
                'status' => $l->status,
                'page_url' => $l->conversation?->page_url,
                'created_at' => $l->created_at?->toIso8601String(),
            ]);

        return Inertia::render('app/inbox/index', [
            'leads' => $leads,
            'pagination' => Pagination::meta($paginator),
            'filters' => [
                'q' => $q,
                'view' => $view,
                'sort' => $sort,
                'phone' => $phone,
            ],
        ]);
    }

    public function show(Request $request, Lead $lead): Response
    {
        $request->user()->can('view', $lead) || abort(403);

        $conversation = $lead->conversation()->withoutGlobalScopes()->first();

        $messages = $conversation
            ?->messages()
            ?->orderBy('created_at')
            ?->get(['id', 'role', 'content', 'citations', 'created_at']);

        $claimedBy = $conversation?->claimedBy()->withoutGlobalScopes()->first();

        return Inertia::render('app/inbox/show', [
            'lead' => $lead,
            'messages' => $messages,
            'conversation' => $conversation === null ? null : [
                'id' => $conversation->id,
                'claimed_by' => $claimedBy?->only('id', 'name'),
                'claimed_at' => $conversation->claimed_at?->toIso8601String(),
            ],
            'me' => ['id' => $request->user()->id, 'name' => $request->user()->name],
        ]);
    }

    public function update(Request $request, Lead $lead): RedirectResponse
    {
        $request->user()->can('update', $lead) || abort(403);

        $lead->update($request->validate([
            'status' => ['sometimes', 'in:new,qualified,contacted,won,lost'],
            'owner_user_id' => ['sometimes', 'nullable', 'integer'],
        ]));

        return back()->with('success', 'Lead updated.');
    }
}
