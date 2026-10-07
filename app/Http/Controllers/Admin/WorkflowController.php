<?php

namespace App\Http\Controllers\Admin;

use App\Models\Agent;
use App\Models\Workflow;
use App\Support\CurrentWorkspace;
use App\Support\Pagination;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Workspace-side CRUD for workflows. Phase 1 ships a linear-step
 * editor — the admin picks a trigger keyword set and adds an ordered
 * list of message / question / escalate steps. Phase 2 added branch /
 * tag_lead / webhook step types and the React-Flow canvas editor.
 *
 * The runtime executor (App\Services\Workflows\WorkflowEngine) reads
 * `definition.steps` directly, so the JSON shape this controller
 * accepts == the shape the engine consumes.
 */
class WorkflowController
{
    public function index(Request $request, CurrentWorkspace $current): Response
    {
        $workspace = $current->get();
        abort_if($workspace === null, 404);

        $q = trim((string) $request->query('q', ''));
        $view = (string) $request->query('view', 'all');
        $sort = (string) $request->query('sort', 'updated_desc');

        if (! in_array($view, ['all', 'active', 'draft', 'disabled'], true)) {
            $view = 'all';
        }

        if (! in_array(
            $sort,
            ['updated_desc', 'updated_asc', 'name_asc', 'name_desc'],
            true,
        )) {
            $sort = 'updated_desc';
        }

        $query = Workflow::query();

        if ($q !== '') {
            $query->where('name', 'like', "%{$q}%");
        }

        if (in_array($view, ['active', 'draft', 'disabled'], true)) {
            $query->where('status', $view);
        }

        match ($sort) {
            'updated_asc' => $query->oldest('updated_at'),
            'name_asc' => $query->orderBy('name'),
            'name_desc' => $query->orderByDesc('name'),
            default => $query->latest('updated_at'),
        };

        $paginator = $query->paginate(25)->withQueryString();

        $rows = collect($paginator->items())
            ->map(fn (Workflow $w) => $this->serialize($w))
            ->values();

        return Inertia::render('app/workflows/index', [
            'workflows' => $rows,
            'pagination' => Pagination::meta($paginator),
            'filters' => [
                'q' => $q,
                'view' => $view,
                'sort' => $sort,
            ],
        ]);
    }

    public function create(CurrentWorkspace $current): Response
    {
        abort_if($current->get() === null, 404);

        return Inertia::render('app/workflows/create', [
            'agents' => $this->agentOptions(),
        ]);
    }

    public function store(Request $request, CurrentWorkspace $current): RedirectResponse
    {
        abort_if($current->get() === null, 404);

        $data = $this->validatedFor($request);

        $workflow = Workflow::create([
            'agent_id' => $data['agent_id'] ?? null,
            'name' => $data['name'],
            'status' => $data['status'] ?? 'draft',
            'trigger_kind' => $data['trigger_kind'],
            'trigger_config' => [
                'keywords' => $data['keywords'] ?? [],
                'match_mode' => $data['match_mode'] ?? 'any',
            ],
            'definition' => array_filter([
                'steps' => $data['steps'] ?? [],
                'canvas' => $data['definition_canvas'] ?? null,
            ], fn ($v) => $v !== null),
            'created_by_user_id' => $request->user()?->id,
        ]);

        // Drop the admin straight onto the canvas — that's the default
        // editor for Phase 2+ flows. The linear form is still reachable
        // from the canvas page's "Linear edit" button for simple flows.
        return redirect()->route('workflows.canvas', ['workflow' => $workflow->id])
            ->with('success', __("Workflow ':name' created.", ['name' => $workflow->name]));
    }

    public function edit(Workflow $workflow): Response
    {
        return Inertia::render('app/workflows/edit', [
            'workflow' => $this->serialize($workflow),
            'agents' => $this->agentOptions(),
        ]);
    }

    /**
     * Visual editor at /app/workflows/{workflow}/canvas. The page is
     * the React-Flow canvas; the linear edit page stays available as
     * a fallback for simple flows. Both write through the same PATCH
     * route — the canvas just adds a `definition_canvas` block alongside
     * the linear `steps[]` so positions persist.
     */
    public function canvas(Workflow $workflow): Response
    {
        return Inertia::render('app/workflows/canvas', [
            'workflow' => $this->serialize($workflow),
            'agents' => $this->agentOptions(),
        ]);
    }

