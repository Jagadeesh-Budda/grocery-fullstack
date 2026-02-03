/**
 * IFLI Intent Detectors
 * Rule-based detectors for Phase 1 (no ML)
 */

import type { IntentSignal, CartStateForIFLI } from "../types";
import { SIGNAL_WEIGHTS } from "../config";

/**
 * Detect checkout readiness based on cart state
 */
export function detectCheckoutReady(cart: CartStateForIFLI): IntentSignal | null {
  if (!cart.items || cart.items.length === 0) {
    return null;
  }

  // Do not prompt "checkout" when user is already reviewing the cart.
  // Keep this self-contained (no need to thread route into the hook).
  if (typeof window !== "undefined") {
    const path = window.location?.pathname ?? "";
    if (path.includes("/cart")) {
      return null;
    }
  }

  // Only show when the user is active / recently interacting.
  // Shorter threshold than abandoned_cart (10 minutes).
  const CHECKOUT_READY_ACTIVE_WINDOW_MS = 2 * 60 * 1000; // 2 minutes
  if (!cart.lastInteraction) {
    return null;
  }
  const timeSinceInteraction = Date.now() - cart.lastInteraction;
  if (timeSinceInteraction > CHECKOUT_READY_ACTIVE_WINDOW_MS) {
    return null;
  }

  const total = cart.total ?? cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  let signalId = "cart.has_items";
  let weight = SIGNAL_WEIGHTS["cart.has_items"];

  // High-value cart boost
  if (total > 50) {
    signalId = "cart.high_value";
    weight = SIGNAL_WEIGHTS["cart.has_items"] + SIGNAL_WEIGHTS["cart.high_value"];
  }

  // Larger cart boost
  if (itemCount >= 5) {
    weight += 10;
  }

  return {
    id: signalId,
    type: "cart",
    weight,
    timestamp: Date.now(),
    payload: {
      itemCount,
      total,
      idleSeconds: Math.round(timeSinceInteraction / 1000),
    },
  };
}

/**
 * Detect abandoned cart (items + no interaction for 10+ minutes)
 */
const ABANDON_THRESHOLD_MS = 10 * 60 * 1000; // 10 minutes

export function detectAbandonedCart(cart: CartStateForIFLI): IntentSignal | null {
  if (!cart.items || cart.items.length === 0) {
    return null;
  }

  if (!cart.lastInteraction) {
    return null;
  }

  const timeSinceInteraction = Date.now() - cart.lastInteraction;

  if (timeSinceInteraction < ABANDON_THRESHOLD_MS) {
    return null;
  }

  return {
    id: "cart.abandoned",
    type: "cart",
    weight: SIGNAL_WEIGHTS["cart.abandoned"],
    timestamp: Date.now(),
    payload: {
      itemCount: cart.items.length,
      idleMinutes: Math.round(timeSinceInteraction / 60_000),
    },
  };
}

/**
 * Detect mealtime context based on time of day
 */
interface TimeContext {
  hour: number;
}

export function detectMealtimeContext(time: TimeContext): IntentSignal | null {
  const { hour } = time;

  let mealtime: string | null = null;
  let weight = SIGNAL_WEIGHTS["session.time_of_day"];

  // Morning: 6–11
  if (hour >= 6 && hour < 11) {
    mealtime = "breakfast";
    weight = 10;
  }
  // Lunch: 11–14
  else if (hour >= 11 && hour < 14) {
    mealtime = "lunch";
    weight = 15;
  }
  // Dinner: 17–21
  else if (hour >= 17 && hour < 21) {
    mealtime = "dinner";
    weight = 20; // Dinner has highest engagement typically
  }

  if (!mealtime) {
    return null;
  }

  return {
    id: "session.time_of_day",
    type: "session",
    weight,
    timestamp: Date.now(),
    payload: { mealtime, hour },
  };
}

/**
 * Detect product revisit (viewed same product multiple times)
 */
interface NavigationHistory {
  productViews: Map<string, number>; // productId → view count
}

export function detectProductRevisit(
  history: NavigationHistory
): IntentSignal | null {
  // Find products viewed 2+ times
  const revisited: string[] = [];

  for (const [productId, count] of history.productViews) {
    if (count >= 2) {
      revisited.push(productId);
    }
  }

  if (revisited.length === 0) {
    return null;
  }

  return {
    id: "navigation.product_revisit",
    type: "navigation",
    weight: SIGNAL_WEIGHTS["navigation.product_revisit"],
    timestamp: Date.now(),
    payload: { revisitedProducts: revisited },
  };
}

