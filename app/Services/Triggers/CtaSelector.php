<?php

namespace App\Services\Triggers;

use App\Models\Conversation;
use App\Models\CtaRule;
use Illuminate\Support\Facades\Cache;

/**
 * Picks at most one CTA to surface alongside an assistant turn.
 *
 * v1 strategy: lowest-cost rules first (URL match + lang). Higher-priority
 * rules win ties. Returns null if nothing matches.
 */
class CtaSelector
{
    /**
     * @return array<int, array{label: string, kind: string, url: ?string}>
     */
    public function select(Conversation $conversation, string $assistantText): array
    {
        $rules = $this->loadRules($conversation->agent_id);
        if ($rules === []) {
            return [];
        }

        $pageUrl = (string) ($conversation->page_url ?? '');
        $lang = (string) ($conversation->lang ?? '');
        $found = [];

        foreach ($rules as $rule) {
            if (! $this->matches($rule, $pageUrl, $lang, $assistantText)) {
                continue;
            }

            $target = (array) ($rule['target'] ?? []);

            $found[] = [
                'label' => (string) $rule['label'],
                'kind' => (string) $rule['kind'],
                'url' => isset($target['url']) ? (string) $target['url'] : null,
            ];

            if (count($found) >= 3) {
                break;
            }
        }

        return $found;
    }

    /**
     * Heuristic: when the assistant's text suggests sharing an email or
     * scheduling, return true to indicate the lead form should render.
     */
    public function shouldPromptForLead(string $assistantText): bool
    {
        $haystack = mb_strtolower($assistantText);
        foreach ([
            'share your email',
            'leave your email',
            "i'll have someone email you",
            'capture your email',
            'connect you with',
            'book a',
            'schedule a',
        ] as $needle) {
            if (str_contains($haystack, $needle)) {
                return true;
            }
        }

        return false;
    }

    /**
     * @return array<int, array{kind: string, label: string, conditions: array, target: array, priority: int}>
     */
    private function loadRules(string $agentId): array
    {
        return Cache::remember("cta_rules:{$agentId}", 60, function () use ($agentId) {
            return CtaRule::query()->withoutWorkspaceScope()
                ->where('agent_id', $agentId)
                ->where('enabled', true)
                ->orderByDesc('priority')
                ->get(['kind', 'label', 'conditions', 'target', 'priority'])
                ->map(fn ($r) => [
                    'kind' => $r->kind,
                    'label' => $r->label,
                    'conditions' => (array) ($r->conditions ?? []),
                    'target' => (array) ($r->target ?? []),
                    'priority' => (int) $r->priority,
                ])
                ->all();
        });
    }

    /**
     * @param  array{kind: string, label: string, conditions: array, target: array, priority: int}  $rule
     */
    private function matches(array $rule, string $pageUrl, string $lang, string $assistantText): bool
    {
        $conditions = $rule['conditions'];

        if (! empty($conditions['url_contains']) && is_string($conditions['url_contains'])) {
            if (! str_contains($pageUrl, $conditions['url_contains'])) {
                return false;
            }
        }

        if (! empty($conditions['lang']) && is_string($conditions['lang'])) {
            if ($lang !== '' && $lang !== $conditions['lang']) {
                return false;
            }
        }

        if (! empty($conditions['intent_keywords']) && is_array($conditions['intent_keywords'])) {
            $assistantLower = mb_strtolower($assistantText);
            $hit = false;
            foreach ($conditions['intent_keywords'] as $kw) {
                if (! is_string($kw)) {
                    continue;
                }
                if (str_contains($assistantLower, mb_strtolower($kw))) {
                    $hit = true;
                    break;
                }
            }
            if (! $hit) {
                return false;
            }
        }

        return true;
    }
}
