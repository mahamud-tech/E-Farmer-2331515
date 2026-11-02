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

## User Stories

### Epics & Features: Crop Inventory Management (MVP)

#### US-01: View All Crop Listings (Read List)
- **As a** Farmer / Produce Seller,
- **I want to** view a complete list of all my registered crops with their current quantities and prices,
- **So that** I can track my overall available produce inventory efficiently.
- **Acceptance Criteria:**
  - The system displays a tabular list containing Crop Name, Category, Quantity (kg), Price per Unit, and Status.
  - The list automatically updates when new entries are added, modified, or deleted.

#### US-02: View Single Crop Details (Read Single)
- **As a** Farmer / Produce Manager,
- **I want to** click on a specific crop entry to view its complete detailed profile,
- **So that** I can inspect creation timestamps, exact database IDs, and detailed specifications.
- **Acceptance Criteria:**
  - Clicking "View" opens a detailed view modal or section displaying the crop's unique ID, exact name, category, and creation date.

#### US-03: Register New Crop Entry (Create)
- **As a** Farmer,
- **I want to** add a new crop item to the inventory system with its details,
- **So that** I can list new harvests available for sale.
- **Acceptance Criteria:**
  - Form validation prevents submission if required fields (Name, Category, Quantity, Price) are empty.
  - Submitting the form sends a `POST` request to the backend and immediately updates the UI list without requiring a page refresh.

#### US-04: Update Existing Crop Details (Update)
- **As a** Farmer,
- **I want to** edit the quantity, price per unit, or status of an existing crop entry,
- **So that** my inventory stays accurate when prices change or stock is partially sold.
- **Acceptance Criteria:**
  - Clicking "Edit" populates the input form with the selected crop's existing data.
  - Submitting updates the item in the database via a `PUT` request and reflects changes in the table.

#### US-05: Remove Crop Entry (Delete)
- **As a** Farmer,
- **I want to** delete an outdated or invalid crop entry from the system,
- **So that** my active inventory list remains clean and accurate.
- **Acceptance Criteria:**
  - Clicking "Delete" triggers a `DELETE` API call, removing the item from the Supabase database and the UI table.
## Project Milestones & Roadmap

| Milestone | Deliverable / Goal | Target Completion | Status |
|---|---|---|---|
| **M1: Architecture & Setup** | Project repository setup, VS Code environment configuration, Supabase DB initialization (`crops` table setup). | Oct 26, 2026 | Completed |
| **M2: Backend MVP Implementation** | FastAPI setup, REST API endpoints (`POST`, `GET`, `PUT`, `DELETE`), Pydantic validation schemas, Supabase client integration. | Oct 29, 2026 | Completed |
| **M3: Frontend CRUD Implementation** | Functional React (TypeScript) components, API fetch service, form state management, table and detail views. | Nov 01, 2026 | Completed |
| **M4: Git & Vercel Deployment** | Feature branch strategy (`feature/crop-crud`), GitHub Pull Request creation and code review, live deployment on Vercel. | Nov 03, 2026 | In Progress |
| **M5: Mid Project Assessment & Viva** | Live demonstration of CRUD operations, network request flow explanation in DevTools, Postman API testing preparation. | Nov 04, 2026 | Upcoming |