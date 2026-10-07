import { Head, Link } from '@inertiajs/react';
import { Inbox, UserRound } from 'lucide-react';
import { AdminSurface, AdminSurfaceBar } from '@/components/admin-surface';
import { TablePagination } from '@/components/table-pagination';
import type { PaginationMeta } from '@/components/table-pagination';
import { TableSearch } from '@/components/table-search';
import AdminLayout from '@/layouts/admin-layout';
import { relativeTime } from '@/lib/relative-time';
import { dashboard as adminDashboard } from '@/routes/admin';
import { index as adminLeadsIndex } from '@/routes/admin/leads';
import { show as adminWorkspaceShow } from '@/routes/admin/workspaces';

type Row = {
    id: string;
    email: string | null;
    name: string | null;
    status: string;
    agent: { id: string; name: string } | null;
    workspace: { id: string; name: string } | null;
    created_at: string | null;
};

const LEADS_ONLY = ['leads', 'pagination', 'filters'];

export default function AdminLeads({
    leads,
    pagination,
    filters,
}: {
    leads: Row[];
    pagination: PaginationMeta;
    filters: { q: string };
}) {
    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Dashboard', href: adminDashboard() },
                { title: 'Leads', href: adminLeadsIndex() },
            ]}
        >
            <Head title="Leads -· Admin" />
            <AdminSurface>
                <AdminSurfaceBar>
                    <span className="inline-flex h-7 items-center rounded-md border bg-card px-2.5 text-xs font-normal text-foreground">
                        All leads
                    </span>
                    <span className="inline-flex h-7 items-center rounded-md border bg-card px-2.5 text-xs font-normal text-muted-foreground">
                        {pagination.total.toLocaleString()} leads
                    </span>
                    <div className="ml-auto w-full sm:w-auto">
                        <TableSearch
                            placeholder="Search by email, name, or phone..."
                            initialValue={filters.q}
                            only={LEADS_ONLY}
                        />
                    </div>
                </AdminSurfaceBar>
                <div className="min-h-0 flex-1 overflow-auto">
                    <table className="w-full min-w-[980px] border-separate border-spacing-0 text-left text-sm">
                        <thead className="sticky top-0 z-10 bg-card text-xs font-medium text-muted-foreground">
                            <tr>
                                <th className="w-9 border-b px-3 py-2">
                                    <input
                                        type="checkbox"
                                        aria-label="Select all leads"
                                        disabled
                                        className="size-3.5 rounded border-input"
                                    />
                                </th>
                                <th className="border-r border-b px-3 py-2">
                                    Lead
                                </th>
                                <th className="border-r border-b px-3 py-2">
                                    Workspace
                                </th>
                                <th className="border-r border-b px-3 py-2">
                                    Agent
                                </th>
                                <th className="border-r border-b px-3 py-2">
                                    Status
                                </th>
                                <th className="border-b px-3 py-2">Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="h-72 border-b px-4 text-center"
                                    >
                                        <div className="mx-auto flex max-w-sm flex-col items-center gap-2 text-muted-foreground">
                                            <Inbox className="size-8" />
                                            <p className="text-sm font-medium text-foreground">
                                                No matching leads
                                            </p>
                                            <p className="text-xs">
                                                No leads match the current admin
                                                search.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                leads.map((lead) => (
                                    <tr
                                        key={lead.id}
                                        className="group hover:bg-muted/35"
                                    >
                                        <td className="border-b px-3 py-2">
                                            <input
                                                type="checkbox"
                                                aria-label={`Select ${lead.name ?? lead.email ?? 'lead'}`}
                                                disabled
                                                className="size-3.5 rounded border-input"
                                            />
                                        </td>
                                        <td className="border-r border-b px-3 py-2">
                                            <div className="flex min-w-0 items-center gap-2 text-foreground">
                                                <span className="flex size-5 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
                                                    {lead.email ? (
                                                        <UserRound className="size-3.5" />
                                                    ) : (
                                                        <Inbox className="size-3.5" />
                                                    )}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="truncate font-medium">
                                                        {lead.name ??
                                                            lead.email ??
                                                            'Unknown lead'}
                                                    </p>
                                                    <p className="truncate text-xs text-muted-foreground">
                                                        {lead.email ??
                                                            'No email captured'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border-r border-b px-3 py-2">
                                            {lead.workspace ? (
                                                <Link
                                                    href={adminWorkspaceShow(
                                                        lead.workspace.id,
                                                    )}
                                                    className="text-sm font-medium text-foreground hover:text-primary"
                                                >
                                                    {lead.workspace.name}
                                                </Link>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                     — 
                                                </span>
                                            )}
                                        </td>
                                        <td className="border-r border-b px-3 py-2 text-muted-foreground">
                                            {lead.agent?.name ?? ' — '}
                                        </td>
                                        <td className="border-r border-b px-3 py-2">
                                            <span className="inline-flex rounded-md border bg-muted/40 px-2 py-0.5 text-xs font-medium text-foreground capitalize">
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="border-b px-3 py-2 text-muted-foreground">
                                            {relativeTime(lead.created_at, ' — ')}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <TablePagination pagination={pagination} only={LEADS_ONLY} />
            </AdminSurface>
        </AdminLayout>
    );
}
