type Arg = string | number | { id: string | number };

function extractId(val: Arg): string | number {
    return typeof val === 'object' && val !== null ? val.id : val;
}

export const bulk = (args: { agent: Arg; mcpServer: Arg }) => ({
    url: `/app/agents/${extractId(args.agent)}/mcp/${extractId(args.mcpServer)}/tools`,
    method: 'patch' as const,
});
