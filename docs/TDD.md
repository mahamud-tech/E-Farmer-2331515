# Technical Design Document (TDD)
## EFarmer — Digital Marketplace for Farmers

**Version:** 1.0  
**Status:** Proposed design; implementation details may be refined

## 1. Purpose
This document describes the proposed architecture, components, data model, API design, validation, security approach, and testing plan for EFarmer.

## 2. Technology Stack
- **Frontend:** React + TypeScript
- **Backend:** Python + FastAPI
- **Communication:** REST API with JSON
- **Persistence:** Use the database/storage supported by the starter template for the MVP; isolate data access so the storage implementation can be changed if needed.
- **Version control:** Git and GitHub
- **Beta deployment:** configuration appropriate for the selected hosting environment

## 3. Architecture
The application follows a client-server architecture:
1. React displays the product catalogue, listing forms, and order views.
2. The frontend sends HTTP requests to the FastAPI backend.
3. FastAPI validates requests and applies marketplace business rules.
4. The backend data-access layer stores or retrieves products, users, and orders.
5. The API returns JSON responses and the frontend refreshes the displayed state.

The backend is the source of truth for validation, authentication, authorization, and ownership checks.

## 4. Proposed Component Structure

### Frontend
- `pages/` — product catalogue, product details, farmer listing management, and order views
- `components/` — product cards, listing forms, order forms, status labels, and feedback messages
- `services/` — API request functions
- `types/` — TypeScript interfaces for products, orders, users, and API responses

Use the actual starter template conventions and avoid creating duplicate structures unnecessarily.

### Backend
- `main.py` — FastAPI application and router registration
- `routers/` — product, order, and (Beta) authentication/user routes
- `schemas/` — Pydantic request and response schemas
- `models/` — persistence models if used by the selected database
- `services/` — product and order business logic
- `dependencies/` or equivalent — authentication and permission checks in Beta

These are logical responsibilities; adapt them to the existing template.

## 5. Data Model

### Product
| Field | Type (proposed) | Rules |
|---|---|---|
| id | Integer or UUID | Primary identifier |
| farmer_id | User identifier | Listing owner; enforce in Beta |
| name | String | Required, trimmed |
| description | Text | Product description |
| category | String | Required |
| price | Decimal/numeric | Must be >= 0 |
| unit | String | Required |
| available_quantity | Decimal/numeric | Must be >= 0 |
| created_at | Date/time | Set by backend where supported |
| updated_at | Date/time | Updated by backend where supported |

### Order
| Field | Type (proposed) | Rules |
|---|---|---|
| id | Integer or UUID | Primary identifier |
| buyer_id | User identifier | Order owner; enforce in Beta |
| product_id | Product identifier | References Product |
| quantity | Decimal/numeric | Must be > 0 |
| unit_price_at_order | Decimal/numeric | Capture at order time if supported |
| buyer_contact | String | Validate as appropriate for the prototype |
| status | Enum/string | Pending, Accepted, Completed; optional Cancelled |
| created_at | Date/time | Set by backend |

### User (Beta)
| Field | Type (proposed) | Rules |
|---|---|---|
| id | Integer or UUID | Primary identifier |
| name | String | Required |
| email | String | Unique login identifier |
| password_hash | String | Never store plain-text passwords |
| role | Enum/string | Admin, Farmer, Buyer |

## 6. REST API Design
The following endpoints are proposed and may be adjusted to match the implementation.

| Method | Endpoint | Purpose | Release |
|---|---|---|---|
| GET | `/api/products` | List/search products | MVP |
| POST | `/api/products` | Create product listing | MVP |
| GET | `/api/products/{product_id}` | Get product details | MVP |
| PUT | `/api/products/{product_id}` | Update listing | MVP |
| DELETE | `/api/products/{product_id}` | Delete listing | MVP |
| GET | `/api/orders` | List orders available in the demo workflow | MVP |
| POST | `/api/orders` | Place order | MVP |
| GET | `/api/orders/{order_id}` | Get order details | MVP |
| PATCH | `/api/orders/{order_id}/status` | Update order status | MVP; authorization Beta |
| POST | `/api/auth/login` | Authenticate user | Beta |
| GET | `/api/users/me` | Get current user's profile | Beta |

### API behavior
- Use `200` or `201` for successful operations as appropriate.
- Use `400` or `422` for invalid input, `404` for missing resources, `401` for missing/invalid authentication, and `403` for insufficient permissions.
- Validate price and available quantity as non-negative.
- Require order quantity to be positive and not greater than available stock.
- Re-check stock on the backend when creating an order.

## 7. Business Logic

### Create or update a product
1. Validate required fields.
2. Validate that price and available quantity are non-negative.
3. Save the listing.
4. Return the saved product.

### Place an order
1. Confirm that the product exists and is available.
2. Validate that the requested quantity is greater than zero.
3. Confirm sufficient available quantity.
4. Create an order with Pending status.
5. Choose and document a consistent point for reducing stock (at order creation or acceptance).
6. Return the created order.

### Update order status
1. Confirm that the order exists.
2. In Beta, verify the user is the farmer associated with the product or an Admin with permission.
3. Validate the requested status transition.
4. Save and return the updated order.

## 8. Authentication and Authorization (Beta)
- Add login/logout and a secure authentication mechanism compatible with the starter template.
- Hash passwords using an appropriate password-hashing library.
- Define backend permissions:
  - **Admin:** moderate listings and manage permitted marketplace resources.
  - **Farmer:** create listings and modify only their own listings; view/manage relevant orders.
  - **Buyer:** browse listings, place orders, and view only their own orders.
- Enforce security scopes/permissions on protected endpoints.
- Check resource ownership in the backend; never rely only on frontend route or button visibility.
- Return `401 Unauthorized` for unauthenticated requests and `403 Forbidden` for users lacking permission.
- Keep secrets and token keys out of Git.

## 9. Validation and Error Handling
- Reject empty product names and missing required fields.
- Reject negative prices and quantities.
- Reject zero or negative order quantities.
- Reject orders exceeding available stock.
- Validate allowed order-status values and transitions.
- Return useful errors without exposing stack traces, secrets, or internal implementation details.

## 10. Testing Plan

### MVP
- Test product create, list, view, update, and delete operations.
- Test search/filter behavior if implemented.
- Test valid order creation.
- Test rejection of zero, negative, and over-stock order quantities.
- Test invalid product input and missing product/order responses.
- Verify frontend operations integrate correctly with the REST API.

### Beta
- Test login success and failure.
- Test role permissions for Admin, Farmer, and Buyer.
- Test that a farmer cannot modify another farmer's listing.
- Test that a buyer cannot view another buyer's order.
- Test order-status authorization and validation.
- Test deployment configuration and ensure secrets are not exposed.

## 11. Release Plan
- **MVP:** product listing CRUD, browsing/searching, basic order placement and status, REST API, and local end-to-end operation.
- **Beta:** authentication, Admin/Farmer/Buyer RBAC, user dashboards, security scopes/permissions, listing moderation, ownership enforcement, and deployment.

## 12. Risks and Mitigations
- **Scope creep:** focus MVP on listings and simple orders; exclude real payments and delivery tracking.
- **Stock inconsistency:** validate available quantity on the backend and define a consistent point at which stock is reduced.
- **Unauthorized data access:** enforce role and ownership checks in FastAPI in Beta.
- **Overly complex workflow:** use a small, clearly defined order-status lifecycle for the coursework demonstration.
