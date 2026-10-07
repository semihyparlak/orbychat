<?php

namespace App\Models;

use App\Concerns\BelongsToAgent;
use App\Concerns\HasUuidV7;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CuratedAnswer extends Model
{
    use BelongsToAgent;
    use HasFactory;
    use HasUuidV7;

    protected $fillable = [
        'agent_id', 'question_pattern', 'answer', 'priority',
        'conditions', 'lang', 'enabled',
    ];

    protected $casts = [
        'conditions' => 'array',
        'priority' => 'integer',
        'enabled' => 'boolean',
    ];
}
