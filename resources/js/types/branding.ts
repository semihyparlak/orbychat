import type { BrandDisplayMode } from '@/lib/brand-display';

export type Branding = {
    site_title: string;
    header_logo_url: string | null;
    footer_logo_url: string | null;
    dashboard_logo_url: string | null;
    favicon_url: string | null;
    header_brand_display: BrandDisplayMode;
    footer_brand_display: BrandDisplayMode;
    dashboard_brand_display: BrandDisplayMode;
    widget_brand_url: string;
    widget_brand_label: string;
};
