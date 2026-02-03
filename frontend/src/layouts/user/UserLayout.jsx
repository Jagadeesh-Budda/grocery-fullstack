import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Home, Users, Search, ShoppingBag } from "lucide-react";
import HeaderBar from "./HeaderBar";
import SceneryBackground from "../../components/SceneryBackground";
import { UI_LABELS } from "../../ui/labels";
import { useCart } from "../../context/CartContext";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { useIFLI } from "../../ifli";
import IFLISurfaceRenderer from "../../ifli/components/IFLISurfaceRenderer";



function DockItem({ to, label, icon: Icon, onClick, isButton = false }) {
  const base =
    "flex flex-col items-center justify-center gap-1 rounded-2xl px-4 py-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40";

  const inner = (isActive) => (
    <div
      className={
        base +
        " " +
        (isActive
          ? "text-emerald-700"
          : "text-slate-600 hover:text-emerald-700")
      }
    >
      <div
        className={
          "grid h-10 w-10 place-items-center rounded-2xl ring-1 transition-all " +
          (isActive
            ? "bg-white/40 ring-white/40 shadow-[0_10px_25px_rgba(16,185,129,0.18)]"
            : "bg-white/20 ring-white/25 hover:bg-white/30")
        }
      >
        <Icon size={20} />
      </div>
      <span className="hidden sm:block text-[11px] font-semibold tracking-tight">
        {label}
      </span>
    </div>
  );

  if (isButton) {
    return (
      <button type="button" onClick={onClick} className="contents" aria-label={label}>
        {inner(false)}
      </button>
    );
  }

  return (
    <NavLink
      to={to}
      aria-label={label}
      className={({ isActive }) => "contents"}
    >
      {({ isActive }) => inner(isActive)}
    </NavLink>
  );
}

export default function UserLayout() {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  const itemCount = items?.length ?? 0;

  // Gate IFLI so the hook doesn't get re-triggered every render
  const ifliEnabled = useMemo(() => itemCount > 0, [itemCount]);

  // Stable cart object for IFLI — changes ONLY when itemCount changes
  const stableCartForIFLI = useMemo(() => {
    if (itemCount === 0) return null;

    return {
      // Minimal, deterministic cart shape (avoids depending on full items array)
      items: Array.from({ length: itemCount }, (_, idx) => ({
        variantId: idx,
        quantity: 1,
        price: 0,
      })),
      total: 0,
      // Captured once per itemCount change; avoids per-render churn
      lastInteraction: Date.now(),
    };
  }, [itemCount]);

  const ifliInput = ifliEnabled ? stableCartForIFLI : null;

  // IFLI integration (input is stable; prevents maximum update depth loop)
  const { surfaces, dismiss } = useIFLI(ifliInput);

  // DEV: Log surfaces state changes
  useEffect(() => {
    if (import.meta.env.DEV && surfaces.length > 0) {
      console.log("[IFLI][UserLayout] Active surfaces:", surfaces);
    }
  }, [surfaces]);

  // Action handler for surface buttons
  const handleSurfaceAction = useCallback(
    (surfaceId, handler) => {
      switch (handler) {
        case "NAVIGATE_CART":
          navigate("/groceries/cart");
          dismiss(surfaceId);
          break;
        case "CLEAR_CART":
          clearCart();
          dismiss(surfaceId);
          break;
        default:
          // Unknown handler — log and dismiss
          console.warn(`[IFLI] Unhandled action: ${handler}`);
          dismiss(surfaceId);
      }
    },
    [navigate, clearCart, dismiss]
  );

  // Dock navigation items
  const dockItems = useMemo(() => [
    {
      key: "home",
      to: "/groceries",
      label: UI_LABELS.dock.home,
      icon: Home,
      isButton: false,
    },
    {
      key: "groups",
      to: "/groceries/categories",
      label: UI_LABELS.dock.groups,
      icon: Users,
      isButton: false,
    },
    {
      key: "search",
      label: UI_LABELS.dock.search,
      icon: Search,
      onClick: () => {
        const el = document.getElementById("global-search");
        if (el && typeof el.focus === "function") el.focus();
      },
      isButton: true,
    },
    {
      key: "cart",
      to: "/groceries/cart",
      label: UI_LABELS.dock.cart,
      icon: ShoppingBag,
      isButton: false,
    },
  ], []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* SVG Atmospheric Scenery Background */}
      <SceneryBackground />

      <HeaderBar
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
      />

      <main className="relative z-10 flex-1 p-6 sm:p-8 pb-[calc(10rem+env(safe-area-inset-bottom))] sm:pb-[calc(11rem+env(safe-area-inset-bottom))] bg-transparent">
        <div className="max-w-[1600px] mx-auto w-full">
          <Outlet
            context={{
              activeCategory,
              setActiveCategory,
              searchTerm,
              setSearchTerm,
            }}
          />
        </div>
      </main>

      {/* IFLI Surface Renderer — renders intent surfaces above the dock */}
      <IFLISurfaceRenderer
        surfaces={surfaces}
        onDismiss={dismiss}
        onAction={handleSurfaceAction}
      />

      {/* Floating Dock */}
      <nav
        aria-label="Primary"
        className="fixed bottom-8 left-1/2 z-[60] -translate-x-1/2 lg:hidden"
      >
        <div
          className="
            w-[min(92vw,520px)]
            sm:w-[min(86vw,520px)]
            md:w-[min(60vw,520px)]
            mx-auto
            rounded-full
            border border-white/40
            bg-white/30
            backdrop-blur-xl
            shadow-[0_22px_60px_rgba(0,0,0,0.12)]
          "
        >
          <div className="flex items-center justify-between px-3 py-2">
            {dockItems.map((item) => (
              <DockItem
                key={item.key}
                to={item.to}
                label={item.label}
                icon={item.icon}
                onClick={item.onClick}
                isButton={item.isButton}
              />
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}