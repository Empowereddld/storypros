import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  getCompletedStoryIds,
  getCurrentLevel,
  getMasteryProgress,
  getPaperPlanes,
  getStreak,
} from "@/services/progress";
import { getStoryIds } from "@/services/stories";
import { getCatalogByCategory, getOwnedItems, type Collectible } from "@/services/shop";
import danDariaCelebrate from "@/assets/dan-daria-celebrate.webp";
import { TactileButton } from "./TactileButton";
import { MiniPlane, Star, StoryProsLogo } from "./StoryProsBrand";
import { RewardBadgeArt, type BadgeState } from "./RewardBadgeArt";
import {
  AppBottomNav,
  BookCheckIcon,
  ChevronLeftIcon,
  CoinIcon,
  CurrencyBadge,
  MedalIcon,
  StarIcon,
} from "./StoryProsUi";

interface AchievementGalleryScreenProps {
  childName: string;
  onClose: () => void;
  onNavigate?: (destination: string) => void;
}

const LEVEL_TITLES: Record<number, string> = {
  1: "Story Starter",
  2: "Word Builder",
  3: "Narrative Navigator",
};

/** Display order + child-friendly, participation-focused copy for each real badge. */
const BADGE_ORDER = [
  "badge-first-story",
  "badge-3-stories",
  "badge-5-streak",
  "badge-perfect",
  "badge-level-2",
  "badge-all-elements",
  "badge-all-stories",
] as const;

const BADGE_COPY: Record<string, { name?: string; requirement: string; blurb: string }> = {
  "badge-first-story": {
    requirement: "Finish your first story",
    blurb: "Take off on your reading adventure!",
  },
  "badge-3-stories": {
    requirement: "Finish 3 stories",
    blurb: "You keep coming back — that's how reading grows.",
  },
  "badge-5-streak": {
    requirement: "Read on 5 days in a row",
    blurb: "A little practice each day adds up.",
  },
  "badge-perfect": {
    name: "Strong Finish",
    requirement: "Finish a story feeling sure of your answers",
    blurb: "You worked through the whole story carefully.",
  },
  "badge-level-2": {
    requirement: "Practise 5 stories to reach Level 2",
    blurb: "New words and longer stories are waiting.",
  },
  "badge-all-elements": {
    name: "Story Master",
    requirement: "Show what you know about every story part",
    blurb: "Characters, places, problems, feelings — all of it.",
  },
  "badge-all-stories": {
    requirement: "Finish every Level 1 story",
    blurb: "Explore the whole map of stories.",
  },
};

type RewardItem = Collectible & {
  unlocked: boolean;
  label: string;
  requirement: string;
  blurb: string;
  /** null when the reward has no simple countable requirement */
  progress: { current: number; target: number } | null;
};

