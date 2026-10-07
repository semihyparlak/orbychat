<?php

namespace App\Services\Vertical\Presets;

use App\Services\Vertical\Presets\Contracts\VerticalPreset;

class MarketingPreset implements VerticalPreset
{
    public function slug(): string
    {
        return 'marketing';
    }

    public function label(): string
    {
        return __('Marketing site');
    }

    public function shortDescription(): string
    {
        return __('Lead-capture pages, blog, and top-of-funnel content');
    }

    public function systemPromptFragment(\App\Models\Agent $agent): string
    {
        $overrides = (array) ($agent->vertical_overrides ?? []);
        $caps = $overrides['capabilities'] ?? $this->capabilities();
        $hasLeadCapture = in_array('lead_capture_inline', $caps);
        $hasDemo = in_array('demo_booking', $caps);
        $hasCaseStudy = in_array('case_study_card', $caps);

        $prompt = "You are a knowledgeable product expert. Your goal is to help visitors understand how we can solve their problems.

        How to behave:
        - Prioritize answering the visitor's questions accurately using the provided sources.
        - Be warm and professional. Speak as a helpful member of the team.
        - If the visitor's question is broad, provide a clear overview and then ask a gentle follow-up to guide them further.";

        if ($hasCaseStudy) {
            $prompt .= "\n- Case studies and testimonials are gold. When the sources contain one that fits the visitor's question AND the exact case-study URL is present in sources, cite it with [n] AND emit a case study card on its own line:
            <case-study title=\"[CASE_TITLE]\" outcome=\"[KEY_RESULT]\" url=\"[CASE_URL]\"/>";
        }

        if ($hasDemo) {
            $prompt .= "\n- When buying intent appears, surface the demo booking card:
            <ticket label=\"Book a Demo\"/>";
        }

        $prompt .= "\n- For pricing or scope questions where the sources don't have a number, propose a brief intake (\"I'd love to put together a tailored quote — could I take your email and one or two details about your project?\") instead of guessing a price.
        - Keep replies focused. One clear answer + one forward action beats a wall of features.";

        return $prompt;
    }

    public function starterPrompts(): array
    {
        return [
            'Tell me more about this',
            'How do I get started?',
            'Can I see a demo?',
        ];
    }

    public function launcherLabel(): ?string
    {
        return 'Ask about the product';
    }

    public function maxChars(): int
    {
        return 1800;
    }

    public function capabilities(): array
    {
        return [
            'lead_capture_inline',
            'demo_booking',
            'case_study_card',
        ];
    }

    public function retrievalTuning(): array
    {
        return [
            'boost_keywords' => ['service', 'case study', 'pricing', 'contact', 'consultation', 'demo'],
            'chunk_overlap_bias' => 0.08,
        ];
    }

    public function leadFormFields(): ?array
    {
        return null;
    }

    public function sampleAnswer(): string
    {
        return __('Our platform helps you scale your outreach and improve conversion rates through AI-driven insights. Would you like to see some case studies from similar businesses in your industry, or learn more about our campaign automation features?');
    }
}
