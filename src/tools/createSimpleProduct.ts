import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import fetch from 'node-fetch';
import https from 'https';
import { getMagentoToken } from '../magentoAuth.js';

export function register(server: McpServer, agent: https.Agent) {
    const baseUrl = process.env.MAGENTO_API_URL;

    server.tool(
        "create-simple-product",
        "Create a new simple product in Magento.",
        {
            product: z.object({
                sku: z.string().describe("SKU"),
                name: z.string().describe("Product name"),
                attribute_set_id: z.number().describe("Attribute set ID"),
                price: z.number().describe("Product price"),
                status: z.number().describe("Product status"),
                visibility: z.number().describe("Product visibility"),
                type_id: z.literal("simple").describe("Product type"),
                weight: z.string().optional().describe("Product weight"),
                extension_attributes: z.object({
                    category_links: z.array(z.object({
                        position: z.number(),
                        category_id: z.string()
                    })).optional(),
                    stock_item: z.object({
                        qty: z.string(),
                        is_in_stock: z.boolean()
                    }).optional()
                }).optional(),
                custom_attributes: z.array(z.object({
                    attribute_code: z.string(),
                    value: z.string()
                })).optional()
            }).describe("The product object."),
        },
        async ({ product }) => {
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
            const url = `${baseUrl}/rest/default/V1/products`;
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    agent,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ product }),
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    return {
                        content: [
                            { type: "text", text: `Error: ${response.status} ${response.statusText} - ${errorText}` }
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