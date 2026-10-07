<?php

namespace App\Services\Vertical\Presets;

use App\Services\Vertical\Presets\Contracts\VerticalPreset;

class EducationPreset implements VerticalPreset
{
    public function slug(): string
    {
        return 'education';
    }

    public function label(): string
    {
        return __('Education & Training');
    }

    public function shortDescription(): string
    {
        return __('Built for schools, course providers, and LMS platforms to guide students and handle registrations.');
    }

    public function systemPromptFragment(\App\Models\Agent $agent): string
    {
        return "You are an academic advisor. Your goal is to help prospective students understand the curriculum, certification benefits, and registration process. Be encouraging, clear, and focused on helping them start their learning journey.";
    }

    public function starterPrompts(): array
    {
        return [
            __('What is the course curriculum?'),
            __('Is there a certification upon completion?'),
            __('How can I register for the next term?'),
            __('Are there any scholarships or discounts?'),
        ];
    }

    public function launcherLabel(): ?string
    {
        return __('Start learning today');
    }

    public function maxChars(): int
    {
        return 2200;
    }

    public function capabilities(): array
    {
        return ['lead_capture'];
    }

    public function retrievalTuning(): array
    {
        return [
            'boost_keywords' => ['course', 'curriculum', 'registration', 'enroll', 'certification', 'student', 'training'],
            'chunk_overlap_bias' => 0.12,
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
                'key' => 'interest',
                'label' => __('Course of Interest'),
                'type' => 'text',
                'required' => false,
                'placeholder' => __('Which course are you interested in?'),
            ],
        ];
    }

    public function sampleAnswer(): string
    {
        return __('Our curriculum is built by industry experts to ensure you gain practical skills. We offer flexible learning paths, including evening sessions and intensive bootcamps, all backed by 1-on-1 mentor support. Would you like to see a detailed syllabus or attend an open house?');
    }
}
