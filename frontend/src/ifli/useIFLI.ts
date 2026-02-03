/**
 * IFLI React Hook
 * Main integration point for consuming IFLI in React components
 */

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { intentEngine } from "./IntentEngine";
import {
  detectCheckoutReady,
  detectAbandonedCart,
  detectMealtimeContext,
  detectCheckoutStarted,
  detectRunningLow,
  detectDecisionParalysis,
  detectBundleOpportunity,
  detectVelocityCheckout,
  type PurchaseHistory,
  type BrowsingContext,
  type EnrichedCart,
  type VelocityContext,
} from "./detectors";
import { generateSurfaces, compete, isSurfaceExpired } from "./SurfaceGenerator";
import { DEFAULT_IFLI_CONFIG, IFLI_ENABLED_KEY } from "./config";
import type { Surface, CartStateForIFLI, IFLIConfig } from "./types";

// DEV-only debug helper (no-op in production)
// @ts-ignore - JS module
import { initIFLIDebug } from "./debug";

interface UseIFLIOptions {
  config?: Partial<IFLIConfig>;
  /** Purchase history for running_low detection (optional) */
  purchaseHistory?: PurchaseHistory | null;
  /** Browsing context for decision_paralysis detection (optional) */
  browsingContext?: BrowsingContext | null;
  /** Enriched cart with categories for bundle_opportunity detection (optional) */
  enrichedCart?: EnrichedCart | null;
}

interface UseIFLIReturn {
  
