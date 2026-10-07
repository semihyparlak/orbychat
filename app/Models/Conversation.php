<?php

namespace App\Models;

use App\Concerns\BelongsToAgent;
use App\Concerns\HasUuidV7;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Conversation extends Model
{
    use BelongsToAgent;
    use HasFactory;
    use HasUuidV7;

    protected $fillable = [
        'agent_id', 'visitor_id', 'page_url', 'lang', 'started_at',
        'ended_at', 'cleared_at', 'message_count', 'is_lead', 'is_playground',
        'variant_id', 'attribution', 'claimed_by_user_id', 'claimed_at',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'cleared_at' => 'datetime',
        'message_count' => 'integer',
        'is_lead' => 'boolean',
        'is_playground' => 'boolean',
        'attribution' => 'array',
        'claimed_at' => 'datetime',
    ];

    public function visitor(): BelongsTo
    {
        return $this->belongsTo(Visitor::class);
    }

    public function claimedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'claimed_by_user_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function lead(): HasOne
    {
        return $this->hasOne(Lead::class);
    }
}
