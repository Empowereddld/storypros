/* ─────────────────────────────────────────────
 * Feature flags
 * Flip these to bring hidden surfaces back —
 * the code paths behind them stay intact.
 * ───────────────────────────────────────────── */

export const FEATURES = {
  /**
   * SLP / teacher accounts, sharing codes, caseload dashboard.
   * Hidden for the parent-first web launch: signup assumes parent.
   */
  slp: false,

  /**
   * The "Grown-Up Check" gate on settings/paywall.
   * Off for web (kids may click around freely); required again
   * for app-store Kids Category builds.
   */
  parentGate: false,

  /** Floating decorative stars / mini paper planes. */
  decorations: false,
} as const;
