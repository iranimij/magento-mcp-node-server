import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import fetch from 'node-fetch';
import https from 'https';
import { getMagentoToken } from '../magentoAuth.js';

export function register(server: McpServer, agent: https.Agent) {
    const baseUrl = process.env.MAGENTO_API_URL;

    server.tool(
        "get-product-details",
        "Get product details for a given product ID from the Magento API.",
        {
            productId: z.string().describe("The product ID to fetch details for."),
        },
        async ({ productId }) => {
            if (!baseUrl) {
                return {
                    content: [
                        { type: "text", text: "Error: MAGENTO_API_URL is not set in environment variables." }
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
            const url = `${baseUrl}/rest/V1/iranimij/Product/${productId}`;
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