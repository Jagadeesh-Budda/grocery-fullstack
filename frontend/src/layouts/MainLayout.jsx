import React from "react";
import { Outlet } from "react-router-dom";
export default function MainLayout({ left, right }) {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-4">
      <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto">
        {/* Left: Shopping List */}
        <div className="col-span-7 bg-white rounded-2xl shadow p-4">
          {left}
        </div>

        {/* Right: Discovery */}
        <div className="col-span-5 space-y-6">
          {right}
        </div>
      </div>
    </div>
  );
}
