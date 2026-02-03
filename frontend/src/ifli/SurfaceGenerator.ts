/**
 * IFLI Surface Generator
 * Creates and manages surfaces based on evaluated intents
 */

import type {
  Surface,
  EvaluatedIntent,
  SurfaceTemplate,
  CompetitionResult,
  IFLIConfig,
} from "./types";

import { DEFAULT_IFLI_CONFIG, EXCLUSION_GROUPS } from "./config";

/**
 * Surface templates for each intent type
 */
const SURFACE_TEMPLATES: Record<string, SurfaceTemplate> = {
  checkout_ready: {
    intentId: "checkout_ready",
    create: (intent, context) => ({
      id: `srf_checkout_nudge_${Date.now()}`,
      intentId: "checkout_ready",
      priority: 1,
      lifespan: { type: "until_action", resolutionAction: "navigate_checkout" },
      relevanceScore: intent.confidence,
      allowedActions: [
        {
          id: "review_cart",
          label: "Review cart",
          type: "primary",
          // Keep compatible with existing app wiring (UserLayout handles NAVIGATE_CART).
          handler: "NAVIGATE_CART",
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
        { type: "text", data: { body: "Ready to check out?" } },
        {
          type: "text",
          data: {
            body: formatCartSummary(context),
            variant: "muted",
          },
        },
      ],
      placement: "zone",
      zone: "bottom-right",
      ariaLive: "polite",
      dismissable: true,
      createdAt: Date.now(),
    }),
  },

  cart_abandoned: {
    intentId: "cart_abandoned",
    create: (intent, context) => ({
      id: `srf_abandoned_${Date.now()}`,
      intentId: "cart_abandoned",
      priority: 2,
      lifespan: { type: "until_action", resolutionAction: "cart_interaction" },
      relevanceScore: intent.confidence,
      allowedActions: [
        {
          id: "resume",
          label: "Continue shopping",
          type: "primary",
          handler: "NAVIGATE_CART",
        },
        {
          id: "clear",
          label: "Clear cart",
          type: "secondary",
          handler: "CLEAR_CART",
        },
      ],
      motionBehavior: "fade",
      contentComponents: [
        { type: "text", data: { body: "You left items in your cart" } },
      ],
      placement: "zone",
      zone: "bottom-right",
      ariaLive: "polite",
      dismissable: true,
      createdAt: Date.now(),
    }),
  },

  urgency_stock: {
    intentId: "urgency_stock",
    create: (intent) => {
      const stock = intent.signals[0]?.payload?.stock ?? "few";
      return {
        id: `srf_low_stock_${Date.now()}`,
        intentId: "urgency_stock",
        priority: 2,
        lifespan: { type: "timed", maxMs: 15000 },
        relevanceScore: intent.confidence,
        allowedActions: [
          {
            id: "add_now",
            label: "Add to cart",
            type: "primary",
            handler: "ADD_TO_CART",
          },
        ],
        motionBehavior: "fade",
        contentComponents: [
          { type: "icon", data: { name: "alert-triangle", color: "amber" } },
          { type: "text", data: { body: `Only ${stock} left in stock` } },
        ],
        placement: "zone",
        zone: "bottom-right",
        ariaLive: "polite",
        dismissable: true,
        createdAt: Date.now(),
      };
    },
  },

  running_low: {
    intentId: "running_low",
    create: (intent, context) => {
      // Extract data from signal payload (set by detectRunningLow)
      const payload = intent.signals[0]?.payload ?? {};
      const productName = (payload.productName as string) ?? "an item";
      const reasonText = (payload.reasonText as string) ?? "Time to restock?";
      const productId = payload.productId as string;
      const variantId = payload.variantId;
      const imageUrl = payload.imageUrl as string | undefined;
      const price = (payload.price as number) ?? 0;
      const daysOverdue = (payload.daysOverdue as number) ?? 0;

      // Priority based on how overdue:
      // Overdue by 3+ days = priority 1 (urgent)
      // Overdue by 1-2 days = priority 2 (normal)
      // Coming due soon = priority 3 (low)
      let priority: 1 | 2 | 3 = 3;
      if (daysOverdue >= 3) {
        priority = 1;
      } else if (daysOverdue >= 1) {
        priority = 2;
      }

      return {
        id: `srf_running_low_${Date.now()}`,
        intentId: "running_low",
        priority,
        lifespan: { type: "until_action", resolutionAction: "add_to_cart" },
        relevanceScore: intent.confidence,
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
        // Pass product data for the UI component
        payload: {
          productId,
          variantId,
          productName,
          imageUrl,
          price,
          reasonText,
          daysOverdue,
        },
        placement: "zone",
        zone: "bottom-right",
        ariaLive: "polite",
        dismissable: true,
        createdAt: Date.now(),
      };
    },
  },

  decision_paralysis: {
    intentId: "decision_paralysis",
    create: (intent) => {
      // Extract browsing context from signal payload
      const payload = intent.signals[0]?.payload ?? {};
      const dwellSeconds = (payload.dwellSeconds as number) ?? 60;
      const revisitCount = (payload.revisitCount as number) ?? 2;
      const revisitedProducts = (payload.revisitedProducts as string[]) ?? [];

      return {
        id: `srf_decision_paralysis_${Date.now()}`,
        intentId: "decision_paralysis",
        priority: 2, // Normal priority — not urgent, but actionable
        lifespan: { 
          type: "until_action", 
          resolutionAction: "add_to_cart" // Auto-dismiss when user adds any item
        },
        relevanceScore: intent.confidence,
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
        // Payload for UI component
        payload: {
          dwellSeconds,
          revisitCount,
          revisitedProducts,
        },
        placement: "zone",
        zone: "bottom-right",
        ariaLive: "polite",
        dismissable: true,
        createdAt: Date.now(),
      };
    },
  },

  bundle_opportunity: {
    intentId: "bundle_opportunity",
    create: (intent) => {
      // Extract bundle context from signal payload
      const payload = intent.signals[0]?.payload ?? {};
      const contextName = (payload.contextName as string) ?? "your meal";
      const suggestedProduct = (payload.suggestedProduct as string) ?? "a complement";
      const suggestedProductId = payload.suggestedProductId as string | undefined;
      const complementCategory = (payload.complementCategory as string) ?? "";
      const triggerItems = (payload.triggerItems as Array<{ name: string }>) ?? [];

      // Build dynamic copy: "Looks like you're making pasta — add parmesan?"
      const headline = `Looks like you're making ${contextName}`;
      const suggestion = `Add ${suggestedProduct}?`;

      return {
        id: `srf_bundle_${Date.now()}`,
        intentId: "bundle_opportunity",
        priority: 2, // Normal priority — helpful but not urgent
        lifespan: {
          type: "until_action",
          resolutionAction: "add_to_cart", // Auto-dismiss when user adds any item
        },
        relevanceScore: intent.confidence,
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
          { type: "text", data: { body: headline } },
          { type: "text", data: { body: suggestion, variant: "muted" } },
        ],
        // Payload for UI component
        payload: {
          contextName,
          suggestedProduct,
          suggestedProductId,
          complementCategory,
          triggerItems,
        },
        placement: "zone",
        zone: "bottom-right",
        ariaLive: "polite",
        dismissable: true,
        createdAt: Date.now(),
      };
    },
  },

  velocity_checkout: {
    intentId: "velocity_checkout",
    
    create: (intent, context) => {
      const payload = intent.signals[0]?.payload ?? {};
      const itemsPerMinute = (payload.itemsPerMinute as number) ?? 3;
      const cartTotal = (payload.cartTotal as number) ?? 0;
      const cartItemCount = (payload.cartItemCount as number) ?? 0;

      return {
        id: `srf_velocity_${Date.now()}`,
        intentId: "velocity_checkout",
        priority: 1, // HIGHEST priority — fast shopper is ready now
        lifespan: {
          type: "timed",
          maxMs: 30_000, // Auto-dismiss after 30 seconds
        },
        relevanceScore: intent.confidence,
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
        motionBehavior: "fade",
        contentComponents: [
          { type: "text", data: { body: "You're on a roll — ready to checkout?" } },
          {
            type: "text",
            data: {
              body: `${cartItemCount} items · $${cartTotal.toFixed(2)}`,
              variant: "muted",
            },
          },
        ],
        payload: {
          itemsPerMinute,
          cartTotal,
          cartItemCount,
        },
        placement: "zone",
        zone: "bottom-right",
        ariaLive: "polite", // High priority notification
        dismissable: true,
        createdAt: Date.now(),
      };
    },
  },

  mealtime_context: {
    intentId: "mealtime_context",
    create: (intent) => {
      const mealtime = (intent.signals[0]?.payload?.mealtime as string) ?? "meal";
      const prompts: Record<string, string> = {
        breakfast: "Planning breakfast?",
        lunch: "Looking for lunch ideas?",
        dinner: "Planning dinner?",
      };
      return {
        id: `srf_mealtime_${Date.now()}`,
        intentId: "mealtime_context",
        priority: 3,
        lifespan: { type: "timed", maxMs: 30000 },
        relevanceScore: intent.confidence,
        allowedActions: [
          {
            id: "view_recipes",
            label: `View ${mealtime} ideas`,
            type: "secondary",
            handler: "NAVIGATE_RECIPES",
          },
        ],
        motionBehavior: "fade",
        contentComponents: [
          {
            type: "text",
            data: { body: prompts[mealtime] ?? "Planning a meal?", variant: "subtle" },
          },
        ],
        placement: "zone",
        zone: "top-banner",
        ariaLive: "off",
        dismissable: true,
        createdAt: Date.now(),
      };
    },
  },
};

