import type { WidgetApi } from '../core/api';
import type { CtaPayload } from '../core/store';
import { store } from '../core/store';

type Props = {
    cta: CtaPayload;
    api: WidgetApi;
    jwt: string;
    accent: string;
};

export function CtaCard({ cta, api, jwt, accent }: Props) {
    const click = () => {
        // Log the click via /events
        api.logEvents(jwt, [
            {
                kind: 'cta.clicked',
                payload: { label: cta.label, kind: cta.kind, url: cta.url },
            },
        ]).catch(() => {
            // best-effort logging
        });

        if (cta.url) {
            window.open(cta.url, '_blank', 'noopener,noreferrer');
        } else if (
            cta.kind === 'capture_email' ||
            cta.kind === 'demo' ||
            cta.kind === 'signup'
        ) {
            store.set({ leadFormOpen: true });
        }

        store.set({ activeCta: null });
    };

    return (
        <div
            style={{
                margin: '4px 16px 8px',
                padding: 12,
                border: `1px solid ${accent}33`,
                borderRadius: 12,
                background: `${accent}0a`,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
            }}
        >
            <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>
                {cta.label}
            </p>
            <button
                type="button"
                onClick={click}
                style={{
                    background: accent,
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 12px',
                    fontSize: 13,
                    cursor: 'pointer',
                    alignSelf: 'flex-start',
                }}
            >
                Continue â†’
            </button>
        </div>
    );
}
