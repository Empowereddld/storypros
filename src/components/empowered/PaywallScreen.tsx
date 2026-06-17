/* ─────────────────────────────────────────────
 * Paywall / Premium Upgrade
 * Rebuilt from the "Unlock Their Story Potential"
 * mockup. Mock checkout preserved (Stripe later).
 * ───────────────────────────────────────────── */

import { useState } from "react";
import { TactileButton } from "./TactileButton";
import {
  PREMIUM_PRICE_DISPLAY,
  PREMIUM_BENEFITS,
  startPremiumSubscription,
} from "@/services/subscription";
import { StoryProsLogo } from "./StoryProsBrand";

interface PaywallScreenProps {
  childId: string;
  childName: string;
  storyTitle?: string;
  onClose: () => void;
  onSubscribed: () => void;
}

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
      <div className="flex h-full flex-col items-center justify-center bg-cream px-6">
        <div className="animate-pop-in text-center">
          <span className="mb-4 block text-6xl">🎉</span>
          <h2 className="font-display text-[28px] font-extrabold text-primary mb-2">Welcome to Premium!</h2>
          <p className="text-sm text-ink-soft">All stories are now unlocked for {childName}.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between gap-2 px-4 pt-4">
        <button
          onClick={onClose}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-soft transition-colors hover:bg-accent/60 active:scale-95"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <StoryProsLogo layout="row" size="sm" />
        <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-[10px] font-bold text-success">
          🛡️ Kid-Safe
        </span>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-6 pt-3">
        <h1 className="font-display text-[28px] font-extrabold leading-tight">
          <span className="text-primary">Unlock Their </span>
          <span className="text-secondary">Story Potential</span>
        </h1>
        <p className="mt-1.5 text-sm font-medium text-ink-soft">
          Premium tools and inspiration to help kids imagine, create, and grow — together.
        </p>
        {storyTitle && (
          <p className="mt-2 text-sm text-ink-soft">
            <span className="font-bold text-ink">{storyTitle}</span> is a premium story.
          </p>
        )}

        {/* Benefit chips */}
        <div className="mt-3 flex flex-wrap gap-2">
          {["For Parents & Educators", "Cancel Anytime", "14-Day Money-Back"].map((b) => (
            <span key={b} className="inline-flex items-center gap-1 rounded-full bg-accent/50 px-3 py-1.5 text-xs font-bold text-primary">
              ✓ {b}
            </span>
          ))}
        </div>

        {/* Price card */}
        <div className="mt-4 rounded-3xl border-2 border-primary/30 bg-card p-5 shadow-card">
          <span className="inline-block rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-secondary-foreground">
            Best value
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <div>
              <p className="font-display text-lg font-extrabold text-primary">Story Pros Premium</p>
              <p className="text-xs text-ink-soft">Per child · Cancel anytime</p>
            </div>
            <p className="font-display text-2xl font-extrabold text-primary">{PREMIUM_PRICE_DISPLAY}</p>
          </div>

          <div className="mt-4 space-y-2.5">
            {PREMIUM_BENEFITS.map((benefit) => (
              <div key={benefit} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15">
                  <svg viewBox="0 0 24 24" className="h-3 w-3 text-success" stroke="currentColor" strokeWidth="3" fill="none"><path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <p className="text-sm leading-snug text-ink">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-4 flex justify-around text-center">
          {[["🔒", "100% Secure"], ["💜", "Trusted by Parents"], ["🧸", "Kid-Safe"]].map(([icon, label]) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className="text-xl">{icon}</span>
              <span className="text-[10px] font-bold text-ink-soft">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 pb-6 pt-2">
        <TactileButton onClick={handleSubscribe} disabled={loading}>
          {loading ? "Processing…" : "Upgrade to Premium ✨"}
        </TactileButton>
        <button onClick={onClose} className="mt-3 w-full text-center text-xs font-semibold text-ink-soft">
          Already have Premium? <span className="font-bold text-primary">Restore Purchase</span>
        </button>
        <p className="mt-2 text-center text-[11px] leading-relaxed text-ink-soft/80">
          Subscription is for {childName}. Cancel anytime from Settings.
        </p>
      </div>
    </div>
  );
}
