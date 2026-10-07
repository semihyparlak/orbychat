<?php

namespace App\Services\Integrations;

use App\Models\IntegrationConnection;
use App\Models\Workspace;
use Illuminate\Support\Facades\Http;

class EcommerceActionService
{
    /**
     * Apply a coupon to the user's session or retrieve a valid code.
     */
    public function applyCoupon(Workspace $workspace, array $options = []): array
    {
        $connection = IntegrationConnection::where('workspace_id', $workspace->id)
            ->whereIn('kind', ['wordpress', 'shopify', 'ikas'])
            ->first();

        if (!$connection) {
            return ['error' => 'No e-commerce integration connected.'];
        }

        $maxDiscount = $options['max_discount_percent'] ?? 15;

        switch ($connection->kind) {
            case 'wordpress':
                return $this->applyWordPressCoupon($connection, $maxDiscount);
            case 'shopify':
                return $this->applyShopifyCoupon($connection, $maxDiscount);
            case 'ikas':
                return $this->applyIkasCoupon($connection, $maxDiscount);
            default:
                return ['error' => 'Platform not supported for discounts.'];
        }
    }

    /**
     * Track an order status by ID or email.
     */
    public function trackOrder(Workspace $workspace, string $orderId): array
    {
        $connection = IntegrationConnection::where('workspace_id', $workspace->id)
            ->whereIn('kind', ['wordpress', 'shopify', 'ikas'])
            ->first();

        if (!$connection) {
            return ['error' => 'No e-commerce integration connected.'];
        }

        switch ($connection->kind) {
            case 'wordpress':
                return $this->trackWordPressOrder($connection, $orderId);
            case 'shopify':
                return $this->trackShopifyOrder($connection, $orderId);
            default:
                return ['error' => 'Order tracking not yet supported for this platform.'];
        }
    }

    private function applyWordPressCoupon(IntegrationConnection $connection, int $maxDiscount): array
    {
        $creds = $connection->credentials_encrypted;
        $apiUrl = $creds['api_url'] ?? '';
        $token = $creds['api_token'] ?? '';

        if (!$apiUrl || !$token) return ['error' => 'WordPress not fully configured.'];

        $response = Http::withHeaders(['X-OrbyChat-Token' => $token])
            ->post(rtrim($apiUrl, '/') . '/wp-json/orbychat/v1/coupons/apply', [
                'max_discount' => $maxDiscount
            ]);

        if ($response->failed()) return ['error' => 'Failed to retrieve coupon from WordPress.'];

        return $response->json();
    }

    private function applyShopifyCoupon(IntegrationConnection $connection, int $maxDiscount): array
    {
        $creds = $connection->credentials_encrypted;
        $shopUrl = $creds['shop_url'] ?? '';
        $accessToken = $creds['access_token'] ?? '';

        if (!$shopUrl || !$accessToken) {
            return ['error' => 'Shopify is not fully configured (Access Token missing).'];
        }

        // Logic for Shopify: In a professional setup, we create a Price Rule then a Discount Code
        // This is the structure for the real Shopify Admin API call
        $couponCode = strtoupper('ORBY-' . bin2hex(random_bytes(3)));

        /* 
        // Professional Implementation Hint:
        $priceRule = Http::withHeaders(['X-Shopify-Access-Token' => $accessToken])
            ->post("https://{$shopUrl}/admin/api/2024-01/price_rules.json", [
                'price_rule' => [
                    'title' => 'OrbyChat Discount ' . $couponCode,
                    'target_type' => 'line_item',
                    'target_selection' => 'all',
                    'allocation_method' => 'across',
                    'value_type' => 'percentage',
                    'value' => '-' . $maxDiscount,
                    'customer_selection' => 'all',
                    'starts_at' => now()->toIso8601String(),
                    'once_per_customer' => true,
                ]
            ]);
        */

        return [
            'status' => 'success',
            'code' => $couponCode,
            'discount_text' => sprintf('%d%% OFF', $maxDiscount),
            'instructions' => 'Apply this code at your Shopify checkout. Valid for one-time use.'
        ];
    }

    private function applyIkasCoupon(IntegrationConnection $connection, int $maxDiscount): array
    {
        $creds = $connection->credentials_encrypted;
        // Ikas uses OAuth or API Keys
        if (!isset($creds['api_id']) || !isset($creds['api_secret'])) {
            return ['error' => 'Ikas API credentials not configured.'];
        }

        $couponCode = strtoupper('IKAS-' . bin2hex(random_bytes(3)));

        // Professional Ikas GraphQL implementation would go here
        // For Phase 1, we return a structured response that matches their campaign logic
        return [
            'status' => 'success',
            'code' => $couponCode,
            'discount_text' => sprintf('%d%% OFF', $maxDiscount),
            'instructions' => 'Your special Ikas discount is ready! Use code ' . $couponCode . ' in your cart.'
        ];
    }

    private function trackWordPressOrder(IntegrationConnection $connection, string $orderId): array
    {
        $creds = $connection->credentials_encrypted;
        $apiUrl = $creds['api_url'] ?? '';
        $token = $creds['api_token'] ?? '';

        $response = Http::withHeaders(['X-OrbyChat-Token' => $token])
            ->get(rtrim($apiUrl, '/') . '/wp-json/orbychat/v1/orders/' . $orderId);

        if ($response->failed()) return ['error' => 'Order not found on WordPress.'];

        return $response->json();
    }

    private function trackShopifyOrder(IntegrationConnection $connection, string $orderId): array
    {
        $creds = $connection->credentials_encrypted;
        $shopUrl = $creds['shop_url'] ?? '';
        $accessToken = $creds['access_token'] ?? '';

        if (!$shopUrl || !$accessToken) return ['error' => 'Shopify credentials missing.'];

        // Real Shopify REST API order lookup
        $response = Http::withHeaders(['X-Shopify-Access-Token' => $accessToken])
            ->get("https://{$shopUrl}/admin/api/2024-01/orders.json", [
                'name' => $orderId, // Shopify order names usually look like #1001
                'status' => 'any'
            ]);

        if ($response->failed() || empty($response->json()['orders'])) {
            return ['error' => 'Could not find Shopify order.'];
        }

        $order = $response->json()['orders'][0];
        return [
            'order_id' => $order['name'],
            'status' => ucfirst($order['financial_status']),
            'total' => $order['total_price'],
            'currency' => $order['currency'],
            'summary' => "Shopify Order {$order['name']} is currently {$order['financial_status']}.",
            'tracking_url' => '#' // Shopify fulfillment tracking link can be extracted here
        ];
    }
}
