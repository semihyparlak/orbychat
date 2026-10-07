export type AgentConfig = {
    id: string;
    name: string;
    persona: Record<string, unknown> | null;
    theme: Record<string, unknown> | null;
    starter_prompts: string[] | null;
    language_default: string;
    // Vertical-adaptive Phase 1: server returns these so the widget can
    // tag telemetry and (in Phase 3) gate rich-message rendering. Both
    // are optional + string-typed so a future server-added vertical or
    // capability never crashes a deployed bundle.
    site_type?: string;
    capabilities?: string[];
    /**
     * URL paths the widget should NOT mount on. Each entry may include
     * `*` wildcards (e.g. `/admin/*`). Compared against
     * `window.location.pathname` case-insensitively at boot.
     * Optional: legacy bundles that don't know about this field still
     * work — server returns `[]` when no paths are set.
     */
    restricted_paths?: string[];
    /**
     * When true, the widget gates the chat surface behind a Name +
     * Email form. Renders <PreChatGate/> first; once submitted (and
     * the lead is created server-side) the chat panel unlocks.
     * Optional: legacy bundles default to the unlocked behaviour.
     */
    require_lead_before_chat?: boolean;
    /**
     * Custom lead-form schema (#34). Per-agent JSON list of field
     * definitions; the widget renders these in both the inline
     * lead form and the pre-chat gate. Null / undefined / empty =
     * fall back to the hard-coded Name + Email shape so older
     * agents keep working.
     */
    lead_form_fields?: LeadFormField[] | null;
};

export type LeadFormFieldType =
    | 'text'
    | 'email'
    | 'tel'
    | 'textarea'
    | 'select'
    | 'checkbox';

export type LeadFormField = {
    key: string;
    label: string;
    type: LeadFormFieldType;
    required?: boolean;
    placeholder?: string | null;
    maxlength?: number | null;
    options?: string[];
};

export type ReverbConfig = {
    app_key: string;
    host: string;
    port: number;
    scheme: 'http' | 'https';
};

export type InitMessage = {
    id: string;
    role: 'user' | 'assistant' | 'human-agent';
    content: string;
    citations: { id: number; url: string | null }[];
};

export type Branding = {
    show: boolean;
    label: string;
    url: string;
    logo_url?: string | null;
    display_mode?: 'logo_text' | 'logo_only' | 'text_only';
};

export type InitResponse = {
    conversation_id: string;
    visitor_id: string;
    anonymous_id: string;
    jwt: string;
    expires_at: number;
    agent: AgentConfig;
    branding?: Branding;
    reverb: ReverbConfig;
    messages?: InitMessage[];
    /**
     * True when the visitor has already captured a lead for this
     * conversation — used by the pre-chat-gate runtime to avoid
     * re-prompting on every page refresh. Server resolves it via a
     * single indexed existence check; legacy bundles (and gate-off
     * agents) ignore the field.
     */
    lead_captured?: boolean;
};

export class WidgetApi {
    constructor(private readonly baseUrl: string) {}

