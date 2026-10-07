import { useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { update as updateSystemSettings } from '@/routes/settings/system';

export type MarketingLinkItem = {
    label: string;
    href: string;
};

export type MarketingIconCard = {
    icon: string;
    title: string;
    description: string;
};

export type MarketingStatItem = {
    icon: string;
    value: string;
    label: string;
};

export type MarketingSettingRow = {
    label: string;
    hint: string;
    value: string;
};

export type MarketingFooterGroup = {
    title: string;
    links: MarketingLinkItem[];
};

export type MarketingContentFormValue = {
    brand_name: string;
    nav_items: MarketingLinkItem[];
    header: {
        resources_label: string;
        resources_href: string;
        primary_button_label: string;
        primary_button_href: string;
    };
    hero: {
        badge: string;
        line_one: string;
        accent: string;
        line_two_suffix: string;
        line_three_prefix: string;
        line_three_highlight: string;
        line_four_highlight: string;
        description: string;
        site_test_label: string;
        site_test_placeholder: string;
        site_test_button_label: string;
        site_test_helper: string;
        live_demo_notice: string;
    };
    chat_preview: {
        title: string;
        badge: string;
        question: string;
        answer: string;
        plan_badge: string;
        plan_name: string;
        plan_price: string;
        plan_interval: string;
        plan_note: string;
        plan_features: string[];
        plan_button_label: string;
        typing_label: string;
        powered_by_prefix: string;
    };
    stats: MarketingStatItem[];
    video: {
        badge: string;
        title: string;
        description: string;
        bullets: string[];
        duration_label: string;
        tag_label: string;
        scene_label: string;
        card_title: string;
        timecode: string;
        chips: string[];
        footer_title: string;
        footer_description: string;
        button_label: string;
        href: string;
    };
    where_it_fits: {
        badge: string;
        title: string;
        cards: MarketingIconCard[];
    };
    feature_grid: {
        badge: string;
        title: string;
        cards: MarketingIconCard[];
    };
    control: {
        badge: string;
        title: string;
        description: string;
        callouts: MarketingIconCard[];
        settings_card_title: string;
        settings_rows: MarketingSettingRow[];
        cancel_label: string;
        save_button_label: string;
    };
    steps: {
        badge: string;
        title: string;
        items: MarketingIconCard[];
    };
    insights: {
        badge: string;
        chart_title: string;
        chart_description: string;
        metric_label: string;
        metric_value: string;
        metric_trend: string;
        chart_points: number[];
        chart_labels: string[];
        cards: MarketingIconCard[];
    };
    final_cta: {
        title: string;
        description: string;
        primary_button_label: string;
        primary_button_href: string;
        secondary_button_label: string;
        secondary_button_href: string;
    };
    footer: {
        brand_description: string;
        socials: MarketingLinkItem[];
        groups: MarketingFooterGroup[];
        legal_title: string;
        legal_links: MarketingLinkItem[];
        copyright: string;
    };
};

type Props = {
    initial: MarketingContentFormValue;
};

type MarketingTabKey =
    | 'brand'
    | 'hero'
    | 'preview'
    | 'features'
    | 'closing'
    | 'footer';

const MARKETING_TABS: Array<{
    key: MarketingTabKey;
    label: string;
    description: string;
}> = [
    {
        key: 'brand',
        label: __('Brand & nav'),
        description: __('Header identity, resources link, and navigation items.'),
    },
    {
        key: 'hero',
        label: __('Hero'),
        description:
            __('Main headline, site-test form copy, and live demo notice.'),
    },
    {
        key: 'preview',
        label: __('Preview & video'),
        description:
            __('Chat preview card, headline stats, and walkthrough block.'),
    },
    {
        key: 'features',
        label: __('Feature sections'),
        description:
            __('Where-it-fits, feature grid, control area, and setup steps.'),
    },
    {
        key: 'closing',
        label: __('Insights & CTA'),
        description: __('Analytics section and the final call to action.'),
    },
    {
        key: 'footer',
        label: __('Footer'),
        description:
            __('Footer description, socials, grouped links, legal links, and copyright.'),
    },
];

function cloneContent(
    content: MarketingContentFormValue,
): MarketingContentFormValue {
    return JSON.parse(JSON.stringify(content)) as MarketingContentFormValue;
}

function setNestedValue(
    source: MarketingContentFormValue,
    path: Array<string | number>,
    value: unknown,
): MarketingContentFormValue {
    const draft = cloneContent(source) as MarketingContentFormValue &
        Record<string | number, unknown>;
    let cursor: Record<string | number, unknown> = draft;

    for (let index = 0; index < path.length - 1; index++) {
        cursor = cursor[path[index]] as Record<string | number, unknown>;
    }

    cursor[path[path.length - 1]] = value;

    return draft;
}

function updateNestedList(
    source: MarketingContentFormValue,
    path: Array<string | number>,
    updater: (items: unknown[]) => unknown[],
): MarketingContentFormValue {
    const draft = cloneContent(source) as MarketingContentFormValue &
        Record<string | number, unknown>;
    let cursor: Record<string | number, unknown> = draft;

    for (let index = 0; index < path.length - 1; index++) {
        cursor = cursor[path[index]] as Record<string | number, unknown>;
    }

    const key = path[path.length - 1];
    const current = Array.isArray(cursor[key])
        ? (cursor[key] as unknown[])
        : [];
    cursor[key] = updater(current);

    return draft;
}

function stringListToText(values: string[]): string {
    return values.join('\n');
}

function textToStringList(value: string): string[] {
    return value
        .split('\n')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
}

function numberListToText(values: number[]): string {
    return values.join(', ');
}

function textToNumberList(value: string): number[] {
    return value
        .split(/[\n,]+/)
        .map((item) => Number(item.trim()))
        .filter((item) => Number.isFinite(item));
}

function blankLink(): MarketingLinkItem {
    return { label: '', href: '' };
}

function blankIconCard(): MarketingIconCard {
    return { icon: 'Sparkles', title: '', description: '' };
}

function blankStat(): MarketingStatItem {
    return { icon: 'Sparkles', value: '', label: '' };
}

function blankSettingRow(): MarketingSettingRow {
    return { label: '', hint: '', value: '' };
}

function blankFooterGroup(): MarketingFooterGroup {
    return { title: '', links: [blankLink()] };
}

function EditorSection({
    title,
    description,
    children,
}: {
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <Card className="border-border/80 p-5">
            <div className="space-y-1">
                <h3 className="font-semibold">{title}</h3>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <div className="mt-4 space-y-4">{children}</div>
        </Card>
    );
}

function FieldRow({ children }: { children: ReactNode }) {
    return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

function StringListField({
    id,
    label,
    value,
    onChange,
    help,
}: {
    id: string;
    label: string;
    value: string[];
    onChange: (value: string[]) => void;
    help?: string;
}) {
    return (
        <div className="grid gap-1.5">
            <Label htmlFor={id}>{label}</Label>
            <Textarea
                id={id}
                value={stringListToText(value)}
                onChange={(event) =>
                    onChange(textToStringList(event.target.value))
                }
                className="min-h-28"
            />
            {help && <p className="text-xs text-muted-foreground">{help}</p>}
        </div>
    );
}

function NumberListField({
    id,
    label,
    value,
    onChange,
    help,
}: {
    id: string;
    label: string;
    value: number[];
    onChange: (value: number[]) => void;
    help?: string;
}) {
    return (
        <div className="grid gap-1.5">
            <Label htmlFor={id}>{label}</Label>
            <Textarea
                id={id}
                value={numberListToText(value)}
                onChange={(event) =>
                    onChange(textToNumberList(event.target.value))
                }
                className="min-h-24"
            />
            {help && <p className="text-xs text-muted-foreground">{help}</p>}
        </div>
    );
}

function LinkListEditor({
    title,
    items,
    onChange,
    addLabel = __('Add link'),
}: {
    title: string;
    items: MarketingLinkItem[];
    onChange: (items: MarketingLinkItem[]) => void;
    addLabel?: string;
}) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">{title}</p>
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => onChange([...items, blankLink()])}
                >
                    <Plus className="size-3.5" />
                    {addLabel}
                </Button>
            </div>

            {items.map((item, index) => (
                <Card
                    key={`${title}-${index}`}
                    className="border-border/70 p-4"
                >
                    <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
                        <div className="grid gap-1">
                            <Label htmlFor={`${title}-label-${index}`}>
                                {__('Label')}
                            </Label>
                            <Input
                                id={`${title}-label-${index}`}
                                value={item.label}
                                onChange={(event) =>
                                    onChange(
                                        items.map((current, currentIndex) =>
                                            currentIndex === index
                                                ? {
                                                      ...current,
                                                      label: event.target.value,
                                                  }
                                                : current,
                                        ),
                                    )
                                }
                            />
                        </div>
                        <div className="grid gap-1">
                            <Label htmlFor={`${title}-href-${index}`}>
                                {__('Href')}
                            </Label>
                            <Input
                                id={`${title}-href-${index}`}
                                value={item.href}
                                onChange={(event) =>
                                    onChange(
                                        items.map((current, currentIndex) =>
                                            currentIndex === index
                                                ? {
                                                      ...current,
                                                      href: event.target.value,
                                                  }
                                                : current,
                                        ),
                                    )
                                }
                            />
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                onChange(
                                    items.filter(
                                        (_, currentIndex) =>
                                            currentIndex !== index,
                                    ),
                                )
                            }
                            disabled={items.length === 1}
                        >
                            <Trash2 className="size-3.5" />
                            {__('Remove')}
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );
}

function IconCardListEditor({
    title,
    items,
    onChange,
    addLabel,
}: {
    title: string;
    items: MarketingIconCard[];
    onChange: (items: MarketingIconCard[]) => void;
    addLabel: string;
}) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">{title}</p>
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => onChange([...items, blankIconCard()])}
                >
                    <Plus className="size-3.5" />
                    {addLabel}
                </Button>
            </div>

            {items.map((item, index) => (
                <Card
                    key={`${title}-${index}`}
                    className="border-border/70 p-4"
                >
                    <div className="grid gap-3 md:grid-cols-[160px_1fr_auto] md:items-end">
                        <div className="grid gap-1">
                            <Label htmlFor={`${title}-icon-${index}`}>
                                {__('Icon')}
                            </Label>
                            <Input
                                id={`${title}-icon-${index}`}
                                value={item.icon}
                                onChange={(event) =>
                                    onChange(
                                        items.map((current, currentIndex) =>
                                            currentIndex === index
                                                ? {
                                                      ...current,
                                                      icon: event.target.value,
                                                  }
                                                : current,
                                        ),
                                    )
                                }
                            />
                        </div>
                        <div className="grid gap-3">
                            <div className="grid gap-1">
                                <Label htmlFor={`${title}-title-${index}`}>
                                    {__('Title')}
                                </Label>
                                <Input
                                    id={`${title}-title-${index}`}
                                    value={item.title}
                                    onChange={(event) =>
                                        onChange(
                                            items.map(
                                                (current, currentIndex) =>
                                                    currentIndex === index
                                                        ? {
                                                              ...current,
                                                              title: event
                                                                  .target.value,
                                                          }
                                                        : current,
                                            ),
                                        )
                                    }
                                />
                            </div>
                            <div className="grid gap-1">
                                <Label
                                    htmlFor={`${title}-description-${index}`}
                                >
                                    {__('Description')}
                                </Label>
                                <Textarea
                                    id={`${title}-description-${index}`}
                                    value={item.description}
                                    onChange={(event) =>
                                        onChange(
                                            items.map(
                                                (current, currentIndex) =>
                                                    currentIndex === index
                                                        ? {
                                                              ...current,
                                                              description:
                                                                  event.target
                                                                      .value,
                                                          }
                                                        : current,
                                            ),
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                onChange(
                                    items.filter(
                                        (_, currentIndex) =>
                                            currentIndex !== index,
                                    ),
                                )
                            }
                            disabled={items.length === 1}
                        >
                            <Trash2 className="size-3.5" />
                            {__('Remove')}
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );
}

function StatsEditor({
    items,
    onChange,
}: {
    items: MarketingStatItem[];
    onChange: (items: MarketingStatItem[]) => void;
}) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">{__('Stats')}</p>
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => onChange([...items, blankStat()])}
                >
                    <Plus className="size-3.5" />
                    {__('Add stat')}
                </Button>
            </div>

            {items.map((item, index) => (
                <Card key={`stat-${index}`} className="border-border/70 p-4">
                    <div className="grid gap-3 md:grid-cols-[140px_120px_1fr_auto] md:items-end">
                        <div className="grid gap-1">
                            <Label htmlFor={`stat-icon-${index}`}>{__('Icon')}</Label>
                            <Input
                                id={`stat-icon-${index}`}
                                value={item.icon}
                                onChange={(event) =>
                                    onChange(
                                        items.map((current, currentIndex) =>
                                            currentIndex === index
                                                ? {
                                                      ...current,
                                                      icon: event.target.value,
                                                  }
                                                : current,
                                        ),
                                    )
                                }
                            />
                        </div>
                        <div className="grid gap-1">
                            <Label htmlFor={`stat-value-${index}`}>{__('Value')}</Label>
                            <Input
                                id={`stat-value-${index}`}
                                value={item.value}
                                onChange={(event) =>
                                    onChange(
                                        items.map((current, currentIndex) =>
                                            currentIndex === index
                                                ? {
                                                      ...current,
                                                      value: event.target.value,
                                                  }
                                                : current,
                                        ),
                                    )
                                }
                            />
                        </div>
                        <div className="grid gap-1">
                            <Label htmlFor={`stat-label-${index}`}>{__('Label')}</Label>
                            <Input
                                id={`stat-label-${index}`}
                                value={item.label}
                                onChange={(event) =>
                                    onChange(
                                        items.map((current, currentIndex) =>
                                            currentIndex === index
                                                ? {
                                                      ...current,
                                                      label: event.target.value,
                                                  }
                                                : current,
                                        ),
                                    )
                                }
                            />
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                onChange(
                                    items.filter(
                                        (_, currentIndex) =>
                                            currentIndex !== index,
                                    ),
                                )
                            }
                            disabled={items.length === 1}
                        >
                            <Trash2 className="size-3.5" />
                            {__('Remove')}
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );
}

function SettingRowsEditor({
    rows,
    onChange,
}: {
    rows: MarketingSettingRow[];
    onChange: (rows: MarketingSettingRow[]) => void;
}) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">{__('Settings rows')}</p>
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => onChange([...rows, blankSettingRow()])}
                >
                    <Plus className="size-3.5" />
                    {__('Add row')}
                </Button>
            </div>

            {rows.map((row, index) => (
                <Card
                    key={`setting-row-${index}`}
                    className="border-border/70 p-4"
                >
                    <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
                        <div className="grid gap-1">
                            <Label htmlFor={`setting-row-label-${index}`}>
                                {__('Label')}
                            </Label>
                            <Input
                                id={`setting-row-label-${index}`}
                                value={row.label}
                                onChange={(event) =>
                                    onChange(
                                        rows.map((current, currentIndex) =>
                                            currentIndex === index
                                                ? {
                                                      ...current,
                                                      label: event.target.value,
                                                  }
                                                : current,
                                        ),
                                    )
                                }
                            />
                        </div>
                        <div className="grid gap-1">
                            <Label htmlFor={`setting-row-hint-${index}`}>
                                {__('Hint')}
                            </Label>
                            <Input
                                id={`setting-row-hint-${index}`}
                                value={row.hint}
                                onChange={(event) =>
                                    onChange(
                                        rows.map((current, currentIndex) =>
                                            currentIndex === index
                                                ? {
                                                      ...current,
                                                      hint: event.target.value,
                                                  }
                                                : current,
                                        ),
                                    )
                                }
                            />
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                onChange(
                                    rows.filter(
                                        (_, currentIndex) =>
                                            currentIndex !== index,
                                    ),
                                )
                            }
                            disabled={rows.length === 1}
                        >
                            <Trash2 className="size-3.5" />
                            {__('Remove')}
                        </Button>
                    </div>
                    <div className="mt-3 grid gap-1">
                        <Label htmlFor={`setting-row-value-${index}`}>
                            {__('Value')}
                        </Label>
                        <Textarea
                            id={`setting-row-value-${index}`}
                            value={row.value}
                            onChange={(event) =>
                                onChange(
                                    rows.map((current, currentIndex) =>
                                        currentIndex === index
                                            ? {
                                                  ...current,
                                                  value: event.target.value,
                                              }
                                            : current,
                                    ),
                                )
                            }
                        />
                    </div>
                </Card>
            ))}
        </div>
    );
}

