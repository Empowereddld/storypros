import { useState } from "react";
import danDariaCelebrate from "@/assets/dan-daria-celebrate.webp";
import danDariaThinking from "@/assets/dan-daria-thinking.webp";
import { cn } from "@/lib/utils";
import { getProgress, setCurrentLevel } from "@/services/progress";
import {
  qualifiesForLevel2,
  scoreToLabel,
  labelToDisplayText,
  type SkillDomain,
} from "@/services/scoring";
import { getStory } from "@/services/stories";
import { resolveStoryImage } from "@/services/storyImages";
import { AuthBackdrop, MiniPlane, Star, StoryProsLogo } from "./StoryProsBrand";
import { TactileButton } from "./TactileButton";
import { StoryEngine } from "./phases";

interface OnboardingAssessmentProps {
  childName: string;
  onComplete: () => void;
}

type Phase = "intro" | "playing" | "result";

const V1_DOMAINS: SkillDomain[] = ["listening", "story_structure", "vocabulary", "grammar"];

const DOMAIN_LABELS: Record<SkillDomain, string> = {
  listening: "Listening",
  story_structure: "Story structure",
  vocabulary: "Vocabulary",
  grammar: "Sentence building",
  retell: "Retelling",
  phonological: "Sounds",
};

const DOMAIN_TONES: Record<SkillDomain, string> = {
  listening: "bg-primary text-primary-foreground",
  story_structure: "bg-secondary text-secondary-foreground",
  vocabulary: "bg-success text-success-foreground",
  grammar: "bg-coral text-coral-foreground",
  retell: "bg-primary text-primary-foreground",
  phonological: "bg-secondary text-secondary-foreground",
};

