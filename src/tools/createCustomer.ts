import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import fetch from 'node-fetch';
import https from 'https';
import { getMagentoToken } from '../magentoAuth.js';

export function register(server: McpServer, agent: https.Agent) {
    const baseUrl = process.env.MAGENTO_API_URL;

    server.tool(
        "create-customer",
        "Create a new customer in Magento.",
        {
            customer: z.object({
                email: z.string().describe("The customer's email address."),
                firstname: z.string().describe("The customer's first name."),
                lastname: z.string().describe("The customer's last name."),
                addresses: z.array(z.object({
                    defaultShipping: z.boolean().optional().describe("Is this the default shipping address?"),
                    defaultBilling: z.boolean().optional().describe("Is this the default billing address?"),
                    firstname: z.string().describe("The first name for the address."),
                    lastname: z.string().describe("The last name for the address."),
                    region: z.object({
                        regionCode: z.string().describe("The region code (e.g., NY)."),
                        region: z.string().describe("The region name (e.g., New York)."),
                        regionId: z.number().describe("The region ID."),
                    }).describe("The region for the address."),
                    postcode: z.string().describe("The postal code."),
                    street: z.array(z.string()).describe("The street address lines."),
                    city: z.string().describe("The city."),
                    telephone: z.string().describe("The telephone number."),
                    countryId: z.string().describe("The country ID (e.g., US)."),
                })).optional().describe("A list of customer addresses."),
            }).describe("The customer object."),
            password: z.string().describe("The customer's password."),
        },
        async ({ customer, password }) => {
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
            const url = `${baseUrl}/rest/default/V1/customers`;
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    agent,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ customer, password }),
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