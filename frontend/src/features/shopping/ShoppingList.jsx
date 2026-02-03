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
    <div className="flex h-full flex-col rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/30 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-shadow duration-200">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-slate-900">Cart Summary</h3>
        <div className="flex max-w-[160px] flex-1 items-center gap-2 rounded-[2rem] border border-white/30 bg-white/40 px-3 py-2 focus-within:ring-1 focus-within:ring-grocery-primary/30 transition-colors duration-200">
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
          <div className="flex flex-col gap-3 pb-2">
            {filteredItems.map((item) => {
              const quantity = Number(item.quantity || 0);

              return (
                <div 
                  className="group flex items-center gap-4 rounded-[2rem] bg-white/50 backdrop-blur-xl border border-white/30 p-5 transition-colors duration-200 hover:bg-white/60" 
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

                  <div className="flex items-center gap-1 rounded-[2rem] bg-white/50 backdrop-blur-xl p-2 border border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-shadow duration-200">
                    <button
                      className="flex h-6 w-6 items-center justify-center rounded-[2rem] text-slate-500 transition-colors duration-200 hover:bg-white/70 hover:text-slate-900"
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
                      className="flex h-6 w-6 items-center justify-center rounded-[2rem] text-slate-500 transition-colors duration-200 hover:bg-white/70 hover:text-slate-900"
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
                    className="flex h-8 w-8 items-center justify-center rounded-[2rem] text-slate-400 opacity-0 transition-all duration-200 hover:bg-red-50/60 hover:text-red-500 group-hover:opacity-100"
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
        <div className="mt-6 border-t border-white/30 pt-6">
          <div className="mb-3 flex flex-col gap-2">
            <div className="flex justify-between text-xs font-medium text-slate-500 px-1">
              <span>Subtotal ({totalItems} items)</span>
              <span>{cartTotal}</span>
            </div>
            
            <div className="flex items-center justify-between rounded-[2rem] bg-white/40 backdrop-blur-xl p-6 border border-white/30">
              <span className="text-sm font-bold text-slate-900">Total Amount</span>
              <span className="text-xl font-extrabold text-grocery-primary">
                {cartTotal}
              </span>
            </div>
          </div>

          <button 
            className="w-full rounded-[2rem] bg-grocery-primary py-4 text-sm font-bold text-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-colors duration-200 hover:bg-grocery-primaryHover active:scale-[0.98]"
            type="button"
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}
