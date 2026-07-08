/* ---------------------------------------------
 * Story Complete Phase - Celebration!
 * Rebuilt from the "You did it!" mockup: big check
 * badge, characters, star rating + Coins
 * earned, with an optional skill breakdown.
 * --------------------------------------------- */

import { useState, useEffect } from "react";
import { TactileButton } from "../TactileButton";
import type { StoryPhaseProps, PhaseResult } from "@/types/story";
import {
  calculateDomainScores,
  calculateOverallScore,
  scoreToLabel,
  type SkillDomain,
} from "@/services/scoring";
import { cn } from "@/lib/utils";
import dariaAndFriend from "@/assets/dan-daria-celebrate.webp";
import { AuthBackdrop, MiniPlane, Star } from "../StoryProsBrand";
import { ChevronRightIcon, CoinIcon } from "../StoryProsUi";

interface StoryCompleteData {
  phaseResults: PhaseResult[];
  paperPlanesEarned: number;
  totalPaperPlanes: number;
}

const DOMAIN_LABELS: Record<SkillDomain, string> = {
  listening: "Listening",
  story_structure: "Story Structure",
  vocabulary: "Vocabulary",
  grammar: "Grammar",
  retell: "Retelling",
  phonological: "Sounds",
};

const V1_DOMAINS: SkillDomain[] = ["listening", "story_structure", "vocabulary", "grammar"];

/** Child-facing encouragement — never a grade, always something to feel good about. */
function childEncouragement(label: ReturnType<typeof scoreToLabel>): string {
  switch (label) {
    case "strength":
      return "Shining bright!";
    case "growing":
      return "Growing fast!";
    case "budding":
      return "Getting there!";
    case "needs_support":
      return "Keep practicing!";
  }
}

const OVERALL_ENCOURAGEMENT: Record<ReturnType<typeof scoreToLabel>, string> = {
  strength: "You're a Story Pro!",
  growing: "Great effort today!",
  budding: "Nice work today!",
  needs_support: "You tried your best — try again anytime!",
};

