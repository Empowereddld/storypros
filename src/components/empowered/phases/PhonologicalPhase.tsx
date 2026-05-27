/* ─────────────────────────────────────────────
 * Phonological Awareness Phase — Must-Complete
 * Rhyme + initial sound questions.
 * Tracked separately (10% weight).
 * ───────────────────────────────────────────── */

import { useState, useRef, useEffect } from "react";
import { TactileButton } from "../TactileButton";
import { ProgressHeader } from "./ProgressHeader";
import type { StoryPhaseProps, ActivityAttempt } from "@/types/story";
import { cn } from "@/lib/utils";
import { speak, stop, speedToRate, preloadVoices, isSupported } from "@/services/tts";
import dariaSolo from "@/assets/daria-solo.png";

type FeedbackState =
  | { type: "none" }
  | { type: "correct" }
  | { type: "wrong" };

export function PhonologicalPhase({ storyData, onComplete, onClose, ttsSpeed = "normal" }: StoryPhaseProps) {
  const items = storyData.phonological_items;
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>({ type: "none" });
  const [attempts, setAttempts] = useState<ActivityAttempt[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [wrongIds, setWrongIds] = useState<Set<string>>(new Set());
  const startTime = useRef(Date.now());

  useEffect(() => { preloadVoices(); }, []);
  useEffect(() => { return () => { stop(); }; }, [qi]);

  function pronounceOption(text: string) {
    stop();
    // Phonological items are always slow or slower for clarity
    const phonSpeed = ttsSpeed === "fast" ? "normal" : ttsSpeed;
    speak(text, { rate: speedToRate(phonSpeed) }).catch(() => {});
  }

  const item = items[qi];
  const progress = (qi / items.length) * 100;

  function handleCheck() {
    if (!selected) return;

    const elapsed = Date.now() - startTime.current;
    const option = item.options.find((o) => o.id === selected)!;
    const isCorrect = option.correct;

    const attempt: ActivityAttempt = {
      child_id: "demo",
      story_id: storyData.id,
      activity_type: "phonological",
      question_index: qi,
      attempt_number: currentAttempt,
      selected_option: selected,
      is_correct: isCorrect,
      time_ms: elapsed,
    };
    setAttempts((prev) => [...prev, attempt]);

    if (isCorrect) {
      setFeedback({ type: "correct" });
    } else {
      setWrongIds((prev) => new Set(prev).add(selected));
      setFeedback({ type: "wrong" });
      setCurrentAttempt((a) => a + 1);
    }
  }

  function handleContinue() {
    if (feedback.type === "correct") {
      if (qi + 1 >= items.length) {
        const firstAttempts = attempts.filter((a) => a.attempt_number === 1);
        const correctFirst = firstAttempts.filter((a) => a.is_correct).length;
        const accuracy = items.length > 0 ? correctFirst / items.length : 0;

        onComplete({
          phase: "phonological",
          attempts: [...attempts],
          first_attempt_accuracy: accuracy,
          completed: true,
        });
        return;
      }
      setQi(qi + 1);
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
  const typeLabel = item.type === "rhyme" ? "Rhyme Time!" : "Sound Detective!";
  const typeIcon = item.type === "rhyme" ? "🎵" : "🔊";

  return (
    <div className="flex h-full flex-col">
      <ProgressHeader
        progress={progress}
        label={`Sound ${qi + 1} of ${items.length}`}
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
                      ? item.type === "rhyme"
                        ? "You found the rhyme! Those words sound alike at the end!"
                        : "You found the right sound! Great listening!"
                      : item.type === "rhyme"
                        ? "Listen to the ending sounds. Which word sounds the same?"
                        : "Listen to the very first sound. Try again!"}
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
                  <span className="text-lg font-bold text-success">Correct!</span>
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
                  ? qi + 1 >= items.length
                    ? "Continue"
                    : "Next"
                  : "Try again"}
              </TactileButton>
            </div>
          </div>
        </div>
      )}

      {/* Type badge */}
      <div className="mx-5 mt-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-lg">
          {typeIcon}
        </span>
        <span className="text-sm font-bold uppercase tracking-wider text-primary">
          {typeLabel}
        </span>
      </div>

      {/* Question */}
      <h2
        key={`p-${qi}`}
        className="mx-5 mt-3 font-display text-[26px] leading-tight font-extrabold text-primary animate-slide-up"
      >
        {item.prompt}
      </h2>

      {/* Options */}
      <div className="mx-5 mt-5 space-y-3 flex-1 overflow-y-auto no-scrollbar pb-2">
        {item.options.map((opt) => {
          const isSelected = selected === opt.id;
          const isDisabled = wrongIds.has(opt.id);
          return (
            <div key={opt.id} className="flex items-center gap-2">
              <button
                onClick={() => !isDisabled && setSelected(opt.id)}
                disabled={isDisabled}
                className={cn(
                  "flex flex-1 items-center justify-center rounded-3xl border-2 bg-card p-5 shadow-card transition-all",
                  isSelected && "border-primary bg-primary/5 -translate-y-0.5",
                  !isSelected && !isDisabled && "border-transparent hover:border-primary/40",
                  isDisabled && "opacity-40 border-destructive/30 bg-destructive/5",
                )}
              >
                <span className={cn(
                  "text-2xl font-bold",
                  isDisabled ? "text-ink-soft line-through" : "text-primary",
                )}>
                  {opt.text}
                </span>
              </button>
              {isSupported() && !isDisabled && (
                <button
                  onClick={() => pronounceOption(opt.text ?? opt.label)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary active:scale-90 transition-transform"
                  aria-label={`Hear ${opt.text}`}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                </button>
              )}
            </div>
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
