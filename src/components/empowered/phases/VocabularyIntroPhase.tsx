/* ─────────────────────────────────────────────
 * Vocabulary Intro Phase — SFA Exploration
 * Child explores each vocab word's semantic features.
 * NOT scored — engagement only.
 * ───────────────────────────────────────────── */

import { useState, useEffect } from "react";
import { TactileButton } from "../TactileButton";
import { ProgressHeader } from "./ProgressHeader";
import type { StoryPhaseProps, VocabularyWord } from "@/types/story";
import { cn } from "@/lib/utils";
import { speak, stop, speedToRate, preloadVoices, isSupported } from "@/services/tts";

const SFA_KEYS = ["category", "function", "appearance", "parts", "location"] as const;

const SFA_ICONS: Record<string, string> = {
  category: "📦",
  function: "🔧",
  appearance: "👁️",
  parts: "🧩",
  location: "📍",
};

const SFA_LABELS: Record<string, string> = {
  category: "Group",
  function: "What it does",
  appearance: "What it looks like",
  parts: "What parts it has",
  location: "Where you find it",
};

export function VocabularyIntroPhase({ storyData, onComplete, onClose, ttsSpeed = "normal" }: StoryPhaseProps) {
  const words = storyData.vocabulary_words;
  const [wordIdx, setWordIdx] = useState(0);
  const [featureIdx, setFeatureIdx] = useState(-1); // -1 = word title card
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => { preloadVoices(); }, []);
  useEffect(() => { return () => { stop(); setSpeaking(false); }; }, [wordIdx]);

  async function handlePronounce() {
    if (speaking) { stop(); setSpeaking(false); return; }
    setSpeaking(true);
    // Vocab pronunciation is always slow or slower (never fast)
    const vocabSpeed = ttsSpeed === "fast" ? "normal" : ttsSpeed;
    try { await speak(word.word, { rate: speedToRate(vocabSpeed) }); } catch {}
    setSpeaking(false);
  }

  const word = words[wordIdx];
  const totalSteps = words.length * (SFA_KEYS.length + 1); // +1 for title card each word
  const currentStep = wordIdx * (SFA_KEYS.length + 1) + (featureIdx + 1);
  const progress = (currentStep / totalSteps) * 100;

  function handleRevealFeature(idx: number) {
    setRevealed((prev) => new Set(prev).add(idx));
  }

  function handleNext() {
    if (featureIdx < SFA_KEYS.length - 1) {
      // Move to next feature
      setFeatureIdx(featureIdx + 1);
      setRevealed(new Set());
    } else if (wordIdx < words.length - 1) {
      // Next word
      setWordIdx(wordIdx + 1);
      setFeatureIdx(-1);
      setRevealed(new Set());
    } else {
      // Done
      onComplete({
        phase: "vocab-intro",
        attempts: [],
        first_attempt_accuracy: 1, // engagement only
        completed: true,
      });
    }
  }

  function handleStartExploring() {
    setFeatureIdx(0);
  }

  const isOnTitleCard = featureIdx === -1;
  const allRevealed = !isOnTitleCard && revealed.size >= 1; // at least tapped the card

  return (
    <div className="flex h-full flex-col">
      <ProgressHeader
        progress={progress}
        label={`Word ${wordIdx + 1} of ${words.length}`}
        onClose={onClose}
      />

      {isOnTitleCard ? (
        /* ── Word title card ── */
        <div key={`title-${wordIdx}`} className="flex flex-1 flex-col items-center justify-center px-5 animate-pop-in">
          <div className="mb-6 flex h-40 w-40 items-center justify-center rounded-[32px] bg-gradient-to-b from-sky/60 to-cream-deep/40 shadow-card">
            <span className="text-7xl">
              {word.type === "emotion" ? "💛" : "🔍"}
            </span>
          </div>
          <h2 className="font-display text-[32px] font-extrabold text-primary capitalize">
            {word.word}
          </h2>
          {isSupported() && (
            <button
              onClick={handlePronounce}
              className={cn(
                "mt-3 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold btn-tactile transition-all",
                speaking
                  ? "bg-destructive text-destructive-foreground animate-pulse-glow"
                  : "bg-primary/15 text-primary",
              )}
            >
              {speaking ? "Stop" : "Hear it"}
              {speaking ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              )}
            </button>
          )}
          <p className="mt-2 text-base font-semibold text-ink-soft">
            {word.type === "emotion" ? "An emotion word" : "A thing word"}
          </p>
          <p className="mt-4 text-center text-sm text-ink-soft/70">
            Let's learn about this word!
          </p>
        </div>
      ) : (
        /* ── SFA feature exploration ── */
        <div key={`sfa-${wordIdx}-${featureIdx}`} className="flex flex-1 flex-col px-5 mt-4 animate-slide-up">
          {/* Word badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
              {word.type === "emotion" ? "💛" : "🔍"}
            </span>
            <span className="text-sm font-bold uppercase tracking-wider text-primary capitalize">
              {word.word}
            </span>
          </div>

          {/* Feature cards */}
          <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar pb-2">
            {SFA_KEYS.map((key, idx) => {
              const isActive = idx === featureIdx;
              const isPast = idx < featureIdx;
              const isFuture = idx > featureIdx;
              const isRevealed = revealed.has(idx) || isPast;

              return (
                <button
                  key={key}
                  onClick={() => isActive && handleRevealFeature(idx)}
                  disabled={!isActive}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-3xl border-2 bg-card p-4 text-left shadow-card transition-all",
                    isActive && !isRevealed && "border-primary bg-primary/5 animate-pulse-glow cursor-pointer",
                    isActive && isRevealed && "border-primary bg-primary/5",
                    isPast && "border-success/30 bg-success/5",
                    isFuture && "border-transparent opacity-40",
                  )}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky text-xl">
                    {SFA_ICONS[key]}
                  </span>
                  <div className="flex-1">
                    <span className="text-sm font-bold uppercase tracking-wider text-ink-soft">
                      {SFA_LABELS[key]}
                    </span>
                    {(isRevealed || isPast) ? (
                      <p className="mt-1 text-base font-semibold leading-snug text-primary animate-slide-up">
                        {word.sfa[key]}
                      </p>
                    ) : isActive ? (
                      <p className="mt-1 text-sm font-semibold text-primary/60">
                        Tap to reveal!
                      </p>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mx-5 mb-5">
        {isOnTitleCard ? (
          <TactileButton onClick={handleStartExploring}>
            Let's explore!
          </TactileButton>
        ) : (
          <TactileButton onClick={handleNext} disabled={!allRevealed}>
            {wordIdx === words.length - 1 && featureIdx === SFA_KEYS.length - 1
              ? "Start quiz"
              : featureIdx === SFA_KEYS.length - 1
                ? "Next word"
                : "Next feature"}
          </TactileButton>
        )}
      </div>
    </div>
  );
}
