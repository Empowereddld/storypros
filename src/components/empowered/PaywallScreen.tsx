import { useState } from "react";
import danDariaThumbsUp from "@/assets/dan-daria-thumbsup.webp";
import { PREMIUM_PRICE_DISPLAY, startPremiumSubscription } from "@/services/subscription";
import { TactileButton } from "./TactileButton";
import { LockIcon, MiniPlane, Star, StoryProsLogo } from "./StoryProsBrand";
import { BookIcon, ChevronRightIcon, CoinIcon, PaperPlaneIcon } from "./StoryProsUi";

interface PaywallScreenProps {
  childId: string;
  childName: string;
  storyTitle?: string;
  onClose: () => void;
  onSubscribed: () => void;
}

const EARLY_ADOPTER_PRICE = "$7.99/mo";

const COMPARISON_ROWS = [
  {
    title: "Story access",
    detail: "Free forever includes one full story. Premium unlocks all 11 stories.",
    free: "1",
    premium: "All",
  },
  {
    title: "Guided learning",
    detail: "Vocabulary, sequencing, reflection, and story retell practice.",
    free: true,
    premium: true,
  },
  {
    title: "Progress tools",
    detail: "Parent dashboard insights for completed stories and skill growth.",
    free: false,
    premium: true,
  },
  {
    title: "Coins",
    detail: "Earn and spend Coins in the rewards shop.",
    free: true,
    premium: true,
  },
];

const PREMIUM_DISPLAY_BENEFITS = [
  "All 11 Story Pros stories unlocked",
  "Full parent progress dashboard",
  "Vocabulary, sequencing, and reflection activities",
  "Story-element retell practice",
  "Coins rewards shop access",
];