    public function update(Request $request, Workflow $workflow): RedirectResponse
    {
        $data = $this->validatedFor($request);

        $workflow->update([
            'agent_id' => $data['agent_id'] ?? null,
            'name' => $data['name'],
            'status' => $data['status'] ?? $workflow->status,
            'trigger_kind' => $data['trigger_kind'],
            'trigger_config' => [
                'keywords' => $data['keywords'] ?? [],
                'match_mode' => $data['match_mode'] ?? 'any',
            ],
            'definition' => array_filter([
                'steps' => $data['steps'] ?? [],
                'canvas' => $data['definition_canvas'] ?? null,
            ], fn ($v) => $v !== null),
        ]);

        return redirect()->route('workflows.index')
            ->with('success', __("Workflow ':name' updated.", ['name' => $workflow->name]));
    }

    public function destroy(Workflow $workflow): RedirectResponse
    {
        $workflow->delete();

        return redirect()->route('workflows.index')
            ->with('success', __('Workflow deleted.'));
    }

    /**
     * @return array<string, mixed>
     */
    private function serialize(Workflow $workflow): array
    {
        return [
            'id' => $workflow->id,
            'name' => $workflow->name,
            'status' => $workflow->status,
            'agent_id' => $workflow->agent_id,
            'trigger_kind' => $workflow->trigger_kind,
            'keywords' => $workflow->keywords(),
            'match_mode' => (string) ($workflow->trigger_config['match_mode'] ?? 'any'),
            'steps' => $workflow->steps(),
            'definition' => $workflow->definition,
            'created_at' => $workflow->created_at?->toIso8601String(),
            'updated_at' => $workflow->updated_at?->toIso8601String(),
        ];
    }

    /**
     * @return array<int, array<string, string|null>>
     */
    private function agentOptions(): array
    {
        return Agent::query()
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (Agent $a) => [
                'id' => $a->id,
                'name' => $a->name,
            ])
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    private function validatedFor(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'status' => ['sometimes', Rule::in(['draft', 'active', 'disabled'])],
            'agent_id' => ['nullable', 'string', 'exists:agents,id'],
            'trigger_kind' => ['required', Rule::in(['on_keyword'])],
            'match_mode' => ['sometimes', Rule::in(['any', 'all', 'exact'])],
            'keywords' => ['nullable', 'array', 'max:20'],
            'keywords.*' => ['string', 'max:120'],
            'steps' => ['required', 'array', 'min:1', 'max:64'],

            // Per-step base fields. `text` is required only for the
            // step types that emit a chat bubble (message / question /
            // escalate). Side-effect steps (branch / tag_lead /
            // webhook) leave it nullable.
            'steps.*.type' => ['required', Rule::in([
                'message', 'question', 'escalate',
                'branch', 'tag_lead', 'webhook',
            ])],
            'steps.*.text' => ['nullable', 'string', 'max:1000'],
            'steps.*.var_name' => ['nullable', 'string', 'max:64', 'regex:/^[a-zA-Z_][a-zA-Z0-9_]*$/'],

            // branch — case-by-case routing on a captured var.
            'steps.*.var' => ['nullable', 'string', 'max:64', 'regex:/^[a-zA-Z_][a-zA-Z0-9_]*$/'],
            'steps.*.cases' => ['nullable', 'array', 'max:16'],
            'steps.*.cases.*.match' => [Rule::in([
                'equals', 'contains', 'starts_with',
                'is_empty', 'not_empty', 'default',
            ])],
            'steps.*.cases.*.value' => ['nullable', 'string', 'max:200'],
            'steps.*.cases.*.go_to' => ['integer', 'min:0', 'max:64'],

            // tag_lead — append tag strings to the lead's fields.tags array.
            'steps.*.tags' => ['nullable', 'array', 'max:8'],
            'steps.*.tags.*' => ['string', 'max:32'],

            // webhook — outbound HTTP from the workflow run.
            'steps.*.url' => ['nullable', 'required_if:steps.*.type,webhook', 'url', 'max:2000'],
            'steps.*.method' => ['nullable', Rule::in(['POST', 'GET'])],
            'steps.*.extra_payload' => ['nullable', 'array'],

            // Canvas state — opaque blob of x/y positions + edges so
            // the visual editor can re-open a workflow with the same
            // layout. Runtime ignores it; only the editor reads it.
            'definition_canvas' => ['nullable', 'array'],
            'definition_canvas.nodes' => ['nullable', 'array'],
            'definition_canvas.edges' => ['nullable', 'array'],
        ]);
    }
}
