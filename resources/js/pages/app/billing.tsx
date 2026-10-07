import { Head, router } from '@inertiajs/react';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';

type Gateway = 'stripe' | 'paypal' | 'razorpay';

type Plan = {
    id: string;
    name: string;
    slug: 'free' | 'standard' | 'pro' | 'custom' | string;
    monthly_conversations: number;
    price_cents: number;
    features: string[] | null;
    is_purchasable: boolean;
};

type Summary = {
    plan: {
        id: string;
        name: string;
        slug: string;
        monthly_conversations: number;
        price_cents: number;
    } | null;
    used: number;
    limit: number;
    percent: number;
    subscription_status: string | null;
};

type Props = {
    plans: Plan[];
    summary: Summary;
    stripe_configured: boolean;
    available_gateways: Gateway[];
    has_active_subscription: boolean;
    active_gateway: Gateway | null;
    flash_checkout?: { status: string | null; gateway?: string | null };
};

const TAGLINE: Record<string, string> = {
    free: __('For getting live fast'),
    standard: __('Level up productivity'),
    pro: __('For teams ready to scale'),
    custom: __('Tailored solutions for enterprises'),
};

const GATEWAY_LABEL: Record<Gateway, string> = {
    stripe: __('Credit / debit card (Stripe)'),
    paypal: __('PayPal'),
    razorpay: __('Razorpay (UPI, cards, netbanking)'),
};

const formatPrice = (cents: number, slug: string): string => {
    if (slug === 'custom') {
        return __('Custom');
    }

    if (cents === 0) {
        return '$0';
    }

    return `$${Math.round(cents / 100)}`;
};

const formatLimit = (n: number): string => {
    if (n === 0) {
        return __('Unlimited');
    }

    if (n >= 1000) {
        return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
    }

    return n.toLocaleString();
};