export function OnboardingAssessment({ childName, onComplete }: OnboardingAssessmentProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [placedLevel, setPlacedLevel] = useState(1);
  const [domainScores, setDomainScores] = useState<Record<SkillDomain, number> | null>(null);

  const story = getStory("dan-and-the-paper-cut");
  const firstName = (childName || "Story Pro").trim().split(/\s+/)[0];

  function handleStoryFinish() {
    const progress = getProgress();
    const lastCompletion = progress.completions[progress.completions.length - 1];

    if (lastCompletion) {
      const scores = lastCompletion.domainScores;
      const recommended = qualifiesForLevel2(scores) ? 2 : 1;

      setDomainScores(scores);
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
    return (
      <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-background px-6 text-center">
        <AuthBackdrop />
        <StoryProsLogo layout="stacked" size="lg" className="relative z-10 animate-pop-in" />
        <p className="relative z-10 mt-6 text-lg font-extrabold text-primary">
          Loading your story check...
        </p>
      </div>
    );
  }

  if (phase === "playing") {
    return <StoryEngine storyData={story} onFinish={handleStoryFinish} />;
  }

  if (phase === "intro") {
    const cover = resolveStoryImage(story.id, story.slides[0]?.image || "slide-01.webp");

    return (
      <div className="relative flex h-full flex-col overflow-hidden bg-background">
        <AuthBackdrop />
        <MiniPlane className="absolute right-8 top-24 z-10 h-10 w-10 rotate-12 text-secondary drop-shadow-lg animate-float" />
        <Star className="absolute left-8 top-36 z-10 h-4 w-4 text-secondary animate-sparkle" />
        <Star className="absolute right-12 bottom-28 z-10 h-5 w-5 text-primary/40 animate-sparkle" />

        <div className="relative z-20 flex h-full flex-col items-center justify-center px-5 py-6">
          <StoryProsLogo layout="row" size="md" className="animate-pop-in" />

          <div className="mt-7 text-center animate-slide-up">
            <h1 className="font-display text-[34px] font-extrabold leading-[1.02] text-primary">
              Starting Point
            </h1>
            <p className="mt-2.5 text-[15px] font-medium leading-snug text-ink-soft">
              Let's find the best place to begin.
            </p>
          </div>

          <div className="mt-7 w-full max-w-[420px] overflow-hidden rounded-[32px] border-[6px] border-card bg-card shadow-soft animate-slide-up">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-accent sm:aspect-[16/10]">
              <img
                src={cover || danDariaThinking}
                alt=""
                className="h-full w-full object-cover object-[center_22%]"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-primary/80 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-extrabold text-secondary-foreground shadow-card">
                  Starting Story
                </span>
                <h2 className="mt-2 text-xl font-extrabold leading-tight text-primary-foreground drop-shadow">
                  Dan and the Papercut
                </h2>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-[13px] font-semibold leading-snug text-ink-soft">
            A grown-up can change the level any time.
          </p>

          <TactileButton
            onClick={() => setPhase("playing")}
            className="mt-5 w-full max-w-[300px]"
          >
            <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
              Start the Story <ArrowRightIcon />
            </span>
          </TactileButton>
        </div>

      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <AuthBackdrop />
      <Star className="absolute left-9 top-24 z-10 h-5 w-5 text-secondary animate-sparkle" />
      <Star className="absolute right-10 top-36 z-10 h-4 w-4 text-primary/40 animate-sparkle" />

      <div className="relative z-20 flex h-full flex-col px-5 pb-5 pt-4">
        <StoryProsLogo layout="row" size="sm" className="mx-auto" />

        <div className="mt-3 text-center animate-slide-up">
          <img
            src={danDariaCelebrate}
            alt=""
            className="mx-auto h-40 w-56 object-contain drop-shadow-xl animate-bounce-in"
          />
          <h1 className="font-display text-[32px] font-extrabold leading-tight text-primary">
            {placedLevel >= 2 ? "Ready for Level 2!" : "Level 1 is a great fit!"}
          </h1>
          <p className="mx-auto mt-2 max-w-[310px] text-[15px] font-medium leading-snug text-ink-soft">
            {placedLevel >= 2
              ? `${firstName} is ready for longer sentences and bigger story moments.`
              : `${firstName} can build confidence with short, friendly stories first.`}
          </p>
        </div>

        <div className="mt-5 rounded-[28px] border border-border/70 bg-card/95 p-4 shadow-soft animate-slide-up">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink-soft">
                Recommended start
              </p>
              <p className="mt-1 text-3xl font-extrabold text-primary">Level {placedLevel}</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-3xl font-extrabold text-secondary-foreground shadow-card">
              {placedLevel}
            </div>
          </div>
        </div>

        {domainScores && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-ink">Skill snapshot</h2>
              <span className="text-xs font-bold text-primary">Parent view</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {V1_DOMAINS.map((domain) => {
                const score = domainScores[domain];
                const label = scoreToLabel(score);
                return (
                  <div
                    key={domain}
                    className="rounded-[22px] border border-border/70 bg-card p-3 shadow-card"
                  >
                    <span
                      className={cn(
                        "inline-flex h-9 w-9 items-center justify-center rounded-2xl",
                        DOMAIN_TONES[domain],
                      )}
                    >
                      <DomainIcon domain={domain} />
                    </span>
                    <p className="mt-2 text-sm font-extrabold leading-tight text-primary">
                      {DOMAIN_LABELS[domain]}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-ink-soft">
                      {labelToDisplayText(label)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-auto space-y-4 pt-5">
          <div className="rounded-[24px] bg-accent/70 p-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary">
              Parent override
            </p>
            <p className="mt-1 text-xs font-medium leading-snug text-ink-soft">
              You know your child best. You can change the level now or later in Settings.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[1, 2].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleOverride(level)}
                  className={cn(
                    "press-pop rounded-2xl border-2 px-3 py-3 text-sm font-extrabold transition-colors",
                    placedLevel === level
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-transparent bg-card text-primary",
                  )}
                >
                  Level {level}
                </button>
              ))}
            </div>
          </div>

          <TactileButton onClick={onComplete}>
            Start Adventuring <ArrowRightIcon />
          </TactileButton>
        </div>
      </div>
    </div>
  );
}

function DomainIcon({ domain }: { domain: SkillDomain }) {
  if (domain === "listening") return <HeadphonesIcon />;
  if (domain === "story_structure") return <BookIcon />;
  if (domain === "vocabulary") return <LettersIcon />;
  return <BlocksIcon />;
}

function HeadphonesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden
    >
      <path d="M4 13a8 8 0 0116 0" strokeLinecap="round" />
      <rect x="3" y="13" width="5" height="7" rx="2" />
      <rect x="16" y="13" width="5" height="7" rx="2" />
    </svg>
  );
}

function BlocksIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden
    >
      <rect x="4" y="4" width="7" height="7" rx="2" />
      <rect x="13" y="4" width="7" height="7" rx="2" />
      <rect x="8.5" y="13" width="7" height="7" rx="2" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden
    >
      <path d="M5 5.5A3.5 3.5 0 018.5 2H20v17H8.5A3.5 3.5 0 005 22V5.5z" />
      <path d="M5 5.5A3.5 3.5 0 018.5 2H20" strokeLinecap="round" />
    </svg>
  );
}

function LettersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      aria-hidden
    >
      <path d="M5 18l4.5-12L14 18M7 13h5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 10.5h3M17.5 9v6" strokeLinecap="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 text-secondary"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      aria-hidden
    >
      <path d="M4 12h15M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
