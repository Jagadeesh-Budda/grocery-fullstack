// src/routes/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles }) {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Check if logged in
  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if role is authorized
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If Admin tries to enter user area or vice-versa, redirect them to their rightful home
    return <Navigate to={user.role === 'ROLE_ADMIN' ? "/admin" : "/groceries"} replace />;
  }

  return <Outlet />;
}