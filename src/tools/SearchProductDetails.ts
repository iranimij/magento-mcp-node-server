import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import fetch from 'node-fetch';
import https from 'https';
import { getMagentoToken } from '../magentoAuth.js';

export function register(server: McpServer, agent: https.Agent) {
    const baseUrl = process.env.MAGENTO_API_URL;

    server.tool(
        "search-product-details",
        "Search product details by SKU, name, or ID from the Magento API. At least one parameter is required.",
        {
            sku: z.string().optional().describe("The SKU of the product to search for."),
            name: z.string().optional().describe("The name of the product to search for."),
            id: z.string().optional().describe("The ID of the product to search for."),
        },
        async ({ sku, name, id }) => {
            if (!baseUrl) {
                return {
                    content: [
                        { type: "text", text: "Error: MAGENTO_API_URL is not set in environment variables." }
                    ]
                };
            }
            if (!sku && !name && !id) {
                return {
                    content: [
                        { type: "text", text: "Error: At least one of sku, name, or id must be provided." }
                    ]
                };
            }
            let token: string;
            try {
                token = await getMagentoToken();
            } catch (error) {
                return {
                    content: [
                        { type: "text", text: `Token fetch error: ${error}` }
                    ]
                };
            }
            // Build query params
            const params = new URLSearchParams();
            if (sku) params.append('sku', sku);
            if (name) params.append('name', name);
            if (id) params.append('id', id);
            const url = `${baseUrl}/rest/V1/iranimij/ProductSearch?${params.toString()}`;
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    agent,
                    headers: {
                        'Authorization': `Bearer ${token}`,
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
            } catch (error) {
                return {
                    content: [
                        { type: "text", text: `Fetch error: ${error}` }
                    ]
                };
            }
        }
    );
} 