  surfaces: Surface[];
  dismiss: (surfaceId: string) => void;
  dismissPermanently: (surfaceId: string) => void;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

/**
 * Main IFLI hook for React components
 */
export function useIFLI(
  
  cart: CartStateForIFLI | null,
  options: UseIFLIOptions = {}
): UseIFLIReturn {
  const { config = {}, purchaseHistory = null, browsingContext = null, enrichedCart = null } = options;
  const mergedConfig = useMemo(
    () => ({ ...DEFAULT_IFLI_CONFIG, ...config }),
    [config]
  );

  const [surfaces, setSurfaces] = useState<Surface[]>([]);
  const [enabled, setEnabledState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(IFLI_ENABLED_KEY);
      return stored !== null ? stored === "true" : true;
    } catch {
      return true;
    }
  });

  const location = useLocation();
  const lastInteractionRef = useRef<number>(Date.now());
  const loggedActiveIntentsRef = useRef<Set<string>>(new Set());
  
  // Track add-to-cart timestamps for velocity detection (useRef to avoid rerender loops)
  const addToCartTimestampsRef = useRef<number[]>([]);
  const prevCartItemCountRef = useRef<number>(0);

  // DEV-ONLY: Expose debug helpers on window
  useEffect(() => {
    if (import.meta.env.DEV) {
      initIFLIDebug(setSurfaces);
    }
  }, []);

  // Track cart interaction time and add-to-cart events for velocity detection
  useEffect(() => {
    
    if (cart && cart.items.length > 0) {
      lastInteractionRef.current = Date.now();
      
      // Detect new add-to-cart events by comparing item count
      const currentCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
      const prevCount = prevCartItemCountRef.current;
      
      if (currentCount > prevCount) {
        // New item(s) added — record timestamp
        const now = Date.now();
        const addedCount = currentCount - prevCount;
        
        // Add timestamps for each item added
        for (let i = 0; i < addedCount; i++) {
          addToCartTimestampsRef.current.push(now);
        }
        
        // Prune old timestamps (keep only last 60 seconds)
        const cutoff = now - 60_000;
        addToCartTimestampsRef.current = addToCartTimestampsRef.current.filter(
          (ts) => ts > cutoff
        );
      }
      
      prevCartItemCountRef.current = currentCount;
    }
  }, [cart?.items]);

  // Detect checkout navigation
  useEffect(() => {
    if (location.pathname.includes("/checkout")) {
      intentEngine.emit(detectCheckoutStarted());
    }
  }, [location.pathname]);

  // Detection loop — runs on cart/context changes
  useEffect(() => {
    if (!enabled) return;

    // Cart-based detections (only if cart exists)
    if (cart) {
      const cartWithInteraction: CartStateForIFLI = {
        ...cart,
        lastInteraction: lastInteractionRef.current,
      };

      // Checkout readiness
      const checkoutSignal = detectCheckoutReady(cartWithInteraction);
      if (checkoutSignal) {
        intentEngine.emit(checkoutSignal);
      }

      // Abandoned cart
      const abandonSignal = detectAbandonedCart(cartWithInteraction);
      if (abandonSignal) {
        intentEngine.emit(abandonSignal);
      }
    }

    // Mealtime context
    const hour = new Date().getHours();
    const mealtimeSignal = detectMealtimeContext({ hour });
    if (mealtimeSignal) {
      intentEngine.emit(mealtimeSignal);
    }

    // Running low detection (based on purchase history)
    // Only triggers on Home page (check is inside detector)
    if (purchaseHistory) {
      const runningLowResult = detectRunningLow(purchaseHistory);
      if (runningLowResult) {
        intentEngine.emit(runningLowResult.signal);
      }
    }

    // Decision paralysis detection (browsing but not deciding)
    // Requires: dwell > 60s, revisits >= 2, no add-to-cart in 90s
    if (browsingContext) {
      const paralysisResult = detectDecisionParalysis(browsingContext);
      if (paralysisResult) {
        intentEngine.emit(paralysisResult.signal);
      }
    }

    // Bundle opportunity detection (complementary products)
    // Requires: enriched cart with categories, 2+ items, missing complement
    if (enrichedCart && enrichedCart.items.length >= 2) {
      const bundleResult = detectBundleOpportunity(enrichedCart);
      if (bundleResult) {
        intentEngine.emit(bundleResult.signal);
      }
    }

    // Velocity checkout detection (fast shopper)
    // Requires: 3+ add-to-cart within 60s, cart total > $15
    if (cart && cart.items.length > 0) {
      const cartTotal = cart.total ?? cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const cartItemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
      
      const velocityContext: VelocityContext = {
        addToCartTimestamps: addToCartTimestampsRef.current,
        cartTotal,
        cartItemCount,
      };
      
      const velocityResult = detectVelocityCheckout(velocityContext);
      if (velocityResult) {
        intentEngine.emit(velocityResult.signal);
      }
    }
  }, [cart, enabled, purchaseHistory, browsingContext, enrichedCart, location.pathname]);

  // Evaluation loop — runs periodically
  useEffect(() => {
  if (!enabled) {
    
    setSurfaces([]);

    return;
  }

  const evaluate = () => {
    const intents = intentEngine.evaluate();
    const context: Record<string, unknown> = {};
    if (cart) {
      context.itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
      context.total = cart.total;
    }

    const candidates = generateSurfaces(intents, mergedConfig, context);
    const validCandidates = candidates.filter((s) => !isSurfaceExpired(s));
    const { active } = compete(validCandidates, mergedConfig);

    // Optional: only update if meaningfully different (deep equality check is expensive, so many skip this)
    setSurfaces(prev => {
      
      if (arraysAreEqual(prev, active)) return prev; // helper function – see below
      return active;
    });
  };

  evaluate(); // ← keep only on mount / when deps change meaningfully

  const interval = setInterval(evaluate, mergedConfig.evaluationIntervalMs);

  return () => {
    clearInterval(interval);
  };
}, [enabled, cart, mergedConfig]);   // ← cart & mergedConfig must be stable!

  // DEBUG-ONLY: log only when a surface is ADDED (intent becomes active).
  // Intentionally keyed by intentId (not surface.id) to avoid timer churn
  // since templates can regenerate IDs.
  useEffect(() => {
    const currentIntentIds = new Set(surfaces.map((s) => s.intentId));
    const prevIntentIds = loggedActiveIntentsRef.current;

    const newlyActive = surfaces.filter(
      (s) => !prevIntentIds.has(s.intentId)
    );

    // Log for cart intents, running_low, decision_paralysis, bundle_opportunity, and velocity_checkout
    const trackedIntents = ["checkout_ready", "cart_abandoned", "running_low", "decision_paralysis", "bundle_opportunity", "velocity_checkout"];
    const newlyActiveTracked = newlyActive.filter(
      (s) => trackedIntents.includes(s.intentId)
    );

    if (newlyActiveTracked.length > 0) {
      console.log("[IFLI][ADD_SURFACES]", {
        route: location.pathname,
        surfaces: newlyActiveTracked,
      });
    }

    loggedActiveIntentsRef.current = currentIntentIds;
  }, [surfaces, location.pathname]);

  // Expire timed surfaces
  useEffect(() => {
    if (surfaces.length === 0) return;

    const checkExpiry = () => {
      setSurfaces((current) => {
        const nextSurfaces = current.filter((surface) => !isSurfaceExpired(surface));
        console.log("[IFLI] evaluated surfaces →", nextSurfaces);
        return nextSurfaces;
      });
    };

    const interval = setInterval(checkExpiry, 1000);
    return () => clearInterval(interval);
  }, [surfaces.length]);

  // Dismiss a surface (with penalty)
  const dismiss = useCallback((surfaceId: string) => {
    
    setSurfaces((current) => {
      
      const surface = current.find((s) => s.id === surfaceId);
      
      if (surface) {
        intentEngine.dismiss(surface.intentId);
      }
      return current.filter((s) => s.id !== surfaceId);
    });
  }, []);

  // Permanently dismiss ("don't show again")
  const dismissPermanently = useCallback((surfaceId: string) => {
    setSurfaces((current) => {
      const surface = current.find((s) => s.id === surfaceId);
      if (surface) {
        intentEngine.suppressPermanently(surface.intentId);
      }
      return current.filter((s) => s.id !== surfaceId);
    });
  }, []);

  // Toggle IFLI enabled state
  const setEnabled = useCallback((value: boolean) => {
    setEnabledState(value);
    intentEngine.setEnabled(value);
    try {
      localStorage.setItem(IFLI_ENABLED_KEY, String(value));
    } catch {
      // Ignore storage errors
    }
  }, []);

  return {
    surfaces,
    dismiss,
    dismissPermanently,
    enabled,
    setEnabled,
  };
}

/**
 * Hook to emit custom signals from components
 */
export function useIFLISignal() {
  const emit = useCallback(
    (signal: Parameters<typeof intentEngine.emit>[0]) => {
      intentEngine.emit(signal);
    },
    []
  );

  return { emit };
}

function arraysAreEqual(prev: Surface[], active: Surface[]): boolean {
  if (prev.length !== active.length) return false;
  return prev.every((surface, index) => surface.id === active[index].id);
}

