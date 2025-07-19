# create-simple-product

Creates a new simple product in Magento.

## Usage

Use this tool to add a new simple product to your Magento store.

**Example prompt:**
```
create a new simple product with dummy details
```

## Parameters
- `product` (object): An object containing the product's details.
  - `sku` (string): The product's SKU.
  - `name` (string): The product's name.
  - `price` (number): The product's price.
  - `attribute_set_id` (number): The attribute set ID for the product.
  - `status` (number): The product's status (e.g., 1 for enabled).
  - `visibility` (number): The product's visibility (e.g., 4 for catalog, search).
  - `type_id` (string): Must be set to "simple".

## Response
Returns the created product object or an error if creation fails. 