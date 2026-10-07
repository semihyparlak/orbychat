<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use ZipArchive;

class BuildWordPressPlugin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orbychat:build-wp-plugin';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Packages the OrbyChat WordPress plugin into a downloadable ZIP file.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Building OrbyChat WordPress Plugin...');

        $sourceDir = resource_path('integrations/wordpress');
        $outputDir = storage_path('app/public/integrations');
        $outputFile = $outputDir . '/orbychat-sales-ai.zip';

        if (!File::exists($outputDir)) {
            File::makeDirectory($outputDir, 0755, true);
        }

        if (!File::exists($sourceDir . '/orbychat-sales-ai.php')) {
            $this->error('Source plugin file not found in ' . $sourceDir);
            return 1;
        }

        $zip = new ZipArchive;

        if ($zip->open($outputFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) === TRUE) {
            // Add the main file into a folder named 'orbychat-sales-ai' inside the zip
            $zip->addFile($sourceDir . '/orbychat-sales-ai.php', 'orbychat-sales-ai/orbychat-sales-ai.php');
            
            // If we had more files (CSS/JS), we would add them here
            
            $zip->close();
            $this->info('Plugin built successfully: ' . $outputFile);
        } else {
            $this->error('Failed to create ZIP file.');
            return 1;
        }

        return 0;
    }
}