/**
 * Detect low stock urgency (product has ≤5 units)
 */
interface ProductStock {
  productId: string;
  stock: number;
  isViewing: boolean;
}

export function detectLowStock(product: ProductStock): IntentSignal | null {
  if (!product.isViewing) {
    return null;
  }

  if (product.stock > 5 || product.stock <= 0) {
    return null;
  }

  return {
    id: "external.low_stock",
    type: "external",
    weight: SIGNAL_WEIGHTS["external.low_stock"],
    timestamp: Date.now(),
    payload: {
      productId: product.productId,
      stock: product.stock,
    },
  };
}

/**
 * Detect add-to-cart action (immediate signal)
 */
export function detectAddToCart(variantId: string | number): IntentSignal {
  return {
    id: "action.add_to_cart",
    type: "action",
    weight: SIGNAL_WEIGHTS["action.add_to_cart"],
    timestamp: Date.now(),
    payload: { variantId },
  };
}

/**
 * Detect checkout navigation
 */
export function detectCheckoutStarted(): IntentSignal {
  return {
    id: "action.checkout_started",
    type: "action",
    weight: SIGNAL_WEIGHTS["action.checkout_started"],
    timestamp: Date.now(),
  };
}

/**
 * Purchase history entry for running_low detection
 */
export interface PurchaseHistoryItem {
  productId: string;
  productName: string;
  imageUrl?: string;
  lastPurchaseDate: number; // timestamp
  avgPurchaseIntervalDays: number; // average days between purchases
  purchaseCount: number; // total times purchased
  price: number;
  variantId?: string | number;
}

export interface PurchaseHistory {
  items: PurchaseHistoryItem[];
}

/**
 * Running Low result with product and reason data
 */
export interface RunningLowResult {
  signal: IntentSignal;
  product: PurchaseHistoryItem;
  daysSincePurchase: number;
  daysOverdue: number;
  reasonText: string;
}

/**
 * Detect running low based on purchase history patterns.
 * Only triggers on Home page routes.
 * 
 * Logic:
 * - Looks at products purchased 2+ times (establishes a pattern)
 * - Calculates days since last purchase vs average interval
 * - If overdue (or close to due), returns a signal
 * - Relevance score increases the more overdue the item is
 */
export function detectRunningLow(
  history: PurchaseHistory | null
): RunningLowResult | null {
  // Only show on Home page routes
  if (typeof window !== "undefined") {
    const path = window.location?.pathname ?? "";
    // Allow root, /groceries, /groceries/dashboard, but not cart/checkout/product pages
    const isHomePage = 
      path === "/" || 
      path === "/groceries" || 
      path === "/groceries/" ||
      path === "/groceries/dashboard" ||
      path.endsWith("/home");
    
    if (!isHomePage) {
      return null;
    }
  }

  if (!history || !history.items || history.items.length === 0) {
    return null;
  }

  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;

  // Find the most overdue item (highest priority)
  let bestCandidate: RunningLowResult | null = null;
  let bestScore = 0;

  for (const item of history.items) {
    // Need at least 2 purchases to establish a pattern
    if (item.purchaseCount < 2) continue;
    
    // Need a valid interval
    if (item.avgPurchaseIntervalDays <= 0) continue;

    const daysSincePurchase = Math.floor(
      (now - item.lastPurchaseDate) / oneDayMs
    );

    // How many days overdue (negative means not yet due)
    const daysOverdue = daysSincePurchase - item.avgPurchaseIntervalDays;

    // Only surface if close to due (within 2 days) or overdue
    if (daysOverdue < -2) continue;

    // Calculate relevance score:
    // Base score + bonus for being overdue
    // Capped at 100
    let relevanceScore = 60; // base
    if (daysOverdue > 0) {
      // +5 points per day overdue, up to +35
      relevanceScore += Math.min(daysOverdue * 5, 35);
    } else {
      // Coming due soon, smaller boost
      relevanceScore += 5;
    }

    // Boost for frequently purchased items
    if (item.purchaseCount >= 5) {
      relevanceScore += 5;
    }

    relevanceScore = Math.min(relevanceScore, 100);

    if (relevanceScore > bestScore) {
      bestScore = relevanceScore;

      // Generate human-readable reason
      let reasonText: string;
      if (daysOverdue > 0) {
        reasonText = `You usually buy this every ${item.avgPurchaseIntervalDays} days — it's been ${daysSincePurchase}`;
      } else if (daysOverdue === 0) {
        reasonText = `You usually buy this every ${item.avgPurchaseIntervalDays} days — today's the day!`;
      } else {
        reasonText = `You usually buy this every ${item.avgPurchaseIntervalDays} days — due in ${Math.abs(daysOverdue)} day${Math.abs(daysOverdue) > 1 ? 's' : ''}`;
      }

      bestCandidate = {
        signal: {
          id: "history.running_low",
          type: "session",
          weight: SIGNAL_WEIGHTS["history.running_low"] + (daysOverdue > 0 ? 10 : 0),
          timestamp: now,
          payload: {
            productId: item.productId,
            productName: item.productName,
            imageUrl: item.imageUrl,
            price: item.price,
            variantId: item.variantId,
            daysSincePurchase,
            daysOverdue,
            avgInterval: item.avgPurchaseIntervalDays,
            reasonText,
          },
        },
        product: item,
        daysSincePurchase,
        daysOverdue,
        reasonText,
      };
    }
  }

  return bestCandidate;
}

