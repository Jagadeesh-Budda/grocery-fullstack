# Feature Registry v1 (Code-Based Status)

Last updated: 2026-02-04

This document reflects the **current state of the codebase** (Spring Boot backend + React/Vite frontend). It describes what is implemented today and what is missing, without assuming production readiness.

v1 here means: the system has a coherent set of user/admin flows and supporting APIs, but it is **not production-ready** (not fully secured, not fully validated, not fully tested across environments).

## Legend

- Status columns: **Backend / Frontend / Overall**
- ✅ Implemented & wired
- ⚠️ Partially implemented (by design or with known gaps)
- ❌ Not implemented

## Feature Matrix

| Feature Domain | Priority | Backend Status | Frontend Status | Overall | Notes (factual gaps only) |
|---|---:|---:|---:|---:|---|
| Cart | P0 | ⚠️ | ⚠️ | ⚠️ | Backend cart APIs exist but use `userId` path params; auth does not enforce `userId == current user`. Limited server-side validation. Frontend cart sync exists (guest + signed-in) but uses delta-based updates and optimistic UX. |
| Orders | P0 | ⚠️ | ⚠️ | ⚠️ | Frontend checkout calls `POST /api/orders` and navigates to `/order-success`, and an orders list page exists. Backend orders endpoints currently depend on `HttpSession.getAttribute("userId")`, but login does not set this attribute (likely 401s even when authenticated). |
| Inventory | P1 | ⚠️ | ❌ | ⚠️ | Backend variant stock exists and basic admin inventory endpoints exist (`/api/admin/inventory/**`), but there is no frontend inventory UI. |
| Products & Variants | P1 | ⚠️ | ⚠️ | ⚠️ | User product browsing is implemented (`/api/products/**`). Minimal admin CRUD endpoints exist (`/api/admin/products/**`) but frontend does not call them; some frontend “admin” screens still use user endpoints or non-existent endpoints. |
| Pricing & Discounts | P0 | ✅ | ⚠️ | ⚠️ | Backend computes variant price from `mrp` + `discountPercent` and supports `/api/products/discount`. Frontend displays prices but not all flows re-validate pricing server-side before checkout (order creation uses server-side price, cart does not). |
| Search & Categories | P1 | ⚠️ | ⚠️ | ⚠️ | Categories controller exists at `/categories` (not `/api/categories`), while frontend calls `/api/categories` via axios baseURL (`/api`) → likely not wired. No backend search endpoint; frontend search is client-side over loaded data. |
| User Session & Auth | P1 | ⚠️ | ⚠️ | ⚠️ | Session-based auth exists (`/api/auth/login`, `JSESSIONID`, `/api/user/me`). Authorization rules exist (`/api/admin/**` requires ADMIN; `/api/orders/**` requires auth). Gaps: some endpoints rely on session attributes not set (orders), and category admin endpoints under `/categories` are not protected by role rules. |
| Error Handling | P1 | ⚠️ | ⚠️ | ⚠️ | Backend has a `GlobalExceptionHandler` that returns structured JSON for several exception types. Frontend has centralized normalization (`src/api/apiError.ts`) used in checkout/orders/cart/register, but many other calls still use ad-hoc logging/toasts. |
| Mobile UX | P2 | ✅ | ⚠️ | ⚠️ | Responsive layout patterns exist (including safe-area handling in layouts). Checkout and Orders have minimal mobile polish (wrapping, padding, full-width buttons) but no dedicated mobile-first flow beyond minor tweaks. |
| Testing & Validation | P2 | ⚠️ | ⚠️ | ⚠️ | Frontend has Vitest unit/integration tests, including an order-flow-style test using mocked APIs. Backend has unit/service/controller tests, but `mvn test` currently fails due to Flyway SQL incompatibility with H2 for some migrations (e.g., `V11__align_schema_with_jpa_product_tables.sql`). |

---

## Cart

**What exists (code-based evidence)**
- Backend controller: `POST/GET/PUT/DELETE` under `/api/cart/{userId}` (add, update delta, merge, summary, clear).
- Frontend: `CartContext` supports guest cart persistence and signed-in syncing to backend; cart page + checkout uses context state.

**What’s missing vs a real grocery app (gaps)**
- Server-side validation on add/update (stock checks, max quantity, discontinued items).
- Binding cart operations to the authenticated user (current APIs accept arbitrary `userId`).
- A server-calculated cart totals endpoint used as the source of truth (taxes/fees/promos not modeled).

**Likely intentional v1 scope limits**
- No pricing rules engine, tax/fee modeling, or cart promotions.

## Orders

**What exists (code-based evidence)**
- Backend: `/api/orders` supports `POST` create, `GET /me`, `POST /{orderId}/cancel`, `PUT /{orderId}/status`.
- Frontend: checkout triggers order creation via `createOrder()`, navigates to `/order-success`, and there is an `/orders` list page calling `GET /api/orders/me`.
- Tests: frontend includes a fast “E2E-style” test that mocks successful order creation and asserts navigation + cart clearing.

**What’s missing vs a real grocery app (gaps)**
- Order creation currently depends on `HttpSession.getAttribute("userId")`, but no backend code sets `userId` in session during login; this is a wiring gap that can prevent real end-to-end ordering.
- No address/delivery slot, payment capture, order detail view, invoice/receipt, refunds.
- No robust lifecycle/fulfillment model beyond status/cancel.