export function StoryCompletePhase({
  storyData,
  phaseData,
  onComplete,
}: StoryPhaseProps<StoryCompleteData>) {
  const [showScores, setShowScores] = useState(false);
  const [celebrationDone, setCelebrationDone] = useState(false);

  const data = phaseData as StoryCompleteData | undefined;
  const phaseResults = data?.phaseResults ?? [];
  const paperPlanesEarned = data?.paperPlanesEarned ?? 0;
  const totalPaperPlanes = data?.totalPaperPlanes ?? 0;

  const domainScores = calculateDomainScores(phaseResults);
  const overallScore = calculateOverallScore(domainScores);
  const stars = overallScore >= 90 ? 3 : overallScore >= 70 ? 2 : 1;

  useEffect(() => {
    const timer = setTimeout(() => setCelebrationDone(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  function handleFinish() {
    onComplete({
      phase: "story-complete",
      attempts: [],
      first_attempt_accuracy: 1,
      completed: true,
    });
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <AuthBackdrop />
      <Star className="pointer-events-none absolute left-8 top-12 z-0 h-5 w-5 text-secondary animate-sparkle" />
      <Star className="pointer-events-none absolute right-10 top-40 z-0 h-4 w-4 text-primary/35 animate-sparkle" />
      <MiniPlane className="pointer-events-none absolute right-8 top-20 z-0 h-7 w-7 rotate-[18deg] text-secondary/55 animate-float" />

      <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar px-5 pb-4">
        {/* Celebration */}
        <div className="relative pt-7 text-center">
          <div className="relative mx-auto h-48 max-w-[320px]">
            <div className="absolute inset-x-6 bottom-2 h-20 rounded-full bg-secondary/12 blur-xl" />
            <img
              src={dariaAndFriend}
              alt=""
              className={cn(
                "relative z-10 mx-auto h-44 w-auto object-contain",
                !celebrationDone && "animate-bounce-in",
              )}
            />
          </div>
          {/* big check badge */}
          <div className="relative -mt-10 flex justify-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full border-[6px] border-card bg-secondary text-secondary-foreground shadow-soft animate-star-pop">
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
              >
                <path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>

          <h1 className="mt-3 font-display text-[38px] font-extrabold leading-none text-primary animate-slide-up">
            You did it!
          </h1>
          <p className="mx-auto mt-2 max-w-[19rem] text-base font-semibold leading-snug text-ink-soft">
            Amazing work! You finished "{storyData.title}" and leveled up your skills.
          </p>

          {/* Star rating */}
          <div className="mt-4 flex justify-center gap-2" aria-label={`${stars} star performance rating`}>
            {[1, 2, 3].map((n) => (
              <svg
                key={n}
                viewBox="0 0 24 24"
                style={n <= stars ? { animationDelay: `${0.2 + 0.15 * n}s` } : undefined}
                className={cn(
                  "h-9 w-9",
                  n <= stars ? "text-secondary animate-star-pop" : "text-accent",
                )}
                fill="currentColor"
                aria-hidden
              >
                <path d="M12 2l2.4 5.6L20 9l-4.6 3.8L17 19l-5-3-5 3 1.6-6.2L4 9l5.6-1.4L12 2z" />
              </svg>
            ))}
          </div>
        </div>

        {/* Coins earned */}
        <div className="mt-5 overflow-hidden rounded-[30px] border-2 border-secondary/80 bg-card shadow-card animate-pop-in">
          <div className="flex items-center justify-between gap-4 bg-secondary/12 p-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-secondary-deep">
                Coins earned
              </p>
              <p className="font-display text-[38px] font-extrabold leading-none text-primary">
                +{paperPlanesEarned}
              </p>
            </div>
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] bg-secondary text-secondary-foreground shadow-[0_5px_0_var(--secondary-deep)]">
              <CoinIcon className="h-9 w-9" />
            </span>
          </div>
          <div className="flex items-center justify-between px-4 py-3 text-sm font-bold text-ink-soft">
            <span>Total Coins</span>
            <span className="font-extrabold text-primary">{totalPaperPlanes}</span>
          </div>
        </div>

        {/* Skill breakdown toggle */}
        {!showScores ? (
          <button
            onClick={() => setShowScores(true)}
            className="mt-4 flex w-full items-center justify-between rounded-[24px] border-2 border-accent/70 bg-card p-4 text-left shadow-card transition-all hover:border-primary/30"
          >
            <span>
              <span className="block text-sm font-extrabold text-primary">See skill details</span>
              <span className="block text-xs font-semibold text-ink-soft">Listening, story structure, words, and grammar</span>
            </span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <ChevronRightIcon className="h-5 w-5" />
            </span>
          </button>
        ) : (
          <div className="mt-4 space-y-3 animate-slide-up">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-primary">
                Your skills
              </h3>
              <span className="rounded-full bg-card px-3 py-1 text-xs font-extrabold text-primary shadow-card">
                {OVERALL_ENCOURAGEMENT[scoreToLabel(overallScore)]}
              </span>
            </div>
            {V1_DOMAINS.map((domain) => {
              const score = domainScores[domain];
              const label = scoreToLabel(score);
              const displayText = childEncouragement(label);
              const barColor =
                label === "strength"
                  ? "bg-success"
                  : label === "growing"
                    ? "bg-primary"
                    : label === "budding"
                      ? "bg-secondary"
                      : "bg-coral";

              return (
                <div key={domain} className="rounded-[24px] border-2 border-accent/60 bg-card p-4 shadow-card">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky text-primary">
                      <SkillIcon domain={domain} />
                    </span>
                    <span className="flex-1 text-sm font-bold text-primary">
                      {DOMAIN_LABELS[domain]}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-bold",
                        label === "strength" && "bg-success/10 text-success",
                        label === "growing" && "bg-primary/10 text-primary",
                        label === "budding" && "bg-secondary/10 text-secondary-foreground",
                        label === "needs_support" && "bg-coral/10 text-coral",
                      )}
                    >
                      {displayText}
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-cream-deep">
                    <div
                      className={cn("h-full rounded-full transition-all duration-700", barColor)}
                      style={{ width: Math.max(5, score) + "%" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="mt-4 text-center text-xs font-semibold text-ink-soft">
          Keep going! Every story makes you a better storyteller.
        </p>
      </div>

      {/* Continue */}
      <div className="relative z-10 mx-5 mb-5 mt-2">
        <TactileButton variant="secondary" onClick={handleFinish} leadingIcon={<ChevronRightIcon className="h-5 w-5" />}>
          Continue
        </TactileButton>
      </div>
    </div>
  );
}

function SkillIcon({ domain }: { domain: SkillDomain }) {
  const common = {
    className: "h-5 w-5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (domain) {
    case "listening":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M6 10a6 6 0 0 1 12 0" />
          <path d="M6 10v3a3 3 0 0 0 3 3h1" />
          <path d="M18 10v3a3 3 0 0 1-3 3h-1" />
        </svg>
      );
    case "story_structure":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H19v18H8.5A3.5 3.5 0 0 0 5 23V5.5Z" />
          <path d="M9 6h6" />
          <path d="M9 10h5" />
        </svg>
      );
    case "vocabulary":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M4 17 9 5l5 12" />
          <path d="M6 13h6" />
          <path d="M16 9v8" />
          <path d="M16 13h4" />
        </svg>
      );
    case "grammar":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M4 19h16" />
          <path d="m6 16 9.5-9.5 2 2L8 18l-3 .8.8-2.8Z" />
        </svg>
      );
    case "retell":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M7 8h7" />
          <path d="M7 12h10" />
          <path d="M7 16h5" />
          <path d="M5 4h14v14H9l-4 3V4Z" />
        </svg>
      );
    case "phonological":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M4 10v4h3l5 4V6L7 10H4Z" />
          <path d="M16 9a4 4 0 0 1 0 6" />
          <path d="M19 6a8 8 0 0 1 0 12" />
        </svg>
      );
  }
}
