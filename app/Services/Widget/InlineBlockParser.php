<?php

namespace App\Services\Widget;

/**
 * Parses inline block markers out of an assistant's reply text.
 *
 * Phase 3 vertical presets instruct the LLM to emit XML-shaped self-closing
 * markers when it wants the widget to render a rich card alongside the text:
 *
 *   <product title="..." price="..." currency="..." url="..." image="..." summary="..."/>
 *   <pricing title="..." price="..." period="month" cta="..." url="..."/>
 *   <case-study title="..." outcome="..." url="..."/>
 *
 * This class strips those markers from the visible text and returns parsed
 * block payloads alongside the cleaned reply. Block emission lives in the
 * prompt rather than as a streamed SSE channel because Workers AI tool support
 * is too inconsistent across models — parsing post-stream is robust on every
 * provider.
 *
 * The parser is defensive: smaller LLMs (Llama 3.3 70B on Workers AI) will
 * occasionally collapse adjacent attributes into a single quoted value
 * (`currency="USD url=https://..."`). We detect that pattern and split it
 * back so a model glitch doesn't black-hole the rendered card.
 */
class InlineBlockParser
{
    /**
     * Tag name → block type slug emitted to the widget renderer.
     *
     * @var array<string, string>
     */
    private const BLOCK_TYPES = [
        'product' => 'product_card',
        'pricing' => 'pricing_card',
        'case-study' => 'case_study_card',
        'coupon' => 'coupon_card',
        'order-status' => 'order_status_card',
        'appointment' => 'appointment_card',
        'treatment' => 'treatment_card',
        'health-plan' => 'health_plan_card',
        'code' => 'code_block',
        'api-ref' => 'api_ref_card',
        'version' => 'version_picker',
        'troubleshoot' => 'troubleshoot_card',
        'kb-article' => 'kb_article_card',
        'ticket' => 'ticket_escalation',
        'account-status' => 'account_status_card',
        'signup' => 'signup_card',
        'escalate' => 'escalation_button',
    ];

    /**
     * Extract every inline block from the text. Returns the cleaned text
     * (markers stripped, whitespace tidied) plus an ordered list of
     * parsed block payloads.
     *
     * @return array{text: string, blocks: array<int, array{type: string, payload: array<string, string>}>}
     */
    public function extract(string $text, ?string $evidence = null): array
    {
        $blocks = [];

        // 4. Follow-up suggestions (resilient to minor typos)
        preg_match_all('/<(follow-up|follw-up|follou-up|followup)>(.*?)<\/(follow-up|follw-up|follou-up|followup)>/is', $text, $matches, PREG_SET_ORDER);
        foreach ($matches as $match) {
            $blocks[] = [
                'type' => 'follow_up',
                'payload' => ['question' => trim($match[2])],
            ];
        }
        $text = preg_replace('/<(follow-up|follw-up|follou-up|followup)>.*?<\/(follow-up|follw-up|follou-up|followup)>/is', '', $text);

        // 2. Extract self-closing XML-style tags
        foreach (self::BLOCK_TYPES as $tag => $blockType) {
            // Match self-closing XML-style tags. Tolerant: allows newlines
            // inside attribute lists, single OR double quotes, and an
            // optional space before the `/>`.
            $pattern = '#<'.preg_quote($tag, '#').'\b([^>]*?)/\s*>#is';
            if (! preg_match_all($pattern, $text, $matches, PREG_SET_ORDER)) {
                continue;
            }
            foreach ($matches as $m) {
                $attrs = $this->parseAttrs($m[1]);
                if ($attrs === []) {
                    continue;
                }
                if (! $this->blockHasEvidence($blockType, $attrs, $evidence)) {
                    $text = str_replace($m[0], '', $text);

                    continue;
                }

                $blocks[] = ['type' => $blockType, 'payload' => $attrs];
                $text = str_replace($m[0], '', $text);
            }
        }

        // Tidy whitespace left behind by stripped markers — collapse
        // runs of blank lines into one, trim leading/trailing whitespace
        // on the final reply.
        $text = preg_replace('/\n{3,}/', "\n\n", $text) ?? $text;
        $text = trim($text);

        return ['text' => $text, 'blocks' => $blocks];
    }

