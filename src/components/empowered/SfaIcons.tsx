/* ─────────────────────────────────────────────
 * Semantic feature icons (SFA)
 *
 * One simple, child-recognizable glyph per feature
 * used in the Level 1 vocabulary teaching flow.
 * Thick strokes, rounded caps, no fine detail —
 * readable at 40px for a 5-year-old.
 * ───────────────────────────────────────────── */

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** CATEGORY — a box of things that belong together */
export function CategoryIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

/** WHAT IT DOES — a hand doing something */
export function FunctionIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M11 13V4.5a1.5 1.5 0 0 1 3 0V12" />
      <path d="M14 11.5a1.5 1.5 0 0 1 3 0V13" />
      <path d="M17 12.5a1.5 1.5 0 0 1 3 0V16a5 5 0 0 1-5 5h-2.2a5 5 0 0 1-3.9-1.9l-3.3-4.2a1.6 1.6 0 0 1 2.4-2.1L11 15" />
    </svg>
  );
}

/** LOOKS LIKE — an eye */
export function AppearanceIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  );
}

/** PARTS — two puzzle pieces */
export function PartsIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M10.5 3.5h-4a1 1 0 0 0-1 1v3a2 2 0 1 1 0 4v3a1 1 0 0 0 1 1h4" />
      <path d="M13.5 20.5h4a1 1 0 0 0 1-1v-3a2 2 0 1 1 0-4v-3a1 1 0 0 0-1-1h-4" />
    </svg>
  );
}

/** WHERE / WHEN — a map pin with a clock face */
export function LocationIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 21s6.5-5.6 6.5-10.5A6.5 6.5 0 0 0 5.5 10.5C5.5 15.4 12 21 12 21Z" />
      <circle cx="12" cy="10.2" r="2.8" />
      <path d="M12 8.8v1.6l1.2.8" />
    </svg>
  );
}
