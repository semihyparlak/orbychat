import { cn } from '@/lib/utils';
import { getCONFIDENCE_LABEL, confidenceBucket } from '@/lib/verticals';
import type { Confidence } from '@/lib/verticals';

const STYLES: Record<Confidence, string> = {
    high: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    likely: 'bg-amber-50 text-amber-700 border-amber-200',
    guess: 'bg-slate-100 text-slate-600 border-slate-200',
};

export function VerticalConfidencePill({
    score,
    className,
}: {
    score: number;
    className?: string;
}) {
    const bucket = confidenceBucket(score);

    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium',
                STYLES[bucket],
                className,
            )}
        >
            {getCONFIDENCE_LABEL()[bucket]} · {Math.round(score * 100)}%
        </span>
    );
}
