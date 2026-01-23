import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import ProductGrid from "../features/products/ProductGrid";
import ShoppingCart from "../components/ShoppingCart";
import RecipeList from "../features/recipes/RecipeList";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function UserDashboard() {
  const navigate = useNavigate();
  const { activeCategory } = useOutletContext();
  const { user } = useAuth();

  const {
    items: cartItems,
    updateItem,
  } = useCart();

  const increment = (id) => {
    const item = cartItems.find(i => i.variantId === id);
    if (item) updateItem(id, item.quantity + 1);
  };

  const decrement = (id) => {
    const item = cartItems.find(i => i.variantId === id);
    if (item && item.quantity > 1) updateItem(id, item.quantity - 1);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 22) return "Good Evening";
    return "Hello";
  };

  return (
      <div className="flex gap-6">
        {/* ================= LEFT + CENTER ================= */}
        <div className="flex-1 space-y-8">
          {/* Greeting */}
          <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-emerald-100 p-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {getGreeting()}{user ? `, ${user.username}` : ""} 👋
            </h1>
            <p className="text-sm text-gray-600">
              {user ? "Time for breakfast? Here's what's running low!" : "Welcome! Discover our fresh collection."}
            </p>
          </div>

          {/* Usage cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-blue-50 p-4">
              <p className="text-xs font-semibold text-blue-600">BUY AGAIN</p>
              <p className="text-sm text-gray-700">
                Add if you ran out this week
              </p>
              <button
                  type="button"
                  onClick={() => navigate("/products?filter=buy-again")}
                  className="mt-3 w-full rounded-lg bg-emerald-500 py-2 text-sm font-semibold text-white"
              >
                Add to Cart
              </button>
            </div>

            <div className="rounded-xl bg-green-50 p-4">
              <p className="text-xs font-semibold text-green-600">
                MONTHLY STOCK
              </p>
              <p className="text-sm text-gray-700">
                Last buy stock lasts ~5 days
              </p>
              <button
                  type="button"
                  onClick={() => navigate("/products?filter=monthly")}
                  className="mt-3 w-full rounded-lg bg-emerald-500 py-2 text-sm font-semibold text-white"
              >
                Add to Cart
              </button>
            </div>

            <div className="rounded-xl bg-red-50 p-4">
              <p className="text-xs font-semibold text-red-600">
                RUNNING LOW
              </p>
              <p className="text-sm text-gray-700">
                Only 1 left
              </p>
              <button
                  type="button"
                  onClick={() => navigate("/products?filter=running-low")}
                  className="mt-3 w-full rounded-lg bg-emerald-500 py-2 text-sm font-semibold text-white"
              >
                Restock
              </button>
            </div>
          </div>

         
          {/* Products */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {activeCategory ? `Category: ${activeCategory}` : "Popular near you"}
            </h2>
            <ProductGrid category={activeCategory} />
          </div>
        </div>

        {/* ================= RIGHT SIDEBAR ================= */}
        <aside className="hidden w-[320px] shrink-0 xl:block">
          <div className="sticky top-24 space-y-4">
            {/* Cart */}
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-gray-800">
                Your Cart
              </h3>

              <ShoppingCart
                  items={cartItems}
                  onIncrease={increment}
                  onDecrease={decrement}
              />

              <button
                  type="button"
                  onClick={() => navigate("/checkout")}
                  className="mt-4 w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white"
              >
                Checkout
              </button>
            </div>

            {/* 🔥 RECIPES (NEW) */}
            <RecipeList />
          </div>
        </aside>
      </div>
  );
}
