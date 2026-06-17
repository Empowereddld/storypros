/* ─────────────────────────────────────────────
 * Continue-story resolver
 *
 * Powers the Home "Continue your adventure" card.
 * Resolves, for the active child:
 *   1. an in-progress story (has a saved checkpoint), or
 *   2. the next not-yet-completed story at the current level, or
 *   3. (everything done) the first story, to replay.
 *
 * Returns enough to render the card: title, theme/genre,
 * how far along, and whether it's locked behind premium.
 * ───────────────────────────────────────────── */

import type { StoryData } from "@/types/story";
import { getCheckpoint } from "./checkpoint";
import { getStoriesByLevel } from "./stories";
import { getCompletedStoryIds, getCurrentLevel } from "./progress";
import { canAccessStory } from "./subscription";

/**
 * Playable phases before the (non-interactive) "story-complete" step.
 * Mirrors PHASE_ORDER in phases/StoryEngine.tsx (13 phases, last is
 * story-complete → 12 playable). Kept here to avoid importing the
 * phase UI module into the service layer.
 */
export const TOTAL_PLAYABLE_PHASES = 12;

export interface ContinueInfo {
  story: StoryData;
  status: "in-progress" | "not-started" | "replay";
  /** Checkpoint phase index (next phase to play); 0 if not started */
  phaseIndex: number;
  totalPhases: number;
  /** 0–100 */
  percent: number;
  locked: boolean;
}

export function getContinueStory(childId: string): ContinueInfo | null {
  const level = getCurrentLevel();
  const stories = getStoriesByLevel(level);
  if (stories.length === 0) return null;

  const completed = new Set(getCompletedStoryIds());

  // 1) In-progress (earliest story with a live checkpoint)
  if (childId) {
    for (const story of stories) {
      if (completed.has(story.id)) continue;
      const cp = getCheckpoint(childId, story.id);
      if (cp) {
        const phaseIndex = Math.min(cp.phaseIndex, TOTAL_PLAYABLE_PHASES);
        return {
          story,
          status: "in-progress",
          phaseIndex,
          totalPhases: TOTAL_PLAYABLE_PHASES,
          percent: Math.round((phaseIndex / TOTAL_PLAYABLE_PHASES) * 100),
          locked: !canAccessStory(childId, story.id),
        };
      }
    }
  }

  // 2) Next not-started story
  for (const story of stories) {
    if (!completed.has(story.id)) {
      return {
        story,
        status: "not-started",
        phaseIndex: 0,
        totalPhases: TOTAL_PLAYABLE_PHASES,
        percent: 0,
        locked: childId ? !canAccessStory(childId, story.id) : false,
      };
    }
  }

  // 3) All complete → offer the first story to replay
  const first = stories[0];
  return {
    story: first,
    status: "replay",
    phaseIndex: 0,
    totalPhases: TOTAL_PLAYABLE_PHASES,
    percent: 0,
    locked: childId ? !canAccessStory(childId, first.id) : false,
  };
}

/** "with-friends" → "With Friends" for the genre chip */
export function prettifyTheme(theme: string): string {
  return theme
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
