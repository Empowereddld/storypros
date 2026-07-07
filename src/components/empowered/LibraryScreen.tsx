import { useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { getAllStories } from "@/services/stories";
import { getCompletedStoryIds, getPaperPlanes } from "@/services/progress";
import { getCheckpoint } from "@/services/checkpoint";
import { canAccessStory } from "@/services/subscription";
import { TOTAL_PLAYABLE_PHASES, prettifyTheme } from "@/services/continueStory";
import { resolveStoryImage } from "@/services/storyImages";
import { MiniPlane, Star, StoryProsLogo, LockIcon, UserIcon } from "./StoryProsBrand";
import {
  AppBottomNav,
  BookCheckIcon,
  BookIcon,
  ChevronRightIcon,
  CurrencyBadge,
  PaperPlaneIcon,
} from "./StoryProsUi";

interface LibraryScreenProps {
  onNavigate: (destination: string, storyId?: string) => void;
}

type FilterTab = "all" | "open" | "completed" | "locked";

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "open", label: "Ready" },
  { key: "completed", label: "Done" },
  { key: "locked", label: "Locked" },
];

interface CardStory {
  id: string;
  title: string;
  theme: string;
  level: number;
  image: string | null;
  num: number;
  isCompleted: boolean;
  inProgress: boolean;
  percent: number;
  locked: boolean;
}

