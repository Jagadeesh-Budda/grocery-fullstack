import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function UserRoute() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
