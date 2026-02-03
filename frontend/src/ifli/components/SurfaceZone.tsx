/**
 * IFLI Surface Zone Component
 * Renders surfaces in designated screen zones
 */

import React, { useEffect, useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import type { Surface, ContentSlot } from "../types";

interface SurfaceZoneProps {
  surfaces: Surface[];
  zone: "bottom-right" | "top-banner" | "contextual";
  onDismiss: (surfaceId: string) => void;
  onAction: (surfaceId: string, actionHandler: string) => void;
}

/**
 * Container for surfaces in a specific zone
 */
export function SurfaceZone({
  surfaces,
  zone,
  onDismiss,
  onAction,
}: SurfaceZoneProps) {
  const zoneSurfaces = surfaces.filter((s) => s.zone === zone);

  if (zoneSurfaces.length === 0) {
    return null;
  }

  const positionClasses: Record<string, string> = {
    "bottom-right": "fixed bottom-4 right-4 z-50",
    "top-banner": "fixed top-20 left-1/2 -translate-x-1/2 z-50",
    contextual: "absolute bottom-2 right-2 z-40",
  };

  return (
    <div
      className={positionClasses[zone]}
      role="complementary"
      aria-label="Suggestions"
    >
      <div className="flex flex-col gap-2">
        {zoneSurfaces.map((surface) => (
          <SurfaceCard
            key={surface.id}
            surface={surface}
            onDismiss={() => onDismiss(surface.id)}
            onAction={(handler) => onAction(surface.id, handler)}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Individual surface card
 */
interface SurfaceCardProps {
  surface: Surface;
  onDismiss: () => void;
  onAction: (handler: string) => void;
}

function SurfaceCard({ surface, onDismiss, onAction }: SurfaceCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Fade in on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleAction = (handler: string) => {
    if (handler === "DISMISS_SURFACE") {
      onDismiss();
    } else {
      onAction(handler);
    }
  };

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const transitionClass = prefersReducedMotion
    ? ""
    : "transition-opacity duration-200 ease-out";

  return (
    <div
      className={`
        w-80 max-w-[90vw] rounded-lg border border-slate-200 
        bg-white/95 p-4 shadow-sm backdrop-blur-sm
        ${transitionClass}
        ${isVisible ? "opacity-100" : "opacity-0"}
      `}
      role="status"
      aria-live={surface.ariaLive}
    >
      {/* Dismiss button */}
      {surface.dismissable && (
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 
                     rounded"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      )}

      {/* Content slots */}
      <div className="pr-6">
        {surface.contentComponents.map((slot, i) => (
          <ContentSlotRenderer key={i} slot={slot} />
        ))}
      </div>

      {/* Actions */}
      {surface.allowedActions.length > 0 && (
        <div className="mt-3 flex items-center gap-2">
          {surface.allowedActions
            .filter((action) => action.type !== "dismiss")
            .map((action) => (
              <button
                key={action.id}
                onClick={() => handleAction(action.handler)}
                className={
                  action.type === "primary"
                    ? `rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-medium 
                       text-white hover:bg-emerald-700 focus:outline-none 
                       focus-visible:ring-2 focus-visible:ring-emerald-500/40`
                    : `rounded-full px-3 py-1.5 text-sm text-slate-600 
                       hover:bg-slate-100 focus:outline-none 
                       focus-visible:ring-2 focus-visible:ring-slate-400/40`
                }
              >
                {action.label}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

/**
 * Render individual content slots
 */
function ContentSlotRenderer({ slot }: { slot: ContentSlot }) {
  switch (slot.type) {
    case "text": {
      const variant = slot.data.variant as string | undefined;
      const body = slot.data.body as string;

      const textClasses: Record<string, string> = {
        muted: "text-sm text-slate-500",
        subtle: "text-sm text-slate-600",
        default: "text-sm text-slate-800",
      };

      return (
        <p className={textClasses[variant ?? "default"] + " mb-1"}>{body}</p>
      );
    }

    case "icon": {
      const name = slot.data.name as string;
      const color = slot.data.color as string;

      const colorClasses: Record<string, string> = {
        amber: "text-amber-500",
        red: "text-red-500",
        emerald: "text-emerald-500",
        slate: "text-slate-500",
      };

      if (name === "alert-triangle") {
        return (
          <AlertTriangle
            size={18}
            className={`${colorClasses[color] ?? "text-slate-500"} mb-1`}
          />
        );
      }

      return null;
    }

    case "product_card": {
      // Minimal product card — would integrate with existing product components
      const compact = slot.data.compact as boolean;
      return (
        <div
          className={`mt-2 rounded border border-slate-100 bg-slate-50 p-2 ${
            compact ? "text-sm" : ""
          }`}
        >
          {/* Product details would be fetched/passed via context */}
          <span className="text-slate-600">Product preview</span>
        </div>
      );
    }

    default:
      return null;
  }
}

export default SurfaceZone;
