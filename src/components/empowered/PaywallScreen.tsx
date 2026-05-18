/* ─────────────────────────────────────────────
 * Paywall Screen
 * Shown when a free-tier user tries to access
 * a locked story. Presents the premium plan
 * and handles mock checkout.
 * ───────────────────────────────────────────── */

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  PREMIUM_PRICE_DISPLAY,
  PREMIUM_BENEFITS,
  startPremiumSubscription,
} from "@/services/subscription";

interface PaywallScreenProps {
  childId: string;
  childName: string;
  /** The story they were trying to access */
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
    // In production: redirect to Stripe Checkout
    // Mock: instantly activate premium
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
          <span className="text-6xl block mb-4">🎉</span>
          <h2 className="font-display text-[28px] font-extrabold text-primary mb-2">
            Welcome to Premium!
          </h2>
          <p className="text-sm text-ink-soft">
            All stories are now unlocked for {childName}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-cream">
      {/* Close button */}
      <div className="px-4 pt-4">
        <button
          onClick={onClose}
          className="text-sm font-bold text-ink-soft hover:text-primary transition-colors"
        >
          ← Back
        </button>
      </div>

      <div className="flex flex-1 flex-col px-6 pt-4 pb-8">
        {/* Hero */}
        <div className="text-center mb-6 animate-slide-up">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 mb-4">
            <span className="text-4xl">✈️</span>
          </div>
          <h1 className="font-display text-[28px] font-extrabold text-primary leading-tight mb-2">
            Unlock all stories
          </h1>
          {storyTitle && (
            <p className="text-sm text-ink-soft">
              <span className="font-semibold text-ink">{storyTitle}</span> is a premium story.
            </p>
          )}
        </div>

        {/* Price card */}
        <div className="rounded-3xl bg-card border-2 border-primary/20 shadow-card p-5 mb-5 animate-slide-up">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Story Pros Premium</p>
              <p className="text-sm text-ink-soft mt-0.5">Per child · Cancel anytime</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-primary">{PREMIUM_PRICE_DISPLAY}</p>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-2.5">
            {PREMIUM_BENEFITS.map((benefit) => (
              <div key={benefit} className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15">
                  <svg viewBox="0 0 24 24" className="h-3 w-3 text-success" stroke="currentColor" strokeWidth="3" fill="none">
                    <path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-sm text-ink leading-snug">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1" />

        {/* CTA */}
        <div className="space-y-3 animate-slide-up">
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className={cn(
              "w-full h-14 rounded-2xl font-bold text-base transition-all active:scale-[0.98]",
              "bg-primary text-primary-foreground shadow-[0_5px_0_0_var(--primary-deep)]",
              "hover:shadow-[0_3px_0_0_var(--primary-deep)] hover:translate-y-[2px]",
              loading && "opacity-60 cursor-not-allowed",
            )}
          >
            {loading ? "Processing..." : `Subscribe · ${PREMIUM_PRICE_DISPLAY}`}
          </button>

          <p className="text-center text-xs text-ink-soft leading-relaxed">
            Subscription is for <span className="font-semibold">{childName}</span>.
            Cancel anytime from Settings. Adding another child starts a separate subscription.
          </p>
        </div>
      </div>
    </div>
  );
}
