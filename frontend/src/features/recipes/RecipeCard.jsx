import React, { useState } from "react";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";

export default function RecipeCard({ recipe }) {
    const { batchAdd } = useCart();
    const [isConfirming, setIsConfirming] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3E%3Crect width='56' height='56' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='10' fill='%2394a3b8'%3EFood%3C/text%3E%3C/svg%3E";

    const handleAdd = async () => {
        if (isAdding) return;
        setIsAdding(true);

        try {
            const recipeItems = Array.isArray(recipe?.items) ? recipe.items : [];

            const availableItems = recipeItems.filter(
                (item) => item && item.available !== false
            );

            if (availableItems.length === 0) {
                toast.error("This recipe is currently unavailable");
                return;
            }

            const itemsToAdd = availableItems.map((item) => ({
                variantId: item.variantId,
                variantName: item.variantName,
                price: item.price,
                quantity: item.quantity,
                imageUrl: item.imageUrl || recipe?.image,
            }));

            if (typeof batchAdd !== "function") {
                toast.error("Something went wrong. Please try again");
                return;
            }

            await Promise.resolve(batchAdd(itemsToAdd));
            const count = itemsToAdd.length;
            toast.success(`${count} ${count === 1 ? "item" : "items"} added to cart`);
        } catch (e) {
            console.error(e);
            toast.error("Something went wrong. Please try again");
        } finally {
            setIsConfirming(false);
            setIsAdding(false);
        }
    };

    return (
        <div className="flex flex-col rounded-xl border border-slate-100 bg-white p-2 hover:shadow-sm transition">
            <div className="flex items-center gap-3">
                <img
                    src={recipe.image || fallbackImage}
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
                            disabled={isAdding}
                            className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
                        >
                            {isAdding ? "Adding..." : "Confirm"}
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
                        {(Array.isArray(recipe?.items) ? recipe.items : []).map((item, idx) => {
                            const unavailable = item?.available === false;
                            return (
                                <li
                                    key={item.variantId}
                                    className={
                                        "text-[11px] flex justify-between " +
                                        (unavailable
                                            ? "text-slate-400 line-through"
                                            : "text-slate-600")
                                    }
                                >
                                    <span>{item?.variantName || "Item"}</span>
                                    <span className="font-medium">x{item?.quantity ?? 1}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
