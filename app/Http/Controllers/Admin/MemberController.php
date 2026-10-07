<?php

namespace App\Http\Controllers\Admin;

use App\Mail\WorkspaceInvitation;
use App\Models\Invitation;
use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceUser;
use App\Support\CurrentWorkspace;
use App\Support\Pagination;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class MemberController
{
    public function __construct(private CurrentWorkspace $current) {}

    public function index(Request $request)
    {
        $workspace = $this->resolveCurrent();
        $request->user()->can('manageMembers', $workspace) || abort(403);

        $q = trim((string) $request->query('q', ''));

        $membersQuery = $workspace->workspaceUsers()->with('user');

        if ($q !== '') {
            $like = "%{$q}%";
            $membersQuery->whereHas('user', function ($u) use ($like) {
                $u->where('name', 'like', $like)
                    ->orWhere('email', 'like', $like);
            });
        }

        $paginator = $membersQuery->paginate(25)->withQueryString();

        return inertia('app/settings/members', [
            'members' => $paginator->items(),
            'pagination' => Pagination::meta($paginator),
            'filters' => ['q' => $q],
            'pendingInvitations' => Invitation::query()
                ->where('workspace_id', $workspace->id)
                ->whereNull('accepted_at')
                ->where('expires_at', '>', now())
                ->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $workspace = $this->resolveCurrent();
        $request->user()->can('manageMembers', $workspace) || abort(403);

        $data = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'role' => ['required', 'in:admin,editor,viewer'],
        ]);

        // If the email already belongs to a member, reject.
        $existingMember = $workspace->workspaceUsers()
            ->whereHas('user', fn ($q) => $q->where('email', $data['email']))
            ->exists();
        if ($existingMember) {
            throw ValidationException::withMessages(['email' => __('This user is already a member.')]);
        }

        // If the email already belongs to a registered user, add directly.
        $existingUser = User::where('email', $data['email'])->first();
        if ($existingUser !== null) {
            WorkspaceUser::create([
                'workspace_id' => $workspace->id,
                'user_id' => $existingUser->id,
                'role' => $data['role'],
                'invited_at' => now(),
                'accepted_at' => now(),
            ]);

            return back()->with('success', __('Member added.'));
        }

        $invitation = Invitation::create([
            'workspace_id' => $workspace->id,
            'email' => $data['email'],
            'role' => $data['role'],
            'token' => Str::random(48),
            'expires_at' => now()->addDays(7),
            'invited_by_user_id' => $request->user()->id,
        ]);

        Mail::to($data['email'])->queue(new WorkspaceInvitation($invitation));

        return back()->with('success', __('Invitation sent.'));
    }

    public function destroy(Request $request, WorkspaceUser $member): RedirectResponse
    {
        $workspace = $this->resolveCurrent();
        $request->user()->can('manageMembers', $workspace) || abort(403);
        abort_if($member->workspace_id !== $workspace->id, 404);

        $member->delete();

        return back()->with('success', __('Member removed.'));
    }

    private function resolveCurrent(): Workspace
    {
        $workspace = $this->current->get();
        abort_if($workspace === null, 404);

        return $workspace;
    }
}
