<?php

namespace App\Support;

/**
 * Slice of the full marketing-home content needed by every marketing
 * page's shared shell (header nav + footer). Centralises the resolve
 * step so pricing / how-it-works / privacy / terms all see the same nav.
 */
final class MarketingShellContent
{
    /**
     * @return array{
     *     nav_items: array<int, array{label: string, href: string}>,
     *     header: array{resources_label: string, resources_href: string},
     *     footer: array<string, mixed>,
     * }
     */
    public static function resolve(?array $home = null): array
    {
        $home = $home ?? MarketingHomeContent::resolve();

        return [
            'nav_items' => $home['nav_items'] ?? [],
            'header' => [
                'resources_label' => $home['header']['resources_label'] ?? '',
                'resources_href' => $home['header']['resources_href'] ?? '/',
            ],
            'footer' => $home['footer'] ?? [],
        ];
    }
}
