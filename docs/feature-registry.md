
# Feature Registry (Single Source of Truth)

Last updated: 2026-02-03

This document tracks feature completeness across **backend (Spring Boot)** and **frontend (React/Vite)**, based strictly on what exists in the codebase.

## Legend

- Status (Backend / Frontend): ✅ implemented, ⚠️ partially implemented, ❌ missing
- Overall:
	- ✅ Completed & wired
	- ⚠️ Partially implemented
	- ❌ Missing
	- 🔗 Needs wiring

### Overall status meaning

- ✅ Completed & wired: backend + frontend are implemented and connected end-to-end.
- ⚠️ Partially implemented: key parts exist, but functionality is incomplete or has notable gaps.
- ❌ Missing: no meaningful implementation exists.
- 🔗 Needs wiring: pieces exist but are not connected (e.g., UI not calling APIs).

### Priority meaning

- P0: blocks real ordering / data correctness.
- P1: important for user trust or UX.
- P2: enhancement / nice-to-have.

---

## Feature Matrix

| Feature Domain | Priority | Owner | Backend | Frontend | Overall | Notes (factual gaps) |
|---|---:|---:|---:|---:|---:|---|
| Cart | P0 | Both | ⚠️ | ⚠️ | ⚠️ | Backend provides `/api/cart/{userId}` CRUD-ish ops but lacks stock/price validation; frontend cart sync works but uses delta hacks (e.g., remove via large negative delta) and is optimistic without rollback. |
| Orders | P0 | Both | ⚠️ | ❌ | 🔗 | Backend supports create/list/status/cancel (`/api/orders`), but frontend checkout does not call order APIs (uses alert + clears cart). |
| Buy Again | P2 | Both | ⚠️ | ⚠️ | ⚠️ | Backend exposes top-3 buy-again via home dashboard but returns only `productVariantId/orderCount/lastOrderedAt`; frontend renders placeholders and adds to cart with `price: 0` unless enriched data exists. |
| Monthly Stock | P2 | Both | ✅ | ⚠️ | 🔗 | Backend aggregates monthly usage via home dashboard; frontend renders section but uses placeholder “Product #id” and CTA button has no action wiring. |
| Low Stock | P2 | Both | ⚠️ | ⚠️ | 🔗 | Backend low-stock uses native SQL and depends on `product_masters.low_stock_threshold` (not modeled on entity) and is currently global (userId ignored); frontend renders but restock CTA is not wired. |
| Inventory | P1 | Backend | ⚠️ | ❌ | ⚠️ | Variant stock exists and is adjusted on order status transitions, but there are no explicit inventory management endpoints/UI (stock edits, thresholds management, audits). |
| Products & Variants | P1 | Backend | ⚠️ | ⚠️ | ⚠️ | Backend supports user listing, grouped listing, details with variants; admin create/update/delete routes are referenced by frontend but not implemented on backend. |
| Pricing & Discounts | P0 | Both | ✅ | ⚠️ | ⚠️ | Backend computes `price = mrp - discount%` and supports `/api/products/discount`; frontend displays pricing but several flows can carry `price: 0` (e.g., Buy Again) and no cart/order price re-validation exists. |
| Search & Categories | P1 | Both | ⚠️ | ⚠️ | ⚠️ | Categories CRUD exists; product listing supports category filtering via grouped endpoint, but there is no backend search API; frontend search is client-side over loaded pages only. |
| Recommendations | P2 | Frontend | ⚠️ | ❌ | 🔗 | Backend exposes `/api/products/{id}/recommendations` but frontend does not call/render recommendations. |
| User Session | P1 | Backend | ⚠️ | ⚠️ | ⚠️ | Backend uses session auth (`/api/auth/login`, `/api/user/me`) but role/authorization enforcement for admin endpoints is not present in request rules; frontend uses cookie-based AuthContext but ProtectedRoute does not enforce authentication (relies on backend). |
| Error Handling | P1 | Both | ⚠️ | ⚠️ | ⚠️ | Backend has a global exception handler returning structured JSON; frontend has ad-hoc toasts/alerts and no unified error boundary or consistent API error mapping. |
| Mobile UX | P2 | Frontend | ✅ | ⚠️ | ⚠️ | Frontend includes responsive layout patterns (mobile dock, safe-area padding) but no dedicated mobile checkout/order flows; backend is not mobile-specific. |
| Testing & Validation | P2 | Both | ⚠️ | ⚠️ | ⚠️ | Backend includes unit/service/repository/controller tests; frontend includes Vitest tests (dashboard sections, Buy Again card, cart context). End-to-end flows (cart→checkout→order) are not covered because order wiring is missing. |

