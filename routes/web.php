<?php

use App\Http\Controllers\Admin\AgentController;
use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\BehaviorRuleController;
use App\Http\Controllers\Admin\BillingController;
use App\Http\Controllers\Admin\ConversationController;
use App\Http\Controllers\Admin\ConversationTakeoverController;
use App\Http\Controllers\Admin\CtaRuleController;
use App\Http\Controllers\Admin\CuratedAnswerController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ExperimentController;
use App\Http\Controllers\Admin\GoogleOAuthController;
use App\Http\Controllers\Admin\IntegrationController;
use App\Http\Controllers\Admin\InvitationController;
use App\Http\Controllers\Admin\KnowledgeController;
use App\Http\Controllers\Admin\LeadController;
use App\Http\Controllers\Admin\LeadFeedController;
use App\Http\Controllers\Admin\MemberController;
use App\Http\Controllers\Admin\NotionOAuthController;
use App\Http\Controllers\Admin\OnboardingController;
use App\Http\Controllers\Admin\Platform\AgentController as PlatformAgentController;
use App\Http\Controllers\Admin\Platform\ConversationController as PlatformConversationController;
use App\Http\Controllers\Admin\Platform\DashboardController as PlatformDashboardController;
use App\Http\Controllers\Admin\Platform\ImpersonateController;
use App\Http\Controllers\Admin\Platform\JobController as PlatformJobController;
use App\Http\Controllers\Admin\Platform\KanbanBoardController;
use App\Http\Controllers\Admin\Platform\LeadController as PlatformLeadController;
use App\Http\Controllers\Admin\Platform\PlanController as PlatformPlanController;
use App\Http\Controllers\Admin\Platform\SearchController as PlatformSearchController;
use App\Http\Controllers\Admin\Platform\SubscriptionController;
use App\Http\Controllers\Admin\Platform\UsageController as PlatformUsageController;
use App\Http\Controllers\Admin\Platform\UserController as PlatformUserController;
use App\Http\Controllers\Admin\Platform\WorkspaceController as PlatformWorkspaceController;
use App\Http\Controllers\Admin\PlaygroundController;
use App\Http\Controllers\Admin\SearchController;
use App\Http\Controllers\Admin\SourceController;
use App\Http\Controllers\Admin\UploadController;
use App\Http\Controllers\Admin\Vertical\ApplyController;
use App\Http\Controllers\Admin\Vertical\DetectController;
use App\Http\Controllers\Admin\CalendarController;
use App\Http\Controllers\Admin\WorkflowController;
use App\Http\Controllers\Admin\WorkspaceSelectController;
use App\Http\Controllers\Billing\CheckoutController;
use App\Http\Controllers\Billing\PayPalWebhookController;
use App\Http\Controllers\Billing\RazorpayWebhookController;
use App\Http\Controllers\Billing\WebhookController as BillingWebhookController;
use App\Http\Controllers\ChangelogController;
use App\Http\Controllers\ChangelogSeenController;
use App\Http\Controllers\DocumentationController;
use App\Http\Controllers\MarketingController;
use App\Http\Controllers\SeoController;
use App\Http\Middleware\RedirectMarketingWhenDisabled;
use App\Http\Resources\AgentResource;
use App\Models\Agent;
use App\Models\ChangelogEntry;
use App\Services\Vertical\VerticalPresetRegistry;
use Illuminate\Support\Facades\Route;

// Marketing site — React/Inertia landing page plus simple Blade
// subpages. The `marketing.public` middleware redirects to /login
// when the platform admin has disabled the public marketing site
// (Settings → Branding → "Public marketing site" off). /privacy
// and /terms stay accessible always — they're required reading from
// the auth flows.
Route::middleware(RedirectMarketingWhenDisabled::class)->group(function () {
    Route::get('/', [MarketingController::class, 'home'])->name('home');
    Route::get('/pricing', [MarketingController::class, 'pricing'])->name('marketing.pricing');
    Route::get('/how-it-works', [MarketingController::class, 'howItWorks'])->name('marketing.how-it-works');
    Route::get('/integrations', [MarketingController::class, 'integrations'])->name('marketing.integrations');
    Route::get('/solutions', [MarketingController::class, 'solutionsIndex'])->name('marketing.solutions.index');
    Route::get('/solutions/{vertical}', [MarketingController::class, 'solution'])->name('marketing.solutions');
});

