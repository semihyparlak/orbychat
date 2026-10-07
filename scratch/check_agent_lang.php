<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Agent;

$agentId = '019e2654-ff7a-72fc-9999-caa8f92e847b';
$agent = Agent::query()->withoutWorkspaceScope()->find($agentId);

if ($agent) {
    echo "Agent Name: " . $agent->name . "\n";
    echo "Language Default: " . ($agent->language_default ?? 'NULL') . "\n";
    echo "Workspace ID: " . $agent->workspace_id . "\n";
} else {
    echo "Agent not found.\n";
}
