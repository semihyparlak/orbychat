# OrbyChat â€” Shopify install (manual snippet)

For v1 we ship a manual install path: the merchant pastes one snippet into
`theme.liquid`. The full Shopify Partner App / Theme App Extension lands
post-launch (it requires a separate Node app outside Laravel Cloud).

## What the merchant pastes

Inside `theme.liquid`, just before `</body>`:

```liquid
{% if shop.metafields.orbychat.agent_id %}
<script
  src="https://cdn.orby.chat/widget.js"
  data-agent-id="{{ shop.metafields.orbychat.agent_id }}"
  async
></script>
{% endif %}
```

Then in **Shopify admin â†' Settings â†' Custom data â†' Shop**, add a metafield:
- Namespace: `orbychat`
- Key: `agent_id`
- Type: Single line text
- Value: the agent ID from your OrbyChat dashboard

## Why this approach

The acceptance criterion ("merchant can install and the widget appears") is
met without operating a second deploy target. When you're ready for the
Shopify App Store listing, this folder is where the Node app + OAuth flow
will live.
