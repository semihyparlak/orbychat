import { h, render } from 'preact';
import { App } from './App';

declare global {
    interface Window {
        OrbyChat?: {
            mount: (host?: HTMLElement) => void;
        };
    }
}

const SCRIPT_TAG_ATTR = 'data-agent-id';
const DEMO_ATTR = 'data-demo';

/**
 * Capture EVERYTHING we need from <script> at module-load time, while
 * `document.currentScript` is still valid. After the synchronous body
 * finishes (i.e., the moment we register a DOMContentLoaded listener
 * or hand control to the browser), `currentScript` becomes null —
 * critically with `async` / `defer`, by the time bootstrap() actually
 * runs there's no way to find our own script tag again.
 *
 * Two things must come from the script tag, NOT from anything else:
 *   1. data-agent-id — which agent to talk to
 *   2. the script src's origin — where the OrbyChat API lives
 *
 * Falling back to window.location.origin for #2 is dangerous: that's
 * the visitor's e-commerce site, not us. POSTs to /api/v1/widget/init
 * would hit their server and 405 / 404 / blow up Symfony / etc.
 */
type Captured = { agentId: string | null; baseUrl: string; demo: boolean };

function captureFromScript(): Captured {
    const current = document.currentScript as HTMLScriptElement | null;

    let agentId = current?.getAttribute(SCRIPT_TAG_ATTR) ?? null;
    let src = current?.src ?? null;
    let demoAttr = current?.getAttribute(DEMO_ATTR) ?? null;

    if (!agentId || !src || demoAttr === null) {
        // Fallback: scan every <script src ... data-agent-id> in the DOM.
        // Use the LAST one — that's almost always the most recently added,
        // i.e., ours.
        const scripts = document.querySelectorAll<HTMLScriptElement>(
            `script[${SCRIPT_TAG_ATTR}]`,
        );

        for (let i = scripts.length - 1; i >= 0; i--) {
            const candidate = scripts[i];
            agentId ||= candidate.getAttribute(SCRIPT_TAG_ATTR);
            src ||= candidate.src;
            demoAttr = demoAttr ?? candidate.getAttribute(DEMO_ATTR) ?? null;

            if (agentId && src && demoAttr !== null) {
                break;
            }
        }
    }

    let baseUrl = window.location.origin;

    if (src) {
        try {
            const u = new URL(src);
            baseUrl = `${u.protocol}//${u.host}`;
        } catch {
            // malformed src — keep the fallback
        }
    }

    // Treat the attr as truthy for any non-"false" value so both
    // `data-demo` (no value) and `data-demo="true"` enable the badge.
    const demo = demoAttr !== null && demoAttr.toLowerCase() !== 'false';

    return { agentId, baseUrl, demo };
}

const CAPTURED = captureFromScript();

function bootstrap(host?: HTMLElement) {
    const target = host ?? document.body;
    const container = document.createElement('div');
    container.id = 'orbychat-root';
    target.appendChild(container);

    const shadow = container.attachShadow({ mode: 'open' });
    const mountPoint = document.createElement('div');
    shadow.appendChild(mountPoint);

    render(
        h(App, {
            agentId: CAPTURED.agentId,
            baseUrl: CAPTURED.baseUrl,
            demo: CAPTURED.demo,
        }),
        mountPoint,
    );
}

window.OrbyChat = { mount: bootstrap };

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => bootstrap());
} else {
    bootstrap();
}
