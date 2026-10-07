<?php

namespace App\Services\Tools\Tools;

use App\Models\Agent;
use App\Models\Workspace;
use App\Services\Integrations\EcommerceActionService;
use App\Services\Tools\Contracts\Tool;

class ApplyCouponTool implements Tool
{
    public function __construct(private EcommerceActionService $actions) {}

    public function name(): string
    {
        return 'apply_coupon';
    }

    public function description(): string
    {
        return 'Apply a discount code or coupon to the visitor\'s session. Use this when the visitor asks for a discount, "any deals?", "cheaper price", or when they are hesitant to buy.';
    }

    public function capability(): string
    {
        return 'ecommerce_discounts';
    }

    public function schema(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'context' => [
                    'type' => 'string',
                    'description' => 'Optional context like "abandoned_cart" or "first_time_buyer".',
                ],
            ],
        ];
    }

    public function execute(array $args, Agent $agent): array
    {
        $workspace = Workspace::withoutWorkspaceScope()->find($agent->workspace_id);
        
        if (!$workspace) {
            return ['result' => ['error' => 'Workspace context lost.']];
        }

        $overrides = (array) ($agent->vertical_overrides ?? []);
        $maxLimit = $overrides['max_discount_percent'] ?? 15;
        $defaultCode = $overrides['coupon_code'] ?? 'WELCOME10';
        $defaultDiscount = $overrides['discount_text'] ?? '10% OFF';

        $result = $this->actions->applyCoupon($workspace, [
            'max_discount_percent' => $maxLimit
        ]);

        if (isset($result['error'])) {
            return [
                'result' => [
                    'status' => 'failed',
                    'message' => $result['error'],
                ],
            ];
        }

        $finalCode = $result['code'] ?? $defaultCode;
        $finalDiscount = $result['discount_text'] ?? $defaultDiscount;

        return [
            'result' => [
                'status' => 'success',
                'code' => $finalCode,
                'discount' => $finalDiscount,
                'message' => 'Coupon successfully applied/retrieved.',
            ],
            'block' => [
                'type' => 'coupon_card',
                'payload' => [
                    'code' => $finalCode,
                    'label' => $finalDiscount,
                    'instructions' => $result['instructions'] ?? 'Use this at checkout!',
                ],
            ],
        ];
    }
}
