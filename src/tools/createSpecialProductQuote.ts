import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import fetch from 'node-fetch';
import https from 'https';
import { getMagentoToken } from '../magentoAuth.js';

export function register(server: McpServer, agent: https.Agent) {
    const baseUrl = process.env.MAGENTO_API_URL;

    server.tool(
        "create-special-product-quote",
        "Create a new quote (cart) and add a special product with custom attributes and options.",
        {
            customer_id: z.number().optional().describe("Customer ID (required for admin users creating quote for customer)"),
            product: z.object({
                sku: z.string().describe("Product SKU"),
                qty: z.number().describe("Product quantity"),
                product_type: z.enum(["simple", "configurable", "bundle", "downloadable"]).optional().describe("Product type"),
                custom_price: z.number().optional().describe("Custom price for special pricing"),
                custom_attributes: z.array(z.object({
                    attribute_code: z.string().describe("Attribute code"),
                    value: z.union([z.string(), z.number(), z.boolean()]).describe("Attribute value")
                })).optional().describe("Custom attributes for special product features"),
                product_option: z.object({
                    extension_attributes: z.object({
                        configurable_item_options: z.array(z.object({
                            option_id: z.string().describe("Option ID"),
                            option_value: z.number().describe("Option value")
                        })).optional().describe("For configurable products"),
                        bundle_options: z.array(z.object({
                            option_id: z.number().describe("Bundle option ID"),
                            option_qty: z.number().describe("Option quantity"),
                            option_selections: z.array(z.number()).describe("Selected option IDs")
                        })).optional().describe("For bundle products"),
                        downloadable_option: z.object({
                            downloadable_links: z.array(z.number()).describe("Downloadable link IDs")
                        }).optional().describe("For downloadable products")
                    }).optional()
                }).optional().describe("Product options for complex product types"),
                special_notes: z.string().optional().describe("Special notes or instructions for this product")
            }).describe("Special product details to add to the quote"),
            quote_notes: z.string().optional().describe("Special notes for the entire quote"),
            is_guest: z.boolean().optional().default(false).describe("Whether this is for a guest customer (true) or logged-in customer (false)")
        },
        async ({ customer_id, product, quote_notes, is_guest }) => {
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

            try {
                // Step 1: Create a new quote/cart
                let quoteId: string;
                let createQuoteUrl: string;
                let createQuoteHeaders: { [key: string]: string };

                if (is_guest) {
                    // Create guest cart
                    createQuoteUrl = `${baseUrl}/rest/default/V1/guest-carts`;
                    createQuoteHeaders = {
                        'Content-Type': 'application/json',
                    };
                } else {
                    // Create customer cart
                    createQuoteUrl = `${baseUrl}/rest/default/V1/carts/mine`;
                    createQuoteHeaders = {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    };
                }

                const createQuoteResponse = await fetch(createQuoteUrl, {
                    method: 'POST',
                    agent,
                    headers: createQuoteHeaders,
                });

                if (!createQuoteResponse.ok) {
                    const errorText = await createQuoteResponse.text();
                    return {
                        content: [
                            { type: "text", text: `Error creating quote: ${createQuoteResponse.status} ${createQuoteResponse.statusText} - ${errorText}` }
                        ]
                    };
                }

                quoteId = await createQuoteResponse.text();
                quoteId = quoteId.replace(/"/g, ''); // Remove quotes from response

                // Step 2: Prepare cart item data
                const cartItem: any = {
                    sku: product.sku,
                    qty: product.qty,
                    quote_id: quoteId
                };

                // Add custom price if specified
                if (product.custom_price) {
                    cartItem.custom_price = product.custom_price;
                }

                // Add product options if specified
                if (product.product_option) {
                    cartItem.product_option = product.product_option;
                }

                // Add custom attributes if specified
                if (product.custom_attributes) {
                    cartItem.custom_attributes = product.custom_attributes;
                }

                // Step 3: Add the special product to the cart
                let addItemUrl: string;
                let addItemHeaders: { [key: string]: string };

                if (is_guest) {
                    addItemUrl = `${baseUrl}/rest/default/V1/guest-carts/${quoteId}/items`;
                    addItemHeaders = {
                        'Content-Type': 'application/json',
                    };
                } else {
                    addItemUrl = `${baseUrl}/rest/default/V1/carts/mine/items`;
                    addItemHeaders = {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    };
                }

                const addItemResponse = await fetch(addItemUrl, {
                    method: 'POST',
                    agent,
                    headers: addItemHeaders,
                    body: JSON.stringify({ cartItem }),
                });

                if (!addItemResponse.ok) {
                    const errorText = await addItemResponse.text();
                    return {
                        content: [
                            { type: "text", text: `Error adding product to quote: ${addItemResponse.status} ${addItemResponse.statusText} - ${errorText}` }
                        ]
                    };
                }

                const addItemData = await addItemResponse.json();

                // Step 4: If quote notes are provided, try to update the quote with notes
                let quoteData: any = {
                    quoteId: quoteId,
                    itemAdded: addItemData
                };

                if (quote_notes || product.special_notes) {
                    // Get current quote details to update with notes
                    let getQuoteUrl: string;
                    let getQuoteHeaders: { [key: string]: string };

                    if (is_guest) {
                        getQuoteUrl = `${baseUrl}/rest/default/V1/guest-carts/${quoteId}`;
                        getQuoteHeaders = {
                            'Content-Type': 'application/json',
                        };
                    } else {
                        getQuoteUrl = `${baseUrl}/rest/default/V1/carts/mine`;
                        getQuoteHeaders = {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        };
                    }

                    const getQuoteResponse = await fetch(getQuoteUrl, {
                        method: 'GET',
                        agent,
                        headers: getQuoteHeaders,
                    });

                    if (getQuoteResponse.ok) {
                        const currentQuoteData = await getQuoteResponse.json();
                        quoteData.quoteDetails = currentQuoteData;
                    }

                    quoteData.notes = {
                        quote_notes: quote_notes,
                        product_notes: product.special_notes
                    };
                }

                const responseMessage = `Successfully created special product quote!

Quote ID: ${quoteId}
Product: ${product.sku} (Qty: ${product.qty})
${product.custom_price ? `Custom Price: $${product.custom_price}` : ''}
${product.custom_attributes ? `Custom Attributes: ${JSON.stringify(product.custom_attributes, null, 2)}` : ''}
${quote_notes ? `Quote Notes: ${quote_notes}` : ''}
${product.special_notes ? `Product Notes: ${product.special_notes}` : ''}

Full Response:
${JSON.stringify(quoteData, null, 2)}`;

                return {
                    content: [
                        { type: "text", text: responseMessage }
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