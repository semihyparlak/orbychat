<?php

namespace App\Http\Controllers\Admin\Platform;

use App\Enums\PlatformRole;
use App\Models\User;
use App\Support\Pagination;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController
{
    public function index(Request $request): Response
    {
        $q = trim((string) $request->query('q', ''));

        $query = User::query()
            ->withCount(['workspaces', 'ownedWorkspaces'])
            ->latest();

        if ($q !== '') {
            $query->where(function ($w) use ($q) {
                $w->where('name', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%");
            });
        }

        $paginator = $query->paginate(25)->withQueryString();

        $rows = collect($paginator->items())
            ->map(fn (User $u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $u->role?->value ?? PlatformRole::Customer->value,
                'workspaces_count' => $u->workspaces_count,
                'owned_count' => $u->owned_workspaces_count,
                'created_at' => $u->created_at?->toIso8601String(),
            ]);

        return Inertia::render('admin/users/index', [
            'users' => $rows,
            'pagination' => Pagination::meta($paginator),
            'filters' => ['q' => $q],
        ]);
    }

    public function updateRole(Request $request, User $user): RedirectResponse
    {
        $data = $request->validate([
            'role' => ['required', 'in:customer,super_admin'],
        ]);

        // Don't let an admin demote themselves accidentally — refuse if they're
        // the only super_admin left.
        if ($user->id === $request->user()->id && $data['role'] === PlatformRole::Customer->value) {
            $remaining = User::query()
                ->where('role', PlatformRole::SuperAdmin->value)
                ->where('id', '!=', $user->id)
                ->count();
            if ($remaining === 0) {
                return back()->with('error', 'You are the last super_admin — promote someone else first.');
            }
        }

        $user->forceFill(['role' => $data['role']])->save();

        return back()->with('success', "{$user->email} is now {$data['role']}.");
    }
}
