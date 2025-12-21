import React from "react";
import categories from "./categories";
import CategoryCard from "./CategoryCard";

export default function CategoryGrid({ selectedCategory, onSelectCategory }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {categories.map((cat) => (
        <CategoryCard
          key={cat.id}
          category={cat}
          onClick={() => onSelectCategory(cat.slug)}
          isSelected={selectedCategory === cat.slug}
        />
      ))}
    </div>
  );
}
