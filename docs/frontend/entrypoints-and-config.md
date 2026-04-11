# Frontend Entrypoints and Configuration

This file explains the main startup files and build/runtime configuration for the frontend.

## `package.json`

The frontend uses Vite and React with supporting libraries such as Axios, Tailwind, and React Router.

Key scripts:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "start": "vite",
  "test": "vitest"
}
```

Why it matters:
- `dev` starts the local development server,
- `build` creates production bundles,
- `preview` serves the built output locally,
- `test` runs unit tests with Vitest.

The project also includes dependencies for React, React Router, Axios, and utility libraries like `react-hot-toast`.

## `vite.config.js`

Vite is configured to use the React plugin and proxy backend API requests to Spring Boot.

Example:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false
      },
      "/images": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false
      }
    }
  }
});
```

Why it matters:
- enables local frontend development without CORS errors,
- forwards `/api` and `/images` requests to the backend,
- keeps URL paths consistent between development and production.

## `tailwind.config.js`

Tailwind is customized with a grocery-themed palette, rounded corners, and soft shadows.

Example values:

```js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        grocery: {
          primary: "#0aad0a",
          bg: "#f0f3f2",
          card: "#ffffff"
        }
      },
      borderRadius: {
        xl2: "12px",
        xl3: "16px",
        xl4: "24px"
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
        card: "0 2px 4px rgba(0,0,0,0.02), 0 1px 0 rgba(0,0,0,0.06)"
      }
    }
  },
  plugins: [],
};
```

Why it matters:
- Tailwind scans all frontend source files for class names,
- custom colors and shadows create the app’s visual identity,
- theme extensions make the UI easier to keep consistent.

## `postcss.config.cjs`

PostCSS is configured to apply Tailwind and autoprefixer.

```js
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {}, } }
```

Why it matters:
- integrates Tailwind into the build pipeline,
- ensures CSS is compatible across browsers.

## `src/main.jsx`

This entrypoint renders the React tree and attaches it to the `root` DOM node.

Example:

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";

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

Why it matters:
- the app wiring is centralized here,
- auth and cart providers are available throughout the app,
- routing is enabled at the root of the React tree.

## `src/App.jsx`

`App.jsx` defines the route hierarchy and global UI behaviors.

Example:

```jsx
<Routes>
  <Route path="/" element={<Navigate to="/groceries" replace />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
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
  <Route path="*" element={<Navigate to="/groceries" replace />} />
</Routes>
```

Why it matters:
- route configuration maps URL paths to pages,
- protected routes keep admin workflows safe,
- global UI like `Toaster` is mounted once for notifications.
