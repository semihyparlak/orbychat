import { Head, Link, router } from '@inertiajs/react';
import {
    addEdge,
    Background,
    Controls,
    MiniMap,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
} from '@xyflow/react';
import type { Connection, Edge, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Plus, Save } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { NodeInspector } from './canvas-internals/inspector';
import { NODE_TYPE_ICONS, NODE_TYPES } from './canvas-internals/nodes';
import { canvasToSteps, stepsToCanvas } from './canvas-internals/translator';
import type {
    AgentOption,
    CanvasEdge,
    CanvasNode,
    StepType,
    WorkflowProp,
} from './canvas-internals/types';

type Props = {
    workflow: WorkflowProp;
    agents: AgentOption[];
};

export default function WorkflowCanvas({ workflow }: Props) {
    return (
        <ReactFlowProvider>
            <CanvasInner workflow={workflow} />
        </ReactFlowProvider>
    );
}

function CanvasInner({ workflow }: { workflow: WorkflowProp }) {
    const palette: Array<{ type: StepType; label: string }> = [
        { type: 'message', label: __('Message') },
        { type: 'question', label: __('Question') },
        { type: 'branch', label: __('Branch') },
        { type: 'tag_lead', label: __('Tag lead') },
        { type: 'webhook', label: __('Webhook') },
        { type: 'escalate', label: __('Escalate') },
    ];

    const breadcrumbs: BreadcrumbItem[] = [
        { title: __('Workflows'), href: '/app/workflows' },
        { title: workflow.name, href: `/app/workflows/${workflow.id}/edit` },
        { title: __('Canvas'), href: `/app/workflows/${workflow.id}/canvas` },
    ];

    // Initial state  —  prefer the persisted canvas if present; otherwise
    // re-derive from the linear `steps[]` array so a flow created in
    // the form view opens cleanly here.
    const initial = useMemo(() => {
        const persisted = workflow.definition?.canvas;

        if (persisted && persisted.nodes && persisted.nodes.length > 0) {
            return persisted;
        }

        return stepsToCanvas(workflow.steps);
    }, [workflow]);

    // The trigger is rendered as a synthetic top node carrying the
    // trigger config; React Flow needs all nodes including it.
    const triggerNode: CanvasNode = {
        id: 'trigger',
        type: 'trigger' as StepType,
        position: { x: 50, y: 0 },
        data: {
            keywords: workflow.keywords,
            match_mode: workflow.match_mode,
        },
    };

    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([
        triggerNode,
        ...initial.nodes.filter((n) => n.id !== 'trigger'),
    ] as Node[]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(
        initial.edges as Edge[],
    );

    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [keywords, setKeywords] = useState<string[]>(workflow.keywords);
    const [matchMode, setMatchMode] = useState<'any' | 'all' | 'exact'>(
        workflow.match_mode,
    );
    const [name, setName] = useState(workflow.name);
    const [status, setStatus] = useState(workflow.status);
    const [saving, setSaving] = useState(false);

    const selectedNode =
        selectedNodeId !== null
            ? (nodes.find((n) => n.id === selectedNodeId) as
                  | CanvasNode
                  | undefined)
            : null;

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const handleAddNode = (type: StepType) => {
        const id = `step-${Date.now()}`;
        const last = nodes[nodes.length - 1];
        const x = (last?.position.x ?? 50) + 40;
        const y = (last?.position.y ?? 100) + 160;
        setNodes((nds) => [
            ...nds,
            {
                id,
                type,
                position: { x, y },
                data: defaultDataFor(type),
            } as Node,
        ]);
    };

    const handleNodeChange = (data: Record<string, unknown>) => {
        if (!selectedNodeId) {
            return;
        }

        setNodes((nds) =>
            nds.map((n) =>
                n.id === selectedNodeId ? { ...n, data: { ...data } } : n,
            ),
        );
    };

    const handleNodeDelete = () => {
        if (!selectedNodeId || selectedNodeId === 'trigger') {
            return;
        }

        setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
        setEdges((eds) =>
            eds.filter(
                (e) =>
                    e.source !== selectedNodeId && e.target !== selectedNodeId,
            ),
        );
        setSelectedNodeId(null);
    };

    const handleTriggerChange = (
        patch: Partial<{
            keywords: string[];
            match_mode: 'any' | 'all' | 'exact';
        }>,
    ) => {
        if (patch.keywords !== undefined) {
            setKeywords(patch.keywords);
        }

        if (patch.match_mode !== undefined) {
            setMatchMode(patch.match_mode);
        }

        // Mirror onto the trigger node's data so the visual updates live.
        setNodes((nds) =>
            nds.map((n) =>
                n.id === 'trigger'
                    ? {
                          ...n,
                          data: {
                              ...n.data,
                              keywords: patch.keywords ?? keywords,
                              match_mode: patch.match_mode ?? matchMode,
                          },
                      }
                    : n,
            ),
        );
    };

    const handleSave = () => {
        setSaving(true);
        const canvasNodes = nodes
            .filter((n) => n.id !== 'trigger')
            .map((n) => ({
                id: n.id,
                type: n.type as StepType,
                position: { x: n.position.x, y: n.position.y },
                data: (n.data as Record<string, unknown>) ?? {},
            }));
        const canvasEdges = edges.map((e) => ({
            id: e.id,
            source: e.source,
            target: e.target,
            sourceHandle: e.sourceHandle ?? undefined,
        })) as CanvasEdge[];

        // Synthesize a "trigger" entry too so the translator can find it.
        const allNodes = [
            {
                id: 'trigger',
                type: 'message' as StepType,
                position: { x: 0, y: 0 },
                data: {},
            },
            ...canvasNodes,
        ];
        const steps = canvasToSteps(allNodes, canvasEdges);

        // Inertia's router.patch types require FormDataConvertible
        // values, but the workflow PATCH wants nested arrays
        // (steps[], canvas {nodes, edges}). Inertia transparently
        // serialises the payload to JSON when the value isn't form
        // data, so casting to a plain object is correct at runtime.
        const payload = {
            name,
            status,
            trigger_kind: 'on_keyword',
            match_mode: matchMode,
            keywords,
            steps,
            definition_canvas: { nodes: canvasNodes, edges: canvasEdges },
        } as unknown as Record<string, never>;

        router.patch(`/app/workflows/${workflow.id}`, payload, {
            preserveScroll: true,
            onFinish: () => setSaving(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__(':name · Canvas', { name: workflow.name })} />

            <div className="flex flex-1 flex-col">
                <div className="flex items-center gap-3 border-b bg-card px-4 py-2">
                    <input
                        className="flex-1 rounded-md border bg-background px-3 py-1 text-sm font-medium"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <select
                        className="rounded-md border bg-background px-3 py-1 text-sm"
                        value={status}
                        onChange={(e) =>
                            setStatus(
                                e.target.value as
                                    | 'draft'
                                    | 'active'
                                    | 'disabled',
                            )
                        }
                    >
                        <option value="draft">{__('Draft')}</option>
                        <option value="active">{__('Active')}</option>
                        <option value="disabled">{__('Disabled')}</option>
                    </select>
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/app/workflows/${workflow.id}/edit`}>
                            {__('Linear edit')}
                        </Link>
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        <Save className="mr-1 size-4" />
                        {saving ? __('Saving…') : __('Save')}
                    </Button>
                </div>

                <div className="grid flex-1 grid-cols-[180px_1fr_300px] overflow-hidden">
                    {/* Left: palette */}
                    <aside className="flex flex-col gap-1 overflow-y-auto border-r bg-muted/30 p-2">
                        <p className="px-2 py-1 text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
                            {__('Add step')}
                        </p>
                        {palette.map((p) => (
                            <button
                                key={p.type}
                                type="button"
                                onClick={() => handleAddNode(p.type)}
                                className="flex items-center gap-2 rounded-md border bg-card px-2 py-1.5 text-left text-xs font-medium transition hover:bg-accent"
                            >
                                {NODE_TYPE_ICONS[p.type]}
                                <span>{p.label}</span>
                                <Plus className="ml-auto size-3 text-muted-foreground" />
                            </button>
                        ))}
                    </aside>

                    {/* Center: canvas */}
                    <div className="relative bg-[#fafafa] dark:bg-background">
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            nodeTypes={NODE_TYPES as never}
                            onNodeClick={(_, node) =>
                                setSelectedNodeId(node.id)
                            }
                            onPaneClick={() => setSelectedNodeId(null)}
                            fitView
                        >
                            <Background />
                            <Controls />
                            <MiniMap pannable zoomable />
                        </ReactFlow>
                    </div>

                    {/* Right: inspector */}
                    <aside className="flex flex-col overflow-y-auto border-l bg-card p-3">
                        {selectedNode ? (
                            <NodeInspector
                                node={selectedNode as CanvasNode}
                                onChange={handleNodeChange}
                                onDelete={handleNodeDelete}
                                triggerExtras={
                                    selectedNode.id === 'trigger'
                                        ? {
                                              keywords,
                                              match_mode: matchMode,
                                              onTriggerChange:
                                                  handleTriggerChange,
                                          }
                                        : undefined
                                }
                            />
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                {__("Click a node to edit. Drag from a node's bottom or side handles to wire it to the next step. Branch nodes have one handle per case.")}
                            </p>
                        )}
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}

function defaultDataFor(type: StepType): Record<string, unknown> {
    switch (type) {
        case 'message':
            return { text: __('New message') };
        case 'question':
            return { text: __('New question?'), var_name: 'visitor_answer' };
        case 'branch':
            return {
                var: 'visitor_answer',
                cases: [
                    { match: 'equals', value: '', go_to: 0 },
                    { match: 'default', value: null, go_to: 0 },
                ],
            };
        case 'tag_lead':
            return { tags: [] };
        case 'webhook':
            return { url: '', method: 'POST' };
        case 'escalate':
            return { text: __("I'll connect you with a human now.") };
    }
}
