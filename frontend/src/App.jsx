// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Products from './pages/Products';
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminCategories from "./pages/AdminCategories";
import Register from "./pages/Register";
import './styles/theme.css';
import './styles/cards.css';



export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 1st: User Routes (Accessible by both USER and ADMIN) */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_ADMIN']} />}>
        <Route path="/groceries" element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Route>

      {/* 2nd: Admin Routes (Strictly ROLE_ADMIN only) */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<AdminCategories />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}