import { router } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { __ } from '@/app';

type LeadFeedItem = {
    id: string;
    email: string | null;
    name: string | null;
    phone: string | null;
    agent_name: string;
    inbox_url: string;
    created_at: string | null;
};

type LeadFeedResponse = {
    data: {
        leads: LeadFeedItem[];
        count_24h: number;
        now: string;
    };
};

const POLL_INTERVAL_MS = 30000;
const STORAGE_KEY = 'orbychat:leads:since';

function readSince(): string {
    if (typeof window === 'undefined') {
        return '';
    }

    try {
        return window.sessionStorage.getItem(STORAGE_KEY) ?? '';
    } catch {
        return '';
    }
}

function writeSince(value: string): void {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        window.sessionStorage.setItem(STORAGE_KEY, value);
    } catch {
        // private mode / quota  —  silently ignore
    }
}

function fireBrowserNotification(item: any): void {
    if (typeof window === 'undefined' || !('Notification' in window)) {
        return;
    }

    if (Notification.permission !== 'granted') {
        return;
    }

    try {
        const isHumanRequest = item.type === 'human_request';
        const headline = isHumanRequest 
            ? __('Human Requested!') 
            : (item.email ?? item.phone ?? __('New lead'));
        const body = isHumanRequest
            ? __(':agent has a visitor waiting for a human.', { agent: item.agent_name })
            : __(':agent captured :headline', { agent: item.agent_name, headline });
            
        const note = new Notification(headline, {
            body,
            tag: `${item.type}-${item.id}`,
        });
        note.onclick = () => {
            window.focus();
            router.visit(item.inbox_url);
        };
    } catch {
        // Some browsers (Safari with strict policies) throw  —  ignore.
    }
}

/**
 * Polls /app/leads/feed every 30 seconds; fires a sonner toast +
 * (when the user has granted Notification permission) a native
 * browser notification on each new lead since the previous poll.
 *
 * The "since" cursor lives in sessionStorage so closing and reopening
 * the tab won't re-toast already-seen leads. First mount initialises
 * the cursor to "now"  —  historical leads never trigger toasts.
 *
 * Polling pauses on hidden tabs so a backgrounded dashboard doesn't
 * burn HTTP for nothing.
 */
export function useLeadToasts(enabled: boolean): void {
    const isMounted = useRef(false);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        if (typeof window === 'undefined') {
            return;
        }

        isMounted.current = true;

        // Seed the cursor on first ever mount so existing leads don't
        // explode into a wall of toasts.
        if (readSince() === '') {
            writeSince(new Date().toISOString());
        }

        let timer: number | null = null;
        let aborter: AbortController | null = null;

        const poll = async () => {
            if (!isMounted.current) {
                return;
            }

            if (document.visibilityState === 'hidden') {
                return;
            }

            const since = readSince();

            try {
                aborter = new AbortController();
                const url =
                    '/app/leads/feed' +
                    (since ? `?since=${encodeURIComponent(since)}` : '');
                const res = await fetch(url, {
                    headers: { Accept: 'application/json' },
                    credentials: 'same-origin',
                    signal: aborter.signal,
                });

                if (!res.ok) {
                    return;
                }

                const json = (await res.json()) as any;
                const leads = json.data?.leads ?? [];

                if (leads.length === 0) {
                    return;
                }

                const ordered = [...leads].reverse();
                ordered.forEach((item: any) => {
                    const isHumanRequest = item.type === 'human_request';
                    
                    if (isHumanRequest) {
                        toast.info(__('Human requested!'), {
                            description: __(':agent has a visitor waiting for a human.', { agent: item.agent_name }),
                            action: {
                                label: __('Open'),
                                onClick: () => router.visit(item.inbox_url),
                            },
                        });
                    } else {
                        const headline = item.email ?? item.name ?? __('New lead');
                        toast.success(__('New lead  —  :headline', { headline }), {
                            description: __('Captured by :agent', { agent: item.agent_name }),
                            action: {
                                label: __('Open'),
                                onClick: () => router.visit(item.inbox_url),
                            },
                        });
                    }
                    fireBrowserNotification(item);
                });
                // Move the cursor to the newest lead's created_at so we
                // don't refire on the next poll.
                const newest = leads[0];

                if (newest?.created_at) {
                    writeSince(newest.created_at);
                }
            } catch {
                // Network blip / aborted on unmount  —  silent retry next tick.
            }
        };

        const start = () => {
            poll();
            timer = window.setInterval(poll, POLL_INTERVAL_MS);
        };

        const stop = () => {
            if (timer !== null) {
                window.clearInterval(timer);
                timer = null;
            }

            aborter?.abort();
        };

        const onVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                if (timer === null) {
                    start();
                }
            } else {
                stop();
            }
        };

        if (document.visibilityState === 'visible') {
            start();
        }

        document.addEventListener('visibilitychange', onVisibilityChange);

        return () => {
            isMounted.current = false;
            stop();
            document.removeEventListener(
                'visibilitychange',
                onVisibilityChange,
            );
        };
    }, [enabled]);
}

/**
 * One-off helper for the "Enable browser notifications" button. Returns
 * the resulting permission so callers can update their UI accordingly.
 */
export async function requestLeadNotificationsPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
        return 'denied';
    }

    if (
        Notification.permission === 'granted' ||
        Notification.permission === 'denied'
    ) {
        return Notification.permission;
    }

    try {
        return await Notification.requestPermission();
    } catch {
        return 'denied';
    }
}
