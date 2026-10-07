<?php

namespace App\Http\Controllers\Admin;

use App\Models\Agent;
use App\Models\Conversation;
use App\Models\Visitor;
use App\Services\Rag\RagPipeline;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PlaygroundController
{
    public function show(Request $request, Agent $agent): Response
    {
        $request->user()->can('update', $agent) || abort(403);

        return Inertia::render('app/agents/playground', [
            'agent' => $agent->only('id', 'name', 'persona', 'theme'),
        ]);
    }

    public function send(Request $request, Agent $agent, RagPipeline $rag): JsonResponse
    {
        $request->user()->can('update', $agent) || abort(403);

        $data = $request->validate([
            'message' => ['required', 'string', 'max:4000'],
            'conversation_id' => ['nullable', 'string'],
        ]);

        $conversationId = $data['conversation_id'] ?? null;
        if ($conversationId === null) {
            $visitor = Visitor::create([
                'agent_id' => $agent->id,
                'anonymous_id' => 'pg_'.Str::random(16),
                'first_seen_at' => now(),
                'last_seen_at' => now(),
            ]);
            $source = $agent->sources()->first();
            $pageUrl = '/';
            if ($source && $source->url) {
                $parsed = parse_url($source->url);
                $pageUrl = ($parsed['scheme'] ?? 'https') . '://' . ($parsed['host'] ?? 'example.com');
            }

            $conversation = Conversation::create([
                'agent_id' => $agent->id,
                'visitor_id' => $visitor->id,
                'page_url' => $pageUrl,
                'started_at' => now(),
                'is_playground' => true,
            ]);
            $conversationId = $conversation->id;
        }

        $result = $rag->handle($conversationId, $data['message'], isPlayground: true);

        return response()->json([
            'data' => [
                'conversation_id' => $conversationId,
                ...$result,
            ],
        ]);
    }
}
