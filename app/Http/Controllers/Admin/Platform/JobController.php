<?php

namespace App\Http\Controllers\Admin\Platform;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Platform admin's view onto the queue's failure ledger. Lets the operator
 * see what's broken, retry transient failures, or wipe a poison pill — all
 * without shelling into tinker.
 */
class JobController
{
    public function failed(Request $request): Response
    {
        $rows = DB::table('failed_jobs')
            ->orderByDesc('failed_at')
            ->limit(200)
            ->get()
            ->map(function ($r) {
                $payload = json_decode((string) $r->payload, true);

                return [
                    'id' => $r->id,
                    'uuid' => $r->uuid,
                    'connection' => $r->connection,
                    'queue' => $r->queue,
                    'job' => is_array($payload) ? ($payload['displayName'] ?? '?') : '?',
                    'failed_at' => $r->failed_at,
                    'exception_first_line' => $this->firstExceptionLine((string) $r->exception),
                ];
            });

        return Inertia::render('admin/jobs/failed', [
            'jobs' => $rows,
            'total' => DB::table('failed_jobs')->count(),
        ]);
    }

    /**
     * Returns the full payload + exception for one failed-job row, so the
     * UI can show a stack trace on demand without bloating the index page.
     */
    public function show(string $uuid): JsonResponse
    {
        $row = DB::table('failed_jobs')->where('uuid', $uuid)->first();
        if ($row === null) {
            return response()->json(['error' => ['code' => 'not_found']], 404);
        }

        $payload = json_decode((string) $row->payload, true);

        return response()->json([
            'data' => [
                'uuid' => $row->uuid,
                'connection' => $row->connection,
                'queue' => $row->queue,
                'job' => is_array($payload) ? ($payload['displayName'] ?? '?') : '?',
                'failed_at' => $row->failed_at,
                'exception' => (string) $row->exception,
                'data_keys' => is_array($payload['data']['command'] ?? null) ? array_keys($payload['data']['command']) : [],
            ],
        ]);
    }

    public function retry(string $uuid): RedirectResponse
    {
        Artisan::call('queue:retry', ['id' => $uuid]);

        return back()->with('success', 'Retry dispatched.');
    }

    public function retryAll(): RedirectResponse
    {
        Artisan::call('queue:retry', ['id' => ['all']]);

        return back()->with('success', 'All queue failures retried.');
    }

    public function forget(string $uuid): RedirectResponse
    {
        Artisan::call('queue:forget', ['id' => $uuid]);

        return back()->with('success', 'Queue failure removed.');
    }

    public function flush(): RedirectResponse
    {
        Artisan::call('queue:flush');

        return back()->with('success', 'Queue-failure ledger cleared.');
    }

    private function firstExceptionLine(string $exception): string
    {
        $line = strtok($exception, "\n") ?: '';

        return mb_substr($line, 0, 280);
    }
}
