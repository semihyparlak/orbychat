<p>
    An agent is the embeddable unit — persona, prompt, knowledge, theme,
    rules — that runs on a customer's site. This page covers creating,
    configuring, publishing, and rolling back agents.
</p>

<h2>Create an agent</h2>

<p>
    From the customer app: <code>/app/agents</code> â†’ <strong>New agent</strong>. You'll be
    asked for a name and default language. Everything else has sensible
    defaults you can refine later.
</p>

<p>
    On signup we also auto-create a starter agent named after your domain.
    You can rename, replicate, or delete it freely.
</p>

<h2>The agent record</h2>

<p>
    Every agent has these editable fields:
</p>

<table>
    <thead>
        <tr><th>Field</th><th>What it does</th></tr>
    </thead>
    <tbody>
        <tr><td><code>name</code></td><td>Display name in the dashboard. Not shown to visitors.</td></tr>
        <tr><td><code>language_default</code></td><td>ISO code (en, es, fr, de, pt, ja, ar, zh). Used when the visitor's <code>Accept-Language</code> doesn't match a supported one.</td></tr>
        <tr><td><code>persona</code></td><td>JSON: <code>{ name, tone }</code>. Tone goes into the system prompt verbatim.</td></tr>
        <tr><td><code>theme</code></td><td>Widget colors, radius, position, launcher label.</td></tr>
        <tr><td><code>system_prompt</code></td><td>Optional override. Appended to the built-in prompt — doesn't replace the safety / RAG instructions.</td></tr>
        <tr><td><code>guardrails</code></td><td>JSON: <code>{ avoid: [topics], max_chars }</code>.</td></tr>
        <tr><td><code>starter_prompts</code></td><td>Up to 6 chips shown above the input on first open. 80 chars each.</td></tr>
        <tr><td><code>confidence_threshold</code></td><td>0–1. Below this score (after rerank) the agent says "I don't know" instead of guessing.</td></tr>
        <tr><td><code>allowed_origins</code></td><td>Strict list of <code>scheme://host</code> origins where the widget may load.</td></tr>
        <tr><td><code>auto_index_visited_pages</code></td><td>If on, pages visitors land on get queued for crawl + index.</td></tr>
    </tbody>
</table>

<h2>Confidence threshold</h2>

<p>
    The retriever scores every chunk against the visitor's question. Anything
    below <code>confidence_threshold</code> is dropped. If fewer than two
    chunks survive, the answer is flagged <code>low_confidence</code> and the
    agent answers honestly that it doesn't know — and the system queues a
    "knowledge gap" entry you can review.
</p>

<p>
    Defaults are tuned per provider:
</p>

<ul>
    <li><strong>Cloudflare bge-base-en-v1.5</strong> embeddings — default <code>0.5</code>. Cosine scores run lower than OpenAI's, so the bar is lower.</li>
    <li><strong>OpenAI text-embedding-3-small</strong> — default <code>0.78</code>. Set this on signup if you switch providers.</li>
</ul>

<h2>Draft â†’ Published</h2>

<p>
    Editing an agent never affects live visitors. The widget runtime reads
    from a snapshot called <code>agent_version</code>. Clicking
    <strong>Publish</strong> writes the current state to a new version and
    points the agent's <code>published_version_id</code> at it.
</p>

<p>
    Versions are immutable. To revert, open the agent's history and click
    <strong>Roll back</strong> on a previous version — that just updates the
    pointer. Nothing is deleted.
</p>

<h2>Embed the agent</h2>

<p>
    The agent's settings page shows a one-line install snippet with your
    <code>data-agent-id</code> baked in. The widget URL includes a
    cache-busting hash that mutates whenever the bundle is rebuilt, so
    customers don't get stuck on stale versions. See
    <a href="/documentation/embed">Install snippet</a> for details.
</p>

<h2>Multiple agents per workspace</h2>

<p>
    You can run as many agents as you want — one for marketing, one for the
    help center, one for the in-app upsell flow, etc. Each has its own
    knowledge base, persona, and embed snippet. Conversations and leads stay
    scoped to the agent that handled them.
</p>

<div class="callout callout-info">
    <svg class="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
    <div class="callout-body">
        <strong>Quota note:</strong> the monthly conversation quota is per
        workspace, not per agent. Adding agents doesn't multiply your limit —
        upgrade your plan if you need more headroom.
    </div>
</div>
