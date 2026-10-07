<?php

namespace App\Http\Controllers\Admin\Platform;

use App\Models\AppSetting;
use App\Models\CronTickLog;
use App\Models\Lead;
use App\Notifications\NewLeadCaptured;
use App\Services\Billing\PayPalClient;
use App\Services\Billing\RazorpayClient;
use App\Services\Llm\Contracts\OpenAiClient;
use App\Support\AppBranding;
use App\Support\MarketingHomeContent;
use App\Support\PrivacyPolicyContent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Stripe\StripeClient;

/**
 * Platform-admin "system config + health" page. Two surfaces in one:
 *
 *   1. Editable forms per provider (Stripe, Cloudflare, OpenAI,
 *      OpenRouter, Mail, branding) → persists into the singleton
 *      `app_settings` row → AppSettingsOverrideServiceProvider applies
 *      the values to config() on the next request.
 *
 *   2. One-click smoke tests that exercise the currently-bound provider
 *      end-to-end so the admin can confirm a freshly-rotated key works.
 *
 * Sensitive fields (api keys, webhook secrets, mail password) are NEVER
 * sent back to the frontend in plaintext — only a `_set` boolean
 * indicating that a value is currently stored. Submitting the form with
 * an empty value for a sensitive field leaves the existing value
 * untouched; submitting a new value replaces it.
 *
 * All test endpoints catch every Throwable and return `{ok, message}`
 * with HTTP 200 so the UI can render the result consistently.
 */
class SystemController
{
    public function index(): Response
    {
        return $this->renderPage('system');
    }

    public function branding(): Response
    {
        return $this->renderPage('branding');
    }

    public function marketing(): Response
    {
        return $this->renderPage('marketing');
    }

    public function privacy(): Response
    {
        return $this->renderPage('privacy');
    }

    private function renderPage(string $page): Response
    {
        $settings = AppSetting::singleton();

        return Inertia::render('settings/system', [
            'page' => $page,
            'sections' => [
                'mail' => $this->mailSummary(),
                'stripe' => $this->stripeSummary(),
                'paypal' => $this->paypalSummary(),
                'razorpay' => $this->razorpaySummary(),
                'llm' => $this->llmSummary(),
                'cache' => $this->cacheSummary(),
                'vector' => $this->vectorSummary(),
                'reverb' => $this->reverbSummary(),
                'marketing' => [
                    'customized' => ! empty($settings->marketing_home_content),
                ],
                'privacy' => [
                    'customized' => ! empty($settings->privacy_policy_content),
                ],
                'cron_worker' => array_merge([
                    'deployed' => ! empty($settings->cron_worker_name) && $settings->cron_worker_deployed_at !== null,
                    'worker_name' => $settings->cron_worker_name,
                    'deployed_at' => $settings->cron_worker_deployed_at?->toIso8601String(),
                    'last_status' => $settings->cron_worker_last_status,
                    'last_status_at' => $settings->cron_worker_last_status_at?->toIso8601String(),
                    'cloudflare_configured' => ! empty(
                        $settings->cloudflare_account_id
                            ?: env('CLOUDFLARE_ACCOUNT_ID', '')
                    ) && ! empty(
                        $settings->cloudflare_api_token
                            ?: env('CLOUDFLARE_API_TOKEN', '')
                    ),
                    'callback_url' => rtrim((string) config('app.url'), '/').'/api/v1/internal/queue-tick',
                ], $this->cronWorkerHealth()),
            ],
            'form' => $this->formValues($settings),
        ]);
    }

