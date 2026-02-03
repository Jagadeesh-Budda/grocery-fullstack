/**
 * IFLI Debug Utilities
 * DEV-ONLY helpers for testing IFLI surfaces without waiting for timers.
 *
 * Usage (in browser console when DEV):
 *   window.__IFLI_DEBUG.triggerAbandonedCart()
 *   window.__IFLI_DEBUG.triggerRunningLow()
 *   window.__IFLI_DEBUG.triggerRunningLow({ daysOverdue: 5 }) // urgent
 */

/**
 * Create a synthetic abandoned_cart surface for immediate testing.
 * Includes product preview data for visual testing.
 * @returns {import('../types').Surface}
 */
export function createSyntheticAbandonedCartSurface() {
  return {
    id: `srf_abandoned_debug_${Date.now()}`,
    intentId: "cart_abandoned",
    priority: 2,
    lifespan: { type: "manual" },
    relevanceScore: 100,
    allowedActions: [
      {
        id: "resume",
        label: "View cart",
        type: "primary",
        handler: "NAVIGATE_CART",
      },
      {
        id: "dismiss",
        label: "Later",
        type: "dismiss",
        handler: "DISMISS_SURFACE",
      },
    ],
    motionBehavior: "fade",
    contentComponents: [
      { type: "text", data: { body: "Continue where you left off" } },
      { type: "text", data: { body: "3 items waiting · $24.99", variant: "muted" } },
    ],
    // Include cart data for product preview
    payload: {
      cart: {
        items: [
          { id: 1, name: "Organic Apples", quantity: 2, price: 4.99, imageUrl: "" },
          { id: 2, name: "Fresh Milk", quantity: 1, price: 3.49, imageUrl: "" },
          { id: 3, name: "Whole Grain Bread", quantity: 1, price: 2.99, imageUrl: "" },
        ],
        total: 24.99,
      },
    },
    placement: "zone",
    zone: "bottom-right",
    ariaLive: "polite",
    dismissable: true,
    createdAt: Date.now(),
  };
}

/**
 * Create a synthetic running_low surface with realistic purchase pattern data.
 * @param {Object} options - Optional overrides
 * @param {number} [options.daysOverdue=3] - Days overdue (affects urgency)
 * @param {string} [options.productName] - Product name
 * @param {number} [options.avgInterval=7] - Average purchase interval in days
 * @returns {import('../types').Surface}
 */
export function createSyntheticRunningLowSurface(options = {}) {
  const {
    daysOverdue = 3,
    productName = "Organic Whole Milk",
    avgInterval = 7,
    price = 4.99,
    imageUrl = "",
  } = options;

  const daysSincePurchase = avgInterval + daysOverdue;
  
  // Generate dynamic reason text (same logic as detector)
  let reasonText;
  if (daysOverdue > 0) {
    reasonText = `You usually buy this every ${avgInterval} days — it's been ${daysSincePurchase}`;
  } else if (daysOverdue === 0) {
    reasonText = `You usually buy this every ${avgInterval} days — today's the day!`;
  } else {
    reasonText = `You usually buy this every ${avgInterval} days — due in ${Math.abs(daysOverdue)} day${Math.abs(daysOverdue) > 1 ? 's' : ''}`;
  }

  // Priority based on urgency
  let priority = 3;
  if (daysOverdue >= 3) priority = 1;
  else if (daysOverdue >= 1) priority = 2;

  // Relevance score (higher when more overdue)
  let relevanceScore = 60;
  if (daysOverdue > 0) {
    relevanceScore += Math.min(daysOverdue * 5, 35);
  }
  relevanceScore = Math.min(relevanceScore, 100);

  return {
    id: `srf_running_low_debug_${Date.now()}`,
    intentId: "running_low",
    priority,
    lifespan: { type: "manual" },
    relevanceScore,
    allowedActions: [
      {
        id: "quick_add",
        label: "Quick Add",
        type: "primary",
        handler: "QUICK_ADD_TO_CART",
      },
      {
        id: "dismiss",
        label: "Not now",
        type: "dismiss",
        handler: "DISMISS_SURFACE",
      },
    ],
    motionBehavior: "fade",
    contentComponents: [
      { type: "text", data: { body: productName, variant: "title" } },
      { type: "text", data: { body: reasonText, variant: "reason" } },
    ],
    // Payload for UI rendering
    payload: {
      productId: "debug-product-1",
      variantId: "variant-1",
      productName,
      imageUrl,
      price,
      reasonText,
      daysOverdue,
      avgInterval,
      daysSincePurchase,
    },
    placement: "zone",
    zone: "bottom-right",
    ariaLive: "polite",
    dismissable: true,
    createdAt: Date.now(),
  };
}

/**
 * Create a synthetic decision_paralysis surface for immediate testing.
 * @param {Object} options - Optional overrides
 * @param {number} [options.dwellSeconds=90] - Seconds spent browsing
 * @param {number} [options.revisitCount=3] - Number of products revisited
 * @returns {import('../types').Surface}
 */
