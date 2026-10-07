<?php

namespace App\Services\Vertical\Presets;

use App\Services\Vertical\Presets\Contracts\VerticalPreset;

class RealEstatePreset implements VerticalPreset
{
    public function slug(): string
    {
        return 'real_estate';
    }

    public function label(): string
    {
        return __('Real Estate');
    }

    public function shortDescription(): string
    {
        return __('Optimized for property listings, realtors, and agency websites focusing on lead generation and viewing requests.');
    }

    public function systemPromptFragment(\App\Models\Agent $agent): string
    {
        return "You are a professional real estate consultant. Your goal is to help visitors find the perfect property and guide them toward scheduling a viewing. Be professional, knowledgeable about property details (location, m2, amenities), and always encourage them to book a visit if they show interest.";
    }

    public function starterPrompts(): array
    {
        return [
            __('What properties are available in this area?'),
            __('I would like to schedule a viewing.'),
            __('What are the payment and financing terms?'),
            __('Is this property still available?'),
        ];
    }

    public function launcherLabel(): ?string
    {
        return __('Find your dream home');
    }

    public function maxChars(): int
    {
        return 2000;
    }

    public function capabilities(): array
    {
        return ['appointment_requests', 'lead_capture'];
    }

    public function retrievalTuning(): array
    {
        return [
            'boost_keywords' => ['property', 'apartment', 'house', 'viewing', 'rent', 'sale', 'location', 'price'],
            'chunk_overlap_bias' => 0.1,
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
        ];
    }

    public function sampleAnswer(): string
    {
        return __('We have an exclusive portfolio of properties in this area, from luxury downtown penthouses to quiet suburban family estates. I can filter these by your specific requirements — like square footage, amenities, or budget — and even set up a private tour for you. What is your ideal move-in date?');
    }
}
