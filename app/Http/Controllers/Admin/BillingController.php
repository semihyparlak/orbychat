<?php

namespace App\Http\Controllers\Admin;

use App\Models\Plan;
use App\Services\Billing\MeteredBilling;
use App\Services\Billing\PaymentGatewayRegistry;
use App\Support\CurrentWorkspace;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\RedirectResponse as SymfonyRedirectResponse;

/**
 * Customer-facing billing page — current plan, monthly conversation usage,
 * plan ladder, gateway picker, and (once subscribed) a manage-subscription
 * link routed to whichever gateway owns the active subscription.
 */
class BillingController
{
    public function __construct(
        private readonly CurrentWorkspace $current,
        private readonly MeteredBilling $billing,
        private readonly PaymentGatewayRegistry $registry,
    ) {}

    public function show(Request $request): Response|RedirectResponse|SymfonyRedirectResponse
    {
        // Customer-only surface. Platform operators manage subscriptions
        // across all workspaces from /admin/subscriptions instead — they
        // shouldn't be funneled into a "subscribe yourself" flow here.
        if ($request->user()?->isSuperAdmin() === true) {
            return redirect('/admin/subscriptions');
        }

        $workspace = $this->current->get();
        abort_if($workspace === null, 404);
        $request->user()->can('manageBilling', $workspace) || abort(403);

        $summary = $this->billing->summaryFor($workspace);

        $availableGateways = $this->registry->enabledGateways();
        $anyConfigured = $availableGateways !== [];

        $plans = Plan::query()
            ->where('is_active', true)
            ->orderBy('price_cents')
            ->get(['id', 'name', 'slug', 'monthly_conversations', 'price_cents', 'features', 'stripe_price_id', 'paypal_plan_id', 'razorpay_plan_id'])
            ->map(fn (Plan $p) => [
                'id' => $p->id,
                'name' => $p->name,
                'slug' => $p->slug,
                'monthly_conversations' => (int) $p->monthly_conversations,
                'price_cents' => (int) $p->price_cents,
                'features' => $this->billingFeaturesForDisplay($p),
                'is_purchasable' => $anyConfigured && $p->price_cents > 0,
            ])
            ->values();

        // Stripe-specific subscription check still uses Cashier's Billable
        // trait. PayPal / Razorpay subscriptions are tracked via dedicated
        // workspace columns and surface as `has_active_subscription` once
        // the post-checkout webhook flips `payment_gateway`.
        $hasStripeSub = $workspace->subscribed('default');
        $hasOtherSub = in_array(
            $workspace->payment_gateway,
            [PaymentGatewayRegistry::PAYPAL, PaymentGatewayRegistry::RAZORPAY],
            true,
        );

        return Inertia::render('app/billing', [
            'plans' => $plans,
            'summary' => $summary,
            // Backwards-compat key for the existing UI/tests; resolves true
            // whenever ANY gateway is enabled + configured (not strictly Stripe).
            'stripe_configured' => $this->registry->isAvailable(PaymentGatewayRegistry::STRIPE),
            'available_gateways' => $availableGateways,
            'has_active_subscription' => $hasStripeSub || $hasOtherSub,
            'active_gateway' => $workspace->payment_gateway,
            'flash_checkout' => [
                'status' => $request->query('checkout'),
                'gateway' => $request->query('gateway'),
            ],
        ]);
    }

    /**
     * Manage-subscription link for the currently active gateway.
     *
     * Stripe: redirect to its hosted billing portal (Cashier's helper).
     * PayPal: deep-link to the customer's PayPal subscription detail page.
     * Razorpay: no public hosted portal — fall back to a friendly message
     * pointing the admin at our internal billing page.
     */
    public function portal(Request $request): RedirectResponse|SymfonyRedirectResponse
    {
        $workspace = $this->current->get();
        abort_if($workspace === null, 404);
        $request->user()->can('manageBilling', $workspace) || abort(403);

        $gateway = (string) $workspace->payment_gateway;

        if ($gateway === PaymentGatewayRegistry::PAYPAL) {
            $subId = (string) $workspace->paypal_subscription_id;
            if ($subId === '') {
                return redirect()->route('billing.show')
                    ->with('error', 'No PayPal subscription found yet — start one first.');
            }

            $base = (string) config('services.paypal.mode', 'sandbox') === 'live'
                ? 'https://www.paypal.com'
                : 'https://www.sandbox.paypal.com';

            return redirect()->away("{$base}/myaccount/autopay/connect/{$subId}");
        }

        if ($gateway === PaymentGatewayRegistry::RAZORPAY) {
            return redirect()->route('billing.show')
                ->with('error', 'Razorpay manages subscriptions inside the OrbyChat dashboard. Contact support to cancel or change plans.');
        }

        // Default → Stripe (Cashier portal)
        if (! $workspace->hasStripeId()) {
            return redirect()->route('billing.show')
                ->with('error', 'No Stripe customer yet — start a subscription first.');
        }

        return $workspace->redirectToBillingPortal(url('/app/billing'));
    }

    /**
     * Normalize mixed plan feature storage into a simple list for the
     * customer-facing billing page.
     *
     * @return list<string>
     */
    private function billingFeaturesForDisplay(Plan $plan): array
    {
        $features = $plan->features;

        if (! is_array($features)) {
            return [];
        }

        if (array_is_list($features)) {
            return array_values(array_filter(
                $features,
                static fn (mixed $feature): bool => is_string($feature) && $feature !== '',
            ));
        }

        $displayFeatures = [];

        if (($features['remove_branding'] ?? false) === true) {
            $displayFeatures[] = 'Remove OrbyChat branding';
        }

        return $displayFeatures;
    }
}
