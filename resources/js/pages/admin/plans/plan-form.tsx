import type { Method } from '@inertiajs/core';
import { Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type PlanFormValues = {
    name: string;
    monthly_conversations: number;
    monthly_messages: number | null;
    max_tokens_per_response: number | null;
    price_cents: number;
    interval: 'month' | 'year';
    is_active: boolean;
    features: { remove_branding: boolean };
};

type Props = {
    initial: PlanFormValues;
    /** PATCH on edit, POST on create. */
    method: Extract<Method, 'post' | 'patch'>;
    /** Submit URL. */
    action: string;
    submitLabel: string;
    currency: string;
    /**
     * Stripe IDs (read-only on edit). Helpful surface so admins can
     * cross-reference what's wired in their Stripe dashboard without
     * leaving the page.
     */
    readonly?: {
        stripe_product_id: string | null;
        stripe_price_id: string | null;
    };
};

const dollarsToCents = (value: string): number => {
    const cleaned = value.replace(/[^\d.]/g, '');

    if (cleaned === '') {
        return 0;
    }

    const dollars = Number.parseFloat(cleaned);

    return Number.isFinite(dollars) ? Math.round(dollars * 100) : 0;
};

const centsToDollars = (cents: number): string => {
    if (!Number.isFinite(cents) || cents === 0) {
        return '';
    }

    return (cents / 100).toFixed(2);
};

export function PlanForm({
    initial,
    method,
    action,
    submitLabel,
    currency,
    readonly,
}: Props) {
    const form = useForm<PlanFormValues>(initial);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.submit(method, action, { preserveScroll: true });
    };

    const isPaid = form.data.price_cents > 0;

    return (
        <form onSubmit={submit} className="grid gap-4">
            <Card className="p-4">
                <h2 className="font-semibold">Plan</h2>
                <p className="mb-4 text-xs text-muted-foreground">
                    Saved here, then mirrored to Stripe as a Product + Price
                    automatically. Free / custom plans (price -‰¤ 0) skip the
                    Stripe step.
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-1.5">
                        <Label htmlFor="plan-name">Display name</Label>
                        <Input
                            id="plan-name"
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData('name', e.target.value)
                            }
                            placeholder="Standard"
                            required
                        />
                        {form.errors.name && (
                            <p className="text-xs text-destructive">
                                {form.errors.name}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-1.5">
                        <Label htmlFor="plan-conversations">
                            Monthly conversations
                        </Label>
                        <Input
                            id="plan-conversations"
                            type="number"
                            min={0}
                            value={form.data.monthly_conversations}
                            onChange={(e) =>
                                form.setData(
                                    'monthly_conversations',
                                    Number.parseInt(e.target.value, 10) || 0,
                                )
                            }
                            placeholder="500"
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            0 = unlimited.
                        </p>
                        {form.errors.monthly_conversations && (
                            <p className="text-xs text-destructive">
                                {form.errors.monthly_conversations}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-1.5">
                        <Label htmlFor="plan-price">
                            Price ({currency.toUpperCase()} per{' '}
                            {form.data.interval === 'year' ? 'year' : 'month'})
                        </Label>
                        <Input
                            id="plan-price"
                            type="text"
                            inputMode="decimal"
                            value={centsToDollars(form.data.price_cents)}
                            onChange={(e) =>
                                form.setData(
                                    'price_cents',
                                    dollarsToCents(e.target.value),
                                )
                            }
                            placeholder="49.00"
                        />
                        <p className="text-xs text-muted-foreground">
                            Set to 0 for free / custom-quote plans.
                        </p>
                        {form.errors.price_cents && (
                            <p className="text-xs text-destructive">
                                {form.errors.price_cents}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-1.5">
                        <Label htmlFor="plan-interval">Billing interval</Label>
                        <div
                            id="plan-interval"
                            className="inline-flex rounded-md border bg-muted/50 p-1 text-sm"
                            role="radiogroup"
                            aria-label="Billing interval"
                        >
                            {(
                                [
                                    { v: 'month', label: 'Monthly' },
                                    { v: 'year', label: 'Yearly' },
                                ] as const
                            ).map((opt) => (
                                <button
                                    key={opt.v}
                                    type="button"
                                    role="radio"
                                    aria-checked={form.data.interval === opt.v}
                                    onClick={() =>
                                        form.setData('interval', opt.v)
                                    }
                                    className={`rounded px-3 py-1 transition ${
                                        form.data.interval === opt.v
                                            ? 'bg-background font-semibold shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            For an annual variant of an existing plan, create a
                            separate row with the same display name and interval
                            = Yearly. The pricing page groups them under one
                            toggle.
                        </p>
                        {form.errors.interval && (
                            <p className="text-xs text-destructive">
                                {form.errors.interval}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-1.5">
                        <Label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={form.data.is_active}
                                onChange={(e) =>
                                    form.setData('is_active', e.target.checked)
                                }
                                className="size-4"
                            />
                            <span>Active (purchasable)</span>
                        </Label>
                        <p className="text-xs text-muted-foreground">
                            Inactive plans stay in the DB but don't appear on
                            the marketing pricing page or Stripe checkout.
                        </p>
                    </div>
                </div>
            </Card>

            <Card className="p-4">
                <h2 className="font-semibold">AI rate limits</h2>
                <p className="mb-4 text-xs text-muted-foreground">
                    Optional dials for throttling LLM cost. Both fields default
                    to "no extra cap"  —  leave blank to gate on the monthly
                    conversation count alone.
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-1.5">
                        <Label htmlFor="plan-monthly-messages">
                            Monthly messages cap
                        </Label>
                        <Input
                            id="plan-monthly-messages"
                            type="number"
                            min={0}
                            value={form.data.monthly_messages ?? ''}
                            onChange={(e) => {
                                const raw = e.target.value;
                                form.setData(
                                    'monthly_messages',
                                    raw === ''
                                        ? null
                                        : Number.parseInt(raw, 10) || 0,
                                );
                            }}
                            placeholder="leave blank for no cap"
                        />
                        <p className="text-xs text-muted-foreground">
                            Counts every visitor message. The widget returns a
                            "quota exceeded" error when the workspace passes
                            this threshold for the current calendar month.
                        </p>
                        {form.errors.monthly_messages && (
                            <p className="text-xs text-destructive">
                                {form.errors.monthly_messages}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-1.5">
                        <Label htmlFor="plan-max-tokens">
                            Max tokens per response
                        </Label>
                        <Input
                            id="plan-max-tokens"
                            type="number"
                            min={100}
                            max={8000}
                            value={form.data.max_tokens_per_response ?? ''}
                            onChange={(e) => {
                                const raw = e.target.value;
                                form.setData(
                                    'max_tokens_per_response',
                                    raw === ''
                                        ? null
                                        : Number.parseInt(raw, 10) || 0,
                                );
                            }}
                            placeholder="leave blank for default (800)"
                        />
                        <p className="text-xs text-muted-foreground">
                            Caps each LLM reply at this many tokens. Useful for
                            keeping the free tier short and the paid tiers
                            verbose. Must be -‰¥ 100, -‰¤ 8000.
                        </p>
                        {form.errors.max_tokens_per_response && (
                            <p className="text-xs text-destructive">
                                {form.errors.max_tokens_per_response}
                            </p>
                        )}
                    </div>
                </div>
            </Card>

            <Card className="p-4">
                <h2 className="font-semibold">Features</h2>
                <p className="mb-4 text-xs text-muted-foreground">
                    Plan-level capability flags. Stored as JSON on the plan row;
                    consumed by middleware / UI gates.
                </p>

                <Label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={form.data.features.remove_branding}
                        onChange={(e) =>
                            form.setData('features', {
                                ...form.data.features,
                                remove_branding: e.target.checked,
                            })
                        }
                        className="size-4"
                    />
                    <span className="text-sm">
                        Remove "Powered by" widget branding
                    </span>
                </Label>
            </Card>

            {readonly && (
                <Card className="p-4">
                    <h2 className="font-semibold">Stripe</h2>
                    <p className="mb-3 text-xs text-muted-foreground">
                        These are managed automatically when you save. Read-only
                        for reference.
                    </p>

                    <div className="grid gap-3 md:grid-cols-2">
                        <div>
                            <Label className="text-xs text-muted-foreground">
                                Product ID
                            </Label>
                            <p className="mt-1 font-mono text-xs break-all">
                                {readonly.stripe_product_id ?? (
                                    <span className="text-muted-foreground/60">
                                        not synced yet (paid plans only)
                                    </span>
                                )}
                            </p>
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground">
                                Price ID
                            </Label>
                            <p className="mt-1 font-mono text-xs break-all">
                                {readonly.stripe_price_id ?? (
                                    <span className="text-muted-foreground/60">
                                        not synced yet (paid plans only)
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    {isPaid && (
                        <p className="mt-3 text-xs text-muted-foreground">
                            Changing the price archives the current Stripe Price
                            and creates a new one. Existing subscriptions stay
                            on the old price until you migrate them.
                        </p>
                    )}
                </Card>
            )}

            <div className="flex items-center justify-end gap-2">
                <Button asChild type="button" variant="ghost">
                    <Link href="/admin/plans">Cancel</Link>
                </Button>
                <Button type="submit" disabled={form.processing}>
                    {form.processing ? 'Saving…' : submitLabel}
                </Button>
            </div>
        </form>
    );
}
