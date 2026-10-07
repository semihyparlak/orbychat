<?php

namespace App\Models;

use App\Concerns\HasUuidV7;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    use HasFactory;
    use HasUuidV7;

    protected $fillable = [
        'name', 'slug', 'monthly_conversations', 'monthly_messages',
        'max_tokens_per_response', 'price_cents', 'interval',
        'stripe_price_id', 'stripe_product_id',
        'paypal_product_id', 'paypal_plan_id', 'razorpay_plan_id',
        'features', 'is_active',
    ];

    protected $casts = [
        'features' => 'array',
        'is_active' => 'boolean',
        'monthly_conversations' => 'integer',
        'monthly_messages' => 'integer',
        'max_tokens_per_response' => 'integer',
        'price_cents' => 'integer',
    ];

    public function workspaces(): HasMany
    {
        return $this->hasMany(Workspace::class);
    }

    /**
     * Whether this plan hides the "Powered by OrbyChat" footer in the
     * visitor widget. Driven off `features.remove_branding` so adding
     * new feature flags later doesn't require a schema change.
     */
    public function removesBranding(): bool
    {
        return (bool) (($this->features ?? [])['remove_branding'] ?? false);
    }
}
