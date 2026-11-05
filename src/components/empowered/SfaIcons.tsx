/* ─────────────────────────────────────────────
 * Semantic feature icons (SFA)
 *
 * One coordinated icon family for the five semantic
 * categories taught in the Level 1 vocabulary flow.
 *
 * Approved visual metaphors (do not redesign):
 *   category   → circle + square + triangle
 *   function   → two meshing gears (same design, two sizes)
 *   appearance → eye with accent lines
 *   parts      → circle divided into four quarters, one pulled out
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

/** WHAT IT DOES? (function) — two meshing gears, same design at two sizes */
export function FunctionIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M13.50 8.42 L15.15 8.62 L15.15 10.18 L13.50 10.38 L12.76 12.18 L13.78 13.49 L12.69 14.58 L11.38 13.56 L9.58 14.30 L9.38 15.95 L7.82 15.95 L7.62 14.30 L5.82 13.56 L4.51 14.58 L3.42 13.49 L4.44 12.18 L3.70 10.38 L2.05 10.18 L2.05 8.62 L3.70 8.42 L4.44 6.62 L3.42 5.31 L4.51 4.22 L5.82 5.24 L7.62 4.50 L7.82 2.85 L9.38 2.85 L9.58 4.50 L11.38 5.24 L12.69 4.22 L13.78 5.31 L12.76 6.62Z" />
      <circle cx="8.6" cy="9.4" r="2" />
      {/* exact miniature of the gear above: 8 teeth, same profile, stroke scaled with it */}
      <path strokeWidth={1.5} d="M20.70 16.54 L21.83 17.03 L21.50 18.13 L20.29 17.93 L19.37 19.05 L19.83 20.20 L18.82 20.75 L18.10 19.74 L16.66 19.90 L16.17 21.03 L15.07 20.70 L15.27 19.49 L14.15 18.57 L13.00 19.03 L12.45 18.02 L13.46 17.30 L13.30 15.86 L12.17 15.37 L12.50 14.27 L13.71 14.47 L14.63 13.35 L14.17 12.20 L15.18 11.65 L15.90 12.66 L17.34 12.50 L17.83 11.37 L18.93 11.70 L18.73 12.91 L19.85 13.83 L21.00 13.37 L21.55 14.38 L20.54 15.10Z" />
      <circle cx="17" cy="16.2" r="1.48" strokeWidth={1.5} />
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
      <path d="M10.8 13.2V5.2A8 8 0 1 0 18.8 13.2Z" />
      <path d="M10.8 13.2H2.8M10.8 13.2V21.2" />
      <path d="M13.2 10.8V2.8A8 8 0 0 1 21.2 10.8Z" />
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

/** SIMILAR WORDS (synonyms, feeling words) — two speech bubbles with an equals sign */
export function SynonymsIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 4.5h10a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5H8l-3 2.5v-2.5H3A1.5 1.5 0 0 1 1.5 11V6A1.5 1.5 0 0 1 3 4.5Z" />
      <path d="M17.5 9.5H21a1.5 1.5 0 0 1 1.5 1.5v5A1.5 1.5 0 0 1 21 17.5h-1v2.5l-3-2.5h-4a1.5 1.5 0 0 1-1.5-1.5v-1" />
      <path d="M5.5 7.6h5M5.5 9.6h5" />
    </svg>
  );
}
