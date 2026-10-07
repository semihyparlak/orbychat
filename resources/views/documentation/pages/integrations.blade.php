<p>
    Integrations let your agent learn from data living outside the
    OrbyChat database (Notion, Google Docs) and let leads flow into your
    existing systems (CRMs, Slack, webhooks). Open
    <code>/app/integrations</code> to manage them.
</p>

<h2>Notion</h2>

<p>
    Connect once via OAuth. OrbyChat requests read access to the workspaces
    you select during the OAuth flow — we never get global access. After
    connecting:
</p>

<ul>
    <li>The <strong>Add source</strong> modal exposes a Notion picker (page or database).</li>
    <li>Each picked page becomes a Notion source and is ingested via <code>IngestNotionPageJob</code>.</li>
    <li>Re-syncs are manual (per-source <strong>Reindex</strong>) — we don't poll Notion on a schedule.</li>
    <li>The OAuth token is encrypted at rest using Laravel's <code>encrypted</code> cast.</li>
</ul>

<h2>Google Docs</h2>

<p>
    Same shape as Notion. OAuth-once, pick docs from a Drive picker, ingest
    via <code>IngestGoogleDocJob</code>, manual re-sync per source. Tokens
    encrypted at rest. Disconnect at any time — disconnecting revokes our
    access immediately and prevents further syncs.
</p>

<h2>Slack</h2>

<p>
    Slack is for outgoing notifications:
</p>

<ul>
    <li>New leads — posts to a configurable channel.</li>
    <li>Routed conversations — pings when the inbox needs a human.</li>
    <li>Daily digest — opt-in summary of conversation volume + new gaps.</li>
</ul>

<p>
    Connect via OAuth, pick the channel, save. The bot posts under the
    integration's name, never as a user.
</p>

<h2>Webhooks (outgoing)</h2>

<p>
    OrbyChat can POST to your endpoint when events happen. Configure under
    <code>/app/integrations/webhooks</code>. Events available:
</p>

<table>
    <thead><tr><th>Event</th><th>Fires when</th></tr></thead>
    <tbody>
        <tr><td><code>conversation.started</code></td><td>A visitor opens a new conversation.</td></tr>
        <tr><td><code>conversation.message</code></td><td>A new turn is added (visitor or agent).</td></tr>
        <tr><td><code>conversation.routed</code></td><td>A behavior rule routed the thread to a human.</td></tr>
        <tr><td><code>lead.created</code></td><td>The lead form was submitted.</td></tr>
        <tr><td><code>lead.updated</code></td><td>An operator added/edited fields on a lead.</td></tr>
    </tbody>
</table>

<p>
    Each webhook has a signing secret. OrbyChat HMACs the body with that
    secret and sends the digest in the <code>X-OrbyChat-Signature</code>
    header — verify it on receipt. Retries: up to 5 with exponential backoff
    on non-2xx responses.
</p>

<p>
    See <a href="/documentation/webhooks">Outgoing webhooks</a> for the
    payload shapes.
</p>

<h2>HubSpot / Salesforce / Zapier</h2>

<p>
    The webhooks above are the universal escape hatch — they work with
    anything that can receive HTTP POSTs. Native HubSpot and Salesforce
    integrations are on the roadmap; in the meantime, point a webhook at a
    Zapier catch-hook and let Zapier route to your CRM.
</p>

<h2>Disconnecting</h2>

<p>
    Each integration's row has a <strong>Disconnect</strong> button. We:
</p>

<ul>
    <li>Revoke our OAuth token with the upstream provider (Notion / Google).</li>
    <li>Mark the local <code>integration_connection</code> row as inactive.</li>
    <li>Stop syncing — sources backed by the integration enter an "orphaned" state and stop refreshing, but their already-indexed content stays usable.</li>
</ul>

<p>
    Reconnecting re-runs the OAuth flow and re-binds the existing sources.
    No data is lost.
</p>

<h2>Permissions</h2>

<p>
    Connecting an integration requires the <code>integrations.manage</code>
    permission, which is granted to Owners and Admins. Members can see
    which integrations are connected but can't change them.
</p>
