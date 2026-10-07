import type { ReactNode } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { getBrandDisplayParts } from '@/lib/brand-display';
import type { BrandDisplayMode } from '@/lib/brand-display';
import { cn } from '@/lib/utils';

type Props = {
    siteTitle: string;
    logoUrl?: string | null;
    mode: BrandDisplayMode;
    className?: string;
    logoClassName?: string;
    textClassName?: string;
    text?: ReactNode;
    fallbackLogo?: ReactNode;
    alt?: string;
};

export default function BrandLockup({
    siteTitle,
    logoUrl,
    mode,
    className,
    logoClassName,
    textClassName,
    text,
    fallbackLogo,
    alt,
}: Props) {
    const { showLogo, showText } = getBrandDisplayParts(mode);

    return (
        <span
            className={cn(
                'inline-flex min-w-0 items-center gap-2.5',
                className,
            )}
        >
            {showLogo ? (
                <span className="flex items-center justify-center text-current">
                    <AppLogoIcon />
                </span>
            ) : null}

            {showText
                ? (text ?? (
                      <span className={cn('min-w-0', textClassName)}>
                          {siteTitle}
                      </span>
                  ))
                : null}

            {showLogo && !showText ? (
                <span className="sr-only">{siteTitle}</span>
            ) : null}
        </span>
    );
}
