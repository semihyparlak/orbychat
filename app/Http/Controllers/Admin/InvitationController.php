<?php

namespace App\Http\Controllers\Admin;

use App\Models\Invitation;
use App\Models\WorkspaceUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class InvitationController
{
    public function show(Request $request, string $token)
    {
        $invitation = Invitation::query()
            ->where('token', $token)
            ->whereNull('accepted_at')
            ->where('expires_at', '>', now())
            ->firstOrFail();

        return inertia('auth/accept-invitation', [
            'invitation' => [
                'email' => $invitation->email,
                'role' => $invitation->role,
                'workspace' => $invitation->workspace->only('id', 'name'),
                'token' => $invitation->token,
            ],
        ]);
    }

    public function accept(Request $request, string $token): RedirectResponse
    {
        $invitation = Invitation::query()
            ->where('token', $token)
            ->whereNull('accepted_at')
            ->where('expires_at', '>', now())
            ->firstOrFail();

        $user = $request->user();
        if ($user === null) {
            return redirect()->route('login', ['email' => $invitation->email]);
        }

        if ($user->email !== $invitation->email) {
            abort(403, 'This invitation is for a different email.');
        }

        $alreadyMember = WorkspaceUser::where('workspace_id', $invitation->workspace_id)
            ->where('user_id', $user->id)
            ->exists();

        if (! $alreadyMember) {
            WorkspaceUser::create([
                'workspace_id' => $invitation->workspace_id,
                'user_id' => $user->id,
                'role' => $invitation->role,
                'invited_at' => $invitation->created_at,
                'accepted_at' => now(),
            ]);
        }

        $invitation->forceFill(['accepted_at' => now()])->save();
        $user->forceFill(['default_workspace_id' => $invitation->workspace_id])->save();

        return redirect()->route('dashboard');
    }
}
