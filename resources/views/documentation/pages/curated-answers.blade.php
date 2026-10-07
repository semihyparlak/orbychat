<p>
    Curated answers and CTAs are the two kinds of "deterministic" behavior the
    widget supports — they bypass the LLM in favor of exact text or
    structured calls-to-action. Use them where you can't tolerate the model
    paraphrasing or going off-script.
</p>

<h2>When to use curated answers</h2>

<p>
    Curated answers are for questions where the response has to be exact:
</p>

<ul>
    <li>Pricing — visitors want numbers, not "around $99/month".</li>
    <li>Legal / compliance — return policy, GDPR statement, contract terms.</li>
    <li>Routing — "how do I contact you?" where you want to push a specific URL.</li>
    <li>Brand-critical FAQs — your highest-stakes 5-10 questions.</li>
</ul>

<h2>Authoring</h2>

<p>
    From <code>/app/agents/{id}/curated</code>:
</p>

<ol>
    <li><strong>Trigger phrases</strong> — one per line. Substring match, case-insensitive. Add variants ("price", "pricing", "how much does it cost").</li>
    <li><strong>Answer</strong> — the exact text to stream back. Markdown is supported (bold, links, lists).</li>
    <li><strong>Citation URL</strong> — optional. If set, the message gets a citation chip linking there.</li>
    <li><strong>Priority</strong> — higher wins when multiple curated entries match the same input.</li>
</ol>

<h2>How matching works</h2>

<p>
    Before the RAG pipeline runs, the message goes through
    <code>CuratedAnswerMatcher</code>. If any trigger matches, the curated
    text is returned and we never call retrieval or the LLM. That makes
    curated answers <em>fast</em> — usually under 100ms end-to-end — and
    <em>cheap</em> (no inference cost).
</p>

<p>
    The streaming behavior matches the LLM's: tokens stream out one at a
    time over a small interval so the visitor sees the same typing
    animation. They have no way to tell a curated answer from a generated
    one.
</p>

<h2>CTAs</h2>

<p>
    A CTA is a card the visitor can click — a button, a link, or both —
    rendered inline in the chat panel. Each CTA has:
</p>

<table>
    <thead><tr><th>Field</th><th>Purpose</th></tr></thead>
    <tbody>
        <tr><td><code>title</code></td><td>One-line headline.</td></tr>
        <tr><td><code>description</code></td><td>Optional supporting text.</td></tr>
        <tr><td><code>buttons</code></td><td>1 or 2 buttons. Each has a label and an action (URL, send_message, lead_capture, dismiss).</td></tr>
        <tr><td><code>conditions</code></td><td>When to show. Same shape as behavior-rule conditions.</td></tr>
    </tbody>
</table>

<h2>Common CTA patterns</h2>

<ul>
    <li><strong>Pricing reveal</strong> — when visitor asks about cost, show a card with "Compare plans" / "Talk to sales" buttons.</li>
    <li><strong>Demo upsell</strong> — after 3 turns of product Q&amp;A, show "Book a 15-min demo".</li>
    <li><strong>Exit intent rescue</strong> — when cursor leaves toward the address bar, show "Before you go — quick question?" with a one-click lead form.</li>
    <li><strong>Scroll-deep nudge</strong> — at 80% page scroll, offer "See it in action" â†’ demo URL.</li>
</ul>

<h2>Editing</h2>

<p>
    <code>/app/agents/{id}/ctas</code> is the management page. The form is
    a structured builder — you don't need to write JSON. Save creates or
    updates a behavior rule with <code>kind=cta</code>. Disable to keep the
    rule but stop showing it.
</p>

<h2>Testing CTAs and curated answers</h2>

<p>
    The Playground (<code>/app/agents/{id}/playground</code>) is your
    sandbox. It runs the same pipeline as the live widget but with
    <code>is_playground=true</code> on the conversation, so it doesn't count
    against your monthly quota and stays out of the analytics report.
</p>

<p>
    Type a trigger phrase and confirm the curated answer fires. Type
    something close-but-not-quite and confirm it doesn't (otherwise your
    triggers are too loose).
</p>
