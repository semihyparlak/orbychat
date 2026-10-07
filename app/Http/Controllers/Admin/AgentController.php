<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Agents\PublishAgent;
use App\Actions\Agents\RollbackAgent;
use App\Http\Requests\Agent\StoreAgentRequest;
use App\Http\Requests\Agent\UpdateAgentRequest;
use App\Http\Resources\AgentResource;
use App\Models\Agent;
use App\Models\AgentVersion;
use App\Models\Conversation;
use App\Services\Widget\WidgetDefaultsResolver;
use App\Support\CurrentWorkspace;
use App\Services\Vertical\VerticalPresetRegistry;
use App\Support\Pagination;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AgentController
{
    public function __construct(private CurrentWorkspace $current) {}

    public function index(Request $request): Response
    {
        $workspace = $this->current->get();
        abort_if($workspace === null, 404);
        $request->user()->can('viewAny', [Agent::class, $workspace]) || abort(403);

        $q = trim((string) $request->query('q', ''));
        $view = (string) $request->query('view', 'all');
        $sort = (string) $request->query('sort', 'updated_desc');
        $language = trim((string) $request->query('language', 'all'));

        if (! in_array($view, ['all', 'published', 'draft'], true)) {
            $view = 'all';
        }

        if (! in_array($sort, ['updated_desc', 'updated_asc', 'name_asc', 'name_desc'], true)) {
            $sort = 'updated_desc';
        }

        if ($language === '') {
            $language = 'all';
        }

        $agentsQuery = Agent::query();

        if ($q !== '') {
            $agentsQuery->where('name', 'like', "%{$q}%");
        }

        if ($view === 'published') {
            $agentsQuery->where('is_published', true);
        }

        if ($view === 'draft') {
            $agentsQuery->where('is_published', false);
        }

        if ($language !== 'all') {
            $agentsQuery->where('language_default', $language);
        }

        match ($sort) {
            'updated_asc' => $agentsQuery->oldest('updated_at'),
            'name_asc' => $agentsQuery->orderBy('name'),
            'name_desc' => $agentsQuery->orderByDesc('name'),
            default => $agentsQuery->latest('updated_at'),
        };

        $paginator = $agentsQuery->paginate(25)->withQueryString();
        $agents = collect($paginator->items());
        $languages = Agent::query()
            ->select('language_default')
            ->distinct()
            ->orderBy('language_default')
            ->pluck('language_default')
            ->filter()
            ->values()
            ->all();

        // One batched query for per-agent counts so the index doesn't fan out N+1.
        $agentIds = $agents->pluck('id');
        $sourceCounts = \DB::table('sources')
            ->whereIn('agent_id', $agentIds)
            ->selectRaw('agent_id, count(*) as total, sum(case when status = \'indexed\' then 1 else 0 end) as indexed')
            ->groupBy('agent_id')
            ->get()
            ->keyBy('agent_id');

        $convoCounts = \DB::table('conversations')
            ->whereIn('agent_id', $agentIds)
            ->where('is_playground', false)
            ->where('started_at', '>=', now()->subDays(7))
            ->selectRaw('agent_id, count(*) as c')
            ->groupBy('agent_id')
            ->pluck('c', 'agent_id');

        $leadCounts = \DB::table('leads')
            ->whereIn('agent_id', $agentIds)
            ->where('created_at', '>=', now()->subDays(7))
            ->selectRaw('agent_id, count(*) as c')
            ->groupBy('agent_id')
            ->pluck('c', 'agent_id');

        return Inertia::render('app/agents/index', [
            'agents' => $agents->map(fn (Agent $a) => [
                'id' => $a->id,
                'name' => $a->name,
                'language_default' => $a->language_default,
                'is_published' => $a->is_published,
                'updated_at' => $a->updated_at->toIso8601String(),
                'sources' => [
                    'total' => (int) ($sourceCounts->get($a->id)?->total ?? 0),
                    'indexed' => (int) ($sourceCounts->get($a->id)?->indexed ?? 0),
                ],
                'conversations_7d' => (int) ($convoCounts[$a->id] ?? 0),
                'leads_7d' => (int) ($leadCounts[$a->id] ?? 0),
            ])->values(),
            'pagination' => Pagination::meta($paginator),
            'filters' => [
                'q' => $q,
                'view' => $view,
                'sort' => $sort,
                'language' => $language,
            ],
            'filterOptions' => [
                'languages' => $languages,
            ],
        ]);
    }

    public function create(Request $request): Response
    {
        $workspace = $this->current->get();
        abort_if($workspace === null, 404);
        $request->user()->can('create', [Agent::class, $workspace]) || abort(403);

        return Inertia::render('app/agents/create');
    }

    public function store(StoreAgentRequest $request): RedirectResponse
    {
        $workspace = $this->current->get();
        abort_if($workspace === null, 404);
        $request->user()->can('create', [Agent::class, $workspace]) || abort(403);

        // Pre-fill the new agent with the workspace's widget defaults
        // (theme, persona, guardrails, starter prompts). Submitted form
        // values win where present, so an admin who configured a
        // bespoke palette in the create form keeps their choices.
        $defaults = app(WidgetDefaultsResolver::class)->for($workspace);
        $payload = array_replace([
            'theme' => $defaults['theme'],
            'persona' => $defaults['persona'],
            'guardrails' => $defaults['guardrails'],
            'starter_prompts' => $defaults['starter_prompts'] === [] ? null : $defaults['starter_prompts'],
        ], $request->validated());

        $agent = Agent::create([
            'workspace_id' => $workspace->id,
            ...$payload,
        ]);

        return redirect()->route('agents.show', $agent->id);
    }

    public function show(Request $request, Agent $agent): Response
    {
        $request->user()->can('view', $agent) || abort(403);

        $sourcesIndexed = $agent->sources()->withoutGlobalScopes()->where('status', 'indexed')->count();
        $sourcesTotal = $agent->sources()->withoutGlobalScopes()->count();
        $hasMessages = Conversation::query()->withoutGlobalScopes()
            ->where('agent_id', $agent->id)
            ->where('is_playground', true)
            ->whereHas('messages')
            ->exists();

        $widgetUrl = $this->widgetUrl();

        return Inertia::render('app/agents/show', [
            'agent' => (new AgentResource($agent))->resolve($request),
            'setup' => [
                'sources_indexed' => $sourcesIndexed,
                'sources_total' => $sourcesTotal,
                'has_messages' => $hasMessages,
            ],
            'embed' => [
                'widget_url' => $widgetUrl,
                'snippet' => "<script src=\"{$widgetUrl}\" data-agent-id=\"{$agent->id}\" async></script>",
            ],
        ]);
    }

    public function edit(Request $request, Agent $agent): Response
    {
        $request->user()->can('update', $agent) || abort(403);

        $widgetUrl = $this->widgetUrl();
        $preset = $agent->site_type 
            ? app(VerticalPresetRegistry::class)->for((string) $agent->site_type)
            : null;

        return Inertia::render('app/agents/settings', [
            'agent' => (new AgentResource($agent))->resolve($request),
            'embed' => [
                'widget_url' => $widgetUrl,
                'snippet' => "<script src=\"{$widgetUrl}\" data-agent-id=\"{$agent->id}\" async></script>",
            ],
            'preset_defaults' => $preset ? [
                'capabilities' => $preset->capabilities(),
            ] : null,
        ]);
    }

    public function update(UpdateAgentRequest $request, Agent $agent): RedirectResponse
    {
        $request->user()->can('update', $agent) || abort(403);

        $agent->update($request->validated());

        return back()->with('success', __('Agent updated.'));
    }

    public function destroy(Request $request, Agent $agent): RedirectResponse
    {
        $request->user()->can('delete', $agent) || abort(403);

        $agent->delete();

        return redirect()->route('agents.index')->with('success', __('Agent deleted.'));
    }

    public function publish(Request $request, Agent $agent, PublishAgent $action): RedirectResponse
    {
        $request->user()->can('update', $agent) || abort(403);

        $action->handle($agent, $request->user());

        return back()->with('success', __('Agent published.'));
    }

    public function rollback(Request $request, Agent $agent, RollbackAgent $action): RedirectResponse
    {
        $request->user()->can('update', $agent) || abort(403);

        $request->validate(['version_id' => ['required', 'string']]);

        $version = AgentVersion::query()->whereKey($request->input('version_id'))->firstOrFail();
        $action->handle($agent, $version);

        return back()->with('success', __('Agent rolled back.'));
    }

    /**
     * Build the widget script URL with a cache-busting `?v=<hash>` query
     * derived from the bundle's content. Without this, customers who
     * pasted the embed snippet on their site keep getting the version
     * the browser/CDN cached on first visit — sometimes for days. Each
     * new build mutates the hash, which mutates the URL, which forces
     * every cache layer to fetch the fresh bundle.
     */
    private function widgetUrl(): string
    {
        $base = rtrim((string) config('app.url'), '/').'/widget/widget.js';
        $path = public_path('widget/widget.js');
        $version = is_file($path) ? substr((string) md5_file($path), 0, 8) : 'dev';

        return $base.'?v='.$version;
    }
}
