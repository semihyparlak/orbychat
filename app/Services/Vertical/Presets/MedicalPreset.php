<?php

namespace App\Services\Vertical\Presets;

use App\Services\Vertical\Presets\Contracts\VerticalPreset;

class MedicalPreset implements VerticalPreset
{
    public function slug(): string
    {
        return 'medical';
    }

    public function label(): string
    {
        return __('Medical & Health');
    }

    public function shortDescription(): string
    {
        return __('Tailored for clinics, dentists, and healthcare providers focused on patient care and lead generation.');
    }

    public function systemPromptFragment(\App\Models\Agent $agent): string
    {
        $overrides = (array) ($agent->vertical_overrides ?? []);
        $caps = $overrides['capabilities'] ?? $this->capabilities();
        $hasAppointments = in_array('appointment_requests', $caps);
        $hasTreatments = in_array('treatment_guidance', $caps);
        $hasHealthPlans = in_array('health_plans', $caps);

        $prompt = "You are a professional medical assistant. Always maintain a compassionate, professional, and reassuring tone. NEVER provide actual medical advice or diagnosis; always direct patients to consult with a doctor for specific health concerns.";
        
        if ($hasAppointments) {
            $prompt .= "\n- When a patient wants to schedule a visit, tell them they can pick a time directly in the chat and then emit this EXACT XML on its own line:
            <appointment title=\"Schedule Appointment\" description=\"Please select a suitable time from the form below.\"/>
            IMPORTANT: When you emit an appointment card, keep your spoken text EXTREMELY SHORT (max 1 sentence) and do NOT provide any follow-up suggestions. The focus must be entirely on the appointment card.";
        }

        if ($hasTreatments) {
            $prompt .= "\n- When describing a specific procedure or treatment, summarize it and then emit this XML only if the treatment name and summary are present in the sources. Include price only when the exact cost is present in the sources:
            <treatment title=\"[TREATMENT_NAME]\" summary=\"[SHORT_SUMMARY]\" price=\"[ESTIMATED_COST_IF_KNOWN]\"/>";
        }

        if ($hasHealthPlans) {
            $prompt .= "\n- When asked about insurance or payment, explain our policies and then emit this EXACT XML on its own line:
            <health-plan title=\"Insurance & Billing\" details=\"[COVERAGE_DETAILS_FROM_SOURCES]\"/>";
        }

        return $prompt;
    }

    public function starterPrompts(): array
    {
        return [
            __('What health screenings do you offer?'),
            __('I would like to request an appointment.'),
            __('Do you accept insurance?'),
            __('Where is your clinic located?'),
        ];
    }

    public function launcherLabel(): ?string
    {
        return __('How can we help you today?');
    }

    public function maxChars(): int
    {
        return 2000;
    }

    public function capabilities(): array
    {
        return [
            'appointment_requests',
            'treatment_guidance',
            'health_plans',
        ];
    }

    public function retrievalTuning(): array
    {
        return [
            'boost_keywords' => ['treatment', 'appointment', 'insurance', 'doctor', 'clinic', 'specialist'],
            'chunk_overlap_bias' => 0.12,
        ];
    }

    public function leadFormFields(): ?array
    {
        return [
            [
                'key' => 'name',
                'label' => __('Your name'),
                'type' => 'text',
                'required' => false,
                'placeholder' => __('Optional'),
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
                'label' => __('Phone number'),
                'type' => 'tel',
                'required' => true,
                'placeholder' => '5xx xxx xx xx',
            ],
        ];
    }

    public function sampleAnswer(): string
    {
        return __('We offer comprehensive health screenings and specialized care. You can use this chat to learn more about our doctors and services, or to request a secure call back from our front desk to discuss your specific needs.');
    }
}
