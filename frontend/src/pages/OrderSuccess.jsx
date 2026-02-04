import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="rounded-2xl border border-emerald-100 bg-white/70 backdrop-blur p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-emerald-800">Order placed</h1>
        <p className="mt-1 text-slate-600">
          Thanks for your purchase. Your order is being processed.
        </p>

        {order ? (
          <div className="mt-5 grid gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Order ID</span>
              <span className="font-semibold text-slate-900">{String(order.orderId)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Status</span>
              <span className="font-semibold text-slate-900">{String(order.status)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Total</span>
              <span className="font-semibold text-slate-900">
                ₹{Number(order.totalAmount ?? 0).toFixed(2)}
              </span>
            </div>
          </div>
        ) : (
          <p className="mt-5 text-sm text-slate-600">
            Order details aren’t available on this screen.
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/groceries", { replace: true })}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-white font-semibold hover:bg-emerald-700"
          >
            Continue shopping
          </button>
          <button
            type="button"
            onClick={() => navigate("/groceries/cart")}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-800 font-semibold hover:bg-slate-50"
          >
            View cart
          </button>
        </div>
      </div>
    </div>
  );
}
