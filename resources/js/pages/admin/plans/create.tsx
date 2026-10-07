import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { PlanForm } from './plan-form';

type Props = { currency: string };

export default function CreatePlan({ currency }: Props) {
    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Admin', href: '/admin' },
                { title: 'Plans', href: '/admin/plans' },
                { title: 'New plan', href: '/admin/plans/create' },
            ]}
        >
            <Head title="New plan -· Admin" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        New plan
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        After saving, the plan is mirrored to Stripe as a
                        Product + Price (paid plans only). The slug is
                        auto-generated from the display name and locked once
                        created.
                    </p>
                </div>

                <PlanForm
                    initial={{
                        name: '',
                        monthly_conversations: 500,
                        monthly_messages: null,
                        max_tokens_per_response: null,
                        price_cents: 4900,
                        interval: 'month',
                        is_active: true,
                        features: { remove_branding: true },
                    }}
                    method="post"
                    action="/admin/plans"
                    submitLabel="Create plan"
                    currency={currency}
                />
            </div>
        </AdminLayout>
    );
}
