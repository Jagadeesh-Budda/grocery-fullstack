# FreshCartFlow Admin Feature Parity (Code-Traceable Gap Analysis)

> Goal: Compare **your current admin system** (React + Spring Boot + JPA + Flyway) against **production grocery / quick-commerce admin platforms** (Blinkit / Zepto / BigBasket class).
>
> Rule of engagement for this document:
> - Every “Your System” capability is traceable to **code, endpoint, or DB schema** listed below.
> - “Production-grade expectation” lists **industry-standard admin/ops capabilities** (not marketing). It is **not** treated as implemented unless you have evidence.
> - Status markers:
>   - ✅ Implemented (works end-to-end for the capability)
>   - 🟡 Partial (exists but incomplete, insecure, inconsistent, or not wired to UI)
>   - ❌ Missing (no credible support in code/schema/UI)

---

## 1) Evidence Index (What was actually found in your repo)

### Frontend (Admin)
- Screens / layouts
  - `frontend/src/pages/AdminDashboard.jsx` (Admin KPI cards + “Recent Orders” mock table)
  - `frontend/src/pages/AdminCategories.jsx` (Category CRUD UI)
  - `frontend/src/layouts/admin/AdminLayout.jsx` (Admin shell + logout)
  - `frontend/src/layouts/admin/AdminSidebar.jsx` (Nav items include Dashboard/Categories/Products/Orders/Settings)
  - `frontend/src/App.jsx` (Admin routes: `/admin`, `/admin/products`, `/admin/categories`)
- API client(s)
  - `frontend/src/services/adminapi.js` (admin dashboard stats + category CRUD + product pagination helpers)
  - `frontend/src/context/AuthContext.jsx` and `frontend/src/routes/ProtectedRoute.jsx` (role-aware routing; relies on backend session for truth)

### Backend (Admin / Ops APIs)
- Admin endpoints
  - `springboot-groceries/src/main/java/.../controller/AdminDashboardController.java`
    - `GET /api/admin/dashboard/stats`
  - `springboot-groceries/src/main/java/.../controller/AdminProductController.java`
    - `POST /api/admin/products`
    - `PUT /api/admin/products/{productId}`
    - `DELETE /api/admin/products/{productId}`
    - `POST /api/admin/products/{productId}/variants`
    - `PUT /api/admin/products/variants/{variantId}`
    - `DELETE /api/admin/products/variants/{variantId}`
  - `springboot-groceries/src/main/java/.../controller/InventoryController.java`
    - `GET /api/admin/inventory/variants/{variantId}`
    - `PUT /api/admin/inventory/variants/{variantId}/adjust`
  - `springboot-groceries/src/main/java/.../controller/AdminOrderController.java`
    - `PATCH /api/admin/orders/{orderId}/status` (admin status update)
- Security
  - `springboot-groceries/src/main/java/.../config/SecurityConfig.java`
    - `/api/admin/**` requires `hasRole("ADMIN")`

### Backend (Non-admin but relevant to admin domains)
- Categories
  - `springboot-groceries/src/main/java/.../controller/CategoryController.java`
    - `GET /categories` (public)
    - `POST/PUT/DELETE /categories` (comment says “ADMIN ONLY”, but currently **not protected** by security config)
- Orders
  - `springboot-groceries/src/main/java/.../controller/OrderController.java`
    - `POST /api/orders` (creates order from server-side cart using session)
    - `GET /api/orders/me` (user order list)
    - `PUT /api/orders/{orderId}/status` (status update; not restricted to admin)
    - `POST /api/orders/{orderId}/cancel`

### DB Schema (Flyway)
- Baseline tables: `users`, `categories`, `products`, `product_variants`, `product_images`, `carts`, `cart_items`, `orders`, `order_items`
  - `springboot-groceries/src/main/resources/db/migration/common/V1__baseline_schema.sql`
- Product constraints/columns
  - Unique product name: `V2__add_unique_products_name.sql`
  - Product slug: `V4__add_slug_to_products.sql`
  - Low-stock threshold: `V5__add_low_stock_threshold_to_products.sql`

---

## 2) System Reality Check (Important inconsistencies / risks)

