import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  // ⏳ While auth state is being resolved (or unknown)
  if (loading) {
    return null; // or a spinner if you want
  }

  // ⚠️ DO NOT block just because user is null
  // Backend session is the source of truth

  // If role is known, enforce role-based routing
  if (user && allowedRoles && !allowedRoles.includes(user.role)) {
    return (
        <Navigate
            to={user.role === "ROLE_ADMIN" ? "/admin" : "/groceries"}
            replace
        />
    );
  }

  // ✅ Allow route, backend APIs will enforce auth
  return <Outlet />;
}
