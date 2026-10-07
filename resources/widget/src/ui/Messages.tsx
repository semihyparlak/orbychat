import { Fragment } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import type { Message } from '../core/store';
import { BlockList } from './blocks';

type Props = {
    messages: Message[];
    starterPrompts?: string[];
    onRetry?: (failedAssistantId: string) => void;
    onPromptClick?: (prompt: string) => void;
    onLeadCapture?: () => void;
    onEscalate?: () => void;
    state?: any;
};

type Citation = { id: number; url: string | null };

/**
 * Replace inline [N] tokens in the assistant's reply with clickable
 * anchors that open the matching citation URL. Falls back to plain
 * text when the citation has no url, or when the [N] doesn't match
 * any known citation (defensive — the LLM occasionally invents one).
 */
function renderWithCitations(text: string, citations: Citation[]) {
    if (!citations || citations.length === 0) {
        return text;
    }

    const byId = new Map(citations.map((c) => [c.id, c.url] as const));
    const parts: (string | preact.JSX.Element)[] = [];
    const regex = /\[(\d+)\]/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
        }

        const id = Number(match[1]);
        const url = byId.get(id);

        if (url) {
            parts.push(
                <a
                    key={`cite-${match.index}`}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={url}
                    style={{
                        color: '#6366f1',
                        textDecoration: 'none',
                        background: 'rgba(99, 102, 241, 0.1)',
                        borderRadius: 6,
                        padding: '0 6px',
                        fontSize: '0.75em',
                        fontWeight: 700,
                        margin: '0 2px',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        verticalAlign: 'super',
                    }}
                >
                    {id}
                </a>,
            );
        } else {
            parts.push(match[0]);
        }

        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return parts.map((p, i) => <Fragment key={i}>{p}</Fragment>);
}

/**
 * Pick a (chars-per-tick, ms-per-tick) pair based on how far the
 * displayed text is behind the actual streamed content. The further
 * behind, the more aggressively we catch up — we don't want a long
 * reply to leave the visitor staring at a half-typed message ten
 * seconds after the stream is done.
 */
function typewriterPace(charsBehind: number): { step: number; delay: number } {
    if (charsBehind > 240) {
        return { step: 32, delay: 8 };
    }

    if (charsBehind > 60) {
        return { step: 4, delay: 12 };
    }

    return { step: 1, delay: 22 };
}

type AssistantBubbleProps = {
    message: Message;
    onLeadCapture?: () => void;
    onPromptClick?: (prompt: string) => void;
    onEscalate?: () => void;
    state?: any;
};

