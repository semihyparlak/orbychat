<?php

namespace App\Http\Controllers\Internal;

use App\Models\AppSetting;
use App\Models\CronTickLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

/**
 * External cron endpoint. Cloudflare Workers Cron Triggers (free tier)
 * hit this URL every minute with a shared-secret header; the handler
 * processes a bounded batch of queued jobs and returns the stats.
 *
 * Designed for cPanel / shared hosting where long-running
 * `queue:work` daemons get killed and the system cron is flaky.
 *
 * Auth: a single shared secret in `INTERNAL_QUEUE_TOKEN` env var.
 * Set it on both the Laravel host and the Cloudflare Worker (as a
 * secret). Without the env var the endpoint returns 503 — never
 * accept un-authenticated calls.
 */
class QueueTickController
{
    public function __invoke(Request $request): JsonResponse
    {
        @set_time_limit(0);
        @ignore_user_abort(true);

        // Token resolution priority:
        //   1. app_settings.internal_queue_token (set by the admin
        //      "Deploy Cron Worker" button — primary path).
        //   2. config('services.internal.queue_token') (manual deploys).
        //   3. INTERNAL_QUEUE_TOKEN env var (legacy / .env path).
        $expected = '';
        try {
            $stored = AppSetting::singleton()->internal_queue_token;
            if (is_string($stored) && $stored !== '') {
                $expected = $stored;
            }
        } catch (\Throwable) {
            // App settings table may not exist on a fresh install.
        }
        if ($expected === '') {
            $expected = (string) (config('services.internal.queue_token') ?: env('INTERNAL_QUEUE_TOKEN', ''));
        }
        if ($expected === '') {
            return response()->json([
                'error' => [
                    'code' => 'queue_tick_disabled',
                    'message' => 'No INTERNAL_QUEUE_TOKEN configured. Use System Settings → Cron worker → Deploy to set one up automatically, or set INTERNAL_QUEUE_TOKEN in .env.',
                ],
            ], 503);
        }

        $provided = (string) ($request->header('X-OrbyChat-Token') ?? $request->bearerToken() ?? '');
        // Constant-time compare so attackers can't time-side-channel.
        if (! hash_equals($expected, $provided)) {
            return response()->json([
                'error' => ['code' => 'unauthorized'],
            ], 401);
        }

        // Accept optional overrides from the caller. Defaults are tuned
        // for a 1-minute Cloudflare cron: process up to 20 jobs in 25s
        // so we finish well before the next tick fires.
        $queues = (string) $request->input('queues', 'crawl,index,default');
        $maxJobs = (int) $request->input('max_jobs', 20);
        $maxTime = (int) $request->input('max_time', 120);

        // Suppress all PHP output — Artisan::call captures cleanly via
        // Artisan::output(), but we don't want the worker's per-job
        // stdout writes leaking into the JSON response.
        $exitCode = Artisan::call('orbychat:queue-tick', [
            '--queues' => $queues,
            '--max-jobs' => $maxJobs,
            '--max-time' => $maxTime,
        ]);

        // The command's last line is a JSON status object.
        $output = trim(Artisan::output());
        $lastLine = '';
        foreach (array_reverse(explode("\n", $output)) as $line) {
            $line = trim($line);
            if ($line !== '' && str_starts_with($line, '{')) {
                $lastLine = $line;
                break;
            }
        }
        $stats = $lastLine !== '' ? json_decode($lastLine, true) : null;

        // Record this tick so the admin can see it in their own
        // dashboard. Auto-prune to keep the table tiny (200 rows ≈ 3.5
        // hours of every-minute ticks at most).
        if (is_array($stats)) {
            try {
                CronTickLog::create([
                    'received_at' => now(),
                    'processed' => (int) ($stats['processed'] ?? 0),
                    'failed_in_tick' => (int) ($stats['failed_in_tick'] ?? 0),
                    'remaining_pending' => (int) ($stats['remaining_pending'] ?? 0),
                    'failed_total' => (int) ($stats['failed_total'] ?? 0),
                    'elapsed_ms' => (int) round(((float) ($stats['elapsed_s'] ?? 0)) * 1000),
                    'source' => $request->input('source', 'cron'),
                ]);
                // Keep only the most recent 200 rows. One small DELETE
                // per tick is well below noise floor on any DB.
                $cutoffId = (int) DB::table('cron_tick_logs')
                    ->orderByDesc('id')
                    ->offset(200)
                    ->limit(1)
                    ->value('id');
                if ($cutoffId > 0) {
                    DB::table('cron_tick_logs')->where('id', '<=', $cutoffId)->delete();
                }
            } catch (\Throwable) {
                // Logging is best-effort; never fail the tick because
                // the log table couldn't be written.
            }
        }

        return response()->json([
            'data' => [
                'exit_code' => $exitCode,
                'stats' => is_array($stats) ? $stats : null,
            ],
        ]);
    }
}
