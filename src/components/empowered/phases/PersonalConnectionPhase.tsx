/* ─────────────────────────────────────────────
 * Personal Connection Phase
 * Open-ended prompt relating story to child's life.
 * Not scored — engagement only.
 * ───────────────────────────────────────────── */

import { useState } from "react";
import { TactileButton } from "../TactileButton";
import { ProgressHeader } from "./ProgressHeader";
import type { StoryPhaseProps } from "@/types/story";
import dariaSolo from "@/assets/daria-solo.png";

export function PersonalConnectionPhase({ storyData, onComplete, onClose }: StoryPhaseProps) {
  const [started, setStarted] = useState(false);
  const prompt = storyData.personal_connection.prompt;

  function handleDone() {
    onComplete({
      phase: "personal-connection",
      attempts: [],
      first_attempt_accuracy: 1,
      completed: true,
    });
  }

  return (
    <div className="flex h-full flex-col">
      <ProgressHeader
        progress={started ? 50 : 0}
        label="Your turn!"
        onClose={onClose}
      />

      <div className="flex flex-1 flex-col items-center justify-center px-5">
        {!started ? (
          <div className="text-center animate-pop-in">
            <span className="text-6xl mb-4 block">💬</span>
            <h2 className="font-display text-[28px] font-extrabold text-primary mb-3">
              What about you?
            </h2>
            <p className="text-base font-semibold text-ink-soft">
              Let's talk about YOUR story!
            </p>
          </div>
        ) : (
          <div className="w-full animate-slide-up">
            <div className="flex items-start gap-3">
              <img src={dariaSolo} alt="" className="h-16 w-auto object-contain" />
              <div className="flex-1">
                <div className="rounded-2xl rounded-bl-sm bg-sky p-4 shadow-card">
                  <p className="text-base font-semibold leading-snug text-primary">
                    {prompt}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-3xl bg-card p-5 shadow-card border-2 border-dashed border-primary/20">
              <p className="text-center text-ink-soft font-semibold">
                Tell someone near you your answer!
              </p>
              <p className="mt-2 text-center text-sm text-ink-soft/60">
                (Or just think about it in your head)
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mx-5 mb-5">
        {!started ? (
          <TactileButton onClick={() => setStarted(true)}>
            Let's talk!
          </TactileButton>
        ) : (
          <TactileButton onClick={handleDone}>
            I shared my story!
          </TactileButton>
        )}
      </div>
    </div>
  );
}
