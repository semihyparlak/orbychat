import AppLogoIcon from '@/components/app-logo-icon';
import BrandLockup from '@/components/brand-lockup';
import { useBranding } from '@/hooks/use-branding';
import { getBrandDisplayParts } from '@/lib/brand-display';
import { cn } from '@/lib/utils';

export default function AppLogo() {
    const branding = useBranding();
    const mode = branding.dashboard_brand_display;
    const { showLogo, showText } = getBrandDisplayParts(mode);

    return (
        <BrandLockup
            siteTitle={branding.site_title}
            logoUrl={branding.dashboard_logo_url}
            mode={mode}
            className={cn(
                'h-8 max-w-full items-center',
                showLogo && showText ? 'gap-2.5' : 'gap-0',
            )}
            logoClassName={cn(
                'h-8 w-auto shrink-0 object-contain',
                showText ? 'max-w-[180px]' : 'max-w-[220px]',
            )}
            textClassName="block min-w-0 truncate text-left text-sm font-semibold leading-none"
            fallbackLogo={
                <div className="flex items-center justify-center">
                    <AppLogoIcon />
                </div>
            }
        />
    );
}
