<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Daily re-crawl of indexed sources older than 7 days. Avoids cf rate limits
// by capping the batch and stagger-dispatching inside CrawlSourceJob.
Schedule::command('orbychat:refresh-stale-sources --days=7 --limit=200')
    ->dailyAt('03:30')
    ->withoutOverlapping()
    ->runInBackground();

// Weekly self-improvement: turn recurring unanswered questions into draft
// curated answers for the workspace owner to approve.
Schedule::command('orbychat:suggest-from-gaps --min-occurrences=3')
    ->weeklyOn(1, '04:00')
    ->withoutOverlapping()
    ->runInBackground();

// Hourly delta sync for OAuth sources (Notion pages, Google Docs).
// Website crawls run weekly via orbychat:refresh-stale-sources; this hits
// the integrations users expect to update much faster.
Schedule::command('orbychat:sync-oauth-sources --hours=1 --limit=500')
    ->hourly()
    ->withoutOverlapping()
    ->runInBackground();
