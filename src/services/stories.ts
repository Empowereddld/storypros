/* ─────────────────────────────────────────────
 * Story data service
 * Loads story content — currently from local JSON,
 * will switch to Supabase once backend is wired.
 * ───────────────────────────────────────────── */

import type { StoryData } from "@/types/story";
import dansPapercut from "../../content/story-01-dans-papercut.json";

// In-memory story cache (local JSON for now, Supabase later)
const STORIES: Record<string, StoryData> = {
  "dans-papercut": dansPapercut as unknown as StoryData,
};

/** Get a story by ID */
export function getStory(storyId: string): StoryData | null {
  return STORIES[storyId] ?? null;
}

/** Get all stories for a given level */
export function getStoriesByLevel(level: number): StoryData[] {
  return Object.values(STORIES).filter((s) => s.level === level);
}

/** Get the list of story IDs available at a level */
export function getStoryIds(level: number): string[] {
  return getStoriesByLevel(level).map((s) => s.id);
}

/** Check if all stories at a level are completed */
export function isLevelComplete(
  level: number,
  completedStoryIds: string[],
): boolean {
  const levelStoryIds = getStoryIds(level);
  return levelStoryIds.every((id) => completedStoryIds.includes(id));
}
