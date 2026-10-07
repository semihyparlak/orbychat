import { Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BarChart3,
    Bot,
    Calendar,
    CreditCard,
    Inbox,
    LayoutGrid,
    MessagesSquare,
    Plug,
    Sparkles,
    Users,
    Workflow as WorkflowIcon,
    Zap,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { __ } from '@/app';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { WorkspaceSwitcher } from '@/components/workspace-switcher';
import { useBranding } from '@/hooks/use-branding';
import { cn } from '@/lib/utils';
import { dashboard, onboarding } from '@/routes';
import { index as agentsIndex } from '@/routes/agents';
import { overview as analyticsOverview } from '@/routes/analytics';
import { show as billingShow } from '@/routes/billing';
import { index as conversationsIndex } from '@/routes/conversations';
import { index as inboxIndex } from '@/routes/inbox';
import { index as integrationsIndex } from '@/routes/integrations';
import { index as membersIndex } from '@/routes/members';
import type { NavItem } from '@/types';

type SidebarNavItem = NavItem & {
    badge?: string;
    className?: string;
};

const mainNavItems: SidebarNavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Inbox',
        href: inboxIndex(),
        icon: Inbox,
    },
    {
        title: 'Calendar',
        href: '/app/calendar',
        icon: Calendar,
    },
    {
        title: 'Conversations',
        href: conversationsIndex(),
        icon: MessagesSquare,
    },
    {
        title: 'Agents',
        href: agentsIndex(),
        icon: Bot,
    },
    {
        title: 'Workflows',
        href: '/app/workflows',
        icon: WorkflowIcon,
    },
    {
        title: 'Analytics',
        href: analyticsOverview(),
        icon: BarChart3,
    },
    {
        title: 'Integrations',
        href: integrationsIndex(),
        icon: Plug,
    },
    {
        title: 'Members',
        href: membersIndex().url,
        icon: Users,
    },
    {
        title: 'Billing',
        href: billingShow(),
        icon: CreditCard,
    },
];

// Shared shape for both footer cards. Background + border are
// applied per-card so each can pick its own brand accent.
// Shadow is dark-mode only  —  on a cream sidebar in light mode the
// heavy outer-glow shadow looks like a rendering bug.
const footerCardClassName =
    'group relative flex h-[59px] w-full items-center gap-[14px] overflow-hidden rounded-lg border px-[10px] text-left transition-all duration-200 ' +
    'dark:shadow-[0_22px_48px_-38px_rgba(0,0,0,0.96),inset_0_1px_0_rgba(255,255,255,0.045)]';

const footerIconWrapClassName =
    'relative flex size-9 shrink-0 items-center justify-center rounded-lg border ' +
    'dark:shadow-[0_18px_32px_-22px_rgba(0,0,0,0.92),inset_0_1px_0_rgba(255,255,255,0.16)]';

