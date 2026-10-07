<?php

namespace App\Http\Controllers\Billing;

use App\Models\Plan;
use App\Services\Billing\PaymentGatewayRegistry;
use App\Services\Billing\PayPalClient;
use App\Services\Billing\PayPalProductSync;
use App\Services\Billing\RazorpayClient;
use App\Services\Billing\RazorpayProductSync;
use App\Services\Billing\StripeProductSync;
use App\Support\CurrentWorkspace;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\RedirectResponse as SymfonyRedirectResponse;

/**
 * Kicks off a hosted checkout session for the workspace's chosen plan.
 *
 * One endpoint, three flavors: the gateway is picked by the `gateway`
 * field on the request (or defaults to whichever gateway is enabled +
 * configured first — Stripe for existing installs).
 *
 * - Stripe: redirect to Stripe Checkout, completion fires the existing
 *   `customer.subscription.*` webhook → workspace.plan_id flip.
 * - PayPal: create a Billing Subscription, redirect to PayPal's approval
 *   URL. Completion fires `BILLING.SUBSCRIPTION.ACTIVATED` to our
 *   webhook → plan_id flip.
 * - Razorpay: create a Subscription server-side, render an Inertia page
 *   that boots Razorpay Checkout.js with the subscription_id. Completion
 *   fires `subscription.activated` to our webhook → plan_id flip.
 *
 * Idempotent on the gateway plan: if the plan has no `*_plan_id` for the
 * chosen gateway yet, the gateway-specific ProductSync provisions one
 * on demand (same lazy pattern Stripe uses).
 */
class CheckoutController
{
    public function __construct(
        private readonly CurrentWorkspace $current,
        private readonly StripeProductSync $stripeSync,
        private readonly PayPalProductSync $paypalSync,
        private readonly PayPalClient $paypal,
        private readonly RazorpayProductSync $razorpaySync,
        private readonly RazorpayClient $razorpay,
        private readonly PaymentGatewayRegistry $registry,
    ) {}

    public function __invoke(Request $request): RedirectResponse|SymfonyRedirectResponse|Response
    {
        $workspace = $this->current->get();
        abort_if($workspace === null, 404);
        $request->user()->can('manageBilling', $workspace) || abort(403);

        $data = $request->validate([
            'plan_slug' => ['required', 'string'],
            'gateway' => ['nullable', 'string', 'in:stripe,paypal,razorpay'],
        ]);

        $plan = Plan::query()->where('slug', $data['plan_slug'])->firstOrFail();

        if ($plan->price_cents <= 0) {
            return back()->with('error', __('This plan is not purchasable. Contact sales for Custom plans.'));
        }

        $gateway = $data['gateway'] ?? $this->registry->defaultGateway();

        if (! $this->registry->isAvailable($gateway)) {
            return back()->with(
                'error',
                __(ucfirst($gateway).' is not configured or has been disabled. Pick another payment method.'),
            );
        }

        return match ($gateway) {
            PaymentGatewayRegistry::STRIPE => $this->checkoutWithStripe($request, $workspace, $plan),
            PaymentGatewayRegistry::PAYPAL => $this->checkoutWithPayPal($workspace, $plan),
            PaymentGatewayRegistry::RAZORPAY => $this->checkoutWithRazorpay($request, $workspace, $plan),
            default => back()->with('error', __('Unknown payment gateway.')),
        };
    }

    private function checkoutWithStripe(Request $request, $workspace, Plan $plan): RedirectResponse|SymfonyRedirectResponse|Response|InertiaResponse
    {
        // If the workspace already has an active Stripe subscription, send
        // them to the billing portal to upgrade / switch plans instead.
        // Creating a new checkout session on top of an existing subscription
        // causes Cashier to return HTTP 409 (conflict).
        if ($workspace->subscribed('default')) {
            try {
                $portalUrl = $workspace->billingPortalUrl(url('/app/billing'));
                return redirect()->away($portalUrl);
            } catch (\Throwable) {
                return redirect('/app/billing')->with(
                    'error',
                    __('You already have an active subscription. Please manage it from the billing page.')
                );
            }
        }

        try {
            $priceId = $this->stripeSync->ensurePriceFor($plan);
        } catch (\Throwable $e) {
            return back()->with('error', __('Could not initialize Stripe price: ').$e->getMessage());
        }

        $checkout = $workspace
            ->newSubscription('default', $priceId)
            ->checkout([
                'success_url' => url('/app/billing?checkout=success&session_id={CHECKOUT_SESSION_ID}'),
                'cancel_url' => url('/app/billing?checkout=cancelled'),
                'metadata' => [
                    'workspace_id' => $workspace->id,
                    'plan_id' => $plan->id,
                    'plan_slug' => $plan->slug,
                ],
            ]);

        $workspace->forceFill(['payment_gateway' => PaymentGatewayRegistry::STRIPE])->save();

        $url = $checkout->url;

        if ($request->header('X-Inertia')) {
            return Inertia::location($url);
        }

        return redirect()->away($url);
    }

