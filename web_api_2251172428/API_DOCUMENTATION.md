# Online Store REST API — API Documentation

> **Course:** Mobile Programming — Exam #02 (Web API)  
> **Project folder:** `web_api_<MSV>`  
> **Database:** `db_exam_<MSV>`  
> **Tech:** Node.js (Express) + PostgreSQL + Knex  
> **Auth:** JWT Bearer Token  
> **Timezone reference:** Asia/Bangkok (+07)

---

## Table of Contents

1. [Base URL](#base-url)
2. [Authentication](#authentication)
3. [Standard Response Format](#standard-response-format)
4. [HTTP Status Codes](#http-status-codes)
5. [Permissions Matrix](#permissions-matrix)
6. [Health Check](#health-check)
7. [Auth APIs](#auth-apis)
8. [Customer APIs](#customer-apis)
9. [Product APIs](#product-apis)
10. [Order APIs](#order-apis)
11. [Business Rules](#business-rules)
12. [Quick Postman Flow](#quick-postman-flow)

---

## Base URL

- Local: `http://localhost:4000`
- Base path: `/api`

Examples:

- `http://localhost:4000/api/auth/login`
- `http://localhost:4000/api/products?page=1&limit=10`

---

## Authentication

This API uses **JWT Bearer Token**.

### How to provide token

Add HTTP header:

```
Authorization: Bearer <token>
```

### Admin authorization

Admin is determined by `ADMIN_EMAILS` in `.env` (comma-separated).

- Admin-only endpoints return **403 Forbidden** for non-admin users.

---

## Standard Response Format

### Success response

```json
{
  "success": true,
  "message": "OK",
  "data": {}
}
```

### Error response

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [{ "field": "email", "message": "Invalid email" }]
}
```

> Notes:

- Validation errors return `errors[]`.
- Other errors may only return `message`.

---

## HTTP Status Codes

| Code | Meaning                                  |
| ---- | ---------------------------------------- |
| 200  | OK                                       |
| 201  | Created                                  |
| 400  | Bad Request (validation / business rule) |
| 401  | Unauthorized (missing/invalid token)     |
| 403  | Forbidden (permission denied)            |
| 404  | Not Found                                |
| 409  | Conflict (duplicate/unique constraint)   |
| 500  | Internal Server Error                    |

---

## Permissions Matrix

| Group     | Endpoint                        | Permission             |
| --------- | ------------------------------- | ---------------------- |
| Health    | `GET /api/health`               | Public                 |
| Auth      | `POST /api/auth/register`       | Public                 |
| Auth      | `POST /api/auth/login`          | Public                 |
| Auth      | `GET  /api/auth/me`             | Customer/Admin         |
| Customers | `GET /api/customers`            | Admin                  |
| Customers | `GET /api/customers/:id`        | Admin or Self          |
| Customers | `PUT /api/customers/:id`        | Admin or Self          |
| Customers | `GET /api/customers/:id/orders` | Admin or Self          |
| Products  | `GET /api/products`             | Public                 |
| Products  | `GET /api/products/search`      | Public                 |
| Products  | `GET /api/products/:id`         | Public                 |
| Products  | `POST /api/products`            | Admin                  |
| Products  | `PUT /api/products/:id`         | Admin                  |
| Products  | `DELETE /api/products/:id`      | Admin                  |
| Orders    | `POST /api/orders`              | Customer/Admin         |
| Orders    | `GET /api/orders/:id`           | Admin or Owner         |
| Orders    | `PUT /api/orders/:id/status`    | Rule-based (see below) |
| Orders    | `POST /api/orders/:id/pay`      | Admin or Owner         |
| Orders    | `GET /api/orders?status=...`    | Admin                  |

---

## Health Check

### GET `/api/health`

**Description:** Verify API is running.

**Response 200**

```json
{
  "success": true,
  "message": "API is healthy",
  "data": { "status": "OK" }
}
```

**cURL**

```bash
curl -X GET "http://localhost:4000/api/health"
```

---

# Auth APIs

## POST `/api/auth/register`

**Description:** Register a new customer.  
**Auth:** Public

**Request body**

```json
{
  "email": "customer@example.com",
  "password": "password123",
  "full_name": "Nguyễn Văn A",
  "phone_number": "0123456789",
  "address": "123 Đường ABC",
  "city": "Hà Nội",
  "postal_code": "100000"
}
```

**Validation**

- `email`: required, must be valid email
- `password`: required, min length 6
- `full_name`: required

**Response 201**

```json
{
  "success": true,
  "message": "Register successful",
  "data": {
    "id": 10,
    "email": "customer@example.com",
    "full_name": "Nguyễn Văn A",
    "phone_number": "0123456789",
    "address": "123 Đường ABC",
    "city": "Hà Nội",
    "postal_code": "100000",
    "is_active": true,
    "created_at": "2025-12-27T10:00:00.000Z",
    "updated_at": "2025-12-27T10:00:00.000Z"
  }
}
```

**Errors**

- `400` Validation error
- `409` Email already exists

**cURL**

```bash
curl -X POST "http://localhost:4000/api/auth/register"   -H "Content-Type: application/json"   -d '{
    "email":"customer@example.com",
    "password":"password123",
    "full_name":"Nguyễn Văn A",
    "phone_number":"0123456789",
    "address":"123 Đường ABC",
    "city":"Hà Nội",
    "postal_code":"100000"
  }'
```

---

## POST `/api/auth/login`

**Description:** Login and receive JWT token.  
⚠️ **Exam requirement:** Response MUST include `student_id` (hardcoded from env `STUDENT_ID`).  
**Auth:** Public

**Request body**

```json
{
  "email": "customer@example.com",
  "password": "password123"
}
```

**Response 200**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "JWT_TOKEN_HERE",
    "student_id": "<MSV>",
    "customer": {
      "id": 10,
      "email": "customer@example.com",
      "full_name": "Nguyễn Văn A",
      "phone_number": "0123456789",
      "address": "123 Đường ABC",
      "city": "Hà Nội",
      "postal_code": "100000",
      "is_active": true,
      "created_at": "2025-12-27T10:00:00.000Z",
      "updated_at": "2025-12-27T10:00:00.000Z"
    }
  }
}
```

**Errors**

- `400` Validation error
- `401` Invalid email or password

**cURL**

```bash
curl -X POST "http://localhost:4000/api/auth/login"   -H "Content-Type: application/json"   -d '{"email":"customer@example.com","password":"password123"}'
```

---

## GET `/api/auth/me`

**Description:** Get current customer profile.  
**Auth:** Bearer token

**Response 200**

```json
{
  "success": true,
  "message": "OK",
  "data": {
    "id": 10,
    "email": "customer@example.com",
    "full_name": "Nguyễn Văn A",
    "phone_number": "0123456789",
    "address": "123 Đường ABC",
    "city": "Hà Nội",
    "postal_code": "100000",
    "is_active": true,
    "created_at": "2025-12-27T10:00:00.000Z",
    "updated_at": "2025-12-27T10:00:00.000Z"
  }
}
```

**Errors**

- `401` Unauthorized

**cURL**

```bash
curl -X GET "http://localhost:4000/api/auth/me"   -H "Authorization: Bearer <token>"
```

---

# Customer APIs

## GET `/api/customers`

**Description:** List all customers.  
**Auth:** Bearer token  
**Permission:** Admin only

**Response 200**

```json
{
  "success": true,
  "message": "OK",
  "data": [
    {
      "id": 1,
      "email": "admin@example.com",
      "full_name": "Admin User",
      "phone_number": null,
      "address": null,
      "city": "Hà Nội",
      "postal_code": null,
      "is_active": true,
      "created_at": "2025-12-27T10:00:00.000Z",
      "updated_at": "2025-12-27T10:00:00.000Z"
    }
  ]
}
```

**Errors**

- `401` Unauthorized
- `403` Forbidden

---

## GET `/api/customers/:id`

**Description:** Get customer by id.  
**Auth:** Bearer token  
**Permission:** Admin or self

**Path params**

- `id` (number)

**Response 200**

```json
{
  "success": true,
  "message": "OK",
  "data": {
    "id": 10,
    "email": "customer@example.com",
    "full_name": "Nguyễn Văn A",
    "phone_number": "0123456789",
    "address": "123 Đường ABC",
    "city": "Hà Nội",
    "postal_code": "100000",
    "is_active": true
  }
}
```

**Errors**

- `401` Unauthorized
- `403` Forbidden
- `404` Customer not found

---

## PUT `/api/customers/:id`

**Description:** Update customer profile.  
**Auth:** Bearer token  
**Permission:** Admin or self

**Request body (example)**

```json
{
  "full_name": "Nguyễn Văn A (Updated)",
  "city": "Hà Nam",
  "address": "Số 9 ngõ 9"
}
```

**Response 200**

```json
{
  "success": true,
  "message": "Updated",
  "data": {
    "id": 10,
    "email": "customer@example.com",
    "full_name": "Nguyễn Văn A (Updated)",
    "city": "Hà Nam",
    "address": "Số 9 ngõ 9"
  }
}
```

**Errors**

- `400` Validation error
- `401` Unauthorized
- `403` Forbidden
- `404` Customer not found

---

## GET `/api/customers/:id/orders`

**Description:** Get orders of a customer (with pagination and status filter).  
**Auth:** Bearer token  
**Permission:** Admin or self

**Query params**

- `page` (default: 1)
- `limit` (default: 10)
- `status` (optional): `pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`

**Response 200**

```json
{
  "success": true,
  "message": "OK",
  "data": {
    "items": [
      {
        "id": 5,
        "customer_id": 10,
        "order_number": "ORD-20251227-001",
        "status": "pending",
        "subtotal": 1000000,
        "shipping_fee": 30000,
        "total": 1030000,
        "payment_status": "pending",
        "items": [
          {
            "product_id": 1,
            "quantity": 2,
            "price": 25000000,
            "product_name": "iPhone 15",
            "product_category": "Electronics",
            "product_brand": "Apple",
            "product_image_url": null
          }
        ]
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 1 }
  }
}
```

**Errors**

- `401` Unauthorized
- `403` Forbidden

---

# Product APIs

## GET `/api/products`

**Description:** List products with pagination + filters.  
**Auth:** Public

**Query params**

- `page` (default: 1)
- `limit` (default: 10)
- `search` (optional): searches `name`, `description`, `brand`
- `category` (optional): `Electronics`, `Clothing`, `Food`, `Books`, `Toys`
- `min_price`, `max_price` (optional)
- `available_only` (optional): `true/false` (if true: `is_available=true` and `stock>0`)

**Response 200**

```json
{
  "success": true,
  "message": "OK",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "iPhone 15",
        "description": null,
        "price": 25000000,
        "category": "Electronics",
        "brand": "Apple",
        "stock": 50,
        "image_url": null,
        "rating": 0,
        "review_count": 0,
        "is_available": true
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 15 }
  }
}
```

**cURL**

```bash
curl -X GET "http://localhost:4000/api/products?page=1&limit=10&search=iphone&available_only=true"
```

---

## GET `/api/products/search`

**Description:** Advanced search endpoint (same query parameters as `/api/products`).  
**Auth:** Public

---

## GET `/api/products/:id`

**Description:** Get product detail by id.  
**Auth:** Public

**Errors**

- `404` Product not found

---

## POST `/api/products`

**Description:** Create a product.  
**Auth:** Bearer token  
**Permission:** Admin only

**Request body**

```json
{
  "name": "Test Product",
  "description": "Demo",
  "price": 123000,
  "category": "Electronics",
  "brand": "DemoBrand",
  "stock": 10,
  "image_url": "https://example.com/a.jpg"
}
```

**Response 201**

```json
{
  "success": true,
  "message": "Created",
  "data": {
    "id": 99,
    "name": "Test Product",
    "price": 123000,
    "category": "Electronics",
    "stock": 10
  }
}
```

**Errors**

- `400` Validation error
- `401` Unauthorized
- `403` Forbidden

---

## PUT `/api/products/:id`

**Description:** Update product.  
**Auth:** Bearer token  
**Permission:** Admin only

**Errors**

- `400` Validation error
- `401` Unauthorized
- `403` Forbidden
- `404` Product not found

---

## DELETE `/api/products/:id`

**Description:** Delete product.  
**Auth:** Bearer token  
**Permission:** Admin only

**Business rule**

- If the product exists in `order_items` of any order that is **NOT** `delivered`, deletion is blocked.

**Response 200**

```json
{
  "success": true,
  "message": "Deleted",
  "data": { "id": 99 }
}
```

**Errors**

- `400` Cannot delete: product is used in undelivered orders
- `401` Unauthorized
- `403` Forbidden
- `404` Product not found

---

# Order APIs

## POST `/api/orders`

**Description:** Create an order (transaction).  
**Auth:** Bearer token  
**Transaction:** Create order + create order_items + decrease product stock

**Request body**

```json
{
  "items": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 3, "quantity": 1 }
  ],
  "shipping_address": "123 Đường ABC, Hà Nội",
  "payment_method": "card"
}
```

**Rules**

- Validate items (must not be empty)
- Products must exist and `is_available=true`
- Stock must be sufficient for every item
- `shipping_fee` fixed = 30000
- Generate `order_number`: `ORD-YYYYMMDD-XXX`

**Response 201**

```json
{
  "success": true,
  "message": "Created",
  "data": {
    "id": 10,
    "order_number": "ORD-20251227-001",
    "status": "pending",
    "subtotal": 1000000,
    "shipping_fee": 30000,
    "total": 1030000,
    "payment_status": "pending"
  }
}
```

**Errors**

- `400` Not enough stock / product not found / product not available
- `401` Unauthorized

---

## GET `/api/orders/:id`

**Description:** Get order detail with items + product info.  
**Auth:** Bearer token  
**Permission:** Admin or order owner

**Response 200**

```json
{
  "success": true,
  "message": "OK",
  "data": {
    "id": 10,
    "order_number": "ORD-20251227-001",
    "status": "pending",
    "total": 1030000,
    "items": [
      {
        "product_id": 1,
        "quantity": 2,
        "price": 25000000,
        "product_name": "iPhone 15",
        "product_category": "Electronics",
        "product_brand": "Apple"
      }
    ]
  }
}
```

**Errors**

- `401` Unauthorized
- `403` Forbidden
- `404` Order not found

---

## PUT `/api/orders/:id/status`

**Description:** Update order status (with cancel rule).  
**Auth:** Bearer token  
**Permission rules**

- If `status = cancelled`: Admin OR order owner
- Otherwise: Admin only

**Request body**

```json
{ "status": "cancelled" }
```

**Cancel rule (transaction)**

- When cancelling: restore product stock based on order_items.

**Errors**

- `400` Order already cancelled
- `401` Unauthorized
- `403` Forbidden
- `404` Order not found

---

## POST `/api/orders/:id/pay`

**Description:** Pay an order (set `payment_status=paid`).  
**Auth:** Bearer token  
**Permission:** Admin or order owner

**Request body**

```json
{ "payment_method": "card" }
```

**Rules**

- Cannot pay cancelled orders
- Cannot pay already paid orders

**Errors**

- `400` Order already paid / Cannot pay a cancelled order
- `401` Unauthorized
- `403` Forbidden
- `404` Order not found

---

## GET `/api/orders?status=pending`

**Description:** List orders by status (admin only).  
**Auth:** Bearer token  
**Permission:** Admin only

**Query param**

- `status` (optional): `pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`

**Errors**

- `401` Unauthorized
- `403` Forbidden

---

## Business Rules

### Stock update

- When creating order: `products.stock` decreases by `order_items.quantity`
- When cancelling order: `products.stock` increases back

### Delete product rule

- Cannot delete a product if it is referenced by `order_items` of any order with `status != delivered`

### Order number generation

- Format: `ORD-YYYYMMDD-XXX` (increment per day)

---

## Quick Postman Flow

1. `POST /auth/register`
2. `POST /auth/login` → save token
3. `GET /auth/me`
4. `GET /products` (public)
5. Admin login → token_admin
6. Admin creates/updates products
7. Customer creates order
8. Get order detail
9. Cancel order (customer) OR update status (admin)
10. Pay order
11. Admin list orders by status

---
