import { Head } from '@inertiajs/react';
import { MarketingShell } from '@/layouts/marketing-shell';
import type { MarketingShellContent } from '@/layouts/marketing-shell';
import { __ } from '@/app';

type ListSection = {
    summary?: string;
    items?: string[];
};

type PrivacyContent = {
    eyebrow?: string;
    title?: string;
    summary?: string;
    effective_date?: string;
    contact?: { team_name?: string; email?: string; response_sla?: string };
    collection?: ListSection;
    usage?: ListSection;
    retention?: ListSection;
    rights?: ListSection;
    gdpr?: {
        summary?: string;
        request_email?: string;
        request_instructions?: string;
    };
};

type Props = {
    shell: MarketingShellContent;
    brand: string;
    content: PrivacyContent;
};

function Section({
    title,
    section,
}: {
    title: string;
    section: ListSection | undefined;
}) {
    if (!section) {
        return null;
    }

    return (
        <section className="mt-10">
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                {__(title)}
            </h2>
            {section.summary && (
                <p className="mt-2 text-sm leading-6 text-slate-600">
                    {__(section.summary)}
                </p>
            )}
            {section.items && section.items.length > 0 && (
                <ul className="mt-3 list-disc space-y-1 pl-6 text-sm leading-6 text-slate-600">
                    {section.items.map((item) => (
                        <li key={item}>{__(item)}</li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default function Privacy({ shell, brand, content }: Props) {
    const title = content.title ?? __('Privacy policy');

    return (
        <>
            <Head title={`${__(title)}  —  ${brand}`} />

            <MarketingShell content={shell}>
                <article className="mx-auto max-w-3xl px-6 pt-16 pb-20">
                    {content.eyebrow && (
                        <p className="text-sm font-medium tracking-wider text-emerald-700 uppercase">
                            {__(content.eyebrow)}
                        </p>
                    )}
                    <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                        {__(title)}
                    </h1>
                    {content.summary && (
                        <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
                            {__(content.summary)}
                        </p>
                    )}
                    {content.effective_date && (
                        <p className="mt-2 text-sm text-slate-500">
                            <strong className="text-slate-700">
                                {__('Effective date:')}
                            </strong>{' '}
                            {__(content.effective_date)}
                        </p>
                    )}

                    {content.contact && (
                        <section className="mt-10">
                            <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                                {__('Contact')}
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                {__(content.contact.team_name ?? '')}
                                {content.contact.email && (
                                    <>
                                        <br />
                                        <a
                                            href={`mailto:${content.contact.email}`}
                                            className="text-emerald-700 underline underline-offset-4"
                                        >
                                            {content.contact.email}
                                        </a>
                                    </>
                                )}
                                {content.contact.response_sla && (
                                    <>
                                        <br />
                                        {__(content.contact.response_sla)}
                                    </>
                                )}
                            </p>
                        </section>
                    )}

                    <Section
                        title="What we collect"
                        section={content.collection}
                    />
                    <Section title="How we use data" section={content.usage} />
                    <Section title="Retention" section={content.retention} />
                    <Section title="Your rights" section={content.rights} />

                    {content.gdpr && (
                        <section className="mt-10">
                            <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                                {__('Data export & deletion (GDPR)')}
                            </h2>
                            {content.gdpr.summary && (
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    {__(content.gdpr.summary)}
                                </p>
                            )}
                            {content.gdpr.request_email && (
                                <p className="mt-2 text-sm text-slate-600">
                                    <strong className="text-slate-700">
                                        {__('Request contact:')}
                                    </strong>{' '}
                                    <a
                                        href={`mailto:${content.gdpr.request_email}`}
                                        className="text-emerald-700 underline underline-offset-4"
                                    >
                                        {content.gdpr.request_email}
                                    </a>
                                </p>
                            )}
                            {content.gdpr.request_instructions && (
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    {__(content.gdpr.request_instructions)}
                                </p>
                            )}
                        </section>
                    )}
                </article>
            </MarketingShell>
        </>
    );
}
