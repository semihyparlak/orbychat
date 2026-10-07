import { Head, router, useForm } from '@inertiajs/react';
import { BarChart3, Trash2 } from 'lucide-react';
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

type Cta = {
    id: string;
    name: string;
    label: string;
    kind: string;
    enabled: boolean;
    target: { url?: string } | null;
};

type Props = {
    agent: { id: string; name: string };
    rules: Cta[];
};

const KINDS = ['buy', 'demo', 'signup', 'book', 'link'] as const;

export default function Ctas({ agent, rules }: Props) {
    const form = useForm<{
        name: string;
        label: string;
        kind: string;
        url: string;
    }>({ name: '', label: '', kind: 'demo', url: '' });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: __('Agents'), href: '/app/agents' },
        { title: agent.name, href: `/app/agents/${agent.id}` },
        { title: __('CTAs'), href: `/app/agents/${agent.id}/ctas` },
    ];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.transform((data) => ({
            name: data.name,
            label: data.label,
            kind: data.kind,
            target: { url: data.url },
            conditions: {},
        }));
        form.post(`/app/agents/${agent.id}/ctas`, {
            onSuccess: () => form.reset(),
        });
    };

    const getKindLabel = (kind: string) => {
        switch (kind) {
            case 'buy':
                return __('Buy');
            case 'demo':
                return __('Demo');
            case 'signup':
                return __('Sign up');
            case 'book':
                return __('Book');
            case 'link':
                return __('Link');
            default:
                return kind;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__(':name · CTAs', { name: agent.name })} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {__('Calls to action')}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {__('Buttons that surface in conversations to drive demos, sign-ups, or purchases.')}
                </p>

                <Card className="max-w-5xl gap-0 overflow-hidden border-border/80">
                    <CardHeader className="border-b bg-muted/20 px-4 py-4 sm:px-5">
                        <div className="flex items-start gap-3">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground shadow-xs">
                                <BarChart3 className="size-4" />
                            </span>
                            <div className="min-w-0">
                                <CardTitle className="text-sm">
                                    {__('Add a CTA')}
                                </CardTitle>
                                <CardDescription className="mt-1 text-xs leading-5">
                                    {__('Create a button the assistant can surface during a conversation when a visitor is ready to act.')}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <form onSubmit={submit}>
                        <CardContent className="grid gap-4 px-4 py-4 sm:px-5 sm:py-5 md:grid-cols-2 xl:grid-cols-4">
                            <div className="grid gap-1.5">
                                <Label htmlFor="name">{__('Name (internal)')}</Label>
                                <Input
                                    id="name"
                                    placeholder="book_demo_primary"
                                    value={form.data.name}
                                    aria-invalid={Boolean(form.errors.name)}
                                    onChange={(e) =>
                                        form.setData('name', e.target.value)
                                    }
                                />
                                <InputError message={form.errors.name} />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="label">{__('Button label')}</Label>
                                <Input
                                    id="label"
                                    placeholder={__('Book a demo')}
                                    value={form.data.label}
                                    aria-invalid={Boolean(form.errors.label)}
                                    onChange={(e) =>
                                        form.setData('label', e.target.value)
                                    }
                                />
                                <InputError message={form.errors.label} />
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
                            <div className="grid gap-1.5">
                                <Label htmlFor="url">{__('Target URL')}</Label>
                                <Input
                                    id="url"
                                    type="url"
                                    placeholder="https://your-site.com/demo"
                                    value={form.data.url}
                                    aria-invalid={Boolean(form.errors.url)}
                                    onChange={(e) =>
                                        form.setData('url', e.target.value)
                                    }
                                />
                                <InputError message={form.errors.url} />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col-reverse gap-2 border-t bg-muted/10 px-4 py-4 sm:flex-row sm:justify-end sm:px-5">
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="w-full sm:w-auto"
                            >
                                {__('Add CTA')}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                <Card className="p-4">
                    <h2 className="mb-3 font-medium">{__('Existing')}</h2>
                    {rules.length === 0 ? (
                        <EmptyState
                            icon={BarChart3}
                            title={__('No CTAs configured yet')}
                            description={__('CTAs are buttons the bot can surface mid-conversation to push a visitor toward a demo, signup, or specific URL  —  most useful when you tie them to keywords like \'pricing\' or \'enterprise\'.')}
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
                                            {r.label}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {getKindLabel(r.kind)} →{' '}
                                            {r.target?.url ?? __('(no target)')}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            if (confirm(__('Delete?'))) {
                                                router.delete(
                                                    `/app/cta-rules/${r.id}`,
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
