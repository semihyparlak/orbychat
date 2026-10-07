import { Head, Link, router } from '@inertiajs/react';
import {
    CheckCircle2,
    Plus,
    Settings,
    Trash2,
    Workflow as WorkflowIcon,
    Zap,
} from 'lucide-react';
import { TablePagination } from '@/components/table-pagination';
import type { PaginationMeta } from '@/components/table-pagination';
import { TableSearch } from '@/components/table-search';
import {
    TableColumnMenu,
    TableScopeMenu,
    TableSortMenu,
} from '@/components/table-toolbar-controls';
import type { TableMenuOption } from '@/components/table-toolbar-controls';
import { Button } from '@/components/ui/button';
import { usePersistentTableColumns } from '@/hooks/use-persistent-table-columns';
import type { TableColumnOption } from '@/hooks/use-persistent-table-columns';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type WorkflowRow = {
    id: string;
    name: string;
    status: 'draft' | 'active' | 'disabled' | string;
    trigger_kind: string;
    keywords: string[];
    match_mode?: string;
    steps: Array<{ type: string; text: string; var_name?: string | null }>;
    updated_at: string | null;
};

type Props = {
    workflows: WorkflowRow[];
    pagination: PaginationMeta;
    filters: {
        q: string;
        view: 'all' | 'active' | 'draft' | 'disabled' | string;
        sort:
            | 'updated_desc'
            | 'updated_asc'
            | 'name_asc'
            | 'name_desc'
            | string;
    };
};

type WorkflowColumnId = 'status' | 'trigger' | 'steps' | 'updated' | 'settings';

const breadcrumbs: BreadcrumbItem[] = [
    { title: __('Workflows'), href: '/app/workflows' },
];

const WORKFLOWS_ONLY = ['workflows', 'pagination', 'filters'];

const WORKFLOW_COLUMNS: TableColumnOption<WorkflowColumnId>[] = [
    { id: 'status', label: __('Status') },
    { id: 'trigger', label: __('Trigger') },
    { id: 'steps', label: __('Steps') },
    { id: 'updated', label: __('Updated') },
    { id: 'settings', label: __('Settings') },
];

const WORKFLOW_VIEW_OPTIONS: TableMenuOption[] = [
    { value: 'all', label: __('All workflows') },
    { value: 'active', label: __('Active') },
    { value: 'draft', label: __('Draft') },
    { value: 'disabled', label: __('Disabled') },
];

const WORKFLOW_SORT_OPTIONS: TableMenuOption[] = [
    { value: 'updated_desc', label: __('Recently updated') },
    { value: 'updated_asc', label: __('Oldest updated') },
    { value: 'name_asc', label: __('Name A-Z') },
    { value: 'name_desc', label: __('Name Z-A') },
];

function relativeTime(iso: string | null): string {
    if (!iso) {
        return __('No activity');
    }

    const ms = Date.now() - new Date(iso).getTime();
    const min = Math.max(1, Math.round(ms / 60000));

    if (min < 60) {
        return __(':countm ago', { count: min });
    }

    const hr = Math.round(min / 60);

    if (hr < 24) {
        return __(':counth ago', { count: hr });
    }

    const day = Math.round(hr / 24);

    if (day < 7) {
        return __(':countd ago', { count: day });
    }

    return new Date(iso).toLocaleDateString();
}

function StatusBadge({ status }: { status: string }) {
    if (status === 'active') {
        return (
            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                <CheckCircle2 className="size-3" />
                {__('Active')}
            </span>
        );
    }

    if (status === 'disabled') {
        return (
            <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600 dark:border-slate-500/30 dark:bg-slate-500/10 dark:text-slate-300">
                {__('Disabled')}
            </span>
        );
    }

    return (
        <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
            {__('Draft')}
        </span>
    );
}

function TriggerSummary({ wf }: { wf: WorkflowRow }) {
    if (wf.trigger_kind === 'on_keyword') {
        const kw = wf.keywords ?? [];

        if (kw.length === 0) {
            return (
                <span className="text-muted-foreground italic">
                    {__('No keywords yet')}
                </span>
            );
        }

        const head = kw.slice(0, 2).join(', ');
        const more = kw.length > 2 ? ` +${kw.length - 2}` : '';

        return (
            <span className="inline-flex items-center gap-1.5">
                <Zap className="size-3.5 text-muted-foreground" />
                <span className="truncate">{head + more}</span>
            </span>
        );
    }

    return <span className="text-muted-foreground">{wf.trigger_kind}</span>;
}

