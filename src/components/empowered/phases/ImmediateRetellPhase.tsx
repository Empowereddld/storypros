import { useState } from "react";
import { cn } from "@/lib/utils";
import type { StoryElement, StoryPhaseProps } from "@/types/story";
import { resolveStoryImage } from "@/services/storyImages";
import { TactileButton } from "../TactileButton";
import { MiniPlane, Star } from "../StoryProsBrand";
import { BookIcon, ChevronRightIcon, PaperPlaneIcon } from "../StoryProsUi";
import { ProgressHeader } from "./ProgressHeader";
import { ListenButton, useListen } from "./ListenButton";
import { RetellRecorder } from "../RetellRecorder";

const ELEMENT_LABELS: Record<StoryElement, string> = {
  character: "Who",
  place: "Where",
  problem: "Problem",
  emotion: "Feeling",
  action: "What Happened",
  result: "Result",
};

const ELEMENT_HELPERS: Record<StoryElement, string> = {
  character: "Name the people in the story.",
  place: "Say where the story happened.",
  problem: "Tell what got tricky.",
  emotion: "Share how they felt.",
  action: "Explain what they did next.",
  result: "Finish with what changed.",
};

export function ImmediateRetellPhase({
  storyData,
  onComplete,
  onClose,
  ttsSpeed = "normal",
  childId,
}: StoryPhaseProps) {
  const elements = storyData.retell_prompts.story_elements;
  const [tapped, setTapped] = useState<Set<StoryElement>>(new Set());
  const progress = elements.length > 0 ? (tapped.size / elements.length) * 100 : 0;
  const immediatePrompt = storyData.retell_prompts.immediate;
  const { supported, isPlaying, toggle } = useListen(ttsSpeed);

  function handleTap(element: StoryElement) {
    setTapped((prev) => {
      const next = new Set(prev);
      next.add(element);
      return next;
    });
  }

  function handleDone() {
    onComplete({
      phase: "immediate-retell",
      attempts: [],
      first_attempt_accuracy: 1,
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
        <ProgressHeader progress={progress} label="Retell" onClose={onClose} />
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar px-5 pb-4 pt-4">
        <section className="rounded-[30px] bg-card p-5 shadow-soft animate-slide-up">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] bg-accent text-primary">
              <BookIcon className="h-9 w-9" />
            </div>
            <div>
              <h1 className="text-[30px] font-extrabold leading-tight text-primary">
                Retell the Story
              </h1>
              <p className="mt-1 text-sm font-semibold leading-snug text-ink-soft">
                Tap each story part while you tell what happened.
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-[24px] bg-accent/60 p-4">
            <p className="flex-1 text-xl font-extrabold leading-snug text-primary">
              Can you retell {storyData.title} from beginning to end?
            </p>
            {supported && (
              <ListenButton
                playing={isPlaying("immediate")}
                onClick={() => toggle(immediatePrompt, "immediate")}
                className="h-11 w-11"
                ariaLabel="Hear the retell prompt"
              />
            )}
          </div>

          <RetellRecorder childId={childId} storyId={storyData.id} phase="immediate" />
        </section>

        <section className="mt-5">
          <div className="flex items-center gap-2">
            <BookIcon className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-extrabold text-primary">Story Parts</h2>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            {elements.map((element, index) => {
              const selected = tapped.has(element);
              const slide = storyData.slides.find((item) => item.story_element === element);
              const image = slide ? resolveStoryImage(storyData.id, slide.image) : null;

              return (
                <button
                  key={`${element}-${index}`}
                  onClick={() => handleTap(element)}
                  className={cn(
                    "hover-lift min-h-[204px] overflow-hidden rounded-[24px] border-2 bg-card text-left shadow-card transition-all active:scale-[0.98]",
                    selected ? "border-success bg-success/5" : "border-accent/60",
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
                  <div className="p-3">
                    <p className="text-base font-extrabold leading-tight text-primary">
                      {ELEMENT_LABELS[element]}
                    </p>
                    <p className="mt-1 text-[12px] font-medium leading-snug text-ink-soft">
                      {ELEMENT_HELPERS[element]}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div className="relative z-10 mx-5 mb-5">
        <TactileButton onClick={handleDone} disabled={tapped.size < elements.length}>
          I Retold It <ChevronRightIcon className="h-5 w-5 text-secondary" />
        </TactileButton>
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
