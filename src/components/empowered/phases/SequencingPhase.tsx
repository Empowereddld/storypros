import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { ActivityAttempt, SequencingFrame, StoryPhaseProps } from "@/types/story";
import { resolveStoryImage } from "@/services/storyImages";
import { TactileButton } from "../TactileButton";
import { MiniPlane, Star } from "../StoryProsBrand";
import { BookIcon, PaperPlaneIcon } from "../StoryProsUi";
import { ProgressHeader } from "./ProgressHeader";

type FeedbackState =
  | { type: "none" }
  | { type: "correct" }
  | { type: "wrong"; wrongPositions: Set<number> };

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function SequencingPhase({
  storyData,
  onComplete,
  onClose,
  childId = "demo",
}: StoryPhaseProps) {
  const frames = storyData.sequencing_frames;
  const [shuffled] = useState<SequencingFrame[]>(() => shuffle(frames));
  const [order, setOrder] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<FeedbackState>({ type: "none" });
  const [attempts, setAttempts] = useState<ActivityAttempt[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const startTime = useRef(Date.now());
  const firstAttemptFraction = useRef<number | null>(null);

  const progress = feedback.type === "correct" ? 100 : (order.length / frames.length) * 80;
  const showingFeedback = feedback.type !== "none";

  function handleSelectFrame(index: number) {
    if (showingFeedback) return;
    if (order.includes(index)) {
      const position = order.indexOf(index);
      setOrder(order.slice(0, position));
    } else {
      setOrder([...order, index]);
    }
  }

  function handleCheck() {
    if (order.length !== frames.length) return;

    const elapsed = Date.now() - startTime.current;
    const correctCount = order.filter(
      (shuffledIndex, index) => shuffled[shuffledIndex].correct_position === index + 1,
    ).length;
    const isCorrect = correctCount === frames.length;

    if (currentAttempt === 1) {
      firstAttemptFraction.current = frames.length > 0 ? correctCount / frames.length : 0;
    }

    const wrongPositions = new Set<number>();
    if (!isCorrect) {
      order.forEach((shuffledIndex, index) => {
        if (shuffled[shuffledIndex].correct_position !== index + 1) {
          wrongPositions.add(index);
        }
      });
    }

    const attempt: ActivityAttempt = {
      child_id: childId,
      story_id: storyData.id,
      activity_type: "sequencing",
      question_index: 0,
      attempt_number: currentAttempt,
      selected_option: order.map((index) => shuffled[index].correct_position).join(","),
      is_correct: isCorrect,
      time_ms: elapsed,
    };
    setAttempts((prev) => [...prev, attempt]);

    if (isCorrect) {
      setFeedback({ type: "correct" });
    } else {
      setFeedback({ type: "wrong", wrongPositions });
      setCurrentAttempt((attemptNumber) => attemptNumber + 1);
    }
  }

  function handleContinue() {
    if (feedback.type === "correct") {
      onComplete({
        phase: "sequencing",
        attempts: [...attempts],
        first_attempt_accuracy: firstAttemptFraction.current ?? 0,
        completed: true,
      });
      return;
    }

    setOrder([]);
    setFeedback({ type: "none" });
    startTime.current = Date.now();
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-accent/10 to-accent/35" />
        <Star className="absolute left-8 top-32 h-4 w-4 text-secondary animate-sparkle" />
        <Star className="absolute right-8 top-48 h-5 w-5 text-primary/30 animate-sparkle" />
        <MiniPlane className="absolute right-10 bottom-28 h-9 w-9 rotate-12 text-secondary animate-float" />
      </div>

      <div className="relative z-10">
        <ProgressHeader progress={progress} label="Order" onClose={onClose} />
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
                {feedback.type === "correct" ? "Perfect order!" : "Try the order again"}
              </p>
              <p className="mt-2 text-sm font-semibold leading-snug text-ink-soft">
                {feedback.type === "correct"
                  ? "You remembered what happened first, next, and last."
                  : "Look for the beginning, middle, and ending of the story."}
              </p>
            </div>
            <div className="mt-5">
              <TactileButton
                variant={feedback.type === "correct" ? "primary" : "secondary"}
                onClick={handleContinue}
              >
                {feedback.type === "correct" ? "Continue" : "Try Again"}
              </TactileButton>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar px-5 pb-4 pt-4">
        <section className="rounded-[30px] bg-card p-5 shadow-soft animate-slide-up">
          <div className="flex items-start gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] bg-accent text-primary">
              <BookIcon className="h-9 w-9" />
            </span>
            <div>
              <h1 className="text-[29px] font-extrabold leading-tight text-primary">
                Put the Story in Order
              </h1>
              <p className="mt-1 text-sm font-semibold leading-snug text-ink-soft">
                Tap each picture from first to last.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-[26px] bg-card/90 p-3 shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-sm font-extrabold text-primary">Your order</p>
            <span className="text-xs font-extrabold text-ink-soft">
              {order.length}/{frames.length}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-6 gap-1.5">
            {Array.from({ length: frames.length }).map((_, index) => {
              const shuffledIndex = order[index];
              const filled = shuffledIndex !== undefined;
              const wrong = feedback.type === "wrong" && feedback.wrongPositions.has(index);
              return (
                <button
                  key={index}
                  onClick={() => filled && handleSelectFrame(shuffledIndex)}
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-2xl text-sm font-extrabold shadow-sm",
                    filled ? "bg-primary text-primary-foreground" : "bg-accent text-primary/45",
                    wrong && "bg-destructive text-destructive-foreground",
                  )}
                >
                  {filled ? index + 1 : ""}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-4 grid grid-cols-2 gap-3">
          {shuffled.map((frame, index) => {
            const placed = order.includes(index);
            const position = order.indexOf(index);
            const image = resolveStoryImage(storyData.id, frame.image);

            return (
              <button
                key={`${frame.correct_position}-${frame.caption}`}
                onClick={() => handleSelectFrame(index)}
                className={cn(
                  "hover-lift min-h-[198px] overflow-hidden rounded-[24px] border-2 bg-card text-left shadow-card transition-all active:scale-[0.98]",
                  placed ? "border-primary bg-primary/5 opacity-75" : "border-accent/60",
                )}
              >
                <div className="relative h-28 overflow-hidden bg-accent">
                  {image ? (
                    <img src={image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-primary">
                      <PaperPlaneIcon className="h-10 w-10" />
                    </div>
                  )}
                  <span
                    className={cn(
                      "absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-extrabold shadow-card",
                      placed ? "bg-primary text-primary-foreground" : "bg-card text-primary",
                    )}
                  >
                    {placed ? position + 1 : "?"}
                  </span>
                </div>
                <div className="p-3">
                  <p className="line-clamp-3 text-sm font-extrabold leading-snug text-primary">
                    {frame.caption}
                  </p>
                </div>
              </button>
            );
          })}
        </section>
      </div>

      <div className="relative z-10 mx-5 mb-5">
        <TactileButton
          onClick={handleCheck}
          disabled={order.length !== frames.length || showingFeedback}
        >
          Check Order
        </TactileButton>
      </div>
    </div>
  );
}
