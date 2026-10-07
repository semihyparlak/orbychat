<?php

use App\Models\Agent;
use App\Services\Tools\ToolRegistry;
use App\Services\Tools\Tools\EscalateToHumanTool;
use App\Services\Vertical\VerticalPresetRegistry;

beforeEach(function () {
    $this->registry = new ToolRegistry(new VerticalPresetRegistry);
});

test('registry exposes the escalate_to_human tool', function () {
    $tool = $this->registry->get('escalate_to_human');
    expect($tool)->toBeInstanceOf(EscalateToHumanTool::class);
});

test('forAgent returns no tools when site_type is null', function () {
    $agent = new Agent;
    $agent->site_type = null;

    expect($this->registry->forAgent($agent))->toBe([]);
});

test('forAgent returns escalate_to_human for help_center agents (capability match)', function () {
    $agent = new Agent;
    $agent->site_type = 'help_center';
    $agent->vertical_overrides = null;

    $tools = $this->registry->forAgent($agent);
    expect($tools)->toHaveCount(1);
    expect($tools[0]->name())->toBe('escalate_to_human');
});

test('forAgent returns no tools for ecommerce (capability does not match)', function () {
    // Ecommerce preset has product_card etc. but no ticket_escalation,
    // so escalate_to_human is not surfaced.
    $agent = new Agent;
    $agent->site_type = 'ecommerce';
    $agent->vertical_overrides = null;

    expect($this->registry->forAgent($agent))->toBe([]);
});

test('vertical_overrides.capabilities can enable a tool by adding its capability', function () {
    $agent = new Agent;
    $agent->site_type = 'ecommerce';
    $agent->vertical_overrides = [
        'capabilities' => ['ticket_escalation'],
    ];

    $tools = $this->registry->forAgent($agent);
    expect($tools)->toHaveCount(1);
});

test('vertical_overrides.enabled_tools narrows the allow-list', function () {
    $agent = new Agent;
    $agent->site_type = 'help_center';
    $agent->vertical_overrides = [
        'enabled_tools' => ['some_other_tool'],
    ];

    expect($this->registry->forAgent($agent))->toBe([]);
});

test('openAiToolsFor returns valid OpenAI tools shape', function () {
    $agent = new Agent;
    $agent->site_type = 'help_center';
    $agent->vertical_overrides = null;

    $payload = $this->registry->openAiToolsFor($agent);
    expect($payload)->toHaveCount(1);
    expect($payload[0]['type'])->toBe('function');
    expect($payload[0]['function']['name'])->toBe('escalate_to_human');
    expect($payload[0]['function']['parameters'])->toBeArray();
});
