import { Head, Link } from '@inertiajs/react';
import { Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { MarketingShell } from '@/layouts/marketing-shell';
import type { MarketingShellContent } from '@/layouts/marketing-shell';
import { __ } from '@/app';

type Plan = {
    name: string;
    monthly_price: number;
    yearly_price: number;
    tagline: string;
    volume: string;
    cta_label: string;
    cta_href: string;
    highlight: boolean;
    features: string[];
};

type Interval = 'month' | 'year';

type MatrixCell = string | boolean;

type MatrixRow = {
    label: string;
    free: MatrixCell;
    standard: MatrixCell;
    pro: MatrixCell;
};

type Faq = { q: string; a: string };

type Props = {
    shell: MarketingShellContent;
    brand: string;
    plans: Plan[];
    matrix: MatrixRow[];
    faqs: Faq[];
    contact_email: string;
};

function MatrixValue({ value }: { value: MatrixCell }) {
    if (value === true) {
        return (
            <Check className="mx-auto size-4 stroke-[2.4] text-emerald-600" />
        );
    }

    if (value === false) {
        return <span className="text-slate-300"> — </span>;
    }

    return <span className="text-slate-700">{value}</span>;
}

function FaqItem({ q, a }: Faq) {
    const [open, setOpen] = useState(false);

    return (
        <div className="rounded-2xl border border-slate-900/10 bg-white/80 p-5 backdrop-blur transition hover:bg-white">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between text-left text-base font-medium text-slate-950"
            >
                <span>{q}</span>
                <ChevronDown
                    className={
                        'size-4 text-slate-500 transition' +
                        (open ? ' rotate-180' : '')
                    }
                />
            </button>
            {open && (
                <p className="mt-3 text-sm leading-6 text-slate-600">{a}</p>
            )}
        </div>
    );
}

export default function Pricing({
    shell,
    brand = 'OrbyChat',
    plans = [],
    matrix = [],
    faqs = [],
    contact_email = '',
}: Props) {
    const [interval, setInterval] = useState<Interval>('month');

    const safePlans = plans ?? [];
    const safeMatrix = matrix ?? [];
    const safeFaqs = faqs ?? [];

    const hasAnnualOption = safePlans.some(
        (p) => p.yearly_price > 0 && p.monthly_price > 0,
    );

    const annualSavingsPercent = (() => {
        const candidate = safePlans.find(
            (p) => p.monthly_price > 0 && p.yearly_price > 0,
        );

        if (!candidate) {
            return 0;
        }

        const monthlyOverYear = candidate.monthly_price * 12;
        const saved = monthlyOverYear - candidate.yearly_price;

        return monthlyOverYear === 0
            ? 0
            : Math.round((saved / monthlyOverYear) * 100);
    })();

    return (
        <>
            <Head title={`${__('Pricing')}  —  ${brand}`}>
                <meta
                    name="description"
                    content={__('Simple, conversation-based pricing for the :brand sales AI widget. Start free; scale as you grow.', { brand })}
                />
            </Head>

            <MarketingShell content={shell}>
                <section className="relative mx-auto max-w-6xl px-6 pt-16 pb-12 lg:pt-20">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/85 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-slate-600 uppercase">
                            {__('Pricing')}
                        </span>
                        <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                            {__('Simple,')}{' '}
                            <span className="marketing-display italic">
                                {__('conversation-based')}
                            </span>{' '}
                            {__('pricing')}
                        </h1>
                        <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
                            {__('Start free. Upgrade when you outgrow it. No per-seat fees, no setup fees, no surprise overages — just a clear conversation limit.')}
                        </p>

                        {hasAnnualOption && (
                            <div className="mt-8 inline-flex items-center gap-3">
                                <div
                                    className="inline-flex rounded-full border border-slate-900/10 bg-white/85 p-1 text-sm font-medium shadow-sm"
                                    role="radiogroup"
                                    aria-label={__('Billing interval')}
                                >
                                    {[
                                        {
                                            v: 'month' as const,
                                            label: __('Monthly'),
                                        },
                                        { v: 'year' as const, label: __('Yearly') },
                                    ].map((opt) => (
                                        <button
                                            key={opt.v}
                                            type="button"
                                            role="radio"
                                            aria-checked={interval === opt.v}
                                            onClick={() => setInterval(opt.v)}
                                            className={
                                                'rounded-full px-4 py-1.5 transition ' +
                                                (interval === opt.v
                                                    ? 'bg-slate-950 text-white'
                                                    : 'text-slate-600 hover:text-slate-950')
                                            }
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                                {annualSavingsPercent > 0 && (
                                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                        {__('Save :percent% with yearly', { percent: annualSavingsPercent })}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                <section className="mx-auto max-w-6xl px-6 pb-12">
                    <div className="grid gap-6 md:grid-cols-3">
                        {safePlans.map((plan) => {
                            const showYearly =
                                interval === 'year' && (plan.yearly_price ?? 0) > 0;
                            const headlinePrice = showYearly
                                ? Math.round((plan.yearly_price ?? 0) / 12)
                                : (plan.monthly_price ?? 0);
                            const ctaHref =
                                interval === 'year' && (plan.yearly_price ?? 0) > 0
                                    ? (plan.cta_href ?? '/register') +
                                      ((plan.cta_href ?? '/register').includes('?')
                                          ? '&'
                                          : '?') +
                                      'interval=year'
                                    : (plan.cta_href ?? '/register');

                            return (
                                <div
                                    key={plan.name}
                                    className={
                                        'relative flex flex-col rounded-3xl border bg-white/85 p-7 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.4)] backdrop-blur ' +
                                        (plan.highlight
                                            ? 'border-emerald-500/40 ring-2 ring-emerald-500/30'
                                            : 'border-slate-900/10')
                                    }
                                >
                                    {plan.highlight && (
                                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-white uppercase shadow-lg shadow-emerald-600/30">
                                            {__('Most popular')}
                                        </span>
                                    )}

                                    <div>
                                        <h3 className="text-xl font-semibold text-slate-950">
                                            {__(plan.name)}
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {__(plan.tagline ?? '')}
                                        </p>
                                    </div>

                                    <div className="mt-6 flex items-baseline gap-1">
                                        <span className="text-5xl font-bold tracking-tight text-slate-950">
                                            ${headlinePrice}
                                        </span>
                                        {headlinePrice > 0 && (
                                            <span className="text-sm text-slate-500">
                                                {__('/month')}
                                            </span>
                                        )}
                                    </div>
                                    {showYearly && (plan.yearly_price ?? 0) > 0 && (
                                        <p className="mt-1 text-xs text-slate-500">
                                            {__('$:price billed annually', { price: plan.yearly_price })}
                                        </p>
                                    )}
                                    <p className="mt-2 text-sm font-medium text-slate-700">
                                        {__(plan.volume ?? '')}
                                    </p>

                                    <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-700">
                                        {(plan.features ?? []).map((feature) => (
                                            <li
                                                key={feature}
                                                className="flex items-start gap-2"
                                            >
                                                <Check className="mt-[3px] size-4 flex-shrink-0 stroke-[2.4] text-emerald-600" />
                                                <span>{__(feature)}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link
                                        href={ctaHref}
                                        className={
                                            'mt-8 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ' +
                                            (plan.highlight
                                                ? 'bg-slate-950 text-white hover:bg-slate-800'
                                                : 'border border-slate-900/15 bg-white text-slate-950 hover:bg-slate-50')
                                        }
                                    >
                                        {__(plan.cta_label)}
                                    </Link>
                                </div>
                            );
                        })}
                    </div>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        {__('Need higher limits or a self-hosted license?')}{' '}
                        <a
                            href={`mailto:${contact_email}`}
                            className="font-medium text-slate-950 underline underline-offset-4"
                        >
                            {__('Talk to us about Enterprise')}
                        </a>
                        .
                    </p>
                </section>

                <section className="mx-auto max-w-6xl px-6 py-16">
                    <div className="rounded-3xl border border-slate-900/10 bg-white/70 p-6 shadow-[0_30px_70px_-60px_rgba(15,23,42,0.4)] backdrop-blur sm:p-10">
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                                {__('Compare every feature')}
                            </h2>
                            <p className="mt-2 text-sm text-slate-600">
                                {__('Everything you can do on each plan, side by side.')}
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px] border-separate border-spacing-0 text-sm">
                                <thead>
                                    <tr className="text-left text-slate-500">
                                        <th className="border-b border-slate-900/10 py-3 pr-4 text-xs font-medium tracking-wider uppercase">
                                            {__('Feature')}
                                        </th>
                                        <th className="border-b border-slate-900/10 px-4 py-3 text-center font-semibold text-slate-950">
                                            {__('Free')}
                                        </th>
                                        <th className="border-b border-slate-900/10 px-4 py-3 text-center font-semibold text-emerald-700">
                                            {__('Standard')}
                                        </th>
                                        <th className="border-b border-slate-900/10 px-4 py-3 text-center font-semibold text-slate-950">
                                            {__('Pro')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {safeMatrix.map((row) => (
                                        <tr
                                            key={row.label}
                                            className="text-slate-700"
                                        >
                                            <td className="border-b border-slate-900/5 py-3 pr-4 font-medium text-slate-950">
                                                {__(row.label)}
                                            </td>
                                            <td className="border-b border-slate-900/5 px-4 py-3 text-center">
                                                <MatrixValue value={row.free} />
                                            </td>
                                            <td className="border-b border-slate-900/5 px-4 py-3 text-center">
                                                <MatrixValue
                                                    value={row.standard}
                                                />
                                            </td>
                                            <td className="border-b border-slate-900/5 px-4 py-3 text-center">
                                                <MatrixValue value={row.pro} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-4xl px-6 py-16">
                    <h2 className="text-center text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                        {__('Frequently asked')}
                    </h2>
                    <div className="mt-10 grid gap-4">
                        {safeFaqs.map((faq) => (
                            <FaqItem key={faq.q} q={__(faq.q)} a={__(faq.a)} />
                        ))}
                    </div>
                </section>

                <section className="mx-auto max-w-5xl px-6 pb-16">
                    <div className="rounded-3xl bg-slate-950 px-8 py-12 text-center sm:px-12">
                        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                            {__('Ready to ship a real sales AI?')}
                        </h2>
                        <p className="mt-3 text-sm text-slate-300 sm:text-base">
                            {__('Free to start. Deploys in 5 minutes. No card required.')}
                        </p>
                        <Link
                            href="/register"
                            className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-100"
                        >
                            {__('Get started free')}
                        </Link>
                    </div>
                </section>
            </MarketingShell>
        </>
    );
}
