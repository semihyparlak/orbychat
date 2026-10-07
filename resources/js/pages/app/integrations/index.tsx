import { Head, router, useForm } from '@inertiajs/react';
import { BookOpen, CheckCircle2, Copy, Download, FileText, Globe, Send, ShoppingBag, Slack, Store } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import {
    destroy as destroyIntegration,
    index as integrationsIndex,
} from '@/routes/integrations';
import { store as storeSlack } from '@/routes/integrations/slack';
import {
    destroy as destroyWebhook,
    store as storeWebhook,
    update as updateWebhook,
} from '@/routes/integrations/webhooks';
import { start as startGoogle } from '@/routes/oauth/google';
import { start as startNotion } from '@/routes/oauth/notion';

type Integration = {
    id: string;
    kind: 'slack' | 'notion' | 'google' | 'wordpress' | 'shopify' | 'ikas' | string;
    is_configured: boolean;
    webhook_hint: string | null;
    status: string;
    last_sync_at: string | null;
    summary: string | null;
};

type Props = {
    integrations: Integration[];
    agents: { id: string; name: string }[];
    workspaceApiToken: string | null;
    webhookSubscriptions: WebhookSubscription[];
    webhookEventOptions: WebhookEventOption[];
};

type WebhookSubscription = {
    id: string;
    url: string;
    host: string | null;
    enabled: boolean;
    events: string[];
    event_labels: string[];
    secret_hint: string;
    created_at: string | null;
    updated_at: string | null;
};

type WebhookEventOption = {
    value: string;
    label: string;
};

