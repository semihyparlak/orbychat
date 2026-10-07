<?php

namespace App\Http\Controllers\Admin\Platform;

use App\Http\Controllers\Internal\QueueTickController;
use App\Models\AppSetting;
use App\Models\CronTickLog;
use App\Services\Cloudflare\WorkerDeployer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;

/**
 * Admin "Deploy Cron Worker" button. Uses the install's existing
 * Cloudflare credentials to push a Worker that drives the queue
 * via {@see QueueTickController}.
 *
 * Per OrbyChat install (per codecanyon buyer) — the Worker name is
 * derived from the app URL host so multiple installs on the same CF
 * account don't collide.
 */
class CronWorkerController
{
    public function __construct(private WorkerDeployer $deployer) {}

    public function deploy(Request $request): JsonResponse
    {
        $settings = AppSetting::singleton();

        $accountId = (string) ($settings->cloudflare_account_id ?: env('CLOUDFLARE_ACCOUNT_ID', ''));
        $apiToken = (string) ($settings->cloudflare_api_token ?: env('CLOUDFLARE_API_TOKEN', ''));

        if ($accountId === '' || $apiToken === '') {
            return response()->json([
                'error' => [
                    'code' => 'cloudflare_missing',
                    'message' => 'Set Cloudflare account ID and API token in System Settings → Cloudflare first.',
                ],
            ], 422);
        }

        // Derive a stable Worker name from the app URL. Hash so the
        // name is short, alphanumeric, and doesn't leak the host.
        $appUrl = rtrim((string) config('app.url'), '/');
        if ($appUrl === '') {
            return response()->json([
                'error' => [
                    'code' => 'app_url_missing',
                    'message' => 'APP_URL must be set in your environment.',
                ],
            ], 422);
        }
        $host = parse_url($appUrl, PHP_URL_HOST) ?: 'orbychat';
        $slug = strtolower(preg_replace('/[^a-z0-9]+/i', '-', $host)) ?? 'orbychat';
        $slug = trim($slug, '-');
        $workerName = 'orbychat-tick-'.substr($slug.'-'.substr(hash('sha256', $appUrl), 0, 8), 0, 50);

        // Generate (or reuse) the shared secret. Re-use lets the user
        // re-deploy without breaking running calls; rotate via the
        // explicit "Rotate token" action.
        $token = (string) ($settings->internal_queue_token ?? '');
        if ($token === '' || $request->boolean('rotate_token')) {
            $token = Str::random(48);
            $settings->internal_queue_token = $token;
            $settings->save();
            AppSetting::flushSingleton();
        }

        $callbackUrl = $appUrl.'/api/v1/internal/queue-tick';

        try {
            $result = $this->deployer->deploy(
                accountId: $accountId,
                apiToken: $apiToken,
                workerName: $workerName,
                callbackUrl: $callbackUrl,
                sharedToken: $token,
            );
        } catch (RuntimeException $e) {
            return response()->json([
                'error' => [
                    'code' => 'deploy_failed',
                    'message' => $e->getMessage(),
                ],
            ], 502);
        }

        $settings->cron_worker_name = $workerName;
        $settings->cron_worker_deployed_at = now();
        $settings->cron_worker_last_status_at = now();
        $settings->cron_worker_last_status = ['ok' => true, 'message' => 'Deployed.'];
        $settings->save();
        AppSetting::flushSingleton();

        return response()->json([
            'data' => [
                'ok' => true,
                'worker_name' => $workerName,
                'worker_url' => $result['worker_url'],
                'deployed_at' => $result['deployed_at'],
                'callback_url' => $callbackUrl,
                'cron_schedule' => '* * * * *',
            ],
        ]);
    }

    public function status(Request $request): JsonResponse
    {
        $settings = AppSetting::singleton();
        $health = $this->buildHealthSummary();

        $accountId = (string) ($settings->cloudflare_account_id ?: env('CLOUDFLARE_ACCOUNT_ID', ''));
        $apiToken = (string) ($settings->cloudflare_api_token ?: env('CLOUDFLARE_API_TOKEN', ''));
        $workerName = (string) ($settings->cron_worker_name ?? '');

        if ($workerName === '' || $accountId === '' || $apiToken === '') {
            return response()->json([
                'data' => array_merge([
                    'deployed' => false,
                    'reason' => 'never-deployed',
                ], $health),
            ]);
        }

        try {
            $info = $this->deployer->status($accountId, $apiToken, $workerName);
        } catch (RuntimeException $e) {
            return response()->json([
                'data' => array_merge([
                    'deployed' => null,
                    'error' => $e->getMessage(),
                ], $health),
            ]);
        }

        $settings->cron_worker_last_status_at = now();
        $settings->cron_worker_last_status = $info;
        $settings->save();
        AppSetting::flushSingleton();

        return response()->json([
            'data' => array_merge([
                'deployed' => $info['exists'],
                'schedules' => $info['schedules'],
                'worker_name' => $workerName,
                'deployed_at' => $settings->cron_worker_deployed_at?->toIso8601String(),
                'last_checked_at' => now()->toIso8601String(),
            ], $health),
        ]);
    }

