<?php

namespace App\Http\Controllers\Admin\Platform;

use App\Models\Plan;
use App\Services\Billing\PaymentGatewayRegistry;
use App\Services\Billing\PayPalProductSync;
use App\Services\Billing\RazorpayProductSync;
use App\Services\Billing\StripeProductSync;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Platform-admin CRUD for subscription plans. Every save runs a
 * provisioning sync against EVERY enabled-and-configured payment gateway
 * (Stripe + PayPal + Razorpay) so admins never touch the gateway
 * dashboards to provision Products / Prices / Plans by hand.
 *
 * Free / Custom plans (price_cents=0) are local-only and skip every
 * gateway sync — paid plans get a Product + Price reflected on each
 * gateway the workspace lets visitors pay through.
 *
 * Delete is soft (is_active=false + archive on every gateway), never
 * destructive, because workspaces.plan_id is a real FK and
 * revenue-bearing subscriptions still need their plan row resolvable
 * for invoices.
 */
class PlanController
{
    public function __construct(
        private readonly StripeProductSync $stripe,
        private readonly PayPalProductSync $paypal,
        private readonly RazorpayProductSync $razorpay,
        private readonly PaymentGatewayRegistry $gateways,
    ) {}

    public function index(Request $request): Response
    {
        $rows = Plan::query()
            ->withCount('workspaces')
            ->orderBy('price_cents')
            ->orderBy('name')
            ->get()
            ->map(fn (Plan $plan) => $this->serialize($plan));

        return Inertia::render('admin/plans/index', [
            'plans' => $rows,
            'currency' => strtolower((string) config('cashier.currency', 'usd')),
            'gateways' => $this->gatewayStatuses(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/plans/create', [
            'currency' => strtolower((string) config('cashier.currency', 'usd')),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatedFor($request);
        $data['slug'] = $this->ensureUniqueSlug($data['name']);

        $plan = Plan::create($data);

        $this->trySyncAll($plan);

        return redirect()
            ->route('admin.plans.index')
            ->with('success', "Plan '{$plan->name}' created.");
    }

    public function edit(Plan $plan): Response
    {
        return Inertia::render('admin/plans/edit', [
            'plan' => $this->serialize($plan),
            'currency' => strtolower((string) config('cashier.currency', 'usd')),
        ]);
    }

    public function update(Request $request, Plan $plan): RedirectResponse
    {
        $data = $this->validatedFor($request, $plan);
        $plan->update($data);

        $this->trySyncAll($plan->fresh() ?? $plan);

        return redirect()
            ->route('admin.plans.index')
            ->with('success', "Plan '{$plan->name}' updated.");
    }

    /**
     * Manually re-run the gateway sync for one plan + one gateway.
     * Wired to the per-row gateway sync buttons on the index page.
     * Returns JSON so the UI can render the result inline + show the
     * freshly-stored gateway IDs without a full page reload.
     */
    public function sync(Plan $plan, string $gateway = PaymentGatewayRegistry::STRIPE): JsonResponse
    {
        if (! in_array($gateway, [PaymentGatewayRegistry::STRIPE, PaymentGatewayRegistry::PAYPAL, PaymentGatewayRegistry::RAZORPAY], true)) {
            return response()->json([
                'ok' => false,
                'message' => "Unknown gateway '{$gateway}'.",
            ], 422);
        }

        // Free / custom plans don't need any gateway-side entity. Use
        // gateway-specific message wording so existing tests + UX text
        // stay readable. Backwards-compat top-level Stripe IDs preserved
        // for the legacy /sync endpoint that doesn't carry a gateway
        // path segment.
        if ($plan->price_cents <= 0) {
            $label = match ($gateway) {
                PaymentGatewayRegistry::STRIPE => 'no Stripe sync needed',
                PaymentGatewayRegistry::PAYPAL => 'no PayPal sync needed',
                PaymentGatewayRegistry::RAZORPAY => 'no Razorpay sync needed',
            };

            return response()->json($this->syncResponse(
                ok: true,
                message: "Free / custom plans are local-only — {$label}.",
                plan: $plan,
            ));
        }

        if (! $this->gateways->isEnabled($gateway)) {
            return response()->json($this->syncResponse(
                ok: false,
                message: ucfirst($gateway).' is disabled in Settings → System → Billing.',
                plan: $plan,
            ));
        }

        if (! $this->gateways->isConfigured($gateway)) {
            return response()->json($this->syncResponse(
                ok: false,
                message: ucfirst($gateway).' is enabled but missing credentials. Check Settings → System.',
                plan: $plan,
            ));
        }

        try {
            match ($gateway) {
                PaymentGatewayRegistry::STRIPE => $this->stripe->syncPlan($plan),
                PaymentGatewayRegistry::PAYPAL => $this->paypal->syncPlan($plan),
                PaymentGatewayRegistry::RAZORPAY => $this->razorpay->syncPlan($plan),
            };

            return response()->json($this->syncResponse(
                ok: true,
                message: 'Synced — '.ucfirst($gateway).' Product / Plan up to date.',
                plan: $plan->fresh() ?? $plan,
            ));
        } catch (\Throwable $e) {
            return response()->json($this->syncResponse(
                ok: false,
                message: $e->getMessage(),
                plan: $plan,
            ), 200);
        }
    }

    /**
     * Shape JSON for the /sync endpoint with backwards-compatible
     * top-level Stripe IDs (the legacy contract older clients +
     * existing tests rely on) plus the full multi-gateway snapshot
     * under `plan` for the new index page.
     *
     * @return array<string, mixed>
     */
    private function syncResponse(bool $ok, string $message, Plan $plan): array
    {
        return [
            'ok' => $ok,
            'message' => $message,
            'stripe_product_id' => $plan->stripe_product_id,
            'stripe_price_id' => $plan->stripe_price_id,
            'plan' => $this->serialize($plan),
        ];
    }

    public function destroy(Plan $plan): RedirectResponse
    {
        // Soft-delete: never break the foreign keys workspaces.plan_id
        // depends on. The plan row stays for invoice / audit lookups;
        // only is_active flips and every enabled gateway gets archived.
        $plan->forceFill(['is_active' => false])->save();

        $errors = [];
        foreach ($this->gateways->enabledGateways() as $gateway) {
            try {
                match ($gateway) {
                    PaymentGatewayRegistry::STRIPE => $this->stripe->archivePlan($plan),
                    PaymentGatewayRegistry::PAYPAL => $this->paypal->archivePlan($plan),
                    PaymentGatewayRegistry::RAZORPAY => $this->razorpay->archivePlan($plan),
                };
            } catch (\Throwable $e) {
                $errors[] = ucfirst($gateway).': '.$e->getMessage();
            }
        }

        if ($errors !== []) {
            return redirect()
                ->route('admin.plans.index')
                ->with('error', 'Plan deactivated locally but archive failed: '.implode(' | ', $errors));
        }

        return redirect()
            ->route('admin.plans.index')
            ->with('success', "Plan '{$plan->name}' deactivated.");
    }

    /**
     * @return array<string, mixed>
     */
    private function validatedFor(Request $request, ?Plan $plan = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:80'],
            'monthly_conversations' => ['required', 'integer', 'min:0', 'max:1000000'],
            'monthly_messages' => ['nullable', 'integer', 'min:0', 'max:10000000'],
            'max_tokens_per_response' => ['nullable', 'integer', 'min:100', 'max:8000'],
            'price_cents' => ['required', 'integer', 'min:0', 'max:99999900'],
            'interval' => ['sometimes', 'string', Rule::in(['month', 'year'])],
            'is_active' => ['sometimes', 'boolean'],
            'features' => ['nullable', 'array'],
            'features.remove_branding' => ['sometimes', 'boolean'],
            // Slug isn't admin-editable on update — it locks once a row
            // exists so workspaces.plan_id lookups by slug stay stable.
            'slug' => $plan === null
                ? ['nullable', 'string', 'max:80', 'alpha_dash', Rule::unique('plans', 'slug')]
                : ['nullable', 'string'],
        ]);
    }

    /**
     * Slug autogeneration on create. Falls back to a numeric suffix on
     * collision so an admin retyping "Standard" twice doesn't 500.
     */
    private function ensureUniqueSlug(string $name): string
    {
        $base = Str::slug($name);

        if ($base === '') {
            $base = 'plan-'.Str::random(6);
        }

        $slug = $base;
        $i = 2;

        while (Plan::query()->where('slug', $slug)->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }

    /**
     * Run every enabled-and-configured gateway's sync. Failures on one
     * gateway don't roll back the local plan write or block the others —
     * the admin gets a flash message naming the gateways that failed and
     * can re-run them individually from the index page.
     */
    private function trySyncAll(Plan $plan): void
    {
        if ($plan->price_cents <= 0) {
            return;
        }

        $errors = [];
        foreach ($this->gateways->enabledGateways() as $gateway) {
            try {
                match ($gateway) {
                    PaymentGatewayRegistry::STRIPE => $this->stripe->syncPlan($plan),
                    PaymentGatewayRegistry::PAYPAL => $this->paypal->syncPlan($plan),
                    PaymentGatewayRegistry::RAZORPAY => $this->razorpay->syncPlan($plan),
                };
            } catch (\Throwable $e) {
                $errors[] = ucfirst($gateway).': '.$e->getMessage();
            }
        }

        if ($errors !== []) {
            session()->flash(
                'error',
                'Plan saved locally, but gateway sync failed → '.implode(' | ', $errors),
            );
        }
    }

    /**
     * Build the wire payload for one plan, including the gateway-side
     * IDs the index page renders into per-gateway badges.
     *
     * @return array<string, mixed>
     */
    private function serialize(Plan $plan): array
    {
        return [
            'id' => $plan->id,
            'name' => $plan->name,
            'slug' => $plan->slug,
            'monthly_conversations' => $plan->monthly_conversations,
            'monthly_messages' => $plan->monthly_messages,
            'max_tokens_per_response' => $plan->max_tokens_per_response,
            'price_cents' => $plan->price_cents,
            'interval' => $plan->interval ?? 'month',
            'features' => $plan->features ?? [],
            'is_active' => (bool) $plan->is_active,
            'workspaces_count' => (int) ($plan->workspaces_count ?? 0),
            'created_at' => $plan->created_at?->toIso8601String(),
            'gateway_ids' => [
                'stripe' => [
                    'product' => $plan->stripe_product_id,
                    'price' => $plan->stripe_price_id,
                ],
                'paypal' => [
                    'product' => $plan->paypal_product_id ?? null,
                    'plan' => $plan->paypal_plan_id ?? null,
                ],
                'razorpay' => [
                    'plan' => $plan->razorpay_plan_id ?? null,
                ],
            ],
        ];
    }

    /**
     * Per-gateway availability snapshot the index page uses to decide
     * which sync columns to render and which buttons to disable.
     *
     * @return array<string, array{enabled: bool, configured: bool, available: bool}>
     */
    private function gatewayStatuses(): array
    {
        $out = [];
        foreach ([PaymentGatewayRegistry::STRIPE, PaymentGatewayRegistry::PAYPAL, PaymentGatewayRegistry::RAZORPAY] as $gateway) {
            $out[$gateway] = [
                'enabled' => $this->gateways->isEnabled($gateway),
                'configured' => $this->gateways->isConfigured($gateway),
                'available' => $this->gateways->isAvailable($gateway),
            ];
        }

        return $out;
    }
}