Route::get('/locale/{locale}', function (string $locale) {
    if (! in_array($locale, ['en', 'tr'])) {
        abort(400);
    }

    session()->put('locale', $locale);
    session()->save();

    return back();
})->name('locale.change');

// Always public regardless of the marketing toggle — /privacy and
// /terms are linked from the auth screens and have to stay
// reachable.
Route::get('/privacy', [MarketingController::class, 'privacy'])->name('marketing.privacy');
Route::get('/terms', [MarketingController::class, 'terms'])->name('marketing.terms');
Route::post('/marketing/start', [MarketingController::class, 'start'])->name('marketing.start');

// SEO — sitemap + robots.txt. Both cached for an hour at the
// controller level so freshly-published changelog versions show up
// within the cache window without us paying recompute cost on every
// crawler visit. SeoController honours the marketing-site-enabled
// flag — sitemap returns empty + robots disallows everything when
// the install is private.
Route::get('/sitemap.xml', [SeoController::class, 'sitemap'])->name('seo.sitemap');
Route::get('/robots.txt', [SeoController::class, 'robots'])->name('seo.robots');


// Public invitation landing (login required to accept).
Route::get('invitations/{token}', [InvitationController::class, 'show'])->name('invitations.show');
Route::post('invitations/{token}/accept', [InvitationController::class, 'accept'])
    ->middleware('auth')
    ->name('invitations.accept');

// Payment-gateway webhooks (no CSRF, no auth). Each gateway gets its own
// signed endpoint — Stripe is preserved at the historical /billing/webhook
// path so already-configured Stripe dashboards don't need re-pointing.
Route::post('billing/webhook', [BillingWebhookController::class, 'handleWebhook'])->name('billing.webhook');
Route::post('billing/webhook/paypal', PayPalWebhookController::class)->name('billing.webhook.paypal');
Route::post('billing/webhook/razorpay', RazorpayWebhookController::class)->name('billing.webhook.razorpay');

