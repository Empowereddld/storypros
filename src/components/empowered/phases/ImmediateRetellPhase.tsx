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
  character: "bg-element-character-foreground",
  place: "bg-element-place-foreground",
  problem: "bg-element-problem-foreground",
  emotion: "bg-element-emotion-foreground",
  action: "bg-element-action-foreground",
  result: "bg-element-result-foreground",
};

function SpeakerIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden
    >
      <path d="M4 10v4h3l4 3.5V6.5L7 10H4z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.5 9.2a4 4 0 010 5.6M18 6.7a7.5 7.5 0 010 10.6" strokeLinecap="round" />
    </svg>
  );
}

function StopIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <rect x="6" y="6" width="12" height="12" rx="2.5" />
    </svg>
  );
}

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

      <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar px-5 pb-4 pt-5">
        <div className="mx-auto w-full max-w-[860px]">
          <h1 className="text-center font-display text-[32px] font-extrabold leading-tight text-primary">
            {storyData.title}
          </h1>

          {supported && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => toggle(fullStory, "full-story")}
                aria-label={fullPlaying ? "Stop audio" : "Listen to the full story"}
                className={cn(
                  "press-pop flex min-h-[48px] items-center gap-2.5 rounded-full border-2 px-6 text-base font-extrabold transition-all",
                  fullPlaying
                    ? "border-transparent bg-destructive text-destructive-foreground animate-pulse-glow"
                    : "border-accent bg-card text-primary shadow-card hover:bg-accent/40",
                )}
              >
                {fullPlaying ? <StopIcon /> : <SpeakerIcon />}
                <span className="whitespace-nowrap">
                  {fullPlaying ? "Stop" : "Listen to Full Story"}
                </span>
              </button>
            </div>
          )}

          <div className="mt-5 rounded-[24px] bg-card p-4 shadow-card">
            <p className="text-base font-extrabold leading-snug text-primary">
              Can you retell {storyData.title} from beginning to end?
            </p>
            <RetellRecorder childId={childId} storyId={storyData.id} phase="immediate" />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
            {slides.map((slide, index) => {
              const image = resolveStoryImage(storyData.id, slide.image);
              const element = slide.story_element;
              const Icon = ELEMENT_ICONS[element];
              const playing = isPlaying(`scene-${index}`);

              return (
                <button
                  key={slide.position}
                  type="button"
                  onClick={() => toggle(slide.text, `scene-${index}`)}
                  aria-label={`Hear scene ${index + 1}`}
                  className={cn(
                    "flex min-h-[220px] flex-col rounded-xl border-2 bg-card p-4 text-left shadow-card transition-all",
                    playing ? "scale-105 border-transparent ring-4 ring-primary" : "border-accent/50",
                  )}
                >
                  <div className="aspect-video w-full overflow-hidden rounded-lg bg-accent/50">
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

                  <p className="mt-3 flex-1 text-sm font-semibold leading-snug text-ink">
                    {slide.text}
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white",
                        ELEMENT_BG[element],
                      )}
                      title={ELEMENT_LABELS[element]}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-extrabold uppercase tracking-wide text-ink-soft">
                      {ELEMENT_LABELS[element]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto mb-5 w-full max-w-[860px] px-5">
        <TactileButton onClick={handleDone}>
          Continue to Questions <ChevronRightIcon className="h-5 w-5 text-secondary" />
        </TactileButton>
      </div>
    </div>
  );
}
