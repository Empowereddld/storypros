/* ─────────────────────────────────────────────
 * Progress persistence service
 * Stores activity attempts and story completion.
 * Uses in-memory storage for now — Supabase later.
 * ───────────────────────────────────────────── */

import type { ActivityAttempt, PhaseResult } from "@/types/story";
import {
  calculateDomainScores,
  calculateOverallScore,
  type SkillDomain,
} from "./scoring";
import { awardBadge } from "./shop";

// ── In-memory store (replaced by Supabase later) ──

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
}

// Singleton store for the current session
let currentProgress: ChildProgress = {
  completions: [],
  attempts: [],
  paperPlanes: 0,
  currentLevel: 1,
  streak: 0,
};

/** Reset progress (for demo / onboarding) */
export function resetProgress(): void {
  currentProgress = {
    completions: [],
    attempts: [],
    paperPlanes: 0,
    currentLevel: 1,
    streak: 0,
  };
}

/** Record all attempts from a completed phase */
export function recordPhaseAttempts(attempts: ActivityAttempt[]): void {
  currentProgress.attempts.push(...attempts);
}

/** Record story completion with scoring */
export function recordStoryCompletion(
  storyId: string,
  phaseResults: PhaseResult[],
): StoryCompletion {
  const domainScores = calculateDomainScores(phaseResults);
  const overallScore = calculateOverallScore(domainScores);

  // Check for existing completion (replay)
  const existing = currentProgress.completions.find(
    (c) => c.storyId === storyId,
  );

  const completion: StoryCompletion = {
    storyId,
    completedAt: new Date().toISOString(),
    firstAttemptAccuracy: overallScore / 100,
    replayCount: existing ? existing.replayCount + 1 : 0,
    domainScores,
    overallScore,
  };

  if (existing) {
    // Keep both scores (Jinean's decision: show both, don't replace)
    currentProgress.completions.push(completion);
  } else {
    currentProgress.completions.push(completion);
  }

  // Award Paper Planes based on performance
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
        // Played yesterday → extend streak
        currentProgress.streak += 1;
      } else {
        // Missed a day → reset to 1
        currentProgress.streak = 1;
      }
    } else {
      // First ever play
      currentProgress.streak = 1;
    }
    currentProgress.lastPlayedDate = today;
  }
  // If already played today, streak stays the same

  // Check for level promotion
  checkLevelPromotion();

  // Check for badge milestones
  checkBadgeAwards(completion);

  return completion;
}

/** Calculate Paper Planes earned */
function calculatePaperPlanes(
  overallScore: number,
  isReplay: boolean,
): number {
  let base = 10; // base award for completing a story
  if (overallScore >= 90) base += 15; // mastery bonus
  else if (overallScore >= 70) base += 10;
  else if (overallScore >= 50) base += 5;

  if (isReplay) {
    // Diminishing returns on replay
    base = Math.floor(base * 0.5);
  }

  return base;
}

/** Get list of completed story IDs */
export function getCompletedStoryIds(): string[] {
  return [
    ...new Set(currentProgress.completions.map((c) => c.storyId)),
  ];
}

/** Get completion data for a specific story */
export function getStoryCompletions(storyId: string): StoryCompletion[] {
  return currentProgress.completions.filter((c) => c.storyId === storyId);
}

/** Get current progress snapshot */
export function getProgress(): ChildProgress {
  return { ...currentProgress };
}

/** Get total Paper Planes */
export function getPaperPlanes(): number {
  return currentProgress.paperPlanes;
}

/** Spend Paper Planes (shop purchases) */
export function spendPaperPlanes(amount: number): boolean {
  if (amount > currentProgress.paperPlanes) return false;
  currentProgress.paperPlanes -= amount;
  return true;
}

/** Set current level (for parent override) */
export function setCurrentLevel(level: number): void {
  currentProgress.currentLevel = level;
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
 *
 * Called after every story completion to see if
 * any new badges should be unlocked. Uses the
 * badge IDs from shop.ts catalog.
 * ───────────────────────────────────────────── */

function checkBadgeAwards(completion: StoryCompletion): void {
  const childId = "demo"; // single-child mock — Supabase will use real IDs

  const distinctStories = new Set(
    currentProgress.completions.map((c) => c.storyId),
  ).size;

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
  const allDomainsHigh = Object.values(completion.domainScores).every(
    (score) => score >= 90,
  );
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
 *
 * This matches the level-guide.md spec:
 *   - Sequence 6-picture stories independently
 *   - Answer all 6 comprehension questions correctly
 *   - Retell story with 5/6 elements present
 *   - Use 2-3 target vocabulary words
 *   - Complete "because" sentences correctly
 *   - Complete activities with minimal supports
 *
 * The 80% threshold captures these collectively.
 * ───────────────────────────────────────────── */

const MASTERY_THRESHOLD = 80;
const STORIES_REQUIRED = 5;

function checkLevelPromotion(): void {
  // Only auto-promote Level 1 → Level 2 for now
  if (currentProgress.currentLevel !== 1) return;

  // Get first-attempt completions for distinct stories
  const seen = new Set<string>();
  const firstAttempts: StoryCompletion[] = [];
  for (const c of currentProgress.completions) {
    if (!seen.has(c.storyId) && c.replayCount === 0) {
      seen.add(c.storyId);
      firstAttempts.push(c);
    }
  }

  if (firstAttempts.length < STORIES_REQUIRED) return;

  // Check the most recent N stories
  const recent = firstAttempts.slice(-STORIES_REQUIRED);
  const allMastered = recent.every(
    (c) => c.overallScore >= MASTERY_THRESHOLD,
  );

  if (allMastered) {
    currentProgress.currentLevel = 2;
  }
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

  