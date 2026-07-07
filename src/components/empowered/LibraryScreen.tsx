/* ─────────────────────────────────────────────
 * Story Library — browse the full catalog
 * Rebuilt from the "Story Library" mockup: a grid of
 * every story showing its real state (completed with
 * stars, in-progress %, or locked / premium), with
 * filters and the shared bottom nav.
 * ───────────────────────────────────────────── */

import { useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getAllStories } from "@/services/stories";
import { getCompletedStoryIds, getStarRating, getPaperPlanes } from "@/services/progress";
import { canAccessStory } from "@/services/subscription";
import { getCheckpoint } from "@/services/checkpoint";
import { TOTAL_PLAYABLE_PHASES, prettifyTheme } from "@/services/continueStory";
import { cn } from "@/lib/utils";
import { AppBottomNav, CurrencyBadge, StarIcon } from "./StoryProsUi";
import { StoryProsLogo, LockIcon } from "./StoryProsBrand";

interface LibraryScreenProps {
  onNavigate: (destination: string, storyId?: string) => void;
}

type FilterTab = "all" | "completed" | "in-progress" | "locked";

const EMOJIS = ["📄", "🎪", "⚽", "🧩", "🗺️", "🪁", "🏖️", "🏫", "📐", "🍽️", "🔁"];
const COVERS = [
  "from-accent to-sky",
  "from-secondary/40 to-secondary/15",
  "from-success/30 to-success/12",
  "from-coral/30 to-coral/12",
  "from-primary/25 to-accent",
  "from-sky to-accent/60",
];

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "completed", label: "Completed" },
  { key: "in-progress", label: "In Progress" },
  { key: "locked", label: "Locked" },
];

interface CardStory {
  id: string;
  title: string;
  theme: string;
  emoji: string;
  cover: string;
  num: number;
  isCompleted: boolean;
  inProgress: boolean;
  percent: number;
  locked: boolean;
  stars: number;
}

export function LibraryScreen({ onNavigate }: LibraryScreenProps) {
  const { activeChild, children } = useAuth();
  const childId = activeChild?.id ?? children[0]?.id ?? "";
  const [filter, setFilter] = useState<FilterTab>("all");

  const planes = getPaperPlanes();

  const stories = useMemo<CardStory[]>(() => {
    const completed = new Set(getCompletedStoryIds());
    return getAllStories().map((s, i) => {
      const isCompleted = completed.has(s.id);
      const cp = !isCompleted && childId ? getCheckpoint(childId, s.id) : null;
      const percent = cp
        ? Math.round((Math.min(cp.phaseIndex, TOTAL_PLAYABLE_PHASES) / TOTAL_PLAYABLE_PHASES) * 100)
        : 0;
      return {
        id: s.id,
        title: s.title,
        theme: s.theme,
        emoji: EMOJIS[i % EMOJIS.length],
        cover: COVERS[i % COVERS.length],
        num: i + 1,
        isCompleted,
        inProgress: !!cp,
        percent,
        locked: childId ? !canAccessStory(childId, s.id) : false,
        stars: isCompleted ? getStarRating(s.id) : 0,
      };
    });
  }, [childId]);

  const filtered = useMemo(() => {
    switch (filter) {
      case "completed":
        return stories.filter((s) => s.isCompleted);
      case "in-progress":
        return stories.filter((s) => s.inProgress && !s.isCompleted);
      case "locked":
        return stories.filter((s) => s.locked && !s.isCompleted);
      default:
        return stories;
    }
  }, [stories, filter]);

  const completedCount = stories.filter((s) => s.isCompleted).length;

  return (
    <div className="relative flex h-full flex-col bg-background">
      <header className="sticky top-0 z-30 flex items-center justify-between bg-card/95 px-4 py-3 backdrop-blur">
        <StoryProsLogo layout="row" size="sm" />
        <CurrencyBadge count={planes} onClick={() => onNavigate("shop")} />
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-28 pt-2">
        <h1 className="text-2xl font-extrabold text-primary">Story Library</h1>
        <p className="mt-0.5 text-sm text-ink-soft">
          Stories that inspire imagination and build confidence.
        </p>

        {/* Filters */}
        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-sm font-bold transition-all",
                filter === t.key
                  ? "bg-primary text-primary-foreground"
                  : "border border-accent bg-card text-ink-soft hover:text-primary",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <p className="mt-3 text-xs font-bold uppercase tracking-wider text-ink-soft/70">
          {completedCount} of {stories.length} stories completed
        </p>

        {filtered.length === 0 ? (
          <div className="mt-10 flex flex-col items-center text-center">
            <span className="text-4xl">📚</span>
            <p className="mt-2 text-sm font-semibold text-ink-soft">
              {filter === "completed"
                ? "No finished stories yet — pick one to begin!"
                : filter === "in-progress"
                  ? "Nothing in progress right now."
                  : "No stories here."}
            </p>
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-3 stagger-in">
            {filtered.map((s) => (
              <StoryCard key={s.id} story={s} onOpen={() => onNavigate("story", s.id)} />
            ))}
          </div>
        )}
      </div>

      <AppBottomNav active="library" onNavigate={onNavigate} />
    </div>
  );
}

function StoryCard({ story, onOpen }: { story: CardStory; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="hover-lift flex flex-col overflow-hidden rounded-3xl border border-accent/50 bg-card text-left shadow-card active:scale-[0.98]"
    >
      <div className={cn("relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br", story.cover)}>
        <span className="text-4xl drop-shadow-sm">{story.emoji}</span>

        {story.isCompleted ? (
          <Badge className="bg-success text-white">
            <CheckIcon /> Done
          </Badge>
        ) : story.inProgress ? (
          <Badge className="bg-primary text-white">{story.percent}%</Badge>
        ) : story.locked ? (
          <Badge className="bg-ink/80 text-white">
            <LockIcon className="h-3 w-3" /> Premium
          </Badge>
        ) : null}

        <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-card/90 text-[11px] font-extrabold text-primary shadow-card">
          {story.num}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <p className="line-clamp-2 text-sm font-extrabold leading-tight text-ink">{story.title}</p>
        <span className="mt-1 inline-flex w-fit rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-primary">
          {prettifyTheme(story.theme)}
        </span>
        <div className="mt-2 flex items-center gap-0.5">
          {story.isCompleted ? (
            [1, 2, 3].map((n) => (
              <StarIcon key={n} filled={n <= story.stars} className="h-3.5 w-3.5 text-secondary" />
            ))
          ) : story.inProgress ? (
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-accent/60">
              <div className="h-full rounded-full bg-success" style={{ width: story.percent + "%" }} />
            </div>
          ) : story.locked ? (
            <span className="text-[11px] font-bold text-ink-soft">Premium story</span>
          ) : (
            <span className="text-[11px] font-bold text-primary">Start story →</span>
          )}
        </div>
      </div>
    </button>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide shadow-card",
        className,
      )}
    >
      {children}
    </span>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
      <path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
