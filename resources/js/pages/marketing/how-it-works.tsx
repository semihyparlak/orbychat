import { Head, Link } from '@inertiajs/react';
import { Check } from 'lucide-react';
import { MarketingShell } from '@/layouts/marketing-shell';
import type { MarketingShellContent } from '@/layouts/marketing-shell';
import { __ } from '@/app';

type Step = {
    number: string;
    title: string;
    duration: string;
    description: string;
    sub_points: string[];
};

type LatencyRow = { phase: string; budget: string };

type Props = {
    shell: MarketingShellContent;
    brand: string;
    steps: Step[];
    latency: LatencyRow[];
};

export default function HowItWorks({ shell, brand, steps, latency }: Props) {
    return (
        <>
            <Head title={`${__('How it works')}  —  ${brand}`}>
                <meta
                    name="description"
                    content={__('How the :brand sales AI widget turns your website into a 24/7 sales rep  —  from setup to first conversation in under 5 minutes.', { brand })}
                />
            </Head>

            <MarketingShell content={shell}>
                <section className="mx-auto max-w-5xl px-6 pt-16 pb-16 lg:pt-20">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/85 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-slate-600 uppercase">
                            {__('How it works')}
                        </span>
                        <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                            {__('From URL to live sales agent in')}{' '}
                            <span className="marketing-display italic">
                                {__('under 5 minutes')}
                            </span>
                        </h1>
                        <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
                            {__(':brand reads your website, builds an AI agent grounded in your own content, and embeds it on any page with one line of HTML. Here\'s exactly what happens.', { brand })}
                        </p>
                    </div>
                </section>

                <section className="relative mx-auto max-w-4xl px-6 pb-16">
                    <div className="space-y-6">
                        {steps.map((step) => (
                            <div
                                key={step.number}
                                className="relative rounded-3xl border border-slate-900/10 bg-white/85 p-6 pl-20 shadow-[0_30px_70px_-60px_rgba(15,23,42,0.4)] backdrop-blur sm:pl-24"
                            >
                                <span className="absolute top-6 left-4 flex size-12 items-center justify-center rounded-2xl border border-slate-900/10 bg-slate-950 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 sm:left-5">
                                    {step.number}
                                </span>
                                <div className="flex flex-wrap items-baseline justify-between gap-3">
                                    <h3 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
                                        {__(step.title)}
                                    </h3>
                                    <span className="rounded-full border border-emerald-600/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-emerald-700 uppercase">
                                        {__(step.duration)}
                                    </span>
                                </div>
                                <p
                                    className="mt-3 text-sm leading-6 text-slate-600 sm:text-base"
                                    dangerouslySetInnerHTML={{
                                        __html: __(step.description),
                                    }}
                                />
                                {step.sub_points.length > 0 && (
                                    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                                        {step.sub_points.map((point) => (
                                            <li
                                                key={point}
                                                className="flex items-start gap-2 text-sm text-slate-700"
                                            >
                                                <Check className="mt-[3px] size-4 flex-shrink-0 stroke-[2.4] text-emerald-600" />
                                                <span>{__(point)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mx-auto max-w-5xl px-6 py-16">
                    <div className="rounded-3xl border border-slate-900/10 bg-white/70 p-6 backdrop-blur sm:p-10">
                        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
                            <div>
                                <span className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-slate-600 uppercase">
                                    {__('Hot path contract')}
                                </span>
                                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                                    {__('1 second to first token. Every time.')}
                                </h2>
                                <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                                    {__('The visitor-message → first-token path has a hard p95 budget. No DB writes, no synchronous webhooks, no retries. Persistence and analytics are dispatched async after the stream completes.')}
                                </p>
                                <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                                    {__('OpenTelemetry spans wrap every phase so when the budget breaks the span heatmap points right at the offender.')}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-900/10 bg-white p-5">
                                <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                                    {__('p95 latency budget')}
                                </p>
                                <ul className="mt-4 space-y-3">
                                    {latency.map((row) => (
                                        <li
                                            key={row.phase}
                                            className="flex items-center justify-between text-sm text-slate-700"
                                        >
                                            <span>{__(row.phase)}</span>
                                            <span className="font-mono text-slate-950">
                                                {__(row.budget)}
                                            </span>
                                        </li>
                                    ))}
                                    <li className="flex items-center justify-between border-t border-slate-900/10 pt-3 text-sm font-semibold text-slate-950">
                                        <span>{__('Total to first token')}</span>
                                        <span className="font-mono text-emerald-700">
                                            ~ 865 ms
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-5xl px-6 pb-16">
                    <div className="rounded-3xl bg-slate-950 px-8 py-12 text-center sm:px-12">
                        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                            {__('Try it on your own site.')}
                        </h2>
                        <p className="mt-3 text-sm text-slate-300 sm:text-base">
                            {__('Free to start. No card required. Live in 5 minutes.')}
                        </p>
                        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold !text-slate-950 transition hover:bg-emerald-100"
                            >
                                {__('Start free')}
                            </Link>
                            <Link
                                href="/pricing"
                                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-medium !text-white transition hover:bg-white/10"
                            >
                                {__('See pricing')}
                            </Link>
                        </div>
                    </div>
                </section>
            </MarketingShell>
        </>
    );
}
