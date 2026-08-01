/* ─────────────────────────────────────────────
 * Progress persistence service
 * Cache-first hybrid:
 *   - localStorage = synchronous cache (per child)
 *   - Supabase (Lovable Cloud) = source of truth
 * Screens keep calling the synchronous getters;
 * hydration refreshes the cache on child switch
 * and emits "storypros:progress-updated".
 * ───────────────────────────────────────────── */

import type { ActivityAttempt, PhaseResult } from "@/types/story";
import { calculateDomainScores, calculateOverallScore, type SkillDomain } from "./scoring";
import { awardBadge } from "./shop";
import { db, isCloudId, logSyncError, emitDataUpdated } from "./cloud";

// ── In-memory store (cached in localStorage, synced to Supabase) ──

interface StoryCompletion {
  storyId: string;
  completedAt: string;
  firstAttemptAccuracy: number;
  replayCount: number;
  domainScores: Record<SkillDomain, number>;
  overallScore: number;
}

interface ChildProgress {
  completions: StoryCompletion[];
  attempts: ActivityAttempt[];
  paperPlanes: number;
  currentLevel: number;
  streak: number;
  /** ISO date string of last story completion (for streak tracking) */
  lastPlayedDate?: string;
  /** Every YYYY-MM-DD the child completed a story on (drives the week strip) */
  playedDates?: string[];
}

// ── localStorage persistence (scoped per child) ──

const LEGACY_PROGRESS_KEY = "storypros_progress";

/** The child whose progress is currently loaded. "demo" until auth sets a real ID. */
let activeChildId = "demo";

function progressKey(): string {
  return `${LEGACY_PROGRESS_KEY}_${activeChildId}`;
}

function emptyProgress(): ChildProgress {
  return {
    completions: [],
    attempts: [],
    paperPlanes: 0,
    currentLevel: 1,
    streak: 0,
    playedDates: [],
  };
}

function loadProgress(): ChildProgress {
  try {
    const raw = localStorage.getItem(progressKey());
    if (raw) return JSON.parse(raw);

    // One-time migration: adopt legacy single-child data for the first real
    // child that loads, then remove it so other children don't inherit it.
    // Skipped for the "demo" placeholder — that's the id this module starts
    // with before AuthContext resolves the real child, and migrating under
    // it would orphan the legacy data away from whichever child actually
    // owns it once auth catches up.
    if (activeChildId === "demo") return emptyProgress();

    const legacy = localStorage.getItem(LEGACY_PROGRESS_KEY);
    if (legacy) {
      localStorage.setItem(progressKey(), legacy);
      localStorage.removeItem(LEGACY_PROGRESS_KEY);
      return JSON.parse(legacy);
    }
  } catch {
    /* ignore */
  }
  return emptyProgress();
}

function saveProgress(): void {
  try {
    localStorage.setItem(progressKey(), JSON.stringify(currentProgress));
  } catch {
    /* ignore */
  }
}

// Singleton store — now hydrated from localStorage on load
let currentProgress: ChildProgress = loadProgress();

/**
 * Switch the progress store to a different child.
 * Called by AuthContext whenever the active child changes.
 * Loads the local cache immediately, then refreshes it
 * from the cloud in the background.
 */
export function setActiveProgressChild(childId: string | null | undefined): void {
  const next = childId ?? "demo";
  if (next === activeChildId) return;
  activeChildId = next;
  currentProgress = loadProgress();
  void hydrateProgressFromCloud(next);
}

/** The child ID progress is currently scoped to */
export function getActiveProgressChild(): string {
  return activeChildId;
}

// ── Cloud hydration ──

interface CompletionRow {
  story_id: string;
  completed_at: string;
  first_attempt_accuracy: number | null;
  replay_count: number | null;
  domain_scores: Record<string, number> | null;
  overall_score: number | null;
}

interface StreakRow {
  streak_date: string;
}

