<?php

namespace App\Http\Controllers\Widget;

use App\Events\Conversations\AgentReplyPostedEvent;
use App\Jobs\Analytics\DetectGapJob;
use App\Jobs\Analytics\IncrementUsageJob;
use App\Jobs\Rag\PersistTurnJob;
use App\Models\Agent;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\Workspace;
use App\Services\Billing\MeteredBilling;
use App\Services\Llm\Contracts\OpenAiClient;
use App\Services\Rag\CuratedAnswerMatcher;
use App\Services\Rag\PromptBuilder;
use App\Services\Rag\Retriever;
use App\Services\Tools\Contracts\Tool;
use App\Services\Tools\ToolRegistry;
use App\Services\Triggers\CtaSelector;
use App\Services\Triggers\LeadIntentDetector;
use App\Services\Widget\InlineBlockParser;
use App\Services\Widget\WidgetJwt;
use App\Services\Workflows\WorkflowEngine;
use App\Support\CanonicalUrl;
use App\Support\HotPathTimer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Token-streaming variant of /v1/widget/messages.
 *
 * Returns text/event-stream. The widget reads tokens as they arrive,
 * giving the visitor a "first byte in <1s" experience. The synchronous
 * MessageController is still available for callers that don't want SSE.
 *
 * Hot-path rules from PLAN §7 are honored:
 *   - No DB writes during the stream (PersistTurnJob fires after).
 *   - No retries inside the stream.
 *   - Curated answer match short-circuits LLM.
 *   - Top-k=6 with similarity threshold from the agent.
 *   - All retrieved chunks wrapped in <source> tags.
 */
class MessageStreamController
{
    public function __construct(
        private WidgetJwt $jwt,
        private Retriever $retriever,
        private PromptBuilder $prompt,
        private CuratedAnswerMatcher $curated,
        private OpenAiClient $llm,
        private CtaSelector $ctaSelector,
        private LeadIntentDetector $leadIntent,
        private ToolRegistry $tools,
        private InlineBlockParser $blockParser,
        private MeteredBilling $billing,
        private WorkflowEngine $workflows,
        private \App\Services\Analytics\SentimentDetector $sentiment,
    ) {}

    public function __invoke(Request $request): StreamedResponse
    {
        $token = $request->bearerToken() ?? $request->header('X-Widget-Token');
        if (! is_string($token)) {
            return $this->errorStream('missing_token', 401);
        }
        try {
            $claims = $this->jwt->verify($token);
        } catch (\Throwable $e) {
            return $this->errorStream('invalid_token', 401);
        }

        $data = $request->validate([
            'message' => ['required', 'string', 'max:4000'],
            // Visitor's current page metadata — captured client-side from
            // the DOM (title, og:*, JSON-LD, visible text). Optional;
            // legacy widget builds won't send it.
            'page_context' => ['nullable', 'array'],
        ]);

        $conversationId = (string) ($claims['conversation_id'] ?? '');
        $userMessage = $data['message'];
        $pageContext = $this->sanitizePageContext($data['page_context'] ?? null);

        return new StreamedResponse(function () use ($conversationId, $userMessage, $pageContext) {
            $this->streamTurn($conversationId, $userMessage, $pageContext);
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache, no-transform',
            'X-Accel-Buffering' => 'no',
            'Connection' => 'keep-alive',
        ]);
    }

