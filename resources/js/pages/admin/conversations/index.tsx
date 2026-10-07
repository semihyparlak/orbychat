import { Head, Link } from '@inertiajs/react';
import { Globe, MessageSquare } from 'lucide-react';
import { AdminSurface, AdminSurfaceBar } from '@/components/admin-surface';
import { TablePagination } from '@/components/table-pagination';
import type { PaginationMeta } from '@/components/table-pagination';
import { TableSearch } from '@/components/table-search';
import AdminLayout from '@/layouts/admin-layout';
import { relativeTime } from '@/lib/relative-time';
import { dashboard as adminDashboard } from '@/routes/admin';
import { index as adminConversationsIndex } from '@/routes/admin/conversations';
import { show as adminWorkspaceShow } from '@/routes/admin/workspaces';

type Row = {
    id: string;
    agent: { id: string; name: string } | null;
    workspace: { id: string; name: string } | null;
    page_url: string | null;
    lang: string | null;
    is_lead: boolean;
    is_playground: boolean;
    message_count: number;
    started_at: string | null;
};

const CONVERSATIONS_ONLY = ['conversations', 'pagination', 'filters'];

export default function AdminConversations({
    conversations,
    pagination,
    filters,
}: {
    conversations: Row[];
    pagination: PaginationMeta;
    filters: { q: string };
}) {
    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Dashboard', href: adminDashboard() },
                { title: 'Conversations', href: adminConversationsIndex() },
            ]}
        >
            <Head title="Conversations -· Admin" />
            <AdminSurface>
                <AdminSurfaceBar>
                    <span className="inline-flex h-7 items-center rounded-md border bg-card px-2.5 text-xs font-normal text-foreground">
                        Recent conversations
                    </span>
                    <span className="inline-flex h-7 items-center rounded-md border bg-card px-2.5 text-xs font-normal text-muted-foreground">
                        {pagination.total.toLocaleString()} records
                    </span>
                    <div className="ml-auto w-full sm:w-auto">
                        <TableSearch
                            placeholder="Search by URL, agent, or workspace..."
                            initialValue={filters.q}
                            only={CONVERSATIONS_ONLY}
                        />
                    </div>
                </AdminSurfaceBar>
                <div className="min-h-0 flex-1 overflow-auto">
                    <table className="w-full min-w-[1080px] border-separate border-spacing-0 text-left text-sm">
                        <thead className="sticky top-0 z-10 bg-card text-xs font-medium text-muted-foreground">
                            <tr>
                                <th className="w-9 border-b px-3 py-2">
                                    <input
                                        type="checkbox"
                                        aria-label="Select all conversations"
                                        disabled
                                        className="size-3.5 rounded border-input"
                                    />
                                </th>
                                <th className="border-r border-b px-3 py-2">
                                    Page
                                </th>
                                <th className="border-r border-b px-3 py-2">
                                    Workspace
                                </th>
                                <th className="border-r border-b px-3 py-2">
                                    Agent
                                </th>
                                <th className="border-r border-b px-3 py-2">
                                    Context
                                </th>
                                <th className="border-b px-3 py-2">Started</th>
                            </tr>
                        </thead>
                        <tbody>
                            {conversations.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="h-72 border-b px-4 text-center"
                                    >
                                        <div className="mx-auto flex max-w-sm flex-col items-center gap-2 text-muted-foreground">
                                            <Globe className="size-8" />
                                            <p className="text-sm font-medium text-foreground">
                                                No matching conversations
                                            </p>
                                            <p className="text-xs">
                                                No conversations match the
                                                current admin search.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                conversations.map((conversation) => (
                                    <tr
                                        key={conversation.id}
                                        className="group hover:bg-muted/35"
                                    >
                                        <td className="border-b px-3 py-2">
                                            <input
                                                type="checkbox"
                                                aria-label={`Select ${conversation.page_url ?? 'conversation'}`}
                                                disabled
                                                className="size-3.5 rounded border-input"
                                            />
                                        </td>
                                        <td className="border-r border-b px-3 py-2">
                                            <div className="flex min-w-0 items-center gap-2 text-foreground">
                                                <span className="flex size-5 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
                                                    <Globe className="size-3.5" />
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="truncate font-medium">
                                                        {conversation.is_playground
                                                            ? 'Playground session'
                                                            : (conversation.page_url ??
                                                              'Unknown page')}
                                                    </p>
                                                    <p className="truncate text-xs text-muted-foreground">
                                                        {conversation.lang?.toUpperCase() ??
                                                            'No locale'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border-r border-b px-3 py-2">
                                            {conversation.workspace ? (
                                                <Link
                                                    href={adminWorkspaceShow(
                                                        conversation.workspace
                                                            .id,
                                                    )}
                                                    className="truncate font-medium text-foreground hover:text-primary"
                                                >
                                                    {
                                                        conversation.workspace
                                                            .name
                                                    }
                                                </Link>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                     — 
                                                </span>
                                            )}
                                        </td>
                                        <td className="border-r border-b px-3 py-2 text-muted-foreground">
                                            {conversation.agent?.name ?? ' — '}
                                        </td>
                                        <td className="border-r border-b px-3 py-2 text-muted-foreground">
                                            <div className="space-y-1">
                                                <p className="inline-flex items-center gap-1.5">
                                                    <MessageSquare className="size-3.5" />
                                                    {conversation.message_count.toLocaleString()}{' '}
                                                    message
                                                    {conversation.message_count ===
                                                    1
                                                        ? ''
                                                        : 's'}
                                                </p>
                                                <p className="text-xs">
                                                    {conversation.is_lead
                                                        ? 'Converted to lead'
                                                        : 'No lead captured'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="border-b px-3 py-2 text-muted-foreground">
                                            {relativeTime(
                                                conversation.started_at,
                                                ' — ',
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <TablePagination
                    pagination={pagination}
                    only={CONVERSATIONS_ONLY}
                />
            </AdminSurface>
        </AdminLayout>
    );
}
