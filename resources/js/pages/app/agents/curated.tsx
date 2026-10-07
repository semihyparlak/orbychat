import { Head, router, useForm } from '@inertiajs/react';
import { Sparkles, Trash2 } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import InputError from '@/components/input-error';
import { SortableList } from '@/components/sortable-list';
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
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Answer = {
    id: string;
    question_pattern: string;
    answer: string;
    priority: number;
    enabled: boolean;
    lang: string | null;
    is_suggested: boolean;
};

type Props = {
    agent: { id: string; name: string };
    answers: Answer[];
};

export default function Curated({ agent, answers }: Props) {
    const form = useForm({ question_pattern: '', answer: '', priority: 0 });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: __('Agents'), href: '/app/agents' },
        { title: agent.name, href: `/app/agents/${agent.id}` },
        { title: __('Curated answers'), href: `/app/agents/${agent.id}/curated` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__(':name · curated', { name: agent.name })} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {__('Curated answers')}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {__("Predefined responses that short-circuit the LLM when the visitor's message contains the pattern.")}
                </p>

                <Card className="max-w-5xl gap-0 overflow-hidden border-border/80">
                    <CardHeader className="border-b bg-muted/20 px-4 py-4 sm:px-5">
                        <div className="flex items-start gap-3">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground shadow-xs">
                                <Sparkles className="size-4" />
                            </span>
                            <div className="min-w-0">
                                <CardTitle className="text-sm">
                                    {__('Add a curated answer')}
                                </CardTitle>
                                <CardDescription className="mt-1 text-xs leading-5">
                                    {__('Use curated answers for questions that should always return the same exact copy.')}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.post(`/app/agents/${agent.id}/curated`, {
                                onSuccess: () => form.reset(),
                            });
                        }}
                    >
                        <CardContent className="grid gap-4 px-4 py-4 sm:px-5 sm:py-5">
                            <div className="grid gap-1.5">
                                <Label htmlFor="pattern">
                                    {__("Match if visitor's message contains")}
                                </Label>
                                <Input
                                    id="pattern"
                                    value={form.data.question_pattern}
                                    placeholder={__('pricing, refund policy, shipping time')}
                                    aria-invalid={Boolean(
                                        form.errors.question_pattern,
                                    )}
                                    onChange={(e) =>
                                        form.setData(
                                            'question_pattern',
                                            e.target.value,
                                        )
                                    }
                                />
                                <p className="text-xs text-muted-foreground">
                                    {__('Use a short phrase or keyword set the bot should recognize before reaching for the LLM.')}
                                </p>
                                <InputError
                                    message={form.errors.question_pattern}
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <div className="flex items-center justify-between gap-3">
                                    <Label htmlFor="answer">{__('Answer')}</Label>
                                    <span className="text-xs text-muted-foreground tabular-nums">
                                        {__(':count chars', { count: form.data.answer.length })}
                                    </span>
                                </div>
                                <Textarea
                                    id="answer"
                                    rows={5}
                                    value={form.data.answer}
                                    onChange={(e) =>
                                        form.setData('answer', e.target.value)
                                    }
                                    className="min-h-36 resize-y leading-6"
                                    aria-invalid={Boolean(form.errors.answer)}
                                    placeholder={__('Our plans start at $49/month and include...')}
                                />
                                <InputError message={form.errors.answer} />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col-reverse gap-2 border-t bg-muted/10 px-4 py-4 sm:flex-row sm:justify-end sm:px-5">
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="w-full sm:w-auto"
                            >
                                {__('Add answer')}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                <Card className="p-4">
                    <h2 className="mb-3 font-medium">
                        {__('Existing (drag to reorder  —  top = highest priority)')}
                    </h2>
                    {answers.length === 0 ? (
                        <EmptyState
                            icon={Sparkles}
                            title={__('No curated answers yet')}
                            description={__('Curated answers are exact responses the bot returns when a visitor\'s question matches a pattern  —  useful for pricing, returns, hours, anything you want answered the same way every time without an LLM call.')}
                        />
                    ) : (
                        <SortableList
                            items={answers}
                            keyOf={(a) => a.id}
                            onReorder={(orderedIds) =>
                                router.post(
                                    `/app/agents/${agent.id}/curated/reorder`,
                                    { order: orderedIds },
                                    { preserveScroll: true, only: ['answers'] },
                                )
                            }
                        >
                            {(a) => (
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                        <p className="flex items-center gap-2 text-sm font-medium">
                                            {__('if message contains')}:{' '}
                                            <em>{a.question_pattern}</em>
                                            {a.is_suggested && (
                                                <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 px-2 py-0.5 text-xs text-amber-700 dark:text-amber-400">
                                                    <Sparkles className="size-3" />{' '}
                                                    {__('Suggested')}
                                                </span>
                                            )}
                                            {!a.enabled && !a.is_suggested && (
                                                <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                                    {__('Disabled')}
                                                </span>
                                            )}
                                        </p>
                                        <p className="mt-1 text-sm whitespace-pre-wrap text-muted-foreground">
                                            {a.answer}
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-1">
                                        {a.is_suggested && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    router.post(
                                                        `/app/curated-answers/${a.id}/approve`,
                                                    )
                                                }
                                            >
                                                {__('Approve')}
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                if (
                                                    confirm(
                                                        a.is_suggested
                                                            ? __('Reject this suggestion?')
                                                            : __('Delete?'),
                                                    )
                                                ) {
                                                    router.delete(
                                                        `/app/curated-answers/${a.id}`,
                                                    );
                                                }
                                            }}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </SortableList>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
