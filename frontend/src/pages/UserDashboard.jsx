import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import ProductGrid from "../features/products/ProductGrid";
import ShoppingCart from "../components/ShoppingCart";
import RecipeList from "../features/recipes/RecipeList";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import {
  getHourInTimeZone,
  getStoredTimeZone,
  LOCATION_EVENT,
} from "../utils/locationTime";

export default function UserDashboard() {
  const navigate = useNavigate();
  const { activeCategory, searchTerm = "" } = useOutletContext();
  const { user } = useAuth();
  const [timeZone, setTimeZone] = useState(() => getStoredTimeZone());

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

  useEffect(() => {
    const handler = () => setTimeZone(getStoredTimeZone());
    window.addEventListener(LOCATION_EVENT, handler);
    return () => window.removeEventListener(LOCATION_EVENT, handler);
  }, []);

  const getGreeting = () => {
    const hour = getHourInTimeZone(timeZone);
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 22) return "Good Evening";
    return "Hello";
  };

  const getMealTime = () => {
    const hour = getHourInTimeZone(timeZone);
    if (hour >= 5 && hour < 11) return "breakfast";
    if (hour >= 11 && hour < 15) return "lunch";
    if (hour >= 15 && hour < 18) return "snacks";
    return "dinner";
  };

  const getSubtitle = () => {
    const mealTime = getMealTime();
    if (!user) return "Welcome! Discover our fresh collection.";

    if (mealTime === "breakfast") {
      return "Time for breakfast? Here's what's running low!";
    }
    if (mealTime === "lunch") {
      return "Lunch time! Here's what you'll need.";
    }
    if (mealTime === "dinner") {
      return "Dinner plans? Check what's running low.";
    }
    return "Snack time! Here's what's running low.";
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
              {getSubtitle()}
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
            <ProductGrid category={activeCategory} searchTerm={searchTerm} />
          </div>
        </div>

        {/* ================= RIGHT SIDEBAR ================= */}
        
          
            {/* 🔥 RECIPES (NEW) */}
            <RecipeList searchTerm={searchTerm} />
          </div>
        
      
  );
}
