import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fetch from 'node-fetch';
import https from 'https';
const baseUrl = process.env.MAGENTO_API_URL;
// const token = process.env.MAGENTO_API_TOKEN;
// Create server instance
const server = new McpServer({
    name: "mcp-server-template",
    version: "0.0.3",
});
const agent = new https.Agent({ rejectUnauthorized: false });
// Define a sample tool
server.tool("sample-tool", "A sample tool for demonstration purposes", {
    input: z.string().describe("Input parameter for the sample tool"),
}, async ({ input }) => {
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
});
server.tool("your-tool-name", "Your tool description", {
    // Define your tool's parameters using Zod schema
    parameter: z.string().describe("Parameter description"),
}, async ({ parameter }) => {
    // Implement your tool's logic here
    return {
        content: [
            {
                type: "text",
                text: "Your tool's response",
            },
        ],
    };
});
server.tool("get-product-details", "Get product details for a given product ID from the Magento API.", {
    productId: z.string().describe("The product ID to fetch details for."),
}, async ({ productId }) => {
    if (!baseUrl) {
        return {
            content: [
                { type: "text", text: "Error: MAGENTO_API_URL or MAGENTO_API_TOKEN is not set in environment variables." }
            ]
        };
    }
    const url = `${baseUrl}/rest/V1/iranimij/Product/${productId}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            agent,
            headers: {
                // 'Authorization': `Bearer ${token}`,
                // 'X-Iranimij-Api-Token': `${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            return {
                content: [
                    { type: "text", text: `Error: ${response.status} ${response.statusText}` }
                ]
            };
        }
        const data = await response.json();
        return {
            content: [
                { type: "text", text: JSON.stringify(data, null, 2) }
            ]
        };
    }
    catch (error) {
        return {
            content: [
                { type: "text", text: `Fetch error: ${error}` }
            ]
        };
    }
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log("MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
