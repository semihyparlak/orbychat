<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Source;
use App\Jobs\Crawl\CrawlSourceJob;

echo "Indexing started...\n";

$sources = Source::where('status', 'pending')->orWhere('status', 'failed')->get();

foreach ($sources as $source) {
    echo "Processing Source ID: {$source->id} ({$source->type})\n";
    try {
        // Run the job synchronously
        (new CrawlSourceJob($source->id))->handle();
        echo "Success for source {$source->id}\n";
    } catch (\Exception $e) {
        echo "Error for source {$source->id}: " . $e->getMessage() . "\n";
    }
}

echo "Indexing finished. Please check the dashboard chars count.\n";
