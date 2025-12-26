import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const location = useLocation();

  let user = null;
  try {
    const raw = localStorage.getItem("user");
    user = raw ? JSON.parse(raw) : null;
  } catch {
    user = null;
  }

  // ✅ simple check: user exists
  const isAuthenticated = Boolean(user);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
