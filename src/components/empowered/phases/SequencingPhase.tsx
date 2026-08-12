import { useRef, useState } from "react";
import type { DragEvent } from "react";
import { cn } from "@/lib/utils";
import type { ActivityAttempt, SequencingFrame, StoryPhaseProps } from "@/types/story";
import { resolveStoryImage } from "@/services/storyImages";
import { TactileButton } from "../TactileButton";
import { MiniPlane, Star } from "../StoryProsBrand";
import { PaperPlaneIcon } from "../StoryProsUi";
import { ProgressHeader } from "./ProgressHeader";

/** Ordering micro-labels that adapt to any number of sequencing frames (3+). */
function orderLabels(count: number): string[] {
  if (count <= 1) return ["First"];
  if (count === 2) return ["First", "Finally"];
  const labels = ["First", "Next"];
  while (labels.length < count - 2) labels.push("Then");
  if (count >= 4) labels.push("After that");
  labels.push("Finally");
  return labels.slice(0, count);
}

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
  const labels = orderLabels(frames.length);
  const [shuffled] = useState<SequencingFrame[]>(() => shuffle(frames));
  const [order, setOrder] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<FeedbackState>({ type: "none" });
  const [attempts, setAttempts] = useState<ActivityAttempt[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [draggedFrame, setDraggedFrame] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<number | null>(null);
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

  function placeFrameAt(shuffledIndex: number, targetPosition: number) {
    if (showingFeedback) return;

    setOrder((currentOrder) => {
      const withoutDraggedFrame = currentOrder.filter((index) => index !== shuffledIndex);
      const insertionPoint = Math.min(targetPosition, withoutDraggedFrame.length);
      return [
        ...withoutDraggedFrame.slice(0, insertionPoint),
        shuffledIndex,
        ...withoutDraggedFrame.slice(insertionPoint),
      ];
    });
  }

  function handleDragStart(event: DragEvent<HTMLButtonElement>, shuffledIndex: number) {
    if (showingFeedback) {
      event.preventDefault();
      return;
    }
    setDraggedFrame(shuffledIndex);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(shuffledIndex));
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>, targetPosition: number) {
    event.preventDefault();
    const transferredIndex = Number(event.dataTransfer.getData("text/plain"));
    const shuffledIndex = draggedFrame ?? transferredIndex;
    if (Number.isInteger(shuffledIndex) && shuffledIndex >= 0 && shuffledIndex < shuffled.length) {
      placeFrameAt(shuffledIndex, targetPosition);
    }
    setDraggedFrame(null);
    setDropTarget(null);
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
      const perEvent = sequencingAward(currentAttempt);
      order.forEach((shuffledIndex) => {
        earnCoins({
          storyId: storyData.id,
          activity: "sequencing",
          item: shuffled[shuffledIndex].correct_position,
          amount: perEvent,
        });
      });
      earnCoins({
        storyId: storyData.id,
        activity: "sequencing",
        amount: COIN_ECONOMY.sequencing.completion,
        label: "Put It in Order complete!",
      });
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

      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        {/* Timeline rail */}
        <section className="flex shrink-0 flex-col gap-3 border-b border-accent/30 bg-card/50 px-4 pb-4 pt-3">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-[22px] font-extrabold leading-tight text-primary">
                Put the Story in Order
              </h1>
              <p className="text-xs font-semibold text-ink-soft">
                Tap each picture from first to last.
              </p>
            </div>
            <span className="text-xs font-extrabold text-ink-soft">
              {order.length}/{frames.length}
            </span>
          </div>

          <div className="relative">
            {/* Dotted timeline rail */}
            <div className="relative flex w-full items-center gap-1.5 py-2 sm:gap-2 lg:gap-3">
              <span
                className="pointer-events-none absolute left-1/2 top-1/2 w-[calc(100%-240px)] -translate-x-1/2 -translate-y-1/2 border-t-2 border-dotted border-primary/20 sm:w-[calc(100%-260px)] md:w-[calc(100%-280px)] lg:w-[calc(100%-300px)]"
                aria-hidden
              />
              {Array.from({ length: frames.length }).map((_, index) => {
                const shuffledIndex = order[index];
                const filled = shuffledIndex !== undefined;
                const wrong = feedback.type === "wrong" && feedback.wrongPositions.has(index);
                const label = labels[index] ?? `${index + 1}`;
                return (
                  <button
                    type="button"
                    key={index}
                    onClick={() => filled && handleSelectFrame(shuffledIndex)}
                    onDragOver={(event) => {
                      event.preventDefault();
                      event.dataTransfer.dropEffect = "move";
                      setDropTarget(index);
                    }}
                    onDragLeave={() => setDropTarget((current) => (current === index ? null : current))}
                    onDrop={(event) => handleDrop(event, index)}
                    draggable={filled && !showingFeedback}
                    onDragStart={(event) => filled && handleDragStart(event, shuffledIndex)}
                    onDragEnd={() => {
                      setDraggedFrame(null);
                      setDropTarget(null);
                    }}
                    aria-label={
                      filled
                        ? `Story picture ${index + 1}, ${label}. Drag to reorder or tap to remove.`
                        : `Empty ${label} slot. Drop a picture here.`
                    }
                    className={cn(
                      "relative z-10 flex h-[72px] min-w-0 flex-1 flex-col items-center justify-between overflow-hidden rounded-2xl border-2 p-1 text-center transition-all sm:h-[84px] md:h-[92px] lg:h-[100px]",
                      filled
                        ? "cursor-grab border-primary bg-card active:cursor-grabbing"
                        : "border-dashed border-primary/25 bg-card/60 text-primary/40",
                      dropTarget === index && "scale-[1.04] border-secondary bg-secondary/15 ring-4 ring-secondary/15",
                      wrong && "border-destructive bg-destructive/10",
                    )}
                  >
                    {filled ? (
                      <>
                        {resolveStoryImage(storyData.id, shuffled[shuffledIndex].image) ? (
                          <img
                            src={resolveStoryImage(storyData.id, shuffled[shuffledIndex].image) ?? undefined}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover"
                            draggable={false}
                          />
                        ) : (
                          <PaperPlaneIcon className="h-6 w-6" />
                        )}
                        <span className="absolute left-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-extrabold text-primary-foreground shadow-sm">
                          {index + 1}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="mt-1.5 w-full px-0.5 text-[8px] font-black uppercase leading-tight tracking-tight sm:text-[9px] md:text-[10px] lg:text-[11px]">
                          {label}
                        </span>
                        <span className="mb-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-dotted border-primary/25 text-[9px] font-extrabold text-primary/30 sm:h-6 sm:w-6 sm:text-[10px]">
                          {index + 1}
                        </span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Story bank — centered in remaining space */}
        <div className="relative z-10 flex flex-1 flex-col overflow-y-auto no-scrollbar px-4 pb-4 pt-4">
          <section className="mx-auto my-auto grid w-full max-w-[720px] grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:max-w-[960px] lg:gap-5">
            {shuffled.map((frame, index) => {
              const placed = order.includes(index);
              const position = order.indexOf(index);
              const image = resolveStoryImage(storyData.id, frame.image);

              return (
                <button
                  type="button"
                  key={`${frame.correct_position}-${frame.caption}`}
                  onClick={() => handleSelectFrame(index)}
                  draggable={!showingFeedback}
                  onDragStart={(event) => handleDragStart(event, index)}
                  onDragEnd={() => {
                    setDraggedFrame(null);
                    setDropTarget(null);
                  }}
                  aria-label={`${placed ? `Story picture in position ${position + 1}` : "Unplaced story picture"}. Drag to the timeline or tap to place.`}
                  className={cn(
                    "hover-lift cursor-grab overflow-hidden rounded-2xl border-4 border-white bg-card text-left shadow-card transition-all active:cursor-grabbing active:scale-[0.98]",
                    placed ? "opacity-60 grayscale-[0.25]" : "",
                    draggedFrame === index && "scale-95 opacity-40",
                  )}
                >
                  <div className="relative aspect-video overflow-hidden bg-accent">
                    {image ? (
                      <img src={image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-primary">
                        <PaperPlaneIcon className="h-8 w-8" />
                      </div>
                    )}
                    {placed && (
                      <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-primary-foreground shadow-card">
                        {position + 1}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </section>
        </div>

        <div className="relative z-10 mx-4 mb-4">
          <TactileButton
            onClick={handleCheck}
            disabled={order.length !== frames.length || showingFeedback}
          >
            Check Order
          </TactileButton>
        </div>
      </div>
    </div>
  );
}