/**
 * Pull the child's progress from Supabase and replace the local cache.
 * No-op for demo children (non-UUID ids). Safe to call repeatedly.
 */
export async function hydrateProgressFromCloud(childId: string): Promise<void> {
  if (!isCloudId(childId)) return;
  try {
    const [completionsRes, planesRes, streaksRes, childRes] = await Promise.all([
      db
        .from("story_completions")
        .select(
          "story_id, completed_at, first_attempt_accuracy, replay_count, domain_scores, overall_score",
        )
        .eq("child_id", childId)
        .order("completed_at", { ascending: true }),
      db.rpc("get_paper_planes", { p_child_id: childId }),
      db
        .from("daily_streaks")
        .select("streak_date")
        .eq("child_id", childId)
        .order("streak_date", { ascending: false })
        .limit(60),
      db.from("children").select("current_level").eq("id", childId).maybeSingle(),
    ]);

    if (completionsRes.error) throw completionsRes.error;

    const completions: StoryCompletion[] = ((completionsRes.data ?? []) as CompletionRow[]).map(
      (r) => ({
        storyId: r.story_id,
        completedAt: r.completed_at,
        firstAttemptAccuracy: r.first_attempt_accuracy ?? 0,
        replayCount: r.replay_count ?? 0,
        domainScores: (r.domain_scores ?? {}) as Record<SkillDomain, number>,
        overallScore: r.overall_score ?? 0,
      }),
    );

    // Reconstruct the current streak from daily_streaks rows
    const dates = ((streaksRes.data ?? []) as StreakRow[]).map((r) => r.streak_date);
    const { streak, lastPlayedDate } = computeStreak(dates);

    const hydrated: ChildProgress = {
      completions,
      // Attempt-level rows stay cloud-side (used for analytics); the local
      // cache only holds attempts from the current session.
      attempts: [],
      paperPlanes: typeof planesRes.data === "number" ? planesRes.data : 0,
      currentLevel: childRes.data?.current_level ?? 1,
      streak,
      lastPlayedDate,
      playedDates: [...new Set(dates)].sort(),
    };

    // Only apply if the user hasn't switched children mid-flight
    if (activeChildId === childId) {
      currentProgress = hydrated;
      saveProgress();
      emitDataUpdated("progress");
    }
  } catch (err) {
    logSyncError("hydrate progress")(err);
  }
}

/** Compute current consecutive-day streak from played dates (desc order ok) */
function computeStreak(playedDates: string[]): {
  streak: number;
  lastPlayedDate?: string;
} {
  if (playedDates.length === 0) return { streak: 0 };
  const days = [...new Set(playedDates)].sort().reverse(); // newest first
  const lastPlayedDate = days[0];

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  // Streak is alive only if last play was today or yesterday
  if (lastPlayedDate !== today && lastPlayedDate !== yesterday) {
    return { streak: 0, lastPlayedDate };
  }

  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const expected = new Date(new Date(days[i - 1] + "T00:00:00Z").getTime() - 86400000)
      .toISOString()
      .slice(0, 10);
    if (days[i] === expected) streak++;
    else break;
  }
  return { streak, lastPlayedDate };
}

// ── Seeding / reset (demo accounts) ──

/** Reload progress from localStorage (useful after demo seed) */
export function reloadProgress(): void {
  currentProgress = loadProgress();
}

/** Seed progress directly (for demo accounts) */
export function seedProgress(data: Partial<ChildProgress>): void {
  currentProgress = { ...currentProgress, ...data };
  saveProgress();
}

/** Reset progress (for demo / onboarding) */
export function resetProgress(): void {
  currentProgress = emptyProgress();
  saveProgress();
}

// ── Recording ──

