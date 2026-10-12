/* ─────────────────────────────────────────────
 * Level 1 vocabulary teaching flow
 *
 * Reusable template for ANY Level 1 target word:
 *   Step 1  word intro   (word + picture + audio + short definition)
 *   Step 2  GROUP
 *   Step 3  WHAT IT DOES
 *   Step 4  LOOKS LIKE
 *   Step 5  PARTS
 *   Step 6  WHERE / WHEN YOU USE IT
 *
 * One idea → one picture → hear/read it → Next.
 * Never more than one semantic feature on screen.
 *
 * Feature pictures are resolved per story as
 *   <vocab-image-basename>-<feature>.webp
 * e.g. vocab-bandage-category.webp. When a feature picture
 * hasn't been drawn yet, the word's own picture is used, so
 * the flow works for every word from day one.
 * ───────────────────────────────────────────── */

import type * as React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  AppearanceIcon,
  CategoryIcon,
  FunctionIcon,
  LocationIcon,
  PartsIcon,
} from "../SfaIcons";
import { cn } from "@/lib/utils";
import type { SFAFeatures, SFATeachingSlide, StoryPhaseProps } from "@/types/story";
import { resolveStoryImage } from "@/services/storyImages";
import { TactileButton } from "../TactileButton";
import { MiniPlane, Star } from "../StoryProsBrand";
import { ChevronRightIcon, PaperPlaneIcon } from "../StoryProsUi";
import { ProgressHeader } from "./ProgressHeader";
import { useListen } from "./ListenButton";
import { SpeakerGlyph } from "../AudioButton";
import { useDevSubSteps } from "./DevPhaseNav";
import { earnCoins } from "@/services/coins";
import { COIN_ECONOMY } from "@/services/coinEconomy";

type HeardKey = `intro-${number}` | `feat-${number}-${number}`;

/**
 * One speaker control per vocabulary screen.
 *
 * The icon alone is the trigger — no visible label, so the UI stays clean
 * and the child can focus on the word and picture.
 */
function ListenButton({
  label,
  playing,
  onClick,
  ariaLabel,
}: {
  label?: string;
  playing: boolean;
  onClick: () => void;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={playing}
      className={cn(
        "flex h-14 w-14 shrink-0 items-center justify-center rounded-[24px] bg-secondary text-primary transition-transform",
        "shadow-[0_6px_0_color-mix(in_oklab,var(--secondary)_78%,black)] active:translate-y-[4px] active:shadow-[0_2px_0_color-mix(in_oklab,var(--secondary)_78%,black)]",
        playing && "ring-4 ring-primary-foreground/40",
        label && "w-auto gap-2.5 px-4",
      )}
    >
      <SpeakerGlyph className="h-7 w-7" />
      {label && (
        <span className="whitespace-nowrap text-[15px] font-extrabold tracking-tight">{label}</span>
      )}
    </button>
  );
}

const SFA_KEYS = ["category", "function", "appearance", "parts", "location"] as const;
type SFAKey = (typeof SFA_KEYS)[number];

const SFA_LABELS: Record<SFAKey, string> = {
  category: "What group is it in?",
  function: "What it does",
  appearance: "What it looks like?",
  parts: "What are its parts?",
  location: "Where you find it?",
};

/** Supporting academic term shown under the child-facing question. */
const SFA_HELPERS: Record<SFAKey, string> = {
  category: "CATEGORY",
  function: "FUNCTION",
  appearance: "APPEARANCE",
  parts: "PARTS",
  location: "LOCATION",
};

/**
 * Keep the on-screen sentence short and concrete — one idea.
 * Longer detail still plays through the audio narration.
 */
function shortSentence(text: string) {
  const trimmed = (text ?? "").trim();
  const match = trimmed.match(/^[^.!?]*[.!?]/);
  const first = match ? match[0].trim() : trimmed;
  return first.length >= 12 ? first : trimmed;
}


const SFA_ICONS: Record<SFAKey, (props: { className?: string }) => React.ReactElement> = {
  category: CategoryIcon,
  function: FunctionIcon,
  appearance: AppearanceIcon,
  parts: PartsIcon,
  location: LocationIcon,
};

/** vocab-bandage.webp + "category" → vocab-bandage-category.{webp,png,jpg} */
function resolveFeatureImage(storyId: string, wordImage: string | undefined, key: SFAKey) {
  if (!wordImage) return null;
  const dot = wordImage.lastIndexOf(".");
  const base = dot === -1 ? wordImage : wordImage.slice(0, dot);
  for (const ext of ["webp", "png", "jpg", "jpeg"]) {
    const hit = resolveStoryImage(storyId, `${base}-${key}.${ext}`);
    if (hit) return hit;
  }
  return null;
}

