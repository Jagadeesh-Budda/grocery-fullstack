import React from "react";

export default function RecipeCard({ recipe }) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-2 hover:shadow-sm transition">
            <img
                src={recipe.image}
                alt={recipe.title}
                className="h-14 w-14 rounded-lg object-cover"
                onError={(e) => {
                    e.currentTarget.src =
                        "https://via.placeholder.com/56?text=Food";
                }}
            />

            <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900 leading-tight">
                    {recipe.title}
                </p>
                <p className="text-xs text-slate-500">
                    ⏱ {recipe.time}
                </p>
            </div>
        </div>
    );
}