    /**
     * @param  array<string, mixed>|null  $pageContext  Sanitized DOM snapshot from the widget.
     */
    private function streamTurn(string $conversationId, string $userMessage, ?array $pageContext = null): void
    {
        // Defang every layer of output buffering before we start writing
        // SSE bytes. cPanel + LSAPI + Octane each layer their own buffer;
        // without this an entire stream can sit invisible for 30s+ and
        // get killed by an idle-timeout proxy (Cloudflare, nginx).
        @ini_set('output_buffering', '0');
        @ini_set('zlib.output_compression', '0');
        @ini_set('implicit_flush', '1');
        if (function_exists('apache_setenv')) {
            @apache_setenv('no-gzip', '1');
        }
        // Send an immediate heartbeat so headers + the first byte hit
        // the client right away — proxies that buffer "until first byte"
        // release the response now, not after retrieval finishes.
        $this->emitHeartbeat();

        $started = (int) (microtime(true) * 1000);

        $conversation = Conversation::query()->withoutWorkspaceScope()->find($conversationId);
        if ($conversation === null) {
            $this->emit('error', ['code' => 'conversation_not_found']);

            return;
        }
        $agent = $conversation->agent()->withoutWorkspaceScope()->first();
        if ($agent === null) {
            $this->emit('error', ['code' => 'agent_not_found']);

            return;
        }

        // Resolve the workspace's plan once for this turn and cache the
        // per-response token cap. We deliberately do this BEFORE the
        // first-token clock starts so the lookup never lands inside the
        // p95 TTFT window.
        $workspace = Workspace::query()->find($agent->workspace_id);
        $maxTokens = $workspace !== null
            ? ($this->billing->maxTokensFor($workspace) ?? 800)
            : 800;

        // Per-message quota gate. If the workspace's plan caps
        // monthly_messages and we're over, fail the request before
        // burning a single LLM token. The widget treats this as a soft
        // failure ("upgrade to keep chatting"); analytics-wise we still
        // record the visitor's question via DetectGapJob below so the
        // operator sees the demand they're losing to the cap.
        if ($workspace !== null && ! $this->billing->canSendMessage($workspace)) {
            $this->emit('error', [
                'code' => 'message_quota_exceeded',
                'message' => 'Monthly message limit reached for this workspace.',
            ]);

            return;
        }

        $userMessageId = (string) Str::uuid7();
        $assistantMessageId = (string) Str::uuid7();

        $this->emit('start', [
            'conversation_id' => $conversationId,
            'message_id' => $assistantMessageId,
        ]);

        // 0. Live human takeover: if a workspace member has claimed this
        // conversation, the bot stops auto-responding. The visitor's message
        // is still persisted (so the operator sees it via the broadcast),
        // but no LLM call is made.
        if ($conversation->claimed_by_user_id !== null) {
            // Persist the visitor message so the operator can read it.
            Message::create([
                'id' => $userMessageId,
                'conversation_id' => $conversationId,
                'role' => 'user',
                'content' => $userMessage,
                'citations' => [],
                'confidence' => null,
                'tokens_in' => 0,
                'tokens_out' => 0,
                'latency_ms' => 0,
                'model' => null,
            ]);
            // Broadcast it so the inbox/operator UI sees it live.
            AgentReplyPostedEvent::dispatch(
                $conversationId,
                $userMessageId,
                $userMessage,
                'visitor',
            );
            $this->emit('done', [
                'text' => '',
                'citations' => [],
                'low_confidence' => false,
                'human_takeover' => true,
                'latency_ms' => (int) (microtime(true) * 1000) - $started,
            ]);

            return;
        }

        // 1. Curated answer short-circuit
        $curated = $this->curated->match($agent->id, $userMessage, $conversation->lang);
        if ($curated !== null) {
            foreach ($this->tokenize($curated) as $tok) {
                $this->emit('token', ['t' => $tok]);
            }
            $this->emit('done', [
                'text' => $curated,
                'citations' => [],
                'low_confidence' => false,
                'latency_ms' => (int) (microtime(true) * 1000) - $started,
            ]);
            $sentiment = $this->sentiment->detect($userMessage);
            $this->afterTurn($conversation, $userMessageId, $userMessage, $assistantMessageId, $curated, [], 1.0, $started, 'curated', false, false, $sentiment);

            return;
        }

        // 1b. Workflow short-circuit: if a workflow run is paused on a
        // question step (or a fresh visitor message matches a keyword
        // trigger), the engine emits scripted bubbles + skips the LLM.
        // Falls through silently when nothing matches.
        $flowOutput = '';
        $handledByFlow = $this->workflows->handleTurn(
            $conversation,
            $userMessage,
            function (string $text) use (&$flowOutput): void {
                // Two newlines so consecutive bubbles read as separate
                // paragraphs in the visitor's chat — the widget renders
                // the assembled text as one assistant turn.
                $flowOutput .= ($flowOutput === '' ? '' : "\n\n").$text;
                foreach ($this->tokenize($text."\n") as $tok) {
                    $this->emit('token', ['t' => $tok]);
                }
            },
        );
        if ($handledByFlow) {
            $this->emit('done', [
                'text' => trim($flowOutput),
                'citations' => [],
                'low_confidence' => false,
                'flow' => true,
                'latency_ms' => (int) (microtime(true) * 1000) - $started,
            ]);
            $sentiment = $this->sentiment->detect($userMessage);
            $this->afterTurn(
                $conversation,
                $userMessageId,
                $userMessage,
                $assistantMessageId,
                trim($flowOutput),
                [],
                1.0,
                $started,
                'workflow',
                false,
                false,
                $sentiment
            );

            return;
        }

        $timer = new HotPathTimer($conversationId, $agent->id);

        // 2. Retrieval
        $this->emit('status', ['text' => $agent->language_default === 'tr' ? 'Siteniz taranıyor...' : 'Searching your site...']);
        $timer->mark('retrieve.start');
        $threshold = (float) ($agent->confidence_threshold ?? 0.5);
        $currentPageUrl = is_array($pageContext) && isset($pageContext['url']) && is_string($pageContext['url'])
            ? $pageContext['url']
            : $conversation->page_url;
        $retrieval = $this->retriever->retrieve($agent->id, $userMessage, $threshold, 6, $currentPageUrl);
        $sources = $retrieval['chunks'];
        // Confidence
        $confidence = $this->computeConfidence($sources, $pageContext);
        $lowConfidence = $confidence < $threshold;
        $timer->mark('retrieve.end');

        // 3. History
        $historyKey = "conv:{$conversationId}:history";
        $history = Cache::get($historyKey, []);

        // 4. Prompt
        $messages = $this->prompt->build(
            agent: $agent,
            userMessage: $userMessage,
            sources: array_map(fn ($s) => ['text' => $s['text'], 'url' => $s['url'], 'score' => $s['score']], $sources),
            history: $history,
            detectedLang: $conversation->lang,
            pageUrl: $conversation->page_url,
            pageContext: $pageContext,
        );

        // 5. Stream
        $this->emit('status', ['text' => $agent->language_default === 'tr' ? 'Düşünülüyor...' : 'Thinking...']);
        $buffer = '';
        $timer->mark('llm.start');
        $timer->mark('first_token.start');
        $sawFirstToken = false;
        $blocks = [];
        try {
            $enabledTools = $this->tools->forAgent($conversation->agent);
            if ($enabledTools !== []) {
                $loopOut = $this->runToolLoop(
                    messages: $messages,
                    agent: $conversation->agent,
                    enabledTools: $enabledTools,
                    maxHops: 3,
                    maxTokens: $maxTokens,
                );
                $messages = $loopOut['messages'];
                $blocks = $loopOut['blocks'];
                // After tool resolution, we still stream the final answer
                // for TTFT. The model has all tool results in $messages now.
            }

            foreach ($this->llm->streamChat($messages, ['max_tokens' => $maxTokens]) as $token) {
                if (! $sawFirstToken) {
                    $timer->mark('first_token.end');
                    $sawFirstToken = true;
                }
                $buffer .= $token;
                $this->emit('token', ['t' => $token]);
            }
        } catch (\Throwable $e) {
            $this->emit('error', ['code' => 'llm_failed', 'message' => $e->getMessage()]);

            return;
        }
        $timer->mark('llm.end');

        // Parse server-emitted block markers from the assembled text.
        // Phase 3 ecommerce/saas/marketing presets instruct the LLM to
        // emit <product/>, <pricing/>, <case-study/> XML markers when
        // recommending an item — we extract those here, emit them as
        // block events for the widget renderer, and strip the markers
        // from the visible text so visitors only see the rendered card.
        $sourceEvidence = implode("\n\n", array_map(
            fn ($s) => is_array($s) ? (string) ($s['text'] ?? '') : '',
            $sources,
        ));
        if ($pageContext !== null) {
            $sourceEvidence .= "\n\n".implode("\n", array_filter([
                (string) ($pageContext['title'] ?? ''),
                (string) ($pageContext['description'] ?? ''),
                (string) ($pageContext['visible_text'] ?? ''),
            ]));
        }

        $buffer = $this->removeUnsupportedLinks($buffer, $sourceEvidence);
        $buffer = $this->removeUnsupportedPriceClaims($buffer, $sourceEvidence);
        $parsed = $this->blockParser->extract($buffer, $sourceEvidence);
        $buffer = $parsed['text'];
        foreach ($parsed['blocks'] as $b) {
            $blocks[] = $b;
        }

        // Emit any blocks the tool loop or inline parser produced so the
        // widget can render them inline with the final assistant text.
        foreach ($blocks as $block) {
            $this->emit('block', $block);
        }

        // 6. Citations + CTA + lead-form heuristic
        // Mirror PromptBuilder's source[0] = page_context so [1] in the
        // LLM reply maps back to the page URL the visitor was on. Without
        // this, replies that cite page-context-only data showed [N] as
        // dead text in the widget (no clickable link, no Sources footer).
        $sourcesForCitations = $sources;
        if ($pageContext !== null) {
            array_unshift($sourcesForCitations, [
                'text' => '',
                'url' => is_string($pageContext['url'] ?? null) ? $pageContext['url'] : null,
                'score' => 1.0,
            ]);
        }
        $citations = $this->extractCitations($buffer, $sourcesForCitations);
        $ctas = $this->ctaSelector->select($conversation, $buffer);
        // Smart lead capture — keyword + engagement on the VISITOR'S
        // message rather than scanning the assistant's reply. See
        // LeadIntentDetector for the heuristics.
        $leadPrompt = $this->leadIntent->shouldPrompt($conversation, $userMessage);

        $this->emit('done', [
            'text' => $buffer,
            'citations' => $citations,
            'ctas' => $ctas,
            'lead_prompt' => $leadPrompt,
            'low_confidence' => $lowConfidence,
            'latency_ms' => (int) (microtime(true) * 1000) - $started,
        ]);

        // 7. After-turn jobs
        $sentiment = $this->sentiment->detect($userMessage);
        $this->afterTurn(
            conversation: $conversation,
            userMessageId: $userMessageId,
            userMessage: $userMessage,
            assistantMessageId: $assistantMessageId,
            assistantText: $buffer,
            citations: $citations,
            confidence: $confidence,
            startedMs: $started,
            model: 'workers-ai',
            isPlayground: (bool) $conversation->is_playground,
            lowConfidence: $lowConfidence,
            sentiment: $sentiment,
        );

        // 8. Update history
        $history[] = ['role' => 'user', 'content' => $userMessage];
        $history[] = ['role' => 'assistant', 'content' => $buffer];
        if (count($history) > 12) {
            $history = array_slice($history, -12);
        }
        Cache::put($historyKey, $history, now()->addHours(2));

        // 9. Emit hot-path timing (one structured log line per turn).
        $timer->emit([
            'sources' => count($sources),
            'low_confidence' => $lowConfidence,
            'tokens_out' => mb_strlen($buffer),
            'is_playground' => (bool) $conversation->is_playground,
        ]);
    }

