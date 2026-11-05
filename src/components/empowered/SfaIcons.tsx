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
      <path d="M13.50 8.42 L15.15 8.62 L15.15 10.18 L13.50 10.38 L12.76 12.18 L13.78 13.49 L12.69 14.58 L11.38 13.56 L9.58 14.30 L9.38 15.95 L7.82 15.95 L7.62 14.30 L5.82 13.56 L4.51 14.58 L3.42 13.49 L4.44 12.18 L3.70 10.38 L2.05 10.18 L2.05 8.62 L3.70 8.42 L4.44 6.62 L3.42 5.31 L4.51 4.22 L5.82 5.24 L7.62 4.50 L7.82 2.85 L9.38 2.85 L9.58 4.50 L11.38 5.24 L12.69 4.22 L13.78 5.31 L12.76 6.62Z" />
      <circle cx="8.6" cy="9.4" r="2" />
      <path d="M20.38 17.11 L21.57 17.96 L20.81 19.28 L19.47 18.67 L17.91 19.58 L17.77 21.04 L16.23 21.04 L16.09 19.58 L14.53 18.67 L13.19 19.28 L12.43 17.96 L13.62 17.11 L13.62 15.29 L12.43 14.44 L13.19 13.12 L14.53 13.73 L16.09 12.82 L16.23 11.36 L17.77 11.36 L17.91 12.82 L19.47 13.73 L20.81 13.12 L21.57 14.44 L20.38 15.29Z" />
      <circle cx="17" cy="16.2" r="1.4" />
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
