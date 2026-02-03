# Intent-First Living Interface (IFLI) — Design Document

> Grocery Fullstack Enhanced — Additive Layer Architecture

---

<philosophy_summary>

## Philosophy Summary

IFLI fundamentally rejects the prevailing pattern of "AI-powered dashboards" that compete for attention with generative widgets, animated suggestions, and novelty-driven surfaces. Instead, this system treats **intent as infrastructure**: user behavior produces discrete signals that accumulate into a lightweight intent model, which then *conditionally* surfaces minimal UI affordances only when confidence crosses a threshold. The interface remains dormant by default—resembling the existing grocery experience—and only manifests ephemeral "surfaces" (not screens) when they genuinely serve a detected need. Resolution dissolves visibility: once a surface fulfills its purpose (e.g., user adds an item), it self-destructs. This inverts the typical "always-on" AI aesthetic into a calm, restraint-first system where *less appearing means more success*.

</philosophy_summary>

---

<risks_and_mitigations>

## Risks & Mitigations

| # | Risk | Impact | Mitigation |
|---|------|--------|------------|
| 1 | **False-positive intent detection** — System surfaces unwanted suggestions, eroding trust | High | Conservative thresholds (≥70 confidence to surface); hard dismiss = 7-day decay penalty on that signal type; surfaces never block primary content |
| 2 | **User confusion about non-deterministic UI** — Surfaces appear/disappear unpredictably | Medium | Consistent animation vocabulary (fade only, no slides); surfaces always appear in predictable zones (e.g., bottom-right); clear dismiss affordance |
| 3 | **Performance/bundle bloat** — Intent engine adds latency or JS size | Medium | Intent engine runs in Web Worker; lazy-load surface components; rule-based Phase 1 is <3KB gzipped |
| 4 | **Over-engineering before validation** — Building complex ML before proving value | High | Phase 1 uses only deterministic rules (time, cart state, navigation); ML deferred to Phase 3+ |
| 5 | **Accessibility regression** — Ephemeral surfaces disrupt screen readers | Medium | Surfaces use `role="status"` / `aria-live="polite"`; focus never auto-shifts; keyboard escape always dismisses |

</risks_and_mitigations>

---

<intent_engine_design>

## Intent Engine Design (Phase 1)

### Core Intent Signals (12)

| Signal ID | Source | Description | Weight |
|-----------|--------|-------------|--------|
| `cart.has_items` | CartContext | Cart contains ≥1 item | 20 |
| `cart.abandoned` | Timer + CartContext | Cart has items, no interaction for 10+ min | 30 |
| `cart.high_value` | CartContext | Cart total exceeds $50 | 15 |
| `session.returning_user` | AuthContext | User logged in & has prior orders | 25 |
| `session.time_of_day` | Clock | Morning (6–11), Lunch (11–14), Dinner (17–21) | 10–20 |
| `navigation.category_dwell` | Router + Timer | Spent >45s on a category page | 20 |
| `navigation.product_revisit` | History | Viewed same product ≥2 times this session | 25 |
| `navigation.search_refinement` | SearchBar | Modified search query ≥2 times | 15 |
| `action.add_to_cart` | CartContext event | Just added an item (last 5s) | 35 |
| `action.remove_from_cart` | CartContext event | Just removed an item (last 5s) | 20 |
| `action.checkout_started` | Router | Navigated to /groceries/checkout | 40 |
| `external.low_stock` | API | Viewed product has stock ≤5 units | 25 |

### Confidence Scoring System

```
confidence(intent) = Σ (active_signal.weight × signal.recency_factor)
```

- **Recency factor**: `1.0` if signal age < 30s, linear decay to `0.3` at 5min, floor at `0.1` until expiration
- **Threshold to surface**: `≥ 60` (soft suggestion), `≥ 80` (prominent surface)
- **Maximum confidence cap**: `100`

### Decay & Expiration Logic

| Signal Type | Soft Decay Start | Hard Expiration | Reset On |
|-------------|------------------|-----------------|----------|
| `cart.*` | 10 min | Session end | Cart mutation |
| `navigation.*` | 2 min | 15 min | New navigation |
| `action.*` | 30 sec | 2 min | New action |
| `session.*` | Never | Session end | — |
| `external.*` | 5 min | 30 min | API refresh |

### Scoring Rules (Pseudocode)