/** Record all attempts from a completed phase */
export function recordPhaseAttempts(attempts: ActivityAttempt[]): void {
  currentProgress.attempts.push(...attempts);
  saveProgress();

  // Write-through to the cloud (only for real children)
  const cloudRows = attempts
    .filter((a) => isCloudId(a.child_id))
    .map((a) => ({
      child_id: a.child_id,
      story_id: a.story_id,
      activity_type: a.activity_type,
      question_index: a.question_index,
      attempt_number: a.attempt_number,
      selected_option: a.selected_option,
      is_correct: a.is_correct,
      time_ms: a.time_ms,
    }));
  if (cloudRows.length > 0) {
    void db
      .from("activity_attempts")
      .insert(cloudRows)
      .then(({ error }) => {
        if (error) logSyncError("insert attempts")(error);
      });
  }
}

/** Record story completion with scoring */
export function recordStoryCompletion(
  storyId: string,
  phaseResults: PhaseResult[],
): StoryCompletion {
  const domainScores = calculateDomainScores(phaseResults);
  const overallScore = calculateOverallScore(domainScores);

  // Check for existing completion (replay)
  const existing = currentProgress.completions.find((c) => c.storyId === storyId);

  const completion: StoryCompletion = {
    storyId,
    completedAt: new Date().toISOString(),
    firstAttemptAccuracy: overallScore / 100,
    replayCount: existing ? existing.replayCount + 1 : 0,
    domainScores,
    overallScore,
  };

  // Keep both scores on replay (Jinean's decision: show both, don't replace)
  currentProgress.completions.push(completion);

  // Award Coins based on performance
  const planesEarned = calculatePaperPlanes(overallScore, !!existing);
  currentProgress.paperPlanes += planesEarned;

  // Update streak (tracks consecutive days, not consecutive stories)
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  if (currentProgress.lastPlayedDate !== today) {
    const lastDate = currentProgress.lastPlayedDate;
    if (lastDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);
      if (lastDate === yesterdayStr) {
        currentProgress.streak += 1;
      } else {
        currentProgress.streak = 1;
      }
    } else {
      currentProgress.streak = 1;
    }
    currentProgress.lastPlayedDate = today;
  }
  const played = currentProgress.playedDates ?? [];
  if (!played.includes(today)) {
    currentProgress.playedDates = [...played, today].sort();
  }

  // Check for level promotion
  const promoted = checkLevelPromotion();

  // Check for badge milestones
  checkBadgeAwards(completion);

  saveProgress();

  // ── Write-through to the cloud ──
  if (isCloudId(activeChildId)) {
    void syncCompletionToCloud(activeChildId, completion, planesEarned, promoted);
  }

  return completion;
}

