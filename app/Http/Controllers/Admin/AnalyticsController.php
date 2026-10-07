<?php

namespace App\Http\Controllers\Admin;

use App\Models\Agent;
use App\Models\ContentGap;
use App\Models\Conversation;
use App\Models\Lead;
use App\Models\Message;
use App\Support\CurrentWorkspace;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController
{
    public function __construct(private CurrentWorkspace $current) {}

    public function overview(Request $request): Response
    {
        $workspace = $this->current->get();
        abort_if($workspace === null, 404);

        $now = CarbonImmutable::now();
        $windowStart = $now->subDays(29)->startOfDay();
        $priorStart = $windowStart->subDays(30);
        $priorEnd = $windowStart->subSecond();

        $conversationsByDay = $this->dailyCount(
            Conversation::query()->where('is_playground', false),
            'started_at',
            $windowStart,
            $now,
        );
        $messagesByDay = $this->dailyCount(
            Message::query()->whereHas('conversation', fn ($query) => $query->where('is_playground', false)),
            'created_at',
            $windowStart,
            $now,
        );
        $leadsByDay = $this->dailyCount(
            Lead::query(),
            'created_at',
            $windowStart,
            $now,
        );

        $conversationPrior = (int) Conversation::query()
            ->where('is_playground', false)
            ->whereBetween('started_at', [$priorStart, $priorEnd])
            ->count();
        $messagePrior = (int) Message::query()
            ->whereHas('conversation', fn ($query) => $query->where('is_playground', false))
            ->whereBetween('created_at', [$priorStart, $priorEnd])
            ->count();
        $leadPrior = (int) Lead::query()
            ->whereBetween('created_at', [$priorStart, $priorEnd])
            ->count();

        $conversations = array_sum($conversationsByDay);
        $messages = array_sum($messagesByDay);
        $leads = array_sum($leadsByDay);

        $conversionSeries = $this->ratioSeries($leadsByDay, $conversationsByDay);
        $engagementSeries = $this->ratioSeries(
            $messagesByDay,
            $conversationsByDay,
            precision: 2,
            multiplier: 1,
        );

        $agentIds = Agent::query()->select('id');

        $conversationCountsByAgent = Conversation::query()
            ->where('is_playground', false)
            ->whereBetween('started_at', [$windowStart, $now])
            ->selectRaw('agent_id, COUNT(*) as conversations')
            ->groupBy('agent_id')
            ->pluck('conversations', 'agent_id');
        $leadCountsByAgent = Lead::query()
            ->whereBetween('created_at', [$windowStart, $now])
            ->selectRaw('agent_id, COUNT(*) as leads')
            ->groupBy('agent_id')
            ->pluck('leads', 'agent_id');
        $messageCountsByAgent = Message::query()
            ->join('conversations', 'conversations.id', '=', 'messages.conversation_id')
            ->where('conversations.is_playground', false)
            ->whereIn('conversations.agent_id', $agentIds)
            ->whereBetween('messages.created_at', [$windowStart, $now])
            ->selectRaw('conversations.agent_id as agent_id, COUNT(messages.id) as messages')
            ->groupBy('conversations.agent_id')
            ->pluck('messages', 'agent_id');
        $lastSeenByAgent = Conversation::query()
            ->where('is_playground', false)
            ->whereBetween('started_at', [$windowStart, $now])
            ->selectRaw('agent_id, MAX(started_at) as last_seen_at')
            ->groupBy('agent_id')
            ->pluck('last_seen_at', 'agent_id');

        $agents = Agent::query()
            ->orderBy('name')
            ->get(['id', 'name', 'is_published'])
            ->map(function (Agent $agent) use ($conversationCountsByAgent, $leadCountsByAgent, $messageCountsByAgent, $lastSeenByAgent) {
                $conversationCount = (int) ($conversationCountsByAgent[$agent->id] ?? 0);
                $leadCount = (int) ($leadCountsByAgent[$agent->id] ?? 0);
                $messageCount = (int) ($messageCountsByAgent[$agent->id] ?? 0);
                $lastSeenAt = $lastSeenByAgent[$agent->id] ?? null;

                return [
                    'id' => $agent->id,
                    'name' => $agent->name,
                    'is_published' => $agent->is_published,
                    'conversations' => $conversationCount,
                    'messages' => $messageCount,
                    'leads' => $leadCount,
                    'conversion_rate' => $this->ratio($leadCount, $conversationCount),
                    'last_seen_at' => $lastSeenAt === null
                        ? null
                        : CarbonImmutable::parse((string) $lastSeenAt)->toIso8601String(),
                ];
            })
            ->filter(fn (array $agent) => $agent['conversations'] > 0 || $agent['messages'] > 0 || $agent['leads'] > 0)
            ->sort(function (array $left, array $right) {
                return [$right['conversations'], $right['leads'], $left['name']]
                    <=> [$left['conversations'], $left['leads'], $right['name']];
            })
            ->take(6)
            ->values()
            ->all();

        $pageConversationRows = Conversation::query()
            ->where('is_playground', false)
            ->whereBetween('started_at', [$windowStart, $now])
            ->whereHas('agent', fn ($q) => $q->where('workspace_id', $workspace->id))
            ->selectRaw('page_url, COUNT(*) as conversations, MAX(started_at) as last_seen_at')
            ->groupBy('page_url')
            ->orderByDesc('conversations')
            ->limit(6)
            ->get();
        $pageLeadCounts = Lead::query()
            ->join('conversations', 'conversations.id', '=', 'leads.conversation_id')
            ->whereBetween('leads.created_at', [$windowStart, $now])
            ->whereHas('conversation.agent', fn ($q) => $q->where('workspace_id', $workspace->id))
            ->selectRaw('conversations.page_url as page_url, COUNT(leads.id) as leads')
            ->groupBy('conversations.page_url')
            ->pluck('leads', 'page_url');

        $pages = $pageConversationRows
            ->map(function ($row) use ($pageLeadCounts) {
                $rawUrl = (string) ($row->page_url ?? '');
                $pageLabel = $rawUrl !== '' ? $rawUrl : '(no page url)';
                return [
                    'page_url'        => $pageLabel,
                    'conversations'   => (int) $row->conversations,
                    'leads'           => (int) ($pageLeadCounts[$rawUrl] ?? 0),
                    'conversion_rate' => $this->ratio(
                        (int) ($pageLeadCounts[$rawUrl] ?? 0),
                        (int) $row->conversations,
                    ),
                    'last_seen_at' => $row->last_seen_at === null
                        ? null
                        : CarbonImmutable::parse((string) $row->last_seen_at)->toIso8601String(),
                ];
            })
            ->values()
            ->all();

        $openGapCount = (int) ContentGap::query()
            ->where('status', 'open')
            ->count();

        return Inertia::render('app/analytics/index', [
            'window' => [
                'from' => $windowStart->toIso8601String(),
                'to' => $now->toIso8601String(),
                'days' => array_keys($conversationsByDay),
            ],
            'metrics' => [
                'conversations' => [
                    'value' => $conversations,
                    'prior_value' => $conversationPrior,
                    'series' => array_values($conversationsByDay),
                ],
                'messages' => [
                    'value' => $messages,
                    'prior_value' => $messagePrior,
                    'series' => array_values($messagesByDay),
                ],
                'leads' => [
                    'value' => $leads,
                    'prior_value' => $leadPrior,
                    'series' => array_values($leadsByDay),
                ],
                'conversion_rate' => [
                    'value' => $this->ratio($leads, $conversations),
                    'prior_value' => $this->ratio($leadPrior, $conversationPrior),
                    'series' => array_values($conversionSeries),
                ],
                'engagement' => [
                    'value' => $this->ratio($messages, $conversations, precision: 2, multiplier: 1),
                    'prior_value' => $this->ratio($messagePrior, $conversationPrior, precision: 2, multiplier: 1),
                    'series' => array_values($engagementSeries),
                ],
            ],
            'chart' => [
                'days' => array_keys($conversationsByDay),
                'conversations' => array_values($conversationsByDay),
                'leads' => array_values($leadsByDay),
            ],
            'summary' => [
                'active_agents' => (int) Conversation::query()
                    ->where('is_playground', false)
                    ->whereBetween('started_at', [$windowStart, $now])
                    ->distinct()
                    ->count('agent_id'),
                'published_agents' => (int) Agent::query()
                    ->where('is_published', true)
                    ->count(),
                'pages_tracked' => (int) Conversation::query()
                    ->where('is_playground', false)
                    ->whereBetween('started_at', [$windowStart, $now])
                    ->whereNotNull('page_url')
                    ->where('page_url', '!=', '')
                    ->distinct()
                    ->count('page_url'),
                'open_gaps' => $openGapCount,
            ],
            'agents' => $agents,
            'pages' => $pages,
            'content_gaps' => [
                'open_count' => $openGapCount,
                'top' => ContentGap::query()
                    ->where('status', 'open')
                    ->orderByDesc('occurrences')
                    ->orderByDesc('last_seen_at')
                    ->limit(4)
                    ->get(['id', 'question', 'occurrences', 'last_seen_at'])
                    ->map(fn (ContentGap $gap) => [
                        'id' => $gap->id,
                        'question' => $gap->question,
                        'occurrences' => $gap->occurrences,
                        'last_seen_at' => $gap->last_seen_at?->toIso8601String(),
                    ])
                    ->values(),
            ],
        ]);
    }

    public function contentGaps(Request $request): Response
    {
        $gaps = ContentGap::query()
            ->where('status', 'open')
            ->orderByDesc('occurrences')
            ->limit(50)
            ->get();

        return Inertia::render('app/analytics/content-gaps', ['gaps' => $gaps]);
    }

    /**
     * @return array<string, int>
     */
    private function dailyCount(
        Builder $query,
        string $column,
        CarbonImmutable $from,
        CarbonImmutable $to,
    ): array {
        $rows = $query
            ->whereBetween($column, [$from, $to])
            ->selectRaw("DATE({$column}) as day, COUNT(*) as c")
            ->groupBy('day')
            ->pluck('c', 'day')
            ->toArray();

        $out = [];
        $cursor = $from->startOfDay();
        $end = $to->startOfDay();

        while ($cursor->lessThanOrEqualTo($end)) {
            $key = $cursor->format('Y-m-d');
            $out[$key] = (int) ($rows[$key] ?? 0);
            $cursor = $cursor->addDay();
        }

        return $out;
    }

    /**
     * @param  array<string, int>  $numerator
     * @param  array<string, int>  $denominator
     * @return array<string, float>
     */
    private function ratioSeries(
        array $numerator,
        array $denominator,
        int $precision = 1,
        int $multiplier = 100,
    ): array {
        $series = [];

        foreach ($numerator as $key => $value) {
            $series[$key] = $this->ratio(
                $value,
                (int) ($denominator[$key] ?? 0),
                precision: $precision,
                multiplier: $multiplier,
            );
        }

        return $series;
    }

    private function ratio(
        int|float $numerator,
        int|float $denominator,
        int $precision = 1,
        int $multiplier = 100,
    ): float {
        if ($denominator <= 0) {
            return 0.0;
        }

        return round(($numerator / $denominator) * $multiplier, $precision);
    }
}
