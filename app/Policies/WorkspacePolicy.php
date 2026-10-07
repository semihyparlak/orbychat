<?php

namespace App\Policies;

use App\Enums\WorkspaceRole;
use App\Models\User;
use App\Models\Workspace;
use App\Support\Tenancy;

class WorkspacePolicy
{
    public function view(User $user, Workspace $workspace): bool
    {
        return Tenancy::isMember($user, $workspace);
    }

    public function update(User $user, Workspace $workspace): bool
    {
        $role = Tenancy::roleFor($user, $workspace);

        return $role !== null && $role->isAtLeast(WorkspaceRole::Admin);
    }

    public function delete(User $user, Workspace $workspace): bool
    {
        return Tenancy::roleFor($user, $workspace) === WorkspaceRole::Owner;
    }

    public function manageMembers(User $user, Workspace $workspace): bool
    {
        return Tenancy::roleFor($user, $workspace)?->canManageMembers() === true;
    }

    public function manageBilling(User $user, Workspace $workspace): bool
    {
        return Tenancy::roleFor($user, $workspace)?->canManageBilling() === true;
    }
}