    /**
     * Health stats for the Cron Worker tab. Aggregates the
     * cron_tick_logs table so the admin can see "is the Cloudflare
     * Worker actually firing AND actually doing work?" without
     * leaving the dashboard.
     *
     * @return array{
     *   last_tick_at: ?string,
     *   seconds_since_last_tick: ?int,
     *   liveness: 'live'|'stale'|'dead'|'unknown',
     *   ticks_last_hour: int,
     *   ticks_last_24h: int,
     *   jobs_processed_last_hour: int,
     *   jobs_processed_last_24h: int,
     *   pending_jobs: int,
     *   failed_jobs: int,
     *   recent_ticks: array<int, array{at: string|null, processed: int, failed: int, remaining: int, ms: int}>,
     * }
     */
    private function cronWorkerHealth(): array
    {
        $latest = CronTickLog::query()->orderByDesc('id')->first();
        $now = now();
        $secondsSince = $latest ? (int) $latest->received_at->diffInSeconds($now) : null;
        $liveness = match (true) {
            $latest === null => 'unknown',
            $secondsSince !== null && $secondsSince <= 90 => 'live',
            $secondsSince !== null && $secondsSince <= 300 => 'stale',
            default => 'dead',
        };

        $hourAgo = $now->copy()->subHour();
        $dayAgo = $now->copy()->subDay();

        $recent = CronTickLog::query()
            ->orderByDesc('id')
            ->limit(20)
            ->get(['received_at', 'processed', 'failed_in_tick', 'remaining_pending', 'elapsed_ms'])
            ->map(fn ($r) => [
                'at' => $r->received_at?->toIso8601String(),
                'processed' => (int) $r->processed,
                'failed' => (int) $r->failed_in_tick,
                'remaining' => (int) $r->remaining_pending,
                'ms' => (int) $r->elapsed_ms,
            ])
            ->values()
            ->all();

        return [
            'last_tick_at' => $latest?->received_at?->toIso8601String(),
            'seconds_since_last_tick' => $secondsSince,
            'liveness' => $liveness,
            'ticks_last_hour' => (int) CronTickLog::query()->where('received_at', '>=', $hourAgo)->count(),
            'ticks_last_24h' => (int) CronTickLog::query()->where('received_at', '>=', $dayAgo)->count(),
            'jobs_processed_last_hour' => (int) CronTickLog::query()->where('received_at', '>=', $hourAgo)->sum('processed'),
            'jobs_processed_last_24h' => (int) CronTickLog::query()->where('received_at', '>=', $dayAgo)->sum('processed'),
            'pending_jobs' => (int) \DB::table('jobs')->count(),
            'failed_jobs' => (int) \DB::table('failed_jobs')->count(),
            'recent_ticks' => $recent,
        ];
    }

    public function update(Request $request, string $section): RedirectResponse
    {
        $rules = $this->validationRulesFor($section);

        if ($rules === null) {
            abort(404);
        }

        $data = $request->validate($rules);

        $settings = null;

        if ($section === 'branding') {
            $settings = AppSetting::singleton();
            $data = $this->prepareBrandingData($data, $settings);
        }

        // Strip blanks — those mean "leave the existing value alone",
        // not "clear it". (To clear a value, the admin can type the
        // string "null" via the dedicated UI later; for now blank ==
        // no change.)
        $data = array_filter(
            $data,
            static fn ($v) => $v !== '' && $v !== null,
        );

        if ($section === 'marketing' && array_key_exists('marketing_home_content', $data)) {
            $data['marketing_home_content'] = MarketingHomeContent::resolve($data['marketing_home_content']);
        }

        if ($section === 'privacy' && array_key_exists('privacy_policy_content', $data)) {
            $data['privacy_policy_content'] = PrivacyPolicyContent::resolve($data['privacy_policy_content']);
        }

        if ($data === []) {
            return back()->with('error', 'No '.str_replace('_', ' ', $section).' settings changes were received.');
        }

        $settings ??= AppSetting::singleton();
        $settings->fill($data);
        $settings->save();
        AppSetting::flushSingleton();

        return back()->with('success', ucfirst($section).' settings saved.');
    }