export function LibraryScreen({ onNavigate }: LibraryScreenProps) {
  const { activeChild, children } = useAuth();
  const childId = activeChild?.id ?? children[0]?.id ?? "";
  const [filter, setFilter] = useState<FilterTab>("all");
  const planes = getPaperPlanes();

  const stories = useMemo<CardStory[]>(() => {
    const completed = new Set(getCompletedStoryIds());
    return getAllStories().map((story, index) => {
      const isCompleted = completed.has(story.id);
      const checkpoint = !isCompleted && childId ? getCheckpoint(childId, story.id) : null;
      const percent = checkpoint
        ? Math.round(
            (Math.min(checkpoint.phaseIndex, TOTAL_PLAYABLE_PHASES) / TOTAL_PLAYABLE_PHASES) * 100,
          )
        : isCompleted
          ? 100
          : 0;

      return {
        id: story.id,
        title: story.title,
        theme: story.theme,
        level: story.level,
        image: resolveStoryImage(story.id, story.slides[0]?.image || "slide-01.webp"),
        num: index + 1,
        isCompleted,
        inProgress: !!checkpoint,
        percent,
        locked: childId ? !canAccessStory(childId, story.id) : false,
      };
    });
  }, [childId]);

  const featured =
    stories.find((story) => story.inProgress && !story.isCompleted && !story.locked) ??
    stories.find((story) => !story.isCompleted && !story.locked) ??
    stories.find((story) => !story.locked) ??
    stories[0];

  const filtered = useMemo(() => {
    switch (filter) {
      case "open":
        return stories.filter((story) => !story.locked && !story.isCompleted);
      case "completed":
        return stories.filter((story) => story.isCompleted);
      case "locked":
        return stories.filter((story) => story.locked && !story.isCompleted);
      default:
        return stories;
    }
  }, [stories, filter]);

  const completedCount = stories.filter((story) => story.isCompleted).length;

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-accent/35" />
        <div className="absolute -right-20 top-32 h-44 w-56 rounded-full bg-accent/60 blur-3xl" />
        <div className="absolute -left-20 bottom-24 h-48 w-56 rounded-full bg-sky/40 blur-3xl" />
        <Star className="absolute left-8 top-24 h-4 w-4 text-secondary animate-sparkle" />
        <Star className="absolute right-24 top-28 h-7 w-7 text-secondary animate-sparkle" />
        <Star className="absolute right-14 top-52 h-5 w-5 text-primary/25 animate-sparkle" />
        <MiniPlane className="absolute right-11 top-40 h-12 w-12 rotate-[18deg] text-secondary drop-shadow-md animate-float" />
        <div className="absolute -right-8 top-44 h-20 w-32 rounded-[50%] border-2 border-dashed border-primary/15" />
      </div>

      <header className="relative z-30 flex items-center justify-between px-5 pb-1 pt-4">
        <StoryProsLogo layout="row" size="md" />
        <div className="flex items-center gap-2">
          <CurrencyBadge
            count={planes}
            onClick={() => onNavigate("shop")}
            className="bg-card shadow-card"
          />
          <button
            onClick={() => onNavigate("settings")}
            aria-label="Settings"
            className="press-pop flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card"
          >
            <UserIcon className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar px-4 pb-28 pt-2">
        <section>
          <h1 className="text-[40px] font-extrabold leading-none text-primary">Story Library</h1>
          <p className="mt-3 max-w-[250px] text-lg font-medium leading-snug text-ink-soft">
            Stories that inspire imagination and build confidence.
          </p>
        </section>

        {featured && (
          <section className="mt-6">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="text-[25px] font-extrabold leading-tight text-primary">
                  Recommended for You
                </h2>
                <p className="mt-1 text-sm font-medium text-ink-soft">
                  Based on your library progress.
                </p>
              </div>
              <button
                onClick={() => setFilter("all")}
                className="press-pop inline-flex shrink-0 items-center gap-1 text-sm font-extrabold text-primary"
              >
                See All <ChevronRightIcon />
              </button>
            </div>

            <button
              onClick={() => onNavigate("story", featured.id)}
              className="hover-lift mt-3 block w-full overflow-hidden rounded-[30px] border-[5px] border-card bg-card text-left shadow-soft active:scale-[0.99]"
            >
              <div className="relative h-[255px] overflow-hidden rounded-[23px] bg-accent">
                {featured.image ? (
                  <img src={featured.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <FallbackCover />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/15 to-transparent" />
                <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-primary-foreground shadow-card">
                  <Star className="h-4 w-4 text-secondary" />
                  Top Pick
                </span>
                <span className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-card/95 text-primary shadow-card">
                  {featured.locked ? <LockIcon /> : <ChevronRightIcon className="h-6 w-6" />}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <h3 className="max-w-[230px] text-[31px] font-extrabold leading-[0.95] drop-shadow">
                    {featured.title}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <StoryPill>{prettifyTheme(featured.theme)}</StoryPill>
                    <StoryPill>Level {featured.level}</StoryPill>
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4 pt-3">
                <div className="flex items-center justify-between text-xs font-extrabold">
                  <span className="text-ink-soft">{statusCopy(featured)}</span>
                  <span className="text-primary">
                    {featured.locked ? "Premium" : `${featured.percent}% complete`}
                  </span>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-accent/70">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      featured.isCompleted ? "bg-success" : "bg-primary",
                    )}
                    style={{ width: `${featured.locked ? 0 : featured.percent}%` }}
                  />
                </div>
              </div>
            </button>
          </section>
        )}

        <div className="mt-5 rounded-[28px] bg-card/80 p-2 shadow-card backdrop-blur">
          <div className="grid grid-cols-4 gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={cn(
                  "press-pop rounded-[20px] px-2 py-2 text-xs font-extrabold transition-colors",
                  filter === tab.key
                    ? "bg-primary text-primary-foreground shadow-[0_4px_0_0_var(--primary-deep)]"
                    : "text-ink-soft hover:bg-accent/60 hover:text-primary",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <h2 className="text-[24px] font-extrabold text-primary">All Stories</h2>
          <span className="rounded-full bg-secondary/25 px-3 py-1 text-xs font-extrabold text-secondary-foreground">
            {completedCount}/{stories.length} done
          </span>
        </div>

        {filtered.length === 0 ? (
          <EmptyLibraryState filter={filter} />
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-3 stagger-in">
            {filtered.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onOpen={() => onNavigate("story", story.id)}
              />
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
      className="hover-lift flex min-h-[238px] flex-col overflow-hidden rounded-[26px] border border-accent/50 bg-card text-left shadow-card active:scale-[0.98]"
    >
      <div className="relative h-[130px] overflow-hidden bg-accent">
        {story.image ? (
          <img src={story.image} alt="" className="h-full w-full object-cover" />
        ) : (
          <FallbackCover compact />
        )}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink/65 to-transparent" />
        <StateBadge story={story} />
        <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-card/95 text-[11px] font-extrabold text-primary shadow-card">
          {story.num}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 min-h-[36px] text-sm font-extrabold leading-tight text-ink">
          {story.title}
        </h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-extrabold text-primary">
            {prettifyTheme(story.theme)}
          </span>
          <span className="rounded-full bg-secondary/25 px-2 py-0.5 text-[10px] font-extrabold text-secondary-foreground">
            L{story.level}
          </span>
        </div>

        <div className="mt-auto pt-3">
          {story.locked ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-ink-soft">
              <LockIcon className="h-3.5 w-3.5" />
              Premium story
            </span>
          ) : story.isCompleted ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-success">
              <BookCheckIcon className="h-3.5 w-3.5" />
              Completed
            </span>
          ) : story.inProgress ? (
            <div>
              <div className="flex items-center justify-between text-[11px] font-extrabold">
                <span className="text-ink-soft">Continue</span>
                <span className="text-primary">{story.percent}%</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-accent/70">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${story.percent}%` }}
                />
              </div>
            </div>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-primary">
              Start story <ChevronRightIcon className="h-3.5 w-3.5" />
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function StateBadge({ story }: { story: CardStory }) {
  if (story.isCompleted) {
    return (
      <Badge className="bg-success text-white">
        <BookCheckIcon className="h-3 w-3" /> Done
      </Badge>
    );
  }

  if (story.inProgress) {
    return <Badge className="bg-primary text-white">{story.percent}%</Badge>;
  }

  if (story.locked) {
    return (
      <Badge className="bg-ink/80 text-white">
        <LockIcon className="h-3 w-3" /> Locked
      </Badge>
    );
  }

  return null;
}

function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide shadow-card",
        className,
      )}
    >
      {children}
    </span>
  );
}

function StoryPill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-card/90 px-3 py-1 text-xs font-extrabold text-primary shadow-card">
      {children}
    </span>
  );
}

function EmptyLibraryState({ filter }: { filter: FilterTab }) {
  const copy =
    filter === "completed"
      ? "No finished stories yet. Pick a ready story to begin."
      : filter === "locked"
        ? "No locked stories are showing right now."
        : "No stories match this filter.";

  return (
    <div className="mt-8 rounded-[28px] bg-card p-6 text-center shadow-card">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-accent text-primary">
        <BookIcon className="h-8 w-8" />
      </div>
      <p className="mt-3 text-sm font-bold text-ink-soft">{copy}</p>
    </div>
  );
}

function FallbackCover({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-gradient-to-br from-accent to-sky text-primary",
        compact ? "text-primary" : "text-primary",
      )}
    >
      <PaperPlaneIcon className={compact ? "h-10 w-10" : "h-16 w-16"} />
    </div>
  );
}

function statusCopy(story: CardStory) {
  if (story.locked) return "Unlock with premium";
  if (story.isCompleted) return "Completed";
  if (story.inProgress) return "Keep going";
  return "Ready to start";
}
