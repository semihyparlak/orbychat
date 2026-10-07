<?php

namespace App\Http\Controllers\Widget;

use App\Models\Agent;
use App\Models\Conversation;
use App\Models\Lead;
use App\Models\Message;
use App\Models\Visitor;
use App\Models\Workspace;
use App\Services\Billing\MeteredBilling;
use App\Services\Crawl\AutoIndexPageVisit;
use App\Services\Vertical\VerticalPresetRegistry;
use App\Services\Widget\AcceptLanguage;
use App\Services\Widget\WidgetJwt;
use App\Support\AppBranding;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class InitController
{
    public function __construct(
        private WidgetJwt $jwt,
        private MeteredBilling $billing,
        private AutoIndexPageVisit $autoIndex,
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        $data = $request->validate([
            'agent_id' => ['required', 'string'],
            'page_url' => ['nullable', 'string', 'max:2000'],
            'anon_id' => ['nullable', 'string', 'max:64'],
        ]);

        /** @var Agent|null $agent */
        $agent = Agent::query()->withoutWorkspaceScope()
            ->where('id', $data['agent_id'])
            ->where('is_published', true)
            ->first();

        if ($agent === null) {
            return response()->json([
                'error' => ['code' => 'agent_not_found', 'message' => 'Agent not found or not published.'],
            ], 404);
        }

        $origin = $request->headers->get('Origin') ?? $request->headers->get('Referer');
        if (! $this->originAllowed($origin, $agent)) {
            return response()->json([
                'error' => ['code' => 'origin_forbidden', 'message' => 'Origin is not allowed for this agent.'],
            ], 403);
        }

        // Quota gate — block new conversations once the workspace's monthly
        // plan limit is exceeded. Existing conversations and message replies
        // are unaffected; only init blocks.
        $workspace = Workspace::query()->find($agent->workspace_id);
        if ($workspace !== null && ! $this->billing->canStartConversation($workspace)) {
            return response()->json([
                'error' => [
                    'code' => 'plan_limit_reached',
                    'message' => 'This workspace has reached its monthly conversation limit. Upgrade to continue.',
                ],
            ], 429)->header('Access-Control-Allow-Origin', $origin ?? '*')
                ->header('Access-Control-Allow-Credentials', 'true');
        }

        $anonId = $data['anon_id'] ?? 'anon_'.Str::random(16);
        $visitor = Visitor::query()->withoutWorkspaceScope()
            ->where('agent_id', $agent->id)
            ->where('anonymous_id', $anonId)
            ->first();

        if ($visitor === null) {
            $visitor = Visitor::create([
                'agent_id' => $agent->id,
                'anonymous_id' => $anonId,
                'ip_hash' => hash('sha256', (string) $request->ip()),
                'ua' => substr((string) $request->userAgent(), 0, 500),
                'first_seen_at' => now(),
                'last_seen_at' => now(),
                'visit_count' => 1,
            ]);
        } else {
            $visitor->forceFill([
                'last_seen_at' => now(),
                'visit_count' => $visitor->visit_count + 1,
            ])->save();
        }

        // Force the app locale to match the agent's configured language.
        // We set it on both the app and the translator to be absolutely sure.
        $lang = strtolower($agent->language_default ?: 'en');
        app()->setLocale($lang);
        config(['app.locale' => $lang]);
        if (app()->bound('translator')) {
            app('translator')->setLocale($lang);
        }

        // Resume the visitor's most recent conversation if it's still
        // active (last activity in the past 24h, not claimed by a human
        // operator who's already moved on). Keeps chat history across
        // page reloads — without this, each init created a brand-new
        // conversation and the previous turns vanished.
        $resumeWindow = now()->subDay();
        $conversation = Conversation::query()->withoutWorkspaceScope()
            ->where('agent_id', $agent->id)
            ->where('visitor_id', $visitor->id)
            ->where('started_at', '>=', $resumeWindow)
            ->orderByDesc('started_at')
            ->first();

        if ($conversation === null) {
            $conversation = Conversation::create([
                'agent_id' => $agent->id,
                'visitor_id' => $visitor->id,
                'page_url' => $data['page_url'] ?? null,
                'started_at' => now(),
                'lang' => $lang,
            ]);
        } elseif (is_string($data['page_url'] ?? null) && $data['page_url'] !== $conversation->page_url) {
            // Visitor came back on a different page within the resume
            // window — pin the latest URL so the prompt's "current page"
            // hint stays accurate.
            $conversation->forceFill(['page_url' => $data['page_url']])->save();
        }

        // Auto-index the page the visitor just landed on, if we haven't
        // crawled it before. The service is fully guarded (origin/dedup/
        // rate-limit) so this is a safe no-op when conditions aren't met.
        // Pass the verified Origin header so agents using '*' allowed_origins
        // can still auto-index pages on the visitor's actual domain.
        if (is_string($data['page_url'] ?? null) && $data['page_url'] !== '') {
            try {
                $this->autoIndex->attempt($agent, $data['page_url'], $origin);
            } catch (\Throwable) {
                // Auto-indexing is best-effort — never break /init for it.
            }
        }

        $issued = $this->jwt->issue($agent->id, $visitor->id, $conversation->id);

        // Recent turns so the widget can hydrate the chat log on page
        // reload. Last 30 messages, oldest-first — enough for context
        // without ballooning the init payload.
        // Hide turns from before the visitor last hit "Clear conversation".
        // The conversation row + messages stay in the DB for analytics +
        // lead linkage; we just stop hydrating them into the widget.
        $messagesQuery = Message::query()
            ->where('conversation_id', $conversation->id)
            ->whereIn('role', ['user', 'assistant', 'human-agent']);

        if ($conversation->cleared_at !== null) {
            $messagesQuery->where('created_at', '>', $conversation->cleared_at);
        }

        $messages = $messagesQuery
            ->orderBy('created_at')
            ->limit(30)
            ->get(['id', 'role', 'content', 'citations'])
            ->map(fn (Message $m) => [
                'id' => (string) $m->id,
                'role' => $m->role,
                'content' => (string) $m->content,
                'citations' => $m->citations ?? [],
            ])
            ->values();

        $behaviorRules = $agent->behaviorRules()
            ->withoutGlobalScopes()
            ->where('agent_id', $agent->id)
            ->where('enabled', true)
            ->orderByDesc('priority')
            ->limit(20)
            ->get(['id', 'kind', 'conditions', 'action'])
            ->map(fn ($r) => [
                'id' => $r->id,
                'kind' => $r->kind,
                'conditions' => $r->conditions ?? new \stdClass,
                'action' => $r->action ?? new \stdClass,
            ]);

        $branding = AppBranding::shared();

        // Pre-chat-gate companion: when require_lead_before_chat is on,
        // the widget needs to know on /init whether this conversation
        // has already captured a lead — otherwise a returning visitor
        // would see the gate again on every refresh. One indexed
        // existence check; cheaper than hydrating the row.
        $leadAlreadyCaptured = Lead::query()
            ->withoutGlobalScopes()
            ->where('agent_id', $agent->id)
            ->where('conversation_id', $conversation->id)
            ->exists();

        $agentData = [
            'id' => $agent->id,
            'name' => $agent->name,
            'persona' => $agent->persona,
            'theme' => $this->translateTheme($agent->theme),
            'starter_prompts' => array_map(fn($p) => $this->localize($p, $lang), $this->resolveStarterPrompts($agent)),
            'language_default' => $agent->language_default,
            'site_type' => $agent->site_type,
            'capabilities' => $this->resolveCapabilities($agent),
            'restricted_paths' => array_values((array) ($agent->restricted_paths ?? [])),
            'require_lead_before_chat' => (bool) $agent->require_lead_before_chat,
            'lead_form_fields' => $agent->lead_form_fields,
            'ui_labels' => [
                'panel_title' => $this->localize('AI assistant', $lang),
                'live_support_title' => $this->localize('Live support', $lang),
                'close' => $this->localize('Close', $lang),
                'clear_conversation' => $this->localize('Clear conversation', $lang),
                'send' => $this->localize('Send', $lang),
                'sending' => $this->localize('Sending...', $lang),
                'dismiss' => $this->localize('Dismiss', $lang),
                'powered_by' => $this->localize('Powered by', $lang),
                'ask_anything' => $this->localize('Ask anything', $lang),
                'lead_form_title' => $this->localize('Leave your details — we\'ll get back to you.', $lang),
                'error_invalid_email' => $this->localize('Please enter a valid email address.', $lang),
                'error_generic' => $this->localize('Could not save your details. Please try again.', $lang),
                'field_name' => $this->localize('Your name', $lang),
                'field_email' => $this->localize('Email', $lang),
                'field_email_placeholder' => $this->localize('email@example.com', $lang),
                'field_phone' => $this->localize('Phone number', $lang),
                'field_optional' => $this->localize('Optional', $lang),
                'field_date' => $this->localize('Date', $lang),
                'field_time' => $this->localize('Time', $lang),
                'typing' => $this->localize('AI is typing...', $lang),
                'thinking' => $this->localize('Thinking...', $lang),
                'start_voice' => $this->localize('Start voice input', $lang),
                'stop_voice' => $this->localize('Stop voice input', $lang),
                'voice_not_supported' => $this->localize('Voice input not supported in this browser', $lang),
                'retry' => $this->localize('Retry', $lang),
                'copy' => $this->localize('Copy', $lang),
                'sources' => $this->localize('Sources', $lang),
                'live_agent' => $this->localize('Live agent', $lang),
                'connect_human' => $this->localize('Connect me with a human', $lang),
                'read_more' => $this->localize('Read more', $lang),
                'view' => $this->localize('View', $lang),
                'copied_to_clipboard' => $this->localize('Code copied to clipboard!', $lang),
                'appointment_request_cta' => $this->localize('Schedule appointment', $lang),
                'appointment_request_title' => $this->localize('Schedule Appointment', $lang),
                'appointment_request_desc' => $this->localize('Please select a suitable time from the form below.', $lang),
                'appointment_success_desc' => $this->localize('We received your request and will get back to you shortly.', $lang),
                'appointment_requested' => $this->localize('Appointment Requested', $lang),
                'lead_success_title' => $this->localize('Thanks — we\'ll get back to you soon.', $lang),
                'prechat_gate_subtitle' => $this->localize('Share your details so we can pick up where the chat leaves off.', $lang),
                'start_chat' => $this->localize('Start chat', $lang),
                'back' => $this->localize('Back', $lang),
                'month_jan' => $this->localize('Jan', $lang),
                'month_feb' => $this->localize('Feb', $lang),
                'month_mar' => $this->localize('Mar', $lang),
                'month_apr' => $this->localize('Apr', $lang),
                'month_may' => $this->localize('May', $lang),
                'month_jun' => $this->localize('Jun', $lang),
                'month_jul' => $this->localize('Jul', $lang),
                'month_aug' => $this->localize('Aug', $lang),
                'month_sep' => $this->localize('Sep', $lang),
                'month_oct' => $this->localize('Oct', $lang),
                'month_nov' => $this->localize('Nov', $lang),
                'month_dec' => $this->localize('Dec', $lang),
                'day_sun_short' => $this->localize('Sun_S', $lang),
                'day_mon_short' => $this->localize('Mon_M', $lang),
                'day_tue_short' => $this->localize('Tue_T', $lang),
                'day_wed_short' => $this->localize('Wed_W', $lang),
                'day_thu_short' => $this->localize('Thu_T', $lang),
                'day_fri_short' => $this->localize('Fri_F', $lang),
                'day_sat_short' => $this->localize('Sat_S', $lang),
                'select_time' => $this->localize('Select time', $lang),
                'starting_chat' => $this->localize('Starting chat...', $lang),
                'error_fill_in' => $this->localize('Please fill in ":field".', $lang),
                'kvkk_text' => $this->localize('I consent to processing of my data.', $lang),
                'error_kvkk' => $this->localize('Please accept the data processing terms.', $lang),
                'case_study' => $this->localize('Case study', $lang),
                'order' => $this->localize('Order', $lang),
                'track_package' => $this->localize('Track Package', $lang),
                'account_status' => $this->localize('Account Status', $lang),
                'plan' => $this->localize('Plan', $lang),
                'usage' => $this->localize('Usage', $lang),
                'api_endpoint' => $this->localize('API Endpoint', $lang),
                'versions' => $this->localize('Versions', $lang),
                'troubleshooting' => $this->localize('Troubleshooting', $lang),
                'select_an_option' => $this->localize('Select an option', $lang),
                'insurance' => $this->localize('Insurance', $lang),
                'treatment' => $this->localize('Treatment', $lang),
                'treatment_info' => $this->localize('Treatment Info', $lang),
                'estimated' => $this->localize('Estimated', $lang),
                'ready_to_start' => $this->localize('Ready to get started?', $lang),
                'create_account' => $this->localize('Create Free Account', $lang),
                'plan_details' => $this->localize('Plan Details', $lang),
            ],
        ];

        return response()->json([
            'data' => [
                'conversation_id' => $conversation->id,
                'visitor_id' => $visitor->id,
                'anonymous_id' => $anonId,
                'jwt' => $issued['token'],
                'expires_at' => $issued['expires_at'],
                'agent' => $agentData,
                'branding' => [
                    'show' => ! ($workspace?->plan?->removesBranding() ?? false),
                    'label' => (string) config('branding.label'),
                    'url' => (string) config('branding.url'),
                    'logo_url' => $branding['footer_logo_url'] ?? $branding['header_logo_url'],
                    'display_mode' => $branding['footer_brand_display'],
                ],
                'behavior_rules' => $behaviorRules,
                'lead_captured' => $leadAlreadyCaptured,
                'messages' => $messages,
                'reverb' => [
                    'app_key' => config('reverb.apps.apps.0.key', env('REVERB_APP_KEY')),
                    'host' => env('REVERB_HOST', 'localhost'),
                    'port' => (int) env('REVERB_PORT', 8080),
                    'scheme' => env('REVERB_SCHEME', 'http'),
                ],
            ],
        ])->header('Access-Control-Allow-Origin', $origin ?? '*')
            ->header('Access-Control-Allow-Credentials', 'true');
    }

    /**
     * Resolves the capability flag set the widget reads to know which
     * rich-UI affordances are allowed. Server is the source of truth —
     * the widget can never enable a capability it isn't told about.
     *
     * Hot-path safe: the registry is bound `scoped`, so this is one
     * column read (already loaded with the agent) plus one O(1) array
     * lookup. No DB query.
     *
     * @return array<int, string>
     */
    private function resolveCapabilities(Agent $agent): array
    {
        if ($agent->site_type === null) {
            return [];
        }

        $overrides = (array) ($agent->vertical_overrides ?? []);
        if (isset($overrides['capabilities']) && is_array($overrides['capabilities'])) {
            return array_values(array_unique(array_filter(
                $overrides['capabilities'],
                static fn ($v) => is_string($v) && $v !== '',
            )));
        }

        $registry = app(VerticalPresetRegistry::class);
        return $registry->for((string) $agent->site_type)->capabilities();
    }

/**
 * Resolves the starter prompts for the widget. If the agent has custom
 * prompts defined in the DB, we use those. Otherwise, we pull the
 * defaults from the vertical preset (which are now translatable).
 */
private function resolveStarterPrompts(Agent $agent): array
{
    // Re-verify the locale right before resolving prompts
    $lang = $agent->language_default ?: 'en';
    app()->setLocale($lang);
    if (app()->bound('translator')) {
        app('translator')->setLocale($lang);
    }

    $custom = (array) ($agent->starter_prompts ?? []);
    if ($custom !== []) {
        return array_values(array_filter($custom));
    }
    if ($agent->site_type === null) {
        return [];
    }

    if (is_array($agent->starter_prompts) && count($agent->starter_prompts) > 0) {
        return $agent->starter_prompts;
    }

    $registry = app(VerticalPresetRegistry::class);

    return $registry->for((string) $agent->site_type)->starterPrompts();
}

/**
 * Translates known keys in the theme object (like launcher_label)
 * so that default English values from the DB are localized.
 */
private function translateTheme(mixed $theme): array
{
    $theme = (array) ($theme ?? []);

    if (isset($theme['launcher_label']) && is_string($theme['launcher_label'])) {
        $label = $theme['launcher_label'] ?? '';
        // If it's the default English label or the one the user disliked,
        // Launcher label: If it's a default or empty, use the localized string
        if ($label === 'Ask about the product' || $label === 'Ürün hakkında sorun' || $label === 'Ürün hakkında soru sor' || $label === 'Sorularınız mı var?' || $label === 'Ask anything' || $label === '') {
            $theme['launcher_label'] = $this->localize('Ask about the product', app()->getLocale());
        } else {
            $theme['launcher_label'] = $this->localize($label, app()->getLocale());
        }
    }

    return $theme;
}

/**
 * Translates labels and prompts, handling cases where they might be 
 * saved in Turkish in the DB but need to be shown in English.
 * Provides a robust fallback for English locales.
 */
private function localize(string $key, string $lang): string
{
    if ($lang === 'en') {
        $map = [
            'Ücreti nedir?' => 'What does it cost?',
            'Nasıl çalışır?' => 'How does it work?',
            'Ücretsiz deneyebilir miyim?' => 'Can I try it for free?',
            'Rakiplerden farkı nedir?' => 'How is this different from competitors?',
            'Daha fazla bilgi alabilir miyim?' => 'Tell me more about this',
            'Nasıl başlarım?' => 'How do I get started?',
            'Demo görebilir miyim?' => 'Can I see a demo?',
            'Ürün hakkında soru sor' => 'Ask about the product',
            'Ürün hakkında sorun' => 'Ask about the product',
            'Sorularınız mı var?' => 'Ask about the product',
        ];
        return $map[$key] ?? $key;
    }

    return __($key, [], $lang);
}

    /**
     * Strict, exact-match origin gate. The widget script is public; without
     * this gate any third party could embed it on their own site and burn
     * the customer's plan quota / poison their KB.
     *
     * Rules:
     *   - Empty allowed_origins → DENY ALL. Customer must list origins
     *     explicitly before the widget will load anywhere.
     *   - '*' → opt-in escape hatch. Allows any origin. Used for internal
     *     tools / demo agents; never the default.
     *   - Otherwise → exact scheme://host match. Subdomains are NOT
     *     inferred. `https://example.com` does NOT permit
     *     `https://app.example.com` — admins must list each origin.
     *
     * Both sides of the comparison are normalised first so customers can
     * paste "https://example.com/" (trailing slash) or " https://EXAMPLE.com "
     * (leading whitespace, mixed case) and still match the browser's
     * canonical "https://example.com" Origin header. The strict-subdomain
     * rule is preserved.
     */
    private function originAllowed(?string $origin, Agent $agent): bool
    {
        $allowed = array_values(array_filter(array_map(
            fn ($o) => self::normaliseOrigin((string) $o),
            (array) ($agent->allowed_origins ?? []),
        ), static fn (string $o) => $o !== ''));

        if ($allowed === []) {
            return false;
        }
        if (in_array('*', $allowed, true)) {
            return true;
        }
        if ($origin === null) {
            return false;
        }

        $normalised = self::normaliseOrigin($origin);

        return $normalised !== '' && in_array($normalised, $allowed, true);
    }

    /**
     * Reduces an origin string to a canonical "scheme://host" so user
     * input ("https://Example.com/", " https://example.com ") matches
     * the browser's "https://example.com" Origin header. Returns "*"
     * unchanged and an empty string for malformed input.
     */
    public static function normaliseOrigin(string $value): string
    {
        $value = trim($value);

        if ($value === '' || $value === '*') {
            return $value;
        }

        $host = parse_url($value, PHP_URL_HOST);
        $scheme = parse_url($value, PHP_URL_SCHEME);

        if (! is_string($host) || $host === '' || ! is_string($scheme) || $scheme === '') {
            return '';
        }

        $port = parse_url($value, PHP_URL_PORT);
        $authority = strtolower($scheme).'://'.strtolower($host);
        if (is_int($port)) {
            $authority .= ':'.$port;
        }

        return $authority;
    }
}
