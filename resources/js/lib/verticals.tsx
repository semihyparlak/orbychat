import {
    BookOpen,
    Building,
    Car,
    Gavel,
    Globe,
    GraduationCap,
    Home,
    LifeBuoy,
    Megaphone,
    Palmtree,
    ShoppingBag,
    Sparkles,
    Stethoscope,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Slug union  —  kept in sync with VerticalPresets::SLUGS on the backend.
// Adding a slug here requires the corresponding preset class to exist
// server-side; otherwise the apply endpoint will reject it.
export type VerticalId =
    | 'ecommerce'
    | 'documentation'
    | 'saas'
    | 'help_center'
    | 'marketing'
    | 'internal_kb'
    | 'medical'
    | 'real_estate'
    | 'law'
    | 'automotive'
    | 'education'
    | 'tourism'
    | 'generic';

export type VerticalMeta = {
    id: VerticalId;
    name: string;
    shortDesc: string;
    icon: LucideIcon;
};

/**
 * Returns the verticals array with translated strings.
 * Called at render time (not module load time) so that the global
 * translation registry is already populated when __() runs.
 */
export function getVERTICALS(): VerticalMeta[] {
    return [
        {
            id: 'ecommerce',
            name: __('E-commerce'),
            shortDesc: __('Online store with products, pricing, and checkout'),
            icon: ShoppingBag,
        },
        {
            id: 'documentation',
            name: __('Documentation'),
            shortDesc: __('Technical docs, API references, and guides'),
            icon: BookOpen,
        },
        {
            id: 'saas',
            name: __('SaaS'),
            shortDesc: __('Software product with pricing, features, and signup'),
            icon: Sparkles,
        },
        {
            id: 'help_center',
            name: __('Help center'),
            shortDesc: __('Support articles, FAQs, and ticket triage'),
            icon: LifeBuoy,
        },
        {
            id: 'marketing',
            name: __('Marketing site'),
            shortDesc: __('Lead-capture pages, blog, and top-of-funnel content'),
            icon: Megaphone,
        },
        {
            id: 'internal_kb',
            name: __('Internal KB'),
            shortDesc: __('Employee wiki, runbooks, and internal documentation'),
            icon: Building,
        },
        {
            id: 'medical',
            name: __('Medical & Health'),
            shortDesc: __('Clinics, dentists, and healthcare providers'),
            icon: Stethoscope,
        },
        {
            id: 'real_estate',
            name: __('Real Estate'),
            shortDesc: __('Property listings, realtors, and agencies'),
            icon: Home,
        },
        {
            id: 'law',
            name: __('Law & Legal'),
            shortDesc: __('Law firms and legal consultants'),
            icon: Gavel,
        },
        {
            id: 'automotive',
            name: __('Automotive'),
            shortDesc: __('Car dealerships and service centers'),
            icon: Car,
        },
        {
            id: 'education',
            name: __('Education & Training'),
            shortDesc: __('Schools, courses, and LMS platforms'),
            icon: GraduationCap,
        },
        {
            id: 'tourism',
            name: __('Tourism & Hospitality'),
            shortDesc: __('Hotels, travel agencies, and tours'),
            icon: Palmtree,
        },
        {
            id: 'generic',
            name: __('Generic'),
            shortDesc: __("I'll configure this myself later"),
            icon: Globe,
        },
    ];
}

/** @deprecated Use getVERTICALS() so translations are evaluated at render time. */
export const VERTICALS: VerticalMeta[] = getVERTICALS();

export function getVERTICAL_BY_ID(): Record<VerticalId, VerticalMeta> {
    return Object.fromEntries(getVERTICALS().map((v) => [v.id, v])) as Record<
        VerticalId,
        VerticalMeta
    >;
}

/** @deprecated Use getVERTICAL_BY_ID() so translations are evaluated at render time. */
export const VERTICAL_BY_ID: Record<VerticalId, VerticalMeta> =
    getVERTICAL_BY_ID();

export type Confidence = 'high' | 'likely' | 'guess';

// Thresholds calibrated against real-world detector output. Even a clean
// match (e.g. docusaurus.io → documentation, vercel.com → saas) tops out
// near 0.5 because few sites stack 3+ strong signals on the homepage.
// Treating 0.5+ as "high" matches user intuition: the detector is
// confident; treating 0.3+ as "likely" so the amber pill fires for
// borderline-but-correct guesses (help.shopify.com, stripe.com).
export function confidenceBucket(score: number): Confidence {
    if (score >= 0.5) {
        return 'high';
    }

    if (score >= 0.3) {
        return 'likely';
    }

    return 'guess';
}

/**
 * Returns confidence labels translated at call time.
 * Call inside render, not at module level.
 */
export function getCONFIDENCE_LABEL(): Record<Confidence, string> {
    return {
        high: __('High confidence'),
        likely: __('Likely'),
        guess: __('Best guess'),
    };
}

/** @deprecated Use getCONFIDENCE_LABEL() so translations are evaluated at render time. */
export const CONFIDENCE_LABEL: Record<Confidence, string> =
    getCONFIDENCE_LABEL();

export type DetectionResult = {
    type: VerticalId;
    confidence: number;
    alternatives: { type: VerticalId; confidence: number }[];
    signals: string[];
};

// True when a slug looks like one of the known verticals  —  useful for
// validating server payloads before passing them to UI helpers.
export function isVerticalId(value: unknown): value is VerticalId {
    return typeof value === 'string' && getVERTICALS().some((v) => v.id === value);
}
