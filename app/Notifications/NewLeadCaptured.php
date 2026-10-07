<?php

namespace App\Notifications;

use App\Models\Lead;
use App\Support\AppBranding;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Sent to every owner/admin of the lead's workspace right after Lead capture.
 * Triggered from RouteLeadJob (queued), so the visitor's HTTP request never
 * waits on SMTP.
 *
 * Uses a custom Blade template (resources/views/emails/leads/captured.blade.php)
 * so the email actually looks like a OrbyChat email rather than the stock
 * Laravel one.
 */
class NewLeadCaptured extends Notification
{
    use Queueable;

    public function __construct(public Lead $lead) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $lead = $this->lead;
        $agent = $lead->conversation?->agent;
        $workspace = $agent?->workspace;
        $agentName = $agent?->name ?? 'your agent';
        $workspaceName = $workspace?->name ?? 'your workspace';
        $inboxUrl = url('/app/inbox/'.$lead->id);

        $rows = [
            __('Email') => $lead->email,
            __('Name') => $lead->name,
            __('Phone') => $lead->phone,
            __('Captured') => $lead->created_at?->toDayDateTimeString(),
        ];

        return (new MailMessage)
            ->subject(__("New lead — :email", ['email' => $lead->email]))
            ->view('emails.leads.captured', [
                'lead' => $lead,
                'agentName' => $agentName,
                'workspaceName' => $workspaceName,
                'inboxUrl' => $inboxUrl,
                'rows' => $rows,
                'brandName' => AppBranding::siteTitle(),
            ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'lead_id' => $this->lead->id,
            'email' => $this->lead->email,
        ];
    }
}