```typescript
interface ScoringRules {
  surfaceThresholds: {
    soft: 60;      // Subtle hint affordance
    prominent: 80; // Full surface render
    urgent: 95;    // Interruptive (rare, e.g., checkout reminder)
  };
  
  decayFunction: (signalAge: number, signalType: SignalType) => number;
  
  conflictResolution: "highest_confidence_wins" | "most_recent_wins";
  
  dismissPenalty: {
    duration: 7 * 24 * 60 * 60 * 1000; // 7 days
    weightMultiplier: 0.3;
  };
}
```

</intent_engine_design>

---

<surface_schema_and_examples>

## Surface Abstraction Schema

```typescript
interface Surface {
  id: string;                          // Unique identifier (e.g., "srf_checkout_nudge_001")
  intentId: string;                    // Triggering intent (e.g., "checkout_ready")
  priority: 1 | 2 | 3;                 // 1 = highest (urgent), 3 = ambient
  lifespan: {
    type: "until_action" | "timed" | "manual";
    maxMs?: number;                    // For timed surfaces
    resolutionAction?: string;         // For until_action (e.g., "navigate_to_checkout")
  };
  relevanceScore: number;              // Current confidence (0–100)
  allowedActions: SurfaceAction[];
  motionBehavior: "fade" | "none";     // Restrained vocabulary
  contentComponents: ContentSlot[];
  placement: "inline" | "overlay" | "zone"; // Where it can appear
  zone?: "bottom-right" | "top-banner" | "contextual"; // If placement = "zone"
  ariaLive: "polite" | "off";
  dismissable: boolean;
}

interface SurfaceAction {
  id: string;
  label: string;
  type: "primary" | "secondary" | "dismiss";
  handler: string;                     // Action ID to dispatch
}

interface ContentSlot {
  type: "text" | "product_card" | "action_row" | "icon";
  data: Record<string, unknown>;
}
```

### Concrete Examples

#### 1. Checkout Nudge Surface

```typescript
{
  id: "srf_checkout_nudge",
  intentId: "checkout_ready",
  priority: 2,
  lifespan: { type: "until_action", resolutionAction: "navigate_to_checkout" },
  relevanceScore: 75,
  allowedActions: [
    { id: "go_checkout", label: "Checkout", type: "primary", handler: "NAVIGATE_CHECKOUT" },
    { id: "dismiss", label: "Not now", type: "dismiss", handler: "DISMISS_SURFACE" }
  ],
  motionBehavior: "fade",
  contentComponents: [
    { type: "text", data: { body: "Ready to complete your order?" } },
    { type: "text", data: { body: "3 items · $24.50", variant: "muted" } }
  ],
  placement: "zone",
  zone: "bottom-right",
  ariaLive: "polite",
  dismissable: true
}
```

#### 2. Low Stock Alert Surface

```typescript
{
  id: "srf_low_stock_alert",
  intentId: "urgency_stock",
  priority: 2,
  lifespan: { type: "timed", maxMs: 15000 },
  relevanceScore: 70,
  allowedActions: [
    { id: "add_now", label: "Add to cart", type: "primary", handler: "ADD_TO_CART" }
  ],
  motionBehavior: "fade",
  contentComponents: [
    { type: "icon", data: { name: "alert-triangle", color: "amber" } },
    { type: "text", data: { body: "Only 3 left in stock" } }
  ],
  placement: "contextual",
  ariaLive: "polite",
  dismissable: true
}
```

#### 3. Meal-Time Suggestion Surface

```typescript
{
  id: "srf_mealtime_hint",
  intentId: "mealtime_context",
  priority: 3,
  lifespan: { type: "timed", maxMs: 30000 },
  relevanceScore: 55,
  allowedActions: [
    { id: "view_recipes", label: "View dinner ideas", type: "secondary", handler: "NAVIGATE_RECIPES" }
  ],
  motionBehavior: "fade",
  contentComponents: [
    { type: "text", data: { body: "Planning dinner?", variant: "subtle" } }
  ],
  placement: "zone",
  zone: "top-banner",
  ariaLive: "off",
  dismissable: true
}
```

#### 4. Abandoned Cart Recovery Surface

```typescript
{
  id: "srf_abandoned_recovery",
  intentId: "cart_abandoned",
  priority: 1,
  lifespan: { type: "until_action", resolutionAction: "cart_interaction" },
  relevanceScore: 85,
  allowedActions: [
    { id: "resume", label: "Continue shopping", type: "primary", handler: "NAVIGATE_CART" },
    { id: "clear", label: "Clear cart", type: "secondary", handler: "CLEAR_CART" }
  ],
  motionBehavior: "fade",
  contentComponents: [
    { type: "text", data: { body: "You left items in your cart" } },
    { type: "product_card", data: { productId: "first_cart_item", compact: true } }
  ],
  placement: "zone",
  zone: "bottom-right",
  ariaLive: "polite",
  dismissable: true
}
```

