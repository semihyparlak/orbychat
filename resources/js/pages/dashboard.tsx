import { Head, Link, usePage } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
    ArrowRight,
    Bot,
    Calendar,
    CheckCircle2,
    Inbox,
    Library,
    MessagesSquare,
    Plus,
    TrendingUp,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { MetricCard, trend } from '@/components/metric-card';
import {
    TableColumnMenu,
    TableFiltersMenu,
    TableScopeMenu,
    TableSortMenu,
} from '@/components/table-toolbar-controls';
import type { TableMenuOption } from '@/components/table-toolbar-controls';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { usePersistentTableColumns } from '@/hooks/use-persistent-table-columns';
import type { TableColumnOption } from '@/hooks/use-persistent-table-columns';
import { dashboard, onboarding } from '@/routes';
import {
    create as createAgent,
    index as agentsIndex,
    show as showAgent,
} from '@/routes/agents';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { index as conversationsIndex } from '@/routes/conversations';
import { index as inboxIndex, show as showLead } from '@/routes/inbox';

type SharedAuth = {
    needs_onboarding?: boolean;
};

type Agent = {
    id: string;
    name: string;
    is_published: boolean;
    updated_at: string | null;
};

type RecentLead = {
    id: string;
    email: string | null;
    name: string | null;
    status: string;
    created_at: string | null;
    agent: { id: string; name: string } | null;
};

type DashboardFilters = {
    lead_status:
        | 'all'
        | 'new'
        | 'qualified'
        | 'contacted'
        | 'won'
        | 'lost'
        | string;
    lead_sort:
        | 'created_desc'
        | 'created_asc'
        | 'name_asc'
        | 'name_desc'
        | string;
    lead_contact: 'all' | 'with_email' | 'without_email' | string;
};

type Stats = {
    conversations: {
        total: number;
        last_7d: number;
        previous_7d: number;
        last_30d: number;
        series_7d: number[];
    };
    messages: {
        total: number;
        last_7d: number;
        previous_7d: number;
        last_30d: number;
        series_7d: number[];
    };
    leads: {
        total: number;
        last_7d: number;
        previous_7d: number;
        last_30d: number;
        series_7d: number[];
    };
    sources: { indexed: number; in_progress: number; failed: number };
    agents: { total: number; published: number; list: Agent[] };
    recent_leads: RecentLead[];
    upcoming_appointments: {
        id: string;
        name: string;
        appointment_at: string;
        status: string;
        agent: { id: string; name: string };
    }[];
};

type Window = {
    from: string;
    to: string;
};

type Chart = {
    days: string[];
    conversations: number[];
    leads: number[];
};

type PipelineStatus = {
    key: string;
    label: string;
    value: number;
    share: number;
};

type TopAgent = {
    id: string;
    name: string;
    is_published: boolean;
    conversations: number;
    leads: number;
    last_activity_at: string | null;
};

type Reports = {
    conversion: {
        value: number;
        previous_value: number;
        last_30d: number;
        series_7d: number[];
    };
    engagement: {
        value: number;
        previous_value: number;
        last_30d: number;
        series_7d: number[];
    };
    pipeline: {
        total: number;
        statuses: PipelineStatus[];
    };
    source_health: {
        total: number;
        indexed: number;
        in_progress: number;
        failed: number;
        indexed_rate: number;
    };
    top_agents: TopAgent[];
};

type Props = {
    stats: Stats | null;
    window: Window | null;
    chart: Chart | null;
    reports: Reports | null;
    filters: DashboardFilters;
};

type PageProps = Props & {
    features: { has_appointments: boolean };
};

type DashboardLeadColumnId =
    | 'status'
    | 'email'
    | 'created'
    | 'primary_agent'
    | 'activity';

const DASHBOARD_ONLY = ['stats', 'filters'];

