import React from "react";

export default function CategoryCard({ category, onClick, selected = false }) {
  const { id, name = "Unnamed", icon = "🛒", color } = category || {};

  return (
    <button
      type="button"
      onClick={() => onClick && onClick(category)}
      aria-pressed={selected}
      className={`w-full flex items-center gap-3 p-3 rounded-lg transition
        focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-400
        ${selected ? "ring-2 ring-sky-400" : "hover:shadow-md"}
        bg-white`}
    >
      <div
        className={`flex-shrink-0 w-12 h-12 rounded-md flex items-center justify-center text-lg
          ${selected ? "ring-2 ring-sky-300" : ""}`}
        style={{ backgroundColor: color || "#f3f4f6" }}
        aria-hidden
      >
        {icon}
      </div>

      <div className="text-left">
        <div className="font-medium text-sm text-slate-900">
          {name}
        </div>
      </div>
    </button>
  );
}
