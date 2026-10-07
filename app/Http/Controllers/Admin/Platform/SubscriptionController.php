<?php

namespace App\Http\Controllers\Admin\Platform;

use App\Models\Plan;
use App\Models\Workspace;
use App\Support\Pagination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Cashier\Subscription;

/**
 * Platform-level subscription overview — MRR, active subscription count
 * by plan, plus a per-workspace breakdown. This is what super-admins see
 * instead of the customer-side /app/billing page.
 *
 * Read-only for v1: cancelations / refunds / impersonated checkouts go
 * via Stripe Dashboard for now.
 */
class SubscriptionController
{
    public function index(Request $request): Response
    {
        $q = trim((string) $request->query('q', ''));
        $plans = Plan::query()
            ->where('is_active', true)
            ->orderBy('price_cents')
            ->get(['id', 'name', 'slug', 'price_cents', 'monthly_conversations']);

        // Active subscriptions = Cashier rows in 'active' or 'trialing' state.
        // 'past_due' grants access during grace but doesn't pay yet — count
        // it separately so we can show "at risk" revenue.
        $activeStatuses = ['active', 'trialing'];
        $atRiskStatuses = ['past_due'];

        $subscriptions = Subscription::query()
            ->whereIn('stripe_status', array_merge($activeStatuses, $atRiskStatuses))
            ->get(['id', 'workspace_id', 'stripe_status', 'stripe_price', 'created_at', 'ends_at']);

        // Map Stripe price IDs → local Plan rows so we can roll up by plan.
        $plansByStripeId = Plan::query()
            ->whereNotNull('stripe_price_id')
            ->get(['id', 'name', 'slug', 'price_cents', 'stripe_price_id'])
            ->keyBy('stripe_price_id');

        $mrrCents = 0;
        $atRiskCents = 0;
        $byPlanCount = []; // plan_slug => count
        foreach ($subscriptions as $sub) {
            $plan = $plansByStripeId->get((string) $sub->stripe_price);
            if ($plan === null) {
                continue;
            }
            $byPlanCount[$plan->slug] = ($byPlanCount[$plan->slug] ?? 0) + 1;
            if (in_array($sub->stripe_status, $activeStatuses, true)) {
                $mrrCents += (int) $plan->price_cents;
            } else {
                $atRiskCents += (int) $plan->price_cents;
            }
        }

        // Workspace-level breakdown — one row per workspace with a paid
        // plan_id set OR an active Cashier subscription.
        $workspacesQuery = Workspace::query()
            ->withoutGlobalScopes()
            ->where(function ($outer) use ($subscriptions) {
                $outer->whereNotNull('plan_id')
                    ->orWhereIn('id', $subscriptions->pluck('workspace_id'));
            })
            ->with('plan:id,name,slug,price_cents,monthly_conversations')
            ->orderBy('created_at');

        if ($q !== '') {
            $like = "%{$q}%";
            $workspacesQuery->where(function ($w) use ($like) {
                $w->where('name', 'like', $like)
                    ->orWhere('slug', 'like', $like)
                    ->orWhere('stripe_id', 'like', $like);
            });
        }

        $paginator = $workspacesQuery
            ->paginate(25, ['id', 'name', 'slug', 'plan_id', 'stripe_id', 'created_at'])
            ->withQueryString();

        $subsByWorkspace = $subscriptions->keyBy('workspace_id');

        $rows = collect($paginator->items())->map(function (Workspace $w) use ($subsByWorkspace) {
            $sub = $subsByWorkspace->get($w->id);

            return [
                'workspace_id' => $w->id,
                'workspace_name' => $w->name,
                'workspace_slug' => $w->slug,
                'plan' => $w->plan?->name ?? '—',
                'plan_slug' => $w->plan?->slug ?? null,
                'price_cents' => (int) ($w->plan?->price_cents ?? 0),
                'monthly_conversations' => (int) ($w->plan?->monthly_conversations ?? 0),
                'stripe_status' => $sub?->stripe_status ?? 'no_subscription',
                'stripe_customer_id' => $w->stripe_id,
                'created_at' => $w->created_at?->toIso8601String(),
                'ends_at' => $sub?->ends_at?->toIso8601String(),
            ];
        })->values();

        // Snapshot total customers ever — useful for churn baseline later.
        $totalWorkspaces = (int) DB::table('workspaces')->whereNull('deleted_at')->count();

        return Inertia::render('admin/subscriptions/index', [
            'totals' => [
                'mrr_cents' => $mrrCents,
                'at_risk_cents' => $atRiskCents,
                'active_count' => $subscriptions->whereIn('stripe_status', $activeStatuses)->count(),
                'past_due_count' => $subscriptions->whereIn('stripe_status', $atRiskStatuses)->count(),
                'total_workspaces' => $totalWorkspaces,
            ],
            'plans' => $plans->map(fn (Plan $p) => [
                'name' => $p->name,
                'slug' => $p->slug,
                'price_cents' => (int) $p->price_cents,
                'monthly_conversations' => (int) $p->monthly_conversations,
                'subscriber_count' => $byPlanCount[$p->slug] ?? 0,
            ])->values(),
            'workspaces' => $rows,
            'pagination' => Pagination::meta($paginator),
            'filters' => ['q' => $q],
        ]);
    }
}
