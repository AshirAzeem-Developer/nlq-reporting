// Auto-generated E-commerce Database Schema
// Generated: 28/10/2025, 2:58:27 pm
// Database: dashboarddb (MySQL 8.2.0)
// Tables: 8

export const SCHEMA_CONTEXT = `
# DASHBOARDDB E-COMMERCE SCHEMA

## Table: tbl_attachments
Product images and file attachments
Columns:
- attachment_id (int) [PRIMARY KEY, AUTO_INCREMENT, FOREIGN KEY]
- product_id (int) [FOREIGN KEY]
- file_name (varchar(255))
- file_type (varchar(100)) [DEFAULT: NULL]
- file_size (int) [DEFAULT: NULL]
- file_url (varchar(500))
- is_primary (tinyint(1)) [DEFAULT: 0]
- created_at (datetime) [DEFAULT: CURRENT_TIMESTAMP]
- created_by (int) [DEFAULT: NULL]
- updated_at (datetime) [DEFAULT: CURRENT_TIMESTAMP]
- updated_by (int) [DEFAULT: NULL]

## Table: tbl_cart
Shopping cart for logged-in users
Columns:
- id (int) [PRIMARY KEY, AUTO_INCREMENT]
- user_id (int) [FOREIGN KEY]
- product_id (int) [FOREIGN KEY]
- quantity (int) [DEFAULT: 1]
- created_at (timestamp) [DEFAULT: CURRENT_TIMESTAMP]

## Table: tbl_categories
Product categories for organization
Columns:
- id (int) [PRIMARY KEY, AUTO_INCREMENT]
- category_name (varchar(50)) [DEFAULT: NULL]
- created_at (datetime) [DEFAULT: CURRENT_TIMESTAMP]
- created_by (int) [DEFAULT: NULL]
- updated_at (datetime) [DEFAULT: CURRENT_TIMESTAMP]
- updated_by (int) [DEFAULT: NULL]

## Table: tbl_order_items
Individual items within orders
Columns:
- id (int) [PRIMARY KEY, AUTO_INCREMENT]
- order_id (int) [FOREIGN KEY]
- product_id (int) [FOREIGN KEY]
- quantity (int) [DEFAULT: 1]
- unit_price (decimal(10)
- subtotal (decimal(10)
- created_at (datetime) [DEFAULT: CURRENT_TIMESTAMP]

## Table: tbl_orders
Customer orders and payment tracking
Columns:
- id (int) [PRIMARY KEY, AUTO_INCREMENT]
- order_number (varchar(50)) [UNIQUE]
- user_id (int) [FOREIGN KEY]
- total_amount (decimal(10)
- payment_status (enum('pending')
- order_status (enum('pending')
- shipping_address (text)
- billing_address (text)
- payment_method (enum('cod')
- created_at (datetime) [DEFAULT: CURRENT_TIMESTAMP]
- updated_at (datetime) [DEFAULT: CURRENT_TIMESTAMP]
- created_by (int) [DEFAULT: NULL]
- updated_by (int) [DEFAULT: NULL]

## Table: tbl_products
Product catalog with pricing and availability
Columns:
- id (int) [PRIMARY KEY, AUTO_INCREMENT]
- product_name (varchar(255))
- description (text)
- price (decimal(10)
- attachments (json) [DEFAULT: NULL]
- isHot (tinyint(1)) [DEFAULT: 0]
- isActive (tinyint(1)) [DEFAULT: 1]
- category_id (int) [FOREIGN KEY, DEFAULT: NULL]
- created_at (timestamp) [DEFAULT: CURRENT_TIMESTAMP]
- updated_at (timestamp) [DEFAULT: CURRENT_TIMESTAMP]
- created_by (int) [DEFAULT: NULL]
- updated_by (int) [DEFAULT: NULL]

## Table: tbl_users
Main user/customer accounts table
Columns:
- id (int) [PRIMARY KEY, AUTO_INCREMENT]
- firstname (varchar(30))
- lastname (varchar(30))
- email (varchar(50)) [UNIQUE]
- designation (varchar(50)) [DEFAULT: NULL]
- password (varchar(255))
- phone_number (varchar(15)) [DEFAULT: NULL]
- address (varchar(250)) [DEFAULT: NULL]
- city (varchar(50)) [DEFAULT: NULL]
- postcode (bigint) [DEFAULT: NULL]
- created_at (timestamp) [DEFAULT: CURRENT_TIMESTAMP]
- updated_by (int) [DEFAULT: NULL]
- created_by (int) [DEFAULT: NULL]
- updated_at (datetime) [DEFAULT: NULL]
- attachment (varchar(100)) [DEFAULT: NULL]

## Table: users
Legacy user table (consider migrating to tbl_users)
Columns:
- id (int) [PRIMARY KEY, AUTO_INCREMENT]
- firstname (varchar(30))
- lastname (varchar(30))
- email (varchar(50)) [UNIQUE]
- designation (varchar(50)) [DEFAULT: NULL]
- password (varchar(255))
- phone_number (varchar(15)) [DEFAULT: NULL]
- reg_date (timestamp) [DEFAULT: CURRENT_TIMESTAMP]

---

## RELATIONSHIP RULES:

### Core Relationships:

1. **Users → Orders:**
   JOIN tbl_orders.user_id = tbl_users.id

2. **Orders → Order Items:**
   JOIN tbl_order_items.order_id = tbl_orders.id

3. **Products → Order Items:**
   JOIN tbl_order_items.product_id = tbl_products.id

4. **Products → Categories:**
   JOIN tbl_products.category_id = tbl_categories.id

5. **Products → Attachments:**
   JOIN tbl_attachments.product_id = tbl_products.id
   (Use WHERE is_primary = 1 for main image)

6. **Shopping Cart:**
   JOIN tbl_cart.product_id = tbl_products.id
   JOIN tbl_cart.user_id = tbl_users.id

---

## COMMON QUERY PATTERNS:

### Revenue Queries:
- Total revenue: SUM(total_amount) WHERE payment_status = 'paid'
- Daily revenue: GROUP BY DATE(created_at)

### Order Status:
- payment_status: 'pending', 'paid', 'failed', 'refunded'
- order_status: 'pending', 'processing', 'shipped', 'delivered', 'cancelled'

### Product Filters:
- Active products: WHERE isActive = 1
- Hot/Featured: WHERE isHot = 1
- By category: JOIN tbl_categories ON category_id

### Payment Methods:
- 'cod' = Cash on Delivery
- 'card' = Credit/Debit Card

### Important Notes:
- tinyint(1) represents BOOLEAN (0=false, 1=true)
- decimal(10,2) for monetary values
- ENUM fields require exact quoted values
- subtotal in tbl_order_items is GENERATED (calculated automatically)
`;
