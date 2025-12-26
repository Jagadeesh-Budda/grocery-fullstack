import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminRoute() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "ROLE_ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