    async init(
        agentId: string,
        pageUrl: string,
        anonId?: string,
    ): Promise<InitResponse> {
        const response = await fetch(`${this.baseUrl}/api/v1/widget/init`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                agent_id: agentId,
                page_url: pageUrl,
                anon_id: anonId,
            }),
            credentials: 'omit',
        });

        if (!response.ok) {
            throw new Error(`init failed: ${response.status}`);
        }

        const json = await response.json();

        return json.data as InitResponse;
    }

    async getAvailability(agentId: string, date?: string): Promise<{ settings: any, booked_slots?: string[] }> {
        const qs = `?agent_id=${encodeURIComponent(agentId)}` + (date ? `&date=${encodeURIComponent(date)}` : '');
        const response = await fetch(`${this.baseUrl}/api/v1/widget/availability${qs}`);
        if (!response.ok) {
            throw new Error(`availability fetch failed: ${response.status}`);
        }
        return await response.json();
    }

    async sendMessage(
        token: string,
        message: string,
    ): Promise<{
        message_id: string;
        text: string;
        citations: { id: number; url: string | null }[];
    }> {
        const response = await fetch(`${this.baseUrl}/api/v1/widget/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            throw new Error(`message failed: ${response.status}`);
        }

        return (await response.json()).data;
    }

    /**
     * Stream a message turn over SSE. Calls onToken(token) as each token arrives,
     * and onDone(payload) when the stream completes.
     *
     * Reliability hardening for production proxies (cPanel, Cloudflare,
     * shared hosting):
     *  - Stale-stream detector: aborts the fetch when no events arrive
     *    for `STALE_TIMEOUT_MS` so the widget never hangs forever on a
     *    silently-dropped connection.
     *  - "Stream ended without 'done'" is treated as an error so the
     *    visitor sees a proper error bubble + retry, not an empty
     *    "thinking..." that never resolves.
     */
    async streamMessage(
        token: string,
        message: string,
        callbacks: {
            onStart?: (msg: {
                conversation_id: string;
                message_id: string;
            }) => void;
            onToken: (text: string) => void;
            onDone?: (payload: {
                text: string;
                citations: { id: number; url: string | null }[];
                low_confidence: boolean;
                latency_ms: number;
                ctas?: {
                    label: string;
                    kind: string;
                    url?: string | null;
                }[] | null;
                lead_prompt?: boolean;
            }) => void;
            onError?: (err: { code: string; message?: string }) => void;
            onToolCall?: (event: {
                name: string;
                args: Record<string, unknown>;
            }) => void;
            onBlock?: (block: {
                type: string;
                payload: Record<string, unknown>;
            }) => void;
            onStatus?: (status: { text: string }) => void;
        },
        pageContext?: unknown,
    ): Promise<void> {
        // Generous timeouts: enough to absorb a Cloudflare Workers AI cold
        // start (≈5–8s on first hit) without giving up too early.
        const STALE_TIMEOUT_MS = 25_000; // no event arrived for 25s -> abort
        const TOTAL_TIMEOUT_MS = 90_000; // hard ceiling on the whole turn

        const controller = new AbortController();
        let abortReason: string | null = null;
        let lastEventAt = Date.now();
        const startedAt = Date.now();

        const staleCheck = window.setInterval(() => {
            if (Date.now() - lastEventAt > STALE_TIMEOUT_MS) {
                abortReason = 'stale_stream';
                controller.abort();
            } else if (Date.now() - startedAt > TOTAL_TIMEOUT_MS) {
                abortReason = 'total_timeout';
                controller.abort();
            }
        }, 2_000);

        let response: Response;

        try {
            response = await fetch(
                `${this.baseUrl}/api/v1/widget/messages/stream`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                        Accept: 'text/event-stream',
                    },
                    body: JSON.stringify(
                        pageContext
                            ? { message, page_context: pageContext }
                            : { message },
                    ),
                    signal: controller.signal,
                },
            );
        } catch (err) {
            window.clearInterval(staleCheck);
            const code = abortReason ?? 'network_failed';
            callbacks.onError?.({
                code,
                message: err instanceof Error ? err.message : code,
            });

            return;
        }

        if (!response.ok || !response.body) {
            window.clearInterval(staleCheck);
            callbacks.onError?.({
                code: 'http_failed',
                message: `HTTP ${response.status}`,
            });

            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        let eventName = '';
        let doneSeen = false;
        let errorSeen = false;

        const handleEvent = (event: string, data: string) => {
            // SSE comment lines start with ':' (server heartbeats).
            // We just want to update lastEventAt and ignore.
            if (event === '') {
                return;
            }

            try {
                const payload = JSON.parse(data);

                if (event === 'start') {
                    callbacks.onStart?.(payload);
                } else if (event === 'token') {
                    callbacks.onToken(payload.t ?? '');
                } else if (event === 'tool_call') {
                    callbacks.onToolCall?.(payload);
                } else if (event === 'block') {
                    callbacks.onBlock?.(payload);
                } else if (event === 'done') {
                    doneSeen = true;
                    callbacks.onDone?.(payload);
                } else if (event === 'status') {
                    callbacks.onStatus?.(payload);
                } else if (event === 'error') {
                    errorSeen = true;
                    callbacks.onError?.(payload);
                }
            } catch {
                // ignore malformed line
            }
        };

        try {
            for (;;) {
                const { value, done } = await reader.read();

                if (done) {
                    break;
                }

                lastEventAt = Date.now();
                buffer += decoder.decode(value, { stream: true });

                // Split on blank-line message boundaries
                let boundary = buffer.indexOf('\n\n');

                while (boundary !== -1) {
                    const block = buffer.slice(0, boundary);
                    buffer = buffer.slice(boundary + 2);
                    eventName = '';
                    let dataLines = '';
                    let isCommentOnly = false;

                    for (const line of block.split('\n')) {
                        if (line.startsWith(':')) {
                            // SSE heartbeat comment — keep-alive only,
                            // refresh the staleness clock.
                            isCommentOnly = true;
                        } else if (line.startsWith('event:')) {
                            eventName = line.slice(6).trim();
                        } else if (line.startsWith('data:')) {
                            dataLines += line.slice(5).trim();
                        }
                    }

                    if (eventName && dataLines) {
                        handleEvent(eventName, dataLines);
                    } else if (isCommentOnly) {
                        // already updated lastEventAt above
                    }

                    boundary = buffer.indexOf('\n\n');
                }
            }
        } catch (err) {
            window.clearInterval(staleCheck);
            const code = abortReason ?? 'stream_aborted';
            // Fire onError so the widget shows a retry affordance
            // instead of leaving the bubble in pending state.
            callbacks.onError?.({
                code,
                message:
                    err instanceof Error ? err.message : 'Stream interrupted.',
            });

            return;
        }

        window.clearInterval(staleCheck);

        // Stream finished cleanly but no `done` event arrived — common
        // failure mode behind buffering proxies (Cloudflare CDN, cPanel
        // FastCGI, mod_deflate). Treat as an error so the visitor sees a
        // retry affordance instead of an indefinite "thinking…".
        if (!doneSeen && !errorSeen) {
            callbacks.onError?.({
                code: 'stream_ended_without_done',
                message: 'The connection closed before the answer was ready.',
            });
        }
    }

    async captureLead(
        token: string,
        payload: {
            email: string;
            name?: string;
            phone?: string;
            fields?: Record<string, string | boolean>;
        },
    ): Promise<void> {
        const response = await fetch(`${this.baseUrl}/api/v1/widget/leads`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            let errorMsg = `lead capture failed: ${response.status}`;
            try {
                const errJson = await response.json();
                if (errJson.error?.message) errorMsg += ` - ${errJson.error.message}`;
                else if (errJson.message) errorMsg += ` - ${errJson.message}`;
            } catch {
                // ignore parse error
            }
            throw new Error(errorMsg);
        }
    }

    /**
     * Long-poll for messages typed by a human operator who has claimed
     * this conversation. Bot replies arrive via streamMessage; this
     * picks up the takeover side.
     */
    async pollHumanMessages(
        token: string,
        after?: string | null,
    ): Promise<{
        is_claimed: boolean;
        messages: {
            id: string;
            role: 'human-agent';
            content: string;
            at: string;
        }[];
    }> {
        const qs = after ? `?after=${encodeURIComponent(after)}` : '';
        const response = await fetch(
            `${this.baseUrl}/api/v1/widget/conversation/messages${qs}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            },
        );

        if (!response.ok) {
            throw new Error(`poll failed: ${response.status}`);
        }

        return (await response.json()).data;
    }

    /**
     * Server-side counterpart to the widget's "Clear conversation"
     * menu item. Stamps `cleared_at` on the visitor's current
     * conversation row so /init stops re-hydrating older messages on
     * subsequent page loads. The current JWT keeps working — we don't
     * end the conversation, just hide history.
     */
    async clearConversation(token: string): Promise<void> {
        await fetch(`${this.baseUrl}/api/v1/widget/conversation/clear`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
    }

    async logEvents(
        token: string,
        events: { kind: string; payload?: Record<string, unknown> }[],
    ): Promise<void> {
        await fetch(`${this.baseUrl}/api/v1/widget/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ events }),
        });
    }

    async requestHuman(token: string): Promise<void> {
        await this.logEvents(token, [{ kind: 'human_requested', payload: {} }]);
    }
}