/** Push a completion (and its side effects) to Supabase */
async function syncCompletionToCloud(
  childId: string,
  completion: StoryCompletion,
  planesEarned: number,
  promoted: boolean,
): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);

  // 1. Append-only completion history
  db.from("story_completions")
    .insert({
      child_id: childId,
      story_id: completion.storyId,
      completed_at: completion.completedAt,
      first_attempt_accuracy: completion.firstAttemptAccuracy,
      replay_count: completion.replayCount,
      domain_scores: completion.domainScores,
      overall_score: completion.overallScore,
    })
    .then(({ error }) => {
      if (error) logSyncError("insert completion")(error);
    });

  // 2. Per-story summary row (used by SLP caseload function)
  db.from("story_progress")
    .upsert(
      {
        child_id: childId,
        story_id: completion.storyId,
        completed: true,
        completed_at: completion.completedAt,
        first_attempt_accuracy: completion.firstAttemptAccuracy,
        replay_count: completion.replayCount,
      },
      { onConflict: "child_id,story_id" },
    )
    .then(({ error }) => {
      if (error) logSyncError("upsert story_progress")(error);
    });

  // 3. Coins ledger (append-only)
  if (planesEarned > 0) {
    db.from("coins_ledger")
      .insert({
        child_id: childId,
        amount: planesEarned,
        reason: "story_completion",
        story_id: completion.storyId,
      })
      .then(({ error }) => {
        if (error) logSyncError("insert coins")(error);
      });
  }

  // 4. Daily streak row
  db.from("daily_streaks")
    .select("id, stories_completed")
    .eq("child_id", childId)
    .eq("streak_date", today)
    .maybeSingle()
    .then(({ data, error }) => {
      if (error) return logSyncError("read streak")(error);
      const upsert = data
        ? db
            .from("daily_streaks")
            .update({ stories_completed: (data.stories_completed ?? 0) + 1 })
            .eq("id", data.id)
        : db.from("daily_streaks").insert({
            child_id: childId,
            streak_date: today,
            stories_completed: 1,
          });
      upsert.then(({ error: e }) => {
        if (e) logSyncError("write streak")(e);
      });
    });

  // 5. Rolling per-domain skill scores (first attempts only)
  const firstAttempts = currentProgress.completions.filter((c) => c.replayCount === 0);
  const domains = Object.keys(completion.domainScores) as SkillDomain[];
  const scoreRows = domains.map((domain) => {
    const scores = firstAttempts
      .map((c) => c.domainScores[domain])
      .filter((s) => typeof s === "number");
    const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    return {
      child_id: childId,
      domain,
      score: Math.round(avg * 10) / 10,
      stories_counted: scores.length,
      updated_at: new Date().toISOString(),
    };
  });
  db.from("skill_scores")
    .upsert(scoreRows, { onConflict: "child_id,domain" })
    .then(({ error }) => {
      if (error) logSyncError("upsert skill_scores")(error);
    });

  // 6. Level promotion
  if (promoted) {
    db.from("children")
      .update({ current_level: currentProgress.currentLevel })
      .eq("id", childId)
      .then(({ error }) => {
        if (error) logSyncError("update level")(error);
      });
  }
}

/** Calculate Coins earned */
function calculatePaperPlanes(overallScore: number, isReplay: boolean): number {
  let base = 10; // base award for completing a story
  if (overallScore >= 90)
    base += 15; // mastery bonus
  else if (overallScore >= 70) base += 10;
  else if (overallScore >= 50) base += 5;

  if (isReplay) {
    // Diminishing returns on replay
    base = Math.floor(base * 0.5);
  }

  return base;
}

// ── Getters (synchronous, read the cache) ──

/** Get list of completed story IDs */
export function getCompletedStoryIds(): string[] {
  return [...new Set(currentProgress.completions.map((c) => c.storyId))];
}

/** Get completion data for a specific story */
export function getStoryCompletions(storyId: string): StoryCompletion[] {
  return currentProgress.completions.filter((c) => c.storyId === storyId);
}

/** Get current progress snapshot */
export function getProgress(): ChildProgress {
  return { ...currentProgress };
}

/** Get total Coins */
export function getPaperPlanes(): number {
  return currentProgress.paperPlanes;
}

/** Spend Coins (shop purchases) */
export function spendPaperPlanes(amount: number, reason = "shop_purchase"): boolean {
  if (amount > currentProgress.paperPlanes) return false;
  currentProgress.paperPlanes -= amount;
  saveProgress();

  if (isCloudId(activeChildId)) {
    void db
      .from("coins_ledger")
      .insert({ child_id: activeChildId, amount: -amount, reason })
      .then(({ error }) => {
        if (error) logSyncError("spend coins")(error);
      });
  }
  return true;
}

/** Set current level (for parent override / assessment placement) */
export function setCurrentLevel(level: number): void {
  currentProgress.currentLevel = level;
  saveProgress();

  if (isCloudId(activeChildId)) {
    void db
      .from("children")
      .update({ current_level: level })
      .eq("id", activeChildId)
      .then(({ error }) => {
        if (error) logSyncError("set level")(error);
      });
  }
}

/** Get current level */
export function getCurrentLevel(): number {
  return currentProgress.currentLevel;
}

/** Get all completions (for parent dashboard) */
export function getAllCompletions(): StoryCompletion[] {
  return [...currentProgress.completions];
}

/* ─────────────────────────────────────────────
 * Badge Awards — Milestone Checking
 * ───────────────────────────────────────────── */

