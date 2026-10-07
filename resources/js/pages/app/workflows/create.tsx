import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { WorkflowForm } from './workflow-form';

type Props = {
    agents: Array<{ id: string; name: string }>;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: __('Workflows'), href: '/app/workflows' },
    { title: __('New'), href: '/app/workflows/create' },
];

export default function CreateWorkflow({ agents }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('New workflow')} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {__('New workflow')}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {__('Save as Draft to keep editing, or Active to start firing on matching visitor messages.')}
                    </p>
                </div>

                <WorkflowForm
                    initial={{
                        name: '',
                        status: 'draft',
                        agent_id: null,
                        trigger_kind: 'on_keyword',
                        keywords: [],
                        steps: [],
                    }}
                    method="post"
                    action="/app/workflows"
                    submitLabel={__('Create workflow')}
                    agents={agents}
                />
            </div>
        </AppLayout>
    );
}
