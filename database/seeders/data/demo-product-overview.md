# OrbyChat â€” Self-hosted SaaS Sales AI Widget for Any Website

## Product Identity

- **Item title:** OrbyChat â€” Self-hosted SaaS Sales AI Widget for Any Website
- **Author:** thecodestudio
- **CodeCanyon URL:** https://codecanyon.net/item/orbychat-selfhosted-saas-sales-ai-widget-for-any-website/63254777
- **Tags:** AI Chat Widget, AI chatbot, AI sales assistant, conversational AI, customer support widget, helpdesk, knowledge base, Laravel SaaS, lead capture, live chat, multi-tenant SaaS, RAG chatbot, React Inertia, sales automation, Stripe subscription

## Pricing

- **Regular License â€” $34** â€” single end product, end users are not charged. Install OrbyChat on your own infrastructure for your own use. Run it for your team, your portfolio sites, or one client.
- **Extended License â€” $325** â€” single end product, end users can be charged. Run OrbyChat as a paid service for unlimited end-customers. White-label the marketing site, set your own pricing, keep all the revenue.
- **Support â€” 6 months** included from thecodestudio. Extendable to 12 months for $10.88.

## Item Details

- **Last update:** 8 May 2026
- **Created:** 8 May 2026
- **High Resolution:** Yes
- **Compatible browsers:** IE11, Firefox, Safari, Opera, Chrome, Edge
- **Files included:** JavaScript JS, JavaScript JSON, HTML, XML, CSS, PHP
- **Software framework:** Laravel
- **Software version:** PHP 8.x, MySQL 8.x

## Live demo

- Marketing & widget demo: https://orby.chat
- Customer dashboard demo: https://orby.chat/login â€” Email customer@mail.com / Password password
- Platform admin demo: https://orby.chat/admin â€” Email admin@mail.com / Password password
- Documentation: https://orby.chat/documentation

## Headline

OrbyChat is a complete, multi-tenant SaaS platform you can install on your own server. Every visitor on your site â€” or your client's site â€” gets a sub-second AI sales assistant that learns from your own pages, captures leads, and hands off to a human in real time.

One `<script>` tag drops the widget on any website â€” WordPress, Shopify, Next.js, React, Vue, plain HTML, anywhere. The whole stack â€” agents, knowledge base, inbox, billing, documentation â€” ships in one Laravel + React application. Run it for yourself, for ten clients, or for a thousand subscribers.

**One purchase. Unlimited workspaces. Your data, your infrastructure, your AI.**

## Run your own SaaS â€” out of the box

OrbyChat is not a chat plugin. It is a complete SaaS-in-a-box. Install it once, hand customers a sign-up link, and you are running an AI sales-widget business under your own brand.

You keep 100% of the subscription revenue minus Stripe's processing fee. No per-tenant fees, no per-conversation tax, no usage-based reseller cost. One Envato license, unlimited workspaces, unlimited end-customers.

What is wired for SaaS operation:

- Multi-tenant from the database up â€” every workspace is fully isolated by a global query scope, regression-tested.
- Self-serve sign-up â€” visitors register, pick a plan, pay through Stripe Checkout, deploy their widget â€” all without you touching a thing.
- Stripe-synced plans â€” define plans inside OrbyChat's admin console; Stripe Products and Prices are created automatically.
- Metered billing â€” each plan has a monthly conversation quota. Over-quota workspaces get a 429 + friendly upgrade prompt.
- Customer Portal â€” Stripe's hosted portal handles cancellations, card updates, invoice downloads.
- Per-plan feature flags â€” branding removal, custom widget domain, higher rate limits, integration access.
- Workspace roles & team invitations â€” Owner / Admin / Editor / Viewer with granular permissions. 7-day invite tokens. Owner transfer with confirmation.
- Platform admin console at /admin â€” manage plans, watch every workspace's usage, retry failed jobs, impersonate any user for support, monitor site health across seven automated checks.
- Audit log â€” every privileged action (plan change, role change, ownership transfer, impersonation) is recorded for compliance.
- Quota enforcement on the hot path â€” gate happens at /api/v1/widget/init, never mid-conversation.

## Two licenses, two business models

- **Regular License** â€” install OrbyChat on your own infrastructure for your own use. Run it for your team, your portfolio sites, or one client.
- **Extended License** â€” run it as a paid service for unlimited end-customers. White-label the marketing site, set your own pricing, keep all the revenue.

