import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Products from "./pages/Products";
import MainLayout from "./layouts/user/UserLayout.jsx";
import AdminLayout from "./layouts/admin/AdminLayout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminCategories from "./pages/AdminCategories";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import CategoriesPage from "./pages/CategoriesPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import OrderSuccess from "./pages/OrderSuccess";
import OrdersPage from "./pages/OrdersPage";

import "./styles/theme.css";
import "./styles/cards.css";

export default function App() {
  return (
    <>
      {/* ✅ GLOBAL TOASTER (mount once) */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 2500,
          style: {
            fontSize: "14px",
          },
        }}
      />

      <Routes>
        <Route path="/" element={<Navigate to="/groceries" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/orders" element={<MainLayout />}>
          <Route index element={<OrdersPage />} />
        </Route>

        <Route path="/order-success" element={<MainLayout />}>
          <Route index element={<OrderSuccess />} />
        </Route>

        {/* User Routes */}
        <Route path="/groceries" element={<MainLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<AdminCategories />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/groceries" replace />} />
      </Routes>
    </>
  );
}
