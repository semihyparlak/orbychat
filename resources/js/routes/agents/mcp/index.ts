type Arg = string | number | { id: string | number };

function extractId(val: Arg): string | number {
    return typeof val === 'object' && val !== null ? val.id : val;
}

export const index = (args: { agent: Arg }) => ({
    url: `/app/agents/${extractId(args.agent)}/mcp`,
    method: 'get' as const,
});

export const store = (args: { agent: Arg }) => ({
    url: `/app/agents/${extractId(args.agent)}/mcp`,
    method: 'post' as const,
});

export const destroy = (args: { agent: Arg; mcpServer: Arg }) => ({
    url: `/app/agents/${extractId(args.agent)}/mcp/${extractId(args.mcpServer)}`,
    method: 'delete' as const,
});

export const test = (args: { agent: Arg; mcpServer: Arg }) => ({
    url: `/app/agents/${extractId(args.agent)}/mcp/${extractId(args.mcpServer)}/test`,
    method: 'post' as const,
});

export const refresh = (args: { agent: Arg; mcpServer: Arg }) => ({
    url: `/app/agents/${extractId(args.agent)}/mcp/${extractId(args.mcpServer)}/refresh`,
    method: 'post' as const,
});

export const tools = (args: { agent: Arg; mcpServer: Arg }) => ({
    url: `/app/agents/${extractId(args.agent)}/mcp/${extractId(args.mcpServer)}/tools`,
    method: 'get' as const,
});

export const activity = (args: { agent: Arg; mcpServer: Arg }) => ({
    url: `/app/agents/${extractId(args.agent)}/mcp/${extractId(args.mcpServer)}/activity`,
    method: 'get' as const,
});