</surface_schema_and_examples>

---

<generator_competition_logic>

## Surface Generator & Competition Logic

### Intent → Surface Mapping

```typescript
const INTENT_SURFACE_MAP: Record<string, SurfaceTemplate> = {
  "checkout_ready": CheckoutNudgeSurface,
  "cart_abandoned": AbandonedRecoverySurface,
  "urgency_stock": LowStockAlertSurface,
  "mealtime_context": MealtimeHintSurface,
  "product_interest": ProductRevisitSurface,
  // ... extensible
};

function generateSurfaces(intents: EvaluatedIntent[]): Surface[] {
  return intents
    .filter(i => i.confidence >= THRESHOLDS.soft)
    .map(i => INTENT_SURFACE_MAP[i.id]?.create(i))
    .filter(Boolean);
}
```

### Competition Rules

1. **Max concurrent surfaces**: 2 (1 prominent + 1 ambient max)
2. **Priority trumps recency**: Priority 1 always wins over Priority 2–3
3. **Same-priority conflict**: Highest `relevanceScore` wins
4. **Stacking**: Priority 3 surfaces can coexist with Priority 1–2
5. **Mutual exclusion groups**: Some surfaces cannot coexist (e.g., `checkout_nudge` and `abandoned_recovery`)

```typescript
interface CompetitionResult {
  active: Surface[];
  queued: Surface[];      // Waiting for slot
  suppressed: Surface[];  // Lost competition
}

function compete(candidates: Surface[]): CompetitionResult {
  const sorted = candidates.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return b.relevanceScore - a.relevanceScore;
  });
  
  const active: Surface[] = [];
  const queued: Surface[] = [];
  
  for (const surface of sorted) {
    if (active.length < MAX_CONCURRENT && !isExcluded(surface, active)) {
      active.push(surface);
    } else {
      queued.push(surface);
    }
  }
  
  return { active, queued, suppressed: [] };
}
```

### Dissolution Triggers

- **Resolution**: User completes `resolutionAction` → immediate fade-out
- **Timeout**: `lifespan.maxMs` exceeded → immediate fade-out
- **Dismiss**: User clicks dismiss → fade-out + dismiss penalty applied
- **Supersession**: Higher-priority surface needs slot → fade-out (no penalty)

### Escape Hatches

| Gesture | Behavior |
|---------|----------|
| Click dismiss (×) | Dissolve + 7-day signal penalty |
| Press Escape | Dissolve active surface (no penalty) |
| Long-press dismiss | Dissolve + "Don't show again" (permanent for this intent) |
| Settings toggle | Disable all IFLI surfaces globally |

### Manual Triggers (Deferred)

<deferred>
Users can manually invoke surfaces via command palette or dedicated "suggestions" panel. Not in Sprint 1.
</deferred>

</generator_competition_logic>

---

<visual_motion_guidelines>

## Visual & Motion Restraint Guidelines

### Core Principles

1. **Fade only**: All surface transitions use opacity fade (200–300ms ease-out). No slides, bounces, or scaling.
2. **Muted palette**: Surfaces use existing theme colors at 60–80% opacity. No gradients, glows, or shadows beyond `shadow-sm`.
3. **No animation loops**: Nothing pulses, breathes, or continuously animates.
4. **Predictable zones**: Surfaces always appear in designated zones, never floating randomly.
5. **Minimal footprint**: Maximum surface size is 320px width × 160px height. Never full-width banners.

### Typography

- Body: Existing `text-sm` / `text-base` from Tailwind config
- Muted: `text-slate-500` or equivalent
- No bold emphasis in surface content (action buttons excepted)

### Interactive States

- Hover: Subtle background shift (`hover:bg-slate-50`)
- Focus: Ring only (`focus-visible:ring-2`)
- Active: Slight opacity reduction

### Accessibility Constraints

- All surfaces have `role="complementary"` or `role="status"`
- Dismiss button always has visible focus indicator
- No auto-focus on surface appearance
- Motion respects `prefers-reduced-motion` (instant opacity change)

### Anti-Patterns (Prohibited)

