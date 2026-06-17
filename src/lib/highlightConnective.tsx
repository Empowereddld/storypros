/* ─────────────────────────────────────────────
 * Shared connective highlighter
 * Wraps occurrences of the target connective
 * (e.g. "because", "so", "and then") in a
 * highlighted span. Regex-escapes the input so
 * connectives with special characters can't
 * break the pattern.
 * ───────────────────────────────────────────── */

import type { ReactNode } from "react";

/** Escape regex metacharacters in a string */
function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Highlight occurrences of the target connective in story text */
export function highlightConnective(text: string, connective: string): ReactNode {
  if (!connective) return text;
  const regex = new RegExp(`(\\b${escapeRegExp(connective)}\\b)`, "gi");
  const parts = text.split(regex);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    part.toLowerCase() === connective.toLowerCase() ? (
      <span key={i} className="inline-block rounded-lg bg-secondary/25 px-1 font-extrabold text-secondary-foreground">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}
