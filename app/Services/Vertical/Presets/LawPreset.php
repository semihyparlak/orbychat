<?php

namespace App\Services\Vertical\Presets;

use App\Services\Vertical\Presets\Contracts\VerticalPreset;

class LawPreset implements VerticalPreset
{
    public function slug(): string
    {
        return 'law';
    }

    public function label(): string
    {
        return __('Law & Legal');
    }

    public function shortDescription(): string
    {
        return __('Tailored for law firms and legal consultants providing general information and scheduling consultations.');
    }

    public function systemPromptFragment(\App\Models\Agent $agent): string
    {
        return "You are a professional legal assistant. Maintain a serious, authoritative, yet reassuring tone. NEVER provide binding legal advice or specific case predictions. Your primary goal is to provide general information based on knowledge sources and guide the visitor to schedule a formal consultation with an attorney.";
    }

    public function starterPrompts(): array
    {
        return [
            __('What areas of law do you specialize in?'),
            __('I need general info on [Legal Topic].'),
            __('How can I schedule a consultation?'),
            __('What are your service fees?'),
        ];
    }

    public function launcherLabel(): ?string
    {
        return __('Consult with us');
    }

    public function maxChars(): int
    {
        return 2500;
    }

    public function capabilities(): array
    {
        return ['appointment_requests', 'lead_capture'];
    }

    public function retrievalTuning(): array
    {
        return [
            'boost_keywords' => ['law', 'legal', 'consultation', 'attorney', 'lawyer', 'advice', 'case'],
            'chunk_overlap_bias' => 0.15,
        ];
    }

    public function leadFormFields(): ?array
    {
        return [
            [
                'key' => 'name',
                'label' => __('Name'),
                'type' => 'text',
                'required' => true,
                'placeholder' => __('Your full name'),
            ],
            [
                'key' => 'email',
                'label' => __('Email'),
                'type' => 'email',
                'required' => true,
                'placeholder' => 'email@example.com',
            ],
            [
                'key' => 'phone',
                'label' => __('Phone'),
                'type' => 'tel',
                'required' => true,
                'placeholder' => '05xx xxx xx xx',
            ],
            [
                'key' => 'case_type',
                'label' => __('Case Type'),
                'type' => 'text',
                'required' => false,
                'placeholder' => __('Briefly describe your situation'),
            ],
        ];
    }

    public function sampleAnswer(): string
    {
        return __('We specialize in corporate law, litigation, and family matters, providing strategic counsel tailored to your situation. While I cannot offer legal advice directly, I can provide info on our practice areas and help you schedule a confidential consultation with one of our partners.');
    }
}
