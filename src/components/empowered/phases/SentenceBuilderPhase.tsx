import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { highlightConnective } from "@/lib/highlightConnective";
import type { ActivityAttempt, StoryPhaseProps } from "@/types/story";
import { isSupported, preloadVoices, speak, speedToRate, stop } from "@/services/tts";
import { TactileButton } from "../TactileButton";
import { MiniPlane, Star } from "../StoryProsBrand";
import { BookCheckIcon, ChevronRightIcon } from "../StoryProsUi";
import { ProgressHeader } from "./ProgressHeader";

type FeedbackState =
  | { type: "none" }
  | { type: "correct"; brainCheck: string }
  | { type: "wrong"; brainCheck: string };

export function SentenceBuilderPhase({
  storyData,
  onComplete,
  onClose,
  ttsSpeed = "normal",
  childId = "demo",
}: StoryPhaseProps) {
  const frames = storyData.sentence_frames;
  const [frameIdx, setFrameIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>({ type: "none" });
  const [attempts, setAttempts] = useState<ActivityAttempt[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [wrongIds, setWrongIds] = useState<Set<string>>(new Set());
  const [speaking, setSpeaking] = useState(false);
  const startTime = useRef(Date.now());

  useEffect(() => {
    preloadVoices();
  }, []);

  useEffect(() => {
    return () => {
      stop();
      setSpeaking(false);
    };
  }, [frameIdx]);

  const frame = frames[frameIdx];
  const progress = (frameIdx / frames.length) * 100;
  const [beforeBlank] = frame.frame_text.split("___");
  const selectedChoice = frame.choices.find((choice) => choice.id === selected);
  const showingFeedback = feedback.type !== "none";

  async function handleListenFrame() {
    if (speaking) {
      stop();
      setSpeaking(false);
      return;
    }

    setSpeaking(true);
    try {
      await speak(frame.frame_text.replace("___", "blank"), {
        rate: speedToRate(ttsSpeed),
      });
    } catch {
      // Ignore browser TTS errors.
    }
    setSpeaking(false);
  }

  function handleCheck() {
    if (!selected) return;

    const elapsed = Date.now() - startTime.current;
    const choice = frame.choices.find((item) => item.id === selected);
    const isCorrect = !!choice?.correct;
    const attempt: ActivityAttempt = {
      child_id: childId,
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
      setCurrentAttempt((attemptNumber) => attemptNumber + 1);
    }
  }

  function handleContinue() {
    if (feedback.type === "correct") {
      if (frameIdx + 1 >= frames.length) {
        const firstAttempts = attempts.filter((attempt) => attempt.attempt_number === 1);
        const correctFirst = firstAttempts.filter((attempt) => attempt.is_correct).length;
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
          label={`${frameIdx + 1}/${frames.length}`}
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
                {feedback.type === "correct" ? "Great sentence!" : "Try again"}
              </p>
              <p className="mt-2 text-sm font-semibold leading-snug text-ink-soft">
                {feedback.type === "correct"
                  ? `Yes. ${feedback.brainCheck}`
                  : `${feedback.brainCheck} Think about the story again.`}
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
        <section className="rounded-[30px] bg-card p-5 shadow-soft animate-slide-up">
          <div className="flex items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-accent text-primary">
              <BookCheckIcon className="h-8 w-8" />
            </span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wide text-secondary-foreground">
                Sentence Builder
              </p>
              <h1 className="text-[28px] font-extrabold leading-tight text-primary">
                Finish the idea
              </h1>
            </div>
          </div>

          <div className="mt-5 rounded-[24px] bg-accent/60 p-4">
            <p className="text-[22px] font-extrabold leading-snug text-primary">
              {highlightConnective(beforeBlank, storyData.target_connective)}
              <span
                className={cn(
                  "mx-1 inline-block min-w-[112px] rounded-2xl border-2 px-2 py-1 text-center transition-all",
                  selected
                    ? "border-primary bg-card text-primary"
                    : "border-primary/20 bg-card/70 text-ink-soft/60",
                )}
              >
                {selectedChoice ? selectedChoice.text : "..."}
              </span>
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="rounded-full bg-secondary/25 px-3 py-1 text-xs font-extrabold text-secondary-foreground">
              Word: {storyData.target_connective}
            </span>
            {isSupported() && (
              <button
                onClick={handleListenFrame}
                className="press-pop inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-extrabold text-primary-foreground"
              >
                {speaking ? "Stop" : "Listen"}
                <SpeakerIcon playing={speaking} />
              </button>
            )}
          </div>
        </section>

        <div className="mt-4 flex-1 space-y-3 overflow-y-auto no-scrollbar pb-2">
          {frame.choices.map((choice, index) => {
            const isSelected = selected === choice.id;
            const isDisabled = wrongIds.has(choice.id);
            return (
              <button
                key={choice.id}
                onClick={() => !isDisabled && setSelected(choice.id)}
                disabled={isDisabled}
                className={cn(
                  "flex w-full items-center gap-3 rounded-[26px] border-2 bg-card p-4 text-left shadow-card transition-all",
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
                    "flex-1 text-base font-extrabold leading-snug",
                    isDisabled ? "text-ink-soft line-through" : "text-ink",
                  )}
                >
                  {choice.text}
                </span>
              </button>
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

function SpeakerIcon({ playing }: { playing: boolean }) {
  if (playing) {
    return (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
        <rect x="6" y="6" width="12" height="12" rx="2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
