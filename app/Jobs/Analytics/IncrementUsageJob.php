<?php

namespace App\Jobs\Analytics;

use App\Models\Conversation;
use App\Models\UsageEvent;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;

/**
 * Increment a usage_events row only on the FIRST user message of a
 * conversation (per PLAN §WU-23). Idempotent via a short-lived Redis lock.
 */
class IncrementUsageJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public string $conversationId) {}

    public function handle(): void
    {
        $conversation = Conversation::query()->withoutWorkspaceScope()->find($this->conversationId);
        if ($conversation === null) {
            return;
        }
        $agent = $conversation->agent()->withoutWorkspaceScope()->first();
        if ($agent === null) {
            return;
        }

        // Per-conversation event — fired once per conversation. The
        // Cache lock makes the job idempotent so a misfiring queue
        // worker re-running the job doesn't double-count.
        $conversationKey = "usage:counted:{$this->conversationId}";
        if (! Cache::has($conversationKey)) {
            UsageEvent::create([
                'workspace_id' => $agent->workspace_id,
                'kind' => 'conversation',
                'quantity' => 1,
                'meta' => ['conversation_id' => $conversation->id],
                'occurred_at' => now(),
                'created_at' => now(),
            ]);

            Cache::put($conversationKey, true, now()->addDays(30));
        }

        // Per-message event — every visitor message counts. This is what
        // MeteredBilling::canSendMessage() reads when an admin pins a
        // monthly_messages cap on a plan. Each enqueue is one message,
        // so no idempotency lock here.
        UsageEvent::create([
            'workspace_id' => $agent->workspace_id,
            'kind' => 'message',
            'quantity' => 1,
            'meta' => ['conversation_id' => $conversation->id],
            'occurred_at' => now(),
            'created_at' => now(),
        ]);
    }
}
