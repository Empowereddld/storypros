/* ─────────────────────────────────────────────
 * StoryMathFormula
 * A simple visual metaphor: story elements work
 * together like a math equation to make a complete story.
 * ───────────────────────────────────────────── */

import type { ComponentType } from "react";
import { User, MapPin, TriangleAlert, Heart, Hand, CheckCircle2 } from "lucide-react";
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

/** Big, deliberate math operator — the point of the whole section. */
function Operator({ symbol, className }: { symbol: "+" | "="; className?: string }) {
  return (
    <span
      className={cn(
        "select-none font-display text-[22px] font-extrabold leading-none text-primary/45 sm:text-[24px]",
        className,
      )}
      aria-hidden
    >
      {symbol}
    </span>
  );
}

export function StoryMathFormula({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-accent/50 bg-card p-5 shadow-card sm:p-8",
        className,
      )}
    >
      <p className="mb-5 text-center text-[11px] font-extrabold uppercase tracking-[0.14em] text-primary/70 sm:mb-6 sm:text-xs">
        Think of it like a math formula
      </p>

      {/* The equation surface — faint tint + grid lines nod to math paper */}
      <div
        className="rounded-2xl border border-accent/40 bg-accent/15 px-3 py-5 sm:px-6 sm:py-7"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(82,29,153,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(82,29,153,0.045) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      >
        {/* terms: 6 stacked on mobile, 3+3 on tablet, one line on desktop */}
        <div className="grid grid-cols-1 gap-y-2.5 sm:grid-cols-3 sm:gap-x-1 sm:gap-y-4 lg:grid-cols-6">
          {FORMULA.map((item, index) => {
            const key = item.element as StoryElement;
            const Icon = ELEMENT_ICONS[key] ?? User;
            const colors = ELEMENT_COLORS[key] ?? ELEMENT_COLORS.character;
            const isLast = index === FORMULA.length - 1;
            return (
              <div
                key={item.label}
                className="flex items-center justify-start gap-2.5 sm:justify-center sm:gap-2"
              >
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-sm sm:h-10 sm:w-10 lg:h-11 lg:w-11",
                    colors.bg,
                    colors.text,
                  )}
                  aria-hidden
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-[14px] font-extrabold leading-tight text-primary sm:text-[13.5px] lg:text-[14.5px]">
                  {item.label}
                </span>
                {!isLast && <Operator symbol="+" className="ml-1" />}
              </div>
            );
          })}
        </div>

        {/* the equals moment — a real rule, so the conclusion feels earned */}
        <div className="mt-5 flex items-center gap-3 sm:mt-6 sm:justify-center">
          <span className="h-px flex-1 bg-primary/15 sm:hidden" aria-hidden />
          <Operator symbol="=" className="text-primary/60" />
          <div className="flex items-center rounded-full bg-primary px-5 py-2.5 text-primary-foreground shadow-[0_8px_18px_rgba(82,29,153,0.22)]">
            <span className="text-[14px] font-extrabold sm:text-[15px]">A Complete Story</span>
          </div>
          <span className="h-px flex-1 bg-primary/15 sm:hidden" aria-hidden />
        </div>
      </div>
    </div>
  );
}
