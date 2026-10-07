<?php

namespace App\Services\Tools\Tools;

use App\Models\Agent;
use App\Services\Tools\Contracts\Tool;

/**
 * Hands the conversation off to a human operator. Universal — every
 * vertical that has a `ticket_escalation` capability surfaces this.
 *
 * The execution side is informational: it returns a payload the LLM
 * folds into its final response, plus a `block` payload the widget
 * renders as a clickable "Connect me with a human" button. Actual
 * claim of the conversation by a human happens via the existing
 * ConversationTakeoverController flow.
 */
class EscalateToHumanTool implements Tool
{
    public function name(): string
    {
        return 'escalate_to_human';
    }

    public function description(): string
    {
        return 'Offer the visitor an option to connect with a human support agent. Use this when the visitor asks for a human, when their issue clearly cannot be resolved via the knowledge base, or when sentiment is negative and frustration is escalating.';
    }

    public function capability(): string
    {
        return 'ticket_escalation';
    }

    public function schema(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'reason' => [
                    'type' => 'string',
                    'description' => 'A short reason for the escalation, surfaced to the operator.',
                ],
            ],
            'required' => ['reason'],
        ];
    }

    public function execute(array $args, Agent $agent): array
    {
        $reason = (string) ($args['reason'] ?? 'Visitor requested a human.');

        return [
            'result' => [
                'status' => 'offered',
                'message' => 'A human-handoff button has been shown to the visitor.',
            ],
            'block' => [
                'type' => 'escalation_button',
                'payload' => [
                    'label' => 'Connect me with a human',
                    'reason' => $reason,
                ],
            ],
        ];
    }
}
