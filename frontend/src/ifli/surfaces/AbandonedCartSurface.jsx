/**
 * IFLI Abandoned Cart Surface
 * Glassmorphism floating card for abandoned cart intent
 * Features: product preview, "Continue where you left off" CTA
 */

import React, { useEffect, useState } from "react";
import { ShoppingCart, Package, ArrowRight, X } from "lucide-react";

/**
 * Product preview thumbnail component
 */
function ProductPreview({ products }) {
  if (!products || products.length === 0) return null;

  // Show up to 3 product thumbnails
  const visibleProducts = products.slice(0, 3);
  const remainingCount = Math.max(0, products.length - 3);

  return (
    <div className="flex items-center gap-1.5 mt-3">
      {visibleProducts.map((product, idx) => (
        <div
          key={product.id || idx}
          className="
            h-10 w-10 rounded-lg border border-white/60
            bg-white/50 backdrop-blur-sm
            flex items-center justify-center
            overflow-hidden
          "
        >
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name || "Product"}
              className="h-full w-full object-cover"
            />
          ) : (
            <Package size={16} className="text-slate-400" />
          )}
        </div>
      ))}
      {remainingCount > 0 && (
        <div className="h-10 w-10 rounded-lg bg-slate-100/80 flex items-center justify-center">
          <span className="text-xs font-medium text-slate-600">+{remainingCount}</span>
        </div>
      )}
    </div>
  );
}

/**
 * AbandonedCartSurface
 * @param {Object} props
 * @param {{ items: Array<{ quantity: number; price: number; name?: string; imageUrl?: string }>, total: number }} props.cart
 * @param {() => void} props.onDismiss
 * @param {() => void} props.onContinue - Navigate to cart / continue shopping
 * @param {boolean} [props.isExiting]
 */
export default function AbandonedCartSurface({
  cart,
  onDismiss,
  onContinue,
  isExiting = false,
}) {
  const [mounted, setMounted] = useState(false);

  // Animate in on mount
  useEffect(() => {
    const timer = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  // DEV-only render log
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log("[IFLI][SURFACE_RENDERED] abandoned_cart", { cart });
    }
  }, [cart]);

  const itemCount = cart?.items?.reduce((sum, i) => sum + (i.quantity || 1), 0) ?? 0;
  const total = cart?.total ?? 0;

  // Check reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const animationClass = prefersReducedMotion
    ? ""
    : "transition-all duration-300 ease-out";

  const visibilityClass =
    mounted && !isExiting
      ? "opacity-100 translate-y-0 scale-100"
      : "opacity-0 translate-y-4 scale-95";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Abandoned cart reminder"
      className={`
        relative w-[min(380px,92vw)] rounded-2xl p-5
        border border-white/50
        bg-white/70 backdrop-blur-xl
        shadow-[0_8px_40px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset]
        ${animationClass}
        ${visibilityClass}
      `}
    >
      {/* Dismiss button */}
      <button
        onClick={onDismiss}
        className="
          absolute top-3 right-3 p-1.5 rounded-full
          text-slate-400 hover:text-slate-600 hover:bg-slate-100/60
          focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40
          transition-colors
        "
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>

      {/* Icon + Header */}
      <div className="flex items-start gap-3 pr-6">
        <div className="flex-shrink-0 grid place-items-center h-11 w-11 rounded-xl bg-amber-100/80 text-amber-600 shadow-sm">
          <ShoppingCart size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-800">
            Continue where you left off
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            {itemCount} item{itemCount !== 1 ? "s" : ""} waiting
            {total > 0 && ` · $${total.toFixed(2)}`}
          </p>
        </div>
      </div>

      {/* Product Preview Thumbnails */}
      <ProductPreview products={cart?.items} />

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={onContinue}
          className="
            flex-1 inline-flex items-center justify-center gap-2
            rounded-full bg-emerald-600 px-5 py-2.5 
            text-sm font-semibold text-white
            shadow-sm shadow-emerald-600/20
            hover:bg-emerald-700 hover:shadow-md hover:shadow-emerald-600/25
            focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40
            transition-all duration-200
          "
        >
          View cart
          <ArrowRight size={16} />
        </button>
        <button
          onClick={onDismiss}
          className="
            rounded-full px-4 py-2.5 text-sm font-medium text-slate-600
            hover:bg-slate-100/70 
            focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40
            transition-colors
          "
        >
          Later
        </button>
      </div>
    </div>
  );
}

