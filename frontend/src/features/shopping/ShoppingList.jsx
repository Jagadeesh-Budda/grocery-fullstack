import React, { useMemo, useState } from "react";
import ShoppingItem from "./ShoppingItem";

export default function ShoppingList({
  items = [],
  selectedCategory = null,
}) {
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (!item?.name) return false;

      const matchesSearch =
        query.trim() === "" ||
        item.name.toLowerCase().includes(query.toLowerCase());

      const matchesCategory =
        !selectedCategory ||
        item.category === selectedCategory ||
        item.category?.toLowerCase() === selectedCategory?.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [items, query, selectedCategory]);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Shopping List</h3>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search items..."
          className="px-3 py-2 border rounded-md text-sm w-56"
        />
      </div>

      {/* Empty state */}
      {filteredItems.length === 0 ? (
        <p className="text-sm text-slate-500">
          No items found
          {selectedCategory ? ` in ${selectedCategory}` : ""}.
        </p>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <ShoppingItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
