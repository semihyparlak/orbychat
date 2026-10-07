<?php

namespace App\Http\Controllers\Billing;

use App\Models\Plan;
use App\Models\Workspace;
use App\Services\Billing\PaymentGatewayRegistry;
use App\Services\Billing\PayPalClient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * PayPal → us. Mirrors {@see WebhookController} (Stripe) for the PayPal
 * gateway. Listens for the four lifecycle events that matter for our
 * "workspace.plan_id reflects the active subscription's plan" model:
 *
 *   - BILLING.SUBSCRIPTION.CREATED   → no-op (charge not authorized yet)
 *   - BILLING.SUBSCRIPTION.ACTIVATED → grant the plan
 *   - BILLING.SUBSCRIPTION.UPDATED   → grant / re-grant the plan
 *   - BILLING.SUBSCRIPTION.CANCELLED → revert to free
 *   - BILLING.SUBSCRIPTION.SUSPENDED → revert to free
 *
 * We map subscriptions back to a workspace via the `custom_id` we set
 * at checkout time (workspace UUID), and back to a plan via PayPal's
 * `plan_id` ↔ `Plan.paypal_plan_id`.
 *
 * Signature verification is required when a `paypal_webhook_id` is
 * configured; otherwise we accept the payload as-is so dev/staging
 * installs without a registered webhook still flow through.
 */
class PayPalWebhookController
{
    private const PLAN_GRANTING_EVENTS = [
        'BILLING.SUBSCRIPTION.ACTIVATED',
        'BILLING.SUBSCRIPTION.UPDATED',
        'BILLING.SUBSCRIPTION.RE-ACTIVATED',
    ];

    private const PLAN_REVOKING_EVENTS = [
        'BILLING.SUBSCRIPTION.CANCELLED',
        'BILLING.SUBSCRIPTION.SUSPENDED',
        'BILLING.SUBSCRIPTION.EXPIRED',
    ];

    public function __construct(private readonly PayPalClient $paypal) {}

    public function __invoke(Request $request): JsonResponse
    {
        $payload = $request->all();
        $eventType = (string) ($payload['event_type'] ?? '');

        if ($eventType === '') {
            return response()->json(['ok' => false, 'reason' => 'missing event_type'], 400);
        }

        $webhookId = (string) config('services.paypal.webhook_id', '');

        if ($webhookId !== '') {
            $verified = $this->paypal->verifyWebhook(
                $request->headers->all() ? array_map(
                    static fn (array $values) => $values[0] ?? '',
                    $request->headers->all(),
                ) : [],
                $payload,
                $webhookId,
            );

            if (! $verified) {
                return response()->json(['ok' => false, 'reason' => 'invalid signature'], 400);
            }
        }

        /** @var array<string, mixed> $resource */
        $resource = $payload['resource'] ?? [];

        if (in_array($eventType, self::PLAN_GRANTING_EVENTS, true)) {
            $this->grantPlan($resource);
        } elseif (in_array($eventType, self::PLAN_REVOKING_EVENTS, true)) {
            $this->revertToFreePlan($resource);
        }

        return response()->json(['ok' => true]);
    }

    /**
     * @param  array<string, mixed>  $resource
     */
    private function grantPlan(array $resource): void
    {
        $workspace = $this->workspaceFor($resource);
        $plan = $this->planFor($resource);

        if ($workspace === null || $plan === null) {
            return;
        }

        $update = ['payment_gateway' => PaymentGatewayRegistry::PAYPAL];

        if ($workspace->plan_id !== $plan->id) {
            $update['plan_id'] = $plan->id;
        }

        $subscriptionId = (string) ($resource['id'] ?? '');
        if ($subscriptionId !== '' && $workspace->paypal_subscription_id !== $subscriptionId) {
            $update['paypal_subscription_id'] = $subscriptionId;
        }

        $workspace->forceFill($update)->save();
    }

    /**
     * @param  array<string, mixed>  $resource
     */
    private function revertToFreePlan(array $resource): void
    {
        $workspace = $this->workspaceFor($resource);

        if ($workspace === null) {
            return;
        }

        $free = Plan::query()->where('slug', 'free')->first();

        if ($free === null) {
            return;
        }

        $workspace->forceFill([
            'plan_id' => $free->id,
            'payment_gateway' => null,
        ])->save();
    }

    /**
     * @param  array<string, mixed>  $resource
     */
    private function workspaceFor(array $resource): ?Workspace
    {
        $customId = (string) ($resource['custom_id'] ?? '');
        $subscriptionId = (string) ($resource['id'] ?? '');

        if ($customId !== '') {
            $byCustom = Workspace::query()->where('id', $customId)->first();
            if ($byCustom !== null) {
                return $byCustom;
            }
        }

        if ($subscriptionId !== '') {
            return Workspace::query()
                ->where('paypal_subscription_id', $subscriptionId)
                ->first();
        }

        return null;
    }

    /**
     * @param  array<string, mixed>  $resource
     */
    private function planFor(array $resource): ?Plan
    {
        $paypalPlanId = (string) ($resource['plan_id'] ?? '');

        if ($paypalPlanId === '') {
            return null;
        }

        return Plan::query()->where('paypal_plan_id', $paypalPlanId)->first();
    }
}
