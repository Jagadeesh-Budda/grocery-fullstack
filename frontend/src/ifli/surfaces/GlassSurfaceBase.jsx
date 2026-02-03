/**
 * IFLI Glass Surface Base Component
 * Shared glassmorphism card with slide-up/fade-in animation
 */

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

/**
 * Base glassmorphism surface with mount/unmount animations.
 * Used by AbandonedCartSurface, RunningLowSurface, etc.
 */
export default function GlassSurfaceBase({
  children,
  onDismiss,
  isExiting = false,
  ariaLabel = "Suggestion",
}) {
  const [mounted, setMounted] = useState(false);

  // Animate in on mount
  useEffect(() => {
    const timer = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  // Check reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const animationClass = prefersReducedMotion
    ? ""
    : "transition-all duration-300 ease-out";

  const visibilityClass =
    mounted && !isExiting
      ? "opacity-100 translate-y-0"
      : "opacity-0 translate-y-4";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      className={`
        relative w-[min(360px,92vw)] rounded-2xl p-5
        border border-white/40
        bg-white/70 backdrop-blur-xl
        shadow-[0_8px_32px_rgba(0,0,0,0.08)]
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

      {children}
    </div>
  );
}
