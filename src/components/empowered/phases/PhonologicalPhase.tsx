import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { ActivityAttempt, StoryPhaseProps } from "@/types/story";
import { TactileButton } from "../TactileButton";
import { MiniPlane, Star } from "../StoryProsBrand";
import { ChevronRightIcon } from "../StoryProsUi";
import { ProgressHeader } from "./ProgressHeader";
import { useListen } from "./ListenButton";
import { AudioButton } from "../AudioButton";
import { useDevSubSteps } from "./DevPhaseNav";
import { earnCoins } from "@/services/coins";
import { COIN_ECONOMY } from "@/services/coinEconomy";

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
        earnCoins({
          storyId: storyData.id,
          activity: "sounds",
          amount: COIN_ECONOMY.sounds.completion,
          label: "Sound Play complete!",
        });
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

      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden px-4 pb-4 pt-2 sm:px-6">
        <div className="flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-[36px] border-[6px] border-accent/50 bg-card shadow-soft animate-slide-up">
          {/* Header / Question Area */}
          <section className="shrink-0 pb-2 pt-3 text-center sm:pb-3 sm:pt-4">
            <div className="flex justify-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-[18px] bg-accent text-primary sm:h-12 sm:w-12">
                <SoundIcon />
              </span>
            </div>
            <p className="mt-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground">
              {typeLabel}
            </p>
            <h1 className="mt-1.5 px-5 text-[21px] font-extrabold leading-tight text-primary sm:text-[26px] lg:text-[30px]">
              <PromptText prompt={item.prompt} />
            </h1>
            {supported && (
              <div className="mt-2 flex justify-center">
                <AudioButton
                  size="lg"
                  tone="primary"
                  playing={isPlaying("prompt")}
                  onClick={() => toggle(item.prompt, "prompt")}
                  text={item.prompt}
                />
              </div>
            )}
          </section>

          {/* Answer Options */}
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-3 sm:px-7 sm:pb-4">

            <div className="space-y-2">
              {item.options.map((option, index) => {
                const label = option.text ?? option.label ?? "";
                const isSelected = selected === option.id;
                const isDisabled = wrongIds.has(option.id);
                const letter = String.fromCharCode(65 + index);
                return (
                  <button
                    key={option.id}
                    onClick={() => !isDisabled && setSelected(option.id)}
                    disabled={isDisabled}
                    className={cn(
                      "group flex w-full items-center justify-between rounded-3xl border-3 bg-card p-2 text-left transition-all duration-200 sm:p-2.5",
                      isSelected && "border-primary bg-primary/5 shadow-md",
                      !isSelected && !isDisabled && "border-accent/50 hover:border-primary/50 hover:bg-accent/35 shadow-sm hover:shadow-md",
                      isDisabled && "border-destructive/30 bg-destructive/5 opacity-45",
                    )}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-5">
                      <span
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-sm font-bold sm:h-10 sm:w-10 sm:text-base",
                          isSelected
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "bg-primary text-primary-foreground shadow-md",
                          isDisabled && "bg-muted text-muted-foreground shadow-none",
                        )}
                      >
                        {letter}
                      </span>
                      <span
                        className={cn(
                          "min-w-0 text-[18px] font-extrabold leading-tight sm:text-[22px]",
                          isDisabled ? "text-ink-soft line-through" : "text-primary",
                        )}
                      >
                        {label}
                      </span>
                    </div>
                    {supported && !isDisabled && (
                      <AudioButton
                        size="md"
                        tone="quiet"
                        playing={isPlaying(`opt-${option.id}`)}
                        onClick={() => toggle(label, `opt-${option.id}`)}
                        text={label}
                        className="ml-2"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Area */}
          <div className="shrink-0 bg-accent/30 p-3 sm:p-4">
            <TactileButton
              onClick={handleCheck}
              disabled={!selected || showingFeedback}
              className="h-[48px] text-base sm:h-[56px] sm:text-lg"
            >
              Check Answer <ChevronRightIcon className="h-5 w-5 text-secondary" />
            </TactileButton>
          </div>

        </div>
      </div>
    </div>
  );
}

function PromptText({ prompt }: { prompt: string }) {
  const rhymeMatch = prompt.match(/^(Which word rhymes with )(.+?)(\?)$/);
  const soundMatch = prompt.match(/^(Which word starts with the same sound as )(.+?)(\?)$/);
  const match = rhymeMatch ?? soundMatch;

  if (!match) {
    return <span>{prompt}</span>;
  }

  const [, prefix, target, suffix] = match;
  return (
    <>
      {prefix}
      <span className="text-primary underline decoration-primary/30 underline-offset-[6px] sm:underline-offset-8">
        {target}
      </span>
      {suffix}
    </>
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
