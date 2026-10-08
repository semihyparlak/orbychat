import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AccountLayout from '@/layouts/account-layout';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { Branding } from '@/types/branding';
import { createRoot } from 'react-dom/client';

const defaultAppName = import.meta.env.VITE_APP_NAME || 'OrbyChat';

function currentSiteTitle(): string {
    if (typeof window === 'undefined') {
        return defaultAppName;
    }

    return (
        window.__ORBYCHAT_SITE_TITLE__ ??
        window.__PITCHBAR_SITE_TITLE__ ??
        document
            .querySelector('meta[name="application-name"]')
            ?.getAttribute('content') ??
        defaultAppName
    );
}

/**
 * Global translation helper.
 */
let globalTranslations: Record<string, string> = {};

export function __(key: string, replacements: Record<string, string | number> = {}): string {
    let translation = globalTranslations[key] !== undefined ? globalTranslations[key] : key;

    Object.keys(replacements).forEach((r) => {
        translation = translation.replace(new RegExp(`:${r}`, 'g'), String(replacements[r]));
    });

    return translation;
}

// Make it available globally
(window as any).__ = __;

function upsertHeadLink(id: string, rel: string, href: string): void {
    let link = document.getElementById(id) as HTMLLinkElement | null;

    if (link === null) {
        link = document.createElement('link');
        link.id = id;
        document.head.appendChild(link);
    }

    link.rel = rel;
    link.href = href;
}

function syncBranding(branding?: Branding): void {
    if (typeof window === 'undefined') {
        return;
    }

    const previousTitle = currentSiteTitle();
    const nextSiteTitle = branding?.site_title?.trim() || previousTitle;

    window.__ORBYCHAT_SITE_TITLE__ = nextSiteTitle;
    window.__PITCHBAR_SITE_TITLE__ = nextSiteTitle;

    const meta = document.querySelector('meta[name="application-name"]');

    if (meta !== null) {
        meta.setAttribute('content', nextSiteTitle);
    }

    if (document.title === previousTitle) {
        document.title = nextSiteTitle;
    } else if (document.title.endsWith(` - ${previousTitle}`)) {
        document.title = `${document.title.slice(0, -` - ${previousTitle}`.length)} - ${nextSiteTitle}`;
    }

    const faviconUrl =
        branding?.favicon_url ??
        window.__ORBYCHAT_DEFAULT_FAVICON_URL__ ??
        window.__PITCHBAR_DEFAULT_FAVICON_URL__ ??
        '/favicon.ico';
    const touchIconUrl =
        branding?.favicon_url ??
        window.__ORBYCHAT_DEFAULT_TOUCH_ICON_URL__ ??
        window.__PITCHBAR_DEFAULT_TOUCH_ICON_URL__ ??
        '/apple-touch-icon.png';

    window.__ORBYCHAT_FAVICON_URL__ = faviconUrl;
    window.__PITCHBAR_FAVICON_URL__ = faviconUrl;
    upsertHeadLink('app-favicon', 'icon', faviconUrl);
    upsertHeadLink('app-apple-touch-icon', 'apple-touch-icon', touchIconUrl);
}

if (typeof window !== 'undefined') {
    router.on('navigate', (event) => {
        const page = (
            event as CustomEvent<{ page?: { props?: { branding?: Branding; translations?: Record<string, string> } } }>
        ).detail?.page;

        syncBranding(page?.props?.branding);
        
        if (page?.props?.translations) {
            globalTranslations = page?.props?.translations;
        }
    });
}

createInertiaApp({
    title: (title) => {
        const siteTitle = currentSiteTitle();

        return title ? `${title} - ${siteTitle}` : siteTitle;
    },
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ).then((module: any) => {
            if (!module || !module.default) {
                return module;
            }

            const page = module.default;
            const pageName = name.toLowerCase();

            // 1. Marketing pages handle their own shell or have none.
            if (
                pageName.startsWith('marketing/') ||
                pageName === 'welcome' ||
                pageName === 'home'
            ) {
                return module;
            }

            // 2. If the page doesn't have a layout function, we provide one based on the path.
            // We check if layout is undefined OR an object (which means it's metadata, not a component).
            if (
                typeof page.layout === 'undefined' ||
                (typeof page.layout === 'object' && page.layout !== null)
            ) {
                const layoutProps = typeof page.layout === 'object' ? page.layout : {};

                if (pageName.startsWith('auth/')) {
                    page.layout = (children: any) => (
                        <AuthLayout {...layoutProps} children={children} />
                    );
                } else if (pageName.startsWith('settings/')) {
                    page.layout = (children: any) => (
                        <AppLayout {...layoutProps}>
                            <SettingsLayout children={children} />
                        </AppLayout>
                    );
                } else if (pageName.startsWith('account/')) {
                    page.layout = (children: any) => (
                        <AppLayout {...layoutProps}>
                            <AccountLayout children={children} />
                        </AppLayout>
                    );
                }
            }

            return module;
        }),
    setup({ el, App, props }) {
        // Initialize translations from the initial page load
        if (props.initialPage.props.translations) {
            globalTranslations = props.initialPage.props.translations as Record<string, string>;
        }

        const root = createRoot(el);
        root.render(
            <TooltipProvider delayDuration={0}>
                <App {...props} />
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
