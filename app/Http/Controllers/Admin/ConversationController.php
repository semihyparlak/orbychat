<?php

namespace App\Http\Controllers\Admin;

use App\Models\Agent;
use App\Models\Conversation;
use App\Models\Lead;
use App\Models\Message;
use App\Support\Pagination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Customer-facing conversation log — every visitor session for an
 * agent, with per-conversation full-thread drilldown. This is "what
 * are people actually asking?" — distinct from the Inbox (captured
 * leads) and Analytics (aggregates).
 */
class ConversationController
{
    public function workspaceIndex(Request $request): Response
    {
        $q = trim((string) $request->query('q', ''));

        $conversationsQuery = Conversation::query()
            ->where('is_playground', false)
            ->with(['agent:id,name', 'visitor:id,anonymous_id,first_seen_at'])
            ->orderByDesc('started_at');

        if ($q !== '') {
            $like = '%'.str_replace(['%', '_'], ['\%', '\_'], $q).'%';
            $conversationsQuery->where(function ($query) use ($like) {
                $query->where('page_url', 'like', $like)
                    ->orWhereIn('id', function ($sub) use ($like) {
                        $sub->select('conversation_id')
                            ->from('messages')
                            ->where('content', 'like', $like);
                    })
                    ->orWhereIn('visitor_id', function ($sub) use ($like) {
                        $sub->select('id')
                            ->from('visitors')
                            ->where('anonymous_id', 'like', $like);
                    })
                    ->orWhereHas('agent', fn ($agentQuery) => $agentQuery->where('name', 'like', $like));
            });
        }

        $paginator = $conversationsQuery->paginate(25)->withQueryString();

        $rows = collect($paginator->items())
            ->map(function (Conversation $conversation) {
                $firstUserMsg = Message::query()
                    ->where('conversation_id', $conversation->id)
                    ->where('role', 'user')
                    ->orderBy('created_at')
                    ->value('content');

                $lastActivityAt = Message::query()
                    ->where('conversation_id', $conversation->id)
                    ->whereIn('role', ['user', 'assistant', 'human-agent'])
                    ->latest('created_at')
                    ->first(['created_at'])?->created_at;

                $messageCount = Message::query()
                    ->where('conversation_id', $conversation->id)
                    ->whereIn('role', ['user', 'assistant', 'human-agent'])
                    ->count();

                return [
                    'id' => $conversation->id,
                    'started_at' => $conversation->started_at?->toIso8601String(),
                    'last_activity_at' => $lastActivityAt?->toIso8601String(),
                    'page_url' => $conversation->page_url,
                    'lang' => $conversation->lang,
                    'visitor_anon' => $conversation->visitor?->anonymous_id,
                    'is_returning' => $conversation->visitor?->first_seen_at?->lt(now()->subDay()) ?? false,
                    'message_count' => $messageCount,
                    'preview' => $firstUserMsg
                        ? mb_substr((string) $firstUserMsg, 0, 140)
                        : '(no messages yet)',
                    'agent' => $conversation->agent === null ? null : [
                        'id' => $conversation->agent->id,
                        'name' => $conversation->agent->name,
                    ],
                ];
            })
            ->values();

        $totalConversations = (int) Conversation::query()
            ->where('is_playground', false)
            ->count();
        $totalMessages = (int) Message::query()
            ->whereIn('role', ['user', 'assistant', 'human-agent'])
            ->whereHas('conversation', fn ($query) => $query->where('is_playground', false))
            ->count();
        $conversationsLast24h = (int) Conversation::query()
            ->where('is_playground', false)
            ->where('started_at', '>=', now()->subDay())
            ->count();
        $activeAgents = (int) Conversation::query()
            ->where('is_playground', false)
            ->distinct()
            ->count('agent_id');

        return Inertia::render('app/conversations/index', [
            'totals' => [
                'conversations' => $totalConversations,
                'messages' => $totalMessages,
                'last_24h' => $conversationsLast24h,
                'active_agents' => $activeAgents,
                'leads' => (int) Lead::query()->count(),
            ],
            'conversations' => $rows,
            'pagination' => Pagination::meta($paginator),
            'filters' => ['q' => $q],
        ]);
    }

