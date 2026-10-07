import { Head, Link } from '@inertiajs/react';
import {
    ChevronRight,
    Globe,
    MessagesSquare,
    Sparkles,
    User,
} from 'lucide-react';
import { TablePagination } from '@/components/table-pagination';
import type { PaginationMeta } from '@/components/table-pagination';
import { TableSearch } from '@/components/table-search';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import {
    index as conversationsIndex,
    show as conversationShow,
} from '@/routes/conversations';
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
    agent: { id: string; name: string } | null;
};

type Props = {
    totals: {
        conversations: number;
        messages: number;
        last_24h: number;
        active_agents: number;
        leads: number;
    };
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
        return `${min}m ${__('ago')}`;
    }

    const hour = Math.round(min / 60);

    if (hour < 24) {
        return `${hour}h ${__('ago')}`;
    }

    const day = Math.round(hour / 24);

    return `${day}d ${__('ago')}`;
}

export default function WorkspaceConversationsPage({
    totals,
    conversations,
    pagination,
    filters,
}: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: __('Conversations'), href: conversationsIndex() },
    ];
    const isEmpty = conversations.length === 0;
    const hasQuery = filters.q.trim() !== '';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('Conversations')} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {__('Conversations')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {__('Visitor sessions across every agent in this workspace. Open a thread to see exactly what people asked and how your agent replied.')}
                        </p>
                    </div>
                    <TableSearch
                        placeholder={__('Search by agent, question, page URL, or anon id…')}
                        initialValue={filters.q}
                        only={['conversations', 'pagination', 'filters']}
                    />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
                    <Card className="p-4">
                        <p className="text-xs tracking-wide text-muted-foreground uppercase">
                            {__('Total conversations')}
                        </p>
                        <p className="mt-1 text-2xl font-semibold tabular-nums">
                            {totals.conversations.toLocaleString()}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {__('all tracked visitor sessions')}
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
                            {__('customer and agent replies')}
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
                            {__('new conversations started')}
                        </p>
                    </Card>
                    <Card className="p-4">
                        <p className="text-xs tracking-wide text-muted-foreground uppercase">
                            {__('Leads captured')}
                        </p>
                        <p className="mt-1 text-2xl font-semibold tabular-nums">
                            {totals.leads.toLocaleString()}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {__('handoffs from these conversations')}
                        </p>
                    </Card>
                    <Card className="p-4">
                        <p className="text-xs tracking-wide text-muted-foreground uppercase">
                            {__('Active agents')}
                        </p>
                        <p className="mt-1 text-2xl font-semibold tabular-nums">
                            {totals.active_agents.toLocaleString()}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {__('agents with live traffic')}
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
                                ? __('Try a different keyword or agent name.')
                                : __('Once visitors start chatting with any agent in this workspace, those sessions will appear here.')}
                        </p>
                    </Card>
                ) : (
                    <Card className="p-0">
                        <div className="divide-y">
                            {conversations.map((conversation) => (
                                <Link
                                    key={conversation.id}
                                    href={conversationShow(conversation.id)}
                                    className="flex items-start gap-3 px-4 py-3 transition hover:bg-muted/50"
                                >
                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                                        <Globe className="size-4 text-muted-foreground" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            {conversation.agent ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/10 px-2 py-0.5 text-[11px] font-medium text-sky-700 dark:text-sky-300">
                                                    <Sparkles className="size-3" />
                                                    {conversation.agent.name}
                                                </span>
                                            ) : null}
                                            {conversation.is_returning && (
                                                <span className="rounded bg-violet-500/15 px-1.5 py-0.5 text-[10px] font-medium text-violet-700 dark:text-violet-400">
                                                    {__('returning')}
                                                </span>
                                            )}
                                            {conversation.lang &&
                                                conversation.lang !== 'en' && (
                                                    <span className="rounded bg-sky-500/15 px-1.5 py-0.5 text-[10px] font-medium text-sky-700 uppercase dark:text-sky-400">
                                                        {conversation.lang}
                                                    </span>
                                                )}
                                        </div>
                                        <p className="mt-2 truncate text-sm font-medium">
                                            {conversation.preview}
                                        </p>
                                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                            {conversation.page_url ??
                                                __('(no page url)')}
                                        </p>
                                        <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground/80">
                                            <User className="size-3" />
                                            {conversation.visitor_anon
                                                ? conversation.visitor_anon.slice(
                                                      0,
                                                      16,
                                                  )
                                                : __('(unknown visitor)')}
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 flex-col items-end gap-1 text-right">
                                        <span className="text-xs font-medium tabular-nums">
                                            {conversation.message_count}{' '}
                                            {conversation.message_count === 1
                                                ? __('msg')
                                                : __('msgs')}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">
                                            {relativeTime(
                                                conversation.last_activity_at,
                                            )}
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
