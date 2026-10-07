import { Head, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    CreditCard,
    Database,
    Globe2,
    HardDrive,
    LayoutDashboard,
    Loader2,
    Mail,
    Palette,
    PanelBottom,
    PanelTop,
    Radio,
    Route as RouteIcon,
    Shield,
    Sparkles,
    ToggleRight,
    Upload,
    Wallet,
    Workflow,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import BrandLockup from '@/components/brand-lockup';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { BRAND_DISPLAY_OPTIONS } from '@/lib/brand-display';
import type { BrandDisplayMode } from '@/lib/brand-display';
import { cn } from '@/lib/utils';
import { update as updateSystemSettings } from '@/routes/settings/system';
import MarketingContentEditor from './marketing-content-editor';
import type { MarketingContentFormValue } from './marketing-content-editor';
import PrivacyPolicyEditor from './privacy-policy-editor';
import type { PrivacyPolicyFormValue } from './privacy-policy-editor';

type MailSummary = {
    driver: string;
    host: string | null;
    port: number | null;
    encryption: string | null;
    username: string | null;
    from_address: string | null;
    from_name: string | null;
    configured: boolean;
};

type StripeSummary = {
    public_key: string | null;
    secret: string | null;
    webhook_secret: string | null;
    currency: string | null;
    enabled?: boolean;
    configured: boolean;
};

type PayPalSummary = {
    mode: string;
    client_id: string | null;
    client_secret: string | null;
    webhook_id: string | null;
    enabled: boolean;
    configured: boolean;
};

type RazorpaySummary = {
    key_id: string | null;
    key_secret: string | null;
    webhook_secret: string | null;
    enabled: boolean;
    configured: boolean;
};

type LlmSummary = {
    provider_env: string;
    resolved: 'cloudflare' | 'openrouter' | 'openai' | 'fake';
    cloudflare_account: string | null;
    cloudflare_chat_model: string;
    openai_key: string | null;
    openai_chat_model: string;
    openrouter_key: string | null;
    openrouter_chat_model: string;
    configured: boolean;
};

type CacheSummary = {
    driver: string;
    redis_host: string | null;
    redis_port: string | null;
    configured: boolean;
};

type VectorSummary = {
    provider_env: string;
    resolved: string;
    vectorize_index: string;
    qdrant_url: string | null;
    configured: boolean;
};

type ReverbSummary = {
    app_key: string | null;
    host: string;
    port: number;
    scheme: string;
    configured: boolean;
};

type MarketingSummary = {
    customized: boolean;
};

type PrivacySummary = {
    customized: boolean;
};

type FormValues = {
    stripe_key: string | null;
    stripe_secret_set: boolean;
    stripe_webhook_secret_set: boolean;
    cashier_currency: string | null;
    stripe_enabled: boolean;
    paypal_enabled: boolean;
    razorpay_enabled: boolean;
    paypal_mode: string;
    paypal_client_id: string | null;
    paypal_client_secret_set: boolean;
    paypal_webhook_id: string | null;
    razorpay_key_id: string | null;
    razorpay_key_secret_set: boolean;
    razorpay_webhook_secret_set: boolean;
    cloudflare_account_id: string | null;
    cloudflare_api_token_set: boolean;
    cloudflare_chat_model: string | null;
    cloudflare_embed_model: string | null;
    cloudflare_vectorize_index: string | null;
    openai_api_key_set: boolean;
    openai_chat_model: string | null;
    openai_embed_model: string | null;
    openrouter_api_key_set: boolean;
    openrouter_chat_model: string | null;
    llm_provider: string | null;
    vector_provider: string | null;
    mail_driver: string | null;
    mail_host: string | null;
    mail_port: number | null;
    mail_encryption: string | null;
    mail_username: string | null;
    mail_password_set: boolean;
    mail_from_address: string | null;
    mail_from_name: string | null;
    site_title: string | null;
    header_logo_url: string | null;
    footer_logo_url: string | null;
    dashboard_logo_url: string | null;
    favicon_url: string | null;
    header_brand_display: BrandDisplayMode;
    footer_brand_display: BrandDisplayMode;
    dashboard_brand_display: BrandDisplayMode;
    orbychat_brand_url: string | null;
    orbychat_brand_label: string | null;
    marketing_site_enabled: boolean;
    marketing_home_content: MarketingContentFormValue;
    privacy_policy_content: PrivacyPolicyFormValue;
};

type SettingsPage = 'system' | 'branding' | 'marketing' | 'privacy';

type CronTickRow = {
    at: string | null;
    processed: number;
    failed: number;
    remaining: number;
    ms: number;
};

type CronWorkerSummary = {
    deployed: boolean;
    worker_name: string | null;
    deployed_at: string | null;
    last_status: Record<string, unknown> | null;
    last_status_at: string | null;
    cloudflare_configured: boolean;
    callback_url: string;
    last_tick_at?: string | null;
    seconds_since_last_tick?: number | null;
    liveness?: 'live' | 'stale' | 'dead' | 'unknown';
    ticks_last_hour?: number;
    ticks_last_24h?: number;
    jobs_processed_last_hour?: number;
    jobs_processed_last_24h?: number;
    pending_jobs?: number;
    failed_jobs?: number;
    recent_ticks?: CronTickRow[];
};

type Props = {
    page: SettingsPage;
    sections: {
        mail: MailSummary;
        stripe: StripeSummary;
        paypal: PayPalSummary;
        razorpay: RazorpaySummary;
        llm: LlmSummary;
        cache: CacheSummary;
        vector: VectorSummary;
        reverb: ReverbSummary;
        marketing: MarketingSummary;
        privacy: PrivacySummary;
        cron_worker: CronWorkerSummary;
    };
    form: FormValues;
};

type TestResult = { ok: boolean; message: string } | null;

function StatusPill({ configured }: { configured: boolean }) {
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase ${
                configured
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                    : 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
            }`}
        >
            {configured ? (
                <CheckCircle2 className="size-3" />
            ) : (
                <AlertCircle className="size-3" />
            )}
            {configured ? __('configured') : __('missing')}
        </span>
    );
}

function ResultBanner({ result }: { result: TestResult }) {
    if (result === null) {
        return null;
    }

    return (
        <div
            className={`mt-3 flex items-start gap-2 rounded border p-3 text-xs ${
                result.ok
                    ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400'
                    : 'border-rose-500/30 bg-rose-500/5 text-rose-700 dark:text-rose-400'
            }`}
        >
            {result.ok ? (
                <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            ) : (
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
            )}
            <span className="break-all">{result.message}</span>
        </div>
    );
}

function SectionShell({
    icon: Icon,
    title,
    description,
    statusPill,
    testEndpoint,
    testLabel,
    secondaryTestEndpoint,
    secondaryTestLabel,
    children,
}: {
    icon: LucideIcon;
    title: string;
    description: string;
    statusPill?: React.ReactNode;
    testEndpoint?: string;
    testLabel?: string;
    secondaryTestEndpoint?: string;
    secondaryTestLabel?: string;
    children: React.ReactNode;
}) {
    const [runningPrimary, setRunningPrimary] = useState(false);
    const [runningSecondary, setRunningSecondary] = useState(false);
    const [result, setResult] = useState<TestResult>(null);

    const run = async (endpoint: string, isSecondary: boolean) => {
        if (isSecondary) {
            setRunningSecondary(true);
        } else {
            setRunningPrimary(true);
        }

        setResult(null);

        try {
            const csrf =
                (
                    document.querySelector(
                        'meta[name="csrf-token"]',
                    ) as HTMLMetaElement | null
                )?.content ?? '';
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrf,
                    'X-Requested-With': 'XMLHttpRequest',
                    Accept: 'application/json',
                },
                credentials: 'same-origin',
            });
            const json = (await response.json()) as TestResult;
            setResult(
                json ?? {
                    ok: false,
                    message: `${__('Unexpected response')}: HTTP ${response.status}`,
                },
            );
        } catch (e) {
            setResult({
                ok: false,
                message: e instanceof Error ? e.message : String(e),
            });
        } finally {
            if (isSecondary) {
                setRunningSecondary(false);
            } else {
                setRunningPrimary(false);
            }
        }
    };

    return (
        <Card className="border-border/80 p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-foreground/5 p-2">
                        <Icon className="size-4" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="font-semibold">{title}</h2>
                            {statusPill}
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {description}
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {testEndpoint && (
                        <Button
                            size="sm"
                            variant="outline"
                            type="button"
                            onClick={() => run(testEndpoint, false)}
                            disabled={runningPrimary || runningSecondary}
                        >
                            {runningPrimary ? (
                                <Loader2 className="size-3 animate-spin" />
                            ) : null}
                            {runningPrimary
                                ? __('Testing…')
                                : (testLabel ?? __('Run test'))}
                        </Button>
                    )}
                    {secondaryTestEndpoint && (
                        <Button
                            size="sm"
                            variant="outline"
                            type="button"
                            onClick={() => run(secondaryTestEndpoint, true)}
                            disabled={runningPrimary || runningSecondary}
                        >
                            {runningSecondary ? (
                                <Loader2 className="size-3 animate-spin" />
                            ) : null}
                            {runningSecondary
                                ? __('Testing…')
                                : (secondaryTestLabel ?? __('Run secondary test'))}
                        </Button>
                    )}
                </div>
            </div>
            <div className="space-y-4">{children}</div>
            <ResultBanner result={result} />
        </Card>
    );
}

function BrandSurfacePreview({
    title,
    caption,
    icon: Icon,
    siteTitle,
    logoUrl,
    mode,
    shellClassName,
    logoClassName,
    textClassName,
}: {
    title: string;
    caption: string;
    icon: LucideIcon;
    siteTitle: string;
    logoUrl?: string | null;
    mode: BrandDisplayMode;
    shellClassName?: string;
    logoClassName?: string;
    textClassName?: string;
}) {
    return (
        <div className="rounded-xl border border-border/70 bg-card/80 p-3 shadow-sm">
            <div className="flex items-center gap-2">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-background text-muted-foreground shadow-xs">
                    <Icon className="size-4" />
                </span>
                <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground">
                        {title}
                    </p>
                    <p className="text-[11px] leading-5 text-muted-foreground">
                        {caption}
                    </p>
                </div>
            </div>

            <div
                className={cn(
                    'mt-3 flex min-h-[86px] items-center rounded-xl border border-dashed border-border/70 p-3',
                    shellClassName,
                )}
            >
                <BrandLockup
                    siteTitle={siteTitle}
                    logoUrl={logoUrl}
                    mode={mode}
                    className="min-w-0 gap-2.5"
                    logoClassName={cn('h-9 max-w-[150px]', logoClassName)}
                    textClassName={cn(
                        'truncate text-sm font-semibold tracking-tight text-foreground',
                        textClassName,
                    )}
                />
            </div>
        </div>
    );
}

function FaviconSurfacePreview({
    siteTitle,
    faviconUrl,
}: {
    siteTitle: string;
    faviconUrl?: string | null;
}) {
    const initial = (siteTitle.trim().charAt(0) || 'S').toUpperCase();

    return (
        <div className="rounded-xl border border-border/70 bg-card/80 p-3 shadow-sm">
            <div className="flex items-center gap-2">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-background text-muted-foreground shadow-xs">
                    <Globe2 className="size-4" />
                </span>
                <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground">
                        {__('Browser tab')}
                    </p>
                    <p className="text-[11px] leading-5 text-muted-foreground">
                        {__('Favicon + page title shell')}
                    </p>
                </div>
            </div>

            <div className="mt-3 rounded-xl border border-dashed border-border/70 bg-gradient-to-br from-background to-muted/35 p-3">
                <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-background px-2.5 py-2 shadow-xs">
                    {faviconUrl ? (
                        <img
                            src={faviconUrl}
                            alt=""
                            className="size-4 shrink-0 rounded-[4px] object-contain"
                        />
                    ) : (
                        <span className="flex size-4 shrink-0 items-center justify-center rounded-[4px] bg-foreground text-[10px] font-bold text-background">
                            {initial}
                        </span>
                    )}
                    <span className="truncate text-xs font-medium text-foreground">
                        {siteTitle || __('Site title')}
                    </span>
                </div>
            </div>
        </div>
    );
}

function useSelectedFilePreview(selectedFile: File | null): string | null {
    const previewUrl = useMemo(
        () => (selectedFile ? URL.createObjectURL(selectedFile) : null),
        [selectedFile],
    );

    useEffect(() => {
        if (!previewUrl) {
            return;
        }

        return () => {
            URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    return previewUrl;
}

function SecretInput({
    id,
    value,
    isSet,
    onChange,
    placeholder = __('Leave blank to keep current'),
}: {
    id: string;
    value: string;
    isSet: boolean;
    onChange: (v: string) => void;
    placeholder?: string;
}) {
    return (
        <Input
            id={id}
            type="password"
            autoComplete="off"
            spellCheck={false}
            value={value}
            placeholder={
                isSet ? __('•••• stored — leave blank to keep') : placeholder
            }
            onChange={(e) => onChange(e.target.value)}
        />
    );
}

function StripeSection({
    summary,
    initial,
}: {
    summary: StripeSummary;
    initial: FormValues;
}) {
    const form = useForm<{
        stripe_key: string;
        stripe_secret: string;
        stripe_webhook_secret: string;
        cashier_currency: string;
    }>({
        stripe_key: initial.stripe_key ?? '',
        stripe_secret: '',
        stripe_webhook_secret: '',
        cashier_currency: initial.cashier_currency ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.patch('/settings/system/stripe', { preserveScroll: true });
    };

    return (
        <SectionShell
            icon={CreditCard}
            title={__('Stripe')}
            description={__('Subscription billing, webhook signatures, and Cashier.')}
            statusPill={<StatusPill configured={summary.configured} />}
            testEndpoint="/settings/system/test/stripe"
        >
            <form onSubmit={submit} className="grid gap-3">
                <div className="grid gap-1">
                    <Label htmlFor="stripe_key">{__('Public key')}</Label>
                    <Input
                        id="stripe_key"
                        autoComplete="off"
                        value={form.data.stripe_key}
                        onChange={(e) =>
                            form.setData('stripe_key', e.target.value)
                        }
                        placeholder="pk_live_…"
                    />
                </div>
                <div className="grid gap-1">
                    <Label htmlFor="stripe_secret">{__('Secret key')}</Label>
                    <SecretInput
                        id="stripe_secret"
                        value={form.data.stripe_secret}
                        isSet={initial.stripe_secret_set}
                        onChange={(v) => form.setData('stripe_secret', v)}
                        placeholder="sk_live_…"
                    />
                </div>
                <div className="grid gap-1">
                    <Label htmlFor="stripe_webhook_secret">
                        {__('Webhook signing secret')}
                    </Label>
                    <SecretInput
                        id="stripe_webhook_secret"
                        value={form.data.stripe_webhook_secret}
                        isSet={initial.stripe_webhook_secret_set}
                        onChange={(v) =>
                            form.setData('stripe_webhook_secret', v)
                        }
                        placeholder="whsec_…"
                    />
                </div>
                <div className="grid gap-1">
                    <Label htmlFor="cashier_currency">{__('Currency')}</Label>
                    <Input
                        id="cashier_currency"
                        autoComplete="off"
                        value={form.data.cashier_currency}
                        onChange={(e) =>
                            form.setData('cashier_currency', e.target.value)
                        }
                        placeholder="usd"
                    />
                </div>
                <div className="flex justify-end">
                    <Button type="submit" disabled={form.processing}>
                        {__('Save Stripe')}
                    </Button>
                </div>
            </form>
        </SectionShell>
    );
}

function PayPalSection({
    summary,
    initial,
}: {
    summary: PayPalSummary;
    initial: FormValues;
}) {
    const form = useForm<{
        paypal_mode: string;
        paypal_client_id: string;
        paypal_client_secret: string;
        paypal_webhook_id: string;
    }>({
        paypal_mode: initial.paypal_mode || 'sandbox',
        paypal_client_id: initial.paypal_client_id ?? '',
        paypal_client_secret: '',
        paypal_webhook_id: initial.paypal_webhook_id ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.patch('/settings/system/paypal', { preserveScroll: true });
    };

    return (
        <SectionShell
            icon={Wallet}
            title={__('PayPal')}
            description={__('Subscriptions via PayPal Billing Plans (sandbox or live mode).')}
            statusPill={<StatusPill configured={summary.configured} />}
            testEndpoint="/settings/system/test/paypal"
        >
            <form onSubmit={submit} className="grid gap-3">
                <div className="grid gap-1">
                    <Label htmlFor="paypal_mode">{__('Mode')}</Label>
                    <Select
                        value={form.data.paypal_mode || 'sandbox'}
                        onValueChange={(v) => form.setData('paypal_mode', v)}
                    >
                        <SelectTrigger id="paypal_mode">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="sandbox">sandbox</SelectItem>
                            <SelectItem value="live">live</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-1">
                    <Label htmlFor="paypal_client_id">{__('Client ID')}</Label>
                    <Input
                        id="paypal_client_id"
                        autoComplete="off"
                        value={form.data.paypal_client_id}
                        onChange={(e) =>
                            form.setData('paypal_client_id', e.target.value)
                        }
                        placeholder="Axx…"
                    />
                </div>
                <div className="grid gap-1">
                    <Label htmlFor="paypal_client_secret">{__('Client secret')}</Label>
                    <SecretInput
                        id="paypal_client_secret"
                        value={form.data.paypal_client_secret}
                        isSet={initial.paypal_client_secret_set}
                        onChange={(v) =>
                            form.setData('paypal_client_secret', v)
                        }
                        placeholder="EFx…"
                    />
                </div>
                <div className="grid gap-1">
                    <Label htmlFor="paypal_webhook_id">{__('Webhook ID')}</Label>
                    <Input
                        id="paypal_webhook_id"
                        autoComplete="off"
                        value={form.data.paypal_webhook_id}
                        onChange={(e) =>
                            form.setData('paypal_webhook_id', e.target.value)
                        }
                        placeholder="WH-…"
                    />
                </div>
                <div className="flex justify-end">
                    <Button type="submit" disabled={form.processing}>
                        {__('Save PayPal')}
                    </Button>
                </div>
            </form>
        </SectionShell>
    );
}

function RazorpaySection({
    summary,
    initial,
}: {
    summary: RazorpaySummary;
    initial: FormValues;
}) {
    const form = useForm<{
        razorpay_key_id: string;
        razorpay_key_secret: string;
        razorpay_webhook_secret: string;
    }>({
        razorpay_key_id: initial.razorpay_key_id ?? '',
        razorpay_key_secret: '',
        razorpay_webhook_secret: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.patch('/settings/system/razorpay', { preserveScroll: true });
    };

    return (
        <SectionShell
            icon={Wallet}
            title={__('Razorpay')}
            description={__('Subscriptions via Razorpay Plans + Subscriptions API (UPI, cards, netbanking).')}
            statusPill={<StatusPill configured={summary.configured} />}
            testEndpoint="/settings/system/test/razorpay"
        >
            <form onSubmit={submit} className="grid gap-3">
                <div className="grid gap-1">
                    <Label htmlFor="razorpay_key_id">{__('Key ID')}</Label>
                    <Input
                        id="razorpay_key_id"
                        autoComplete="off"
                        value={form.data.razorpay_key_id}
                        onChange={(e) =>
                            form.setData('razorpay_key_id', e.target.value)
                        }
                        placeholder="rzp_test_…"
                    />
                </div>
                <div className="grid gap-1">
                    <Label htmlFor="razorpay_key_secret">{__('Key secret')}</Label>
                    <SecretInput
                        id="razorpay_key_secret"
                        value={form.data.razorpay_key_secret}
                        isSet={initial.razorpay_key_secret_set}
                        onChange={(v) => form.setData('razorpay_key_secret', v)}
                        placeholder={__('Key secret from dashboard')}
                    />
                </div>
                <div className="grid gap-1">
                    <Label htmlFor="razorpay_webhook_secret">
                        {__('Webhook secret')}
                    </Label>
                    <SecretInput
                        id="razorpay_webhook_secret"
                        value={form.data.razorpay_webhook_secret}
                        isSet={initial.razorpay_webhook_secret_set}
                        onChange={(v) =>
                            form.setData('razorpay_webhook_secret', v)
                        }
                        placeholder={__('Webhook signing secret')}
                    />
                </div>
                <div className="flex justify-end">
                    <Button type="submit" disabled={form.processing}>
                        {__('Save Razorpay')}
                    </Button>
                </div>
            </form>
        </SectionShell>
    );
}

function GatewayTogglesSection({ initial }: { initial: FormValues }) {
    const form = useForm<{
        stripe_enabled: boolean;
        paypal_enabled: boolean;
        razorpay_enabled: boolean;
    }>({
        stripe_enabled: initial.stripe_enabled,
        paypal_enabled: initial.paypal_enabled,
        razorpay_enabled: initial.razorpay_enabled,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.patch('/settings/system/gateways', { preserveScroll: true });
    };

    const toggle = (
        key: 'stripe_enabled' | 'paypal_enabled' | 'razorpay_enabled',
    ) => (
        <label className="flex cursor-pointer items-center justify-between rounded border border-border p-3 text-sm">
            <span className="capitalize">{key.replace('_enabled', '')}</span>
            <input
                type="checkbox"
                checked={form.data[key]}
                onChange={(e) => form.setData(key, e.target.checked)}
            />
        </label>
    );

    return (
        <SectionShell
            icon={ToggleRight}
            title={__('Payment gateways')}
            description={__('Enable or disable each gateway. Disabled gateways never appear on the customer billing page, even when credentials are configured.')}
        >
            <form onSubmit={submit} className="grid gap-3">
                <div className="grid gap-2 sm:grid-cols-3">
                    {toggle('stripe_enabled')}
                    {toggle('paypal_enabled')}
                    {toggle('razorpay_enabled')}
                </div>
                <div className="flex justify-end">
                    <Button type="submit" disabled={form.processing}>
                        {__('Save gateway toggles')}
                    </Button>
                </div>
            </form>
        </SectionShell>
    );
}

function CloudflareSection({
    summary,
    initial,
}: {
    summary: LlmSummary;
    initial: FormValues;
}) {
    const form = useForm<{
        cloudflare_account_id: string;
        cloudflare_api_token: string;
        cloudflare_chat_model: string;
        cloudflare_embed_model: string;
        cloudflare_vectorize_index: string;
    }>({
        cloudflare_account_id: initial.cloudflare_account_id ?? '',
        cloudflare_api_token: '',
        cloudflare_chat_model: initial.cloudflare_chat_model ?? '',
        cloudflare_embed_model: initial.cloudflare_embed_model ?? '',
        cloudflare_vectorize_index: initial.cloudflare_vectorize_index ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.patch('/settings/system/cloudflare', { preserveScroll: true });
    };

    return (
        <SectionShell
            icon={Sparkles}
            title={__('Cloudflare (Workers AI + Vectorize)')}
            description={__('Default chat / embed / vector provider when keys are present.')}
            statusPill={
                <StatusPill configured={summary.resolved === 'cloudflare'} />
            }
        >
            <form onSubmit={submit} className="grid gap-3">
                <div className="grid gap-1">
                    <Label htmlFor="cloudflare_account_id">{__('Account ID')}</Label>
                    <Input
                        id="cloudflare_account_id"
                        autoComplete="off"
                        value={form.data.cloudflare_account_id}
                        onChange={(e) =>
                            form.setData(
                                'cloudflare_account_id',
                                e.target.value,
                            )
                        }
                    />
                </div>
                <div className="grid gap-1">
                    <Label htmlFor="cloudflare_api_token">{__('API token')}</Label>
                    <SecretInput
                        id="cloudflare_api_token"
                        value={form.data.cloudflare_api_token}
                        isSet={initial.cloudflare_api_token_set}
                        onChange={(v) =>
                            form.setData('cloudflare_api_token', v)
                        }
                    />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="grid gap-1">
                        <Label htmlFor="cloudflare_chat_model">
                            {__('Chat model')}
                        </Label>
                        <Input
                            id="cloudflare_chat_model"
                            autoComplete="off"
                            value={form.data.cloudflare_chat_model}
                            onChange={(e) =>
                                form.setData(
                                    'cloudflare_chat_model',
                                    e.target.value,
                                )
                            }
                            placeholder="@cf/meta/llama-3.3-70b-instruct-fp8-fast"
                        />
                    </div>
                    <div className="grid gap-1">
                        <Label htmlFor="cloudflare_embed_model">
                            {__('Embed model')}
                        </Label>
                        <Input
                            id="cloudflare_embed_model"
                            autoComplete="off"
                            value={form.data.cloudflare_embed_model}
                            onChange={(e) =>
                                form.setData(
                                    'cloudflare_embed_model',
                                    e.target.value,
                                )
                            }
                            placeholder="@cf/baai/bge-base-en-v1.5"
                        />
                    </div>
                </div>
                <div className="grid gap-1">
                    <Label htmlFor="cloudflare_vectorize_index">
                        {__('Vectorize index')}
                    </Label>
                    <Input
                        id="cloudflare_vectorize_index"
                        autoComplete="off"
                        value={form.data.cloudflare_vectorize_index}
                        onChange={(e) =>
                            form.setData(
                                'cloudflare_vectorize_index',
                                e.target.value,
                            )
                        }
                        placeholder="orbychat-chunks"
                    />
                </div>
                <div className="flex justify-end">
                    <Button type="submit" disabled={form.processing}>
                        {__('Save Cloudflare')}
                    </Button>
                </div>
            </form>
        </SectionShell>
    );
}

function OpenAiSection({ initial }: { initial: FormValues }) {
    const form = useForm<{
        openai_api_key: string;
        openai_chat_model: string;
        openai_embed_model: string;
    }>({
        openai_api_key: '',
        openai_chat_model: initial.openai_chat_model ?? '',
        openai_embed_model: initial.openai_embed_model ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.patch('/settings/system/openai', { preserveScroll: true });
    };

    return (
        <SectionShell
            icon={Sparkles}
            title={__('OpenAI')}
            description={__('Fallback / quality-bump for chat + embed fallback when CF embed fails.')}
            statusPill={<StatusPill configured={initial.openai_api_key_set} />}
        >
            <form onSubmit={submit} className="grid gap-3">
                <div className="grid gap-1">
                    <Label htmlFor="openai_api_key">{__('API key')}</Label>
                    <SecretInput
                        id="openai_api_key"
                        value={form.data.openai_api_key}
                        isSet={initial.openai_api_key_set}
                        onChange={(v) => form.setData('openai_api_key', v)}
                        placeholder="sk-…"
                    />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="grid gap-1">
                        <Label htmlFor="openai_chat_model">{__('Chat model')}</Label>
                        <Input
                            id="openai_chat_model"
                            autoComplete="off"
                            value={form.data.openai_chat_model}
                            onChange={(e) =>
                                form.setData(
                                    'openai_chat_model',
                                    e.target.value,
                                )
                            }
                            placeholder="gpt-4o-mini"
                        />
                    </div>
                    <div className="grid gap-1">
                        <Label htmlFor="openai_embed_model">{__('Embed model')}</Label>
                        <Input
                            id="openai_embed_model"
                            autoComplete="off"
                            value={form.data.openai_embed_model}
                            onChange={(e) =>
                                form.setData(
                                    'openai_embed_model',
                                    e.target.value,
                                )
                            }
                            placeholder="text-embedding-3-small"
                        />
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button type="submit" disabled={form.processing}>
                        {__('Save OpenAI')}
                    </Button>
                </div>
            </form>
        </SectionShell>
    );
}

function OpenRouterSection({ initial }: { initial: FormValues }) {
    const form = useForm<{
        openrouter_api_key: string;
        openrouter_chat_model: string;
    }>({
        openrouter_api_key: '',
        openrouter_chat_model: initial.openrouter_chat_model ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.patch('/settings/system/openrouter', { preserveScroll: true });
    };

    return (
        <SectionShell
            icon={Sparkles}
            title={__('OpenRouter')}
            description={__('Free-tier chat models. Only used when LLM_PROVIDER is set to openrouter explicitly.')}
            statusPill={
                <StatusPill configured={initial.openrouter_api_key_set} />
            }
        >
            <form onSubmit={submit} className="grid gap-3">
                <div className="grid gap-1">
                    <Label htmlFor="openrouter_api_key">{__('API key')}</Label>
                    <SecretInput
                        id="openrouter_api_key"
                        value={form.data.openrouter_api_key}
                        isSet={initial.openrouter_api_key_set}
                        onChange={(v) => form.setData('openrouter_api_key', v)}
                        placeholder="sk-or-…"
                    />
                </div>
                <div className="grid gap-1">
                    <Label htmlFor="openrouter_chat_model">{__('Chat model')}</Label>
                    <Input
                        id="openrouter_chat_model"
                        autoComplete="off"
                        value={form.data.openrouter_chat_model}
                        onChange={(e) =>
                            form.setData(
                                'openrouter_chat_model',
                                e.target.value,
                            )
                        }
                        placeholder="meta-llama/llama-3.3-70b-instruct:free"
                    />
                </div>
                <div className="flex justify-end">
                    <Button type="submit" disabled={form.processing}>
                        {__('Save OpenRouter')}
                    </Button>
                </div>
            </form>
        </SectionShell>
    );
}

function RoutingSection({ initial }: { initial: FormValues }) {
    const form = useForm<{
        llm_provider: string;
        vector_provider: string;
    }>({
        llm_provider: initial.llm_provider ?? '',
        vector_provider: initial.vector_provider ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.patch('/settings/system/routing', { preserveScroll: true });
    };

    return (
        <SectionShell
            icon={RouteIcon}
            title={__('Provider routing')}
            description={__('Force a specific LLM or vector provider. Leave blank to auto-pick from configured keys.')}
        >
            <form onSubmit={submit} className="grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="grid gap-1">
                        <Label htmlFor="llm_provider">LLM_PROVIDER</Label>
                        <Select
                            value={form.data.llm_provider || 'auto'}
                            onValueChange={(v) =>
                                form.setData(
                                    'llm_provider',
                                    v === 'auto' ? '' : v,
                                )
                            }
                        >
                            <SelectTrigger id="llm_provider">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="auto">
                                    {__('auto (from keys)')}
                                </SelectItem>
                                <SelectItem value="cloudflare">
                                    cloudflare
                                </SelectItem>
                                <SelectItem value="openai">openai</SelectItem>
                                <SelectItem value="openrouter">
                                    openrouter
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-1">
                        <Label htmlFor="vector_provider">VECTOR_PROVIDER</Label>
                        <Select
                            value={form.data.vector_provider || 'auto'}
                            onValueChange={(v) =>
                                form.setData(
                                    'vector_provider',
                                    v === 'auto' ? '' : v,
                                )
                            }
                        >
                            <SelectTrigger id="vector_provider">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="auto">
                                    {__('auto (from keys)')}
                                </SelectItem>
                                <SelectItem value="cloudflare">
                                    cloudflare
                                </SelectItem>
                                <SelectItem value="qdrant">qdrant</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button type="submit" disabled={form.processing}>
                        {__('Save routing')}
                    </Button>
                </div>
            </form>
        </SectionShell>
    );
}

function MailSection({
    summary,
    initial,
}: {
    summary: MailSummary;
    initial: FormValues;
}) {
    const form = useForm<{
        mail_driver: string;
        mail_host: string;
        mail_port: string;
        mail_encryption: string;
        mail_username: string;
        mail_password: string;
        mail_from_address: string;
        mail_from_name: string;
    }>({
        mail_driver: initial.mail_driver ?? '',
        mail_host: initial.mail_host ?? '',
        mail_port: initial.mail_port ? String(initial.mail_port) : '',
        mail_encryption: initial.mail_encryption ?? '',
        mail_username: initial.mail_username ?? '',
        mail_password: '',
        mail_from_address: initial.mail_from_address ?? '',
        mail_from_name: initial.mail_from_name ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.patch('/settings/system/mail', { preserveScroll: true });
    };

    return (
        <SectionShell
            icon={Mail}
            title={__('Mail (SMTP)')}
            description={__('Outbound transactional email. Raw SMTP test probes the mail driver only. Lead-email test goes through the queue worker too  —  use it to confirm the full lead-captured pipeline.')}
            statusPill={<StatusPill configured={summary.configured} />}
            testEndpoint="/settings/system/test/mail"
            testLabel={__('Send raw SMTP test')}
            secondaryTestEndpoint="/settings/system/test/lead-email"
            secondaryTestLabel={__('Send test lead email')}
        >
            <form onSubmit={submit} className="grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="grid gap-1">
                        <Label htmlFor="mail_driver">{__('Driver')}</Label>
                        <Input
                            id="mail_driver"
                            autoComplete="off"
                            value={form.data.mail_driver}
                            onChange={(e) =>
                                form.setData('mail_driver', e.target.value)
                            }
                            placeholder="smtp"
                        />
                    </div>
                    <div className="grid gap-1">
                        <Label htmlFor="mail_host">{__('Host')}</Label>
                        <Input
                            id="mail_host"
                            autoComplete="off"
                            value={form.data.mail_host}
                            onChange={(e) =>
                                form.setData('mail_host', e.target.value)
                            }
                            placeholder="smtp.example.com"
                        />
                    </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                    <div className="grid gap-1">
                        <Label htmlFor="mail_port">{__('Port')}</Label>
                        <Input
                            id="mail_port"
                            type="number"
                            autoComplete="off"
                            value={form.data.mail_port}
                            onChange={(e) =>
                                form.setData('mail_port', e.target.value)
                            }
                            placeholder="587"
                        />
                    </div>
                    <div className="grid gap-1">
                        <Label htmlFor="mail_encryption">{__('Encryption')}</Label>
                        <Select
                            value={form.data.mail_encryption || 'none'}
                            onValueChange={(v) =>
                                form.setData(
                                    'mail_encryption',
                                    v === 'none' ? '' : v,
                                )
                            }
                        >
                            <SelectTrigger id="mail_encryption">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">none</SelectItem>
                                <SelectItem value="tls">tls</SelectItem>
                                <SelectItem value="ssl">ssl</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-1">
                        <Label htmlFor="mail_username">{__('Username')}</Label>
                        <Input
                            id="mail_username"
                            autoComplete="off"
                            value={form.data.mail_username}
                            onChange={(e) =>
                                form.setData('mail_username', e.target.value)
                            }
                        />
                    </div>
                </div>
                <div className="grid gap-1">
                    <Label htmlFor="mail_password">{__('Password')}</Label>
                    <SecretInput
                        id="mail_password"
                        value={form.data.mail_password}
                        isSet={initial.mail_password_set}
                        onChange={(v) => form.setData('mail_password', v)}
                    />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="grid gap-1">
                        <Label htmlFor="mail_from_address">{__('From address')}</Label>
                        <Input
                            id="mail_from_address"
                            type="email"
                            autoComplete="off"
                            value={form.data.mail_from_address}
                            onChange={(e) =>
                                form.setData(
                                    'mail_from_address',
                                    e.target.value,
                                )
                            }
                            placeholder="hello@example.com"
                        />
                    </div>
                    <div className="grid gap-1">
                        <Label htmlFor="mail_from_name">{__('From name')}</Label>
                        <Input
                            id="mail_from_name"
                            autoComplete="off"
                            value={form.data.mail_from_name}
                            onChange={(e) =>
                                form.setData('mail_from_name', e.target.value)
                            }
                            placeholder="OrbyChat"
                        />
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button type="submit" disabled={form.processing}>
                        {__('Save mail')}
                    </Button>
                </div>
            </form>
        </SectionShell>
    );
}

function CronWorkerHealth({ summary }: { summary: CronWorkerSummary }) {
    const liveness = summary.liveness ?? 'unknown';
    const sinceLast = summary.seconds_since_last_tick;
    const lastTickAt = summary.last_tick_at;
    const recent = summary.recent_ticks ?? [];

    const livenessTone =
        liveness === 'live'
            ? 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100'
            : liveness === 'stale'
              ? 'border-amber-300 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100'
              : liveness === 'dead'
                ? 'border-rose-300 bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-100'
                : 'border-slate-300 bg-slate-50 text-slate-900 dark:bg-slate-900/40 dark:text-slate-100';

    const livenessLabel =
        liveness === 'live'
            ? __('Live  —  firing on schedule')
            : liveness === 'stale'
              ? __('Stale  —  last tick > 90s ago')
              : liveness === 'dead'
                ? __('Dead  —  no tick in last 5 minutes')
                : __('Waiting for first tick');

    const sinceText = (() => {
        if (sinceLast === null || sinceLast === undefined) {
            return __('No ticks yet  —  give the cron 60s after deploy.');
        }

        if (sinceLast < 60) {
            return `${__('Last tick')} ${sinceLast}s ${__('ago')}`;
        }

        const m = Math.floor(sinceLast / 60);
        const s = sinceLast % 60;

        return `${__('Last tick')} ${m}m ${s}s ${__('ago')}`;
    })();

    return (
        <div className="grid gap-3">
            <div className={`rounded-md border p-4 ${livenessTone}`}>
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold">{livenessLabel}</p>
                        <p className="mt-0.5 text-xs opacity-80">
                            {sinceText}
                            {lastTickAt && (
                                <>
                                    {' -· '}
                                    {new Date(lastTickAt).toLocaleString()}
                                </>
                            )}
                        </p>
                    </div>
                    <span
                        className={`inline-flex size-2.5 rounded-full ${
                            liveness === 'live'
                                ? 'animate-pulse bg-emerald-500'
                                : liveness === 'stale'
                                  ? 'bg-amber-500'
                                  : liveness === 'dead'
                                    ? 'bg-rose-500'
                                    : 'bg-slate-400'
                        }`}
                    />
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
                <HealthStat
                    label={__('Ticks (last hour)')}
                    value={summary.ticks_last_hour ?? 0}
                    hint={__('should be -‰ˆ 60 when live')}
                />
                <HealthStat
                    label={__('Jobs processed (1h)')}
                    value={summary.jobs_processed_last_hour ?? 0}
                />
                <HealthStat
                    label={__('Pending in queue')}
                    value={summary.pending_jobs ?? 0}
                    tone={(summary.pending_jobs ?? 0) > 100 ? 'warn' : 'normal'}
                />
                <HealthStat
                    label={__('Failed jobs')}
                    value={summary.failed_jobs ?? 0}
                    tone={(summary.failed_jobs ?? 0) > 0 ? 'warn' : 'normal'}
                />
            </div>

            {recent.length > 0 && (
                <details className="rounded-md border border-border bg-muted/20 p-3">
                    <summary className="cursor-pointer text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                        {__('Recent ticks')} ({recent.length})
                    </summary>
                    <div className="mt-3 overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-border text-left text-muted-foreground">
                                    <th className="px-2 py-1.5 font-medium">
                                        {__('When')}
                                    </th>
                                    <th className="px-2 py-1.5 font-medium">
                                        {__('Processed')}
                                    </th>
                                    <th className="px-2 py-1.5 font-medium">
                                        {__('Failed')}
                                    </th>
                                    <th className="px-2 py-1.5 font-medium">
                                        {__('Remaining')}
                                    </th>
                                    <th className="px-2 py-1.5 font-medium">
                                        {__('Elapsed')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="font-mono">
                                {recent.map((r, i) => (
                                    <tr
                                        key={i}
                                        className="border-b border-border/40 last:border-0"
                                    >
                                        <td className="px-2 py-1.5">
                                            {r.at
                                                ? new Date(
                                                      r.at,
                                                  ).toLocaleTimeString()
                                                : '-'}
                                        </td>
                                        <td className="px-2 py-1.5 text-emerald-700">
                                            {r.processed}
                                        </td>
                                        <td
                                            className={`px-2 py-1.5 ${r.failed > 0 ? 'text-rose-600' : ''}`}
                                        >
                                            {r.failed}
                                        </td>
                                        <td className="px-2 py-1.5">
                                            {r.remaining}
                                        </td>
                                        <td className="px-2 py-1.5">
                                            {r.ms} ms
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </details>
            )}
        </div>
    );
}

function HealthStat({
    label,
    value,
    hint,
    tone = 'normal',
}: {
    label: string;
    value: number | string;
    hint?: string;
    tone?: 'normal' | 'warn';
}) {
    return (
        <div
            className={`rounded-md border p-3 ${
                tone === 'warn'
                    ? 'border-amber-300 bg-amber-50/40'
                    : 'border-border bg-muted/20'
            }`}
        >
            <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                {label}
            </p>
            <p className="mt-1 font-mono text-lg font-semibold">{value}</p>
            {hint && (
                <p className="mt-0.5 text-[10px] text-muted-foreground/80">
                    {hint}
                </p>
            )}
        </div>
    );
}

function CronWorkerSection({ summary }: { summary: CronWorkerSummary }) {
    const [pending, setPending] = useState(false);
    const [result, setResult] = useState<{
        ok: boolean;
        message: string;
        worker_url?: string;
    } | null>(null);
    const [deployed, setDeployed] = useState(summary.deployed);
    const [workerName, setWorkerName] = useState(summary.worker_name);
    const [deployedAt, setDeployedAt] = useState(summary.deployed_at);

    const csrf =
        (
            document.querySelector(
                'meta[name="csrf-token"]',
            ) as HTMLMetaElement | null
        )?.content ?? '';

    const call = async (
        method: 'POST' | 'DELETE',
        path: string,
    ): Promise<Response> => {
        return fetch(path, {
            method,
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-CSRF-TOKEN': csrf,
                'X-Requested-With': 'XMLHttpRequest',
            },
        });
    };

    const onDeploy = async () => {
        setPending(true);
        setResult(null);

        try {
            const res = await call(
                'POST',
                '/settings/system/cron-worker/deploy',
            );
            const json = await res.json();

            if (!res.ok) {
                setResult({
                    ok: false,
                    message:
                        json?.error?.message ??
                        `${__('Deploy failed')} (HTTP ${res.status}).`,
                });

                return;
            }

            const data = json.data;
            setDeployed(true);
            setWorkerName(data.worker_name);
            setDeployedAt(data.deployed_at);
            setResult({
                ok: true,
                message:
                    __('Deployed. Cloudflare will run the worker every minute.'),
                worker_url: data.worker_url,
            });
        } catch (e) {
            setResult({
                ok: false,
                message:
                    e instanceof Error
                        ? e.message
                        : __('Network error reaching the deploy endpoint.'),
            });
        } finally {
            setPending(false);
        }
    };

    const onRemove = async () => {
        if (
            !confirm(
                __('Remove the deployed Cloudflare worker? Your queue will stop processing until you re-deploy or set up another cron source.')
            )
        ) {
            return;
        }

        setPending(true);
        setResult(null);

        try {
            const res = await call('DELETE', '/settings/system/cron-worker');

            if (!res.ok) {
                const json = await res.json();
                setResult({
                    ok: false,
                    message:
                        json?.error?.message ??
                        `${__('Remove failed')} (HTTP ${res.status}).`,
                });

                return;
            }

            setDeployed(false);
            setWorkerName(null);
            setDeployedAt(null);
            setResult({ ok: true, message: __('Worker removed.') });
        } catch (e) {
            setResult({
                ok: false,
                message: e instanceof Error ? e.message : __('Network error.'),
            });
        } finally {
            setPending(false);
        }
    };

    return (
        <SectionShell
            icon={Workflow}
            title={__('Cloudflare Cron Worker')}
            description={__('One-click deploy: run your queue from Cloudflare\'s free cron infrastructure. No cPanel cron required.')}
            statusPill={<StatusPill configured={deployed} />}
        >
            <div className="grid gap-4">
                {!summary.cloudflare_configured && (
                    <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                        {__('Save your Cloudflare account ID + API token under :providers first. The same credentials drive Workers AI and the queue cron.', { providers: __('AI providers → Cloudflare') })}
                    </div>
                )}

                {deployed && <CronWorkerHealth summary={summary} />}

                <div className="rounded-md border border-border bg-muted/30 p-3 text-xs">
                    <p className="text-muted-foreground">
                        {__('The worker pings this endpoint every minute:')}
                    </p>
                    <p className="mt-1 font-mono break-all">
                        POST {summary.callback_url}
                    </p>
                </div>

                {deployed ? (
                    <div className="rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm dark:bg-emerald-950/40">
                        <p className="font-medium text-emerald-900 dark:text-emerald-100">
                            {__('Deployed')}
                        </p>
                        <p className="mt-1 text-xs text-emerald-800/80 dark:text-emerald-200/80">
                            {__('Worker name')}:{' '}
                            <span className="font-mono">{workerName}</span>
                            {deployedAt && (
                                <>
                                    {' '}
                                    -· {__('deployed')} {' '}
                                    {new Date(deployedAt).toLocaleString()}
                                </>
                            )}
                        </p>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        {__('Not deployed yet. Click the button to push the worker to your Cloudflare account.')}
                    </p>
                )}

                {result && (
                    <div
                        className={`rounded-md border p-3 text-sm ${result.ok ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : 'border-rose-300 bg-rose-50 text-rose-900'}`}
                    >
                        {result.message}
                        {result.worker_url && (
                            <>
                                {' '}
                                <a
                                    className="underline"
                                    href={result.worker_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {__('Open in Cloudflare dashboard')} -†—
                                </a>
                            </>
                        )}
                    </div>
                )}

                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        onClick={onDeploy}
                        disabled={pending || !summary.cloudflare_configured}
                    >
                        {pending && <Loader2 className="size-4 animate-spin" />}
                        {deployed ? __('Re-deploy worker') : __('Deploy worker')}
                    </Button>
                    {deployed && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onRemove}
                            disabled={pending}
                        >
                            {__('Remove worker')}
                        </Button>
                    )}
                </div>
            </div>
        </SectionShell>
    );
}

function BrandingAssetField({
    id,
    label,
    description,
    surfaceLabel,
    icon: Icon,
    accept,
    currentUrl,
    selectedFile,
    fileName,
    error,
    onChange,
    siteTitle,
    displayMode,
    onDisplayModeChange,
    previewClassName,
    surfacePreviewClassName,
    secondaryPreviewLabel,
    secondaryPreview,
}: {
    id: string;
    label: string;
    description: string;
    surfaceLabel: string;
    icon: LucideIcon;
    accept: string;
    currentUrl: string | null;
    selectedFile: File | null;
    fileName?: string;
    error?: string;
    onChange: (file: File | null) => void;
    siteTitle: string;
    displayMode?: BrandDisplayMode;
    onDisplayModeChange?: (value: BrandDisplayMode) => void;
    previewClassName?: string;
    surfacePreviewClassName?: string;
    secondaryPreviewLabel?: string;
    secondaryPreview?:
        | React.ReactNode
        | ((previewUrl: string | null) => React.ReactNode);
}) {
    const selectedPreviewUrl = useSelectedFilePreview(selectedFile);

    const assetPreviewUrl = selectedPreviewUrl ?? currentUrl;
    const supportsDisplayMode =
        displayMode !== undefined && onDisplayModeChange !== undefined;
    const hasSecondaryPreview =
        supportsDisplayMode || secondaryPreview !== undefined;
    const renderedSecondaryPreview =
        typeof secondaryPreview === 'function'
            ? secondaryPreview(assetPreviewUrl)
            : secondaryPreview;
    const uploadHint = fileName
        ? `${__('Selected file')}: ${fileName}`
        : __('PNG, JPG, SVG, or WEBP. Use a wider wordmark for public surfaces and a compact mark for dashboard surfaces.');

    return (
        <div className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
            <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="max-w-2xl min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-muted/20 text-muted-foreground shadow-xs">
                                <Icon className="size-4" />
                            </span>
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Label
                                        htmlFor={id}
                                        className="text-sm font-semibold"
                                    >
                                        {label}
                                    </Label>
                                    <Badge
                                        variant="outline"
                                        className="border-border/70 bg-background/80 px-2 py-1 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase"
                                    >
                                        {surfaceLabel}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            {description}
                        </p>
                    </div>

                    {supportsDisplayMode ? (
                        <div className="grid gap-2 md:w-[220px] md:shrink-0">
                            <Label htmlFor={`${id}_display`}>
                                {__('Display mode')}
                            </Label>
                            <Select
                                value={displayMode}
                                onValueChange={(value) =>
                                    onDisplayModeChange(
                                        value as BrandDisplayMode,
                                    )
                                }
                            >
                                <SelectTrigger id={`${id}_display`}>
                                    <SelectValue placeholder={__('Choose display mode')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {BRAND_DISPLAY_OPTIONS.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {__(option.label)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-[11px] leading-5 text-muted-foreground">
                                {__(
                                    BRAND_DISPLAY_OPTIONS.find(
                                        (option) =>
                                            option.value === displayMode,
                                    )?.description ?? ''
                                )}
                            </p>
                        </div>
                    ) : null}
                </div>

                <div
                    className={cn(
                        'grid gap-3',
                        hasSecondaryPreview ? 'md:grid-cols-2' : '',
                    )}
                >
                    <div className="rounded-xl border border-border/70 bg-muted/15 p-4">
                        <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                            {__('Current asset')}
                        </p>
                        <div className="mt-3 flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-border/70 bg-background/85 p-4">
                            {assetPreviewUrl ? (
                                <img
                                    src={assetPreviewUrl}
                                    alt=""
                                    className={cn(
                                        'h-12 w-auto max-w-full object-contain',
                                        previewClassName,
                                    )}
                                />
                            ) : (
                                <span className="text-center text-xs font-medium text-muted-foreground">
                                    {__('No uploaded asset yet')}
                                </span>
                            )}
                        </div>
                    </div>

                    {hasSecondaryPreview ? (
                        <div className="rounded-xl border border-border/70 bg-muted/15 p-4">
                            <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                                {secondaryPreviewLabel ?? __('Surface preview')}
                            </p>
                            <div
                                className={cn(
                                    'mt-3 flex min-h-[120px] items-center rounded-xl border border-dashed border-border/70 p-4',
                                    surfacePreviewClassName ??
                                        'bg-gradient-to-br from-background to-muted/40',
                                )}
                            >
                                {supportsDisplayMode ? (
                                    <BrandLockup
                                        siteTitle={siteTitle}
                                        logoUrl={assetPreviewUrl}
                                        mode={displayMode}
                                        className="min-w-0 gap-3"
                                        logoClassName={cn(
                                            'h-11 max-w-[170px]',
                                            previewClassName,
                                        )}
                                        textClassName="truncate text-sm font-semibold tracking-tight text-foreground"
                                    />
                                ) : (
                                    renderedSecondaryPreview
                                )}
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className="rounded-xl border border-dashed border-border/70 bg-muted/10 p-4">
                    <Input
                        id={id}
                        type="file"
                        accept={accept}
                        className="sr-only"
                        onChange={(event) =>
                            onChange(event.target.files?.[0] ?? null)
                        }
                    />

                    <div className="flex flex-col gap-3">
                        <div>
                            <p className="text-sm font-medium text-foreground">
                                {__('Upload replacement')}
                            </p>
                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                {uploadHint}
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <label
                                htmlFor={id}
                                className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-lg border border-input bg-background px-3 text-sm font-medium text-foreground shadow-xs transition hover:bg-accent hover:text-accent-foreground"
                            >
                                <Upload className="size-4" />
                                {fileName ? __('Replace file') : __('Choose file')}
                            </label>

                            <p className="min-w-0 text-xs text-muted-foreground sm:max-w-[260px] sm:text-right">
                                {fileName ? (
                                    <span className="truncate font-medium text-foreground">
                                        {fileName}
                                    </span>
                                ) : (
                                    __('No file selected yet')
                                )}
                            </p>
                        </div>
                    </div>

                    {error ? (
                        <p className="mt-3 text-xs font-medium text-destructive">
                            {error}
                        </p>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

function BrandingSection({ initial }: { initial: FormValues }) {
    const form = useForm<{
        site_title: string;
        header_logo: File | null;
        footer_logo: File | null;
        dashboard_logo: File | null;
        favicon: File | null;
        header_brand_display: BrandDisplayMode;
        footer_brand_display: BrandDisplayMode;
        dashboard_brand_display: BrandDisplayMode;
        orbychat_brand_url: string;
        orbychat_brand_label: string;
        marketing_site_enabled: boolean;
    }>({
        site_title: initial.site_title ?? '',
        header_logo: null,
        footer_logo: null,
        dashboard_logo: null,
        favicon: null,
        header_brand_display: initial.header_brand_display,
        footer_brand_display: initial.footer_brand_display,
        dashboard_brand_display: initial.dashboard_brand_display,
        orbychat_brand_url: initial.orbychat_brand_url ?? '',
        orbychat_brand_label: initial.orbychat_brand_label ?? '',
        marketing_site_enabled: initial.marketing_site_enabled ?? true,
    });

    const headerLogoPreview = useSelectedFilePreview(form.data.header_logo);
    const footerLogoPreview = useSelectedFilePreview(form.data.footer_logo);
    const dashboardLogoPreview = useSelectedFilePreview(
        form.data.dashboard_logo,
    );
    const faviconPreview = useSelectedFilePreview(form.data.favicon);

    const resetBrandingTransform = () => {
        form.transform((data) => data);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const hasUploads = [
            form.data.header_logo,
            form.data.footer_logo,
            form.data.dashboard_logo,
            form.data.favicon,
        ].some((file) => file !== null);

        const onSuccess = () => {
            form.reset(
                'header_logo',
                'footer_logo',
                'dashboard_logo',
                'favicon',
            );
        };

        if (!hasUploads) {
            resetBrandingTransform();

            form.patch(updateSystemSettings.url('branding'), {
                preserveScroll: true,
                onSuccess,
            });

            return;
        }

        form.transform((data) => ({
            ...data,
            _method: 'patch',
        }));

        form.post(updateSystemSettings.url('branding'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess,
            onFinish: resetBrandingTransform,
        });
    };

    return (
        <SectionShell
            icon={Palette}
            title={__('Site branding')}
            description={__('Manage the global site title, uploaded logos for public and dashboard surfaces, the favicon, and the widget footer link used on free plans.')}
        >
            <form onSubmit={submit} className="grid gap-5">
                <div className="rounded-[28px] border border-border/70 bg-gradient-to-br from-card via-card to-muted/25 p-6 shadow-sm">
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_460px] xl:items-start">
                        <div className="space-y-5">
                            <div className="space-y-3">
                                <Badge
                                    variant="outline"
                                    className="border-border/70 bg-background/70 px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase"
                                >
                                    {__('Brand system')}
                                </Badge>
                                <div>
                                    <h3 className="text-lg font-semibold tracking-tight text-foreground">
                                        {__('Control every brand surface from one place')}
                                    </h3>
                                    <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                                        {__('Update the brand title, preview how each surface renders, and replace assets without guessing how they will appear in the app.')}
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-2.5 rounded-2xl border border-border/70 bg-background/75 p-4 shadow-xs">
                                <Label htmlFor="site_title">{__('Site title')}</Label>
                                <Input
                                    id="site_title"
                                    autoComplete="off"
                                    value={form.data.site_title}
                                    onChange={(e) =>
                                        form.setData(
                                            'site_title',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="OrbyChat"
                                />
                                <p className="text-xs leading-5 text-muted-foreground">
                                    {__('Used in the browser title, shared app branding props, and text fallbacks when no custom logo is uploaded.')}
                                </p>
                                {form.errors.site_title ? (
                                    <p className="text-xs font-medium text-destructive">
                                        {form.errors.site_title}
                                    </p>
                                ) : null}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Badge
                                    variant="outline"
                                    className="border-border/70 bg-background/70 text-[11px] text-muted-foreground"
                                >
                                    {__('Landing + auth')}
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className="border-border/70 bg-background/70 text-[11px] text-muted-foreground"
                                >
                                    {__('Dashboard shell')}
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className="border-border/70 bg-background/70 text-[11px] text-muted-foreground"
                                >
                                    {__('Footer + widget badge')}
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className="border-border/70 bg-background/70 text-[11px] text-muted-foreground"
                                >
                                    {__('Browser tab')}
                                </Badge>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <BrandSurfacePreview
                                title={__('Header')}
                                caption={__('Landing and auth')}
                                icon={PanelTop}
                                siteTitle={form.data.site_title || __('Site title')}
                                logoUrl={
                                    headerLogoPreview ?? initial.header_logo_url
                                }
                                mode={form.data.header_brand_display}
                                shellClassName="bg-gradient-to-br from-background via-background to-sky-500/5"
                            />

                            <BrandSurfacePreview
                                title={__('Dashboard')}
                                caption={__('App shell')}
                                icon={LayoutDashboard}
                                siteTitle={form.data.site_title || __('Site title')}
                                logoUrl={
                                    dashboardLogoPreview ??
                                    initial.dashboard_logo_url
                                }
                                mode={form.data.dashboard_brand_display}
                                shellClassName="bg-gradient-to-br from-muted/25 via-background to-muted/45"
                            />

                            <BrandSurfacePreview
                                title={__('Footer')}
                                caption={__('Marketing footer + widget')}
                                icon={PanelBottom}
                                siteTitle={form.data.site_title || __('Site title')}
                                logoUrl={
                                    footerLogoPreview ??
                                    initial.footer_logo_url ??
                                    headerLogoPreview ??
                                    initial.header_logo_url
                                }
                                mode={form.data.footer_brand_display}
                                shellClassName="bg-gradient-to-br from-[#17181b] to-[#22252b]"
                                textClassName="truncate text-sm font-semibold tracking-tight text-white"
                            />

                            <FaviconSurfacePreview
                                siteTitle={form.data.site_title || __('Site title')}
                                faviconUrl={
                                    faviconPreview ?? initial.favicon_url
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                    <BrandingAssetField
                        id="header_logo"
                        label={__('Header logo')}
                        surfaceLabel={__('Public + auth')}
                        icon={PanelTop}
                        description={__('Used in the public landing-page header and the auth entry points.')}
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        currentUrl={initial.header_logo_url}
                        selectedFile={form.data.header_logo}
                        fileName={form.data.header_logo?.name}
                        error={form.errors.header_logo}
                        siteTitle={form.data.site_title || __('Site title')}
                        displayMode={form.data.header_brand_display}
                        onDisplayModeChange={(value) =>
                            form.setData('header_brand_display', value)
                        }
                        surfacePreviewClassName="bg-gradient-to-br from-background via-background to-sky-500/5"
                        onChange={(file) => form.setData('header_logo', file)}
                    />

                    <BrandingAssetField
                        id="footer_logo"
                        label={__('Footer logo')}
                        surfaceLabel={__('Footer + widget')}
                        icon={PanelBottom}
                        description={__('Used in the public footer and the free-plan widget branding badge.')}
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        currentUrl={initial.footer_logo_url}
                        selectedFile={form.data.footer_logo}
                        fileName={form.data.footer_logo?.name}
                        error={form.errors.footer_logo}
                        siteTitle={form.data.site_title || __('Site title')}
                        displayMode={form.data.footer_brand_display}
                        onDisplayModeChange={(value) =>
                            form.setData('footer_brand_display', value)
                        }
                        surfacePreviewClassName="bg-gradient-to-br from-[#17181b] to-[#22252b]"
                        onChange={(file) => form.setData('footer_logo', file)}
                    />

                    <BrandingAssetField
                        id="dashboard_logo"
                        label={__('Dashboard logo')}
                        surfaceLabel={__('App shell')}
                        icon={LayoutDashboard}
                        description={__('Used in the logged-in app shell and platform admin sidebar.')}
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        currentUrl={initial.dashboard_logo_url}
                        selectedFile={form.data.dashboard_logo}
                        fileName={form.data.dashboard_logo?.name}
                        error={form.errors.dashboard_logo}
                        siteTitle={form.data.site_title || __('Site title')}
                        displayMode={form.data.dashboard_brand_display}
                        onDisplayModeChange={(value) =>
                            form.setData('dashboard_brand_display', value)
                        }
                        surfacePreviewClassName="bg-gradient-to-br from-muted/25 via-background to-muted/45"
                        onChange={(file) =>
                            form.setData('dashboard_logo', file)
                        }
                    />

                    <BrandingAssetField
                        id="favicon"
                        label={__('Favicon')}
                        surfaceLabel={__('Browser tab')}
                        icon={Globe2}
                        description={__('Used for browser tabs and the initial HTML shell before the app hydrates.')}
                        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon"
                        currentUrl={initial.favicon_url}
                        selectedFile={form.data.favicon}
                        fileName={form.data.favicon?.name}
                        error={form.errors.favicon}
                        siteTitle={form.data.site_title || __('Site title')}
                        secondaryPreviewLabel={__('Tab preview')}
                        secondaryPreview={(previewUrl) => (
                            <div className="w-full rounded-xl border border-border/70 bg-background/95 p-3 shadow-xs">
                                <div className="flex items-center gap-2">
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt=""
                                            className="size-4 shrink-0 rounded-[4px] object-contain"
                                        />
                                    ) : (
                                        <span className="flex size-4 shrink-0 items-center justify-center rounded-[4px] bg-foreground text-[10px] font-bold text-background">
                                            {(
                                                form.data.site_title
                                                    .trim()
                                                    .charAt(0) || 'S'
                                            ).toUpperCase()}
                                        </span>
                                    )}
                                    <span className="truncate text-xs font-medium text-foreground">
                                        {form.data.site_title || __('Site title')}
                                    </span>
                                </div>
                            </div>
                        )}
                        surfacePreviewClassName="bg-gradient-to-br from-background to-muted/35"
                        onChange={(file) => form.setData('favicon', file)}
                        previewClassName="h-8"
                    />
                </div>

                <div className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
                    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
                        <div className="grid gap-4">
                            <div>
                                <h3 className="text-sm font-semibold text-foreground">
                                    {__('Widget footer link')}
                                </h3>
                                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                    {__('This still controls the free-plan -€œPowered by …-€  link inside the visitor widget.')}
                                </p>
                            </div>

                            <div className="grid gap-3 md:grid-cols-2">
                                <div className="grid gap-1">
                                    <Label htmlFor="orbychat_brand_url">
                                        {__('Link URL')}
                                    </Label>
                                    <Input
                                        id="orbychat_brand_url"
                                        type="url"
                                        autoComplete="off"
                                        value={form.data.orbychat_brand_url}
                                        onChange={(e) =>
                                            form.setData(
                                                'orbychat_brand_url',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="https://orby.chat"
                                    />
                                    {form.errors.orbychat_brand_url ? (
                                        <p className="text-xs font-medium text-destructive">
                                            {form.errors.orbychat_brand_url}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="grid gap-1">
                                    <Label htmlFor="orbychat_brand_label">
                                        {__('Label')}
                                    </Label>
                                    <Input
                                        id="orbychat_brand_label"
                                        autoComplete="off"
                                        value={form.data.orbychat_brand_label}
                                        onChange={(e) =>
                                            form.setData(
                                                'orbychat_brand_label',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Powered by OrbyChat"
                                    />
                                    {form.errors.orbychat_brand_label ? (
                                        <p className="text-xs font-medium text-destructive">
                                            {form.errors.orbychat_brand_label}
                                        </p>
                                    ) : null}
                                </div>
                            </div>

                            <Separator />

                            <p className="text-xs leading-5 text-muted-foreground">
                                {__('Keep this label short so it reads cleanly inside the widget badge.')}
                            </p>
                        </div>

                        <div className="rounded-xl border border-border/70 bg-muted/15 p-4">
                            <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                                {__('Widget badge preview')}
                            </p>
                            <div className="mt-3 flex min-h-[108px] items-end rounded-xl border border-dashed border-border/70 bg-[#111214] p-4">
                                <span className="inline-flex max-w-full items-center rounded-full bg-background px-3 py-2 text-xs font-medium text-foreground shadow-sm ring-1 ring-white/10">
                                    <span className="truncate">
                                        {form.data.orbychat_brand_label ||
                                            'Powered by OrbyChat'}
                                    </span>
                                </span>
                            </div>
                            <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
                                {__('Link target')}:{' '}
                                {form.data.orbychat_brand_url ||
                                    __('No URL set yet')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-border/70 bg-muted/15 p-4">
                    <label className="flex cursor-pointer items-start gap-3">
                        <input
                            type="checkbox"
                            checked={form.data.marketing_site_enabled}
                            onChange={(e) =>
                                form.setData(
                                    'marketing_site_enabled',
                                    e.target.checked,
                                )
                            }
                            className="mt-0.5 size-4 shrink-0 rounded border-border focus:ring-2 focus:ring-ring/40"
                        />
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground">
                                {__('Public marketing site')}
                            </p>
                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                {__('When on, anyone landing on')} {' '}
                                <code className="px-1">/</code>,
                                <code className="px-1">/pricing</code>,
                                <code className="px-1">/changelog</code>, {__('or')} {' '}
                                <code className="px-1">/documentation</code> {' '}
                                {__('sees the public marketing site. Turn it off for a private SaaS install  —  visitors are redirected to')} <code>/login</code> {__('instead, and search engines are told to skip the whole domain. Privacy / terms / auth flows stay reachable always.')}
                            </p>
                        </div>
                    </label>
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={form.processing}>
                        {__('Save branding')}
                    </Button>
                </div>
            </form>
        </SectionShell>
    );
}

function MarketingSection({
    summary,
    initial,
}: {
    summary: MarketingSummary;
    initial: FormValues;
}) {
    return (
        <SectionShell
            icon={Sparkles}
            title={__('Marketing homepage')}
            description={__('Manage the public landing page with structured fields instead of raw JSON. Missing keys still fall back to the server defaults when you save.')}
            statusPill={<StatusPill configured={summary.customized} />}
        >
            <MarketingContentEditor initial={initial.marketing_home_content} />
        </SectionShell>
    );
}

function PrivacySection({
    summary,
    initial,
}: {
    summary: PrivacySummary;
    initial: FormValues;
}) {
    return (
        <SectionShell
            icon={Shield}
            title={__('Privacy & GDPR')}
            description={__('Manage the public privacy policy and the GDPR request guidance shown on the marketing site.')}
            statusPill={<StatusPill configured={summary.customized} />}
        >
            <PrivacyPolicyEditor initial={initial.privacy_policy_content} />
        </SectionShell>
    );
}

function ReadOnlyHealthSection({
    icon: Icon,
    title,
    description,
    statusPill,
    rows,
    testEndpoint,
    testLabel,
}: {
    icon: LucideIcon;
    title: string;
    description: string;
    statusPill?: React.ReactNode;
    rows: { label: string; value: React.ReactNode }[];
    testEndpoint?: string;
    testLabel?: string;
}) {
    return (
        <SectionShell
            icon={Icon}
            title={title}
            description={description}
            statusPill={statusPill}
            testEndpoint={testEndpoint}
            testLabel={testLabel}
        >
            <div className="space-y-1.5">
                {rows.map((r) => (
                    <div
                        key={r.label}
                        className="grid grid-cols-[140px_1fr] gap-3 text-sm"
                    >
                        <span className="text-muted-foreground">{r.label}</span>
                        <span className="font-mono text-xs break-all">
                            {r.value === null ||
                            r.value === '' ||
                            r.value === undefined ? (
                                <span className="text-muted-foreground/60">
                                     — 
                                </span>
                            ) : (
                                r.value
                            )}
                        </span>
                    </div>
                ))}
            </div>
        </SectionShell>
    );
}

type TabKey = 'billing' | 'ai' | 'mail' | 'cron' | 'health';

const TABS: { key: TabKey; label: string; icon: LucideIcon }[] = [
    { key: 'billing', label: __('Billing'), icon: CreditCard },
    { key: 'ai', label: __('AI providers'), icon: Sparkles },
    { key: 'mail', label: __('Mail'), icon: Mail },
    { key: 'cron', label: __('Cron worker'), icon: Workflow },
    { key: 'health', label: __('Health'), icon: HardDrive },
];

export default function SystemSettings({
    page,
    sections,
    form: initial,
}: Props) {
    const initialTab: TabKey =
        typeof window !== 'undefined' &&
        TABS.some((t) => t.key === window.location.hash.slice(1))
            ? (window.location.hash.slice(1) as TabKey)
            : 'billing';
    const [active, setActive] = useState<TabKey>(initialTab);

    const switchTab = (key: TabKey) => {
        setActive(key);

        if (typeof window !== 'undefined') {
            window.history.replaceState(
                null,
                '',
                `${window.location.pathname}#${key}`,
            );
        }
    };

    const pageMeta: Record<
        SettingsPage,
        { headTitle: string; title: string; description: string }
    > = {
        system: {
            headTitle: __('System settings'),
            title: __('System config'),
            description:
                __('Edit provider keys and run smoke tests. Sensitive values are encrypted at rest and never sent back to the browser; leave a secret blank to keep its current value.'),
        },
        branding: {
            headTitle: __('Branding settings'),
            title: __('Branding'),
            description:
                __('Manage the global site title, uploaded logos, favicon, and widget footer branding from one place.'),
        },
        marketing: {
            headTitle: __('Marketing site settings'),
            title: __('Marketing site'),
            description:
                __('Edit the landing page using structured fields so content stays easy to manage and review.'),
        },
        privacy: {
            headTitle: __('Privacy settings'),
            title: __('Privacy & GDPR'),
            description:
                __('Control the public privacy policy copy, contact details, and visitor rights guidance from the admin settings area.'),
        },
    };

    return (
        <>
            <Head title={pageMeta[page].headTitle} />
            <Heading
                variant="small"
                title={pageMeta[page].title}
                description={pageMeta[page].description}
            />

            {page === 'system' && (
                <div
                    className="mt-4 flex gap-1 overflow-x-auto border-b"
                    role="tablist"
                    aria-label={__('System config sections')}
                >
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = active === tab.key;

                        return (
                            <button
                                key={tab.key}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                aria-controls={`system-tab-${tab.key}`}
                                onClick={() => switchTab(tab.key)}
                                className={`-mb-px flex items-center gap-2 border-b-2 px-3 py-2 text-sm whitespace-nowrap transition ${
                                    isActive
                                        ? 'border-foreground font-medium text-foreground'
                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <Icon className="size-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            )}

            <div
                className="mt-4 space-y-4"
                role="tabpanel"
                id={`system-tab-${page === 'system' ? active : page}`}
            >
                {page === 'system' && active === 'billing' && (
                    <>
                        <GatewayTogglesSection initial={initial} />
                        <StripeSection
                            summary={sections.stripe}
                            initial={initial}
                        />
                        <PayPalSection
                            summary={sections.paypal}
                            initial={initial}
                        />
                        <RazorpaySection
                            summary={sections.razorpay}
                            initial={initial}
                        />
                    </>
                )}

                {page === 'system' && active === 'ai' && (
                    <>
                        <CloudflareSection
                            summary={sections.llm}
                            initial={initial}
                        />
                        <OpenAiSection initial={initial} />
                        <OpenRouterSection initial={initial} />
                        <RoutingSection initial={initial} />
                    </>
                )}

                {page === 'system' && active === 'mail' && (
                    <MailSection summary={sections.mail} initial={initial} />
                )}

                {page === 'system' && active === 'cron' && (
                    <CronWorkerSection summary={sections.cron_worker} />
                )}

                {page === 'branding' && <BrandingSection initial={initial} />}

                {page === 'marketing' && (
                    <MarketingSection
                        summary={sections.marketing}
                        initial={initial}
                    />
                )}

                {page === 'privacy' && (
                    <PrivacySection
                        summary={sections.privacy}
                        initial={initial}
                    />
                )}

                {page === 'system' && active === 'health' && (
                    <>
                        <ReadOnlyHealthSection
                            icon={Sparkles}
                            title={__('LLM (chat) probe')}
                            description={__('Verifies the currently-resolved chat provider responds end-to-end.')}
                            statusPill={
                                <StatusPill
                                    configured={sections.llm.configured}
                                />
                            }
                            testEndpoint="/settings/system/test/llm"
                            testLabel={__('Run chat probe')}
                            rows={[
                                {
                                    label: 'LLM_PROVIDER',
                                    value: sections.llm.provider_env,
                                },
                                {
                                    label: __('Resolved'),
                                    value: sections.llm.resolved,
                                },
                            ]}
                        />

                        <ReadOnlyHealthSection
                            icon={Sparkles}
                            title={__('LLM (embed) probe')}
                            description={__('Verifies the embed endpoint produces a vector.')}
                            statusPill={
                                <StatusPill
                                    configured={sections.llm.configured}
                                />
                            }
                            testEndpoint="/settings/system/test/embed"
                            testLabel={__('Run embed probe')}
                            rows={[
                                {
                                    label: __('Resolved'),
                                    value: sections.llm.resolved,
                                },
                            ]}
                        />

                        <ReadOnlyHealthSection
                            icon={HardDrive}
                            title={__('Cache (Redis)')}
                            description={__('Backs queues, sessions, and short-TTL RAG history.')}
                            statusPill={
                                <StatusPill
                                    configured={sections.cache.configured}
                                />
                            }
                            testEndpoint="/settings/system/test/cache"
                            testLabel={__('Run write/read probe')}
                            rows={[
                                {
                                    label: __('Driver'),
                                    value: sections.cache.driver,
                                },
                                {
                                    label: __('Redis host'),
                                    value: sections.cache.redis_host,
                                },
                                {
                                    label: __('Redis port'),
                                    value: sections.cache.redis_port,
                                },
                            ]}
                        />

                        <ReadOnlyHealthSection
                            icon={Database}
                            title={__('Vector store')}
                            description={__('Embedding storage + similarity search. Provider auto-picks from configured keys.')}
                            statusPill={
                                <StatusPill
                                    configured={sections.vector.configured}
                                />
                            }
                            rows={[
                                {
                                    label: 'VECTOR_PROVIDER',
                                    value: sections.vector.provider_env,
                                },
                                {
                                    label: __('Resolved'),
                                    value: sections.vector.resolved,
                                },
                                {
                                    label: __('Vectorize index'),
                                    value: sections.vector.vectorize_index,
                                },
                                {
                                    label: __('Qdrant URL'),
                                    value: sections.vector.qdrant_url,
                                },
                            ]}
                        />

                        <ReadOnlyHealthSection
                            icon={Radio}
                            title={__('Reverb (WebSocket)')}
                            description={__('Live broadcasts for the inbox + widget human-takeover.')}
                            statusPill={
                                <StatusPill
                                    configured={sections.reverb.configured}
                                />
                            }
                            rows={[
                                {
                                    label: __('App key'),
                                    value: sections.reverb.app_key,
                                },
                                { label: __('Host'), value: sections.reverb.host },
                                { label: __('Port'), value: sections.reverb.port },
                                {
                                    label: __('Scheme'),
                                    value: sections.reverb.scheme,
                                },
                            ]}
                        />
                    </>
                )}
            </div>
        </>
    );
}

SystemSettings.layout = {
    breadcrumbs: [
        {
            title: __('System config'),
            href: '/settings/system',
        },
    ],
};
