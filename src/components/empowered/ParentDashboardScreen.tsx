import { useMemo, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import danDariaThumbsUp from "@/assets/dan-daria-thumbsup.webp";
import {
  getCompletedStoryIds,
  getCurrentLevel,
  getPaperPlanes,
  getProgress,
} from "@/services/progress";
import { labelToDisplayText, scoreToLabel } from "@/services/scoring";
import { getStory } from "@/services/stories";
import type { SkillDomain } from "@/types/story";
import { MiniPlane, Star, StoryProsLogo, UserIcon } from "./StoryProsBrand";
import {
  BookCheckIcon,
  BookIcon,
  ChevronRightIcon,
  CoinIcon,
  CurrencyBadge,
  MedalIcon,
} from "./StoryProsUi";

interface ParentDashboardScreenProps {
  onClose: () => void;
  onNavigate?: (destination: string) => void;
}

const DOMAINS: SkillDomain[] = ["listening", "story_structure", "vocabulary", "grammar"];
const DOMAIN_LABELS: Record<SkillDomain, string> = {
  listening: "Listening",
  story_structure: "Story Structure",
  vocabulary: "Vocabulary",
  grammar: "Grammar",
  retell: "Retelling",
  phonological: "Sounds",
};
const LABEL_COLORS: Record<string, string> = {
  strength: "bg-success",
  growing: "bg-primary",
  budding: "bg-secondary",
  needs_support: "bg-coral",
};
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export function ParentDashboardScreen({ onClose, onNavigate }: ParentDashboardScreenProps) {
  const { activeChild, children } = useAuth();
  const child = activeChild ?? children[0];
  const childName = child?.name || "your storyteller";
  const childFirstName = child?.name?.trim().split(/\s+/)[0] || "Story Pro";
  const progress = getProgress();
  const completedIds = getCompletedStoryIds();
  const paperPlanes = getPaperPlanes();
  const level = getCurrentLevel();

  const data = useMemo(() => {
    const completions = progress.completions;
    const bestByStory = new Map<string, (typeof completions)[number]>();
    for (const completion of completions) {
      const existing = bestByStory.get(completion.storyId);
      if (!existing || completion.overallScore > existing.overallScore) {
        bestByStory.set(completion.storyId, completion);
      }
    }

    const best = Array.from(bestByStory.values());
    const avgScore = best.length
      ? Math.round(best.reduce((sum, completion) => sum + completion.overallScore, 0) / best.length)
      : 0;

    const avgDomains = {} as Record<SkillDomain, number>;
    for (const domain of DOMAINS) {
      avgDomains[domain] = best.length
        ? Math.round(
            best.reduce((sum, completion) => sum + (completion.domainScores[domain] || 0), 0) /
              best.length,
          )
        : 0;
    }

    const recent = [...completions]
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .slice(0, 3);

    const now = new Date();
    const week = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (6 - index));
      const key = date.toISOString().slice(0, 10);
      const count = completions.filter((completion) =>
        (completion.completedAt || "").startsWith(key),
      ).length;
      return { label: DAY_LABELS[date.getDay()], count };
    });
    const weekMax = Math.max(1, ...week.map((item) => item.count));
    const weekTotal = week.reduce((sum, item) => sum + item.count, 0);

    return { avgScore, avgDomains, recent, week, weekMax, weekTotal };
  }, [progress]);

  const overall = Math.max(0, Math.min(100, data.avgScore));
  const selectedChildren = children.slice(0, 2);
  const displayedChildren = selectedChildren.length ? selectedChildren : [child];

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-accent/10 to-accent/30" />
        <div className="absolute -right-16 top-40 h-56 w-60 rounded-full bg-accent/60 blur-3xl" />
        <div className="absolute -left-20 bottom-24 h-56 w-64 rounded-full bg-sky/45 blur-3xl" />
        <Star className="absolute left-10 top-32 h-4 w-4 text-secondary animate-sparkle" />
        <Star className="absolute right-12 top-44 h-5 w-5 text-secondary animate-sparkle" />
        <MiniPlane className="absolute right-16 top-24 h-10 w-10 rotate-12 text-secondary animate-float" />
      </div>

      <header className="relative z-30 flex items-center justify-between gap-2 px-5 pb-1 pt-4">
        <button
          onClick={onClose}
          aria-label="Back"
          className="press-pop flex h-11 w-11 items-center justify-center rounded-full bg-card text-primary shadow-card"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            aria-hidden
          >
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <StoryProsLogo layout="row" size="md" className="scale-90" />
        <CurrencyBadge
          count={paperPlanes}
          onClick={() => onNavigate?.("shop")}
          className="bg-card shadow-card"
        />
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar px-4 pb-8 pt-3 lg:px-8 lg:pb-10">
        <section className="relative min-h-[172px] overflow-hidden rounded-[32px] border border-accent/60 bg-card/92 p-5 shadow-soft">
          <div className="relative z-10 max-w-[190px]">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
              Family progress
            </p>
            <h1 className="mt-2 font-display text-[32px] font-extrabold leading-none text-primary">
              Child Progress
            </h1>
            <p className="mt-3 text-sm font-semibold leading-snug text-ink-soft">
              Track growth. Celebrate wins. Keep building confidence.
            </p>
          </div>
          <img
            src={danDariaThumbsUp}
            alt=""
            className="pointer-events-none absolute -bottom-3 -right-6 h-40 w-auto object-contain drop-shadow-[0_14px_22px_rgba(63,38,140,0.16)]"
          />
        </section>

        <section className={cn("mt-4 grid gap-3", displayedChildren.length > 1 ? "grid-cols-2" : "grid-cols-1")}>
          {displayedChildren.map((item, index) => {
            const selected = item?.id === child?.id || (!child && index === 0);
            return (
              <div
                key={item?.id ?? index}
                className={cn(
                  "flex items-center gap-3 rounded-[24px] border bg-card p-3 shadow-card",
                  selected ? "border-primary" : "border-accent/60",
                )}
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                  <UserIcon className="h-7 w-7" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-extrabold text-primary">
                    {item?.name ?? "Child"}
                  </p>
                  <p className="text-xs font-medium text-ink-soft">Level {level}</p>
                </div>
                {selected && (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <CheckIcon />
                  </span>
                )}
              </div>
            );
          })}
        </section>

        <section className="mt-4 rounded-[30px] bg-card p-5 shadow-soft">
          <div className="grid grid-cols-[132px_1fr] items-center gap-4">
            <ProgressRing value={overall} />
            <div>
              <h2 className="text-[24px] font-extrabold leading-tight text-primary">
                Great job, {childFirstName}!
              </h2>
              <p className="mt-2 text-sm font-medium leading-snug text-ink-soft">
                {completedIds.length === 0
                  ? "Start a first story to build a progress picture."
                  : `${childFirstName} has completed ${completedIds.length} ${completedIds.length === 1 ? "story" : "stories"}.`}
              </p>
              <button
                onClick={() => onNavigate?.("library")}
                className="press-pop mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-extrabold text-primary-foreground shadow-card"
              >
                <BookIcon className="h-4 w-4" />
                Browse Stories
              </button>
            </div>
          </div>
        </section>

        <section className="mt-5">
          <h2 className="text-xl font-extrabold text-primary">This Week at a Glance</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <StatTile
              icon={<BookCheckIcon />}
              value={completedIds.length}
              label="Stories Completed"
              tone="primary"
            />
            <StatTile value={progress.streak} label="Day Streak" tone="secondary" />
            <StatTile value={`${overall}%`} label="Average Score" tone="primary" />
            <StatTile
              icon={<CoinIcon className="h-6 w-6" />}
              value={paperPlanes}
              label="Coins"
              tone="secondary"
            />
          </div>
        </section>

        <section className="mt-5 rounded-[28px] bg-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-primary">Skill Progress</h2>
            <span className="text-sm font-extrabold text-primary">This Week</span>
          </div>
          <div className="mt-5 grid grid-cols-[1fr_auto] gap-4">
            <div className="flex h-40 items-end justify-between gap-3 border-b border-accent/70 pb-2">
              {DOMAINS.map((domain) => {
                const score = Math.max(4, data.avgDomains[domain]);
                return (
                  <div key={domain} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-28 w-full items-end justify-center">
                      <div
                        className="w-7 rounded-t-xl bg-primary shadow-card transition-all"
                        style={{ height: `${score}%` }}
                      />
                    </div>
                    <span className="h-8 text-center text-[10px] font-bold leading-tight text-primary">
                      {DOMAIN_LABELS[domain]}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col justify-center gap-2 text-xs font-bold text-ink-soft">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-5 rounded-full bg-primary" />
                Average
              </span>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-4">
          <div className="rounded-[28px] bg-card p-4 shadow-card">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-primary">Stories Completed This Week</h2>
              <span className="text-sm font-extrabold text-primary">{data.weekTotal} total</span>
            </div>
            <div className="flex h-32 items-end justify-between gap-2">
              {data.week.map((item, index) => (
                <div
                  key={`${item.label}-${index}`}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t-xl bg-primary transition-all"
                      style={{
                        height: `${Math.round((item.count / data.weekMax) * 100)}%`,
                        minHeight: item.count > 0 ? "8px" : "2px",
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-extrabold text-ink-soft">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] bg-card p-4 shadow-card">
            <h2 className="text-lg font-extrabold text-primary">Recent Story Activity</h2>
            {data.recent.length === 0 ? (
              <p className="mt-3 text-sm font-semibold text-ink-soft">No completed stories yet.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {data.recent.map((completion, index) => {
                  const title = getStory(completion.storyId)?.title ?? completion.storyId;
                  return (
                    <div
                      key={`${completion.storyId}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-accent/60 bg-background/70 p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold text-ink">{title}</p>
                        <p className="text-[11px] font-medium text-ink-soft">
                          Completed - {new Date(completion.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-accent px-2.5 py-1 text-xs font-extrabold text-primary">
                        {Math.round(completion.overallScore)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="mt-5 rounded-[28px] bg-card p-4 shadow-card">
          <h2 className="text-lg font-extrabold text-primary">Quick Actions</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <QuickAction
              icon={<BookIcon />}
              label="Browse Stories"
              onClick={() => (onNavigate ? onNavigate("library") : onClose())}
            />
            <QuickAction
              icon={<MedalIcon />}
              label="View Rewards"
              onClick={() => (onNavigate ? onNavigate("achievements") : onClose())}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function ProgressRing({ value }: { value: number }) {
  return (
    <div
      className="relative flex h-32 w-32 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(var(--primary) ${value * 3.6}deg, oklch(0.9 0.05 300) 0deg)`,
      }}
    >
      <div className="flex h-[104px] w-[104px] flex-col items-center justify-center rounded-full bg-card text-center shadow-inner">
        <span className="text-[32px] font-extrabold leading-none text-primary">{value}%</span>
        <span className="mt-1 text-xs font-extrabold leading-tight text-ink">Overall Progress</span>
      </div>
    </div>
  );
}

function StatTile({
  icon,
  value,
  label,
  tone,
}: {
  icon?: ReactNode;
  value: ReactNode;
  label: string;
  tone: "primary" | "secondary";
}) {
  return (
    <div className="rounded-[24px] bg-card p-3.5 shadow-card">
      <span
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-[20px]",
          tone === "primary"
            ? "bg-accent text-primary"
            : "bg-secondary/25 text-secondary-foreground",
        )}
      >
        {icon ?? <MiniPlane className="h-6 w-6 rotate-12" />}
      </span>
      <p className="mt-3 text-2xl font-extrabold leading-none text-ink">{value}</p>
      <p className="mt-1 text-sm font-extrabold leading-tight text-primary">{label}</p>
    </div>
  );
}

function QuickAction({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="press-pop flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-[22px] border border-accent/60 bg-background/70 p-3 text-center shadow-card"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-accent text-primary">
        {icon}
      </span>
      <span className="text-sm font-extrabold text-primary">{label}</span>
      <ChevronRightIcon className="h-4 w-4 text-ink-soft" />
    </button>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      aria-hidden
    >
      <path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
