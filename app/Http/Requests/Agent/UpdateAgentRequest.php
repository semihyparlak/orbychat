<?php

namespace App\Http\Requests\Agent;

use App\Services\Vertical\VerticalPresets;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAgentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // gated by AgentPolicy::update at the controller
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'language_default' => ['sometimes', 'string', 'in:en,tr,es,fr,de,pt,ja,ar,zh'],
            'allowed_origins' => ['sometimes', 'array'],
            'allowed_origins.*' => ['string', 'max:500'],
            'restricted_paths' => ['sometimes', 'nullable', 'array', 'max:32'],
            'restricted_paths.*' => ['string', 'max:200'],
            'system_prompt' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'confidence_threshold' => ['sometimes', 'numeric', 'min:0', 'max:1'],
            'persona' => ['sometimes', 'array'],
            'theme' => ['sometimes', 'array'],
            'guardrails' => ['sometimes', 'array'],
            'starter_prompts' => ['sometimes', 'nullable', 'array', 'max:6'],
            'starter_prompts.*' => ['string', 'max:80'],
            'auto_index_visited_pages' => ['sometimes', 'boolean'],
            'require_lead_before_chat' => ['sometimes', 'boolean'],
            'lead_form_fields' => ['sometimes', 'nullable', 'array', 'max:12'],
            'lead_form_fields.*.key' => ['required_with:lead_form_fields.*', 'string', 'max:64', 'regex:/^[a-z][a-z0-9_]*$/'],
            'lead_form_fields.*.label' => ['required_with:lead_form_fields.*', 'string', 'max:120'],
            'lead_form_fields.*.type' => ['required_with:lead_form_fields.*', 'string', 'in:text,email,tel,textarea,select,checkbox'],
            'lead_form_fields.*.required' => ['sometimes', 'boolean'],
            'lead_form_fields.*.placeholder' => ['sometimes', 'nullable', 'string', 'max:120'],
            'lead_form_fields.*.maxlength' => ['sometimes', 'nullable', 'integer', 'min:1', 'max:4000'],
            'lead_form_fields.*.options' => ['sometimes', 'array', 'max:24'],
            'lead_form_fields.*.options.*' => ['string', 'max:120'],
            'site_type' => ['sometimes', 'nullable', 'string', Rule::in(VerticalPresets::SLUGS)],
            'vertical_overrides' => ['sometimes', 'nullable', 'array'],
            'vertical_overrides.capabilities' => ['sometimes', 'array'],
            'vertical_overrides.capabilities.*' => ['string', 'max:64'],
            'vertical_overrides.starter_prompts' => ['sometimes', 'array', 'max:6'],
            'vertical_overrides.starter_prompts.*' => ['string', 'max:80'],
            'vertical_overrides.max_discount_percent' => ['sometimes', 'integer', 'min:0', 'max:100'],
            'vertical_overrides.coupon_code' => ['sometimes', 'nullable', 'string', 'max:64'],
            'vertical_overrides.discount_text' => ['sometimes', 'nullable', 'string', 'max:120'],
        ];
    }
}
