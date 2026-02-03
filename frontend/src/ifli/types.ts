/**
 * IFLI Type Definitions
 * Intent-First Living Interface — Core Types
 */

export type SignalType = "cart" | "navigation" | "action" | "session" | "external";

export interface IntentSignal {
  id: string;
  type: SignalType;
  weight: number;
  timestamp: number;
  payload?: Record<string, unknown>;
}

export interface EvaluatedIntent {
  id: string;
  confidence: number;
  signals: IntentSignal[];
  lastUpdated: number;
}

export interface SurfaceLifespan {
  type: "until_action" | "timed" | "manual";
  maxMs?: number;
  resolutionAction?: string;
}

export interface SurfaceAction {
  id: string;
  label: string;
  type: "primary" | "secondary" | "dismiss";
  handler: string;
}

export interface ContentSlot {
  type: "text" | "product_card" | "action_row" | "icon";
  data: Record<string, unknown>;
}

export interface Surface {
  id: string;
  intentId: string;
  priority: 1 | 2 | 3;
  lifespan: SurfaceLifespan;
  relevanceScore: number;
  allowedActions: SurfaceAction[];
  motionBehavior: "fade" | "none";
  contentComponents: ContentSlot[];
  placement: "inline" | "overlay" | "zone";
  zone?: "bottom-right" | "top-banner" | "contextual";
  ariaLive: "polite" | "off";
  dismissable: boolean;
  createdAt: number;
  /** Optional payload for intent-specific data (e.g., product info for running_low) */
  payload?: Record<string, unknown>;
}

export interface IntentEngineState {
  signals: IntentSignal[];
  intents: EvaluatedIntent[];
  activeSurfaces: Surface[];
  dismissedIntents: Map<string, number>;
}

export interface IFLIConfig {
  enabled: boolean;
  thresholds: {
    soft: number;
    prominent: number;
    urgent: number;
  };
  maxConcurrentSurfaces: number;
  dismissPenaltyDays: number;
  evaluationIntervalMs: number;
}

export interface CartStateForIFLI {
  items: Array<{
    variantId: string | number;
    quantity: number;
    price: number;
  }>;
  lastInteraction: number;
  total: number;
}

export interface CompetitionResult {
  active: Surface[];
  queued: Surface[];
  suppressed: Surface[];
}

export type SurfaceTemplate = {
  intentId: string;
  create: (intent: EvaluatedIntent, context?: Record<string, unknown>) => Surface;
};
