import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { VERTICAL_BY_ID } from '@/lib/verticals';
import type { VerticalId } from '@/lib/verticals';

export type PresetPreview = {
    slug: VerticalId;
    label: string;
    short_description: string;
    starter_prompts: string[];
    capabilities: string[];
    system_prompt_fragment: string;
    launcher_label: string | null;
    max_chars: number;
};

function formatCapability(cap: string): string {
    const translations: Record<string, string> = {
        'policy_lookup': __('Policy Lookup') + ' - ' + __('Coming soon'),
        'team_handoff': __('Team Handoff'),
        'auth_aware': __('Auth Aware') + ' - ' + __('Coming soon'),
        'lead_capture_inline': __('Lead Capture Inline'),
        'demo_booking': __('Demo Booking'),
        'case_study_card': __('Case Study Card'),
        'code_block': __('Code Block'),
        'api_reference_card': __('Api Reference Card'),
        'version_picker': __('Version Picker'),
        'troubleshoot_steps': __('Troubleshoot Steps'),
        'product_card': __('Product Card'),
        'price_inline': __('Price Inline') + ' - ' + __('Coming soon'),
        'shipping_estimate': __('Shipping Estimate') + ' - ' + __('Coming soon'),
        'cart_handoff': __('Cart Handoff') + ' - ' + __('Coming soon'),
        'order_status': __('Order Status'),
        'product_recommendations': __('Product Recommendations'),
        'product_comparison': __('Product Comparison') + ' - ' + __('Coming soon'),
        'ecommerce_discounts': __('Ecommerce Discounts'),
        'ecommerce_tracking': __('Ecommerce Tracking'),
        'ecommerce_inventory': __('Ecommerce Inventory') + ' - ' + __('Coming soon'),
        'pricing_card': __('Pricing Card'),
        'signup_handoff': __('Signup Handoff'),
        'feature_compare': __('Feature Compare') + ' - ' + __('Coming soon'),
        'account_status': __('Account Status'),
        'saas_discounts': __('Saas Discounts'),
        'saas_plan_recommendations': __('Saas Plan Recommendations'),
        'saas_trial_extensions': __('Saas Trial Extensions') + ' - ' + __('Coming soon'),
        'saas_troubleshooting': __('Saas Troubleshooting'),
        'ticket_escalation': __('Ticket Escalation'),
        'kb_article_card': __('Kb Article Card'),
        'sentiment_routing': __('Sentiment Routing'),
        'appointment_requests': __('Appointment Requests'),
        'lead_capture': __('Lead Capture'),
        'treatment_guidance': __('Treatment Guidance'),
        'health_plans': __('Health Plans'),
    };

    if (translations[cap]) {
        return translations[cap];
    }

    return __(cap
        .split('_')
        .map((p) => p[0]?.toUpperCase() + p.slice(1))
        .join(' '));
}

/**
 * Right-pane preview of a vertical preset. The collapsible explains
 * what the admin gets out of the preset  —  split into "merged into the
 * agent" (one-time copy) and "runtime applied" (always derived from
 * the preset).
 */
export function VerticalPresetPreview({
    preview,
    defaultOpen = true,
}: {
    preview: PresetPreview;
    defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);
    const meta = VERTICAL_BY_ID[preview.slug];
    const Icon = meta.icon;

    return (
        <Card>
            <CardContent className="p-5">
                <Collapsible open={open} onOpenChange={setOpen}>
                    <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 text-left">
                        <span className="flex items-center gap-3">
                            <span className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-muted/40">
                                <Icon className="size-4" />
                            </span>
                            <span>
                                <span className="block text-sm font-semibold">
                                    {__(preview.label)}
                                </span>
                                <span className="block text-xs text-muted-foreground">
                                    {__(preview.short_description)}
                                </span>
                            </span>
                        </span>
                        <ChevronDown
                            className={cn(
                                'size-4 text-muted-foreground transition-transform',
                                open && 'rotate-180',
                            )}
                        />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-5 space-y-5">
                        <Legend />

                        {/* Starter prompts  —  merged into agent */}
                        <Section
                            title={__('Suggested starter prompts')}
                            kind="merged"
                            description={__('Default chips shown to visitors. You can edit these later in Customize.')}
                        >
                            {preview.starter_prompts.length === 0 ? (
                                <p className="text-xs text-muted-foreground">
                                    {__('No starter prompts in this preset — add your own in Customize.')}
                                </p>
                            ) : (
                                <ul className="flex flex-wrap gap-1.5">
                                    {preview.starter_prompts.map((p, i) => (
                                        <li key={i}>
                                            <span className="inline-flex items-center rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs">
                                                {__(p)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Section>

                        {/* Capabilities  —  runtime applied */}
                        <Section
                            title={__('Capabilities')}
                            kind="runtime"
                            description={__('Rich UI affordances this preset can render.')}
                        >
                            {preview.capabilities.length === 0 ? (
                                <p className="text-xs text-muted-foreground">
                                    {__('No special capabilities — plain-text answers only.')}
                                </p>
                            ) : (
                                <div className="flex flex-wrap gap-1.5">
                                    {preview.capabilities.map((c) => {
                                        const label = formatCapability(c);
                                        const isComingSoon = label.includes('Yakında');
                                        return (
                                            <Badge
                                                key={c}
                                                variant="secondary"
                                                className={cn(isComingSoon ? 'opacity-40' : 'opacity-100')}
                                            >
                                                {label}
                                            </Badge>
                                        );
                                    })}
                                </div>
                            )}
                        </Section>

                        {/* System prompt fragment  —  runtime applied */}
                        <Section
                            title={__('System prompt addition')}
                            kind="runtime"
                            description={__('Appended to the LLM system prompt at every turn. Changing the vertical instantly changes this — no stale baked text.')}
                        >
                            {preview.system_prompt_fragment.trim() === '' ? (
                                <p className="text-xs text-muted-foreground">
                                    {__('No vertical-specific instructions for this preset.')}
                                </p>
                            ) : (
                                <pre className="max-h-48 overflow-auto rounded-md border border-border bg-muted/30 p-3 text-[11px] leading-5 whitespace-pre-wrap">
                                    {preview.system_prompt_fragment}
                                </pre>
                            )}
                        </Section>
                    </CollapsibleContent>
                </Collapsible>
            </CardContent>
        </Card>
    );
}

function Legend() {
    return (
        <div className="flex flex-wrap items-center gap-3 rounded-md border border-dashed border-border bg-muted/20 px-3 py-2 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                {__('Merged into agent')}
            </span>
            <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-violet-500" />
                {__('Runtime applied')}
            </span>
        </div>
    );
}

function Section({
    title,
    description,
    kind,
    children,
}: {
    title: string;
    description: string;
    kind: 'merged' | 'runtime';
    children: React.ReactNode;
}) {
    const dot = kind === 'merged' ? 'bg-emerald-500' : 'bg-violet-500';

    return (
        <section>
            <header className="mb-2">
                <span className="flex items-center gap-2">
                    <span className={cn('size-1.5 rounded-full', dot)} />
                    <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                        {title}
                    </span>
                </span>
                <p className="mt-1 text-xs text-muted-foreground/80">
                    {description}
                </p>
            </header>
            {children}
        </section>
    );
}