| Finding | Evidence | Impact | Status |
|---|---|---:|:--:|
| Admin dashboard stats endpoint likely returns mostly empty DTO | `AdminDashboardController` uses `DashboardService.getDashboardStats()`, but `DashboardService` returns a new `DashboardStatsDTO()` without setting fields | Admin UI may show zeros / misleading KPI | 🟡 |
| There are two competing “stats” implementations | `DashboardService` vs `AdminStatsService` | Confusing ownership; increases chance of broken KPI | 🟡 |
| Category write endpoints appear publicly reachable | `SecurityConfig` permits `/categories/**` and `CategoryController` uses `/categories` for CRUD | Anyone can create/update/delete categories (critical) | ❌ |
| User order status update endpoint is not admin-scoped | `PUT /api/orders/{orderId}/status` in `OrderController` | Risk: customers can mutate status unless backend adds extra checks | 🟡 |
| Product DB has `slug` + `low_stock_threshold`, but entity has no fields | Flyway `V4/V5` vs `ProductMaster.java` | Can’t manage these in code/admin UI; dashboards can’t compute low-stock correctly | 🟡 |
| Admin UI navigation lists Orders/Settings but routes/screens are missing | `AdminSidebar.jsx` vs `App.jsx` routes and missing pages | UX dead-ends / non-functional nav | 🟡 |
| Admin products route points to user browsing page | `App.jsx`: `/admin/products` renders `frontend/src/pages/Products.jsx` | No admin product CRUD UI despite backend APIs existing | 🟡 |

---

## 3) Feature Parity Matrix (Your System vs Production Grocery Admin)

Legend for columns:
- **Backend**: Spring Boot controllers/services support
- **Frontend**: React admin screens support
- **DB**: Flyway schema supports persistence

### 3.1 Identity, Security, Access Control (RBAC)

| Capability | Your System Evidence (files / endpoints / tables) | Backend | Frontend | DB | Production-grade expectation (Blinkit/Zepto/BB-class) | Gap + what to add (API / DB / UI) |
|---|---|:--:|:--:|:--:|---|---|
| Session-based login | `AuthController` (`POST /api/auth/login`), `SecurityConfig` (session policy), `AuthContext.jsx` | ✅ | ✅ | ✅ (`users`) | Session/JWT + device/session management | Add session list + revoke endpoints, device fingerprinting, refresh policy |
| Logout | `POST /api/auth/logout`, `AdminLayout.jsx` calls `/auth/logout` (via axios instance) | ✅ | 🟡 | ✅ | Centralized logout with token/session revocation | Align frontend call path; ensure admin logout hits `/api/auth/logout` consistently |
| Role-based admin API protection | `SecurityConfig`: `/api/admin/**.hasRole("ADMIN")` | ✅ | 🟡 | ✅ (`users.role`) | RBAC + fine-grained permissions (catalog, pricing, ops, finance) | Add Permission model + RolePermission mapping; UI permission guards |
| Admin route protection | `ProtectedRoute.jsx` checks `user.role === ROLE_ADMIN` | 🟡 | ✅ | ✅ | Enforced server-side + UI | Don’t rely on frontend; ensure all admin operations are under `/api/admin/**` |
| Audit logging (who changed what, when) | No audit tables/services | ❌ | ❌ | ❌ | Mandatory (catalog edits, refunds, overrides, cancellations) | Add `audit_log` table + interceptor + UI “History” tab |
| Two-person approvals / maker-checker (sensitive ops) | None | ❌ | ❌ | ❌ | Common for price overrides, refunds, payout changes | Add approval workflow tables and admin UI |

### 3.2 Catalog / SKU Management

| Capability | Your System Evidence | Backend | Frontend | DB | Production expectation | Gap + what to add |
|---|---|:--:|:--:|:--:|---|---|
| Category CRUD | `AdminCategories.jsx`, `CategoryController`, `CategoryService`, `categories` table | 🟡 | ✅ | ✅ | Categories + subcategories + merchandising slots | Secure endpoints under `/api/admin/categories`; add sorting, hierarchy, visibility scheduling |
| Product master CRUD | `AdminProductController` + `AdminProductService`, `products` table | ✅ | ❌ | ✅ | Master products with rich attributes | Build `AdminProducts` screen: list/search/edit/create/delete |
| Variant CRUD (SKU-level) | `AdminProductController` variants endpoints, `product_variants` table | ✅ | ❌ | ✅ | SKU lifecycle + barcode + pack sizes | Add fields: `barcode/ean`, `weight`, `dimensions`, `tax_code`, `hsn`, `shelf_life_days` |
| Multi-image support | `product_images` via `@ElementCollection` in `ProductMaster` + table | ✅ | 🟡 | ✅ | Media pipeline + CDN + moderation | Admin media upload, image ordering, validation |
| Product activation (soft disable) | `ProductMaster.is_active`, `Category.is_active`, schema has `is_active` columns | 🟡 | ❌ | ✅ | Scheduled activation/deactivation per city/store | Implement soft-delete policy + UI toggles + store scope |
| Product slug | Flyway `V4` adds slug, entity missing | 🟡 | ❌ | ✅ | Canonical URLs/search keys | Map slug into entity + allow admin edit/regenerate |
| Bulk operations (import/export) | None | ❌ | ❌ | ❌ | Bulk price/stock/catalog updates | Add CSV upload endpoints + job tracking + UI |

