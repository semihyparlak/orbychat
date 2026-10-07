import { Head, Link } from '@inertiajs/react';
import { BriefcaseBusiness, Gauge } from 'lucide-react';
import { AdminSurface, AdminSurfaceBar } from '@/components/admin-surface';
import AdminLayout from '@/layouts/admin-layout';
import { dashboard as adminDashboard } from '@/routes/admin';
import { index as adminUsageIndex } from '@/routes/admin/usage';
import { show as adminWorkspaceShow } from '@/routes/admin/workspaces';

type Row = {
    workspace_id: string;
    workspace_name: string;
    plan: string;
    used: number;
    limit: number;
    percent: number;
};

export default function AdminUsage({ rows }: { rows: Row[] }) {
    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Dashboard', href: adminDashboard() },
                { title: 'Usage', href: adminUsageIndex() },
            ]}
        >
            <Head title="Usage -· Admin" />
            <AdminSurface>
                <AdminSurfaceBar>
                    <span className="inline-flex h-7 items-center rounded-md border bg-card px-2.5 text-xs font-normal text-foreground">
                        Usage this month
                    </span>
                    <span className="inline-flex h-7 items-center rounded-md border bg-card px-2.5 text-xs font-normal text-muted-foreground">
                        {rows.length.toLocaleString()} workspace
                        {rows.length === 1 ? '' : 's'}
                    </span>
                </AdminSurfaceBar>

                <div className="min-h-0 flex-1 overflow-auto">
                    <table className="w-full min-w-[1080px] border-separate border-spacing-0 text-left text-sm">
                        <thead className="sticky top-0 z-10 bg-card text-xs font-medium text-muted-foreground">
                            <tr>
                                <th className="w-9 border-b px-3 py-2">
                                    <input
                                        type="checkbox"
                                        aria-label="Select all usage rows"
                                        disabled
                                        className="size-3.5 rounded border-input"
                                    />
                                </th>
                                <th className="border-r border-b px-3 py-2">
                                    Workspace
                                </th>
                                <th className="border-r border-b px-3 py-2">
                                    Plan
                                </th>
                                <th className="border-r border-b px-3 py-2">
                                    Usage
                                </th>
                                <th className="border-b px-3 py-2">Health</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="h-72 border-b px-4 text-center"
                                    >
                                        <div className="mx-auto flex max-w-sm flex-col items-center gap-2 text-muted-foreground">
                                            <Gauge className="size-8" />
                                            <p className="text-sm font-medium text-foreground">
                                                No usage recorded
                                            </p>
                                            <p className="text-xs">
                                                No workspace usage has been
                                                recorded for this month.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                rows.map((row) => (
                                    <tr
                                        key={row.workspace_id}
                                        className="group hover:bg-muted/35"
                                    >
                                        <td className="border-b px-3 py-2">
                                            <input
                                                type="checkbox"
                                                aria-label={`Select ${row.workspace_name}`}
                                                disabled
                                                className="size-3.5 rounded border-input"
                                            />
                                        </td>
                                        <td className="border-r border-b px-3 py-2">
                                            <div className="flex min-w-0 items-center gap-2 text-foreground">
                                                <span className="flex size-5 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
                                                    <BriefcaseBusiness className="size-3.5" />
                                                </span>
                                                <Link
                                                    href={adminWorkspaceShow(
                                                        row.workspace_id,
                                                    )}
                                                    className="block truncate font-medium text-foreground hover:text-primary"
                                                >
                                                    {row.workspace_name}
                                                </Link>
                                            </div>
                                        </td>
                                        <td className="border-r border-b px-3 py-2 text-muted-foreground">
                                            {row.plan}
                                        </td>
                                        <td className="border-r border-b px-3 py-2">
                                            <div className="space-y-2">
                                                <p className="text-sm text-foreground">
                                                    {row.used.toLocaleString()}{' '}
                                                    /{' '}
                                                    {row.limit > 0
                                                        ? row.limit.toLocaleString()
                                                        : 'Unlimited'}
                                                </p>
                                                <div className="h-2 rounded-full bg-muted">
                                                    <div
                                                        className={`h-2 rounded-full ${
                                                            row.percent >= 90
                                                                ? 'bg-rose-500'
                                                                : row.percent >=
                                                                    70
                                                                  ? 'bg-amber-500'
                                                                  : 'bg-emerald-500'
                                                        }`}
                                                        style={{
                                                            width: `${Math.min(row.percent, 100)}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border-b px-3 py-2">
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${
                                                    row.percent >= 90
                                                        ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300'
                                                        : row.percent >= 70
                                                          ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300'
                                                          : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300'
                                                }`}
                                            >
                                                <Gauge className="size-3.5" />
                                                {row.percent}%
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </AdminSurface>
        </AdminLayout>
    );
}
