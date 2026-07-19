import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { SFATeachingSlide, StoryPhaseProps } from "@/types/story";
import { resolveStoryImage } from "@/services/storyImages";
import { TactileButton } from "../TactileButton";
import { MiniPlane, Star } from "../StoryProsBrand";
import { BookIcon, ChevronRightIcon, PaperPlaneIcon } from "../StoryProsUi";
import { ProgressHeader } from "./ProgressHeader";
import { ListenButton, useListen } from "./ListenButton";

const SFA_KEYS = ["category", "function", "appearance", "parts", "location"] as const;

const SFA_LABELS: Record<string, string> = {
  category: "Group",
  function: "What it does",
  appearance: "Looks like",
  parts: "Parts",
  location: "Where",
};

export function VocabularyIntroPhase({
  storyData,
  onComplete,
  onClose,
  ttsSpeed = "normal",
}: StoryPhaseProps) {
  const words = storyData.vocabulary_words;
  const [wordIdx, setWordIdx] = useState(0);
  const [featureIdx, setFeatureIdx] = useState(-1);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  // Vocab narration is clamped to at most "normal" speed for clarity.
  const { supported, isPlaying, toggle, cancel } = useListen(
    ttsSpeed === "fast" ? "normal" : ttsSpeed,
  );

  // Stop narration when the word or feature changes.
  useEffect(() => cancel, [wordIdx, featureIdx, cancel]);

  const word = words[wordIdx];
  const wordImage = resolveStoryImage(storyData.id, word.image);
  const introNarration = word.sfa_teaching?.intro_narration;
  const totalSteps = words.length * (SFA_KEYS.length + 1);
  const currentStep = wordIdx * (SFA_KEYS.length + 1) + (featureIdx + 1);
  const progress = (currentStep / totalSteps) * 100;
  const isOnTitleCard = featureIdx === -1;
  const allRevealed = !isOnTitleCard && revealed.size >= 1;

  function handleNext() {
    if (featureIdx < SFA_KEYS.length - 1) {
      setFeatureIdx(featureIdx + 1);
      setRevealed(new Set());
      return;
    }

    if (wordIdx < words.length - 1) {
      setWordIdx(wordIdx + 1);
      setFeatureIdx(-1);
      setRevealed(new Set());
      return;
    }

    onComplete({
      phase: "vocab-intro",
      attempts: [],
      first_attempt_accuracy: 1,
      completed: true,
    });
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-accent/10 to-accent/35" />
        <Star className="absolute left-8 top-28 h-4 w-4 text-secondary animate-sparkle" />
        <Star className="absolute right-9 top-48 h-5 w-5 text-primary/30 animate-sparkle" />
        <MiniPlane className="absolute right-12 bottom-24 h-9 w-9 rotate-12 text-secondary animate-float" />
      </div>

      <div className="relative z-10">
        <ProgressHeader
          progress={progress}
          label={`Word ${wordIdx + 1}/${words.length}`}
          onClose={onClose}
        />
      </div>

      {isOnTitleCard ? (
        <div className="relative z-10 flex flex-1 flex-col px-5 pb-5 pt-5">
          <section className="flex flex-1 flex-col items-center justify-center rounded-[34px] bg-card p-6 text-center shadow-soft animate-pop-in">
            <div className="relative h-44 w-44 overflow-hidden rounded-[34px] bg-accent shadow-card">
              {wordImage ? (
                <img src={wordImage} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-primary">
                  <PaperPlaneIcon className="h-16 w-16" />
                </div>
              )}
            </div>

            <span className="mt-5 rounded-full bg-secondary/25 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide text-secondary-foreground">
              {word.type === "emotion" ? "Feeling Word" : "Story Word"}
            </span>

            <h1 className="mt-3 text-[40px] font-extrabold capitalize leading-none text-primary">
              {word.word}
            </h1>

            {supported && (
              <button
                onClick={() => toggle(word.word, "word")}
                className={cn(
                  "press-pop mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold shadow-card",
                  isPlaying("word")
                    ? "bg-destructive text-destructive-foreground animate-pulse-glow"
                    : "bg-primary text-primary-foreground",
                )}
              >
                {isPlaying("word") ? "Stop" : "Hear It"}
                <SpeakerIcon playing={isPlaying("word")} />
              </button>
            )}

            <p className="mt-5 max-w-[285px] text-base font-semibold leading-relaxed text-ink-soft">
              {word.sfa_teaching?.intro_text ?? "Let's learn what this word means."}
            </p>

            {supported && introNarration && (
              <div className="mt-4 flex justify-center">
                <ListenButton
                  playing={isPlaying("intro")}
                  onClick={() => toggle(introNarration, "intro")}
                  className="h-12 w-12"
                  ariaLabel="Hear about this word"
                />
              </div>
            )}
          </section>

          <TactileButton className="mt-4" onClick={() => setFeatureIdx(0)}>
            Explore the Word <ChevronRightIcon className="h-5 w-5 text-secondary" />
          </TactileButton>
        </div>
      ) : (
        <div className="relative z-10 flex flex-1 flex-col overflow-hidden px-5 pb-5 pt-4">
          <section className="rounded-[30px] bg-card p-4 shadow-soft">
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-accent text-primary">
                <BookIcon className="h-8 w-8" />
              </span>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wide text-ink-soft">
                  Explore
                </p>
                <h1 className="text-[28px] font-extrabold capitalize leading-tight text-primary">
                  {word.word}
                </h1>
              </div>
            </div>
          </section>

          <div className="mt-4 flex-1 space-y-3 overflow-y-auto no-scrollbar pb-2">
            {SFA_KEYS.map((key, index) => {
              const isActive = index === featureIdx;
              const isPast = index < featureIdx;
              const isFuture = index > featureIdx;
              const isRevealed = revealed.has(index) || isPast;
              const teachingSlide = word.sfa_teaching?.slides?.find(
                (slide: SFATeachingSlide) => slide.feature === key,
              );
              const displayPrompt = teachingSlide?.prompt;
              const displayText = teachingSlide?.teaching_text || word.sfa[key];
              const narration = teachingSlide?.narration;

              return (
                <div key={key}>
                <button
                  onClick={() => isActive && setRevealed((prev) => new Set(prev).add(index))}
                  disabled={!isActive}
                  className={cn(
                    "w-full rounded-[26px] border-2 bg-card p-4 text-left shadow-card transition-all",
                    isActive && !isRevealed && "border-primary bg-primary/5 animate-pulse-glow",
                    isActive && isRevealed && "border-primary bg-primary/5",
                    isPast && "border-success/40 bg-success/5",
                    isFuture && "border-transparent opacity-45",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] text-sm font-extrabold",
                        isPast ? "bg-success text-success-foreground" : "bg-accent text-primary",
                      )}
                    >
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-extrabold uppercase tracking-wide text-primary">
                        {SFA_LABELS[key]}
                      </p>
                      {isActive && !isRevealed && displayPrompt && (
                        <p className="mt-1 text-sm font-semibold leading-snug text-ink-soft">
                          {displayPrompt}
                        </p>
                      )}
                      {isRevealed && (
                        <p className="mt-1 text-base font-semibold leading-snug text-ink">
                          {displayText}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
                {isActive && isRevealed && supported && narration && (
                  <div className="mt-2 flex justify-center">
                    <ListenButton
                      playing={isPlaying(`feat-${index}`)}
                      onClick={() => toggle(narration, `feat-${index}`)}
                      className="h-11 w-11"
                      ariaLabel="Hear this feature"
                    />
                  </div>
                )}
                </div>
              );
            })}
          </div>

          <TactileButton onClick={handleNext} disabled={!allRevealed}>
            {featureIdx === SFA_KEYS.length - 1 && wordIdx === words.length - 1 ? "Done" : "Next"}
          </TactileButton>
        </div>
      )}
    </div>
  );
}

function SpeakerIcon({ playing }: { playing: boolean }) {
  if (playing) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
        <rect x="6" y="6" width="12" height="12" rx="2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
