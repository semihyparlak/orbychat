<?php

namespace App\Http\Controllers\Admin;

use App\Models\Agent;
use App\Models\Experiment;
use App\Models\Variant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExperimentController
{
    public function index(Request $request, Agent $agent): Response
    {
        $request->user()->can('update', $agent) || abort(403);

        $experiments = $agent->experiments()
            ->with('variants:id,experiment_id,name,weight')
            ->latest()
            ->get();

        return Inertia::render('app/agents/experiments', [
            'agent' => $agent->only('id', 'name'),
            'experiments' => $experiments->map(fn ($e) => [
                'id' => $e->id,
                'name' => $e->name,
                'kind' => $e->kind,
                'status' => $e->status,
                'started_at' => $e->started_at?->toIso8601String(),
                'stopped_at' => $e->stopped_at?->toIso8601String(),
                'variants' => $e->variants->map(fn ($v) => [
                    'id' => $v->id,
                    'name' => $v->name,
                    'weight' => $v->weight,
                ]),
            ]),
        ]);
    }

    public function store(Request $request, Agent $agent): RedirectResponse
    {
        $request->user()->can('update', $agent) || abort(403);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'kind' => ['required', 'in:persona,cta,trigger'],
            'variants' => ['required', 'array', 'min:2', 'max:5'],
            'variants.*.name' => ['required', 'string', 'max:255'],
            'variants.*.weight' => ['required', 'integer', 'min:1', 'max:100'],
        ]);

        $experiment = Experiment::create([
            'agent_id' => $agent->id,
            'name' => $data['name'],
            'kind' => $data['kind'],
            'status' => 'draft',
        ]);

        foreach ($data['variants'] as $variant) {
            Variant::create([
                'experiment_id' => $experiment->id,
                'name' => $variant['name'],
                'weight' => $variant['weight'],
                'config' => [],
            ]);
        }

        return back()->with('success', 'Experiment created.');
    }

    public function start(Request $request, Experiment $experiment): RedirectResponse
    {
        $agent = $experiment->agent()->withoutWorkspaceScope()->firstOrFail();
        $request->user()->can('update', $agent) || abort(403);

        $experiment->forceFill(['status' => 'running', 'started_at' => now(), 'stopped_at' => null])->save();

        return back()->with('success', 'Experiment running.');
    }

    public function stop(Request $request, Experiment $experiment): RedirectResponse
    {
        $agent = $experiment->agent()->withoutWorkspaceScope()->firstOrFail();
        $request->user()->can('update', $agent) || abort(403);

        $experiment->forceFill(['status' => 'stopped', 'stopped_at' => now()])->save();

        return back()->with('success', 'Experiment stopped.');
    }

    public function destroy(Request $request, Experiment $experiment): RedirectResponse
    {
        $agent = $experiment->agent()->withoutWorkspaceScope()->firstOrFail();
        $request->user()->can('update', $agent) || abort(403);

        $experiment->delete();

        return back()->with('success', 'Experiment deleted.');
    }
}
