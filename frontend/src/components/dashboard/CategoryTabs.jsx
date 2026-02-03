import React from "react";

export default function CategoryTabs({ categories, active, onChange }) {
  return (
    <div
      aria-label="Categories"
      className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 -mx-6 px-6 sm:mx-0 sm:px-0"
    >
      {categories.map((cat) => {
        const isActive = cat === active;
        return (
          <button
            key={cat}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(cat)}
            className={
              "whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ring-1 transition-colors " +
              (isActive
                ? "bg-emerald-700 text-white ring-emerald-700"
                : "bg-white/70 text-slate-700 ring-white/50 hover:bg-white")
            }
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
