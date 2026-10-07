<?php

namespace App\Jobs\Leads;

use App\Events\Leads\LeadCapturedEvent;
use App\Models\IntegrationConnection;
use App\Models\Lead;
use App\Models\User;
use App\Models\WebhookSubscription;
use App\Notifications\NewLeadCaptured;
use App\Services\Integrations\SlackPusher;
use App\Services\Webhooks\SignedDispatcher;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Notification;

class RouteLeadJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public string $leadId) {}

    public function handle(SignedDispatcher $webhooks, SlackPusher $slack): void
    {
        $lead = Lead::query()->withoutWorkspaceScope()->with(['conversation.agent'])->find($this->leadId);
        if ($lead === null) {
            return;
        }

        $workspaceId = $lead->conversation?->agent?->workspace_id;
        if ($workspaceId === null) {
            return;
        }

        // Outbound webhook subscriptions
        $subs = WebhookSubscription::query()->withoutWorkspaceScope()
            ->where('workspace_id', $workspaceId)
            ->where('enabled', true)
            ->get();

        foreach ($subs as $sub) {
            if (! in_array('lead.captured', (array) $sub->events, true)) {
                continue;
            }
            $webhooks->send($sub->url, $sub->secret, [
                'event' => 'lead.captured',
                'lead' => $lead->only('id', 'email', 'phone', 'name', 'fields', 'status'),
                'agent_id' => $lead->agent_id,
            ]);
        }

        // Native integrations
        $integrations = IntegrationConnection::query()->withoutWorkspaceScope()
            ->where('workspace_id', $workspaceId)
            ->where('status', 'active')
            ->get();

        foreach ($integrations as $i) {
            if ($i->kind === 'slack') {
                $url = $i->credentials_encrypted['webhook_url'] ?? null;
                if (is_string($url)) {
                    $slack->pushLead($url, $lead);
                }
            }
            // HubSpot/Pipedrive deferred to post-secret-paste
        }

        // Email all workspace owners/admins. The notification is itself
        // ShouldQueue (via the Notifiable Queueable trait), so each address
        // becomes its own queue entry and SMTP latency stays off this job.
        $recipients = User::query()
            ->join('workspace_users', 'workspace_users.user_id', '=', 'users.id')
            ->where('workspace_users.workspace_id', $workspaceId)
            ->whereIn('workspace_users.role', ['owner', 'admin'])
            ->whereNotNull('workspace_users.accepted_at')
            ->select('users.*')
            ->distinct()
            ->get();

        if ($recipients->isNotEmpty()) {
            Notification::send($recipients, new NewLeadCaptured($lead));
        }

        // Live in-app toast / browser-push fan-out for every member of
        // this workspace whose admin tab is open. Decoupled from the
        // email path so a missing Reverb config doesn't block the lead
        // routing — broadcasts are async and best-effort.
        $agentName = $lead->conversation?->agent?->name ?? 'your agent';
        try {
            event(LeadCapturedEvent::fromLead($lead, (string) $workspaceId, $agentName));
        } catch (\Throwable) {
            // Reverb / driver not configured — never block lead capture.
        }

        $lead->forceFill(['routed_to' => 'webhooks+slack+email+toast'])->save();
    }
}
