import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { SFATeachingSlide, StoryPhaseProps } from "@/types/story";
import { resolveStoryImage } from "@/services/storyImages";
import { TactileButton } from "../TactileButton";
import { MiniPlane, Star } from "../StoryProsBrand";
import { BookIcon, ChevronRightIcon, PaperPlaneIcon } from "../StoryProsUi";
import { ProgressHeader } from "./ProgressHeader";
import { ListenButton, useListen } from "./ListenButton";
import { AudioButton } from "../AudioButton";
import { useDevSubSteps } from "./DevPhaseNav";

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
  const devPerWord = SFA_KEYS.length + 1;
  useDevSubSteps(
    words.length * devPerWord,
    wordIdx * devPerWord + (featureIdx + 1),
    (i: number) => {
      setWordIdx(Math.floor(i / devPerWord));
      setFeatureIdx((i % devPerWord) - 1);
    },
    "screen",
  );
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
        <div className="relative z-10 flex flex-1 flex-col items-center overflow-y-auto no-scrollbar px-5 pb-6 pt-4">
          <div className="w-full max-w-[580px]">
            <section className="flex flex-col items-center rounded-[40px] border border-accent/50 bg-card px-6 py-8 text-center shadow-soft animate-pop-in sm:px-10">
              {/* Word picture with its one tap-to-hear control */}
              <div className="relative">
                <div className="flex h-44 w-44 items-center justify-center overflow-hidden rounded-[42px] bg-accent shadow-inner sm:h-52 sm:w-52">
                  {wordImage ? (
                    <img src={wordImage} alt="" className="h-full w-full object-contain p-3" />
                  ) : (
                    <PaperPlaneIcon className="h-16 w-16 text-primary" />
                  )}
                </div>

                {supported && (
                  <button
                    type="button"
                    onClick={() => toggle(word.word, "word")}
                    aria-label={`Hear "${word.word}"`}
                    aria-pressed={isPlaying("word")}
                    className={cn(
                      "absolute -bottom-3 -right-3 flex h-16 w-16 items-center justify-center rounded-[22px] bg-secondary text-primary transition-all",
                      "shadow-[0_7px_0_hsl(45_98%_43%)] active:translate-y-[5px] active:shadow-[0_2px_0_hsl(45_98%_43%)]",
                      isPlaying("word") && "ring-4 ring-primary/25",
                    )}
                  >
                    <SpeakerGlyph className="h-8 w-8" />
                  </button>
                )}
              </div>

              <span className="mt-7 rounded-lg bg-accent/70 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-primary">
                {word.type === "emotion" ? "Feeling Word" : "Story Word"}
              </span>

              <h1 className="mt-2 text-[44px] font-extrabold capitalize leading-none tracking-tight text-primary sm:text-[56px]">
                {word.word}
              </h1>

              <div className="mt-6 w-full max-w-[400px] rounded-[30px] border border-accent/60 bg-accent/20 p-5">
                <p className="text-[15.5px] font-semibold leading-relaxed text-ink">
                  {word.sfa_teaching?.intro_text ?? "Let's learn what this word means."}
                </p>

                {supported && introNarration && (
                  <div className="mt-3 flex justify-center">
                    <AudioButton
                      size="sm"
                      playing={isPlaying("intro")}
                      onClick={() => toggle(introNarration, "intro")}
                      ariaLabel="Hear what this word means"
                    />
                  </div>
                )}
              </div>
            </section>

            <TactileButton className="mt-4" onClick={() => setFeatureIdx(0)}>
              Explore the Word <ChevronRightIcon className="h-5 w-5 text-secondary" />
            </TactileButton>
          </div>
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