export function AchievementGalleryScreen({
  childName,
  onClose,
  onNavigate,
}: AchievementGalleryScreenProps) {
  const { children, activeChild } = useAuth();
  const childId = activeChild?.id ?? children[0]?.id ?? "demo";

  const coins = getPaperPlanes();
  const level = getCurrentLevel();
  const levelTitle = LEVEL_TITLES[level] ?? `Level ${level}`;
  const completedCount = getCompletedStoryIds().length;
  const mastery = getMasteryProgress();
  const streak = getStreak();
  const firstName = (childName || "Story Pro").trim().split(/\s+/)[0];

  const rewards = useMemo<RewardItem[]>(() => {
    const catalog = getCatalogByCategory("badge");
    const owned = new Set(getOwnedItems(childId));
    const levelOneCount = getStoryIds(1).length || 11;

    const progressFor = (id: string): RewardItem["progress"] => {
      switch (id) {
        case "badge-first-story":
          return { current: Math.min(completedCount, 1), target: 1 };
        case "badge-3-stories":
          return { current: Math.min(completedCount, 3), target: 3 };
        case "badge-5-streak":
          return { current: Math.min(streak, 5), target: 5 };
        case "badge-level-2":
          return { current: mastery.storiesMastered, target: mastery.storiesRequired };
        case "badge-all-stories":
          return { current: Math.min(completedCount, levelOneCount), target: levelOneCount };
        default:
          return null;
      }
    };

    return BADGE_ORDER.map((id) => catalog.find((c) => c.id === id))
      .filter((c): c is Collectible => Boolean(c))
      .map((item) => {
        const copy = BADGE_COPY[item.id];
        const prog = progressFor(item.id);
        return {
          ...item,
          unlocked: owned.has(item.id) || (prog ? prog.current >= prog.target : false),
          label: copy?.name ?? item.name,
          requirement: copy?.requirement ?? item.unlockCondition ?? item.description,
          blurb: copy?.blurb ?? item.description,
          progress: prog,
        };
      });
  }, [childId, completedCount, streak, mastery.storiesMastered, mastery.storiesRequired]);

  const earned = rewards.filter((r) => r.unlocked);
  const pending = rewards.filter((r) => !r.unlocked);
  const featured = pending[0] ?? earned[earned.length - 1] ?? null;
  const comingUp = pending.filter((r) => r.id !== featured?.id).slice(0, 2);
  const laterLocked = pending.filter(
    (r) => r.id !== featured?.id && !comingUp.some((c) => c.id === r.id),
  );

  const isNewChild = completedCount === 0 && earned.length === 0;
  const heroLine = isNewChild
    ? "Your adventure starts here. Finish your first story to earn your first badge."
    : "Keep reading, keep learning, and see what you unlock.";

  const masteryPercent =
    mastery.storiesRequired > 0
      ? Math.min(100, Math.round((mastery.storiesMastered / mastery.storiesRequired) * 100))
      : 0;

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-accent/10 to-accent/30" />
        <div className="absolute -right-24 top-24 h-64 w-56 rounded-full bg-secondary/15 blur-3xl" />
        <div className="absolute -left-20 bottom-24 h-56 w-64 rounded-full bg-sky/35 blur-3xl" />
      </div>

      {/* Phones/tablets header — laptop uses the global DesktopNav */}
      <header className="relative z-30 flex items-center justify-between gap-2 px-4 pb-1 pt-3 lg:hidden">
        <button
          onClick={onClose}
          aria-label="Back"
          className="press-pop flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-card text-primary shadow-card"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <StoryProsLogo layout="row" size="md" className="scale-90" />
        <CurrencyBadge
          count={coins}
          onClick={() => onNavigate?.("shop")}
          className="bg-card shadow-card"
        />
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar px-4 pb-28 pt-2 lg:px-8 lg:pb-10 lg:pt-6">
        <div className="mx-auto w-full max-w-[1180px]">
          {/* ── 1. Hero ── */}
          <section className="relative overflow-hidden rounded-[32px] bg-primary shadow-soft">
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
              <Star className="absolute left-6 top-6 h-4 w-4 text-secondary/70" />
              <Star className="absolute right-1/2 top-10 h-3 w-3 text-white/40" />
              <MiniPlane className="absolute left-1/2 bottom-4 h-6 w-6 rotate-12 text-secondary/50" />
            </div>

            <div className="relative grid gap-4 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end lg:gap-6 lg:p-8">
              <div className="min-w-0">
                <h1 className="text-[30px] font-extrabold leading-[1.05] text-primary-foreground sm:text-[38px] lg:text-[46px]">
                  Your Rewards
                </h1>
                <p className="mt-2 max-w-[36ch] text-[15px] font-medium leading-snug text-primary-foreground/85 lg:text-[17px]">
                  {heroLine}
                </p>

                {/* Real child data — never hard-coded */}
                <div className="mt-5 grid grid-cols-2 gap-2 rounded-[24px] bg-card p-3 shadow-card sm:grid-cols-4 sm:gap-3 sm:p-4">
                  <HeroStat
                    icon={<CoinIcon className="h-5 w-5" />}
                    tone="gold"
                    value={coins}
                    label="Coins"
                  />
                  <HeroStat
                    icon={<BookCheckIcon className="h-5 w-5" />}
                    value={completedCount}
                    label="Stories"
                  />
                  <HeroStat
                    icon={<MedalIcon className="h-5 w-5" />}
                    value={earned.length}
                    label="Badges"
                  />
                  <HeroStat
                    icon={<StarIcon filled className="h-5 w-5" />}
                    value={`Lv.${level}`}
                    label={levelTitle}
                  />
                </div>
              </div>

              <div className="relative hidden justify-self-end sm:block">
                <img
                  src={danDariaCelebrate}
                  alt=""
                  loading="lazy"
                  className="mx-auto h-40 w-auto object-contain drop-shadow-xl lg:h-56"
                />
              </div>
            </div>
          </section>

          {/* ── 2. Featured reward ── */}
          {featured && (
            <FeaturedReward
              reward={featured}
              firstName={firstName}
              onChooseStory={() => onNavigate?.("library")}
            />
          )}

          {/* Compact level progress — one progress story, not two */}
          <section className="mt-3 rounded-[22px] bg-card px-4 py-3 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[13px] font-extrabold text-primary">
                Lv.{level} · {levelTitle}
              </p>
              <p className="text-[12px] font-bold text-ink-soft">
                {mastery.ready
                  ? "Ready to level up!"
                  : `${mastery.storiesMastered} of ${mastery.storiesRequired} stories practised`}
              </p>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-accent">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${Math.max(masteryPercent, 3)}%` }}
              />
            </div>
          </section>

          {/* ── 3. Reward collection ── */}
          <div className="mt-6 space-y-5 lg:mt-8">
            {earned.length > 0 && (
              <RewardGroup title="Unlocked" count={earned.length} items={earned} state="earned" />
            )}
            {comingUp.length > 0 && (
              <RewardGroup title="Coming up" count={comingUp.length} items={comingUp} state="next" />
            )}
            {laterLocked.length > 0 && (
              <RewardGroup
                title="Later rewards"
                count={laterLocked.length}
                items={laterLocked}
                state="locked"
              />
            )}
          </div>

          {/* ── 4. Primary action ── */}
          <div className="mt-7 lg:mx-auto lg:max-w-[420px]">
            <TactileButton onClick={() => (onNavigate ? onNavigate("library") : onClose())}>
              Choose a Story
            </TactileButton>
          </div>
        </div>
      </div>

      {onNavigate ? <AppBottomNav active="achievements" onNavigate={onNavigate} /> : null}
    </div>
  );
}

