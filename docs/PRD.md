# Product Requirements Document (PRD)
## EFarmer — Digital Marketplace for Farmers

**Version:** 1.0  
**Status:** Coursework draft  
**Release plan:** MVP (mid-term demo) and Beta (final demo)

## 1. Product Overview
EFarmer is a web-based digital marketplace that connects farmers directly with buyers. Farmers can publish agricultural product listings with prices and available quantities, while buyers can browse listings and place orders. The system aims to make product discovery and basic order management easier for both sides.

## 2. Problem Statement
Farmers may depend on intermediaries or informal channels to reach customers, while buyers may find it difficult to compare available products and prices. EFarmer provides one place to publish agricultural listings and manage basic orders.

## 3. Product Goals
- Allow farmers to create and manage agricultural product listings.
- Allow buyers to browse, search, and view product details.
- Support a simple order placement and order-status workflow.
- Provide a clear interface for farmers and buyers.
- Introduce authentication and role-based access in the Beta release.

## 4. Target Users and Roles
- **Admin:** manages user accounts and moderates listings where required.
- **Farmer/Seller:** manages their own product listings and views orders for their products.
- **Buyer/Customer:** browses products, places orders, and views their own orders.

Role enforcement is planned for Beta. The MVP is intended to demonstrate the core marketplace workflow locally.

## 5. Scope by Release

### 5.1 MVP — Mid-term Demo (local)
- Display a list of agricultural product listings.
- Create, view, update, and delete product listings.
- Store product name, description, category, price, unit, available quantity, and seller.
- Browse and search listings by product name or category, if time permits.
- Place a basic order with quantity and buyer contact details.
- Display basic order history and received orders in a local demo setup.
- Update order status, such as Pending, Accepted, or Completed.
- Provide REST APIs through FastAPI and a React + TypeScript interface.
- Run locally; no production deployment required.

### 5.2 Beta — Final Demo
- User registration, login, and logout.
- Role-based access control for Admin, Farmer, and Buyer.
- User profile/dashboard.
- Security scopes and permission checks on protected endpoints.
- Ensure farmers can manage only their own listings and relevant orders.
- Ensure buyers can view only their own orders.
- Listing moderation by Admin.
- Improved validation, error handling, and deployment configuration.

### 5.3 Out of Scope
- Real payment processing.
- Delivery fleet tracking or live GPS.
- Complex bidding, auctions, or dynamic pricing.
- AI-based crop recommendations or price prediction.
- Multi-branch support.

## 6. Functional Requirements
| ID | Requirement | Release |
|---|---|---|
| FR-01 | The system shall display active agricultural product listings. | MVP |
| FR-02 | A seller shall be able to create a listing with name, category, unit, price, and quantity. | MVP |
| FR-03 | A seller shall be able to view, update, and delete a listing. | MVP |
| FR-04 | A buyer shall be able to view product details. | MVP |
| FR-05 | A buyer shall be able to search or filter listings by name or category. | MVP |
| FR-06 | A buyer shall be able to place an order for a product and quantity. | MVP |
| FR-07 | The system shall reject non-positive order quantities and orders exceeding available stock. | MVP |
| FR-08 | The system shall show order status and basic order history. | MVP |
| FR-09 | The system shall authenticate registered users. | Beta |
| FR-10 | The system shall restrict actions according to Admin, Farmer, and Buyer roles. | Beta |
| FR-11 | The system shall enforce permissions/scopes on protected API endpoints. | Beta |
| FR-12 | The system shall provide role-appropriate user dashboards. | Beta |
| FR-13 | Farmers shall only manage their own listings and relevant orders. | Beta |
| FR-14 | Buyers shall only view their own orders. | Beta |
| FR-15 | Admin users shall be able to moderate product listings. | Beta |
| FR-16 | The system shall be configured for deployment. | Beta |

## 7. Non-Functional Requirements
| ID | Requirement | Release |
|---|---|---|
| NFR-01 | The interface should be usable on common desktop and mobile screen sizes. | MVP |
| NFR-02 | The frontend and backend shall communicate through JSON-based REST APIs. | MVP |
| NFR-03 | The backend shall validate listing and order inputs. | MVP |
| NFR-04 | Errors shall be clear and shall not expose internal server details. | MVP |
| NFR-05 | Passwords shall never be stored as plain text. | Beta |
| NFR-06 | Authorization shall be enforced by the backend, not only by hiding frontend controls. | Beta |
| NFR-07 | Secrets and environment-specific settings shall not be committed to version control. | Beta |
| NFR-08 | UI, API, and business logic should be separated where practical. | MVP |

## 8. Assumptions and Constraints
- This is a small coursework marketplace prototype, not a full commercial trading platform.
- Required stack: React + TypeScript frontend and FastAPI + Python backend.
- Data exchange uses REST APIs and JSON.
- Real payments and logistics are excluded.
- The MVP runs locally; deployment and stronger access controls are planned for Beta.

## 9. Success Criteria
- A farmer can create and maintain a product listing.
- A buyer can browse listings and place a valid order.
- Invalid quantities and orders exceeding available stock are rejected.
- Order status can be viewed and updated through the intended workflow.
- In Beta, role permissions prevent access to restricted data.
- The app can be demonstrated end-to-end with the required stack.
