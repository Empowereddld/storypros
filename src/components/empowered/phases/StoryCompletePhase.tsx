/* ─────────────────────────────────────────────
 * Story Complete Phase — Celebration!
 * Rebuilt from the "You did it!" mockup: big check
 * badge, characters, star rating + Paper Planes
 * earned, with an optional skill breakdown.
 * ───────────────────────────────────────────── */

import { useState, useEffect } from "react";
import { TactileButton } from "../TactileButton";
import type { StoryPhaseProps, PhaseResult } from "@/types/story";
import {
  calculateDomainScores,
  calculateOverallScore,
  scoreToLabel,
  labelToDisplayText,
  type SkillDomain,
} from "@/services/scoring";
import { cn } from "@/lib/utils";
import dariaAndFriend from "@/assets/dan-daria-celebrate.webp";

interface StoryCompleteData {
  phaseResults: PhaseResult[];
  paperPlanesEarned: number;
  totalPaperPlanes: number;
}

const DOMAIN_ICONS: Record<SkillDomain, string> = {
  listening: "👂",
  story_structure: "📖",
  vocabulary: "📝",
  grammar: "✏️",
  retell: "🗣️",
  phonological: "🔊",
};

const DOMAIN_LABELS: Record<SkillDomain, string> = {
  listening: "Listening",
  story_structure: "Story Structure",
  vocabulary: "Vocabulary",
  grammar: "Grammar",
  retell: "Retelling",
  phonological: "Sounds",
};

const V1_DOMAINS: SkillDomain[] = ["listening", "story_structure", "vocabulary", "grammar"];

export function StoryCompletePhase({ storyData, phaseData, onComplete }: StoryPhaseProps<StoryCompleteData>) {
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
    <div className="relative flex h-full flex-col bg-background">
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4">
        {/* Celebration */}
        <div className="relative pt-8 text-center">
          <img
            src={dariaAndFriend}
            alt=""
            className={cn("mx-auto h-40 w-auto object-contain", !celebrationDone && "animate-pop-in")}
          />
          {/* big check badge */}
          <div className="relative -mt-6 flex justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-card bg-secondary text-secondary-foreground shadow-soft animate-pop-in">
              <svg viewBox="0 0 24 24" className="h-8 w-8" stroke="currentColor" strokeWidth="3" fill="none">
                <path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>

          <h1 className="mt-3 font-display text-[34px] font-extrabold text-primary animate-slide-up">
            You did it!
          </h1>
          <p className="mx-auto mt-1 max-w-[18rem] text-base font-semibold text-ink-soft">
            Amazing work! You finished "{storyData.title}" and leveled up your skills.
          </p>

          {/* Star rating */}
          <div className="mt-4 flex justify-center gap-2">
            {[1, 2, 3].map((n) => (
              <svg
                key={n}
                viewBox="0 0 24 24"
                className={cn("h-9 w-9", n <= stars ? "text-secondary" : "text-accent")}
                fill="currentColor"
                aria-hidden
              >
                <path d="M12 2l2.4 5.6L20 9l-4.6 3.8L17 19l-5-3-5 3 1.6-6.2L4 9l5.6-1.4L12 2z" />
              </svg>
            ))}
          </div>
        </div>

        {/* Paper Planes earned */}
        <div className="mt-5 flex items-center justify-between rounded-3xl border-2 border-secondary bg-secondary/10 p-4 shadow-card animate-pop-in">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">Paper Planes earned</p>
            <p className="font-display text-[32px] font-extrabold leading-none text-primary">
              +{paperPlanesEarned}
            </p>
          </div>
          <div className="text-right">
            <span className="text-4xl">✈️</span>
            <p className="mt-1 text-xs font-bold text-ink-soft">{totalPaperPlanes} total</p>
          </div>
        </div>

        {/* Skill breakdown toggle */}
        {!showScores ? (
          <button
            onClick={() => setShowScores(true)}
            className="mt-4 w-full rounded-2xl border-2 border-transparent bg-card p-4 text-center shadow-card transition-all hover:border-primary/20"
          >
            <span className="text-sm font-bold text-primary">See how you did in each area →</span>
          </button>
        ) : (
          <div className="mt-4 space-y-3 animate-slide-up">
            <h3 className="text-sm font-bold uppercase tracking-wider text-ink-soft">Your skills</h3>
            {V1_DOMAINS.map((domain) => {
              const score = domainScores[domain];
              const label = scoreToLabel(score);
              const displayText = labelToDisplayText(label);
              const barColor =
                label === "strength" ? "bg-success"
                : label === "growing" ? "bg-primary"
                : label === "budding" ? "bg-secondary"
                : "bg-coral";

              return (
                <div key={domain} className="rounded-2xl bg-card p-4 shadow-card">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-lg">{DOMAIN_ICONS[domain]}</span>
                    <span className="flex-1 text-sm font-bold text-primary">{DOMAIN_LABELS[domain]}</span>
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-bold",
                      label === "strength" && "bg-success/10 text-success",
                      label === "growing" && "bg-primary/10 text-primary",
                      label === "budding" && "bg-secondary/10 text-secondary-foreground",
                      label === "needs_support" && "bg-coral/10 text-coral",
                    )}>
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
      <div className="mx-5 mb-5 mt-2">
        <TactileButton variant="secondary" onClick={handleFinish}>
          Continue
        </TactileButton>
      </div>
    </div>
  );
}