export function createSyntheticDecisionParalysisSurface(options = {}) {
  const {
    dwellSeconds = 90,
    revisitCount = 3,
    revisitedProducts = ["prod-1", "prod-2", "prod-3"],
  } = options;

  // Calculate confidence: base 55 + (5 × revisit count) + (dwell_seconds / 30)
  const confidence = Math.min(
    100,
    55 + (5 * revisitCount) + Math.floor(dwellSeconds / 30)
  );

  return {
    id: `srf_decision_paralysis_debug_${Date.now()}`,
    intentId: "decision_paralysis",
    priority: 2,
    lifespan: { type: "manual" },
    relevanceScore: confidence,
    allowedActions: [
      {
        id: "compare",
        label: "Compare top picks",
        type: "primary",
        handler: "COMPARE_PRODUCTS",
      },
      {
        id: "dismiss",
        label: "I'm just browsing",
        type: "dismiss",
        handler: "DISMISS_SURFACE",
      },
    ],
    motionBehavior: "fade",
    contentComponents: [
      { type: "text", data: { body: "Having trouble deciding?" } },
      { 
        type: "text", 
        data: { 
          body: `You've been looking for ${Math.floor(dwellSeconds / 60)}+ min`, 
          variant: "muted" 
        } 
      },
    ],
    payload: {
      dwellSeconds,
      revisitCount,
      revisitedProducts,
      confidence,
    },
    placement: "zone",
    zone: "bottom-right",
    ariaLive: "polite",
    dismissable: true,
    createdAt: Date.now(),
  };
}

/**
 * Create a synthetic bundle_opportunity surface for immediate testing.
 * @param {Object} options - Optional overrides
 * @param {string} [options.contextName="pasta"] - Meal/context name
 * @param {string} [options.suggestedProduct="Parmesan Cheese"] - Product to suggest
 * @returns {import('../types').Surface}
 */
export function createSyntheticBundleOpportunitySurface(options = {}) {
  const {
    contextName = "pasta",
    suggestedProduct = "Parmesan Cheese",
    triggerItems = [
      { name: "Spaghetti", category: "pasta" },
      { name: "Marinara Sauce", category: "sauce" },
    ],
  } = options;

  // Confidence = 50 + (10 × match strength), assume strength 5
  const confidence = 100; // Max for debug

  return {
    id: `srf_bundle_debug_${Date.now()}`,
    intentId: "bundle_opportunity",
    priority: 2,
    lifespan: { type: "manual" },
    relevanceScore: confidence,
    allowedActions: [
      {
        id: "quick_add",
        label: `Add ${suggestedProduct}`,
        type: "primary",
        handler: "QUICK_ADD_BUNDLE",
      },
      {
        id: "dismiss",
        label: "No thanks",
        type: "dismiss",
        handler: "DISMISS_SURFACE",
      },
    ],
    motionBehavior: "fade",
    contentComponents: [
      { type: "text", data: { body: `Looks like you're making ${contextName}` } },
      { type: "text", data: { body: `Add ${suggestedProduct}?`, variant: "muted" } },
    ],
    payload: {
      contextName,
      suggestedProduct,
      triggerItems,
      complementCategory: "cheese",
    },
    placement: "zone",
    zone: "bottom-right",
    ariaLive: "polite",
    dismissable: true,
    createdAt: Date.now(),
  };
}

/**
 * Create a synthetic velocity_checkout surface for immediate testing.
 * Simulates a fast shopper who has added 3+ items in 60 seconds.
 * @param {Object} options - Optional overrides
 * @param {number} [options.itemsPerMinute=5] - Items added per minute
 * @param {number} [options.cartTotal=45.99] - Cart total
 * @param {number} [options.cartItemCount=6] - Number of items in cart
 * @returns {import('../types').Surface}
 */
export function createSyntheticVelocityCheckoutSurface(options = {}) {
  const {
    itemsPerMinute = 5,
    cartTotal = 45.99,
    cartItemCount = 6,
  } = options;

  // Confidence: 80 + (5 × items_per_minute), capped at 95
  const confidence = Math.min(95, 80 + 5 * itemsPerMinute);

  return {
    id: `srf_velocity_debug_${Date.now()}`,
    intentId: "velocity_checkout",
    priority: 1, // Highest priority
    lifespan: { type: "timed", maxMs: 30000 }, // 30 second auto-dismiss
    relevanceScore: confidence,
    allowedActions: [
      {
        id: "express_checkout",
        label: "Express Checkout",
        type: "primary",
        handler: "NAVIGATE_CHECKOUT",
      },
      {
        id: "dismiss",
        label: "Keep shopping",
        type: "dismiss",
        handler: "DISMISS_SURFACE",
      },
    ],
    motionBehavior: "slide",
    contentComponents: [
      { type: "text", data: { body: "You're on a roll — ready to checkout?" } },
      { 
        type: "text", 
        data: { 
          body: `${cartItemCount} items · $${cartTotal.toFixed(2)}`, 
          variant: "muted" 
        } 
      },
    ],
    payload: {
      itemsPerMinute,
      cartTotal,
      cartItemCount,
      confidence,
    },
    placement: "zone",
    zone: "bottom-right",
    ariaLive: "assertive",
    dismissable: true,
    createdAt: Date.now(),
  };
}

