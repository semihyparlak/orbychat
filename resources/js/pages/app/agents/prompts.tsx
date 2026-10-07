import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { toast } from 'sonner';

type Props = {
    agent: {
        id: string;
        name: string;
        starter_prompts: string[] | null;
    };
};

export default function AgentPrompts({ agent }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: __('Agents'), href: '/app/agents' },
        { title: agent.name, href: `/app/agents/${agent.id}` },
        { title: __('Starter prompts'), href: `/app/agents/${agent.id}/prompts` },
    ];

    const { data, setData, patch, processing } = useForm({
        starter_prompts: agent.starter_prompts || [],
    });

    const addPrompt = () => {
        setData('starter_prompts', [...data.starter_prompts, '']);
    };

    const removePrompt = (index: number) => {
        const newPrompts = [...data.starter_prompts];
        newPrompts.splice(index, 1);
        setData('starter_prompts', newPrompts);
    };

    const updatePrompt = (index: number, value: string) => {
        const newPrompts = [...data.starter_prompts];
        newPrompts[index] = value;
        setData('starter_prompts', newPrompts);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/app/agents/${agent.id}`, {
            preserveScroll: true,
            onSuccess: () => toast.success(__('Starter prompts updated.')),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('Starter prompts')} />

            <div className="flex flex-1 flex-col overflow-y-auto bg-card p-4 lg:p-8">
                <div className="mx-auto w-full max-w-3xl">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <Link
                                href={`/app/agents/${agent.id}`}
                                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                            >
                                <ArrowLeft className="size-4" />
                                {__('Back to agent')}
                            </Link>
                            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
                                {__('Starter prompts')}
                            </h1>
                            <p className="mt-2 text-muted-foreground">
                                {__('Define up to 4-5 questions that visitors see at the start of a conversation.')}
                            </p>
                        </div>
                        <Button onClick={addPrompt} size="sm" variant="outline">
                            <Plus className="mr-2 size-4" />
                            {__('Add question')}
                        </Button>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <Card className="divide-y overflow-hidden">
                            {data.starter_prompts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-12 text-center">
                                    <div className="rounded-full bg-muted p-4">
                                        <Plus className="size-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold">
                                        {__('No starter prompts yet')}
                                    </h3>
                                    <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                                        {__('Add questions to help visitors understand what they can ask your agent.')}
                                    </p>
                                    <Button onClick={addPrompt} className="mt-6" variant="outline">
                                        {__('Add your first question')}
                                    </Button>
                                </div>
                            ) : (
                                data.starter_prompts.map((prompt, index) => (
                                    <div key={index} className="flex items-center gap-3 p-4 bg-background/50">
                                        <GripVertical className="size-4 text-muted-foreground/30" />
                                        <div className="flex-1">
                                            <Input
                                                value={prompt}
                                                onChange={(e) => updatePrompt(index, e.target.value)}
                                                placeholder={__('e.g. What are your pricing plans?')}
                                                className="border-none bg-transparent px-0 text-sm focus-visible:ring-0"
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removePrompt(index)}
                                            className="text-muted-foreground hover:text-destructive"
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </Card>

                        <div className="flex items-center justify-end gap-3 border-t pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                asChild
                            >
                                <Link href={`/app/agents/${agent.id}`}>{__('Cancel')}</Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? __('Saving...') : __('Save changes')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
