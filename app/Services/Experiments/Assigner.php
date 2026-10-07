<?php

namespace App\Services\Experiments;

use App\Models\Experiment;
use App\Models\ExperimentAssignment;
use App\Models\Variant;

class Assigner
{
    /**
     * Sticky assignment: the same visitor_id always lands in the same variant
     * for an experiment. New visitors are assigned by weighted hash.
     */
    public function assign(Experiment $experiment, string $visitorId): ?Variant
    {
        if ($experiment->status !== 'running') {
            return null;
        }

        $existing = ExperimentAssignment::query()
            ->where('visitor_id', $visitorId)
            ->where('experiment_id', $experiment->id)
            ->first();

        if ($existing !== null) {
            return Variant::query()->find($existing->variant_id);
        }

        $variants = $experiment->variants()->get();
        if ($variants->isEmpty()) {
            return null;
        }

        $totalWeight = $variants->sum('weight') ?: 1;

        // Hash to a number in [0, totalWeight)
        $bucket = hexdec(substr(hash('sha256', $visitorId.':'.$experiment->id), 0, 8)) % $totalWeight;

        $cum = 0;
        $chosen = null;
        foreach ($variants as $v) {
            $cum += (int) $v->weight;
            if ($bucket < $cum) {
                $chosen = $v;
                break;
            }
        }

        if ($chosen === null) {
            return null;
        }

        ExperimentAssignment::create([
            'visitor_id' => $visitorId,
            'experiment_id' => $experiment->id,
            'variant_id' => $chosen->id,
            'assigned_at' => now(),
        ]);

        return $chosen;
    }
}
