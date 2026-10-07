<?php

namespace App\Http\Controllers\Billing;

use App\Models\Plan;
use App\Models\Workspace;
use Laravel\Cashier\Http\Controllers\WebhookController as CashierWebhookController;
use Symfony\Component\HttpFoundation\Response;

/**
 * Stripe → us. Cashier handles the heavy lifting (subscription row CRUD,
 * customer/payment method sync, invoice payment-required emails). We
 * extend it to also flip the workspace's local `plan_id` whenever the
 * subscription's active price changes — that's what gates feature access
 * and conversation quota in the rest of the app.
 *
 * Mapping is keyed off the Plan.stripe_price_id we persisted at checkout
 * time (see StripeProductSync). When a subscription is canceled the
 * workspace falls back to the 'free' plan.
 */
class WebhookController extends CashierWebhookController
{
    protected function handleCustomerSubscriptionCreated(array $payload): Response
    {
        $response = parent::handleCustomerSubscriptionCreated($payload);
        $this->syncWorkspacePlan($payload['data']['object'] ?? []);

        return $response;
    }

    protected function handleCustomerSubscriptionUpdated(array $payload): Response
    {
        $response = parent::handleCustomerSubscriptionUpdated($payload);
        $this->syncWorkspacePlan($payload['data']['object'] ?? []);

        return $response;
    }

    protected function handleCustomerSubscriptionDeleted(array $payload): Response
    {
        $response = parent::handleCustomerSubscriptionDeleted($payload);
        $this->revertToFreePlan($payload['data']['object'] ?? []);

        return $response;
    }

    /**
     * Mirror the Stripe subscription's active price → workspace.plan_id.
     * Statuses considered "owns the plan": active, trialing, past_due
     * (grace period). Anything else (incomplete, canceled) doesn't grant
     * the plan yet.
     */
    private function syncWorkspacePlan(array $obj): void
    {
        $stripeCustomerId = (string) ($obj['customer'] ?? '');
        $status = (string) ($obj['status'] ?? '');
        $priceId = (string) ($obj['items']['data'][0]['price']['id'] ?? '');

        if ($stripeCustomerId === '' || $priceId === '') {
            return;
        }

        $workspace = Workspace::query()->where('stripe_id', $stripeCustomerId)->first();
        if ($workspace === null) {
            return;
        }

        if (! in_array($status, ['active', 'trialing', 'past_due'], true)) {
            return;
        }

        $plan = Plan::query()->where('stripe_price_id', $priceId)->first();
        if ($plan === null) {
            return;
        }

        if ($workspace->plan_id !== $plan->id) {
            $workspace->forceFill(['plan_id' => $plan->id])->save();
        }
    }

    private function revertToFreePlan(array $obj): void
    {
        $stripeCustomerId = (string) ($obj['customer'] ?? '');
        if ($stripeCustomerId === '') {
            return;
        }

        $workspace = Workspace::query()->where('stripe_id', $stripeCustomerId)->first();
        if ($workspace === null) {
            return;
        }

        $free = Plan::query()->where('slug', 'free')->first();
        if ($free === null) {
            return;
        }

        $workspace->forceFill(['plan_id' => $free->id])->save();
    }
}
