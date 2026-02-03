/**
 * IFLI Surface Container
 * Sorts and renders surfaces by relevanceScore with staggered animations.
 * Supports visual debug mode via ?debug=true query param.
 */

import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";

/**
 * Calculate animation delay based on relevanceScore and index.
 * Higher relevance = earlier animation (lower delay).
 * @param {number} relevanceScore - 0-100
 * @param {number} index - position in sorted array
 * @returns {number} delay in ms
 */
function getAnimationDelay(relevanceScore, index) {
  // Base delay per item: 60ms stagger
  const staggerDelay = index * 60;
  // Higher relevance = slightly faster (up to 50ms bonus)
  const relevanceBonus = Math.round((relevanceScore / 100) * 50);
  return Math.max(0, staggerDelay - relevanceBonus);
}

/**
 * Calculate animation duration based on relevanceScore.
 * Higher relevance = smoother (longer) animation.
 * @param {number} relevanceScore - 0-100
 * @returns {number} duration in ms
 */
function getAnimationDuration(relevanceScore) {
  // Range: 200ms (low relevance) to 350ms (high relevance)
  return 200 + Math.round((relevanceScore / 100) * 150);
}

/**
 * Debug overlay showing intentId and relevanceScore.
 * Only visible in DEV mode with ?debug=true.
 */
function DebugOverlay({ surface }) {
  return (
    <div className="absolute -top-6 left-0 right-0 flex items-center justify-between px-2 text-[10px] font-mono text-slate-400 pointer-events-none select-none">
      <span className="bg-slate-900/70 text-white px-1.5 py-0.5 rounded">
        {surface.intentId}
      </span>
      <span className="bg-emerald-600/80 text-white px-1.5 py-0.5 rounded">
        score: {surface.relevanceScore}
      </span>
    </div>
  );
}

/**
 * Individual surface wrapper with priority-based animation timing.
 */
function AnimatedSurfaceWrapper({
  surface,
  children,
  index,
  showDebug,
}) {
  const delay = getAnimationDelay(surface.relevanceScore, index);
  const duration = getAnimationDuration(surface.relevanceScore);

  return (
    <div
      className="relative"
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
        animationName: "surfaceSlideIn",
        animationFillMode: "both",
        animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {showDebug && <DebugOverlay surface={surface} />}
      {children}
    </div>
  );
}

/**
 * SurfaceContainer
 * Accepts an array of IFLI surfaces, sorts by relevanceScore (desc),
 * and renders them with staggered priority-based animations.
 *
 * @param {Object} props
 * @param {Array} props.surfaces - IFLI Surface objects
 * @param {(surface: Object) => React.ReactNode} props.renderSurface - Render function for each surface
 * @param {"bottom-center" | "bottom-right" | "top-banner"} [props.position] - Container position
 */
export default function SurfaceContainer({
  surfaces,
  renderSurface,
  position = "bottom-center",
}) {
  const location = useLocation();

  // Check for debug mode (DEV only)
  const showDebug = useMemo(() => {
    if (!import.meta.env.DEV) return false;
    const params = new URLSearchParams(location.search);
    return params.get("debug") === "true";
  }, [location.search]);

  // Sort surfaces by relevanceScore (highest first)
  const sortedSurfaces = useMemo(() => {
    return [...surfaces].sort((a, b) => b.relevanceScore - a.relevanceScore);
  }, [surfaces]);

  if (sortedSurfaces.length === 0) {
    return null;
  }

  // Position classes
  const positionClasses = {
    "bottom-center": "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
    "bottom-right": "fixed bottom-6 right-6 z-50",
    "top-banner": "fixed top-20 left-1/2 -translate-x-1/2 z-50",
  };

  return (
    <>
      {/* Inject keyframe animation (only once) */}
      <style>{`
        @keyframes surfaceSlideIn {
          0% {
            opacity: 0;
            transform: translateY(16px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div
        className={positionClasses[position] || positionClasses["bottom-center"]}
        role="complementary"
        aria-label="Intent surfaces"
      >
        <div className="flex flex-col gap-3">
          {sortedSurfaces.map((surface, index) => (
            <AnimatedSurfaceWrapper
              key={surface.id}
              surface={surface}
              index={index}
              showDebug={showDebug}
            >
              {renderSurface(surface)}
            </AnimatedSurfaceWrapper>
          ))}
        </div>

        {/* Debug summary */}
        {showDebug && (
          <div className="mt-4 p-2 rounded-lg bg-slate-900/80 text-[10px] font-mono text-slate-300">
            <div className="text-amber-400 font-bold mb-1">IFLI Debug Mode</div>
            <div>Surfaces: {sortedSurfaces.length}</div>
            <div>Intents: {sortedSurfaces.map((s) => s.intentId).join(", ")}</div>
          </div>
        )}
      </div>
    </>
  );
}
