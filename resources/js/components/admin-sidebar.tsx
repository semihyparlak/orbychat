import { Link } from '@inertiajs/react';
import {
    AlertTriangle,
    Bot,
    Building2,
    CreditCard,
    Gauge,
    Inbox,
    LayoutDashboard,
    MessagesSquare,
    Tags,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
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
import { useBranding } from '@/hooks/use-branding';
import type { NavItem } from '@/types';

const adminNav: NavItem[] = [
    { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { title: 'Workspaces', href: '/admin/workspaces', icon: Building2 },
    { title: 'Users', href: '/admin/users', icon: Users },
    { title: 'Agents', href: '/admin/agents', icon: Bot },
    {
        title: 'Conversations',
        href: '/admin/conversations',
        icon: MessagesSquare,
    },
    { title: 'Leads', href: '/admin/leads', icon: Inbox },
    { title: 'Plans', href: '/admin/plans', icon: Tags },
    { title: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
    { title: 'Usage', href: '/admin/usage', icon: Gauge },
    {
        title: 'Queue Failures',
        href: '/admin/jobs/failed',
        icon: AlertTriangle,
    },
    // Internal Kanban board lives at /admin/board but is intentionally
    // not surfaced in this nav  —  it's an internal-team-only tool, not
    // a feature buyers should see in their sidebar. Reach it directly
    // via the URL or the docs page.
];

export function AdminSidebar() {
    const branding = useBranding();

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
                            <Link href="/admin" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="gap-0 py-3">
                <NavMain items={adminNav} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
