/* ─────────────────────────────────────────────
 * Delayed Retell Phase
 * Child retells story using tappable element icons.
 * Not scored in V1 (retell domain dormant).
 * Placed AFTER vocab + grammar activities.
 * ───────────────────────────────────────────── */

import { useEffect, useState } from "react";
import { TactileButton } from "../TactileButton";
import { ProgressHeader } from "./ProgressHeader";
import { MiniPlane, Star } from "../StoryProsBrand";
import { BookIcon, ChevronRightIcon, PaperPlaneIcon } from "../StoryProsUi";
import { resolveStoryImage } from "@/services/storyImages";
import type { StoryPhaseProps, StoryElement } from "@/types/story";
import { cn } from "@/lib/utils";
import { ListenButton, useListen } from "./ListenButton";
import { RetellRecorder } from "../RetellRecorder";

const ELEMENT_LABELS: Record<StoryElement, string> = {
  character: "Who",
  place: "Where",
  problem: "Problem",
  emotion: "Feeling",
  action: "What happened",
  result: "Result",
};

export function DelayedRetellPhase({
  storyData,
  onComplete,
  onClose,
  ttsSpeed = "normal",
  childId,
}: StoryPhaseProps) {
  const elements = storyData.retell_prompts.story_elements;
  const [tapped, setTapped] = useState<Set<number>>(new Set());
  const [started, setStarted] = useState(false);
  const delayedPrompt = storyData.retell_prompts.delayed;
  const { supported, isPlaying, toggle, cancel } = useListen(ttsSpeed);

  // Stop narration once the child starts tapping story parts.
  useEffect(() => cancel, [started, cancel]);

  const progress = started ? (tapped.size / elements.length) * 80 + 20 : 0;

  function handleTap(idx: number) {
    setTapped((prev) => new Set(prev).add(idx));
  }

  function handleDone() {
    earnCoins({
      storyId: storyData.id,
      activity: "delayed-retell",
      amount: COIN_ECONOMY["delayed-retell"].completion,
      label: "You told the whole story!",
    });
    onComplete({
      phase: "delayed-retell",
      attempts: [],
      first_attempt_accuracy: 1, // not scored V1
      completed: true,
    });
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-accent/10 to-accent/35" />
        <Star className="absolute right-8 top-28 h-5 w-5 text-secondary animate-sparkle" />
        <Star className="absolute left-8 bottom-32 h-4 w-4 text-primary/30 animate-sparkle" />
        <MiniPlane className="absolute right-10 bottom-24 h-9 w-9 rotate-12 text-secondary/70 animate-float" />
      </div>

      <div className="relative z-10">
        <ProgressHeader progress={progress} label="Tell it again!" onClose={onClose} />
      </div>

      {!started ? (
        <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto no-scrollbar px-5 pb-4 pt-4 sm:overflow-hidden">
          <section className="flex min-h-0 flex-col rounded-[30px] bg-card p-5 shadow-soft animate-slide-up sm:flex-1">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] bg-accent text-primary">
                <BrainIcon className="h-9 w-9" />
              </div>
              <div>
                <h1 className="text-[30px] font-extrabold leading-tight text-primary">
                  Remember the Story?
                </h1>
                <p className="mt-1 text-sm font-semibold leading-snug text-ink-soft">
                  Tap each story part as you talk about it.
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-[24px] bg-accent/60 p-4">
              <p className="flex-1 text-lg font-extrabold leading-snug text-primary sm:text-xl">
                {delayedPrompt}
              </p>
              {supported && (
                <ListenButton
                  playing={isPlaying("delayed")}
                  onClick={() => toggle(delayedPrompt, "delayed")}
                  ariaLabel="Hear the retell prompt"
                />
              )}
            </div>

            <div className="mt-4 min-h-0 flex-1 overflow-y-auto no-scrollbar sm:overflow-hidden">
              <RetellRecorder childId={childId} storyId={storyData.id} phase="delayed" />
            </div>
          </section>
        </div>
      ) : (
        <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto no-scrollbar px-5 pb-4 pt-2 sm:overflow-hidden">
          <section className="flex min-h-0 flex-1 flex-col">
            <div className="flex items-center gap-2">
              <BookIcon className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-extrabold text-primary">Story Parts</h2>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-3 sm:mt-2 sm:min-h-0 sm:flex-1 sm:grid-cols-3 sm:grid-rows-[auto_auto] sm:content-center sm:items-center sm:gap-4">
              {elements.map((element, index) => {
                const selected = tapped.has(index);
                const slide = storyData.slides.find((item) => item.story_element === element);
                const image = slide ? resolveStoryImage(storyData.id, slide.image) : null;

                return (
                  <button
                    key={`${element}-${index}`}
                    onClick={() => handleTap(index)}
                    className={cn(
                      "hover-lift flex flex-col overflow-hidden rounded-[24px] border-2 bg-card text-left shadow-card transition-all active:scale-[0.98]",
                      "sm:min-h-0 sm:self-center",
                      selected ? "border-success bg-success/5" : "border-accent/60",
                    )}
                  >
                    <div className="relative mx-auto aspect-video w-full max-h-full shrink-0 overflow-hidden rounded-[18px] bg-accent/40">
                      {image ? (
                        <img
                          src={image}
                          alt=""
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-primary">
                          <PaperPlaneIcon className="h-10 w-10" />
                        </div>
                      )}
                      <span
                        className={cn(
                          "absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-extrabold shadow-card",
                          selected
                            ? "bg-success text-success-foreground"
                            : "bg-primary text-primary-foreground",
                        )}
                      >
                        {index + 1}
                      </span>
                      {selected && (
                        <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-card text-success shadow-card">
                          <CheckIcon />
                        </span>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center justify-center px-2 py-2">
                      <p className="text-center text-sm font-extrabold leading-tight text-primary sm:text-base">
                        {ELEMENT_LABELS[element]}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      )}

      <div className="relative z-10 mx-5 mb-4 shrink-0">
        {!started ? (
          <TactileButton onClick={() => setStarted(true)}>
            Let's go! <ChevronRightIcon className="h-5 w-5 text-secondary" />
          </TactileButton>
        ) : (
          <TactileButton onClick={handleDone} disabled={tapped.size < elements.length}>
            I Told the Whole Story! <ChevronRightIcon className="h-5 w-5 text-secondary" />
          </TactileButton>
        )}
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      aria-hidden
    >
      <path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BrainIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden
    >
      <path
        d="M9 4a3 3 0 0 0-3 3v.3A3 3 0 0 0 4 10v1a3 3 0 0 0 1.5 2.6A3 3 0 0 0 8 18h1v-2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 4a3 3 0 0 1 3 3v.3A3 3 0 0 1 20 10v1a3 3 0 0 1-1.5 2.6A3 3 0 0 1 16 18h-1v-2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 4h6v11.5a2.5 2.5 0 0 1-5 0" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
