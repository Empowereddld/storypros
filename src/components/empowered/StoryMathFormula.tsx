/* ─────────────────────────────────────────────
 * StoryMathFormula
 * A simple visual metaphor: story elements work
 * together like a math equation to make a complete story.
 * ───────────────────────────────────────────── */

import type { ComponentType } from "react";
import { User, MapPin, TriangleAlert, Heart, Hand, CheckCircle2, Plus, Equal } from "lucide-react";
import type { StoryElement } from "@/types/story";
import { cn } from "@/lib/utils";

const ELEMENT_ICONS: Record<StoryElement, ComponentType<{ className?: string }>> = {
  character: User,
  place: MapPin,
  problem: TriangleAlert,
  emotion: Heart,
  action: Hand,
  result: CheckCircle2,
};

const ELEMENT_COLORS: Record<StoryElement, { bg: string; text: string }> = {
  character: { bg: "bg-element-character", text: "text-element-character-foreground" },
  place: { bg: "bg-element-place", text: "text-element-place-foreground" },
  problem: { bg: "bg-element-problem", text: "text-element-problem-foreground" },
  emotion: { bg: "bg-element-emotion", text: "text-element-emotion-foreground" },
  action: { bg: "bg-element-action", text: "text-element-action-foreground" },
  result: { bg: "bg-element-result", text: "text-element-result-foreground" },
};

const FORMULA = [
  { element: "character", label: "Character" },
  { element: "place", label: "Place" },
  { element: "problem", label: "Problem" },
  { element: "emotion", label: "Feeling" },
  { element: "action", label: "Action" },
  { element: "result", label: "Result" },
] as const;

export function StoryMathFormula({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-3xl border border-accent/50 bg-card p-5 shadow-card sm:p-6", className)}>
      <p className="mb-4 text-center text-sm font-semibold leading-snug text-ink-soft sm:text-base">
        Think of it like a math formula: each part adds up to a complete story.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {FORMULA.map((item, index) => {
          const key = item.element as StoryElement;
          const Icon = ELEMENT_ICONS[key] ?? User;
          const colors = ELEMENT_COLORS[key] ?? ELEMENT_COLORS.character;
          const isLast = index === FORMULA.length - 1;
          return (
            <div key={item.label} className="flex items-center gap-2 sm:gap-3">
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full sm:h-10 sm:w-10",
                  colors.bg,
                  colors.text,
                )}
                aria-hidden
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>
              <span className="text-[12px] font-extrabold text-primary sm:text-[13px]">{item.label}</span>
              {!isLast && (
                <Plus className="h-4 w-4 shrink-0 text-secondary-foreground/50" aria-hidden />
              )}
            </div>
          );
        })}
        <Equal className="h-5 w-5 shrink-0 text-primary/70" aria-hidden />
        <div className="flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-white shadow-sm">
          <span className="text-[12px] font-extrabold sm:text-[13px]">A Complete Story</span>
        </div>
      </div>
    </div>
  );
}
