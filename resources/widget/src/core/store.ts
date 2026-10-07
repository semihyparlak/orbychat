import type { AgentConfig, InitResponse } from './api';

export type Citation = { id: number; url: string | null };

export type CtaPayload = {
    label: string;
    kind: string;
    url?: string | null;
};

export type Block = {
    type: string;
    payload: Record<string, unknown>;
};

export type Message = {
    id: string;
    role: 'user' | 'assistant' | 'human-agent';
    content: string;
    citations?: Citation[];
    blocks?: Block[];
    pending?: boolean;
    statusText?: string;
    error?: boolean;
};

type Listener = (state: WidgetState) => void;

export type WidgetState = {
    open: boolean;
    initialized: boolean;
    init: InitResponse | null;
    agent: AgentConfig | null;
    messages: Message[];
    leadCaptured: boolean;
    leadFormOpen: boolean;
    activeCta: CtaPayload | null;
    isHumanHandling: boolean;
    /**
     * True when window.location.pathname matched a glob in the
     * agent's `restricted_paths`. The render bails to null so the
     * widget UI never mounts on this page. Distinct from `!initialized`
     * — restricted pages have completed init, they're just opted out
     * of the UI.
     */
    restricted: boolean;
    showAppointmentFields: boolean;
    availability: { settings: any } | null;
    api: any | null;
    unreadCount: number;
};

const OPEN_STATE_KEY = 'orbychat:open';

/**
 * In the omnibar redesign the pill is visible by default — visitors
 * shouldn't have to hunt for an open button. Only persist a value
 * when the visitor explicitly closes via the menu, in which case we
 * remember they don't want to see the bar across reloads.
 */
function loadInitialOpen(): boolean {
    try {
        return window.localStorage.getItem(OPEN_STATE_KEY) !== '0';
    } catch {
        return true;
    }
}

function persistOpen(open: boolean): void {
    try {
        if (!open) {
            window.localStorage.setItem(OPEN_STATE_KEY, '0');
        } else {
            window.localStorage.removeItem(OPEN_STATE_KEY);
        }
    } catch {
        // ignore
    }
}

const initial: WidgetState = {
    open: loadInitialOpen(),
    initialized: false,
    init: null,
    agent: null,
    messages: [],
    leadCaptured: false,
    leadFormOpen: false,
    activeCta: null,
    isHumanHandling: false,
    restricted: false,
    showAppointmentFields: false,
    availability: null,
    api: null,
    unreadCount: 0,
};

/**
 * Wipe the conversation thread from the visitor's view. Server-side
 * the conversation row stays intact (analytics, lead linkage, audit)
 * — this only clears what's on screen, until the visitor sends the
 * next turn.
 */

export class WidgetStore {
    private state: WidgetState = { ...initial };

    private listeners: Set<Listener> = new Set();

    get(): WidgetState {
        return this.state;
    }

    set(partial: Partial<WidgetState>): void {
        this.state = { ...this.state, ...partial };
        
        if (partial.open === true) {
            this.state.unreadCount = 0;
        }

        if (partial.open !== undefined) {
            persistOpen(partial.open);
        }

        this.listeners.forEach((l) => l(this.state));
    }

    addMessage(msg: Message): void {
        const unreadCount = (!this.state.open && (msg.role === 'assistant' || msg.role === 'human-agent'))
            ? this.state.unreadCount + 1
            : this.state.unreadCount;
            
        this.set({ 
            messages: [...this.state.messages, msg],
            unreadCount
        });
    }

    appendToken(messageId: string, token: string): void {
        const messages = this.state.messages.map((m) =>
            m.id === messageId
                ? { ...m, content: m.content + token, pending: false }
                : m,
        );
        this.set({ messages });
    }

    updateMessageStatus(messageId: string, statusText: string): void {
        const messages = this.state.messages.map((m) =>
            m.id === messageId ? { ...m, statusText, pending: true } : m,
        );
        this.set({ messages });
    }

    finalizeMessage(
        messageId: string,
        text: string,
        citations: Citation[],
    ): void {
        const messages = this.state.messages.map((m) =>
            m.id === messageId
                ? { ...m, content: text, citations, pending: false, statusText: undefined }
                : m,
        );
        this.set({ messages });
    }

    /**
     * Attach a Block to a streaming assistant message. Block events
     * arrive interleaved with token events when a tool produced
     * structured output (e.g. an escalation_button). Renderers in
     * `ui/blocks.tsx` look up each block by type.
     */
    appendBlock(messageId: string, block: Block): void {
        const messages = this.state.messages.map((m) =>
            m.id === messageId
                ? { ...m, blocks: [...(m.blocks ?? []), block] }
                : m,
        );
        this.set({ messages });
    }

    /**
     * Wipe a streamed bubble back to a clean "thinking…" placeholder.
     * Used between auto-retry attempts inside Bar.streamReply so a
     * partial response from a failed first attempt doesn't leak into
     * the second attempt's render. Same id, same array position, just
     * a fresh canvas.
     */
    resetMessageForRetry(messageId: string): void {
        const messages = this.state.messages.map((m) =>
            m.id === messageId
                ? {
                      ...m,
                      content: '',
                      citations: [],
                      pending: true,
                      error: false,
                  }
                : m,
        );
        this.set({ messages });
    }

    /**
     * Mark an assistant message as failed so the UI can show a retry
     * affordance. The user's original turn (the message immediately
     * before this one in the array) is what gets re-sent on retry.
     */
    failMessage(messageId: string, errorText: string): void {
        const messages = this.state.messages.map((m) =>
            m.id === messageId
                ? {
                      ...m,
                      content: errorText,
                      pending: false,
                      error: true,
                  }
                : m,
        );
        this.set({ messages });
    }

    removeMessage(messageId: string): void {
        this.set({
            messages: this.state.messages.filter((m) => m.id !== messageId),
        });
    }

    clearMessages(): void {
        this.set({
            messages: [],
            activeCta: null,
            leadFormOpen: false,
        });
    }

    openWith(message: string): void {
        const id = `m-${Date.now()}-trigger`;
        this.set({
            open: true,
            messages: [
                ...this.state.messages,
                { id, role: 'assistant', content: message },
            ],
        });
    }

    subscribe(listener: Listener): () => void {
        this.listeners.add(listener);

        return () => this.listeners.delete(listener);
    }
}

export const store = new WidgetStore();
