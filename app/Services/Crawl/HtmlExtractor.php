<?php

namespace App\Services\Crawl;

use App\Support\CrawlDebugLog;

class HtmlExtractor
{
    public const DEBUG_VERSION = 'html-extractor-inertia-sections-v4';

    /**
     * Element classes/ids whose contents we drop wholesale: pure UI chrome
     * that adds noise to embeddings without helping retrieval.
     */
    private const CHROME_PATTERNS = [
        'cart', 'compare', 'breadcrumb', 'menu', 'navigation', 'navbar',
        'sidebar', 'drawer', 'modal', 'share', 'social', 'cookie', 'consent',
        'banner', 'popup', 'toolbar', 'pagination', 'related', 'recommended',
        'similar-product', 'similar-products', 'review-form', 'comment-form',
        'subscribe', 'newsletter', 'skip-link', 'announcement',
    ];

    /**
     * Material Icons / Material Symbols ligature names with underscores. These
     * never appear in natural English ("shopping_basket"), so they're safe to
     * strip wholesale. Single-word icons like "search", "menu", "home" are NOT
     * stripped — they collide with real product copy. We rely on chrome-class
     * blocks (CHROME_PATTERNS) to drop the elements that contain them.
     */
    private const ICON_LIGATURES = [
        'shopping_basket', 'shopping_cart', 'add_shopping_cart',
        'library_add', 'library_add_check', 'library_books',
        'bookmark_border', 'bookmark_add',
        'favorite_border', 'star_border', 'star_rate',
        'menu_open', 'expand_more', 'expand_less',
        'chevron_left', 'chevron_right',
        'arrow_back', 'arrow_forward', 'arrow_drop_down', 'arrow_drop_up',
        'keyboard_arrow_down', 'keyboard_arrow_up',
        'account_circle', 'person_outline',
        'notifications_none',
        'filter_list', 'view_list', 'view_module',
        'visibility_off', 'delete_outline', 'content_copy',
        'local_shipping', 'local_offer', 'verified_user',
        'access_time', 'location_on',
        'help_outline', 'info_outline',
        'error_outline', 'check_circle',
        'file_download', 'file_upload',
        'cloud_upload', 'cloud_download',
        'fullscreen_exit', 'zoom_in', 'zoom_out',
        'attach_file', 'video_library',
        'play_arrow', 'skip_previous', 'skip_next',
        'volume_up', 'volume_off', 'volume_mute',
    ];

    /**
     * Common e-commerce / chrome phrases that survive even after element
     * stripping (because they live in inline buttons/links). Killed at the
     * text level.
     */
    private const TEXT_NOISE_PATTERNS = [
        '/\bAdd to (?:cart|bag|wishlist|compare|favourites?|favorites?)\b/i',
        '/\bRemove from (?:cart|wishlist|compare)\b/i',
        '/\bCompare Product\b/i',
        '/\bBuy Now\b/i',
        '/\bYOUR CART\b/i',
        '/\bCart\s*\d+\b/i',
        '/\bCompare\s*\d+\b/i',
        '/\bWishlist\s*\d+\b/i',
        '/\b0\s*items?\b/i',
        '/\bContinue Shopping\b/i',
        '/\bWrite a Review\b/i',
        '/\bAsk Question\b/i',
        '/\bShare:\s*/i',
        '/\bSubscribe to (?:our )?newsletter\b/i',
        '/\bRECOMMENDED\b/i',
        '/\bPowered By OrbyChat\b/i',
    ];

    private const JSON_SKIP_KEYS = [
        'auth', 'buildid', 'csrf_token', 'errors', 'flash', 'ziggy',
        'assetprefix', 'scriptloader', 'runtimeconfig', 'locale', 'locales',
        'translations', 'href', 'url', 'icon', 'image', 'image_url', 'src',
        'alt', 'class', 'class_name', 'button', 'button_label',
        'primary_button', 'primary_button_label', 'secondary_button',
        'secondary_button_label', 'cta', 'cta_label', 'badge', 'badge_label',
        'label', 'value', 'price', 'interval', 'duration', 'duration_label',
        'placeholder', 'timecode', 'theme', 'color', 'variant',
    ];

