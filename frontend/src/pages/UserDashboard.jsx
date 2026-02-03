import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useOutletContext, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { RotateCcw, CalendarDays, AlertTriangle, ShoppingBag, Grid3X3 } from "lucide-react";

import ProductGrid from "../features/products/ProductGrid";
import RecipeList from "../features/recipes/RecipeList";
import QuickActions from "../components/dashboard/QuickActions";
import ProductsSection from "../components/dashboard/ProductsSection";
import DashboardFooter from "../components/dashboard/DashboardFooter";
import { HomeDashboardView, ENABLE_HOME_DASHBOARD } from "../components/dashboard/HomeDashboardSections";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useHomeDashboard } from "../hooks/useHomeDashboard";
import { UI_LABELS } from "../ui/labels";
import {
  getHourInTimeZone,
  getStoredTimeZone,
  LOCATION_EVENT,
} from "../utils/locationTime";

const DASHBOARD_CATEGORIES = [
  "All",
  "Vegetables",
  "Fruits",
  "Grains",
  "Dairy",
  "Spices",
];

/* ═══════════════════════════════════════════════════════════════════════════
   HOME PAGE vs LANDING PAGE — Design Intent
   ═══════════════════════════════════════════════════════════════════════════
   
   This file is the HOME PAGE (UserDashboard) — NOT a marketing landing page.
   
   ┌─────────────────┬─────────────────────────────────────────────────────────┐
   │ HOME PAGE       │ LANDING PAGE (future/conceptual)                        │
   │ (this file)     │                                                         │
   ├─────────────────┼─────────────────────────────────────────────────────────┤
   │ For: Logged-in  │ For: New/anonymous visitors                             │
   │ users           │                                                         │
   ├─────────────────┼─────────────────────────────────────────────────────────┤
   │ Dashboard-first │ Emotion-first                                           │
   │ Functional,fast │ Marketing-oriented                                      │
   │ Repeat-use      │ First-impression                                        │
   ├─────────────────┼─────────────────────────────────────────────────────────┤
   │ Minimal         │ Heavy imagery allowed                                   │
   │ illustration    │ Full-page illustrations OK                              │
   ├─────────────────┼─────────────────────────────────────────────────────────┤
   │ Hero: Warm,     │ Hero: Can be dramatic,                                  │
   │ welcoming,      │ aspirational, cinematic                                 │
   │ but subtle      │                                                         │
   └─────────────────┴─────────────────────────────────────────────────────────┘
   
   DESIGN PRINCIPLE: "Emotion at the top, clarity below."
   The hero can inspire — the dashboard must perform.
   
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * DashboardHero — Enhanced glassmorphism hero for logged-in users
 * 
 * Uses .glass-hero token for warm, expressive glassmorphism:
 * - 24px blur depth for immersive feel
 * - Radial warm light gradient (sunrise effect)
 * - Inset highlight for depth
 * 
 * ❌ This is NOT a marketing hero — keep CTAs functional, not promotional
 */