    /**
     * Runs the tool-resolution loop. Each hop calls the LLM
     * non-streaming with the tools array; if the model wants to invoke
     * tools, we execute each one, append `tool` role messages with the
     * results, and loop. Stops as soon as the model returns content
     * (no tool_calls) or when the hop limit is hit.
     *
     * Emits a `tool_call` SSE event for every tool invocation so the
     * widget can show a "running …" pill while the visitor waits.
     *
     * @param  array<int, array<string, mixed>>  $messages
     * @param  array<int, Tool>  $enabledTools
     * @return array{messages: array<int, array<string, mixed>>, blocks: array<int, array{type: string, payload: array}>}
     */
    private function runToolLoop(array $messages, Agent $agent, array $enabledTools, int $maxHops, int $maxTokens = 800): array
    {
        $toolPayload = $this->tools->openAiToolsFor($agent);
        $blocks = [];
        // Track tool invocations this turn so smaller / open-source models
        // (Llama 3.3 on Workers AI is the primary culprit) cannot
        // infinite-loop the same tool with the same args. Once we see a
        // duplicate, we stop the loop and let the streaming path produce
        // the final answer.
        $invokedKeys = [];
        $emittedBlockKeys = [];

        for ($hop = 0; $hop < $maxHops; $hop++) {
            $response = $this->llm->chatWithTools($messages, $toolPayload, ['max_tokens' => $maxTokens]);
            $toolCalls = $response['tool_calls'] ?? null;
            if (! is_array($toolCalls) || $toolCalls === []) {
                // Model wants to give a final answer — break out and let
                // the streaming path produce it for TTFT.
                break;
            }

            // Drop any tool the model has already invoked this turn. We
            // dedupe by NAME (not name+args) because every Phase 2 tool
            // is stateless / one-shot per turn — escalating twice with
            // a different "reason" string is still one escalation.
            // Llama 3.3 reliably loops calling the same tool with
            // slightly different args; this guard is what stops that.
            $freshCalls = [];
            foreach ($toolCalls as $tc) {
                $name = (string) ($tc['name'] ?? '');
                if (isset($invokedKeys[$name])) {
                    continue;
                }
                $invokedKeys[$name] = true;
                $freshCalls[] = $tc;
            }
            if ($freshCalls === []) {
                break;
            }
            $toolCalls = $freshCalls;

            // Append the assistant turn that requested the tool calls.
            // OpenAI's protocol requires this turn to be present before
            // the corresponding `tool` role messages. Cloudflare Workers
            // AI's strict schema rejects `content: null` here — it wants a
            // string, even when tool_calls is present. Send an empty
            // string for cross-provider compatibility (OpenAI accepts it
            // too).
            $messages[] = [
                'role' => 'assistant',
                'content' => '',
                'tool_calls' => array_map(static fn ($tc) => [
                    'id' => $tc['id'],
                    'type' => 'function',
                    'function' => [
                        'name' => $tc['name'],
                        'arguments' => $tc['arguments'],
                    ],
                ], $toolCalls),
            ];

            foreach ($toolCalls as $tc) {
                $name = (string) ($tc['name'] ?? '');
                $args = json_decode((string) ($tc['arguments'] ?? '{}'), true);
                if (! is_array($args)) {
                    $args = [];
                }
                $tool = $this->tools->get($name);
                if ($tool === null) {
                    $messages[] = [
                        'role' => 'tool',
                        'tool_call_id' => (string) ($tc['id'] ?? ''),
                        'name' => $name,
                        'content' => json_encode(['error' => "Unknown tool: {$name}"]) ?: '{}',
                    ];

                    continue;
                }

                // Inform the widget the tool is running.
                $this->emit('tool_call', ['name' => $name, 'args' => $args]);

                try {
                    $out = $tool->execute($args, $agent);
                } catch (\Throwable $e) {
                    $messages[] = [
                        'role' => 'tool',
                        'tool_call_id' => (string) ($tc['id'] ?? ''),
                        'name' => $name,
                        'content' => json_encode(['error' => $e->getMessage()]) ?: '{}',
                    ];

                    continue;
                }

                $messages[] = [
                    'role' => 'tool',
                    'tool_call_id' => (string) ($tc['id'] ?? ''),
                    'name' => $name,
                    'content' => json_encode($out['result'] ?? []) ?: '{}',
                ];

                if (isset($out['block']) && is_array($out['block'])) {
                    // Dedupe identical blocks across hops (e.g. an
                    // escalation_button with the same payload). The widget
                    // would otherwise render N copies of the same button.
                    $blockKey = ($out['block']['type'] ?? '').':'.md5((string) json_encode($out['block']['payload'] ?? []));
                    if (! isset($emittedBlockKeys[$blockKey])) {
                        $emittedBlockKeys[$blockKey] = true;
                        $blocks[] = $out['block'];
                    }
                }
            }
        }

        return ['messages' => $messages, 'blocks' => $blocks];
    }

