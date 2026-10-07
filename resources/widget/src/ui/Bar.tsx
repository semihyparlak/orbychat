import { useEffect, useRef, useState } from 'preact/hooks';
import type { WidgetApi } from '../core/api';
import { extractPageContext } from '../core/pageContext';
import type { WidgetState } from '../core/store';
import { store } from '../core/store';
import { CtaCard } from './CtaCard';
import { LeadForm } from './LeadForm';
import { Messages } from './Messages';
import { PreChatGate } from './PreChatGate';

type Props = {
    api: WidgetApi;
    state: WidgetState;
    error: string | null;
    /**
     * Demo mode — renders a "DEMO" pill above the launcher and a notice
     * inside the chat panel header so visitors on a marketing page
     * understand they're talking to a sandbox agent, not a tracked
     * support bot. Driven by the `data-demo` script-tag attribute.
     */
    demo?: boolean;
};

const CHIME_URL = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYwLjMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsQYAAAAnYAAAAATEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsQUAAAAnQAAAAATEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsQUAAAAnQAAAAATEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';

const baseStyle = {
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    color: '#0f172a',
    boxSizing: 'border-box' as const,
};

type Theme = {
    primary?: string;
    accent?: string;
    radius?: number | string;
    position?: 'bottom-left' | 'bottom-center' | 'bottom-right' | string;
    launcher_label?: string;
};

/**
 * Pull theme values out of agent.theme with sensible fallbacks. The
 * fields are optional and customer-editable from /app/agents/X/customize,
 * so the widget should never assume any of them are present.
 */
function readTheme(
    raw: Record<string, unknown> | null,
    labels?: Record<string, string>,
): Required<Theme> {
    const t = (raw ?? {}) as Theme;

    return {
        primary: typeof t.primary === 'string' ? t.primary : '#111827',
        accent: typeof t.accent === 'string' ? t.accent : '#10b981',
        radius:
            typeof t.radius === 'number'
                ? t.radius
                : typeof t.radius === 'string'
                    ? Number.parseInt(t.radius, 10) || 16
                    : 16,
        position:
            t.position === 'bottom-left' ||
                t.position === 'bottom-center' ||
                t.position === 'bottom-right'
                ? t.position
                : 'bottom-center',
        launcher_label:
            typeof t.launcher_label === 'string' && t.launcher_label.length > 0
                ? t.launcher_label
                : (labels?.ask_anything || 'Ask anything'),
    };
}

/**
 * Pin the outer container to the configured corner / centered bottom.
 * The pill + answer-panel stack inside, with the pill at the bottom.
 * Uses safe-area-inset-bottom so the pill clears the iPhone home
 * indicator.
 */
function positionStyles(position: Required<Theme>['position']): {
    bottom: string;
    left?: string | number;
    right?: string | number;
    transform?: string;
    alignItems: 'flex-start' | 'center' | 'flex-end';
} {
    const bottom = 'calc(env(safe-area-inset-bottom, 0px) + 16px)';

    if (position === 'bottom-left') {
        return { bottom, left: 16, alignItems: 'flex-start' };
    }

    if (position === 'bottom-right') {
        return { bottom, right: 16, alignItems: 'flex-end' };
    }

    return {
        bottom,
        left: '50%',
        transform: 'translateX(-50%)',
        alignItems: 'center',
    };
}

function Orb({ size = 36 }: { size?: number }) {
    return (
        <div
            aria-hidden="true"
            style={{
                width: size,
                height: size,
                borderRadius: '50%',
                background:
                    'radial-gradient(circle at 30% 30%, #a78bfa 0%, #6366f1 35%, #1e1b4b 90%)',
                flexShrink: 0,
                boxShadow:
                    'inset -2px -2px 6px rgba(255,255,255,0.18), inset 2px 2px 4px rgba(0,0,0,0.15)',
            }}
        />
    );
}

function Spinner({ accent }: { accent: string }) {
    return (
        <div
            aria-hidden="true"
            style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                border: '2px solid #e5e7eb',
                borderTopColor: accent,
                animation: 'orbychat-spin 0.8s linear infinite',
            }}
        />
    );
}

function ArrowUpIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
        </svg>
    );
}

function MicIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
    );
}

function DotsIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
        >
            <circle cx="5" cy="12" r="1.6" />
            <circle cx="12" cy="12" r="1.6" />
            <circle cx="19" cy="12" r="1.6" />
        </svg>
    );
}

function PoweredMark({ logoUrl }: { logoUrl?: string | null }) {
    if (logoUrl) {
        return (
            <img
                src={logoUrl}
                alt=""
                style={{
                    display: 'block',
                    width: 'auto',
                    height: 18,
                    maxWidth: 56,
                    objectFit: 'contain',
                    flexShrink: 0,
                }}
            />
        );
    }

    return (
        <span
            aria-hidden="true"
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 18,
                height: 18,
                borderRadius: 4,
                background: '#0f172a',
                color: 'white',
                fontSize: 11,
                fontWeight: 700,
                flexShrink: 0,
            }}
        >
            P
        </span>
    );
}

function brandingDisplayParts(mode?: 'logo_text' | 'logo_only' | 'text_only') {
    if (mode === 'logo_only') {
        return { showLogo: true, showText: false };
    }

    if (mode === 'text_only') {
        return { showLogo: false, showText: true };
    }

    return { showLogo: true, showText: true };
}

/**
 * Mint a fresh `(userId, assistantId)` pair for one turn. Hoisted out
 * of the component so the impure Date.now() call doesn't trip
 * react-hooks/purity inside the render body.
 */
function nextTurnIds(): { userId: string; assistantId: string } {
    const stamp = Date.now();

    return {
        userId: `m-${stamp}-u`,
        assistantId: `m-${stamp}-a`,
    };
}

/**
 * Browser-native voice input. Web Speech API is unprefixed in modern
 * Chromium and Safari; older Safari + iOS still need webkit. Returns
 * undefined on engines that don't expose either, so the mic button
 * can fall back to disabled.
 */
type SpeechRecognitionCtor = new () => {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onresult: ((e: SpeechRecognitionResultEvent) => void) | null;
    onerror: ((e: Event) => void) | null;
    onend: (() => void) | null;
    start: () => void;
    stop: () => void;
};

type SpeechRecognitionResultEvent = {
    results: ArrayLike<{
        0: { transcript: string };
        isFinal: boolean;
        length: number;
    }>;
    resultIndex: number;
};

function getSpeechRecognition(): SpeechRecognitionCtor | undefined {
    const w = window as unknown as {
        SpeechRecognition?: SpeechRecognitionCtor;
        webkitSpeechRecognition?: SpeechRecognitionCtor;
    };

    return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

const menuItemBase = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    padding: '8px 12px',
    fontSize: 13,
    color: '#0f172a',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left' as const,
    textDecoration: 'none',
    fontFamily: 'inherit',
};

