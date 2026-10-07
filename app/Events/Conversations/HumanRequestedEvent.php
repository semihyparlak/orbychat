<?php

namespace App\Events\Conversations;

use App\Models\Conversation;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class HumanRequestedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public string $workspaceId,
        public string $conversationId,
        public string $agentName,
        public string $inboxUrl,
    ) {}

    public static function fromConversation(Conversation $conversation, string $workspaceId): self
    {
        $agentName = $conversation->agent->name ?? 'your agent';
        
        return new self(
            workspaceId: $workspaceId,
            conversationId: (string) $conversation->id,
            agentName: $agentName,
            inboxUrl: '/app/inbox?conversation_id='.$conversation->id,
        );
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("workspace.{$this->workspaceId}.leads"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'human.requested';
    }

    public function broadcastWith(): array
    {
        return [
            'conversation_id' => $this->conversationId,
            'agent_name' => $this->agentName,
            'inbox_url' => $this->inboxUrl,
            'at' => now()->toIso8601String(),
        ];
    }
}
