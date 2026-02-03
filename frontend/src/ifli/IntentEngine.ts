/**
 * IFLI Intent Engine
 * Core engine for signal collection, decay, and intent evaluation
 */

import type {
  IntentSignal,
  EvaluatedIntent,
  IFLIConfig,
  SignalType,
} from "./types";

import {
  DEFAULT_IFLI_CONFIG,
  SIGNAL_MAX_AGE,
  SIGNAL_TO_INTENT,
  IFLI_DISMISSALS_KEY,
} from "./config";

export class IntentEngine {
  private signals: IntentSignal[] = [];
  private dismissals: Map<string, number> = new Map();
  private config: IFLIConfig;
  private listeners: Set<(intents: EvaluatedIntent[]) => void> = new Set();

  constructor(config: Partial<IFLIConfig> = {}) {
    this.config = { ...DEFAULT_IFLI_CONFIG, ...config };
    this.loadDismissals();
  }

  /**
   * Emit a new intent signal
   */
  emit(signal: Omit<IntentSignal, "timestamp">): void {
    if (!this.config.enabled) return;

    this.signals.push({
      ...signal,
      timestamp: Date.now(),
    });

    this.prune();
    this.notifyListeners();
  }

  /**
   * Remove expired signals
   */
  private prune(): void {
    const now = Date.now();
    this.signals = this.signals.filter((signal) => {
      const maxAge = this.getMaxAge(signal.type);
      return now - signal.timestamp < maxAge;
    });
  }

  /**
   * Get maximum age for a signal type
   */
  private getMaxAge(type: SignalType): number {
    return SIGNAL_MAX_AGE[type] ?? 10 * 60 * 1000;
  }

  /**
   * Calculate recency factor for a signal (1.0 = fresh, 0.1 = stale)
   */
  private recencyFactor(signal: IntentSignal): number {
    const age = Date.now() - signal.timestamp;

    // Fresh: full weight
    if (age < 30_000) return 1.0;

    // Decay over 5 minutes to 0.3
    if (age < 5 * 60_000) {
      const decayRange = 5 * 60_000 - 30_000;
      const decayProgress = (age - 30_000) / decayRange;
      return 1.0 - decayProgress * 0.7;
    }

    // Floor at 0.1
    return 0.1;
  }

  /**
   * Map a signal to its corresponding intent
   */
  private signalToIntent(signal: IntentSignal): string {
    return SIGNAL_TO_INTENT[signal.id] ?? "general";
  }

  /**
   * Evaluate all signals and produce ranked intents
   */
  evaluate(): EvaluatedIntent[] {
    this.prune();

    // Group signals by intent
    const intentMap = new Map<string, IntentSignal[]>();

    for (const signal of this.signals) {
      const intentId = this.signalToIntent(signal);
      if (!intentMap.has(intentId)) {
        intentMap.set(intentId, []);
      }
      intentMap.get(intentId)!.push(signal);
    }

    // Calculate confidence for each intent
    const intents: EvaluatedIntent[] = [];

    for (const [intentId, signals] of intentMap) {
      let confidence = 0;

      for (const signal of signals) {
        const recency = this.recencyFactor(signal);
        confidence += signal.weight * recency;
      }

      // Apply dismiss penalty
      const dismissTime = this.dismissals.get(intentId);
      if (dismissTime) {
        const daysSinceDismiss =
          (Date.now() - dismissTime) / (24 * 60 * 60 * 1000);
        if (daysSinceDismiss < this.config.dismissPenaltyDays) {
          confidence *= 0.3;
        } else {
          // Penalty expired, remove from dismissals
          this.dismissals.delete(intentId);
          this.saveDismissals();
        }
      }

      intents.push({
        id: intentId,
        confidence: Math.min(100, Math.round(confidence)),
        signals,
        lastUpdated: Math.max(...signals.map((s) => s.timestamp)),
      });
    }

    // Sort by confidence descending
    return intents.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Record a dismissal for an intent (applies penalty)
   */
  dismiss(intentId: string): void {
    this.dismissals.set(intentId, Date.now());
    this.saveDismissals();

    // Clear signals for this intent
    this.signals = this.signals.filter(
      (s) => this.signalToIntent(s) !== intentId
    );

    this.notifyListeners();
  }

  /**
   * Permanently suppress an intent (user said "don't show again")
   */
  suppressPermanently(intentId: string): void {
    // Use a far-future timestamp to effectively disable forever
    this.dismissals.set(intentId, Date.now() + 365 * 24 * 60 * 60 * 1000 * 100);
    this.saveDismissals();
    this.notifyListeners();
  }

  /**
   * Clear all signals (e.g., on logout)
   */
  reset(): void {
    this.signals = [];
    this.notifyListeners();
  }

  /**
   * Get current signals (for debugging)
   */
  getSignals(): IntentSignal[] {
    return [...this.signals];
  }

  /**
   * Subscribe to intent changes
   */
  subscribe(listener: (intents: EvaluatedIntent[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    const intents = this.evaluate();
    for (const listener of this.listeners) {
      listener(intents);
    }
  }

  /**
   * Load dismissals from localStorage
   */
  private loadDismissals(): void {
    try {
      const stored = localStorage.getItem(IFLI_DISMISSALS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.dismissals = new Map(Object.entries(parsed));
      }
    } catch {
      // Ignore parse errors
    }
  }

  /**
   * Save dismissals to localStorage
   */
  private saveDismissals(): void {
    try {
      const obj = Object.fromEntries(this.dismissals);
      localStorage.setItem(IFLI_DISMISSALS_KEY, JSON.stringify(obj));
    } catch {
      // Ignore storage errors
    }
  }

  /**
   * Update configuration
   */
  setConfig(config: Partial<IFLIConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Check if IFLI is enabled
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Enable or disable IFLI
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
    if (!enabled) {
      this.notifyListeners();
    }
  }
}

// Singleton instance for the application
export const intentEngine = new IntentEngine();
