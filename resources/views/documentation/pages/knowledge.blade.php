<p>
    Sources are how an agent learns about your business. This page
    covers every kind of source, the ingestion pipeline, and what to expect
    after you click "Add".
</p>

<h2>Source types</h2>

<table>
    <thead>
        <tr><th>Type</th><th>Use it for</th><th>What we ingest</th></tr>
    </thead>
    <tbody>
        <tr><td><code>url</code></td><td>One specific page</td><td>Crawl + extract main content + chunk + embed</td></tr>
        <tr><td><code>sitemap</code></td><td>A whole site at once</td><td>Read sitemap, fan out to one <code>CrawlPageJob</code> per URL</td></tr>
        <tr><td><code>feed</code></td><td>RSS / Atom blogs</td><td>Same as sitemap but reads <code>&lt;item&gt;</code> entries</td></tr>
        <tr><td><code>text</code></td><td>FAQs, snippets, anything you can paste</td><td>Skip the crawl, chunk + embed directly</td></tr>
        <tr><td><code>notion</code></td><td>Notion pages or databases</td><td>OAuth into Notion, fetch via API, treat each page as a document</td></tr>
        <tr><td><code>google_doc</code></td><td>Google Docs (Workspace)</td><td>OAuth, fetch via Drive API, ingest as a document</td></tr>
        <tr><td><code>auto</code></td><td>Pages visitors land on</td><td>Auto-queued by <code>AutoIndexPageVisit</code> from <code>/v1/widget/init</code></td></tr>
    </tbody>
</table>

<h2>Add a source</h2>

<p>
    Open <code>/app/agents/{id}/sources</code>. The <strong>Add source</strong>
    modal handles all types in one form. Behind the scenes:
</p>

<ol>
    <li><strong>Validate</strong>. URLs must be http/https; private hosts (<code>10.x</code>, <code>192.168.x</code>, <code>127.x</code>, <code>::1</code>) are blocked to prevent SSRF.</li>
    <li><strong>Create the source row</strong> with <code>status = pending</code>.</li>
    <li><strong>Dispatch a job</strong> — <code>CrawlSourceJob</code> for url/sitemap/feed; <code>IngestNotionPageJob</code>/<code>IngestGoogleDocJob</code> for connected sources; <code>IndexTextSourceJob</code> for pasted text.</li>
    <li><strong>The job runs on the <code>crawl</code> queue</strong>, fetches content, creates Document rows, then dispatches <code>IndexDocumentJob</code> on the <code>index</code> queue.</li>
    <li><strong>The status flips</strong> from <code>pending â†’ crawling â†’ done</code> (or <code>failed</code> with an error message you can read in the UI).</li>
</ol>

<h2>Auto-discovery</h2>

<p>
    On the sources page, the <strong>Discover</strong> button takes a domain
    and probes it for crawlable pages without you having to list them. We:
</p>

<ul>
    <li>Read <code>robots.txt</code> for sitemap declarations.</li>
    <li>Probe a sitemap directly when present.</li>
    <li>Try a small set of common paths: <code>/about</code>, <code>/pricing</code>, <code>/features</code>, <code>/products</code>, <code>/faq</code>, <code>/docs</code>, <code>/help</code>, <code>/support</code>, <code>/contact</code>.</li>
    <li>Return a checkable list. Tick which to ingest, hit <strong>Add selected</strong>.</li>
</ul>

<h2>Crawler strategies</h2>

<p>
    The crawler is provider-driven. In order of preference:
</p>

<ol>
    <li><strong>Cloudflare Browser Rendering</strong> — preferred. Full JS rendering, fast, no SSRF risk because egress is on Cloudflare. Used when <code>CLOUDFLARE_ACCOUNT_ID</code> + <code>CLOUDFLARE_API_TOKEN</code> are set.</li>
    <li><strong>Browserless</strong> — fallback when <code>BROWSERLESS_TOKEN</code> is set. Same headless-Chrome behavior on a different vendor.</li>
    <li><strong>Plain HTTP</strong> — last resort for server-rendered sites. No JS execution. Free.</li>
</ol>

<p>
    Once HTML is in hand, <code>ReadabilityExtractor</code> strips nav,
    footer, ads, etc., leaving the article body. Pages under 200 chars or
    detected as 404s are dropped.
</p>

<h2>Chunking and embedding</h2>

<p>
    The extractor's text goes into <code>Chunker</code>, a recursive
    splitter that prefers semantic boundaries:
</p>

<ol>
    <li>Split on markdown headings, then blank lines (paragraphs).</li>
    <li>Pack paragraphs greedily up to a target size (~2000 chars / ~500 tokens).</li>
    <li>If a paragraph is too big, fall back to sentence boundaries.</li>
    <li>Char-window as the absolute last resort.</li>
    <li>Add a small overlap between chunks so cross-chunk facts stay linkable.</li>
</ol>

<p>
    Each chunk is embedded in a batch (default 100 chunks per call) and
    upserted into the vector store with metadata: <code>agent_id</code>,
    <code>document_id</code>, <code>chunk_id</code>, <code>url</code>,
    <code>workspace_id</code>, <code>source_id</code>, <code>lang</code>.
</p>

<h2>Reindex and preview</h2>

<p>
    From the sources list, each row has:
</p>

<ul>
    <li><strong>Reindex</strong> — re-runs the crawl + chunk + embed pipeline.</li>
    <li><strong>Preview</strong> — shows the extracted documents and a sample of chunks so you can spot bad extraction (e.g. nav bar polluting the text).</li>
    <li><strong>Delete</strong> — removes the source, its documents, its chunks, and the corresponding vector points.</li>
</ul>

<h2>Notion and Google Docs</h2>

<p>
    Both use OAuth. Connect once from <code>/app/integrations</code>; the
    token is encrypted at rest. After connecting, the source modal lets you
    pick pages or documents directly.
</p>

<p>
    Re-syncs are manual (per-source <strong>Reindex</strong> button) — we
    don't poll your Notion / Drive on a schedule. If you change a Notion
    page, click Reindex on that source.
</p>

<h2>Storage and retention</h2>

<ul>
    <li><strong>Postgres</strong> — sources, documents, chunks (text + metadata).</li>
    <li><strong>Vector store</strong> — embeddings. Cloudflare Vectorize when configured, Qdrant otherwise.</li>
    <li><strong>R2 / object storage</strong> — original artifacts (PDFs, images) when uploaded.</li>
</ul>

<p>
    Deleting a source cascades: documents, chunks, and vector points all go
    in one transaction. There's no soft-delete on sources.
</p>