    /**
    /**
     * @param  array<int, array{text: string, url: ?string, score: float}>  $sources
     * @return array<int, array{id: int, url: ?string}>
     */
    private function extractCitations(string $text, array $sources): array
    {
        if (! preg_match_all('/\[(\d+)\]/', $text, $m)) {
            return [];
        }
        $ids = array_unique(array_map('intval', $m[1]));
        $citations = [];
        foreach ($ids as $id) {
            $idx = $id - 1;
            if (isset($sources[$idx])) {
                $citations[] = ['id' => $id, 'url' => $sources[$idx]['url'] ?? null];
            }
        }

        return $citations;
    }

    private function afterTurn(
        Conversation $conversation,
        string $userMessageId,
        string $userMessage,
        string $assistantMessageId,
        string $assistantText,
        array $citations,
        float $confidence,
        int $startedMs,
        string $model,
        bool $isPlayground,
        bool $lowConfidence = false,
        ?float $sentiment = null,
    ): void {
        $latency = (int) (microtime(true) * 1000) - $startedMs;

        // dispatchSync: message persistence is the foundation of the
        // conversation log, history resume, and citation surfaces. A
        // misconfigured queue worker on production was silently losing
        // every visitor turn → "0 msgs" everywhere. Cheap DB inserts;
        // runs after emit('done') so the visitor's stream is unaffected.
        PersistTurnJob::dispatchSync(
            $conversation->id,
            $userMessageId,
            $userMessage,
            $assistantMessageId,
            $assistantText,
            $citations,
            $confidence,
            $latency,
            $model,
            $sentiment,
        );

        if ($lowConfidence || $this->looksLikeFailure($assistantText)) {
            DetectGapJob::dispatch($conversation->agent_id, $userMessage);
        }

        if (! $isPlayground) {
            IncrementUsageJob::dispatch($conversation->id);
        }
    }

