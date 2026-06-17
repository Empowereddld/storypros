/* ─────────────────────────────────────────────
 * Story Slides Phase
 * Child reads through story slides one at a time.
 * Not scored — engagement tracked.
 * ───────────────────────────────────────────── */

import { useState, useEffect } from "react";
import { TactileButton } from "../TactileButton";
import { ProgressHeader } from "./ProgressHeader";
import type { StoryPhaseProps, PhaseResult, StorySlide } from "@/types/story";
import { cn } from "@/lib/utils";
import { highlightConnective } from "@/lib/highlightConnective";
import { speak, stop, isSpeaking, speedToRate, preloadVoices, isSupported } from "@/services/tts";

const ELEMENT_ICONS: Record<string, string> = {
  character: "👤",
  place: "📍",
  problem: "❗",
  emotion: "💛",
  action: "➡️",
  result: "💡",
};

const ELEMENT_LABELS: Record<string, string> = {
  character: "Character",
  place: "Place",
  problem: "Problem",
  emotion: "Emotion",
  action: "Action",
  result: "Result",
};

export function StorySlidesPhase({ storyData, onComplete, onClose, ttsSpeed = "normal" }: StoryPhaseProps) {
  const [page, setPage] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const slides = storyData.slides;

  // Preload TTS voices
  useEffect(() => {
    preloadVoices();
  }, []);

  // Stop speech when page changes or unmount
  useEffect(() => {
    return () => { stop(); setSpeaking(false); };
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
      // ignore TTS errors
    }
    setSpeaking(false);
  }
  const current = slides[page];
  const isLast = page === slides.length - 1;
  const progress = ((page + 1) / slides.length) * 100;

  function handleNext() {
    if (isLast) {
      onComplete({
        phase: "slides",
        attempts: [],
        first_attempt_accuracy: 1, // engagement only
        completed: true,
      });
    } else {
      setPage(page + 1);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <ProgressHeader
        progress={progress}
        label={`${page + 1} of ${slides.length}`}
        onClose={onClose}
      />

      {/* Illustration placeholder */}
      <div key={page} className="mx-5 mt-3 overflow-hidden rounded-3xl bg-card shadow-card animate-pop-in">
        <div className="aspect-[5/4] w-full bg-gradient-to-b from-sky/40 to-cream-deep/30 flex items-center justify-center">
          <div className="text-center">
            <span className="text-6xl">{ELEMENT_ICONS[current.story_element]}</span>
            <p className="mt-2 text-xs font-bold uppercase tracking-wider text-ink-soft/70">
              {ELEMENT_LABELS[current.story_element]}
            </p>
          </div>
        </div>
      </div>

      {/* Story element badge + connective badge */}
      <div className="mx-5 mt-3 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
          {ELEMENT_ICONS[current.story_element]}
        </span>
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          {ELEMENT_LABELS[current.story_element]}
        </span>
        {page === 0 && storyData.target_connective && (
          <span className="ml-auto flex items-center gap-1 rounded-full bg-secondary/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary-foreground">
            <span>🔗</span> Today's word: {storyData.target_connective}
          </span>
        )}
      </div>

      {/* Story text — connective words highlighted */}
      <div key={`t-${page}`} className="mx-5 mt-2 flex-1 animate-slide-up">
        <p className="font-display text-[22px] leading-[1.45] font-semibold text-primary">
          {highlightConnective(current.text, storyData.target_connective)}
        </p>
      </div>

      {/* Read-to-me button */}
      {isSupported() && (
        <div className="mx-5 mb-3 flex items-center justify-center gap-3">
          <button
            onClick={handleListen}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full btn-tactile transition-all",
              speaking
                ? "bg-destructive text-destructive-foreground animate-pulse-glow"
                : "bg-primary text-primary-foreground",
            )}
            aria-label="Listen"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d={speaking ? "M6 6h12v12H6z" : "M8 5v14l11-7z"} />
            </svg>
          </button>
        </div>
      )}

      <div className="mx-5 mb-4">
        <button
          onClick={handleNext}
          className="w-full h-14 rounded-3xl bg-primary text-primary-foreground font-bold btn-tactile"
        >
          {page === slides.length - 1 ? "Done" : "Next"}
        </button>
      </div>
    </div>
  );
}
