import { Head, router } from '@inertiajs/react';
import { Shield, UserRound } from 'lucide-react';
import { AdminSurface, AdminSurfaceBar } from '@/components/admin-surface';
import { TablePagination } from '@/components/table-pagination';
import type { PaginationMeta } from '@/components/table-pagination';
import { TableSearch } from '@/components/table-search';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import { relativeTime } from '@/lib/relative-time';
import { dashboard as adminDashboard } from '@/routes/admin';
import { start as adminImpersonateStart } from '@/routes/admin/impersonate';
import {
    index as adminUsersIndex,
    updateRole as adminUsersUpdateRole,
} from '@/routes/admin/users';

type UserRow = {
    id: number;
    name: string;
    email: string;
    role: 'customer' | 'super_admin';
    workspaces_count: number;
    owned_count: number;
    created_at: string | null;
};

type Props = {
    users: UserRow[];
    pagination: PaginationMeta;
    filters: { q: string };
};

const USERS_ONLY = ['users', 'pagination', 'filters'];

export default function AdminUsers({ users, pagination, filters }: Props) {
    const promote = (id: number, to: 'customer' | 'super_admin') => {
        router.patch(
            adminUsersUpdateRole.url(id),
            { role: to },
            { preserveScroll: true },
        );
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Dashboard', href: adminDashboard() },
                { title: 'Users', href: adminUsersIndex() },
            ]}
        >
            <Head title="Users -· Admin" />
            <AdminSurface>
                <AdminSurfaceBar>
                    <span className="inline-flex h-7 items-center rounded-md border bg-card px-2.5 text-xs font-normal text-foreground">
                        All users
                    </span>
                    <span className="inline-flex h-7 items-center rounded-md border bg-card px-2.5 text-xs font-normal text-muted-foreground">
                        {pagination.total.toLocaleString()} users
                    </span>
                    <div className="ml-auto w-full sm:w-auto">
                        <TableSearch
                            placeholder="Search by name or email..."
                            initialValue={filters.q}
                            only={USERS_ONLY}
                        />
                    </div>
                </AdminSurfaceBar>

                <div className="min-h-0 flex-1 overflow-auto">
                    <table className="w-full min-w-[1080px] border-separate border-spacing-0 text-left text-sm">
                        <thead className="sticky top-0 z-10 bg-card text-xs font-medium text-muted-foreground">
                            <tr>
                                <th className="w-9 border-b px-3 py-2">
                                    <input
                                        type="checkbox"
                                        aria-label="Select all users"
                                        disabled
                                        className="size-3.5 rounded border-input"
                                    />
                                </th>
                                <th className="border-r border-b px-3 py-2">
                                    User
                                </th>
                                <th className="border-r border-b px-3 py-2">
                                    Role
                                </th>
                                <th className="border-r border-b px-3 py-2">
                                    Workspace access
                                </th>
                                <th className="border-r border-b px-3 py-2">
                                    Joined
                                </th>
                                <th className="border-b px-3 py-2 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="h-72 border-b px-4 text-center"
                                    >
                                        <div className="mx-auto flex max-w-sm flex-col items-center gap-2 text-muted-foreground">
                                            <UserRound className="size-8" />
                                            <p className="text-sm font-medium text-foreground">
                                                No matching users
                                            </p>
                                            <p className="text-xs">
                                                No users match the current admin
                                                search.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="group hover:bg-muted/35"
                                    >
                                        <td className="border-b px-3 py-2">
                                            <input
                                                type="checkbox"
                                                aria-label={`Select ${user.email}`}
                                                disabled
                                                className="size-3.5 rounded border-input"
                                            />
                                        </td>
                                        <td className="border-r border-b px-3 py-2">
                                            <div className="flex min-w-0 items-center gap-2 text-foreground">
                                                <span className="flex size-5 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
                                                    <UserRound className="size-3.5" />
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="truncate font-medium">
                                                        {user.name}
                                                    </p>
                                                    <p className="truncate text-xs text-muted-foreground">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border-r border-b px-3 py-2">
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${
                                                    user.role === 'super_admin'
                                                        ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300'
                                                        : 'border-border bg-muted/40 text-muted-foreground'
                                                }`}
                                            >
                                                {user.role === 'super_admin' ? (
                                                    <Shield className="size-3.5" />
                                                ) : null}
                                                {user.role.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="border-r border-b px-3 py-2 text-muted-foreground">
                                            <p>
                                                {user.workspaces_count.toLocaleString()}{' '}
                                                total workspace
                                                {user.workspaces_count === 1
                                                    ? ''
                                                    : 's'}
                                            </p>
                                            <p className="text-xs">
                                                {user.owned_count.toLocaleString()}{' '}
                                                owned
                                            </p>
                                        </td>
                                        <td className="border-r border-b px-3 py-2 text-muted-foreground">
                                            {relativeTime(user.created_at, ' — ')}
                                        </td>
                                        <td className="border-b px-3 py-2">
                                            <div className="flex justify-end gap-2">
                                                {user.role === 'customer' ? (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() =>
                                                                router.post(
                                                                    adminImpersonateStart.url(
                                                                        user.id,
                                                                    ),
                                                                )
                                                            }
                                                        >
                                                            Impersonate
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => {
                                                                if (
                                                                    confirm(
                                                                        `Promote ${user.email} to super_admin?`,
                                                                    )
                                                                ) {
                                                                    promote(
                                                                        user.id,
                                                                        'super_admin',
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            Promote
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => {
                                                            if (
                                                                confirm(
                                                                    `Demote ${user.email} to customer?`,
                                                                )
                                                            ) {
                                                                promote(
                                                                    user.id,
                                                                    'customer',
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        Demote
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <TablePagination pagination={pagination} only={USERS_ONLY} />
            </AdminSurface>
        </AdminLayout>
    );
}