- ❌ Confetti, particles, or celebratory animations
- ❌ AI-branded visuals (sparkles, gradient orbs, "✨")
- ❌ Skeleton loading states for surfaces (just appear when ready)
- ❌ Progress indicators within surfaces
- ❌ Sounds or haptics

</visual_motion_guidelines>

---

<rollout_refinement>

## Progressive Rollout Plan

### Phase 0: Instrumentation (Week 1)

**Goal**: Emit intent signals without rendering any surfaces.

**Tasks**:
- [ ] Implement `IntentSignalEmitter` class
- [ ] Add signal emission to CartContext, Router, AuthContext
- [ ] Log signals to console (dev) / analytics (prod)

**Success Criteria**:
- Signals emit correctly for all 12 defined sources
- No user-visible changes

**Fallback**: None needed (invisible layer)

---

### Phase 1: Single Surface (Weeks 2–3)

**Goal**: Render one high-value surface (Checkout Nudge) under strict conditions.

**Tasks**:
- [ ] Implement `IntentEngine` with confidence scoring
- [ ] Implement `SurfaceRenderer` component
- [ ] Deploy Checkout Nudge surface only
- [ ] Add global dismiss + settings toggle

**Success Criteria**:
- Surface appears only when `checkout_ready` confidence ≥ 70
- Dismiss works; respects 7-day penalty
- No negative impact on checkout conversion

**Fallback Rule**:
```typescript
if (noIntentAboveThreshold || globalIFLIDisabled) {
  return null; // Render nothing; legacy experience unchanged
}
```

---

### Phase 2: Multi-Surface Competition (Weeks 4–6)

**Goal**: Add 2–3 additional surfaces with competition logic.

**Surfaces**:
- Abandoned Cart Recovery
- Low Stock Alert
- Mealtime Hint

**Success Criteria**:
- Max 2 concurrent surfaces
- Priority resolution works correctly
- User engagement with surfaces > 10%

---

### Phase 3: Personalization Layer (Weeks 7–10)

<deferred>
Integrate lightweight ML for signal weighting based on user history. Requires backend support.
</deferred>

---

### Fallback Behavior Matrix

| Condition | Behavior |
|-----------|----------|
| No intent ≥ threshold | No surfaces rendered |
| User disabled IFLI | No surfaces rendered |
| JS error in IntentEngine | Graceful degradation; legacy UI continues |
| Feature flag off | No IFLI code executes |

</rollout_refinement>

---

<prototype_code>

## First Prototype Deliverables

### TypeScript Interfaces

```typescript
// src/ifli/types.ts

export type SignalType = 
  | "cart" 
  | "navigation" 
  | "action" 
  | "session" 
  | "external";

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

export interface IntentEngineState {
  signals: IntentSignal[];
  intents: EvaluatedIntent[];
  activeSurfaces: Surface[];
  dismissedIntents: Map<string, number>; // intentId → dismissal timestamp
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
}
```

### Intent Engine Core (Pseudocode)

