<?php

namespace App\Notifications;

use App\Models\Appointment;
use App\Support\AppBranding;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Sent to the patient/customer after their appointment is confirmed.
 */
class AppointmentConfirmed extends Notification
{
    use Queueable;

    public function __construct(public Appointment $appointment) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $appt = $this->appointment;
        $workspace = $appt->workspace;
        $tz = $workspace->settings['calendar']['timezone'] ?? config('app.timezone');

        $localTime = \Carbon\Carbon::parse($appt->appointment_at)
            ->timezone($tz)
            ->format('d M Y, H:i');

        $brandName = AppBranding::siteTitle();

        return (new MailMessage)
            ->subject(__("✅ Appointment Confirmed — :time", ['time' => $localTime]))
            ->greeting(__("Hello :name,", ['name' => $appt->name]))
            ->line(__("Your appointment has been successfully booked."))
            ->line("**" . __("Date & Time") . ":** {$localTime} ({$tz})")
            ->when($appt->agent, fn ($m) => $m->line("**" . __("Agent") . ":** {$appt->agent->name}"))
            ->line(__("If you wish to cancel or change your appointment, please contact us."))
            ->salutation(__("Best regards, :brand", ['brand' => $brandName]));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'appointment_id' => $this->appointment->id,
        ];
    }
}
