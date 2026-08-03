import { useState, type ComponentType } from "react";
import { CheckCircle2, Hand, Heart, MapPin, TriangleAlert, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { highlightConnective } from "@/lib/highlightConnective";
import type { StoryElement, StoryPhaseProps } from "@/types/story";
import { resolveStoryImage } from "@/services/storyImages";
import { TactileButton } from "../TactileButton";
import { Star } from "../StoryProsBrand";
import { ChevronRightIcon, PaperPlaneIcon } from "../StoryProsUi";
import { ProgressHeader } from "./ProgressHeader";
import { useListen } from "./ListenButton";
import { AudioButton } from "../AudioButton";
import { useDevSubSteps } from "./DevPhaseNav";

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

const ELEMENT_COLORS: Record<
  StoryElement,
  { bg: string; text: string; iconBg: string; ring: string }
> = {
  character: {
    bg: "bg-element-character",
    text: "text-element-character-foreground",
    iconBg: "bg-element-character-foreground/20",
    ring: "ring-element-character-foreground/30",
  },
  place: {
    bg: "bg-element-place",
    text: "text-element-place-foreground",
    iconBg: "bg-element-place-foreground/20",
    ring: "ring-element-place-foreground/30",
  },
  problem: {
    bg: "bg-element-problem",
    text: "text-element-problem-foreground",
    iconBg: "bg-element-problem-foreground/20",
    ring: "ring-element-problem-foreground/30",
  },
  emotion: {
    bg: "bg-element-emotion",
    text: "text-element-emotion-foreground",
    iconBg: "bg-element-emotion-foreground/20",
    ring: "ring-element-emotion-foreground/30",
  },
  action: {
    bg: "bg-element-action",
    text: "text-element-action-foreground",
    iconBg: "bg-element-action-foreground/20",
    ring: "ring-element-action-foreground/30",
  },
  result: {
    bg: "bg-element-result",
    text: "text-element-result-foreground",
    iconBg: "bg-element-result-foreground/20",
    ring: "ring-element-result-foreground/30",
  },
};

export function StorySlidesPhase({
  storyData,
  onComplete,
  onClose,
  ttsSpeed = "normal",
}: StoryPhaseProps) {
  const [page, setPage] = useState(0);
  const slides = storyData.slides;
  useDevSubSteps(slides.length, page, setPage, "page");
  const current = slides[page];
  const slideImg = resolveStoryImage(storyData.id, current.image);
  const ElementIcon = ELEMENT_ICONS[current.story_element] ?? User;
  const elementLabel = ELEMENT_LABELS[current.story_element];
  const elementColors = ELEMENT_COLORS[current.story_element];
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

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-accent/10 to-accent/35" />
        <Star className="absolute left-6 top-40 h-4 w-4 text-secondary/70 animate-sparkle" />
        <Star className="absolute right-6 bottom-40 h-5 w-5 text-primary/25 animate-sparkle" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[600px]">
        <ProgressHeader
          progress={progress}
          label={`${page + 1}/${slides.length}`}
          onClose={onClose}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[600px] flex-1 overflow-y-auto no-scrollbar px-5 pb-6 pt-6">
        <div key={page} className="flex w-full flex-col animate-pop-in">
          {/* Story element badge — color-coded pill so the grammar label stands out */}
          <div className="mb-4 flex items-center gap-2.5">
            {supported && (
              <AudioButton
                size="sm"
                tone="quiet"
                playing={isPlaying("element")}
                onClick={() => toggle(elementLabel, "element")}
                text={elementLabel}
              />
            )}
            <span
              className={cn(
                "inline-flex items-center gap-2.5 rounded-full pl-1.5 pr-2.5 py-2 shadow-card ring-2 ring-inset",
                elementColors.bg,
                elementColors.text,
                elementColors.ring,
              )}
            >
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  elementColors.iconBg,
                )}
              >
                <ElementIcon className="h-5 w-5" />
              </span>
              <span className="text-sm font-extrabold uppercase tracking-wide">
                {elementLabel}
              </span>
            </span>
          </div>

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

          <div className="mt-5 flex min-h-[104px] items-start gap-4 rounded-[26px] bg-card p-4 shadow-soft sm:p-5">
            {supported && (
              <AudioButton
                size="lg"
                tone="primary"
                playing={isPlaying("sentence")}
                onClick={() => toggle(current.text, "sentence")}
                ariaLabel="Listen to this page"
              />
            )}
            <p className="flex-1 pt-1 text-[22px] font-extrabold leading-[1.35] text-primary sm:text-[24px]">
              {highlightConnective(current.text, storyData.target_connective)}
            </p>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              disabled={page === 0}
              aria-label="Previous page"
              className={cn(
                "press-pop flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-primary/25 bg-card text-primary shadow-card transition-all",
                page === 0 && "pointer-events-none opacity-40",
              )}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                aria-hidden
              >
                <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <TactileButton onClick={handleNext} className="flex-1">
              {isLast ? "Done" : "Next"}
              <ChevronRightIcon className="h-5 w-5 text-secondary" />
            </TactileButton>
          </div>
        </div>
      </div>
    </div>
  );
}