/**
 * Decision Paralysis Detection
 * Detects when user is browsing but not deciding (shopping paralysis).
 * 
 * Trigger conditions:
 * - category_dwell > 60 seconds
 * - product_revisit >= 2
 * - add_to_cart = 0 in last 90 seconds
 * 
 * Confidence = base 55 + (5 × revisit count) + (dwell_seconds / 30)
 * Only emits if confidence >= 65
 */
export interface BrowsingContext {
  categoryDwellMs: number;           // Time spent on current category page
  productRevisitCount: number;       // Products viewed 2+ times this session
  lastAddToCartMs: number | null;    // Timestamp of last add-to-cart (null = never)
  revisitedProducts?: string[];      // Product IDs for UI display
}

export interface DecisionParalysisResult {
  signal: IntentSignal;
  confidence: number;
  dwellSeconds: number;
  revisitCount: number;
}

const DECISION_PARALYSIS_THRESHOLD = 65;
const DWELL_THRESHOLD_MS = 60 * 1000;       // 60 seconds
const REVISIT_THRESHOLD = 2;
const NO_ADD_WINDOW_MS = 90 * 1000;         // 90 seconds

export function detectDecisionParalysis(
  context: BrowsingContext
): DecisionParalysisResult | null {
  const now = Date.now();
  const { categoryDwellMs, productRevisitCount, lastAddToCartMs, revisitedProducts } = context;

  // Check: category_dwell > 60 seconds
  if (categoryDwellMs < DWELL_THRESHOLD_MS) {
    return null;
  }

  // Check: product_revisit >= 2
  if (productRevisitCount < REVISIT_THRESHOLD) {
    return null;
  }

  // Check: add_to_cart = 0 in last 90 seconds
  // If lastAddToCartMs is null, user never added. If set, must be >90s ago.
  if (lastAddToCartMs !== null) {
    const timeSinceAdd = now - lastAddToCartMs;
    if (timeSinceAdd < NO_ADD_WINDOW_MS) {
      return null; // User added something recently — not paralyzed
    }
  }

  // Calculate confidence score
  // base 55 + (5 × revisit count) + (dwell_seconds / 30)
  const dwellSeconds = Math.floor(categoryDwellMs / 1000);
  const confidence = Math.min(
    100,
    55 + (5 * productRevisitCount) + Math.floor(dwellSeconds / 30)
  );

  // Only emit if confidence >= 65
  if (confidence < DECISION_PARALYSIS_THRESHOLD) {
    return null;
  }

  return {
    signal: {
      id: "navigation.decision_paralysis",
      type: "navigation",
      weight: SIGNAL_WEIGHTS["navigation.decision_paralysis"],
      timestamp: now,
      payload: {
        dwellSeconds,
        revisitCount: productRevisitCount,
        revisitedProducts: revisitedProducts ?? [],
        confidence,
      },
    },
    confidence,
    dwellSeconds,
    revisitCount: productRevisitCount,
  };
}

/**
 * Bundle Opportunity Detection
 * Detects when cart has items that commonly pair with a missing complement.
 * 
 * Trigger conditions:
 * - Cart has 2+ items
 * - Items match trigger categories in complement rules
 * - Complement category is missing from cart
 * 
 * Confidence = 50 + (10 × match strength)
 * Only emits if confidence >= 70
 */
import { findMatchingRules, type ComplementRule } from "../rules/complementRules";

