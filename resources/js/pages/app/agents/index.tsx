import { Head, Link } from '@inertiajs/react';
import {
    Bot,
    CheckCircle2,
    Inbox,
    Library,
    MessagesSquare,
    Plus,
    Settings,
} from 'lucide-react';
import { TablePagination } from '@/components/table-pagination';
import type { PaginationMeta } from '@/components/table-pagination';
import { TableSearch } from '@/components/table-search';
import {
    TableColumnMenu,
    TableFiltersMenu,
    TableScopeMenu,
    TableSortMenu,
} from '@/components/table-toolbar-controls';
import type { TableMenuOption } from '@/components/table-toolbar-controls';
import { Button } from '@/components/ui/button';
import { usePersistentTableColumns } from '@/hooks/use-persistent-table-columns';
import type { TableColumnOption } from '@/hooks/use-persistent-table-columns';
import AppLayout from '@/layouts/app-layout';
import {
    create as createAgent,
    edit as editAgent,
    index as agentsIndex,
    show as showAgent,
} from '@/routes/agents';
import type { BreadcrumbItem } from '@/types';

type AgentRow = {
    id: string;
    name: string;
    language_default: string;
    is_published: boolean;
    updated_at: string;
    sources: { total: number; indexed: number };
    conversations_7d: number;
    leads_7d: number;
};

type Props = {
    agents: AgentRow[];
    pagination: PaginationMeta;
    filters: {
        q: string;
        view: 'all' | 'published' | 'draft' | string;
        sort:
            | 'updated_desc'
            | 'updated_asc'
            | 'name_asc'
            | 'name_desc'
            | string;
        language: string;
    };
    filterOptions: {
        languages: string[];
    };
};

type AgentColumnId =
    | 'status'
    | 'language'
    | 'knowledge'
    | 'conversations'
    | 'leads'
    | 'updated'
    | 'settings';

const breadcrumbs: BreadcrumbItem[] = [
    { title: __('Agents'), href: agentsIndex() },
];

const AGENTS_ONLY = ['agents', 'pagination', 'filters'];

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

function PublishBadge({ published }: { published: boolean }) {
    if (published) {
        return (
            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                <CheckCircle2 className="size-3" />
                {__('Published')}
            </span>
        );
    }

    return (
        <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
            {__('Draft')}
        </span>
    );
}

