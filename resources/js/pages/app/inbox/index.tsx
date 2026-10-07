import { Head, Link } from '@inertiajs/react';
import { Inbox as InboxIcon, Mail, Phone } from 'lucide-react';
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
import { usePersistentTableColumns } from '@/hooks/use-persistent-table-columns';
import type { TableColumnOption } from '@/hooks/use-persistent-table-columns';
import AppLayout from '@/layouts/app-layout';
import { index as inboxIndex, show as showLead } from '@/routes/inbox';
import type { BreadcrumbItem } from '@/types';

type Lead = {
    id: string;
    email: string;
    name: string | null;
    phone: string | null;
    status: 'new' | 'qualified' | 'contacted' | 'won' | 'lost' | string;
    page_url: string | null;
    created_at: string | null;
};

type Props = {
    leads: Lead[];
    pagination: PaginationMeta;
    filters: {
        q: string;
        view:
            | 'all'
            | 'new'
            | 'qualified'
            | 'contacted'
            | 'won'
            | 'lost'
            | string;
        sort:
            | 'created_desc'
            | 'created_asc'
            | 'name_asc'
            | 'name_desc'
            | string;
        phone: 'all' | 'with_phone' | 'without_phone' | string;
    };
};

type InboxColumnId = 'status' | 'email' | 'phone' | 'page' | 'created';

const STATUS_STYLES: Record<string, string> = {
    new: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300',
    qualified:
        'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300',
    contacted:
        'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300',
    won: 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300',
    lost: 'border-border bg-muted text-muted-foreground',
};

const INBOX_ONLY = ['leads', 'pagination', 'filters'];

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

    return __(':countd ago', { count: day });
}

