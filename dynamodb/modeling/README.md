# Modeling

## Shopping Carts (One to Many)

- Use GSI to query multiple rows with the same key

### Users Table

| UserName | Payment Method |
| -------- | -------------- |
| peter    | Paypal         |
| jackson  | Visa           |

### Items Table

| PurchaseID | ItemName   | UserName | Count |
| ---------- | ---------- | -------- | ----- |
| 0          | Watermelon | peter    | 1     |
| 1          | Pear       | peter    | 1     |
| 2          | Pear       | jackson  | 1     |

Items table also has a global secondary index with UserName as partition key.
This enables us to query the `Items` table and find all rows with a `UserName`