    /**
     * Aggregates the cron_tick_logs table into a single struct the
     * admin UI can render as a "Worker health" panel — answers the
     * single question "is the Cloudflare Worker actually firing AND
     * actually doing work?"
     *
     * @return array{
     *   last_tick_at: ?string,
     *   seconds_since_last_tick: ?int,
     *   liveness: 'live'|'stale'|'dead'|'unknown',
     *   ticks_last_hour: int,
     *   ticks_last_24h: int,
     *   jobs_processed_last_hour: int,
     *   jobs_processed_last_24h: int,
     *   pending_jobs: int,
     *   failed_jobs: int,
     *   recent_ticks: array<int, array{at: string, processed: int, failed: int, remaining: int, ms: int}>,
     * }
     */
    private function buildHealthSummary(): array
    {
        $latest = CronTickLog::query()->orderByDesc('id')->first();
        $now = now();

        $secondsSince = $latest ? (int) $latest->received_at->diffInSeconds($now) : null;
        // > 90s = stale (cron is supposed to fire every 60s); > 5min = dead.
        $liveness = match (true) {
            $latest === null => 'unknown',
            $secondsSince !== null && $secondsSince <= 90 => 'live',
            $secondsSince !== null && $secondsSince <= 300 => 'stale',
            default => 'dead',
        };

        $hourAgo = $now->copy()->subHour();
        $dayAgo = $now->copy()->subDay();

        $ticksLastHour = (int) CronTickLog::query()->where('received_at', '>=', $hourAgo)->count();
        $ticksLast24h = (int) CronTickLog::query()->where('received_at', '>=', $dayAgo)->count();
        $jobsLastHour = (int) CronTickLog::query()->where('received_at', '>=', $hourAgo)->sum('processed');
        $jobsLast24h = (int) CronTickLog::query()->where('received_at', '>=', $dayAgo)->sum('processed');

        $pendingJobs = (int) DB::table('jobs')->count();
        $failedJobs = (int) DB::table('failed_jobs')->count();

        $recent = CronTickLog::query()
            ->orderByDesc('id')
            ->limit(20)
            ->get(['received_at', 'processed', 'failed_in_tick', 'remaining_pending', 'elapsed_ms'])
            ->map(fn ($r) => [
                'at' => $r->received_at?->toIso8601String(),
                'processed' => (int) $r->processed,
                'failed' => (int) $r->failed_in_tick,
                'remaining' => (int) $r->remaining_pending,
                'ms' => (int) $r->elapsed_ms,
            ])
            ->values()
            ->all();

        return [
            'last_tick_at' => $latest?->received_at?->toIso8601String(),
            'seconds_since_last_tick' => $secondsSince,
            'liveness' => $liveness,
            'ticks_last_hour' => $ticksLastHour,
            'ticks_last_24h' => $ticksLast24h,
            'jobs_processed_last_hour' => $jobsLastHour,
            'jobs_processed_last_24h' => $jobsLast24h,
            'pending_jobs' => $pendingJobs,
            'failed_jobs' => $failedJobs,
            'recent_ticks' => $recent,
        ];
    }

    public function destroy(): JsonResponse
    {
        $settings = AppSetting::singleton();

        $accountId = (string) ($settings->cloudflare_account_id ?: env('CLOUDFLARE_ACCOUNT_ID', ''));
        $apiToken = (string) ($settings->cloudflare_api_token ?: env('CLOUDFLARE_API_TOKEN', ''));
        $workerName = (string) ($settings->cron_worker_name ?? '');

        if ($workerName === '' || $accountId === '' || $apiToken === '') {
            return response()->json(['data' => ['ok' => true, 'message' => 'Nothing to remove.']]);
        }

        try {
            $this->deployer->destroy($accountId, $apiToken, $workerName);
        } catch (RuntimeException $e) {
            return response()->json([
                'error' => [
                    'code' => 'destroy_failed',
                    'message' => $e->getMessage(),
                ],
            ], 502);
        }

        $settings->cron_worker_name = null;
        $settings->cron_worker_deployed_at = null;
        $settings->cron_worker_last_status = ['ok' => true, 'message' => 'Removed.'];
        $settings->cron_worker_last_status_at = now();
        $settings->save();
        AppSetting::flushSingleton();

        return response()->json(['data' => ['ok' => true]]);
    }
}
