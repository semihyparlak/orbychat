<?php

namespace App\Http\Controllers\Admin;

use App\Events\Conversations\AgentReplyPostedEvent;
use App\Events\Conversations\ConversationClaimedEvent;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * Live human takeover. A workspace member claims an in-flight conversation,
 * the bot stops auto-responding for that session (RagPipeline checks
 * `claimed_by_user_id`), and the human can post replies that broadcast over
 * Reverb to the visitor's widget.
 */
class ConversationTakeoverController
{
    public function claim(Request $request, Conversation $conversation): JsonResponse
    {
        $this->authorize($request, $conversation);

        if ($conversation->claimed_by_user_id !== null
            && $conversation->claimed_by_user_id !== $request->user()->id) {
            $other = $conversation->claimedBy;

            return response()->json([
                'error' => [
                    'code' => 'already_claimed',
                    'by' => $other?->only('id', 'name'),
                ],
            ], 409);
        }

        $conversation->forceFill([
            'claimed_by_user_id' => $request->user()->id,
            'claimed_at' => now(),
        ])->save();

        ConversationClaimedEvent::dispatch(
            $conversation->id,
            (string) $request->user()->id,
            (string) $request->user()->name,
        );

        return response()->json([
            'data' => [
                'conversation_id' => $conversation->id,
                'claimed_by' => $request->user()->only('id', 'name'),
                'claimed_at' => $conversation->claimed_at?->toIso8601String(),
            ],
        ]);
    }

    public function release(Request $request, Conversation $conversation): JsonResponse
    {
        $this->authorize($request, $conversation);

        // Only the current claimant (or workspace admin) can release.
        if ($conversation->claimed_by_user_id !== null
            && $conversation->claimed_by_user_id !== $request->user()->id) {
            // Allow admins to break-the-glass. Re-use the existing policy.
            $request->user()->can('update', $conversation->agent) || abort(403);
        }

        $conversation->forceFill([
            'claimed_by_user_id' => null,
            'claimed_at' => null,
        ])->save();

        return response()->json(['data' => ['conversation_id' => $conversation->id]]);
    }

    public function reply(Request $request, Conversation $conversation): JsonResponse
    {
        $this->authorize($request, $conversation);

        $data = $request->validate([
            'content' => ['required', 'string', 'max:4000'],
        ]);

        if ($conversation->claimed_by_user_id !== $request->user()->id) {
            return response()->json([
                'error' => ['code' => 'must_claim_first'],
            ], 409);
        }

        $message = Message::create([
            'id' => (string) Str::uuid7(),
            'conversation_id' => $conversation->id,
            'role' => 'assistant',
            'content' => $data['content'],
            'citations' => [],
            'confidence' => 1.0,
            'tokens_in' => 0,
            'tokens_out' => mb_strlen($data['content']),
            'latency_ms' => 0,
            'model' => 'human:'.$request->user()->id,
        ]);

        $conversation->forceFill([
            'message_count' => ($conversation->message_count ?? 0) + 1,
        ])->save();

        AgentReplyPostedEvent::dispatch(
            $conversation->id,
            $message->id,
            $message->content,
            (string) $request->user()->name,
        );

        return response()->json([
            'data' => [
                'message_id' => $message->id,
                'content' => $message->content,
            ],
        ]);
    }

    private function authorize(Request $request, Conversation $conversation): void
    {
        $agent = $conversation->agent()->withoutWorkspaceScope()->first();
        abort_if($agent === null, 404);
        $request->user()->can('update', $agent) || abort(403);
    }
}