    public function testMail(Request $request): JsonResponse
    {
        $to = (string) $request->user()->email;

        try {
            Mail::raw(
                "This is a OrbyChat SMTP test from the admin System page.\n\n".
                'If you received this, your mail configuration is wired up correctly.',
                function ($message) use ($to) {
                    $message->to($to)
                        ->subject('OrbyChat — SMTP test');
                },
            );

            return $this->ok("Test email queued for {$to} via ".config('mail.default'));
        } catch (\Throwable $e) {
            return $this->fail($e->getMessage());
        }
    }

    /**
     * End-to-end probe of the captured-lead notification path:
     * dispatches a queued NewLeadCaptured notification with a
     * synthetic Lead so the admin can confirm the queue worker is
     * picking jobs up AND the actual email template renders. Buyer
     * reports of "leads not arriving" almost always trace back to
     * MAIL_MAILER=log or no queue worker; the raw SMTP test above
     * catches the first but not the second. This one catches both.
     *
     * Synthetic lead is built in-memory and never persisted —
     * sending the notification directly to the admin's email avoids
     * a migration on production data and side-stepping multi-tenancy.
     */
    public function testLeadEmail(Request $request): JsonResponse
    {
        $user = $request->user();
        $to = (string) $user->email;

        try {
            $lead = new Lead([
                'email' => 'demo-lead@example.com',
                'name' => 'Demo Lead',
                'phone' => null,
            ]);
            // forceFill stamps an id + timestamps that the email
            // template references without requiring a DB row.
            $lead->forceFill([
                'id' => (string) Str::uuid7(),
                'agent_id' => 'demo-agent',
                'workspace_id' => 'demo-workspace',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            Notification::route('mail', $to)
                ->notify(new NewLeadCaptured($lead));

            $queueDriver = (string) config('queue.default');
            $mailDriver = (string) config('mail.default');

            return $this->ok(
                "Test lead-captured email dispatched for {$to} "
                ."(queue={$queueDriver}, mail={$mailDriver}). "
                .'If the queue worker is running and mail is wired up, '
                .'the email arrives within seconds.'
            );
        } catch (\Throwable $e) {
            return $this->fail($e->getMessage());
        }
    }

    public function testStripe(): JsonResponse
    {
        $secret = (string) (config('cashier.secret') ?? '');

        if ($secret === '') {
            return $this->fail('STRIPE_SECRET is not configured.');
        }

        try {
            $stripe = new StripeClient($secret);
            $stripe->balance->retrieve();

            return $this->ok('Stripe API reachable with the configured key.');
        } catch (\Throwable $e) {
            return $this->fail($e->getMessage());
        }
    }

    public function testPayPal(): JsonResponse
    {
        $client = PayPalClient::fromConfig();

        if (! $client->isConfigured()) {
            return $this->fail('PayPal client_id / client_secret is not configured.');
        }

        try {
            // Fresh REST client cycle: this triggers the OAuth token fetch,
            // which is the same endpoint we'd hit for any real PayPal call.
            // A 200 here proves credentials + mode are valid end-to-end.
            Http::baseUrl($client->baseUrl())
                ->withBasicAuth(
                    (string) config('services.paypal.client_id'),
                    (string) config('services.paypal.client_secret'),
                )
                ->asForm()
                ->acceptJson()
                ->throw()
                ->post('/v1/oauth2/token', ['grant_type' => 'client_credentials']);

            return $this->ok('PayPal API reachable in '.config('services.paypal.mode').' mode.');
        } catch (\Throwable $e) {
            return $this->fail($e->getMessage());
        }
    }

    public function testRazorpay(): JsonResponse
    {
        $client = RazorpayClient::fromConfig();

        if (! $client->isConfigured()) {
            return $this->fail('Razorpay key_id / key_secret is not configured.');
        }

        try {
            // /v1/payments?count=1 is a cheap, idempotent "list nothing"
            // call that confirms the key pair authenticates and the API
            // surface is reachable from this install.
            Http::baseUrl('https://api.razorpay.com')
                ->withBasicAuth(
                    (string) config('services.razorpay.key_id'),
                    (string) config('services.razorpay.key_secret'),
                )
                ->acceptJson()
                ->throw()
                ->get('/v1/payments', ['count' => 1]);

            return $this->ok('Razorpay API reachable with the configured key pair.');
        } catch (\Throwable $e) {
            return $this->fail($e->getMessage());
        }
    }

    public function testLlm(): JsonResponse
    {
        try {
            $client = app(OpenAiClient::class);
            $tokens = [];

            foreach ($client->streamChat(
                [['role' => 'user', 'content' => 'Reply with the single word "ok".']],
                ['max_tokens' => 8],
            ) as $tok) {
                $tokens[] = $tok;

                if (count($tokens) >= 16) {
                    break;
                }
            }

            $text = trim(implode('', $tokens));

            if ($text === '') {
                return $this->fail('LLM stream returned no tokens.');
            }

            return $this->ok('LLM responded: '.mb_substr($text, 0, 80));
        } catch (\Throwable $e) {
            return $this->fail($e->getMessage());
        }
    }

    public function testEmbed(): JsonResponse
    {
        try {
            $client = app(OpenAiClient::class);
            $vectors = $client->embed(['orbychat health check']);

            if (empty($vectors) || ! is_array($vectors[0])) {
                return $this->fail('Embed call returned no vectors.');
            }

            return $this->ok('Embed produced a '.count($vectors[0]).'-dim vector.');
        } catch (\Throwable $e) {
            return $this->fail($e->getMessage());
        }
    }

    public function testCache(): JsonResponse
    {
        try {
            $key = 'pb:system:health:'.uniqid();
            $value = 'ok-'.now()->getTimestamp();

            Cache::put($key, $value, now()->addSeconds(10));
            $read = Cache::get($key);
            Cache::forget($key);

            if ($read !== $value) {
                return $this->fail('Cache write/read mismatch (got: '.var_export($read, true).').');
            }

            return $this->ok('Cache write/read/forget cycle succeeded on driver: '.config('cache.default'));
        } catch (\Throwable $e) {
            return $this->fail($e->getMessage());
        }
    }

    /**
     * Validation rules per section. Returns null for unknown sections
     * so the controller 404s consistently.
     *
     * @return array<string, array<int, string>>|null
     */
    private function validationRulesFor(string $section): ?array
    {
        return match ($section) {
            'stripe' => [
                'stripe_key' => ['nullable', 'string', 'max:255'],
                'stripe_secret' => ['nullable', 'string', 'max:255'],
                'stripe_webhook_secret' => ['nullable', 'string', 'max:255'],
                'cashier_currency' => ['nullable', 'string', 'max:8'],
            ],
            'paypal' => [
                'paypal_mode' => ['nullable', 'string', 'in:live,sandbox'],
                'paypal_client_id' => ['nullable', 'string', 'max:500'],
                'paypal_client_secret' => ['nullable', 'string', 'max:500'],
                'paypal_webhook_id' => ['nullable', 'string', 'max:255'],
            ],
            'razorpay' => [
                'razorpay_key_id' => ['nullable', 'string', 'max:255'],
                'razorpay_key_secret' => ['nullable', 'string', 'max:500'],
                'razorpay_webhook_secret' => ['nullable', 'string', 'max:500'],
            ],
            'gateways' => [
                'stripe_enabled' => ['sometimes', 'boolean'],
                'paypal_enabled' => ['sometimes', 'boolean'],
                'razorpay_enabled' => ['sometimes', 'boolean'],
            ],
            'cloudflare' => [
                'cloudflare_account_id' => ['nullable', 'string', 'max:255'],
                'cloudflare_api_token' => ['nullable', 'string', 'max:500'],
                'cloudflare_chat_model' => ['nullable', 'string', 'max:255'],
                'cloudflare_embed_model' => ['nullable', 'string', 'max:255'],
                'cloudflare_vectorize_index' => ['nullable', 'string', 'max:255'],
            ],
            'openai' => [
                'openai_api_key' => ['nullable', 'string', 'max:255'],
                'openai_chat_model' => ['nullable', 'string', 'max:255'],
                'openai_embed_model' => ['nullable', 'string', 'max:255'],
            ],
            'openrouter' => [
                'openrouter_api_key' => ['nullable', 'string', 'max:255'],
                'openrouter_chat_model' => ['nullable', 'string', 'max:255'],
            ],
            'routing' => [
                'llm_provider' => ['nullable', 'string', 'in:cloudflare,openai,openrouter'],
                'vector_provider' => ['nullable', 'string', 'in:cloudflare,qdrant'],
            ],
            'mail' => [
                'mail_driver' => ['nullable', 'string', 'max:32'],
                'mail_host' => ['nullable', 'string', 'max:255'],
                'mail_port' => ['nullable', 'integer', 'between:1,65535'],
                'mail_encryption' => ['nullable', 'string', 'in:tls,ssl'],
                'mail_username' => ['nullable', 'string', 'max:255'],
                'mail_password' => ['nullable', 'string', 'max:500'],
                'mail_from_address' => ['nullable', 'email', 'max:255'],
                'mail_from_name' => ['nullable', 'string', 'max:255'],
            ],
            'branding' => [
                'site_title' => ['nullable', 'string', 'max:120'],
                'header_logo' => ['nullable', 'file', 'mimes:png,jpg,jpeg,svg,webp', 'max:4096'],
                'footer_logo' => ['nullable', 'file', 'mimes:png,jpg,jpeg,svg,webp', 'max:4096'],
                'dashboard_logo' => ['nullable', 'file', 'mimes:png,jpg,jpeg,svg,webp', 'max:4096'],
                'favicon' => ['nullable', 'file', 'mimes:png,jpg,jpeg,svg,webp,ico', 'max:2048'],
                'header_brand_display' => ['nullable', 'string', 'in:logo_text,logo_only,text_only'],
                'footer_brand_display' => ['nullable', 'string', 'in:logo_text,logo_only,text_only'],
                'dashboard_brand_display' => ['nullable', 'string', 'in:logo_text,logo_only,text_only'],
                'orbychat_brand_url' => ['nullable', 'url', 'max:500'],
                'orbychat_brand_label' => ['nullable', 'string', 'max:120'],
                'marketing_site_enabled' => ['sometimes', 'boolean'],
            ],
            'marketing' => [
                'marketing_home_content' => ['required', 'array'],
            ],
            'privacy' => [
                'privacy_policy_content' => ['required', 'array'],
            ],
            default => null,
        };
    }

    /**
     * Project the AppSetting row to the frontend. Plaintext values for
     * non-sensitive fields, just `_set` booleans for sensitive ones —
     * the actual ciphertext / decrypted secret never leaves the server.
     *
     * @return array<string, mixed>
     */
    private function formValues(AppSetting $s): array
    {
        $branding = AppBranding::shared();

        return [
            // Stripe — public key is publishable, secret + webhook are sensitive.
            'stripe_key' => $s->stripe_key,
            'stripe_secret_set' => ! empty($s->stripe_secret),
            'stripe_webhook_secret_set' => ! empty($s->stripe_webhook_secret),
            'cashier_currency' => $s->cashier_currency,

            // Payment gateway enable flags — admin-toggleable. Default
            // shape: Stripe on, others off (matches schema defaults).
            'stripe_enabled' => (bool) $s->stripe_enabled,
            'paypal_enabled' => (bool) $s->paypal_enabled,
            'razorpay_enabled' => (bool) $s->razorpay_enabled,

            // PayPal — client_id is "publishable" (used by SDK on the
            // browser), client_secret + webhook_id are sensitive.
            'paypal_mode' => $s->paypal_mode ?: 'sandbox',
            'paypal_client_id' => $s->paypal_client_id,
            'paypal_client_secret_set' => ! empty($s->paypal_client_secret),
            'paypal_webhook_id' => $s->paypal_webhook_id,

            // Razorpay — key_id is publishable (Checkout.js needs it on the
            // browser), key_secret + webhook_secret are sensitive.
            'razorpay_key_id' => $s->razorpay_key_id,
            'razorpay_key_secret_set' => ! empty($s->razorpay_key_secret),
            'razorpay_webhook_secret_set' => ! empty($s->razorpay_webhook_secret),

            // Cloudflare — account id is public-ish, token is sensitive.
            'cloudflare_account_id' => $s->cloudflare_account_id,
            'cloudflare_api_token_set' => ! empty($s->cloudflare_api_token),
            'cloudflare_chat_model' => $s->cloudflare_chat_model,
            'cloudflare_embed_model' => $s->cloudflare_embed_model,
            'cloudflare_vectorize_index' => $s->cloudflare_vectorize_index,

            // OpenAI / OpenRouter — keys sensitive, models public.
            'openai_api_key_set' => ! empty($s->openai_api_key),
            'openai_chat_model' => $s->openai_chat_model,
            'openai_embed_model' => $s->openai_embed_model,
            'openrouter_api_key_set' => ! empty($s->openrouter_api_key),
            'openrouter_chat_model' => $s->openrouter_chat_model,

            // Provider routing.
            'llm_provider' => $s->llm_provider,
            'vector_provider' => $s->vector_provider,

            // Mail — password sensitive, everything else public.
            'mail_driver' => $s->mail_driver,
            'mail_host' => $s->mail_host,
            'mail_port' => $s->mail_port,
            'mail_encryption' => $s->mail_encryption,
            'mail_username' => $s->mail_username,
            'mail_password_set' => ! empty($s->mail_password),
            'mail_from_address' => $s->mail_from_address,
            'mail_from_name' => $s->mail_from_name,

            // Branding — fully public.
            'site_title' => $s->site_title ?: AppBranding::siteTitle(),
            'header_logo_url' => AppBranding::assetUrl($s->header_logo_path),
            'footer_logo_url' => AppBranding::assetUrl($s->footer_logo_path),
            'dashboard_logo_url' => AppBranding::assetUrl($s->dashboard_logo_path),
            'favicon_url' => AppBranding::assetUrl($s->favicon_path),
            'header_brand_display' => $branding['header_brand_display'],
            'footer_brand_display' => $branding['footer_brand_display'],
            'dashboard_brand_display' => $branding['dashboard_brand_display'],
            'orbychat_brand_url' => $s->orbychat_brand_url,
            'orbychat_brand_label' => $s->orbychat_brand_label,
            'marketing_site_enabled' => (bool) ($s->marketing_site_enabled ?? true),

            // Marketing homepage content — edited via a structured form.
            'marketing_home_content' => MarketingHomeContent::resolve($s->marketing_home_content),
            'privacy_policy_content' => PrivacyPolicyContent::resolve($s->privacy_policy_content),
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function prepareBrandingData(array $data, AppSetting $settings): array
    {
        if (array_key_exists('site_title', $data) && is_string($data['site_title'])) {
            $data['site_title'] = trim($data['site_title']);
        }

        foreach ([
            'header_logo' => 'header_logo_path',
            'footer_logo' => 'footer_logo_path',
            'dashboard_logo' => 'dashboard_logo_path',
            'favicon' => 'favicon_path',
        ] as $input => $column) {
            $data = $this->storeBrandingUpload($data, $settings, $input, $column);
        }

        return $data;
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function storeBrandingUpload(
        array $data,
        AppSetting $settings,
        string $input,
        string $column,
    ): array {
        $file = $data[$input] ?? null;

        if (! $file instanceof UploadedFile) {
            unset($data[$input]);

            return $data;
        }

        $disk = Storage::disk(AppBranding::disk());
        $currentPath = $settings->{$column};

        if (is_string($currentPath) && $currentPath !== '') {
            $disk->delete($currentPath);
        }

        $directory = $input === 'favicon' ? 'branding/favicon' : 'branding/'.str_replace('_logo', '', $input);

        $data[$column] = $file->storePublicly($directory, AppBranding::disk());
        unset($data[$input]);

        return $data;
    }

    /**
     * Summaries are intentionally lightweight — just enough to confirm
     * which provider is bound and which fields are populated. Secrets
     * are masked to last-4 only so the page is safe to screenshot.
     *
     * @return array<string, mixed>
     */
    private function mailSummary(): array
    {
        $driver = (string) config('mail.default');
        $mailer = (array) config("mail.mailers.{$driver}", []);

        return [
            'driver' => $driver,
            'host' => $mailer['host'] ?? null,
            'port' => $mailer['port'] ?? null,
            'encryption' => $mailer['encryption'] ?? null,
            'username' => isset($mailer['username']) ? $this->maskTail((string) $mailer['username']) : null,
            'from_address' => config('mail.from.address'),
            'from_name' => config('mail.from.name'),
            'configured' => ! empty($driver),
        ];
    }

    private function stripeSummary(): array
    {
        $key = (string) (config('cashier.key') ?: env('STRIPE_KEY', ''));
        $secret = (string) (config('cashier.secret') ?: env('STRIPE_SECRET', ''));
        $webhook = (string) (config('cashier.webhook.secret') ?: env('STRIPE_WEBHOOK_SECRET', ''));

        return [
            'public_key' => $key !== '' ? $this->maskTail($key) : null,
            'secret' => $secret !== '' ? $this->maskTail($secret) : null,
            'webhook_secret' => $webhook !== '' ? $this->maskTail($webhook) : null,
            'currency' => config('cashier.currency'),
            'enabled' => (bool) config('cashier.enabled', true),
            'configured' => $secret !== '',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function paypalSummary(): array
    {
        $clientId = (string) (config('services.paypal.client_id') ?: env('PAYPAL_CLIENT_ID', ''));
        $secret = (string) (config('services.paypal.client_secret') ?: env('PAYPAL_CLIENT_SECRET', ''));
        $webhookId = (string) (config('services.paypal.webhook_id') ?: env('PAYPAL_WEBHOOK_ID', ''));

        return [
            'mode' => (string) (config('services.paypal.mode') ?: 'sandbox'),
            'client_id' => $clientId !== '' ? $this->maskTail($clientId) : null,
            'client_secret' => $secret !== '' ? $this->maskTail($secret) : null,
            'webhook_id' => $webhookId !== '' ? $this->maskTail($webhookId) : null,
            'enabled' => (bool) config('services.paypal.enabled', false),
            'configured' => $clientId !== '' && $secret !== '',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function razorpaySummary(): array
    {
        $keyId = (string) (config('services.razorpay.key_id') ?: env('RAZORPAY_API_KEY', ''));
        $secret = (string) (config('services.razorpay.key_secret') ?: env('RAZORPAY_SECRET_KEY', ''));
        $webhookSecret = (string) (config('services.razorpay.webhook_secret') ?: env('RAZORPAY_WEBHOOK_SECRET', ''));

        return [
            'key_id' => $keyId !== '' ? $this->maskTail($keyId) : null,
            'key_secret' => $secret !== '' ? $this->maskTail($secret) : null,
            'webhook_secret' => $webhookSecret !== '' ? $this->maskTail($webhookSecret) : null,
            'enabled' => (bool) config('services.razorpay.enabled', false),
            'configured' => $keyId !== '' && $secret !== '',
        ];
    }

    private function llmSummary(): array
    {
        $provider = (string) (config('services.llm.provider') ?: env('LLM_PROVIDER', ''));
        $cfAccount = (string) (config('services.cloudflare.account_id') ?: env('CLOUDFLARE_ACCOUNT_ID', ''));
        $cfToken = (string) (config('services.cloudflare.api_token') ?: env('CLOUDFLARE_API_TOKEN', ''));
        $openAiKey = (string) (config('services.openai.key') ?: env('OPENAI_API_KEY', ''));
        $openRouterKey = (string) (config('services.openrouter.key') ?: env('OPENROUTER_API_KEY', ''));

        $resolved = match (true) {
            $provider === 'cloudflare' || ($provider === '' && $cfAccount !== '' && $cfToken !== '') => 'cloudflare',
            $provider === 'openrouter' => 'openrouter',
            $openAiKey !== '' => 'openai',
            default => 'fake',
        };

        return [
            'provider_env' => $provider !== '' ? $provider : '(auto)',
            'resolved' => $resolved,
            'cloudflare_account' => $cfAccount !== '' ? $this->maskTail($cfAccount) : null,
            'cloudflare_chat_model' => config('services.cloudflare.chat_model') ?: env('CLOUDFLARE_CHAT_MODEL', '@cf/meta/llama-3.3-70b-instruct-fp8-fast'),
            'openai_key' => $openAiKey !== '' ? $this->maskTail($openAiKey) : null,
            'openai_chat_model' => config('services.openai.chat_model') ?: env('OPENAI_CHAT_MODEL', 'gpt-4o-mini'),
            'openrouter_key' => $openRouterKey !== '' ? $this->maskTail($openRouterKey) : null,
            'openrouter_chat_model' => config('services.openrouter.chat_model') ?: env('OPENROUTER_CHAT_MODEL', 'meta-llama/llama-3.3-70b-instruct:free'),
            'configured' => $resolved !== 'fake',
        ];
    }

    private function cacheSummary(): array
    {
        return [
            'driver' => config('cache.default'),
            'redis_host' => env('REDIS_HOST'),
            'redis_port' => env('REDIS_PORT'),
            'configured' => true,
        ];
    }

    private function vectorSummary(): array
    {
        $provider = (string) (config('services.vector.provider') ?: env('VECTOR_PROVIDER', ''));
        $cfAccount = (string) (config('services.cloudflare.account_id') ?: env('CLOUDFLARE_ACCOUNT_ID', ''));
        $qdrantUrl = (string) env('QDRANT_URL', '');

        $resolved = match (true) {
            $provider === 'cloudflare' || ($provider === '' && $cfAccount !== '') => 'cloudflare-vectorize',
            $provider === 'qdrant' || ($provider === '' && $qdrantUrl !== '') => 'qdrant',
            default => 'fake',
        };

        return [
            'provider_env' => $provider !== '' ? $provider : '(auto)',
            'resolved' => $resolved,
            'vectorize_index' => config('services.cloudflare.vectorize_index') ?: env('CLOUDFLARE_VECTORIZE_INDEX', 'orbychat-chunks'),
            'qdrant_url' => $qdrantUrl !== '' ? $qdrantUrl : null,
            'configured' => $resolved !== 'fake',
        ];
    }

    private function reverbSummary(): array
    {
        return [
            'app_key' => env('REVERB_APP_KEY') ? $this->maskTail((string) env('REVERB_APP_KEY')) : null,
            'host' => env('REVERB_HOST', 'localhost'),
            'port' => (int) env('REVERB_PORT', 8080),
            'scheme' => env('REVERB_SCHEME', 'http'),
            'configured' => env('REVERB_APP_KEY') !== null && env('REVERB_APP_KEY') !== '',
        ];
    }

    private function maskTail(string $value): string
    {
        $len = mb_strlen($value);

        if ($len <= 6) {
            return str_repeat('•', $len);
        }

        return str_repeat('•', max(4, $len - 4)).mb_substr($value, -4);
    }

    private function ok(string $message): JsonResponse
    {
        return response()->json(['ok' => true, 'message' => $message]);
    }

    private function fail(string $message): JsonResponse
    {
        return response()->json(['ok' => false, 'message' => $message], 200);
    }
}