export function VocabularyIntroPhase({
  storyData,
  onComplete,
  onClose,
  ttsSpeed = "normal",
}: StoryPhaseProps) {
  const words = storyData.vocabulary_words;
  const [wordIdx, setWordIdx] = useState(0);
  // -1 = word intro screen, 0..4 = one semantic feature per screen
  const [featureIdx, setFeatureIdx] = useState(-1);

  const stepsPerWord = SFA_KEYS.length + 1;
  useDevSubSteps(
    words.length * stepsPerWord,
    wordIdx * stepsPerWord + (featureIdx + 1),
    (i: number) => {
      setWordIdx(Math.floor(i / stepsPerWord));
      setFeatureIdx((i % stepsPerWord) - 1);
    },
    "screen",
  );

  // Vocab narration is clamped to at most "normal" speed for clarity.
  const { supported, isPlaying, toggle, cancel } = useListen(
    ttsSpeed === "fast" ? "normal" : ttsSpeed,
  );

  // Track which screen's audio has been played at least once, so the
  // Listen button can flip to "Listen again" without affecting navigation.
  const [heard, setHeard] = useState<Set<HeardKey>>(new Set());

  // Stop narration when the word or feature changes.
  useEffect(() => cancel, [wordIdx, featureIdx, cancel]);

  const word = words[wordIdx];
  const wordImage = resolveStoryImage(storyData.id, word.image);
  const introText = word.sfa_teaching?.intro_text ?? "Let's learn what this word means.";
  const introNarration = word.sfa_teaching?.intro_narration ?? introText;

  const totalSteps = words.length * stepsPerWord;
  const currentStep = wordIdx * stepsPerWord + (featureIdx + 1);
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const isIntro = featureIdx === -1;
  const isVeryFirstScreen = wordIdx === 0 && isIntro;
  const isLastScreen = wordIdx === words.length - 1 && featureIdx === SFA_KEYS.length - 1;

  const heardKey = useMemo<HeardKey>(
    () => (isIntro ? `intro-${wordIdx}` : `feat-${wordIdx}-${featureIdx}`),
    [isIntro, wordIdx, featureIdx],
  );

  function playWithTrack(text: string, audioKey: string) {
    if (!isPlaying(audioKey)) {
      setHeard((prev) => {
        if (prev.has(heardKey)) return prev;
        const next = new Set(prev);
        next.add(heardKey);
        return next;
      });
    }
    toggle(text, audioKey);
  }

  const featureKey = isIntro ? null : SFA_KEYS[featureIdx];
  const teachingSlide = featureKey
    ? word.sfa_teaching?.slides?.find((slide: SFATeachingSlide) => slide.feature === featureKey)
    : undefined;
  const featureFullText = featureKey
    ? teachingSlide?.teaching_text || word.sfa[featureKey as keyof SFAFeatures]
    : "";
  const featureText = featureKey ? shortSentence(featureFullText) : "";
  const featureNarration = teachingSlide?.narration || featureFullText;

  const featureImage = featureKey
    ? (resolveFeatureImage(storyData.id, word.image, featureKey) ?? wordImage)
    : wordImage;

  function goNext() {
    if (featureIdx < SFA_KEYS.length - 1) {
      setFeatureIdx(featureIdx + 1);
      return;
    }
    // Last teaching screen for this word — the word sequence is complete.
    earnCoins({
      storyId: storyData.id,
      activity: "vocabulary",
      item: word.word,
      amount: COIN_ECONOMY.vocabulary.perWord,
      label: `You learned "${word.word}"!`,
    });
    if (wordIdx < words.length - 1) {
      setWordIdx(wordIdx + 1);
      setFeatureIdx(-1);
      return;
    }
    onComplete({
      phase: "vocab-intro",
      attempts: [],
      first_attempt_accuracy: 1,
      completed: true,
    });
  }

  function goBack() {
    if (featureIdx > -1) {
      setFeatureIdx(featureIdx - 1);
      return;
    }
    if (wordIdx > 0) {
      setWordIdx(wordIdx - 1);
      setFeatureIdx(SFA_KEYS.length - 1);
    }
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
          label={`Word ${wordIdx + 1}/${words.length} · Step ${featureIdx + 2}/${stepsPerWord}`}
          onClose={onClose}
        />
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center overflow-y-auto no-scrollbar px-5 pb-5 pt-4 sm:overflow-hidden">
        <div className="flex w-full max-w-[620px] flex-1 flex-col justify-center gap-4 sm:min-h-0">
          {isIntro ? (
            /* ── Screen 1: word introduction ── */
            <section className="flex flex-col items-center rounded-[40px] border border-accent/50 bg-card px-6 py-7 text-center shadow-soft animate-pop-in sm:px-10">
              <div className="relative">
                <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-[42px] bg-accent shadow-inner sm:h-48 sm:w-48">
                  {wordImage ? (
                    <img src={wordImage} alt={word.word} className="h-full w-full object-contain p-3" />
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
                      "shadow-[0_7px_0_color-mix(in_oklab,var(--secondary)_78%,black)] active:translate-y-[5px] active:shadow-[0_2px_0_color-mix(in_oklab,var(--secondary)_78%,black)]",
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

              <h1 className="mt-2 text-[42px] font-extrabold capitalize leading-none tracking-tight text-primary sm:text-[54px]">
                {word.word}
              </h1>

              <div className="mt-5 w-full max-w-[420px] rounded-[30px] border border-accent/60 bg-accent/20 p-4">
                <div className="flex items-center gap-3 text-left">
                  {supported && (
                    <ListenButton
                      playing={isPlaying("intro")}
                      onClick={() => playWithTrack(introNarration, "intro")}
                      ariaLabel="Hear what this word means"
                    />
                  )}
                  <p className="flex-1 text-[15.5px] font-semibold leading-relaxed text-ink">
                    {introText}
                  </p>
                </div>
              </div>
            </section>
          ) : (
            /* ── Screens 2-6: exactly ONE semantic feature ── */
            <section
              key={`${wordIdx}-${featureIdx}`}
              className="flex min-h-0 flex-1 flex-col rounded-[40px] border-4 border-card bg-card px-5 pb-5 pt-5 shadow-soft animate-pop-in sm:px-8"
            >
              {/* The word stays anchored top-left across all five feature screens */}
              <h2 className="shrink-0 text-left text-[26px] font-extrabold capitalize leading-none tracking-tight text-primary sm:text-[30px]">
                {word.word}
              </h2>

              {/* Feature icon + label: one unit, identical across all five screens */}
              <div className="mt-4 flex shrink-0 flex-col items-center gap-2.5">
                <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-[24px] bg-secondary p-[15px] text-primary shadow-[0_6px_14px_-6px_color-mix(in_oklab,var(--secondary)_70%,black)] sm:h-[84px] sm:w-[84px] sm:p-[17px]">
                  {(() => {
                    const Icon = SFA_ICONS[featureKey as SFAKey];
                    return <Icon className="h-full w-full" />;
                  })()}
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-center text-[19px] font-extrabold leading-tight tracking-tight text-primary sm:text-[22px]">
                    {SFA_LABELS[featureKey as SFAKey]}
                  </span>
                  {SFA_HELPERS[featureKey as SFAKey] && (
                    <span className="text-center text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary/55">
                      {SFA_HELPERS[featureKey as SFAKey]}
                    </span>
                  )}
                </div>
              </div>



              <div className="mt-4 flex min-h-0 w-full flex-1 items-center justify-center">
                <div className="flex h-full max-h-[260px] min-h-[130px] w-full max-w-[380px] items-center justify-center overflow-hidden rounded-[32px] border-2 border-primary/10 bg-primary/[0.04] p-4 shadow-inner">
                  {featureImage ? (
                    <img
                      src={featureImage}
                      alt={featureText}
                      className="h-full w-full rounded-2xl object-contain"
                    />
                  ) : (
                    <PaperPlaneIcon className="h-14 w-14 text-primary" />
                  )}
                </div>
              </div>

              {/* Purple sentence bar with speaker control */}
              <div className="mt-4 flex w-full shrink-0 items-center gap-4 rounded-[32px] bg-primary p-3 text-left shadow-soft">
                {supported && (
                  <ListenButton
                    playing={isPlaying(`feat-${featureIdx}`)}
                    onClick={() => playWithTrack(featureNarration, `feat-${featureIdx}`)}
                    ariaLabel="Hear this sentence"
                  />
                )}
                <p className="flex-1 pr-3 text-[17px] font-semibold leading-snug text-primary-foreground sm:text-[19px]">
                  {featureText}
                </p>
              </div>
            </section>


          )}

          {/* ── Navigation ── */}
          <div className="flex shrink-0 items-center gap-3">
            {!isVeryFirstScreen && (
              <button
                type="button"
                onClick={goBack}
                className="press-pop flex h-14 shrink-0 items-center gap-1 rounded-[22px] border-2 border-accent bg-card px-5 text-sm font-extrabold uppercase tracking-wide text-primary shadow-card"
              >
                <ChevronRightIcon className="h-5 w-5 rotate-180 text-primary" />
                Back
              </button>
            )}
            <div className="min-w-0 flex-1">
              <TactileButton onClick={goNext}>
                {isIntro ? "Explore the Word" : isLastScreen ? "Done" : "Next"}
                <ChevronRightIcon className="h-5 w-5 text-secondary" />
              </TactileButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