export default function BillingPage({
    plans,
    summary,
    stripe_configured,
    available_gateways,
    has_active_subscription,
    flash_checkout,
}: Props) {
    const currentSlug = summary.plan?.slug ?? 'free';
    const checkoutStatus = flash_checkout?.status ?? null;

    const gateways = available_gateways ?? [];
    const anyConfigured = gateways.length > 0;

    // Pending plan slug while picking a gateway. Null when the modal isn't
    // open. We always pick a default gateway (first available) so the
    // submit button works without a forced selection.
    const [pendingSlug, setPendingSlug] = useState<string | null>(null);
    const [pendingGateway, setPendingGateway] = useState<Gateway | null>(
        gateways[0] ?? null,
    );

    const onChoose = (slug: string) => {
        if (!anyConfigured) {
            return;
        }

        // Only one gateway live? Skip the picker  —  submit straight through.
        if (gateways.length === 1) {
            router.post('/billing/checkout', {
                plan_slug: slug,
                gateway: gateways[0],
            });

            return;
        }

        setPendingSlug(slug);
        setPendingGateway(gateways[0] ?? null);
    };

    const onConfirmGateway = () => {
        if (pendingSlug === null || pendingGateway === null) {
            return;
        }

        router.post('/billing/checkout', {
            plan_slug: pendingSlug,
            gateway: pendingGateway,
        });

        setPendingSlug(null);
    };

    const usagePercent =
        summary.limit === 0 ? 0 : Math.min(100, summary.percent);
    const overLimit = summary.limit > 0 && summary.used >= summary.limit;
    const nearLimit = !overLimit && usagePercent >= 80;

    const getPlanFeatures = (plan: Plan): string[] => {
        return Array.isArray(plan.features) ? plan.features : [];
    };

    return (
        <AppLayout breadcrumbs={[{ title: __('Billing'), href: '/app/billing' }]}>
            <Head title={__('Billing')} />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {__('Billing')}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {__('Plans, usage, and subscription for this workspace.')}
                    </p>
                </div>

                {checkoutStatus === 'success' && (
                    <Card className="border-emerald-500/30 bg-emerald-500/5 p-4">
                        <p className="text-sm text-emerald-700 dark:text-emerald-400">
                            {__('Subscription confirmed  —  your new plan is active. If you don\'t see the change yet, it\'ll appear once the payment provider finishes notifying us (usually within a few seconds).')}
                        </p>
                    </Card>
                )}
                {checkoutStatus === 'cancelled' && (
                    <Card className="border-amber-500/30 bg-amber-500/5 p-4">
                        <p className="text-sm text-amber-700 dark:text-amber-400">
                            {__('Checkout cancelled  —  no charge was made.')}
                        </p>
                    </Card>
                )}

                <Card className="p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-xs tracking-wide text-muted-foreground uppercase">
                                {__('Current plan')}
                            </p>
                            <p className="mt-1 text-xl font-semibold">
                                {__(summary.plan?.name ?? 'Free')}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs tracking-wide text-muted-foreground uppercase">
                                {__('This month')}
                            </p>
                            <p className="mt-1 text-xl font-semibold">
                                {summary.used.toLocaleString()}
                                <span className="text-sm font-normal text-muted-foreground">
                                    {' '}
                                    /{' '}
                                    {summary.limit === 0
                                        ? __('Unlimited')
                                        : `${summary.limit.toLocaleString()} ${__('conversations')}`}
                                </span>
                            </p>
                        </div>
                    </div>
                    {has_active_subscription && (
                        <div className="mt-4 flex justify-end">
                            <Button asChild variant="outline" size="sm">
                                <a href="/billing/portal">
                                    {__('Manage subscription')}
                                </a>
                            </Button>
                        </div>
                    )}
                    {summary.limit > 0 && (
                        <div className="mt-4">
                            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                    className={`h-full transition-all ${
                                        overLimit
                                            ? 'bg-rose-500'
                                            : nearLimit
                                              ? 'bg-amber-500'
                                              : 'bg-emerald-500'
                                    }`}
                                    style={{ width: `${usagePercent}%` }}
                                />
                            </div>
                            {overLimit && (
                                <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">
                                    {__('You\'ve reached your monthly conversation limit. New visitors get a friendly "we\'re full" message until you upgrade or the month resets.')}
                                </p>
                            )}
                            {nearLimit && (
                                <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                                    {__( ':percent% of your monthly conversation budget remaining.', { percent: 100 - usagePercent } )}
                                </p>
                            )}
                        </div>
                    )}
                </Card>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {plans.map((plan) => {
                        const isCurrent = plan.slug === currentSlug;
                        const tagline = TAGLINE[plan.slug] ?? '';

                        return (
                            <Card
                                key={plan.id}
                                className={`flex flex-col p-5 ${isCurrent ? 'border-foreground/30 ring-1 ring-foreground/20' : ''}`}
                            >
                                <div className="mb-4 flex items-center gap-2">
                                    <h2 className="text-xl font-semibold tracking-tight">
                                        {__(plan.name)}
                                    </h2>
                                    {plan.slug === 'standard' && (
                                        <span className="rounded bg-gradient-to-r from-violet-500 to-orange-500 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase">
                                            {__('Popular')}
                                        </span>
                                    )}
                                    {isCurrent && (
                                        <span className="rounded bg-foreground/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
                                            {__('Current')}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {tagline}
                                </p>

                                <div className="mt-6">
                                    <span className="text-3xl font-semibold">
                                        {formatPrice(
                                            plan.price_cents,
                                            plan.slug,
                                        )}
                                    </span>
                                    {plan.slug !== 'custom' && (
                                        <span className="ml-1 text-xs text-muted-foreground">
                                            {__('/ month')}
                                        </span>
                                    )}
                                </div>

                                <ul className="mt-5 flex-1 space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                        <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                                        <span>
                                            {__(':count conversations', { count: formatLimit(plan.monthly_conversations) })}
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                                        <span>{__('Unlimited data sources')}</span>
                                    </li>
                                    {getPlanFeatures(plan).map((f) => (
                                        <li
                                            key={f}
                                            className="flex items-start gap-2"
                                        >
                                            <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                                            <span>{__(f)}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-6">
                                    {isCurrent ? (
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            disabled
                                        >
                                            {__('Current plan')}
                                        </Button>
                                    ) : plan.slug === 'custom' ? (
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="w-full"
                                        >
                                            <a href={`mailto:sales@orby.chat?subject=${encodeURIComponent(__('Custom plan'))}`}>
                                                {__('Contact sales')}
                                            </a>
                                        </Button>
                                    ) : (
                                        <Button
                                            className="w-full"
                                            disabled={!plan.is_purchasable}
                                            onClick={() => onChoose(plan.slug)}
                                            title={
                                                !plan.is_purchasable
                                                    ? __('No payment gateway is configured for this install yet')
                                                    : undefined
                                            }
                                        >
                                            {plan.is_purchasable
                                                ? __(`Choose :plan`, { plan: __(plan.name) })
                                                : __('Coming soon')}
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {!anyConfigured && (
                    <Card className="border-dashed p-4">
                        <p className="text-sm text-muted-foreground">
                            {__('No payment gateway is configured yet, so paid plans show as "Coming soon". Configure Stripe, PayPal, or Razorpay in Settings → System → Billing to enable upgrades.')}
                        </p>
                    </Card>
                )}

                {!stripe_configured && anyConfigured && (
                    <Card className="border-dashed p-4">
                        <p className="text-xs text-muted-foreground">
                            {__('Stripe isn\'t configured on this install  —  paid plans still work via :gateways but card-only checkout via Stripe is unavailable.', { gateways: gateways.join(' / ') })}
                        </p>
                    </Card>
                )}
            </div>

            <Dialog
                open={pendingSlug !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setPendingSlug(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{__('Pick a payment method')}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                        {gateways.map((g) => (
                            <label
                                key={g}
                                className={`flex cursor-pointer items-center gap-3 rounded border p-3 text-sm transition ${
                                    pendingGateway === g
                                        ? 'border-foreground/40 bg-foreground/5'
                                        : 'border-border hover:bg-foreground/5'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="gateway"
                                    value={g}
                                    checked={pendingGateway === g}
                                    onChange={() => setPendingGateway(g)}
                                />
                                <span>{GATEWAY_LABEL[g]}</span>
                            </label>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setPendingSlug(null)}
                        >
                            {__('Cancel')}
                        </Button>
                        <Button
                            onClick={onConfirmGateway}
                            disabled={pendingGateway === null}
                        >
                            {__('Continue')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