```typescript
// src/ifli/IntentEngine.ts

import type { IntentSignal, EvaluatedIntent, IFLIConfig } from "./types";

const DEFAULT_CONFIG: IFLIConfig = {
  enabled: true,
  thresholds: { soft: 60, prominent: 80, urgent: 95 },
  maxConcurrentSurfaces: 2,
  dismissPenaltyDays: 7,
};

export class IntentEngine {
  private signals: IntentSignal[] = [];
  private dismissals: Map<string, number> = new Map();
  private config: IFLIConfig;

  constructor(config: Partial<IFLIConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  emit(signal: Omit<IntentSignal, "timestamp">): void {
    this.signals.push({
      ...signal,
      timestamp: Date.now(),
    });
    this.prune();
  }

  private prune(): void {
    const now = Date.now();
    this.signals = this.signals.filter((s) => {
      const maxAge = this.getMaxAge(s.type);
      return now - s.timestamp < maxAge;
    });
  }

  private getMaxAge(type: IntentSignal["type"]): number {
    const ages: Record<string, number> = {
      cart: 30 * 60 * 1000,      // 30 min
      navigation: 15 * 60 * 1000, // 15 min
      action: 2 * 60 * 1000,      // 2 min
      session: Infinity,
      external: 30 * 60 * 1000,
    };
    return ages[type] ?? 10 * 60 * 1000;
  }

  private recencyFactor(signal: IntentSignal): number {
    const age = Date.now() - signal.timestamp;
    if (age < 30_000) return 1.0;
    if (age < 5 * 60_000) return 1.0 - (age - 30_000) / (5 * 60_000 - 30_000) * 0.7;
    return 0.1;
  }

  evaluate(): EvaluatedIntent[] {
    const intentMap = new Map<string, IntentSignal[]>();
    
    for (const signal of this.signals) {
      const intentId = this.signalToIntent(signal);
      if (!intentMap.has(intentId)) {
        intentMap.set(intentId, []);
      }
      intentMap.get(intentId)!.push(signal);
    }

    const intents: EvaluatedIntent[] = [];
    
    for (const [intentId, signals] of intentMap) {
      let confidence = 0;
      for (const signal of signals) {
        confidence += signal.weight * this.recencyFactor(signal);
      }
      
      // Apply dismiss penalty
      const dismissTime = this.dismissals.get(intentId);
      if (dismissTime) {
        const daysSinceDismiss = (Date.now() - dismissTime) / (24 * 60 * 60 * 1000);
        if (daysSinceDismiss < this.config.dismissPenaltyDays) {
          confidence *= 0.3;
        }
      }

      intents.push({
        id: intentId,
        confidence: Math.min(100, Math.round(confidence)),
        signals,
        lastUpdated: Math.max(...signals.map((s) => s.timestamp)),
      });
    }

    return intents.sort((a, b) => b.confidence - a.confidence);
  }

  private signalToIntent(signal: IntentSignal): string {
    // Simple rule-based mapping
    const mapping: Record<string, string> = {
      "cart.has_items": "checkout_ready",
      "cart.abandoned": "cart_abandoned",
      "cart.high_value": "checkout_ready",
      "action.add_to_cart": "checkout_ready",
      "action.checkout_started": "checkout_ready",
      "external.low_stock": "urgency_stock",
      "session.time_of_day": "mealtime_context",
      "navigation.product_revisit": "product_interest",
    };
    return mapping[signal.id] ?? "general";
  }

  dismiss(intentId: string): void {
    this.dismissals.set(intentId, Date.now());
  }
}
```

### Rule-Based Intent Detectors

```typescript
// src/ifli/detectors/checkoutReadyDetector.ts

import type { IntentSignal } from "../types";

interface CartState {
  items: Array<{ variantId: string; quantity: number; price: number }>;
  lastInteraction: number;
}

export function detectCheckoutReady(cart: CartState): IntentSignal | null {
  if (cart.items.length === 0) {
    return null;
  }

  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  // Base signal for having items
  const signal: IntentSignal = {
    id: "cart.has_items",
    type: "cart",
    weight: 20,
    timestamp: Date.now(),
    payload: { itemCount, total },
  };

  // Boost weight for high-value carts
  if (total > 50) {
    signal.weight += 15;
    signal.id = "cart.high_value";
  }

  // Boost weight for larger carts
  if (itemCount >= 5) {
    signal.weight += 10;
  }

  return signal;
}
```

```typescript
// src/ifli/detectors/abandonedCartDetector.ts

import type { IntentSignal } from "../types";

interface CartState {
  items: Array<unknown>;
  lastInteraction: number;
}

const ABANDON_THRESHOLD_MS = 10 * 60 * 1000; // 10 minutes

export function detectAbandonedCart(cart: CartState): IntentSignal | null {
  if (cart.items.length === 0) {
    return null;
  }

  const timeSinceInteraction = Date.now() - cart.lastInteraction;

  if (timeSinceInteraction < ABANDON_THRESHOLD_MS) {
    return null;
  }

  return {
    id: "cart.abandoned",
    type: "cart",
    weight: 30,
    timestamp: Date.now(),
    payload: {
      itemCount: cart.items.length,
      idleMinutes: Math.round(timeSinceInteraction / 60_000),
    },
  };
}
```

### Inference → Render Loop (Pseudocode)

