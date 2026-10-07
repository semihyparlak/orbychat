import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Citation = { id: number; url: string | null };

type Message = {
    role: 'user' | 'assistant';
    content: string;
    citations?: Citation[];
    pending?: boolean;
};

type Props = {
    agent: { id: string; name: string };
};

export default function Playground({ agent }: Props) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: __('Agents'), href: '/app/agents' },
        { title: agent.name, href: `/app/agents/${agent.id}` },
        { title: __('Playground'), href: `/app/agents/${agent.id}/playground` },
    ];

    const send = async (e: React.FormEvent) => {
        e.preventDefault();
        const message = input.trim();

        if (!message || busy) {
            return;
        }

        setInput('');
        setBusy(true);
        setMessages((prev) => [
            ...prev,
            { role: 'user', content: message },
            { role: 'assistant', content: '', pending: true },
        ]);

        try {
            const res = await fetch(`/app/agents/${agent.id}/playground`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN':
                        (
                            document.querySelector(
                                'meta[name="csrf-token"]',
                            ) as HTMLMetaElement | null
                        )?.content ?? '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    message,
                    conversation_id: conversationId,
                }),
            });
            const json = await res.json();
            const data = json.data;
            setConversationId(data.conversation_id);
            setMessages((prev) => {
                const next = [...prev];
                const last = next[next.length - 1];

                if (last?.role === 'assistant') {
                    last.content = data.text;
                    last.citations = data.citations;
                    last.pending = false;
                }

                return next;
            });
        } catch {
            setMessages((prev) => {
                const next = [...prev];
                const last = next[next.length - 1];

                if (last?.role === 'assistant') {
                    last.content = __('Sorry  —  request failed.');
                    last.pending = false;
                }

                return next;
            });
        } finally {
            setBusy(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__(':name · playground', { name: agent.name })} />
            <div className="flex flex-1 flex-col gap-3 p-4">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {__('Playground')}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {__('Test your agent before publishing. Conversations here are not counted toward your billing meter.')}
                </p>

                <Card className="flex h-[60vh] flex-col">
                    <div className="flex-1 overflow-y-auto p-4" role="log">
                        {messages.length === 0 ? (
                            <p className="text-center text-sm text-muted-foreground">
                                {__('Ask a question to start.')}
                            </p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {messages.map((m, i) => (
                                    <div
                                        key={i}
                                        className={`max-w-[85%] rounded-xl px-4 py-2 text-sm ${
                                            m.role === 'user'
                                                ? 'self-end bg-foreground text-background'
                                                : 'self-start bg-muted'
                                        }`}
                                    >
                                        {m.pending && m.content === '' ? (
                                            <em className="opacity-70">
                                                {__('thinking…')}
                                            </em>
                                        ) : (
                                            <span className="whitespace-pre-wrap">
                                                {m.content}
                                            </span>
                                        )}
                                        {m.citations &&
                                            m.citations.length > 0 && (
                                                <p className="mt-2 text-xs opacity-70">
                                                    {__('Sources')}:{' '}
                                                    {m.citations.map((c) => (
                                                        <a
                                                            key={c.id}
                                                            href={c.url ?? '#'}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="underline"
                                                        >
                                                            [{c.id}]{' '}
                                                        </a>
                                                    ))}
                                                </p>
                                            )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <form onSubmit={send} className="flex gap-2 border-t p-3">
                        <Input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={__('Ask anything…')}
                            className="flex-1"
                            disabled={busy}
                        />
                        <Button type="submit" disabled={busy}>
                            {__('Send')}
                        </Button>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
