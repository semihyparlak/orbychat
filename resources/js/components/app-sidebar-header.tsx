import { Link, usePage } from '@inertiajs/react';
import { House } from 'lucide-react';
import { AdminHeaderActions } from '@/components/admin-header-actions';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { GlobalSearch } from '@/components/global-search';
import { LanguageSwitcher } from '@/components/language-switcher';
import { LeadNotificationsToggle } from '@/components/lead-notifications-toggle';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth, adminHeader } = usePage<{
        auth: { user: { is_super_admin?: boolean } | null };
        adminHeader: {
            site_health: {
                score: number;
                label: string;
                status: 'healthy' | 'warning' | 'critical';
                ok_checks: number;
                total_checks: number;
                issues_count: number;
            };
            notifications: {
                unread_count: number;
                items: Array<{
                    key: string;
                    title: string;
                    body: string;
                    severity: 'critical' | 'warning' | 'info';
                    href: string;
                }>;
            };
        } | null;
    }>().props;
    const isAdmin = auth?.user?.is_super_admin === true;

    return (
        <header className="flex h-[69px] max-h-[69px] min-h-[69px] shrink-0 items-center gap-3 overflow-hidden border-b bg-card px-3 sm:px-4">
            <SidebarTrigger className="-ml-1 shrink-0 text-muted-foreground hover:text-foreground" />
            <div className="min-w-0 flex-1">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                {/* Search is the most discardable element on a tiny phone  — 
                    hide below sm so the breadcrumb + admin actions still
                    fit without overflowing the locked 69px row. */}
                <div className="hidden sm:block">
                    <GlobalSearch scope={isAdmin ? 'platform' : 'workspace'} />
                </div>

                {/* Home + theme toggle ship for every signed-in user
                    (admin or member); placed before AdminHeaderActions so
                    the platform-only health pill stays at the right edge. */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            asChild
                            className="size-9 rounded-xl border-border/70 bg-background/80 shadow-xs"
                        >
                            <Link href="/" prefetch>
                                <House className="size-4" />
                                <span className="sr-only">
                                    {__('Open marketing site')}
                                </span>
                            </Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        {__('Marketing site')}
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="inline-flex">
                            <ThemeToggle />
                        </span>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">{__('Toggle theme')}</TooltipContent>
                </Tooltip>

                <LanguageSwitcher />

                <LeadNotificationsToggle />

                {isAdmin ? <AdminHeaderActions header={adminHeader} /> : null}
            </div>
        </header>
    );
}