function AssistantBubble({ message, onLeadCapture, onPromptClick, onEscalate, state }: AssistantBubbleProps) {
    const labels = state?.agent?.ui_labels || (window as any).orbychat_labels;
    const rawContent = message.content;
    const content = rawContent.replace(/<(follow-up|follw-up|follou-up|followup)>.*?<\/(follow-up|follw-up|follou-up|followup)>/gis, '')
                                .replace(/<(follow-up|follw-up|follou-up|followup)>.*?$/gis, '') // Strip partial tags
                                .replace(/<[a-z-]+\b[^>]*?\/>/gis, ''); // Strip self-closing tags like <product/>

    const target = content.length;
    // Capture at mount whether this message was streaming. Hydrated
    // history from /init lands here non-pending and renders instantly;
    // freshly-streamed turns mount with pending=true and animate.
    const [animate] = useState(() => message.pending === true);
    const [displayed, setDisplayed] = useState(animate ? 0 : target);

    useEffect(() => {
        if (displayed >= target) {
            return;
        }

        const { step, delay } = typewriterPace(target - displayed);
        const id = window.setTimeout(() => {
            setDisplayed((d) => Math.min(target, d + step));
        }, delay);

        return () => window.clearTimeout(id);
    }, [displayed, target]);

    const visible = content.slice(0, displayed);
    const stillTyping = displayed < target;
    const showCursor = message.pending === true || stillTyping;

    return (
        <div
            style={{
                padding: '10px 14px',
                borderRadius: 12,
                background: message.error ? '#fef2f2' : '#f3f4f6',
                color: message.error ? '#991b1b' : '#0f172a',
                border: message.error ? '1px solid #fecaca' : 'none',
                fontSize: 14,
                whiteSpace: 'pre-wrap',
                position: 'relative',
            }}
        >
            {message.pending && message.content === '' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        background: '#6366f1',
                        animation: 'orbychat-pulse 1s infinite',
                    }} />
                    <em style={{ opacity: 0.7, fontStyle: 'normal', fontSize: 13 }}>
                        {message.statusText || labels?.thinking || 'thinking...'}
                    </em>
                </div>
            ) : (
                <>
                    {renderWithCitations(visible, message.citations ?? [])}
                    {showCursor && (
                        <span
                            aria-hidden="true"
                            style={{
                                display: 'inline-block',
                                width: 2,
                                height: '1em',
                                marginLeft: 2,
                                background: '#0f172a',
                                verticalAlign: '-0.15em',
                                animation:
                                    'orbychat-cursor 1s steps(2, end) infinite',
                            }}
                        />
                    )}
                </>
            )}
            {message.blocks && message.blocks.filter(b => b.type !== 'follow_up').length > 0 && (
                <BlockList
                    blocks={message.blocks.filter(b => b.type !== 'follow_up')}
                    onLeadCapture={onLeadCapture}
                    onPromptClick={onPromptClick}
                    onEscalate={onEscalate}
                    state={state}
                />
            )}
            {!stillTyping &&
                message.citations &&
                message.citations.length > 0 && (
                    <div
                        style={{
                            marginTop: 12,
                            paddingTop: 8,
                            borderTop: '1px solid rgba(0,0,0,0.06)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            fontSize: 11,
                            color: '#64748b',
                        }}
                    >
                        <span style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                            {labels?.sources || 'Sources'}
                        </span>
                        <div style={{ display: 'flex', gap: 4 }}>
                            {message.citations.map((c, idx) => (
                                <a
                                    key={idx}
                                    href={c.url ?? '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 18,
                                        height: 18,
                                        borderRadius: 4,
                                        background: '#f1f5f9',
                                        color: '#475569',
                                        textDecoration: 'none',
                                        fontWeight: 700,
                                        fontSize: 10,
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.target as HTMLElement).style.background = '#e2e8f0';
                                        (e.target as HTMLElement).style.color = '#0f172a';
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.target as HTMLElement).style.background = '#f1f5f9';
                                        (e.target as HTMLElement).style.color = '#475569';
                                    }}
                                >
                                    {c.id}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
        </div>
    );
}

