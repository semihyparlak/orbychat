@extends('marketing._layout')

@section('title', __('OrbyChat — AI-powered Sales Assistant for Your Website'))
@section('description', __('OrbyChat is the Sales AI bar for any website. It learns your product, engages visitors the moment they hesitate, and converts 24/7.'))

@section('content')
@php
    $metrics = [
        [
            'value' => '53%',
            'label' => __('of website visitors leave with unanswered questions.'),
        ],
        [
            'value' => '< 1s',
            'label' => __('target first response so the interaction feels immediate.'),
        ],
        [
            'value' => '5 min',
            'label' => __('to go from pasted URL to a working sales agent.'),
        ],
        [
            'value' => '24/7',
            'label' => __('coverage for pricing, product, and qualification conversations.'),
        ],
    ];

    $journeys = [
        [
            'eyebrow' => __('PRICING PAGES'),
            'title' => __('Keep high-intent buyers from bouncing at comparison time.'),
            'description' => __('Answer plan fit, implementation questions, contract concerns, and enterprise objections while the visitor is still evaluating.'),
            'points' => [
                __('Handle plan comparison and packaging questions.'),
                __('Surface the right CTA based on visitor intent.'),
                __('Capture qualified leads before the tab closes.'),
            ],
        ],
        [
            'eyebrow' => __('PRODUCT PAGES'),
            'title' => __('Turn product curiosity into a live guided buying moment.'),
            'description' => __('OrbyChat explains what the product does, who it is for, and what happens next without forcing someone to book time too early.'),
            'points' => [
                __('Answer product and integration questions instantly.'),
                __('Guide visitors toward trial, demo, or contact flows.'),
                __('Reduce friction for visitors who need a fast explanation.'),
            ],
        ],
        [
            'eyebrow' => __('DOCS AND HELP'),
            'title' => __('Let support content act like a revenue surface too.'),
            'description' => __('Instead of losing evaluators in your help center, give them a fast path back to confidence with product-aware answers and the right escalation path.'),
            'points' => [
                __('Use documentation and PDFs as part of the knowledge base.'),
                __('Catch hidden buying intent inside support-style content.'),
                __('Route important conversations to Slack or your CRM.'),
            ],
        ],
    ];

    $capabilities = [
        [
            'title' => __('Behavior triggers'),
            'description' => __('Detect hesitation, idle time, slow scroll, repeated movement, and exit intent so the widget appears with context instead of guesswork.'),
        ],
        [
            'title' => __('Streaming answers'),
            'description' => __('Deliver a first token fast enough to feel conversational, then stream the answer in real time so visitors stay engaged.'),
        ],
        [
            'title' => __('Smart CTAs'),
            'description' => __('Swap between trial, demo, talk-to-sales, and contact actions depending on what page the person is on and what they ask.'),
        ],
        [
            'title' => __('Auto-trains on your content'),
            'description' => __('Paste a site, upload docs, and let OrbyChat build a working knowledge layer without hand-writing prompts for every edge case.'),
        ],
        [
            'title' => __('Lead capture & routing'),
            'description' => __('Collect email, context, and conversation details, then push qualified leads into Slack, webhooks, or your downstream systems.'),
        ],
        [
            'title' => __('Self-improving'),
            'description' => __('See what the agent misses, promote strong answers into curated responses, and keep tightening performance over time.'),
        ],
    ];

    $signals = [
        [
            'title' => __('Content gaps'),
            'description' => __('See the questions the agent could not answer and turn them into new approved responses or source updates.'),
        ],
        [
            'title' => __('Experiments'),
            'description' => __('Test different trigger thresholds, copy, and CTA strategies without reworking the widget from scratch.'),
        ],
        [
            'title' => __('Lead context'),
            'description' => __('Know what was asked, what page the visitor came from, and which CTA actually moved the conversation forward.'),
        ],
    ];
@endphp

