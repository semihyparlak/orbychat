<?php

namespace App\Services\Vertical\Presets;

use App\Services\Vertical\Presets\Contracts\VerticalPreset;

class InternalKbPreset implements VerticalPreset
{
    public function slug(): string
    {
        return 'internal_kb';
    }

    public function label(): string
    {
        return __('Internal knowledge base');
    }

    public function shortDescription(): string
    {
        return __('Employee wiki, runbooks, and internal documentation');
    }

    public function systemPromptFragment(\App\Models\Agent $agent): string
    {
        return <<<'TXT'
        This is an internal knowledge base for employees. When answering:
        - Speak to a colleague, not a customer — drop sales language and marketing copy.
        - When the sources include team owners, escalation contacts, or oncall channels, surface them by name when relevant.
        - For policy / compliance questions, quote the source verbatim where wording matters; never paraphrase regulatory text.
        - If the question is ambiguous between teams (e.g. "who owns billing?"), list every match the sources contain — the visitor will pick.
        TXT;
    }

    public function starterPrompts(): array
    {
        return [
            __('What is our PTO policy?'),
            __('Who owns billing?'),
            __('How do I file an expense?'),
        ];
    }

    public function launcherLabel(): ?string
    {
        return null;
    }

    public function maxChars(): int
    {
        return 2400;
    }

    public function capabilities(): array
    {
        return [
            'policy_lookup',
            'team_handoff',
            'auth_aware',
        ];
    }

    public function retrievalTuning(): array
    {
        return [
            'boost_keywords' => ['policy', 'owner', 'oncall', 'runbook', 'sla', 'team'],
            'chunk_overlap_bias' => 0.12,
        ];
    }

    public function leadFormFields(): ?array
    {
        return null;
    }

    public function sampleAnswer(): string
    {
        return __('You can find our latest internal policies and procedure manuals here. If you are looking for HR forms, IT support guides, or company-wide announcements, I can point you to the right document immediately.');
    }
}
