/**
 * IFLI (Intent-First Living Interface)
 * Main public API
 *
 * Usage:
 * ```tsx
 * import { useIFLI, SurfaceZone } from './ifli';
 *
 * function App() {
 *   const { items, total } = useCart();
 *   const cart = { items, total, lastInteraction: Date.now() };
 *
 *   const { surfaces, dismiss } = useIFLI(cart);
 *
 *   return (
 *     <div>
 *       {children}
 *       <SurfaceZone
 *         surfaces={surfaces}
 *         zone="bottom-right"
 *         onDismiss={dismiss}
 *         onAction={handleAction}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */

// Core hook
export { useIFLI, useIFLISignal } from "./useIFLI";

// Components
export { SurfaceZone } from "./components";

// Engine (for advanced usage)
export { intentEngine, IntentEngine } from "./IntentEngine";

// Generators
export {
  generateSurfaces,
  compete,
  isSurfaceExpired,
  getAvailableTemplates,
} from "./SurfaceGenerator";

// Detectors
export {
  detectCheckoutReady,
  detectAbandonedCart,
  detectMealtimeContext,
  detectProductRevisit,
  detectLowStock,
  detectAddToCart,
  detectCheckoutStarted,
} from "./detectors";

// Configuration
export { DEFAULT_IFLI_CONFIG, SIGNAL_WEIGHTS, SIGNAL_TO_INTENT } from "./config";

// Types
export type {
  Surface,
  SurfaceAction,
  SurfaceLifespan,
  ContentSlot,
  IntentSignal,
  EvaluatedIntent,
  SignalType,
  IFLIConfig,
  CartStateForIFLI,
  CompetitionResult,
  SurfaceTemplate,
} from "./types";
