import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { ImpersonationBanner } from '@/components/impersonation-banner';
import { UsageBanner } from '@/components/usage-banner';
import { WhatsNewBanner } from '@/components/whats-new-banner';
import { useLeadToasts } from '@/hooks/use-lead-toasts';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    // Live lead-capture toasts. The hook polls /app/leads/feed every
    // 30s so a workspace member with the dashboard open gets a sonner
    // toast (and an OS notification when permission is granted) the
    // moment a visitor's inline lead form lands.
    useLeadToasts(true);

    return (
        <>
            <ImpersonationBanner />
            <UsageBanner />
            <AppShell variant="sidebar" sidebarWidth="20rem">
                <AppSidebar />
                <AppContent variant="sidebar" className="overflow-x-hidden">
                    {/*
                     * What's-new banner mounts inside AppContent so
                     * the fixed-position sidebar never clips its
                     * left edge. The v1.1.0 launch bug ("'s new in"
                     * with the leading "What" hidden) was caused by
                     * having it above AppShell.
                     */}
                    <WhatsNewBanner />
                    <AppSidebarHeader breadcrumbs={breadcrumbs} />
                    {children}
                </AppContent>
            </AppShell>
        </>
    );
}