export default function WorkflowsIndex({
    workflows,
    pagination,
    filters,
}: Props) {
    const {
        hiddenColumnCount,
        isColumnVisible,
        resetColumns,
        setColumnVisibility,
        visibleColumns,
    } = usePersistentTableColumns('table-columns:workflows', WORKFLOW_COLUMNS);

    const hasRows = workflows.length > 0;
    const hasActiveFilters = filters.q.trim() !== '' || filters.view !== 'all';
    const emptyTitle = hasActiveFilters
        ? __('No matching workflows')
        : __('No workflows yet');
    const visibleColumnCount = WORKFLOW_COLUMNS.filter((c) =>
        isColumnVisible(c.id),
    ).length;

    const onDelete = (wf: WorkflowRow) => {
        if (confirm(__(`Delete ":name"? This cannot be undone.`, { name: wf.name }))) {
            router.delete(`/app/workflows/${wf.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('Workflows')} />
            <div className="flex min-h-0 flex-1 flex-col bg-card">
                <div className="flex min-h-10 flex-wrap items-center gap-2 border-b px-3 py-1.5">
                    <TableScopeMenu
                        options={WORKFLOW_VIEW_OPTIONS}
                        value={filters.view}
                        paramName="view"
                        only={WORKFLOWS_ONLY}
                    />
                    <TableSortMenu
                        options={WORKFLOW_SORT_OPTIONS}
                        value={filters.sort}
                        paramName="sort"
                        only={WORKFLOWS_ONLY}
                    />
                    <TableSearch
                        placeholder={__('Search workflows...')}
                        initialValue={filters.q}
                        only={WORKFLOWS_ONLY}
                    />
                    <div className="ml-auto flex items-center gap-2">
                        <TableColumnMenu
                            columns={WORKFLOW_COLUMNS}
                            visibleColumns={visibleColumns}
                            hiddenColumnCount={hiddenColumnCount}
                            onResetColumns={resetColumns}
                            onSetColumnVisibility={setColumnVisibility}
                        />
                        <Button asChild size="sm">
                            <Link href="/app/workflows/create" prefetch>
                                <Plus className="size-3.5" />
                                {__('New workflow')}
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="min-h-0 flex-1 overflow-auto">
                    <table className="w-full min-w-[820px] border-separate border-spacing-0 text-left text-sm">
                        <thead className="sticky top-0 z-10 bg-card text-xs font-medium text-muted-foreground">
                            <tr>
                                <th className="w-9 border-b px-3 py-2">
                                    <input
                                        type="checkbox"
                                        aria-label={__('Select all workflows')}
                                        disabled
                                        className="size-3.5 rounded border-input"
                                    />
                                </th>
                                <th className="border-r border-b px-3 py-2">
                                    {__('Workflow')}
                                </th>
                                {isColumnVisible('status') && (
                                    <th className="border-r border-b px-3 py-2">
                                        {__('Status')}
                                    </th>
                                )}
                                {isColumnVisible('trigger') && (
                                    <th className="border-r border-b px-3 py-2">
                                        {__('Trigger')}
                                    </th>
                                )}
                                {isColumnVisible('steps') && (
                                    <th className="border-r border-b px-3 py-2">
                                        {__('Steps')}
                                    </th>
                                )}
                                {isColumnVisible('updated') && (
                                    <th className="border-r border-b px-3 py-2">
                                        {__('Updated')}
                                    </th>
                                )}
                                {isColumnVisible('settings') && (
                                    <th className="border-b px-3 py-2 text-right">
                                        {__('Actions')}
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {hasRows ? (
                                workflows.map((wf) => (
                                    <tr
                                        key={wf.id}
                                        className="group hover:bg-muted/35"
                                    >
                                        <td className="border-b px-3 py-2">
                                            <input
                                                type="checkbox"
                                                aria-label={__('Select :name', { name: wf.name })}
                                                disabled
                                                className="size-3.5 rounded border-input"
                                            />
                                        </td>
                                        <td className="border-r border-b px-3 py-2">
                                            <Link
                                                href={`/app/workflows/${wf.id}/canvas`}
                                                className="flex min-w-0 items-center gap-2 text-foreground"
                                            >
                                                <span className="flex size-5 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
                                                    <WorkflowIcon className="size-3.5" />
                                                </span>
                                                <span className="truncate font-medium">
                                                    {wf.name}
                                                </span>
                                            </Link>
                                        </td>
                                        {isColumnVisible('status') && (
                                            <td className="border-r border-b px-3 py-2">
                                                <StatusBadge
                                                    status={wf.status}
                                                />
                                            </td>
                                        )}
                                        {isColumnVisible('trigger') && (
                                            <td className="border-r border-b px-3 py-2 text-muted-foreground">
                                                <TriggerSummary wf={wf} />
                                            </td>
                                        )}
                                        {isColumnVisible('steps') && (
                                            <td className="border-r border-b px-3 py-2 text-muted-foreground tabular-nums">
                                                {__(':count step', { count: wf.steps.length })}
                                            </td>
                                        )}
                                        {isColumnVisible('updated') && (
                                            <td className="border-r border-b px-3 py-2 text-muted-foreground">
                                                {relativeTime(wf.updated_at)}
                                            </td>
                                        )}
                                        {isColumnVisible('settings') && (
                                            <td className="border-b px-3 py-2">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link
                                                        href={`/app/workflows/${wf.id}/canvas`}
                                                        className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
                                                        aria-label={__('Edit :name', { name: wf.name })}
                                                    >
                                                        <Settings className="size-3.5" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onDelete(wf)
                                                        }
                                                        aria-label={__('Delete :name', { name: wf.name })}
                                                        className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={2 + visibleColumnCount}
                                        className="h-72 border-b px-4 text-center"
                                    >
                                        <div className="mx-auto flex max-w-sm flex-col items-center gap-2 text-muted-foreground">
                                            <WorkflowIcon className="size-8" />
                                            <p className="text-sm font-medium text-foreground">
                                                {emptyTitle}
                                            </p>
                                            <p className="text-xs">
                                                {__('Workflows script how the agent reacts to common questions, and let you hand a visitor off to a human on specific keywords.')}
                                            </p>
                                            {!hasActiveFilters && (
                                                <Button
                                                    asChild
                                                    size="sm"
                                                    className="mt-2"
                                                >
                                                    <Link href="/app/workflows/create">
                                                        <Plus className="size-3.5" />
                                                        {__('New workflow')}
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <TablePagination
                    pagination={pagination}
                    only={WORKFLOWS_ONLY}
                />
            </div>
        </AppLayout>
    );
}
