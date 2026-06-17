/* ─────────────────────────────────────────────
 * Story checkpoints — pause/resume mid-story
 *
 * A story has 13 phases (~45+ minutes for some kids).
 * After every completed phase we save a checkpoint so
 * a closed tab, dead battery, or interrupted session
 * resumes at the start of the next phase instead of
 * restarting the whole story.
 *
 * Device-local (localStorage) by design: the common
 * failure is the same device losing the session.
 * Checkpoints expire after 7 days and are cleared on
 * story completion or an explicit "start over".
 * ───────────────────────────────────────────── */

import type { PhaseResult } from "@/types/story";

const CHECKPOINT_PREFIX = "storypros_checkpoint";
const CHECKPOINT_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface StoryCheckpoint {
  storyId: string;
  childId: string;
  /** Index into the engine's PHASE_ORDER — the next phase to play */
  phaseIndex: number;
  /** Results from the phases completed so far */
  phaseResults: PhaseResult[];
  savedAt: string; // ISO
}

function key(childId: string, storyId: string): string {
  return `${CHECKPOINT_PREFIX}_${childId}_${storyId}`;
}

/** Save (overwrite) the checkpoint for a child + story */
export function saveCheckpoint(
  childId: string,
  storyId: string,
  phaseIndex: number,
  phaseResults: PhaseResult[],
): void {
  try {
    const checkpoint: StoryCheckpoint = {
      storyId,
      childId,
      phaseIndex,
      phaseResults,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(key(childId, storyId), JSON.stringify(checkpoint));
  } catch { /* storage full or unavailable — resume is best-effort */ }
}

/** Get a valid (non-expired, mid-story) checkpoint, or null */
export function getCheckpoint(
  childId: string,
  storyId: string,
): StoryCheckpoint | null {
  try {
    const raw = localStorage.getItem(key(childId, storyId));
    if (!raw) return null;
    const checkpoint = JSON.parse(raw) as StoryCheckpoint;

    // Expired?
    const age = Date.now() - new Date(checkpoint.savedAt).getTime();
    if (Number.isNaN(age) || age > CHECKPOINT_MAX_AGE_MS) {
      clearCheckpoint(childId, storyId);
      return null;
    }

    // Only meaningful if at least one phase was completed
    if (!checkpoint.phaseIndex || checkpoint.phaseIndex < 1) return null;

    return checkpoint;
  } catch {
    return null;
  }
}

/** Remove the checkpoint (story finished or restarted) */
export function clearCheckpoint(childId: string, storyId: string): void {
  try {
    localStorage.removeItem(key(childId, storyId));
  } catch { /* ignore */ }
}
