import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import https from 'https';
import { register as registerCreateCustomer } from './tools/createCustomer.js';
import { register as registerGetProductDetails } from './tools/getProductDetails.js';
import { register as registerGetTodaysOrders } from './tools/getTodaysOrders.js';
import { register as registerCreateSimpleProduct } from './tools/createSimpleProduct.js';
import { register as registerSearchProductDetails } from './tools/SearchProductDetails.js';

export async function loadTools(server: McpServer, agent: https.Agent) {
    registerGetTodaysOrders(server, agent);
    registerCreateCustomer(server, agent);
    registerGetProductDetails(server, agent);
    registerCreateSimpleProduct(server, agent);
    registerSearchProductDetails(server, agent);
} 