    private function checkoutWithPayPal($workspace, Plan $plan): RedirectResponse|SymfonyRedirectResponse|Response|InertiaResponse
    {
        try {
            $paypalPlanId = $this->paypalSync->ensurePlanFor($plan);
        } catch (\Throwable $e) {
            return back()->with('error', __('Could not initialize PayPal plan: ').$e->getMessage());
        }

        try {
            $subscription = $this->paypal->createSubscription([
                'plan_id' => $paypalPlanId,
                'custom_id' => (string) $workspace->id,
                'application_context' => [
                    'brand_name' => (string) config('app.name', 'OrbyChat'),
                    'user_action' => 'SUBSCRIBE_NOW',
                    'return_url' => url('/app/billing?checkout=success&gateway=paypal'),
                    'cancel_url' => url('/app/billing?checkout=cancelled&gateway=paypal'),
                ],
            ]);
        } catch (\Throwable $e) {
            return back()->with('error', __('PayPal could not create the subscription: ').$e->getMessage());
        }

        $approvalUrl = $this->approvalUrlFromPayPal($subscription);

        if ($approvalUrl === null) {
            return back()->with('error', __('PayPal did not return an approval URL.'));
        }

        $workspace->forceFill([
            'payment_gateway' => PaymentGatewayRegistry::PAYPAL,
            'paypal_subscription_id' => (string) ($subscription['id'] ?? ''),
        ])->save();

        return redirect()->away($approvalUrl);
    }

    private function checkoutWithRazorpay(Request $request, $workspace, Plan $plan): InertiaResponse|RedirectResponse|Response
    {
        try {
            $razorpayPlanId = $this->razorpaySync->ensurePlanFor($plan);
        } catch (\Throwable $e) {
            return back()->with('error', __('Could not initialize Razorpay plan: ').$e->getMessage());
        }

        try {
            $subscription = $this->razorpay->createSubscription([
                'plan_id' => $razorpayPlanId,
                'customer_notify' => 1,
                'quantity' => 1,
                'total_count' => 120,
                'notes' => [
                    'workspace_id' => (string) $workspace->id,
                    'plan_id' => (string) $plan->id,
                    'plan_slug' => $plan->slug,
                ],
            ]);
        } catch (\Throwable $e) {
            return back()->with('error', __('Razorpay could not create the subscription: ').$e->getMessage());
        }

        $subscriptionId = (string) ($subscription['id'] ?? '');

        if ($subscriptionId === '') {
            return back()->with('error', __('Razorpay did not return a subscription id.'));
        }

        $workspace->forceFill([
            'payment_gateway' => PaymentGatewayRegistry::RAZORPAY,
            'razorpay_subscription_id' => $subscriptionId,
        ])->save();

        // Razorpay's Checkout.js expects to be opened from the customer's
        // browser with a public key + subscription id. We render a thin
        // launcher page that boots the script and forwards success/cancel
        // back to /app/billing.
        return Inertia::render('app/razorpay-checkout', [
            'razorpay_key_id' => $this->razorpay->publicKey(),
            'subscription_id' => $subscriptionId,
            'plan' => [
                'name' => $plan->name,
                'price_cents' => (int) $plan->price_cents,
                'currency' => strtoupper((string) config('cashier.currency', 'usd')),
            ],
            'customer' => [
                'name' => (string) ($request->user()?->name ?? ''),
                'email' => (string) ($request->user()?->email ?? ''),
            ],
            'success_url' => url('/app/billing?checkout=success&gateway=razorpay'),
            'cancel_url' => url('/app/billing?checkout=cancelled&gateway=razorpay'),
        ]);
    }

    /**
     * @param  array<string, mixed>  $subscription
     */
    private function approvalUrlFromPayPal(array $subscription): ?string
    {
        /** @var array<int, array<string, string>> $links */
        $links = $subscription['links'] ?? [];

        foreach ($links as $link) {
            if (($link['rel'] ?? '') === 'approve' && isset($link['href'])) {
                return (string) $link['href'];
            }
        }

        return null;
    }
}
