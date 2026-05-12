/* ─────────────────────────────────────────────
 * Sentence Builder Phase — Must-Complete
 * Child selects the correct ending for sentence frames.
 * Brain check: "Does your ending tell why?"
 * ───────────────────────────────────────────── */

import { useState, useRef } from "react";
import { TactileButton } from "../TactileButton";
import { ProgressHeader } from "./ProgressHeader";
import type { StoryPhaseProps, ActivityAttempt } from "@/types/story";
import { cn } from "@/lib/utils";
import dariaSolo from "@/assets/daria-solo.png";

type FeedbackState =
  | { type: "none" }
  | { type: "correct"; brainCheck: string }
  | { type: "wrong"; brainCheck: string };

export function SentenceBuilderPhase({ storyData, onComplete, onClose }: StoryPhaseProps) {
  const frames = storyData.sentence_frames;
  const [frameIdx, setFrameIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>({ type: "none" });
  const [attempts, setAttempts] = useState<ActivityAttempt[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [wrongIds, setWrongIds] = useState<Set<string>>(new Set());
  const startTime = useRef(Date.now());

  const frame = frames[frameIdx];
  const progress = (frameIdx / frames.length) * 100;

  function handleCheck() {
    if (!selected) return;

    const elapsed = Date.now() - startTime.current;
    const choice = frame.choices.find((c) => c.id === selected)!;
    const isCorrect = choice.correct;

    const attempt: ActivityAttempt = {
      child_id: "demo",
      story_id: storyData.id,
      activity_type: "sentence_builder",
      question_index: frameIdx,
      attempt_number: currentAttempt,
      selected_option: selected,
      is_correct: isCorrect,
      time_ms: elapsed,
    };
    setAttempts((prev) => [...prev, attempt]);

    if (isCorrect) {
      setFeedback({ type: "correct", brainCheck: frame.brain_check_prompt });
    } else {
      setWrongIds((prev) => new Set(prev).add(selected));
      setFeedback({ type: "wrong", brainCheck: frame.brain_check_prompt });
      setCurrentAttempt((a) => a + 1);
    }
  }

  function handleContinue() {
    if (feedback.type === "correct") {
      if (frameIdx + 1 >= frames.length) {
        const firstAttempts = attempts.filter((a) => a.attempt_number === 1);
        const correctFirst = firstAttempts.filter((a) => a.is_correct).length;
        const accuracy = frames.length > 0 ? correctFirst / frames.length : 0;

        onComplete({
          phase: "sentence-builder",
          attempts: [...attempts],
          first_attempt_accuracy: accuracy,
          completed: true,
        });
        return;
      }
      setFrameIdx(frameIdx + 1);
      setSelected(null);
      setFeedback({ type: "none" });
      setCurrentAttempt(1);
      setWrongIds(new Set());
      startTime.current = Date.now();
    } else {
      setSelected(null);
      setFeedback({ type: "none" });
    }
  }

  const showingFeedback = feedback.type !== "none";

  // Split the frame text at the blank
  const [beforeBlank] = frame.frame_text.split("___");
  const selectedChoice = frame.choices.find((c) => c.id === selected);

  return (
    <div className="flex h-full flex-col">
      <ProgressHeader
        progress={progress}
        label={`Sentence ${frameIdx + 1} of ${frames.length}`}
        onClose={onClose}
      />

      {/* Feedback overlay */}
      {showingFeedback && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm animate-slide-up">
          <div className="w-full rounded-t-[32px] bg-card p-6 pb-8 shadow-soft" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted" />

            <div className="flex items-start gap-3">
              <img src={dariaSolo} alt="" className="h-16 w-auto object-contain" />
              <div className="flex-1">
                <div className={cn(
                  "rounded-2xl rounded-bl-sm p-4 shadow-card",
                  feedback.type === "correct" ? "bg-success/10 border-2 border-success" : "bg-sky",
                )}>
                  <p className="text-base font-semibold leading-snug text-primary">
                    {feedback.type === "correct"
                      ? `Yes! ${feedback.brainCheck} Your ending makes sense!`
                      : `${feedback.brainCheck} Think about the story again.`}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              {feedback.type === "correct" ? (
                <>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success text-success-foreground">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor" strokeWidth="3" fill="none">
                      <path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-lg font-bold text-success">Great sentence!</span>
                </>
              ) : (
                <>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor" strokeWidth="3" fill="none">
                      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span className="text-lg font-bold text-destructive">Let's try again!</span>
                </>
              )}
            </div>

            <div className="mt-5">
              <TactileButton
                variant={feedback.type === "correct" ? "primary" : "secondary"}
                onClick={handleContinue}
              >
                {feedback.type === "correct"
                  ? frameIdx + 1 >= frames.length
                    ? "See results"
                    : "Next sentence"
                  : "Try again"}
              </TactileButton>
            </div>
          </div>
        </div>
      )}

      {/* Sentence frame display */}
      <div key={`frame-${frameIdx}`} className="mx-5 mt-5 animate-slide-up">
        <div className="rounded-3xl bg-card p-5 shadow-card">
          <p className="font-display text-[22px] leading-snug font-semibold text-primary">
            {beforeBlank}
            <span className={cn(
              "inline-block min-w-[120px] border-b-3 mx-1 pb-0.5 text-center transition-all",
              selected ? "border-primary text-primary" : "border-ink-soft/30 text-ink-soft/50",
            )}>
              {selectedChoice ? selectedChoice.text : "___"}
            </span>
          </p>
        </div>
      </div>

      {/* Connective hint */}
      <div className="mx-5 mt-3 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-xs font-bold">
          💡
        </span>
        <span className="text-sm font-semibold text-ink-soft">
          Pick the ending that tells <span className="text-primary font-bold">why</span>
        </span>
      </div>

      {/* Choice chips */}
      <div className="mx-5 mt-4 space-y-3 flex-1 overflow-y-auto no-scrollbar pb-2">
        {frame.choices.map((choice) => {
          const isSelected = selected === choice.id;
          const isDisabled = wrongIds.has(choice.id);
          return (
            <button
              key={choice.id}
              onClick={() => !isDisabled && setSelected(choice.id)}
              disabled={isDisabled}
              className={cn(
                "flex w-full items-center gap-3 rounded-3xl border-2 bg-card p-4 text-left shadow-card transition-all",
                isSelected && "border-primary bg-primary/5 -translate-y-0.5",
                !isSelected && !isDisabled && "border-transparent hover:border-primary/40",
                isDisabled && "opacity-40 border-destructive/30 bg-destructive/5",
              )}
            >
              <span className={cn(
                "flex-1 text-base font-bold",
                isDisabled ? "text-ink-soft line-through" : "text-primary",
              )}>
                {choice.text}
              </span>
            </button>
          );
        })}
      </div>

      {/* Check button */}
      <div className="mx-5 mb-5">
        <TactileButton onClick={handleCheck} disabled={!selected || showingFeedback}>
          Check
        </TactileButton>
      </div>
    </div>
  );
}