export function PaywallScreen({
  childId,
  childName,
  storyTitle,
  onClose,
  onSubscribed,
}: PaywallScreenProps) {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  async function handleSubscribe() {
    setLoading(true);
    const result = await startPremiumSubscription(childId);
    setLoading(false);
    if (result.success) {
      setShowSuccess(true);
      setTimeout(() => onSubscribed(), 1500);
    }
  }

  if (showSuccess) {
    return (
      <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-cream px-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-accent/20 to-accent/50" />
        <MiniPlane className="absolute right-10 top-20 h-10 w-10 rotate-12 text-secondary" />
        <Star className="absolute left-10 bottom-32 h-6 w-6 text-secondary" />
        <div className="relative z-10 animate-pop-in">
          <span className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-secondary/25 text-secondary-foreground shadow-card">
            <PaperPlaneIcon className="h-14 w-14" />
          </span>
          <h2 className="font-display text-[30px] font-extrabold text-primary">Premium unlocked</h2>
          <p className="mt-2 text-sm font-semibold leading-relaxed text-ink-soft">
            All stories are now available for {childName}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-cream">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-accent/15 to-accent/45" />
      <MiniPlane className="absolute right-8 top-32 h-8 w-8 rotate-12 text-secondary/75" />
      <Star className="absolute left-8 top-28 h-4 w-4 text-secondary/80" />
      <Star className="absolute right-12 bottom-40 h-4 w-4 text-primary/30" />

      <header className="relative z-10 flex items-center justify-between gap-3 px-5 pt-5">
        <button
          onClick={onClose}
          aria-label="Back"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-primary shadow-card transition-transform active:scale-95"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.7"
            aria-hidden
          >
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <StoryProsLogo layout="row" size="md" className="scale-90" />
        <span className="flex items-center gap-1.5 rounded-full bg-card px-3 py-2 text-[11px] font-extrabold leading-tight text-primary shadow-card">
          <LockIcon className="h-4 w-4 text-primary" />
          Kid-Safe
        </span>
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto px-5 pb-6 pt-5 no-scrollbar">
        <section className="grid gap-4">
          <div className="flex items-end gap-3">
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-[40px] font-extrabold leading-[0.98] text-primary">
                Unlock Their <span className="text-secondary">Story Potential</span>
              </h1>
              <p className="mt-3 text-base font-semibold leading-relaxed text-ink-soft">
                Premium tools and inspiration to help kids practice, express, and grow together.
              </p>
            </div>
            <div className="relative h-36 w-32 shrink-0 overflow-hidden rounded-[2rem] border-4 border-white bg-accent/45 shadow-card">
              <img
                src={danDariaThumbsUp}
                alt=""
                className="h-full w-full object-contain object-bottom"
              />
            </div>
          </div>

          {storyTitle && (
            <div className="rounded-3xl border border-secondary/40 bg-card/90 p-4 shadow-card">
              <p className="text-sm font-bold text-primary">{storyTitle}</p>
              <p className="mt-1 text-xs font-semibold text-ink-soft">
                This story is part of the Premium library for {childName}.
              </p>
            </div>
          )}

          <div className="grid gap-2.5">
            {[
              "For parents and educators",
              "Cancel anytime",
              "Free forever plan stays available",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 text-sm font-bold text-primary">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
                {benefit}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-[1.75rem] border-2 border-primary/35 bg-card p-4 shadow-card">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-secondary/25 text-secondary-foreground">
              <PaperPlaneIcon className="h-9 w-9" />
            </span>
            <div className="min-w-0 flex-1">
              <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-[10px] font-extrabold uppercase text-secondary-foreground">
                Early adopter
              </span>
              <h2 className="mt-2 font-display text-xl font-extrabold text-primary">
                Story Pros Premium
              </h2>
              <p className="text-xs font-semibold leading-relaxed text-ink-soft">
                All stories, growth insights, and full reward access.
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-2xl font-extrabold text-primary">
                {EARLY_ADOPTER_PRICE}
              </p>
              <p className="text-[11px] font-bold text-ink-soft">Regular {PREMIUM_PRICE_DISPLAY}</p>
            </div>
          </div>
        </section>

        <section className="mt-5 overflow-hidden rounded-[1.75rem] border border-accent/70 bg-card shadow-card">
          <div className="grid grid-cols-[1fr_4rem_5rem] items-center border-b border-accent/60 px-4 py-3">
            <h2 className="font-display text-lg font-extrabold text-primary">Plan comparison</h2>
            <span className="text-center text-xs font-extrabold uppercase text-ink-soft">Free</span>
            <span className="rounded-full bg-accent/60 py-1 text-center text-xs font-extrabold uppercase text-primary">
              Premium
            </span>
          </div>
          {COMPARISON_ROWS.map((row) => (
            <div
              key={row.title}
              className="grid grid-cols-[1fr_4rem_5rem] items-center gap-2 border-b border-accent/45 px-4 py-3 last:border-b-0"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-accent/60 text-primary">
                  {row.title === "Coins" ? (
                    <CoinIcon className="h-5 w-5" />
                  ) : (
                    <BookIcon className="h-5 w-5" />
                  )}
                </span>
                <span>
                  <span className="block text-sm font-extrabold leading-tight text-primary">
                    {row.title}
                  </span>
                  <span className="mt-0.5 block text-[11px] font-semibold leading-snug text-ink-soft">
                    {row.detail}
                  </span>
                </span>
              </div>
              <PlanCell value={row.free} muted={row.free === false} />
              <PlanCell value={row.premium} />
            </div>
          ))}
        </section>

        <section className="mt-4 rounded-[1.75rem] bg-card/90 p-4 shadow-card">
          <h2 className="text-sm font-extrabold text-primary">Included with Premium</h2>
          <div className="mt-3 space-y-2.5">
            {PREMIUM_DISPLAY_BENEFITS.map((benefit) => (
              <div key={benefit} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                  <CheckIcon className="h-3 w-3" />
                </span>
                <p className="text-sm font-semibold leading-snug text-ink">{benefit}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="relative z-20 px-5 pb-5 pt-3">
        <TactileButton
          onClick={handleSubscribe}
          disabled={loading}
          leadingIcon={<PaperPlaneIcon className="h-6 w-6" />}
        >
          {loading ? "Processing..." : "Upgrade to Premium"}
        </TactileButton>
        <button
          onClick={onClose}
          className="mt-3 w-full text-center text-xs font-semibold text-ink-soft"
        >
          Already have Premium? <span className="font-bold text-primary">Restore Purchase</span>
        </button>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[11px] font-semibold leading-relaxed text-ink-soft/90">
          <LockIcon className="h-3.5 w-3.5" />
          Secure checkout. Cancel anytime.
          <ChevronRightIcon className="h-3.5 w-3.5" />
        </p>
      </div>
    </div>
  );
}

function PlanCell({ value, muted = false }: { value: boolean | string; muted?: boolean }) {
  if (typeof value === "string") {
    return <span className="text-center text-sm font-extrabold text-primary">{value}</span>;
  }

  return (
    <span
      className={[
        "mx-auto flex h-7 w-7 items-center justify-center rounded-full",
        value && !muted ? "bg-secondary text-secondary-foreground" : "bg-muted text-ink-soft",
      ].join(" ")}
    >
      {value && !muted ? <CheckIcon className="h-4 w-4" /> : <XIcon className="h-4 w-4" />}
    </span>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      aria-hidden
    >
      <path d="M5 12.5l4.2 4.2L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      aria-hidden
    >
      <path d="M7 7l10 10M17 7L7 17" strokeLinecap="round" />
    </svg>
  );
}
