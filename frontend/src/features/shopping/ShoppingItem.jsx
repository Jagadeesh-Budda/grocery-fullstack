import React from "react";
import { useState } from "react";
import QuantityControl from "./QuantityControl.jsx";

export default function ShoppingItem({ item, onDelete, onUpdate }) {
  const [updating, setUpdating] = useState(false);

  async function handleQuantityChange(qty) {
    setUpdating(true);
    try {
      await onUpdate({ ...item, quantity: qty });
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="bg-white rounded-lg p-3 shadow-sm flex gap-3">
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-medium text-sm text-slate-900">
              {item.name}
            </div>

            {item.note && (
              <div className="text-xs text-slate-500">
                {item.note}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onDelete(item.id)}
            disabled={updating}
            className="text-xs text-red-500 hover:underline disabled:opacity-50"
          >
            Delete
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <QuantityControl
            quantity={item.quantity ?? 0}
            onChange={handleQuantityChange}
            disabled={updating}
          />

          {item.categoryName && (
            <div className="text-xs text-slate-500">
              {item.categoryName}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
