import { Head, Link } from '@inertiajs/react';
import { Bot, CheckCircle2, Library, MessageSquare } from 'lucide-react';
import { AdminSurface, AdminSurfaceBar } from '@/components/admin-surface';
import { TablePagination } from '@/components/table-pagination';
import type { PaginationMeta } from '@/components/table-pagination';
import { TableSearch } from '@/components/table-search';
import AdminLayout from '@/layouts/admin-layout';
import { relativeTime } from '@/lib/relative-time';
import { dashboard as adminDashboard } from '@/routes/admin';
import { index as adminAgentsIndex } from '@/routes/admin/agents';
import { show as adminWorkspaceShow } from '@/routes/admin/workspaces';

type AgentRow = {
    id: string;
    name: string;
    is_published: boolean;
    language_default: string;
    workspace: { id: string; name: string } | null;
    sources_count: number;
    conversations_count: number;
    updated_at: string | null;
};

type Props = {
    agents: AgentRow[];
    pagination: PaginationMeta;
    filters: { q: string };
};

const AGENTS_ONLY = ['agents', 'pagination', 'filters'];

function PublishBadge({ published }: { published: boolean }) {
    if (published) {
        return (
            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                <CheckCircle2 className="size-3" />
                Published
            </span>
        );
    }

    return (
        <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
            Draft
        </span>
    );
}

export default function AdminAgents({ agents, pagination, filters }: Props) {
    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Dashboard', href: adminDashboard() },
                { title: 'Agents', href: adminAgentsIndex() },
            ]}
        >
            <Head title="Agents -· Admin" />
            <AdminSurface>
                <AdminSurfaceBar>
                    <span className="inline-flex h-7 items-center rounded-md border bg-card px-2.5 text-xs font-normal text-foreground">
                        All agents
                    </span>
                    <span className="inline-flex h-7 items-center rounded-md border bg-card px-2.5 text-xs font-normal text-muted-foreground">
                        {pagination.total.toLocaleString()} agents
                    </span>
                    <div className="ml-auto w-full sm:w-auto">
                        <TableSearch
                            placeholder="Search by agent or workspace name..."
                            initialValue={filters.q}
                            only={AGENTS_ONLY}
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
                                        aria-label="Select all agents"
                                        disabled
                                        className="size-3.5 rounded border-input"
                                    />
                                </th>
                                <th className="border-r border-b px-3 py-2">
                                    Agent
                                </th>
                                <th className="border-r border-b px-3 py-2">
                                    Workspace
                                </th>
                                <th className="border-r border-b px-3 py-2">
                                    Status
                                </th>
                                <th className="border-r border-b px-3 py-2">
                                    Reach
                                </th>
                                <th className="border-b px-3 py-2">Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agents.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="h-72 border-b px-4 text-center"
                                    >
                                        <div className="mx-auto flex max-w-sm flex-col items-center gap-2 text-muted-foreground">
                                            <Bot className="size-8" />
                                            <p className="text-sm font-medium text-foreground">
                                                No matching agents
                                            </p>
                                            <p className="text-xs">
                                                No agents match the current
                                                admin search.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                agents.map((agent) => (
                                    <tr
                                        key={agent.id}
                                        className="group hover:bg-muted/35"
                                    >
                                        <td className="border-b px-3 py-2">
                                            <input
                                                type="checkbox"
                                                aria-label={`Select ${agent.name}`}
                                                disabled
                                                className="size-3.5 rounded border-input"
                                            />
                                        </td>
                                        <td className="border-r border-b px-3 py-2">
                                            <div className="flex min-w-0 items-center gap-2 text-foreground">
                                                <span className="flex size-5 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
                                                    <Bot className="size-3.5" />
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="truncate font-medium">
                                                        {agent.name}
                                                    </p>
                                                    <p className="truncate text-xs text-muted-foreground uppercase">
                                                        {agent.language_default}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border-r border-b px-3 py-2">
                                            {agent.workspace ? (
                                                <Link
                                                    href={adminWorkspaceShow(
                                                        agent.workspace.id,
                                                    )}
                                                    className="truncate font-medium text-foreground hover:text-primary"
                                                >
                                                    {agent.workspace.name}
                                                </Link>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                     — 
                                                </span>
                                            )}
                                        </td>
                                        <td className="border-r border-b px-3 py-2">
                                            <PublishBadge
                                                published={agent.is_published}
                                            />
                                        </td>
                                        <td className="border-r border-b px-3 py-2 text-muted-foreground">
                                            <div className="space-y-1">
                                                <p className="inline-flex items-center gap-1.5">
                                                    <Library className="size-3.5" />
                                                    {agent.sources_count.toLocaleString()}{' '}
                                                    source
                                                    {agent.sources_count === 1
                                                        ? ''
                                                        : 's'}
                                                </p>
                                                <p className="inline-flex items-center gap-1.5 text-xs">
                                                    <MessageSquare className="size-3.5" />
                                                    {agent.conversations_count.toLocaleString()}{' '}
                                                    conversation
                                                    {agent.conversations_count ===
                                                    1
                                                        ? ''
                                                        : 's'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="border-b px-3 py-2 text-muted-foreground">
                                            {relativeTime(
                                                agent.updated_at,
                                                ' — ',
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <TablePagination pagination={pagination} only={AGENTS_ONLY} />
            </AdminSurface>
        </AdminLayout>
    );
}
