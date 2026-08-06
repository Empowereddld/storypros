/* ─────────────────────────────────────────────
 * PreviewCarousel
 * A compact, swipeable peek inside Story Pros.
 * One centred tablet frame, arrow + swipe + dot
 * navigation, one short caption per screen.
 *
 * The slides currently hold labelled placeholders.
 * Drop a real screenshot into `image` on each slide
 * and the layout, sizing and behaviour stay identical.
 * ───────────────────────────────────────────── */

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import readListenAsset from "@/assets/preview-read-listen.png.asset.json";
import storyWordsAsset from "@/assets/preview-story-words.png.asset.json";

interface PreviewSlide {
  label: string;
  caption: string;
  /** Final Story Pros screenshot. Placeholder surface shows until set. */
  image?: string;
}

const SLIDES: PreviewSlide[] = [
  {
    label: "Read & Listen",
    caption: "Read or listen to a short story, one page at a time.",
    image: readListenAsset.url,
  },
  {
    label: "Story Words",
    caption: "Learn important words in context, not just definitions.",
    image: storyWordsAsset.url,
  },

  { label: "Check Understanding", caption: "Answer supported questions and build understanding." },
  { label: "Put It in Order & Retell", caption: "Organize the story, then retell it in your own words." },
  { label: "Family Dashboard", caption: "See what was practised and what to try next at home." },
];


export function PreviewCarousel() {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const go = (next: number) => setIndex((next + SLIDES.length) % SLIDES.length);
  const slide = SLIDES[index];

  return (
    <div className="mt-8 flex flex-col items-center">
      <div className="flex w-full items-center justify-center gap-3 sm:gap-5">
        <ArrowButton
          direction="prev"
          onClick={() => go(index - 1)}
          className="hidden sm:inline-flex"
        />

        <div
          className="w-full max-w-[400px]"
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const delta = e.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(delta) > 40) go(index + (delta < 0 ? 1 : -1));
            touchStartX.current = null;
          }}
        >
          <div className="relative rounded-[22px] border-[8px] border-ink/85 bg-cream shadow-[0_22px_50px_-16px_rgba(28,28,21,0.35)]">
            <div className="overflow-hidden rounded-[14px] bg-card">
              {/* Landscape frame — matches the real screenshots once added */}
              <div className="relative aspect-[4/3] w-full">
                {slide.image ? (
                  <img
                    src={slide.image}
                    alt={slide.label}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-accent/35 px-8">
                    <p className="text-center text-sm font-extrabold uppercase tracking-[0.14em] text-primary/70">
                      {slide.label}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ArrowButton
          direction="next"
          onClick={() => go(index + 1)}
          className="hidden sm:inline-flex"
        />
      </div>

      {/* Caption */}
      <p className="mt-6 min-h-[52px] max-w-md text-center text-base font-medium leading-relaxed text-ink-soft">
        <span className="mb-1 block text-sm font-extrabold text-primary">{slide.label}</span>
        {slide.caption}
      </p>

      {/* Controls: dots always, arrows on mobile too */}
      <div className="mt-3 flex items-center gap-4">
        <ArrowButton direction="prev" onClick={() => go(index - 1)} className="sm:hidden" />
        <div className="flex items-center gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setIndex(i)}
              aria-label={`Show ${s.label}`}
              aria-current={i === index}
              className={cn(
                "h-2.5 rounded-full transition-all",
                i === index ? "w-7 bg-primary" : "w-2.5 bg-primary/25 hover:bg-primary/40",
              )}
            />
          ))}
        </div>
        <ArrowButton direction="next" onClick={() => go(index + 1)} className="sm:hidden" />
      </div>
    </div>
  );
}

function ArrowButton({
  direction,
  onClick,
  className,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  className?: string;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous screen" : "Next screen"}
      className={cn(
        "press-pop inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-primary/30 bg-card text-primary transition-colors hover:bg-primary/5",
        className,
      )}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
