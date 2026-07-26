/* ─────────────────────────────────────────────
 * Legal page details — FILL THESE IN (Camesha)
 * One place for the facts the privacy policy and
 * terms of service render. Anything still reading
 * like a placeholder shows on the live pages.
 * ───────────────────────────────────────────── */

export const LEGAL = {
  /** Registered business name, e.g. "Empowered DLD Inc." */
  businessName: "Empowered DLD",
  /** Support / privacy contact inbox */
  contactEmail: "[contact email coming soon]",
  /** Province whose law governs (e.g. "Ontario") */
  province: "[province]",
  /** When these documents take effect */
  effectiveDate: "July 2026 (beta)",
  /** Monthly premium price shown in the terms */
  premiumPrice: "$7.99 USD/month per child, after a 7-day free trial",
} as const;

/** True while any placeholder is unfilled — shows a subtle note on the pages */
export const LEGAL_HAS_PLACEHOLDERS = Object.values(LEGAL).some((value) =>
  value.includes("["),
);