export function Bar({ api, state, error, demo = false }: Props) {
    const [open, setOpen] = useState(state.open);
    const [menuOpen, setMenuOpen] = useState(false);
    const [input, setInput] = useState('');
    const [recording, setRecording] = useState(false);
    const [escalating, setEscalating] = useState(false);
    const [escalationStartTime, setEscalationStartTime] = useState<number | null>(null);
    const [voiceSupported] = useState(
        () => getSpeechRecognition() !== undefined,
    );
    const inputRef = useRef<HTMLInputElement | null>(null);
    const menuWrapRef = useRef<HTMLDivElement | null>(null);
    const recognitionRef = useRef<InstanceType<SpeechRecognitionCtor> | null>(
        null,
    );

    const labels = (state.agent as any)?.ui_labels || (state.init as any)?.agent?.ui_labels;
    console.log('OrbyChat UI Labels:', labels);
    if (labels) {
        (window as any).orbychat_labels = labels;
    }

    const theme = readTheme(
        state.agent?.theme as Record<string, unknown> | null,
        labels,
    );
    const accent = theme.primary;
    const launcherLabel = theme.launcher_label;
    const radius = Math.max(12, Math.min(28, Number(theme.radius)));
    const pos = positionStyles(theme.position);
    const isStreaming = state.messages.some((m) => m.pending === true);
    const hasMessages = state.messages.length > 0;
    const showSend = input.trim().length > 0;
    const branding = state.init?.branding;
    const panelTitle = state.isHumanHandling 
        ? (labels?.live_support_title || 'Live support')
        : (labels?.panel_title || 'AI assistant');

    const closeLabel = labels?.close || 'Close';
    const clearLabel = labels?.clear_conversation || 'Clear conversation';
    const poweredByLabel = labels?.powered_by || 'Powered by';

    // Soft chime when unread count increases and bar is closed.
    useEffect(() => {
        if (!state.open && state.unreadCount > 0) {
            const audio = new Audio(CHIME_URL);
            audio.volume = 0.4;
            audio.play().catch(() => {}); // ignore autoplay blocks
        }
    }, [state.unreadCount]);

    // Close the menu on outside click.
    useEffect(() => {
        if (!menuOpen) {
            return;
        }

        const onPointer = (e: MouseEvent | TouchEvent) => {
            const wrap = menuWrapRef.current;

            if (!wrap) {
                return;
            }

            const path =
                typeof e.composedPath === 'function'
                    ? (e.composedPath() as EventTarget[])
                    : [];

            if (!path.includes(wrap)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', onPointer);
        document.addEventListener('touchstart', onPointer);

        return () => {
            document.removeEventListener('mousedown', onPointer);
            document.removeEventListener('touchstart', onPointer);
        };
    }, [menuOpen]);

    // Polling for human takeover when escalating
    useEffect(() => {
        if (!escalating || !state.init) return;

        const jwt = state.init.jwt;
        let timer: any;
        let pollInterval: any;

        const stopEscalation = (success: boolean) => {
            setEscalating(false);
            setEscalationStartTime(null);
            if (timer) clearTimeout(timer);
            if (pollInterval) clearInterval(pollInterval);
            
            if (!success) {
                store.set({ leadFormOpen: true });
            }
        };

        // 30s timeout
        timer = setTimeout(() => {
            stopEscalation(false);
        }, 30000);

        // Poll every 3s
        pollInterval = setInterval(async () => {
            try {
                const res = await api.pollHumanMessages(jwt);
                if (res.is_claimed) {
                    store.set({ isHumanHandling: true });
                    stopEscalation(true);
                }
            } catch (e) {
                // Ignore poll errors
            }
        }, 3000);

        return () => {
            if (timer) clearTimeout(timer);
            if (pollInterval) clearInterval(pollInterval);
        };
    }, [escalating, state.init, api]);

    const onEscalate = async () => {
        if (!state.init) return;
        setEscalating(true);
        setEscalationStartTime(Date.now());
        try {
            await api.requestHuman(state.init.jwt);
        } catch (e) {
            // Best effort
        }
    };

    /**
     * Stream the assistant's reply into an existing bubble, with up
     * to three transparent retry attempts (0ms, 800ms, 1800ms backoff
     * between attempts). The visitor sees a single "thinking…" state
     * across all attempts; only when all three fail do we mark the
     * bubble as errored and show the manual Retry pill.
     *
     * Why retry: Cloudflare Workers AI free tier hits transient rate
     * limits and connection blips fairly often, and most resolve in
     * 1”"2 seconds. Retrying inline beats showing the visitor an error
     * for something that would have worked on its own.
     */
    const streamReply = async (message: string, assistantId: string) => {
        if (!state.init) {
            return;
        }

        let pageContext: unknown;

        try {
            pageContext = extractPageContext();
        } catch {
            pageContext = undefined;
        }

        const attemptDelays = [0, 800, 1800];

        for (let attempt = 0; attempt < attemptDelays.length; attempt++) {
            if (attempt > 0) {
                await new Promise<void>((resolve) =>
                    window.setTimeout(resolve, attemptDelays[attempt]),
                );
                // Wipe whatever partial content the prior attempt
                // produced. Same bubble id, fresh canvas.
                store.resetMessageForRetry(assistantId);
            }

            let attemptDone = false;
            let attemptError = false;

            try {
                await api.streamMessage(
                    state.init.jwt,
                    message,
                    {
                        onToken: (tok) => store.appendToken(assistantId, tok),
                        onBlock: (block) => {
                            // Server-emitted structured block (Phase 3).
                            // Attach to the in-flight assistant message so
                            // the Messages list can render it inline.
                            store.appendBlock(assistantId, block);
                        },
                        onStatus: (status) => {
                            store.updateMessageStatus(assistantId, status.text);
                        },
                        onToolCall: () => {
                            // Phase 2: a tool is running. We don't render
                            // a "running" indicator yet — the block(s) the
                            // tool emits will surface as soon as they
                            // arrive. Hook is here so future renderers
                            // (e.g. spinner pill) can plug in.
                        },
                        onDone: (payload) => {
                            store.finalizeMessage(
                                assistantId,
                                payload.text,
                                payload.citations,
                            );

                            if (payload.ctas && payload.ctas.length > 0) {
                                payload.ctas.forEach(cta => {
                                    store.appendBlock(assistantId, {
                                        type: cta.kind === 'lead' ? 'escalation_button' : 'cta_card',
                                        payload: cta,
                                    });
                                });
                            }

                            if (payload.lead_prompt) {
                                store.appendBlock(assistantId, {
                                    type: 'escalation_button',
                                    payload: {},
                                });
                            }

                            attemptDone = true;
                        },
                        onError: () => {
                            attemptError = true;
                        },
                    },
                    pageContext,
                );
            } catch {
                attemptError = true;
            }

            if (attemptDone) {
                return;
            }

            if (!attemptError) {
                // Stream ended cleanly with no done event (visitor
                // navigated, etc.). Don't retry — likely intentional.
                return;
            }
        }

        // All three attempts failed — surface the manual retry pill.
        store.failMessage(assistantId, 'Sorry — something went wrong.');
    };

    const sendTurn = async (message: string) => {
        if (!state.init) {
            return;
        }

        const { userId, assistantId } = nextTurnIds();
        store.addMessage({ id: userId, role: 'user', content: message });
        store.addMessage({
            id: assistantId,
            role: 'assistant',
            content: '',
            pending: true,
        });

        await streamReply(message, assistantId);
    };

    const ask = (message: string) => sendTurn(message);

    /**
     * Manual retry from the failed-bubble pill. We do NOT re-add the
     * user's original message — that bubble already exists in the
     * thread, and re-adding would produce a visible duplicate (the
     * exact bug visitors reported). Drop the errored assistant
     * bubble, mount a fresh one with a new id (so the typewriter
     * captures pending=true at mount and animates), then re-stream.
     */
    const retry = (failedAssistantId: string) => {
        const idx = state.messages.findIndex((m) => m.id === failedAssistantId);

        if (idx < 1) {
            return;
        }

        const prior = state.messages[idx - 1];

        if (prior.role !== 'user') {
            return;
        }

        store.removeMessage(failedAssistantId);
        const { assistantId } = nextTurnIds();
        store.addMessage({
            id: assistantId,
            role: 'assistant',
            content: '',
            pending: true,
        });
        void streamReply(prior.content, assistantId);
    };

    const submit = (e: Event) => {
        e.preventDefault();

        // If the mic is live, end the session before sending so it
        // doesn't keep trying to fill an input that's already cleared.
        if (recording) {
            stopVoice();
        }

        const v = input.trim();

        if (!v || !state.initialized) {
            return;
        }

        setInput('');
        void sendTurn(v);
    };

    const closeBar = () => {
        setOpen(false);
        store.set({ open: false });
        setMenuOpen(false);
    };

    const startVoice = () => {
        const Ctor = getSpeechRecognition();

        if (!Ctor) {
            return;
        }

        // Snapshot whatever the visitor has already typed/dictated so
        // the new session APPENDS to it instead of replacing — this is
        // what makes re-dictate-after-stop work the way visitors expect.
        const baseText = input;
        const separator =
            baseText.length === 0 || baseText.endsWith(' ') ? '' : ' ';

        try {
            const recognition = new Ctor();
            const lang = state.init?.agent.language_default ?? 'en';
            // Web Speech accepts "en" but works better with a region;
            // crude mapping for the most common defaults.
            recognition.lang = lang.includes('-')
                ? lang
                : `${lang}-${lang === 'en' ? 'US' : lang.toUpperCase()}`;
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.onresult = (e) => {
                let transcript = '';

                for (let i = 0; i < e.results.length; i++) {
                    transcript += e.results[i][0].transcript;
                }

                setInput(baseText + separator + transcript);
            };
            recognition.onerror = () => {
                setRecording(false);
                recognitionRef.current = null;
            };
            recognition.onend = () => {
                setRecording(false);
                recognitionRef.current = null;
            };
            recognition.start();
            recognitionRef.current = recognition;
            setRecording(true);
        } catch {
            // Most likely the visitor denied mic permission. Silently
            // bail — the placeholder text doesn't change so the cause
            // isn't ambiguous to them.
            setRecording(false);
            recognitionRef.current = null;
        }
    };

    const stopVoice = () => {
        const r = recognitionRef.current;

        if (r) {
            try {
                r.stop();
            } catch {
                // Already stopped — nothing to do.
            }
        }

        recognitionRef.current = null;
        setRecording(false);
    };

    const toggleVoice = () => {
        if (recording) {
            stopVoice();
        } else {
            startVoice();
        }
    };

    const clearThread = () => {
        store.clearMessages();
        setMenuOpen(false);

        // Best-effort server-side: persist the clear so /init doesn't
        // re-hydrate the old thread on the next page load. Swallow
        // errors — the local wipe already happened, and the user will
        // see the old thread back on reload but can clear again.
        const jwt = state.init?.jwt;

        if (jwt) {
            api.clearConversation(jwt).catch(() => { });
        }
    };

    // Closed state — small floating orb the visitor can click to bring
    // the pill back. Only reachable after they explicitly chose Close
    // from the menu.
    if (!open) {
        return (
            <div
                style={{
                    position: 'fixed',
                    ...pos,
                    zIndex: 2147483647,
                    ...baseStyle,
                }}
            >
                <button
                    type="button"
                    onClick={() => {
                        setOpen(true);
                        store.set({ open: true });
                    }}
                    aria-label={launcherLabel}
                    style={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        border: 'none',
                        background: 'white',
                        padding: 6,
                        cursor: 'pointer',
                        boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
                        position: 'relative',
                    }}
                >
                    <Orb size={44} />
                    {state.unreadCount > 0 && (
                        <span
                            style={{
                                position: 'absolute',
                                top: -2,
                                right: -2,
                                minWidth: 20,
                                height: 20,
                                borderRadius: 10,
                                background: '#ef4444',
                                color: 'white',
                                fontSize: 11,
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid white',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                animation: 'orbychat-rise 200ms ease-out',
                            }}
                        >
                            {state.unreadCount}
                        </span>
                    )}
                </button>
            </div>
        );
    }

    // Pre-chat gate — when the agent has `require_lead_before_chat`
    // on and the visitor hasn't been captured for this conversation
    // yet, the chat surface is hidden behind a Name + Email form.
    // Submitting flips `leadCaptured` and the chat panel unlocks on
    // the same mount (no reload). The launcher pill is suppressed
    // because typing into a hidden chat would be a dead end.
    const gateOn =
        state.agent?.require_lead_before_chat === true && !state.leadCaptured;

    if (gateOn && state.init) {
        return (
            <div
                style={{
                    position: 'fixed',
                    ...pos,
                    zIndex: 2147483647,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    maxWidth: '95vw',
                    ...baseStyle,
                }}
            >
                <style>{`
                    @keyframes orbychat-rise { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
                `}</style>
                <PreChatGate
                    api={api}
                    jwt={state.init.jwt}
                    accent={accent}
                    radius={radius}
                    agentName={state.agent?.name ?? panelTitle}
                    launcherLabel={launcherLabel}
                    schema={state.agent?.lead_form_fields ?? null}
                    onClose={closeBar}
                />
            </div>
        );
    }

    return (
        <div
            style={{
                position: 'fixed',
                ...pos,
                zIndex: 2147483647,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                maxWidth: '95vw',
                ...baseStyle,
            }}
        >
            <style>{`
                @keyframes orbychat-pulse { 0%,100%{opacity:1;} 50%{opacity:0.35;} }
                @keyframes orbychat-cursor { 0%,50%{opacity:1;} 51%,100%{opacity:0;} }
                @keyframes orbychat-spin { to { transform: rotate(360deg); } }
                @keyframes orbychat-rise { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes orbychat-sonar { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.7); opacity: 0; } }
            `}</style>

            {/* Answer panel — only mounted once a conversation exists. */}
            {hasMessages && (
                <div
                    style={{
                        width: 'min(560px, 95vw)',
                        background: 'white',
                        borderRadius: radius,
                        boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
                        overflow: 'hidden',
                        animation: 'orbychat-rise 200ms ease-out',
                    }}
                >
                    <div
                        style={{
                            padding: '10px 14px',
                            borderBottom: '1px solid #f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 8,
                        }}
                    >
                        <strong style={{ fontSize: 13 }}>{panelTitle}</strong>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                            }}
                        >
                            {demo && (
                                <span
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        padding: '2px 8px',
                                        borderRadius: 999,
                                        background: '#fef3c7',
                                        border: '1px solid #fcd34d',
                                        color: '#92400e',
                                        fontSize: 10,
                                        fontWeight: 700,
                                        letterSpacing: 0.5,
                                        textTransform: 'uppercase',
                                    }}
                                    title="Sandbox agent — for product demonstration only"
                                >
                                    Demo
                                </span>
                            )}
                            {state.isHumanHandling && (
                                <span
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 4,
                                        padding: '2px 8px',
                                        borderRadius: 999,
                                        background: '#ecfdf5',
                                        border: '1px solid #a7f3d0',
                                        color: '#047857',
                                        fontSize: 10,
                                        fontWeight: 600,
                                        letterSpacing: 0.3,
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    <span
                                        style={{
                                            display: 'inline-block',
                                            width: 6,
                                            height: 6,
                                            borderRadius: '50%',
                                            background: '#10b981',
                                            animation:
                                                'orbychat-pulse 1.6s ease-in-out infinite',
                                        }}
                                    />
                                    Live agent
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={closeBar}
                                aria-label="Close"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 26,
                                    height: 26,
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: 'transparent',
                                    color: '#6b7280',
                                    fontSize: 18,
                                    lineHeight: 1,
                                    cursor: 'pointer',
                                }}
                            >
                                ×
                            </button>
                        </div>
                    </div>
                    {error && (
                        <div
                            style={{
                                padding: 12,
                                color: '#b91c1c',
                                fontSize: 13,
                            }}
                        >
                            {error}
                        </div>
                    )}
                    <Messages
                        messages={state.messages}
                        onRetry={retry}
                        onPromptClick={ask}
                        onLeadCapture={() => store.set({ leadFormOpen: true })}
                        onEscalate={onEscalate}
                        state={state}
                    />
                    {escalating && (
                        <div style={{ padding: '0 16px 12px', animation: 'orbychat-rise 200ms ease-out' }}>
                            <div style={{ padding: '12px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                                <Spinner accent={accent} />
                                <div style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>
                                    {labels?.connecting_representative || 'Connecting you to a representative...'}
                                </div>
                            </div>
                        </div>
                    )}
                    {state.activeCta && state.init && (
                        <CtaCard
                            cta={state.activeCta}
                            api={api}
                            jwt={state.init.jwt}
                            accent={accent}
                        />
                    )}
                    {state.leadFormOpen &&
                        !state.leadCaptured &&
                        state.init && (
                            <LeadForm
                                api={api}
                                jwt={state.init.jwt}
                                accent={accent}
                                schema={state.agent?.lead_form_fields ?? null}
                            />
                        )}
                    {state.leadCaptured && (
                        <div
                            style={{
                                margin: '4px 16px 12px',
                                padding: 10,
                                border: '1px solid #10b981',
                                borderRadius: 8,
                                background: '#ecfdf5',
                                fontSize: 13,
                                color: '#065f46',
                            }}
                        >
                            ✓ {labels?.lead_success_title || "Thanks — we'll get back to you soon."}
                        </div>
                    )}
                    {branding?.show && (
                        <a
                            href={branding.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6,
                                padding: '8px 0 10px',
                                borderTop: '1px solid #f1f5f9',
                                fontSize: 11,
                                color: '#9ca3af',
                                textDecoration: 'none',
                            }}
                        >
                            {brandingDisplayParts(branding.display_mode)
                                .showLogo && branding.logo_url ? (
                                <PoweredMark logoUrl={branding.logo_url} />
                            ) : null}
                            {brandingDisplayParts(branding.display_mode)
                                .showText
                                ? branding.label
                                : null}
                        </a>
                    )}
                </div>
            )}

            {/*
             * Demo pill — sits just above the launcher pill while no
             * conversation has started, so anyone landing on the marketing
             * site immediately understands this is a sandbox agent, not a
             * live tracking widget. Once messages exist the answer panel
             * header carries its own DEMO badge so we drop this one.
             */}
            {demo && !hasMessages && (
                <div
                    style={{
                        alignSelf: 'flex-start',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        marginBottom: 4,
                        padding: '4px 10px',
                        borderRadius: 999,
                        background: '#fef3c7',
                        border: '1px solid #fcd34d',
                        color: '#92400e',
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: 0.5,
                        textTransform: 'uppercase',
                        boxShadow: '0 6px 16px rgba(234,179,8,0.18)',
                    }}
                    title="This is a sandbox agent for product demonstration. Conversations are not stored against any live workspace."
                >
                    <span
                        style={{
                            display: 'inline-block',
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: '#f59e0b',
                        }}
                    />
                    Live demo · ask the sandbox agent anything
                </div>
            )}

            {/* The pill itself — input + trailing action. Hidden when a blocking form is open. */}
            {!state.leadFormOpen && !state.showAppointmentFields && (
                <form
                    onSubmit={submit}
                    style={{
                        width: 'min(560px, 95vw)',
                        background: 'white',
                        borderRadius: 9999,
                        boxShadow: '0 14px 32px rgba(0,0,0,0.16)',
                        padding: '6px 8px 6px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        position: 'relative',
                    }}
                >
                <Orb size={36} />

                <input
                    ref={inputRef}
                    type="text"
                    data-orbychat-input
                    value={input}
                    onInput={(e) =>
                        setInput((e.target as HTMLInputElement).value)
                    }
                    placeholder={launcherLabel}
                    aria-label={launcherLabel}
                    disabled={!state.initialized}
                    style={{
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        // 16px keeps iOS Safari from auto-zooming on focus.
                        fontSize: 16,
                        color: '#0f172a',
                        fontFamily: 'inherit',
                        minWidth: 0,
                    }}
                />

                <div
                    ref={menuWrapRef}
                    style={{
                        position: 'relative',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                    }}
                >
                    {/*
                     * Mic stays mounted across all states (idle, typing,
                     * streaming) so visitors can stop a session and start
                     * a new one — re-dictation lives or dies on this slot
                     * not disappearing the moment the input has content.
                     */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                        {recording && (
                            <span
                                aria-hidden="true"
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    borderRadius: '50%',
                                    border: '2px solid #dc2626',
                                    animation:
                                        'orbychat-sonar 1.2s ease-out infinite',
                                    pointerEvents: 'none',
                                }}
                            />
                        )}
                        <button
                            type="button"
                            aria-label={
                                recording
                                    ? (labels?.stop_voice || 'Stop voice input')
                                    : voiceSupported
                                        ? (labels?.start_voice || 'Start voice input')
                                        : (labels?.voice_not_supported || 'Voice input not supported in this browser')
                            }
                            title={
                                recording
                                    ? (labels?.stop_voice || 'Stop voice input')
                                    : voiceSupported
                                        ? (labels?.start_voice || 'Voice input')
                                        : (labels?.voice_not_supported || 'Voice input not supported in this browser')
                            }
                            aria-pressed={recording}
                            disabled={!voiceSupported}
                            onClick={toggleVoice}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                width: 34,
                                height: 34,
                                borderRadius: '50%',
                                border: 'none',
                                background: recording
                                    ? '#dc2626'
                                    : 'transparent',
                                color: recording
                                    ? 'white'
                                    : voiceSupported
                                        ? '#0f172a'
                                        : '#9ca3af',
                                cursor: voiceSupported
                                    ? 'pointer'
                                    : 'not-allowed',
                                opacity: voiceSupported ? 1 : 0.5,
                                transition:
                                    'background-color 120ms ease, color 120ms ease',
                            }}
                        >
                            <MicIcon />
                        </button>
                    </div>

                    {showSend ? (
                        <button
                            type="submit"
                            aria-label={labels?.send || "Send"}
                            disabled={!state.initialized}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 36,
                                height: 36,
                                borderRadius: '50%',
                                border: 'none',
                                background: accent,
                                color: 'white',
                                cursor: state.initialized
                                    ? 'pointer'
                                    : 'not-allowed',
                            }}
                        >
                            <ArrowUpIcon />
                        </button>
                    ) : isStreaming ? (
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 36,
                                height: 36,
                            }}
                        >
                            <Spinner accent={accent} />
                        </div>
                    ) : (
                        <button
                            type="button"
                            aria-label="Menu"
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen((o) => !o)}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 34,
                                height: 34,
                                borderRadius: '50%',
                                border: 'none',
                                background: 'transparent',
                                color: '#9ca3af',
                                cursor: 'pointer',
                            }}
                        >
                            <DotsIcon />
                        </button>
                    )}

                    {menuOpen && (
                        <div
                            role="menu"
                            style={{
                                position: 'absolute',
                                bottom: '100%',
                                right: 0,
                                marginBottom: 8,
                                minWidth: 220,
                                padding: 4,
                                background: 'white',
                                borderRadius: 12,
                                border: '1px solid #e5e7eb',
                                boxShadow: '0 16px 40px rgba(0,0,0,0.18)',
                                animation: 'orbychat-rise 140ms ease-out',
                            }}
                        >
                            {branding?.show && (
                                <a
                                    href={branding.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    role="menuitem"
                                    style={{
                                        ...menuItemBase,
                                        borderBottom: '1px solid #f1f5f9',
                                        paddingBottom: 10,
                                        marginBottom: 2,
                                    }}
                                >
                                    {brandingDisplayParts(branding.display_mode)
                                        .showLogo ? (
                                        <PoweredMark
                                            logoUrl={branding.logo_url}
                                        />
                                    ) : null}
                                    {brandingDisplayParts(branding.display_mode)
                                        .showText ? (
                                        <span>
                                            {poweredByLabel}{' '}
                                            <strong>
                                                {branding.label.replace(
                                                    /^Powered by\s*/i,
                                                    '',
                                                ) || 'OrbyChat'}
                                            </strong>
                                        </span>
                                    ) : null}
                                </a>
                            )}
                            <button
                                type="button"
                                role="menuitem"
                                onClick={closeBar}
                                style={menuItemBase}
                            >
                                <span aria-hidden="true">×</span>
                                <span>{closeLabel}</span>
                            </button>
                            <button
                                type="button"
                                role="menuitem"
                                disabled={!hasMessages}
                                onClick={clearThread}
                                style={{
                                    ...menuItemBase,
                                    color: hasMessages ? '#0f172a' : '#9ca3af',
                                    cursor: hasMessages
                                        ? 'pointer'
                                        : 'not-allowed',
                                }}
                            >
                                <span aria-hidden="true">↺</span>
                                <span>{clearLabel}</span>
                            </button>
                        </div>
                    )}
                </div>
                </form>
            )}

            {/* Starter prompt chips — only when there's no thread yet. */}
            {!hasMessages &&
                state.agent?.starter_prompts &&
                state.agent.starter_prompts.length > 0 && (
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 6,
                            justifyContent: 'center',
                            maxWidth: 'min(560px, 95vw)',
                        }}
                    >
                        {state.agent.starter_prompts.map((prompt, i) => (
                            <button
                                key={`${prompt}-${i}`}
                                type="button"
                                onClick={() => ask(prompt)}
                                disabled={!state.initialized}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: 999,
                                    border: '1px solid rgba(255,255,255,0.4)',
                                    background: 'rgba(255,255,255,0.85)',
                                    backdropFilter: 'blur(6px)',
                                    color: '#0f172a',
                                    fontSize: 12,
                                    cursor: state.initialized
                                        ? 'pointer'
                                        : 'not-allowed',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
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
