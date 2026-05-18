/* ─────────────────────────────────────────────
 * Subscription Service
 * Manages free vs premium access per child.
 *
 * Pricing model:
 *   - Free tier: first story only (Dan's Paper Cut)
 *   - Premium: $9.99/mo per child, all stories unlocked
 *   - Per-account billing, but each child is a
 *     separate subscription slot
 *
 * Mock billing for now — swap the checkout/cancel
 * functions for real Stripe calls when connecting.
 * ───────────────────────────────────────────── */

// ── Types ──

export type PlanTier = "free" | "premium";

export interface ChildSubscription {
  childId: string;
  tier: PlanTier;
  /** When the premium subscription started (ISO) */
  subscribedAt?: string;
  /** When the current billing period ends (ISO) */
  currentPeriodEnd?: string;
  /** Whether the subscription is set to cancel at period end */
  cancelAtPeriodEnd?: boolean;
  /** Stripe subscription ID (placeholder for real integration) */
  stripeSubscriptionId?: string;
  /** Stripe customer ID (placeholder) */
  stripeCustomerId?: string;
}

export interface SubscriptionState {
  /** Map of childId → subscription info */
  children: Record<string, ChildSubscription>;
}

// ── Constants ──

export const PREMIUM_PRICE = 9.99;
export const PREMIUM_PRICE_DISPLAY = "$9.99/mo";
export const FREE_STORY_IDS = ["dan-and-the-paper-cut"]; // stories available on free tier

export const PREMIUM_BENEFITS = [
  "All 30+ Story Starters stories",
  "Level 2 Story Builders (when available)",
  "Full progress dashboard",
  "Vocabulary & grammar tracking",
  "Detailed skill breakdowns",
  "New stories added regularly",
];

// ── Storage ──

const STORAGE_KEY = "storypros_subscriptions";

function loadState(): SubscriptionState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { children: {} };
  } catch {
    return { children: {} };
  }
}

function saveState(state: SubscriptionState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ── Core functions ──

/** Get the subscription for a specific child */
export function getChildSubscription(childId: string): ChildSubscription {
  const state = loadState();
  return state.children[childId] ?? { childId, tier: "free" };
}

/** Check if a child has premium access */
export function isPremium(childId: string): boolean {
  const sub = getChildSubscription(childId);
  if (sub.tier !== "premium") return false;

  // Check if subscription is still active (not expired)
  if (sub.currentPeriodEnd) {
    const endDate = new Date(sub.currentPeriodEnd);
    if (endDate < new Date()) return false;
  }

  return true;
}

/** Check if a specific story is accessible for a child */
export function canAccessStory(childId: string, storyId: string): boolean {
  // Free stories are always accessible
  if (FREE_STORY_IDS.includes(storyId)) return true;

  // Premium users can access everything
  return isPremium(childId);
}

/** Get all subscriptions for the current account */
export function getAllSubscriptions(): ChildSubscription[] {
  const state = loadState();
  return Object.values(state.children);
}

/** Count how many active premium subscriptions exist */
export function getActivePremiumCount(): number {
  const state = loadState();
  return Object.values(state.children).filter(
    (sub) => sub.tier === "premium" && (!sub.currentPeriodEnd || new Date(sub.currentPeriodEnd) >= new Date()),
  ).length;
}

// ── Mock billing functions ──
// Replace these with real Stripe integration later

/**
 * Start a premium subscription for a child.
 *
 * In production:
 *   1. Create Stripe Checkout Session
 *   2. Redirect to Stripe
 *   3. Handle webhook → update subscription
 *
 * Mock version: instantly activates premium.
 */
export async function startPremiumSubscription(
  childId: string,
): Promise<{ success: boolean; error?: string }> {
  const state = loadState();

  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  state.children[childId] = {
    childId,
    tier: "premium",
    subscribedAt: now.toISOString(),
    currentPeriodEnd: periodEnd.toISOString(),
    cancelAtPeriodEnd: false,
    // In production: stripeSubscriptionId and stripeCustomerId
    // would come from the Stripe webhook
  };

  saveState(state);
  return { success: true };
}

/**
 * Cancel a premium subscription (takes effect at period end).
 *
 * In production: calls Stripe API to cancel at period end.
 */
export async function cancelSubscription(
  childId: string,
): Promise<{ success: boolean; error?: string }> {
  const state = loadState();
  const sub = state.children[childId];

  if (!sub || sub.tier !== "premium") {
    return { error: "No active subscription found" };
  }

  sub.cancelAtPeriodEnd = true;
  saveState(state);
  return { success: true };
}

/**
 * Reactivate a cancelled subscription (before period ends).
 *
 * In production: calls Stripe API to remove cancellation.
 */
export async function reactivateSubscription(
  childId: string,
): Promise<{ success: boolean; error?: string }> {
  const state = loadState();
  const sub = state.children[childId];

  if (!sub || sub.tier !== "premium") {
    return { error: "No active subscription found" };
  }

  sub.cancelAtPeriodEnd = false;
  saveState(state);
  return { success: true };
}

/**
 * Downgrade a child to free tier immediately.
 * Used when subscription expires or is force-cancelled.
 */
export function downgradeToFree(childId: string): void {
  const state = loadState();
  state.children[childId] = { childId, tier: "free" };
  saveState(state);
}

/**
 * Check and handle expired subscriptions.
 * Call this on app load to clean up expired subs.
 */
export function processExpiredSubscriptions(): void {
  const state = loadState();
  const now = new Date();

  for (const [childId, sub] of Object.entries(state.children)) {
    if (
      sub.tier === "premium" &&
      sub.cancelAtPeriodEnd &&
      sub.currentPeriodEnd &&
      new Date(sub.currentPeriodEnd) < now
    ) {
      // Subscription expired and was set to cancel
      state.children[childId] = { childId, tier: "free" };
    }
  }

  saveState(state);
}

// ── Stripe integration placeholders ──

/**
 * Create a Stripe Checkout Session URL.
 * In production, this calls your backend API which
 * creates the session via Stripe SDK.
 *
 * Replace this entire function when connecting Stripe.
 */
export async function createCheckoutSession(
  _childId: string,
  _returnUrl: string,
): Promise<{ url: string } | { error: string }> {
  // Mock: just return success (no real URL)
  // In production:
  //   const res = await fetch('/api/create-checkout', {
  //     method: 'POST',
  //     body: JSON.stringify({ childId, returnUrl }),
  //   });
  //   return res.json();
  return { url: "#mock-checkout" };
}

/**
 * Create a Stripe Customer Portal URL for managing billing.
 * In production, calls your backend API.
 */
export async function createPortalSession(
  _returnUrl: string,
): Promise<{ url: string } | { error: string }> {
  // Mock: no real URL
  return { url: "#mock-portal" };
}
