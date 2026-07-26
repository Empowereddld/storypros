/* ─────────────────────────────────────────────
 * Subscription Service
 * Manages free vs premium access per child.
 *
 * Pricing model:
 *   - Free tier: first story only (Dan's Paper Cut)
 *   - Premium: $7.99/mo USD per child, all stories unlocked
 *     (7-day free trial advertised on the landing page)
 *   - Per-account billing, but each child is a
 *     separate subscription slot
 *
 * Cache-first hybrid:
 *   - localStorage = synchronous cache screens read
 *   - child_subscriptions table = source of truth
 *   - Mock billing still flips tiers directly; the
 *     Stripe checkout/webhook flow replaces the
 *     write paths later without changing this API.
 * ───────────────────────────────────────────── */

import { db, isCloudId, logSyncError, emitDataUpdated } from "./cloud";

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

export const PREMIUM_PRICE = 7.99;
export const PREMIUM_PRICE_DISPLAY = "$7.99/mo";
/** Free trial length advertised on the landing page */
export const TRIAL_DAYS = 7;
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

// ── Cloud sync ──

interface SubscriptionRow {
  child_id: string;
  tier: PlanTier;
  subscribed_at: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean | null;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
}

/**
 * Pull all of this account's child subscriptions into the cache.
 * Called by AuthContext once children are loaded.
 */
export async function hydrateSubscriptionsFromCloud(): Promise<void> {
  try {
    const { data: auth } = await db.auth.getUser();
    if (!auth.user) return;

    const { data, error } = await db
      .from("child_subscriptions")
      .select(
        "child_id, tier, subscribed_at, current_period_end, cancel_at_period_end, stripe_subscription_id, stripe_customer_id",
      )
      .eq("account_id", auth.user.id);
    if (error) throw error;

    const state = loadState();
    for (const row of (data ?? []) as SubscriptionRow[]) {
      state.children[row.child_id] = {
        childId: row.child_id,
        tier: row.tier,
        subscribedAt: row.subscribed_at ?? undefined,
        currentPeriodEnd: row.current_period_end ?? undefined,
        cancelAtPeriodEnd: row.cancel_at_period_end ?? undefined,
        stripeSubscriptionId: row.stripe_subscription_id ?? undefined,
        stripeCustomerId: row.stripe_customer_id ?? undefined,
      };
    }
    saveState(state);
    emitDataUpdated("subscriptions");
  } catch (err) {
    logSyncError("hydrate subscriptions")(err);
  }
}

/** Write-through a subscription change to the cloud */
function syncSubscriptionToCloud(sub: ChildSubscription): void {
  if (!isCloudId(sub.childId)) return;
  void (async () => {
    try {
      const { data: auth } = await db.auth.getUser();
      if (!auth.user) return;
      const { error } = await db.from("child_subscriptions").upsert(
        {
          account_id: auth.user.id,
          child_id: sub.childId,
          tier: sub.tier,
          subscribed_at: sub.subscribedAt ?? null,
          current_period_end: sub.currentPeriodEnd ?? null,
          cancel_at_period_end: sub.cancelAtPeriodEnd ?? false,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "child_id" },
      );
      if (error) throw error;
    } catch (err) {
      logSyncError("upsert subscription")(err);
    }
  })();
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
    (sub) =>
      sub.tier === "premium" &&
      (!sub.currentPeriodEnd || new Date(sub.currentPeriodEnd) >= new Date()),
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
 * Mock version: instantly activates premium (and syncs to cloud).
 */
export async function startPremiumSubscription(
  childId: string,
): Promise<{ success: boolean; error?: string }> {
  const state = loadState();

  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  const sub: ChildSubscription = {
    childId,
    tier: "premium",
    subscribedAt: now.toISOString(),
    currentPeriodEnd: periodEnd.toISOString(),
    cancelAtPeriodEnd: false,
    // In production: stripeSubscriptionId and stripeCustomerId
    // would come from the Stripe webhook
  };
  state.children[childId] = sub;

  saveState(state);
  syncSubscriptionToCloud(sub);
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
    return { success: false, error: "No active subscription found" };
  }

  sub.cancelAtPeriodEnd = true;
  saveState(state);
  syncSubscriptionToCloud(sub);
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
    return { success: false, error: "No active subscription found" };
  }

  sub.cancelAtPeriodEnd = false;
  saveState(state);
  syncSubscriptionToCloud(sub);
  return { success: true };
}

/**
 * Downgrade a child to free tier immediately.
 * Used when subscription expires or is force-cancelled.
 */
export function downgradeToFree(childId: string): void {
  const state = loadState();
  const sub: ChildSubscription = { childId, tier: "free" };
  state.children[childId] = sub;
  saveState(state);
  syncSubscriptionToCloud(sub);
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
      const downgraded: ChildSubscription = { childId, tier: "free" };
      state.children[childId] = downgraded;
      syncSubscriptionToCloud(downgraded);
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
