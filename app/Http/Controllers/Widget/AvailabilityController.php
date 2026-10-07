<?php

namespace App\Http\Controllers\Widget;

use App\Http\Controllers\Controller;
use App\Models\Agent;
use Illuminate\Http\Request;

class AvailabilityController extends Controller
{
    public function index(Request $request)
    {
        $agentId = $request->query('agent_id');
        $agent = Agent::find($agentId);

        if (!$agent) {
            return response()->json(['error' => 'Agent not found'], 404);
        }

        $workspace = $agent->workspace;
        $settings = $workspace->settings['calendar'] ?? [
            'working_days' => [1, 2, 3, 4, 5],
            'working_hours_start' => '09:00',
            'working_hours_end' => '17:00',
        ];

        $timezone = $settings['timezone'] ?? config('app.timezone');
        $bookedSlots = [];
        $date = $request->query('date');
        if ($date) {
            $bookedSlots = \App\Models\Appointment::where('agent_id', $agentId)
                ->get()
                ->filter(function($a) use ($date, $timezone) {
                    return $a->appointment_at->timezone($timezone)->format('Y-m-d') === $date;
                })
                ->map(fn($a) => $a->appointment_at->timezone($timezone)->format('H:i'))
                ->values()
                ->toArray();
        }

        return response()->json([
            'settings' => $settings,
            'booked_slots' => $bookedSlots,
        ]);
    }
}
