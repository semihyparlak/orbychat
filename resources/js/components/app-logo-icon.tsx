import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * OrbyChat Brand Icon
 * Renders the custom PNG logo from public/logo.png
 */
export default function AppLogoIcon(props: HTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/logo.png"
            alt="OrbyChat"
            className={cn('object-contain size-8', props.className)}
        />
    );
}
