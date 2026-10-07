<?php

namespace App\Http\Controllers\Admin\Platform;

use App\Models\Conversation;
use App\Support\Pagination;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ConversationController
{
    public function index(Request $request): Response
    {
        $q = trim((string) $request->query('q', ''));

        $query = Conversation::query()->withoutGlobalScopes()
            ->with(['agent:id,name,workspace_id', 'agent.workspace:id,name'])
            ->withCount('messages')
            ->latest('started_at');

        if ($q !== '') {
            // Match against the page URL directly + the related agent /
            // workspace names. EXISTS subqueries beat joining + DISTINCT
            // on a list this size.
            $query->where(function ($w) use ($q) {
                $like = "%{$q}%";
                $w->where('page_url', 'like', $like)
                    ->orWhereHas('agent', fn ($a) => $a->where('name', 'like', $like))
                    ->orWhereHas('agent.workspace', fn ($ws) => $ws->where('name', 'like', $like));
            });
        }

        $paginator = $query->paginate(25)->withQueryString();

        $rows = collect($paginator->items())
            ->map(fn (Conversation $c) => [
                'id' => $c->id,
                'agent' => $c->agent?->only('id', 'name'),
                'workspace' => $c->agent?->workspace?->only('id', 'name'),
                'page_url' => $c->page_url,
                'lang' => $c->lang,
                'is_lead' => $c->is_lead,
                'is_playground' => $c->is_playground,
                'message_count' => $c->messages_count,
                'started_at' => $c->started_at?->toIso8601String(),
            ]);

        return Inertia::render('admin/conversations/index', [
            'conversations' => $rows,
            'pagination' => Pagination::meta($paginator),
            'filters' => ['q' => $q],
        ]);
    }
}
