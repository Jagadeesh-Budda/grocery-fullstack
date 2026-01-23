import React, { useState } from "react";
import { useCart } from "../../context/CartContext";

export default function RecipeCard({ recipe }) {
    const { batchAdd } = useCart();
    const [isConfirming, setIsConfirming] = useState(false);
    const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3E%3Crect width='56' height='56' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='10' fill='%2394a3b8'%3EFood%3C/text%3E%3C/svg%3E";

    const handleAdd = () => {
        const items = recipe.items.map(item => ({
            variantId: item.variantId,
            variantName: item.variantName,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl || recipe.image // Fallback to recipe image
        }));
        
        batchAdd(items);
        setIsConfirming(false);
    };

    return (
        <div className="flex flex-col rounded-xl border border-slate-100 bg-white p-2 hover:shadow-sm transition">
            <div className="flex items-center gap-3">
                <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="h-14 w-14 rounded-lg object-cover"
                    onError={(e) => {
                        if (e.currentTarget.src !== fallbackImage) {
                            e.currentTarget.src = fallbackImage;
                        }
                    }}
                />

                <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 leading-tight">
                        {recipe.title}
                    </p>
                    <p className="text-xs text-slate-500">
                        ⏱ {recipe.time} • {recipe.items?.length || 0} items
                    </p>
                </div>

                {!isConfirming ? (
                    <button
                        onClick={() => setIsConfirming(true)}
                        className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 hover:bg-emerald-100"
                    >
                        Add
                    </button>
                ) : (
                    <div className="flex gap-1">
                        <button
                            onClick={handleAdd}
                            className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-700"
                        >
                            Confirm
                        </button>
                        <button
                            onClick={() => setIsConfirming(false)}
                            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200"
                        >
                            ✕
                        </button>
                    </div>
                )}
            </div>
            
            {isConfirming && (
                <div className="mt-2 border-t border-slate-50 pt-2">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Ingredients</p>
                    <ul className="space-y-0.5">
                        {recipe.items.map((item, idx) => (
                            <li key={idx} className="text-[11px] text-slate-600 flex justify-between">
                                <span>{item.variantName}</span>
                                <span className="font-medium">x{item.quantity}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
