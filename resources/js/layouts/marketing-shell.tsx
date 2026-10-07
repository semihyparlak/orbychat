import { Link, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import BrandLockup from '@/components/brand-lockup';
import { Button } from '@/components/ui/button';
import { useBranding } from '@/hooks/use-branding';
import { cn } from '@/lib/utils';
import { dashboard, home, login, register } from '@/routes';
import { __ } from '@/app';
import { LanguageSwitcher } from '@/components/language-switcher';

/**
 * Shared header + footer for every marketing page (home, pricing,
 * how-it-works, privacy, terms). Keeps the navbar identical across the
 * SPA so visitors don't see chrome jump when clicking between pages.
 *
 * Pages render their own content as children. The nav_items / footer
 * blocks come from the controller as a `marketing` Inertia prop so
 * MarketingHomeContent stays the single source of truth.
 */

type ContentLink = {
    label: string;
    href: string;
};

export type MarketingShellContent = {
    nav_items: ContentLink[];
    header: {
        resources_label: string;
        resources_href: string;
    };
    footer: {
        brand_description: string;
        socials: ContentLink[];
        groups: Array<{
            title: string;
            links: ContentLink[];
        }>;
        legal_title: string;
        legal_links: ContentLink[];
        copyright: string;
    };
};

type AuthProps = {
    auth: { user?: { id: number | string } | null };
    canRegister?: boolean;
};

const pineButtonClass =
    'bg-[#173f2c] text-[#f7f4ec] hover:bg-[#123322] hover:text-[#f7f4ec]';

function LogoMark({ className }: { className?: string }) {
    return (
        <span
            className={cn(
                'flex items-center justify-center text-[#173f2c]',
                className,
            )}
        >
            <AppLogoIcon className="size-full" />
        </span>
    );
}

function BrandWordmark({
    logoUrl,
    siteTitle,
    mode,
    size = 'header',
}: {
    logoUrl: string | null;
    siteTitle: string;
    mode: 'logo_text' | 'logo_only' | 'text_only';
    size?: 'header' | 'footer';
}) {
    const fallbackMarkSize = size === 'header' ? 'size-8' : 'size-7';
    const imageClassName =
        size === 'header'
            ? 'h-10 w-auto max-w-[220px] object-contain'
            : 'h-9 w-auto max-w-[180px] object-contain';
    const titleClassName =
        size === 'header'
            ? 'text-2xl font-semibold tracking-normal text-[#263129]'
            : 'text-xl font-semibold text-[#263129]';

    return (
        <Link href={home()} className="flex items-center gap-2.5">
            <BrandLockup
                siteTitle={siteTitle}
                logoUrl={logoUrl}
                mode={mode}
                className="gap-2.5"
                logoClassName={imageClassName}
                textClassName={titleClassName}
                fallbackLogo={<LogoMark className={fallbackMarkSize} />}
            />
        </Link>
    );
}

export function MarketingShell({
    content,
    children,
}: {
    content: MarketingShellContent;
    children: ReactNode;
}) {
    const branding = useBranding();
    const { auth, canRegister } = usePage<AuthProps>().props;
    const hasUser = Boolean(auth.user);
    const siteTitle = branding.site_title || 'OrbyChat';

    const headerPrimaryLabel = hasUser ? __('Dashboard') : __('Get started');
    const headerPrimaryHref = hasUser
        ? dashboard()
        : canRegister
          ? register()
          : login();

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#f7f2e8] text-[#252a24]">
            <header className="mx-auto flex max-w-[1340px] items-center justify-between gap-5 px-6 py-7 lg:px-10">
                <BrandWordmark
                    logoUrl={branding.header_logo_url}
                    siteTitle={siteTitle}
                    mode={branding.header_brand_display}
                />

                <nav className="hidden items-center gap-10 text-sm font-semibold text-[#41483f] lg:flex">
                    {content.nav_items.map((item) => (
                        <Link
                            key={`${item.label}-${item.href}`}
                            href={item.href}
                            className="transition hover:text-[#173f2c]"
                        >
                            {__(item.label)}
                        </Link>
                    ))}
                    {content.header.resources_label ? (
                        // Open in a new tab on purpose:
                        //   1. The docs site is a separate Blade-rendered
                        //      experience (Mintlify-style sidebar + chrome),
                        //      so an Inertia <Link> would trigger the modal-
                        //      overlay fallback we hit before.
                        //   2. Visitors who pop the docs to skim shouldn't
                        //      lose their place on the marketing flow.
                        <a
                            href={content.header.resources_href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 transition hover:text-[#173f2c]"
                        >
                            {__(content.header.resources_label)}
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="size-3 opacity-70"
                                aria-hidden="true"
                            >
                                <path d="M7 17L17 7M9 7h8v8" />
                            </svg>
                        </a>
                    ) : null}
                </nav>

                <div className="flex items-center gap-3 lg:gap-4">
                    <LanguageSwitcher />
                    {!hasUser && (
                        <Link
                            href={login()}
                            className="hidden h-10 items-center rounded-md px-4 text-sm font-semibold text-[#41483f] transition hover:bg-[#173f2c]/5 hover:text-[#173f2c] sm:inline-flex"
                        >
                            {__('Login')}
                        </Link>
                    )}

                    <Button
                        className={cn(
                            'h-10 rounded-md px-4 text-sm font-semibold',
                            pineButtonClass,
                        )}
                        asChild
                    >
                        <Link
                            href={headerPrimaryHref}
                            className="inline-flex items-center gap-1.5"
                        >
                            {headerPrimaryLabel}
                            <ArrowRight className="size-4" />
                        </Link>
                    </Button>
                </div>
            </header>

            <main>{children}</main>

            <footer className="mx-auto grid max-w-[1200px] gap-8 px-6 pt-2 pb-9 lg:grid-cols-[1.5fr_2fr_0.8fr] lg:px-10">
                <div className="flex flex-col gap-4">
                    <BrandWordmark
                        logoUrl={
                            branding.footer_logo_url ?? branding.header_logo_url
                        }
                        siteTitle={siteTitle}
                        mode={branding.footer_brand_display}
                        size="footer"
                    />
                    <p className="max-w-[260px] text-xs leading-5 font-medium text-[#777d73]">
                        {__(content.footer.brand_description)}
                    </p>
                    <div className="flex gap-5 text-sm font-bold text-[#667064]">
                        {content.footer.socials.map((item) => (
                            <Link
                                key={`${item.label}-${item.href}`}
                                href={item.href}
                            >
                                {__(item.label)}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="grid gap-8 sm:grid-cols-3">
                    {content.footer.groups.map((group) => (
                        <div key={group.title}>
                            <h3 className="text-xs font-bold text-[#30362f]">
                                {__(group.title)}
                            </h3>
                            <div className="mt-3 flex flex-col gap-2 text-xs font-medium text-[#777d73]">
                                {group.links.map((item) => (
                                    <Link
                                        key={`${group.title}-${item.label}-${item.href}`}
                                        href={item.href}
                                    >
                                        {__(item.label)}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div>
                    <h3 className="text-xs font-bold text-[#30362f]">
                        {__(content.footer.legal_title)}
                    </h3>
                    <div className="mt-3 flex flex-col gap-2 text-xs font-medium text-[#777d73]">
                        {content.footer.legal_links.map((item) => (
                            <Link
                                key={`${item.label}-${item.href}`}
                                href={item.href}
                            >
                                {__(item.label)}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="text-xs font-medium text-[#92978d] lg:col-span-3 lg:text-center">
                    {__(content.footer.copyright)}
                </div>
            </footer>
        </div>
    );
}