### 3.3 Pricing, Promotions, Offers

| Capability | Your System Evidence | Backend | Frontend | DB | Production expectation | Gap + what to add |
|---|---|:--:|:--:|:--:|---|---|
| Discount percent at SKU | `ProductVariant.discountPercent`, `getPrice()` calc; DB `discount_percent` | ✅ | 🟡 | ✅ | Complex promos (BOGO, bundles, bank offers, coupons) | Add `promotions`, `coupons`, `promo_rules`, `promo_redemptions` |
| MRP vs selling price | `ProductVariant.mrp` mapped to DB `price` column; computed `getPrice()` | ✅ | 🟡 | ✅ | City/store-specific pricing | Add price lists per store/city + effective date windows |
| Coupon engine / promo eligibility | None | ❌ | ❌ | ❌ | Eligibility rules, exclusions, caps, abuse controls | Add rules engine + evaluation endpoint + admin promo builder UI |
| Price change approvals | None | ❌ | ❌ | ❌ | Maker-checker + audit | Add approval workflow + audit trail |

### 3.4 Inventory & Replenishment

| Capability | Your System Evidence | Backend | Frontend | DB | Production expectation | Gap + what to add |
|---|---|:--:|:--:|:--:|---|---|
| Stock stored at variant | `product_variants.stock`, schema column `stock` | ✅ | ❌ | ✅ | Stock per dark store/warehouse + reservations | Add `stores`, `inventory_by_store`, `inventory_reservations` |
| Manual inventory adjust | `PUT /api/admin/inventory/variants/{id}/adjust`, `InventoryService.adjustVariantInventory()` | ✅ | ❌ | ✅ | Inventory transaction ledger with reasons | Add `inventory_transactions` (delta, reason, actor, reference) + UI |
| Out-of-stock validation during checkout | `OrderCreateService` checks stock before creating order | ✅ | ✅ (via checkout flow) | ✅ | Real-time reservation/hold with expiry | Add reservation on cart/checkout + expiry cron/job |
| Stock reduction on confirm | `OrderService.updateOrderStatus()` reduces stock on `CONFIRMED` | 🟡 | ❌ | ✅ | Atomic reservation -> allocation -> pick | Add idempotency + concurrency locking + order allocation state |
| Low-stock threshold | Flyway `V5` adds `low_stock_threshold`; entity/UI missing | 🟡 | ❌ | ✅ | Low-stock alerts, auto reorder suggestions | Map field to entity + admin UI for threshold + alerting |
| Replenishment / purchase orders | None | ❌ | ❌ | ❌ | Vendor purchase orders, GRN, shrink/wastage | Add `vendors`, `purchase_orders`, `grn`, `wastage` workflows |

### 3.5 Order Management & Fulfillment Ops

| Capability | Your System Evidence | Backend | Frontend | DB | Production expectation | Gap + what to add |
|---|---|:--:|:--:|:--:|---|---|
| Create order from cart | `POST /api/orders` via `OrderCreateService` + cart tables | ✅ | ✅ | ✅ | Orders with address, slot, payment, fees, substitutions | Add `addresses`, `delivery_slot`, `fees`, `payment_method`, `substitutions` |
| Customer “my orders” list | `GET /api/orders/me`, `OrdersPage.jsx` | ✅ | ✅ | ✅ | Rich order timeline + invoices | Add tracking events + invoice generation |
| Admin order status update | `PATCH /api/admin/orders/{id}/status` | 🟡 | ❌ | ✅ | Full order console (filtering, SLA, exceptions) | Add `GET /api/admin/orders` list + filters + order detail + status timeline |
| Status workflow validation | `OrderStatusValidator` allowed transitions | ✅ | ❌ | ✅ | Workflow plus ops overrides with audit | Add override endpoint requiring permission + audit logging |
| Cancel order | `POST /api/orders/{id}/cancel` | 🟡 | 🟡 (user) | ✅ | Refund + inventory reconciliation + reason codes | Add cancel reasons, refund integration, notifications |
| Pick-pack-ship tooling | None (only statuses exist) | ❌ | ❌ | ❌ | Picker apps, wave picking, packing station, QC | Add fulfillment domain: picklists, bin locations, pack slips |
| Substitutions (item not found) | None | ❌ | ❌ | ❌ | Substitute suggestions + customer approval flow | Add `substitution_candidates` + chat/approval UI |

