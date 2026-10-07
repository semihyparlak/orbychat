<?php

namespace App\Policies;

use App\Models\Lead;
use App\Models\User;
use App\Support\Tenancy;

class LeadPolicy
{
    public function view(User $user, Lead $lead): bool
    {
        $workspace = $lead->agent()->withoutGlobalScopes()->first()?->workspace()->withoutGlobalScopes()->first();
        if ($workspace === null) {
            return false;
        }

        return Tenancy::isMember($user, $workspace);
    }

    public function update(User $user, Lead $lead): bool
    {
        $workspace = $lead->agent()->withoutGlobalScopes()->first()?->workspace()->withoutGlobalScopes()->first();
        if ($workspace === null) {
            return false;
        }

        return Tenancy::roleFor($user, $workspace)?->canManageAgents() === true;
    }
}
