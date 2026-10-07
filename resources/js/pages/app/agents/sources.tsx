import { Head, router, useForm } from '@inertiajs/react';
import { Eye, RefreshCw, Trash2, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { TablePagination } from '@/components/table-pagination';
import type { PaginationMeta } from '@/components/table-pagination';
import { TableSearch } from '@/components/table-search';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Source = {
    id: string;
    type: 'url' | 'sitemap' | 'feed' | 'notion' | 'google_doc' | 'text' | 'file' | 'auto';
    status: 'pending' | 'crawling' | 'indexed' | 'failed';
    config: { url?: string } | null;
    last_synced_at: string | null;
    error: string | null;
    created_at: string | null;
    progress: { pages_indexed: number; pages_total: number | null };
    display: { title: string; subtitle: string; link: string | null };
};

type PreviewChunk = {
    id: string;
    ord: number;
    tokens: number;
    text: string;
};

type PreviewDoc = {
    id: string;
    url: string | null;
    title: string | null;
    fetched_at: string | null;
    chunks_count: number;
    first_chunk_preview: string;
    chunks: PreviewChunk[];
};

type PreviewPayload = {
    source: { id: string; type: string; status: string; error: string | null };
    progress: { pages_indexed: number; pages_total: number | null };
    documents: PreviewDoc[];
};

type Props = {
    agent?: { id: string; name: string };
    sources?: Source[];
    pagination?: PaginationMeta;
    filters?: { q: string };
};

const STATUS_COLOR: Record<string, string> = {
    pending: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
    crawling: 'bg-sky-500/15 text-sky-700 dark:text-sky-400',
    indexed: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
    failed: 'bg-rose-500/15 text-rose-700 dark:text-rose-400',
};

export default function Sources({
    agent,
    sources,
    pagination,
    filters,
}: Props) {
    const safeAgent = agent ?? { id: '', name: __('Agent') };
    const safeSources = Array.isArray(sources) ? sources : [];
    const safePagination = pagination ?? {
        total: safeSources.length,
        per_page: safeSources.length || 25,
        current_page: 1,
        last_page: 1,
        from: safeSources.length > 0 ? 1 : null,
        to: safeSources.length > 0 ? safeSources.length : null,
        links: [],
    };
    const safeFilters = filters ?? { q: '' };

    const form = useForm<{ type: 'url' | 'sitemap'; url: string }>({
        type: 'url',
        url: '',
    });
    const textForm = useForm<{
        title: string;
        body: string;
        source_url: string;
    }>({
        title: '',
        body: '',
        source_url: '',
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [preview, setPreview] = useState<PreviewPayload | null>(null);
    const [previewLoading, setPreviewLoading] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const refreshSources = () => {
        setRefreshing(true);
        // router.reload doesn't navigate, so scroll is preserved
        // implicitly  —  no preserveScroll option needed (and Inertia v3
        // ReloadOptions doesn't expose it anyway).
        router.reload({
            only: ['sources'],
            onFinish: () => setRefreshing(false),
        });
    };

    const openPreview = async (sourceId: string) => {
        setPreviewLoading(sourceId);

        try {
            const response = await fetch(`/app/sources/${sourceId}/preview`, {
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const json = await response.json();
            setPreview(json.data as PreviewPayload);
        } catch (e) {
            alert(e instanceof Error ? e.message : __('Preview failed.'));
        } finally {
            setPreviewLoading(null);
        }
    };

    // Esc to close + body scroll-lock while the preview modal is open.
    useEffect(() => {
        if (preview === null) {
            return;
        }

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setPreview(null);
            }
        };
        document.addEventListener('keydown', onKey);

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [preview]);

    const submitFiles = async () => {
        if (files.length === 0) {
            return;
        }

        setUploading(true);
        setUploadError(null);

        const fd = new FormData();

        for (const f of files) {
            fd.append('files[]', f);
        }

        fd.append(
            '_token',
            (
                document.querySelector(
                    'meta[name="csrf-token"]',
                ) as HTMLMetaElement | null
            )?.content ?? '',
        );

        try {
            const response = await fetch(`/app/agents/${safeAgent.id}/uploads`, {
                method: 'POST',
                body: fd,
                credentials: 'same-origin',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN':
                        (
                            document.querySelector(
                                'meta[name="csrf-token"]',
                            ) as HTMLMetaElement | null
                        )?.content ?? '',
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                const text = await response.text();

                throw new Error(text || `HTTP ${response.status}`);
            }

            setFiles([]);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            router.reload({ only: ['sources'] });
        } catch (e) {
            setUploadError(e instanceof Error ? e.message : __('Upload failed.'));
        } finally {
            setUploading(false);
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: __('Agents'), href: '/app/agents' },
        { title: safeAgent.name, href: `/app/agents/${safeAgent.id}` },
        { title: __('Sources'), href: `/app/agents/${safeAgent.id}/sources` },
    ];

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending':
                return __('pending');
            case 'crawling':
                return __('crawling');
            case 'indexed':
                return __('indexed');
            case 'failed':
                return __('failed');
            default:
                return status;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__(':name · sources', { name: safeAgent.name })} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {__('Knowledge sources')}
                </h1>

                <Card className="border-border/80 p-5">
                    <h2 className="mb-1 font-medium">{__('Add a page')}</h2>
                    <p className="mb-3 text-xs text-muted-foreground">
                        {__("Paste any page from your site. We'll fetch it, extract the text, and index it for the agent.")}
                    </p>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.post(`/app/agents/${safeAgent.id}/sources`, {
                                onSuccess: () => form.reset('url'),
                            });
                        }}
                        className="grid gap-3 md:grid-cols-[1fr_auto]"
                    >
                        <div className="grid gap-1.5">
                            <Input
                                id="url"
                                type="url"
                                placeholder="https://your-site.com/about"
                                value={form.data.url}
                                onChange={(e) =>
                                    form.setData('url', e.target.value)
                                }
                            />
                            {form.errors.url && (
                                <p className="mt-1 text-xs text-destructive">
                                    {form.errors.url}
                                </p>
                            )}
                        </div>
                        <Button type="submit" disabled={form.processing}>
                            {form.data.type === 'sitemap'
                                ? __('Add sitemap & crawl all')
                                : __('Add & crawl')}
                        </Button>
                    </form>
                    <details className="mt-3">
                        <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                            {__('Advanced')}
                        </summary>
                        <div className="mt-2 grid gap-2 rounded-md border bg-muted/20 p-3">
                            <Label className="text-xs">{__('Source type')}</Label>
                            <Select
                                value={form.data.type}
                                onValueChange={(v) =>
                                    form.setData('type', v as 'url' | 'sitemap')
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="url">
                                        {__('Single URL  —  crawl just this one page')}
                                    </SelectItem>
                                    <SelectItem value="sitemap">
                                        {__('Sitemap  —  crawl all URLs in the sitemap.xml')}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                {__('Only switch to "Sitemap" if you\'re pasting a real sitemap.xml.')}
                            </p>
                        </div>
                    </details>
                </Card>

                <Card className="border-border/80 p-5">
                    <h2 className="mb-1 font-medium">{__('Paste content directly')}</h2>
                    <p className="mb-3 text-xs text-muted-foreground">
                        {__("When a URL won't crawl (anti-bot challenges, login walls, JS-only sites), paste the page content here. We skip fetching and index it as-is.")}
                    </p>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            textForm.post(
                                `/app/agents/${safeAgent.id}/sources/text`,
                                {
                                    onSuccess: () => {
                                        textForm.reset(
                                            'title',
                                            'body',
                                            'source_url',
                                        );
                                    },
                                },
                            );
                        }}
                        className="grid gap-3"
                    >
                        <div className="grid gap-3 md:grid-cols-[1fr_1fr]">
                            <div className="grid gap-1.5">
                                <Label htmlFor="text-title">
                                    {__('Title (optional)')}
                                </Label>
                                <Input
                                    id="text-title"
                                    type="text"
                                    placeholder={__('MacBook Air M5  —  pricing & specs')}
                                    value={textForm.data.title}
                                    onChange={(e) =>
                                        textForm.setData(
                                            'title',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="text-source-url">
                                    {__('Source URL (optional)')}
                                </Label>
                                <Input
                                    id="text-source-url"
                                    type="url"
                                    placeholder="https://..."
                                    value={textForm.data.source_url}
                                    onChange={(e) =>
                                        textForm.setData(
                                            'source_url',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="text-body">{__('Content')}</Label>
                            <Textarea
                                id="text-body"
                                rows={6}
                                placeholder={__('Paste the text content here…')}
                                className="min-h-36 resize-y"
                                value={textForm.data.body}
                                onChange={(e) =>
                                    textForm.setData('body', e.target.value)
                                }
                            />
                            {textForm.errors.body && (
                                <p className="mt-1 text-xs text-destructive">
                                    {textForm.errors.body}
                                </p>
                            )}
                            <p className="mt-1 text-xs text-muted-foreground">
                                {__(':count chars · need at least 50', { count: textForm.data.body.length.toLocaleString() })}
                            </p>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={
                                    textForm.processing ||
                                    textForm.data.body.length < 50
                                }
                            >
                                {textForm.processing
                                    ? __('Indexing…')
                                    : __('Add as source')}
                            </Button>
                        </div>
                    </form>
                </Card>

                <Card className="border-border/80 p-5">
                    <h2 className="mb-3 font-medium">{__('Upload files')}</h2>
                    <p className="mb-3 text-xs text-muted-foreground">
                        {__('PDF, DOCX, CSV, TXT, MD. Max 10 files, 50 MB each.')}
                    </p>
                    <div
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragOver(true);
                        }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setDragOver(false);
                            const dropped = Array.from(
                                e.dataTransfer?.files ?? [],
                            ).slice(0, 10);
                            setFiles((prev) =>
                                [...prev, ...dropped].slice(0, 10),
                            );
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center text-sm transition ${
                            dragOver
                                ? 'border-foreground/50 bg-muted/70'
                                : 'border-muted-foreground/25 bg-muted/20 hover:bg-muted/35'
                        }`}
                    >
                        <Upload className="size-5 text-muted-foreground" />
                        <p className="text-muted-foreground">
                            {files.length > 0
                                ? __(':count file(s) selected  —  drop more or click', { count: files.length })
                                : __('Drop files here or click to browse')}
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept=".pdf,.docx,.doc,.csv,.txt,.md,.markdown"
                            className="hidden"
                            onChange={(e) => {
                                const picked = Array.from(
                                    e.currentTarget.files ?? [],
                                ).slice(0, 10);
                                setFiles((prev) =>
                                    [...prev, ...picked].slice(0, 10),
                                );
                            }}
                        />
                    </div>

                    {files.length > 0 && (
                        <ul className="mt-3 divide-y rounded-md border text-sm">
                            {files.map((f, i) => (
                                <li
                                    key={i}
                                    className="flex items-center justify-between px-3 py-2"
                                >
                                    <span className="truncate">{f.name}</span>
                                    <span className="ml-2 shrink-0 text-xs text-muted-foreground">
                                        {__(':size KB', { size: (f.size / 1024).toFixed(1) })}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}

                    {uploadError && (
                        <p className="mt-2 text-xs text-destructive">
                            {uploadError}
                        </p>
                    )}

                    <div className="mt-3 flex gap-2">
                        <Button
                            type="button"
                            disabled={files.length === 0 || uploading}
                            onClick={submitFiles}
                        >
                            {uploading
                                ? __('Uploading…')
                                : __(`Upload :count file(s)`, { count: files.length || '' }).trim()}
                        </Button>
                        {files.length > 0 && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setFiles([])}
                                disabled={uploading}
                            >
                                {__('Clear')}
                            </Button>
                        )}
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                            <h2 className="font-medium">
                                {__('Existing sources (:count)', { count: safePagination.total })}
                            </h2>
                            <TableSearch
                                placeholder={__('Search sources…')}
                                initialValue={safeFilters.q}
                                only={['sources', 'pagination', 'filters']}
                            />
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={refreshSources}
                            disabled={refreshing}
                            title={__('Re-fetch the latest status (after a crawl finishes)')}
                        >
                            <RefreshCw
                                className={`size-4 ${refreshing ? 'animate-spin' : ''}`}
                            />
                            {refreshing ? __('Refreshing…') : __('Refresh')}
                        </Button>
                    </div>
                    {safeSources.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            {__('None yet  —  add a URL above.')}
                        </p>
                    ) : (
                        <div className="divide-y">
                            {safeSources.map((source) => (
                                <div
                                    key={source.id}
                                    className="flex items-center justify-between gap-3 py-3"
                                >
                                    <div className="min-w-0 flex-1">
                                        {source.display.link ? (
                                            <a
                                                href={source.display.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block truncate text-sm font-medium hover:underline"
                                            >
                                                {source.display.title}
                                            </a>
                                        ) : (
                                            <p className="truncate text-sm font-medium">
                                                {source.display.title}
                                            </p>
                                        )}
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            {source.display.subtitle} ·{' '}
                                            {source.last_synced_at
                                                ? __('synced :at', { at: new Date(source.last_synced_at).toLocaleString() })
                                                : __('never synced')}
                                            {source.progress.pages_indexed >
                                                0 && (
                                                <>
                                                    {' '}
                                                    ·{' '}
                                                    {__(':count page(s)', { count: source.progress.pages_total ? `${source.progress.pages_indexed} / ${source.progress.pages_total}` : source.progress.pages_indexed })}
                                                </>
                                            )}
                                            {source.error && (
                                                <>
                                                    {' '}
                                                    ·{' '}
                                                    <span className="text-destructive">
                                                        {source.error}
                                                    </span>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                    <span
                                        className={`rounded px-2 py-0.5 text-xs ${STATUS_COLOR[source.status] ?? ''}`}
                                    >
                                        {getStatusLabel(source.status)}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openPreview(source.id)}
                                        disabled={previewLoading === source.id}
                                        title={__('Preview what was extracted')}
                                    >
                                        <Eye className="size-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            router.post(
                                                `/app/sources/${source.id}/reindex`,
                                            )
                                        }
                                    >
                                        {__('Reindex')}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            if (
                                                confirm(__('Delete this source?'))
                                            ) {
                                                router.delete(
                                                    `/app/sources/${source.id}`,
                                                );
                                            }
                                        }}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                    <TablePagination
                        pagination={safePagination}
                        only={['sources', 'pagination', 'filters']}
                    />
                </Card>

                {preview !== null && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                        onClick={() => setPreview(null)}
                    >
                        <div
                            className="max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-lg border bg-background p-6 shadow-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-semibold">
                                    {__('What the AI sees for this source')}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setPreview(null)}
                                    className="text-sm text-muted-foreground hover:text-foreground"
                                >
                                    {__('Close')}
                                </button>
                            </div>
                            <p className="mb-4 text-xs text-muted-foreground">
                                {__('Status')}{' '}
                                <span className="font-medium">
                                    {getStatusLabel(preview.source.status)}
                                </span>{' '}
                                · {__(':count page(s) indexed', { count: preview.progress.pages_total ? `${preview.progress.pages_indexed} / ${preview.progress.pages_total}` : preview.progress.pages_indexed })}
                                {preview.source.error && (
                                    <>
                                        {' '}
                                        ·{' '}
                                        <span className="text-destructive">
                                            {preview.source.error}
                                        </span>
                                    </>
                                )}
                            </p>
                            {preview.documents.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    {__('No content extracted yet. Try Reindex, or check the error message above.')}
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {preview.documents.map((doc) => (
                                        <div
                                            key={doc.id}
                                            className="rounded border p-3"
                                        >
                                            <p className="truncate text-sm font-medium">
                                                {doc.title ?? __('(no title)')}
                                            </p>
                                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                                {doc.url ?? ''}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {__(':count chunk(s)', { count: doc.chunks_count })}
                                                {doc.chunks.length <
                                                    doc.chunks_count && (
                                                    <>
                                                        {' '}
                                                        · {__('showing first :count', { count: doc.chunks.length })}
                                                    </>
                                                )}
                                                {doc.fetched_at && (
                                                    <>
                                                        {' '}
                                                        · {__('fetched :at', { at: new Date(doc.fetched_at).toLocaleString() })}
                                                    </>
                                                )}
                                            </p>

                                            {doc.chunks.length === 0 ? (
                                                <pre className="mt-2 rounded bg-muted p-2 text-xs">
                                                    {__('(empty)')}
                                                </pre>
                                            ) : (
                                                <details className="mt-2" open>
                                                    <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                                                        {__('View chunks')}
                                                    </summary>
                                                    <div className="mt-2 max-h-72 space-y-2 overflow-y-auto">
                                                        {doc.chunks.map((c) => (
                                                            <div
                                                                key={c.id}
                                                                className="rounded border bg-muted/40 p-2 text-xs"
                                                            >
                                                                <p className="mb-1 text-[10px] tracking-wide text-muted-foreground uppercase">
                                                                    {__('chunk :ord', { ord: c.ord })} ·{' '}
                                                                    {__(':count tokens', { count: c.tokens })}
                                                                </p>
                                                                <pre className="leading-snug whitespace-pre-wrap">
                                                                    {c.text}
                                                                </pre>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </details>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
