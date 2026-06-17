/* ─────────────────────────────────────────────
 * Immediate Retell Phase
 * Child retells the story in their own words using
 * the story-element cues. Not scored in V1 (no speech
 * recognition yet) — the record button is a guided cue.
 * ───────────────────────────────────────────── */

import { useState } from "react";
import { TactileButton } from "../TactileButton";
import { ProgressHeader } from "./ProgressHeader";
import type { StoryPhaseProps, StoryElement } from "@/types/story";
import dariaAndFriend from "@/assets/daria-and-friend.webp";

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
  const [recording, setRecording] = useState(false);
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
    <div className="flex h-full flex-col bg-background">
      <ProgressHeader progress={recording ? 60 : 30} label="Retell" onClose={onClose} />

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-4">
        {/* Heading */}
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent text-xl">📖</span>
          <div>
            <h2 className="font-display text-[24px] font-extrabold leading-tight text-primary">Retell the Story</h2>
            <p className="text-sm font-semibold text-ink-soft">Tell it back in your own words.</p>
          </div>
        </div>

        {/* Character prompt bubble */}
        <div className="mt-4 flex items-center gap-3">
          <img src={dariaAndFriend} alt="" className="h-20 w-auto object-contain" />
          <div className="relative flex-1 rounded-2xl rounded-bl-sm border-2 border-secondary/50 bg-secondary/10 p-3">
            <p className="text-sm font-bold leading-snug text-primary">Can you retell what happened?</p>
          </div>
        </div>

        {/* Element cue cards */}
        <p className="mt-5 text-sm font-bold uppercase tracking-wider text-ink-soft/70">Use these story parts</p>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {elements.map((el) => (
            <div key={el} className="flex items-center gap-3 rounded-2xl border border-accent/60 bg-card p-3.5 shadow-card">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky text-2xl">
                {ELEMENT_ICONS[el]}
              </span>
              <span className="text-sm font-bold text-primary">{ELEMENT_LABELS[el]}</span>
            </div>
          ))}
        </div>

        {/* Record state */}
        {recording && (
          <div className="mt-5 flex flex-col items-center rounded-3xl border-2 border-primary/30 bg-primary/5 p-5 animate-slide-up">
            <div className="flex h-9 items-end gap-1">
              {[6, 14, 22, 30, 22, 14, 8, 18, 28, 16, 8].map((h, i) => (
                <span
                  key={i}
                  className="w-1.5 rounded-full bg-primary/70 animate-pulse"
                  style={{ height: h + "px", animationDelay: (i * 80) + "ms" }}
                />
              ))}
            </div>
            <p className="mt-3 text-sm font-bold text-primary">Listening… tell your story out loud!</p>
          </div>
        )}
      </div>

      {/* Action */}
      <div className="mx-5 mb-5">
        {!recording ? (
          <TactileButton
            variant="secondary"
            onClick={() => setRecording(true)}
            leadingIcon={
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <rect x="9" y="3" width="6" height="12" rx="3" />
                <path d="M5 11a7 7 0 0014 0M12 18v3" strokeLinecap="round" />
              </svg>
            }
          >
            Record My Retell
          </TactileButton>
        ) : (
          <TactileButton onClick={handleDone}>I told the story! →</TactileButton>
        )}
      </div>
    </div>
  );
}
