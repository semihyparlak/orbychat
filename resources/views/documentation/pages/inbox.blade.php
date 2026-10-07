<p>
    The Inbox is your lead-and-takeover console. <code>/app/inbox</code>
    lists every captured lead; opening one shows the full conversation
    transcript that produced it and lets you jump in as a human operator
    to continue the thread.
</p>

<h2>Layout</h2>

<p>
    <code>/app/inbox</code> shows leads on the left, sorted by recency.
    Click one and the right-hand pane shows the conversation that
    produced it: visitor messages on one side, agent replies on the
    other, human-agent messages from past takeovers in their own role
    (<code>user</code> / <code>assistant</code> / <code>human-agent</code>).
</p>

<p>
    The conversations index at <code>/app/conversations</code> covers
    every conversation regardless of whether it produced a lead — useful
    for spelunking past sessions that didn't convert. From there you can
    open a conversation and use the same takeover controls.
</p>

<h2>Live updates</h2>

<p>
    Every open conversation subscribes to its private Reverb channel
    (<code>conversation.{id}</code>) for real-time updates. New messages
    appear without polling; the takeover state propagates to both the
    visitor's widget and any other operator looking at the same thread.
</p>

<h2>Taking over</h2>

<p>
    Click <strong>Take over</strong>. A few things happen:
</p>

<ol>
    <li>The conversation gets <code>claimed_by_user_id</code> + <code>claimed_at</code> set to you (route: <code>POST /app/conversations/{conversation}/claim</code>).</li>
    <li>A <code>conversation.claimed</code> Reverb event fires on the conversation's private channel — the visitor's widget shows "Human is here" in the chat header.</li>
    <li>The AI is paused. Every visitor message routes to the inbox; every reply you type streams to the visitor as a <code>human-agent</code> role message via <code>POST /app/conversations/{conversation}/reply</code>.</li>
</ol>

<h2>Releasing</h2>

<p>
    Click <strong>Hand back to bot</strong> to release (route:
    <code>POST /app/conversations/{conversation}/release</code>). The next
    visitor message goes through the RAG pipeline again. The visitor's
    chat header flips back to the agent's persona. Useful when:
</p>

<ul>
    <li>You answered the off-script question and the rest is back to FAQ territory.</li>
    <li>The visitor is satisfied and likely to leave.</li>
    <li>You're ending your shift — handing back keeps coverage 24/7.</li>
</ul>

<h2>Capturing leads</h2>

<p>
    Leads come in two ways:
</p>

<ul>
    <li><strong>Visitor-driven</strong> — the widget's inline lead form, fired by a behavior rule or by the visitor explicitly asking to be contacted. Submitted leads land in <code>/app/inbox</code>.</li>
    <li><strong>Webhook-driven</strong> — every captured lead fires the <code>lead.captured</code> outgoing webhook so you can fan it into your CRM. See <a href="/documentation/webhooks">Outgoing webhooks</a>.</li>
</ul>

<h2>Live in-app toasts</h2>

<p>
    The admin shell polls <code>GET /app/leads/feed</code> every 30
    seconds for newly captured leads in the workspace and surfaces each
    one as a sonner toast in the bottom-right of every page in the
    admin SPA. Click the toast to jump straight to the inbox row.
</p>

<p>
    The bell button in the top header asks the browser for native
    notification permission. Once granted, every new lead also fires
    an OS-level notification so workspace members get pinged on tabs
    that aren't focused. Permission is per-domain — denying it once
    can only be reversed from your browser's settings.
</p>

<p>
    Polling pauses on hidden tabs to keep idle dashboards from burning
    HTTP. The cursor lives in <code>sessionStorage</code> so opening a
    second tab doesn't double-toast already-seen leads.
</p>

<h2>Email notifications</h2>

<p>
    Every captured lead fans out to every workspace owner and admin
    over email. The notification (<code>App\Notifications\NewLeadCaptured</code>)
    is queued — the visitor's HTTP request never waits on SMTP, so a
    slow mailer cannot slow lead capture or chat.
</p>

<p>
    Two requirements for the email to actually arrive:
</p>

<ol>
    <li>
        A queue worker is running. In production we use the
        <code>database</code> driver — make sure
        <code>php artisan queue:work --queue=default</code> runs on a
        process supervisor (the in-cluster worker takes care of this on
        Laravel Cloud). Without it, queued notifications pile up in
        <code>jobs</code> and never send.
    </li>
    <li>
        <code>MAIL_MAILER</code> + matching credentials are configured
        in <code>.env</code>. The default is <code>log</code> — fine for
        dev but no actual email is sent. Switch to <code>smtp</code> /
        <code>resend</code> / <code>postmark</code> in production and
        verify with <code>php artisan tinker --execute 'Mail::raw("ping",fn($m)=>$m-&gt;to("you@example.com")-&gt;subject("test"));'</code>.
    </li>
</ol>

<p>
    Recipients are filtered down to <code>workspace_users.role IN
    ('owner', 'admin')</code> with <code>accepted_at IS NOT NULL</code>.
    Pending invites and viewers do not receive lead emails. The footer
    of the email reflects your white-labelled site title (set in
    Settings â†’ System).
</p>

<h2>Audit log</h2>

<p>
    Privileged actions on conversations (claim, release) write rows to
    the <code>audit_logs</code> table for forensic traceability. There's
    no UI page for browsing them in v1; query the table directly when
    you need to investigate.
</p>
