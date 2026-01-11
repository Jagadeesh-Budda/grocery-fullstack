import React, { useMemo, useState } from "react";
import { Trash2, Plus, Minus, Search } from "lucide-react";

export default function ShoppingList({
  items = [],
  selectedCategory = null,
  cartTotal = "",
  totalItems = 0,
  onUpdateQuantity = () => {},
  onRemoveItem = () => {},
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
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-slate-900">Cart Summary</h3>
        <div className="flex max-w-[160px] flex-1 items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-2 py-1.5 focus-within:ring-1 focus-within:ring-grocery-primary/30">
          <Search size={14} className="text-slate-400" />
          <input
            type="text"
            className="w-full border-0 bg-transparent text-xs text-slate-900 outline-none placeholder:text-slate-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            aria-label="Search items"
          />
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {filteredItems.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm font-medium text-slate-500">
              {items.length === 0
                ? "Your cart is empty"
                : `No items found${
                    selectedCategory ? ` in ${selectedCategory}` : ""
                  }`}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 pb-2">
            {filteredItems.map((item) => {
              const quantity = Number(item.quantity || 0);

              return (
                <div 
                  className="group flex items-center gap-3 rounded-xl border border-slate-50 bg-slate-50/50 p-3 transition-colors hover:bg-slate-50" 
                  key={item.id}
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="truncate text-sm font-bold text-slate-900 leading-tight">
                      {item.name}
                    </h4>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-500">
                        {item.displayPrice}/kg
                      </span>
                      <span className="text-[10px] text-slate-300">•</span>
                      <span className="text-xs font-bold text-grocery-primary">
                        {item.itemTotal}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 rounded-lg bg-white p-1 shadow-sm border border-slate-100">
                    <button
                      className="flex h-6 w-6 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                      onClick={() =>
                        onUpdateQuantity(item.id, Math.max(0, quantity - 1))
                      }
                      aria-label="Decrease quantity"
                      type="button"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-slate-900">
                      {quantity}
                    </span>
                    <button
                      className="flex h-6 w-6 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                      onClick={() =>
                        onUpdateQuantity(item.id, quantity + 1)
                      }
                      aria-label="Increase quantity"
                      type="button"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                    onClick={() => onRemoveItem(item.id)}
                    aria-label="Remove item"
                    type="button"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Summary & Checkout */}
      {filteredItems.length > 0 && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <div className="mb-3 flex flex-col gap-2">
            <div className="flex justify-between text-xs font-medium text-slate-500 px-1">
              <span>Subtotal ({totalItems} items)</span>
              <span>{cartTotal}</span>
            </div>
            
            <div className="flex items-center justify-between rounded-xl bg-grocery-primary/5 p-4 border border-grocery-primary/10">
              <span className="text-sm font-bold text-slate-900">Total Amount</span>
              <span className="text-xl font-extrabold text-grocery-primary">
                {cartTotal}
              </span>
            </div>
          </div>

          <button 
            className="w-full rounded-xl bg-grocery-primary py-3.5 text-sm font-bold text-white shadow-md shadow-grocery-primary/20 transition-all hover:bg-grocery-primaryHover hover:shadow-lg active:scale-[0.98]"
            type="button"
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}
