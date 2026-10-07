<?php

namespace App\Services\Tools\Tools;

use App\Models\Agent;
use App\Models\Workspace;
use App\Services\Integrations\EcommerceActionService;
use App\Services\Tools\Contracts\Tool;

class TrackOrderTool implements Tool
{
    public function __construct(private EcommerceActionService $actions) {}

    public function name(): string
    {
        return 'track_order';
    }

    public function description(): string
    {
        return 'Look up the status of an order using the Order ID or Email. Use this when the visitor asks "where is my order?", "is it shipped?", or "order status".';
    }

    public function capability(): string
    {
        return 'ecommerce_tracking';
    }

    public function schema(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'order_id' => [
                    'type' => 'string',
                    'description' => 'The Order ID or number provided by the user.',
                ],
                'email' => [
                    'type' => 'string',
                    'description' => 'Optional billing email used for the order.',
                ],
            ],
            'required' => ['order_id'],
        ];
    }

    public function execute(array $args, Agent $agent): array
    {
        $orderId = (string) ($args['order_id'] ?? '');
        $workspace = Workspace::withoutWorkspaceScope()->find($agent->workspace_id);
        
        if (!$workspace || !$orderId) {
            return ['result' => ['error' => 'Missing Order ID or context.']];
        }

        $result = $this->actions->trackOrder($workspace, $orderId);

        if (isset($result['error'])) {
            return [
                'result' => [
                    'status' => 'not_found',
                    'message' => $result['error'],
                ],
            ];
        }

        return [
            'result' => [
                'status' => 'success',
                'order_status' => $result['status'] ?? 'Processing',
                'estimated_delivery' => $result['eta'] ?? 'TBD',
                'tracking_url' => $result['tracking_url'] ?? null,
            ],
            'block' => [
                'type' => 'order_status_card',
                'payload' => [
                    'order_id' => $orderId,
                    'status' => $result['status'] ?? 'Processing',
                    'summary' => $result['summary'] ?? 'Your order is being handled.',
                    'tracking_url' => $result['tracking_url'] ?? null,
                ],
            ],
        ];
    }
}
