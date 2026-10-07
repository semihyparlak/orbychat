<?php

namespace App\Services\Vertical\Presets;

use App\Services\Vertical\Presets\Contracts\VerticalPreset;

class HelpCenterPreset implements VerticalPreset
{
    public function slug(): string
    {
        return 'help_center';
    }

    public function label(): string
    {
        return __('Help center');
    }

    public function shortDescription(): string
    {
        return __('Support articles, FAQs, and ticket triage');
    }

    public function systemPromptFragment(\App\Models\Agent $agent): string
    {
        $overrides = (array) ($agent->vertical_overrides ?? []);
        $caps = $overrides['capabilities'] ?? $this->capabilities();
        $hasKb = in_array('kb_article_card', $caps);
        $hasTicket = in_array('ticket_escalation', $caps);
        $hasSentiment = in_array('sentiment_routing', $caps);

        $prompt = "This is a help center / knowledge base. When answering:\n- Treat every visitor question as someone potentially blocked. Lead with the resolution; explain context only after.\n- When the sources contain numbered steps, preserve the numbering.";

        if ($hasKb) {
            $prompt .= "\n- When recommending a specific help article, emit this XML only when the exact article title and URL appear in the sources:
            <kb-article title=\"[ARTICLE_TITLE]\" url=\"[ARTICLE_URL]\"/>";
        } else {
            $prompt .= "\n- If the visitor's question matches an existing FAQ entry, cite it directly with [n].";
        }

        if ($hasTicket) {
            $prompt .= "\n- If the issue cannot be resolved by the bot, offer to escalate and then emit:
            <ticket label=\"Talk to a human\"/>";
        }

        if ($hasSentiment) {
            $prompt .= "\n- Be highly sensitive to frustration. If the visitor is angry, apologize sincerely and offer human escalation immediately.";
        }

        $prompt .= "\n- Keep apologies brief — one acknowledgement, then move to the fix.";

        return $prompt;
    }

    public function starterPrompts(): array
    {
        return [
            'I need help with my account',
            'How do I reset my password?',
            'I want to talk to a human',
        ];
    }

    public function launcherLabel(): ?string
    {
        return 'Get help';
    }

    public function maxChars(): int
    {
        return 2400;
    }

    public function capabilities(): array
    {
        return [
            'ticket_escalation',
            'kb_article_card',
            'sentiment_routing',
        ];
    }

    public function retrievalTuning(): array
    {
        return [
            'boost_keywords' => ['fix', 'error', 'troubleshoot', 'reset', 'cancel', 'refund'],
            'chunk_overlap_bias' => 0.12,
        ];
    }

    public function leadFormFields(): ?array
    {
        return null;
    }

    public function sampleAnswer(): string
    {
        return __('I can assist you with technical troubleshooting, billing inquiries, or navigating our platform features. If you are experiencing an issue, I can search our knowledge base for a step-by-step fix or escalate this to our support team for a priority response.');
    }
}
