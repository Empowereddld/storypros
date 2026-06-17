/* ─────────────────────────────────────────────
 * Sequencing Phase — Must-Complete
 * Child puts 6 story frames in correct order.
 * Tap-to-select ordering (mobile-friendly).
 * Retry until correct.
 * ───────────────────────────────────────────── */

import { useState, useRef, useCallback } from "react";
import { TactileButton } from "../TactileButton";
import { ProgressHeader } from "./ProgressHeader";
import type { StoryPhaseProps, ActivityAttempt, SequencingFrame } from "@/types/story";
import { cn } from "@/lib/utils";
import dariaSolo from "@/assets/daria-solo.png";

type FeedbackState =
  | { type: "none" }
  | { type: "correct" }
  | { type: "wrong"; wrongPositions: Set<number> };

/** Shuffle array using Fisher-Yates */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function SequencingPhase({ storyData, onComplete, onClose, childId = "demo" }: StoryPhaseProps) {
  const frames = storyData.sequencing_frames;
  const [shuffled] = useState<SequencingFrame[]>(() => shuffle(frames));
  const [order, setOrder] = useState<number[]>([]); // indices into shuffled
  const [feedback, setFeedback] = useState<FeedbackState>({ type: "none" });
  const [attempts, setAttempts] = useState<ActivityAttempt[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const startTime = useRef(Date.now());
  // Fraction of frames placed correctly on the FIRST attempt (partial credit)
  const firstAttemptFraction = useRef<number | null>(null);

  const progress = feedback.type === "correct" ? 100 : (order.length / frames.length) * 80;

  function handleSelectFrame(idx: number) {
    if (order.includes(idx)) {
      // Deselect — remove this and all after it
      const pos = order.indexOf(idx);
      setOrder(order.slice(0, pos));
    } else {
      setOrder([...order, idx]);
    }
  }

  function handleCheck() {
    if (order.length !== frames.length) return;

    const elapsed = Date.now() - startTime.current;

    // Check if order is correct
    const correctCount = order.filter(
      (shuffledIdx, i) => shuffled[shuffledIdx].correct_position === i + 1,
    ).length;
    const isCorrect = correctCount === frames.length;

    // Capture partial credit from the first attempt only
    if (currentAttempt === 1) {
      firstAttemptFraction.current = frames.length > 0 ? correctCount / frames.length : 0;
    }

    // Find wrong positions for feedback
    const wrongPositions = new Set<number>();
    if (!isCorrect) {
      order.forEach((shuffledIdx, i) => {
        if (shuffled[shuffledIdx].correct_position !== i + 1) {
          wrongPositions.add(i);
        }
      });
    }

    const attempt: ActivityAttempt = {
      child_id: childId,
      story_id: storyData.id,
      activity_type: "sequencing",
      question_index: 0,
      attempt_number: currentAttempt,
      selected_option: order.map((i) => shuffled[i].correct_position).join(","),
      is_correct: isCorrect,
      time_ms: elapsed,
    };
    setAttempts((prev) => [...prev, attempt]);

    if (isCorrect) {
      setFeedback({ type: "correct" });
    } else {
      setFeedback({ type: "wrong", wrongPositions });
      setCurrentAttempt((a) => a + 1);
    }
  }

  function handleContinue() {
    if (feedback.type === "correct") {
      onComplete({
        phase: "sequencing",
        attempts: [...attempts],
        // Partial credit: fraction of frames correctly placed on first attempt,
        // not all-or-nothing (one misplaced slide no longer scores 0%)
        first_attempt_accuracy: firstAttemptFraction.current ?? 0,
        completed: true,
      });
    } else {
      // Try again
      setOrder([]);
      setFeedback({ type: "none" });
    }
  }

  const showingFeedback = feedback.type !== "none";

  return (
    <div className="flex h-full flex-col">
      <ProgressHeader
        progress={progress}
        label="Put the story in order"
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
                      ? "You put the whole story in order! Great job remembering what happened!"
                      : "Some parts are out of order. Think about what happened first, next, and last."}
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
                  <span className="text-lg font-bold text-success">Perfect order!</span>
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
                {feedback.type === "correct" ? "Continue" : "Try again"}
              </TactileButton>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <p className="mx-5 mt-3 text-sm font-semibold text-ink-soft">
        Tap each part of the story in the right order (1st → last)
      </p>

      {/* Ordered slots (what child has selected so far) */}
      {order.length > 0 && (
        <div className="mx-5 mt-3 flex flex-wrap gap-2">
          {order.map((shuffledIdx, i) => (
            <button
              key={`slot-${i}`}
              onClick={() => handleSelectFrame(shuffledIdx)}
              className="flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/30 px-3 py-1.5 text-sm font-bold text-primary transition-all hover:bg-primary/20"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {i + 1}
              </span>
              <span className="truncate max-w-[180px]">{shuffled[shuffledIdx].caption}</span>
              <span className="text-xs text-primary/50">✕</span>
            </button>
          ))}
        </div>
      )}

      {/* Available frames */}
      <div className="mx-5 mt-3 space-y-2 flex-1 overflow-y-auto no-scrollbar pb-2">
        {shuffled.map((frame, idx) => {
          const isPlaced = order.includes(idx);
          const orderPosition = order.indexOf(idx);

          return (
            <button
              key={idx}
              onClick={() => !showingFeedback && handleSelectFrame(idx)}
              disabled={showingFeedback}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl border-2 bg-card p-3 text-left shadow-card transition-all",
                isPlaced && "border-primary/40 bg-primary/5 opacity-50",
                !isPlaced && "border-transparent hover:border-primary/40",
              )}
            >
              {/* Number circle */}
              <span className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all",
                isPlaced ? "bg-primary text-primary-foreground" : "bg-sky text-ink-soft",
              )}>
                {isPlaced ? orderPosition + 1 : "?"}
              </span>
              <span className={cn(
                "flex-1 text-sm font-semibold",
                isPlaced ? "text-ink-soft" : "text-primary",
              )}>
                {frame.caption}
              </span>
            </button>
          );
        })}
      </div>

      {/* Check button */}
      <div className="mx-5 mb-5">
        <TactileButton
          onClick={handleCheck}
          disabled={order.length !== frames.length || showingFeedback}
        >
          Check order
        </TactileButton>
      </div>
    </div>
  );
}
