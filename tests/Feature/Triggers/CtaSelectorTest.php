<?php

use App\Models\Agent;
use App\Models\Conversation;
use App\Models\CtaRule;
use App\Models\Visitor;
use App\Models\Workspace;
use App\Services\Triggers\CtaSelector;
use Illuminate\Support\Facades\Cache;

beforeEach(function () {
    Cache::flush();
});

test('returns the highest-priority enabled rule that matches', function () {
    $workspace = Workspace::factory()->create();
    $agent = Agent::factory()->create(['workspace_id' => $workspace->id]);
    $visitor = Visitor::factory()->create(['agent_id' => $agent->id]);
    $conv = Conversation::factory()->create([
        'agent_id' => $agent->id,
        'visitor_id' => $visitor->id,
        'page_url' => 'https://example.com/pricing',
    ]);

    CtaRule::create([
        'agent_id' => $agent->id,
        'name' => 'low priority generic',
        'label' => 'Generic CTA',
        'kind' => 'link',
        'priority' => 1,
        'enabled' => true,
        'target' => ['url' => 'https://x.com/low'],
    ]);
    CtaRule::create([
        'agent_id' => $agent->id,
        'name' => 'pricing-page demo',
        'label' => 'Book a demo',
        'kind' => 'demo',
        'priority' => 100,
        'enabled' => true,
        'conditions' => ['url_contains' => '/pricing'],
        'target' => ['url' => 'https://x.com/demo'],
    ]);

    $cta = app(CtaSelector::class)->select($conv, 'Sure — happy to help with pricing!');

    expect($cta)->not->toBeNull();
    expect($cta['kind'])->toBe('demo');
    expect($cta['url'])->toBe('https://x.com/demo');
});

test('returns null when no rules match', function () {
    $workspace = Workspace::factory()->create();
    $agent = Agent::factory()->create(['workspace_id' => $workspace->id]);
    $visitor = Visitor::factory()->create(['agent_id' => $agent->id]);
    $conv = Conversation::factory()->create([
        'agent_id' => $agent->id,
        'visitor_id' => $visitor->id,
        'page_url' => 'https://example.com/blog',
    ]);

    CtaRule::create([
        'agent_id' => $agent->id,
        'name' => 'pricing only',
        'label' => 'Book a demo',
        'kind' => 'demo',
        'priority' => 100,
        'enabled' => true,
        'conditions' => ['url_contains' => '/pricing'],
        'target' => ['url' => 'https://x.com/demo'],
    ]);

    expect(app(CtaSelector::class)->select($conv, 'whatever'))->toBeNull();
});

test('shouldPromptForLead detects email-share patterns', function () {
    $selector = app(CtaSelector::class);
    expect($selector->shouldPromptForLead("Sure — share your email and I'll follow up."))->toBeTrue();
    expect($selector->shouldPromptForLead('Happy to book a meeting next week.'))->toBeTrue();
    expect($selector->shouldPromptForLead('Yes, our pricing is $49/mo.'))->toBeFalse();
});
