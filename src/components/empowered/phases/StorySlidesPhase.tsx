import { useEffect, useState, type ComponentType } from "react";
import {
  CheckCircle2,
  Hand,
  Heart,
  MapPin,
  TriangleAlert,
  User,
  Volume2,
  VolumeX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { highlightConnective } from "@/lib/highlightConnective";
import type { StoryElement, StoryPhaseProps } from "@/types/story";
import { resolveStoryImage } from "@/services/storyImages";
import { isSupported, preloadVoices, speak, speedToRate, stop } from "@/services/tts";
import { TactileButton } from "../TactileButton";
import { MiniPlane, Star } from "../StoryProsBrand";
import { ChevronRightIcon, PaperPlaneIcon } from "../StoryProsUi";
import { ProgressHeader } from "./ProgressHeader";

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

export function StorySlidesPhase({
  storyData,
  onComplete,
  onClose,
  ttsSpeed = "normal",
}: StoryPhaseProps) {
  const [page, setPage] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const slides = storyData.slides;
  const current = slides[page];
  const slideImg = resolveStoryImage(storyData.id, current.image);
  const isLast = page === slides.length - 1;
  const progress = ((page + 1) / slides.length) * 100;

  useEffect(() => {
    preloadVoices();
  }, []);

  useEffect(() => {
    return () => {
      stop();
      setSpeaking(false);
    };
  }, [page]);

  async function handleListen() {
    if (speaking) {
      stop();
      setSpeaking(false);
      return;
    }

    setSpeaking(true);
    try {
      await speak(current.text, { rate: speedToRate(ttsSpeed) });
    } catch {
      // Ignore browser TTS errors.
    }
    setSpeaking(false);
  }

  function handleNext() {
    if (isLast) {
      onComplete({
        phase: "slides",
        attempts: [],
        first_attempt_accuracy: 1,
        completed: true,
      });
    } else {
      setPage(page + 1);
    }
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-accent/10 to-accent/35" />
        <Star className="absolute left-8 top-32 h-4 w-4 text-secondary animate-sparkle" />
        <Star className="absolute right-9 top-48 h-5 w-5 text-primary/30 animate-sparkle" />
        <MiniPlane className="absolute right-12 bottom-24 h-9 w-9 rotate-12 text-secondary animate-float" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[560px]">
        <ProgressHeader
          progress={progress}
          label={`${page + 1}/${slides.length}`}
          onClose={onClose}
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[560px] flex-1 flex-col overflow-hidden px-5 pb-5 pt-4">
        <article
          key={page}
          className="flex flex-1 flex-col overflow-hidden rounded-[34px] bg-card shadow-soft animate-pop-in"
        >
          <div className="relative aspect-video w-full overflow-hidden bg-accent">
            {slideImg ? (
              <img src={slideImg} alt="" className="h-full w-full object-cover object-[center_35%]" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-primary">
                <PaperPlaneIcon className="h-16 w-16" />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-primary/75 to-transparent" />
            <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-card/95 px-3 py-2 text-xs font-extrabold uppercase tracking-wide text-primary shadow-card">
              <User className="h-4 w-4" />
              {ELEMENT_LABELS[current.story_element]}
            </span>
          </div>

          <div className="flex flex-1 flex-col p-5">
            <div className="mb-3 flex items-center gap-3">
              {isSupported() && (
                <button
                  onClick={handleListen}
                  className={cn(
                    "press-pop inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-extrabold shadow-card transition-colors",
                    speaking
                      ? "bg-destructive text-destructive-foreground animate-pulse-glow"
                      : "bg-secondary/25 text-secondary-foreground",
                  )}
                  aria-label={speaking ? "Stop audio" : "Listen"}
                >
                  {speaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  {speaking ? "Stop" : "Listen"}
                </button>
              )}
            </div>

            <p className="text-[24px] font-extrabold leading-snug text-primary">
              {highlightConnective(current.text, storyData.target_connective)}
            </p>

            <div className="mt-auto pt-5">
              <div className="mb-4 flex justify-center gap-1.5">
                {slides.map((slide, index) => (
                  <span
                    key={slide.position}
                    className={cn(
                      "h-2.5 rounded-full transition-all",
                      index === page ? "w-8 bg-primary" : "w-2.5 bg-accent",
                    )}
                  />
                ))}
              </div>

              <TactileButton onClick={handleNext} className="w-full">
                {isLast ? "Done" : "Next"}
                <ChevronRightIcon className="h-5 w-5 text-secondary" />
              </TactileButton>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

