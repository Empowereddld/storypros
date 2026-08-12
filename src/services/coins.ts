/* ─────────────────────────────────────────────
 * In-activity coin awards
 *
 * Wraps the existing coin wallet (services/progress →
 * coins_ledger) with:
 *   - idempotent award keys
 *       childId + storyId + activity + item
 *   - a per-story session tally (for section totals
 *     and the story summary)
 *   - a browser event the coin counter / micro
 *     feedback layer listens to
 *
 * Coins are only ever added. Nothing here can subtract.
 * ───────────────────────────────────────────── */

import { addCoins, getActiveProgressChild, getPaperPlanes } from "./progress";
import { db, isCloudId, logSyncError } from "./cloud";
import type { CoinActivity } from "./coinEconomy";

const AWARDS_KEY_PREFIX = "storypros_coin_awards_";
const LEDGER_REASON_PREFIX = "coin:";

/** Child whose award keys are currently loaded */
let loadedChild: string | null = null;
/** Award keys already granted for that child */
let granted = new Set<string>();
/** Children we've already hydrated from the cloud this session */
const hydratedChildren = new Set<string>();

function storageKey(childId: string): string {
  return `${AWARDS_KEY_PREFIX}${childId}`;
}

function loadGranted(childId: string): void {
  loadedChild = childId;
  granted = new Set<string>();
  try {
    const raw = localStorage.getItem(storageKey(childId));
    if (raw) granted = new Set<string>(JSON.parse(raw) as string[]);
  } catch {
    /* ignore */
  }
  if (isCloudId(childId) && !hydratedChildren.has(childId)) {
    hydratedChildren.add(childId);
    void hydrateFromCloud(childId);
  }
}

function persistGranted(): void {
  if (!loadedChild) return;
  try {
    localStorage.setItem(storageKey(loadedChild), JSON.stringify([...granted]));
  } catch {
    /* ignore */
  }
}

/** Pull previously-granted award keys from the ledger so other devices don't re-earn. */
async function hydrateFromCloud(childId: string): Promise<void> {
  const { data, error } = await db
    .from("coins_ledger")
    .select("reason")
    .eq("child_id", childId)
    .like("reason", `${LEDGER_REASON_PREFIX}%`);

  if (error) return logSyncError("read coin awards")(error);
  if (!data || loadedChild !== childId) return;

  let changed = false;
  for (const row of data as { reason: string }[]) {
    const key = row.reason.slice(LEDGER_REASON_PREFIX.length);
    if (key && !granted.has(key)) {
      granted.add(key);
      changed = true;
    }
  }
  if (changed) persistGranted();
}

function ensureChild(): string {
  const childId = getActiveProgressChild();
  if (childId !== loadedChild) loadGranted(childId);
  return childId;
}

function awardKey(storyId: string, activity: CoinActivity, item: string | number | undefined) {
  return `${storyId}|${activity}|${item ?? "section"}`;
}

// ── Per-story session tally (drives section + story summaries) ──

let sessionStoryId: string | null = null;
let sessionTotals = new Map<CoinActivity, number>();
let sessionStartBalance = 0;

/** Called when a child starts (or resumes) a story. */
export function startCoinSession(storyId: string): void {
  ensureChild();
  sessionStoryId = storyId;
  sessionTotals = new Map();
  sessionStartBalance = getPaperPlanes();
}

/** Coins earned in this story session, optionally for one activity. */
export function getSessionCoins(activity?: CoinActivity): number {
  if (activity) return sessionTotals.get(activity) ?? 0;
  let total = 0;
  for (const value of sessionTotals.values()) total += value;
  return total;
}

/** Wallet balance before this story session began. */
export function getSessionStartBalance(): number {
  return sessionStartBalance;
}

// ── Awarding ──

export interface EarnOptions {
  storyId: string;
  activity: CoinActivity;
  /** Question index, word id, "section", … — makes the award key unique */
  item?: string | number;
  amount: number;
  /** Short child-facing note, e.g. "Question Time complete!" */
  label?: string;
  /** Element the coins came from, so the chip can fly from there */
  anchor?: Element | null;
}

export interface CoinEarnedDetail {
  amount: number;
  total: number;
  label?: string;
  activity: CoinActivity;
  from?: { x: number; y: number };
}

/**
 * Grant coins once for a learning action.
 * Returns the amount actually granted (0 when it was already earned).
 */
export function earnCoins({ storyId, activity, item, amount, label, anchor }: EarnOptions): number {
  if (!Number.isFinite(amount) || amount <= 0) return 0;

  ensureChild();
  const key = awardKey(storyId, activity, item);
  if (granted.has(key)) return 0;

  granted.add(key);
  persistGranted();

  const total = addCoins(amount, `${LEDGER_REASON_PREFIX}${key}`, storyId);

  if (sessionStoryId === storyId) {
    sessionTotals.set(activity, (sessionTotals.get(activity) ?? 0) + amount);
  }

  if (typeof window !== "undefined") {
    let from: { x: number; y: number } | undefined;
    if (anchor && typeof anchor.getBoundingClientRect === "function") {
      const rect = anchor.getBoundingClientRect();
      if (rect.width || rect.height) {
        from = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      }
    }
    const detail: CoinEarnedDetail = { amount, total, label, activity, from };
    window.dispatchEvent(new CustomEvent<CoinEarnedDetail>("storypros:coin-earned", { detail }));
  }

  return amount;
}

/** True when this exact award has already been collected. */
export function hasEarned(
  storyId: string,
  activity: CoinActivity,
  item?: string | number,
): boolean {
  ensureChild();
  return granted.has(awardKey(storyId, activity, item));
}