function DashboardHero({ title, subtitle, onStartShopping, onBrowseCategories }) {
  return (
    <section
      className="relative isolate overflow-hidden rounded-[20px] glass-hero glass-border p-4 sm:p-6 h-[clamp(200px,28vh,280px)] sm:h-[clamp(220px,32vh,340px)] lg:h-[clamp(260px,38vh,420px)]"
      aria-label="Welcome"
    >
      {/* Subtle radial warmth overlay for depth */}
      <div 
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 110% 85% at 15% 15%, rgba(180,255,220,0.05) 0%, transparent 55%),
            radial-gradient(ellipse 120% 90% at 115% 75%, rgba(255,240,190,0.04) 0%, transparent 55%)
          `
        }}
        aria-hidden="true"
      />

      {/* Top fade mask to prevent hero brightness bleeding into navbar */}
      <div
        className="absolute inset-x-0 top-0 h-[40%] -z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 70%)",
        }}
        aria-hidden="true"
      />
      
      <div className="flex h-full items-center">
        <div className="min-w-0 max-w-2xl">
          <h1 
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white"
            style={{ 
              fontFamily: "var(--font-display)", 
              textShadow: "2px 2px 4px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.2)" 
            }}
          >
            {title}
          </h1>
          <p 
            className="mt-2 text-base sm:text-lg text-white/95 max-w-xl"
            style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.25)" }}
          >
            {subtitle}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              type="button"
              onClick={onStartShopping}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 sm:w-auto"
            >
              <ShoppingBag size={18} />
              Start shopping
            </button>
            <button
              type="button"
              onClick={onBrowseCategories}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-5 py-2.5 text-sm font-semibold text-white border border-white/30 hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 sm:w-auto"
            >
              <Grid3X3 size={18} />
              Browse categories
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function UserDashboard() {
  const { activeCategory, searchTerm = "" } = useOutletContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timeZone, setTimeZone] = useState(() => getStoredTimeZone());
  const [dashboardCategory, setDashboardCategory] = useState("All");

  // Home Dashboard API data (read-only, no transformations)
  const { data: dashboardData, isLoading: dashboardLoading } = useHomeDashboard();

  const {
    items: cartItems,
    updateItem,
  } = useCart();

  const safeCartItems = useMemo(
    () => (Array.isArray(cartItems) ? cartItems : []),
    [cartItems]
  );

  const withCartGuard = useCallback(
    (fn) => {
      if (safeCartItems.length === 0) {
        toast("Your cart is empty — add a few items first.");
        return;
      }
      fn();
    },
    [safeCartItems.length]
  );

  const handleReorder = useCallback(() => {
    withCartGuard(() => {
      let touched = 0;
      for (const item of safeCartItems) {
        const id = item?.variantId;
        const qty = Number(item?.quantity ?? 0);
        if (!id || !Number.isFinite(qty)) continue;
        updateItem(id, Math.max(1, qty + 1));
        touched += 1;
      }
      if (touched > 0) toast.success(`Reordered ${touched} item${touched === 1 ? "" : "s"}`);
    });
  }, [safeCartItems, updateItem, withCartGuard]);

  const handleAddStock = useCallback(() => {
    withCartGuard(() => {
      let touched = 0;
      for (const item of safeCartItems) {
        const id = item?.variantId;
        const qty = Number(item?.quantity ?? 0);
        if (!id || !Number.isFinite(qty)) continue;
        const next = Math.max(2, qty);
        if (next !== qty) {
          updateItem(id, next);
          touched += 1;
        }
      }
      toast.success(touched > 0 ? `Stocked up ${touched} item${touched === 1 ? "" : "s"}` : "Already stocked up");
    });
  }, [safeCartItems, updateItem, withCartGuard]);

  const handleRestockNow = useCallback(() => {
    withCartGuard(() => {
      let touched = 0;
      for (const item of safeCartItems) {
        const id = item?.variantId;
        const qty = Number(item?.quantity ?? 0);
        if (!id || !Number.isFinite(qty)) continue;
        if (qty <= 1) {
          updateItem(id, 2);
          touched += 1;
        }
      }
      toast.success(touched > 0 ? `Restocked ${touched} item${touched === 1 ? "" : "s"}` : "Nothing to restock");
    });
  }, [safeCartItems, updateItem, withCartGuard]);

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

  const heroTitle = `${getGreeting()}${user ? `, ${user.username}` : ""} 👋`;
  const heroSubtitle = getSubtitle();

  const quickActions = useMemo(
    () => [
      {
        key: "buy-again",
        title: UI_LABELS.actions.buyAgain.title,
        description: UI_LABELS.actions.buyAgain.description,
        cta: UI_LABELS.actions.buyAgain.cta,
        onClick: handleReorder,
        icon: <RotateCcw size={20} />,
        iconClassName: "bg-slate-100/80 text-slate-600",
      },
      {
        key: "monthly-stock",
        title: UI_LABELS.actions.monthlyStock.title,
        description: UI_LABELS.actions.monthlyStock.description,
        cta: UI_LABELS.actions.monthlyStock.cta,
        onClick: handleAddStock,
        icon: <CalendarDays size={20} />,
        iconClassName: "bg-emerald-100/80 text-emerald-600",
      },
      {
        key: "running-low",
        title: UI_LABELS.actions.runningLow.title,
        description: UI_LABELS.actions.runningLow.description,
        cta: UI_LABELS.actions.runningLow.cta,
        onClick: handleRestockNow,
        icon: <AlertTriangle size={20} />,
        iconClassName: "bg-amber-100/80 text-amber-600",
        rightSlot: (
          <Link
            to="/groceries/products"
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 whitespace-nowrap"
          >
            View all →
          </Link>
        ),
      },
    ],
    [handleAddStock, handleReorder, handleRestockNow]
  );

  return (
    <div className="space-y-8 dashboard-page">
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-6">
        {/* ================= LEFT + CENTER ================= */}
        <div className="flex-1 space-y-6">
          <DashboardHero
            title={heroTitle}
            subtitle={heroSubtitle}
            onStartShopping={() => navigate("/groceries/products")}
            onBrowseCategories={() => navigate("/groceries/categories")}
          />
          
          <QuickActions actions={quickActions} />

          {/* Dinner Ideas */}
          <div className="rounded-2xl bg-white/70 backdrop-blur-md ring-1 ring-white/40 shadow-sm p-4 sm:p-5">
            <RecipeList searchTerm={searchTerm} />
          </div>

          {/* Popular Near Me */}
          <div>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Popular near you</h2>
                <p className="mt-0.5 text-sm text-slate-500">Trending items in your area</p>
              </div>
              <Link
                to="/groceries/products"
                className="flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                See all →
              </Link>
            </div>

            <ProductGrid category="" searchTerm="" filterCategory="" limit={4} />
          </div>

          {/* Home Dashboard Sections (API-driven, read-only) */}
          {ENABLE_HOME_DASHBOARD && (
            <HomeDashboardView
              data={dashboardData}
              isLoading={dashboardLoading}
              onItemClick={(variantId) => navigate(`/groceries/products/${variantId}`)}
            />
          )}

          {/* Products Section: "Start here" */}
          <ProductsSection
            title="Start here"
            subtitle="Handpicked just for you"
            categories={DASHBOARD_CATEGORIES}
            activeCategory={dashboardCategory}
            onCategoryChange={setDashboardCategory}
            rightLink={{ to: "/groceries/products", label: "See all" }}
          >
            <ProductGrid
              category={activeCategory}
              searchTerm={searchTerm}
              filterCategory={activeCategory ? "" : dashboardCategory}
            />
          </ProductsSection>
        </div>

        {/* ================= RIGHT (Recipes) ================= */}
        {/* Moved below products to keep hero as a true 2-column marketing section */}
      </div>

      <DashboardFooter />

    </div>
  );
}