    private const JSON_CONTENT_KEYS = [
        'title', 'heading', 'headline', 'subheading', 'subtitle', 'tagline',
        'description', 'summary', 'copy', 'body', 'text', 'content', 'answer',
        'question', 'quote', 'name', 'role', 'feature', 'features', 'benefit',
        'benefits', 'item', 'items', 'bullet', 'bullets',
    ];

    private const JSON_SECTION_TEXT_KEYS = [
        'title', 'heading', 'headline', 'subheading', 'subtitle', 'tagline',
        'description', 'summary', 'copy', 'body', 'text', 'answer', 'question',
        'quote',
    ];

    private const JSON_LIST_TEXT_KEYS = [
        'bullets', 'features', 'benefits',
    ];

    /**
     * Strip nav/footer/script/style elements and return whitespace-collapsed
     * main text. Returns ['title' => string|null, 'text' => string].
     *
     * @return array{title: ?string, text: string}
     */
    public function extract(string $html): array
    {
        $title = null;
        if (preg_match('/<title[^>]*>(.*?)<\/title>/is', $html, $m)) {
            $title = html_entity_decode(trim(strip_tags($m[1])), ENT_QUOTES | ENT_HTML5);
        }

        $hydratedText = $this->extractHydrationText($html);
        $metaText = $this->extractMetaText($html);

        CrawlDebugLog::write('HtmlExtractor hydration scan.', [
            'version' => self::DEBUG_VERSION,
            'html_length' => mb_strlen($html),
            'hydrated_text_length' => mb_strlen($hydratedText),
            'hydrated_text_preview' => CrawlDebugLog::preview($hydratedText, 500),
            'meta_text_length' => mb_strlen($metaText),
            'has_data_page' => str_contains($html, 'data-page='),
        ]);

        // 1. Drop entire noisy regions by tag.
        $stripped = preg_replace([
            '/<script\b[^>]*>.*?<\/script>/is',
            '/<style\b[^>]*>.*?<\/style>/is',
            '/<nav\b[^>]*>.*?<\/nav>/is',
            '/<footer\b[^>]*>.*?<\/footer>/is',
            '/<header\b[^>]*>.*?<\/header>/is',
            '/<form\b[^>]*>.*?<\/form>/is',
            '/<noscript\b[^>]*>.*?<\/noscript>/is',
            '/<aside\b[^>]*>.*?<\/aside>/is',
            '/<button\b[^>]*>.*?<\/button>/is',
            '/<svg\b[^>]*>.*?<\/svg>/is',
            '/<select\b[^>]*>.*?<\/select>/is',
        ], ' ', $html) ?? $html;

        // 2. Drop elements whose class or id matches known UI-chrome patterns.
        // Iterate to handle nested chrome (e.g. <div class="sidebar"><div class="menu">…).
        $stripped = $this->dropChromeBlocks($stripped);

        // 3. Strip remaining tags and collapse whitespace.
        $text = trim(html_entity_decode(strip_tags($stripped), ENT_QUOTES | ENT_HTML5));
        $text = preg_replace('/\s+/u', ' ', $text) ?? $text;

        // 4. Strip Material Icons ligatures and e-commerce phrases at the text level.
        $iconRegex = '/\b(?:'.implode('|', array_map('preg_quote', self::ICON_LIGATURES)).')\b/i';
        $text = preg_replace($iconRegex, ' ', $text) ?? $text;
        foreach (self::TEXT_NOISE_PATTERNS as $pattern) {
            $text = preg_replace($pattern, ' ', $text) ?? $text;
        }

        // 5. Final whitespace collapse.
        $text = preg_replace('/\s+/u', ' ', trim((string) $text)) ?? '';

        // Modern React/Inertia pages often render demo widgets, metrics,
        // buttons, and other UI chrome into the DOM. The data-page payload is
        // cleaner because we can skip those branches structurally. When it is
        // rich enough, prefer it instead of merging the noisy rendered body.
        if (str_contains($html, 'data-page=') && mb_strlen($hydratedText) > 250) {
            $text = $hydratedText;
        } elseif (mb_strlen($hydratedText) > 80 && mb_strlen($hydratedText) > mb_strlen($text)) {
            $text = $this->mergeText([$text, $hydratedText]);
        }

        if (mb_strlen($text) < 120 && $metaText !== '') {
            $text = $this->mergeText([$text, $metaText]);
        }

        return ['title' => $title, 'text' => (string) $text];
    }