export default function IntegrationsPage({
    integrations,
    agents,
    workspaceApiToken,
    webhookSubscriptions,
    webhookEventOptions,
}: Props) {
    const slack = integrations.find((i) => i.kind === 'slack') ?? null;
    const notion = integrations.find((i) => i.kind === 'notion') ?? null;
    const google = integrations.find((i) => i.kind === 'google') ?? null;
    const wordpress = integrations.find((i) => i.kind === 'wordpress') ?? null;
    const shopify = integrations.find((i) => i.kind === 'shopify') ?? null;
    const ikas = integrations.find((i) => i.kind === 'ikas') ?? null;

    const [showSlackForm, setShowSlackForm] = useState(false);
    const [showShopifyForm, setShowShopifyForm] = useState(false);
    const [showIkasForm, setShowIkasForm] = useState(false);
    const [showWebhookForm, setShowWebhookForm] = useState(
        webhookSubscriptions.length === 0,
    );
    const [editingWebhookId, setEditingWebhookId] = useState<string | null>(
        null,
    );

    const defaultWebhookEvents =
        webhookEventOptions.length > 0
            ? webhookEventOptions.map((option) => option.value)
            : ['lead.captured'];

    const slackForm = useForm<{ webhook_url: string; send_test: boolean }>({
        webhook_url: '',
        send_test: true,
    });

    const shopifyForm = useForm({
        shop_domain: '',
        access_token: '',
        agent_id: agents[0]?.id ?? '',
    });

    const ikasForm = useForm({
        shop_domain: '',
        access_token: '',
        agent_id: agents[0]?.id ?? '',
    });

    const webhookForm = useForm<{
        url: string;
        secret: string;
        enabled: boolean;
        events: string[];
    }>({
        url: '',
        secret: '',
        enabled: true,
        events: defaultWebhookEvents,
    });

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert(__('Copied to clipboard!'));
    };

    const toggleWebhookEvent = (value: string, checked: boolean) => {
        const nextEvents = checked
            ? Array.from(new Set([...webhookForm.data.events, value]))
            : webhookForm.data.events.filter((event) => event !== value);

        webhookForm.setData('events', nextEvents);
    };

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: __('Integrations'),
                    href: integrationsIndex.url(),
                },
            ]}
        >
            <Head title={__('Integrations')} />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {__('Integrations')}
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        {__('Connect OrbyChat to your favorite tools and platforms.')}
                    </p>
                </div>

                <div className="grid gap-6">
                    {/* WordPress Integration Card */}
                    <Card className="p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex items-start gap-4">
                                <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20">
                                    <Globe className="size-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{__('WordPress & WooCommerce')}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {__('Official plugin to embed the widget and sync products/pages.')}
                                    </p>
                                    {wordpress?.summary && (
                                        <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle2 className="size-3.5" />
                                            {wordpress.summary}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <Button
                                asChild
                                variant="outline"
                                className="shrink-0"
                            >
                                <a href="/app/integrations/wordpress/download">
                                    <Download className="mr-2 size-4" />
                                    {__('Download Plugin')}
                                </a>
                            </Button>
                        </div>

                        {workspaceApiToken && (
                            <div className="mt-6 rounded-lg bg-muted/50 p-4">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    {__('Your Workspace API Token')}
                                </Label>
                                <div className="mt-2 flex items-center gap-2">
                                    <code className="flex-1 rounded border bg-background px-2 py-1 font-mono text-sm">
                                        {workspaceApiToken}
                                    </code>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => copyToClipboard(workspaceApiToken)}
                                    >
                                        <Copy className="size-4" />
                                    </Button>
                                </div>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    {__('Paste this into the OrbyChat plugin settings in your WordPress admin.')}
                                </p>
                            </div>
                        )}
                    </Card>

                    {/* Shopify Integration Card */}
                    <Card className="p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex items-start gap-4">
                                <div className="rounded-lg bg-emerald-50 p-2 dark:bg-emerald-900/20">
                                    <ShoppingBag className="size-6 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{__('Shopify')}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {__('Connect your Shopify store via Custom App to sync products.')}
                                    </p>
                                    {shopify?.is_configured && (
                                        <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle2 className="size-3.5" />
                                            {__('Connected to :domain', { domain: shopify.webhook_hint })}
                                            {shopify.summary && <span> · {shopify.summary}</span>}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {shopify?.is_configured && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            if (confirm(__('Disconnect Shopify?'))) {
                                                router.delete(`/app/integrations/${shopify.id}`);
                                            }
                                        }}
                                    >
                                        {__('Disconnect')}
                                    </Button>
                                )}
                                <Button
                                    size="sm"
                                    onClick={() => setShowShopifyForm(!showShopifyForm)}
                                >
                                    {shopify?.is_configured ? __('Update') : __('Connect')}
                                </Button>
                            </div>
                        </div>

                        {showShopifyForm && (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    shopifyForm.post('/app/integrations/shopify', {
                                        onSuccess: () => setShowShopifyForm(false),
                                    });
                                }}
                                className="mt-6 space-y-4 rounded-lg border p-4 bg-muted/20"
                            >
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="shopify_domain">{__('Shop Domain')}</Label>
                                        <Input
                                            id="shopify_domain"
                                            placeholder="your-store.myshopify.com"
                                            value={shopifyForm.data.shop_domain}
                                            onChange={(e) => shopifyForm.setData('shop_domain', e.target.value)}
                                        />
                                        <InputError message={shopifyForm.errors.shop_domain} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="shopify_token">{__('Admin Access Token')}</Label>
                                        <Input
                                            id="shopify_token"
                                            type="password"
                                            value={shopifyForm.data.access_token}
                                            onChange={(e) => shopifyForm.setData('access_token', e.target.value)}
                                        />
                                        <InputError message={shopifyForm.errors.access_token} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>{__('Target Agent')}</Label>
                                    <Select
                                        value={shopifyForm.data.agent_id}
                                        onValueChange={(val) => shopifyForm.setData('agent_id', val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={__('Select an agent')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {agents.map((agent) => (
                                                <SelectItem key={agent.id} value={agent.id}>
                                                    {agent.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" onClick={() => setShowShopifyForm(false)}>{__('Cancel')}</Button>
                                    <Button disabled={shopifyForm.processing}>
                                        {shopifyForm.processing ? __('Syncing...') : __('Save & Sync')}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </Card>

                    {/* Ikas Integration Card */}
                    <Card className="p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex items-start gap-4">
                                <div className="rounded-lg bg-orange-50 p-2 dark:bg-orange-900/20">
                                    <Store className="size-6 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{__('Ikas')}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {__('Connect your Ikas store to sync products and pages.')}
                                    </p>
                                    {ikas?.is_configured && (
                                        <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle2 className="size-3.5" />
                                            {__('Connected to :domain', { domain: ikas.webhook_hint })}
                                            {ikas.summary && <span> · {ikas.summary}</span>}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {ikas?.is_configured && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            if (confirm(__('Disconnect Ikas?'))) {
                                                router.delete(`/app/integrations/${ikas.id}`);
                                            }
                                        }}
                                    >
                                        {__('Disconnect')}
                                    </Button>
                                )}
                                <Button
                                    size="sm"
                                    onClick={() => setShowIkasForm(!showIkasForm)}
                                >
                                    {ikas?.is_configured ? __('Update') : __('Connect')}
                                </Button>
                            </div>
                        </div>

                        {showIkasForm && (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    ikasForm.post('/app/integrations/ikas', {
                                        onSuccess: () => setShowIkasForm(false),
                                    });
                                }}
                                className="mt-6 space-y-4 rounded-lg border p-4 bg-muted/20"
                            >
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="ikas_domain">{__('Store Domain')}</Label>
                                        <Input
                                            id="ikas_domain"
                                            placeholder="mystore.com"
                                            value={ikasForm.data.shop_domain}
                                            onChange={(e) => ikasForm.setData('shop_domain', e.target.value)}
                                        />
                                        <InputError message={ikasForm.errors.shop_domain} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ikas_token">{__('API Access Token')}</Label>
                                        <Input
                                            id="ikas_token"
                                            type="password"
                                            value={ikasForm.data.access_token}
                                            onChange={(e) => ikasForm.setData('access_token', e.target.value)}
                                        />
                                        <InputError message={ikasForm.errors.access_token} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>{__('Target Agent')}</Label>
                                    <Select
                                        value={ikasForm.data.agent_id}
                                        onValueChange={(val) => ikasForm.setData('agent_id', val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={__('Select an agent')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {agents.map((agent) => (
                                                <SelectItem key={agent.id} value={agent.id}>
                                                    {agent.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" onClick={() => setShowIkasForm(false)}>{__('Cancel')}</Button>
                                    <Button disabled={ikasForm.processing}>
                                        {ikasForm.processing ? __('Syncing...') : __('Save & Sync')}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </Card>

                    {/* Original Slack Card (updated styling) */}
                    <Card className="p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex items-start gap-4">
                                <div className="rounded-lg bg-purple-50 p-2 dark:bg-purple-900/20">
                                    <Slack className="size-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{__('Slack')}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {__('Get real-time lead alerts in your Slack channels.')}
                                    </p>
                                    {slack?.is_configured && (
                                        <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle2 className="size-3.5" />
                                            {__('Connected')} {slack.webhook_hint && <span> · {slack.webhook_hint}</span>}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <Button
                                size="sm"
                                onClick={() => setShowSlackForm(!showSlackForm)}
                            >
                                {slack?.is_configured ? __('Update') : __('Connect')}
                            </Button>
                        </div>
                        {showSlackForm && (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    slackForm.post(storeSlack.url(), {
                                        onSuccess: () => {
                                            slackForm.reset('webhook_url');
                                            setShowSlackForm(false);
                                        },
                                    });
                                }}
                                className="mt-6 space-y-4 rounded-lg border p-4 bg-muted/20"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="webhook">{__('Slack Incoming Webhook URL')}</Label>
                                    <Input
                                        id="webhook"
                                        type="url"
                                        placeholder="https://hooks.slack.com/services/..."
                                        value={slackForm.data.webhook_url}
                                        onChange={(e) => slackForm.setData('webhook_url', e.target.value)}
                                    />
                                    <InputError message={slackForm.errors.webhook_url} />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" onClick={() => setShowSlackForm(false)}>{__('Cancel')}</Button>
                                    <Button disabled={slackForm.processing}>{__('Save connection')}</Button>
                                </div>
                            </form>
                        )}
                    </Card>

                    {/* Outbound Webhooks Card */}
                    <Card className="p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="rounded-lg bg-amber-50 p-2 dark:bg-amber-900/20">
                                    <Send className="size-6 text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{__('Outbound webhooks')}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {__('Push lead events to your CRM or automation platform.')}
                                    </p>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                onClick={() => setShowWebhookForm(!showWebhookForm)}
                            >
                                {__('Manage')}
                            </Button>
                        </div>

                        {showWebhookForm && (
                            <div className="mt-6 space-y-6 border-t pt-6">
                                {/* Existing subscriptions */}
                                {webhookSubscriptions.length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold">{__('Current Subscriptions')}</h4>
                                        <div className="grid gap-3">
                                            {webhookSubscriptions.map((sub) => (
                                                <div key={sub.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono font-medium truncate">{sub.url}</span>
                                                            {!sub.enabled && (
                                                                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase">{__('Disabled')}</span>
                                                            )}
                                                        </div>
                                                        <div className="mt-1 flex flex-wrap gap-1">
                                                            {sub.event_labels.map(label => (
                                                                <span key={label} className="text-[10px] text-muted-foreground bg-muted/50 px-1 rounded">{label}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 ml-4">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setEditingWebhookId(sub.id);
                                                                webhookForm.setData({
                                                                    url: sub.url,
                                                                    secret: '',
                                                                    enabled: sub.enabled,
                                                                    events: sub.events,
                                                                });
                                                            }}
                                                        >
                                                            {__('Edit')}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                            onClick={() => {
                                                                if (confirm(__('Delete this webhook subscription?'))) {
                                                                    router.delete(`/app/integrations/webhooks/${sub.id}`);
                                                                }
                                                            }}
                                                        >
                                                            {__('Delete')}
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Form to add/edit */}
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        if (editingWebhookId) {
                                            router.patch(`/app/integrations/webhooks/${editingWebhookId}`, webhookForm.data as any, {
                                                onSuccess: () => {
                                                    setEditingWebhookId(null);
                                                    webhookForm.reset();
                                                }
                                            });
                                        } else {
                                            webhookForm.post(storeWebhook.url(), {
                                                onSuccess: () => {
                                                    webhookForm.reset();
                                                    if (webhookSubscriptions.length > 0) setShowWebhookForm(false);
                                                },
                                            });
                                        }
                                    }}
                                    className="space-y-4 rounded-lg bg-muted/20 p-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="webhook_url">{__('Webhook URL')}</Label>
                                        <Input
                                            id="webhook_url"
                                            type="url"
                                            placeholder="https://your-api.com/webhooks"
                                            value={webhookForm.data.url}
                                            onChange={(e) => webhookForm.setData('url', e.target.value)}
                                            required
                                        />
                                        <InputError message={webhookForm.errors.url} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="webhook_secret">{__('Signing Secret (optional)')}</Label>
                                        <Input
                                            id="webhook_secret"
                                            type="password"
                                            placeholder={editingWebhookId ? __('Leave blank to keep current') : __('Random secret if empty')}
                                            value={webhookForm.data.secret}
                                            onChange={(e) => webhookForm.setData('secret', e.target.value)}
                                        />
                                        <InputError message={webhookForm.errors.secret} />
                                    </div>

                                    <div className="space-y-3">
                                        <Label>{__('Events to subscribe')}</Label>
                                        <div className="grid gap-2 sm:grid-cols-2">
                                            {webhookEventOptions.map((option) => (
                                                <div key={option.value} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`event-${option.value}`}
                                                        checked={webhookForm.data.events.includes(option.value)}
                                                        onCheckedChange={(checked) => toggleWebhookEvent(option.value, !!checked)}
                                                    />
                                                    <label
                                                        htmlFor={`event-${option.value}`}
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        {option.label}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                        <InputError message={webhookForm.errors.events} />
                                    </div>

                                    <div className="flex items-center space-x-2 pt-2">
                                        <Checkbox
                                            id="webhook_enabled"
                                            checked={webhookForm.data.enabled}
                                            onCheckedChange={(checked) => webhookForm.setData('enabled', !!checked)}
                                        />
                                        <label
                                            htmlFor="webhook_enabled"
                                            className="text-sm font-medium leading-none"
                                        >
                                            {__('Enabled')}
                                        </label>
                                    </div>

                                    <div className="flex justify-end gap-2 border-t pt-4">
                                        {editingWebhookId && (
                                            <Button
                                                variant="ghost"
                                                onClick={() => {
                                                    setEditingWebhookId(null);
                                                    webhookForm.reset();
                                                }}
                                            >
                                                {__('Cancel')}
                                            </Button>
                                        )}
                                        <Button disabled={webhookForm.processing}>
                                            {editingWebhookId ? __('Update Webhook') : __('Create Webhook')}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </Card>

                    {/* Notion Card */}
                    <Card className="p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-900/20">
                                    <BookOpen className="size-6 text-slate-700 dark:text-slate-300" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{__('Notion')}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {__('Index pages from your Notion workspace.')}
                                    </p>
                                    {notion?.is_configured && (
                                        <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle2 className="size-3.5" />
                                            {__('Connected')}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <Button
                                size="sm"
                                onClick={() => router.visit(startNotion.url())}
                            >
                                {notion?.is_configured ? __('Reconnect') : __('Connect')}
                            </Button>
                        </div>
                    </Card>

                    {/* Google Card */}
                    <Card className="p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20">
                                    <FileText className="size-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{__('Google Drive')}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {__('Index Google Docs as knowledge sources.')}
                                    </p>
                                    {google?.is_configured && (
                                        <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle2 className="size-3.5" />
                                            {__('Connected')}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <Button
                                size="sm"
                                onClick={() => router.visit(startGoogle.url())}
                            >
                                {google?.is_configured ? __('Reconnect') : __('Connect')}
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