The financial model in plain numbers: set up three plans (Free / Pro / Enterprise) at $0 / $49 / $249. Acquire 100 paying customers averaging the Pro tier â€” that is roughly $4,900/month recurring. OrbyChat's external infrastructure cost on Cloudflare's "one-bill" mode is around $5/month plus per-request usage.

## Core features

### AI agents grounded in your knowledge

- Build unlimited AI agents per workspace, each with its own persona, theme, system prompt, behaviour rules, and knowledge base.
- Crawl URLs, sitemaps, RSS feeds, paste text, or sync from Notion / Google Docs via OAuth.
- Auto-index every page a visitor lands on, with safety guards â€” never indexes /admin, /login, /checkout, internal IPs, etc.
- Two-stage retrieval: ANN recall plus cross-encoder rerank for precision.
- Versioned publishing â€” every Publish creates an immutable snapshot. Roll back to any prior version with one click.

### Drop-in widget for any website

- One `<script>` tag, no other setup required.
- Under 50 KB gzipped â€” fast load, no Lighthouse score impact.
- Renders inside a Shadow DOM.
- Works on WordPress, Shopify, Next.js, React, Vue, Angular, Astro, plain HTML â€” any framework.
- Persistent visitor sessions across page loads (24-hour resume window).
- Visitors get streamed answers token-by-token over Server-Sent Events with real-time citations.
- Built-in voice microphone â€” visitors can dictate questions in any of 8 supported languages.
- Strict origin allow-list â€” the widget refuses to load on unauthorised domains.

### Real-time inbox + human takeover

- Operator inbox shows captured leads and active conversations live, powered by Laravel Reverb (WebSocket).
- One-click Take over on any thread â€” the AI pauses, the visitor sees a "Human is here" badge.
- Hand back to the bot when you are done â€” seamless transition.
- Full conversation transcript attached to every lead automatically.

### Lead capture & intent detection

- Inline lead form fires when the visitor shows real intent â€” asks about pricing, asks for a demo, hits the Nth message turn.
- Configurable form fields per agent: name, email, phone, custom fields.
- Captured leads land in the inbox immediately and fire HMAC-signed outgoing webhooks for CRM integration.
- Dedup on (agent, email) so the same person filling out twice does not create two rows.

### Customisation that does not need code

- Persona, tone, system prompt â€” all editable from the dashboard.
- Theme: primary colour, accent colour, corner radius, launcher position, custom launcher label.
- Live preview of the visitor-facing widget while you edit.
- Up to six starter prompts shown as chips above the input on first open.
- Eight languages out of the box: English, Spanish, French, German, Portuguese, Japanese, Arabic, Chinese â€” auto-detected.
- Behaviour rules: scroll-depth, idle, exit-intent, intent-keyword triggers.
- Curated answers for pricing or refunds â€” short-circuit the LLM with hand-written replies.
- CTA cards that pop into the chat with clickable buttons (open URL, send message, capture lead, dismiss).

### Analytics & knowledge gaps

- Dashboard with conversation volume, deflection rate, lead conversion, average response latency.
- Knowledge gap detection â€” clusters questions visitors asked that the agent could not answer.
- Per-source citation effectiveness â€” see which knowledge sources actually drive answers.
- CSV export for everything.

### Multi-tenant workspace model

- Each workspace is fully isolated â€” agents, conversations, leads, sources, analytics never cross the boundary.
- Four workspace roles: Owner, Admin, Editor, Viewer.
- Email invitations with 7-day expiry.
- Owner transfer with two-step confirmation.
- Workspace switcher in the sidebar for users who belong to multiple.

### Subscription billing â€” Stripe synced

- Platform admins create plans in OrbyChat â€” Stripe Products and Prices are created automatically.
- Price changes archive the old Stripe Price and create a new one (no breaking existing subscriptions).
- Customer portal access for cancellations, card updates, invoice history.
- Metered enforcement â€” workspaces blocked from starting new conversations once the monthly quota is reached.
- Branding-removal feature flag per plan.
- 30-day money-back guarantee shipped as a configurable copy block.

### Platform admin console

- Operator-only surface at /admin â€” gated by a super-admin role flag.
- Workspace browser, user list, agent list, conversation log across all tenants.
- Plan CRUD with one-click Stripe sync per row.
- Subscription overview with revenue context.
- Usage metering: month-over-month conversation count by workspace.
- Site Health pill with seven automated checks (failed jobs, Stripe, LLM provider, vector store, mail, Reverb, cache).
- Failed-job inspector with retry / forget / retry-all controls.
- Impersonate any user with a banner for support, without asking for passwords.
- Global search across workspaces, users, agents, conversations, leads.

