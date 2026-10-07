<?php

namespace App\Services\Vertical\Presets;

use App\Services\Vertical\Presets\Contracts\VerticalPreset;

class DocumentationPreset implements VerticalPreset
{
    public function slug(): string
    {
        return 'documentation';
    }

    public function label(): string
    {
        return __('Documentation');
    }

    public function shortDescription(): string
    {
        return __('Technical docs, API references, and guides');
    }

    public function systemPromptFragment(\App\Models\Agent $agent): string
    {
        $overrides = (array) ($agent->vertical_overrides ?? []);
        $caps = $overrides['capabilities'] ?? $this->capabilities();
        $hasCode = in_array('code_block', $caps);
        $hasApi = in_array('api_reference_card', $caps);
        $hasVersion = in_array('version_picker', $caps);
        $hasTroubleshoot = in_array('troubleshoot_steps', $caps);

        $prompt = "This is a technical documentation site. When answering:\n- Cite the doc page URL using [n] markers — readers expect to deep-link into the docs.";

        if ($hasCode) {
            $prompt .= "\n- When providing a code example, use this EXACT XML form on its own line:
            <code language=\"[LANG]\" code=\"[CODE_CONTENT]\"/>";
        } else {
            $prompt .= "\n- Include code examples whenever the sources contain them. Preserve formatting, indentation, and the original language tag (bash, ts, php, etc.).";
        }

        if ($hasApi) {
            $prompt .= "\n- When mentioning an API endpoint, emit this XML only when the method, endpoint path, and title all appear in the sources:
            <api-ref method=\"[GET|POST|PUT|DELETE]\" url=\"[ENDPOINT_PATH]\" title=\"[ENDPOINT_TITLE]\"/>";
        }

        if ($hasVersion) {
            $prompt .= "\n- When multiple versions exist, surface the version picker:
            <version current=\"[CURRENT_VERSION]\" available=\"[V1, V2, ...]\"/>";
        }

        if ($hasTroubleshoot) {
            $prompt .= "\n- For 'how do I...' questions or errors, use the troubleshoot card:
            <troubleshoot title=\"[TITLE]\" steps=\"[STEP 1] | [STEP 2] | [STEP 3]\"/>";
        }

        $prompt .= "\n- For 'how do I…' questions, structure the answer as numbered steps; each step should be runnable on its own.\n- If multiple SDKs / languages are documented, ask which one they want unless the question already names it.";

        return $prompt;
    }

    public function starterPrompts(): array
    {
        return [
            'How do I get started?',
            'Show me a quickstart example',
            'Where is the API reference?',
        ];
    }

    public function launcherLabel(): ?string
    {
        return 'Search docs';
    }

    public function maxChars(): int
    {
        return 3000;
    }

    public function capabilities(): array
    {
        return [
            'code_block',
            'api_reference_card',
            'version_picker',
            'troubleshoot_steps',
        ];
    }

    public function retrievalTuning(): array
    {
        return [
            'boost_keywords' => ['example', 'usage', 'parameter', 'returns', 'method', 'endpoint'],
            'chunk_overlap_bias' => 0.15,
        ];
    }

    public function leadFormFields(): ?array
    {
        return null;
    }

    public function sampleAnswer(): string
    {
        return __('The integration process is designed to be developer-friendly. You can either use our dedicated NPM package for modern environments or simply drop a single async script tag into your HTML. I can walk you through the Quick Start guide or provide specific API examples.');
    }
}