/**
 * Generate surfaces from evaluated intents
 */
export function generateSurfaces(
  intents: EvaluatedIntent[],
  config: Partial<IFLIConfig> = {},
  context?: Record<string, unknown>
): Surface[] {
  const { thresholds } = { ...DEFAULT_IFLI_CONFIG, ...config };

  return intents
    .filter((intent) => intent.confidence >= thresholds.soft)
    .map((intent) => {
      const template = SURFACE_TEMPLATES[intent.id];
      if (!template) return null;
      return template.create(intent, context);
    })
    .filter((surface): surface is Surface => surface !== null);
}

/**
 * Check if a surface is excluded by another active surface
 */
function isExcluded(surface: Surface, active: Surface[]): boolean {
  for (const group of EXCLUSION_GROUPS) {
    const surfaceInGroup = group.some((id) => surface.id.includes(id));
    const activeInGroup = active.some((a) =>
      group.some((id) => a.id.includes(id))
    );
    if (surfaceInGroup && activeInGroup) {
      return true;
    }
  }
  return false;
}

/**
 * Compete surfaces for limited slots
 */
export function compete(
  candidates: Surface[],
  config: Partial<IFLIConfig> = {}
): CompetitionResult {
  const { maxConcurrentSurfaces } = { ...DEFAULT_IFLI_CONFIG, ...config };

  // Sort by priority (lower = higher), then by relevance score
  const sorted = [...candidates].sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return b.relevanceScore - a.relevanceScore;
  });

  const active: Surface[] = [];
  const queued: Surface[] = [];
  const suppressed: Surface[] = [];

  for (const surface of sorted) {
    if (active.length < maxConcurrentSurfaces && !isExcluded(surface, active)) {
      active.push(surface);
    } else if (active.length < maxConcurrentSurfaces) {
      // Excluded but could be queued
      queued.push(surface);
    } else {
      suppressed.push(surface);
    }
  }

  return { active, queued, suppressed };
}

/**
 * Check if a surface has expired
 */
export function isSurfaceExpired(surface: Surface): boolean {
  if (surface.lifespan.type !== "timed") {
    return false;
  }

  const age = Date.now() - surface.createdAt;
  return age >= (surface.lifespan.maxMs ?? Infinity);
}

/**
 * Format cart summary for display
 */
function formatCartSummary(context?: Record<string, unknown>): string {
  if (!context) return "";

  const itemCount = context.itemCount as number | undefined;
  const total = context.total as number | undefined;

  if (!itemCount && !total) return "";

  const parts: string[] = [];
  if (itemCount) {
    parts.push(`${itemCount} item${itemCount === 1 ? "" : "s"}`);
  }
  if (total) {
    parts.push(`$${total.toFixed(2)}`);
  }

  return parts.join(" · ");
}

/**
 * Get available surface template IDs
 */
export function getAvailableTemplates(): string[] {
  return Object.keys(SURFACE_TEMPLATES);
}
