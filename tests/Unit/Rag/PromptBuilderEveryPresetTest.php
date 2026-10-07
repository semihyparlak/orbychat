<?php

use App\Models\Agent;
use App\Services\Rag\PromptBuilder;
use App\Services\Vertical\VerticalPresetRegistry;
use App\Services\Vertical\VerticalPresets;

/**
 * Locks the system-prompt contract for every shipped preset. For each
 * non-generic vertical we assert the prompt contains the preset's
 * sentinel phrase plus our "Vertical context" header. Catches drift
 * if a preset's wording changes inadvertently.
 */
dataset('non_generic_presets', function () {
    return [
        'ecommerce' => ['ecommerce', 'e-commerce store'],
        'documentation' => ['documentation', 'documentation site'],
        'saas' => ['saas', 'SaaS product website'],
        'help_center' => ['help_center', 'knowledge base'],
        'marketing' => ['marketing', 'lead-generation site'],
        'internal_kb' => ['internal_kb', 'employees'],
    ];
});

test('every non-generic preset injects its fragment into the system prompt', function (string $slug, string $sentinel) {
    $builder = app(PromptBuilder::class);
    $agent = new Agent;
    $agent->persona = ['name' => 'OrbyChat', 'tone' => 'helpful'];
    $agent->guardrails = [];
    $agent->system_prompt = null;
    $agent->site_type = $slug;

    $messages = $builder->build(
        agent: $agent,
        userMessage: 'tell me about this',
        sources: [],
    );
    $system = $messages[0]['content'];

    expect($system)->toContain("Vertical context (site type: {$slug})");
    expect($system)->toContain($sentinel);
})->with('non_generic_presets');

test('preset fragment positioning: after sources, before admin custom prompt', function () {
    $builder = app(PromptBuilder::class);
    $agent = new Agent;
    $agent->persona = ['name' => 'OrbyChat'];
    $agent->guardrails = [];
    $agent->system_prompt = 'Always end replies with a smile.';
    $agent->site_type = 'ecommerce';

    $messages = $builder->build(
        agent: $agent,
        userMessage: 'q',
        sources: [['text' => 'A widget costs $49', 'url' => 'https://shop.example/products/widget', 'score' => 0.9]],
    );
    $system = $messages[0]['content'];

    $sourcesBlock = strpos($system, '<source id="1"');
    $verticalHeader = strpos($system, 'Vertical context');
    $customHeader = strpos($system, 'Additional instructions from the workspace owner');
    $adminPrompt = strpos($system, 'Always end replies with a smile.');

    expect($sourcesBlock)->not->toBeFalse();
    expect($verticalHeader)->not->toBeFalse();
    expect($customHeader)->not->toBeFalse();
    expect($adminPrompt)->not->toBeFalse();

    // Ordering contract: sources â†' vertical â†' admin custom prompt.
    expect($sourcesBlock)->toBeLessThan($verticalHeader);
    expect($verticalHeader)->toBeLessThan($customHeader);
    expect($customHeader)->toBeLessThan($adminPrompt);
});

test('every preset slug declared on the registry produces a fragment-ready prompt', function () {
    $registry = new VerticalPresetRegistry;
    $builder = new PromptBuilder($registry);

    foreach (VerticalPresets::SLUGS as $slug) {
        $agent = new Agent;
        $agent->persona = ['name' => 'OrbyChat'];
        $agent->guardrails = [];
        $agent->site_type = $slug;
        $agent->system_prompt = null;

        $messages = $builder->build(
            agent: $agent,
            userMessage: 'q',
            sources: [],
        );

        // generic must not add a fragment; everything else must.
        $hasFragment = str_contains($messages[0]['content'], "Vertical context (site type: {$slug})");
        if ($slug === 'generic') {
            expect($hasFragment)->toBeFalse();
        } else {
            expect($hasFragment)->toBeTrue();
        }
    }
});

test('persona max_chars from preset surfaces in length-guidance', function () {
    // The preset apply endpoint copies max_chars into agent.guardrails;
    // here we simulate that and assert the prompt's hard cap reflects it.
    $builder = app(PromptBuilder::class);
    $agent = new Agent;
    $agent->persona = ['name' => 'OrbyChat'];
    $agent->guardrails = ['max_chars' => 1800]; // ecommerce default
    $agent->system_prompt = null;
    $agent->site_type = 'ecommerce';

    $system = $builder->build(
        agent: $agent,
        userMessage: 'q',
        sources: [],
    )[0]['content'];

    expect($system)->toContain('Hard upper bound: 1800 characters');
});