/* ───────── Hero stat tile ───────── */

function HeroStat({
  icon,
  value,
  label,
  tone = "purple",
}: {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
  tone?: "purple" | "gold";
}) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px]",
          tone === "gold" ? "bg-secondary text-secondary-foreground" : "bg-accent/70 text-primary",
        )}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[22px] font-extrabold leading-none text-primary">{value}</span>
        <span className="mt-0.5 block text-[11px] font-extrabold uppercase leading-tight tracking-wide text-ink-soft">
          {label}
        </span>
      </span>
    </div>
  );
}

/* ───────── Featured reward — the one thing to work toward ───────── */

function FeaturedReward({
  reward,
  firstName,
  onChooseStory,
}: {
  reward: RewardItem;
  firstName: string;
  onChooseStory: () => void;
}) {
  const { progress } = reward;
  const percent = progress
    ? Math.min(100, Math.round((progress.current / Math.max(progress.target, 1)) * 100))
    : reward.unlocked
      ? 100
      : 0;
  const reached = reward.unlocked || (progress ? progress.current >= progress.target : false);

  return (
    <section className="mt-4 overflow-hidden rounded-[28px] border border-secondary/45 bg-gradient-to-br from-secondary/15 via-card to-card shadow-soft lg:mt-5">
      <div className="flex items-center gap-2 border-b border-secondary/30 bg-secondary/25 px-4 py-2.5 lg:px-6">
        <StarIcon filled className="h-4 w-4 text-secondary-foreground" />
        <span className="text-[12px] font-extrabold uppercase tracking-wide text-secondary-foreground">
          {reward.unlocked ? "Your latest reward" : "Featured reward"}
        </span>
      </div>

      <div className="grid gap-4 p-4 sm:grid-cols-[112px_minmax(0,1fr)] sm:items-center sm:gap-6 sm:p-6">
        <RewardBadgeArt
          badgeId={reward.id}
          state={reward.unlocked ? "earned" : "next"}
          className="mx-auto h-24 w-24 sm:mx-0 sm:h-28 sm:w-28"
        />

        <div className="min-w-0 text-center sm:text-left">
          <h2 className="text-[24px] font-extrabold leading-tight text-primary lg:text-[30px]">
            {reward.label}
          </h2>
          <p className="mt-1 text-[15px] font-bold text-ink">{reward.requirement}</p>
          <p className="mt-1 text-[13px] font-medium leading-snug text-ink-soft">{reward.blurb}</p>

          {progress && (
            <div className="mt-4">
              <div className="h-3 overflow-hidden rounded-full bg-accent">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${Math.max(percent, 3)}%` }}
                />
              </div>
              <p className="mt-1.5 text-[12px] font-extrabold text-ink-soft">
                {progress.current} / {progress.target}
              </p>
            </div>
          )}

          <div className="mt-4 flex justify-center sm:justify-start">
            {reached ? (
              <span className="inline-flex min-h-11 items-center gap-2 rounded-full bg-secondary px-5 text-[14px] font-extrabold text-secondary-foreground shadow-card">
                <StarIcon filled className="h-4 w-4" /> Earned — nice work, {firstName}!
              </span>
            ) : (
              <button
                onClick={onChooseStory}
                className="press-pop inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-primary/25 bg-card px-5 text-[14px] font-extrabold text-primary"
              >
                Keep reading to unlock
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Grouped collection ───────── */

function RewardGroup({
  title,
  count,
  items,
  state,
}: {
  title: string;
  count: number;
  items: RewardItem[];
  state: BadgeState;
}) {
  return (
    <section>
      <div className="mb-2.5 flex items-center gap-2">
        <h2 className="text-[17px] font-extrabold text-primary lg:text-[19px]">{title}</h2>
        <span className="rounded-full bg-accent/70 px-2 py-0.5 text-[12px] font-extrabold text-primary">
          {count}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <RewardTile key={item.id} item={item} state={state} />
        ))}
      </div>
    </section>
  );
}

function RewardTile({ item, state }: { item: RewardItem; state: BadgeState }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-[22px] p-3 text-center transition-all",
        state === "earned" && "bg-card shadow-card",
        state === "next" && "border-2 border-secondary/50 bg-card shadow-card",
        state === "locked" && "border border-accent bg-card/60",
      )}
    >
      <RewardBadgeArt badgeId={item.id} state={state} className="h-16 w-16" />
      <p
        className={cn(
          "mt-2.5 text-[14px] font-extrabold leading-tight",
          state === "locked" ? "text-ink-soft" : "text-primary",
        )}
      >
        {item.label}
      </p>
      <p className="mt-1 text-[11px] font-semibold leading-snug text-ink-soft">{item.requirement}</p>
      {state === "next" && item.progress && (
        <div className="mt-2 w-full">
          <div className="h-2 overflow-hidden rounded-full bg-accent">
            <div
              className="h-full rounded-full bg-secondary transition-all duration-500"
              style={{
                width: `${Math.max(
                  3,
                  Math.min(100, (item.progress.current / Math.max(item.progress.target, 1)) * 100),
                )}%`,
              }}
            />
          </div>
          <p className="mt-1 text-[10px] font-extrabold text-ink-soft">
            {item.progress.current} / {item.progress.target}
          </p>
        </div>
      )}
    </div>
  );
}
