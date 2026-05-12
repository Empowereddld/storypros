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

  // Update streak
  currentProgress.streak += 1;

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

/** Set current level (for parent override) */
export function setCurrentLevel(level: number): void {
  currentProgress.currentLevel = level;
}

/** Get current level */
export function getCurrentLevel(): number {
  return currentProgress.currentLevel;
}
