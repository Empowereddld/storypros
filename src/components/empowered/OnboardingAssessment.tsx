/* ─────────────────────────────────────────────
 * Onboarding Assessment
 * After signup, the child plays through a full
 * Level 1 story. Performance determines placement:
 *   90%+ first-attempt across all domains → Level 2
 *   Otherwise → Level 1
 *
 * Shows placement result to parent with
 * explanation and manual override option.
 * ───────────────────────────────────────────── */

import { useState } from "react";
import { StoryEngine } from "./phases";
import { getStory } from "@/services/stories";
import { getProgress } from "@/services/progress";
import {
  calculateDomainScores,
  calculateOverallScore,
  qualifiesForLevel2,
  scoreToLabel,
  labelToDisplayText,
  type SkillDomain,
} from "@/services/scoring";
import { setCurrentLevel } from "@/services/progress";
import { TactileButton } from "./TactileButton";
import { cn } from "@/lib/utils";
import type { StoryData } from "@/types/story";

interface OnboardingAssessmentProps {
  childName: string;
  onComplete: () => void;
}

type Phase = "intro" | "playing" | "result";

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

export function OnboardingAssessment({ childName, onComplete }: OnboardingAssessmentProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [placedLevel, setPlacedLevel] = useState(1);
  const [domainScores, setDomainScores] = useState<Record<SkillDomain, number> | null>(null);
  const [overallScore, setOverallScore] = useState(0);

  const story = getStory("dan-and-the-paper-cut");

  function handleStoryFinish() {
    // After story completion, check the progress service for results
    const progress = getProgress();
    const lastCompletion = progress.completions[progress.completions.length - 1];

    if (lastCompletion) {
      const scores = lastCompletion.domainScores;
      const overall = lastCompletion.overallScore;
      const level2 = qualifiesForLevel2(scores);

      setDomainScores(scores);
      setOverallScore(overall);

      const recommended = level2 ? 2 : 1;
      setPlacedLevel(recommended);
      setCurrentLevel(recommended);
    }

    setPhase("result");
  }

  function handleOverride(level: number) {
    setPlacedLevel(level);
    setCurrentLevel(level);
  }

  if (!story) {
    // Fallback if story not loaded
    return (
      <div className="flex h-full flex-col items-center justify-center px-5">
        <p className="text-lg font-semibold text-primary">Loading assessment...</p>
      </div>
    );
  }

  if (phase === "intro") {
    return (
      <div className="flex h-full flex-col items-center justify-center px-5 bg-cream">
        <div className="text-center animate-pop-in">
          <span className="text-6xl mb-4 block">🎯</span>
          <h2 className="font-display text-[28px] font-extrabold text-primary mb-3">
            Let's see where {childName || "you"} should start!
          </h2>
          <p className="text-base font-semibold text-ink-soft mb-2">
            {childName || "Your child"} will play through one story. We'll use how they do to pick the right level.
          </p>
          <p className="text-sm text-ink-soft/70 mt-2">
            This takes about 10–15 minutes. Stay nearby to help if needed!
          </p>
        </div>
        <div className="w-full mt-8 px-2">
          <TactileButton onClick={() => setPhase("playing")}>
            Start assessment
          </TactileButton>
        </div>
      </div>
    );
  }

  if (phase === "playing") {
    return (
      <StoryEngine
        storyData={story}
        onFinish={handleStoryFinish}
      />
    );
  }

  // Result phase
  return (
    <div className="flex h-full flex-col bg-cream">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary/10 to-transparent px-5 pt-6 pb-4 text-center">
        <span className="text-5xl block animate-pop-in">
          {placedLevel >= 2 ? "🌟" : "🎉"}
        </span>
        <h1 className="mt-2 font-display text-[28px] font-extrabold text-primary animate-slide-up">
          {placedLevel >= 2 ? "Wow, great start!" : "Great job!"}
        </h1>
        <p className="mt-1 text-base font-semibold text-ink-soft">
          {childName || "Your child"} has been placed in <span className="text-primary font-bold">Level {placedLevel}</span>
        </p>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4">
        {/* Explanation */}
        <div className="mt-4 rounded-3xl bg-card p-5 shadow-card">
          <p className="text-sm font-semibold text-ink-soft leading-relaxed">
            {placedLevel >= 2
              ? `${childName || "Your child"} answered most questions correctly on the first try! Level 2 stories have slightly more complex language and longer sentences.`
              : `Level 1 is perfect for building a strong foundation. ${childName || "Your child"} will practice with shorter stories and simpler sentences, building confidence with each one.`}
          </p>
        </div>

        {/* Domain scores */}
        {domainScores && (
          <div className="mt-4 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft px-1">
              Assessment Results
            </h3>
            {V1_DOMAINS.map((domain) => {
              const score = domainScores[domain];
              const label = scoreToLabel(score);
              const barColor =
                label === "strength" ? "bg-success"
                : label === "growing" ? "bg-primary"
                : label === "budding" ? "bg-secondary"
                : "bg-coral";

              return (
                <div key={domain} className="rounded-2xl bg-card p-3 shadow-card flex items-center gap-3">
                  <span className="text-lg">{DOMAIN_ICONS[domain]}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-primary">{DOMAIN_LABELS[domain]}</span>
                      <span className="text-xs font-bold text-ink-soft">{Math.round(score)}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-cream-deep overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-700", barColor)}
                        style={{ width: `${Math.max(5, score)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Parent override */}
        <div className="mt-5 rounded-3xl bg-sky/50 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
            Parent override
          </p>
          <p className="text-sm text-ink-soft mb-3">
            You know your child best. You can change the level anytime.
          </p>
          <div className="flex gap-2">
            {[1, 2].map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleOverride(lvl)}
                className={cn(
                  "flex-1 rounded-2xl border-2 p-3 text-center font-bold transition-all",
                  placedLevel === lvl
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-transparent bg-card text-ink-soft hover:border-primary/30",
                )}
              >
                Level {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Continue button */}
      <div className="px-5 pb-5">
        <TactileButton onClick={onComplete}>
          Start adventuring!
        </TactileButton>
      </div>
    </div>
  );
}
