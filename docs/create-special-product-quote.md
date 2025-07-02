# create-special-product-quote

Creates a new quote (cart) and adds a special product with custom attributes and options to it in Magento.

## Usage

Use this tool to create a quote for special products that may have custom pricing, attributes, or complex configurations. This tool combines cart creation with adding a specially configured product in a single operation.

**Example prompt:**
```
create a special product quote for SKU "SPECIAL-001" with custom price $199.99
```

## Parameters
- `customer_id` (number, optional): Customer ID (required for admin users creating quote for customer).
- `product` (object): Special product details to add to the quote.
  - `sku` (string): The product's SKU.
  - `qty` (number): The product quantity.
  - `product_type` (string, optional): Product type ("simple", "configurable", "bundle", "downloadable").
  - `custom_price` (number, optional): Custom price for special pricing.
  - `custom_attributes` (array, optional): Custom attributes for special product features.
  - `product_option` (object, optional): Product options for complex product types.
  - `special_notes` (string, optional): Special notes or instructions for this product.
- `quote_notes` (string, optional): Special notes for the entire quote.
- `is_guest` (boolean, optional): Whether this is for a guest customer (true) or logged-in customer (false).

## Product Options
The `product_option` parameter supports different product types:
- **Configurable products**: Use `configurable_item_options` with option IDs and values.
- **Bundle products**: Use `bundle_options` with option IDs, quantities, and selections.
- **Downloadable products**: Use `downloadable_option` with downloadable link IDs.

## Response
Returns the created quote ID, added product details, and any special notes. Includes full quote information if notes are provided.

## Example Usage
```json
{
  "product": {
    "sku": "SPECIAL-BUNDLE-001",
    "qty": 1,
    "custom_price": 299.99,
    "custom_attributes": [
      {"attribute_code": "special_category", "value": "premium"},
      {"attribute_code": "rush_order", "value": true}
    ],
    "special_notes": "Custom configuration for premium customer"
  },
  "quote_notes": "Special pricing approved by sales manager",
  "is_guest": false
}
```