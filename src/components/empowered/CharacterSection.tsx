/* ─────────────────────────────────────────────
 * CharacterSection
 * A scroll-revealed band with Dan & Daria on one
 * side and content on the other. Alternate `side`
 * down the page for the zig-zag rhythm.
 *
 * The art slides in from its own side, the text
 * slides in from the other, and the characters keep
 * a gentle float/bob once settled.
 * ───────────────────────────────────────────── */

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/lib/useScrollReveal";

interface CharacterSectionProps {
  /** Which side the character art sits on (desktop) */
  side: "left" | "right";
  image: string;
  /** Decorative art gets an empty alt */
  imageAlt?: string;
  children: ReactNode;
  id?: string;
  className?: string;
  /** Idle motion once revealed */
  motion?: "float" | "bob" | "none";
  /** Bigger art for hero-ish bands */
  imageSize?: "md" | "lg";
}

export function CharacterSection({
  side,
  image,
  imageAlt = "",
  children,
  id,
  className,
  motion = "none",
  imageSize = "md",
}: CharacterSectionProps) {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section id={id} ref={ref} className={cn("scroll-mt-20 overflow-hidden", className)}>
      <div
        className={cn(
          "mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-16 sm:px-6 lg:gap-14",
          "lg:grid-cols-2",
        )}
      >
        {/* Art */}
        <div
          className={cn(
            "relative mx-auto w-full max-w-sm transition-all duration-700 ease-out lg:max-w-none",
            side === "right" && "lg:order-2",
            revealed
              ? "translate-x-0 opacity-100"
              : cn("opacity-0", side === "left" ? "-translate-x-10" : "translate-x-10"),
          )}
        >
          <span
            className="pointer-events-none absolute inset-x-6 bottom-2 h-28 rounded-full bg-primary/10 blur-2xl"
            aria-hidden
          />
          <img
            src={image}
            alt={imageAlt}
            loading="lazy"
            className={cn(
              "relative z-10 mx-auto w-auto object-contain drop-shadow-[0_20px_32px_rgba(63,38,140,0.18)]",
              imageSize === "lg" ? "h-64 lg:h-[340px]" : "h-52 lg:h-72",
              revealed && motion === "float" && "animate-float",
              revealed && motion === "bob" && "animate-bob",
            )}
          />
        </div>

        {/* Content */}
        <div
          className={cn(
            "transition-all duration-700 ease-out",
            side === "right" && "lg:order-1",
            revealed
              ? "translate-x-0 opacity-100 delay-150"
              : cn("opacity-0", side === "left" ? "translate-x-10" : "-translate-x-10"),
          )}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

/** Fades/lifts any block into view when it scrolls in */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: revealed ? `${delay}ms` : "0ms" }}
      className={cn(
        "transition-all duration-700 ease-out",
        revealed ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
