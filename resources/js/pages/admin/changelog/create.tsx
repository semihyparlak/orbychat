import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem } from '@/types';
import { ChangelogForm } from './changelog-form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Changelog', href: '/admin/changelog' },
    { title: 'New', href: '/admin/changelog/create' },
];

export default function CreateChangelog() {
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="New changelog entry" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        New entry
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Save as Draft to keep iterating, or Published to push it
                        to /changelog right away.
                    </p>
                </div>

                <ChangelogForm
                    initial={{
                        version: '',
                        released_at: '',
                        status: 'draft',
                        title: '',
                        body: '',
                    }}
                    method="post"
                    action="/admin/changelog"
                    submitLabel="Create entry"
                />
            </div>
        </AdminLayout>
    );
}
