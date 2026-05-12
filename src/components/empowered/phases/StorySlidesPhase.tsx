/* ─────────────────────────────────────────────
 * Story Slides Phase
 * Child reads through story slides one at a time.
 * Not scored — engagement tracked.
 * ───────────────────────────────────────────── */

import { useState } from "react";
import { TactileButton } from "../TactileButton";
import { ProgressHeader } from "./ProgressHeader";
import type { StoryPhaseProps, PhaseResult, StorySlide } from "@/types/story";
import { cn } from "@/lib/utils";

const ELEMENT_ICONS: Record<string, string> = {
  character: "👤",
  setting: "📍",
  problem: "❗",
  feeling: "💛",
  action: "➡️",
  solution: "💡",
};

const ELEMENT_LABELS: Record<string, string> = {
  character: "Character",
  setting: "Setting",
  problem: "Problem",
  feeling: "Feeling",
  action: "Action",
  solution: "Solution",
};

export function StorySlidesPhase({ storyData, onComplete, onClose }: StoryPhaseProps) {
  const [page, setPage] = useState(0);
  const slides = storyData.slides;
  const current = slides[page];
  const isLast = page === slides.length - 1;
  const progress = ((page + 1) / slides.length) * 100;

  function handleNext() {
    if (isLast) {
      onComplete({
        phase: "slides",
        attempts: [],
        first_attempt_accuracy: 1, // engagement only
        completed: true,
      });
    } else {
      setPage(page + 1);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <ProgressHeader
        progress={progress}
        label={`${page + 1} of ${slides.length}`}
        onClose={onClose}
      />

      {/* Illustration placeholder */}
      <div key={page} className="mx-5 mt-3 overflow-hidden rounded-3xl bg-card shadow-card animate-pop-in">
        <div className="aspect-[5/4] w-full bg-gradient-to-b from-sky/40 to-cream-deep/30 flex items-center justify-center">
          <div className="text-center">
            <span className="text-6xl">{ELEMENT_ICONS[current.story_element]}</span>
            <p className="mt-2 text-xs font-bold uppercase tracking-wider text-ink-soft/70">
              {ELEMENT_LABELS[current.story_element]}
            </p>
          </div>
        </div>
      </div>

      {/* Story element badge */}
      <div className="mx-5 mt-3 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
          {ELEMENT_ICONS[current.story_element]}
        </span>
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          {ELEMENT_LABELS[current.story_element]}
        </span>
      </div>

      {/* Story text */}
      <div key={`t-${page}`} className="mx-5 mt-2 flex-1 animate-slide-up">
        <p className="font-display text-[22px] leading-[1.45] font-semibold text-primary">
          {current.text}
        </p>
      </div>

      {/* Read-to-me button */}
      <div className="mx-5 mb-3 flex items-center justify-center gap-3">
        <button
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground btn-tactile"
          aria-label="Play audio"
        >
          <svg viewBox="0 0 24 24" className="ml-0.5 h-6 w-6" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-ink-soft">Listen</span>
      </div>

      {/* Navigation */}
      <div className="mx-5 mb-5 flex gap-3">
        {page > 0 && (
          <TactileButton variant="ghost" fullWidth={false} className="px-6" onClick={() => setPage(page - 1)}>
            Back
          </TactileButton>
        )}
        <TactileButton onClick={handleNext}>
          {isLast ? "Done reading" : "Next"}
        </TactileButton>
      </div>
    </div>
  );
}
