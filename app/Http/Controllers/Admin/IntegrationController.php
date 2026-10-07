<?php

namespace App\Http\Controllers\Admin;

use App\Models\Agent;
use App\Models\IntegrationConnection;
use App\Models\Lead;
use App\Models\Source;
use App\Models\WebhookSubscription;
use App\Services\Integrations\SlackPusher;
use App\Support\CurrentWorkspace;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Workspace-level integrations: Slack (incoming webhook), with stubs ready
 * for HubSpot/Pipedrive once their OAuth flows are scoped.
 *
 * Slack today is the simplest pattern that actually works: the user pastes
 * an Incoming Webhook URL, we encrypt-at-rest in `credentials_encrypted`,
 * and RouteLeadJob calls SlackPusher on every lead capture.
 */
class IntegrationController
{
    public function __construct(private readonly CurrentWorkspace $current) {}

    public function index(Request $request): Response
    {
        $workspace = $this->current->get();
        abort_if($workspace === null, 404);
        $request->user()->can('manageMembers', $workspace) || abort(403);

        $agentIds = Agent::query()->where('workspace_id', $workspace->id)->pluck('id');

        $sourceCountsByType = Source::query()->withoutWorkspaceScope()
            ->whereIn('agent_id', $agentIds)
            ->where('status', 'indexed')
            ->selectRaw('type, count(*) as c')
            ->groupBy('type')
            ->pluck('c', 'type');

        // Slack lead alerts: count leads dispatched in the last 30 days where
        // routed_to recorded a Slack delivery (i.e. an integration was active
        // when the lead landed).
        $slackLeadsRecent = Lead::query()->withoutWorkspaceScope()
            ->whereIn('agent_id', $agentIds)
            ->where('routed_to', 'like', '%slack%')
            ->where('created_at', '>=', now()->subDays(30))
            ->count();

        $integrations = IntegrationConnection::query()
            ->where('workspace_id', $workspace->id)
            ->get()
            ->map(fn (IntegrationConnection $i) => [
                'id' => $i->id,
                'kind' => $i->kind,
                'is_configured' => $this->isConfigured($i),
                'webhook_hint' => in_array($i->kind, ['slack', 'shopify', 'ikas'])
                    ? $this->hintFor($i->credentials_encrypted['webhook_url'] ?? $i->credentials_encrypted['shop_domain'] ?? null)
                    : ($i->credentials_encrypted['workspace_name'] ?? null),
                'status' => $i->status,
                'last_sync_at' => $i->last_sync_at?->toIso8601String(),
                'summary' => $this->summaryFor($i->kind, $sourceCountsByType, $slackLeadsRecent),
            ]);

        // Add WordPress as a virtual integration if it's not in DB
        // since it's a push-based integration but we want to show it in UI.
        $integrations->push([
            'id' => 'wordpress-virtual',
            'kind' => 'wordpress',
            'is_configured' => !empty($workspace->api_token),
            'webhook_hint' => null,
            'status' => 'active',
            'last_sync_at' => null,
            'summary' => ($n = (int) $sourceCountsByType->get('wordpress', 0)) > 0
                ? __(':count WordPress item indexed', ['count' => $n])
                : null,
        ]);

        return Inertia::render('app/integrations/index', [
            'integrations' => $integrations,
            'agents' => Agent::query()->where('workspace_id', $workspace->id)->get()->map(fn (Agent $a) => [
                'id' => $a->id,
                'name' => $a->name,
            ]),
            'workspaceApiToken' => $workspace->api_token,
            'webhookSubscriptions' => WebhookSubscription::query()
                ->where('workspace_id', $workspace->id)
                ->latest()
                ->get()
                ->map(fn (WebhookSubscription $subscription) => [
                    'id' => $subscription->id,
                    'url' => $subscription->url,
                    'host' => parse_url($subscription->url, PHP_URL_HOST) ?: null,
                    'enabled' => $subscription->enabled,
                    'events' => array_values(array_filter((array) $subscription->events, 'is_string')),
                    'event_labels' => $this->eventLabels((array) $subscription->events),
                    'secret_hint' => $this->secretHint($subscription->secret),
                    'created_at' => $subscription->created_at?->toIso8601String(),
                    'updated_at' => $subscription->updated_at?->toIso8601String(),
                ]),
            'webhookEventOptions' => collect($this->webhookEventOptions())
                ->map(fn (string $label, string $value) => ['value' => $value, 'label' => $label])
                ->values()
                ->all(),
        ]);
    }

