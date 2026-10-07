# OrbyChat visitor widget

Standalone Vite build that produces a single IIFE bundle uploaded to the
CDN at deploy time. The customer embeds it with:

```html
<script
    src="https://cdn.orby.chat/widget.js"
    data-agent-id="agt_..."
    async
></script>
```

## Build

```
npm run build:widget
```

Output: `public/widget/widget.js` (gzipped budget: **â‰¤ 50KB**).

## Constraints

- MUST NOT import from `resources/js/` (admin code).
- MUST NOT pull `@inertiajs/*`, shadcn/Radix, or any admin-only dep.
- React/ReactDOM are aliased to `preact/compat` in the build config.
- Lucide icons: import individually if used.

## Layout

```
resources/widget/
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ entry.tsx       â€” Vite entry; mounts to Shadow DOM
â”‚   â”œâ”€â”€ App.tsx         â€” root component
â”‚   â”œâ”€â”€ core/           â€” WS, store, API (added in WU-19)
â”‚   â”œâ”€â”€ ui/             â€” Bar, Messages, Composer, etc. (WU-19)
â”‚   â””â”€â”€ triggers/       â€” exit-intent, idle, scroll (WU-20)
â””â”€â”€ README.md
```