export function Messages({
    messages,
    starterPrompts,
    onRetry,
    onPromptClick,
    onLeadCapture,
    onEscalate,
    state,
}: Props) {
    const labels = state?.agent?.ui_labels || (window as any).orbychat_labels;
    const containerRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const lastSeenIdRef = useRef<string | undefined>(undefined);
    const lastMessageId = messages[messages.length - 1]?.id;

    // Force-scroll to the bottom every time a new message lands (id of
    // the trailing message changes). Covers three cases that the
    // ResizeObserver below can miss or shouldn't fire on:
    //
    //   1. First mount with hydrated history — visitor opens the bar
    //      and should land on the LATEST turn, not scrolled up to the
    //      first message in their thread.
    //   2. Visitor sends a turn — the new user bubble + pending
    //      assistant placeholder must always be visible, even if the
    //      visitor had scrolled up to read older history.
    //   3. Retry — old failed bubble removed, new assistant placeholder
    //      mounts; should anchor to the new turn.
    //
    // The ResizeObserver effect handles streaming-token growth and is
    // intentionally near-bottom-gated so we don't yank the visitor down
    // mid-read.
    useEffect(() => {
        if (!lastMessageId || lastMessageId === lastSeenIdRef.current) {
            return;
        }

        lastSeenIdRef.current = lastMessageId;
        const scroller = containerRef.current;

        if (scroller) {
            scroller.scrollTop = scroller.scrollHeight;
        }
    }, [lastMessageId]);

    // ResizeObserver replaces the per-message-length scroll effect:
    // typewriter advances grow the inner content's height without
    // changing the messages array, so a deps-based effect would miss
    // them. Observing the content div catches every height change
    // (typewriter, citations footer revealing, retry chip mounting).
    useEffect(() => {
        const scroller = containerRef.current;
        const content = contentRef.current;

        if (!scroller || !content) {
            return;
        }

        const onResize = () => {
            const distanceFromBottom =
                scroller.scrollHeight -
                scroller.scrollTop -
                scroller.clientHeight;

            // Only auto-scroll if the visitor was already near the
            // bottom — don't yank them down if they've scrolled up.
            if (distanceFromBottom < 96) {
                scroller.scrollTop = scroller.scrollHeight;
            }
        };

        const ro = new ResizeObserver(onResize);
        ro.observe(content);

        return () => ro.disconnect();
    }, []);

    if (messages.length === 0) {
        const hasPrompts =
            starterPrompts !== undefined &&
            starterPrompts.length > 0 &&
            onPromptClick !== undefined;

        return (
            <div
                role="log"
                style={{
                    padding: hasPrompts ? '24px 16px' : 32,
                    textAlign: 'center',
                    color: '#6b7280',
                    fontSize: 14,
                }}
            >
                <div style={{ marginBottom: hasPrompts ? 12 : 0 }}>
                    {((window as any).orbychat_labels)?.ask_anything || 'Ask anything about this site.'}
                </div>
                {hasPrompts && (
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 6,
                            justifyContent: 'center',
                        }}
                    >
                        {starterPrompts.map((prompt, i) => (
                            <button
                                key={`${prompt}-${i}`}
                                type="button"
                                onClick={() => onPromptClick(prompt)}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: 999,
                                    border: '1px solid #e5e7eb',
                                    background: 'white',
                                    color: '#0f172a',
                                    fontSize: 13,
                                    cursor: 'pointer',
                                    maxWidth: '100%',
                                    whiteSpace: 'normal',
                                    textAlign: 'left',
                                }}
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            role="log"
            aria-live="polite"
            style={{
                padding: 16,
                maxHeight: 360,
                overflowY: 'auto',
            }}
        >
            <div
                ref={contentRef}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                }}
            >
                {messages.map((m) => {
                    const isUser = m.role === 'user';
                    const isHuman = m.role === 'human-agent';
                    const isAssistant = m.role === 'assistant';

                    return (
                        <div
                            key={m.id}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignSelf: isUser ? 'flex-end' : 'flex-start',
                                maxWidth: '85%',
                            }}
                        >
                            {isHuman && (
                                <span
                                    style={{
                                        fontSize: 10,
                                        color: '#059669',
                                        fontWeight: 600,
                                        marginBottom: 2,
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.4,
                                    }}
                                >
                                {((window as any).orbychat_labels)?.live_agent || 'live agent'}
                                </span>
                            )}
                            {isAssistant ? (
                                <>
                                    <AssistantBubble
                                        message={m}
                                        onLeadCapture={onLeadCapture}
                                        onPromptClick={onPromptClick}
                                        onEscalate={onEscalate}
                                        state={state}
                                    />
                                    {m.blocks && m.blocks.filter(b => b.type === 'follow_up').length > 0 && m.blocks.filter(b => b.type !== 'follow_up').length === 0 && !m.pending && (
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 6,
                                            marginTop: 8,
                                            alignSelf: 'flex-start',
                                            maxWidth: '100%',
                                            overflowX: 'auto',
                                            paddingBottom: 4,
                                        }}>
                                            <BlockList
                                                blocks={m.blocks.filter(b => b.type === 'follow_up')}
                                                onLeadCapture={onLeadCapture}
                                                onPromptClick={onPromptClick}
                                                state={state}
                                            />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div
                                    style={{
                                        padding: '10px 14px',
                                        borderRadius: 12,
                                        background: isUser
                                            ? '#111827'
                                            : '#ecfdf5',
                                        color: isUser ? 'white' : '#0f172a',
                                        border: isHuman
                                            ? '1px solid #a7f3d0'
                                            : 'none',
                                        fontSize: 14,
                                        whiteSpace: 'pre-wrap',
                                    }}
                                >
                                    {m.content}
                                </div>
                            )}
                            {m.error && onRetry && (
                                <button
                                    type="button"
                                    onClick={() => onRetry(m.id)}
                                    className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-red-600 transition hover:text-red-700"
                                    style={{
                                        alignSelf: 'flex-start',
                                        background: 'transparent',
                                        border: 'none',
                                        padding: 0,
                                        cursor: 'pointer'
                                    }}
                                >
                                    ↺ {((window as any).orbychat_labels)?.retry || 'Retry'}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
