<?php

namespace App\Models;

use App\Concerns\HasUuidV7;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    use HasFactory;
    use HasUuidV7;

    protected $fillable = [
        'conversation_id', 'role', 'content', 'citations', 'confidence',
        'tokens_in', 'tokens_out', 'latency_ms', 'model',
        'feedback', 'feedback_reason',
    ];

    protected $casts = [
        'citations' => 'array',
        'confidence' => 'float',
        'tokens_in' => 'integer',
        'tokens_out' => 'integer',
        'latency_ms' => 'integer',
        'feedback' => 'integer',
    ];

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }
}
