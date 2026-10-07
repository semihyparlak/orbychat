import { Head, router, useForm } from '@inertiajs/react';
import { Trash2, Workflow } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import InputError from '@/components/input-error';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Rule = {
    id: string;
    name: string;
    kind: string;
    enabled: boolean;
    priority: number;
    action: { kind: string; message?: string } | null;
};

type Props = {
    agent: { id: string; name: string };
    rules: Rule[];
};

const KINDS = [
    'exit_intent',
    'idle',
    'scroll',
    'time',
    'returning',
    'utm',
] as const;

export default function Behavior({ agent, rules }: Props) {
    const form = useForm<{
        name: string;
        kind: string;
        message: string;
    }>({ name: '', kind: 'exit_intent', message: '' });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: __('Agents'), href: '/app/agents' },
        { title: agent.name, href: `/app/agents/${agent.id}` },
        {
            title: __('Behavior triggers'),
            href: `/app/agents/${agent.id}/behavior`,
        },
    ];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.transform((data) => ({
            name: data.name,
            kind: data.kind,
            action: {
                kind: 'open_with_message',
                message: data.message,
            },
            conditions: {},
        }));
        form.post(`/app/agents/${agent.id}/behavior`, {
            onSuccess: () => form.reset(),
        });
    };

    const getKindLabel = (kind: string) => {
        switch (kind) {
            case 'exit_intent':
                return __('Exit intent');
            case 'idle':
                return __('Idle');
            case 'scroll':
                return __('Scroll');
            case 'time':
                return __('Time');
            case 'returning':
                return __('Returning');
            case 'utm':
                return __('UTM');
            default:
                return kind;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__(':name · behavior', { name: agent.name })} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {__('Behavior triggers')}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {__('When a visitor exit-intents, idles, scrolls, etc., open the bar with a custom message.')}
                </p>

                <Card className="max-w-5xl gap-0 overflow-hidden border-border/80">
                    <CardHeader className="border-b bg-muted/20 px-4 py-4 sm:px-5">
                        <div className="flex items-start gap-3">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground shadow-xs">
                                <Workflow className="size-4" />
                            </span>
                            <div className="min-w-0">
                                <CardTitle className="text-sm">
                                    {__('Add a trigger')}
                                </CardTitle>
                                <CardDescription className="mt-1 text-xs leading-5">
                                    {__('Define when the bar should proactively open and what it should say in that moment.')}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <form onSubmit={submit}>
                        <CardContent className="grid gap-4 px-4 py-4 sm:px-5 sm:py-5 md:grid-cols-[minmax(0,1fr)_220px]">
                            <div className="grid gap-1.5">
                                <Label htmlFor="name">{__('Name')}</Label>
                                <Input
                                    id="name"
                                    placeholder={__('Exit intent prompt')}
                                    value={form.data.name}
                                    aria-invalid={Boolean(form.errors.name)}
                                    onChange={(e) =>
                                        form.setData('name', e.target.value)
                                    }
                                />
                                <InputError message={form.errors.name} />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="kind">{__('Kind')}</Label>
                                <Select
                                    value={form.data.kind}
                                    onValueChange={(value) =>
                                        form.setData('kind', value)
                                    }
                                >
                                    <SelectTrigger id="kind">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {KINDS.map((kind) => (
                                            <SelectItem key={kind} value={kind}>
                                                {getKindLabel(kind)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={form.errors.kind} />
                            </div>
                            <div className="grid gap-1.5 md:col-span-2">
                                <Label htmlFor="message">
                                    {__('Bar opens with message')}
                                </Label>
                                <Input
                                    id="message"
                                    placeholder={__('Still comparing options? I can help you find the right plan.')}
                                    value={form.data.message}
                                    aria-invalid={Boolean(form.errors.message)}
                                    onChange={(e) =>
                                        form.setData('message', e.target.value)
                                    }
                                />
                                <p className="text-xs text-muted-foreground">
                                    {__('Keep it short and conversational so the widget feels like a helpful nudge, not a pop-up ad.')}
                                </p>
                                <InputError message={form.errors.message} />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col-reverse gap-2 border-t bg-muted/10 px-4 py-4 sm:flex-row sm:justify-end sm:px-5">
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="w-full sm:w-auto"
                            >
                                {__('Add trigger')}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                <Card className="p-4">
                    <h2 className="mb-3 font-medium">{__('Existing')}</h2>
                    {rules.length === 0 ? (
                        <EmptyState
                            icon={Workflow}
                            title={__('No behavior triggers yet')}
                            description={__('Triggers tell the bar when to proactively pop open: visitor about to leave, idle for a while, scrolled past 50% of the page, returning visitor, arrived from a UTM campaign  —  that kind of thing.')}
                        />
                    ) : (
                        <div className="divide-y">
                            {rules.map((r) => (
                                <div
                                    key={r.id}
                                    className="flex items-center justify-between py-3"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium">
                                            {r.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {getKindLabel(r.kind)} ·{' '}
                                            {r.action?.message
                                                ? `"${r.action.message}"`
                                                : __('(no message)')}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            if (confirm(__('Delete?'))) {
                                                router.delete(
                                                    `/app/behavior-rules/${r.id}`,
                                                );
                                            }
                                        }}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
