/* ─────────────────────────────────────────────
 * Library Screen
 * Browsable list of all stories with filters
 * by level, completion, and subscription status.
 * Accessed via the bottom nav "Library" tab.
 * ───────────────────────────────────────────── */

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { TactileButton } from "./TactileButton";
import { useAuth } from "@/contexts/AuthContext";
import { getAllStories, getStoriesByLevel } from "@/services/stories";
import { getCompletedStoryIds, getStarRating } from "@/services/progress";
import { canAccessStory, isPremium } from "@/services/subscription";
import type { StoryData } from "@/types/story";

interface LibraryScreenProps {
  onClose: () => void;
  onPlayStory: (storyId: string) => void;
}

type FilterTab = "all" | "in-progress" | "completed" | "locked";

// No "coming soon" placeholders — all 11 L1 stories are real content now

export function LibraryScreen({ onClose, onPlayStory }: LibraryScreenProps) {
  const { children, activeChild } = useAuth();
  const childId = activeChild?.id ?? children[0]?.id ?? "";

  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const completedIds = getCompletedStoryIds();
  const hasPremium = isPremium(childId);
  const allStories = getAllStories();

  // Build enriched story list from all real stories
  const enrichedStories = useMemo(() => {
    return allStories.map((story) => ({
      id: story.id,
      title: story.title,
      level: story.level,
      theme: story.theme,
      isCompleted: completedIds.includes(story.id),
      stars: getStarRating(story.id),
      isFree: canAccessStory(childId, story.id),
      isAvailable: true,
      isPremiumLocked: !canAccessStory(childId, story.id),
    }));
  }, [allStories, completedIds, childId, hasPremium]);

  // Apply filters
  const filteredStories = useMemo(() => {
    let list = enrichedStories;

    if (selectedLevel !== null) {
      list = list.filter((s) => s.level === selectedLevel);
    }

    switch (activeFilter) {
      case "completed":
        list = list.filter((s) => s.isCompleted);
        break;
      case "in-progress":
        list = list.filter((s) => s.isAvailable && !s.isCompleted);
        break;
      case "locked":
        list = list.filter((s) => !s.isAvailable || s.isPremiumLocked);
        break;
    }

    return list;
  }, [enrichedStories, activeFilter, selectedLevel]);

  // Stats
  const totalAvailable = enrichedStories.filter((s) => s.isAvailable).length;
  const totalCompleted = enrichedStories.filter((s) => s.isCompleted).length;

  // Available levels
  const levels = [...new Set(enrichedStories.map((s) => s.level))].sort();

  return (
    <div className="flex h-full flex-col bg-cream">
      {/* Header */}
      <header className="px-5 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-card text-primary"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="font-display text-xl font-extrabold text-primary">Story Library</h1>
            <p className="text-xs text-ink-soft font-semibold">
              {totalCompleted}/{totalAvailable} completed
            </p>
          </div>
          <div className="flex h-9 items-center gap-1.5 rounded-full bg-card px-3 shadow-card">
            <span className="text-sm">📖</span>
            <span className="text-sm font-extrabold text-primary">{totalAvailable}</span>
          </div>
        </div>

        {/* Level pills */}
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          <FilterPill
            label="All Levels"
            active={selectedLevel === null}
            onClick={() => setSelectedLevel(null)}
          />
          {levels.map((lvl) => (
            <FilterPill
              key={lvl}
              label={`Level ${lvl}`}
              active={selectedLevel === lvl}
              onClick={() => setSelectedLevel(lvl)}
            />
          ))}
        </div>

        {/* Filter tabs */}
        <div className="mt-3 flex rounded-2xl bg-card shadow-card p-1">
          {(
            [
              { key: "all", label: "All" },
              { key: "in-progress", label: "Available" },
              { key: "completed", label: "Done" },
              { key: "locked", label: "Locked" },
            ] as { key: FilterTab; label: string }[]
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={cn(
                "flex-1 rounded-xl py-2 text-xs font-bold transition-all",
                activeFilter === tab.key
                  ? "bg-primary text-primary-foreground shadow-[0_2px_0_0_var(--primary-deep)]"
                  : "text-ink-soft hover:text-primary",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Story list */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-3 pb-5 space-y-3">
        {filteredStories.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-16 text-center">
            <span className="text-5xl mb-4">📚</span>
            <p className="text-base font-bold text-primary">No stories here yet</p>
            <p className="text-sm text-ink-soft mt-1">
              {activeFilter === "completed"
                ? "Complete some stories to see them here!"
                : "Try a different filter."}
            </p>
          </div>
        ) : (
          filteredStories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onPlay={() => onPlayStory(story.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ── Story card ──

interface EnrichedStory {
  id: string;
  title: string;
  level: number;
  theme: string;
  isCompleted: boolean;
  stars: number;
  isFree: boolean;
  isAvailable: boolean;
  isPremiumLocked: boolean;
}

function StoryCard({ story, onPlay }: { story: EnrichedStory; onPlay: () => void }) {
  const themeIcons: Record<string, string> = {
    "with-friends": "👫",
    "adventures": "🗺️",
    "at-school": "🏫",
    "cause-effect": "🔗",
    "sequencing": "📋",
    "grammar": "✏️",
    "emotions": "💛",
    "problem-solving": "🧩",
    "vocabulary": "📖",
  };

  const icon = themeIcons[story.theme] ?? "📖";

  return (
    <div
      className={cn(
        "rounded-3xl bg-card shadow-card p-4 transition-all",
        !story.isAvailable && "opacity-60",
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl",
            story.isCompleted
              ? "bg-success/15"
              : story.isAvailable
                ? "bg-sky"
                : "bg-cream-deep",
          )}
        >
          {story.isCompleted ? "✅" : icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-primary leading-tight truncate">
              {story.title}
            </h3>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            {/* Level badge */}
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
              Level {story.level}
            </span>

            {/* Theme */}
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">
              {story.theme.replace(/-/g, " ")}
            </span>

            {/* Premium badge */}
            {story.isPremiumLocked && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-secondary/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-secondary-foreground">
                <CrownIcon /> Premium
              </span>
            )}
          </div>

          {/* Stars for completed */}
          {story.isCompleted && story.stars > 0 && (
            <div className="mt-1.5 flex gap-0.5">
              {[1, 2, 3].map((n) => (
                <svg
                  key={n}
                  viewBox="0 0 24 24"
                  className={cn("h-4 w-4", n <= story.stars ? "text-secondary" : "text-cream-deep")}
                  fill={n <= story.stars ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinejoin="round" d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.8-5.4 2.8 1-6L3 9.4l6.1-.9L12 3z" />
                </svg>
              ))}
            </div>
          )}
        </div>

        {/* Action button */}
        <div className="shrink-0">
          {story.isAvailable ? (
            <button
              onClick={onPlay}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-2xl transition-all active:scale-95",
                story.isCompleted
                  ? "bg-success/15 text-success"
                  : "bg-primary text-primary-foreground shadow-[0_3px_0_0_var(--primary-deep)]",
              )}
            >
              {story.isCompleted ? (
                <ReplayIcon />
              ) : (
                <PlayIcon />
              )}
            </button>
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cream-deep text-ink-soft/50">
              <LockIcon />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Small components ──

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap",
        active
          ? "bg-primary text-primary-foreground shadow-[0_2px_0_0_var(--primary-deep)]"
          : "bg-card text-ink-soft shadow-card hover:text-primary",
      )}
    >
      {label}
    </button>
  );
}

// ── Icons ──

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M8 5l12 7-12 7z" />
    </svg>
  );
}

function ReplayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M1 4v6h6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.51 15a9 9 0 105.64-8.36L1 10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" strokeLinecap="round" />
    </svg>
  );
}

function CrownIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
      <path d="M2 8l4 4 6-6 6 6 4-4-2 12H4L2 8z" />
    </svg>
  );
}
