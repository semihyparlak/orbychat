import { Head } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Gap = {
    id: string;
    question: string;
    occurrences: number;
    last_seen_at: string | null;
    status: 'open' | 'answered' | 'ignored';
};

type Props = {
    gaps: Gap[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: __('Analytics'), href: '/app/analytics' },
    { title: __('Content gaps'), href: '/app/analytics/content-gaps' },
];

export default function ContentGaps({ gaps }: Props) {
    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'open':
                return __('open');
            case 'answered':
                return __('answered');
            case 'ignored':
                return __('ignored');
            default:
                return status;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('Content gaps')} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {__('Content gaps')}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {__("Questions visitors asked that the agent couldn't answer well  —  your top opportunities to add curated answers or new sources.")}
                </p>

                <Card className="p-4">
                    {gaps.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            {__("No gaps yet  —  visitors haven't asked unanswerable questions.")}
                        </p>
                    ) : (
                        <div className="divide-y">
                            {gaps.map((g) => (
                                <div
                                    key={g.id}
                                    className="flex items-center justify-between py-3"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium">
                                            {g.question}
                                        </p>
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            {__('asked :count times', { count: g.occurrences })}
                                            {g.last_seen_at && (
                                                <>
                                                    {' '}
                                                    · {__('last :date', { date: new Date(g.last_seen_at).toLocaleString() })}
                                                </>
                                            )}
                                        </p>
                                    </div>
                                    <span className="rounded bg-amber-500/15 px-2 py-0.5 text-xs text-amber-700 dark:text-amber-400">
                                        {getStatusLabel(g.status)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
