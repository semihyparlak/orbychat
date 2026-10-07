<?php

namespace App\Services\Crawl;

use App\Support\CrawlDebugLog;
use fivefilters\Readability\Configuration;
use fivefilters\Readability\Readability;

/**
 * Mozilla-Readability-style content extractor (PHP port).
 *
 * Why this exists: our older HtmlExtractor strips chrome via regex and
 * Material-icon ligatures, which works but misses on real-world layouts —
 * sidebar widgets, comment sections, related-posts grids, etc. Readability
 * scores DOM nodes by content density and link/text ratio and returns the
 * "main article" subtree. On news/blog/product pages it's dramatically
 * better than regex stripping.
 *
 * We use it as the PRIMARY extractor and fall back to HtmlExtractor when
 * Readability bails out (it raises ParseException on pages without a clear
 * article — soft-404s, login walls, single-paragraph SPAs) — those are
 * exactly the cases the legacy regex extractor handles well anyway.
 */
class ReadabilityExtractor
{
    public function __construct(private readonly HtmlExtractor $fallback) {}

    /**
     * @return array{title: ?string, text: string}
     */
    public function extract(string $html): array
    {
        if ($html === '') {
            return ['title' => null, 'text' => ''];
        }

        try {
            $config = new Configuration([
                'OriginalURL' => '',
                'FixRelativeURLs' => false,
                'NormalizeEntities' => true,
                'SubstituteEntities' => true,
                'SummonCthulhu' => false,
            ]);
            $readability = new Readability($config);

            if (! $readability->parse($html)) {
                return $this->fallback->extract($html);
            }

            $title = $readability->getTitle() ?: null;
            $contentHtml = (string) $readability->getContent();

            // Convert the cleaned-up HTML to plain text. Readability has
            // already kept structural markers (h1, p, li, etc.) so a simple
            // strip_tags + whitespace-collapse gives clean output.
            $text = trim(html_entity_decode(strip_tags($contentHtml), ENT_QUOTES | ENT_HTML5));
            $text = preg_replace('/\s+/u', ' ', $text) ?? $text;

            $fallback = $this->fallback->extract($html);
            CrawlDebugLog::write('ReadabilityExtractor compared extractors.', [
                'readability_text_length' => mb_strlen($text),
                'fallback_text_length' => mb_strlen($fallback['text']),
                'readability_preview' => CrawlDebugLog::preview($text, 400),
                'fallback_preview' => CrawlDebugLog::preview($fallback['text'], 400),
                'has_data_page' => str_contains($html, 'data-page='),
            ]);

            // For Inertia/SPA pages, HtmlExtractor can read the structured
            // hydration payload and skip demo widgets/chrome by JSON branch.
            // Readability only sees the rendered DOM, so it often includes
            // fake chat cards, pricing demos, and CTA text. Prefer the
            // structured extractor once it found real content.
            if (str_contains($html, 'data-page=') && mb_strlen($fallback['text']) > 250) {
                return $fallback;
            }

            // If Readability extracted very little, or the fallback found
            // materially more text (common for Inertia/SPA hydration payloads
            // and product pages), prefer the fallback.
            if (mb_strlen($text) < 200 || mb_strlen($fallback['text']) > mb_strlen($text) * 2) {
                return $fallback;
            }

            return ['title' => $title, 'text' => $text];
        } catch (\Throwable) {
            // Readability throws on malformed HTML / pages without a clear
            // article body. Fall through to our regex extractor.
            return $this->fallback->extract($html);
        }
    }
}