```typescript
// src/ifli/useIFLI.ts

import { useEffect, useState, useCallback } from "react";
import { IntentEngine } from "./IntentEngine";
import { detectCheckoutReady } from "./detectors/checkoutReadyDetector";
import { detectAbandonedCart } from "./detectors/abandonedCartDetector";
import { generateSurfaces, compete } from "./SurfaceGenerator";
import type { Surface, IFLIConfig } from "./types";

const engine = new IntentEngine();

export function useIFLI(
  cart: CartState,
  config: Partial<IFLIConfig> = {}
): {
  surfaces: Surface[];
  dismiss: (surfaceId: string) => void;
} {
  const [surfaces, setSurfaces] = useState<Surface[]>([]);

  // Detection loop (runs on cart/context changes)
  useEffect(() => {
    const checkoutSignal = detectCheckoutReady(cart);
    if (checkoutSignal) engine.emit(checkoutSignal);

    const abandonSignal = detectAbandonedCart(cart);
    if (abandonSignal) engine.emit(abandonSignal);
  }, [cart]);

  // Evaluation loop (runs periodically)
  useEffect(() => {
    const interval = setInterval(() => {
      const intents = engine.evaluate();
      const candidates = generateSurfaces(intents);
      const { active } = compete(candidates);
      setSurfaces(active);
    }, 2000); // Every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const dismiss = useCallback((surfaceId: string) => {
    const surface = surfaces.find((s) => s.id === surfaceId);
    if (surface) {
      engine.dismiss(surface.intentId);
      setSurfaces((prev) => prev.filter((s) => s.id !== surfaceId));
    }
  }, [surfaces]);

  return { surfaces, dismiss };
}
```

### Surface Renderer Component

```tsx
// src/ifli/components/SurfaceZone.tsx

import React from "react";
import type { Surface } from "../types";

interface SurfaceZoneProps {
  surfaces: Surface[];
  zone: "bottom-right" | "top-banner";
  onDismiss: (id: string) => void;
  onAction: (surfaceId: string, actionId: string) => void;
}

export function SurfaceZone({ surfaces, zone, onDismiss, onAction }: SurfaceZoneProps) {
  const zoneSurfaces = surfaces.filter((s) => s.zone === zone);

  if (zoneSurfaces.length === 0) {
    return null;
  }

  const positionClasses = {
    "bottom-right": "fixed bottom-4 right-4",
    "top-banner": "fixed top-16 left-1/2 -translate-x-1/2",
  };

  return (
    <div className={positionClasses[zone]} role="complementary">
      {zoneSurfaces.map((surface) => (
        <SurfaceCard
          key={surface.id}
          surface={surface}
          onDismiss={() => onDismiss(surface.id)}
          onAction={(actionId) => onAction(surface.id, actionId)}
        />
      ))}
    </div>
  );
}

function SurfaceCard({
  surface,
  onDismiss,
  onAction,
}: {
  surface: Surface;
  onDismiss: () => void;
  onAction: (actionId: string) => void;
}) {
  return (
    <div
      className="w-80 max-w-[90vw] rounded-lg border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur-sm animate-fade-in"
      role="status"
      aria-live={surface.ariaLive}
    >
      {/* Content slots */}
      {surface.contentComponents.map((slot, i) => (
        <ContentSlotRenderer key={i} slot={slot} />
      ))}

      {/* Actions */}
      <div className="mt-3 flex items-center gap-2">
        {surface.allowedActions.map((action) => (
          <button
            key={action.id}
            onClick={() =>
              action.type === "dismiss" ? onDismiss() : onAction(action.id)
            }
            className={
              action.type === "primary"
                ? "rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
                : "rounded-full px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
            }
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ContentSlotRenderer({ slot }: { slot: ContentSlot }) {
  switch (slot.type) {
    case "text":
      return (
        <p className={slot.data.variant === "muted" ? "text-sm text-slate-500" : "text-sm text-slate-800"}>
          {slot.data.body as string}
        </p>
      );
    case "icon":
      // Integrate with existing icon system
      return null;
    default:
      return null;
  }
}
```

</prototype_code>

---

## File Structure for Phase 1

```
src/
└── ifli/
    ├── types.ts                    # All TypeScript interfaces
    ├── IntentEngine.ts             # Core engine class
    ├── SurfaceGenerator.ts         # Intent → Surface mapping
    ├── useIFLI.ts                  # React hook for consumption
    ├── config.ts                   # Default configuration
    ├── detectors/
    │   ├── checkoutReadyDetector.ts
    │   ├── abandonedCartDetector.ts
    │   └── index.ts
    ├── surfaces/
    │   ├── CheckoutNudgeSurface.ts
    │   └── index.ts
    └── components/
        ├── SurfaceZone.tsx
        └── index.ts
```

---

**What slice should we prototype deeper next?**

Options:
1. **Intent Engine implementation** — Full working TypeScript class with tests
2. **Integration with CartContext** — Wire signals into existing React context
3. **SurfaceZone component** — Complete React component with animations
4. **Settings/Preferences UI** — User controls for enabling/disabling IFLI
