# @iranimij/magento-mcp-remote-server

A remote Model Context Protocol (MCP) server designed to work with the [Magento 2 MCP server module](https://github.com/iranimij/magento-mcp-server). This library provides a CLI server that exposes tools for demonstration and for fetching product details from a Magento backend. It is intended to be used in conjunction with the Magento 2 module to enable AI and remote automation features for your Magento store.

## Features

- MCP server implementation using [@modelcontextprotocol/sdk]
- CLI tool for remote server operation
- Fetch product details from a Magento API
- Easily extensible with custom tools
- Written in TypeScript

## Installation

```bash
npm install -g @iranimij/magento-mcp-remote-server
```
Or, for local development:
```bash
git clone <this-repo-url>
cd mcp
npm install
npm run build && npm run bundle
```

## Usage
Use below code in your cursor mcp settings

```json
"testServer": {
  "command": "npx",
  "args": ["@iranimij/magento-mcp-remote-server"],
  "env": {
    "MAGENTO_API_URL": "https://app.magento.test/",
    "MAGENTO_ADMIN_USERNAME": "admin",
    "MAGENTO_ADMIN_PASSWORD": "admin1234"
  }
},
```


### As a CLI

```bash
npx magento-mcp-remote-server
```

```bash
magento-mcp-remote-server
```

Or, if running locally after build:
```bash
node dist/bundle.cjs
```

### Environment Variables

- `MAGENTO_API_URL` (required): The base URL of your Magento API (e.g., `https://your-magento-site.com`).
- (Optional) You may add authentication headers in `index.ts` if your Magento API requires a token.

## Tools Provided

### 1. `get-product-details`
Fetches product details for a given product ID from the Magento API.

**Parameters:**
- `productId` (string): The product ID to fetch details for.

### 2. `get-todays-orders`
Fetches all orders placed today from the Magento API. This tool doesn't require any parameters.

### 3. `create-customer`
Creates a new customer in Magento.

**Parameters:**
- `customer` (object): An object containing the customer's details.
  - `email` (string): The customer's email address.
  - `firstname` (string): The customer's first name.
  - `lastname` (string): The customer's last name.
  - `addresses` (array, optional): A list of customer addresses.
- `password` (string): The customer's password.

### 4. `create-simple-product`
Creates a new simple product in Magento.

**Parameters:**
- `product` (object): An object containing the product's details.
  - `sku` (string): The product's SKU.
  - `name` (string): The product's name.
  - `price` (number): The product's price.
  - `attribute_set_id` (number): The attribute set ID for the product.
  - `status` (number): The product's status (e.g., 1 for enabled).
  - `visibility` (number): The product's visibility (e.g., 4 for catalog, search).
  - `type_id` (string): Must be set to "simple".

## Development

- Written in TypeScript. Source: `index.ts`
- Build: `npm run build`
- Bundle: `npm run bundle` (outputs to `dist/bundle.cjs`)
- TypeScript config: see `tsconfig.json`
- Rollup config: see `rollup.config.js`

## Extending

To add your own tools, edit `index.ts` and use the `server.tool` method. See the included examples for reference.

## Related Projects

- [Magento 2 MCP server module](https://github.com/iranimij/magento-mcp-server): The Magento 2 extension that this remote server is designed to work with.

## License

MIT
```

</rewritten_file>