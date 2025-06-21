# create-customer

Creates a new customer in Magento.

## Usage

Use this tool to add a new customer to your Magento store.

**Example prompt:**
```
create a new customer
```

## Parameters
- `customer` (object): An object containing the customer's details.
  - `email` (string): The customer's email address.
  - `firstname` (string): The customer's first name.
  - `lastname` (string): The customer's last name.
  - `addresses` (array, optional): A list of customer addresses.
- `password` (string): The customer's password.

## Response
Returns the created customer object or an error if creation fails. 