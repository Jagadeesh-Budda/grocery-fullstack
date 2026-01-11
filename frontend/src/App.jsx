// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Products from "./pages/Products";
import MainLayout from "./layouts/user/UserLayout.jsx";
import AdminLayout from "./layouts/admin/AdminLayout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminCategories from "./pages/AdminCategories";
import Register from "./pages/Register";
import "./styles/theme.css";
import "./styles/cards.css";
import UserDashboard from "./pages/UserDashboard";
import CategoriesPage from "./pages/CategoriesPage";
import CartPage from "./pages/CartPage";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/groceries" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Public User Routes */}
            <Route path="/groceries" element={<MainLayout />}>
                <Route index element={<UserDashboard />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="cart" element={<CartPage />} />
            </Route>

            {/* Admin Routes */}
            <Route
                element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}
            >
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<Products />} />
                    <Route path="categories" element={<AdminCategories />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/groceries" replace />} />
        </Routes>
    );
}
