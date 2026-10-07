import { Handle, Position } from '@xyflow/react';
import {
    GitBranch,
    MessageSquare,
    PhoneOutgoing,
    Tag,
    UserCheck,
    Webhook,
    Zap,
} from 'lucide-react';
import type { ReactNode } from 'react';
import type { BranchCase } from './types';

const cardBase =
    'rounded-lg border bg-card shadow-sm overflow-hidden text-card-foreground min-w-[200px] max-w-[260px]';

const headerBase =
    'flex items-center gap-2 px-3 py-1.5 border-b text-[11px] font-semibold uppercase tracking-wide';

function NodeShell({
    icon,
    label,
    headerClass,
    children,
    showInputHandle = true,
    showOutputHandle = true,
}: {
    icon: ReactNode;
    label: string;
    headerClass: string;
    children: ReactNode;
    showInputHandle?: boolean;
    showOutputHandle?: boolean;
}) {
    return (
        <div className={cardBase}>
            {showInputHandle && (
                <Handle
                    type="target"
                    position={Position.Top}
                    className="!size-2 !bg-foreground/40"
                />
            )}
            <div className={headerBase + ' ' + headerClass}>
                {icon}
                <span>{label}</span>
            </div>
            <div className="px-3 py-2 text-xs leading-snug text-foreground/80">
                {children}
            </div>
            {showOutputHandle && (
                <Handle
                    id="out"
                    type="source"
                    position={Position.Bottom}
                    className="!size-2 !bg-foreground/40"
                />
            )}
        </div>
    );
}

export function TriggerNode({ data }: { data: any }) {
    const keywords = (data?.keywords ?? []) as string[];
    const matchMode = (data?.match_mode ?? 'any') as string;

    return (
        <NodeShell
            icon={<Zap className="size-3" />}
            label={__('Trigger · keyword')}
            headerClass="bg-violet-100 text-violet-900 border-violet-300 dark:bg-violet-900/40 dark:text-violet-200 dark:border-violet-700"
            showInputHandle={false}
        >
            <p className="font-mono text-[10px]">
                {keywords.length === 0
                    ? __('No keywords yet')
                    : keywords.join(', ')}
            </p>
            <span className="mt-1 inline-block rounded bg-muted px-1.5 py-0.5 font-mono text-[9px] uppercase">
                {__('match')}: {__(matchMode)}
            </span>
        </NodeShell>
    );
}

export function MessageNode({ data }: { data: any }) {
    return (
        <NodeShell
            icon={<MessageSquare className="size-3" />}
            label={__('Message')}
            headerClass="bg-slate-100 text-slate-900 border-slate-300 dark:bg-slate-900/60 dark:text-slate-100 dark:border-slate-700"
        >
            <p className="line-clamp-3 whitespace-pre-wrap">
                {data?.text || (
                    <span className="text-muted-foreground italic">{__('empty')}</span>
                )}
            </p>
        </NodeShell>
    );
}

export function QuestionNode({ data }: { data: any }) {
    return (
        <NodeShell
            icon={<MessageSquare className="size-3" />}
            label={__('Question')}
            headerClass="bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-900/40 dark:text-sky-200 dark:border-sky-700"
        >
            <p className="line-clamp-3 whitespace-pre-wrap">
                {data?.text || (
                    <span className="text-muted-foreground italic">{__('empty')}</span>
                )}
            </p>
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                → @{`{{${data?.var_name ?? 'visitor_answer'}}}`}
            </p>
        </NodeShell>
    );
}

export function BranchNode({ data }: { data: any }) {
    const cases = (data?.cases ?? []) as BranchCase[];

    return (
        <div className={cardBase}>
            <Handle
                type="target"
                position={Position.Top}
                className="!size-2 !bg-foreground/40"
            />
            <div
                className={
                    headerBase +
                    ' border-amber-300 bg-amber-100 text-amber-900 dark:border-amber-700 dark:bg-amber-900/40 dark:text-amber-200'
                }
            >
                <GitBranch className="size-3" />
                <span>{__('Branch on @:var', { var: `{{${data?.var ?? 'var'}}}` })}</span>
            </div>
            <div className="flex flex-col gap-1 px-3 py-2 text-xs leading-snug text-foreground/80">
                {cases.length === 0 && (
                    <span className="text-muted-foreground italic">
                        {__('No cases yet')}
                    </span>
                )}
                {cases.map((c, i) => (
                    <div
                        key={i}
                        className="relative flex items-center justify-between gap-2 rounded bg-muted/60 px-2 py-1"
                    >
                        <span className="font-mono text-[10px]">
                            {c.match === 'default'
                                ? __('default')
                                : c.value
                                  ? `${__(c.match)} "${c.value}"`
                                  : __(c.match)}
                        </span>
                        <Handle
                            id={c.match === 'default' ? 'default' : `case-${i}`}
                            type="source"
                            position={Position.Right}
                            className="!size-2 !bg-amber-500"
                            style={{ top: '50%', right: -4 }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function TagLeadNode({ data }: { data: any }) {
    const tags = (data?.tags ?? []) as string[];

    return (
        <NodeShell
            icon={<Tag className="size-3" />}
            label={__('Tag lead')}
            headerClass="bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-700"
        >
            {tags.length === 0 ? (
                <span className="text-muted-foreground italic">
                    {__('No tags yet')}
                </span>
            ) : (
                <div className="flex flex-wrap gap-1">
                    {tags.map((t) => (
                        <span
                            key={t}
                            className="rounded bg-emerald-50 px-1.5 py-0.5 font-mono text-[10px] text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                        >
                            {t}
                        </span>
                    ))}
                </div>
            )}
        </NodeShell>
    );
}

export function WebhookNode({ data }: { data: any }) {
    return (
        <NodeShell
            icon={<Webhook className="size-3" />}
            label={`${__('Webhook')} ${(data?.method ?? 'POST').toUpperCase()}`}
            headerClass="bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-900/40 dark:text-orange-200 dark:border-orange-700"
        >
            <p className="truncate font-mono text-[10px]">
                {data?.url || (
                    <span className="text-muted-foreground italic">{__('no url')}</span>
                )}
            </p>
        </NodeShell>
    );
}

export function EscalateNode({ data }: { data: any }) {
    return (
        <NodeShell
            icon={<UserCheck className="size-3" />}
            label={__('Escalate to human')}
            headerClass="bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-900/40 dark:text-rose-200 dark:border-rose-700"
            showOutputHandle={false}
        >
            <p className="line-clamp-2 whitespace-pre-wrap">
                {data?.text || (
                    <span className="text-muted-foreground italic">
                        {__('Connecting you to a human…')}
                    </span>
                )}
            </p>
        </NodeShell>
    );
}

export const NODE_TYPES = {
    trigger: TriggerNode,
    message: MessageNode,
    question: QuestionNode,
    branch: BranchNode,
    tag_lead: TagLeadNode,
    webhook: WebhookNode,
    escalate: EscalateNode,
};

export const NODE_TYPE_ICONS: Record<string, ReactNode> = {
    message: <MessageSquare className="size-3.5" />,
    question: <MessageSquare className="size-3.5" />,
    branch: <GitBranch className="size-3.5" />,
    tag_lead: <Tag className="size-3.5" />,
    webhook: <Webhook className="size-3.5" />,
    escalate: <PhoneOutgoing className="size-3.5" />,
};
