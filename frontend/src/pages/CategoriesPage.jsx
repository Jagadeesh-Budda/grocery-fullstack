import React from "react";
import CategoryGrid from "../features/discovery/CategoryGrid";

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">All Categories</h1>
        <p className="text-sm text-[#64748b] mt-1">Browse our wide range of products by category</p>
      </header>
      
      <CategoryGrid limit={null} isHorizontal={false} />
    </div>
  );
}
