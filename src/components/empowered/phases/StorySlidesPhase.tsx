import { useState, type ComponentType } from "react";
import { CheckCircle2, Hand, Heart, MapPin, TriangleAlert, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { highlightConnective } from "@/lib/highlightConnective";
import type { StoryElement, StoryPhaseProps } from "@/types/story";
import { resolveStoryImage } from "@/services/storyImages";
import { TactileButton } from "../TactileButton";
import { MiniPlane, Star } from "../StoryProsBrand";
import { ChevronRightIcon, PaperPlaneIcon } from "../StoryProsUi";
import { ProgressHeader } from "./ProgressHeader";
import { useListen } from "./ListenButton";

const ELEMENT_LABELS: Record<StoryElement, string> = {
  character: "Character",
  place: "Place",
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

function SpeakerButton({
  playing,
  onClick,
  label,
  size = "h-11 w-11",
  iconSize = "h-5 w-5",
}: {
  playing: boolean;
  onClick: () => void;
  label: string;
  size?: string;
  iconSize?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={playing ? "Stop audio" : label}
      className={cn(
        "press-pop flex shrink-0 items-center justify-center rounded-full border-2 transition-all",
        size,
        playing
          ? "border-transparent bg-destructive text-destructive-foreground animate-pulse-glow"
          : "border-accent bg-card text-primary shadow-card hover:bg-accent/40",
      )}
    >
      {playing ? <StopIcon className={iconSize} /> : <SpeakerIcon className={iconSize} />}
    </button>
  );
}

export function StorySlidesPhase({
  storyData,
  onComplete,
  onClose,
  ttsSpeed = "normal",
}: StoryPhaseProps) {
  const [page, setPage] = useState(0);
  const slides = storyData.slides;
  const current = slides[page];
  const slideImg = resolveStoryImage(storyData.id, current.image);
  const ElementIcon = ELEMENT_ICONS[current.story_element] ?? User;
  const elementLabel = ELEMENT_LABELS[current.story_element];
  const isLast = page === slides.length - 1;
  const progress = ((page + 1) / slides.length) * 100;
  const { supported, isPlaying, toggle, cancel } = useListen(ttsSpeed);

  function goto(next: number) {
    cancel();
    setPage(next);
  }

  function handleBack() {
    if (page > 0) goto(page - 1);
  }

  function handleNext() {
    if (isLast) {
      cancel();
      onComplete({
        phase: "slides",
        attempts: [],
        first_attempt_accuracy: 1,
        completed: true,
      });
    } else {
      goto(page + 1);
    }
  }

  const marker = (
    <>
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card sm:h-[72px] sm:w-[72px]">
        <ElementIcon className="h-8 w-8" />
      </span>
      <span className="text-sm font-extrabold text-ink-soft">{elementLabel}</span>
      {supported && (
        <SpeakerButton
          playing={isPlaying("element")}
          onClick={() => toggle(elementLabel, "element")}
          label={`Hear ${elementLabel}`}
          size="h-10 w-10"
          iconSize="h-4 w-4"
        />
      )}
    </>
  );

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-accent/10 to-accent/35" />
        <Star className="absolute left-8 top-32 h-4 w-4 text-secondary animate-sparkle" />
        <Star className="absolute right-9 top-48 h-5 w-5 text-primary/30 animate-sparkle" />
        <MiniPlane className="absolute right-12 bottom-24 h-9 w-9 rotate-12 text-secondary animate-float" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[680px]">
        <ProgressHeader
          progress={progress}
          label={`${page + 1}/${slides.length}`}
          onClose={onClose}
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[680px] flex-1 flex-col justify-center overflow-y-auto no-scrollbar px-5 pb-5 pt-4">
        <div key={page} className="flex w-full gap-4 animate-pop-in">
          {/* Story element marker — left gutter on tablet/desktop */}
          <div className="hidden w-[86px] shrink-0 flex-col items-center justify-center gap-2 text-center sm:flex">
            {marker}
          </div>

          <article className="flex min-w-0 flex-1 flex-col">
            {/* Mobile marker row */}
            <div className="mb-3 flex items-center gap-3 sm:hidden">{marker}</div>

            <div className="relative aspect-video w-full overflow-hidden rounded-[28px] bg-accent shadow-soft">
              {slideImg ? (
                <img
                  src={slideImg}
                  alt=""
                  className="h-full w-full object-cover object-[center_35%]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-primary">
                  <PaperPlaneIcon className="h-16 w-16" />
                </div>
              )}
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-[26px] bg-card p-4 shadow-soft sm:p-5">
              {supported && (
                <SpeakerButton
                  playing={isPlaying("sentence")}
                  onClick={() => toggle(current.text, "sentence")}
                  label="Listen to this page"
                />
              )}
              <p className="min-h-[3.5rem] flex-1 text-[22px] font-extrabold leading-snug text-primary sm:text-[24px]">
                {highlightConnective(current.text, storyData.target_connective)}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <TactileButton
                variant="ghost"
                fullWidth={false}
                onClick={handleBack}
                disabled={page === 0}
                className="shrink-0 px-5"
                aria-label="Previous page"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  aria-hidden
                >
                  <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back
              </TactileButton>

              <TactileButton onClick={handleNext} className="flex-1">
                {isLast ? "Done" : "Next"}
                <ChevronRightIcon className="h-5 w-5 text-secondary" />
              </TactileButton>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}


