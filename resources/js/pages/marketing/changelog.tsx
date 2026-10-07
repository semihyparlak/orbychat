import { Head, Link } from '@inertiajs/react';
import { Rss } from 'lucide-react';
import { Fragment } from 'react';
import { MarketingShell } from '@/layouts/marketing-shell';
import type { MarketingShellContent } from '@/layouts/marketing-shell';

type Entry = {
    version: string;
    released_at: string | null;
    released_at_human: string | null;
    title: string;
    body: string;
};

type Props = {
    shell: MarketingShellContent;
    brand: string;
    entries: Entry[];
};

export default function MarketingChangelog({ shell, brand, entries }: Props) {
    return (
        <>
            <Head title={`Changelog  —  ${brand}`}>
                <meta
                    name="description"
                    content={`Release notes for ${brand}  —  every shipped change, organised by version.`}
                />
            </Head>

            <MarketingShell content={shell}>
                <section className="mx-auto max-w-3xl px-6 pt-16 pb-10 lg:pt-20">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/85 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-slate-600 uppercase">
                                Changelog
                            </span>
                            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                                What's new in {brand}
                            </h1>
                            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                                Every shipped change, newest first. Linkable per
                                version  —  anchor on{' '}
                                <code className="rounded bg-slate-100 px-1 font-mono text-sm">
                                    #vX.Y.Z
                                </code>
                                .
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-3xl px-6 pb-24">
                    {entries.length === 0 ? (
                        <p className="text-sm text-slate-500">
                            No published entries yet.
                        </p>
                    ) : (
                        <div className="grid gap-12">
                            {entries.map((entry) => (
                                <article
                                    key={entry.version}
                                    id={entry.version}
                                    className="scroll-mt-24"
                                >
                                    <header className="flex flex-wrap items-baseline gap-3 border-b border-slate-900/10 pb-3">
                                        <h2 className="font-mono text-2xl font-bold tracking-tight text-slate-950">
                                            {entry.version}
                                        </h2>
                                        {entry.released_at_human && (
                                            <time
                                                className="text-sm text-slate-500"
                                                dateTime={
                                                    entry.released_at ??
                                                    undefined
                                                }
                                            >
                                                {entry.released_at_human}
                                            </time>
                                        )}
                                    </header>
                                    <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                        {entry.title}
                                    </h3>
                                    <div className="mt-3 text-[15px] leading-7 text-slate-700">
                                        <ChangelogBody markdown={entry.body} />
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </MarketingShell>
        </>
    );
}

/**
 * Tiny renderer for the subset of markdown changelog entries actually
 * use: ## / ### headings, bullet lists, **bold**, `code`, plain
 * paragraphs. Keeping this in-house avoids pulling marked + DOMPurify
 * into the marketing bundle for ~5 syntax cases.
 *
 * Intentionally NOT a general-purpose markdown renderer. If we ever
 * need full Commonmark, swap this for `marked` + `DOMPurify` and
 * server-side-render before send.
 */
function ChangelogBody({ markdown }: { markdown: string }) {
    const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
    const blocks: Array<
        | { kind: 'heading'; level: 2 | 3; text: string }
        | { kind: 'bullets'; items: string[] }
        | { kind: 'paragraph'; text: string }
        | { kind: 'spacer' }
    > = [];

    let bullets: string[] | null = null;
    let paragraph: string[] | null = null;

    const flushBullets = () => {
        if (bullets && bullets.length > 0) {
            blocks.push({ kind: 'bullets', items: bullets });
        }

        bullets = null;
    };
    const flushParagraph = () => {
        if (paragraph && paragraph.length > 0) {
            blocks.push({ kind: 'paragraph', text: paragraph.join(' ') });
        }

        paragraph = null;
    };

    for (const raw of lines) {
        const line = raw.trim();

        if (line === '') {
            flushBullets();
            flushParagraph();
            blocks.push({ kind: 'spacer' });
            continue;
        }

        if (line.startsWith('### ')) {
            flushBullets();
            flushParagraph();
            blocks.push({
                kind: 'heading',
                level: 3,
                text: line.slice(4),
            });
            continue;
        }

        if (line.startsWith('## ')) {
            flushBullets();
            flushParagraph();
            blocks.push({
                kind: 'heading',
                level: 2,
                text: line.slice(3),
            });
            continue;
        }

        if (line.startsWith('- ') || line.startsWith('* ')) {
            flushParagraph();

            if (bullets === null) {
                bullets = [];
            }

            bullets.push(line.slice(2));
            continue;
        }

        flushBullets();

        if (paragraph === null) {
            paragraph = [];
        }

        paragraph.push(line);
    }

    flushBullets();
    flushParagraph();

    return (
        <>
            {blocks.map((block, i) => {
                if (block.kind === 'spacer') {
                    return null;
                }

                if (block.kind === 'heading') {
                    return block.level === 2 ? (
                        <h3
                            key={i}
                            className="mt-6 text-base font-semibold text-slate-900"
                        >
                            {renderInline(block.text)}
                        </h3>
                    ) : (
                        <h4
                            key={i}
                            className="mt-5 text-sm font-semibold text-slate-900"
                        >
                            {renderInline(block.text)}
                        </h4>
                    );
                }

                if (block.kind === 'bullets') {
                    return (
                        <ul
                            key={i}
                            className="mt-2 list-disc space-y-1 pl-6 text-[15px] leading-7 text-slate-700"
                        >
                            {block.items.map((item, j) => (
                                <li key={j}>{renderInline(item)}</li>
                            ))}
                        </ul>
                    );
                }

                return (
                    <p key={i} className="mt-3">
                        {renderInline(block.text)}
                    </p>
                );
            })}
        </>
    );
}

/**
 * Inline markdown  —  only **bold** and `code` for now. Unrecognised
 * sequences pass through as plain text so nothing escapes the
 * renderer as raw HTML.
 */
function renderInline(text: string) {
    const tokens: Array<string | { kind: 'bold' | 'code'; text: string }> = [];
    let cursor = 0;

    while (cursor < text.length) {
        const remaining = text.slice(cursor);
        const codeMatch = remaining.match(/^`([^`]+)`/);

        if (codeMatch) {
            tokens.push({ kind: 'code', text: codeMatch[1] });
            cursor += codeMatch[0].length;
            continue;
        }

        const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);

        if (boldMatch) {
            tokens.push({ kind: 'bold', text: boldMatch[1] });
            cursor += boldMatch[0].length;
            continue;
        }

        // Consume up to the next inline marker as plain text.
        const nextMarker = remaining.search(/`|\*\*/);

        if (nextMarker === -1) {
            tokens.push(remaining);
            cursor = text.length;
            continue;
        }

        tokens.push(remaining.slice(0, nextMarker));
        cursor += nextMarker;
    }

    return tokens.map((token, i) => {
        if (typeof token === 'string') {
            return <Fragment key={i}>{token}</Fragment>;
        }

        if (token.kind === 'code') {
            return (
                <code
                    key={i}
                    className="rounded bg-slate-100 px-1 font-mono text-[0.9em] text-slate-800"
                >
                    {token.text}
                </code>
            );
        }

        return (
            <strong key={i} className="font-semibold text-slate-900">
                {token.text}
            </strong>
        );
    });
}
