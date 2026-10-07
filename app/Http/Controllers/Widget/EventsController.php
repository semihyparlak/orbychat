<?php

namespace App\Http\Controllers\Widget;

use App\Models\Event;
use App\Services\Widget\WidgetJwt;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventsController
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

        $data = $request->validate([
            'events' => ['required', 'array', 'max:100'],
            'events.*.kind' => ['required', 'string', 'max:64'],
            'events.*.payload' => ['nullable', 'array'],
        ]);

        $agentId = (string) ($claims['agent_id'] ?? '');
        $conversationId = (string) ($claims['conversation_id'] ?? '');

        foreach ($data['events'] as $event) {
            Event::create([
                'agent_id' => $agentId,
                'conversation_id' => $conversationId ?: null,
                'kind' => $event['kind'],
                'payload' => $event['payload'] ?? [],
                'created_at' => now(),
            ]);

            if ($event['kind'] === 'human_requested' && $conversationId) {
                $conversation = \App\Models\Conversation::query()
                    ->withoutWorkspaceScope()
                    ->with('agent')
                    ->find($conversationId);
                
                if ($conversation && $conversation->agent) {
                    event(\App\Events\Conversations\HumanRequestedEvent::fromConversation(
                        $conversation,
                        (string) $conversation->agent->workspace_id
                    ));
                }
            }
        }

        return response()->json(['data' => ['accepted' => count($data['events'])]]);
    }
}
