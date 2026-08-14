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
  previousPaperPlanes?: number;
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

/** Which story phases feed each domain score. */
const DOMAIN_PHASE: Record<(typeof V1_DOMAINS)[number], string[]> = {
  listening: ["comprehension"],
  story_structure: ["sequencing"],
  vocabulary: ["vocab-quiz"],
  grammar: ["sentence-builder"],
  retell: [],
  phonological: ["phonological"],
} as Record<SkillDomain, string[]>;

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
  const [celebrationDone, setCelebrationDone] = useState(false);

  const data = phaseData as StoryCompleteData | undefined;
  const phaseResults = data?.phaseResults ?? [];
  const paperPlanesEarned = data?.paperPlanesEarned ?? 0;
  const totalPaperPlanes = data?.totalPaperPlanes ?? 0;
  const previousPaperPlanes =
    data?.previousPaperPlanes ?? Math.max(0, totalPaperPlanes - paperPlanesEarned);

  const domainScores = calculateDomainScores(phaseResults);
  const overallScore = calculateOverallScore(domainScores);

  /* Only the activities the child actually played should shape the rating.
   * With no scored activities (e.g. a skipped run) we celebrate rather than
   * show a lonely one-star result. */
  const scoredDomains = V1_DOMAINS.filter((domain) =>
    phaseResults.some((result) => DOMAIN_PHASE[domain].includes(result.phase)),
  );
  const hasScores = scoredDomains.length > 0;
  const ratingScore = hasScores
    ? scoredDomains.reduce((sum, domain) => sum + domainScores[domain], 0) / scoredDomains.length
    : overallScore;
  const stars = !hasScores ? 3 : ratingScore >= 85 ? 3 : ratingScore >= 60 ? 2 : 1;

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
    <div className="relative flex h-full max-h-full flex-col overflow-hidden bg-background">
      <AuthBackdrop />
      <Star className="pointer-events-none absolute left-8 top-12 z-0 h-5 w-5 text-secondary animate-sparkle" />
      <Star className="pointer-events-none absolute right-10 top-40 z-0 h-4 w-4 text-primary/35 animate-sparkle" />
      <MiniPlane className="pointer-events-none absolute right-8 top-20 z-0 h-7 w-7 rotate-[18deg] text-secondary/55 animate-float" />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 pt-4 no-scrollbar lg:grid lg:grid-cols-[1.02fr_1fr] lg:items-center lg:gap-8 lg:overflow-hidden lg:px-10">
        {/* Celebration */}
        <div className="text-center">
          <div className="relative mx-auto h-[clamp(96px,18vh,190px)] max-w-[300px]">
            <div className="absolute inset-x-6 bottom-2 h-16 rounded-full bg-secondary/12 blur-xl" />
            <img
              src={dariaAndFriend}
              alt=""
              className={cn(
                "relative z-10 mx-auto h-full w-auto object-contain",
                !celebrationDone && "animate-bounce-in",
              )}
            />
          </div>

          <div className="relative -mt-7 flex justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border-[5px] border-card bg-secondary text-secondary-foreground shadow-soft animate-star-pop">
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
              >
                <path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>

          <h1 className="mt-2 font-display text-[clamp(28px,4.6vh,42px)] font-extrabold leading-none text-primary animate-slide-up">
            You did it!
          </h1>
          <p className="mx-auto mt-2 max-w-[21rem] text-sm font-semibold leading-snug text-ink-soft sm:text-base">
            Amazing work! You finished “{storyData.title}” and leveled up your skills.
          </p>

          {/* Star rating */}
          <div
            className="mt-3 flex items-center justify-center gap-2"
            aria-label={`${stars} of 3 stars`}
          >
            {[1, 2, 3].map((n) => (
              <svg
                key={n}
                viewBox="0 0 24 24"
                style={n <= stars ? { animationDelay: `${0.2 + 0.15 * n}s` } : undefined}
                className={cn(
                  "h-[clamp(26px,3.4vh,36px)] w-[clamp(26px,3.4vh,36px)]",
                  n <= stars ? "text-secondary animate-star-pop" : "text-accent",
                )}
                fill="currentColor"
                aria-hidden
              >
                <path d="M12 2l2.4 5.6L20 9l-4.6 3.8L17 19l-5-3-5 3 1.6-6.2L4 9l5.6-1.4L12 2z" />
              </svg>
            ))}
          </div>
          <p className="mt-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-secondary-deep">
            {OVERALL_ENCOURAGEMENT[scoreToLabel(hasScores ? ratingScore : 100)]}
          </p>
        </div>

        {/* Coins + skills */}
        <div className="flex min-h-0 flex-col gap-3 lg:max-h-full">
          <div className="overflow-hidden rounded-[26px] border-2 border-secondary/80 bg-card shadow-card animate-pop-in">
            <div className="flex items-center justify-between gap-4 bg-secondary/12 px-4 py-3">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-secondary-deep">
                  Coins earned this story
                </p>
                <p className="font-display text-[clamp(26px,4vh,36px)] font-extrabold leading-none text-primary">
                  +{paperPlanesEarned}
                </p>
              </div>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[20px] bg-secondary text-secondary-foreground shadow-[0_5px_0_var(--secondary-deep)]">
                <CoinIcon className="h-7 w-7" />
              </span>
            </div>
            <div className="grid grid-cols-3 divide-x-2 divide-accent/50 px-2 py-2 text-center text-[11px] font-bold text-ink-soft">
              <div>
                <span className="block">Before</span>
                <span className="text-base font-extrabold tabular-nums text-ink">
                  {previousPaperPlanes}
                </span>
              </div>
              <div>
                <span className="block">Earned</span>
                <span className="text-base font-extrabold tabular-nums text-secondary-deep">
                  +{paperPlanesEarned}
                </span>
              </div>
              <div>
                <span className="block">New total</span>
                <span className="text-base font-extrabold tabular-nums text-primary">
                  {totalPaperPlanes}
                </span>
              </div>
            </div>
          </div>

          {/* Skill breakdown */}
          <div className="min-h-0 rounded-[26px] border-2 border-accent/70 bg-card p-3.5 shadow-card">
            <h3 className="mb-2.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-primary">
              Your skills
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              {V1_DOMAINS.map((domain) => {
                const score = domainScores[domain];
                const label = scoreToLabel(score);
                const barColor =
                  label === "strength"
                    ? "bg-success"
                    : label === "growing"
                      ? "bg-primary"
                      : label === "budding"
                        ? "bg-secondary"
                        : "bg-coral";

                return (
                  <div key={domain} className="rounded-2xl bg-accent/25 p-2.5">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-sky text-primary">
                        <SkillIcon domain={domain} />
                      </span>
                      <span className="truncate text-[11px] font-extrabold text-primary">
                        {DOMAIN_LABELS[domain]}
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-card">
                      <div
                        className={cn("h-full rounded-full transition-all duration-700", barColor)}
                        style={{ width: Math.max(5, score) + "%" }}
                      />
                    </div>
                    <p className="mt-1 text-[10px] font-bold text-ink-soft">
                      {childEncouragement(label)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Continue */}
      <div className="relative z-10 mx-5 mb-4 mt-3 shrink-0 lg:mx-10">
        <TactileButton
          variant="secondary"
          onClick={handleFinish}
          leadingIcon={<ChevronRightIcon className="h-5 w-5" />}
        >
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
