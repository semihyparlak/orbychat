<?php

namespace App\Support;

use Illuminate\Support\Str;

class CrawlDebugLog
{
    /**
     * @param  array<string, mixed>  $context
     */
    public static function write(string $event, array $context = []): void
    {
        try {
            $line = '['.now()->toDateTimeString().'] '.$event.' '.json_encode(
                $context,
                JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PARTIAL_OUTPUT_ON_ERROR,
            ).PHP_EOL;

            file_put_contents(storage_path('logs/crawl-debug.log'), $line, FILE_APPEND | LOCK_EX);
        } catch (\Throwable $e) {
            // Logging is best-effort. In isolated unit tests there may be no
            // Laravel facade root, so swallowing is safer than breaking
            // extraction itself.
        }
    }

    public static function preview(string $value, int $limit = 900): string
    {
        $value = preg_replace('/\s+/u', ' ', trim($value)) ?? '';

        return Str::limit($value, $limit);
    }
}
