import { Head, Link, router } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import {
    ArrowRight,
    ArrowUpRight,
    BarChart3,
    Beaker,
    BookOpen,
    Check,
    Clipboard,
    Database,
    Globe,
    Inbox,
    MessageSquare,
    MessagesSquare,
    Palette,
    Play,
    ShoppingBag,
    Sparkles,
    Trash2,
    Workflow,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import {
    destroy as destroyAgent,
    edit as editAgent,
    publish as publishAgent,
} from '@/routes/agents';
import { index as agentLeadsIndex } from '@/routes/agents/leads';
import type { BreadcrumbItem } from '@/types';

type Agent = {
    id: string;
    name: string;
    language_default: string;
    is_published: boolean;
    confidence_threshold: number;
    system_prompt: string | null;
    site_type: string | null;
};

type Setup = {
    sources_indexed: number;
    sources_total: number;
    has_messages: boolean;
};

type Embed = {
    widget_url: string;
    snippet: string;
};

type Props = {
    agent: Agent;
    setup: Setup;
    embed: Embed;
};

type NavTile = {
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
    primary?: boolean;
};

const navTiles = (agent: Agent): NavTile[] => {
    const id = agent.id;
    const tiles: NavTile[] = [
        {
            title: __('Knowledge sources'),
            description: __('Add URLs or upload files. The crawler indexes them.'),
            href: `/app/agents/${id}/sources`,
            icon: Database,
            primary: true,
        },
        {
            title: __('Knowledge (what AI sees)'),
            description:
                __('Inspect every page and chunk we indexed  —  confirm the crawl pulled real content.'),
            href: `/app/agents/${id}/knowledge`,
            icon: BookOpen,
            primary: true,
        },
    ];

    if (agent.site_type === 'ecommerce') {
        tiles.push({
            title: __('Products'),
            description: __('View all products identified in your knowledge sources.'),
            href: `/app/agents/${id}/products`,
            icon: ShoppingBag,
            primary: true,
        });
    }

    tiles.push(
        {
            title: __('Conversations'),
            description:
                __('Read every visitor session  —  what they asked, what the bot said, when it happened.'),
            href: `/app/agents/${id}/conversations`,
            icon: MessagesSquare,
            primary: true,
        },
        {
            title: __('Leads'),
            description:
                __('See every lead captured by this agent and jump straight into the matching record.'),
            href: agentLeadsIndex({ agent: id }).url,
            icon: Inbox,
            primary: true,
        },
        {
            title: __('Playground'),
            description: __('Chat with the agent (does not count toward billing).'),
            href: `/app/agents/${id}/playground`,
            icon: Play,
            primary: true,
        },
        {
            title: __('Curated answers'),
            description:
                __('Predefined responses that bypass the LLM for matching questions.'),
            href: `/app/agents/${id}/curated`,
            icon: Sparkles,
        },
        {
            title: __('Behavior triggers'),
            description:
                __('Open the bar on exit-intent, idle, scroll, time, returning, UTM.'),
            href: `/app/agents/${id}/behavior`,
            icon: Workflow,
        },
        {
            title: __('CTAs'),
            description:
                __('Buttons that surface in conversations to drive demos / signups.'),
            href: `/app/agents/${id}/ctas`,
            icon: BarChart3,
        },
        {
            title: __('Customize appearance'),
            description: __('Persona, tone, colors, guardrails  —  with live preview.'),
            href: `/app/agents/${id}/customize`,
            icon: Palette,
        },
        {
            title: __('Site type'),
            description:
                __('Auto-detected vertical that drives starter prompts and capabilities.'),
            href: `/app/agents/${id}/vertical`,
            icon: Globe,
        },
        {
            title: __('Starter prompts'),
            description:
                __('Manual questions that visitors can click to quickly start a session.'),
            href: `/app/agents/${id}/prompts`,
            icon: Sparkles,
        },
        {
            title: __('A/B experiments'),
            description:
                __('Test persona / CTA / trigger variations on a slice of visitors.'),
            href: `/app/agents/${id}/experiments`,
            icon: Beaker,
        },
    );

    return tiles;
};


function AgentStatusBadge({
    published,
    className,
}: {
    published: boolean;
    className?: string;
}) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-medium',
                published
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300'
                    : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300',
                className,
            )}
        >
            <span
                className={cn(
                    'inline-block size-1.5 rounded-full',
                    published ? 'bg-emerald-500' : 'bg-amber-500',
                )}
            ></span>
            {published ? __('Live') : __('Draft')}
        </span>
    );
}

