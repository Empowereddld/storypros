/* ─────────────────────────────────────────────
 * StoryElementFramework
 * The six Story Pros story elements shown as one
 * connected sequence. Icons and colour tokens are
 * the exact same ones the story engine uses
 * (see phases/StorySlidesPhase.tsx).
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

interface StoryElementFrameworkProps {
  items: readonly { element: StoryElement | string; label: string }[];
  className?: string;
}

export function StoryElementFramework({ items, className }: StoryElementFrameworkProps) {
  return (
    <div className={cn("relative", className)}>
      {/* subtle connecting line behind the icon row */}
      <span
        className="pointer-events-none absolute left-[8%] right-[8%] top-[22px] hidden h-px bg-primary/15 sm:block"
        aria-hidden
      />
      <ul className="relative grid grid-cols-3 gap-y-6 sm:grid-cols-6 sm:gap-x-1">
        {items.map((item) => {
          const key = item.element as StoryElement;
          const Icon = ELEMENT_ICONS[key] ?? User;
          const colors = ELEMENT_COLORS[key] ?? ELEMENT_COLORS.character;
          return (
            <li key={item.label} className="flex flex-col items-center gap-2 text-center">
              <span
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full ring-4 ring-card",
                  colors.bg,
                  colors.text,
                )}
                aria-hidden
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-[12.5px] font-extrabold leading-tight text-primary">
                {item.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

