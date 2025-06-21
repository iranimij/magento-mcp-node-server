import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import https from 'https';
import { loadTools } from "./src/tool-loader.js";
const baseUrl = process.env.MAGENTO_API_URL;
// const token = process.env.MAGENTO_API_TOKEN;
// Create server instance
const server = new McpServer({
    name: "magento-mcp-server",
    version: "0.0.4",
});
const agent = new https.Agent({ rejectUnauthorized: false });
async function main() {
    // Load tools automatically
    await loadTools(server, agent);
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log("MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
