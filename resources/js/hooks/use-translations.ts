import { usePage } from '@inertiajs/react';

/**
 * Hook for using translations in React components.
 */
export function useTranslations() {
    const { translations } = usePage<{ translations: Record<string, string> }>().props;

    const __ = (key: string, replacements: Record<string, string> = {}): string => {
        let translation = translations[key] || key;

        Object.keys(replacements).forEach((r) => {
            translation = translation.replace(`:${r}`, replacements[r]);
        });

        return translation;
    };

    return { __ };
}
