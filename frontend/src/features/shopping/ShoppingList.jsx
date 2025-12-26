import React, { useMemo, useState } from "react";
import { Trash2, Plus, Minus, Search } from "lucide-react";

export default function ShoppingList({
  items = [],
  selectedCategory = null,
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

  const { totalPrice, totalItems } = useMemo(() => {
    let sum = 0;
    let count = 0;

    filteredItems.forEach((item) => {
      const price = Number(item.pricePerKg || 0);
      const qty = Number(item.quantity || 0);
      sum += price * qty;
      count += qty;
    });

    return { totalPrice: sum, totalItems: count };
  }, [filteredItems]);

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 14,
        padding: "14px",
        boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
        border: "1px solid rgba(15,23,42,0.06)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <style>
        {`
        .sl-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; gap: 10px; }
        .sl-title { font-size: 16px; font-weight: 700; margin: 0; color: #0f172a; }
        .sl-search { display: flex; align-items: center; gap: 6px; padding: 6px 8px; border-radius: 8px; background: #f9fafb; border: 1px solid rgba(15,23,42,0.06); flex: 1; max-width: 180px; }
        .sl-search input { border: 0; outline: none; background: transparent; font-size: 12px; color: #0f172a; width: 100%; }
        .sl-search input::placeholder { color: #9ca3af; }
        .sl-list { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; margin-bottom: 10px; padding-right: 2px; }
        .sl-list::-webkit-scrollbar { width: 5px; }
        .sl-list::-webkit-scrollbar-track { background: transparent; }
        .sl-list::-webkit-scrollbar-thumb { background: rgba(15,23,42,0.06); border-radius: 2px; }
        .sl-item { display: flex; align-items: center; gap: 8px; padding: 10px; background: #f9fafb; border-radius: 9px; transition: all 160ms ease; border: 1px solid rgba(15,23,42,0.03); }
        .sl-item:hover { background: #f3f4f6; }
        .sl-item-info { flex: 1; min-width: 0; }
        .sl-item-name { margin: 0; font-size: 12px; font-weight: 600; color: #0f172a; line-height: 1.3; }
        .sl-item-price { margin: 2px 0 0; font-size: 11px; color: #6b7280; }
        .sl-item-total { margin: 3px 0 0; font-size: 11px; font-weight: 700; color: #10b981; }
        .sl-qty-control { display: flex; align-items: center; gap: 5px; }
        .sl-qty-btn { background: #fff; border: 1px solid rgba(15,23,42,0.06); width: 22px; height: 22px; border-radius: 5px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 140ms ease; flex-shrink: 0; }
        .sl-qty-btn:hover { background: #ecfdf5; border-color: #10b981; transform: scale(1.05); }
        .sl-qty { font-size: 11px; font-weight: 700; color: #0f172a; min-width: 20px; text-align: center; }
        .sl-delete-btn { background: transparent; border: 0; color: #ef4444; cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center; transition: all 140ms ease; border-radius: 5px; flex-shrink: 0; }
        .sl-delete-btn:hover { background: rgba(239,68,68,0.08); }
        .sl-empty { text-align: center; color: #6b7280; font-size: 12px; padding: 30px 16px; }
        .sl-footer { border-top: 1px solid rgba(15,23,42,0.06); padding-top: 10px; }
        .sl-summary { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px; color: #6b7280; }
        .sl-summary-value { font-weight: 600; color: #0f172a; }
        .sl-total { display: flex; justify-content: space-between; align-items: center; padding: 11px; background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%); border-radius: 9px; border: 1px solid rgba(16,185,129,0.12); margin-bottom: 9px; }
        .sl-total-label { font-weight: 700; color: #065f46; font-size: 13px; }
        .sl-total-amount { font-size: 16px; font-weight: 700; color: #10b981; }
        .sl-checkout { width: 100%; padding: 10px; border-radius: 9px; background: linear-gradient(180deg, #10b981 0%, #059669 100%); color: #fff; border: 0; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 160ms cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 12px rgba(16,185,129,0.12); }
        .sl-checkout:hover { box-shadow: 0 8px 20px rgba(16,185,129,0.16); transform: translateY(-2px); }
        .sl-checkout:active { transform: translateY(0); box-shadow: 0 2px 6px rgba(16,185,129,0.1); }
      `}
      </style>

      {/* Header */}
      <div className="sl-header">
        <h3 className="sl-title">Cart Summary</h3>
        <div className="sl-search">
          <Search size={14} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            aria-label="Search items"
          />
        </div>
      </div>

      {/* Items List */}
      <div className="sl-list">
        {filteredItems.length === 0 ? (
          <div className="sl-empty">
            <p>
              {items.length === 0
                ? "Your cart is empty"
                : `No items found${
                    selectedCategory ? ` in ${selectedCategory}` : ""
                  }`}
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const pricePerKg = Number(item.pricePerKg || 0);
            const quantity = Number(item.quantity || 0);
            const itemTotal = pricePerKg * quantity;

            return (
              <div className="sl-item" key={item.id}>
                <div className="sl-item-info">
                  <h4 className="sl-item-name">{item.name}</h4>
                  <p className="sl-item-price">
                    ₹{pricePerKg.toFixed(2)} / kg
                  </p>
                  <p className="sl-item-total">
                    ₹{itemTotal.toFixed(2)}
                  </p>
                </div>

                <div className="sl-qty-control">
                  <button
                    className="sl-qty-btn"
                    onClick={() =>
                      onUpdateQuantity(item.id, Math.max(0, quantity - 1))
                    }
                    aria-label="Decrease quantity"
                    type="button"
                    title="Decrease"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="sl-qty">{quantity}</span>
                  <button
                    className="sl-qty-btn"
                    onClick={() =>
                      onUpdateQuantity(item.id, quantity + 1)
                    }
                    aria-label="Increase quantity"
                    type="button"
                    title="Increase"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <button
                  className="sl-delete-btn"
                  onClick={() => onRemoveItem(item.id)}
                  aria-label="Remove item"
                  type="button"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Summary & Checkout */}
      {filteredItems.length > 0 && (
        <div className="sl-footer">
          <div className="sl-summary">
            <span>Items:</span>
            <span className="sl-summary-value">{totalItems}</span>
          </div>

          <div className="sl-total">
            <span className="sl-total-label">Total</span>
            <span className="sl-total-amount">₹{totalPrice.toFixed(2)}</span>
          </div>

          <button className="sl-checkout" type="button">
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}
