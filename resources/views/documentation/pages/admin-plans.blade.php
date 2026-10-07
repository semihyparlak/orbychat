<p>
    Plans are the only piece of customer-facing data that admins create
    directly. The Plan CRUD page (<code>/admin/plans</code>) is paired with
    Stripe so you never touch the Stripe dashboard to provision Products
    and Prices — every save here syncs to Stripe automatically.
</p>

<h2>The plans table</h2>

<p>
    <code>/admin/plans</code> lists every plan with its core attributes,
    the workspace count using it, and a sync status pill (green = in sync
    with Stripe, amber = pending, gray = local-only / free).
</p>

<table>
    <thead><tr><th>Column</th><th>Notes</th></tr></thead>
    <tbody>
        <tr><td>Name</td><td>Display name. Editable.</td></tr>
        <tr><td>Slug</td><td>Stable identifier. <strong>Locked after creation</strong> — workspaces.plan_id resolves by slug indirectly through the Plan table, and changing it would break invoices.</td></tr>
        <tr><td>Monthly conversations</td><td>Quota.</td></tr>
        <tr><td>Price</td><td>Monthly price. Changing it archives the old Stripe Price + creates a new one.</td></tr>
        <tr><td>Workspaces</td><td>How many workspaces are on this plan today.</td></tr>
        <tr><td>Stripe IDs</td><td>Product + Price IDs after sync. Free / custom plans show "—".</td></tr>
        <tr><td>Active</td><td>Toggle. Inactive plans aren't selectable on the customer side.</td></tr>
    </tbody>
</table>

<h2>Creating a plan</h2>

<p>
    <strong>New plan</strong> opens the form. Fields:
</p>

<ul>
    <li><strong>Name</strong> — required.</li>
    <li><strong>Monthly conversations</strong> — required. <code>0</code> = unlimited.</li>
    <li><strong>Price (cents)</strong> — required. <code>0</code> = free / custom (skips Stripe).</li>
    <li><strong>Features</strong> — toggles: <code>remove_branding</code> (and future flags).</li>
    <li><strong>Active</strong> — defaults to true.</li>
</ul>

<p>
    On save, the server creates the local row, then triggers
    <code>StripeProductSync::syncPlan()</code>. If the price is &gt; 0, a
    Stripe Product + Price are created and their IDs saved on the plan row.
    If Stripe is unreachable or misconfigured, the local row is kept and a
    flash error explains the failure — you can retry the sync without
    re-saving the form.
</p>

<h2>The Sync button</h2>

<p>
    Each row has a <strong>Sync</strong> action that fires
    <code>StripeProductSync::syncPlan()</code> directly. Returns JSON with
    the result so the UI can show "Synced" / error inline without a page
    reload. Useful when:
</p>

<ul>
    <li>You changed the Stripe key and want to re-bind everything.</li>
    <li>A previous sync failed and you've fixed the underlying issue.</li>
    <li>You want to verify a plan's Stripe state without touching the form.</li>
</ul>

<h2>Editing</h2>

<p>
    Edits behave intuitively except for two subtleties:
</p>

<ul>
    <li><strong>Price changes rotate the Stripe Price.</strong> Stripe Prices are immutable, so we archive the old and create a new one. <em>Existing subscriptions stay on the old Price</em> (grandfathered); only new subscriptions use the new one.</li>
    <li><strong>Slug is locked.</strong> The form input is disabled in edit mode.</li>
</ul>

<h2>Deleting</h2>

<p>
    Plans are <strong>never destructively deleted</strong>. The
    <code>destroy</code> action soft-deletes (<code>is_active = false</code>)
    and archives the Stripe Product. Reasons:
</p>

<ul>
    <li><code>workspaces.plan_id</code> is a real foreign key — deleting would orphan or cascade.</li>
    <li>Historical invoices reference the plan; we need to be able to look it up forever.</li>
    <li>Subscriptions in flight need a stable plan to attach to.</li>
</ul>

<p>
    Reactivating a soft-deleted plan: edit it and toggle Active back on.
    The Stripe Product is unarchived and the plan is selectable again.
</p>

<h2>Free / custom plans</h2>

<p>
    Plans with <code>price_cents = 0</code> never sync to Stripe. They live
    only in OrbyChat — useful for the default Free plan and for hand-rolled
    enterprise deals where you want the quota and feature flags but invoice
    out-of-band.
</p>

<h2>Currency</h2>

<p>
    Set globally via <code>CASHIER_CURRENCY</code> in the environment.
    Defaults to USD. Changing the currency mid-flight on a deployment with
    existing Prices is a manual migration — you'd archive every Stripe
    Price, change the env var, then sync each plan to mint new Prices in
    the new currency.
</p>
