import { useEffect, useMemo, useState } from 'preact/hooks';
import { WidgetApi } from './core/api';
import { siteType } from './core/capabilities';
import { isPathRestricted } from './core/path-restrictions';
import { store } from './core/store';
import { TriggerEngine } from './triggers/engine';
import type { TriggerRule } from './triggers/engine';
import { Bar } from './ui/Bar';

type Props = {
    agentId: string | null;
    baseUrl: string;
    demo?: boolean;
};

const COOKIE = 'pb_anon_id';

function readAnonId(): string | undefined {
    const match = document.cookie.match(/(?:^|; )pb_anon_id=([^;]+)/);

    return match ? decodeURIComponent(match[1]) : undefined;
}

function writeAnonId(id: string): void {
    const oneYear = 60 * 60 * 24 * 365;
    document.cookie = `${COOKIE}=${encodeURIComponent(id)}; max-age=${oneYear}; path=/; SameSite=Lax`;
}

export function App({ agentId, baseUrl, demo = false }: Props) {
    const api = useMemo(() => new WidgetApi(baseUrl), [baseUrl]);
    const [state, setState] = useState(store.get());
    const [error, setError] = useState<string | null>(null);

    useEffect(() => store.subscribe(setState), []);

    useEffect(() => {
        store.set({ api });
    }, [api]);

    useEffect(() => {
        if (!agentId || state.initialized) {
            return;
        }

        let cancelled = false;
        let engine: TriggerEngine | null = null;
        api.init(agentId, window.location.href, readAnonId())
            .then((init) => {
                if (cancelled) {
                    return;
                }

                writeAnonId(init.anonymous_id);

                // Restricted-paths gate. The agent's admin lists URL
                // patterns the widget should NOT mount on (their own
                // /admin, /checkout, /account flows). If the current
                // pathname matches any pattern, mark the run
                // initialized + restricted and bail BEFORE registering
                // triggers, opening the bar, or logging widget.ready.
                if (
                    isPathRestricted(
                        window.location.pathname,
                        init.agent.restricted_paths,
                    )
                ) {
                    store.set({
                        init,
                        agent: init.agent,
                        initialized: true,
                        restricted: true,
                    });

                    return;
                }

                // Hydrate any prior turns the server returned for this
                // (visitor, conversation) so chat history persists across
                // page reloads.
                const priorMessages = (init.messages ?? []).map((m) => ({
                    id: m.id,
                    role: m.role,
                    content: m.content,
                    citations: m.citations ?? [],
                }));
                store.set({
                    init,
                    agent: init.agent,
                    initialized: true,
                    messages: priorMessages,
                    // Pre-chat gate: server tells us whether this
                    // conversation has already captured a lead, so a
                    // returning visitor doesn't see the gate again on
                    // refresh. Defaults to false on legacy responses.
                    leadCaptured: init.lead_captured === true,
                    api,
                });

                // Vertical-adaptive Phase 1: tag this load with the
                // resolved site_type so analytics can segment by vertical.
                api.logEvents(init.jwt, [
                    {
                        kind: 'widget.ready',
                        payload: { site_type: siteType(init.agent) },
                    },
                ]).catch(() => {});

                api.getAvailability(agentId).then((av) => {
                    store.set({ availability: av });
                }).catch(() => {});

                // Start behavior triggers if any are configured
                const rules = (init as any).behavior_rules ?? [];

                if (rules.length > 0) {
                    engine = new TriggerEngine(rules, (rule) => {
                        const message =
                            (rule.action as { message?: string } | undefined)
                                ?.message ??
                            'Hi! Can I help you find anything?';
                        store.openWith(message);
                        // Best-effort log
                        api.logEvents(init.jwt, [
                            {
                                kind: 'trigger.fired',
                                payload: { rule_id: rule.id, kind: rule.kind },
                            },
                        ]).catch(() => {});
                    });
                    engine.start();
                }
            })
            .catch((err) => {
                if (cancelled) {
                    return;
                }

                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to load assistant.',
                );
            });

        return () => {
            cancelled = true;
            engine?.stop();
        };
    }, [agentId, api, state.initialized]);

    // Long-poll for human-operator replies whenever the bar is open and a
    // JWT is available. Bot replies stream over SSE; this picks up the
    // takeover side. 3-second cadence is gentle on the server (one indexed
    // query per active visitor) and feels real-time to the visitor.
    useEffect(() => {
        const jwt = state.init?.jwt;

        if (!state.open || !jwt) {
            return;
        }

        let lastSeen: string | null = null;
        let stopped = false;

        const tick = async () => {
            try {
                const out = await api.pollHumanMessages(jwt, lastSeen);

                if (stopped) {
                    return;
                }

                if (out.is_claimed !== state.isHumanHandling) {
                    store.set({ isHumanHandling: out.is_claimed });
                }

                for (const m of out.messages) {
                    store.addMessage({
                        id: m.id,
                        role: 'human-agent',
                        content: m.content,
                    });
                    lastSeen = m.id;
                }
            } catch {
                // best-effort
            }
        };

        const interval = window.setInterval(tick, 3000);

        // Fire once immediately on bar-open.
        tick();

        return () => {
            stopped = true;
            window.clearInterval(interval);
        };
    }, [api, state.open, state.init?.jwt, state.isHumanHandling]);

    if (!agentId) {
        return null;
    }

    // Path-restricted by admin â†’ render nothing. The init has already
    // happened (one HTTP hit, irreducible) but no UI mounts and no
    // background work runs.
    if (state.restricted) {
        return null;
    }

    return <Bar api={api} state={state} error={error} demo={demo} />;
}