function checkBadgeAwards(completion: StoryCompletion): void {
  const childId = activeChildId; // set by AuthContext via setActiveProgressChild

  const distinctStories = new Set(currentProgress.completions.map((c) => c.storyId)).size;

  // First Flight — complete 1 story
  if (distinctStories >= 1) {
    awardBadge(childId, "badge-first-story");
  }

  // Frequent Flyer — complete 3 stories
  if (distinctStories >= 3) {
    awardBadge(childId, "badge-3-stories");
  }

  // Perfect Landing — 100% on any story (use >= 95 to be forgiving)
  if (completion.overallScore >= 95) {
    awardBadge(childId, "badge-perfect");
  }

  // Five Day Streak
  if (currentProgress.streak >= 5) {
    awardBadge(childId, "badge-5-streak");
  }

  // Story Master — all domains above 90% on this story
  const allDomainsHigh = Object.values(completion.domainScores).every((score) => score >= 90);
  if (allDomainsHigh) {
    awardBadge(childId, "badge-all-elements");
  }

  // Level Up! — reached Level 2
  if (currentProgress.currentLevel >= 2) {
    awardBadge(childId, "badge-level-2");
  }

  // Story Explorer — completed all 11 Level 1 stories
  if (distinctStories >= 11) {
    awardBadge(childId, "badge-all-stories");
  }
}

/* ─────────────────────────────────────────────
 * Level Promotion — Mastery Criteria
 *
 * A child advances from Level 1 → Level 2 when
 * they consistently achieve 80%+ overall score
 * across 5 distinct stories (first attempts only).
 * ───────────────────────────────────────────── */

const MASTERY_THRESHOLD = 80;
const STORIES_REQUIRED = 5;

/** Returns true if a promotion happened */
function checkLevelPromotion(): boolean {
  // Only auto-promote Level 1 → Level 2 for now
  if (currentProgress.currentLevel !== 1) return false;

  // Get first-attempt completions for distinct stories
  const seen = new Set<string>();
  const firstAttempts: StoryCompletion[] = [];
  for (const c of currentProgress.completions) {
    if (!seen.has(c.storyId) && c.replayCount === 0) {
      seen.add(c.storyId);
      firstAttempts.push(c);
    }
  }

  if (firstAttempts.length < STORIES_REQUIRED) return false;

  // Check the most recent N stories
  const recent = firstAttempts.slice(-STORIES_REQUIRED);
  const allMastered = recent.every((c) => c.overallScore >= MASTERY_THRESHOLD);

  if (allMastered) {
    currentProgress.currentLevel = 2;
    return true;
  }
  return false;
}

/* ─────────────────────────────────────────────
 * Mastery Progress — for UI display
 * ───────────────────────────────────────────── */
export function getMasteryProgress(): {
  storiesMastered: number;
  storiesRequired: number;
  ready: boolean;
} {
  const seen = new Set<string>();
  let mastered = 0;
  for (const c of currentProgress.completions) {
    if (!seen.has(c.storyId) && c.replayCount === 0) {
      seen.add(c.storyId);
      if (c.overallScore >= MASTERY_THRESHOLD) mastered++;
    }
  }
  const capped = Math.min(mastered, STORIES_REQUIRED);
  return {
    storiesMastered: capped,
    storiesRequired: STORIES_REQUIRED,
    ready: capped >= STORIES_REQUIRED,
  };
}

/* ─────────────────────────────────────────────
 * Star Rating — 0-3 stars based on best score
 * ───────────────────────────────────────────── */
export function getStarRating(storyId: string): number {
  const completions = currentProgress.completions.filter((c) => c.storyId === storyId);
  if (completions.length === 0) return 0;
  const best = Math.max(...completions.map((c) => c.overallScore));
  if (best >= 90) return 3;
  if (best >= 70) return 2;
  if (best >= 50) return 1;
  return 0;
}
