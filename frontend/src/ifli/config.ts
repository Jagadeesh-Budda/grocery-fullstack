/**
 * IFLI Configuration
 * Default settings for the Intent-First Living Interface
 */

import type { IFLIConfig } from "./types";

export const DEFAULT_IFLI_CONFIG: IFLIConfig = {
  enabled: true,
  thresholds: {
    soft: 60,       // Subtle hint affordance
    prominent: 80,  // Full surface render
    urgent: 95,     // Interruptive (rare)
  },
  maxConcurrentSurfaces: 1,
  dismissPenaltyDays: 7,
  evaluationIntervalMs: 2000,
};

/**
 * Signal expiration times by type (milliseconds)
 */
export const SIGNAL_MAX_AGE: Record<string, number> = {
  cart: 30 * 60 * 1000,       // 30 minutes
  navigation: 15 * 60 * 1000, // 15 minutes
  action: 2 * 60 * 1000,      // 2 minutes
  session: Infinity,          // Never expires within session
  external: 30 * 60 * 1000,   // 30 minutes
};

/**
 * Signal weights for each signal type
 */
export const SIGNAL_WEIGHTS: Record<string, number> = {
  "cart.has_items": 20,
  "cart.abandoned": 30,
  "cart.high_value": 15,
  "cart.bundle_opportunity": 25,
  "cart.velocity_checkout": 40,
  "session.returning_user": 25,
  "session.time_of_day": 15,
  "navigation.category_dwell": 20,
  "navigation.product_revisit": 25,
  "navigation.search_refinement": 15,
  "navigation.decision_paralysis": 30,
  "action.add_to_cart": 35,
  "action.remove_from_cart": 20,
  "action.checkout_started": 40,
  "external.low_stock": 25,
  "history.running_low": 25,
};

/**
 * Intent to signal mapping (which signals contribute to which intents)
 */
export const SIGNAL_TO_INTENT: Record<string, string> = {
  "cart.has_items": "checkout_ready",
  "cart.abandoned": "cart_abandoned",
  "cart.high_value": "checkout_ready",
  "cart.bundle_opportunity": "bundle_opportunity",
  "cart.velocity_checkout": "velocity_checkout",
  "action.add_to_cart": "checkout_ready",
  "action.checkout_started": "checkout_ready",
  "action.remove_from_cart": "cart_reconsider",
  "external.low_stock": "urgency_stock",
  "session.time_of_day": "mealtime_context",
  "navigation.product_revisit": "product_interest",
  "navigation.category_dwell": "category_interest",
  "navigation.search_refinement": "search_intent",
  "navigation.decision_paralysis": "decision_paralysis",
  "session.returning_user": "personalization",
  "history.running_low": "running_low",
};

/**
 * Mutual exclusion groups — surfaces that cannot coexist
 */
export const EXCLUSION_GROUPS: string[][] = [
  ["checkout_nudge", "abandoned_recovery"], // Don't show both checkout nudges
];

/**
 * Feature flag key for localStorage
 */
export const IFLI_ENABLED_KEY = "ifli_enabled";
export const IFLI_DISMISSALS_KEY = "ifli_dismissals";
