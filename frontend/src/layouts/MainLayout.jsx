import React from "react";
// src/layouts/MainLayout.jsx
import { Outlet } from "react-router-dom";
import HeaderBar from "./HeaderBar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderBar /> 
      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        <Outlet /> 
      </main>
    </div>
  );
}