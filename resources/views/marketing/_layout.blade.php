<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', config('app.name'))</title>
    <meta name="description" content="@yield('description', __('OrbyChat — a Sales AI bar for any website.'))">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css'])
    <script src="https://orby.chat/widget/widget.js?v=87a0c141" data-agent-id="019e2654-ff7a-72fc-9999-caa8f92e847b" async></script>
</head>
<body class="min-h-screen overflow-x-hidden bg-[#f3efe7] text-slate-900 antialiased">
    <div aria-hidden="true" class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div class="marketing-grid-background absolute inset-0 opacity-70"></div>
        <div class="absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-amber-200/45 blur-3xl"></div>
        <div class="absolute bottom-[-10rem] right-[-6rem] h-[24rem] w-[24rem] rounded-full bg-emerald-200/35 blur-3xl"></div>
    </div>

    <header class="sticky top-0 z-20 border-b border-slate-900/10 bg-[#f3efe7]/90 backdrop-blur-xl">
        <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
            <a href="{{ route('home') }}" class="flex items-center gap-3 text-sm font-semibold tracking-[0.18em] text-slate-950 uppercase">
                <span class="flex size-9 items-center justify-center rounded-full border border-slate-900/15 bg-white/85 text-base tracking-normal">P</span>
                <span>OrbyChat</span>
            </a>

            <nav class="hidden items-center gap-6 text-sm text-slate-600 md:flex">
                <a href="{{ route('marketing.pricing') }}" class="transition hover:text-slate-950">{{ __('Pricing') }}</a>
                <a href="{{ route('marketing.how-it-works') }}" class="transition hover:text-slate-950">{{ __('How it works') }}</a>
                <a href="{{ url('/login') }}" class="transition hover:text-slate-950">{{ __('Login') }}</a>
                <a href="{{ url('/register') }}" class="rounded-full border border-slate-900/10 bg-slate-950 px-4 py-2 font-medium text-white transition hover:bg-slate-800">{{ __('Get started') }}</a>
            </nav>

            <div class="flex items-center gap-2 md:hidden">
                <a href="{{ url('/login') }}" class="rounded-full border border-slate-900/10 bg-white/80 px-3 py-2 text-sm font-medium text-slate-700">{{ __('Login') }}</a>
                <a href="{{ url('/register') }}" class="rounded-full bg-slate-950 px-3 py-2 text-sm font-medium text-white">{{ __('Start') }}</a>
            </div>
        </div>
    </header>

    <main class="relative">@yield('content')</main>

    <footer class="border-t border-slate-900/10 bg-white/55">
        <div class="mx-auto grid max-w-7xl gap-10 px-6 py-10 md:grid-cols-[1.5fr_0.7fr_0.7fr]">
            <div class="max-w-md">
                <p class="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">OrbyChat</p>
                <p class="mt-4 text-base leading-7 text-slate-600">
                    {{ __('A clean sales AI layer for websites that need faster answers, better qualification, and a clearer path from visitor intent to revenue.') }}
                </p>
            </div>

            <div>
                <p class="text-sm font-semibold text-slate-950">{{ __('Explore') }}</p>
                <div class="mt-4 grid gap-3 text-sm text-slate-600">
                    <a href="{{ route('home') }}" class="transition hover:text-slate-950">{{ __('Home') }}</a>
                    <a href="{{ route('marketing.pricing') }}" class="transition hover:text-slate-950">{{ __('Pricing') }}</a>
                    <a href="{{ route('marketing.how-it-works') }}" class="transition hover:text-slate-950">{{ __('How it works') }}</a>
                </div>
            </div>

            <div>
                <p class="text-sm font-semibold text-slate-950">{{ __('Legal') }}</p>
                <div class="mt-4 grid gap-3 text-sm text-slate-600">
                    <a href="{{ route('marketing.privacy') }}" class="transition hover:text-slate-950">{{ __('Privacy') }}</a>
                    <a href="{{ route('marketing.terms') }}" class="transition hover:text-slate-950">{{ __('Terms') }}</a>
                    <a href="{{ url('/login') }}" class="transition hover:text-slate-950">{{ __('Login') }}</a>
                </div>
            </div>
        </div>
        <div class="border-t border-slate-900/10 px-6 py-4 text-center text-sm text-slate-500">
            &copy; {{ date('Y') }} OrbyChat. {{ __('Sales AI for any website.') }}
        </div>
    </footer>

    @if($demoAgentId = \App\Support\MarketingDemoAgent::id())
        <script src="{{ rtrim(config('app.url'), '/') }}/widget/widget.js" data-agent-id="{{ $demoAgentId }}" data-demo="true" defer></script>
    @endif

</body>
</html>
