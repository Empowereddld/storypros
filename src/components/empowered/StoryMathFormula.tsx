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
        "select-none font-display text-[30px] font-extrabold leading-none text-primary/50 sm:text-[36px]",
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
        "mx-auto max-w-[520px] rounded-3xl border border-accent/50 bg-card p-5 shadow-card sm:p-8",
        className,
      )}
    >
      <p className="mb-5 text-center text-[13px] font-extrabold uppercase tracking-[0.14em] text-primary/75 sm:mb-6 sm:text-[15px]">
        Think of it like a math formula
      </p>

      {/* The equation surface — faint tint + grid lines nod to math paper */}
      <div
        className="rounded-2xl border border-accent/40 bg-accent/15 px-4 py-5 sm:px-7 sm:py-7"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(82,29,153,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(82,29,153,0.045) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      >
        {/* Column arithmetic: terms stacked, one + in the left gutter of the last row */}
        <div className="mx-auto w-full max-w-[330px]">
          <div className="grid grid-cols-[36px_1fr] items-center gap-y-2.5 sm:grid-cols-[44px_1fr] sm:gap-y-3">
            {FORMULA.map((item, index) => {
              const key = item.element as StoryElement;
              const Icon = ELEMENT_ICONS[key] ?? User;
              const colors = ELEMENT_COLORS[key] ?? ELEMENT_COLORS.character;
              const isLast = index === FORMULA.length - 1;
              return (
                <div key={item.label} className="col-span-2 grid grid-cols-subgrid items-center">
                  <span className="flex items-center justify-start">
                    {isLast && <Operator symbol="+" />}
                  </span>
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-sm",
                        colors.bg,
                        colors.text,
                      )}
                      aria-hidden
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-[15px] font-extrabold leading-tight text-primary sm:text-[16.5px]">
                      {item.label}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>

          {/* the rule under the column, then the answer */}
          <div className="mt-3 h-[3px] w-full rounded-full bg-primary/35 sm:mt-4" aria-hidden />

          <div className="mt-4 grid grid-cols-[36px_1fr] items-center sm:mt-5 sm:grid-cols-[44px_1fr]">
            <span aria-hidden />
            <div className="flex">
              <div className="flex items-center rounded-full bg-primary px-5 py-2.5 text-primary-foreground shadow-[0_8px_18px_rgba(82,29,153,0.22)]">
                <span className="text-[14px] font-extrabold sm:text-[15px]">A Complete Story</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