    private function looksLikeFailure(string $text): bool
    {
        $needles = ["don't know", 'not sure', "couldn't find", 'unable to find', 'no information'];
        $haystack = mb_strtolower($text);
        foreach ($needles as $n) {
            if (str_contains($haystack, $n)) {
                return true;
            }
        }

        return false;
    }

    private function tokenize(string $text): iterable
    {
        $tokens = preg_split('/(\s+)/', $text, -1, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY) ?: [$text];
        foreach ($tokens as $t) {
            yield $t;
        }
    }

    private function emit(string $event, array $payload): void
    {
        $line = "event: {$event}\n".'data: '.json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)."\n\n";
        $this->writeRaw($line);
    }

    /**
     * SSE comment ("heartbeat") line. Browsers ignore it but it forces
     * a flush through proxies (Cloudflare, nginx, cPanel FastCGI) that
     * otherwise buffer responses with no body for ~30s and silently
     * drop the connection. Sent at the start of every turn so the
     * client's stale-stream detector clock starts ticking from a
     * known-good baseline.
     */
    private function emitHeartbeat(): void
    {
        $this->writeRaw(': heartbeat '.microtime(true)."\n\n");
    }

    private function writeRaw(string $bytes): void
    {
        echo $bytes;
        // Skip aggressive ob drain during tests — Pest's runner manages
        // its own output buffer and drains during teardown. In real HTTP
        // requests on cPanel / LSAPI / Octane there are typically 2–3
        // buffers stacked which a single ob_flush() doesn't pierce.
        if (function_exists('ob_get_level') && ! app()->runningUnitTests()) {
            while (ob_get_level() > 0) {
                @ob_end_flush();
            }
        } elseif (function_exists('ob_get_level') && ob_get_level() > 0) {
            // Inside tests: gentle flush only, no buffer destruction.
            @ob_flush();
        }
        flush();
    }

    /**
     * Defang the page context payload before it goes into the prompt.
     * Caps total payload size and string lengths so a malicious page
     * can't blow our token budget or smuggle 50KB of "instructions".
     *
     * @return array<string, mixed>|null
     */
    private function sanitizePageContext(mixed $raw): ?array
    {
        if (! is_array($raw) || $raw === []) {
            return null;
        }

        // Hard cap on serialized size — nothing legitimately useful needs
        // more than this, and it bounds the worst-case prompt cost.
        $encoded = json_encode($raw, JSON_UNESCAPED_SLASHES);
        if (! is_string($encoded) || strlen($encoded) > 8192) {
            return null;
        }

        $allowedKeys = ['url', 'title', 'description', 'og', 'twitter', 'json_ld', 'h1', 'h2', 'visible_text'];
        $clean = [];
        foreach ($allowedKeys as $key) {
            if (! array_key_exists($key, $raw)) {
                continue;
            }
            $clean[$key] = $raw[$key];
        }

        // Canonicalize the URL so /page, /page/, /page#x, /page?utm=...
        // all share one citation identity (matches what AutoIndexPageVisit
        // stored as Document.url, so citations align with Knowledge entries).
        if (isset($clean['url']) && is_string($clean['url'])) {
            $canonical = CanonicalUrl::for($clean['url']);
            if ($canonical !== null) {
                $clean['url'] = $canonical;
            }
        }

        return $clean === [] ? null : $clean;
    }

    /**
     * How sure are we this answer is grounded?
     *
     * Picks the strongest grounding signal available:
     *  - Retrieved chunks → max similarity score (0..1)
     *  - Page context (verified DOM snapshot) → baseline 0.85
     *  - Neither → 0.3 (LLM is on its own)
     *
     * @param  array<int, array{score?: float}>  $retrievedSources
     * @param  array<string, mixed>|null  $pageContext
     */
    private function computeConfidence(array $retrievedSources, ?array $pageContext): float
    {
        $best = 0.0;
        foreach ($retrievedSources as $s) {
            $score = (float) ($s['rerank_score'] ?? $s['score'] ?? 0);
            if ($score > $best) {
                $best = $score;
            }
        }

        if ($pageContext !== null) {
            $best = max($best, 0.85);
        }

        if ($best === 0.0) {
            // No retrieval, no page context — the LLM has nothing to cite.
            return 0.3;
        }

        return min(1.0, $best);
    }

    private function removeUnsupportedPriceClaims(string $answer, string $evidence): string
    {
        if (trim($answer) === '' || trim($evidence) === '') {
            return $answer;
        }

        $sentences = preg_split('/(?<=[.!?])\s+/u', $answer, -1, PREG_SPLIT_NO_EMPTY);
        if ($sentences === false || $sentences === []) {
            return $answer;
        }

        $kept = [];
        $removed = false;
        foreach ($sentences as $sentence) {
            $prices = $this->extractPriceLikeValues($sentence);
            if ($prices === []) {
                $kept[] = $sentence;
                continue;
            }

            $allSupported = true;
            foreach ($prices as $price) {
                if (! $this->priceValueAppearsInEvidence($price, $evidence)) {
                    $allSupported = false;
                    break;
                }
            }

            if ($allSupported) {
                $kept[] = $sentence;
            } else {
                $removed = true;
            }
        }

        $clean = trim(implode(' ', $kept));
        if ($removed && $clean === '') {
            return "I don't have the exact pricing in the available information, but I can connect you with someone who can help.";
        }

        return $clean;
    }

    private function removeUnsupportedLinks(string $answer, string $evidence): string
    {
        if (trim($answer) === '' || trim($evidence) === '') {
            return $answer;
        }

        $answer = preg_replace_callback('/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/iu', function (array $match) use ($evidence): string {
            return $this->urlAppearsInEvidence($match[2], $evidence) ? $match[0] : $match[1];
        }, $answer) ?? $answer;

        $answer = preg_replace_callback('/(?<!["=\(])\bhttps?:\/\/[^\s<>)]+/iu', function (array $match) use ($evidence): string {
            return $this->urlAppearsInEvidence($match[0], $evidence) ? $match[0] : '';
        }, $answer) ?? $answer;

        $answer = preg_replace('/[ \t]{2,}/u', ' ', $answer) ?? $answer;
        $answer = preg_replace('/\n{3,}/u', "\n\n", $answer) ?? $answer;

        return trim($answer);
    }

    /**
     * @return array<int, string>
     */
    private function extractPriceLikeValues(string $text): array
    {
        preg_match_all('/(?:[$€£₺]\s*\d[\d.,]*|\d[\d.,]*\s*(?:USD|EUR|GBP|TRY|TL|₺|dollars?|euros?|lira|\/\s*(?:month|mo|year|yr)))/iu', $text, $matches);

        return array_values(array_unique($matches[0] ?? []));
    }

    private function priceValueAppearsInEvidence(string $price, string $evidence): bool
    {
        $normalized = preg_replace('/[^\d.,]/u', '', $price) ?? '';
        if ($normalized === '') {
            return false;
        }

        $variants = array_values(array_unique(array_filter([
            trim($price),
            $normalized,
            str_replace(',', '.', $normalized),
            str_replace('.', ',', $normalized),
        ])));

        foreach ($variants as $variant) {
            if ($variant !== '' && mb_stripos($evidence, $variant) !== false) {
                return true;
            }
        }

        return false;
    }

    private function urlAppearsInEvidence(string $url, string $evidence): bool
    {
        $url = trim($url);
        if ($url === '' || str_starts_with($url, '#')) {
            return false;
        }

        $variants = array_values(array_unique(array_filter([
            $url,
            html_entity_decode($url, ENT_QUOTES | ENT_HTML5),
            rtrim($url, '/'),
        ])));

        foreach ($variants as $variant) {
            if ($variant !== '' && mb_stripos($evidence, $variant) !== false) {
                return true;
            }
        }

        return false;
    }

    private function errorStream(string $code, int $status): StreamedResponse
    {
        return new StreamedResponse(function () use ($code) {
            echo "event: error\n".'data: '.json_encode(['code' => $code])."\n\n";
            flush();
        }, $status, [
            'Content-Type' => 'text/event-stream',
        ]);
    }
}