    public function index(Request $request, Agent $agent): Response
    {
        $request->user()->can('view', $agent) || abort(403);

        $q = trim((string) $request->query('q', ''));

        // Per-conversation aggregates: message count, last message
        // preview, last activity. Cheap — single GROUP BY query.
        $aggregates = DB::table('messages')
            ->select(
                'conversation_id',
                DB::raw('COUNT(*) as msg_count'),
                DB::raw('MAX(created_at) as last_at'),
            )
            ->whereIn('role', ['user', 'assistant', 'human-agent'])
            ->whereIn('conversation_id', function ($sub) use ($agent) {
                $sub->select('id')
                    ->from('conversations')
                    ->where('agent_id', $agent->id);
            })
            ->groupBy('conversation_id')
            ->pluck('msg_count', 'conversation_id');

        $lastSeenAtByConv = DB::table('messages')
            ->select('conversation_id', DB::raw('MAX(created_at) as last_at'))
            ->whereIn('role', ['user', 'assistant', 'human-agent'])
            ->whereIn('conversation_id', function ($sub) use ($agent) {
                $sub->select('id')
                    ->from('conversations')
                    ->where('agent_id', $agent->id);
            })
            ->groupBy('conversation_id')
            ->pluck('last_at', 'conversation_id');

        $conversationsQuery = Conversation::query()
            ->withoutWorkspaceScope()
            ->where('agent_id', $agent->id)
            ->with('visitor:id,anonymous_id,first_seen_at')
            ->orderByDesc('started_at');

        if ($q !== '') {
            // Match on visitor anon_id, page_url, or message body.
            $like = '%'.str_replace(['%', '_'], ['\%', '\_'], $q).'%';
            $conversationsQuery->where(function ($qq) use ($like) {
                $qq->where('page_url', 'like', $like)
                    ->orWhereIn('id', function ($sub) use ($like) {
                        $sub->select('conversation_id')
                            ->from('messages')
                            ->where('content', 'like', $like);
                    })
                    ->orWhereIn('visitor_id', function ($sub) use ($like) {
                        $sub->select('id')
                            ->from('visitors')
                            ->where('anonymous_id', 'like', $like);
                    });
            });
        }

        $paginator = $conversationsQuery->paginate(25)->withQueryString();

        $conversations = collect($paginator->items())
            ->map(function (Conversation $c) use ($aggregates, $lastSeenAtByConv) {
                // First user message gives the most useful one-line preview.
                $firstUserMsg = Message::query()
                    ->where('conversation_id', $c->id)
                    ->where('role', 'user')
                    ->orderBy('created_at')
                    ->value('content');

                return [
                    'id' => $c->id,
                    'started_at' => $c->started_at?->toIso8601String(),
                    'last_activity_at' => $lastSeenAtByConv[$c->id] ?? $c->started_at?->toIso8601String(),
                    'page_url' => $c->page_url,
                    'lang' => $c->lang,
                    'visitor_anon' => $c->visitor?->anonymous_id,
                    'is_returning' => $c->visitor?->first_seen_at?->lt(now()->subDay()) ?? false,
                    'message_count' => (int) ($aggregates[$c->id] ?? 0),
                    'preview' => $firstUserMsg
                        ? mb_substr((string) $firstUserMsg, 0, 140)
                        : '(no messages yet)',
                ];
            })->values();

        // Top-line stats for the page header.
        $totalConversations = (int) Conversation::query()
            ->withoutWorkspaceScope()
            ->where('agent_id', $agent->id)
            ->count();
        $totalMessages = (int) DB::table('messages')
            ->whereIn('conversation_id', function ($sub) use ($agent) {
                $sub->select('id')
                    ->from('conversations')
                    ->where('agent_id', $agent->id);
            })
            ->count();
        $convsLast24h = (int) Conversation::query()
            ->withoutWorkspaceScope()
            ->where('agent_id', $agent->id)
            ->where('started_at', '>=', now()->subDay())
            ->count();

        return Inertia::render('app/agents/conversations', [
            'agent' => ['id' => $agent->id, 'name' => $agent->name],
            'totals' => [
                'conversations' => $totalConversations,
                'messages' => $totalMessages,
                'last_24h' => $convsLast24h,
            ],
            'conversations' => $conversations,
            'pagination' => Pagination::meta($paginator),
            'filters' => ['q' => $q],
        ]);
    }

    /**
     * Full thread view — every message in a single conversation.
     * Read-only. Live takeover lives separately via /app/inbox.
     */
    public function show(Request $request, Conversation $conversation): Response
    {
        $agent = $conversation->agent()->withoutWorkspaceScope()->firstOrFail();
        $request->user()->can('view', $agent) || abort(403);

        $messages = Message::query()
            ->where('conversation_id', $conversation->id)
            ->whereIn('role', ['user', 'assistant', 'human-agent'])
            ->orderBy('created_at')
            ->get(['id', 'role', 'content', 'citations', 'confidence', 'created_at'])
            ->map(fn (Message $m) => [
                'id' => (string) $m->id,
                'role' => $m->role,
                'content' => (string) $m->content,
                'citations' => $m->citations ?? [],
                'confidence' => $m->confidence !== null ? (float) $m->confidence : null,
                'created_at' => $m->created_at?->toIso8601String(),
            ])
            ->values();

        return Inertia::render('app/conversations/show', [
            'agent' => ['id' => $agent->id, 'name' => $agent->name],
            'conversation' => [
                'id' => $conversation->id,
                'started_at' => $conversation->started_at?->toIso8601String(),
                'page_url' => $conversation->page_url,
                'lang' => $conversation->lang,
                'visitor_anon' => $conversation->visitor()->withoutGlobalScopes()->value('anonymous_id'),
            ],
            'messages' => $messages,
        ]);
    }
}
