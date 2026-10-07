import type { AgentConfig } from './api';

/**
 * Capabilities the widget bundle has a renderer for. Phase 3 grew this
 * list as renderers landed; Phase 1 shipped an empty set + a returns-
 * false stub. As more renderers land we add their capability slug here.
 */
const RENDERABLE = new Set<string>(['ticket_escalation']);

/**
 * True when (a) the bundle has a renderer for `capability` AND (b) the
 * agent's server-resolved capabilities array opts in. Server is always
 * the authority — the widget never enables a capability the server
 * didn't declare.
 */
export function canRender(
    capability: string,
    agent: AgentConfig | null,
): boolean {
    if (!RENDERABLE.has(capability)) {
        return false;
    }

    const list = agent?.capabilities ?? [];

    return list.includes(capability);
}

/**
 * Always-safe accessor for the vertical id, with `'generic'` fallback.
 * Used for telemetry tagging so dashboards can segment by vertical
 * even when the agent has no explicit site_type.
 */
export function siteType(agent: AgentConfig | null): string {
    return agent?.site_type ?? 'generic';
}
