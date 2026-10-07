<?php

namespace App\Actions\Workspaces;

use App\Models\Plan;
use App\Models\PlanSubscription;
use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceUser;
use Illuminate\Support\Str;

class CreateWorkspaceForUser
{
    /**
     * Create a default workspace for the user, owner membership,
     * and a free-plan subscription. Caller is responsible for
     * wrapping in a transaction.
     */
    public function handle(User $user, ?string $name = null): Workspace
    {
        $workspaceName = $name ?? trim((string) $user->name).'\'s Workspace';
        if ($workspaceName === '\'s Workspace') {
            $workspaceName = 'My Workspace';
        }

        $freePlan = Plan::query()
            ->where('slug', 'like', 'free-%')
            ->orWhere('slug', 'free')
            ->orWhere('name', 'Free')
            ->first();

        $freePlan ??= Plan::create([
            'name' => 'Free',
            'slug' => 'free',
            'monthly_conversations' => 100,
            'price_cents' => 0,
            'features' => [],
            'is_active' => true,
        ]);

        $workspace = Workspace::create([
            'name' => $workspaceName,
            'slug' => Str::slug($workspaceName).'-'.Str::random(6),
            'plan_id' => $freePlan->id,
            'owner_user_id' => $user->id,
            'settings' => [],
        ]);

        WorkspaceUser::create([
            'workspace_id' => $workspace->id,
            'user_id' => $user->id,
            'role' => 'owner',
            'invited_at' => now(),
            'accepted_at' => now(),
        ]);

        PlanSubscription::create([
            'workspace_id' => $workspace->id,
            'plan_id' => $freePlan->id,
            'status' => 'active',
            'current_period_end' => now()->addMonth(),
            'cancel_at_period_end' => false,
        ]);

        $user->forceFill(['default_workspace_id' => $workspace->id])->save();

        return $workspace;
    }
}
