import React from "react";

export default function QuantityControl({
  quantity = 0,
  onChange,
  disabled = false,
}) {
  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, quantity - 1))}
        disabled={disabled || quantity === 0}
        className="w-8 h-8 rounded-md bg-white border border-slate-200 text-slate-700 flex items-center justify-center disabled:opacity-50"
        aria-label="Decrease quantity"
      >
        −
      </button>

      <div className="px-3 text-sm font-medium min-w-[1.5rem] text-center">
        {quantity}
      </div>

      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        disabled={disabled}
        className="w-8 h-8 rounded-md bg-white border border-slate-200 text-slate-700 flex items-center justify-center disabled:opacity-50"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
