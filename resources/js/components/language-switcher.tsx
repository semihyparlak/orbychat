import { usePage } from '@inertiajs/react';
import { Globe, Check } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { __ } from '@/app';
import { cn } from '@/lib/utils';

const languages = [
    { code: 'tr', name: 'Türkçe', native: 'Türkçe', flag: '🇹🇷', region: 'TR' },
    { code: 'en', name: 'English', native: 'English', flag: '🇺🇸', region: 'EN' },
];

export function LanguageSwitcher() {
    const { locale: currentLocale } = usePage<{ locale: string }>().props;

    const currentLang = languages.find(l => l.code === currentLocale) || languages[1];

    const handleLanguageSelect = (lang: any) => {
        // Force a full window reload to reset the global translation state
        window.location.href = `/locale/${lang.code}`;
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex h-10 min-w-[52px] items-center justify-center rounded-md bg-[#173f2c] px-3 text-[13px] font-bold tracking-tight text-[#f7f4ec] transition-colors hover:bg-[#123322]">
                    {currentLang.region}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                align="end" 
                className="w-[180px] rounded-xl border-[#123322] bg-[#173f2c] p-1.5 shadow-2xl"
            >
                <div className="px-2 py-1.5 mb-1 flex items-center gap-2 border-b border-[#123322]/50 pb-2">
                    <Globe className="size-3.5 text-[#f7f4ec]/60" />
                    <span className="text-[10px] font-bold text-[#f7f4ec]/60 uppercase tracking-wider">
                        {__('Language')}
                    </span>
                </div>
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => handleLanguageSelect(lang)}
                        className={cn(
                            "flex items-center justify-between px-2 py-2.5 rounded-lg cursor-pointer focus:bg-[#123322] focus:text-[#f7f4ec] transition-all duration-200 group",
                            currentLocale === lang.code && "bg-[#123322] text-[#f7f4ec]"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-5 w-7 items-center justify-center rounded-[4px] bg-[#f7f4ec]/10 border border-[#f7f4ec]/20 text-[9px] font-bold text-[#f7f4ec] shrink-0">
                                {lang.region}
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className={cn(
                                    "text-sm font-semibold text-[#f7f4ec]/90 group-hover:text-[#f7f4ec]",
                                    currentLocale === lang.code && "text-[#f7f4ec]"
                                )}>
                                    {lang.native}
                                </span>
                            </div>
                        </div>
                        {currentLocale === lang.code && (
                            <div className="size-4 flex items-center justify-center rounded-full bg-[#f7f4ec]/20">
                                <Check className="size-2.5 text-[#f7f4ec]" />
                            </div>
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
