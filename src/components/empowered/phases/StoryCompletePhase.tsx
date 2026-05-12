/* ─────────────────────────────────────────────
 * Story Complete Phase — Celebration!
 * Shows Paper Planes earned, domain scores,
 * and a big celebration animation.
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

export function StoryCompletePhase({ storyData, phaseData, onComplete, onClose }: StoryPhaseProps<StoryCompleteData>) {
  const [showScores, setShowScores] = useState(false);
  const [celebrationDone, setCelebrationDone] = useState(false);

  const data = phaseData as StoryCompleteData | undefined;
  const phaseResults = data?.phaseResults ?? [];
  const paperPlanesEarned = data?.paperPlanesEarned ?? 0;
  const totalPaperPlanes = data?.totalPaperPlanes ?? 0;

  const domainScores = calculateDomainScores(phaseResults);
  const overallScore = calculateOverallScore(domainScores);

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
    <div className="flex h-full flex-col">
      {/* Celebration header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-transparent px-5 pt-6 pb-4">
        <div className="absolute inset-0 animate-confetti-burst pointer-events-none" />
        <div className="relative text-center">
          <span className="text-6xl block animate-pop-in">🎉</span>
          <h1 className="mt-2 font-display text-[32px] font-extrabold text-primary animate-slide-up">
            Amazing job!
          </h1>
          <p className="mt-1 text-base font-semibold text-ink-soft">
            You finished "{storyData.title}"!
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4">
        {/* Paper Planes earned */}
        <div className="mt-4 rounded-3xl bg-secondary/10 border-2 border-secondary p-5 shadow-card animate-pop-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-ink-soft">Paper Planes Earned</p>
              <p className="font-display text-[40px] font-extrabold text-primary">
                +{paperPlanesEarned}
              </p>
            </div>
            <span className="text-5xl">✈️</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-2 flex-1 rounded-full bg-cream-deep overflow-hidden">
              <div className="h-full rounded-full bg-secondary transition-all duration-1000" style={{ width: "100%" }} />
            </div>
            <span className="text-sm font-bold text-ink-soft">{totalPaperPlanes} total</span>
          </div>
        </div>

        {/* Toggle scores */}
        {!showScores ? (
          <button
            onClick={() => setShowScores(true)}
            className="mt-4 w-full rounded-2xl bg-card p-4 shadow-card border-2 border-transparent hover:border-primary/20 transition-all text-center"
          >
            <span className="text-sm font-bold text-primary">
              See how you did in each area →
            </span>
          </button>
        ) : (
          <div className="mt-4 space-y-3 animate-slide-up">
            <h3 className="text-sm font-bold uppercase tracking-wider text-ink-soft">
              Your skills
            </h3>
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
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{DOMAIN_ICONS[domain]}</span>
                    <span className="flex-1 text-sm font-bold text-primary">
                      {DOMAIN_LABELS[domain]}
                    </span>
                    <span className={cn(
                      "text-xs font-bold px-2 py-0.5 rounded-full",
                      label === "strength" && "bg-success/10 text-success",
                      label === "growing" && "bg-primary/10 text-primary",
                      label === "budding" && "bg-secondary/10 text-secondary-foreground",
                      label === "needs_support" && "bg-coral/10 text-coral",
                    )}>
                      {displayText}
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-cream-deep overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-700", barColor)}
                      style={{ width: `${Math.max(5, score)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Finish button */}
      <div className="mx-5 mb-5">
        <TactileButton onClick={handleFinish}>
          Back to adventures!
        </TactileButton>
      </div>
    </div>
  );
}
