<?php

namespace App\Support;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PlatformAdminHeader
{
    /**
     * @return array<string, mixed>
     */
    public function payload(): array
    {
        $checks = [
            $this->failedJobsCheck(),
            $this->stripeCheck(),
            $this->llmCheck(),
            $this->vectorCheck(),
            $this->mailCheck(),
            $this->reverbCheck(),
            $this->cacheCheck(),
        ];

        $healthyCount = count(array_filter($checks, fn (array $check) => $check['ok']));
        $totalChecks = count($checks);
        $score = (int) round(($healthyCount / max($totalChecks, 1)) * 100);

        $notifications = array_values(array_map(
            fn (array $check) => [
                'key' => $check['key'],
                'title' => $check['title'],
                'body' => $check['message'],
                'severity' => $check['severity'],
                'href' => $check['href'],
            ],
            array_filter($checks, fn (array $check) => ! $check['ok']),
        ));

        return [
            'site_health' => [
                'score' => $score,
                'label' => $this->scoreLabel($score),
                'status' => $this->scoreStatus($score),
                'ok_checks' => $healthyCount,
                'total_checks' => $totalChecks,
                'issues_count' => count($notifications),
            ],
            'notifications' => [
                'unread_count' => count($notifications),
                'items' => $notifications !== []
                    ? $notifications
                    : [[
                        'key' => 'all_clear',
                        'title' => 'All platform checks look healthy',
                        'body' => 'No urgent admin actions are currently waiting in the navbar.',
                        'severity' => 'info',
                        'href' => route('settings.system.index', absolute: false),
                    ]],
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function failedJobsCheck(): array
    {
        $count = (int) DB::table('failed_jobs')->count();

        return [
            'key' => 'failed_jobs',
            'title' => $count > 0
                ? $count.' queue '.Str::plural('failure', $count).' '.($count === 1 ? 'needs' : 'need').' attention'
                : 'Queue ledger is clean',
            'message' => $count > 0
                ? 'Open queue failures to retry transient failures or remove poison pills.'
                : 'No queue failures are waiting in the queue ledger.',
            'severity' => 'critical',
            'ok' => $count === 0,
            'href' => route('admin.jobs.failed', absolute: false),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function stripeCheck(): array
    {
        $configured = (string) (config('cashier.secret') ?: env('STRIPE_SECRET', '')) !== '';

        return [
            'key' => 'stripe',
            'title' => $configured ? 'Stripe billing is connected' : 'Stripe billing is not connected',
            'message' => $configured
                ? 'Subscription billing keys are present.'
                : 'Add a Stripe secret key before using subscription billing.',
            'severity' => 'warning',
            'ok' => $configured,
            'href' => route('settings.system.index', absolute: false),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function llmCheck(): array
    {
        $provider = (string) (config('services.llm.provider') ?: env('LLM_PROVIDER', ''));
        $cfAccount = (string) (config('services.cloudflare.account_id') ?: env('CLOUDFLARE_ACCOUNT_ID', ''));
        $cfToken = (string) (config('services.cloudflare.api_token') ?: env('CLOUDFLARE_API_TOKEN', ''));
        $openAiKey = (string) (config('services.openai.key') ?: env('OPENAI_API_KEY', ''));
        $openRouterKey = (string) (config('services.openrouter.key') ?: env('OPENROUTER_API_KEY', ''));

        $configured = match (true) {
            $provider === 'cloudflare' || ($provider === '' && $cfAccount !== '' && $cfToken !== '') => true,
            $provider === 'openrouter' && $openRouterKey !== '' => true,
            $openAiKey !== '' => true,
            default => false,
        };

        return [
            'key' => 'llm',
            'title' => $configured ? 'LLM provider is configured' : 'LLM provider is missing',
            'message' => $configured
                ? 'At least one chat provider is ready for the hot path.'
                : 'Configure Cloudflare, OpenAI, or OpenRouter for production chat responses.',
            'severity' => 'warning',
            'ok' => $configured,
            'href' => route('settings.system.index', absolute: false),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function vectorCheck(): array
    {
        $provider = (string) (config('services.vector.provider') ?: env('VECTOR_PROVIDER', ''));
        $cfAccount = (string) (config('services.cloudflare.account_id') ?: env('CLOUDFLARE_ACCOUNT_ID', ''));
        $qdrantUrl = (string) env('QDRANT_URL', '');

        $configured = match (true) {
            $provider === 'cloudflare' || ($provider === '' && $cfAccount !== '') => true,
            $provider === 'qdrant' || ($provider === '' && $qdrantUrl !== '') => true,
            default => false,
        };

        return [
            'key' => 'vector',
            'title' => $configured ? 'Vector search is configured' : 'Vector search is missing',
            'message' => $configured
                ? 'A vector provider is available for retrieval.'
                : 'Configure Cloudflare Vectorize or Qdrant before relying on retrieval.',
            'severity' => 'warning',
            'ok' => $configured,
            'href' => route('settings.system.index', absolute: false),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function mailCheck(): array
    {
        $driver = (string) config('mail.default', '');
        $mailer = (array) config("mail.mailers.{$driver}", []);
        $fromAddress = (string) (config('mail.from.address') ?? '');

        $configured = $driver !== ''
            && $fromAddress !== ''
            && ($driver !== 'smtp' || (string) ($mailer['host'] ?? '') !== '');

        return [
            'key' => 'mail',
            'title' => $configured ? 'Mail delivery is configured' : 'Mail delivery needs attention',
            'message' => $configured
                ? 'Outbound mail has a driver and sender configured.'
                : 'Set the mail driver, sender address, and SMTP host before relying on email.',
            'severity' => 'warning',
            'ok' => $configured,
            'href' => route('settings.system.index', absolute: false),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function reverbCheck(): array
    {
        $configured = env('REVERB_APP_KEY') !== null && env('REVERB_APP_KEY') !== '';

        return [
            'key' => 'reverb',
            'title' => $configured ? 'Realtime transport is configured' : 'Realtime transport is missing',
            'message' => $configured
                ? 'Reverb credentials are present for websocket delivery.'
                : 'Add Reverb credentials so admin and widget realtime features can connect reliably.',
            'severity' => 'warning',
            'ok' => $configured,
            'href' => route('settings.system.index', absolute: false),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function cacheCheck(): array
    {
        $driver = (string) config('cache.default', '');
        $configured = $driver !== ''
            && ($driver !== 'redis' || (string) env('REDIS_HOST', '') !== '');

        return [
            'key' => 'cache',
            'title' => $configured ? 'Cache layer is available' : 'Cache layer needs attention',
            'message' => $configured
                ? 'The application has a cache driver configured.'
                : 'Configure the cache driver so queue and session flows stay responsive.',
            'severity' => 'warning',
            'ok' => $configured,
            'href' => route('settings.system.index', absolute: false),
        ];
    }

    private function scoreLabel(int $score): string
    {
        return match (true) {
            $score >= 90 => 'Strong',
            $score >= 70 => 'Stable',
            $score >= 50 => 'Watchlist',
            default => 'Critical',
        };
    }

    private function scoreStatus(int $score): string
    {
        return match (true) {
            $score >= 90 => 'healthy',
            $score >= 70 => 'warning',
            default => 'critical',
        };
    }
}