function StatusBadge({ status }: { status: string }) {
    const getLabel = (s: string) => {
        switch (s) {
            case 'new': return __('new');
            case 'qualified': return __('qualified');
            case 'contacted': return __('contacted');
            case 'won': return __('won');
            case 'lost': return __('lost');
            default: return s;
        }
    };

    return (
        <span
            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize ${
                STATUS_STYLES[status] ?? STATUS_STYLES.new
            }`}
        >
            {getLabel(status)}
        </span>
    );
}

export default function InboxIndex({ leads, pagination, filters }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [{ title: __('Inbox'), href: inboxIndex() }];

    const INBOX_COLUMNS: TableColumnOption<InboxColumnId>[] = [
        { id: 'status', label: __('Status') },
        { id: 'email', label: __('Email') },
        { id: 'phone', label: __('Phone') },
        { id: 'page', label: __('Page') },
        { id: 'created', label: __('Created') },
    ];

    const LEAD_VIEW_OPTIONS: TableMenuOption[] = [
        { value: 'all', label: __('All leads') },
        { value: 'new', label: __('New') },
        { value: 'qualified', label: __('Qualified') },
        { value: 'contacted', label: __('Contacted') },
        { value: 'won', label: __('Won') },
        { value: 'lost', label: __('Lost') },
    ];

    const INBOX_SORT_OPTIONS: TableMenuOption[] = [
        { value: 'created_desc', label: __('Newest first') },
        { value: 'created_asc', label: __('Oldest first') },
        { value: 'name_asc', label: __('Lead name A-Z') },
        { value: 'name_desc', label: __('Lead name Z-A') },
    ];

    const PHONE_FILTER_OPTIONS: TableMenuOption[] = [
        { value: 'all', label: __('Any phone state') },
        { value: 'with_phone', label: __('Has phone number') },
        { value: 'without_phone', label: __('Missing phone number') },
    ];
    const {
        hiddenColumnCount,
        isColumnVisible,
        resetColumns,
        setColumnVisibility,
        visibleColumns,
    } = usePersistentTableColumns('table-columns:inbox', INBOX_COLUMNS);
    const hasRows = leads.length > 0;
    const hasActiveFilters =
        filters.q.trim() !== '' ||
        filters.view !== 'all' ||
        filters.phone !== 'all';
    const emptyTitle = hasActiveFilters ? __('No matching leads') : __('No leads yet');
    const visibleColumnCount = INBOX_COLUMNS.filter((column) =>
        isColumnVisible(column.id),
    ).length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('Inbox')} />
            <div className="flex min-h-0 flex-1 flex-col bg-card">
                <div className="flex min-h-10 flex-wrap items-center gap-2 border-b px-3 py-1.5">
                    <TableScopeMenu
                        options={LEAD_VIEW_OPTIONS}
                        value={filters.view}
                        paramName="view"
                        only={INBOX_ONLY}
                    />
                    <TableSortMenu
                        options={INBOX_SORT_OPTIONS}
                        value={filters.sort}
                        paramName="sort"
                        only={INBOX_ONLY}
                    />
                    <TableFiltersMenu
                        groups={[
                            {
                                label: __('Phone'),
                                paramName: 'phone',
                                value: filters.phone,
                                defaultValue: 'all',
                                options: PHONE_FILTER_OPTIONS,
                            },
                        ]}
                        only={INBOX_ONLY}
                    />
                    <TableSearch
                        placeholder={__('Search by email, name, or phone...')}
                        initialValue={filters.q}
                        only={INBOX_ONLY}
                    />
                    <div className="ml-auto flex items-center gap-2">
                        <TableColumnMenu
                            columns={INBOX_COLUMNS}
                            visibleColumns={visibleColumns}
                            hiddenColumnCount={hiddenColumnCount}
                            onResetColumns={resetColumns}
                            onSetColumnVisibility={setColumnVisibility}
                        />
                    </div>
                </div>

                <div className="min-h-0 flex-1 overflow-auto">
                    <table className="w-full min-w-[920px] border-separate border-spacing-0 text-left text-sm">
                        <thead className="sticky top-0 z-10 bg-card text-xs font-medium text-muted-foreground">
                            <tr>
                                <th className="w-9 border-b px-3 py-2">
                                    <input
                                        type="checkbox"
                                        aria-label={__('Select all leads')}
                                        disabled
                                        className="size-3.5 rounded border-input"
                                    />
                                </th>
                                <th className="border-r border-b px-3 py-2">
                                    {__('Lead')}
                                </th>
                                {isColumnVisible('status') && (
                                    <th className="border-r border-b px-3 py-2">
                                        {__('Status')}
                                    </th>
                                )}
                                {isColumnVisible('email') && (
                                    <th className="border-r border-b px-3 py-2">
                                        {__('Email')}
                                    </th>
                                )}
                                {isColumnVisible('phone') && (
                                    <th className="border-r border-b px-3 py-2">
                                        {__('Phone')}
                                    </th>
                                )}
                                {isColumnVisible('page') && (
                                    <th className="border-r border-b px-3 py-2">
                                        {__('Page')}
                                    </th>
                                )}
                                {isColumnVisible('created') && (
                                    <th className="border-b px-3 py-2">
                                        {__('Created')}
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {hasRows ? (
                                leads.map((lead) => {
                                    const label = lead.name ?? lead.email;

                                    return (
                                        <tr
                                            key={lead.id}
                                            className="group hover:bg-muted/35"
                                        >
                                            <td className="border-b px-3 py-2">
                                                <input
                                                    type="checkbox"
                                                    aria-label={__('Select :name', { name: label })}
                                                    disabled
                                                    className="size-3.5 rounded border-input"
                                                />
                                            </td>
                                            <td className="border-r border-b px-3 py-2">
                                                <Link
                                                    href={showLead(lead.id)}
                                                    className="flex min-w-0 items-center gap-2 text-foreground"
                                                >
                                                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold uppercase">
                                                        {label.slice(0, 1)}
                                                    </span>
                                                    <span className="truncate font-medium">
                                                        {label}
                                                    </span>
                                                </Link>
                                            </td>
                                            {isColumnVisible('status') && (
                                                <td className="border-r border-b px-3 py-2">
                                                    <StatusBadge
                                                        status={lead.status}
                                                    />
                                                </td>
                                            )}
                                            {isColumnVisible('email') && (
                                                <td className="border-r border-b px-3 py-2 text-muted-foreground">
                                                    <span className="inline-flex min-w-0 items-center gap-1.5">
                                                        <Mail className="size-3.5 shrink-0" />
                                                        <span className="truncate">
                                                            {lead.email}
                                                        </span>
                                                    </span>
                                                </td>
                                            )}
                                            {isColumnVisible('phone') && (
                                                <td className="border-r border-b px-3 py-2 text-muted-foreground">
                                                    {lead.phone ? (
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <Phone className="size-3.5" />
                                                            {lead.phone}
                                                        </span>
                                                    ) : (
                                                        __('No phone')
                                                    )}
                                                </td>
                                            )}
                                            {isColumnVisible('page') && (
                                                <td className="max-w-[280px] border-r border-b px-3 py-2 text-muted-foreground">
                                                    <span className="block truncate">
                                                        {lead.page_url ??
                                                            __('No page')}
                                                    </span>
                                                </td>
                                            )}
                                            {isColumnVisible('created') && (
                                                <td className="border-b px-3 py-2 text-muted-foreground">
                                                    {relativeTime(
                                                        lead.created_at,
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={2 + visibleColumnCount}
                                        className="h-72 border-b px-4 text-center"
                                    >
                                        <div className="mx-auto flex max-w-sm flex-col items-center gap-2 text-muted-foreground">
                                            <InboxIcon className="size-8" />
                                            <p className="text-sm font-medium text-foreground">
                                                {emptyTitle}
                                            </p>
                                            <p className="text-xs">
                                                {__('Leads captured by the widget appear here, newest first.')}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <TablePagination pagination={pagination} only={INBOX_ONLY} />
            </div>
        </AppLayout>
    );
}
