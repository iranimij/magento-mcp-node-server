# search-product-details

Searches for product details by SKU, name, or ID from the Magento API. At least one parameter is required.

## Usage

Use this tool to search for products using SKU, name, or ID.

**Example prompt:**
```
search product sku=ABC123
```

## Parameters
- `sku` (string, optional): The SKU of the product to search for.
- `name` (string, optional): The name of the product to search for.
- `id` (string, optional): The ID of the product to search for.

## Response
Returns a list of products matching the search criteria. 