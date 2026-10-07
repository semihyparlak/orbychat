<?php

namespace App\Services\Vertical\Presets;

use App\Services\Vertical\Presets\Contracts\VerticalPreset;

class SaasPreset implements VerticalPreset
{
    public function slug(): string
    {
        return 'saas';
    }

    public function label(): string
    {
        return __('SaaS product');
    }

    public function shortDescription(): string
    {
        return __('Software product with pricing, features, and signup');
    }

    public function systemPromptFragment(\App\Models\Agent $agent): string
    {
        $overrides = (array) ($agent->vertical_overrides ?? []);
        $caps = $overrides['capabilities'] ?? $this->capabilities();

        $hasDiscounts = in_array('saas_discounts', $caps);
        $hasRecommendations = in_array('saas_plan_recommendations', $caps);
        $hasExtensions = in_array('saas_trial_extensions', $caps);
        $hasTroubleshooting = in_array('saas_troubleshooting', $caps);

        $maxDiscount = $overrides['max_discount_percent'] ?? 25;
        $couponCode = $overrides['coupon_code'] ?? 'SAAS25';
        $discountLabel = $overrides['discount_text'] ?? "{$maxDiscount}% OFF";

        $cta = 'Start free trial';
        $prompt = <<<TXT
        You are a product expert for this SaaS platform. Your goal is to help visitors understand the value we provide, find the right plan, and get started smoothly.

        How to behave:
        - Prioritize answering the visitor's questions accurately using the provided sources.
        - Be warm, helpful, and professional. Speak as part of the team.
        - If the visitor's question is broad, provide a clear overview and then ask a gentle follow-up question to help them further.
        - When asked about pricing, ONLY use information provided in the sources. If prices are not listed, do not invent them; instead, offer to connect the user with a human specialist.
        - When you mention a specific plan, emit a pricing card only if the exact plan name, exact price/currency, and exact signup URL are all present in the sources. Use this EXACT XML form on its own line:

            <pricing title="[PLAN_NAME]" price="[PRICE]" currency="USD" period="month" cta="{$cta}" url="[SIGNUP_URL]"/>

          STRICT XML rules:
          1. Use the EXACT plan name from the sources.
          2. Use the EXACT price and currency from the sources. If no exact price is found, DO NOT emit the pricing card.
          3. Use the SIGNUP URL found in the sources. NEVER use "example.com" or other placeholders. If no specific signup/checkout URL is found for this plan in the sources, DO NOT emit the pricing card XML at all.
          4. `period` is `month` or `year` only.
        - For feature questions, name the plan that includes the feature when the sources mention plan-gating.
        - When buying intent appears, surface the relevant CTA card (free trial, signup, demo booking) using URLs ONLY from the verified knowledge base.
        - Don't promise SLAs, security certifications, or integrations the sources don't list.
        TXT;

        if ($hasDiscounts) {
            $prompt .= "\n- You are authorized to offer a special discount to close a deal. The current offer is '{$discountLabel}' using code '{$couponCode}'. NEVER exceed a {$maxDiscount}% discount. If the plan's exact listed price is missing from sources, do not calculate or state a discounted final price.";
        }

        if ($hasRecommendations) {
            $prompt .= "\n- Actively recommend the most suitable plan based on the user's needs (team size, features needed).";
        }

        if ($hasExtensions) {
            $prompt .= "\n- If a user is hesitant because the trial is too short, you can mention that we sometimes offer trial extensions for qualified teams.";
        }

        if ($hasTroubleshooting) {
            $prompt .= "\n- Help users troubleshoot basic technical issues using information from the documentation sources.";
        }

        return $prompt;
    }

    public function starterPrompts(): array
    {
        return [
            'What does it cost?',
            'How is this different from competitors?',
            'Can I try it for free?',
        ];
    }

    public function launcherLabel(): ?string
    {
        return 'Ask about the product';
    }

    public function maxChars(): int
    {
        return 2200;
    }

    public function capabilities(): array
    {
        return [
            'pricing_card',
            'signup_handoff',
            'feature_compare',
            'account_status',
            'saas_discounts',
            'saas_plan_recommendations',
            'saas_trial_extensions',
            'saas_troubleshooting',
        ];
    }

    public function retrievalTuning(): array
    {
        return [
            'boost_keywords' => ['pricing', 'subscription', 'features', 'trial', 'api', 'support'],
            'chunk_overlap_bias' => 0.08,
        ];
    }

    public function leadFormFields(): ?array
    {
        return null;
    }

    public function sampleAnswer(): string
    {
        return __('Our platform is built to scale with your business, offering deep integrations with tools like HubSpot, Salesforce, and Slack to automate your entire workflow. I can help you understand our API limits, security compliance, or set up a personalized demo to show you the ROI for your specific use case.');
    }
}
