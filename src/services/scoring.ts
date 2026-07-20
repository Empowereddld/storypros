/* ─────────────────────────────────────────────
 * Scoring service
 * Implements Jinean's must-complete scoring model.
 *
 * Domain weights (from Jinean's worksheet):
 *   Listening:       18 / 100
 *   Story Structure: 18 / 100
 *   Vocabulary:      18 / 100
 *   Grammar:         18 / 100
 *   Retell:          18 / 100  (dormant V1)
 *   Phonological:    10 / 100  (tracked separately)
 *
 * Listening sub-weights:
 *   Comprehension questions: 50%
 *   Brain checks:            30%
 *   Story slide engagement:  20%
 *
 * Grammar V1: 100% sentence builder
 * Vocabulary V1: 100% SFA quiz (intro not scored)
 * Phonological: tracked separately, 3–4 stories min
 * ───────────────────────────────────────────── */

import type { ActivityAttempt, SkillDomain, PhaseResult } from "@/types/story";
export type { SkillDomain, PhaseResult } from "@/types/story";

// ── Domain weights ──

const DOMAIN_WEIGHTS: Record<SkillDomain, number> = {
  listening: 18,
  story_structure: 18,
  vocabulary: 18,
  grammar: 18,
  retell: 18,
  phonological: 10,
};

// In V1, retell is dormant — redistribute its weight
const V1_ACTIVE_DOMAINS: SkillDomain[] = ["listening", "story_structure", "vocabulary", "grammar"];

/** Calculate first-attempt accuracy from a list of attempts */
export function firstAttemptAccuracy(attempts: ActivityAttempt[]): number {
  if (attempts.length === 0) return 0;
  const firstAttempts = attempts.filter((a) => a.attempt_number === 1);
  if (firstAttempts.length === 0) return 0;
  const correct = firstAttempts.filter((a) => a.is_correct).length;
  return correct / firstAttempts.length;
}

/** Calculate domain score from phase results */
export function calculateDomainScores(phaseResults: PhaseResult[]): Record<SkillDomain, number> {
  const scores: Record<SkillDomain, number> = {
    listening: 0,
    story_structure: 0,
    vocabulary: 0,
    grammar: 0,
    retell: 0,
    phonological: 0,
  };

  // Comprehension → Listening
  // V1: 100% comprehension first-attempt accuracy.
  // Jinean's full spec (comprehension 50% / brain checks 30% / slide engagement 20%)
  // is deferred to V2 — in V1 both brain checks and slide completion are
  // must-complete steps with no real signal, so weighting them granted every
  // child an automatic 50-point Listening floor and inflated parent reports.
  const compResult = phaseResults.find((r) => r.phase === "comprehension");
  scores.listening = compResult ? compResult.first_attempt_accuracy * 100 : 0;

  // Sequencing → Story Structure
  const seqResult = phaseResults.find((r) => r.phase === "sequencing");
  scores.story_structure = seqResult ? seqResult.first_attempt_accuracy * 100 : 0;

  // Vocab quiz → Vocabulary (100% in V1, SFA intro not scored)
  const vocabResult = phaseResults.find((r) => r.phase === "vocab-quiz");
  scores.vocabulary = vocabResult ? vocabResult.first_attempt_accuracy * 100 : 0;

  // Sentence builder → Grammar (100% in V1)
  const grammarResult = phaseResults.find((r) => r.phase === "sentence-builder");
  scores.grammar = grammarResult ? grammarResult.first_attempt_accuracy * 100 : 0;

  // Phonological — tracked separately
  const phonoResult = phaseResults.find((r) => r.phase === "phonological");
  scores.phonological = phonoResult ? phonoResult.first_attempt_accuracy * 100 : 0;

  // Retell — dormant in V1
  scores.retell = 0;

  return scores;
}

/** Calculate overall composite score (V1 — retell dormant) */
export function calculateOverallScore(domainScores: Record<SkillDomain, number>): number {
  const totalWeight = V1_ACTIVE_DOMAINS.reduce((sum, d) => sum + DOMAIN_WEIGHTS[d], 0);
  const weightedSum = V1_ACTIVE_DOMAINS.reduce(
    (sum, d) => sum + domainScores[d] * DOMAIN_WEIGHTS[d],
    0,
  );
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

/** Convert a numeric score (0–100) to parent-facing label */
export function scoreToLabel(score: number): "strength" | "growing" | "budding" | "needs_support" {
  if (score >= 85) return "strength";
  if (score >= 65) return "growing";
  if (score >= 40) return "budding";
  return "needs_support";
}

/** Parent-facing display text for a label */
export function labelToDisplayText(label: ReturnType<typeof scoreToLabel>): string {
  switch (label) {
    case "strength":
      return "Strength";
    case "growing":
      return "Growing area";
    case "budding":
      return "Budding skill";
    case "needs_support":
      return "Area where extra support helps right now";
  }
}

/** Check if onboarding assessment qualifies for Level 2 (90%+ first-attempt) */
export function qualifiesForLevel2(domainScores: Record<SkillDomain, number>): boolean {
  return V1_ACTIVE_DOMAINS.every((d) => domainScores[d] >= 90);
}
