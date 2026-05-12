/* ─────────────────────────────────────────────
 * Delayed Retell Phase
 * Child retells story using tappable element icons.
 * Not scored in V1 (retell domain dormant).
 * Placed AFTER vocab + grammar activities.
 * ───────────────────────────────────────────── */

import { useState } from "react";
import { TactileButton } from "../TactileButton";
import { ProgressHeader } from "./ProgressHeader";
import type { StoryPhaseProps, StoryElement } from "@/types/story";
import { cn } from "@/lib/utils";

const ELEMENT_ICONS: Record<StoryElement, string> = {
  character: "👤",
  setting: "📍",
  problem: "❗",
  feeling: "💛",
  action: "➡️",
  solution: "💡",
};

const ELEMENT_LABELS: Record<StoryElement, string> = {
  character: "Who",
  setting: "Where",
  problem: "Problem",
  feeling: "Feeling",
  action: "What happened",
  solution: "Solution",
};

export function DelayedRetellPhase({ storyData, onComplete, onClose }: StoryPhaseProps) {
  const elements = storyData.retell_prompts.story_elements;
  const [tapped, setTapped] = useState<Set<number>>(new Set());
  const [started, setStarted] = useState(false);

  const progress = started ? ((tapped.size / elements.length) * 80 + 20) : 0;

  function handleTap(idx: number) {
    setTapped((prev) => new Set(prev).add(idx));
  }

  function handleDone() {
    onComplete({
      phase: "delayed-retell",
      attempts: [],
      first_attempt_accuracy: 1, // not scored V1
      completed: true,
    });
  }

  return (
    <div className="flex h-full flex-col">
      <ProgressHeader
        progress={progress}
        label="Tell it again!"
        onClose={onClose}
      />

      {!started ? (
        <div className="flex flex-1 flex-col items-center justify-center px-5 animate-pop-in">
          <span className="text-6xl mb-4">🧠</span>
          <h2 className="font-display text-[28px] font-extrabold text-primary text-center mb-3">
            Remember the story?
          </h2>
          <p className="text-base font-semibold text-ink-soft text-center mb-2">
            {storyData.retell_prompts.delayed}
          </p>
          <p className="text-sm text-ink-soft/70 text-center">
            Tap each story part as you talk about it.
          </p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col px-5 mt-4 animate-slide-up">
          <h2 className="font-display text-[22px] font-extrabold text-primary mb-4">
            Tap each part as you tell it
          </h2>
          <div className="space-y-3 flex-1">
            {elements.map((el, idx) => {
              const isTapped = tapped.has(idx);
              return (
                <button
                  key={el}
                  onClick={() => handleTap(idx)}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-2xl border-2 bg-card p-4 shadow-card transition-all",
                    isTapped && "border-success bg-success/5 scale-[0.98]",
                    !isTapped && "border-transparent hover:border-primary/40",
                  )}
                >
                  <span className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl transition-all",
                    isTapped ? "bg-success/20" : "bg-sky",
                  )}>
                    {ELEMENT_ICONS[el]}
                  </span>
                  <span className={cn(
                    "flex-1 text-lg font-bold text-left",
                    isTapped ? "text-success" : "text-primary",
                  )}>
                    {ELEMENT_LABELS[el]}
                  </span>
                  {isTapped && (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-success text-success-foreground">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" stroke="currentColor" strokeWidth="3" fill="none">
                        <path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mx-5 mb-5">
        {!started ? (
          <TactileButton onClick={() => setStarted(true)}>
            Let's go!
          </TactileButton>
        ) : (
          <TactileButton onClick={handleDone} disabled={tapped.size < elements.length}>
            I told the whole story!
          </TactileButton>
        )}
      </div>
    </div>
  );
}
