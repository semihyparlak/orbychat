<?php

namespace App\Models;

use App\Concerns\HasUuidV7;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Cashier\Billable;

class Workspace extends Model
{
    use Billable;
    use HasFactory;
    use HasUuidV7;
    use SoftDeletes;

    protected $fillable = [
        'name', 'slug', 'plan_id', 'owner_user_id',
        'stripe_customer_id', 'stripe_subscription_id',
        'payment_gateway', 'paypal_subscription_id', 'razorpay_subscription_id',
        'settings', 'widget_defaults',
    ];

    protected $casts = [
        'settings' => 'array',
        'widget_defaults' => 'array',
    ];

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_user_id');
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'workspace_users')
            ->withPivot('role', 'invited_at', 'accepted_at')
            ->withTimestamps();
    }

    public function workspaceUsers(): HasMany
    {
        return $this->hasMany(WorkspaceUser::class);
    }

    public function agents(): HasMany
    {
        return $this->hasMany(Agent::class);
    }

    public function planSubscription(): HasOne
    {
        return $this->hasOne(PlanSubscription::class);
    }
}