---

## Domain Notes (implementation evidence & concrete gaps)

### Cart

- Backend endpoints: `GET /api/cart/{userId}`, `POST /api/cart/{userId}/add`, `PUT /api/cart/{userId}/update`, `POST /api/cart/{userId}/merge`, `GET /api/cart/{userId}/summary`, `DELETE /api/cart/{userId}/clear`.
- Backend gaps vs real grocery apps: no server-side stock checks on add/update; no enforcement of max quantity per item; no price re-checking or totals calculation endpoint used for checkout; no cart expiration.
- Frontend: `CartContext` supports guest cart (localStorage) + signed-in sync (axios with credentials), debounced quantity updates, and undo remove; cart page is wired to context.

### Orders

- Backend: `POST /api/orders` (returns orderId), `GET /api/orders/user/{userId}`, `PUT /api/orders/{orderId}/status`, `POST /api/orders/{orderId}/cancel`.
- Backend gaps vs real grocery apps: checkout lacks address/delivery slot/payment; order items store price from variant at time of creation but there is no cart→order server-side reconciliation step; order APIs return entity models directly.
- Frontend: checkout flow does not call `/api/orders` and does not persist orders; there is no user Orders page/route.

### Buy Again

- Backend: home dashboard provides buy-again via `HomeDashboardRepository.findTop3BuyAgain` and `HomeDashboardService.buyAgainTop3`.
- Backend gap: buy-again items do not include product/variant metadata (name, price, image, current stock) needed for a real “buy again” carousel.
- Frontend: `BuyAgainCard` can call `addToCart`, but falls back to placeholder name and `price: 0` if backend doesn’t supply richer fields.

### Monthly Stock

- Backend: monthly usage aggregation exists (`findMonthlyUsage` → `MonthlyStockDTO`).
- Frontend: section renders quantities as `monthlyUsage` and shows placeholder product label; CTA has no click handler.

### Low Stock

- Backend: low-stock uses a native SQL join and assumes `product_masters.low_stock_threshold`; service keeps `userId` but ignores it.
- Frontend: section renders stock value and placeholder product label; CTA has no click handler.

### Inventory

- Backend: `ProductVariant.stock` exists and is reduced/restored on order status changes (CONFIRMED triggers reduction).
- Missing: explicit inventory endpoints (set stock, adjust stock, set thresholds), audit/history, and per-store/warehouse modeling.
- Frontend: no inventory management screens.

### Products & Variants

- Backend: product listing (`/api/products`), grouped listing (`/api/products/grouped` with category filter), detail (`/api/products/{id}`), discount listing (`/api/products/discount`).
- Backend missing for admin: product create/update/delete endpoints referenced by frontend (`POST/PUT/DELETE /products...`) are not implemented in controllers.
- Frontend: product grid + product detail are implemented; “Add to Cart” from product card navigates to detail rather than adding directly.

### Pricing & Discounts

- Backend: `ProductVariant.getPrice()` derives discounted price from `mrp` and `discountPercent`.
- Frontend: price rendering utilities exist; discount-specific browsing UI is not evident (no route invoking `/api/products/discount`).

### Search & Categories

- Backend: categories available at `/categories` with create/update/delete; grouped products filter by category name.
- Missing: backend search endpoint (query by product name/keywords); any “typeahead” or relevance ranking.
- Frontend: search bar drives client-side filtering in grids over already-fetched pages only.

### Recommendations

- Backend: `/api/products/{id}/recommendations` returns up to 5 items from same category excluding items in cart (when `userId` provided).
- Frontend: no UI/API usage for recommendations.

### User Session

- Backend: session-based auth endpoints (`/api/auth/register|login|logout`) and `/api/user/me` exist.
- Backend gap: request authorization rules do not enforce admin role for `/api/admin/**` routes.
- Frontend: AuthContext uses cookie session and `/user/me`; a separate `authServices.ts` uses localStorage token pattern (inconsistent with session auth).

### Error Handling

- Backend: `GlobalExceptionHandler` returns structured error response for common exception types.
- Frontend: mixed patterns (toast/console/alert), and no consistent surfacing of API error payload fields.

### Mobile UX

- Frontend: mobile dock navigation and safe-area padding exist in user layout; many views use responsive Tailwind styles.
- Missing: mobile-first checkout/order confirmation screens tied to real order placement.

### Testing & Validation

- Backend: tests exist for repository/service/controller layers (cart, orders, home dashboard, pricing).
- Frontend: Vitest tests cover dashboard section rendering and buy-again confirmation flow, plus cart context tests.
- Missing: integrated tests covering end-to-end purchase flow because orders are not wired from UI.

