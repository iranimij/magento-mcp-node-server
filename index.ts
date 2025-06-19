import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create server instance
const server = new McpServer({
  name: "mcp-server-template",
  version: "0.0.3",
});

// Define a sample tool
server.tool(
  "sample-tool",
  "A sample tool for demonstration purposes",
  {
    input: z.string().describe("Input parameter for the sample tool"),
  },
  async ({ input }) => {
    // Process the input
    const output = `Processed: ${input}`;
    
    // Return the result
    return {
      content: [
        {
          type: "text",
          text: output,
        },
      ],
    };
  }
);

server.tool(
    "your-tool-name",
    "Your tool description",
    {
      // Define your tool's parameters using Zod schema
      parameter: z.string().describe("Parameter description"),
    },
    async ({ parameter }) => {
      // Implement your tool's logic here
      return {
        content: [
          {
            type: "text",
            text: "Your tool's response",
          },
        ],
      };
    }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