Route::middleware(['auth', 'verified'])->group(function () {
    // ───────────────────────────────────────────────────────────
    // CUSTOMER surface — every route below this line is a tenant
    // view. Super-admins get bounced to /admin by redirect.super_admin
    // (their proper home). They impersonate to see customer views.
    // ───────────────────────────────────────────────────────────
    Route::middleware('redirect.super_admin')->group(function () {

        // No-workspace-OK routes — these handle the empty state themselves
        // or are how the user GETS a workspace (workspace switcher / signup).
        Route::get('dashboard', [DashboardController::class, 'show'])->name('dashboard');
        Route::get('onboarding', [OnboardingController::class, 'show'])->name('onboarding');
        Route::get('api/v1/agents/{agent}/onboarding-status', [OnboardingController::class, 'status'])->name('onboarding.status');

        Route::post('workspaces/{workspace}/select', [WorkspaceSelectController::class, 'store'])
            ->name('workspaces.select');

        // Everything below requires a current workspace. Without one, the
        // middleware redirects to /dashboard with a flash explaining why.
        Route::middleware('workspace.require')->group(function () {

            // Live human takeover
            Route::post('app/conversations/{conversation}/claim', [ConversationTakeoverController::class, 'claim'])->name('conversations.claim');
            Route::post('app/conversations/{conversation}/release', [ConversationTakeoverController::class, 'release'])->name('conversations.release');
            Route::post('app/conversations/{conversation}/reply', [ConversationTakeoverController::class, 'reply'])->name('conversations.reply');

            Route::get('app/integrations', [IntegrationController::class, 'index'])->name('integrations.index');
            Route::post('app/integrations/slack', [IntegrationController::class, 'storeSlack'])->name('integrations.slack.store');
            Route::post('app/integrations/shopify', [IntegrationController::class, 'storeShopify'])->name('integrations.shopify.store');
            Route::post('app/integrations/ikas', [IntegrationController::class, 'storeIkas'])->name('integrations.ikas.store');
            Route::get('app/integrations/wordpress/download', [IntegrationController::class, 'downloadWordPressPlugin'])->name('integrations.wordpress.download');
            Route::post('app/integrations/webhooks', [IntegrationController::class, 'storeWebhook'])->name('integrations.webhooks.store');
            Route::patch('app/integrations/webhooks/{webhookSubscription}', [IntegrationController::class, 'updateWebhook'])->name('integrations.webhooks.update');
            Route::delete('app/integrations/webhooks/{webhookSubscription}', [IntegrationController::class, 'destroyWebhook'])->name('integrations.webhooks.destroy');
            Route::delete('app/integrations/{integration}', [IntegrationController::class, 'destroy'])->name('integrations.destroy');

            Route::get('app/members', [MemberController::class, 'index'])->name('members.index');
            Route::post('app/members', [MemberController::class, 'store'])->name('members.store');
            Route::delete('app/members/{member}', [MemberController::class, 'destroy'])->name('members.destroy');

            // Agents CRUD
            Route::get('app/agents', [AgentController::class, 'index'])->name('agents.index');
            Route::get('app/agents/create', [AgentController::class, 'create'])->name('agents.create');
            Route::post('app/agents', [AgentController::class, 'store'])->name('agents.store');
            Route::get('app/agents/{agent}', [AgentController::class, 'show'])->name('agents.show');
            Route::get('app/agents/{agent}/settings', [AgentController::class, 'edit'])->name('agents.edit');
            Route::get('app/agents/{agent}/customize', function (Agent $agent) {
                request()->user()->can('update', $agent) || abort(403);

                return inertia('app/agents/customize', [
                    'agent' => (new AgentResource($agent))->resolve(request()),
                ]);
            })->name('agents.customize');

            // Vertical (site-type) preset — detect, view, apply.
            // Inline closure for the GET (matches the customize precedent).
            // POST endpoints are dedicated controllers because they have
            // logic (HTTP fetch, preset merge) worth isolating + testing.
            Route::get('app/agents/{agent}/vertical', function (Agent $agent) {
                request()->user()->can('view', $agent) || abort(403);

                $registry = app(VerticalPresetRegistry::class);
                $presetPreview = [];
                foreach ($registry->all() as $slug => $preset) {
                    $presetPreview[$slug] = [
                        'slug' => $preset->slug(),
                        'label' => $preset->label(),
                        'short_description' => $preset->shortDescription(),
                        'starter_prompts' => $preset->starterPrompts(),
                        'capabilities' => $preset->capabilities(),
                        'system_prompt_fragment' => $preset->systemPromptFragment($agent),
                        'launcher_label' => $preset->launcherLabel(),
                        'max_chars' => $preset->maxChars(),
                    ];
                }

                return inertia('app/agents/vertical', [
                    'agent' => (new AgentResource($agent))->resolve(request()),
                    'preset_preview' => $presetPreview,
                ]);
            })->name('agents.vertical');
            Route::post('app/agents/{agent}/vertical/detect', DetectController::class)
                ->name('agents.vertical.detect');
            Route::post('app/agents/{agent}/vertical/apply', ApplyController::class)
                ->name('agents.vertical.apply');

            Route::get('app/agents/{agent}/prompts', function (Agent $agent) {
                request()->user()->can('update', $agent) || abort(403);

                return inertia('app/agents/prompts', [
                    'agent' => (new AgentResource($agent))->resolve(request()),
                ]);
            })->name('agents.prompts');

            Route::patch('app/agents/{agent}', [AgentController::class, 'update'])->name('agents.update');
            Route::delete('app/agents/{agent}', [AgentController::class, 'destroy'])->name('agents.destroy');
            Route::post('app/agents/{agent}/publish', [AgentController::class, 'publish'])->name('agents.publish');
            Route::post('app/agents/{agent}/rollback', [AgentController::class, 'rollback'])->name('agents.rollback');

            // Curated answers / behavior rules / CTA rules
            Route::get('app/agents/{agent}/curated', [CuratedAnswerController::class, 'index'])->name('agents.curated.index');
            Route::post('app/agents/{agent}/curated', [CuratedAnswerController::class, 'store'])->name('agents.curated.store');
            Route::patch('app/curated-answers/{curatedAnswer}', [CuratedAnswerController::class, 'update'])->name('curated.update');
            Route::post('app/curated-answers/{curatedAnswer}/approve', [CuratedAnswerController::class, 'approve'])->name('curated.approve');
            Route::delete('app/curated-answers/{curatedAnswer}', [CuratedAnswerController::class, 'destroy'])->name('curated.destroy');
            Route::post('app/agents/{agent}/curated/reorder', [CuratedAnswerController::class, 'reorder'])->name('curated.reorder');

            Route::get('app/agents/{agent}/behavior', [BehaviorRuleController::class, 'index'])->name('agents.behavior.index');
            Route::post('app/agents/{agent}/behavior', [BehaviorRuleController::class, 'store'])->name('agents.behavior.store');
            Route::patch('app/behavior-rules/{behaviorRule}', [BehaviorRuleController::class, 'update'])->name('behavior.update');
            Route::delete('app/behavior-rules/{behaviorRule}', [BehaviorRuleController::class, 'destroy'])->name('behavior.destroy');

            Route::get('app/agents/{agent}/ctas', [CtaRuleController::class, 'index'])->name('agents.ctas.index');
            Route::post('app/agents/{agent}/ctas', [CtaRuleController::class, 'store'])->name('agents.ctas.store');
            Route::patch('app/cta-rules/{ctaRule}', [CtaRuleController::class, 'update'])->name('cta.update');
            Route::delete('app/cta-rules/{ctaRule}', [CtaRuleController::class, 'destroy'])->name('cta.destroy');

            // MCP (Model Context Protocol) integration — per-agent
            // tool grants + workspace-wide server connections.
            Route::get('app/agents/{agent}/mcp', [\App\Http\Controllers\Admin\Mcp\McpServerController::class, 'index'])->name('agents.mcp.index');
            Route::post('app/agents/{agent}/mcp', [\App\Http\Controllers\Admin\Mcp\McpServerController::class, 'store'])->name('agents.mcp.store');
            Route::delete('app/agents/{agent}/mcp/{mcpServer}', [\App\Http\Controllers\Admin\Mcp\McpServerController::class, 'destroy'])->name('agents.mcp.destroy');
            Route::post('app/agents/{agent}/mcp/{mcpServer}/test', [\App\Http\Controllers\Admin\Mcp\McpServerController::class, 'testConnection'])->name('agents.mcp.test');
            Route::post('app/agents/{agent}/mcp/{mcpServer}/refresh', [\App\Http\Controllers\Admin\Mcp\McpServerController::class, 'refreshTools'])->name('agents.mcp.refresh');
            Route::get('app/agents/{agent}/mcp/{mcpServer}/tools', [\App\Http\Controllers\Admin\Mcp\McpServerController::class, 'tools'])->name('agents.mcp.tools');
            Route::patch('app/agents/{agent}/mcp/{mcpServer}/tools', [\App\Http\Controllers\Admin\Mcp\McpServerController::class, 'bulkUpdateGrants'])->name('agents.mcp.tools.bulk');
            Route::get('app/agents/{agent}/mcp/{mcpServer}/activity', [\App\Http\Controllers\Admin\Mcp\McpActivityController::class, 'show'])->name('agents.mcp.activity');

            // Workspace-wide quick search — agents, conversations, leads
            Route::get('app/search', SearchController::class)->name('search');

            // Knowledge — what the AI actually has indexed (per agent)
            Route::get('app/agents/{agent}/knowledge', [KnowledgeController::class, 'index'])->name('agents.knowledge.index');
            Route::get('app/agents/{agent}/products', function (Agent $agent) {
                request()->user()->can('view', $agent) || abort(403);

                return inertia('app/agents/products', [
                    'agent' => (new \App\Http\Resources\AgentResource($agent))->resolve(request()),
                ]);
            })->name('agents.products');
            Route::post('app/documents/{document}/reindex', [KnowledgeController::class, 'reindex'])->name('documents.reindex');

            // Conversations log — every visitor session for an agent
            Route::get('app/conversations', [ConversationController::class, 'workspaceIndex'])->name('conversations.index');
            Route::get('app/calendar', [CalendarController::class, 'index'])->name('calendar.index');
            Route::post('app/calendar', [CalendarController::class, 'store'])->name('calendar.store');
            Route::post('app/calendar/settings', [CalendarController::class, 'updateSettings'])->name('calendar.settings.update');
            Route::post('app/calendar/{appointment}/confirm', [CalendarController::class, 'confirm'])->name('calendar.confirm');
            Route::post('app/calendar/{appointment}/cancel', [CalendarController::class, 'cancel'])->name('calendar.cancel');
            Route::get('app/agents/{agent}/conversations', [ConversationController::class, 'index'])->name('agents.conversations.index');
            Route::get('app/conversations/{conversation}', [ConversationController::class, 'show'])->name('conversations.show');

            // Knowledge sources (URL/sitemap crawl)
            Route::get('app/agents/{agent}/sources', [SourceController::class, 'index'])->name('agents.sources.index');
            Route::post('app/agents/{agent}/sources', [SourceController::class, 'store'])->name('agents.sources.store');
            Route::delete('app/sources/{source}', [SourceController::class, 'destroy'])->name('sources.destroy');
            Route::post('app/sources/{source}/reindex', [SourceController::class, 'reindex'])->name('sources.reindex');
            Route::get('app/sources/{source}/preview', [SourceController::class, 'preview'])->name('sources.preview');
            Route::post('app/agents/{agent}/sources/discover', [SourceController::class, 'discover'])->name('agents.sources.discover');
            Route::post('app/agents/{agent}/sources/bulk', [SourceController::class, 'bulkStore'])->name('agents.sources.bulk');
            Route::post('app/agents/{agent}/sources/text', [SourceController::class, 'storeText'])->name('agents.sources.text');
            Route::post('app/agents/{agent}/sources/notion', [SourceController::class, 'storeNotion'])->name('agents.sources.notion');
            Route::post('app/agents/{agent}/sources/google-doc', [SourceController::class, 'storeGoogleDoc'])->name('agents.sources.googleDoc');
            Route::get('app/agents/{agent}/leads', [LeadController::class, 'agentIndex'])->name('agents.leads.index');

            // OAuth — Notion
            Route::get('app/oauth/notion/connect', [NotionOAuthController::class, 'start'])->name('oauth.notion.start');
            Route::get('app/oauth/notion/callback', [NotionOAuthController::class, 'callback'])->name('oauth.notion.callback');

            // OAuth — Google
            Route::get('app/oauth/google/connect', [GoogleOAuthController::class, 'start'])->name('oauth.google.start');
            Route::get('app/oauth/google/callback', [GoogleOAuthController::class, 'callback'])->name('oauth.google.callback');

            // File uploads (PDF/DOCX/CSV/MD/TXT)
            Route::post('app/agents/{agent}/uploads', [UploadController::class, 'store'])->name('agents.uploads.store');

            // Playground
            Route::get('app/agents/{agent}/playground', [PlaygroundController::class, 'show'])->name('agents.playground');
            Route::post('app/agents/{agent}/playground', [PlaygroundController::class, 'send'])->name('agents.playground.send');

            // A/B testing experiments
            Route::get('app/agents/{agent}/experiments', [ExperimentController::class, 'index'])->name('agents.experiments.index');
            Route::post('app/agents/{agent}/experiments', [ExperimentController::class, 'store'])->name('agents.experiments.store');
            Route::post('app/experiments/{experiment}/start', [ExperimentController::class, 'start'])->name('experiments.start');
            Route::post('app/experiments/{experiment}/stop', [ExperimentController::class, 'stop'])->name('experiments.stop');
            Route::delete('app/experiments/{experiment}', [ExperimentController::class, 'destroy'])->name('experiments.destroy');

            // Inbox
            Route::get('app/inbox', [LeadController::class, 'index'])->name('inbox.index');
            Route::get('app/inbox/{lead}', [LeadController::class, 'show'])->name('inbox.show');
            Route::patch('app/inbox/{lead}', [LeadController::class, 'update'])->name('inbox.update');

            // Tiny JSON poll endpoint hit by the admin shell every ~30s
            // so a workspace member sees a sonner toast + (with permission)
            // a native browser notification the moment a lead lands.
            Route::get('app/leads/feed', LeadFeedController::class)
                ->name('leads.feed');

            // Workflow builder. Phase 1 shipped linear keyword-triggered
            // sequences of message / question / escalate steps. The runtime
            // engine in App\Services\Workflows\WorkflowEngine consumes the
            // exact JSON shape the form posts (`definition.steps`).
            Route::get('app/workflows', [WorkflowController::class, 'index'])->name('workflows.index');
            Route::get('app/workflows/create', [WorkflowController::class, 'create'])->name('workflows.create');
            Route::post('app/workflows', [WorkflowController::class, 'store'])->name('workflows.store');
            Route::get('app/workflows/{workflow}/edit', [WorkflowController::class, 'edit'])->name('workflows.edit');
            Route::get('app/workflows/{workflow}/canvas', [WorkflowController::class, 'canvas'])->name('workflows.canvas');
            Route::patch('app/workflows/{workflow}', [WorkflowController::class, 'update'])->name('workflows.update');
            Route::delete('app/workflows/{workflow}', [WorkflowController::class, 'destroy'])->name('workflows.destroy');

            // Analytics
            Route::get('app/analytics', [AnalyticsController::class, 'overview'])->name('analytics.overview');
            Route::get('app/analytics/content-gaps', [AnalyticsController::class, 'contentGaps'])->name('analytics.content-gaps');

            // Billing
            Route::get('app/billing', [BillingController::class, 'show'])->name('billing.show');
            Route::post('billing/checkout', CheckoutController::class)->name('billing.checkout');
            Route::get('billing/portal', [BillingController::class, 'portal'])->name('billing.portal');

        }); // workspace.require group

    }); // redirect.super_admin (customer surface) group

    // ───────────────────────────────────────────────────────────
    // Platform admin (super_admin only). 404 for everyone else.
    // ───────────────────────────────────────────────────────────
    Route::middleware('super_admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', PlatformDashboardController::class)->name('dashboard');

        Route::get('workspaces', [PlatformWorkspaceController::class, 'index'])->name('workspaces.index');
        Route::get('workspaces/{workspace}', [PlatformWorkspaceController::class, 'show'])->name('workspaces.show');

        Route::get('users', [PlatformUserController::class, 'index'])->name('users.index');
        Route::patch('users/{user}/role', [PlatformUserController::class, 'updateRole'])->name('users.updateRole');

        Route::get('agents', [PlatformAgentController::class, 'index'])->name('agents.index');
        Route::get('conversations', [PlatformConversationController::class, 'index'])->name('conversations.index');
        Route::get('leads', [PlatformLeadController::class, 'index'])->name('leads.index');
        Route::get('search', PlatformSearchController::class)->name('search');
        Route::get('usage', [PlatformUsageController::class, 'index'])->name('usage.index');
        Route::get('subscriptions', [SubscriptionController::class, 'index'])->name('subscriptions.index');

        // Subscription plan CRUD — admin-managed, auto-syncs to every
        // enabled payment gateway (Stripe + PayPal + Razorpay).
        Route::get('plans', [PlatformPlanController::class, 'index'])->name('plans.index');
        Route::get('plans/create', [PlatformPlanController::class, 'create'])->name('plans.create');
        Route::post('plans', [PlatformPlanController::class, 'store'])->name('plans.store');
        Route::get('plans/{plan}/edit', [PlatformPlanController::class, 'edit'])->name('plans.edit');
        Route::patch('plans/{plan}', [PlatformPlanController::class, 'update'])->name('plans.update');
        // /sync (legacy, defaults to Stripe) + /sync/{gateway} (new, per-gateway).
        Route::post('plans/{plan}/sync', [PlatformPlanController::class, 'sync'])->name('plans.sync');
        Route::post('plans/{plan}/sync/{gateway}', [PlatformPlanController::class, 'sync'])
            ->whereIn('gateway', ['stripe', 'paypal', 'razorpay'])
            ->name('plans.sync.gateway');
        Route::delete('plans/{plan}', [PlatformPlanController::class, 'destroy'])->name('plans.destroy');

        Route::post('impersonate/{user}/start', [ImpersonateController::class, 'start'])->name('impersonate.start');

        // Failed-jobs inspection
        Route::get('jobs/failed', [PlatformJobController::class, 'failed'])->name('jobs.failed');
        Route::get('jobs/failed/{uuid}', [PlatformJobController::class, 'show'])->name('jobs.failed.show');
        Route::post('jobs/failed/{uuid}/retry', [PlatformJobController::class, 'retry'])->name('jobs.failed.retry');
        Route::post('jobs/failed/{uuid}/forget', [PlatformJobController::class, 'forget'])->name('jobs.failed.forget');
        Route::post('jobs/failed/retry-all', [PlatformJobController::class, 'retryAll'])->name('jobs.failed.retryAll');
        Route::post('jobs/failed/flush', [PlatformJobController::class, 'flush'])->name('jobs.failed.flush');

        // Internal Kanban — backlog/doing/review/done. Persists across
        // sessions on the AppSetting singleton so a future Claude
        // session reading the board can pick up dormant items even
        // months out.
        Route::get('board', [KanbanBoardController::class, 'index'])->name('board.index');
        Route::post('board', [KanbanBoardController::class, 'store'])->name('board.store');
        Route::patch('board/{taskId}', [KanbanBoardController::class, 'update'])->name('board.update');
        Route::delete('board/{taskId}', [KanbanBoardController::class, 'destroy'])->name('board.destroy');

    });

    // /stop is reachable from anywhere while impersonating; gated by an active session key, not by role.
    Route::post('impersonate/stop', [ImpersonateController::class, 'stop'])->name('impersonate.stop');
});

require __DIR__.'/settings.php';

// Serve public storage files directly if the webserver forwards to Laravel
// (e.g. symlink missing in container or misconfigured static routing).
Route::get('/storage/{path}', function (string $path) {
    $fullPath = storage_path('app/public/'.$path);
    if (! file_exists($fullPath)) {
        if ((str_contains($path, 'header') || str_contains($path, 'logo')) && file_exists(public_path('logo.png'))) {
            $fullPath = public_path('logo.png');
        } elseif (str_contains($path, 'favicon') && file_exists(public_path('favicon.png'))) {
            $fullPath = public_path('favicon.png');
        } else {
            abort(404);
        }
    }

    $mime = @mime_content_type($fullPath) ?: 'image/png';

    return response()->file($fullPath, [
        'Content-Type' => $mime,
        'Cache-Control' => 'public, max-age=86400',
    ]);
})->where('path', '.*');