    public function storeSlack(Request $request, SlackPusher $slack): RedirectResponse
    {
        $workspace = $this->current->get();
        abort_if($workspace === null, 404);
        $request->user()->can('manageMembers', $workspace) || abort(403);

        $data = $request->validate([
            'webhook_url' => ['required', 'url', 'max:500', 'starts_with:https://hooks.slack.com/'],
            'send_test' => ['nullable', 'boolean'],
        ]);

        IntegrationConnection::query()
            ->where('workspace_id', $workspace->id)
            ->where('kind', 'slack')
            ->delete();

        IntegrationConnection::create([
            'workspace_id' => $workspace->id,
            'kind' => 'slack',
            'credentials_encrypted' => ['webhook_url' => $data['webhook_url']],
            'status' => 'active',
        ]);

        if (! empty($data['send_test'])) {
            $fake = new Lead;
            $fake->forceFill([
                'id' => 'test-'.bin2hex(random_bytes(4)),
                'email' => 'orbychat-test@example.com',
                'name' => 'OrbyChat test alert',
                'phone' => null,
            ]);
            $slack->pushLead($data['webhook_url'], $fake);
        }

        return back()->with('success', __('Slack connected.'));
    }

    public function storeShopify(Request $request): RedirectResponse
    {
        $workspace = $this->current->get();
        abort_if($workspace === null, 404);
        $request->user()->can('manageMembers', $workspace) || abort(403);

        $data = $request->validate([
            'shop_domain' => ['required', 'string', 'max:255'],
            'access_token' => ['required', 'string', 'max:500'],
            'agent_id' => ['required', 'exists:agents,id'],
        ]);

        IntegrationConnection::updateOrCreate(
            ['workspace_id' => $workspace->id, 'kind' => 'shopify'],
            [
                'credentials_encrypted' => [
                    'shop_domain' => $data['shop_domain'],
                    'access_token' => $data['access_token'],
                ],
                'status' => 'active',
            ]
        );

        // Also create a source if it doesn't exist
        $source = Source::firstOrCreate(
            ['agent_id' => $data['agent_id'], 'type' => 'shopify'],
            ['status' => 'pending', 'config' => ['shop_domain' => $data['shop_domain'], 'access_token' => $data['access_token']]]
        );

        \App\Jobs\Integrations\Shopify\SyncShopifySourceJob::dispatch($source->id);

        return back()->with('success', __('Shopify connected and sync started.'));
    }

    public function storeIkas(Request $request): RedirectResponse
    {
        $workspace = $this->current->get();
        abort_if($workspace === null, 404);
        $request->user()->can('manageMembers', $workspace) || abort(403);

        $data = $request->validate([
            'shop_domain' => ['required', 'string', 'max:255'],
            'access_token' => ['required', 'string', 'max:500'],
            'agent_id' => ['required', 'exists:agents,id'],
        ]);

        IntegrationConnection::updateOrCreate(
            ['workspace_id' => $workspace->id, 'kind' => 'ikas'],
            [
                'credentials_encrypted' => [
                    'shop_domain' => $data['shop_domain'],
                    'access_token' => $data['access_token'],
                ],
                'status' => 'active',
            ]
        );

        // Also create a source if it doesn't exist
        $source = Source::firstOrCreate(
            ['agent_id' => $data['agent_id'], 'type' => 'ikas'],
            ['status' => 'pending', 'config' => ['shop_domain' => $data['shop_domain'], 'access_token' => $data['access_token']]]
        );

        \App\Jobs\Integrations\Ikas\SyncIkasSourceJob::dispatch($source->id);

        return back()->with('success', __('Ikas connected and sync started.'));
    }

    public function downloadWordPressPlugin(): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        // Always rebuild to ensure the latest code is packaged
        Artisan::call('orbychat:build-wp-plugin');

        $path = storage_path('app/public/integrations/orbychat-sales-ai.zip');
        
