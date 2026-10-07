import { Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    ChevronRight,
    Database,
    ExternalLink,
    FileText,
    RefreshCw,
    Search,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Chunk = {
    id: string;
    ord: number;
    tokens: number;
    text: string;
    chars: number;
};

type Doc = {
    id: string;
    url: string | null;
    title: string | null;
    fetched_at: string | null;
    source_type: string | null;
    source_label: string;
    crawler: string | null;
    chunks_count: number;
    preview: string;
    chunks: Chunk[];
    sample_chars: number;
};

type Paginated<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
};

type Props = {
    agent: { id: string; name: string };
    totals: { documents: number; chunks: number; characters: number };
    documents: Paginated<Doc>;
    q: string;
};

function relativeTime(iso: string | null): string {
    if (!iso) {
        return ' — ';
    }

    const ms = Date.now() - new Date(iso).getTime();
    const sec = Math.max(1, Math.round(ms / 1000));

    if (sec < 60) {
        return __('just now');
    }

    const min = Math.round(sec / 60);

    if (min < 60) {
        return __(':countm ago', { count: min });
    }

    const h = Math.round(min / 60);

    if (h < 24) {
        return __(':counth ago', { count: h });
    }

    const d = Math.round(h / 24);

    return __(':countd ago', { count: d });
}

function formatBytes(chars: number): string {
    // Approximation  —  1 char -‰ˆ 1 byte for ASCII, ~2 for UTF-8 mixed.
    if (chars < 1000) {
        return __(':count chars', { count: chars });
    }

    if (chars < 1_000_000) {
        return __(':countk chars', { count: (chars / 1000).toFixed(1) });
    }

    return __(':countM chars', { count: (chars / 1_000_000).toFixed(2) });
}