function FooterGroupsEditor({
    groups,
    onChange,
}: {
    groups: MarketingFooterGroup[];
    onChange: (groups: MarketingFooterGroup[]) => void;
}) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">{__('Footer groups')}</p>
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => onChange([...groups, blankFooterGroup()])}
                >
                    <Plus className="size-3.5" />
                    {__('Add group')}
                </Button>
            </div>

            {groups.map((group, index) => (
                <Card
                    key={`footer-group-${index}`}
                    className="border-border/70 p-4"
                >
                    <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                        <div className="grid gap-1">
                            <Label htmlFor={`footer-group-title-${index}`}>
                                {__('Group title')}
                            </Label>
                            <Input
                                id={`footer-group-title-${index}`}
                                value={group.title}
                                onChange={(event) =>
                                    onChange(
                                        groups.map((current, currentIndex) =>
                                            currentIndex === index
                                                ? {
                                                      ...current,
                                                      title: event.target.value,
                                                  }
                                                : current,
                                        ),
                                    )
                                }
                            />
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                onChange(
                                    groups.filter(
                                        (_, currentIndex) =>
                                            currentIndex !== index,
                                    ),
                                )
                            }
                            disabled={groups.length === 1}
                        >
                            <Trash2 className="size-3.5" />
                            {__('Remove')}
                        </Button>
                    </div>

                    <div className="mt-4">
                        <LinkListEditor
                            title={__('Links')}
                            items={group.links}
                            onChange={(links) =>
                                onChange(
                                    groups.map((current, currentIndex) =>
                                        currentIndex === index
                                            ? { ...current, links }
                                            : current,
                                    ),
                                )
                            }
                            addLabel={__('Add group link')}
                        />
                    </div>
                </Card>
            ))}
        </div>
    );
}

