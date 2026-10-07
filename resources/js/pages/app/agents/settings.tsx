import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowUpRight,
    Check,
    Clipboard,
    Globe2,
    Info,
    LockKeyhole,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { AgentForm } from '@/components/agents/agent-form';
import { LeadFormBuilder } from '@/components/agents/lead-form-builder';
import type { LeadFormField } from '@/components/agents/lead-form-builder';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { show as showAgent, update as updateAgent } from '@/routes/agents';
import type { BreadcrumbItem } from '@/types';

type Agent = {
    id: string;
    name: string;
    language_default: string;
    system_prompt: string | null;
    confidence_threshold: number;
    is_published: boolean;
    auto_index_visited_pages: boolean;
    allowed_origins: string[] | null;
    restricted_paths: string[] | null;
    vertical_overrides: Record<string, any> | null;
    site_type: string | null;
    lead_form_fields: LeadFormField[] | null;
    require_lead_before_chat: boolean;
};

type Embed = { widget_url: string; snippet: string };

type Props = {
    agent: Agent;
    embed: Embed;
    preset_defaults?: { capabilities: string[] } | null;
};

function StatusPill({ published }: { published: boolean }) {
    return (
        <span
            className={
                'inline-flex h-7 items-center gap-2 rounded-md border px-2.5 text-xs font-medium ' +
                (published
                    ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    : 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300')
            }
        >
            <span
                className={
                    'size-1.5 rounded-full ' +
                    (published ? 'bg-emerald-500' : 'bg-amber-500')
                }
            />
            {published ? __('Published') : __('Draft')}
        </span>
    );
}

function SettingMetric({
    label,
    value,
    helper,
}: {
    label: string;
    value: string;
    helper: string;
}) {
    return (
        <div className="border-b px-4 py-4 last:border-b-0 sm:px-5">
            <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                {label}
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                {value}
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {helper}
            </p>
        </div>
    );
}

export default function AgentSettings({ agent, embed, preset_defaults }: Props) {
    const [copied, setCopied] = useState(false);
    const [autoIndex, setAutoIndex] = useState(agent.auto_index_visited_pages);
    const confidencePercent = Math.round(agent.confidence_threshold * 100);
    const originsCount = agent.allowed_origins?.length ?? 0;
    const languageLabel = agent.language_default.toUpperCase();

    const originsForm = useForm<{ origins: string }>({
        origins: (agent.allowed_origins ?? []).join('\n'),
    });
    const [originsSaved, setOriginsSaved] = useState(false);

    const restrictedForm = useForm<{ paths: string }>({
        paths: (agent.restricted_paths ?? []).join('\n'),
    });
    const [restrictedSaved, setRestrictedSaved] = useState(false);

    const copySnippet = async () => {
        await navigator.clipboard.writeText(embed.snippet);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
    };

    const toggleAutoIndex = (next: boolean) => {
        setAutoIndex(next);
        router.patch(
            updateAgent.url({ agent: agent.id }),
            { auto_index_visited_pages: next },
            { preserveScroll: true, onError: () => setAutoIndex(!next) },
        );
    };

    // useForm types `errors` against the form's data shape (`origins`),
    // but after transform() the server sees the field as `allowed_origins`
    // and reports validation errors under that key  —  bridge the gap.
    const originsError = (originsForm.errors as Record<string, string>)
        .allowed_origins;

    const saveOrigins = (e: React.FormEvent) => {
        e.preventDefault();
        const list = originsForm.data.origins
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line !== '');

        originsForm.transform(() => ({ allowed_origins: list }));
        originsForm.patch(updateAgent.url({ agent: agent.id }), {
            preserveScroll: true,
            onSuccess: () => {
                setOriginsSaved(true);
                window.setTimeout(() => setOriginsSaved(false), 2000);
            },
        });
    };

    // restricted_paths server error key bridge  —  same pattern as origins.
    const restrictedError = (restrictedForm.errors as Record<string, string>)
        .restricted_paths;

    const saveRestricted = (e: React.FormEvent) => {
        e.preventDefault();
        const list = restrictedForm.data.paths
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line !== '');

        restrictedForm.transform(() => ({ restricted_paths: list }));
        restrictedForm.patch(updateAgent.url({ agent: agent.id }), {
            preserveScroll: true,
            onSuccess: () => {
                setRestrictedSaved(true);
                window.setTimeout(() => setRestrictedSaved(false), 2000);
            },
        });
    };

    const overrides = agent.vertical_overrides ?? {};
    const [capabilities, setCapabilities] = useState<string[]>(
        overrides.capabilities ?? preset_defaults?.capabilities ?? []
    );
    const [maxDiscount, setMaxDiscount] = useState(overrides.max_discount_percent ?? 15);
    const [couponCode, setCouponCode] = useState(overrides.coupon_code ?? '');
    const [discountText, setDiscountText] = useState(overrides.discount_text ?? '');
    const [leadFormFields, setLeadFormFields] = useState<LeadFormField[] | null>(agent.lead_form_fields);
    const [requireLead, setRequireLead] = useState(agent.require_lead_before_chat);
    const [overridesSaved, setOverridesSaved] = useState(false);

    const toggleCapability = (cap: string) => {
        const next = capabilities.includes(cap)
            ? capabilities.filter((c) => c !== cap)
            : [...capabilities, cap];
        setCapabilities(next);
    };

    const saveOverrides = () => {
        router.patch(updateAgent.url({ agent: agent.id }), {
            vertical_overrides: {
                ...overrides,
                capabilities,
                max_discount_percent: maxDiscount,
                coupon_code: couponCode,
                discount_text: discountText,
                appointment_requests: capabilities.includes('appointment_requests'),
            },
            lead_form_fields: leadFormFields,
            require_lead_before_chat: requireLead,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setOverridesSaved(true);
                window.setTimeout(() => setOverridesSaved(false), 2000);
            }
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: __('Agents'), href: '/app/agents' },
        { title: agent.name, href: `/app/agents/${agent.id}` },
        { title: __('Settings'), href: `/app/agents/${agent.id}/settings` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__(':name · settings', { name: agent.name })} />
            <div className="flex min-h-0 flex-1 flex-col bg-card">
                <div className="flex min-h-10 flex-wrap items-center gap-2 border-b px-3 py-2 sm:py-1.5">
                    <StatusPill published={agent.is_published} />
                    <span className="inline-flex h-7 items-center rounded-md border bg-background px-2.5 text-xs font-normal text-muted-foreground">
                        {__(':lang default language', { lang: languageLabel })}
                    </span>
                    <span className="inline-flex h-7 items-center rounded-md border bg-background px-2.5 text-xs font-normal text-muted-foreground">
                        {__(':percent% confidence', { percent: confidencePercent })}
                    </span>
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="ml-auto"
                    >
                        <Link
                            href={showAgent.url({ agent: agent.id })}
                            prefetch
                        >
                            {__('Agent workspace')}
                            <ArrowUpRight className="size-3.5" />
                        </Link>
                    </Button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto">
                    <div className="grid gap-4 p-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.85fr)]">
                        <div className="grid gap-4">
                            <div>
                                <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                    {__('Settings')}
                                </p>
                                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                                    {__('Agent settings')}
                                </h1>
                                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                                    {__('Tune how this agent answers, where the widget is allowed to run, and what installation code customers should paste onto their site.')}
                                </p>
                            </div>

                            <AgentForm
                                mode="edit"
                                agentId={agent.id}
                                initial={{
                                    name: agent.name,
                                    language_default: agent.language_default,
                                    system_prompt: agent.system_prompt ?? '',
                                    confidence_threshold:
                                        agent.confidence_threshold,
                                }}
                            />

                            <Card className="overflow-hidden p-0">
                                <form onSubmit={saveOrigins}>
                                    <div className="border-b px-4 py-4 sm:px-5">
                                        <div className="flex items-start gap-3">
                                            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background text-muted-foreground shadow-xs">
                                                <ShieldCheck className="size-4" />
                                            </span>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-foreground">
                                                    {__('Allowed origins')}
                                                </p>
                                                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                                    {__('Restrict this public widget script to trusted domains. Each origin must include the scheme and host.')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 px-4 py-4 sm:px-5">
                                        <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-xs leading-5 text-amber-800 dark:text-amber-300">
                                            <strong>{__('Strict match.')}</strong>{' '}
                                            {__('Subdomains are not inferred.')}{' '}
                                            <code>https://example.com</code>{' '}
                                            {__('does not permit')}{' '}
                                            <code>https://app.example.com</code>
                                            .
                                        </div>

                                        <div className="grid gap-1.5">
                                            <Label
                                                htmlFor="origins"
                                                className="text-xs text-muted-foreground"
                                            >
                                                {__('One origin per line')}
                                            </Label>
                                            <Textarea
                                                id="origins"
                                                rows={5}
                                                spellCheck={false}
                                                placeholder={
                                                    'https://example.com\nhttps://app.example.com'
                                                }
                                                value={originsForm.data.origins}
                                                aria-invalid={Boolean(
                                                    originsError,
                                                )}
                                                onChange={(e) =>
                                                    originsForm.setData(
                                                        'origins',
                                                        e.target.value,
                                                    )
                                                }
                                                className="font-mono text-xs leading-5"
                                            />
                                            {originsError ? (
                                                <p className="text-xs text-destructive">
                                                    {originsError}
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="flex flex-col-reverse gap-2 border-t bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                                        <p className="text-xs text-muted-foreground">
                                            {originsCount === 0
                                                ? __('No production origins configured yet.')
                                                : __(':count origin(s) currently configured.', { count: originsCount })}
                                        </p>
                                        <div className="flex items-center justify-end gap-3">
                                            {originsSaved ? (
                                                <span className="text-xs text-emerald-600 dark:text-emerald-400">
                                                    {__('Saved')}
                                                </span>
                                            ) : null}
                                            <Button
                                                type="submit"
                                                size="sm"
                                                disabled={
                                                    originsForm.processing
                                                }
                                            >
                                                {__('Save origins')}
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </Card>

                            <Card className="overflow-hidden p-0">
                                <form onSubmit={saveRestricted}>
                                    <div className="border-b px-4 py-4 sm:px-5">
                                        <div className="flex items-start gap-3">
                                            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background text-muted-foreground shadow-xs">
                                                <ShieldCheck className="size-4" />
                                            </span>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-foreground">
                                                    {__('Restricted paths')}
                                                </p>
                                                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                                    {__('URL paths the widget should NOT mount on. Mirrors Allowed origins but for paths within an already-allowed origin  —  use it to keep the bot off your own /admin, /checkout, or /account flows without touching code.')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 px-4 py-4 sm:px-5">
                                        <div className="rounded-lg border bg-muted/30 px-3 py-2 text-xs leading-5 text-muted-foreground">
                                            <p>
                                                <strong>{__('Glob patterns.')}</strong>{' '}
                                                {__('Use * as a wildcard. Example:')}
                                            </p>
                                            <ul className="mt-1 list-disc pl-5">
                                                <li>
                                                    <code>/admin</code> → {__('exact path only')}
                                                </li>
                                                <li>
                                                    <code>/admin/*</code> → {__('anything under /admin')}
                                                </li>
                                                <li>
                                                    <code>/checkout</code>,{' '}
                                                    <code>/account/*</code>  —  {__('case-insensitive')}
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="grid gap-1.5">
                                            <Label
                                                htmlFor="restricted-paths"
                                                className="text-xs text-muted-foreground"
                                            >
                                                {__('One path per line')}
                                            </Label>
                                            <Textarea
                                                id="restricted-paths"
                                                rows={5}
                                                spellCheck={false}
                                                placeholder={
                                                    '/admin/*\n/checkout\n/account/*'
                                                }
                                                value={
                                                    restrictedForm.data.paths
                                                }
                                                aria-invalid={Boolean(
                                                    restrictedError,
                                                )}
                                                onChange={(e) =>
                                                    restrictedForm.setData(
                                                        'paths',
                                                        e.target.value,
                                                    )
                                                }
                                                className="font-mono text-xs leading-5"
                                            />
                                            {restrictedError ? (
                                                <p className="text-xs text-destructive">
                                                    {restrictedError}
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="flex flex-col-reverse gap-2 border-t bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                                        <p className="text-xs text-muted-foreground">
                                            {(agent.restricted_paths?.length ??
                                                0) === 0
                                                ? __('No path restrictions  —  widget mounts on every allowed origin.')
                                                : __(':count path(s) blocked.', { count: agent.restricted_paths?.length })}
                                        </p>
                                        <div className="flex items-center justify-end gap-3">
                                            {restrictedSaved ? (
                                                <span className="text-xs text-emerald-600 dark:text-emerald-400">
                                                    {__('Saved')}
                                                </span>
                                            ) : null}
                                            <Button
                                                type="submit"
                                                size="sm"
                                                disabled={
                                                    restrictedForm.processing
                                                }
                                            >
                                                {__('Save paths')}
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </Card>

                            {/* AI Capabilities & Limits - Dynamic based on site_type */}
                            <Card className="overflow-hidden p-0">
                                <div className="border-b px-4 py-4 sm:px-5">
                                    <div className="flex items-start gap-3">
                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background text-muted-foreground shadow-xs">
                                            <Sparkles className="size-4" />
                                        </span>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-semibold text-foreground">
                                                    {__('AI Capabilities & Limits')}
                                                </p>
                                                {agent.site_type && (
                                                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 uppercase tracking-wider">
                                                        {agent.site_type}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                                {__('Fine-tune what your AI agent is allowed to do based on your business model.')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-6 px-4 py-6 sm:px-5">
                                    {/* E-commerce Specifics */}
                                    {agent.site_type === 'ecommerce' && (
                                         <>
                                             <div className="flex items-center justify-between">
                                                 <div>
                                                     <p className="text-sm font-medium text-foreground">{__('Enable Discounts')}</p>
                                                     <p className="text-xs text-muted-foreground">{__('Allow the agent to offer coupons to customers.')}</p>
                                                 </div>
                                                 <button
                                                     type="button"
                                                     onClick={() => toggleCapability('ecommerce_discounts')}
                                                     className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${capabilities.includes('ecommerce_discounts') ? 'bg-emerald-500' : 'bg-muted'}`}
                                                 >
                                                     <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${capabilities.includes('ecommerce_discounts') ? 'translate-x-5' : 'translate-x-1'}`} />
                                                 </button>
                                             </div>

                                             {capabilities.includes('ecommerce_discounts') && (
                                                 <div className="ml-4 border-l-2 border-muted pl-4 space-y-4 mt-2">
                                                     <div>
                                                         <Label htmlFor="ecommerce-max-discount" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                             {__('Maximum Discount Limit (%)')}
                                                         </Label>
                                                         <div className="mt-2 flex items-center gap-3">
                                                             <Input
                                                                 id="ecommerce-max-discount"
                                                                 type="number"
                                                                 min="0"
                                                                 max="100"
                                                                 value={maxDiscount}
                                                                 onChange={(e) => setMaxDiscount(parseInt(e.target.value) || 0)}
                                                                 className="w-24 text-sm"
                                                             />
                                                             <span className="text-xs text-muted-foreground">
                                                                 {__('The agent will never offer a discount higher than this value.')}
                                                             </span>
                                                         </div>
                                                     </div>

                                                     <div>
                                                         <Label htmlFor="ecommerce-coupon-code" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                             {__('Default Coupon Code')}
                                                         </Label>
                                                         <div className="mt-2">
                                                             <Input
                                                                 id="ecommerce-coupon-code"
                                                                 type="text"
                                                                 value={couponCode}
                                                                 onChange={(e) => setCouponCode(e.target.value)}
                                                                 className="max-w-xs text-sm"
                                                                 placeholder="e.g. WELCOME10"
                                                             />
                                                         </div>
                                                     </div>

                                                     <div>
                                                         <Label htmlFor="ecommerce-discount-text" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                             {__('Discount Label')}
                                                         </Label>
                                                         <div className="mt-2">
                                                             <Input
                                                                 id="ecommerce-discount-text"
                                                                 type="text"
                                                                 value={discountText}
                                                                 onChange={(e) => setDiscountText(e.target.value)}
                                                                 className="max-w-xs text-sm"
                                                                 placeholder="e.g. 10% OFF"
                                                             />
                                                         </div>
                                                     </div>
                                                 </div>
                                             )}

                                             <div className="flex items-center justify-between">
                                                 <div>
                                                     <p className="text-sm font-medium text-foreground">{__('Product Recommendations')}</p>
                                                     <p className="text-xs text-muted-foreground">{__('Allow the agent to suggest related products to increase basket size.')}</p>
                                                 </div>
                                                 <button
                                                     type="button"
                                                     onClick={() => toggleCapability('product_recommendations')}
                                                     className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${capabilities.includes('product_recommendations') ? 'bg-emerald-500' : 'bg-muted'}`}
                                                 >
                                                     <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${capabilities.includes('product_recommendations') ? 'translate-x-5' : 'translate-x-1'}`} />
                                                 </button>
                                             </div>

                                             <div className="flex items-center justify-between">
                                                 <div>
                                                     <p className="text-sm font-medium text-foreground">{__('Enable Order Tracking')}</p>
                                                     <p className="text-xs text-muted-foreground">{__('Allow the agent to look up order status for customers.')}</p>
                                                 </div>
                                                 <button
                                                     type="button"
                                                     onClick={() => toggleCapability('ecommerce_tracking')}
                                                     className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${capabilities.includes('ecommerce_tracking') ? 'bg-emerald-500' : 'bg-muted'}`}
                                                 >
                                                     <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${capabilities.includes('ecommerce_tracking') ? 'translate-x-5' : 'translate-x-1'}`} />
                                                 </button>
                                             </div>

                                             <div className="flex items-center justify-between">
                                                 <div>
                                                     <p className="text-sm font-medium text-foreground">{__('Enable Inventory Check')}</p>
                                                     <p className="text-xs text-muted-foreground">{__('Allow the agent to check product availability for customers.')}</p>
                                                 </div>
                                                 <button
                                                     type="button"
                                                     onClick={() => toggleCapability('ecommerce_inventory')}
                                                     className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${capabilities.includes('ecommerce_inventory') ? 'bg-emerald-500' : 'bg-muted'}`}
                                                 >
                                                     <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${capabilities.includes('ecommerce_inventory') ? 'translate-x-5' : 'translate-x-1'}`} />
                                                 </button>
                                             </div>
                                         </>
                                     )}

                                    {/* SaaS Specifics */}
                                    {agent.site_type === 'saas' && (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">{__('Enable Discounts')}</p>
                                                    <p className="text-xs text-muted-foreground">{__('Allow the agent to offer coupons to customers.')}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleCapability('saas_discounts')}
                                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${capabilities.includes('saas_discounts') ? 'bg-emerald-500' : 'bg-muted'}`}
                                                >
                                                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${capabilities.includes('saas_discounts') ? 'translate-x-5' : 'translate-x-1'}`} />
                                                </button>
                                            </div>

                                            {capabilities.includes('saas_discounts') && (
                                                <div className="ml-4 border-l-2 border-muted pl-4">
                                                    <div className="mt-4">
                                                        <Label htmlFor="saas-coupon-code" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                            {__('Default Coupon Code')}
                                                        </Label>
                                                        <div className="mt-2">
                                                            <Input
                                                                id="saas-coupon-code"
                                                                type="text"
                                                                value={couponCode}
                                                                onChange={(e) => setCouponCode(e.target.value)}
                                                                className="max-w-xs text-sm"
                                                                placeholder="e.g. SAAS25"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">{__('Plan Recommendations')}</p>
                                                    <p className="text-xs text-muted-foreground">{__('Allow the agent to suggest higher-tier plans based on needs.')}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleCapability('saas_plan_recommendations')}
                                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${capabilities.includes('saas_plan_recommendations') ? 'bg-emerald-500' : 'bg-muted'}`}
                                                >
                                                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${capabilities.includes('saas_plan_recommendations') ? 'translate-x-5' : 'translate-x-1'}`} />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">{__('Trial Extensions')}</p>
                                                    <p className="text-xs text-muted-foreground">{__('Allow the agent to offer trial extensions to hesitant users.')}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleCapability('saas_trial_extensions')}
                                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${capabilities.includes('saas_trial_extensions') ? 'bg-emerald-500' : 'bg-muted'}`}
                                                >
                                                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${capabilities.includes('saas_trial_extensions') ? 'translate-x-5' : 'translate-x-1'}`} />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">{__('Technical Troubleshooting')}</p>
                                                    <p className="text-xs text-muted-foreground">{__('Allow the agent to guide users through common technical setup issues.')}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleCapability('saas_troubleshooting')}
                                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${capabilities.includes('saas_troubleshooting') ? 'bg-emerald-500' : 'bg-muted'}`}
                                                >
                                                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${capabilities.includes('saas_troubleshooting') ? 'translate-x-5' : 'translate-x-1'}`} />
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {/* Marketing Specifics */}
                                    {agent.site_type === 'marketing' && (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">{__('Demo Booking')}</p>
                                                    <p className="text-xs text-muted-foreground">{__('Allow the agent to capture demo requests directly.')}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleCapability('marketing_demo_booking')}
                                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${capabilities.includes('marketing_demo_booking') ? 'bg-emerald-500' : 'bg-muted'}`}
                                                >
                                                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${capabilities.includes('marketing_demo_booking') ? 'translate-x-5' : 'translate-x-1'}`} />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">{__('Newsletter Signup')}</p>
                                                    <p className="text-xs text-muted-foreground">{__('Allow the agent to capture newsletter subscriptions.')}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleCapability('marketing_newsletter')}
                                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${capabilities.includes('marketing_newsletter') ? 'bg-emerald-500' : 'bg-muted'}`}
                                                >
                                                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${capabilities.includes('marketing_newsletter') ? 'translate-x-5' : 'translate-x-1'}`} />
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {/* Medical Specifics */}
                                    {agent.site_type === 'medical' && (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">{__('Appointment Requests')}</p>
                                                    <p className="text-xs text-muted-foreground">{__('Allow the agent to capture preferred appointment times as leads.')}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleCapability('appointment_requests')}
                                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${capabilities.includes('appointment_requests') ? 'bg-emerald-500' : 'bg-muted'}`}
                                                >
                                                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${capabilities.includes('appointment_requests') ? 'translate-x-5' : 'translate-x-1'}`} />
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">{__('Treatment Guidance')}</p>
                                                    <p className="text-xs text-muted-foreground">{__('Allow the agent to provide detailed info about treatments and procedures.')}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleCapability('treatment_guidance')}
                                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${capabilities.includes('treatment_guidance') ? 'bg-emerald-500' : 'bg-muted'}`}
                                                >
                                                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${capabilities.includes('treatment_guidance') ? 'translate-x-5' : 'translate-x-1'}`} />
                                                </button>
                                            </div>
                                             <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">{__('Health Plan Information')}</p>
                                                    <p className="text-xs text-muted-foreground">{__('Allow the agent to explain accepted insurance and payment plans.')}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleCapability('health_plans')}
                                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${capabilities.includes('health_plans') ? 'bg-emerald-500' : 'bg-muted'}`}
                                                >
                                                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${capabilities.includes('health_plans') ? 'translate-x-5' : 'translate-x-1'}`} />
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    <div className="border-t pt-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">{__('Lead collection settings')}</p>
                                                <p className="text-xs text-muted-foreground">{__('Configure how you capture visitor information.')}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex items-start gap-3 rounded-md border bg-muted/20 p-3">
                                                <input
                                                    type="checkbox"
                                                    id="require-lead"
                                                    checked={requireLead}
                                                    onChange={(e) => setRequireLead(e.target.checked)}
                                                    className="mt-0.5 size-4 shrink-0 rounded border-border text-foreground focus:ring-2 focus:ring-ring/40"
                                                />
                                                <div className="min-w-0">
                                                    <Label htmlFor="require-lead" className="text-sm font-medium text-foreground cursor-pointer">
                                                        {__('Pre-chat gate (Gating)')}
                                                    </Label>
                                                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                                        {__('Ask for lead information before allowing the visitor to start a chat.')}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                    {__('Lead form fields')}
                                                </Label>
                                                <LeadFormBuilder
                                                    value={leadFormFields}
                                                    onChange={setLeadFormFields}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Generic/Default fallback */}
                                    {(!agent.site_type || agent.site_type === 'generic') && (
                                        <div className="rounded-lg border bg-muted/20 px-3 py-4 text-center">
                                            <p className="text-xs text-muted-foreground">
                                                {__('Choose a specific Site Type in the Vertical section to unlock advanced AI capabilities.')}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-end gap-3 border-t bg-muted/20 px-4 py-3 sm:px-5">
                                    {overridesSaved && <span className="text-xs text-emerald-600 font-medium">{__('Saved')}</span>}
                                    <Button size="sm" onClick={saveOverrides}>{__('Save capabilities')}</Button>
                                </div>
                            </Card>
                        </div>

                        <aside className="grid content-start gap-4">
                            <Card className="overflow-hidden p-0">
                                <div className="border-b px-4 py-4 sm:px-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">
                                                {__('Launch snapshot')}
                                            </p>
                                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                                {__('The operational state for this agent and its visitor-facing widget.')}
                                            </p>
                                        </div>
                                        <Sparkles className="size-4 text-muted-foreground" />
                                    </div>
                                </div>
                                <SettingMetric
                                    label={__('Publishing')}
                                    value={
                                        agent.is_published ? __('Live') : __('Draft')
                                    }
                                    helper={
                                        agent.is_published
                                            ? __('Widget installation is available.')
                                            : __('Publish from the agent workspace before launch.')
                                    }
                                />
                                <SettingMetric
                                    label={__('Allowed origins')}
                                    value={String(originsCount)}
                                    helper={__('Exact domains allowed to load this widget.')}
                                />
                                <SettingMetric
                                    label={__('Auto-indexing')}
                                    value={autoIndex ? __('On') : __('Off')}
                                    helper={__('Visited pages can grow the knowledge base automatically.')}
                                />
                            </Card>

                            <Card className="p-4 sm:p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <Globe2 className="size-4 text-muted-foreground" />
                                            <p className="text-sm font-semibold text-foreground">
                                                {__('Auto-index visited pages')}
                                            </p>
                                        </div>
                                        <p className="mt-2 text-xs leading-5 text-muted-foreground">
                                            {__('When enabled, new visitor pages are queued for crawl and indexing in the background.')}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={autoIndex}
                                        onClick={() =>
                                            toggleAutoIndex(!autoIndex)
                                        }
                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                                            autoIndex
                                                ? 'bg-emerald-500'
                                                : 'bg-muted'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                                                autoIndex
                                                    ? 'translate-x-5'
                                                    : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </div>
                                <div className="mt-4 rounded-lg border bg-muted/25 px-3 py-2 text-xs leading-5 text-muted-foreground">
                                    {__('Auto-skips')} <code>/admin</code>,{' '}
                                    <code>/checkout</code>, <code>/cart</code>,{' '}
                                    <code>/account</code>, {__('and')}{' '}
                                    <code>/login</code>. {__('Capped at 30 pages/hour per agent.')}
                                </div>
                            </Card>

                            <Card
                                className={
                                    'overflow-hidden p-0 ' +
                                    (agent.is_published
                                        ? 'border-emerald-500/30 bg-emerald-500/5'
                                        : 'border-amber-500/25 bg-amber-500/5')
                                }
                            >
                                <div className="border-b px-4 py-4 sm:px-5">
                                    <div className="flex items-start gap-3">
                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background text-muted-foreground shadow-xs">
                                            <LockKeyhole className="size-4" />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-foreground">
                                                {__('Embed on your site')}
                                            </p>
                                            {agent.is_published ? (
                                                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                                    {__('Paste this snippet before')} <code>&lt;/body&gt;</code> {__('on every page that should show the agent.')}
                                                </p>
                                            ) : (
                                                <p className="mt-1 text-xs leading-5 text-amber-700 dark:text-amber-300">
                                                    {__('Publish this agent before the snippet can run for visitors.')}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid gap-3 px-4 py-4 sm:px-5">
                                    <pre className="max-h-36 overflow-auto rounded-lg border bg-background/90 p-3 text-xs leading-5 whitespace-pre-wrap text-foreground">
                                        {embed.snippet}
                                    </pre>
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <Info className="size-3.5" />
                                            {__('One line, async loader')}
                                        </p>
                                        <Button
                                            onClick={copySnippet}
                                            variant="outline"
                                            size="sm"
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="size-3" />
                                                    {__('Copied')}
                                                </>
                                            ) : (
                                                <>
                                                    <Clipboard className="size-3" />
                                                    {__('Copy snippet')}
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </aside>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
