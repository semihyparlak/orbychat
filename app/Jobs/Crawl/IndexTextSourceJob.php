<?php

namespace App\Jobs\Crawl;

use App\Models\Document;
use App\Models\Source;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Str;

/**
 * Indexes a plain-text source the user pasted in directly. Skips the
 * crawler + extractor stack entirely — the user gives us clean text,
 * we feed it straight to the chunker + embedder.
 *
 * This is the "100% works" path when URL crawling fails for whatever
 * reason (anti-bot, SPA, paywall, login wall, weird encoding).
 */
class IndexTextSourceJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 2;

    public function __construct(
        public string $sourceId,
        public string $title,
        public string $body,
        public ?string $sourceUrl = null,
    ) {}

    public function handle(): void
    {
        $source = Source::query()->withoutWorkspaceScope()->findOrFail($this->sourceId);
        $source->forceFill(['status' => 'crawling'])->save();

        $text = trim($this->body);
        if (mb_strlen($text) < 50) {
            $source->forceFill(['status' => 'failed', 'error' => 'Pasted content is too short to index (need at least 50 characters).'])->save();

            return;
        }

        $hash = hash('sha256', $text);

        // Dedupe: same content already indexed for this agent → just mark
        // the source indexed without creating a parallel document.
        $existing = Document::query()->withoutWorkspaceScope()
            ->where('agent_id', $source->agent_id)
            ->where('content_hash', $hash)
            ->first();

        if ($existing === null) {
            $document = Document::create([
                'source_id' => $source->id,
                'agent_id' => $source->agent_id,
                'url' => $this->sourceUrl ?? "text://{$source->id}",
                'title' => Str::limit($this->title, 250) ?: 'Pasted content',
                'content_hash' => $hash,
                'lang' => null,
                'fetched_at' => now(),
            ]);

            IndexDocumentJob::dispatch($document->id, $text)->onQueue('index');
        }

        $source->forceFill([
            'status' => 'indexed',
            'error' => null,
            'last_synced_at' => now(),
        ])->save();
    }

    public function failed(\Throwable $e): void
    {
        $source = Source::query()->withoutWorkspaceScope()->find($this->sourceId);
        if ($source === null) {
            return;
        }
        $source->forceFill([
            'status' => 'failed',
            'error' => 'Index failed: '.Str::limit($e->getMessage(), 480),
        ])->save();
    }
}