export default function MarketingContentEditor({ initial }: Props) {
    const form = useForm<{
        marketing_home_content: MarketingContentFormValue;
    }>({
        marketing_home_content: initial,
    });

    const [activeTab, setActiveTab] = useState<MarketingTabKey>('brand');

    const content = form.data.marketing_home_content;
    const activeTabMeta =
        MARKETING_TABS.find((tab) => tab.key === activeTab) ??
        MARKETING_TABS[0];

    const setField = (path: Array<string | number>, value: unknown) => {
        form.setData(
            'marketing_home_content',
            setNestedValue(content, path, value),
        );
    };

    const setList = (path: Array<string | number>, items: unknown[]) => {
        form.setData(
            'marketing_home_content',
            updateNestedList(content, path, () => items),
        );
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        form.patch(updateSystemSettings.url('marketing'), {
            preserveScroll: true,
        });
    };

    const switchTab = (tab: MarketingTabKey) => {
        setActiveTab(tab);
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="space-y-3">
                <div className="overflow-x-auto pb-1">
                    <div className="inline-flex min-w-full gap-2 rounded-2xl border border-border/80 bg-muted/15 p-1.5">
                        {MARKETING_TABS.map((tab) => {
                            const isActive = tab.key === activeTab;

                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => switchTab(tab.key)}
                                    className={cn(
                                        'rounded-xl px-4 py-2 text-sm font-medium whitespace-nowrap transition',
                                        isActive
                                            ? 'bg-background text-foreground shadow-sm ring-1 ring-border/80'
                                            : 'text-muted-foreground hover:bg-background/70 hover:text-foreground',
                                    )}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="rounded-2xl border border-border/80 bg-muted/15 px-4 py-3">
                    <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        {__('Editing tab')}
                    </p>
                    <h3 className="mt-1 text-sm font-semibold">
                        {activeTabMeta.label}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {activeTabMeta.description}
                    </p>
                </div>
            </div>

            {activeTab === 'brand' && (
                <EditorSection
                    title={__('Brand and navigation')}
                    description={__('Manage the header brand name, resources link, and the navigation items shown across the landing page.')}
                >
                    <FieldRow>
                        <div className="grid gap-1.5">
                            <Label htmlFor="marketing-brand-name">
                                {__('Brand name')}
                            </Label>
                            <Input
                                id="marketing-brand-name"
                                value={content.brand_name}
                                onChange={(event) =>
                                    setField(['brand_name'], event.target.value)
                                }
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="marketing-header-resource-label">
                                {__('Header resources label')}
                            </Label>
                            <Input
                                id="marketing-header-resource-label"
                                value={content.header.resources_label}
                                onChange={(event) =>
                                    setField(
                                        ['header', 'resources_label'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                    </FieldRow>

                    <FieldRow>
                        <div className="grid gap-1.5 md:col-span-2">
                            <Label htmlFor="marketing-header-resource-href">
                                {__('Header resources href')}
                            </Label>
                            <Input
                                id="marketing-header-resource-href"
                                value={content.header.resources_href}
                                onChange={(event) =>
                                    setField(
                                        ['header', 'resources_href'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                    </FieldRow>

                    <div className="rounded-md border border-border/70 bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
                        {__('The top-right header CTA is now handled automatically and follows the current auth state, so it is no longer edited here.')}
                    </div>

                    <LinkListEditor
                        title={__('Header navigation')}
                        items={content.nav_items}
                        onChange={(items) => setList(['nav_items'], items)}
                        addLabel={__('Add nav item')}
                    />
                </EditorSection>
            )}

            {activeTab === 'hero' && (
                <EditorSection
                    title={__('Hero')}
                    description={__('Update the hero copy, badge, and the embedded site test prompt.')}
                >
                    <FieldRow>
                        <div className="grid gap-1.5 md:col-span-2">
                            <Label htmlFor="marketing-hero-badge">{__('Badge')}</Label>
                            <Input
                                id="marketing-hero-badge"
                                value={content.hero.badge}
                                onChange={(event) =>
                                    setField(
                                        ['hero', 'badge'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                    </FieldRow>
                    <FieldRow>
                        <div className="grid gap-1.5">
                            <Label htmlFor="marketing-hero-line-one">
                                {__('Line one')}
                            </Label>
                            <Input
                                id="marketing-hero-line-one"
                                value={content.hero.line_one}
                                onChange={(event) =>
                                    setField(
                                        ['hero', 'line_one'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="marketing-hero-accent">
                                {__('Accent word')}
                            </Label>
                            <Input
                                id="marketing-hero-accent"
                                value={content.hero.accent}
                                onChange={(event) =>
                                    setField(
                                        ['hero', 'accent'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                    </FieldRow>
                    <FieldRow>
                        <div className="grid gap-1.5">
                            <Label htmlFor="marketing-hero-line-two">
                                {__('Line two suffix')}
                            </Label>
                            <Input
                                id="marketing-hero-line-two"
                                value={content.hero.line_two_suffix}
                                onChange={(event) =>
                                    setField(
                                        ['hero', 'line_two_suffix'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="marketing-hero-line-three-prefix">
                                {__('Line three prefix')}
                            </Label>
                            <Input
                                id="marketing-hero-line-three-prefix"
                                value={content.hero.line_three_prefix}
                                onChange={(event) =>
                                    setField(
                                        ['hero', 'line_three_prefix'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                    </FieldRow>
                    <FieldRow>
                        <div className="grid gap-1.5">
                            <Label htmlFor="marketing-hero-line-three-highlight">
                                {__('Line three highlight')}
                            </Label>
                            <Input
                                id="marketing-hero-line-three-highlight"
                                value={content.hero.line_three_highlight}
                                onChange={(event) =>
                                    setField(
                                        ['hero', 'line_three_highlight'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="marketing-hero-line-four-highlight">
                                {__('Line four highlight')}
                            </Label>
                            <Input
                                id="marketing-hero-line-four-highlight"
                                value={content.hero.line_four_highlight}
                                onChange={(event) =>
                                    setField(
                                        ['hero', 'line_four_highlight'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                    </FieldRow>
                    <div className="grid gap-1.5">
                        <Label htmlFor="marketing-hero-description">
                            {__('Description')}
                        </Label>
                        <Textarea
                            id="marketing-hero-description"
                            value={content.hero.description}
                            onChange={(event) =>
                                setField(
                                    ['hero', 'description'],
                                    event.target.value,
                                )
                            }
                        />
                    </div>
                    <FieldRow>
                        <div className="grid gap-1.5">
                            <Label htmlFor="marketing-site-test-label">
                                {__('Site test label')}
                            </Label>
                            <Input
                                id="marketing-site-test-label"
                                value={content.hero.site_test_label}
                                onChange={(event) =>
                                    setField(
                                        ['hero', 'site_test_label'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="marketing-site-test-button">
                                {__('Site test button')}
                            </Label>
                            <Input
                                id="marketing-site-test-button"
                                value={content.hero.site_test_button_label}
                                onChange={(event) =>
                                    setField(
                                        ['hero', 'site_test_button_label'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                    </FieldRow>
                    <FieldRow>
                        <div className="grid gap-1.5">
                            <Label htmlFor="marketing-site-test-placeholder">
                                {__('Site test placeholder')}
                            </Label>
                            <Input
                                id="marketing-site-test-placeholder"
                                value={content.hero.site_test_placeholder}
                                onChange={(event) =>
                                    setField(
                                        ['hero', 'site_test_placeholder'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="marketing-site-test-helper">
                                {__('Site test helper')}
                            </Label>
                            <Input
                                id="marketing-site-test-helper"
                                value={content.hero.site_test_helper}
                                onChange={(event) =>
                                    setField(
                                        ['hero', 'site_test_helper'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                    </FieldRow>
                    <div className="grid gap-1.5">
                        <Label htmlFor="marketing-live-demo-notice">
                            {__('Live demo notice')}
                        </Label>
                        <Input
                            id="marketing-live-demo-notice"
                            value={content.hero.live_demo_notice}
                            onChange={(event) =>
                                setField(
                                    ['hero', 'live_demo_notice'],
                                    event.target.value,
                                )
                            }
                        />
                    </div>
                </EditorSection>
            )}

            {activeTab === 'preview' && (
                <>
                    <EditorSection
                        title={__('Chat preview and stats')}
                        description={__('Manage the interactive preview card and the headline stat row below the hero.')}
                    >
                        <FieldRow>
                            <div className="grid gap-1.5">
                                <Label htmlFor="chat-title">
                                    {__('Preview title')}
                                </Label>
                                <Input
                                    id="chat-title"
                                    value={content.chat_preview.title}
                                    onChange={(event) =>
                                        setField(
                                            ['chat_preview', 'title'],
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="chat-badge">
                                    {__('Preview badge')}
                                </Label>
                                <Input
                                    id="chat-badge"
                                    value={content.chat_preview.badge}
                                    onChange={(event) =>
                                        setField(
                                            ['chat_preview', 'badge'],
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                        </FieldRow>
                        <div className="grid gap-1.5">
                            <Label htmlFor="chat-question">
                                {__('Question bubble')}
                            </Label>
                            <Textarea
                                id="chat-question"
                                value={content.chat_preview.question}
                                onChange={(event) =>
                                    setField(
                                        ['chat_preview', 'question'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="chat-answer">{__('Answer bubble')}</Label>
                            <Textarea
                                id="chat-answer"
                                value={content.chat_preview.answer}
                                onChange={(event) =>
                                    setField(
                                        ['chat_preview', 'answer'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                        <FieldRow>
                            <div className="grid gap-1.5">
                                <Label htmlFor="chat-plan-badge">
                                    {__('Plan badge')}
                                </Label>
                                <Input
                                    id="chat-plan-badge"
                                    value={content.chat_preview.plan_badge}
                                    onChange={(event) =>
                                        setField(
                                            ['chat_preview', 'plan_badge'],
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="chat-plan-name">
                                    {__('Plan name')}
                                </Label>
                                <Input
                                    id="chat-plan-name"
                                    value={content.chat_preview.plan_name}
                                    onChange={(event) =>
                                        setField(
                                            ['chat_preview', 'plan_name'],
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                        </FieldRow>
                        <FieldRow>
                            <div className="grid gap-1.5">
                                <Label htmlFor="chat-plan-price">
                                    {__('Plan price')}
                                </Label>
                                <Input
                                    id="chat-plan-price"
                                    value={content.chat_preview.plan_price}
                                    onChange={(event) =>
                                        setField(
                                            ['chat_preview', 'plan_price'],
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="chat-plan-interval">
                                    {__('Plan interval')}
                                </Label>
                                <Input
                                    id="chat-plan-interval"
                                    value={content.chat_preview.plan_interval}
                                    onChange={(event) =>
                                        setField(
                                            ['chat_preview', 'plan_interval'],
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                        </FieldRow>
                        <div className="grid gap-1.5">
                            <Label htmlFor="chat-plan-note">{__('Plan note')}</Label>
                            <Textarea
                                id="chat-plan-note"
                                value={content.chat_preview.plan_note}
                                onChange={(event) =>
                                    setField(
                                        ['chat_preview', 'plan_note'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                        <StringListField
                            id="chat-plan-features"
                            label={__('Plan features')}
                            value={content.chat_preview.plan_features}
                            onChange={(value) =>
                                setField(
                                    ['chat_preview', 'plan_features'],
                                    value,
                                )
                            }
                        />
                        <FieldRow>
                            <div className="grid gap-1.5">
                                <Label htmlFor="chat-plan-button">
                                    {__('Plan button')}
                                </Label>
                                <Input
                                    id="chat-plan-button"
                                    value={
                                        content.chat_preview.plan_button_label
                                    }
                                    onChange={(event) =>
                                        setField(
                                            [
                                                'chat_preview',
                                                'plan_button_label',
                                            ],
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="chat-typing-label">
                                    {__('Typing label')}
                                </Label>
                                <Input
                                    id="chat-typing-label"
                                    value={content.chat_preview.typing_label}
                                    onChange={(event) =>
                                        setField(
                                            ['chat_preview', 'typing_label'],
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                        </FieldRow>
                        <div className="grid gap-1.5">
                            <Label htmlFor="chat-powered-by-prefix">
                                {__('Powered by prefix')}
                            </Label>
                            <Input
                                id="chat-powered-by-prefix"
                                value={content.chat_preview.powered_by_prefix}
                                onChange={(event) =>
                                    setField(
                                        ['chat_preview', 'powered_by_prefix'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>

                        <StatsEditor
                            items={content.stats}
                            onChange={(items) => setList(['stats'], items)}
                        />
                    </EditorSection>

                    <EditorSection
                        title={__('Video walkthrough')}
                        description={__('Edit the video teaser copy and the labels around its preview card.')}
                    >
                        <FieldRow>
                            <div className="grid gap-1.5">
                                <Label htmlFor="video-badge">{__('Badge')}</Label>
                                <Input
                                    id="video-badge"
                                    value={content.video.badge}
                                    onChange={(event) =>
                                        setField(
                                            ['video', 'badge'],
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="video-href">{__('Video href')}</Label>
                                <Input
                                    id="video-href"
                                    value={content.video.href}
                                    onChange={(event) =>
                                        setField(
                                            ['video', 'href'],
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                        </FieldRow>
                        <div className="grid gap-1.5">
                            <Label htmlFor="video-title">{__('Title')}</Label>
                            <Input
                                id="video-title"
                                value={content.video.title}
                                onChange={(event) =>
                                    setField(
                                        ['video', 'title'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="video-description">
                                {__('Description')}
                            </Label>
                            <Textarea
                                id="video-description"
                                value={content.video.description}
                                onChange={(event) =>
                                    setField(
                                        ['video', 'description'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                        <StringListField
                            id="video-bullets"
                            label={__('Bullets')}
                            value={content.video.bullets}
                            onChange={(value) =>
                                setField(['video', 'bullets'], value)
                            }
                        />
                        <FieldRow>
                            <div className="grid gap-1.5">
                                <Label htmlFor="video-duration-label">
                                    {__('Duration label')}
                                </Label>
                                <Input
                                    id="video-duration-label"
                                    value={content.video.duration_label}
                                    onChange={(event) =>
                                        setField(
                                            ['video', 'duration_label'],
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="video-tag-label">
                                    {__('Tag label')}
                                </Label>
                                <Input
                                    id="video-tag-label"
                                    value={content.video.tag_label}
                                    onChange={(event) =>
                                        setField(
                                            ['video', 'tag_label'],
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                        </FieldRow>
                        <FieldRow>
                            <div className="grid gap-1.5">
                                <Label htmlFor="video-scene-label">
                                    {__('Scene label')}
                                </Label>
                                <Input
                                    id="video-scene-label"
                                    value={content.video.scene_label}
                                    onChange={(event) =>
                                        setField(
                                            ['video', 'scene_label'],
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="video-timecode">{__('Timecode')}</Label>
                                <Input
                                    id="video-timecode"
                                    value={content.video.timecode}
                                    onChange={(event) =>
                                        setField(
                                            ['video', 'timecode'],
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                        </FieldRow>
                        <div className="grid gap-1.5">
                            <Label htmlFor="video-card-title">{__('Card title')}</Label>
                            <Input
                                id="video-card-title"
                                value={content.video.card_title}
                                onChange={(event) =>
                                    setField(
                                        ['video', 'card_title'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                        <StringListField
                            id="video-chips"
                            label={__('Chips')}
                            value={content.video.chips}
                            onChange={(value) =>
                                setField(['video', 'chips'], value)
                            }
                        />
                        <div className="grid gap-1.5">
                            <Label htmlFor="video-footer-title">
                                {__('Footer title')}
                            </Label>
                            <Input
                                id="video-footer-title"
                                value={content.video.footer_title}
                                onChange={(event) =>
                                    setField(
                                        ['video', 'footer_title'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="video-footer-description">
                                {__('Footer description')}
                            </Label>
                            <Textarea
                                id="video-footer-description"
                                value={content.video.footer_description}
                                onChange={(event) =>
                                    setField(
                                        ['video', 'footer_description'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="video-button-label">
                                {__('Button label')}
                            </Label>
                            <Input
                                id="video-button-label"
                                value={content.video.button_label}
                                onChange={(event) =>
                                    setField(
                                        ['video', 'button_label'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                    </EditorSection>
                </>
            )}

            {activeTab === 'features' && (
                <EditorSection
                    title={__('Feature sections')}
                    description={__('Manage the where-it-fits cards, feature grid, control area, and setup steps.')}
                >
                    <FieldRow>
                        <div className="grid gap-1.5">
                            <Label htmlFor="fits-badge">
                                {__('Where it fits badge')}
                            </Label>
                            <Input
                                id="fits-badge"
                                value={content.where_it_fits.badge}
                                onChange={(event) =>
                                    setField(
                                        ['where_it_fits', 'badge'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="feature-grid-badge">
                                {__('Feature grid badge')}
                            </Label>
                            <Input
                                id="feature-grid-badge"
                                value={content.feature_grid.badge}
                                onChange={(event) =>
                                    setField(
                                        ['feature_grid', 'badge'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                    </FieldRow>
                    <div className="grid gap-1.5">
                        <Label htmlFor="fits-title">{__('Where it fits title')}</Label>
                        <Textarea
                            id="fits-title"
                            value={content.where_it_fits.title}
                            onChange={(event) =>
                                setField(
                                    ['where_it_fits', 'title'],
                                    event.target.value,
                                )
                            }
                        />
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="feature-grid-title">
                            {__('Feature grid title')}
                        </Label>
                        <Textarea
                            id="feature-grid-title"
                            value={content.feature_grid.title}
                            onChange={(event) =>
                                setField(
                                    ['feature_grid', 'title'],
                                    event.target.value,
                                )
                            }
                        />
                    </div>

                    <IconCardListEditor
                        title={__('Where it fits cards')}
                        items={content.where_it_fits.cards}
                        onChange={(items) =>
                            setList(['where_it_fits', 'cards'], items)
                        }
                        addLabel={__('Add fit card')}
                    />

                    <IconCardListEditor
                        title={__('Feature grid cards')}
                        items={content.feature_grid.cards}
                        onChange={(items) =>
                            setList(['feature_grid', 'cards'], items)
                        }
                        addLabel={__('Add feature card')}
                    />

                    <FieldRow>
                        <div className="grid gap-1.5">
                            <Label htmlFor="control-badge">{__('Control badge')}</Label>
                            <Input
                                id="control-badge"
                                value={content.control.badge}
                                onChange={(event) =>
                                    setField(
                                        ['control', 'badge'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="steps-badge">{__('Steps badge')}</Label>
                            <Input
                                id="steps-badge"
                                value={content.steps.badge}
                                onChange={(event) =>
                                    setField(
                                        ['steps', 'badge'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                    </FieldRow>

                    <div className="grid gap-1.5">
                        <Label htmlFor="control-title">{__('Control title')}</Label>
                        <Textarea
                            id="control-title"
                            value={content.control.title}
                            onChange={(event) =>
                                setField(
                                    ['control', 'title'],
                                    event.target.value,
                                )
                            }
                        />
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="control-description">
                            {__('Control description')}
                        </Label>
                        <Textarea
                            id="control-description"
                            value={content.control.description}
                            onChange={(event) =>
                                setField(
                                    ['control', 'description'],
                                    event.target.value,
                                )
                            }
                        />
                    </div>

                    <IconCardListEditor
                        title={__('Control callouts')}
                        items={content.control.callouts}
                        onChange={(items) =>
                            setList(['control', 'callouts'], items)
                        }
                        addLabel={__('Add callout')}
                    />

                    <FieldRow>
                        <div className="grid gap-1.5">
                            <Label htmlFor="control-settings-card-title">
                                {__('Settings card title')}
                            </Label>
                            <Input
                                id="control-settings-card-title"
                                value={content.control.settings_card_title}
                                onChange={(event) =>
                                    setField(
                                        ['control', 'settings_card_title'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="steps-title">{__('Steps title')}</Label>
                            <Textarea
                                id="steps-title"
                                value={content.steps.title}
                                onChange={(event) =>
                                    setField(
                                        ['steps', 'title'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                    </FieldRow>

                    <SettingRowsEditor
                        rows={content.control.settings_rows}
                        onChange={(rows) =>
                            setList(['control', 'settings_rows'], rows)
                        }
                    />

                    <FieldRow>
                        <div className="grid gap-1.5">
                            <Label htmlFor="control-cancel-label">
                                {__('Cancel label')}
                            </Label>
                            <Input
                                id="control-cancel-label"
                                value={content.control.cancel_label}
                                onChange={(event) =>
                                    setField(
                                        ['control', 'cancel_label'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="control-save-label">
                                {__('Save button label')}
                            </Label>
                            <Input
                                id="control-save-label"
                                value={content.control.save_button_label}
                                onChange={(event) =>
                                    setField(
                                        ['control', 'save_button_label'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                    </FieldRow>

                    <IconCardListEditor
                        title={__('Setup steps')}
                        items={content.steps.items}
                        onChange={(items) => setList(['steps', 'items'], items)}
                        addLabel={__('Add step')}
                    />
                </EditorSection>
            )}

            {activeTab === 'closing' && (
                <EditorSection
                    title={__('Insights and final CTA')}
                    description={__('Manage the analytics section and the closing call to action.')}
                >
                    <FieldRow>
                        <div className="grid gap-1.5">
                            <Label htmlFor="insights-badge">
                                {__('Insights badge')}
                            </Label>
                            <Input
                                id="insights-badge"
                                value={content.insights.badge}
                                onChange={(event) =>
                                    setField(
                                        ['insights', 'badge'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="insights-metric-label">
                                {__('Metric label')}
                            </Label>
                            <Input
                                id="insights-metric-label"
                                value={content.insights.metric_label}
                                onChange={(event) =>
                                    setField(
                                        ['insights', 'metric_label'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                    </FieldRow>
                    <div className="grid gap-1.5">
                        <Label htmlFor="insights-chart-title">
                            {__('Chart title')}
                        </Label>
                        <Textarea
                            id="insights-chart-title"
                            value={content.insights.chart_title}
                            onChange={(event) =>
                                setField(
                                    ['insights', 'chart_title'],
                                    event.target.value,
                                )
                            }
                        />
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="insights-chart-description">
                            {__('Chart description')}
                        </Label>
                        <Textarea
                            id="insights-chart-description"
                            value={content.insights.chart_description}
                            onChange={(event) =>
                                setField(
                                    ['insights', 'chart_description'],
                                    event.target.value,
                                )
                            }
                        />
                    </div>
                    <FieldRow>
                        <div className="grid gap-1.5">
                            <Label htmlFor="insights-metric-value">
                                {__('Metric value')}
                            </Label>
                            <Input
                                id="insights-metric-value"
                                value={content.insights.metric_value}
                                onChange={(event) =>
                                    setField(
                                        ['insights', 'metric_value'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="insights-metric-trend">
                                {__('Metric trend')}
                            </Label>
                            <Input
                                id="insights-metric-trend"
                                value={content.insights.metric_trend}
                                onChange={(event) =>
                                    setField(
                                        ['insights', 'metric_trend'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                    </FieldRow>
                    <FieldRow>
                        <NumberListField
                            id="insights-chart-points"
                            label={__('Chart points')}
                            value={content.insights.chart_points}
                            onChange={(value) =>
                                setField(['insights', 'chart_points'], value)
                            }
                            help={__('Enter numbers separated by commas or new lines.')}
                        />
                        <StringListField
                            id="insights-chart-labels"
                            label={__('Chart labels')}
                            value={content.insights.chart_labels}
                            onChange={(value) =>
                                setField(['insights', 'chart_labels'], value)
                            }
                        />
                    </FieldRow>
                    <IconCardListEditor
                        title={__('Insight cards')}
                        items={content.insights.cards}
                        onChange={(items) =>
                            setList(['insights', 'cards'], items)
                        }
                        addLabel={__('Add insight card')}
                    />

                    <div className="grid gap-1.5">
                        <Label htmlFor="final-cta-title">{__('Final CTA title')}</Label>
                        <Textarea
                            id="final-cta-title"
                            value={content.final_cta.title}
                            onChange={(event) =>
                                setField(
                                    ['final_cta', 'title'],
                                    event.target.value,
                                )
                            }
                        />
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="final-cta-description">
                            {__('Final CTA description')}
                        </Label>
                        <Textarea
                            id="final-cta-description"
                            value={content.final_cta.description}
                            onChange={(event) =>
                                setField(
                                    ['final_cta', 'description'],
                                    event.target.value,
                                )
                            }
                        />
                    </div>
                    <FieldRow>
                        <div className="grid gap-1.5">
                            <Label htmlFor="final-cta-primary-label">
                                {__('Primary button label')}
                            </Label>
                            <Input
                                id="final-cta-primary-label"
                                value={content.final_cta.primary_button_label}
                                onChange={(event) =>
                                    setField(
                                        ['final_cta', 'primary_button_label'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="final-cta-primary-href">
                                {__('Primary button href')}
                            </Label>
                            <Input
                                id="final-cta-primary-href"
                                value={content.final_cta.primary_button_href}
                                onChange={(event) =>
                                    setField(
                                        ['final_cta', 'primary_button_href'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                    </FieldRow>
                    <FieldRow>
                        <div className="grid gap-1.5">
                            <Label htmlFor="final-cta-secondary-label">
                                {__('Secondary button label')}
                            </Label>
                            <Input
                                id="final-cta-secondary-label"
                                value={content.final_cta.secondary_button_label}
                                onChange={(event) =>
                                    setField(
                                        ['final_cta', 'secondary_button_label'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="final-cta-secondary-href">
                                {__('Secondary button href')}
                            </Label>
                            <Input
                                id="final-cta-secondary-href"
                                value={content.final_cta.secondary_button_href}
                                onChange={(event) =>
                                    setField(
                                        ['final_cta', 'secondary_button_href'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                    </FieldRow>
                </EditorSection>
            )}

            {activeTab === 'footer' && (
                <EditorSection
                    title={__('Footer')}
                    description={__('Edit the footer description, social links, grouped links, legal links, and copyright line.')}
                >
                    <div className="grid gap-1.5">
                        <Label htmlFor="footer-brand-description">
                            {__('Brand description')}
                        </Label>
                        <Textarea
                            id="footer-brand-description"
                            value={content.footer.brand_description}
                            onChange={(event) =>
                                setField(
                                    ['footer', 'brand_description'],
                                    event.target.value,
                                )
                            }
                        />
                    </div>

                    <LinkListEditor
                        title={__('Social links')}
                        items={content.footer.socials}
                        onChange={(items) =>
                            setList(['footer', 'socials'], items)
                        }
                        addLabel={__('Add social')}
                    />

                    <FooterGroupsEditor
                        groups={content.footer.groups}
                        onChange={(groups) =>
                            setList(['footer', 'groups'], groups)
                        }
                    />

                    <FieldRow>
                        <div className="grid gap-1.5 md:col-span-2">
                            <Label htmlFor="footer-legal-title">
                                {__('Legal title')}
                            </Label>
                            <Input
                                id="footer-legal-title"
                                value={content.footer.legal_title}
                                onChange={(event) =>
                                    setField(
                                        ['footer', 'legal_title'],
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                    </FieldRow>

                    <LinkListEditor
                        title={__('Legal links')}
                        items={content.footer.legal_links}
                        onChange={(items) =>
                            setList(['footer', 'legal_links'], items)
                        }
                        addLabel={__('Add legal link')}
                    />

                    <div className="grid gap-1.5">
                        <Label htmlFor="footer-copyright">{__('Copyright')}</Label>
                        <Input
                            id="footer-copyright"
                            value={content.footer.copyright}
                            onChange={(event) =>
                                setField(
                                    ['footer', 'copyright'],
                                    event.target.value,
                                )
                            }
                        />
                    </div>
                </EditorSection>
            )}

            {form.errors.marketing_home_content && (
                <p className="text-sm text-destructive">
                    {form.errors.marketing_home_content}
                </p>
            )}

            <div className="flex justify-end">
                <Button type="submit" disabled={form.processing}>
                    {__('Save marketing content')}
                </Button>
            </div>
        </form>
    );
}
