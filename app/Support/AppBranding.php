<?php

namespace App\Support;

use App\Models\AppSetting;
use Illuminate\Support\Facades\Storage;

class AppBranding
{
    /**
     * @var array<int, string>
     */
    private const DISPLAY_MODES = ['logo_text', 'logo_only', 'text_only'];

    public static function disk(): string
    {
        $defaultDisk = (string) config('filesystems.default', 'public');

        return $defaultDisk === 'local' || $defaultDisk === ''
            ? 'public'
            : $defaultDisk;
    }

    public static function siteTitle(): string
    {
        return self::resolveSiteTitle(self::settings());
    }

    /**
     * @return array<string, string|null>
     */
    public static function shared(): array
    {
        $settings = self::settings();
        $headerLogoUrl = self::assetUrl(self::resolveAssetPath($settings, 'header_logo_path', 'branding.header_logo_path'));
        $footerLogoUrl = self::assetUrl(self::resolveAssetPath($settings, 'footer_logo_path', 'branding.footer_logo_path'));
        $dashboardLogoUrl = self::assetUrl(self::resolveAssetPath($settings, 'dashboard_logo_path', 'branding.dashboard_logo_path'));
        $faviconUrl = self::assetUrl(self::resolveAssetPath($settings, 'favicon_path', 'branding.favicon_path'));

        return [
            'site_title' => self::resolveSiteTitle($settings),
            'header_logo_url' => $headerLogoUrl,
            'footer_logo_url' => $footerLogoUrl,
            'dashboard_logo_url' => $dashboardLogoUrl,
            'favicon_url' => $faviconUrl,
            'header_brand_display' => self::resolveDisplayMode($settings?->header_brand_display, $headerLogoUrl !== null),
            'footer_brand_display' => self::resolveDisplayMode($settings?->footer_brand_display, ($footerLogoUrl ?? $headerLogoUrl) !== null),
            'dashboard_brand_display' => self::resolveDisplayMode($settings?->dashboard_brand_display, $dashboardLogoUrl !== null),
            'widget_brand_url' => self::resolveString($settings?->orbychat_brand_url, (string) config('branding.url')),
            'widget_brand_label' => self::resolveString($settings?->orbychat_brand_label, (string) config('branding.label')),
            // Public marketing-site kill switch (Settings → Branding).
            // Default true so existing installs are unaffected.
            'marketing_site_enabled' => $settings?->marketing_site_enabled ?? true,
        ];
    }

    public static function assetUrl(mixed $path): ?string
    {
        if (! is_string($path) || trim($path) === '') {
            return null;
        }

        return Storage::disk(self::disk())->url($path);
    }

    private static function settings(): ?AppSetting
    {
        try {
            return AppSetting::query()->find(AppSetting::SINGLETON_ID);
        } catch (\Throwable) {
            return null;
        }
    }

    private static function resolveSiteTitle(?AppSetting $settings): string
    {
        $siteTitle = self::resolveString(
            $settings?->site_title,
            (string) config('branding.site_title', ''),
        );

        return $siteTitle !== ''
            ? $siteTitle
            : (trim((string) config('app.name', 'OrbyChat')) ?: 'OrbyChat');
    }

    private static function resolveAssetPath(
        ?AppSetting $settings,
        string $column,
        string $configKey,
    ): mixed {
        $path = $settings?->{$column};

        if (is_string($path) && trim($path) !== '') {
            return $path;
        }

        return config($configKey);
    }

    private static function resolveString(?string $settingValue, string $fallback): string
    {
        $resolved = trim((string) $settingValue);

        if ($resolved !== '') {
            return $resolved;
        }

        return trim($fallback);
    }

    private static function resolveDisplayMode(?string $settingValue, bool $hasLogo): string
    {
        $resolved = trim((string) $settingValue);

        if (in_array($resolved, self::DISPLAY_MODES, true)) {
            return $resolved;
        }

        return $hasLogo ? 'logo_only' : 'logo_text';
    }
}