export interface EnrichedCartItem {
  variantId: string | number;
  productId?: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export interface EnrichedCart {
  items: EnrichedCartItem[];
  total: number;
}

export interface BundleOpportunityResult {
  signal: IntentSignal;
  rule: ComplementRule;
  confidence: number;
  contextName: string;
  suggestedProduct: string;
}

const BUNDLE_CONFIDENCE_THRESHOLD = 70;

/**
 * Velocity Checkout detection
 * Detects fast shoppers who are adding items rapidly
 */
export interface VelocityContext {
  /** Timestamps of recent add-to-cart events (within tracking window) */
  addToCartTimestamps: number[];
  /** Current cart total */
  cartTotal: number;
  /** Current cart item count */
  cartItemCount: number;
}

export interface VelocityCheckoutResult {
  signal: IntentSignal;
  confidence: number;
  itemsPerMinute: number;
}

const VELOCITY_WINDOW_MS = 60_000; // 60 seconds
const VELOCITY_MIN_ADDS = 3; // Minimum add-to-cart events
const VELOCITY_MIN_TOTAL = 15; // Minimum cart total ($15)

/**
 * Detect velocity checkout pattern:
 * - 3+ add-to-cart events within 60 seconds
 * - Cart total > $15
 * - Confidence: 80 + (5 × items_per_minute), capped at 95
 */
export function detectVelocityCheckout(
  context: VelocityContext
): VelocityCheckoutResult | null {
  const { addToCartTimestamps, cartTotal, cartItemCount } = context;

  // Must have minimum cart total
  if (cartTotal < VELOCITY_MIN_TOTAL) {
    return null;
  }

  // Filter timestamps within the velocity window
  const now = Date.now();
  const recentTimestamps = addToCartTimestamps.filter(
    (ts) => now - ts <= VELOCITY_WINDOW_MS
  );

  // Must have minimum add-to-cart events within window
  if (recentTimestamps.length < VELOCITY_MIN_ADDS) {
    return null;
  }

  // Calculate items per minute based on velocity window
  // (how many adds happened in the last 60 seconds)
  const itemsPerMinute = recentTimestamps.length;

  // Confidence: 80 + (5 × items_per_minute), capped at 95
  const confidence = Math.min(95, 80 + 5 * itemsPerMinute);

  return {
    signal: {
      id: "cart.velocity_checkout",
      type: "cart",
      weight: SIGNAL_WEIGHTS["cart.velocity_checkout"],
      timestamp: now,
      payload: {
        itemsPerMinute,
        recentAddCount: recentTimestamps.length,
        cartTotal,
        cartItemCount,
        confidence,
      },
    },
    confidence,
    itemsPerMinute,
  };
}

export function detectBundleOpportunity(
  cart: EnrichedCart
): BundleOpportunityResult | null {
  // Need at least 2 items to suggest a bundle
  if (!cart.items || cart.items.length < 2) {
    return null;
  }

  const now = Date.now();

  // Extract categories from cart items
  const cartCategories = cart.items.map(item => item.category);
  const cartCategorySet = new Set(cartCategories);

  // Find matching complement rules
  const matches = findMatchingRules(cartCategories, cartCategorySet);

  if (matches.length === 0) {
    return null;
  }

  // Take the best match (highest match count + strength)
  const bestMatch = matches[0];
  const { rule, matchCount } = bestMatch;

  // Calculate confidence: 50 + (10 × match strength)
  // Bonus for multiple trigger matches
  const confidence = Math.min(
    100,
    50 + (10 * rule.matchStrength) + (matchCount > 1 ? 5 : 0)
  );

  // Only emit if confidence >= 70
  if (confidence < BUNDLE_CONFIDENCE_THRESHOLD) {
    return null;
  }

  return {
    signal: {
      id: "cart.bundle_opportunity",
      type: "cart",
      weight: SIGNAL_WEIGHTS["cart.bundle_opportunity"],
      timestamp: now,
      payload: {
        ruleId: rule.id,
        contextName: rule.contextName,
        suggestedProduct: rule.suggestedProduct,
        suggestedProductId: rule.suggestedProductId,
        complementCategory: rule.complementCategory,
        matchCount,
        matchStrength: rule.matchStrength,
        confidence,
        triggerItems: cart.items
          .filter(item => 
            rule.triggerCategories.some(tc => 
              item.category.toLowerCase().includes(tc) || tc.includes(item.category.toLowerCase())
            )
          )
          .map(item => ({ name: item.name, category: item.category })),
      },
    },
    rule,
    confidence,
    contextName: rule.contextName,
    suggestedProduct: rule.suggestedProduct,
  };
}
