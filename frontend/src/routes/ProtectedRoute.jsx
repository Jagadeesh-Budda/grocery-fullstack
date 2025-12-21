import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const isAuthenticated = true; // later replace with real auth

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

