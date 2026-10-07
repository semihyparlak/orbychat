<?php

namespace App\Jobs\Workflows;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;

/**
 * Outbound webhook from a `webhook` workflow step. Fire-and-forget;
 * this is queued so the SSE turn that triggered the workflow never
 * waits on the customer's slow webhook URL.
 *
 * Failures land in failed_jobs after the configured retry count and
 * the operator can inspect them at /admin/jobs/failed. We don't
 * surface webhook failures back to the workflow run — a webhook is a
 * side effect, not a step the visitor sees.
 */
class DispatchWebhookJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $timeout = 15;

    /**
     * @param  array<string, mixed>  $payload
     */
    public function __construct(
        public string $url,
        public string $method,
        public array $payload,
    ) {}

    public function handle(): void
    {
        $method = strtoupper($this->method) === 'GET' ? 'GET' : 'POST';

        $request = Http::timeout(10)
            ->acceptJson()
            ->withUserAgent('OrbyChatWorkflow/1.0')
            ->withHeaders(['Content-Type' => 'application/json']);

        if ($method === 'GET') {
            // GET can't carry a JSON body usefully; flatten into the
            // query string. Nested arrays serialize as PHP-style array
            // keys (a[b]=c) — fine for inbound webhooks on Zapier /
            // Make / typical no-code platforms.
            $request->get($this->url, $this->payload);

            return;
        }

        $request->post($this->url, $this->payload);
    }
}
