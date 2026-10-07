<?php

namespace App\Services\Vertical\Presets;

use App\Services\Vertical\Presets\Contracts\VerticalPreset;

class TourismPreset implements VerticalPreset
{
    public function slug(): string
    {
        return 'tourism';
    }

    public function label(): string
    {
        return __('Tourism & Hospitality');
    }

    public function shortDescription(): string
    {
        return __('Tailored for hotels, travel agencies, and tour operators for bookings and guest support.');
    }

    public function systemPromptFragment(\App\Models\Agent $agent): string
    {
        return "You are a professional concierge and travel advisor. Your goal is to help visitors understand the amenities, availability, and local experiences we offer. Be welcoming, detailed, and focus on helping them plan their perfect stay or trip.";
    }

    public function starterPrompts(): array
    {
        return [
            __('Can you help me plan a custom trip?'),
            __('What are the check-in and check-out times?'),
            __('Do you offer airport transfers or local tours?'),
            __('Is breakfast or other meals included?'),
        ];
    }

    public function launcherLabel(): ?string
    {
        return __('Plan your trip');
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
            'boost_keywords' => ['hotel', 'room', 'booking', 'reservation', 'tour', 'travel', 'amenities', 'transfer'],
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
                'key' => 'dates',
                'label' => __('Preferred Dates'),
                'type' => 'text',
                'required' => false,
                'placeholder' => __('When are you planning to visit?'),
            ],
        ];
    }

    public function sampleAnswer(): string
    {
        return __('We curate premium travel experiences designed to create lasting memories. Whether you are looking for a private cruise, a luxury safari, or a bespoke city tour, I can help you build a custom itinerary and handle all the logistics. Where do you dream of visiting?');
    }
}