/**
 * Initialize the global debug object (DEV only).
 * Call this from useIFLI with a setSurfaces callback.
 *
 * @param {(updater: (prev: import('../types').Surface[]) => import('../types').Surface[]) => void} setSurfaces
 */
export function initIFLIDebug(setSurfaces) {
  if (typeof window === "undefined") return;
  if (!import.meta.env.DEV) return;

  window.__IFLI_DEBUG = {
    triggerAbandonedCart: () => {
      const surface = createSyntheticAbandonedCartSurface();
      console.log("[IFLI][DEBUG] Injecting abandoned_cart surface", surface);
      setSurfaces((prev) => {
        // Remove any existing debug surfaces of same intent, then add new one
        const filtered = prev.filter((s) => s.intentId !== "cart_abandoned");
        return [...filtered, surface];
      });
    },

    /**
     * Trigger running_low surface with optional configuration
     * @param {Object} [options]
     * @param {number} [options.daysOverdue=3] - Days overdue (affects urgency styling)
     * @param {string} [options.productName] - Product name to display
     * @param {number} [options.avgInterval=7] - Average purchase interval
     */
    triggerRunningLow: (options = {}) => {
      const surface = createSyntheticRunningLowSurface(options);
      console.log("[IFLI][DEBUG] Injecting running_low surface", surface);
      setSurfaces((prev) => {
        const filtered = prev.filter((s) => s.intentId !== "running_low");
        return [...filtered, surface];
      });
    },

    /**
     * Trigger decision_paralysis surface for browsing hesitation
     * @param {Object} [options]
     * @param {number} [options.dwellSeconds=90] - Seconds spent browsing
     * @param {number} [options.revisitCount=3] - Number of products revisited
     */
    triggerDecisionParalysis: (options = {}) => {
      const surface = createSyntheticDecisionParalysisSurface(options);
      console.log("[IFLI][DEBUG] Injecting decision_paralysis surface", surface);
      setSurfaces((prev) => {
        const filtered = prev.filter((s) => s.intentId !== "decision_paralysis");
        return [...filtered, surface];
      });
    },

    /**
     * Trigger bundle_opportunity surface for complementary product suggestion
     * @param {Object} [options]
     * @param {string} [options.contextName="pasta"] - Meal context name
     * @param {string} [options.suggestedProduct="Parmesan Cheese"] - Product to suggest
     */
    triggerBundleOpportunity: (options = {}) => {
      const surface = createSyntheticBundleOpportunitySurface(options);
      console.log("[IFLI][DEBUG] Injecting bundle_opportunity surface", surface);
      setSurfaces((prev) => {
        const filtered = prev.filter((s) => s.intentId !== "bundle_opportunity");
        return [...filtered, surface];
      });
    },

    /**
     * Trigger velocity_checkout surface for fast shopper
     * @param {Object} [options]
     * @param {number} [options.itemsPerMinute=5] - Items added per minute
     * @param {number} [options.cartTotal=45.99] - Cart total
     * @param {number} [options.cartItemCount=6] - Number of items in cart
     */
    triggerVelocityCheckout: (options = {}) => {
      const surface = createSyntheticVelocityCheckoutSurface(options);
      console.log("[IFLI][DEBUG] Injecting velocity_checkout surface", surface);
      setSurfaces((prev) => {
        const filtered = prev.filter((s) => s.intentId !== "velocity_checkout");
        return [...filtered, surface];
      });
    },

    clearAll: () => {
      console.log("[IFLI][DEBUG] Clearing all surfaces");
      setSurfaces([]);
    },
  };

  console.log(
    "[IFLI][DEBUG] Debug helpers available:\n" +
      "  window.__IFLI_DEBUG.triggerAbandonedCart()\n" +
      "  window.__IFLI_DEBUG.triggerRunningLow()           // default: 3 days overdue\n" +
      "  window.__IFLI_DEBUG.triggerDecisionParalysis()    // default: 90s dwell, 3 revisits\n" +
      "  window.__IFLI_DEBUG.triggerBundleOpportunity()    // default: pasta + parmesan\n" +
      "  window.__IFLI_DEBUG.triggerVelocityCheckout()     // default: 5 items/min, $45.99\n" +
      "  window.__IFLI_DEBUG.triggerVelocityCheckout({ itemsPerMinute: 3, cartTotal: 25.00 })\n" +
      "  window.__IFLI_DEBUG.clearAll()"
  );
}
