<?php

namespace App\Http\Controllers\Admin;

use App\Models\Appointment;
use App\Models\Agent;
use App\Support\CurrentWorkspace;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CalendarController
{
    public function __construct(private CurrentWorkspace $current) {}

    public function index(Request $request): Response
    {
        $workspace = $this->current->get();
        abort_if($workspace === null, 404);

        $agents = Agent::query()
            ->where('workspace_id', $workspace->id)
            ->select('id', 'name')
            ->get();

        $appointments = Appointment::query()
            ->where('workspace_id', $workspace->id)
            ->with('agent:id,name')
            ->orderBy('appointment_at')
            ->get();

        return Inertia::render('app/calendar/index', [
            'appointments' => $appointments,
            'agents' => $agents,
            'workspace' => $workspace,
            'timezones' => \DateTimeZone::listIdentifiers(),
        ]);
    }

    public function updateSettings(Request $request)
    {
        $workspace = $this->current->get();
        abort_if($workspace === null, 404);

        $validated = $request->validate([
            'working_days' => 'required|array',
            'working_days.*' => 'integer|min:0|max:6',
            'working_hours_start' => 'required|string',
            'working_hours_end' => 'required|string',
            'timezone' => 'required|string',
            'slot_duration' => 'nullable|integer|min:5|max:120',
            'buffer_time' => 'nullable|integer|min:0',
            'require_kvkk' => 'nullable|boolean',
        ]);

        $settings = $workspace->settings ?? [];
        $settings['calendar'] = $validated;

        $workspace->update(['settings' => $settings]);

        return back()->with('success', __('Settings updated successfully.'));
    }

    public function store(Request $request)
    {
        $workspace = $this->current->get();
        abort_if($workspace === null, 404);

        $validated = $request->validate([
            'agent_id' => 'required|uuid|exists:agents,id',
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'appointment_at' => 'required|date',
            'reason' => 'nullable|string',
        ]);

        $appointment = $workspace->appointments()->create([
            ...$validated,
            'status' => 'confirmed',
        ]);

        // Trigger notification if email exists
        if ($appointment->email) {
            try {
                \Illuminate\Support\Facades\Notification::route('mail', $appointment->email)
                    ->notify(new \App\Notifications\AppointmentConfirmed($appointment));
            } catch (\Exception $e) {}
        }

        return back()->with('success', __('Appointment created successfully.'));
    }

    public function confirm(Appointment $appointment)
    {
        $appointment->update(['status' => 'confirmed']);

        if ($appointment->email) {
            try {
                \Illuminate\Support\Facades\Notification::route('mail', $appointment->email)
                    ->notify(new \App\Notifications\AppointmentConfirmed($appointment));
            } catch (\Exception $e) {}
        }

        return back()->with('success', __('Appointment confirmed.'));
    }

    public function cancel(Appointment $appointment)
    {
        $appointment->update(['status' => 'cancelled']);
        return back()->with('success', __('Appointment cancelled.'));
    }
}