    private function dropChromeBlocks(string $html): string
    {
        $needle = implode('|', array_map('preg_quote', self::CHROME_PATTERNS));
        $tags = 'div|section|ul|ol|aside|article';

        // Match an opening tag whose class/id contains a chrome word, then
        // its matching close tag. Non-greedy across DOTALL for inner content.
        // Iterate so nested chrome is handled inside-out.
        $pattern = '/<(?<tag>'.$tags.')\b[^>]*\b(?:class|id)\s*=\s*["\'][^"\']*\b(?:'.$needle.')\b[^"\']*["\'][^>]*>(?:(?!<\g{tag}\b).)*?<\/\g{tag}>/is';

        for ($i = 0; $i < 6; $i++) {
            $next = preg_replace($pattern, ' ', $html);
            if ($next === null || $next === $html) {
                break;
            }
            $html = $next;
        }

        return $html;
    }

    private function extractMetaText(string $html): string
    {
        $pieces = [];
        if (preg_match_all('/<meta\b[^>]*(?:name|property)\s*=\s*["\'](?:description|og:description|twitter:description)["\'][^>]*>/is', $html, $matches)) {
            foreach ($matches[0] as $tag) {
                if (preg_match('/\bcontent\s*=\s*(["\'])(.*?)\1/is', $tag, $content)) {
                    $pieces[] = html_entity_decode($content[2], ENT_QUOTES | ENT_HTML5);
                }
            }
        }

        return $this->mergeText($pieces);
    }

    private function extractHydrationText(string $html): string
    {
        $pieces = [];

        if (preg_match('/<script\b[^>]*\bid\s*=\s*(["\'])__NEXT_DATA__\1[^>]*>(.*?)<\/script>/is', $html, $m)) {
            $json = html_entity_decode($m[2], ENT_QUOTES | ENT_HTML5);
            $decoded = json_decode($json, true);
            if (is_array($decoded)) {
                $this->collectJsonText($decoded, $pieces);
            }
        }

        $inertiaPayloads = $this->extractInertiaPayloads($html);
        foreach ($inertiaPayloads as $json) {
            $decoded = json_decode($json, true);
            if (is_array($decoded)) {
                $this->collectJsonText($decoded, $pieces);

                continue;
            }

            CrawlDebugLog::write('HtmlExtractor could not json_decode Inertia payload; falling back to raw text scan.', [
                'version' => self::DEBUG_VERSION,
                'json_error' => json_last_error_msg(),
                'payload_length' => mb_strlen($json),
                'payload_preview' => CrawlDebugLog::preview($json, 700),
            ]);

            foreach ($this->naturalTextFragments($json) as $fragment) {
                $pieces[] = $fragment;
            }
        }

        if ($inertiaPayloads !== []) {
            CrawlDebugLog::write('HtmlExtractor scanned Inertia payloads.', [
                'version' => self::DEBUG_VERSION,
                'payloads_count' => count($inertiaPayloads),
                'pieces_count' => count($pieces),
                'merged_length' => mb_strlen($this->mergeText($pieces)),
            ]);
        }

        if (preg_match_all('/<script\b[^>]*>(.*?)<\/script>/is', $html, $scripts)) {
            foreach ($scripts[1] as $script) {
                if (! str_contains($script, '__next_f') && ! str_contains($script, '__NEXT_DATA__')) {
                    continue;
                }

                $decodedScript = html_entity_decode($script, ENT_QUOTES | ENT_HTML5);
                if (preg_match_all('/"((?:\\\\.|[^"\\\\]){12,})"/s', $decodedScript, $strings)) {
                    foreach ($strings[1] as $raw) {
                        $literal = json_decode('"'.$raw.'"');
                        if (! is_string($literal)) {
                            $literal = stripcslashes($raw);
                        }
                        foreach ($this->naturalTextFragments($literal) as $fragment) {
                            $pieces[] = $fragment;
                        }
                    }
                }
            }
        }

        return $this->mergeText($pieces);
    }

