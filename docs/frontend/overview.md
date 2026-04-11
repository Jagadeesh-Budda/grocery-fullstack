# Frontend Overview

The frontend lives in the `frontend/` folder and is a React application built with Vite. It is designed to serve both shopper and admin experiences using a shared design system and API integration layer.

## Purpose

The frontend provides:
- a product discovery and shopping experience for customers,
- cart management, checkout, and order history,
- admin dashboards for product, category, inventory, and order management.

It communicates with the Spring Boot backend through REST APIs and supports session-based auth using cookies.

## Core technologies

- **React** for UI composition.
- **React Router v6** for client-side routing.
- **Vite** for fast development and build.
- **Tailwind CSS** for utility-first styling.
- **Axios** for HTTP requests with session credentials.
- **React Context** for auth and cart state.

## Main structure

- `frontend/src/main.jsx` — bootstraps the React app, wraps providers, and mounts the root component.
- `frontend/src/App.jsx` — defines routes, public vs admin sections, and shared global UI like toast notifications.
- `frontend/src/pages/` — page-level screens such as `Home`, `CartPage`, `CheckoutPage`, and admin pages.
- `frontend/src/components/` — reusable UI pieces like `Card`, `Button`, and `ProductPrice`.
- `frontend/src/common/` — shared UI elements used across screens.
- `frontend/src/context/` — global state providers for auth and cart behavior.
- `frontend/src/api/` — Axios configuration, API endpoints, and error normalization.
- `frontend/src/services/` — higher-level service helpers and voice command parsing.
- `frontend/src/layouts/` — layout shells for user and admin experiences.
- `frontend/src/styles/` — theme and page-specific CSS.

## Example entrypoint

In `src/main.jsx`, the app is wrapped with `BrowserRouter`, `AuthProvider`, and `CartProvider`:

```jsx
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

## Example route structure

`src/App.jsx` defines user and admin routes. Admin routes are wrapped by `ProtectedRoute` and `AdminLayout`, while user pages use `MainLayout`:

```jsx
<Route path="/groceries" element={<MainLayout />}>
  <Route index element={<UserDashboard />} />
  <Route path="categories" element={<CategoriesPage />} />
  <Route path="cart" element={<CartPage />} />
  <Route path="checkout" element={<CheckoutPage />} />
  <Route path="products/:id" element={<ProductDetailPage />} />
</Route>

<Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<AdminDashboard />} />
    <Route path="products" element={<AdminProducts />} />
    <Route path="products/new" element={<AdminProductEdit />} />
    <Route path="products/:id" element={<AdminProductEdit />} />
    <Route path="products/:id/variants" element={<AdminProductVariants />} />
    <Route path="categories" element={<AdminCategories />} />
    <Route path="inventory" element={<AdminInventory />} />
    <Route path="orders" element={<AdminOrders />} />
    <Route path="orders/:id" element={<AdminOrderDetail />} />
  </Route>
</Route>
```

## Why this structure works

- It keeps the UI layer focused on pages and presentation,
- shared state is centralized in React Context providers,
- API logic is isolated from components,
- routes and layouts cleanly separate public user flows from admin workflows.
