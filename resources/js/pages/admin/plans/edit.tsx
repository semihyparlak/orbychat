import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { PlanForm } from './plan-form';

type Plan = {
    id: string;
    name: string;
    slug: string;
    monthly_conversations: number;
    monthly_messages: number | null;
    max_tokens_per_response: number | null;
    price_cents: number;
    interval: 'month' | 'year';
    stripe_product_id: string | null;
    stripe_price_id: string | null;
    features: Record<string, boolean>;
    is_active: boolean;
};

type Props = { plan: Plan; currency: string };

export default function EditPlan({ plan, currency }: Props) {
    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Admin', href: '/admin' },
                { title: 'Plans', href: '/admin/plans' },
                {
                    title: plan.name,
                    href: `/admin/plans/${plan.id}/edit`,
                },
            ]}
        >
            <Head title={`Edit ${plan.name} -· Admin`} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {plan.name}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Slug: <span className="font-mono">{plan.slug}</span> -·
                        Saving a price change archives the prior Stripe Price
                        and creates a new one. Existing subscriptions stay
                        grandfathered on the old price.
                    </p>
                </div>

                <PlanForm
                    initial={{
                        name: plan.name,
                        monthly_conversations: plan.monthly_conversations,
                        monthly_messages: plan.monthly_messages,
                        max_tokens_per_response: plan.max_tokens_per_response,
                        price_cents: plan.price_cents,
                        interval: plan.interval ?? 'month',
                        is_active: plan.is_active,
                        features: {
                            remove_branding: Boolean(
                                plan.features.remove_branding,
                            ),
                        },
                    }}
                    method="patch"
                    action={`/admin/plans/${plan.id}`}
                    submitLabel="Save plan"
                    currency={currency}
                    readonly={{
                        stripe_product_id: plan.stripe_product_id,
                        stripe_price_id: plan.stripe_price_id,
                    }}
                />
            </div>
        </AdminLayout>
    );
}
