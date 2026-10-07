<?php

namespace App\Http\Middleware;

use App\Models\ChangelogEntry;
use App\Models\User;
use App\Models\Workspace;
use App\Services\Billing\MeteredBilling;
use App\Support\AppBranding;
use App\Support\CurrentWorkspace;
use App\Support\PlatformAdminHeader;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $this->flashToastFromSession($request);

        $user = $request->user();
        $branding = AppBranding::shared();

        $impersonatorId = $request->session()->get('impersonator_id');
        $impersonator = $impersonatorId
            ? User::query()->find($impersonatorId)?->only('id', 'name', 'email')
            : null;

        return [
            ...parent::share($request),
            'name' => $branding['site_title'],
            'branding' => $branding,
            'auth' => [
                'user' => $user ? [
                    ...$user->toArray(),
                    'role' => $user->role?->value ?? 'customer',
                    'is_super_admin' => $user->isSuperAdmin(),
                ] : null,
                'needs_onboarding' => fn () => $this->needsOnboarding($user),
            ],
            'impersonating' => $impersonator,
            'currentWorkspace' => fn () => app(CurrentWorkspace::class)->get(),
            'workspaces' => fn () => $user
                ? $user->workspaces()
                    ->select('workspaces.id', 'workspaces.name', 'workspaces.slug')
                    ->withPivot('role')
                    ->get()
                : [],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
            'billingSummary' => fn () => $this->billingSummary($user),
            'adminHeader' => fn () => $user?->isSuperAdmin()
                ? app(PlatformAdminHeader::class)->payload()
                : null,
            'changelogTeaser' => fn () => $this->changelogTeaser($user),
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'locale' => app()->getLocale(),
            'translations' => fn () => $this->translations(),
            'features' => fn () => [
                'has_appointments' => $user && $user->default_workspace_id
                    ? \App\Models\Agent::query()
                        ->where('workspace_id', $user->default_workspace_id)
                        ->where('site_type', 'medical')
                        ->get()
                        ->contains(function ($agent) {
                            $overrides = (array) ($agent->vertical_overrides ?? []);
                            if (isset($overrides['appointment_requests'])) {
                                return $overrides['appointment_requests'] === true;
                            }
                            
                            // Fallback to preset defaults
                            $registry = app(\App\Services\Vertical\VerticalPresetRegistry::class);
                            $preset = $registry->for((string) $agent->site_type);
                            return in_array('appointment_requests', $preset->capabilities());
                        })
                    : false,
            ],
        ];
    }

    /**
     * Load all translations for the current locale to be used in JS.
     */
    private function translations(): array
    {
        $locale = app()->getLocale();
        $file = lang_path("{$locale}.json");

        if (! file_exists($file)) {
            return [];
        }

        return json_decode(file_get_contents($file), true) ?? [];
    }

    /**
     * One-row peek at the most recent published changelog entry.
     * The "What's new" banner reads it to decide whether to show.
     * The actual badge logic compares released_at to the user's
     * last_changelog_seen_at — done client-side so the controller
     * can stay agnostic of seen/unseen state.
     *
     * Cheap: one indexed `where status='published'` lookup. Skipped
     * entirely for unauthenticated visitors and super_admins.
     */
    private function changelogTeaser(?User $user): ?array
    {
        if ($user === null) {
            return null;
        }
        // Super-admins author the changelog; they don't need a
        // "what's new" badge nudging them about their own entries.
        if ($user->isSuperAdmin()) {
            return null;
        }

        $latest = ChangelogEntry::published()->first();

        if ($latest === null) {
            return null;
        }

        return [
            'version' => $latest->version,
            'released_at' => $latest->released_at?->toIso8601String(),
            'title' => $latest->title,
            'last_seen_at' => $user->last_changelog_seen_at?->toIso8601String(),
        ];
    }

    /**
     * Promote existing session success/error messages into Inertia's
     * one-time flash channel so the global toaster can display them
     * without persisting stale messages in browser history.
     */
    private function flashToastFromSession(Request $request): void
    {
        if (! $request->hasSession()) {
            return;
        }

        $flashed = Inertia::getFlashed($request);

        if (isset($flashed['toast'])) {
            return;
        }

        $error = $request->session()->get('error');

        if (is_string($error) && trim($error) !== '') {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $error,
            ]);

            return;
        }

        $success = $request->session()->get('success');

        if (is_string($success) && trim($success) !== '') {
            Inertia::flash('toast', [
                'type' => 'success',
                'message' => $success,
            ]);
        }
    }

    /**
     * Slim usage summary so the admin shell can show a "near limit" banner
     * without an extra request. Cheap — one indexed sum() over usage_events.
     */
    private function billingSummary(?User $user): ?array
    {
        if ($user === null) {
            return null;
        }

        if ($user->isSuperAdmin()) {
            return null;
        }

        $workspace = app(CurrentWorkspace::class)->get();
        if ($workspace === null) {
            return null;
        }

        return app(MeteredBilling::class)->summaryFor($workspace);
    }

    /**
     * "Needs onboarding" = the user's default workspace has no agent with at
     * least one indexed source. Avoids nagging users who've already shipped.
     */
    private function needsOnboarding(?User $user): bool
    {
        if ($user === null) {
            return false;
        }
        if ($user->isSuperAdmin()) {
            return false;
        }
        $workspaceId = $user->default_workspace_id;
        if ($workspaceId === null) {
            return false;
        }

        return ! \DB::table('sources')
            ->join('agents', 'agents.id', '=', 'sources.agent_id')
            ->where('agents.workspace_id', $workspaceId)
            ->where('sources.status', 'indexed')
            ->exists();
    }
}
