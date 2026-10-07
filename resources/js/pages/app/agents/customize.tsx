import { Head, useForm } from '@inertiajs/react';
import {
    FormInput,
    LayoutPanelLeft,
    MailCheck,
    MessageSquareQuote,
    Palette,
    ShieldCheck,
    Sparkles,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { LeadFormBuilder } from '@/components/agents/lead-form-builder';
import type { LeadFormField } from '@/components/agents/lead-form-builder';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { update as updateAgent } from '@/routes/agents';
import type { BreadcrumbItem } from '@/types';

type WidgetPosition = 'bottom-center' | 'bottom-right' | 'bottom-left';

type Theme = {
    primary?: string;
    accent?: string;
    radius?: number;
    font?: string;
    position?: WidgetPosition;
};

type Persona = {
    name?: string;
    tone?: 'friendly' | 'expert' | 'concise';
};

type Guardrails = {
    avoid?: string[];
    max_chars?: number;
};

type Agent = {
    id: string;
    name: string;
    persona: Persona | null;
    theme: Theme | null;
    guardrails: Guardrails | null;
    starter_prompts: string[] | null;
    require_lead_before_chat?: boolean | null;
    lead_form_fields?: LeadFormField[] | null;
};

type Props = { agent: Agent };

const MAX_PROMPTS = 6;
const MAX_PROMPT_LENGTH = 80;

function CustomizeSection({
    icon,
    title,
    description,
    children,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <section className="grid gap-5 border-b px-4 py-4 last:border-b-0 sm:px-5 sm:py-5 lg:grid-cols-[220px_1fr] lg:gap-8">
            <div className="flex gap-3 lg:block">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground shadow-xs lg:mb-3">
                    {icon}
                </span>
                <div className="min-w-0">
                    <h2 className="text-sm font-medium text-foreground">
                        {title}
                    </h2>
                    <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
                        {description}
                    </p>
                </div>
            </div>
            <div className="grid gap-4">{children}</div>
        </section>
    );
}

export default function Customize({ agent }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: __('Agents'), href: '/app/agents' },
        { title: agent.name, href: `/app/agents/${agent.id}` },
        { title: __('Customize'), href: `/app/agents/${agent.id}/customize` },
    ];

    const POSITION_OPTIONS: ReadonlyArray<{
        value: WidgetPosition;
        title: string;
        blurb: string;
    }> = [
        {
            value: 'bottom-center',
            title: __('Centered bar'),
            blurb: __('Default  —  the omnibar sits across the bottom-center of the page.'),
        },
        {
            value: 'bottom-right',
            title: __('Bottom right'),
            blurb: __('Floating bubble pinned to the bottom-right corner. Familiar Intercom / Drift / Tawk style.'),
        },
        {
            value: 'bottom-left',
            title: __('Bottom left'),
            blurb: __('Same as right, mirrored. Good for sites whose right edge is busy with other widgets.'),
        },
    ];

    const form = useForm<{
        persona: Persona;
        theme: Theme;
        guardrails: Guardrails;
        starter_prompts: string[];
        require_lead_before_chat: boolean;
        lead_form_fields: LeadFormField[] | null;
    }>({
        persona: agent.persona ?? {
            name: agent.name,
            tone: 'friendly' as const,
        },
        theme: agent.theme ?? {
            primary: '#111827',
            accent: '#10b981',
            radius: 12,
            position: 'bottom-center',
        },
        guardrails: agent.guardrails ?? { avoid: [], max_chars: 2500 },
        starter_prompts: agent.starter_prompts ?? [],
        require_lead_before_chat: agent.require_lead_before_chat ?? false,
        lead_form_fields: agent.lead_form_fields ?? null,
    });

    const [pendingPrompt, setPendingPrompt] = useState('');

    const addPrompt = () => {
        const value = pendingPrompt.trim();

        if (
            !value ||
            form.data.starter_prompts.length >= MAX_PROMPTS ||
            form.data.starter_prompts.includes(value)
        ) {
            return;
        }

        form.setData('starter_prompts', [
            ...form.data.starter_prompts,
            value.slice(0, MAX_PROMPT_LENGTH),
        ]);
        setPendingPrompt('');
    };

    const removePrompt = (index: number) => {
        form.setData(
            'starter_prompts',
            form.data.starter_prompts.filter((_, i) => i !== index),
        );
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.patch(updateAgent.url({ agent: agent.id }), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__(':name · customize', { name: agent.name })} />
            <div className="grid flex-1 grid-cols-1 gap-4 p-4 lg:grid-cols-2">
                <Card className="gap-0 overflow-hidden border-border/80">
                    <CardHeader className="border-b bg-muted/20 px-4 py-4 sm:px-5">
                        <CardTitle className="text-base">
                            {__('Customize widget voice and look')}
                        </CardTitle>
                        <CardDescription>
                            {__('Tune how the agent presents itself before visitors ever send the first message.')}
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={submit}>
                        <CustomizeSection
                            icon={<MessageSquareQuote className="size-4" />}
                            title={__('Persona')}
                            description={__('Choose the name shown in the widget so the conversation feels branded and deliberate.')}
                        >
                            <div className="grid gap-1.5 sm:max-w-sm">
                                <Label htmlFor="persona-name">
                                    {__('Display name')}
                                </Label>
                                <Input
                                    id="persona-name"
                                    placeholder={__('OrbyChat Assistant')}
                                    value={
                                        (form.data.persona as Persona).name ??
                                        ''
                                    }
                                    onChange={(e) =>
                                        form.setData('persona', {
                                            ...form.data.persona,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </CustomizeSection>

                        <CustomizeSection
                            icon={<Palette className="size-4" />}
                            title={__('Theme')}
                            description={__('Adjust the primary and accent colors used by the widget shell and call-to-action surfaces.')}
                        >
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-1.5">
                                    <Label htmlFor="primary-color">
                                        {__('Primary color')}
                                    </Label>
                                    <Input
                                        id="primary-color"
                                        type="color"
                                        value={
                                            (form.data.theme as Theme)
                                                .primary ?? '#111827'
                                        }
                                        onChange={(e) =>
                                            form.setData('theme', {
                                                ...form.data.theme,
                                                primary: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="accent-color">{__('Accent')}</Label>
                                    <Input
                                        id="accent-color"
                                        type="color"
                                        value={
                                            (form.data.theme as Theme).accent ??
                                            '#10b981'
                                        }
                                        onChange={(e) =>
                                            form.setData('theme', {
                                                ...form.data.theme,
                                                accent: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <span className="text-xs text-muted-foreground">
                                    {__('Preview swatches')}:
                                </span>
                                <span className="inline-flex items-center gap-2 rounded-full border bg-background px-2.5 py-1 text-xs text-muted-foreground">
                                    <span
                                        className="size-2.5 rounded-full"
                                        style={{
                                            background:
                                                (form.data.theme as Theme)
                                                    .primary ?? '#111827',
                                        }}
                                    />
                                    {__('Primary')}
                                </span>
                                <span className="inline-flex items-center gap-2 rounded-full border bg-background px-2.5 py-1 text-xs text-muted-foreground">
                                    <span
                                        className="size-2.5 rounded-full"
                                        style={{
                                            background:
                                                (form.data.theme as Theme)
                                                    .accent ?? '#10b981',
                                        }}
                                    />
                                    {__('Accent')}
                                </span>
                            </div>
                        </CustomizeSection>

                        <CustomizeSection
                            icon={<LayoutPanelLeft className="size-4" />}
                            title={__('Position')}
                            description={__('Where the widget sits on the page. Centered bar is the default; corner bubbles match the Intercom / Drift / Tawk pattern.')}
                        >
                            <div
                                role="radiogroup"
                                aria-label={__('Widget position')}
                                className="grid gap-2 sm:grid-cols-3"
                            >
                                {POSITION_OPTIONS.map((option) => {
                                    const checked =
                                        ((form.data.theme as Theme).position ??
                                            'bottom-center') === option.value;

                                    return (
                                        <label
                                            key={option.value}
                                            className={`flex cursor-pointer flex-col gap-1 rounded-md border bg-background p-3 text-left transition-colors hover:border-foreground/40 ${
                                                checked
                                                    ? 'border-foreground bg-muted/30 ring-1 ring-foreground/20'
                                                    : 'border-border'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="widget-position"
                                                value={option.value}
                                                checked={checked}
                                                onChange={() =>
                                                    form.setData('theme', {
                                                        ...form.data.theme,
                                                        position: option.value,
                                                    })
                                                }
                                                className="sr-only"
                                            />
                                            <span className="text-sm font-medium text-foreground">
                                                {option.title}
                                            </span>
                                            <span className="text-xs leading-5 text-muted-foreground">
                                                {option.blurb}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </CustomizeSection>

                        <CustomizeSection
                            icon={<MailCheck className="size-4" />}
                            title={__('Pre-chat lead capture')}
                            description={__('Optional gate that asks for a name + email before the chat surface unlocks. Higher capture rate; the visitor is still motivated to identify themselves.')}
                        >
                            <label className="flex cursor-pointer items-start gap-3 rounded-md border bg-background p-3">
                                <input
                                    type="checkbox"
                                    checked={form.data.require_lead_before_chat}
                                    onChange={(e) =>
                                        form.setData(
                                            'require_lead_before_chat',
                                            (e.target as HTMLInputElement)
                                                .checked,
                                        )
                                    }
                                    className="mt-0.5 size-4 shrink-0 rounded border-border text-foreground focus:ring-2 focus:ring-ring/40"
                                />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-foreground">
                                        {__('Require name + email before chat')}
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                        {__("When on, visitors see a Name + Email form before the chat panel opens. Once submitted, the chat unlocks on the same panel  —  no reload. The same visitor doesn't see the form again on refresh.")}
                                    </p>
                                </div>
                            </label>
                        </CustomizeSection>

                        <CustomizeSection
                            icon={<FormInput className="size-4" />}
                            title={__('Lead form fields')}
                            description={__('Choose which fields the lead form asks for. The same schema renders both in the inline mid-chat form and the pre-chat gate.')}
                        >
                            <LeadFormBuilder
                                value={form.data.lead_form_fields}
                                onChange={(next) =>
                                    form.setData('lead_form_fields', next)
                                }
                            />
                        </CustomizeSection>

                        <CustomizeSection
                            icon={<ShieldCheck className="size-4" />}
                            title={__('Guardrails')}
                            description={__('Control how long replies can be so the assistant stays concise and readable inside the widget.')}
                        >
                            <div className="grid gap-1.5 sm:max-w-xs">
                                <Label htmlFor="max-response-length">
                                    {__('Max response length')}
                                </Label>
                                <Input
                                    id="max-response-length"
                                    type="number"
                                    value={
                                        (form.data.guardrails as Guardrails)
                                            .max_chars ?? 2500
                                    }
                                    onChange={(e) =>
                                        form.setData('guardrails', {
                                            ...form.data.guardrails,
                                            max_chars: parseInt(
                                                e.target.value,
                                                10,
                                            ),
                                        })
                                    }
                                />
                            </div>
                        </CustomizeSection>

                        <CustomizeSection
                            icon={<Sparkles className="size-4" />}
                            title={__('Starter prompts')}
                            description={__('Up to :max short questions shown before the conversation starts. Visitors can tap one to send it instantly.', { max: MAX_PROMPTS })}
                        >
                            <div className="flex flex-wrap gap-2">
                                {form.data.starter_prompts.map(
                                    (prompt, index) => (
                                        <span
                                            key={`${prompt}-${index}`}
                                            className="inline-flex items-center gap-1 rounded-full border bg-muted/50 px-3 py-1 text-xs"
                                        >
                                            {prompt}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removePrompt(index)
                                                }
                                                aria-label={__('Remove ":prompt"', { prompt })}
                                                className="-mr-1 rounded-full p-0.5 text-muted-foreground hover:text-foreground"
                                            >
                                                <X className="size-3" />
                                            </button>
                                        </span>
                                    ),
                                )}
                                {form.data.starter_prompts.length === 0 && (
                                    <p className="text-xs text-muted-foreground">
                                        {__('No starter prompts yet.')}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <Input
                                    placeholder={__('e.g. What\'s your pricing?')}
                                    value={pendingPrompt}
                                    maxLength={MAX_PROMPT_LENGTH}
                                    disabled={
                                        form.data.starter_prompts.length >=
                                        MAX_PROMPTS
                                    }
                                    onChange={(e) =>
                                        setPendingPrompt(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addPrompt();
                                        }
                                    }}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={
                                        !pendingPrompt.trim() ||
                                        form.data.starter_prompts.length >=
                                            MAX_PROMPTS
                                    }
                                    onClick={addPrompt}
                                    className="w-full sm:w-auto"
                                >
                                    {__('Add prompt')}
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground tabular-nums">
                                {__(':count/:max prompts used · max :limit chars each', { count: form.data.starter_prompts.length, max: MAX_PROMPTS, limit: MAX_PROMPT_LENGTH })}
                            </p>
                        </CustomizeSection>

                        <CardFooter className="flex flex-col-reverse gap-2 border-t bg-muted/10 px-4 py-4 sm:flex-row sm:justify-end sm:px-5">
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="w-full sm:w-auto"
                            >
                                {__('Save customization')}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                <Card className="gap-0 overflow-hidden">
                    <CardHeader className="border-b bg-muted/20 px-4 py-4 sm:px-5">
                        <CardTitle className="text-base">
                            {__('Live preview')}
                        </CardTitle>
                        <CardDescription>
                            {__('A quick approximation of how the widget will feel to a visitor.')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-4 py-5 sm:px-5">
                        <div
                            className="rounded-[24px] border bg-white p-4 shadow-sm"
                            style={{
                                borderRadius:
                                    (form.data.theme as Theme).radius ?? 12,
                            }}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium text-slate-900">
                                        {(form.data.persona as Persona).name ??
                                            agent.name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {__('Ready to help')}
                                    </p>
                                </div>
                                <span
                                    className="size-3 rounded-full"
                                    style={{
                                        background:
                                            (form.data.theme as Theme).accent ??
                                            '#10b981',
                                    }}
                                />
                            </div>

                            <div className="mt-4 space-y-3">
                                <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-slate-100 px-3 py-2 text-sm text-slate-700">
                                    {__('Hi! I can help with pricing, plans, or the best next step.')}
                                </div>
                                <div
                                    className="ml-auto inline-flex max-w-[85%] rounded-2xl rounded-br-md px-3 py-2 text-sm text-white"
                                    style={{
                                        background:
                                            (form.data.theme as Theme)
                                                .primary ?? '#111827',
                                    }}
                                >
                                    {__('Ask anything')}
                                </div>
                            </div>

                            {form.data.starter_prompts.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {form.data.starter_prompts
                                        .slice(0, 3)
                                        .map((prompt, index) => (
                                            <span
                                                key={`${prompt}-${index}`}
                                                className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
                                            >
                                                {prompt}
                                            </span>
                                        ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