### 3.6 Delivery Logistics (Core differentiator for quick commerce)

| Capability | Your System Evidence | Backend | Frontend | DB | Production expectation | Gap + what to add |
|---|---|:--:|:--:|:--:|---|---|
| Rider / partner management | None | ❌ | ❌ | ❌ | Rider onboarding, shifts, performance | Add `delivery_partners`, `shifts`, `partner_metrics` |
| Dispatch & assignment | None | ❌ | ❌ | ❌ | Auto-dispatch, batching, route optimization | Integrate 3P (e.g., Locus/Onfleet) or build basic dispatch service |
| Live tracking / ETA | None | ❌ | ❌ | ❌ | Real-time GPS, ETA, SLA alarms | Add tracking events + websocket/SSE + map UI |
| Store selection / serviceability | None | ❌ | ❌ | ❌ | Pincode polygons, store capacity | Add `stores`, `service_zones`, capacity calendars |

### 3.7 Payments, Finance, Reconciliation

| Capability | Your System Evidence | Backend | Frontend | DB | Production expectation | Gap + what to add |
|---|---|:--:|:--:|:--:|---|---|
| Payment capture | None | ❌ | ❌ | ❌ | Payment intents, COD, refunds, settlement | Add `payments`, `refunds`, gateway integration, reconciliation reports |
| Invoice / tax | None | ❌ | ❌ | ❌ | GST invoice, HSN mapping, returns | Add tax fields + invoice rendering + PDF storage |
| Payouts / commissions | None | ❌ | ❌ | ❌ | Marketplace settlement, vendor commissions | Add `vendors`, `commission_rules`, `settlements` |

### 3.8 Customer Support & Trust/Safety

| Capability | Your System Evidence | Backend | Frontend | DB | Production expectation | Gap + what to add |
|---|---|:--:|:--:|:--:|---|---|
| Admin customer profile | None | ❌ | ❌ | ✅ (users table exists) | Customer 360: orders, tickets, refunds, flags | Add `/api/admin/users` search + detail view + notes |
| Support ticketing | None | ❌ | ❌ | ❌ | Integrated CRM (Freshdesk/Zendesk) | Add `support_tickets` or integrate third-party + admin UI |
| Refunds / replacements | None | ❌ | ❌ | ❌ | Refund workflows with audit + payment gateway | Add refund endpoints + reason codes + ledger |
| Fraud / abuse controls | None | ❌ | ❌ | ❌ | Abuse scoring, coupon abuse, chargeback | Add risk scoring hooks + limits + monitoring |

### 3.9 Analytics & Reporting

| Capability | Your System Evidence | Backend | Frontend | DB | Production expectation | Gap + what to add |
|---|---|:--:|:--:|:--:|---|---|
| Admin KPI cards | `AdminDashboard.jsx` + `GET /api/admin/dashboard/stats` | 🟡 | ✅ | 🟡 | Real KPI: GMV, orders, AOV, conversion, SLA | Implement real aggregates from `orders/order_items` (not counts) |
| Real-time operational dashboards | None | ❌ | ❌ | ❌ | Live order funnel, picker SLA, dispatch SLA | Add event model + streaming updates (SSE/WebSocket) |
| Exportable reports | None | ❌ | ❌ | ❌ | CSV/XLS exports, scheduled emails | Add report jobs + storage + download endpoints |

### 3.10 Platform Ops: Observability, Reliability, Jobs

| Capability | Your System Evidence | Backend | Frontend | DB | Production expectation | Gap + what to add |
|---|---|:--:|:--:|:--:|---|---|
| Idempotency (orders/payments) | None | ❌ | ❌ | ❌ | Prevent double charges / double orders | Add idempotency keys table + middleware |
| Background jobs | None | ❌ | ❌ | ❌ | Reconciliation, notifications, expiry, ETL | Add scheduler (Spring @Scheduled) + job table |
| Monitoring / alerts | None | ❌ | ❌ | ❌ | Metrics, traces, dashboards | Add Actuator + OpenTelemetry + alerting |

---

## 4) Missing Admin APIs (Concrete suggestions)

> These are the minimum endpoints you typically need for a production-like admin console.

