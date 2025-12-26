import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";


export default function App() {
  return (
    <Routes>
      {/* Auto redirect root */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected user routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/groceries" element={<Home />} />
        {/* add more user-only routes here */}
      </Route>

      {/* Admin routes (role-based) */}
      <Route path="/admin" element={<AdminRoute title="Admin" />}>
  <Route path="" element={<AdminDashboard />} />


        {/* nested admin routes can go here, e.g. <Route path="products" element={<AdminProducts/>} /> */}
</Route>
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