<section class="mx-auto max-w-7xl px-6 pb-16 pt-16 sm:pt-20 lg:pb-24 lg:pt-24">
    <div class="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
            <span class="inline-flex items-center rounded-full border border-slate-900/10 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600 shadow-sm">
                {{ __('Sales AI for any website') }}
            </span>

            <h1 class="mt-8 max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-6xl lg:text-7xl">
                <span class="marketing-display block leading-[0.92]">{{ __('A top AI salesperson on every page.') }}</span>
                <span class="mt-3 block text-[0.45em] font-medium leading-[1.02] tracking-[-0.04em] text-slate-700 sm:text-[0.42em]">
                    {{ __('Clean, fast, and trained on your site so buyers get real answers before they disappear.') }}
                </span>
            </h1>

            <p class="mt-8 max-w-2xl text-lg leading-8 text-slate-600">
                {{ __('OrbyChat reads your website, understands your product, watches for buying intent, and opens the right conversation when a visitor hesitates. It is built for pricing pages, product pages, and help surfaces where unanswered questions quietly kill conversion.') }}
            </p>

            <form method="post" action="{{ route('marketing.start') }}" class="mt-10 grid gap-3 rounded-[28px] border border-slate-900/10 bg-white/85 p-3 shadow-[0_25px_80px_-48px_rgba(15,23,42,0.45)] sm:grid-cols-[1fr_auto]">
                @csrf
                <input
                    name="domain"
                    type="url"
                    required
                    placeholder="https://your-website.com"
                    class="h-14 rounded-[22px] border border-slate-900/10 bg-[#f8f5ef] px-5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-900/20 focus:bg-white"
                >
                <button type="submit" class="inline-flex h-14 items-center justify-center rounded-[22px] bg-slate-950 px-6 text-sm font-medium text-white transition hover:bg-slate-800">
                    {{ __('Try it free') }}
                </button>
            </form>

            <div class="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span>{{ __('Free tier: 100 conversations/month. No credit card.') }}</span>
                <span class="hidden text-slate-300 sm:inline">”¢</span>
                <span>{{ __('One script tag. No developer required.') }}</span>
            </div>

            <div class="mt-8 flex flex-wrap gap-3">
                <span class="rounded-full border border-slate-900/10 bg-white/75 px-4 py-2 text-sm text-slate-600">{{ __('Pricing questions answered live') }}</span>
                <span class="rounded-full border border-slate-900/10 bg-white/75 px-4 py-2 text-sm text-slate-600">{{ __('Lead capture and routing') }}</span>
                <span class="rounded-full border border-slate-900/10 bg-white/75 px-4 py-2 text-sm text-slate-600">{{ __('Works with docs, PDFs, and web pages') }}</span>
            </div>

            @if(\App\Support\MarketingDemoAgent::id())
                <p class="mt-6 text-sm font-medium text-emerald-700">{{ __('Or chat with our live agent in the corner.') }}</p>
            @endif
        </div>

        <div class="relative lg:pt-4">
            <div class="rounded-[34px] border border-slate-900/10 bg-white/82 p-5 shadow-[0_30px_90px_-50px_rgba(15,23,42,0.5)] backdrop-blur-xl sm:p-6">
                <div class="flex flex-wrap items-start justify-between gap-4 border-b border-slate-900/10 pb-5">
                    <div>
                        <p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{{ __('Live website preview') }}</p>
                        <p class="mt-2 text-sm font-semibold text-slate-950">{{ __('Visitor on pricing page, comparing plans for 18 seconds') }}</p>
                    </div>
                    <span class="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">{{ __('Agent live') }}</span>
                </div>

                <div class="mt-5 space-y-3">
                    <div class="rounded-[26px] border border-slate-900/10 bg-[#fbfaf7] p-4">
                        <div class="flex items-start justify-between gap-4">
                            <div>
                                <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{{ __('Trigger') }}</p>
                                <p class="mt-2 text-sm font-semibold text-slate-950">{{ __('Behavior triggers wait for real intent, not random page views.') }}</p>
                            </div>
                            <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{{ __('Ready') }}</span>
                        </div>
                        <p class="mt-3 text-sm leading-6 text-slate-600">
                            {{ __('Idle on pricing, repeated scroll, no CTA click. The widget opens with a relevant message instead of interrupting everyone equally.') }}
                        </p>
                    </div>

                    <div class="rounded-[26px] border border-slate-900/10 bg-[#fbfaf7] p-4">
                        <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{{ __('Answer') }}</p>
                        <div class="mt-3 rounded-[22px] bg-slate-950 px-4 py-3 text-sm leading-6 text-white">
                            {{ __('I can help compare plans, explain implementation, or show which setup fits a larger team best.') }}
                        </div>
                        <div class="mt-3 rounded-[22px] bg-white px-4 py-3 text-sm leading-6 text-slate-600 shadow-sm ring-1 ring-slate-900/8">
                            {{ __('Best fit if you need multiple agents, Slack routing, and custom CTA logic across pricing and product pages.') }}
                        </div>
                    </div>

                    <div class="rounded-[26px] border border-slate-900/10 bg-[#fbfaf7] p-4">
                        <div class="flex items-start justify-between gap-4">
                            <div>
                                <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{{ __('Next action') }}</p>
                                <p class="mt-2 text-sm font-semibold text-slate-950">{{ __('CTAs adapt to the conversation instead of staying static.') }}</p>
                            </div>
                            <span class="rounded-full border border-slate-900/10 bg-white px-2.5 py-1 text-xs text-slate-600">{{ __('Qualified') }}</span>
                        </div>
                        <div class="mt-4 flex flex-wrap gap-2">
                            <span class="rounded-full bg-slate-950 px-3 py-2 text-xs font-medium text-white">{{ __('Book a demo') }}</span>
                            <span class="rounded-full border border-slate-900/10 bg-white px-3 py-2 text-xs font-medium text-slate-600">{{ __('See pricing details') }}</span>
                            <span class="rounded-full border border-slate-900/10 bg-white px-3 py-2 text-xs font-medium text-slate-600">{{ __('Email me the plan guide') }}</span>
                        </div>
                    </div>
                </div>

                <div class="mt-5 grid gap-3 sm:grid-cols-2">
                    <div class="rounded-[24px] border border-slate-900/10 bg-slate-950 p-4 text-white">
                        <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">{{ __('Speed target') }}</p>
                        <p class="mt-3 text-3xl font-semibold tracking-tight">&lt; 1s</p>
                        <p class="mt-2 text-sm leading-6 text-white/70">{{ __('Fast enough to feel like a live rep, not a delayed widget.') }}</p>
                    </div>
                    <div class="rounded-[24px] border border-slate-900/10 bg-white p-4">
                        <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{{ __('Launch path') }}</p>
                        <p class="mt-3 text-3xl font-semibold tracking-tight text-slate-950">5 min</p>
                        <p class="mt-2 text-sm leading-6 text-slate-600">{{ __('Paste the site, tune the agent, drop a script tag, and go live.') }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="mx-auto max-w-7xl px-6 pb-8">
    <div class="grid gap-px overflow-hidden rounded-[32px] border border-slate-900/10 bg-slate-900/10 md:grid-cols-4">
        @foreach ($metrics as $metric)
            <div class="bg-white/80 px-6 py-7">
                <p class="text-4xl font-semibold tracking-tight text-slate-950">{{ $metric['value'] }}</p>
                <p class="mt-3 max-w-xs text-sm leading-6 text-slate-600">{{ $metric['label'] }}</p>
            </div>
        @endforeach
    </div>
</section>

<section class="mx-auto max-w-7xl px-6 py-16 lg:py-24">
    <div class="max-w-2xl">
        <span class="inline-flex items-center rounded-full border border-slate-900/10 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600">
            {{ __('Where it fits') }}
        </span>
        <h2 class="mt-6 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
            {{ __('Built for the pages where serious visitors stop, compare, and decide.') }}
        </h2>
        <p class="mt-5 max-w-xl text-base leading-7 text-slate-600">
            {{ __('OrbyChat works best on surfaces that already carry buying intent. Instead of adding another chat bubble everywhere, it turns the right moments into useful sales conversations.') }}
        </p>
    </div>

    <div class="mt-12 grid gap-6 lg:grid-cols-3">
        @foreach ($journeys as $journey)
            <article class="rounded-[30px] border border-slate-900/10 bg-white/82 p-6 shadow-[0_25px_80px_-56px_rgba(15,23,42,0.45)]">
                <p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{{ $journey['eyebrow'] }}</p>
                <h3 class="mt-4 text-xl font-semibold tracking-tight text-slate-950">{{ $journey['title'] }}</h3>
                <p class="mt-4 text-sm leading-6 text-slate-600">{{ $journey['description'] }}</p>
                <div class="mt-6 space-y-3 border-t border-slate-900/10 pt-6">
                    @foreach ($journey['points'] as $point)
                        <div class="flex items-start gap-3 text-sm leading-6 text-slate-600">
                            <span class="mt-2 size-2 rounded-full bg-slate-950"></span>
                            <span>{{ $point }}</span>
                        </div>
                    @endforeach
                </div>
            </article>
        @endforeach
    </div>
</section>

<section class="mx-auto max-w-7xl px-6 py-16 lg:py-24">
    <div class="rounded-[36px] border border-slate-900/10 bg-slate-950 px-6 py-12 text-white sm:px-8 lg:px-10">
        <div class="max-w-2xl">
            <span class="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">
                {{ __('Built for revenue teams') }}
            </span>
            <h2 class="mt-6 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
                {{ __('The landing layer is clean. The operating layer is detailed.') }}
            </h2>
            <p class="mt-5 max-w-2xl text-base leading-7 text-white/70">
                {{ __('Give visitors a minimal, confident buying experience while your team keeps full control over triggers, answers, CTAs, sources, and follow-up workflows behind the scenes.') }}
            </p>
        </div>

        <div class="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            @foreach ($capabilities as $capability)
                <div class="rounded-[28px] border border-white/10 bg-white/6 p-5">
                    <h3 class="text-lg font-semibold text-white">{{ $capability['title'] }}</h3>
                    <p class="mt-3 text-sm leading-6 text-white/68">{{ $capability['description'] }}</p>
                </div>
            @endforeach
        </div>
    </div>
</section>

<section class="mx-auto max-w-7xl px-6 py-16 lg:py-24">
    <div class="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
            <span class="inline-flex items-center rounded-full border border-slate-900/10 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600">
                {{ __('Control layer') }}
            </span>
            <h2 class="mt-6 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
                {{ __('Tune what the agent says, when it appears, and what happens next.') }}
            </h2>
            <p class="mt-5 max-w-xl text-base leading-7 text-slate-600">
                {{ __('You are not locked into a generic chatbot script. OrbyChat gives your team practical levers for message quality, response boundaries, trigger logic, and CTA strategy without needing to rebuild the whole experience.') }}
            </p>
            <div class="mt-8 grid gap-4 sm:grid-cols-2">
                <div class="rounded-[24px] border border-slate-900/10 bg-white/82 p-5">
                    <p class="text-sm font-semibold text-slate-950">{{ __('Curated answers') }}</p>
                    <p class="mt-2 text-sm leading-6 text-slate-600">{{ __('Promote strong responses into approved answers for important recurring questions.') }}</p>
                </div>
                <div class="rounded-[24px] border border-slate-900/10 bg-white/82 p-5">
                    <p class="text-sm font-semibold text-slate-950">{{ __('Experiments') }}</p>
                    <p class="mt-2 text-sm leading-6 text-slate-600">{{ __('Compare CTA or copy variants and see which setup produces better downstream intent.') }}</p>
                </div>
            </div>
        </div>

        <div class="rounded-[34px] border border-slate-900/10 bg-white/82 p-5 shadow-[0_25px_80px_-56px_rgba(15,23,42,0.45)] sm:p-6">
            <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-900/10 pb-5">
                <div>
                    <p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{{ __('Agent operating system') }}</p>
                    <p class="mt-2 text-sm font-semibold text-slate-950">{{ __('A clean front end with detailed control underneath.') }}</p>
                </div>
                <span class="rounded-full border border-slate-900/10 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">{{ __('No-code workflow') }}</span>
            </div>

            <div class="mt-5 space-y-3">
                <div class="rounded-[24px] border border-slate-900/10 bg-[#fbfaf7] p-4">
                    <div class="flex items-center justify-between gap-3">
                        <p class="text-sm font-semibold text-slate-950">{{ __('Trigger rule') }}</p>
                        <span class="text-xs text-slate-500">{{ __('Idle 12s + pricing page') }}</span>
                    </div>
                    <p class="mt-2 text-sm leading-6 text-slate-600">{{ __('Only open on high-intent pages when the visitor pauses long enough to signal friction.') }}</p>
                </div>
                <div class="rounded-[24px] border border-slate-900/10 bg-[#fbfaf7] p-4">
                    <div class="flex items-center justify-between gap-3">
                        <p class="text-sm font-semibold text-slate-950">{{ __('Answer style') }}</p>
                        <span class="text-xs text-slate-500">{{ __('Concise, direct, product-aware') }}</span>
                    </div>
                    <p class="mt-2 text-sm leading-6 text-slate-600">{{ __('Keep responses short, helpful, and commercially useful instead of sounding like generic support automation.') }}</p>
                </div>
                <div class="rounded-[24px] border border-slate-900/10 bg-[#fbfaf7] p-4">
                    <div class="flex items-center justify-between gap-3">
                        <p class="text-sm font-semibold text-slate-950">{{ __('CTA routing') }}</p>
                        <span class="text-xs text-slate-500">{{ __('Demo for enterprise intent') }}</span>
                    </div>
                    <p class="mt-2 text-sm leading-6 text-slate-600">{{ __('Move visitors toward the right next step based on what they ask and where they entered the conversation.') }}</p>
                </div>
                <div class="rounded-[24px] border border-slate-900/10 bg-slate-950 p-4 text-white">
                    <div class="flex items-center justify-between gap-3">
                        <p class="text-sm font-semibold">{{ __('Follow-up signal') }}</p>
                        <span class="text-xs text-white/60">{{ __('Slack + inbox + webhook') }}</span>
                    </div>
                    <p class="mt-2 text-sm leading-6 text-white/70">{{ __('Every qualified conversation can become a routed lead with the context your team needs to act fast.') }}</p>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="mx-auto max-w-7xl px-6 py-16 lg:py-24">
    <div class="max-w-2xl">
        <span class="inline-flex items-center rounded-full border border-slate-900/10 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600">
            {{ __('From setup to launch') }}
        </span>
        <h2 class="mt-6 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">{{ __('From paste to sale in 3 steps.') }}</h2>
        <p class="mt-5 max-w-xl text-base leading-7 text-slate-600">
            {{ __('The implementation stays lightweight. The agent quality comes from your content, your control layer, and the behavior logic that decides when to intervene.') }}
        </p>
    </div>

    <div class="mt-12 grid gap-6 lg:grid-cols-3">
        <div class="rounded-[30px] border border-slate-900/10 bg-white/82 p-6">
            <span class="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">{{ __('Step 01') }}</span>
            <h3 class="mt-4 text-xl font-semibold tracking-tight text-slate-950">{{ __('Paste your website URL.') }}</h3>
            <p class="mt-4 text-sm leading-6 text-slate-600">
                {{ __('We discover the important pages and pull in the material your agent should actually use when talking to buyers.') }}
            </p>
        </div>
        <div class="rounded-[30px] border border-slate-900/10 bg-white/82 p-6">
            <span class="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">{{ __('Step 02') }}</span>
            <h3 class="mt-4 text-xl font-semibold tracking-tight text-slate-950">{{ __('Watch the agent learn live.') }}</h3>
            <p class="mt-4 text-sm leading-6 text-slate-600">
                {{ __('Test answers, shape persona, set CTA rules, and refine the moments that should trigger a conversation.') }}
            </p>
        </div>
        <div class="rounded-[30px] border border-slate-900/10 bg-white/82 p-6">
            <span class="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">{{ __('Step 03') }}</span>
            <h3 class="mt-4 text-xl font-semibold tracking-tight text-slate-950">{{ __('Drop one line of code.') }}</h3>
            <p class="mt-4 text-sm leading-6 text-slate-600">
                {{ __('Add the widget with a single script tag or use a platform integration. The experience stays lightweight and launch-ready.') }}
            </p>
        </div>
    </div>
</section>

<section class="mx-auto max-w-7xl px-6 py-16 lg:py-24">
    <div class="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div class="rounded-[34px] border border-slate-900/10 bg-white/82 p-6">
            <span class="inline-flex items-center rounded-full border border-slate-900/10 bg-slate-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600">
                {{ __('What improves over time') }}
            </span>
            <h2 class="mt-6 text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl">
                {{ __('Every conversation becomes signal for the next one.') }}
            </h2>
            <p class="mt-5 text-base leading-7 text-slate-600">
                {{ __('The agent is not static after launch. Your team gets a clearer view of what buyers ask, where friction appears, and how the next response or CTA should improve.') }}
            </p>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
            @foreach ($signals as $signal)
                <div class="rounded-[30px] border border-slate-900/10 bg-slate-950 px-5 py-6 text-white">
                    <h3 class="text-lg font-semibold">{{ $signal['title'] }}</h3>
                    <p class="mt-3 text-sm leading-6 text-white/70">{{ $signal['description'] }}</p>
                </div>
            @endforeach
        </div>
    </div>
</section>

<section class="mx-auto max-w-7xl px-6 pb-28 pt-10 sm:pb-32">
    <div class="rounded-[38px] border border-slate-900/10 bg-white/84 px-6 py-12 text-center shadow-[0_25px_80px_-56px_rgba(15,23,42,0.45)] sm:px-8 lg:px-12">
        <span class="inline-flex items-center rounded-full border border-slate-900/10 bg-slate-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600">
            {{ __('Start simple') }}
        </span>
        <h2 class="mt-6 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
            {{ __('Ready to convert visitors into customers?') }}
        </h2>
        <p class="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">
            {{ __('Launch with the free tier, train on your real site, and keep the experience clean for visitors while your team keeps the detailed control behind it.') }}
        </p>

        <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="{{ url('/register') }}" class="inline-flex min-w-44 items-center justify-center rounded-full bg-slate-950 px-7 py-4 text-sm font-medium text-white transition hover:bg-slate-800">
                {{ __('Get started - free') }}
            </a>
            <a href="{{ route('marketing.how-it-works') }}" class="inline-flex min-w-44 items-center justify-center rounded-full border border-slate-900/10 bg-white px-7 py-4 text-sm font-medium text-slate-700 transition hover:border-slate-900/20 hover:text-slate-950">
                {{ __('See how it works') }}
            </a>
        </div>
    </div>
</section>
@endsection
