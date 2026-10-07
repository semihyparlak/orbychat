<?php

namespace App\Http\Controllers\Api\Integration;

use App\Models\Agent;
use App\Models\Document;
use App\Models\Source;
use App\Models\Workspace;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WordPressSyncController
{
    /**
     * Handle bulk sync from the OrbyChat WordPress plugin.
     * Authenticates via X-OrbyChat-Token mapped to Workspace->api_token.
     */
    public function sync(Request $request): JsonResponse
    {
        $token = $request->header('X-OrbyChat-Token');
        if (empty($token)) {
            return response()->json(['message' => 'Missing API token'], 401);
        }

        $workspace = Workspace::where('api_token', $token)->first();
        if (!$workspace) {
            return response()->json(['message' => 'Invalid API token'], 401);
        }

        $data = $request->validate([
            'agent_id' => ['required', 'exists:agents,id'],
            'items' => ['required', 'array', 'max:2000'],
            'items.*.external_id' => ['required', 'string'],
            'items.*.type' => ['required', 'string', 'in:product,page'],
            'items.*.title' => ['required', 'string', 'max:500'],
            'items.*.url' => ['required', 'url'],
            'items.*.body' => ['required', 'string'],
            'items.*.price' => ['nullable', 'numeric'],
            'items.*.currency' => ['nullable', 'string', 'max:10'],
            'items.*.image_url' => ['nullable', 'url'],
        ]);

        $agent = Agent::where('id', $data['agent_id'])
            ->where('workspace_id', $workspace->id)
            ->first();

        if (!$agent) {
            return response()->json(['message' => 'Agent not found or access denied'], 404);
        }

        // Ensure a 'wordpress' source exists for this agent
        $source = Source::firstOrCreate(
            ['agent_id' => $agent->id, 'type' => 'wordpress'],
            ['status' => 'indexed', 'config' => ['url' => $request->root()]]
        );

        $syncedCount = 0;

        DB::transaction(function () use ($data, $source, &$syncedCount) {
            foreach ($data['items'] as $item) {
                // We use external_id in the config to identify unique items from WP
                $document = Document::updateOrCreate(
                    [
                        'source_id' => $source->id,
                        'url' => $item['url']
                    ],
                    [
                        'title' => $item['title'],
                        'body' => $this->formatBody($item),
                        'fetched_at' => now(),
                        'crawler' => 'wordpress_plugin'
                    ]
                );
                
                $syncedCount++;
            }
        });

        $source->touch('last_synced_at');

        return response()->json([
            'message' => 'Sync completed',
            'count' => $syncedCount
        ]);
    }

    private function formatBody(array $item): string
    {
        $body = $item['title'] . "\n\n";
        
        if ($item['type'] === 'product') {
            if (!empty($item['price'])) {
                $body .= "Price: " . $item['price'] . " " . ($item['currency'] ?? '') . "\n";
            }
            if (!empty($item['url'])) {
                $body .= "Product Link: " . $item['url'] . "\n";
            }
        }
        
        $body .= "\n" . $item['body'];
        
        return $body;
    }

    public function handleCartEvent(Request $request): JsonResponse
    {
        $token = $request->header('X-OrbyChat-Token');
        $workspace = Workspace::where('api_token', $token)->first();
        if (!$workspace) return response()->json(['message' => 'Invalid API token'], 401);

        $data = $request->json()->all();
        
        // Log the cart event for later abandoned cart processing
        // In a real app, you'd store this in a 'carts' table linked to a visitor/email
        \Illuminate\Support\Facades\Log::info("Cart event for workspace {$workspace->id}: " . json_encode($data));

        return response()->json(['status' => 'ok']);
    }

    public function handleOrderEvent(Request $request): JsonResponse
    {
        $token = $request->header('X-OrbyChat-Token');
        $workspace = Workspace::where('api_token', $token)->first();
        if (!$workspace) return response()->json(['message' => 'Invalid API token'], 401);

        $data = $request->json()->all();
        
        // Mark as conversion
        \Illuminate\Support\Facades\Log::info("Order completed for workspace {$workspace->id}: " . json_encode($data));

        return response()->json(['status' => 'ok']);
    }
}