    /**
     * @return array<int, string>
     */
    private function extractInertiaPayloads(string $html): array
    {
        $payloads = [];

        foreach ($this->extractBalancedInertiaJson($html) as $payload) {
            $payloads[] = $payload;
        }

        foreach ($this->extractRawDataPageAttributes($html) as $payload) {
            $payloads[] = $payload;
        }

        $previous = libxml_use_internal_errors(true);
        try {
            $dom = new \DOMDocument;
            $dom->loadHTML('<?xml encoding="utf-8" ?>'.$html, LIBXML_NOWARNING | LIBXML_NOERROR | LIBXML_NONET);
            foreach ($dom->getElementsByTagName('*') as $node) {
                if (! $node instanceof \DOMElement || ! $node->hasAttribute('data-page')) {
                    continue;
                }

                $payload = $this->decodeHtmlJson($node->getAttribute('data-page'));
                if ($this->looksLikeInertiaPayload($payload)) {
                    $payloads[] = $payload;
                }
            }
        } catch (\Throwable) {
            // Fall through to the regex backup below.
        } finally {
            libxml_clear_errors();
            libxml_use_internal_errors($previous);
        }

        if (preg_match_all('/\bdata-page\s*=\s*(["\'])(.*?)\1/is', $html, $attrs)) {
            foreach ($attrs[2] as $encoded) {
                $payload = $this->decodeHtmlJson($encoded);
                if ($this->looksLikeInertiaPayload($payload)) {
                    $payloads[] = $payload;
                }
            }
        }

        return array_values(array_unique(array_filter($payloads, fn ($json) => $json !== '')));
    }

    /**
     * Extracts the JSON object that follows a data-page attribute by finding
     * the first encoded/decoded "{" and then balancing braces while
     * respecting JSON strings. This avoids DOM/libxml and regex edge cases
     * with huge HTML-escaped Inertia payloads.
     *
     * @return array<int, string>
     */
    private function extractBalancedInertiaJson(string $html): array
    {
        $payloads = [];
        $needle = 'data-page';
        $offset = 0;

        while (($pos = stripos($html, $needle, $offset)) !== false) {
            $window = substr($html, $pos, 250000);
            $decoded = $this->decodeHtmlJson($window);
            $brace = strpos($decoded, '{');
            if ($brace === false) {
                $offset = $pos + strlen($needle);
                continue;
            }

            $json = $this->balancedJsonObject(substr($decoded, $brace));
            if ($json !== null && $this->looksLikeInertiaPayload($json)) {
                $payloads[] = $json;
            }

            $offset = $pos + strlen($needle);
        }

        return $payloads;
    }

    private function balancedJsonObject(string $value): ?string
    {
        $depth = 0;
        $inString = false;
        $escape = false;
        $length = strlen($value);

        for ($i = 0; $i < $length; $i++) {
            $char = $value[$i];

            if ($inString) {
                if ($escape) {
                    $escape = false;
                } elseif ($char === '\\') {
                    $escape = true;
                } elseif ($char === '"') {
                    $inString = false;
                }

                continue;
            }

            if ($char === '"') {
                $inString = true;
            } elseif ($char === '{') {
                $depth++;
            } elseif ($char === '}') {
                $depth--;
                if ($depth === 0) {
                    return substr($value, 0, $i + 1);
                }
            }
        }

        return null;
    }

    /**
     * DOMDocument can mangle very large escaped attributes on some libxml
     * builds. This scanner reads the raw data-page attribute from the HTML
     * tag itself before DOM parsing gets a chance to be "helpful".
     *
     * @return array<int, string>
     */
    private function extractRawDataPageAttributes(string $html): array
    {
        $payloads = [];
        $offset = 0;

        while (($pos = stripos($html, 'data-page')) !== false) {
            $pos += $offset;
            $eq = strpos($html, '=', $pos);
            if ($eq === false) {
                break;
            }

            $i = $eq + 1;
            $len = strlen($html);
            while ($i < $len && ctype_space($html[$i])) {
                $i++;
            }

            if ($i >= $len || ($html[$i] !== '"' && $html[$i] !== "'")) {
                $offset = $pos + 9;
                $html = substr($html, $offset);
                $offset = 0;
                continue;
            }

            $quote = $html[$i];
            $start = $i + 1;
            $end = strpos($html, $quote, $start);
            if ($end === false) {
                break;
            }

            $payload = $this->decodeHtmlJson(substr($html, $start, $end - $start));
            if ($this->looksLikeInertiaPayload($payload)) {
                $payloads[] = $payload;
            } else {
                CrawlDebugLog::write('HtmlExtractor ignored data-page candidate.', [
                    'version' => self::DEBUG_VERSION,
                    'candidate_length' => mb_strlen($payload),
                    'candidate_preview' => CrawlDebugLog::preview($payload, 300),
                ]);
            }

            $html = substr($html, $end + 1);
            $offset = 0;
        }

        return $payloads;
    }

