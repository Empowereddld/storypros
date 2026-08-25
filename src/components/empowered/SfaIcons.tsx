/* ─────────────────────────────────────────────
 * Semantic feature icons (SFA)
 *
 * One coordinated icon family for the five semantic
 * categories taught in the Level 1 vocabulary flow.
 *
 * Approved visual metaphors (do not redesign):
 *   category   → circle + square + triangle
 *   function   → gear + right-facing arrow
 *   appearance → eye with accent lines
 *   parts      → circle divided into three sections
 *   location   → location pin with oval base
 *
 * Bold, even linework · rounded caps · no gradients ·
 * generous negative space · readable at 40px.
 * ───────────────────────────────────────────── */

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** WHAT KIND IS IT? (category) — circle, square, triangle */
export function CategoryIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="6.7" r="4.1" />
      <rect x="2.6" y="14" width="7.8" height="7.4" rx="1.6" />
      <path d="M17.6 13.9 21.8 21.4h-8.4Z" />
    </svg>
  );
}

/** WHAT IT DOES? (function) — gear + right arrow */
export function FunctionIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="9.4" cy="12" r="2.9" />
      <path d="M9.4 3.6v2M9.4 18.4v2M3.5 12h-2M17.3 12h-2M5.2 7.8 3.8 6.4M15 17.6l-1.4-1.4M5.2 16.2 3.8 17.6M15 6.4l-1.4 1.4" />
      <path d="M15.6 12h5.9" />
      <path d="m18.7 9 3 3-3 3" />
    </svg>
  );
}

/** WHAT IT LOOKS LIKE? (appearance) — eye + accent lines */
export function AppearanceIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3.1v2.4M5.6 5.1l1.5 1.9M18.4 5.1l-1.5 1.9" />
      <path d="M2.4 14.6S6.1 8.9 12 8.9s9.6 5.7 9.6 5.7S17.9 20.3 12 20.3 2.4 14.6 2.4 14.6Z" />
      <circle cx="12" cy="14.6" r="3.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** WHAT ARE ITS PARTS? (parts) — circle split into three sections */
export function PartsIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9.2" />
      <path d="M12 12V2.8" />
      <path d="M12 12l8 4.6" />
      <path d="M12 12 4 16.6" />
    </svg>
  );
}

/** WHERE YOU FIND IT? (location) — pin + oval base */
export function LocationIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 18.4c3-3.4 5.9-6 5.9-9.3A5.9 5.9 0 0 0 6.1 9.1c0 3.3 2.9 5.9 5.9 9.3Z" />
      <circle cx="12" cy="9" r="2.5" />
      <ellipse cx="12" cy="18.8" rx="6.8" ry="2.3" />
    </svg>
  );
}