export default function KnowledgePage({
    agent,
    totals,
    documents,
    q: initialQ,
}: Props) {
    const [q, setQ] = useState(initialQ);
    const [openId, setOpenId] = useState<string | null>(null);
    const [reindexingId, setReindexingId] = useState<string | null>(null);

    const search = (next: string) => {
        setQ(next);
        router.get(
            `/app/agents/${agent.id}/knowledge`,
            next ? { q: next } : {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['documents', 'q'],
            },
        );
    };

    const reindex = (docId: string) => {
        setReindexingId(docId);
        router.post(
            `/app/documents/${docId}/reindex`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setReindexingId(null),
            },
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: __('Agents'), href: '/app/agents' },
        { title: agent.name, href: `/app/agents/${agent.id}` },
        { title: __('Knowledge'), href: `/app/agents/${agent.id}/knowledge` },
    ];

    const getSourceLabelTranslation = (label: string) => {
        switch (label) {
            case 'URL':
                return __('URL');
            case 'Sitemap':
                return __('Sitemap');
            case 'Notion':
                return __('Notion');
            case 'Google Doc':
                return __('Google Doc');
            case 'Pasted text':
                return __('Pasted text');
            case 'Auto-indexed (visitor visit)':
                return __('Auto-indexed (visitor visit)');
            case 'Uploaded file':
                return __('Uploaded file');
            default:
                return label;
        }
    };

    const SOURCE_TONE: Record<string, string> = {
        URL: 'bg-sky-500/15 text-sky-700 dark:text-sky-400',
        Sitemap: 'bg-violet-500/15 text-violet-700 dark:text-violet-400',
        Notion: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
        'Google Doc': 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
        'Pasted text': 'bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-400',
        'Auto-indexed (visitor visit)':
            'bg-rose-500/15 text-rose-700 dark:text-rose-400',
        'Uploaded file': 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__(':name · knowledge', { name: agent.name })} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {__('What the AI knows')}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {__("Every page and document we've indexed for this agent. Click a row to see the actual extracted text  —  that's what the model sees when answering questions.")}
                    </p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    <Card className="p-4">
                        <p className="text-xs tracking-wide text-muted-foreground uppercase">
                            {__('Documents')}
                        </p>
                        <p className="mt-1 text-2xl font-semibold tabular-nums">
                            {totals.documents.toLocaleString()}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {__('indexed pages / files')}
                        </p>
                    </Card>
                    <Card className="p-4">
                        <p className="text-xs tracking-wide text-muted-foreground uppercase">
                            {__('Chunks')}
                        </p>
                        <p className="mt-1 text-2xl font-semibold tabular-nums">
                            {totals.chunks.toLocaleString()}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {__('embedding-sized text blocks')}
                        </p>
                    </Card>
                    <Card className="p-4">
                        <p className="text-xs tracking-wide text-muted-foreground uppercase">
                            {__('Total content')}
                        </p>
                        <p className="mt-1 text-2xl font-semibold tabular-nums">
                            {formatBytes(totals.characters)}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {__('searchable text the AI can quote')}
                        </p>
                    </Card>
                </div>

                {/* Search */}
                <Card className="p-3">
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder={__('Search by URL or title…')}
                            value={q}
                            onChange={(e) => search(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </Card>

                {/* Documents list */}
                {documents.data.length === 0 ? (
                    <Card className="p-8 text-center">
                        <Database className="mx-auto size-10 text-muted-foreground/40" />
                        <p className="mt-3 text-sm font-medium">
                            {initialQ
                                ? __('No documents match that search.')
                                : __('Nothing indexed yet.')}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {initialQ ? (
                                __('Try a different keyword.')
                            ) : (
                                <>
                                    {__('Add a knowledge source first')}  — {' '}
                                    <Link
                                        href={`/app/agents/${agent.id}/sources`}
                                        className="underline hover:text-foreground"
                                    >
                                        {__('Sources page')}
                                    </Link>
                                </>
                            )}
                        </p>
                    </Card>
                ) : (
                    <Card className="p-0">
                        <div className="divide-y">
                            {documents.data.map((doc) => {
                                const isOpen = openId === doc.id;
                                const tone =
                                    SOURCE_TONE[doc.source_label] ??
                                    'bg-muted text-muted-foreground';
                                const indexingFailed = doc.chunks_count === 0;
                                const isReindexing = reindexingId === doc.id;

                                return (
                                    <div key={doc.id}>
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            onClick={() =>
                                                setOpenId(
                                                    isOpen ? null : doc.id,
                                                )
                                            }
                                            onKeyDown={(e) => {
                                                if (
                                                    e.key === 'Enter' ||
                                                    e.key === ' '
                                                ) {
                                                    e.preventDefault();
                                                    setOpenId(
                                                        isOpen ? null : doc.id,
                                                    );
                                                }
                                            }}
                                            className="flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left transition hover:bg-muted/50"
                                        >
                                            <ChevronRight
                                                className={`mt-0.5 size-4 shrink-0 text-muted-foreground transition ${
                                                    isOpen ? 'rotate-90' : ''
                                                }`}
                                            />
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="truncate text-sm font-medium">
                                                        {doc.title ||
                                                            __('(no title)')}
                                                    </p>
                                                    <span
                                                        className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${tone}`}
                                                    >
                                                        {getSourceLabelTranslation(doc.source_label)}
                                                    </span>
                                                    {doc.crawler && (
                                                        <span className="rounded border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                                                            {__('via :crawler', { crawler: doc.crawler })}
                                                        </span>
                                                    )}
                                                    {indexingFailed && (
                                                        <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-400">
                                                            <AlertTriangle className="size-3" />
                                                            {__("Indexing didn't finish")}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                                    {doc.url || __('(no url)')}
                                                </p>
                                                {indexingFailed ? (
                                                    <p className="mt-1 text-xs text-amber-700/80 dark:text-amber-400/80">
                                                        {__('The page was crawled but no searchable chunks were created  —  usually a transient embedding-API hiccup. Click Reindex to retry.')}
                                                    </p>
                                                ) : (
                                                    doc.preview && (
                                                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground/90">
                                                            {doc.preview}
                                                        </p>
                                                    )
                                                )}
                                            </div>
                                            <div className="flex shrink-0 flex-col items-end gap-1 text-right">
                                                <span
                                                    className={`text-xs font-medium tabular-nums ${
                                                        indexingFailed
                                                            ? 'text-amber-700 dark:text-amber-400'
                                                            : ''
                                                    }`}
                                                >
                                                    {__(':count chunks', { count: doc.chunks_count })}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {relativeTime(
                                                        doc.fetched_at,
                                                    )}
                                                </span>
                                                {doc.url && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="mt-1 h-7 px-2 text-[11px]"
                                                        disabled={isReindexing}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            reindex(doc.id);
                                                        }}
                                                        title={__('Re-crawl this page and rebuild its chunks')}
                                                    >
                                                        <RefreshCw
                                                            className={`size-3 ${isReindexing ? 'animate-spin' : ''}`}
                                                        />
                                                        {isReindexing
                                                            ? __('Queuing…')
                                                            : __('Reindex')}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {isOpen && (
                                            <div className="border-t bg-muted/20 px-4 py-4">
                                                <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                                    <span className="inline-flex items-center gap-1">
                                                        <FileText className="size-3.5" />{' '}
                                                        {__(':count of :total chunks shown', { count: doc.chunks.length, total: doc.chunks_count })}
                                                    </span>
                                                    {doc.url && (
                                                        <a
                                                            href={doc.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-foreground/80 hover:underline"
                                                        >
                                                            <ExternalLink className="size-3.5" />{' '}
                                                            {__('Open original')}
                                                        </a>
                                                    )}
                                                </div>
                                                <div className="space-y-3">
                                                    {doc.chunks.map((c) => (
                                                        <div
                                                            key={c.id}
                                                            className="rounded-md border bg-background p-3"
                                                        >
                                                            <p className="mb-2 text-[10px] tracking-wider text-muted-foreground uppercase">
                                                                {__('chunk :ord', { ord: c.ord })} ·{' '}
                                                                {__(':count tokens', { count: c.tokens })} ·{' '}
                                                                {__(':count chars', { count: c.chars })}
                                                            </p>
                                                            <pre className="text-xs leading-relaxed whitespace-pre-wrap text-foreground/90">
                                                                {c.text}
                                                            </pre>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {documents.last_page > 1 && (
                            <div className="flex items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground">
                                <span>
                                    {__('Showing :from-€“:to of :total', { from: documents.from, to: documents.to, total: documents.total.toLocaleString() })}
                                </span>
                                <div className="flex gap-1">
                                    {documents.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url ?? '#'}
                                            className={`rounded px-2 py-1 ${
                                                link.active
                                                    ? 'bg-foreground text-background'
                                                    : link.url
                                                      ? 'hover:bg-muted'
                                                      : 'cursor-not-allowed opacity-40'
                                            }`}
                                            preserveState
                                            preserveScroll
                                            only={['documents']}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
