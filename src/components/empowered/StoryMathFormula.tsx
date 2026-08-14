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
    <div
      className={cn(
        "rounded-3xl border border-accent/50 bg-card p-6 shadow-card sm:p-8",
        className,
      )}
    >
      <p className="mb-5 text-center text-sm font-semibold leading-snug text-ink-soft sm:text-base">
        Think of it like a math formula:{"\u00a0"}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-3 sm:gap-x-3">
        {FORMULA.map((item, index) => {
          const key = item.element as StoryElement;
          const Icon = ELEMENT_ICONS[key] ?? User;
          const colors = ELEMENT_COLORS[key] ?? ELEMENT_COLORS.character;
          const isLast = index === FORMULA.length - 1;
          return (
            <div key={item.label} className="flex items-center gap-2 sm:gap-2.5">
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full sm:h-11 sm:w-11",
                  colors.bg,
                  colors.text,
                )}
                aria-hidden
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-[13px] font-extrabold text-primary sm:text-[14.5px]">
                {item.label}
              </span>
              {!isLast && (
                <Plus className="ml-1 h-4 w-4 shrink-0 text-secondary-foreground/50" aria-hidden />
              )}
            </div>
          );
        })}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Equal className="h-5 w-5 shrink-0 text-primary/70" aria-hidden />
          <div className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-white shadow-sm">
            <span className="text-[13px] font-extrabold sm:text-[14.5px]">A Complete Story</span>
          </div>
        </div>
      </div>
    </div>
  );
}

