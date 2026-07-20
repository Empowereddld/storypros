/* ─────────────────────────────────────────────
 * Story data service
 * Loads story content — currently from local JSON,
 * will switch to Supabase once backend is wired.
 * ───────────────────────────────────────────── */

import type { StoryData } from "@/types/story";

import story01 from "../../content/story-01-dan-and-the-paper-cut.json";
import story02 from "../../content/story-02-darias-carnival-ticket.json";
import story03 from "../../content/story-03-dan-joins-the-game.json";
import story04 from "../../content/story-04-daria-and-the-puzzle-piece.json";
import story05 from "../../content/story-05-dan-and-darias-treasure-hunt.json";
import story06 from "../../content/story-06-the-kite-in-the-tree.json";
import story07 from "../../content/story-07-the-sandcastle-and-the-wave.json";
import story08 from "../../content/story-08-dan-talks-about-recess.json";
import story09 from "../../content/story-09-daria-asks-for-the-next-step.json";
import story10 from "../../content/story-10-dans-lunchroom-moment.json";
import story11 from "../../content/story-11-daria-asks-again.json";

// In-memory story cache (local JSON for now, Supabase later)
const ALL_STORIES = [
  story01,
  story02,
  story03,
  story04,
  story05,
  story06,
  story07,
  story08,
  story09,
  story10,
  story11,
] as unknown as StoryData[];

const STORIES: Record<string, StoryData> = Object.fromEntries(ALL_STORIES.map((s) => [s.id, s]));

/** Get a story by ID */
export function getStory(storyId: string): StoryData | null {
  return STORIES[storyId] ?? null;
}

/** Get all available stories */
export function getAllStories(): StoryData[] {
  return Object.values(STORIES);
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
export function isLevelComplete(level: number, completedStoryIds: string[]): boolean {
  const levelStoryIds = getStoryIds(level);
  return levelStoryIds.every((id) => completedStoryIds.includes(id));
}