export function AppSidebar() {
    const branding = useBranding();
    const { auth, features, billingSummary } = usePage<{
        auth: { user: { is_super_admin?: boolean } | null };
        features: { has_appointments: boolean };
        billingSummary: { plan?: { slug: string } } | null;
    }>().props;
    const isAdmin = auth?.user?.is_super_admin === true;
    
    const translatedNavItems = mainNavItems.map(item => ({
        ...item,
        title: __(item.title)
    }));

    let customerNavItems = isAdmin
        ? translatedNavItems.filter((item) => item.title !== __('Billing'))
        : translatedNavItems;

    if (!features?.has_appointments) {
        customerNavItems = customerNavItems.filter((item) => item.title !== __('Calendar'));
    }

    return (
        <Sidebar collapsible="icon" className="border-r border-sidebar-border">
            <SidebarHeader className="border-b border-sidebar-border/80 p-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            tooltip={{ children: branding.site_title }}
                            className="h-11 rounded-xl px-3 transition-colors group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:p-0! hover:bg-sidebar-accent/60"
                        >
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="gap-0 py-3">
                <NavMain items={customerNavItems} />
            </SidebarContent>

            <SidebarFooter className="gap-3 border-t border-sidebar-border/70 p-[11px] group-data-[collapsible=icon]:p-2">
                <div className="space-y-[9px] group-data-[collapsible=icon]:hidden">
                    <WorkspaceSwitcher />

                    <Link
                        href={onboarding()}
                        className={cn(
                            footerCardClassName,
                            // Light: white surface, soft violet tint, violet border + accent
                            'border-violet-200 bg-violet-50 hover:border-violet-300 hover:bg-violet-100',
                            // Dark: rich glow gradient (the original treatment)
                            'dark:border-violet-300/14 dark:bg-[radial-gradient(circle_at_18%_24%,rgba(122,91,255,0.22),transparent_38%),linear-gradient(105deg,rgba(24,23,36,0.98),rgba(16,17,25,0.98)_64%,rgba(22,23,37,0.98))] dark:hover:border-violet-200/24 dark:hover:bg-[radial-gradient(circle_at_18%_24%,rgba(147,118,255,0.28),transparent_40%),linear-gradient(105deg,rgba(28,26,43,1),rgba(17,18,27,1)_66%,rgba(25,26,42,1))]',
                        )}
                    >
                        <span
                            className={cn(
                                footerIconWrapClassName,
                                // Light: solid violet tile, white icon
                                'border-violet-300 bg-violet-500',
                                // Dark: glassy violet gradient
                                'dark:border-violet-200/18 dark:bg-[radial-gradient(circle_at_72%_24%,rgba(255,255,255,0.22),transparent_18%),linear-gradient(180deg,rgba(92,72,159,0.62),rgba(42,36,67,0.88))]',
                            )}
                        >
                            <Sparkles className="size-5 text-white dark:drop-shadow-[0_0_10px_rgba(221,214,254,0.35)]" />
                        </span>
                        <span className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
                            <span className="truncate text-[13px] leading-none font-semibold text-violet-950 dark:text-white/96">
                                {__('Getting Started')}
                            </span>
                            <span className="truncate text-[11px] leading-none font-medium text-violet-700/80 dark:text-white/54">
                                {__('Set up :name in a few steps', { name: branding.site_title })}
                            </span>
                        </span>
                        <ArrowRight className="ml-auto size-4 shrink-0 text-violet-700 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-violet-900 dark:text-white/78 dark:group-hover:text-white" />
                    </Link>

                    {!isAdmin && (billingSummary?.plan?.slug === 'free' || !billingSummary?.plan) && (
                        <Link
                            href={billingShow()}
                            className={cn(
                                footerCardClassName,
                                // Light: sky-tinted card, dark text
                                'border-sky-200 bg-sky-50 hover:border-sky-300 hover:bg-sky-100',
                                // Dark: glow gradient
                                'dark:border-sky-300/18 dark:bg-[radial-gradient(circle_at_18%_24%,rgba(15,118,255,0.30),transparent_36%),linear-gradient(105deg,rgba(8,25,42,0.98),rgba(10,13,18,0.98)_64%,rgba(11,15,21,0.98))] dark:hover:border-sky-200/28 dark:hover:bg-[radial-gradient(circle_at_18%_24%,rgba(30,134,255,0.36),transparent_38%),linear-gradient(105deg,rgba(8,31,54,1),rgba(10,14,20,1)_66%,rgba(11,16,23,1))]',
                            )}
                        >
                            <span
                                className={cn(
                                    footerIconWrapClassName,
                                    'border-sky-300 bg-[linear-gradient(180deg,#2f86ff,#164fff)] text-white',
                                    'dark:border-sky-200/34 dark:shadow-[0_0_34px_-12px_rgba(37,99,235,0.92),inset_0_1px_0_rgba(255,255,255,0.2)]',
                                )}
                            >
                                <Zap className="size-5 dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.45)]" />
                            </span>
                            <span className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
                                <span className="truncate text-[13px] leading-none font-semibold text-sky-950 dark:text-white/96">
                                    {__('Upgrade to Pro')}
                                </span>
                                <span className="truncate text-[11px] leading-none font-medium text-sky-700/80 dark:text-white/54">
                                    {__('Unlock more conversations')}
                                </span>
                            </span>
                            <ArrowRight className="ml-auto size-4 shrink-0 text-sky-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-sky-800 dark:text-blue-400 dark:group-hover:text-blue-200" />
                        </Link>
                    )}
                </div>

                <SidebarMenu className="hidden group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col">
                    <SidebarMenuItem>
                        <WorkspaceSwitcher />
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            tooltip={{ children: __('Getting Started') }}
                            className="h-9 rounded-xl border border-sidebar-border/60 bg-sidebar-accent/35"
                        >
                            <Link href={onboarding()}>
                                <Sparkles className="size-4" />
                                <span>{__('Getting Started')}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    {!isAdmin && (billingSummary?.plan?.slug === 'free' || !billingSummary?.plan) && (
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                tooltip={{ children: __('Upgrade to Pro') }}
                                className="h-9 rounded-xl border border-sidebar-border/60 bg-sidebar-accent/35"
                            >
                                <Link href={billingShow()}>
                                    <CreditCard className="size-4" />
                                    <span>{__('Upgrade to Pro')}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                </SidebarMenu>

                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
