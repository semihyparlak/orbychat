<?php

namespace App\Services\Tools;

use App\Models\Agent;
use App\Services\Tools\Contracts\Tool;
use App\Services\Tools\Tools\EscalateToHumanTool;
use App\Services\Vertical\VerticalPresetRegistry;

/**
 * Registry of every server-side tool the LLM can call. Bound `scoped`
 * so the array is reused across a request without leaking between
 * Octane workers.
 *
 * Resolves the tool set for a given agent by intersecting:
 *   - the agent's vertical preset capabilities
 *   - each tool's required capability
 *   - the admin's `vertical_overrides.enabled_tools` allow-list (if
 *     set; null/missing means "any tool that fits the capability").
 */
class ToolRegistry
{
    /** @var array<string, Tool> */
    private array $tools;

    public function __construct(
        private VerticalPresetRegistry $presets,
        private \App\Services\Integrations\EcommerceActionService $ecommerceActions
    ) {
        $this->tools = [
            'escalate_to_human' => new EscalateToHumanTool,
            'apply_coupon' => new \App\Services\Tools\Tools\ApplyCouponTool($this->ecommerceActions),
            'track_order' => new \App\Services\Tools\Tools\TrackOrderTool($this->ecommerceActions),
        ];
    }

    /**
     * @return array<string, Tool>
     */
    public function all(): array
    {
        return $this->tools;
    }

    public function get(string $name): ?Tool
    {
        return $this->tools[$name] ?? null;
    }

    /**
     * @return array<int, Tool>
     */
    public function forAgent(Agent $agent): array
    {
        if ($agent->site_type === null) {
            return [];
        }

        $preset = $this->presets->for((string) $agent->site_type);
        $overrides = (array) ($agent->vertical_overrides ?? []);

        // Capability set: overrides win when present, else preset defaults.
        $capabilities = isset($overrides['capabilities']) && is_array($overrides['capabilities'])
            ? array_values($overrides['capabilities'])
            : $preset->capabilities();

        // Optional admin allow-list of tool names. When absent → every
        // tool whose capability is in the agent's set is enabled.
        $enabledNames = isset($overrides['enabled_tools']) && is_array($overrides['enabled_tools'])
            ? array_values($overrides['enabled_tools'])
            : null;

        $resolved = [];
        foreach ($this->tools as $tool) {
            if (! in_array($tool->capability(), $capabilities, true)) {
                continue;
            }
            if ($enabledNames !== null && ! in_array($tool->name(), $enabledNames, true)) {
                continue;
            }
            $resolved[] = $tool;
        }

        return $resolved;
    }

    /**
     * Format the agent's enabled tools as the OpenAI `tools` array
     * payload. Empty when the agent has no eligible tools.
     *
     * @return array<int, array<string, mixed>>
     */
    public function openAiToolsFor(Agent $agent): array
    {
        $tools = $this->forAgent($agent);
        $payload = [];
        foreach ($tools as $tool) {
            $payload[] = [
                'type' => 'function',
                'function' => [
                    'name' => $tool->name(),
                    'description' => $tool->description(),
                    'parameters' => $tool->schema(),
                ],
            ];
        }

        return $payload;
    }
}
