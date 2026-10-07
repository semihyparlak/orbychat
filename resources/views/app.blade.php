@php
    $sharedBranding = data_get($page ?? [], 'props.branding', []);
    $siteTitle = data_get($sharedBranding, 'site_title', config('branding.site_title', config('app.name', 'OrbyChat')));
    $customFavicon = data_get($sharedBranding, 'favicon_url');
    $initialFavicon = $customFavicon ?: asset('favicon.ico');
    $initialTouchIcon = $customFavicon ?: asset('apple-touch-icon.png');

    // SEO payload — per-page seo[] from the controller, or a sane
    // fallback so every render gets <meta description> + canonical
    // + Open Graph + Twitter Card + JSON-LD even when a page didn't
    // declare its own. Pure-PHP, hot-path safe.
    $seo = data_get($page ?? [], 'props.seo')
        ?: \App\Support\SeoMeta::defaults();
    $seoTitle = (string) ($seo['title'] ?? $siteTitle);
    $seoDescription = (string) ($seo['description'] ?? '');
    $seoCanonical = (string) ($seo['canonical'] ?? '');
    $seoSiteName = (string) ($seo['site_name'] ?? $siteTitle);
    $seoImage = $seo['image_url'] ?? null;
    $seoTwitterCard = (string) ($seo['twitter_card'] ?? 'summary_large_image');
    $seoTwitterHandle = $seo['twitter_handle'] ?? null;
    $seoNoindex = (bool) ($seo['noindex'] ?? false);
    $seoJsonLd = (array) ($seo['json_ld'] ?? []);
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="application-name" content="{{ $siteTitle }}">

        {{-- SEO --}}
        @if($seoDescription !== '')
            <meta name="description" content="{{ $seoDescription }}">
        @endif
        @if($seoCanonical !== '')
            <link rel="canonical" href="{{ $seoCanonical }}">
        @endif
        @if($seoNoindex)
            <meta name="robots" content="noindex,nofollow">
        @endif

        {{-- Open Graph --}}
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="{{ $seoSiteName }}">
        <meta property="og:title" content="{{ $seoTitle }}">
        @if($seoDescription !== '')
            <meta property="og:description" content="{{ $seoDescription }}">
        @endif
        @if($seoCanonical !== '')
            <meta property="og:url" content="{{ $seoCanonical }}">
        @endif
        @if($seoImage)
            <meta property="og:image" content="{{ $seoImage }}">
            <meta property="og:image:width" content="1200">
            <meta property="og:image:height" content="630">
            <meta property="og:image:alt" content="{{ $seoSiteName }}">
        @endif

        {{-- Twitter Card --}}
        <meta name="twitter:card" content="{{ $seoTwitterCard }}">
        <meta name="twitter:title" content="{{ $seoTitle }}">
        @if($seoDescription !== '')
            <meta name="twitter:description" content="{{ $seoDescription }}">
        @endif
        @if($seoImage)
            <meta name="twitter:image" content="{{ $seoImage }}">
        @endif
        @if($seoTwitterHandle)
            <meta name="twitter:site" content="{{ $seoTwitterHandle }}">
        @endif

        {{-- JSON-LD structured data — Organization on every page,
             plus per-route blocks (SoftwareApplication on home,
             FAQPage from buyer-edited content, BreadcrumbList on
             docs). --}}
        @foreach($seoJsonLd as $jsonLdBlock)
            <script type="application/ld+json">{!! json_encode($jsonLdBlock, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}</script>
        @endforeach

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <script>
            window.__PITCHBAR_SITE_TITLE__ = @json($siteTitle);
            window.__PITCHBAR_DEFAULT_FAVICON_URL__ = @json($initialFavicon);
            window.__PITCHBAR_DEFAULT_TOUCH_ICON_URL__ = @json($initialTouchIcon);

            /**
             * Critical fix for "ReferenceError: __ is not defined" (#112).
             * Defines a temporary identity function so module-level __() calls 
             * in JS chunks don't crash the app before the bundle initializes.
             */
            window.__ = window.__ || function(key, replacements) {
                let translation = key;
                if (replacements) {
                    Object.keys(replacements).forEach(r => {
                        translation = translation.replace(new RegExp(':' + r, 'g'), replacements[r]);
                    });
                }
                return translation;
            };
        </script>

        <link id="app-favicon" rel="icon" href="{{ $initialFavicon }}" sizes="any">
        <link id="app-apple-touch-icon" rel="apple-touch-icon" href="{{ $initialTouchIcon }}">

        {{-- Geist (Vercel's typeface) served via Bunny Fonts — applies to
             admin + customer + auth + marketing because this is the only
             root blade template. --}}
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link
            href="https://fonts.bunny.net/css?family=geist:100,200,300,400,500,600,700,800,900|geist-mono:400,500,600&display=swap"
            rel="stylesheet"
        >

        @fonts
        @viteReactRefresh
        @php
            $pageComponent = "resources/js/pages/{$page['component']}.tsx";
            $viteInputs = ['resources/css/app.css', 'resources/js/app.tsx'];
            try {
                if (\Illuminate\Support\Facades\Vite::isRunningHot() || \Illuminate\Support\Facades\File::exists(public_path('build/manifest.json'))) {
                    $manifest = json_decode(@file_get_contents(public_path('build/manifest.json')) ?: '{}', true);
                    if (isset($manifest[$pageComponent])) {
                        $viteInputs[] = $pageComponent;
                    }
                }
            } catch (\Throwable) {}
        @endphp
        @vite($viteInputs)
        <x-inertia::head>
            <title>{{ $seoTitle }}</title>
        </x-inertia::head>

        @if($page['component'] === 'welcome' || str_starts_with((string) $page['component'], 'marketing/'))
            <script src="https://orby.chat/widget/widget.js?v=87a0c141" data-agent-id="019e2654-ff7a-72fc-9999-caa8f92e847b" async></script>
        @endif
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />

        @php
            $component = $page['component'] ?? null;
            $isMarketingComponent = $component === 'welcome' || str_starts_with((string) $component, 'marketing/');
            // Auth check is the safety net — even if a future page is
            // mis-categorised as "marketing", the demo widget never
            // mounts for authed admin / customer surfaces. A signed-in
            // workspace owner sitting on /dashboard should never see
            // their own marketing site's demo bot watching them.
            $isAuthenticated = auth()->check();
            $marketingDemoAgentId = $isMarketingComponent
                ? (data_get($page, 'props.demoAgentId') ?: \App\Support\MarketingDemoAgent::id())
                : null;
        @endphp
        @if($marketingDemoAgentId)
            {{--
                The marketing site embeds the live demo agent. data-demo="true"
                tells the widget to render a "Demo" pill so reviewers /
                visitors can tell at a glance this is a sandbox, not a real
                support chat watching them. Auth-gated above so it never
                renders for a signed-in admin/customer (would look like
                surveillance + would persist real Leads in their tenant).
                The ?v=<hash> cache-bust mirrors the customer-side widget
                URL so browsers don't get stuck on a stale bundle.
            --}}
            @php
                $marketingWidgetPath = public_path('widget/widget.js');
                $marketingWidgetVersion = is_file($marketingWidgetPath)
                    ? substr((string) md5_file($marketingWidgetPath), 0, 8)
                    : 'dev';
            @endphp
            <script
                src="{{ rtrim(config('app.url'), '/') }}/widget/widget.js?v={{ $marketingWidgetVersion }}"
                data-agent-id="{{ $marketingDemoAgentId }}"
                defer
            ></script>
        @endif

    </body>
</html>