### Integrations

- **Notion** â€” OAuth, ingest pages or databases as knowledge sources.
- **Google Docs** â€” OAuth, ingest documents from Drive.
- **Slack** â€” outgoing notifications for leads, low-confidence escalations, and routed conversations.
- **Stripe** â€” Cashier-backed subscription billing with auto-synced Products and Prices.
- **Outgoing webhooks** â€” HMAC-signed POSTs for every captured lead. Use as a Zapier catch-hook to fan into HubSpot, Salesforce, Mailchimp, Pipedrive, etc.

### Built-in documentation site

- Mintlify-style reference shipped at /documentation â€” 25+ pages covering every feature, the widget API, architecture, security, deployment.
- Light and dark themes, on-page table of contents, search, code-copy buttons.
- Operators can rebrand it via the admin settings and ship docs under their own domain.

## Tech stack

- **Backend:** Laravel 13 (PHP 8.3+), Octane on FrankenPHP, Reverb (WebSocket), Horizon (queue), Cashier (Stripe), Fortify (auth), Sanctum (API tokens).
- **Database:** MySQL 8 / Postgres 16 (both supported).
- **Cache / queue / sessions:** Redis 7.
- **Frontend admin:** Inertia v3, React 19, TypeScript (strict mode), Tailwind v4, shadcn/ui (Radix primitives), Wayfinder for typed routes.
- **Visitor widget:** Preact 10 + Vite, isolated build, â‰¤ 50 KB gzipped, Shadow DOM rendered.
- **AI providers (preferred):** Cloudflare Workers AI (Llama 3.x chat + bge-base embeddings), Cloudflare Vectorize (vector store), Cloudflare Browser Rendering (crawler).
- **AI providers (fallback):** OpenAI gpt-4o-mini + text-embedding-3-small, OpenRouter, Qdrant, Browserless.
- **Object storage:** S3-compatible (Cloudflare R2 by default).
- **Tests:** Pest 4 â€” 565 feature + unit tests.
- **Observability:** Sentry, OpenTelemetry traces.

## Server requirements

- PHP 8.3 or newer (8.4 supported).
- MySQL 8+ or Postgres 16+.
- Redis 7+ (cache, queue, sessions).
- Composer 2.x and Node.js 20+ (for build).
- A web server able to serve a Laravel application (Nginx, Apache, FrankenPHP, or any managed Laravel host).
- An LLM provider key â€” Cloudflare Workers AI (cheapest), OpenAI, or OpenRouter.
- A vector store â€” Cloudflare Vectorize (recommended) or self-hosted Qdrant.
- Stripe account (if billing customers).
- SMTP / Postmark / Resend / Mailgun / SES for transactional email.
- Optional: Cloudflare account for Browser Rendering (best crawl quality on JS-heavy sites).
- Total external infrastructure cost on Cloudflare's "one-bill" mode: starting at ~$5/month on a small VPS.

## Security & privacy

- Strict origin enforcement on the public widget â€” empty allow-list means deny everywhere.
- Prompt-injection defence â€” retrieved content wrapped in `<source>` tags, regression-tested.
- SSRF protection â€” crawler refuses to fetch private IP ranges, loopback, link-local, and cloud metadata endpoints.
- Encrypted at rest â€” OAuth tokens, Stripe secrets, mail passwords, custom LLM keys all use Laravel's encrypted casts.
- Rate limiting on every public endpoint â€” per-IP for init, per-JWT for messages and leads.
- Stripe webhook signature verification, HMAC-signed outgoing webhooks, CSRF on every authenticated form.
- Two-factor authentication via TOTP, recovery codes, all standard Fortify auth flows included.
- Audit log for every privileged action.

## Multi-language support

The widget auto-detects the visitor's preferred language from their browser. Supported languages:

- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Portuguese (pt)
- Japanese (ja)
- Arabic (ar) â€” RTL supported
- Chinese (zh)

## Roadmap (upcoming)

- Native HubSpot, Salesforce, Pipedrive, Mailchimp integrations.
- Calendly / Cal.com inline booking from a CTA card.
- Email nurture sequences after lead capture.
- Inbox internal notes, canned replies, SLA timers.
- Per-language knowledge bases.
- Native iOS + Android operator apps.

All buyers within the major version get every release for free.
