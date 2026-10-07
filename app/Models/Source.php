<?php

namespace App\Models;

use App\Concerns\BelongsToAgent;
use App\Concerns\HasUuidV7;
use App\Observers\SourceObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[ObservedBy(SourceObserver::class)]
class Source extends Model
{
    use BelongsToAgent;
    use HasFactory;
    use HasUuidV7;

    protected $fillable = [
        'agent_id', 'type', 'status', 'config',
        'last_synced_at', 'error',
    ];

    protected $casts = [
        'config' => 'array',
        'last_synced_at' => 'datetime',
    ];

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }
}
