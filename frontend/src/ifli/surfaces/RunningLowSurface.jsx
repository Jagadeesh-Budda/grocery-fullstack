/**
 * IFLI Running Low Surface
 * Glassmorphism floating card for running_low intent
 */

import React, { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import GlassSurfaceBase from "./GlassSurfaceBase";

/**
 * RunningLowSurface
 * @param {Object} props
 * @param {() => void} props.onDismiss
 * @param {() => void} props.onRestockNow - navigates to /groceries
 * @param {boolean} [props.isExiting]
 */
export default function RunningLowSurface({
  onDismiss,
  onRestockNow,
  isExiting = false,
}) {
  // DEV-only render log
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log("[IFLI][SURFACE_RENDERED] running_low");
    }
  }, []);

  return (
    <GlassSurfaceBase
      onDismiss={onDismiss}
      isExiting={isExiting}
      ariaLabel="Running low reminder"
    >
      {/* Icon + Copy */}
      <div className="flex items-start gap-3 pr-6">
        <div className="flex-shrink-0 grid place-items-center h-10 w-10 rounded-xl bg-amber-100/80 text-amber-600">
          <AlertTriangle size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800">
            Running low on essentials?
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            Time to restock your favorites
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={onRestockNow}
          className="
            flex-1 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white
            hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40
            transition-colors
          "
        >
          Restock now
        </button>
        <button
          onClick={onDismiss}
          className="
            rounded-full px-4 py-2 text-sm font-medium text-slate-600
            hover:bg-slate-100/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40
            transition-colors
          "
        >
          Later
        </button>
      </div>
    </GlassSurfaceBase>
  );
}
