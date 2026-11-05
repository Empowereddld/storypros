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
import { ListenButton, useListen } from "./ListenButton";
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
  ttsSpeed = "normal",
}: StoryPhaseProps<StoryCompleteData>) {
  const { supported, isPlaying, toggle, cancel } = useListen(ttsSpeed);
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
    cancel();
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

      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center gap-5 overflow-y-auto px-5 pb-4 pt-16 no-scrollbar">
        {/* Celebration */}
        <div className="text-center">
          <div className="relative mx-auto h-[clamp(110px,22vh,200px)] max-w-[300px]">
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

          <div className="relative -mt-6 flex justify-center">
            <span className="relative z-20 flex h-14 w-14 items-center justify-center rounded-full border-[5px] border-card bg-secondary text-secondary-foreground shadow-soft animate-star-pop">
              <svg viewBox="0 0 24 24" className="h-6 w-6" stroke="currentColor" strokeWidth="3" fill="none">
                <path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>

          <div className="mt-3 flex items-center justify-center gap-3">
            <h1 className="font-display text-[clamp(28px,4.6vh,42px)] font-extrabold leading-none text-primary animate-slide-up">
              You did it!
            </h1>
            {supported && (
              <ListenButton
                playing={isPlaying("done")}
                onClick={() => toggle(`You did it! Amazing work! You finished ${storyData.title} and leveled up your skills.`, "done")}
                ariaLabel="Hear the message"
              />
            )}
          </div>
          <p className="mx-auto mt-2 max-w-[24rem] text-sm font-semibold leading-snug text-ink-soft sm:text-base">
            Amazing work! You finished “{storyData.title}” and leveled up your skills.
          </p>
        </div>

        {/* Coins */}
        <div className="w-full max-w-md rounded-[26px] border-2 border-secondary/80 bg-card p-4 shadow-card animate-pop-in">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-secondary-deep">
              <CoinIcon className="h-5 w-5" /> Your coins
            </p>
            {supported && (
              <ListenButton
                playing={isPlaying("coins")}
                onClick={() => toggle(`You earned ${paperPlanesEarned} coins this story. Your total is ${totalPaperPlanes} coins.`, "coins")}
                ariaLabel="Hear your coins"
              />
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-2xl bg-secondary/15 px-3 py-3">
              <span className="block text-xs font-bold text-ink-soft">Earned</span>
              <span className="font-display text-3xl font-extrabold tabular-nums text-secondary-deep">+{paperPlanesEarned}</span>
            </div>
            <div className="rounded-2xl bg-accent/40 px-3 py-3">
              <span className="block text-xs font-bold text-ink-soft">Total</span>
              <span className="font-display text-3xl font-extrabold tabular-nums text-primary">{totalPaperPlanes}</span>
            </div>
          </div>
        </div>

        <TactileButton
          variant="secondary"
          fullWidth={false}
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