    private function looksLikeInertiaPayload(string $payload): bool
    {
        if (mb_strlen($payload) < 20) {
            return false;
        }

        return str_contains($payload, 'component')
            || str_contains($payload, 'props')
            || str_contains($payload, 'content')
            || str_contains($payload, 'pageProps');
    }

    private function decodeHtmlJson(string $value): string
    {
        for ($i = 0; $i < 3; $i++) {
            $decoded = html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
            if ($decoded === $value) {
                break;
            }
            $value = $decoded;
        }

        return trim($value);
    }

    /**
     * @param  array<mixed>  $value
     * @param  array<int, string>  $pieces
     */
    private function collectJsonText(array $value, array &$pieces, array $path = []): void
    {
        if ($path === []) {
            $sections = $this->collectJsonSections($value);
            if (count($sections) >= 3) {
                array_push($pieces, ...$sections);

                return;
            }
        }

        foreach ($value as $key => $item) {
            $key = is_string($key) ? strtolower($key) : '';
            if ($this->shouldSkipJsonKey($key, $path)) {
                continue;
            }

            if (is_array($item)) {
                $this->collectJsonText($item, $pieces, [...$path, $key]);
            } elseif (is_string($item)) {
                $text = $this->normalizeReadableText($item);
                if ($this->looksLikeUsefulJsonText($text, $key, $path)) {
                    $pieces[] = $text;
                }
            }
        }
    }

    /**
     * @param  array<int, string>  $path
     */
    private function shouldSkipJsonKey(string $key, array $path): bool
    {
        if ($key === '') {
            return false;
        }

        if (in_array($key, self::JSON_SKIP_KEYS, true)) {
            return true;
        }

        if (preg_match('/(?:^|_)(?:href|url|uri|src|icon|image|asset|class|style|color|variant|button|cta|badge|label|placeholder|timecode|duration|price|interval)(?:_|$)/i', $key) === 1) {
            return true;
        }

        $pathText = implode('.', $path);

        return preg_match('/(?:navigation|navbar|footer|header|nav_items|chat_preview|stats|socials|legal_links|settings_rows|button|cta|badge|plans\.\d+\.(?:price|interval|badge))/i', $pathText) === 1;
    }

    /**
     * @param  array<mixed>  $value
     * @return array<int, string>
     */
    private function collectJsonSections(array $value): array
    {
        $sections = [];
        $this->walkJsonSections($value, $sections);

        return $this->dedupePieces($sections);
    }

    /**
     * @param  array<mixed>  $node
     * @param  array<int, string>  $sections
     * @param  array<int, string>  $path
     */
    private function walkJsonSections(array $node, array &$sections, array $path = []): void
    {
        if ($this->shouldSkipJsonContainer($path)) {
            return;
        }

        $sectionParts = $this->extractSectionParts($node, $path);
        if (count($sectionParts) >= 2 || $this->hasLongSectionPart($sectionParts)) {
            $section = $this->mergeText($sectionParts);
            if ($this->looksLikeNaturalText($section) || mb_strlen($section) >= 60) {
                $sections[] = $section;
            }
        }

        foreach ($node as $key => $item) {
            $key = is_string($key) ? strtolower($key) : '';
            if ($this->shouldSkipJsonKey($key, $path)) {
                continue;
            }

            if (is_array($item)) {
                $this->walkJsonSections($item, $sections, [...$path, $key]);
            }
        }
    }

    /**
     * @param  array<int, string>  $path
     */
    private function shouldSkipJsonContainer(array $path): bool
    {
        $pathText = implode('.', $path);

        return preg_match('/(?:nav_items|header|footer|chat_preview|stats|socials|legal_links|settings_rows|chart_points|chart_labels)/i', $pathText) === 1;
    }

