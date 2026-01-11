import React from "react";
import { useNavigate } from "react-router-dom";

import ProductGrid from "../features/products/ProductGrid";
import ShoppingCart from "../components/ShoppingCart";
import RecipeList from "../features/recipes/RecipeList";
import { useCart } from "../context/CartContext";

export default function UserDashboard() {
  const navigate = useNavigate();

  const {
    cartItems,
    increment,
    decrement,
  } = useCart();

  return (
      <div className="flex gap-6">
        {/* ================= LEFT + CENTER ================= */}
        <div className="flex-1 space-y-8">
          {/* Greeting */}
          <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-emerald-100 p-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Good evening, Arjun 👋
            </h1>
            <p className="text-sm text-gray-600">
              Time for breakfast? Here's what's running low!
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

          {/* Categories */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Categories
              </h2>
              <button
                  type="button"
                  onClick={() => navigate("/categories")}
                  className="text-sm font-medium text-emerald-600"
              >
                See all →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
              {[
                "Vegetables",
                "Fruits",
                "Dairy",
                "Grains & Pasta",
                "Meat & Poultry",
                "Seafood",
                "Eggs",
                "Beverages",
              ].map((cat) => (
                  <div
                      key={cat}
                      onClick={() => navigate(`/products?category=${cat}`)}
                      className="cursor-pointer rounded-xl bg-white p-4 text-center shadow-sm hover:shadow-md"
                  >
                    <p className="text-sm font-medium text-gray-800">
                      {cat}
                    </p>
                  </div>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Popular near you
            </h2>
            <ProductGrid />
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