    /**
     * @param  array<string, string>  $attrs
     */
    private function blockHasEvidence(string $blockType, array $attrs, ?string $evidence): bool
    {
        if ($evidence === null || trim($evidence) === '') {
            return true;
        }

        if (isset($attrs['url']) && trim($attrs['url']) !== '' && ! $this->urlAppearsInEvidence($attrs['url'], $evidence)) {
            return false;
        }

        if (isset($attrs['href']) && trim($attrs['href']) !== '' && ! $this->urlAppearsInEvidence($attrs['href'], $evidence)) {
            return false;
        }

        $needsPriceEvidence = in_array($blockType, ['pricing_card', 'product_card'], true)
            && isset($attrs['price'])
            && trim($attrs['price']) !== '';

        if (! $needsPriceEvidence) {
            return true;
        }

        return $this->priceAppearsInEvidence($attrs['price'], $evidence);
    }

    private function priceAppearsInEvidence(string $price, string $evidence): bool
    {
        $price = trim($price);
        if ($price === '') {
            return false;
        }

        $normalizedPrice = preg_replace('/[^\d.,]/u', '', $price) ?? '';
        if ($normalizedPrice === '') {
            return false;
        }

        $variants = array_values(array_unique(array_filter([
            $price,
            $normalizedPrice,
            str_replace(',', '.', $normalizedPrice),
            str_replace('.', ',', $normalizedPrice),
        ])));

        foreach ($variants as $variant) {
            if ($variant !== '' && mb_stripos($evidence, $variant) !== false) {
                return true;
            }
        }

        return false;
    }

    private function urlAppearsInEvidence(string $url, string $evidence): bool
    {
        $url = trim($url);
        if ($url === '' || str_starts_with($url, '#')) {
            return false;
        }

        $variants = array_values(array_unique(array_filter([
            $url,
            html_entity_decode($url, ENT_QUOTES | ENT_HTML5),
            rtrim($url, '/'),
        ])));

        foreach ($variants as $variant) {
            if ($variant !== '' && mb_stripos($evidence, $variant) !== false) {
                return true;
            }
        }

        return false;
    }

    /**
     * Parse XML-ish attributes. Returns an array<string,string> of trimmed
     * values. Unknown forms are silently dropped — better to render a card
     * with fewer fields than to crash the turn.
     *
     * Defensive repair: if a captured value contains a ` key=` pattern, the
     * LLM forgot to close the previous attribute's quote — we split it back
     * out and re-parse the tail.
     *
     * @return array<string, string>
     */
    private function parseAttrs(string $raw): array
    {
        if (! preg_match_all('/(\w[\w-]*)\s*=\s*(?:"([^"]*)"|\'([^\']*)\')/', $raw, $m, PREG_SET_ORDER)) {
            return [];
        }
        $out = [];
        foreach ($m as $pair) {
            $key = strtolower($pair[1]);
            $val = $pair[2] !== '' ? $pair[2] : ($pair[3] ?? '');

            if (preg_match('/\s+(\w[\w-]*)\s*=\s*(.+)$/s', $val, $split)) {
                $val = substr($val, 0, -strlen($split[0]));
                $tail = $split[1].'='.$split[2];
                if (! str_starts_with(trim($split[2]), '"') && ! str_starts_with(trim($split[2]), "'")) {
                    $tail = $split[1].'="'.trim($split[2]).'"';
                }
                $extra = $this->parseAttrs($tail);
                foreach ($extra as $k => $v) {
                    $out[$k] = $v;
                }
            }
            $out[$key] = trim($val);
        }

        return $out;
    }
}
