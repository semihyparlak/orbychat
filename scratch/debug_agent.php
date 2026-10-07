<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Agent;

$agentId = '019e2654-ff7a-72fc-9999-caa8f92e847b';
$agent = Agent::query()->withoutWorkspaceScope()->find($agentId);

$result = [];
if ($agent) {
    $result = [
        'name' => $agent->name,
        'language_default' => $agent->language_default,
        'theme' => $agent->theme,
    ];
} else {
    $result = ['error' => 'Agent not found'];
}

file_put_contents('scratch/agent_debug.json', json_encode($result, JSON_PRETTY_PRINT));
