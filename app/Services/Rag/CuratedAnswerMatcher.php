<?php

namespace App\Services\Rag;

use App\Models\CuratedAnswer;
use Illuminate\Support\Facades\Cache;

class CuratedAnswerMatcher
{
    /**
     * Returns the answer text if a curated answer matches, else null.
     * V1: lowercase substring match on `question_pattern`.
     */
    public function match(string $agentId, string $userMessage, ?string $lang = null): ?string
    {
        $key = "curated:{$agentId}";
        /** @var array<int, array{pattern: string, answer: string, lang: ?string}> $entries */
        $entries = Cache::remember($key, 60, function () use ($agentId): array {
            return CuratedAnswer::query()->withoutWorkspaceScope()
                ->where('agent_id', $agentId)
                ->where('enabled', true)
                ->orderByDesc('priority')
                ->get()
                ->map(fn ($a) => [
                    'pattern' => mb_strtolower($a->question_pattern),
                    'answer' => $a->answer,
                    'lang' => $a->lang,
                ])
                ->all();
        });

        $needle = mb_strtolower(trim($userMessage));
        foreach ($entries as $entry) {
            if ($lang !== null && $entry['lang'] !== null && $entry['lang'] !== $lang) {
                continue;
            }
            if (str_contains($needle, $entry['pattern'])) {
                return $entry['answer'];
            }
        }

        return null;
    }
}
