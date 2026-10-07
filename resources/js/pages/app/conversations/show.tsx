import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, ExternalLink, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Citation = { id: number; url: string | null };

type Msg = {
    id: string;
    role: 'user' | 'assistant' | 'human-agent';
    content: string;
    citations: Citation[];
    confidence: number | null;
    created_at: string | null;
};

type Props = {
    agent: { id: string; name: string };
    conversation: {
        id: string;
        started_at: string | null;
        page_url: string | null;
        lang: string | null;
        visitor_anon: string | null;
    };
    messages: Msg[];
};

function fmtTime(iso: string | null): string {
    if (!iso) {
        return '';
    }

    return new Date(iso).toLocaleString();
}

export default function ConversationShow({
    agent,
    conversation,
    messages,
}: Props) {
    // Auto-poll for new messages every 5s while the tab is visible.
    // Inertia partial-reloads only the messages prop so the page
    // doesn't flash. Pauses when the tab is hidden (battery + cost).
    const [isLive, setIsLive] = useState(true);

    useEffect(() => {
        if (!isLive) {
            return;
        }

        const tick = () => {
            if (document.visibilityState !== 'visible') {
                return;
            }

            router.reload({ only: ['messages'] });
        };

        const interval = window.setInterval(tick, 5000);

        return () => window.clearInterval(interval);
    }, [isLive]);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: __('Agents'), href: '/app/agents' },
        { title: agent.name, href: `/app/agents/${agent.id}` },
        {
            title: __('Conversations'),
            href: `/app/agents/${agent.id}/conversations`,
        },
        { title: __('Thread'), href: `/app/conversations/${conversation.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${agent.name} · ${__('conversation thread')}`} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <Link
                    href={`/app/agents/${agent.id}/conversations`}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="size-3" /> {__('Back to conversations')}
                </Link>

                <Card className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
                                {__('Conversation thread')}
                                <button
                                    type="button"
                                    onClick={() => setIsLive(!isLive)}
                                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase transition ${
                                        isLive
                                            ? 'bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 dark:text-emerald-400'
                                            : 'bg-muted text-muted-foreground hover:bg-muted/70'
                                    }`}
                                    title={
                                        isLive
                                            ? __('Auto-refreshing every 5s — click to pause')
                                            : __('Click to resume auto-refresh')
                                    }
                                >
                                    <span
                                        className={`inline-block size-1.5 rounded-full ${
                                            isLive
                                                ? 'animate-pulse bg-emerald-500'
                                                : 'bg-muted-foreground/50'
                                        }`}
                                    />
                                    {isLive ? __('Live') : __('Paused')}
                                </button>
                            </h1>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {__('Started')} {fmtTime(conversation.started_at)}
                                {conversation.lang
                                    ? ` · ${conversation.lang}`
                                    : ''}
                            </p>
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                            <p>
                                {__('Visitor')}:{' '}
                                {conversation.visitor_anon?.slice(0, 18) ??
                                    __('anonymous')}
                            </p>
                            {conversation.page_url && (
                                <a
                                    href={conversation.page_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-0.5 inline-flex items-center gap-1 hover:text-foreground"
                                >
                                    <ExternalLink className="size-3" />
                                    <span className="max-w-[280px] truncate">
                                        {conversation.page_url}
                                    </span>
                                </a>
                            )}
                        </div>
                    </div>
                </Card>

                <div className="flex flex-col gap-3">
                    {messages.length === 0 ? (
                        <Card className="p-8 text-center text-sm text-muted-foreground">
                            {__('No messages in this conversation yet.')}
                        </Card>
                    ) : (
                        messages.map((m) => {
                            const isUser = m.role === 'user';
                            const isHuman = m.role === 'human-agent';

                            return (
                                <div
                                    key={m.id}
                                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                                            isUser
                                                ? 'bg-foreground text-background'
                                                : isHuman
                                                  ? 'border border-emerald-500/30 bg-emerald-500/5'
                                                  : 'bg-muted'
                                        }`}
                                    >
                                        {isHuman && (
                                            <p className="mb-1 text-[10px] font-semibold tracking-wider text-emerald-700 uppercase dark:text-emerald-400">
                                                {__('live agent')}
                                            </p>
                                        )}
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                            {m.content}
                                        </p>
                                        {m.citations &&
                                            m.citations.length > 0 && (
                                                <div className="mt-2 flex flex-wrap gap-2 text-[11px] opacity-75">
                                                    <span>{__('Sources')}:</span>
                                                    {m.citations.map((c, i) => (
                                                        <a
                                                            key={i}
                                                            href={c.url ?? '#'}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="underline"
                                                        >
                                                            [{c.id}]
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                    </div>
                                    <p className="mt-1 px-2 text-[10px] text-muted-foreground">
                                        {isUser ? (
                                            <User className="mr-1 inline size-3" />
                                        ) : null}
                                        {fmtTime(m.created_at)}
                                        {m.confidence !== null &&
                                            !isUser &&
                                            !isHuman && (
                                                <span
                                                    className={`ml-2 ${m.confidence < 0.6 ? 'text-amber-600' : ''}`}
                                                >
                                                    · {__('confidence')}{' '}
                                                    {(
                                                        m.confidence * 100
                                                    ).toFixed(0)}
                                                    %
                                                </span>
                                            )}
                                    </p>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