    /**
     * @param  array<mixed>  $node
     * @param  array<int, string>  $path
     * @return array<int, string>
     */
    private function extractSectionParts(array $node, array $path): array
    {
        $parts = [];

        foreach ($node as $key => $item) {
            $key = is_string($key) ? strtolower($key) : '';
            if ($this->shouldSkipJsonKey($key, $path)) {
                continue;
            }

            if (is_string($item) && in_array($key, self::JSON_SECTION_TEXT_KEYS, true)) {
                $text = $this->normalizeReadableText($item);
                if ($this->looksLikeUsefulJsonText($text, $key, $path)) {
                    $parts[] = $text;
                }
            }

            if (is_array($item) && in_array($key, self::JSON_LIST_TEXT_KEYS, true)) {
                foreach ($item as $listItem) {
                    if (! is_string($listItem)) {
                        continue;
                    }

                    $text = $this->normalizeReadableText($listItem);
                    if ($this->looksLikeUsefulJsonText($text, $key, $path)) {
                        $parts[] = $text;
                    }
                }
            }
        }

        return $this->dedupePieces($parts);
    }

    /**
     * @param  array<int, string>  $parts
     */
    private function hasLongSectionPart(array $parts): bool
    {
        foreach ($parts as $part) {
            if (mb_strlen($part) >= 60) {
                return true;
            }
        }

        return false;
    }

    /**
     * @return array<int, string>
     */
    private function naturalTextFragments(string $value): array
    {
        $value = stripcslashes($value);
        $value = html_entity_decode(strip_tags($value), ENT_QUOTES | ENT_HTML5);
        $value = $this->addMissingWordBoundaries($value);
        $value = preg_replace('#https?://\S+#i', ' ', $value) ?? $value;
        $value = preg_replace('#/_next/static/\S+#i', ' ', $value) ?? $value;
        $value = preg_replace('/[A-Za-z0-9_.-]+\.(?:js|css|woff2?|png|jpe?g|webp|svg)(?:\?\S*)?/i', ' ', $value) ?? $value;
        $value = preg_replace('/\\\\u([0-9a-fA-F]{4})/', ' ', $value) ?? $value;
        $value = preg_replace('/\b(?:component|children|props|className|null|true|false)\b/u', ' ', $value) ?? $value;
        $value = preg_replace('/\\\\\//u', '/', $value) ?? $value;
        $value = preg_replace('/\\\\+"/u', '"', $value) ?? $value;
        $value = preg_replace('/[{}\[\]<>|"|]+/u', "\n", $value) ?? $value;
        $value = preg_replace('/\s*[:,]\s*/u', ' ', $value) ?? $value;

        $parts = preg_split('/[\n\r\t]+|(?<=\.)\s+(?=[A-Z])/u', $value, -1, PREG_SPLIT_NO_EMPTY) ?: [];
        $out = [];
        foreach ($parts as $part) {
            $part = $this->normalizeReadableText($part);
            $part = trim($part, " \t\n\r\0\x0B\"'`,;:");
            if ($this->looksLikeNaturalText($part)) {
                $out[] = $part;
            }
        }

        return $out;
    }

    private function normalizeReadableText(string $text): string
    {
        $text = html_entity_decode(strip_tags($text), ENT_QUOTES | ENT_HTML5);
        $text = $this->addMissingWordBoundaries($text);
        $text = preg_replace('/[_|]+/u', ' ', $text) ?? $text;
        foreach (self::TEXT_NOISE_PATTERNS as $pattern) {
            $text = preg_replace($pattern, ' ', $text) ?? $text;
        }
        $text = preg_replace('/(?<=[$€£₺]\d{1,4}\/month)\s*Billed\b/i', '. Billed', $text) ?? $text;
        $text = preg_replace('/\s+/u', ' ', trim($text)) ?? '';

        return trim($text, " \t\n\r\0\x0B\"'`,;:");
    }

