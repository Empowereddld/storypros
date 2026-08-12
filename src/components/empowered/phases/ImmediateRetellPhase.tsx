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
    earnCoins({
      storyId: storyData.id,
      activity: "immediate-retell",
      amount: COIN_ECONOMY["immediate-retell"].completion,
      label: "Nice telling!",
    });
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
      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto no-scrollbar px-4 pb-2 pt-2 sm:overflow-hidden sm:px-6">
        <div className="mx-auto flex min-h-0 w-full max-w-[880px] flex-1 flex-col lg:max-w-[1080px]">
          {/* One compact command bar: title · listen · retell */}
          <div className="shrink-0 overflow-hidden rounded-[24px] border border-primary/10 bg-card/95 shadow-card backdrop-blur-sm">
            <div className="flex flex-col gap-3 p-4 sm:p-5 lg:flex-row lg:items-center lg:gap-6">
              {/* Title block */}
              <div className="min-w-0 flex-1 text-center lg:text-left">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/70 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-primary">
                  Step 1 · Retell
                </span>
                <h1 className="mt-1.5 font-display text-[22px] font-extrabold leading-tight text-primary sm:text-[26px]">
                  {storyData.title}
                </h1>
                <p className="mt-0.5 text-[13px] font-semibold leading-snug text-ink-soft">
                  Can you retell the story from beginning to end?
                </p>
              </div>

              {/* Divider */}
              <div className="hidden h-14 w-px shrink-0 bg-primary/10 lg:block" />

              {/* Actions */}
              <div className="flex shrink-0 flex-col items-stretch gap-2 sm:mx-auto sm:w-auto sm:items-center lg:mx-0 lg:items-end">
                <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-2.5">
                  {supported && (
                    <AudioButton
                      size="lg"
                      tone="primary"
                      playing={fullPlaying}
                      onClick={() => toggle(fullStory, "full-story")}
                      ariaLabel="Listen to the full story"
                      label="Listen to Story"
                      className="shrink-0 justify-center"
                    />
                  )}
                  <div className="min-w-0 [&>div]:mt-0 [&>div]:justify-center [&>div]:bg-transparent [&>div]:px-0 [&>div]:py-0 [&>div>p]:hidden">
                    <RetellRecorder childId={childId} storyId={storyData.id} phase="immediate" />
                  </div>
                </div>
                <p className="text-center text-[11px] font-semibold text-ink-soft/80 lg:text-right">
                  Recording is optional — saved for a grown-up to hear later.
                </p>
              </div>
            </div>
          </div>



          <div className="mt-3 grid grid-cols-1 gap-3 sm:mt-3 sm:min-h-0 sm:flex-1 sm:grid-cols-3 sm:grid-rows-2 sm:gap-3.5">
            {slides.map((slide, index) => {
              const image = resolveStoryImage(storyData.id, slide.image);
              const element = slide.story_element;
              const Icon = ELEMENT_ICONS[element];
              const playing = isPlaying(`scene-${index}`);

              return (
                <div
                  key={slide.position}
                  className={cn(
                    "group relative flex flex-col overflow-hidden rounded-[20px] bg-card shadow-card ring-1 transition-all sm:min-h-0",
                    playing ? "ring-4 ring-primary" : "ring-primary/10",
                  )}
                >
                  <div className="relative aspect-video w-full shrink-0 grow-0 overflow-hidden bg-accent/40 sm:aspect-auto sm:min-h-0 sm:basis-[72%]">
                    {image ? (
                      <img
                        src={image}
                        alt={`Scene ${index + 1}`}
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-extrabold text-primary">
                        Scene {index + 1}
                      </div>
                    )}

                    {/* Element chip floating on the image */}
                    <span
                      className={cn(
                        "absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full pl-1.5 pr-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide shadow-card",
                        ELEMENT_BG[element],
                      )}
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/25">
                        <Icon className="h-3 w-3" />
                      </span>
                      {ELEMENT_LABELS[element]}
                    </span>

                    {supported && (
                      <div className="absolute right-2 top-2">
                        <AudioButton
                          size="sm"
                          tone="primary"
                          playing={playing}
                          onClick={() => toggle(slide.text, `scene-${index}`)}
                          ariaLabel={`Hear scene ${index + 1}`}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex shrink-0 items-start gap-2 px-3 py-2.5 sm:min-h-0 sm:flex-1 sm:shrink sm:items-center sm:overflow-hidden">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/60 text-[10px] font-extrabold text-primary">
                      {index + 1}
                    </span>
                    <p className="text-[13.5px] font-semibold leading-snug text-ink">
                      {slide.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto mb-3 w-full max-w-[880px] shrink-0 px-4 sm:px-6 lg:max-w-[1080px]">
        <TactileButton onClick={handleDone}>
          Continue to Questions <ChevronRightIcon className="h-5 w-5 text-secondary" />
        </TactileButton>
      </div>

    </div>
  );
}
