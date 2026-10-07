<?php

namespace App\Models;

use App\Concerns\BelongsToWorkspace;
use App\Concerns\HasUuidV7;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IntegrationConnection extends Model
{
    use BelongsToWorkspace;
    use HasFactory;
    use HasUuidV7;

    protected $fillable = [
        'workspace_id', 'kind', 'credentials_encrypted',
        'config', 'status', 'last_sync_at',
    ];

    protected $casts = [
        'credentials_encrypted' => 'encrypted:array',
        'config' => 'array',
        'last_sync_at' => 'datetime',
    ];
}
