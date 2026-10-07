<?php

namespace App\Providers;

use App\Models\Workspace;
use App\Services\Billing\PayPalClient;
use App\Services\Billing\RazorpayClient;
use App\Services\Changelog\ChangelogStore;
use App\Services\Crawl\BrowserlessClient;
use App\Services\Crawl\CloudflareBrowserClient;
use App\Services\Crawl\Contracts\Crawler;
use App\Services\Crawl\PlainHttpCrawler;
use App\Services\Integrations\Google\GoogleClient;
use App\Services\Integrations\Notion\NotionClient;
use App\Services\Llm\Contracts\OpenAiClient;
use App\Services\Llm\Fakes\FakeOpenAi;
use App\Services\Llm\OpenAiHttpClient;
use App\Services\Llm\WorkersAiClient;
use App\Services\Parsers\ParserRegistry;
use App\Services\Rag\CloudflareReranker;
use App\Services\Rag\Contracts\Reranker;
use App\Services\Rag\Fakes\FakeReranker;
use App\Services\Tools\ToolRegistry;
use App\Services\Vector\Contracts\QdrantClient;
use App\Services\Vector\Fakes\FakeQdrant;
use App\Services\Vector\QdrantHttpClient;
use App\Services\Vector\VectorizeClient;
use App\Services\Vertical\VerticalPresetRegistry;
use App\Services\Widget\WidgetJwt;
use App\Support\AppBranding;
use App\Support\CurrentWorkspace;
use Carbon\CarbonImmutable;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Laravel\Cashier\Cashier;
use Stripe\StripeClient;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(CurrentWorkspace::class);

        // File-backed changelog store. Reads/writes
        // storage/app/private/changelog-entries.json + auto-seeds
        // from database/changelog-entries/v*.md on first read. The
        // bootstrap dir is config-driven so tests can disable
        // seeding by setting `changelog.bootstrap_dir` to null in
        // their setup — it survives the HTTP boundary that a
        // container `instance()` rebinding can't.
        $this->app->scoped(ChangelogStore::class, function () {
            $configured = config('changelog.bootstrap_dir', '__default__');
            $bootstrapDir = $configured === '__default__'
                ? base_path('database/changelog-entries')
                : $configured;

            return new ChangelogStore(
                disk: 'local',
                bootstrapDir: $bootstrapDir,
            );
        });

        // Single Stripe SDK instance per request — Cashier uses its own
        // internal client too, but we lean on this one for product/price
        // provisioning where we want explicit control.
        // The SDK rejects an empty api_key at construction, so when Stripe
        // isn't configured yet we hand it a harmless placeholder; any real
        // network call would 401 long before we reach this client.
        $this->app->singleton(StripeClient::class, function () {
            $secret = (string) (config('cashier.secret') ?? env('STRIPE_SECRET', ''));

            return new StripeClient([
                'api_key' => $secret !== '' ? $secret : 'sk_unconfigured_placeholder',
                'stripe_version' => '2024-12-18.acacia',
            ]);
        });

        // PayPal + Razorpay clients are bound as transient (`bind`, not
        // `singleton`) so a credentials rotation in the admin UI takes
        // effect on the next resolve without needing an Octane reload.
        $this->app->bind(PayPalClient::class, fn () => PayPalClient::fromConfig());
        $this->app->bind(RazorpayClient::class, fn () => RazorpayClient::fromConfig());

        $this->app->singleton(OpenAiClient::class, function () {
            if (app()->runningUnitTests()) {
                return new FakeOpenAi;
            }

            $provider = (string) config('services.llm.provider', env('LLM_PROVIDER', ''));

            // Cloudflare Workers AI (preferred). Read from config first so
            // AppSettingsOverrideServiceProvider's DB-backed values take
            // effect; fall through to env() for fresh installs.
            $cfAccount = (string) (config('services.cloudflare.account_id') ?: env('CLOUDFLARE_ACCOUNT_ID', ''));
            $cfToken = (string) (config('services.cloudflare.api_token') ?: env('CLOUDFLARE_API_TOKEN', ''));
            if ($provider === 'cloudflare' || ($provider === '' && $cfAccount !== '' && $cfToken !== '')) {
                return new WorkersAiClient(
                    accountId: $cfAccount,
                    apiToken: $cfToken,
                    chatModel: (string) (config('services.cloudflare.chat_model') ?: env('CLOUDFLARE_CHAT_MODEL', '@cf/meta/llama-3.3-70b-instruct-fp8-fast')),
                    embedModel: (string) (config('services.cloudflare.embed_model') ?: env('CLOUDFLARE_EMBED_MODEL', '@cf/baai/bge-base-en-v1.5')),
                    aiGatewayUrl: env('CLOUDFLARE_AI_GATEWAY_URL') ?: null,
                );
            }

            // OpenRouter (free models available — Llama 3.3 70B free,
            // Mistral 7B free, etc). OpenAI-compatible REST surface so
            // we can reuse OpenAiHttpClient by pointing baseUri at
            // OpenRouter and adding their ranking headers. Embeddings
            // aren't on the free tier — IndexDocumentJob falls back to
            // OPENAI_API_KEY when set.
            //
            // Only auto-binds when LLM_PROVIDER=openrouter is explicit;
            // we don't want a stale OPENROUTER_API_KEY in .env to
            // silently take precedence over a working Cloudflare /
            // OpenAI setup.
            $openRouterKey = (string) (config('services.openrouter.key') ?: env('OPENROUTER_API_KEY', ''));
            if ($provider === 'openrouter') {
                if ($openRouterKey === '') {
                    return new FakeOpenAi;
                }

                return new OpenAiHttpClient(
                    apiKey: $openRouterKey,
                    chatModel: (string) (config('services.openrouter.chat_model') ?: env('OPENROUTER_CHAT_MODEL', 'meta-llama/llama-3.3-70b-instruct:free')),
                    embedModel: (string) env('OPENROUTER_EMBED_MODEL', 'text-embedding-3-small'),
                    baseUri: 'https://openrouter.ai/api/v1',
                    extraHeaders: [
                        'HTTP-Referer' => (string) env('APP_URL', 'https://orby.chat'),
                        'X-Title' => AppBranding::siteTitle(),
                    ],
                );
            }

            // OpenAI (fallback / quality bump)
            $openAiKey = (string) config('services.openai.key', env('OPENAI_API_KEY', ''));
            if ($openAiKey !== '') {
                return new OpenAiHttpClient(
                    apiKey: $openAiKey,
                    chatModel: (string) config('services.openai.chat_model', env('OPENAI_CHAT_MODEL', 'gpt-4o-mini')),
                    embedModel: (string) config('services.openai.embed_model', env('OPENAI_EMBED_MODEL', 'text-embedding-3-small')),
                );
            }

            // Nothing configured → fake (so dev never fails outright)
            return new FakeOpenAi;
        });

        // Embedding fallback — resolved by IndexDocumentJob when the
        // primary embed call (usually Workers AI) fails. We default to
        // OpenAI when OPENAI_API_KEY is set; otherwise no fallback and
        // the primary error propagates as before.
        $this->app->bind('embedding.fallback', function () {
            if (app()->runningUnitTests()) {
                return null;
            }
            $key = (string) (config('services.openai.key') ?? env('OPENAI_API_KEY', ''));
            if ($key === '') {
                return null;
            }

            return new OpenAiHttpClient(
                apiKey: $key,
                chatModel: (string) (config('services.openai.chat_model') ?? env('OPENAI_CHAT_MODEL', 'gpt-4o-mini')),
                embedModel: (string) (config('services.openai.embed_model') ?? env('OPENAI_EMBED_MODEL', 'text-embedding-3-small')),
            );
        });

        $this->app->singleton(QdrantClient::class, function () {
            if (app()->runningUnitTests()) {
                return new FakeQdrant;
            }

            $provider = (string) config('services.vector.provider', env('VECTOR_PROVIDER', ''));

            // Cloudflare Vectorize (preferred)
            $cfAccount = (string) env('CLOUDFLARE_ACCOUNT_ID', '');
            $cfToken = (string) env('CLOUDFLARE_API_TOKEN', '');
            if ($provider === 'cloudflare' || ($provider === '' && $cfAccount !== '' && $cfToken !== '')) {
                return VectorizeClient::default($cfAccount, $cfToken);
            }

            // Qdrant (fallback)
            $url = (string) config('services.qdrant.url', env('QDRANT_URL', ''));
            if ($url !== '') {
                return new QdrantHttpClient(
                    baseUrl: $url,
                    apiKey: env('QDRANT_API_KEY') ?: null,
                );
            }

            return new FakeQdrant;
        });

        $this->app->singleton(Crawler::class, function () {
            // Cloudflare Browser Rendering (preferred when CF keys exist)
            $cfAccount = (string) env('CLOUDFLARE_ACCOUNT_ID', '');
            $cfToken = (string) env('CLOUDFLARE_API_TOKEN', '');
            if ($cfAccount !== '' && $cfToken !== '' && env('CLOUDFLARE_BROWSER_RENDERING', true)) {
                return CloudflareBrowserClient::default($cfAccount, $cfToken);
            }

            // Browserless (legacy)
            $browserlessToken = (string) config('services.browserless.token', env('BROWSERLESS_TOKEN', ''));
            if ($browserlessToken !== '') {
                return BrowserlessClient::default();
            }

            // Plain HTTP — free, works for server-rendered sites
            return new PlainHttpCrawler;
        });

        $this->app->singleton(Reranker::class, function () {
            if (app()->runningUnitTests()) {
                return new FakeReranker;
            }

            $cfAccount = (string) env('CLOUDFLARE_ACCOUNT_ID', '');
            $cfToken = (string) env('CLOUDFLARE_API_TOKEN', '');
            if ($cfAccount !== '' && $cfToken !== '' && env('RAG_RERANK_ENABLED', true)) {
                return CloudflareReranker::default($cfAccount, $cfToken);
            }

            // No CF keys → passthrough, retrieval still works.
            return new FakeReranker;
        });

        $this->app->singleton(NotionClient::class, fn () => NotionClient::default(
            (string) config('services.notion.client_id', ''),
            (string) config('services.notion.client_secret', ''),
        ));

        $this->app->singleton(GoogleClient::class, fn () => GoogleClient::default(
            (string) config('services.google.client_id', ''),
            (string) config('services.google.client_secret', ''),
        ));

        $this->app->singleton(WidgetJwt::class, fn () => new WidgetJwt(
            secret: (string) config('services.widget.jwt_secret'),
            ttlMinutes: (int) config('services.widget.jwt_ttl_minutes', 60),
        ));

        $this->app->singleton(ParserRegistry::class);

        // Vertical preset registry — pure in-memory lookup table of preset
        // classes. `scoped` keeps it cheap under Octane: built once per
        // worker, reused per request, no transitive request-scoped state.
        $this->app->scoped(VerticalPresetRegistry::class, fn () => new VerticalPresetRegistry);

        // Tool registry depends on the preset registry to resolve which
        // tools an agent's capabilities allow. `scoped` for the same
        // Octane reasons.
        $this->app->scoped(ToolRegistry::class, fn ($app) => new ToolRegistry(
            $app->make(VerticalPresetRegistry::class),
            $app->make(\App\Services\Integrations\EcommerceActionService::class),
        ));
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureRateLimiting();

        // Workspace is the billing entity, not User. One Stripe customer per
        // workspace, so the same person can own/admin multiple workspaces
        // each with its own subscription and plan.
        Cashier::useCustomerModel(Workspace::class);

        // We register our own webhook route at /billing/webhook (extending
        // Cashier's controller). Suppress Cashier's default route under
        // /stripe/* to avoid two endpoints handling the same payload.
        Cashier::ignoreRoutes();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }

    /**
     * Public widget routes need their own throttles. These endpoints are hit
     * from third-party sites, so we segment by IP for init and by widget token
     * for follow-up session calls to avoid one noisy visitor suppressing every
     * other active conversation.
     */
    protected function configureRateLimiting(): void
    {
        RateLimiter::for('widget-init', function (Request $request) {
            $ip = $request->ip() ?? 'unknown';
            $agentId = Str::lower((string) $request->input('agent_id', 'missing-agent'));

            return [
                Limit::perMinute(60)
                    ->by("widget-init:minute:{$ip}:{$agentId}")
                    ->response($this->widgetThrottleResponse('Too many widget initialization requests. Please try again shortly.')),
                Limit::perHour(600)
                    ->by("widget-init:hour:{$ip}")
                    ->response($this->widgetThrottleResponse('Too many widget initialization requests. Please try again later.')),
            ];
        });

        RateLimiter::for('widget-session', function (Request $request) {
            $ip = $request->ip() ?? 'unknown';
            $tokenKey = $this->widgetTokenThrottleKey($request);

            return [
                Limit::perMinute(30)
                    ->by("widget-session:token:{$tokenKey}")
                    ->response($this->widgetThrottleResponse('Too many widget requests for this conversation. Please slow down.')),
                Limit::perMinute(120)
                    ->by("widget-session:ip:{$ip}")
                    ->response($this->widgetThrottleResponse('Too many widget requests from this IP. Please try again shortly.')),
            ];
        });

        RateLimiter::for('widget-leads', function (Request $request) {
            $ip = $request->ip() ?? 'unknown';
            $tokenKey = $this->widgetTokenThrottleKey($request);

            return [
                Limit::perMinute(5)
                    ->by("widget-leads:token:{$tokenKey}")
                    ->response($this->widgetThrottleResponse('Too many lead submissions. Please wait before trying again.')),
                Limit::perHour(20)
                    ->by("widget-leads:ip:{$ip}")
                    ->response($this->widgetThrottleResponse('Too many lead submissions from this IP. Please try again later.')),
            ];
        });
    }

    /**
     * @return \Closure(Request, array<string, string>): JsonResponse
     */
    protected function widgetThrottleResponse(string $message): \Closure
    {
        return fn (Request $request, array $headers) => response()->json([
            'error' => [
                'code' => 'rate_limited',
                'message' => $message,
            ],
        ], 429, $headers);
    }

    protected function widgetTokenThrottleKey(Request $request): string
    {
        $token = $request->bearerToken() ?? $request->header('X-Widget-Token');

        if (! is_string($token) || $token === '') {
            return 'missing-token';
        }

        return substr(hash('sha256', $token), 0, 20);
    }
}
