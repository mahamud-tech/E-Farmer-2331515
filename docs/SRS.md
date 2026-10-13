# Software Requirements Specification (SRS)
## EFarmer — Digital Marketplace for Farmers

**Version:** 1.0  
**Status:** Coursework draft

## 1. Purpose
This document specifies the functional and non-functional requirements for EFarmer, a digital marketplace that connects farmers and buyers. It provides a basis for implementation and testing.

## 2. System Scope
EFarmer lets farmers publish agricultural products and lets buyers browse listings and place basic orders. Authentication, role-based authorization, profiles, security permissions, and deployment are planned for Beta.

## 3. Users and Permissions
| Role | Planned permissions | Release |
|---|---|---|
| Admin | View users; moderate or remove inappropriate listings; review marketplace activity | Core listing/order workflow MVP; admin authorization Beta |
| Farmer/Seller | Create and manage own listings; view orders for own products; update permitted order status | Core workflow MVP; ownership enforcement Beta |
| Buyer/Customer | Browse and search listings; place orders; view own order history | Core workflow MVP; account enforcement Beta |

The MVP may use a local development configuration. The Beta backend must enforce role and resource-ownership checks on protected operations.

## 4. Functional Requirements

### 4.1 Product Listings
- **SRS-FR-01 (MVP):** The system shall list available agricultural products.
- **SRS-FR-02 (MVP):** A seller shall create a listing containing name, description, category, price, unit, and quantity.
- **SRS-FR-03 (MVP):** The system shall display listing details.
- **SRS-FR-04 (MVP):** A seller shall update or delete a listing.
- **SRS-FR-05 (MVP):** The system shall reject missing required fields and negative prices or quantities.
- **SRS-FR-06 (MVP):** The system should support searching or filtering by name or category.

### 4.2 Orders
- **SRS-FR-07 (MVP):** A buyer shall place an order for a listed product and quantity.
- **SRS-FR-08 (MVP):** The system shall reject non-positive quantities and quantities greater than available stock.
- **SRS-FR-09 (MVP):** The system shall store an order identifier, product, quantity, buyer contact, date, and status.
- **SRS-FR-10 (MVP):** The system shall show order status and basic order history.
- **SRS-FR-11 (MVP):** A seller shall view orders related to their products in the demonstration workflow.

### 4.3 Authentication and Authorization
- **SRS-FR-12 (Beta):** The system shall allow registered users to log in and log out.
- **SRS-FR-13 (Beta):** The backend shall associate authenticated requests with a user and role.
- **SRS-FR-14 (Beta):** The backend shall deny actions when role, permission, or resource ownership does not allow them.
- **SRS-FR-15 (Beta):** The system shall provide role-appropriate user dashboards.
- **SRS-FR-16 (Beta):** Admin users shall be able to moderate product listings.
- **SRS-FR-17 (Beta):** Buyers shall only view their own orders, and farmers shall only manage their own listings and relevant orders.

## 5. External Interface Requirements

### 5.1 User Interface
- React + TypeScript web interface.
- Product catalogue with name, category, price, unit, quantity, and seller information.
- Listing forms for farmers.
- Order form and order-status/history view.
- Loading, empty, success, and error states.

### 5.2 Software Interfaces
- The frontend communicates with FastAPI through REST endpoints.
- Request and response bodies use JSON.
- The backend returns appropriate HTTP status codes for success, invalid input, missing resources, authentication failure, and insufficient permissions.

## 6. Proposed API Requirements
Endpoint names may be adjusted to match the actual implementation.

| Method | Endpoint | Purpose | Release |
|---|---|---|---|
| GET | `/api/products` | List/search products | MVP |
| POST | `/api/products` | Create product listing | MVP |
| GET | `/api/products/{product_id}` | Get product details | MVP |
| PUT | `/api/products/{product_id}` | Update listing | MVP |
| DELETE | `/api/products/{product_id}` | Delete listing | MVP |
| GET | `/api/orders` | List orders visible in the demo workflow | MVP; ownership enforcement Beta |
| POST | `/api/orders` | Place an order | MVP |
| GET | `/api/orders/{order_id}` | Get order details | MVP; ownership enforcement Beta |
| PATCH | `/api/orders/{order_id}/status` | Update status where permitted | MVP; role enforcement Beta |
| POST | `/api/auth/login` | Authenticate a user | Beta |
| GET | `/api/users/me` | Get current user's profile | Beta |

## 7. Data Requirements

### Product
- `id`: unique identifier
- `farmer_id`: seller/user identifier; ownership enforced in Beta
- `name`: required product name
- `description`: product description
- `category`: agricultural product category
- `price`: non-negative unit price
- `unit`: e.g., kg, bag, litre, dozen, or piece
- `available_quantity`: non-negative quantity
- `created_at`, `updated_at`: timestamps where supported

### Order
- `id`: unique identifier
- `buyer_id`: buyer/user identifier; ownership enforced in Beta
- `product_id`: product being ordered
- `quantity`: positive quantity
- `unit_price_at_order`: price captured at order time if supported
- `buyer_contact`: contact information needed for the prototype
- `status`: Pending, Accepted, or Completed; optionally Cancelled
- `created_at`: timestamp

### User (Beta)
- `id`: unique identifier
- `name`: display name
- `email`: unique login identifier
- `password_hash`: securely hashed password, never plain text
- `role`: Admin, Farmer, or Buyer

## 8. Non-Functional Requirements
- **SRS-NFR-01 (MVP):** The backend shall validate listing and order input.
- **SRS-NFR-02 (MVP):** The interface shall provide understandable feedback.
- **SRS-NFR-03 (MVP):** The frontend and backend shall remain separate application layers.
- **SRS-NFR-04 (Beta):** Passwords shall be securely hashed.
- **SRS-NFR-05 (Beta):** Protected endpoints shall enforce authorization and ownership on the backend.
- **SRS-NFR-06 (Beta):** Secrets shall be stored in environment configuration, not source control.
- **SRS-NFR-07 (Beta):** The application shall be tested and configured for deployment.

## 9. Acceptance Criteria
1. A valid product listing can be created and displayed.
2. A farmer can update and delete a listing through the intended interface/API.
3. A buyer can browse listings and place a valid order.
4. Invalid or over-stock order quantities are rejected.
5. The system displays order status and basic order details.
6. Invalid input returns a clear error response.
7. In Beta, unauthenticated users cannot access protected actions.
8. In Beta, farmers cannot edit others' listings and buyers cannot access others' orders.