function SetupStepCard({
    step,
    done,
    title,
    description,
    className,
}: {
    step: number;
    done: boolean;
    title: string;
    description: string;
    className?: string;
}) {
    return (
        <div className={cn('flex h-full gap-3 px-4 py-4', className)}>
            <span
                className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                    done
                        ? 'bg-emerald-500 text-white'
                        : 'border border-muted-foreground/25 bg-background text-muted-foreground',
                )}
            >
                {done ? <Check className="size-3.5" /> : step}
            </span>
            <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{title}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {description}
                </p>
            </div>
        </div>
    );
}

function ActionTile({
    tile,
    prominent = false,
}: {
    tile: NavTile;
    prominent?: boolean;
}) {
    const Icon = tile.icon;

    return (
        <Link href={tile.href} prefetch className="group block h-full">
            <Card
                className={cn(
                    'h-full p-4 transition duration-200 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-lg',
                    prominent
                        ? 'border-foreground/15 bg-[linear-gradient(180deg,hsl(var(--card))_0%,color-mix(in_oklab,hsl(var(--muted))_30%,transparent)_100%)]'
                        : 'bg-card',
                )}
            >
                <div className="flex items-start justify-between gap-3">
                    <span
                        className={cn(
                            'inline-flex rounded-xl p-2 transition',
                            prominent
                                ? 'bg-foreground/5 text-foreground'
                                : 'bg-muted text-muted-foreground group-hover:bg-foreground/5 group-hover:text-foreground',
                        )}
                    >
                        <Icon className="size-4" />
                    </span>
                    <ArrowUpRight className="size-4 text-muted-foreground transition group-hover:text-foreground" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-foreground">
                    {tile.title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    {tile.description}
                </p>
            </Card>
        </Link>
    );
}

function SnapshotMetric({
    label,
    value,
    helper,
    className,
}: {
    label: string;
    value: string;
    helper: string;
    className?: string;
}) {
    return (
        <div className={cn('min-w-0 px-4 py-4', className)}>
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

export default function ShowAgent({ agent, setup, embed }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: __('Agents'), href: '/app/agents' },
        { title: agent.name, href: `/app/agents/${agent.id}` },
    ];

    const lang = (agent.language_default ?? 'en').toUpperCase();
    const tiles = navTiles(agent);
    const primaryTiles = tiles.filter((tile) => tile.primary === true);
    const secondaryTiles = tiles.filter((tile) => tile.primary !== true);
    const [copied, setCopied] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    const sourcesDone = setup.sources_indexed > 0;
    const playgroundDone = setup.has_messages;
    const publishedDone = agent.is_published;
    const completedSteps = [sourcesDone, playgroundDone, publishedDone].filter(
        Boolean,
    ).length;
    const completionPercent = (completedSteps / 3) * 100;
    const confidencePercent = Math.round(agent.confidence_threshold * 100);
    const readinessLabel =
        completedSteps === 3
            ? __('Ready for installation.')
            : __(':count setup steps left', { count: 3 - completedSteps });
    const nextAction: {
        title: string;
        description: string;
        type: 'link' | 'publish';
        href?: string;
    } = !sourcesDone
        ? {
              title: __('Add your first source'),
              description:
                  __('Index at least one URL or file so the agent has real knowledge to answer from.'),
              type: 'link',
              href: `/app/agents/${agent.id}/sources`,
          }
        : !playgroundDone
          ? {
                title: __('Run a playground check'),
                description:
                    __('Ask a few realistic questions and confirm the tone before publishing.'),
                type: 'link',
                href: `/app/agents/${agent.id}/playground`,
            }
          : !publishedDone
            ? {
                  title: __('Publish this agent'),
                  description:
                      __('The setup is ready. Publish to unlock the install snippet and go live.'),
                  type: 'publish',
              }
            : {
                  title: __('Review live conversations'),
                  description:
                      __('Watch real visitor sessions and keep improving the live experience.'),
                  type: 'link',
                  href: `/app/agents/${agent.id}/conversations`,
              };

    const copySnippet = async () => {
        try {
            await navigator.clipboard.writeText(embed.snippet);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            // ignored
        }
    };

    const publish = () => {
        if (isPublishing) {
            return;
        }

        setIsPublishing(true);

        router.post(
            publishAgent.url({ agent: agent.id }),
            {},
            {
                preserveScroll: true,
                onFinish: () => setIsPublishing(false),
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={agent.name} />
            <div className="flex min-h-0 flex-1 flex-col bg-card">
                <div className="flex min-h-10 flex-wrap items-center gap-2 border-b px-3 py-2 sm:py-1.5">
                    <AgentStatusBadge published={agent.is_published} />
                    <span className="inline-flex h-7 items-center rounded-md border bg-background px-2.5 text-xs font-normal text-muted-foreground">
                        {lang}
                    </span>
                    <span className="inline-flex h-7 items-center rounded-md border bg-background px-2.5 text-xs font-normal text-muted-foreground">
                        {__(':indexed/:total indexed', { indexed: setup.sources_indexed, total: setup.sources_total })}
                    </span>

                    <div className="ml-auto flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
                        <Button variant="outline" size="sm" asChild>
                            <Link
                                href={editAgent.url({ agent: agent.id })}
                                prefetch
                            >
                                {__('Settings')}
                            </Link>
                        </Button>
                        <Button
                            size="sm"
                            variant={agent.is_published ? 'outline' : 'default'}
                            onClick={publish}
                            disabled={isPublishing}
                        >
                            {isPublishing ? (
                                <>
                                    <Check className="size-3.5" />
                                    {__('Working...')}
                                </>
                            ) : agent.is_published ? (
                                __('Re-publish')
                            ) : (
                                __('Publish')
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                // Sonner-based confirm: a sticky toast with
                                // explicit Delete + Cancel actions. Less
                                // jarring than the native browser confirm()
                                // and matches the rest of the app's UX.
                                toast.warning(
                                    __('Delete the agent ":name"?', { name: agent.name }),
                                    {
                                        description:
                                            __('This removes the agent, its knowledge sources, conversations, and captured leads. This cannot be undone.'),
                                        duration: 12000,
                                        action: {
                                            label: __('Delete'),
                                            onClick: () =>
                                                router.delete(
                                                    destroyAgent.url({
                                                        agent: agent.id,
                                                    }),
                                                ),
                                        },
                                        cancel: {
                                            label: __('Cancel'),
                                            onClick: () => {
                                                /* dismiss */
                                            },
                                        },
                                    },
                                )
                            }
                            className="border-destructive/40 text-destructive hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                            <Trash2 className="size-3.5" />
                            {__('Delete')}
                        </Button>
                    </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto">
                    <div className="grid gap-4 p-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)]">
                        <div className="grid gap-4">
                            <Card className="overflow-hidden p-0">
                                <div className="border-b px-4 py-4 sm:px-5">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div className="min-w-0 flex-1">
                                            <span className="inline-flex items-center rounded-full border bg-muted/30 px-3 py-1 text-[11px] font-medium text-muted-foreground">
                                                {__('Agent workspace')}
                                            </span>
                                            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                                                {agent.name}
                                            </h1>
                                            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                                                {__('Train the agent, review what it sees, test real prompts, and publish when the setup is ready for visitors.')}
                                            </p>
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                <AgentStatusBadge
                                                    published={
                                                        agent.is_published
                                                    }
                                                />
                                                <span className="inline-flex items-center rounded-md border bg-background px-2.5 py-1 text-xs text-muted-foreground">
                                                    {__(':lang default language', { lang })}
                                                </span>
                                                <span className="inline-flex items-center rounded-md border bg-background px-2.5 py-1 text-xs text-muted-foreground">
                                                    {__(':percent% confidence threshold', { percent: confidencePercent })}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="max-w-full min-w-[240px] rounded-2xl border bg-muted/25 p-4">
                                            <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                                {__('Setup progress')}
                                            </p>
                                            <div className="mt-3 flex items-end justify-between gap-3">
                                                <p className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">
                                                    {completedSteps}/3
                                                </p>
                                                <p className="max-w-[9rem] text-right text-xs text-muted-foreground">
                                                    {readinessLabel}
                                                </p>
                                            </div>
                                            <div className="mt-3 h-2 rounded-full bg-muted">
                                                <div
                                                    className="h-2 rounded-full bg-foreground"
                                                    style={{
                                                        width: `${completionPercent}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-0 md:grid-cols-3">
                                    <SetupStepCard
                                        step={1}
                                        done={sourcesDone}
                                        title={__('Train with real knowledge')}
                                        description={
                                            sourcesDone
                                                ? __(':indexed of :total sources indexed successfully.', { indexed: setup.sources_indexed, total: setup.sources_total })
                                                : __('Add at least one URL or file so the agent can answer from real content.')
                                        }
                                        className="md:border-r"
                                    />
                                    <SetupStepCard
                                        step={2}
                                        done={playgroundDone}
                                        title={__('Validate in playground')}
                                        description={
                                            playgroundDone
                                                ? __('The agent has already been tested in the playground.')
                                                : __('Run a few realistic prompts to check tone, accuracy, and fallback behavior.')
                                        }
                                        className="md:border-r"
                                    />
                                    <SetupStepCard
                                        step={3}
                                        done={publishedDone}
                                        title={__('Go live')}
                                        description={
                                            publishedDone
                                                ? __('Published and ready for installation on your site.')
                                                : __('Publish when the setup looks correct so you can install the widget.')
                                        }
                                    />
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
                                    <div>
                                        <p className="text-sm font-medium text-foreground">
                                            {nextAction.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {nextAction.description}
                                        </p>
                                    </div>

                                    {nextAction.type === 'publish' ? (
                                        <Button
                                            size="sm"
                                            onClick={publish}
                                            disabled={isPublishing}
                                        >
                                            {isPublishing
                                                ? __('Publishing...')
                                                : __('Publish agent')}
                                        </Button>
                                    ) : (
                                        <Button asChild size="sm">
                                            <Link
                                                href={nextAction.href ?? '#'}
                                                prefetch
                                            >
                                                {nextAction.title}
                                                <ArrowRight className="size-3.5" />
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </Card>

                            <div>
                                <div className="mb-3">
                                    <h2 className="text-sm font-medium text-foreground">
                                        {__('Core workflow')}
                                    </h2>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {__("The main places you'll use to train, test, and operate this agent day to day.")}
                                    </p>
                                </div>
                                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                    {primaryTiles.map((tile) => (
                                        <ActionTile
                                            key={tile.title}
                                            tile={tile}
                                            prominent
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="mb-3">
                                    <h2 className="text-sm font-medium text-foreground">
                                        {__('Optimize and grow')}
                                    </h2>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {__('Refine answers, triggers, presentation, and experiments from the same workspace.')}
                                    </p>
                                </div>
                                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                    {secondaryTiles.map((tile) => (
                                        <ActionTile
                                            key={tile.title}
                                            tile={tile}
                                        />
                                    ))}
                                </div>
                            </div>

                            <Card className="p-4">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="size-4 text-muted-foreground" />
                                    <p className="text-sm font-medium text-foreground">
                                        {__('System prompt')}
                                    </p>
                                </div>
                                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                                    {__('This is the instruction layer the model sees before indexed knowledge and live visitor messages are added.')}
                                </p>
                                <pre className="mt-3 min-h-28 rounded-xl border bg-muted/30 p-3 text-xs leading-6 whitespace-pre-wrap text-foreground">
                                    {agent.system_prompt ??
                                        __('(none yet  —  set one in Settings)')}
                                </pre>
                            </Card>
                        </div>

                        <div className="grid gap-4">
                            <Card className="overflow-hidden p-0">
                                <div className="border-b px-4 py-4">
                                    <h2 className="text-sm font-medium text-foreground">
                                        {__('Launch snapshot')}
                                    </h2>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {__('Readiness, deployment state, and agent behavior at a glance.')}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-0">
                                    <SnapshotMetric
                                        label={__('Knowledge')}
                                        value={
                                            setup.sources_total > 0
                                                ? `${setup.sources_indexed}/${setup.sources_total}`
                                                : '0'
                                        }
                                        helper={
                                            setup.sources_total > 0
                                                ? __('Indexed sources')
                                                : __('Sources added so far')
                                        }
                                        className="border-r border-b"
                                    />
                                    <SnapshotMetric
                                        label={__('Playground')}
                                        value={
                                            playgroundDone ? __('Ready') : __('Pending')
                                        }
                                        helper={
                                            playgroundDone
                                                ? __('Tested with sample prompts')
                                                : __('Needs a validation pass')
                                        }
                                        className="border-b"
                                    />
                                    <SnapshotMetric
                                        label={__('Publishing')}
                                        value={publishedDone ? __('Live') : __('Draft')}
                                        helper={
                                            publishedDone
                                                ? __('Widget can be installed')
                                                : __('Private until published')
                                        }
                                        className="border-r"
                                    />
                                    <SnapshotMetric
                                        label={__('Confidence')}
                                        value={`${confidencePercent}%`}
                                        helper={__('Minimum confidence threshold')}
                                    />
                                </div>
                            </Card>

                            {agent.is_published ? (
                                <Card className="overflow-hidden p-0">
                                    <div className="border-b px-4 py-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h2 className="text-sm font-medium text-foreground">
                                                    {__('Embed on your site')}
                                                </h2>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {__('Copy this one-line snippet and paste it before')} <code>&lt;/body&gt;</code> {__('on any page where the agent should appear.')}
                                                </p>
                                            </div>
                                            <AgentStatusBadge published />
                                        </div>
                                    </div>
                                    <div className="px-4 py-4">
                                        <pre className="overflow-x-auto rounded-xl border bg-muted/30 p-3 text-xs leading-6 whitespace-pre-wrap text-foreground">
                                            {embed.snippet}
                                        </pre>
                                        <div className="mt-3 flex flex-wrap items-center gap-2">
                                            <Button
                                                onClick={copySnippet}
                                                variant="outline"
                                                size="sm"
                                            >
                                                {copied ? (
                                                    <>
                                                        <Check className="size-3.5" />
                                                        {__('Copied')}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Clipboard className="size-3.5" />
                                                        {__('Copy snippet')}
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                        <div className="mt-3 rounded-xl border bg-background px-3 py-2">
                                            <p className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                                                {__('Loader URL')}
                                            </p>
                                            <p className="mt-1 text-xs break-all text-foreground">
                                                {embed.widget_url}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            ) : (
                                <Card className="p-4">
                                    <div className="flex items-center gap-2">
                                        <Globe className="size-4 text-muted-foreground" />
                                        <p className="text-sm font-medium text-foreground">
                                            {__('Publish to unlock installation')}
                                        </p>
                                    </div>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        {__('As soon as this agent is published, this panel will switch to the live embed snippet you can paste into your site.')}
                                    </p>
                                    <div className="mt-4 rounded-xl border bg-muted/30 p-3">
                                        <p className="text-xs font-medium text-foreground">
                                            {__('Before you launch')}
                                        </p>
                                        <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                                            <div className="flex items-start gap-2">
                                                <span className="mt-1 size-1.5 rounded-full bg-current" />
                                                {__('Index at least one real source.')}
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="mt-1 size-1.5 rounded-full bg-current" />
                                                {__('Test answers in playground with realistic prompts.')}
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="mt-1 size-1.5 rounded-full bg-current" />
                                                {__('Confirm the prompt and appearance settings.')}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )}

                            <Card className="p-4">
                                <div className="flex items-center gap-2">
                                    <Palette className="size-4 text-muted-foreground" />
                                    <p className="text-sm font-medium text-foreground">
                                        {__('Behavior and presentation')}
                                    </p>
                                </div>
                                <div className="mt-4 space-y-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                {__('Voice and prompt')}
                                            </p>
                                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                                {agent.system_prompt
                                                    ? __('Custom system instructions are already guiding the model.')
                                                    : __('Still using the default instructions until you define a custom prompt.')}
                                            </p>
                                        </div>
                                        <Link
                                            href={editAgent.url({
                                                agent: agent.id,
                                            })}
                                            prefetch
                                            className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:text-foreground/80"
                                        >
                                            {__('Settings')}
                                            <ArrowUpRight className="size-3.5" />
                                        </Link>
                                    </div>

                                    <div className="flex items-start justify-between gap-3 border-t pt-4">
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                {__('Appearance and widget feel')}
                                            </p>
                                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                                {__('Tune colors, persona, and guardrails with a live widget preview.')}
                                            </p>
                                        </div>
                                        <Link
                                            href={`/app/agents/${agent.id}/customize`}
                                            prefetch
                                            className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:text-foreground/80"
                                        >
                                            {__('Customize')}
                                            <ArrowUpRight className="size-3.5" />
                                        </Link>
                                    </div>

                                    <div className="flex items-start justify-between gap-3 border-t pt-4">
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                {__('Leads and conversations')}
                                            </p>
                                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                                {__('Jump into live sessions and captured leads once the agent starts talking.')}
                                            </p>
                                        </div>
                                        <Link
                                            href={`/app/agents/${agent.id}/conversations`}
                                            prefetch
                                            className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:text-foreground/80"
                                        >
                                            {__('inbox')}
                                            <ArrowUpRight className="size-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
