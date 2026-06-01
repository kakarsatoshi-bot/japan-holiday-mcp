export const pingToolDefinition = {
  name: "ping",
  description: "Test connectivity to the Japan Holiday MCP server and confirm it is running.",
  inputSchema: {
    type: "object" as const,
    properties: {
      message: {
        type: "string",
        description: "Optional message to echo back",
      },
    },
    required: [],
  },
};

export async function handlePing(args: { message?: string }): Promise<string> {
  return JSON.stringify({
    status: "ok",
    server: "japan-holiday-mcp",
    version: "1.0.0",
    message: args.message ? `Echo: ${args.message}` : "pong",
  });
}