export default function AgentsIndex({
    agents,
    pagination,
    filters,
    filterOptions,
}: Props) {
    const AGENT_COLUMNS: TableColumnOption<AgentColumnId>[] = [
        { id: 'status', label: __('Status') },
        { id: 'language', label: __('Language') },
        { id: 'knowledge', label: __('Knowledge') },
        { id: 'conversations', label: __('Conversations') },
        { id: 'leads', label: __('Leads') },
        { id: 'updated', label: __('Updated') },
        { id: 'settings', label: __('Settings') },
    ];

    const AGENT_VIEW_OPTIONS: TableMenuOption[] = [
        { value: 'all', label: __('All agents') },
        { value: 'published', label: __('Published agents') },
        { value: 'draft', label: __('Draft agents') },
    ];

    const AGENT_SORT_OPTIONS: TableMenuOption[] = [
        { value: 'updated_desc', label: __('Recently updated') },
        { value: 'updated_asc', label: __('Oldest updated') },
        { value: 'name_asc', label: __('Name A-Z') },
        { value: 'name_desc', label: __('Name Z-A') },
    ];
    const {
        hiddenColumnCount,
        isColumnVisible,
        resetColumns,
        setColumnVisibility,
        visibleColumns,
    } = usePersistentTableColumns('table-columns:agents', AGENT_COLUMNS);
    const hasRows = agents.length > 0;
    const hasActiveFilters =
        filters.q.trim() !== '' ||
        filters.view !== 'all' ||
        filters.language !== 'all';
    const emptyTitle = hasActiveFilters
        ? __('No matching agents')
        : __('No agents yet');
    const visibleColumnCount = AGENT_COLUMNS.filter((column) =>
        isColumnVisible(column.id),
    ).length;
    const languageOptions: TableMenuOption[] = [
        { value: 'all', label: __('All languages') },
        ...filterOptions.languages.map((language) => ({
            value: language,
            label: language.toUpperCase(),
        })),
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('Agents')} />
            <div className="flex min-h-0 flex-1 flex-col bg-card">
                <div className="flex min-h-10 flex-wrap items-center gap-2 border-b px-3 py-1.5">
                    <TableScopeMenu
                        options={AGENT_VIEW_OPTIONS}
                        value={filters.view}
                        paramName="view"
                        only={AGENTS_ONLY}
                    />
                    <TableSortMenu
                        options={AGENT_SORT_OPTIONS}
                        value={filters.sort}
                        paramName="sort"
                        only={AGENTS_ONLY}
                    />
                    <TableFiltersMenu
                        groups={[
                            {
                                label: __('Language'),
                                paramName: 'language',
                                value: filters.language,
                                defaultValue: 'all',
                                options: languageOptions,
                            },
                        ]}
                        only={AGENTS_ONLY}
                    />
                    <TableSearch
                        placeholder={__('Search agents...')}
                        initialValue={filters.q}
                        only={AGENTS_ONLY}
                    />
                    <div className="ml-auto flex items-center gap-2">
                        <TableColumnMenu
                            columns={AGENT_COLUMNS}
                            visibleColumns={visibleColumns}
                            hiddenColumnCount={hiddenColumnCount}
                            onResetColumns={resetColumns}
                            onSetColumnVisibility={setColumnVisibility}
                        />
                        <Button asChild size="sm">
                            <Link href={createAgent()} prefetch>
                                <Plus className="size-3.5" />
                                {__('New agent')}
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="min-h-0 flex-1 overflow-auto">
                    <table className="w-full min-w-[980px] border-separate border-spacing-0 text-left text-sm">
                        <thead className="sticky top-0 z-10 bg-card text-xs font-medium text-muted-foreground">
                            <tr>
                                <th className="w-9 border-b px-3 py-2">
                                    <input
                                        type="checkbox"
                                        aria-label={__('Select all agents')}
                                        disabled
                                        className="size-3.5 rounded border-input"
                                    />
                                </th>
                                <th className="border-r border-b px-3 py-2">
                                    {__('Agent')}
                                </th>
                                {isColumnVisible('status') && (
                                    <th className="border-r border-b px-3 py-2">
                                        {__('Status')}
                                    </th>
                                )}
                                {isColumnVisible('language') && (
                                    <th className="border-r border-b px-3 py-2">
                                        {__('Language')}
                                    </th>
                                )}
                                {isColumnVisible('knowledge') && (
                                    <th className="border-r border-b px-3 py-2">
                                        {__('Knowledge')}
                                    </th>
                                )}
                                {isColumnVisible('conversations') && (
                                    <th className="border-r border-b px-3 py-2">
                                        {__('Conversations')}
                                    </th>
                                )}
                                {isColumnVisible('leads') && (
                                    <th className="border-r border-b px-3 py-2">
                                        {__('Leads')}
                                    </th>
                                )}
                                {isColumnVisible('updated') && (
                                    <th className="border-r border-b px-3 py-2">
                                        {__('Updated')}
                                    </th>
                                )}
                                {isColumnVisible('settings') && (
                                    <th className="border-b px-3 py-2">
                                        {__('Settings')}
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {hasRows ? (
                                agents.map((agent) => (
                                    <tr
                                        key={agent.id}
                                        className="group hover:bg-muted/35"
                                    >
                                        <td className="border-b px-3 py-2">
                                            <input
                                                type="checkbox"
                                                aria-label={__('Select :name', { name: agent.name })}
                                                disabled
                                                className="size-3.5 rounded border-input"
                                            />
                                        </td>
                                        <td className="border-r border-b px-3 py-2">
                                            <Link
                                                href={showAgent(agent.id)}
                                                className="flex min-w-0 items-center gap-2 text-foreground"
                                            >
                                                <span className="flex size-5 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
                                                    <Bot className="size-3.5" />
                                                </span>
                                                <span className="truncate font-medium">
                                                    {agent.name}
                                                </span>
                                            </Link>
                                        </td>
                                        {isColumnVisible('status') && (
                                            <td className="border-r border-b px-3 py-2">
                                                <PublishBadge
                                                    published={
                                                        agent.is_published
                                                    }
                                                />
                                            </td>
                                        )}
                                        {isColumnVisible('language') && (
                                            <td className="border-r border-b px-3 py-2 text-muted-foreground uppercase">
                                                {agent.language_default}
                                            </td>
                                        )}
                                        {isColumnVisible('knowledge') && (
                                            <td className="border-r border-b px-3 py-2 text-muted-foreground">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <Library className="size-3.5" />
                                                    {agent.sources.indexed}/
                                                    {agent.sources.total}
                                                </span>
                                            </td>
                                        )}
                                        {isColumnVisible('conversations') && (
                                            <td className="border-r border-b px-3 py-2 text-muted-foreground">
                                                <span className="inline-flex items-center gap-1.5 tabular-nums">
                                                    <MessagesSquare className="size-3.5" />
                                                    {agent.conversations_7d.toLocaleString()}
                                                </span>
                                            </td>
                                        )}
                                        {isColumnVisible('leads') && (
                                            <td className="border-r border-b px-3 py-2 text-muted-foreground">
                                                <span className="inline-flex items-center gap-1.5 tabular-nums">
                                                    <Inbox className="size-3.5" />
                                                    {agent.leads_7d.toLocaleString()}
                                                </span>
                                            </td>
                                        )}
                                        {isColumnVisible('updated') && (
                                            <td className="border-r border-b px-3 py-2 text-muted-foreground">
                                                {relativeTime(agent.updated_at)}
                                            </td>
                                        )}
                                        {isColumnVisible('settings') && (
                                            <td className="border-b px-3 py-2">
                                                <Link
                                                    href={editAgent(agent.id)}
                                                    className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
                                                    aria-label={__('Open :name settings', { name: agent.name })}
                                                >
                                                    <Settings className="size-3.5" />
                                                </Link>
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
                                            <Bot className="size-8" />
                                            <p className="text-sm font-medium text-foreground">
                                                {emptyTitle}
                                            </p>
                                            <p className="text-xs">
                                                {__('Create an agent to start answering visitors and capturing leads.')}
                                            </p>
                                            {!hasActiveFilters && (
                                                <Button
                                                    asChild
                                                    size="sm"
                                                    className="mt-2"
                                                >
                                                    <Link href={createAgent()}>
                                                        <Plus className="size-3.5" />
                                                        {__('New agent')}
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

                <TablePagination pagination={pagination} only={AGENTS_ONLY} />
            </div>
        </AppLayout>
    );
}
