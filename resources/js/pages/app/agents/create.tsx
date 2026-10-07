import { Head } from '@inertiajs/react';
import { AgentForm } from '@/components/agents/agent-form';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: __('Agents'), href: '/app/agents' },
    { title: __('New'), href: '/app/agents/create' },
];

export default function CreateAgent() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('New agent')} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {__('Create agent')}
                </h1>
                <AgentForm mode="create" />
            </div>
        </AppLayout>
    );
}
