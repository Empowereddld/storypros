/* ─────────────────────────────────────────────
 * Immediate Retell Phase
 * Simple prompt — child retells story verbally.
 * Not scored in V1 (retell domain dormant).
 * Shows story element icons as visual cues.
 * ───────────────────────────────────────────── */

import { useState } from "react";
import { TactileButton } from "../TactileButton";
import { ProgressHeader } from "./ProgressHeader";
import type { StoryPhaseProps, StoryElement } from "@/types/story";
import { cn } from "@/lib/utils";

const ELEMENT_ICONS: Record<StoryElement, string> = {
  character: "👤",
  place: "📍",
  problem: "❗",
  emotion: "💛",
  action: "➡️",
  result: "💡",
};

const ELEMENT_LABELS: Record<StoryElement, string> = {
  character: "Who",
  place: "Where",
  problem: "Problem",
  emotion: "Emotion",
  action: "What happened",
  result: "Result",
};

export function ImmediateRetellPhase({ storyData, onComplete, onClose }: StoryPhaseProps) {
  const [started, setStarted] = useState(false);
  const elements = storyData.retell_prompts.story_elements;

  function handleDone() {
    onComplete({
      phase: "immediate-retell",
      attempts: [],
      first_attempt_accuracy: 1, // not scored V1
      completed: true,
    });
  }

  return (
    <div className="flex h-full flex-col">
      <ProgressHeader
        progress={started ? 50 : 0}
        label="Retell"
        onClose={onClose}
      />

      <div className="flex flex-1 flex-col items-center justify-center px-5">
        {!started ? (
          <div className="text-center animate-pop-in">
            <span className="text-6xl mb-4 block">🗣️</span>
            <h2 className="font-display text-[28px] font-extrabold text-primary mb-3">
              Your turn to tell the story!
            </h2>
            <p className="text-base font-semibold text-ink-soft mb-6">
              {storyData.retell_prompts.immediate}
            </p>
          </div>
        ) : (
          <div className="w-full animate-slide-up">
            <h2 className="font-display text-[24px] font-extrabold text-primary text-center mb-5">
              Use these story parts to help you!
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {elements.map((el) => (
                <div
                  key={el}
                  className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-card border-2 border-transparent"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky text-2xl">
                    {ELEMENT_ICONS[el]}
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {ELEMENT_LABELS[el]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mx-5 mb-5">
        {!started ? (
          <TactileButton onClick={() => setStarted(true)}>
            I'm ready!
          </TactileButton>
        ) : (
          <TactileButton onClick={handleDone}>
            I'm done telling the story
          </TactileButton>
        )}
      </div>
    </div>
  );
}
