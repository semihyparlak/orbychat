<?php

namespace App\Http\Controllers\Widget;

use App\Jobs\Leads\RouteLeadJob;
use App\Models\Conversation;
use App\Models\Lead;
use App\Services\Widget\WidgetJwt;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeadController
{
    public function __construct(private WidgetJwt $jwt) {}

    public function __invoke(Request $request): JsonResponse
    {
        $token = $request->bearerToken() ?? $request->header('X-Widget-Token');
        if (! is_string($token)) {
            return response()->json(['error' => ['code' => 'missing_token']], 401);
        }
        try {
            $claims = $this->jwt->verify($token);
        } catch (\Throwable $e) {
            return response()->json(['error' => ['code' => 'invalid_token']], 401);
        }

        $data = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'name' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'fields' => ['nullable', 'array'],
        ]);

        $conversationId = (string) ($claims['conversation_id'] ?? '');
        $conversation = Conversation::query()->withoutWorkspaceScope()->findOrFail($conversationId);

        // Two-tier dedup so a visitor who submits the form twice doesn't
        // pollute the inbox:
        //   1. Same conversation → always update that lead.
        //   2. Different conversation, same (agent_id, normalized email)
        //      → reattach the lead to the new conversation, update fields.
        // Otherwise → fresh Lead.
        $email = strtolower(trim((string) $data['email']));

        $existing = Lead::query()->withoutWorkspaceScope()
            ->where('conversation_id', $conversationId)
            ->first();

        if ($existing === null) {
            $existing = Lead::query()->withoutWorkspaceScope()
                ->where('agent_id', $conversation->agent_id)
                ->whereRaw('LOWER(email) = ?', [$email])
                ->first();
        }

        if ($existing === null) {
            $lead = Lead::create([
                'conversation_id' => $conversation->id,
                'agent_id' => $conversation->agent_id,
                'email' => $email,
                'name' => $data['name'] ?? null,
                'phone' => $data['phone'] ?? null,
                'fields' => $data['fields'] ?? [],
                'status' => 'new',
            ]);
        } else {
            $existing->forceFill([
                'conversation_id' => $conversation->id,
                'email' => $email,
                'name' => $data['name'] ?? $existing->name,
                'phone' => $data['phone'] ?? $existing->phone,
                'fields' => array_merge((array) ($existing->fields ?? []), $data['fields'] ?? []),
            ])->save();
            $lead = $existing;
        }

        $conversation->forceFill(['is_lead' => true])->save();

        // Medical Booking Integration:
        // If the lead fields contain appointment data, we mirror it into
        // the appointments table so it shows up in the Calendar dashboard.
        $fields = (array) ($lead->fields ?? []);
        $date = $fields['appointment_date'] ?? null;
        $time = $fields['appointment_time'] ?? null;
        
        $appointmentAt = null;
        if ($date) {
            $appointmentAt = $time ? "$date $time" : $date;
        }

        if ($appointmentAt) {
            try {
                $agent = $conversation->agent;
                $workspace = $agent->workspace;
                $tz = $workspace->settings['calendar']['timezone'] ?? config('app.timezone');
                
                $parsedAt = \Carbon\Carbon::parse($appointmentAt, $tz)->timezone(config('app.timezone'));

                \App\Models\Appointment::updateOrCreate(
                    ['lead_id' => $lead->id],
                    [
                        'workspace_id' => $agent->workspace_id,
                        'agent_id' => $agent->id,
                        'name' => $lead->name ?? 'Patient',
                        'email' => $lead->email,
                        'phone' => $lead->phone,
                        'appointment_at' => $parsedAt,
                        'reason' => $fields['reason'] ?? $fields['appointment_reason'] ?? null,
                        'status' => 'pending',
                    ]
                );
            } catch (\Throwable $e) {
                // Silently fail appointment creation to not block lead capture
            }
        }

        RouteLeadJob::dispatch($lead->id);

        return response()->json(['data' => ['id' => $lead->id, 'status' => $lead->status]]);
    }
}
