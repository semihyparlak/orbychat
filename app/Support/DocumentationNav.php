<?php

namespace App\Support;

/**
 * Sidebar navigation tree for the public /documentation site. The
 * controller iterates this list to render the left nav and to resolve a
 * slug → page-title + Blade partial. Adding a page is two steps: drop a
 * Blade partial under `resources/views/documentation/pages/{slug}.blade.php`
 * and add an entry here.
 */
final class DocumentationNav
{
    /**
     * @return list<array{title: string, items: list<array{slug: string, title: string}>}>
     */
    public static function tree(): array
    {
        return [
            [
                'title' => 'Get started',
                'items' => [
                    ['slug' => 'welcome', 'title' => 'Welcome'],
                    ['slug' => 'concepts', 'title' => 'Core concepts'],
                ],
            ],
            [
                'title' => 'Build your agent',
                'items' => [
                    ['slug' => 'agents', 'title' => 'Agents'],
                    ['slug' => 'site-types', 'title' => 'Site types & vertical presets'],
                    ['slug' => 'knowledge', 'title' => 'Knowledge sources'],
                    ['slug' => 'customize', 'title' => 'Persona, theme & prompts'],
                    ['slug' => 'behavior-rules', 'title' => 'Behavior rules & triggers'],
                    ['slug' => 'curated-answers', 'title' => 'Curated answers & CTAs'],
                    ['slug' => 'workflows', 'title' => 'Workflows'],
                ],
            ],
            [
                'title' => 'Embed the widget',
                'items' => [
                    ['slug' => 'embed', 'title' => 'Install snippet'],
                    ['slug' => 'widget-features', 'title' => 'Voice, leads & persistence'],
                ],
            ],
            [
                'title' => 'Run your workspace',
                'items' => [
                    ['slug' => 'inbox', 'title' => 'Inbox & human takeover'],
                    ['slug' => 'analytics', 'title' => 'Analytics & gaps'],
                    ['slug' => 'billing', 'title' => 'Billing & plans'],
                    ['slug' => 'members', 'title' => 'Members & roles'],
                    ['slug' => 'integrations', 'title' => 'Integrations'],
                    ['slug' => 'changelog', 'title' => 'Application changelog'],
                ],
            ],
        ];
    }

    /**
     * @return array<string, array{title: string, group: string}>
     */
    public static function flat(): array
    {
        $out = [];
        foreach (self::tree() as $group) {
            foreach ($group['items'] as $item) {
                $out[$item['slug']] = [
                    'title' => $item['title'],
                    'group' => $group['title'],
                ];
            }
        }

        return $out;
    }

    /**
     * @return array{prev: ?array{slug: string, title: string}, next: ?array{slug: string, title: string}}
     */
    public static function neighbors(string $slug): array
    {
        $linear = [];
        foreach (self::tree() as $group) {
            foreach ($group['items'] as $item) {
                $linear[] = $item;
            }
        }

        $idx = null;
        foreach ($linear as $i => $item) {
            if ($item['slug'] === $slug) {
                $idx = $i;
                break;
            }
        }

        if ($idx === null) {
            return ['prev' => null, 'next' => null];
        }

        return [
            'prev' => $idx > 0 ? $linear[$idx - 1] : null,
            'next' => $idx < count($linear) - 1 ? $linear[$idx + 1] : null,
        ];
    }
}
