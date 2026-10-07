<?php

namespace App\Http\Controllers\Admin;

use App\Jobs\Crawl\IndexDocumentJob;
use App\Models\Agent;
use App\Models\Document;
use App\Models\Source;
use App\Services\Parsers\ParserRegistry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class UploadController
{
    public function __construct(private ParserRegistry $parsers) {}

    public function store(Request $request, Agent $agent): RedirectResponse
    {
        $request->user()->can('update', $agent) || abort(403);

        $request->validate([
            'files' => ['required', 'array', 'max:10'],
            'files.*' => ['file', 'max:51200'], // 50 MB
        ]);

        $source = Source::create([
            'agent_id' => $agent->id,
            'type' => 'file',
            'status' => 'crawling',
            'config' => ['filenames' => collect($request->file('files'))->map(fn ($f) => $f->getClientOriginalName())->all()],
        ]);

        $createdDocs = 0;
        foreach ($request->file('files') as $file) {
            $extension = strtolower($file->getClientOriginalExtension());
            $parser = $this->parsers->for($extension);
            if ($parser === null) {
                continue;
            }

            $bytes = (string) file_get_contents($file->getRealPath());
            $segments = $parser->parse($bytes, $file->getClientOriginalName());

            foreach ($segments as $i => $text) {
                $hash = hash('sha256', $text);
                $document = Document::create([
                    'source_id' => $source->id,
                    'agent_id' => $agent->id,
                    'url' => null,
                    'title' => $file->getClientOriginalName().($i > 0 ? " (segment {$i})" : ''),
                    'content_hash' => $hash,
                    'text_path' => null,
                    'lang' => null,
                    'fetched_at' => now(),
                ]);
                $createdDocs++;
                IndexDocumentJob::dispatch($document->id, $text)->onQueue('index');
            }
        }

        $source->forceFill([
            'status' => $createdDocs > 0 ? 'crawling' : 'failed',
            'last_synced_at' => null,
            'error' => $createdDocs === 0 ? 'No supported files or no extractable text.' : null,
        ])->save();

        return back()->with('success', "Uploaded — {$createdDocs} segments queued for indexing.");
    }
}
