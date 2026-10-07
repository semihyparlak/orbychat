<?php

namespace App\Http\Controllers\Widget;

use App\Models\Conversation;
use App\Models\Message;
use App\Services\Widget\WidgetJwt;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Lightweight long-poll for visitor widgets to pick up out-of-band
 * messages — specifically, replies typed by a human operator who
 * claimed the conversation.
 *
 * The visitor's bot replies arrive via SSE in MessageStreamController.
 * Operator replies are persisted directly with `model = "human:<uid>"`,
 * which is what we filter on here.
 *
 * Polling interval is up to the widget; we keep this endpoint cheap
 * (one indexed query) so 3-second polling per active visitor is fine.
 */
class ConversationMessagesController
{
    public function __construct(private WidgetJwt $jwt) {}

    public function __invoke(Request $request): JsonResponse
    {
        $token = $request->bearerToken() ?? $request->header('X-Widget-Token');
        if (! is_string($token)) {
            return response()->json(['error' => ['code' => 'missing_token']], 401);
        }

        try {
            $claims = $this->jwt->verify($token);
        } catch (\Throwable) {
            return response()->json(['error' => ['code' => 'invalid_token']], 401);
        }

        $conversationId = (string) ($claims['conversation_id'] ?? '');
        $conversation = Conversation::query()->withoutWorkspaceScope()->find($conversationId);
        if ($conversation === null) {
            return response()->json(['error' => ['code' => 'conversation_not_found']], 404);
        }

        $after = (string) $request->query('after', '');

        $query = Message::query()
            ->where('conversation_id', $conversationId)
            ->where('role', 'assistant')
            ->where('model', 'like', 'human:%')
            ->orderBy('created_at')
            ->limit(50);

        if ($after !== '') {
            // UUIDv7 sort lexicographically by time → "id > $after" gives newer messages.
            $query->where('id', '>', $after);
        }

        $messages = $query->get(['id', 'role', 'content', 'created_at'])
            ->map(fn (Message $m) => [
                'id' => $m->id,
                'role' => 'human-agent',
                'content' => $m->content,
                'at' => $m->created_at?->toIso8601String(),
            ]);

        return response()->json([
            'data' => [
                'conversation_id' => $conversationId,
                'is_claimed' => $conversation->claimed_by_user_id !== null,
                'messages' => $messages,
            ],
        ]);
    }
}
