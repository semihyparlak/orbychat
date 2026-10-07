<?php

namespace App\Jobs\Rag;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class PersistTurnJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * @param  array<int, array{id: int, url: ?string}>  $citations
     */
    public function __construct(
        public string $conversationId,
        public string $userMessageId,
        public string $userMessageText,
        public string $assistantMessageId,
        public string $assistantMessageText,
        public array $citations,
        public float $confidence,
        public int $latencyMs,
        public string $model,
        public ?float $sentiment = null,
    ) {}

    public function handle(): void
    {
        $conversation = Conversation::query()->withoutWorkspaceScope()->findOrFail($this->conversationId);

        Message::create([
            'id' => $this->userMessageId,
            'conversation_id' => $conversation->id,
            'role' => 'user',
            'content' => $this->userMessageText,
            'sentiment' => $this->sentiment,
            'created_at' => now()->subMillis($this->latencyMs),
        ]);

        Message::create([
            'id' => $this->assistantMessageId,
            'conversation_id' => $conversation->id,
            'role' => 'assistant',
            'content' => $this->assistantMessageText,
            'citations' => $this->citations,
            'confidence' => $this->confidence,
            'latency_ms' => $this->latencyMs,
            'model' => $this->model,
        ]);

        $conversation->forceFill([
            'message_count' => $conversation->message_count + 2,
        ])->save();
    }
}