const STATUS_STYLES: Record<string, string> = {
    new: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300',
    qualified:
        'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300',
    contacted:
        'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300',
    won: 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300',
    lost: 'border-border bg-muted text-muted-foreground',
};

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

    return new Date(iso).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function StatusBadge({ status }: { status: string }) {
    return (
        <span
            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize ${
                STATUS_STYLES[status] ?? STATUS_STYLES.new
            }`}
        >
            {__(status)}
        </span>
    );
}

function FooterMetric({
    icon,
    label,
    value,
}: {
    icon: ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex min-w-0 items-center justify-between gap-3 border-b px-4 py-2 last:border-b-0 lg:border-r lg:border-b-0 lg:last:border-r-0">
            <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
                {icon}
                <span className="truncate text-xs">{label}</span>
            </div>
            <span className="text-xs font-medium text-foreground tabular-nums">
                {value}
            </span>
        </div>
    );
}

function formatRange(from: string, to: string): string {
    const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };

    return `${new Date(from).toLocaleDateString(undefined, opts)} - ${new Date(
        to,
    ).toLocaleDateString(undefined, {
        ...opts,
        year: 'numeric',
    })}`;
}

function trendSub(current: number, prior: number, fallback: string, rangeLabel = '7d'): string {
    const data = trend(current, prior);

    if (data.pct === 0) {
        return fallback;
    }

    return __(':dir :percent% vs previous :range', {
        dir: data.dir === 'up' ? __('Up') : __('Down'),
        percent: data.pct,
        range: rangeLabel,
    });
}

function DashboardChart({ chart }: { chart: Chart }) {
    const width = 760;
    const height = 240;
    const padX = 24;
    const padY = 16;
    const innerWidth = width - padX * 2;
    const innerHeight = height - padY * 2;
    const values = [...chart.conversations, ...chart.leads];
    const max = Math.max(1, ...values);
    const stepX = innerWidth / Math.max(1, chart.days.length - 1);

    const toPath = (series: number[]) =>
        series
            .map(
                (value, index) =>
                    `${(padX + index * stepX).toFixed(1)},${(padY + innerHeight - (value / max) * innerHeight).toFixed(1)}`,
            )
            .join(' ');

    const conversationsPath = toPath(chart.conversations);
    const leadsPath = toPath(chart.leads);
    const area = `${padX},${padY + innerHeight} ${conversationsPath} ${padX + innerWidth},${padY + innerHeight}`;
    const ticks = [0, 0.25, 0.5, 0.75, 1].map((ratio) =>
        Math.round(max * ratio),
    );
    const labelIndexes = [
        0,
        Math.floor(chart.days.length / 4),
        Math.floor(chart.days.length / 2),
        Math.floor((chart.days.length * 3) / 4),
        chart.days.length - 1,
    ].filter((value, index, rows) => rows.indexOf(value) === index);

    return (
        <svg
            viewBox={`0 0 ${width} ${height + 24}`}
            className="h-64 w-full"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
        >
            {ticks.map((tick, index) => {
                const y = padY + innerHeight - (tick / max) * innerHeight;

                return (
                    <g key={index}>
                        <line
                            x1={padX}
                            y1={y}
                            x2={padX + innerWidth}
                            y2={y}
                            stroke="currentColor"
                            strokeOpacity={0.06}
                        />
                        <text
                            x={padX - 6}
                            y={y + 4}
                            textAnchor="end"
                            fontSize="10"
                            fill="currentColor"
                            opacity={0.45}
                        >
                            {tick}
                        </text>
                    </g>
                );
            })}
            <polygon points={area} fill="#2563eb" fillOpacity={0.12} />
            <polyline
                points={conversationsPath}
                fill="none"
                stroke="#2563eb"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <polyline
                points={leadsPath}
                fill="none"
                stroke="#f59e0b"
                strokeWidth={1.7}
                strokeDasharray="4 4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {labelIndexes.map((index) => (
                <text
                    key={index}
                    x={padX + index * stepX}
                    y={height + 16}
                    textAnchor="middle"
                    fontSize="10"
                    fill="currentColor"
                    opacity={0.45}
                >
                    {new Date(chart.days[index]).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                    })}
                </text>
            ))}
        </svg>
    );
}

function ProgressBar({ value, tone }: { value: number; tone: string }) {
    return (
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
            <div
                className={`h-full rounded-full ${tone}`}
                style={{ width: `${Math.max(0, Math.min(value, 100))}%` }}
            />
        </div>
    );
}

function MobileLeadDetail({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <div className="min-w-0 rounded-md bg-muted/35 px-2.5 py-2">
            <dt className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                {label}
            </dt>
            <dd className="mt-1 truncate text-xs text-foreground">
                {children}
            </dd>
        </div>
    );
}

function MobileLeadCard({
    lead,
    isColumnVisible,
    weeklyConversations,
}: {
    lead: RecentLead;
    isColumnVisible: (column: DashboardLeadColumnId) => boolean;
    weeklyConversations: number;
}) {
    const label = lead.name ?? lead.email ?? __('Unknown lead');

    return (
        <div className="px-3 py-3">
            <div className="flex items-start justify-between gap-3">
                <Link
                    href={showLead(lead.id)}
                    className="flex min-w-0 items-center gap-2 text-foreground"
                >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold uppercase">
                        {label.slice(0, 1)}
                    </span>
                    <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">
                            {label}
                        </span>
                        {isColumnVisible('email') && (
                            <span className="block truncate text-xs text-muted-foreground">
                                {lead.email ?? __('No email')}
                            </span>
                        )}
                    </span>
                </Link>
                {isColumnVisible('status') && (
                    <StatusBadge status={lead.status} />
                )}
            </div>

            <dl className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {isColumnVisible('created') && (
                    <MobileLeadDetail label={__('Created')}>
                        {relativeTime(lead.created_at)}
                    </MobileLeadDetail>
                )}
                {isColumnVisible('primary_agent') && (
                    <MobileLeadDetail label={__('Primary agent')}>
                        {lead.agent ? (
                            <Link
                                href={agentsIndex()}
                                className="inline-flex min-w-0 items-center gap-1.5 text-muted-foreground hover:text-foreground"
                            >
                                <Bot className="size-3.5 shrink-0" />
                                <span className="truncate">
                                    {lead.agent.name}
                                </span>
                            </Link>
                        ) : (
                            __('No agent')
                        )}
                    </MobileLeadDetail>
                )}
                {isColumnVisible('activity') && (
                    <MobileLeadDetail label={__('Activity')}>
                        {weeklyConversations.toLocaleString()} {__('conversations this week')}
                    </MobileLeadDetail>
                )}
            </dl>
        </div>
    );
}

export default function Dashboard({
    stats,
    window,
    chart,
    reports,
    filters,
    features,
}: PageProps) {
    const DASHBOARD_COLUMNS: TableColumnOption<DashboardLeadColumnId>[] = [
        { id: 'status', label: __('Status') },
        { id: 'email', label: __('Email') },
        { id: 'created', label: __('Created') },
        { id: 'primary_agent', label: __('Primary agent') },
        { id: 'activity', label: __('Activity') },
    ];

    const DASHBOARD_LEAD_VIEW_OPTIONS: TableMenuOption[] = [
        { value: 'all', label: __('All leads') },
        { value: 'new', label: __('New') },
        { value: 'qualified', label: __('Qualified') },
        { value: 'contacted', label: __('Contacted') },
        { value: 'won', label: __('Won') },
        { value: 'lost', label: __('Lost') },
    ];

    const DASHBOARD_LEAD_SORT_OPTIONS: TableMenuOption[] = [
        { value: 'created_desc', label: __('Newest first') },
        { value: 'created_asc', label: __('Oldest first') },
        { value: 'name_asc', label: __('Lead name A-Z') },
        { value: 'name_desc', label: __('Lead name Z-A') },
    ];

    const DASHBOARD_LEAD_CONTACT_OPTIONS: TableMenuOption[] = [
        { value: 'all', label: __('Any email state') },
        { value: 'with_email', label: __('Has email') },
        { value: 'without_email', label: __('Missing email') },
    ];

    const {
        hiddenColumnCount,
        isColumnVisible,
        resetColumns,
        setColumnVisibility,
        visibleColumns,
    } = usePersistentTableColumns(
        'table-columns:dashboard-leads',
        DASHBOARD_COLUMNS,
    );
    const { props } = usePage<{ auth: SharedAuth }>();
    const showOnboarding = props.auth?.needs_onboarding ?? false;
    const hasLeadFilters =
        filters.lead_status !== 'all' || filters.lead_contact !== 'all';
    const emptyTitle = hasLeadFilters ? __('No matching leads') : __('No leads yet');
    const visibleColumnCount = DASHBOARD_COLUMNS.filter((column) =>
        isColumnVisible(column.id),
    ).length;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('Dashboard'),
            href: dashboard(),
        },
    ];

    if (!stats || !window || !chart || !reports) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={__('Dashboard')} />
                <div className="p-4 text-sm text-muted-foreground">
                    {__('No workspace selected.')}
                </div>
            </AppLayout>
        );
    }

    const hasLeads = stats.recent_leads.length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('Dashboard')} />

            <div className="flex min-h-0 flex-1 flex-col bg-card">
                <div className="flex min-h-10 flex-wrap items-center gap-2 border-b px-3 py-2 sm:py-1.5">
                    <TableScopeMenu
                        options={DASHBOARD_LEAD_VIEW_OPTIONS}
                        value={filters.lead_status}
                        paramName="lead_status"
                        only={DASHBOARD_ONLY}
                    />
                    <TableSortMenu
                        options={DASHBOARD_LEAD_SORT_OPTIONS}
                        value={filters.lead_sort}
                        paramName="lead_sort"
                        only={DASHBOARD_ONLY}
                    />
                    <TableFiltersMenu
                        groups={[
                            {
                                label: __('Email'),
                                paramName: 'lead_contact',
                                value: filters.lead_contact,
                                defaultValue: 'all',
                                options: DASHBOARD_LEAD_CONTACT_OPTIONS,
                            },
                        ]}
                        only={DASHBOARD_ONLY}
                    />

                    <div className="flex w-full flex-wrap items-center gap-2 sm:ml-auto sm:w-auto">
                        <TableColumnMenu
                            columns={DASHBOARD_COLUMNS}
                            visibleColumns={visibleColumns}
                            hiddenColumnCount={hiddenColumnCount}
                            onResetColumns={resetColumns}
                            onSetColumnVisibility={setColumnVisibility}
                        />
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="flex-1 sm:flex-none"
                        >
                            <Link href={inboxIndex()} prefetch>
                                <Inbox className="size-3.5" />
                                {__('Inbox')}
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="flex-1 sm:flex-none"
                        >
                            <Link href={conversationsIndex()} prefetch>
                                <MessagesSquare className="size-3.5" />
                                {__('Conversations')}
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="sm"
                            className="flex-1 sm:flex-none"
                        >
                            <Link href={createAgent()} prefetch>
                                <Plus className="size-3.5" />
                                {__('New agent')}
                            </Link>
                        </Button>
                    </div>
                </div>

                {showOnboarding && (
                    <div className="flex flex-col items-start gap-2 border-b bg-emerald-50 px-4 py-2 text-sm text-emerald-900 sm:flex-row sm:items-center sm:justify-between dark:bg-emerald-500/10 dark:text-emerald-200">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 shrink-0" />
                            <span>{__('Finish setting up your first AI agent.')}</span>
                        </div>
                        <Link
                            href={onboarding()}
                            className="inline-flex items-center gap-1 text-xs font-medium hover:underline"
                        >
                            {__('Continue')} <ArrowRight className="size-3.5" />
                        </Link>
                    </div>
                )}

                <div className="min-h-0 flex-1 overflow-y-auto">
                    <div className="space-y-4 p-4">
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                            <MetricCard
                                label={__('Conversations 7d')}
                                value={stats.conversations.last_7d.toLocaleString()}
                                sub={trendSub(
                                    stats.conversations.last_7d,
                                    stats.conversations.previous_7d,
                                    __(':count in the last 30d', { count: stats.conversations.last_30d.toLocaleString() }),
                                )}
                                icon={<MessagesSquare className="size-4" />}
                                iconTone="bg-blue-500/10 text-blue-700 dark:text-blue-300"
                                series={stats.conversations.series_7d}
                                accent="#2563eb"
                                trendData={trend(
                                    stats.conversations.last_7d,
                                    stats.conversations.previous_7d,
                                )}
                            />
                            <MetricCard
                                label={__('Messages 7d')}
                                value={stats.messages.last_7d.toLocaleString()}
                                sub={trendSub(
                                    stats.messages.last_7d,
                                    stats.messages.previous_7d,
                                    __(':count total messages', { count: stats.messages.total.toLocaleString() }),
                                )}
                                icon={<Activity className="size-4" />}
                                iconTone="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                series={stats.messages.series_7d}
                                accent="#059669"
                                trendData={trend(
                                    stats.messages.last_7d,
                                    stats.messages.previous_7d,
                                )}
                            />
                            <MetricCard
                                label={__('Leads 7d')}
                                value={stats.leads.last_7d.toLocaleString()}
                                sub={trendSub(
                                    stats.leads.last_7d,
                                    stats.leads.previous_7d,
                                    __(':count total leads', { count: stats.leads.total.toLocaleString() }),
                                )}
                                icon={<Inbox className="size-4" />}
                                iconTone="bg-amber-500/10 text-amber-700 dark:text-amber-300"
                                series={stats.leads.series_7d}
                                accent="#f59e0b"
                                trendData={trend(
                                    stats.leads.last_7d,
                                    stats.leads.previous_7d,
                                )}
                            />
                            <MetricCard
                                label={__('Conversion 7d')}
                                value={`${reports.conversion.value.toFixed(1)}%`}
                                sub={trendSub(
                                    reports.conversion.value,
                                    reports.conversion.previous_value,
                                    __(':percent% over 30d', { percent: reports.conversion.last_30d.toFixed(1) }),
                                )}
                                icon={<TrendingUp className="size-4" />}
                                iconTone="bg-rose-500/10 text-rose-700 dark:text-rose-300"
                                series={reports.conversion.series_7d}
                                accent="#e11d48"
                                trendData={trend(
                                    reports.conversion.value,
                                    reports.conversion.previous_value,
                                )}
                            />
                            <MetricCard
                                label={__('Messages / convo')}
                                value={reports.engagement.value.toFixed(1)}
                                sub={trendSub(
                                    reports.engagement.value,
                                    reports.engagement.previous_value,
                                    __(':avg avg over 30d', { avg: reports.engagement.last_30d.toFixed(1) }),
                                )}
                                icon={<Library className="size-4" />}
                                iconTone="bg-violet-500/10 text-violet-700 dark:text-violet-300"
                                series={reports.engagement.series_7d}
                                accent="#7c3aed"
                                trendData={trend(
                                    reports.engagement.value,
                                    reports.engagement.previous_value,
                                )}
                            />
                        </div>

                        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)]">
                            <div className="grid gap-4">
                                <Card className="overflow-hidden p-0">
                                    <div className="flex items-start justify-between gap-4 border-b px-4 py-4">
                                        <div>
                                            <p className="text-sm font-medium">
                                                {__('Workspace report')}
                                            </p>
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                {__('Conversations are the blue area. Leads are the dotted line, so you can see whether capture is keeping pace with traffic.')}
                                            </p>
                                        </div>
                                        <div className="rounded-full border bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground">
                                            {formatRange(window.from, window.to)}
                                        </div>
                                    </div>

                                    <div className="px-3 pt-4 pb-2 sm:px-4">
                                        <DashboardChart chart={chart} />
                                    </div>

                                    <div className="grid gap-0 border-t sm:grid-cols-2 lg:grid-cols-5">
                                        <FooterMetric
                                            icon={
                                                <MessagesSquare className="size-3.5" />
                                            }
                                            label={__('30d conversations')}
                                            value={stats.conversations.last_30d.toLocaleString()}
                                        />
                                        <FooterMetric
                                            icon={<Inbox className="size-3.5" />}
                                            label={__('30d leads')}
                                            value={stats.leads.last_30d.toLocaleString()}
                                        />
                                        <FooterMetric
                                            icon={<Activity className="size-3.5" />}
                                            label={__('Indexed sources')}
                                            value={stats.sources.indexed.toLocaleString()}
                                        />
                                        <FooterMetric
                                            icon={
                                                <AlertTriangle className="size-3.5" />
                                            }
                                            label={__('Sources in queue')}
                                            value={`${stats.sources.in_progress}/${reports.source_health.total}`}
                                        />
                                        <FooterMetric
                                            icon={<Bot className="size-3.5" />}
                                            label={__('Agents live')}
                                            value={`${stats.agents.published}/${stats.agents.total || 0}`}
                                        />
                                    </div>
                                </Card>

                                {features.has_appointments && (
                                    <Card className="overflow-hidden p-0">
                                        <div className="flex items-start justify-between gap-3 border-b px-4 py-4">
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {__('Upcoming appointments')}
                                                </p>
                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    {__('Your next scheduled meetings captured by AI agents.')}
                                                </p>
                                            </div>
                                            <Link href="/app/calendar" className="text-xs font-medium text-primary hover:underline">
                                                {__('View all')}
                                            </Link>
                                        </div>
                                        <div className="divide-y">
                                            {stats.upcoming_appointments.length === 0 ? (
                                                <div className="py-8 text-center text-xs text-muted-foreground">
                                                    {__('No upcoming appointments.')}
                                                </div>
                                            ) : (
                                                stats.upcoming_appointments.map(app => (
                                                    <div key={app.id} className="flex items-center gap-3 px-4 py-3">
                                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                            <Calendar className="size-4" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate text-sm font-medium text-foreground">
                                                                {app.name}
                                                            </p>
                                                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                                                                {__(':date via :agent', { date: new Date(app.appointment_at).toLocaleString(), agent: app.agent.name })}
                                                            </p>
                                                        </div>
                                                        <span className={cn(
                                                            "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase",
                                                            app.status === 'confirmed' ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-amber-500/10 text-amber-700 dark:text-amber-300"
                                                        )}>
                                                            {__(app.status)}
                                                        </span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </Card>
                                )}
                            </div>

                            <div className="grid gap-4">
                                <Card className="p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-medium">
                                                {__('Lead pipeline')}
                                            </p>
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                {__('Distribution of captured leads across your current statuses.')}
                                            </p>
                                        </div>
                                        <span className="rounded-full border bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground">
                                            {__(':count total', {
                                                count: reports.pipeline.total.toLocaleString(),
                                            })}
                                        </span>
                                    </div>

                                    <div className="mt-4 space-y-3">
                                        {reports.pipeline.statuses.map(
                                            (status) => (
                                                <div key={status.key}>
                                                    <div className="flex items-center justify-between gap-3 text-xs">
                                                        <span className="font-medium text-foreground">
                                                            {status.label}
                                                        </span>
                                                        <span className="text-muted-foreground tabular-nums">
                                                            {__(':count -· :percent%', {
                                                                count: status.value.toLocaleString(),
                                                                percent: status.share.toFixed(0),
                                                            })}
                                                        </span>
                                                    </div>
                                                    <ProgressBar
                                                        value={status.share}
                                                        tone={
                                                            status.key === 'won'
                                                                ? 'bg-violet-500'
                                                                : status.key ===
                                                                    'qualified'
                                                                  ? 'bg-emerald-500'
                                                                  : status.key ===
                                                                      'contacted'
                                                                    ? 'bg-amber-500'
                                                                    : status.key ===
                                                                        'lost'
                                                                      ? 'bg-slate-400'
                                                                      : 'bg-sky-500'
                                                        }
                                                    />
                                                </div>
                                            ),
                                        )}
                                    </div>

                                    <div className="mt-5 rounded-xl border bg-muted/30 p-3">
                                        <div className="flex items-center justify-between gap-3 text-xs">
                                            <span className="font-medium text-foreground">
                                                {__('Knowledge health')}
                                            </span>
                                            <span className="text-muted-foreground tabular-nums">
                                                {__(':percent% indexed', {
                                                    percent: reports.source_health.indexed_rate.toFixed(0),
                                                })}
                                            </span>
                                        </div>
                                        <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
                                            <div className="rounded-lg bg-background px-2 py-2">
                                                <p className="font-semibold text-foreground">
                                                    {reports.source_health.indexed.toLocaleString()}
                                                </p>
                                                <p className="mt-0.5 text-muted-foreground">
                                                    {__('indexed')}
                                                </p>
                                            </div>
                                            <div className="rounded-lg bg-background px-2 py-2">
                                                <p className="font-semibold text-foreground">
                                                    {reports.source_health.in_progress.toLocaleString()}
                                                </p>
                                                <p className="mt-0.5 text-muted-foreground">
                                                    {__('in progress')}
                                                </p>
                                            </div>
                                            <div className="rounded-lg bg-background px-2 py-2">
                                                <p className="font-semibold text-foreground">
                                                    {reports.source_health.failed.toLocaleString()}
                                                </p>
                                                <p className="mt-0.5 text-muted-foreground">
                                                    {__('failed')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="overflow-hidden p-0">
                                    <div className="border-b px-4 py-4">
                                        <p className="text-sm font-medium">
                                            {__('Top agents')}
                                        </p>
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            {__('Best-performing agents over the last 30 days.')}
                                        </p>
                                    </div>

                                    {reports.top_agents.length === 0 ? (
                                        <div className="px-4 py-8 text-sm text-muted-foreground">
                                            {__('No agent activity yet. Once visitors start chatting, the strongest performers show up here.')}
                                        </div>
                                    ) : (
                                        <div className="divide-y">
                                            {reports.top_agents.map((agent) => (
                                                <Link
                                                    key={agent.id}
                                                    href={showAgent(agent.id)}
                                                    className="flex items-center gap-3 px-4 py-3 transition hover:bg-muted/50"
                                                >
                                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                                        <Bot className="size-4" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <p className="truncate text-sm font-medium text-foreground">
                                                                {agent.name}
                                                            </p>
                                                            <span
                                                                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                                                    agent.is_published
                                                                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                                                        : 'bg-muted text-muted-foreground'
                                                                }`}
                                                            >
                                                                {agent.is_published
                                                                    ? __('Live')
                                                                    : __('Draft')}
                                                            </span>
                                                        </div>
                                                        <p className="mt-1 text-[11px] text-muted-foreground">
                                                            {__('Last activity')}{' '}
                                                            {relativeTime(
                                                                agent.last_activity_at,
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="text-right text-xs">
                                                        <p className="font-semibold text-foreground tabular-nums">
                                                            {__(':count convos', {
                                                                count: agent.conversations.toLocaleString(),
                                                            })}
                                                        </p>
                                                        <p className="mt-0.5 text-muted-foreground">
                                                            {__(':count leads', {
                                                                count: agent.leads.toLocaleString(),
                                                            })}
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </Card>
                            </div>
                        </div>

                        <Card className="overflow-hidden p-0">
                            <div className="border-b px-4 py-4">
                                <p className="text-sm font-medium">
                                    {__('Recent leads')}
                                </p>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    {__('Your latest captured leads, filtered by the controls in the toolbar.')}
                                </p>
                            </div>

                            <div className="md:hidden">
                                {hasLeads ? (
                                    <div className="divide-y">
                                        {stats.recent_leads.map((lead) => (
                                            <MobileLeadCard
                                                key={lead.id}
                                                lead={lead}
                                                isColumnVisible={
                                                    isColumnVisible
                                                }
                                                weeklyConversations={
                                                    stats.conversations.last_7d
                                                }
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex h-72 flex-col items-center justify-center gap-2 px-4 text-center text-muted-foreground">
                                        <Inbox className="size-8" />
                                        <p className="text-sm font-medium text-foreground">
                                            {emptyTitle}
                                        </p>
                                        <p className="max-w-xs text-xs">
                                            {__('Visitor leads captured by the widget will appear in this database view.')}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="hidden overflow-auto md:block">
                                <table className="w-full min-w-[880px] border-separate border-spacing-0 text-left text-sm">
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
                                            {isColumnVisible('created') && (
                                                <th className="border-r border-b px-3 py-2">
                                                    {__('Created')}
                                                </th>
                                            )}
                                            {isColumnVisible(
                                                'primary_agent',
                                            ) && (
                                                <th className="border-r border-b px-3 py-2">
                                                    {__('Primary agent')}
                                                </th>
                                            )}
                                            {isColumnVisible('activity') && (
                                                <th className="border-b px-3 py-2">
                                                    {__('Activity')}
                                                </th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {hasLeads ? (
                                            stats.recent_leads.map((lead) => {
                                                const label =
                                                    lead.name ??
                                                    lead.email ??
                                                    __('Unknown lead');

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
                                                                href={showLead(
                                                                    lead.id,
                                                                )}
                                                                className="flex min-w-0 items-center gap-2 text-foreground"
                                                            >
                                                                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold uppercase">
                                                                    {label.slice(
                                                                        0,
                                                                        1,
                                                                    )}
                                                                </span>
                                                                <span className="truncate font-medium">
                                                                    {label}
                                                                </span>
                                                            </Link>
                                                        </td>
                                                        {isColumnVisible(
                                                            'status',
                                                        ) && (
                                                            <td className="border-r border-b px-3 py-2">
                                                                <StatusBadge
                                                                    status={
                                                                        lead.status
                                                                    }
                                                                />
                                                            </td>
                                                        )}
                                                        {isColumnVisible(
                                                            'email',
                                                        ) && (
                                                            <td className="border-r border-b px-3 py-2 text-sm text-muted-foreground">
                                                                {lead.email ??
                                                                    __('No email')}
                                                            </td>
                                                        )}
                                                        {isColumnVisible(
                                                            'created',
                                                        ) && (
                                                            <td className="border-r border-b px-3 py-2 text-sm text-muted-foreground">
                                                                {relativeTime(
                                                                    lead.created_at,
                                                                )}
                                                            </td>
                                                        )}
                                                        {isColumnVisible(
                                                            'primary_agent',
                                                        ) && (
                                                            <td className="border-r border-b px-3 py-2">
                                                                {lead.agent ? (
                                                                    <Link
                                                                        href={agentsIndex()}
                                                                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                                                                    >
                                                                        <Bot className="size-3.5" />
                                                                        {
                                                                            lead
                                                                                .agent
                                                                                .name
                                                                        }
                                                                    </Link>
                                                                ) : (
                                                                    <span className="text-sm text-muted-foreground">
                                                                        {__('No agent')}
                                                                    </span>
                                                                )}
                                                            </td>
                                                        )}
                                                        {isColumnVisible(
                                                            'activity',
                                                        ) && (
                                                            <td className="border-b px-3 py-2 text-sm text-muted-foreground">
                                                                {__(':count conversations this week', { count: stats.conversations.last_7d.toLocaleString() })}
                                                            </td>
                                                        )}
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={
                                                        2 + visibleColumnCount
                                                    }
                                                    className="h-72 border-b px-4 text-center"
                                                >
                                                    <div className="mx-auto flex max-w-sm flex-col items-center gap-2 text-muted-foreground">
                                                        <Inbox className="size-8" />
                                                        <p className="text-sm font-medium text-foreground">
                                                            {emptyTitle}
                                                        </p>
                                                        <p className="text-xs">
                                                            {__('Visitor leads captured by the widget will appear in this database view.')}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