**Likely intentional v1 scope limits**
- No delivery planning, payments, or post-order support flows.

## Inventory

**What exists (code-based evidence)**
- Backend: `ProductVariant.stock` is present; admin endpoints exist for stock read/adjust (`/api/admin/inventory/variants/{variantId}` and `/adjust`).

**What’s missing vs a real grocery app (gaps)**
- No inventory UI.
- No stock audit/history, reasons, or reconciliation.
- No per-warehouse/store stock, reservations, reorder rules, or threshold management.

**Likely intentional v1 scope limits**
- Inventory is treated as a simple integer stock field with manual adjustments.

## Products & Variants

**What exists (code-based evidence)**
- Backend (user): `/api/products` paged listing, `/api/products/grouped`, `/api/products/{id}` details, and `/api/products/{id}/recommendations`.
- Backend (admin): minimal CRUD endpoints under `/api/admin/products` for product and variant create/update/delete.
- Frontend: product listing/grid, product detail page, category browsing pages.

**What’s missing vs a real grocery app (gaps)**
- Frontend “admin” product screens do not perform admin CRUD; some code still calls user endpoints (or endpoints that don’t exist for write operations).
- No image management, SKU/barcodes, rich attributes, availability windows.

**Likely intentional v1 scope limits**
- Minimal product catalog model, no merchandising tools.

## Pricing & Discounts

**What exists (code-based evidence)**
- Backend: `ProductVariant.getPrice()` computes discounted price from `mrp` and `discountPercent`; `/api/products/discount` lists products by discount threshold.
- Order creation uses server-side variant price (does not trust the frontend cart price).

**What’s missing vs a real grocery app (gaps)**
- No coupons, tiered pricing, taxes, fees, or time-based pricing.
- Cart endpoints don’t consistently recompute totals server-side; frontend displays totals based on stored item prices.

**Likely intentional v1 scope limits**
- A single discount-per-variant model.

## Search & Categories

**What exists (code-based evidence)**
- Backend: categories controller exists at `/categories` with CRUD.
- Backend: products can be filtered/grouped by category via `/api/products/grouped?category=...`.
- Frontend: search UI exists and filters client-side; categories UI exists.

**What’s missing vs a real grocery app (gaps)**
- Backend search endpoint (query, ranking, typo tolerance, facets).
- Endpoint wiring mismatch: frontend calls `/api/categories` (because axios base URL is `/api`) but the backend controller is mounted at `/categories`.
- Category admin routes are not protected by `ROLE_ADMIN` because they are not under `/api/admin/**`.

**Likely intentional v1 scope limits**
- Search is treated as a client-side filter rather than a backend capability.

## User Session & Auth

**What exists (code-based evidence)**
- Backend: session-based login/logout (`/api/auth/login`, `/api/auth/logout`), and current user endpoint (`/api/user/me`) using Spring Security `Authentication`.
- Backend: route protection in `SecurityConfig` (admin role for `/api/admin/**`, authenticated for `/api/orders/**`).
- Frontend: `AuthContext` uses `/api/user/me`, and `ProtectedRoute` supports admin-only routing.

**What’s missing vs a real grocery app (gaps)**
- Inconsistent identity propagation: some flows rely on session attributes not set (orders), others use the Security principal.
- Authorization gaps: endpoints using userId path params (cart) are not constrained to the authenticated user.
- No password reset, email verification, account lockout, or audit trail.

**Likely intentional v1 scope limits**
- Basic session auth only; no account lifecycle features.

## Error Handling

**What exists (code-based evidence)**
- Backend: `GlobalExceptionHandler` returns JSON with `status/error/message` and order-create error `code`.
- Frontend: `src/api/apiError.ts` normalizes Axios errors and maps messages; used in checkout/orders/cart/register.

**What’s missing vs a real grocery app (gaps)**
- Frontend is not fully standardized across all API callers.
- No global error boundary or consistent empty/error state components.

**Likely intentional v1 scope limits**
- Focused, minimal handling for key flows rather than a full error UX system.

## Mobile UX

**What exists (code-based evidence)**
- Frontend responsive layout patterns exist.
- Checkout and Orders pages include small-screen tweaks (full-width buttons on mobile, padding, word-wrapping, preventing horizontal scroll).

**What’s missing vs a real grocery app (gaps)**
- No mobile-specific checkout steps (address, delivery slot) because those features aren’t present.
- No deep mobile testing across devices; improvements are CSS/layout-level only.

**Likely intentional v1 scope limits**
- “Responsive web app” only, not a dedicated mobile experience.

## Testing & Validation

**What exists (code-based evidence)**
- Frontend: Vitest + Testing Library tests for cart context, dashboard sections, buy-again card, and checkout order-flow behavior (mocked API).
- Backend: unit/service/controller tests exist; targeted service tests (e.g., `OrderCreateServiceTest`) can run.

**What’s missing vs a real grocery app (gaps)**
- No true end-to-end browser automation.
- Backend full test suite is currently blocked by database-migration compatibility issues in the H2 test profile (Flyway migration SQL not accepted by H2).

**Likely intentional v1 scope limits**
- Unit/integration coverage over full-stack E2E automation.

---

## Out of Scope for v1 (Intentional)

- Payments
- Address & delivery
- Fulfillment lifecycle
- Advanced inventory (warehouses, audits)
- Observability & monitoring
- Full E2E automation
