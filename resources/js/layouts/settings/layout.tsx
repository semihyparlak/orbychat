import { Link, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import { index as brandingSettings } from '@/routes/settings/branding';
import { index as marketingSettings } from '@/routes/settings/marketing';
import { index as privacySettings } from '@/routes/settings/privacy';
import { index as systemSettings } from '@/routes/settings/system';
import type { NavItem } from '@/types';

type NavGroup = {
    title: string;
    items: NavItem[];
};

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const { auth } = usePage<{
        auth: { user: { is_super_admin?: boolean } | null };
    }>().props;
    const isAdmin = auth?.user?.is_super_admin === true;

    // Define items INSIDE the component so __() is called only during render
    const baseNavItems: NavItem[] = [
        {
            title: __('Profile'),
            href: edit(),
            icon: null,
        },
        {
            title: __('Security'),
            href: editSecurity(),
            icon: null,
        },
        {
            title: __('Appearance'),
            href: editAppearance(),
            icon: null,
        },
        {
            title: __('Widget'),
            href: '/settings/widget',
            icon: null,
        },
    ];

    const adminOnlyNavItems: NavItem[] = [
        {
            title: __('System'),
            href: systemSettings(),
            icon: null,
        },
        {
            title: __('Widget defaults'),
            href: '/settings/widget-defaults',
            icon: null,
        },
        {
            title: __('Branding'),
            href: brandingSettings(),
            icon: null,
        },
        {
            title: __('Marketing site'),
            href: marketingSettings(),
            icon: null,
        },
        {
            title: __('Privacy & GDPR'),
            href: privacySettings(),
            icon: null,
        },
    ];

    const navGroups: NavGroup[] = isAdmin
        ? [
              {
                  title: __('Account'),
                  items: baseNavItems,
              },
              {
                  title: __('Platform'),
                  items: adminOnlyNavItems,
              },
          ]
        : [
              {
                  title: __('Account'),
                  items: baseNavItems,
              },
          ];

    return (
        <div className="px-4 py-6 lg:px-6">
            <Heading
                title={__('Settings')}
                description={__('Manage your profile and account settings')}
            />

            <div className="mt-6 grid gap-8 xl:grid-cols-[240px_minmax(0,1fr)] xl:items-start xl:gap-10">
                <aside className="w-full xl:sticky xl:top-6">
                    <div className="overflow-hidden rounded-2xl border border-border/70 bg-muted/20 shadow-sm">
                        {navGroups.map((group, groupIndex) => (
                            <div key={group.title}>
                                <div className="p-3">
                                    <p className="px-3 pb-2 text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                                        {group.title}
                                    </p>
                                    <nav
                                        className="grid gap-1"
                                        aria-label={`${group.title} settings`}
                                    >
                                        {group.items.map((item, index) => {
                                            const isActive =
                                                isCurrentOrParentUrl(item.href);

                                            return (
                                                <Link
                                                    key={`${toUrl(item.href)}-${index}`}
                                                    href={item.href}
                                                    className={cn(
                                                        'flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                                                        {
                                                            'bg-background text-foreground shadow-sm ring-1 ring-border/80':
                                                                isActive,
                                                            'text-muted-foreground hover:bg-background/80 hover:text-foreground':
                                                                !isActive,
                                                        },
                                                    )}
                                                >
                                                    {item.icon && (
                                                        <item.icon className="h-4 w-4" />
                                                    )}
                                                    <span>{item.title}</span>
                                                </Link>
                                            );
                                        })}
                                    </nav>
                                </div>

                                {groupIndex < navGroups.length - 1 ? (
                                    <Separator />
                                ) : null}
                            </div>
                        ))}
                    </div>
                </aside>

                <div className="min-w-0">
                    <section className="w-full max-w-[1120px] space-y-8">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}
