<?php

namespace App\Http\Controllers\Admin;

use App\Models\Agent;
use App\Models\CuratedAnswer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CuratedAnswerController
{
    public function index(Request $request, Agent $agent)
    {
        $request->user()->can('update', $agent) || abort(403);

        return inertia('app/agents/curated', [
            'agent' => $agent->only('id', 'name'),
            'answers' => $agent->curatedAnswers()
                ->orderBy('priority', 'desc')
                ->get()
                ->map(fn (CuratedAnswer $a) => [
                    'id' => $a->id,
                    'question_pattern' => $a->question_pattern,
                    'answer' => $a->answer,
                    'priority' => $a->priority,
                    'enabled' => $a->enabled,
                    'lang' => $a->lang,
                    'is_suggested' => (bool) (($a->conditions ?? [])['suggested'] ?? false),
                ]),
        ]);
    }

    public function store(Request $request, Agent $agent): RedirectResponse
    {
        $request->user()->can('update', $agent) || abort(403);

        $data = $request->validate([
            'question_pattern' => ['required', 'string', 'max:500'],
            'answer' => ['required', 'string'],
            'priority' => ['nullable', 'integer'],
            'lang' => ['nullable', 'string', 'max:8'],
            'enabled' => ['nullable', 'boolean'],
        ]);

        CuratedAnswer::create(['agent_id' => $agent->id, ...$data]);

        return back()->with('success', 'Answer added.');
    }

    public function update(Request $request, CuratedAnswer $curatedAnswer): RedirectResponse
    {
        $agent = $curatedAnswer->agent()->withoutWorkspaceScope()->firstOrFail();
        $request->user()->can('update', $agent) || abort(403);

        $data = $request->validate([
            'question_pattern' => ['sometimes', 'string', 'max:500'],
            'answer' => ['sometimes', 'string'],
            'priority' => ['sometimes', 'integer'],
            'lang' => ['sometimes', 'nullable', 'string', 'max:8'],
            'enabled' => ['sometimes', 'boolean'],
        ]);

        $curatedAnswer->update($data);

        return back()->with('success', 'Answer updated.');
    }

    /**
     * Promote a system-suggested CuratedAnswer (enabled=false, conditions.suggested=true)
     * to a live one. Strips the "suggested" markers so the row renders as a
     * normal curated answer afterwards.
     */
    public function approve(Request $request, CuratedAnswer $curatedAnswer): RedirectResponse
    {
        $agent = $curatedAnswer->agent()->withoutWorkspaceScope()->firstOrFail();
        $request->user()->can('update', $agent) || abort(403);

        $conditions = (array) ($curatedAnswer->conditions ?? []);
        unset($conditions['suggested'], $conditions['suggested_from_gap_id']);

        $curatedAnswer->update([
            'enabled' => true,
            'conditions' => $conditions,
        ]);

        Cache::forget("curated:{$agent->id}");

        return back()->with('success', 'Suggested answer approved.');
    }

    public function destroy(Request $request, CuratedAnswer $curatedAnswer): RedirectResponse
    {
        $agent = $curatedAnswer->agent()->withoutWorkspaceScope()->firstOrFail();
        $request->user()->can('update', $agent) || abort(403);

        $curatedAnswer->delete();

        return back()->with('success', 'Answer removed.');
    }

    /**
     * Persist a new ordering. The order array lists IDs from highest-priority
     * to lowest. We assign priorities as count..1 so they survive new inserts.
     */
    public function reorder(Request $request, Agent $agent): RedirectResponse
    {
        $request->user()->can('update', $agent) || abort(403);

        $data = $request->validate([
            'order' => ['required', 'array'],
            'order.*' => ['string'],
        ]);

        $count = count($data['order']);
        foreach ($data['order'] as $i => $id) {
            CuratedAnswer::query()->where('agent_id', $agent->id)->whereKey($id)
                ->update(['priority' => $count - $i]);
        }

        Cache::forget("curated:{$agent->id}");

        return back()->with('success', 'Order updated.');
    }
}
