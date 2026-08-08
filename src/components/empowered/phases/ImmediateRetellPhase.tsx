/* ---------------------------------------------
 * Story Overview / Retell phase
 * Shows every scene of the story at once so the child can
 * review the whole narrative and retell it before answering
 * comprehension questions. Audio is always tap-to-hear.
 * --------------------------------------------- */

import { type ComponentType } from "react";
import { CheckCircle2, Hand, Heart, MapPin, TriangleAlert, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StoryElement, StoryPhaseProps } from "@/types/story";
import { resolveStoryImage } from "@/services/storyImages";
import { TactileButton } from "../TactileButton";
import { MiniPlane, Star } from "../StoryProsBrand";
import { ChevronRightIcon } from "../StoryProsUi";
import { ProgressHeader } from "./ProgressHeader";
import { useListen } from "./ListenButton";
import { AudioButton } from "../AudioButton";
import { RetellRecorder } from "../RetellRecorder";

const ELEMENT_LABELS: Record<StoryElement, string> = {
  character: "Who",
  place: "Where",
  problem: "Problem",
  emotion: "Feeling",
  action: "Action",
  result: "Result",
};

const ELEMENT_ICONS: Record<StoryElement, ComponentType<{ className?: string }>> = {
  character: User,
  place: MapPin,
  problem: TriangleAlert,
  emotion: Heart,
  action: Hand,
  result: CheckCircle2,
};

const ELEMENT_BG: Record<StoryElement, string> = {
  character: "bg-element-character text-element-character-foreground",
  place: "bg-element-place text-element-place-foreground",
  problem: "bg-element-problem text-element-problem-foreground",
  emotion: "bg-element-emotion text-element-emotion-foreground",
  action: "bg-element-action text-element-action-foreground",
  result: "bg-element-result text-element-result-foreground",
};




export function ImmediateRetellPhase({
  storyData,
  onComplete,
  onClose,
  ttsSpeed = "normal",
  childId,
}: StoryPhaseProps) {
  const slides = [...storyData.slides].sort((a, b) => a.position - b.position);
  const fullStory = slides.map((slide) => slide.text).join(" ");
  const { supported, isPlaying, toggle } = useListen(ttsSpeed);

  function handleDone() {
    onComplete({
      phase: "immediate-retell",
      attempts: [],
      first_attempt_accuracy: 1,
      completed: true,
    });
  }

  const fullPlaying = isPlaying("full-story");

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-accent/10 to-accent/30" />
        <Star className="absolute right-8 top-28 h-5 w-5 text-secondary animate-sparkle" />
        <MiniPlane className="absolute right-10 bottom-24 h-9 w-9 rotate-12 text-secondary/60 animate-float" />
      </div>

      <div className="relative z-10">
        <ProgressHeader progress={100} label="Story Overview" onClose={onClose} />
      </div>

      {/* Mobile: simple vertical scroll. Tablet/desktop: single viewport, no scroll. */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto no-scrollbar px-5 pb-3 pt-3 sm:overflow-hidden sm:pt-2">
        <div className="mx-auto flex min-h-0 w-full max-w-[860px] flex-1 flex-col lg:max-w-[1040px]">
          {/* Compact top block: title + listen + retell prompt + recorder */}
          <div className="shrink-0">
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <h1 className="text-center font-display text-[26px] font-extrabold leading-tight text-primary sm:text-left sm:text-[28px]">
                {storyData.title}
              </h1>
              {supported && (
                <AudioButton
                  size="lg"
                  tone="primary"
                  playing={fullPlaying}
                  onClick={() => toggle(fullStory, "full-story")}
                  ariaLabel="Listen to the full story"
                  label="Listen to Story"
                  className="shrink-0"
                />
              )}
            </div>

            <div className="mt-2.5 flex flex-col gap-1 rounded-[20px] bg-card px-4 py-3 shadow-card sm:mt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <p className="text-[15px] font-extrabold leading-snug text-primary">
                Can you retell the story from beginning to end?
              </p>
              <div className="shrink-0 [&>div]:mt-0 [&>p]:mt-0">
                <RetellRecorder childId={childId} storyId={storyData.id} phase="immediate" />
              </div>
            </div>
          </div>

          <div className="mt-3 grid min-h-0 flex-1 grid-cols-1 gap-3 sm:mt-4 sm:grid-cols-3 sm:grid-rows-2 sm:gap-3">
            {slides.map((slide, index) => {
              const image = resolveStoryImage(storyData.id, slide.image);
              const element = slide.story_element;
              const Icon = ELEMENT_ICONS[element];
              const playing = isPlaying(`scene-${index}`);

              return (
                <div
                  key={slide.position}
                  className={cn(
                    "flex min-h-0 flex-col overflow-hidden rounded-xl border-2 bg-card p-3 text-left shadow-card transition-all",
                    playing ? "border-transparent ring-4 ring-primary" : "border-accent/50",
                  )}
                >
                  <div className="aspect-video w-full shrink-0 overflow-hidden rounded-lg bg-accent/50 sm:aspect-auto sm:min-h-0 sm:flex-1">
                    {image ? (
                      <img
                        src={image}
                        alt={`Scene ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-extrabold text-primary">
                        Scene {index + 1}
                      </div>
                    )}
                  </div>

                  <p className="mt-2 shrink-0 text-sm font-semibold leading-snug text-ink">
                    {slide.text}
                  </p>

                  <div className="mt-2 flex shrink-0 items-center gap-2">
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                        ELEMENT_BG[element],
                      )}
                      title={ELEMENT_LABELS[element]}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="flex-1 truncate text-xs font-extrabold uppercase tracking-wide text-ink-soft">
                      {ELEMENT_LABELS[element]}
                    </span>
                    {supported && (
                      <AudioButton
                        size="sm"
                        tone="quiet"
                        playing={playing}
                        onClick={() => toggle(slide.text, `scene-${index}`)}
                        ariaLabel={`Hear scene ${index + 1}`}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto mb-4 w-full max-w-[860px] shrink-0 px-5 lg:max-w-[1040px]">
        <TactileButton onClick={handleDone}>
          Continue to Questions <ChevronRightIcon className="h-5 w-5 text-secondary" />
        </TactileButton>
      </div>

    </div>
  );
}
