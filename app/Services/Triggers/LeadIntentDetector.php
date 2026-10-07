<?php

namespace App\Services\Triggers;

use App\Models\Conversation;
use App\Models\Lead;
use App\Models\Message;
use Illuminate\Support\Facades\Cache;

/**
 * Decides whether the widget should surface the lead-capture form
 * alongside the assistant's reply on a given turn.
 *
 * Replaces the older keyword scan over the *assistant's* text with
 * a visitor-side intent detector — buying signals come from what the
 * visitor types ("how much does it cost?", "can I talk to sales?"),
 * not what the model writes back. Plus an engagement fallback so a
 * curious visitor who's been chatting for a few turns gets one
 * prompt even if they never used a high-intent phrase.
 *
 * Pure heuristic — no LLM call, runs synchronously in the hot path
 * after the stream completes. Designed to add < 5ms.
 */
class LeadIntentDetector
{
    /**
     * Visitor messages containing any of these substrings are treated
     * as buying-intent signals and the lead form is surfaced
     * immediately. Tuned for high precision: false positives feel
     * pushy, false negatives are caught by the engagement fallback.
     */
    private const HIGH_INTENT_KEYWORDS = [
        // Pricing / cost
        'pricing', 'how much', 'price', 'cost', 'quote', 'estimate',
        'discount', 'pay', 'payment',
        // Trials / demos
        'demo', 'free trial', 'try it', 'try this',
        // Sales / human contact
        'contact', 'reach out', 'reach you', 'get in touch',
        'talk to', 'speak to', 'speak with', 'human', 'person',
        'agent', 'representative', 'sales', 'someone',
        // Buying intent
        'buy', 'purchase', 'subscribe', 'sign up', 'signup',
        'get started', 'enterprise', 'custom plan', 'custom pricing',
        // Scheduling
        'schedule a call', 'book a call', 'book a meeting',
        'set up a call', 'jump on a call',
        // Direct asks
        'email me', 'send me', 'follow up', 'follow-up',
        'reach me', 'call me', 'text me',
    ];

    /**
     * Surface the form once the visitor has sent at least this many
     * turns without giving us their info. Catches "engaged but not
     * explicit" sessions where they're clearly invested but haven't
     * used a high-intent keyword.
     */
    private const ENGAGEMENT_THRESHOLD = 3;

    /**
     * After we've prompted, wait this many additional visitor turns
     * before being allowed to prompt again. Avoids spamming a visitor
     * who dismissed the form once.
     */
    private const REPROMPT_COOLDOWN = 5;

    public function shouldPrompt(Conversation $conversation, string $visitorMessage): bool
    {
        // Already gave us their info — never re-prompt for this
        // conversation. Lead capture is one-and-done per session.
        $hasLead = Lead::query()->withoutWorkspaceScope()
            ->where('conversation_id', $conversation->id)
            ->exists();

        if ($hasLead) {
            return false;
        }

        // Count visitor turns persisted so far. The current turn
        // hasn't hit the DB yet (PersistTurnJob runs in afterTurn),
        // so add one to include it in the engagement count.
        $persistedVisitorTurns = (int) Message::query()
            ->where('conversation_id', $conversation->id)
            ->where('role', 'user')
            ->count();
        $visitorTurns = $persistedVisitorTurns + 1;

        $lastPromptedTurn = (int) Cache::get($this->cacheKey($conversation->id), 0);

        // Already prompted recently — wait for the cooldown to elapse
        // before showing the form again.
        if ($lastPromptedTurn > 0
            && ($visitorTurns - $lastPromptedTurn) < self::REPROMPT_COOLDOWN) {
            return false;
        }

        $strategy = $conversation->agent->lead_trigger_strategy ?: 'engagement';

        if ($strategy === 'never') {
            return false;
        }

        // Strategy: "first_message" — Prompt immediately after the first visitor turn.
        if ($strategy === 'first_message') {
            if ($visitorTurns === 1) {
                $this->markPrompted($conversation->id, $visitorTurns);
                return true;
            }
            return false;
        }

        // Fast path: high-intent keyword in the visitor's own message.
        // Applies to both "engagement" and "keyword_only" strategies.
        if ($this->matchesHighIntent($visitorMessage)) {
            $this->markPrompted($conversation->id, $visitorTurns);

            return true;
        }

        if ($strategy === 'keyword_only') {
            return false;
        }

        // Strategy: "engagement" (default) — enough turns deep, prompt once.
        if ($visitorTurns >= self::ENGAGEMENT_THRESHOLD && $lastPromptedTurn === 0) {
            $this->markPrompted($conversation->id, $visitorTurns);

            return true;
        }

        return false;
    }

    private function cacheKey(string $conversationId): string
    {
        return "lead_prompt:conv:{$conversationId}";
    }

    private function matchesHighIntent(string $message): bool
    {
        $haystack = mb_strtolower($message);

        foreach (self::HIGH_INTENT_KEYWORDS as $needle) {
            if (str_contains($haystack, $needle)) {
                return true;
            }
        }

        return false;
    }

    private function markPrompted(string $conversationId, int $visitorTurns): void
    {
        Cache::put($this->cacheKey($conversationId), $visitorTurns, now()->addHours(2));
    }
}
