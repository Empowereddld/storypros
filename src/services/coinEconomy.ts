/* ─────────────────────────────────────────────
 * Story Pros coin economy — single source of truth
 *
 * One fully completed story has a maximum earning
 * potential of 100 coins:
 *
 *   Read & Listen ................  5
 *   Question Time / Comprehension  30   (6 × 4 + 6)
 *   Sequencing ................... 15   (6 × 2 + 3)
 *   Story Words / Vocabulary ..... 15   (3 × 4 + 3)
 *   Sentences .................... 10   (≈9 responses + 1)
 *   Jokes ........................  5
 *   Sounds .......................  5
 *   Retell (immediate + delayed) . 10   (5 + 5)
 *   Finishing the whole story ....  5
 *   ------------------------------------------
 *   Maximum per story ........... 100
 *
 * Coins are only ever added. Mistakes never remove
 * coins; supported success earns a slightly smaller
 * amount than first-attempt success.
 * ───────────────────────────────────────────── */

export type CoinActivity =
  | "read-listen"
  | "comprehension"
  | "sequencing"
  | "vocabulary"
  | "sentences"
  | "jokes"
  | "sounds"
  | "immediate-retell"
  | "delayed-retell"
  | "story-complete";

export const COIN_ECONOMY = {
  "read-listen": {
    label: "Read & Listen",
    completion: 5,
    max: 5,
  },
  comprehension: {
    label: "Question Time",
    first: 4,
    retry: 3,
    scaffold: 2,
    completion: 6,
    max: 30,
  },
  sequencing: {
    label: "Put It in Order",
    first: 2,
    supported: 1,
    completion: 3,
    max: 15,
  },
  vocabulary: {
    label: "Story Words",
    perWord: 4,
    first: 2,
    retry: 1,
    completion: 3,
    max: 15,
  },
  sentences: {
    label: "Sentences",
    /** Coins shared across all sentence responses (normalized per story) */
    responsePool: 9,
    completion: 1,
    max: 10,
  },
  jokes: {
    label: "Word Play",
    completion: 5,
    max: 5,
  },
  sounds: {
    label: "Sound Play",
    completion: 5,
    max: 5,
  },
  "immediate-retell": {
    label: "Tell the Story",
    completion: 5,
    max: 5,
  },
  "delayed-retell": {
    label: "Tell It Again",
    completion: 5,
    max: 5,
  },
  "story-complete": {
    label: "Story finished",
    completion: 5,
    max: 5,
  },
} as const;

/** Maximum coins available from a standard full story (100). */
export const MAX_STORY_COINS = Object.values(COIN_ECONOMY).reduce((sum, a) => sum + a.max, 0);

/**
 * Coins for an item with objective right/wrong answers.
 * attempt 1 = independent success, 2 = success after a retry,
 * 3+ = success after extra scaffolding/support.
 */
export function tieredAward(
  attemptNumber: number,
  tiers: { first: number; retry: number; scaffold: number },
): number {
  if (attemptNumber <= 1) return tiers.first;
  if (attemptNumber === 2) return tiers.retry;
  return tiers.scaffold;
}

/** Comprehension: 4 / 3 / 2 by attempt number. */
export function comprehensionAward(attemptNumber: number): number {
  const c = COIN_ECONOMY.comprehension;
  return tieredAward(attemptNumber, { first: c.first, retry: c.retry, scaffold: c.scaffold });
}

/** Sequencing: 2 per event placed correctly first time, 1 after correction. */
export function sequencingAward(attemptNumber: number): number {
  const s = COIN_ECONOMY.sequencing;
  return attemptNumber <= 1 ? s.first : s.supported;
}

/** Story Words quiz: 2 for a correct answer first time, 1 after a retry. */
export function vocabularyAward(attemptNumber: number): number {
  const v = COIN_ECONOMY.vocabulary;
  return attemptNumber <= 1 ? v.first : v.retry;
}

/**
 * Sentences normalize to the same 9-coin response pool no matter how many
 * sentence frames a story contains, so the section always caps at 10.
 */
export function sentenceAward(attemptNumber: number, frameCount: number): number {
  const pool = COIN_ECONOMY.sentences.responsePool;
  const first = Math.max(1, Math.round(pool / Math.max(1, frameCount)));
  return tieredAward(attemptNumber, {
    first,
    retry: Math.max(1, Math.round((first * 2) / 3)),
    scaffold: Math.max(1, Math.round(first / 3)),
  });
}
