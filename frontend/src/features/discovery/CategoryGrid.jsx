
import React, { useEffect, useState } from "react";
import CategoryCard from "./CategoryCard.jsx";

const mockCategories = [
  { id: 1, name: "Vegetables" },
  { id: 2, name: "Fruits" },
  { id: 3, name: "Dairy" },
  { id: 4, name: "Grains" },
  { id: 5, name: "Beverages" },
];

export default function CategoryGrid({ onSelectCategory }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    setCategories(mockCategories);
    setLoading(false);
  }, []);

  function handleSelect(cat) {
    setSelectedId(cat?.id ?? null);
    onSelectCategory && onSelectCategory(cat);
  }

  if (loading) {
    return <div className="p-4 text-sm text-slate-600">Loading categories…</div>;
  }

  return (
    <section className="p-3">
      <h2 className="text-sm font-semibold text-slate-900 mb-3">
        Categories
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            onClick={handleSelect}
            selected={selectedId === cat.id}
          />
        ))}
      </div>
    </section>
  );
}
