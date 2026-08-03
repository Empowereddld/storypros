import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { ActivityAttempt, StoryPhaseProps } from "@/types/story";
import { speak, speedToRate } from "@/services/tts";
import { TactileButton } from "../TactileButton";
import { MiniPlane, Star } from "../StoryProsBrand";
import { ChevronRightIcon } from "../StoryProsUi";
import { ProgressHeader } from "./ProgressHeader";
import { ListenButton, useListen } from "./ListenButton";
import { useDevSubSteps } from "./DevPhaseNav";

type FeedbackState = { type: "none" } | { type: "correct" } | { type: "wrong" };

export function PhonologicalPhase({
  storyData,
  onComplete,
  onClose,
  ttsSpeed = "normal",
  childId = "demo",
}: StoryPhaseProps) {
  const items = storyData.phonological_items;
  const [questionIndex, setQuestionIndex] = useState(0);
  useDevSubSteps(items.length, questionIndex, setQuestionIndex, "item");
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>({ type: "none" });
  const [attempts, setAttempts] = useState<ActivityAttempt[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [wrongIds, setWrongIds] = useState<Set<string>>(new Set());
  const startTime = useRef(Date.now());
  const { supported, isPlaying, toggle, cancel } = useListen(ttsSpeed);

  // Stop narration when the question changes.
  useEffect(() => cancel, [questionIndex, cancel]);

  const item = items[questionIndex];
  const progress = (questionIndex / items.length) * 100;
  const showingFeedback = feedback.type !== "none";
  const typeLabel = item.type === "rhyme" ? "Rhyme Time" : "Sound Detective";

  function pronounceOption(text: string) {
    // Reset any playing prompt clip, then read the answer option aloud.
    cancel();
    const phonSpeed = ttsSpeed === "fast" ? "normal" : ttsSpeed;
    speak(text, { rate: speedToRate(phonSpeed) }).catch(() => {});
  }

  function handleCheck() {
    if (!selected) return;

    const elapsed = Date.now() - startTime.current;
    const option = item.options.find((candidate) => candidate.id === selected);
    const isCorrect = !!option?.correct;
    const attempt: ActivityAttempt = {
      child_id: childId,
      story_id: storyData.id,
      activity_type: "phonological",
      question_index: questionIndex,
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
      setCurrentAttempt((attemptNumber) => attemptNumber + 1);
    }
  }

  function handleContinue() {
    if (feedback.type === "correct") {
      if (questionIndex + 1 >= items.length) {
        const firstAttempts = attempts.filter((attempt) => attempt.attempt_number === 1);
        const correctFirst = firstAttempts.filter((attempt) => attempt.is_correct).length;
        const accuracy = items.length > 0 ? correctFirst / items.length : 0;
        onComplete({
          phase: "phonological",
          attempts: [...attempts],
          first_attempt_accuracy: accuracy,
          completed: true,
        });
        return;
      }

      setQuestionIndex(questionIndex + 1);
      setSelected(null);
      setFeedback({ type: "none" });
      setCurrentAttempt(1);
      setWrongIds(new Set());
      startTime.current = Date.now();
      return;
    }

    setSelected(null);
    setFeedback({ type: "none" });
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-accent/10 to-accent/35" />
        <Star className="absolute left-8 top-32 h-4 w-4 text-secondary animate-sparkle" />
        <Star className="absolute right-8 top-48 h-5 w-5 text-primary/30 animate-sparkle" />
        <MiniPlane className="absolute right-12 bottom-24 h-9 w-9 rotate-12 text-secondary animate-float" />
      </div>

      <div className="relative z-10">
        <ProgressHeader
          progress={progress}
          label={`${questionIndex + 1}/${items.length}`}
          onClose={onClose}
        />
      </div>

      {showingFeedback && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm">
          <div className="w-full rounded-t-[32px] bg-card p-6 pb-8 shadow-soft animate-slide-up">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-accent" />
            <div
              className={cn(
                "rounded-[24px] p-4 text-center shadow-card",
                feedback.type === "correct"
                  ? "border-2 border-success bg-success/10 animate-tada"
                  : "bg-sky animate-shake",
              )}
            >
              <p className="text-xl font-extrabold text-primary">
                {feedback.type === "correct" ? "Great listening!" : "Listen again"}
              </p>
              <p className="mt-2 text-sm font-semibold leading-snug text-ink-soft">
                {feedback.type === "correct"
                  ? item.type === "rhyme"
                    ? "Those words sound alike at the end."
                    : "You found the first sound."
                  : item.type === "rhyme"
                    ? "Listen for words that end the same way."
                    : "Listen to the very first sound."}
              </p>
            </div>
            <div className="mt-5">
              <TactileButton
                variant={feedback.type === "correct" ? "primary" : "secondary"}
                onClick={handleContinue}
              >
                {feedback.type === "correct" ? "Next" : "Try Again"}
              </TactileButton>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-1 flex-col overflow-hidden px-5 pb-5 pt-4">
        <section className="rounded-[30px] bg-card p-5 text-center shadow-soft animate-slide-up">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-[22px] bg-accent text-primary">
            <SoundIcon />
          </span>
          <p className="mt-3 text-xs font-extrabold uppercase tracking-wide text-secondary-foreground">
            {typeLabel}
          </p>
          <h1 className="mt-3 text-[28px] font-extrabold leading-tight text-primary">
            {item.prompt}
          </h1>
          {supported && (
            <div className="mt-3 flex justify-center">
              <ListenButton
                playing={isPlaying("prompt")}
                onClick={() => toggle(item.prompt, "prompt")}
                className="h-12 w-12"
                ariaLabel="Hear the question"
              />
            </div>
          )}
        </section>

        <div className="mt-4 flex-1 space-y-3 overflow-y-auto no-scrollbar pb-2">
          {item.options.map((option, index) => {
            const label = option.text ?? option.label;
            const isSelected = selected === option.id;
            const isDisabled = wrongIds.has(option.id);
            return (
              <div key={option.id} className="flex items-center gap-2">
                <button
                  onClick={() => !isDisabled && setSelected(option.id)}
                  disabled={isDisabled}
                  className={cn(
                    "flex min-h-[74px] flex-1 items-center gap-3 rounded-[26px] border-2 bg-card p-4 text-left shadow-card transition-all",
                    isSelected && "border-primary bg-primary/5 -translate-y-0.5",
                    !isSelected && !isDisabled && "border-accent/60 hover:border-primary/50",
                    isDisabled && "border-destructive/30 bg-destructive/5 opacity-45",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-extrabold",
                      isSelected ? "bg-primary text-primary-foreground" : "bg-accent text-primary",
                    )}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span
                    className={cn(
                      "flex-1 text-[22px] font-extrabold leading-tight",
                      isDisabled ? "text-ink-soft line-through" : "text-primary",
                    )}
                  >
                    {label}
                  </span>
                </button>
                {supported && !isDisabled && (
                  <button
                    onClick={() => pronounceOption(label)}
                    className="press-pop flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card"
                    aria-label={`Hear ${label}`}
                  >
                    <PlayIcon />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <TactileButton onClick={handleCheck} disabled={!selected || showingFeedback}>
          Check Answer <ChevronRightIcon className="h-5 w-5 text-secondary" />
        </TactileButton>
      </div>
    </div>
  );
}

function SoundIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      aria-hidden
    >
      <path d="M4 10v4h4l5 4V6l-5 4H4z" strokeLinejoin="round" />
      <path d="M17 9a4 4 0 010 6M19.5 6.5a7.5 7.5 0 010 11" strokeLinecap="round" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
