import { Head, Link } from '@inertiajs/react';
import { ChevronRight, MessagesSquare, User } from 'lucide-react';
import { TablePagination } from '@/components/table-pagination';
import type { PaginationMeta } from '@/components/table-pagination';
import { TableSearch } from '@/components/table-search';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type ConversationRow = {
    id: string;
    started_at: string | null;
    last_activity_at: string | null;
    page_url: string | null;
    lang: string | null;
    visitor_anon: string | null;
    is_returning: boolean;
    message_count: number;
    preview: string;
};

type Props = {
    agent: { id: string; name: string };
    totals: { conversations: number; messages: number; last_24h: number };
    conversations: ConversationRow[];
    pagination: PaginationMeta;
    filters: { q: string };
};

function relativeTime(iso: string | null): string {
    if (!iso) {
        return ' — ';
    }

    const ms = Date.now() - new Date(iso).getTime();
    const sec = Math.max(1, Math.round(ms / 1000));

    if (sec < 60) {
        return __('just now');
    }

    const min = Math.round(sec / 60);

    if (min < 60) {
        return __(':countm ago', { count: min });
    }

    const h = Math.round(min / 60);

    if (h < 24) {
        return __(':counth ago', { count: h });
    }

    const d = Math.round(h / 24);

    return __(':countd ago', { count: d });
}

export default function ConversationsPage({
    agent,
    totals,
    conversations,
    pagination,
    filters,
}: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: __('Agents'), href: '/app/agents' },
        { title: agent.name, href: `/app/agents/${agent.id}` },
        {
            title: __('Conversations'),
            href: `/app/agents/${agent.id}/conversations`,
        },
    ];

    const isEmpty = conversations.length === 0;
    const hasQuery = filters.q.trim() !== '';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__(':name · conversations', { name: agent.name })} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {__('Conversations')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {__('Every visitor session this agent has handled. Click a row to read the full thread.')}
                        </p>
                    </div>
                    <TableSearch
                        placeholder={__('Search by question, page URL, or anon id…')}
                        initialValue={filters.q}
                        only={['conversations', 'pagination', 'filters']}
                    />
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    <Card className="p-4">
                        <p className="text-xs tracking-wide text-muted-foreground uppercase">
                            {__('Total')}
                        </p>
                        <p className="mt-1 text-2xl font-semibold tabular-nums">
                            {totals.conversations.toLocaleString()}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {__('all time')}
                        </p>
                    </Card>
                    <Card className="p-4">
                        <p className="text-xs tracking-wide text-muted-foreground uppercase">
                            {__('Messages')}
                        </p>
                        <p className="mt-1 text-2xl font-semibold tabular-nums">
                            {totals.messages.toLocaleString()}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {__('across all conversations')}
                        </p>
                    </Card>
                    <Card className="p-4">
                        <p className="text-xs tracking-wide text-muted-foreground uppercase">
                            {__('Last 24h')}
                        </p>
                        <p className="mt-1 text-2xl font-semibold tabular-nums">
                            {totals.last_24h.toLocaleString()}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {__('new conversations')}
                        </p>
                    </Card>
                </div>

                {isEmpty ? (
                    <Card className="p-8 text-center">
                        <MessagesSquare className="mx-auto size-10 text-muted-foreground/40" />
                        <p className="mt-3 text-sm font-medium">
                            {hasQuery
                                ? __('No conversations match that search.')
                                : __('No conversations yet.')}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {hasQuery
                                ? __('Try a different keyword.')
                                : __('Once visitors start chatting, every session shows up here.')}
                        </p>
                    </Card>
                ) : (
                    <Card className="p-0">
                        <div className="divide-y">
                            {conversations.map((c) => (
                                <Link
                                    key={c.id}
                                    href={`/app/conversations/${c.id}`}
                                    className="flex items-start gap-3 px-4 py-3 transition hover:bg-muted/50"
                                >
                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                                        <User className="size-4 text-muted-foreground" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="truncate text-sm font-medium">
                                                {c.preview}
                                            </p>
                                            {c.is_returning && (
                                                <span className="rounded bg-violet-500/15 px-1.5 py-0.5 text-[10px] font-medium text-violet-700 dark:text-violet-400">
                                                    {__('returning')}
                                                </span>
                                            )}
                                            {c.lang && c.lang !== 'en' && (
                                                <span className="rounded bg-sky-500/15 px-1.5 py-0.5 text-[10px] font-medium text-sky-700 uppercase dark:text-sky-400">
                                                    {c.lang}
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                            {c.page_url ?? __('(no page url)')}
                                        </p>
                                        <p className="mt-1 text-[11px] text-muted-foreground/80">
                                            {c.visitor_anon
                                                ? c.visitor_anon.slice(0, 16)
                                                : __('(unknown visitor)')}
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 flex-col items-end gap-1 text-right">
                                        <span className="text-xs font-medium tabular-nums">
                                            {__(':count msg', { count: c.message_count })}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">
                                            {relativeTime(c.last_activity_at)}
                                        </span>
                                    </div>
                                    <ChevronRight className="mt-2 size-4 shrink-0 text-muted-foreground" />
                                </Link>
                            ))}
                        </div>
                        <TablePagination
                            pagination={pagination}
                            only={['conversations', 'pagination', 'filters']}
                        />
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