    private function addMissingWordBoundaries(string $text): string
    {
        $protected = [];
        $text = preg_replace_callback('/\b(?:CTA|CTAs|URL|URLs|LLM|GDPR|SSO|SOC|JWT|AWS|GCP|KB|API|APIs|FAQ|FAQs|ETA|ETAs|SDR|SaaS|B2B|B2C|CRM|CMS|SEO|SDK|SDKs|HTTP|HTTPS|HTML|CSS|JS|JSON|PHP|SQL|WordPress|OrbyChat)\b/u', function (array $match) use (&$protected): string {
            $token = '__ORBY_PROTECTED_'.count($protected).'__';
            $protected[$token] = $match[0];

            return $token;
        }, $text) ?? $text;

        // JSON props often contain adjacent UI labels when recovered from a
        // raw payload. Add readable boundaries without touching normal words.
        $text = preg_replace('/(?<=[a-z0-9])(?=[A-Z])/u', ' ', $text) ?? $text;
        $text = preg_replace('/(?<=[A-Z])(?=[A-Z][a-z])/u', ' ', $text) ?? $text;
        $text = preg_replace('/(?<=[0-9])(?=[A-Za-z])/u', ' ', $text) ?? $text;
        $text = preg_replace('/(?<=[A-Za-z])(?=[$€£₺])/u', ' ', $text) ?? $text;
        $text = preg_replace('/(?<=[$€£₺][0-9])(?=[A-Za-z])/u', ' ', $text) ?? $text;
        $text = preg_replace('/(?<=[.!?])(?=[A-Z])/u', ' ', $text) ?? $text;

        return strtr($text, $protected);
    }

    /**
     * @param  array<int, string>  $path
     */
    private function looksLikeUsefulJsonText(string $text, string $key, array $path): bool
    {
        if ($text === '' || mb_strlen($text) < 2) {
            return false;
        }

        if (preg_match('~^(?:https?://|/|#|__|[a-z0-9_-]+\.(?:js|css|png|jpe?g|svg|webp))~i', $text) === 1) {
            return false;
        }

        if (preg_match('/^(?:true|false|null|[a-f0-9-]{16,})$/i', $text) === 1) {
            return false;
        }

        if (preg_match('/^[\p{Sc}]?\d+(?:[.,]\d+)?(?:%|k|m|\/month)?$/iu', $text) === 1) {
            return false;
        }

        if (preg_match('/^(?:recommended|monthly|annual|annually|billed monthly|billed annually|live|open|close|save|cancel)$/iu', $text) === 1) {
            return false;
        }

        if (in_array($key, self::JSON_CONTENT_KEYS, true) || $this->pathLooksContentful($path)) {
            return true;
        }

        preg_match_all('/[\p{L}\p{N}]+/u', $text, $words);

        return count($words[0] ?? []) >= 3;
    }

    /**
     * @param  array<int, string>  $path
     */
    private function pathLooksContentful(array $path): bool
    {
        foreach ($path as $segment) {
            if (in_array($segment, self::JSON_CONTENT_KEYS, true)) {
                return true;
            }
        }

        return false;
    }

    private function looksLikeNaturalText(string $text): bool
    {
        if (mb_strlen($text) < 24) {
            return false;
        }
        if (preg_match('/(?:webpack|__next|static\/chunks|chunk\.js|function\s*\(|=>|window\.|document\.)/i', $text) === 1) {
            return false;
        }
        if (preg_match('/\s/u', $text) !== 1) {
            return false;
        }

        preg_match_all('/[\p{L}\p{N}]+/u', $text, $words);
        if (count($words[0] ?? []) < 4) {
            return false;
        }

        $symbols = preg_match_all('/[=;{}()[\]<>]/u', $text);
        $length = max(1, mb_strlen($text));

        return ($symbols / $length) < 0.08;
    }

    /**
     * @param  array<int, string>  $pieces
     */
    private function mergeText(array $pieces): string
    {
        return implode("\n\n", $this->dedupePieces($pieces));
    }

    /**
     * @param  array<int, string>  $pieces
     * @return array<int, string>
     */
    private function dedupePieces(array $pieces): array
    {
        $seen = [];
        $out = [];

        foreach ($pieces as $piece) {
            $piece = $this->normalizeReadableText($piece);
            if ($piece === '') {
                continue;
            }

            $key = mb_strtolower($piece);
            if (isset($seen[$key])) {
                continue;
            }

            $seen[$key] = true;
            $out[] = $piece;
        }

        return $out;
    }
}