| Domain | Endpoint | Purpose | Status |
|---|---|---|:--:|
| Orders | `GET /api/admin/orders?status=&from=&to=&q=&page=&size=` | Admin order list with filters | ❌ |
| Orders | `GET /api/admin/orders/{id}` | Order detail (items, customer, timeline) | ❌ |
| Orders | `POST /api/admin/orders/{id}/cancel` | Admin cancel with reason + audit | ❌ |
| Inventory | `GET /api/admin/inventory/low-stock` | Low-stock list using `low_stock_threshold` | ❌ |
| Inventory | `GET /api/admin/inventory/variants/{id}/transactions` | Ledger view of adjustments | ❌ |
| Catalog | `GET /api/admin/products` | Admin products list/search | ❌ |
| Catalog | `GET /api/admin/categories` | Admin-only categories list (secure) | ❌ |
| Users | `GET /api/admin/users?q=&page=&size=` | Admin customer search | ❌ |
| Users | `GET /api/admin/users/{id}` | Customer 360 view | ❌ |
| Audit | `GET /api/admin/audit?entity=&id=` | Who changed what | ❌ |

---

## 5) Missing DB Tables / Columns (Flyway backlog)

| Area | Table / Column | Why it’s needed | Status |
|---|---|---|:--:|
| Audit | `audit_log(id, actor_user_id, action, entity, entity_id, before_json, after_json, created_at)` | Traceability + compliance | ❌ |
| Inventory | `inventory_transactions(id, variant_id, delta, reason, actor_user_id, reference_type, reference_id, created_at)` | Stock integrity | ❌ |
| Stores | `stores(id, name, address, city, timezone, is_active)` | Quick commerce is store/FC-centric | ❌ |
| Inventory by store | `inventory_by_store(store_id, variant_id, on_hand, reserved, updated_at)` | Multi-store stock | ❌ |
| Delivery | `deliveries(id, order_id, partner_id, status, eta, assigned_at, delivered_at)` | Dispatch + tracking | ❌ |
| Payments | `payments(id, order_id, provider, method, amount, status, provider_ref, captured_at)` | Reconciliation | ❌ |
| Refunds | `refunds(id, payment_id, amount, reason, status, created_at)` | Support + finance | ❌ |
| Promotions | `coupons`, `promo_rules`, `promo_redemptions` | Growth + conversion | ❌ |
| Addresses | `addresses(id, user_id, ... )` + `order_address_snapshot` | Delivery operations | ❌ |

---

## 6) Missing Admin UI Screens (React)

| Screen | Route | What it should do | Status |
|---|---|---|:--:|
| Admin Orders | `/admin/orders` | List/filter orders, open detail, update status w/ reason codes | ❌ |
| Admin Products | `/admin/products` | Real CRUD (master + variants), images, active toggle, validation | ❌ |
| Admin Inventory | `/admin/inventory` | Low-stock list + adjustment + transaction history | ❌ |
| Admin Users | `/admin/users` | Customer search, profile, order history, flags/notes | ❌ |
| Admin Promotions | `/admin/promotions` | Coupon builder, rules, scheduling, reporting | ❌ |
| Admin Settings | `/admin/settings` | Tax/fees, store hours, feature flags | ❌ |
| Audit Trail | `/admin/audit` | Search change history by entity | ❌ |

---

## 7) Engineering Backlog Derived From Gap Analysis

### P0 (Security / correctness — fix immediately)
1. **Lock down category write endpoints**
   - Move CRUD to `/api/admin/categories` and secure under `/api/admin/**`.
   - Or restrict `POST/PUT/DELETE /categories` via `SecurityConfig`.
2. **Remove/secure non-admin order status mutation**
   - Restrict `PUT /api/orders/{id}/status` to admin only or remove it from public controller.
3. **Make admin KPIs real**
   - Replace placeholder stats with aggregates from `orders/order_items`.

### P1 (Admin MVP completion — makes dashboard genuinely usable)
4. Admin Orders UI + APIs
   - `GET /api/admin/orders` + detail endpoint + UI table with filters.
5. Admin Products UI
   - Use existing `AdminProductController` to implement create/update/delete master + variants.
6. Inventory low-stock UI
   - Implement `/api/admin/inventory/low-stock` using `products.low_stock_threshold`.

### P2 (Ops-grade features)
7. Inventory transaction ledger
   - Add `inventory_transactions` and write to it from adjustments and order status transitions.
8. Audit log for all admin mutations
   - Interceptor/aspect that records actor + before/after.
9. Basic reporting exports
   - CSV export for orders, inventory, and catalog.

### P3 (Production parity path — Blinkit/Zepto/BB class)
10. Multi-store inventory + serviceability
11. Promotions engine (coupons, rules, scheduling)
12. Payments + refunds + reconciliation
13. Fulfillment ops: picklists, packing, substitutions
14. Dispatch + tracking + ETA
15. Observability + idempotency keys + background jobs
