<?php

namespace App\Http\Controllers\Billing;

use App\Models\Plan;
use App\Models\Workspace;
use App\Services\Billing\PaymentGatewayRegistry;
use App\Services\Billing\RazorpayClient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Razorpay → us. Same role as {@see WebhookController} for Stripe and
 * {@see PayPalWebhookController} for PayPal — flips
 * `workspace.plan_id` based on the active subscription's lifecycle.
 *
 * Signature verification is HMAC-SHA256 over the raw request body keyed
 * by the dashboard-configured webhook secret. We honor it strictly when
 * a secret is configured (no test-mode bypass on production traffic).
 *
 * Subscription → workspace mapping is via the `notes.workspace_id` we
 * stamped on the subscription at checkout time. Subscription → plan
 * mapping is via Razorpay's `plan_id` ↔ `Plan.razorpay_plan_id`.
 */
class RazorpayWebhookController
{
    private const PLAN_GRANTING_EVENTS = [
        'subscription.activated',
        'subscription.charged',
        'subscription.resumed',
        'subscription.updated',
    ];

    private const PLAN_REVOKING_EVENTS = [
        'subscription.cancelled',
        'subscription.completed',
        'subscription.halted',
        'subscription.paused',
    ];

    public function __construct(private readonly RazorpayClient $razorpay) {}

    public function __invoke(Request $request): JsonResponse
    {
        $rawBody = (string) $request->getContent();
        $signature = (string) $request->header('X-Razorpay-Signature', '');
        $webhookSecret = (string) config('services.razorpay.webhook_secret', '');

        if ($webhookSecret !== '') {
            if (! $this->razorpay->verifyWebhookSignature($rawBody, $signature, $webhookSecret)) {
                return response()->json(['ok' => false, 'reason' => 'invalid signature'], 400);
            }
        }

        /** @var array<string, mixed> $payload */
        $payload = json_decode($rawBody, true) ?? [];
        $event = (string) ($payload['event'] ?? '');

        /** @var array<string, mixed> $entity */
        $entity = $payload['payload']['subscription']['entity'] ?? [];

        if ($entity === []) {
            return response()->json(['ok' => true, 'reason' => 'no subscription entity']);
        }

        if (in_array($event, self::PLAN_GRANTING_EVENTS, true)) {
            $this->grantPlan($entity);
        } elseif (in_array($event, self::PLAN_REVOKING_EVENTS, true)) {
            $this->revertToFreePlan($entity);
        }

        return response()->json(['ok' => true]);
    }

    /**
     * @param  array<string, mixed>  $entity
     */
    private function grantPlan(array $entity): void
    {
        $workspace = $this->workspaceFor($entity);
        $plan = $this->planFor($entity);

        if ($workspace === null || $plan === null) {
            return;
        }

        $update = ['payment_gateway' => PaymentGatewayRegistry::RAZORPAY];

        if ($workspace->plan_id !== $plan->id) {
            $update['plan_id'] = $plan->id;
        }

        $subscriptionId = (string) ($entity['id'] ?? '');
        if ($subscriptionId !== '' && $workspace->razorpay_subscription_id !== $subscriptionId) {
            $update['razorpay_subscription_id'] = $subscriptionId;
        }

        $workspace->forceFill($update)->save();
    }

    /**
     * @param  array<string, mixed>  $entity
     */
    private function revertToFreePlan(array $entity): void
    {
        $workspace = $this->workspaceFor($entity);

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
     * @param  array<string, mixed>  $entity
     */
    private function workspaceFor(array $entity): ?Workspace
    {
        /** @var array<string, mixed> $notes */
        $notes = $entity['notes'] ?? [];
        $workspaceId = (string) ($notes['workspace_id'] ?? '');
        $subscriptionId = (string) ($entity['id'] ?? '');

        if ($workspaceId !== '') {
            $byNote = Workspace::query()->where('id', $workspaceId)->first();
            if ($byNote !== null) {
                return $byNote;
            }
        }

        if ($subscriptionId !== '') {
            return Workspace::query()
                ->where('razorpay_subscription_id', $subscriptionId)
                ->first();
        }

        return null;
    }

    /**
     * @param  array<string, mixed>  $entity
     */
    private function planFor(array $entity): ?Plan
    {
        $razorpayPlanId = (string) ($entity['plan_id'] ?? '');

        if ($razorpayPlanId === '') {
            return null;
        }

        return Plan::query()->where('razorpay_plan_id', $razorpayPlanId)->first();
    }
}
