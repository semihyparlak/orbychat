import { Head, router } from '@inertiajs/react';
import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { Fragment, useState } from 'react';
import { AdminSurface, AdminSurfaceBar } from '@/components/admin-surface';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import { dashboard as adminDashboard } from '@/routes/admin';
import { failed as adminFailedJobsIndex } from '@/routes/admin/jobs';
import {
    flush as adminFailedJobsFlush,
    forget as adminFailedJobForget,
    retry as adminFailedJobRetry,
    retryAll as adminFailedJobsRetryAll,
    show as adminFailedJobShow,
} from '@/routes/admin/jobs/failed';

type FailedJob = {
    id: number;
    uuid: string;
    connection: string;
    queue: string;
    job: string;
    failed_at: string;
    exception_first_line: string;
};

type Props = {
    jobs: FailedJob[];
    total: number;
};

type DetailState = {
    loading: boolean;
    exception?: string;
    error?: string;
};

export default function FailedJobsPage({ jobs, total }: Props) {
    const [openUuid, setOpenUuid] = useState<string | null>(null);
    const [detail, setDetail] = useState<Record<string, DetailState>>({});

    const toggle = async (uuid: string) => {
        if (openUuid === uuid) {
            setOpenUuid(null);

            return;
        }

        setOpenUuid(uuid);

        if (detail[uuid]?.exception) {
            return;
        }

        setDetail((d) => ({ ...d, [uuid]: { loading: true } }));

        try {
            const r = await fetch(adminFailedJobShow.url(uuid), {
                credentials: 'same-origin',
                headers: { Accept: 'application/json' },
            });

            if (!r.ok) {
                throw new Error(`HTTP ${r.status}`);
            }

            const j = await r.json();
            setDetail((d) => ({
                ...d,
                [uuid]: { loading: false, exception: j.data.exception },
            }));
        } catch (e) {
            setDetail((d) => ({
                ...d,
                [uuid]: {
                    loading: false,
                    error: e instanceof Error ? e.message : 'Fetch failed',
                },
            }));
        }
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Dashboard', href: adminDashboard() },
                { title: 'Queue Failures', href: adminFailedJobsIndex() },
            ]}
        >
            <Head title="Queue Failures" />
            <AdminSurface>
                <AdminSurfaceBar>
                    <span className="inline-flex h-7 items-center rounded-md border bg-card px-2.5 text-xs font-normal text-foreground">
                        Queue Failures
                    </span>
                    <span className="inline-flex h-7 items-center rounded-md border bg-card px-2.5 text-xs font-normal text-muted-foreground">
                        {total.toLocaleString()} total
                    </span>
                    {jobs.length > 0 ? (
                        <div className="flex w-full flex-wrap items-center gap-2 sm:ml-auto sm:w-auto sm:justify-end">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    if (
                                        confirm(
                                            `Retry all ${total} queue failures?`,
                                        )
                                    ) {
                                        router.post(
                                            adminFailedJobsRetryAll.url(),
                                        );
                                    }
                                }}
                            >
                                Retry all
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    if (
                                        confirm(
                                            `Permanently delete all ${total} failed-job records? Jobs will not run.`,
                                        )
                                    ) {
                                        router.post(adminFailedJobsFlush.url());
                                    }
                                }}
                            >
                                Flush all
                            </Button>
                        </div>
                    ) : null}
                </AdminSurfaceBar>

                <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
                    {jobs.length === 0 ? (
                        <div className="flex h-full items-center justify-center border-b px-4 text-center">
                            <div className="max-w-sm text-sm text-muted-foreground">
                                No queue failures. Queue health is good.
                            </div>
                        </div>
                    ) : (
                        <div className="min-h-0 flex-1 overflow-auto rounded-lg border bg-card">
                            <table className="min-w-full border-separate border-spacing-0 text-sm">
                                <thead className="sticky top-0 z-10 bg-card text-left text-xs font-medium text-muted-foreground">
                                    <tr>
                                        <th className="w-8 border-b px-3 py-2"></th>
                                        <th className="border-r border-b px-3 py-2">
                                            Job
                                        </th>
                                        <th className="border-r border-b px-3 py-2">
                                            Queue
                                        </th>
                                        <th className="border-r border-b px-3 py-2">
                                            Failed at
                                        </th>
                                        <th className="border-r border-b px-3 py-2">
                                            Exception
                                        </th>
                                        <th className="border-b px-3 py-2 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.map((job) => {
                                        const isOpen = openUuid === job.uuid;
                                        const d = detail[job.uuid];

                                        return (
                                            <Fragment key={job.id}>
                                                <tr className="group hover:bg-muted/35">
                                                    <td className="border-b px-3 py-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                toggle(job.uuid)
                                                            }
                                                            className="text-muted-foreground hover:text-foreground"
                                                            aria-label={
                                                                isOpen
                                                                    ? 'Collapse'
                                                                    : 'Expand'
                                                            }
                                                        >
                                                            {isOpen ? (
                                                                <ChevronDown className="size-4" />
                                                            ) : (
                                                                <ChevronRight className="size-4" />
                                                            )}
                                                        </button>
                                                    </td>
                                                    <td className="border-r border-b px-3 py-2 font-medium text-foreground">
                                                        {job.job}
                                                    </td>
                                                    <td className="border-r border-b px-3 py-2 text-muted-foreground">
                                                        {job.queue}
                                                    </td>
                                                    <td className="border-r border-b px-3 py-2 whitespace-nowrap text-muted-foreground">
                                                        {new Date(
                                                            job.failed_at,
                                                        ).toLocaleString()}
                                                    </td>
                                                    <td
                                                        className="max-w-[36rem] cursor-pointer truncate border-r border-b px-3 py-2 text-destructive"
                                                        title={
                                                            job.exception_first_line
                                                        }
                                                        onClick={() =>
                                                            toggle(job.uuid)
                                                        }
                                                    >
                                                        {
                                                            job.exception_first_line
                                                        }
                                                    </td>
                                                    <td className="border-b px-3 py-2 text-right whitespace-nowrap">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                router.post(
                                                                    adminFailedJobRetry.url(
                                                                        job.uuid,
                                                                    ),
                                                                )
                                                            }
                                                        >
                                                            Retry
                                                        </Button>{' '}
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                if (
                                                                    confirm(
                                                                        'Permanently remove this failed-job record?',
                                                                    )
                                                                ) {
                                                                    router.post(
                                                                        adminFailedJobForget.url(
                                                                            job.uuid,
                                                                        ),
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </td>
                                                </tr>
                                                {isOpen && (
                                                    <tr className="bg-muted/25">
                                                        <td
                                                            colSpan={6}
                                                            className="border-b px-3 py-3"
                                                        >
                                                            {d?.loading && (
                                                                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                    <Loader2 className="size-3 animate-spin" />
                                                                    loading
                                                                    stack
                                                                    trace...
                                                                </p>
                                                            )}
                                                            {d?.error && (
                                                                <p className="text-xs text-destructive">
                                                                    {d.error}
                                                                </p>
                                                            )}
                                                            {d?.exception && (
                                                                <pre className="max-h-96 overflow-y-auto rounded border bg-background p-3 text-[11px] leading-snug whitespace-pre-wrap">
                                                                    {
                                                                        d.exception
                                                                    }
                                                                </pre>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )}
                                            </Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </AdminSurface>
        </AdminLayout>
    );
}