        return response()->download($path, 'orbychat-sales-ai.zip');
    }

    public function storeWebhook(Request $request): RedirectResponse
    {
        $workspace = $this->current->get();
        abort_if($workspace === null, 404);
        $request->user()->can('manageMembers', $workspace) || abort(403);

        $data = $this->validateWebhookPayload($request, true);

        WebhookSubscription::create([
            'workspace_id' => $workspace->id,
            'url' => $data['url'],
            'secret' => $data['secret'],
            'events' => $data['events'],
            'enabled' => (bool) ($data['enabled'] ?? false),
        ]);

        return back()->with('success', __('Webhook subscription added.'));
    }

    public function updateWebhook(Request $request, WebhookSubscription $webhookSubscription): RedirectResponse
    {
        $workspace = $this->current->get();
        abort_if($workspace === null, 404);
        abort_unless($webhookSubscription->workspace_id === $workspace->id, 404);
        $request->user()->can('manageMembers', $workspace) || abort(403);

        $data = $this->validateWebhookPayload($request, false);

        $payload = [
            'url' => $data['url'],
            'events' => $data['events'],
            'enabled' => (bool) ($data['enabled'] ?? false),
        ];

        if (($data['secret'] ?? '') !== '') {
            $payload['secret'] = $data['secret'];
        }

        $webhookSubscription->fill($payload)->save();

        return back()->with('success', __('Webhook subscription updated.'));
    }

    public function destroy(Request $request, IntegrationConnection $integration): RedirectResponse
    {
        $workspace = $this->current->get();
        abort_if($workspace === null, 404);
        abort_unless($integration->workspace_id === $workspace->id, 404);
        $request->user()->can('manageMembers', $workspace) || abort(403);

        $integration->delete();

        return back()->with('success', __('Integration disconnected.'));
    }

    public function destroyWebhook(Request $request, WebhookSubscription $webhookSubscription): RedirectResponse
    {
        $workspace = $this->current->get();
        abort_if($workspace === null, 404);
        abort_unless($webhookSubscription->workspace_id === $workspace->id, 404);
        $request->user()->can('manageMembers', $workspace) || abort(403);

        $webhookSubscription->delete();

        return back()->with('success', __('Webhook subscription removed.'));
    }

    /**
     * Per-provider summary string for the Integrations page card.
     * Returns null when there's nothing useful to surface yet.
     */
    private function summaryFor(string $kind, Collection $sourceCountsByType, int $slackLeadsRecent): ?string
    {
        return match ($kind) {
            'notion' => ($n = (int) $sourceCountsByType->get('notion', 0)) > 0
                ? __(':count Notion page indexed', ['count' => $n])
                : null,
            'google' => ($n = (int) $sourceCountsByType->get('google_doc', 0)) > 0
                ? __(':count Google Doc indexed', ['count' => $n])
                : null,
            'slack' => $slackLeadsRecent > 0
                ? __(':count lead alerted in last 30d', ['count' => $slackLeadsRecent])
                : null,
            'shopify' => ($n = (int) $sourceCountsByType->get('shopify', 0)) > 0
                ? __(':count Shopify item indexed', ['count' => $n])
                : null,
            'ikas' => ($n = (int) $sourceCountsByType->get('ikas', 0)) > 0
                ? __(':count Ikas item indexed', ['count' => $n])
                : null,
            default => null,
        };
    }

    private function isConfigured(IntegrationConnection $i): bool
    {
        $creds = (array) ($i->credentials_encrypted ?? []);

        return match ($i->kind) {
            'slack' => is_string($creds['webhook_url'] ?? null),
            'notion', 'google' => is_string($creds['access_token'] ?? null),
            'shopify', 'ikas' => is_string($creds['access_token'] ?? null) && is_string($creds['shop_domain'] ?? null),
            default => false,
        };
    }

    private function hintFor(?string $url): ?string
    {
        if (! is_string($url) || $url === '') {
            return null;
        }

        // …/services/T01ABC/B02DEF/<secret>  → show only T01ABC/B02DEF
        if (preg_match('#hooks\.slack\.com/services/([^/]+)/([^/]+)/#', $url, $m) === 1) {
            return $m[1].'/'.$m[2];
        }

        return mb_substr($url, 0, 30).'…';
    }

    /**
     * @return array<int, string>
     */
    private function eventLabels(array $events): array
    {
        $options = $this->webhookEventOptions();

        return array_values(array_map(
            static fn (string $event) => $options[$event] ?? $event,
            array_values(array_filter($events, 'is_string')),
        ));
    }

    /**
     * @return array<string, string>
     */
    private function webhookEventOptions(): array
    {
        return [
            'lead.captured' => __('Lead captured'),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function validateWebhookPayload(Request $request, bool $requireSecret): array
    {
        return $request->validate([
            'url' => ['required', 'url', 'max:1000'],
            'secret' => [
                $requireSecret ? 'required' : 'nullable',
                'string',
                'min:12',
                'max:128',
            ],
            'events' => ['required', 'array', 'min:1'],
            'events.*' => ['required', 'string', Rule::in(array_keys($this->webhookEventOptions()))],
            'enabled' => ['sometimes', 'boolean'],
        ]);
    }

    private function secretHint(string $secret): string
    {
        $len = mb_strlen($secret);

        if ($len <= 6) {
            return str_repeat('•', $len);
        }

        return str_repeat('•', max(4, $len - 4)).mb_substr($secret, -4);
    }
}
