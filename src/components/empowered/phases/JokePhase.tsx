/* ─────────────────────────────────────────────
 * Joke Phase — Multiple Meaning Word
 * Shows two meanings of a word, then the joke.
 * Engagement only — not scored.
 * ───────────────────────────────────────────── */

import { useState } from "react";
import { TactileButton } from "../TactileButton";
import { ProgressHeader } from "./ProgressHeader";
import type { StoryPhaseProps } from "@/types/story";
import { cn } from "@/lib/utils";

type Step = "intro" | "meaning1" | "meaning2" | "joke";

export function JokePhase({ storyData, onComplete, onClose }: StoryPhaseProps) {
  const [step, setStep] = useState<Step>("intro");
  const joke = storyData.joke;

  const progressMap: Record<Step, number> = {
    intro: 0,
    meaning1: 25,
    meaning2: 50,
    joke: 75,
  };

  function handleNext() {
    switch (step) {
      case "intro":
        setStep("meaning1");
        break;
      case "meaning1":
        setStep("meaning2");
        break;
      case "meaning2":
        setStep("joke");
        break;
      case "joke":
        onComplete({
          phase: "joke",
          attempts: [],
          first_attempt_accuracy: 1,
          completed: true,
        });
        break;
    }
  }

  return (
    <div className="flex h-full flex-col">
      <ProgressHeader
        progress={progressMap[step]}
        label="Word Play"
        onClose={onClose}
      />

      <div className="flex flex-1 flex-col items-center justify-center px-5">
        {step === "intro" && (
          <div className="text-center animate-pop-in">
            <span className="text-6xl mb-4 block">🤔</span>
            <h2 className="font-display text-[28px] font-extrabold text-primary mb-3">
              Did you know?
            </h2>
            <p className="text-lg font-semibold text-ink-soft mb-2">
              Some words mean TWO different things!
            </p>
            <div className="mt-4 rounded-3xl bg-card p-5 shadow-card">
              <p className="font-display text-[32px] font-extrabold text-primary capitalize">
                {joke.word}
              </p>
              <p className="mt-1 text-sm font-semibold text-ink-soft">
                This word has two meanings!
              </p>
            </div>
          </div>
        )}

        {step === "meaning1" && (
          <div key="m1" className="w-full animate-slide-up">
            <div className="rounded-3xl bg-card p-5 shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">1</span>
                <span className="text-sm font-bold uppercase tracking-wider text-primary">
                  Meaning One
                </span>
              </div>
              <div className="aspect-[3/2] w-full rounded-2xl bg-gradient-to-b from-sky/40 to-cream-deep/30 flex items-center justify-center mb-3">
                <span className="text-5xl">🌡️</span>
              </div>
              <p className="font-display text-[20px] font-semibold text-primary leading-snug">
                <span className="font-extrabold capitalize">{joke.word}</span> — {joke.meaning_1.text}
              </p>
            </div>
          </div>
        )}

        {step === "meaning2" && (
          <div key="m2" className="w-full animate-slide-up">
            <div className="rounded-3xl bg-card p-5 shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-sm font-bold">2</span>
                <span className="text-sm font-bold uppercase tracking-wider text-primary">
                  Meaning Two
                </span>
              </div>
              <div className="aspect-[3/2] w-full rounded-2xl bg-gradient-to-b from-sky/40 to-cream-deep/30 flex items-center justify-center mb-3">
                <span className="text-5xl">😎</span>
              </div>
              <p className="font-display text-[20px] font-semibold text-primary leading-snug">
                <span className="font-extrabold capitalize">{joke.word}</span> — {joke.meaning_2.text}
              </p>
            </div>
          </div>
        )}

        {step === "joke" && (
          <div key="joke" className="w-full text-center animate-pop-in">
            <span className="text-7xl mb-4 block">😂</span>
            <div className="rounded-3xl bg-secondary/10 border-2 border-secondary p-6 shadow-card">
              <p className="font-display text-[22px] font-extrabold text-primary leading-snug">
                {joke.joke_text}
              </p>
            </div>
            <p className="mt-4 text-sm font-semibold text-ink-soft">
              Get it? Both meanings of "{joke.word}"!
            </p>
          </div>
        )}
      </div>

      <div className="mx-5 mb-5">
        <TactileButton onClick={handleNext}>
          {step === "joke" ? "Keep going!" : "Next"}
        </TactileButton>
      </div>
    </div>
  );
}
