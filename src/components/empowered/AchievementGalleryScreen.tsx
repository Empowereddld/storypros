import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  getCompletedStoryIds,
  getCurrentLevel,
  getMasteryProgress,
  getPaperPlanes,
} from "@/services/progress";
import { awardBadge, getCatalogByCategory, getOwnedItems, type Collectible } from "@/services/shop";
import dariaAndFriend from "@/assets/dan-daria-thumbsup.webp";
import { TactileButton } from "./TactileButton";
import { MiniPlane, Star, StoryProsLogo } from "./StoryProsBrand";
import {
  AppBottomNav,
  BookCheckIcon,
  ChevronRightIcon,
  CurrencyBadge,
  MedalIcon,
  PaperPlaneIcon,
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

function loadDemoState(childId: string) {
  awardBadge(childId, "badge-first-story");
  awardBadge(childId, "badge-3-stories");
  awardBadge(childId, "badge-perfect");
  awardBadge(childId, "badge-all-elements");
}

export function AchievementGalleryScreen({
  childName,
  onClose,
  onNavigate,
}: AchievementGalleryScreenProps) {
  const { children, activeChild } = useAuth();
  const childId = activeChild?.id ?? children[0]?.id ?? "demo";
  const [demoMode, setDemoMode] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [rewardVersion, setRewardVersion] = useState(0);

  function handleHeaderTap() {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    if (newCount >= 3) {
      if (!demoMode) {
        loadDemoState(childId);
        setDemoMode(true);
      } else {
        setDemoMode(false);
      }
      setRewardVersion((version) => version + 1);
      setTapCount(0);
    }
    setTimeout(() => setTapCount(0), 1000);
  }

  const paperPlanes = demoMode ? 245 : getPaperPlanes();
  const level = demoMode ? 2 : getCurrentLevel();
  const completedIds = getCompletedStoryIds();
  const mastery = getMasteryProgress();
  const storiesCompleted = demoMode ? 6 : completedIds.length;
  const levelTitle = LEVEL_TITLES[level] ?? `Level ${level}`;
  const masteryPercent = demoMode
    ? 80
    : mastery.storiesRequired > 0
      ? Math.min(100, (mastery.storiesMastered / mastery.storiesRequired) * 100)
      : 0;

  const badges = useMemo(() => {
    void rewardVersion;
    const catalog = getCatalogByCategory("badge").filter((item) => item.id !== "badge-5-streak");
    const owned = new Set(getOwnedItems(childId));
    return catalog.map((item) => ({ ...item, unlocked: owned.has(item.id) }));
  }, [childId, rewardVersion]);

  const unlockedCount = badges.filter((badge) => badge.unlocked).length;
  const nextBadge = badges.find((badge) => !badge.unlocked);
  const firstName = (childName || "Story Pro").trim().split(/\s+/)[0];

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-accent/10 to-accent/35" />
        <div className="absolute -right-20 top-20 h-72 w-56 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute -left-20 bottom-24 h-56 w-64 rounded-full bg-sky/45 blur-3xl" />
        <Star className="absolute left-8 top-32 h-5 w-5 text-secondary animate-sparkle" />
        <Star className="absolute right-14 top-40 h-4 w-4 text-primary/35 animate-sparkle" />
        <Star className="absolute right-8 bottom-36 h-6 w-6 text-secondary/70 animate-sparkle" />
        <MiniPlane className="absolute right-12 top-24 h-10 w-10 rotate-12 text-secondary animate-float" />
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

      <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar px-4 pb-28 pt-3">
        <section className="relative min-h-[300px] overflow-hidden rounded-[34px] bg-card p-5 shadow-soft">
          <div className="relative z-10 max-w-[190px]">
            <h1 className="text-[43px] font-extrabold leading-[0.95] text-primary">Your Rewards</h1>
            <p className="mt-3 text-base font-medium leading-snug text-ink-soft">
              Read stories. Collect badges.
            </p>
          </div>

          <img
            src={dariaAndFriend}
            alt=""
            className="absolute -right-8 bottom-0 h-56 w-auto object-contain"
          />

          <button
            onClick={handleHeaderTap}
            className="absolute bottom-5 left-5 z-10 rounded-[26px] bg-card/95 p-4 text-left shadow-card"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                <PaperPlaneIcon className="h-8 w-8" />
              </span>
              <div>
                <p className="text-[30px] font-extrabold leading-none text-primary">
                  {paperPlanes}
                </p>
                <p className="text-xs font-extrabold uppercase tracking-wide text-ink-soft">
                  Paper Planes
                </p>
              </div>
            </div>
            <div className="mt-3 h-2.5 w-48 overflow-hidden rounded-full bg-accent">
              <div
                className="h-full rounded-full bg-secondary transition-all duration-500"
                style={{ width: `${Math.min(100, (paperPlanes / 100) * 100)}%` }}
              />
            </div>
          </button>
        </section>

        <section className="mt-4 grid grid-cols-3 gap-3">
          <MetricCard
            icon={<BookCheckIcon className="h-6 w-6" />}
            value={storiesCompleted}
            label="Stories"
          />
          <MetricCard
            icon={<MedalIcon className="h-6 w-6" />}
            value={unlockedCount}
            label="Badges"
          />
          <MetricCard
            icon={<MiniPlane className="h-6 w-6 rotate-12" />}
            value={level}
            label={levelTitle}
          />
        </section>

        {nextBadge && (
          <section className="mt-5 overflow-hidden rounded-[30px] border border-secondary/40 bg-card shadow-card">
            <div className="bg-secondary/20 px-4 py-2">
              <span className="inline-flex items-center gap-2 text-sm font-extrabold text-primary">
                <Star className="h-4 w-4 text-secondary" />
                Featured Reward
              </span>
            </div>
            <div className="grid grid-cols-[96px_1fr] gap-4 p-4">
              <RewardMedal badge={nextBadge} size="lg" />
              <div>
                <h2 className="text-2xl font-extrabold leading-tight text-primary">
                  {nextBadge.name}
                </h2>
                <p className="mt-1 text-sm font-semibold leading-snug text-ink-soft">
                  {nextBadge.unlockCondition ?? nextBadge.description}
                </p>
                <div className="mt-3 rounded-2xl bg-secondary/20 px-3 py-2 text-xs font-extrabold text-secondary-foreground">
                  Keep reading to unlock it.
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="mt-5 rounded-[28px] bg-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-primary">Progress Path</h2>
              <p className="mt-0.5 text-sm font-semibold text-ink-soft">
                {mastery.ready
                  ? `${firstName} is ready to level up!`
                  : `${Math.max(0, mastery.storiesRequired - mastery.storiesMastered)} more mastered stories to level up.`}
              </p>
            </div>
            <span className="rounded-full bg-primary px-3 py-1 text-sm font-extrabold text-primary-foreground">
              Lv.{level}
            </span>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-accent">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${masteryPercent}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs font-extrabold text-ink-soft">
            <span>
              {mastery.storiesMastered}/{mastery.storiesRequired} mastered
            </span>
            <span>{Math.round(masteryPercent)}%</span>
          </div>
        </section>

        <section className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-primary">More Rewards</h2>
            <button
              onClick={() => onNavigate?.("shop")}
              className="press-pop inline-flex items-center gap-1 text-sm font-extrabold text-primary"
            >
              Shop <ChevronRightIcon />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 stagger-in">
            {badges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </section>

        <div className="mt-6">
          <TactileButton onClick={() => (onNavigate ? onNavigate("library") : onClose())}>
            Read to Earn More
          </TactileButton>
        </div>
      </div>

      {onNavigate ? <AppBottomNav active="achievements" onNavigate={onNavigate} /> : null}
    </div>
  );
}

function MetricCard({
  icon,
  value,
  label,
}: {
  icon?: React.ReactNode;
  value: React.ReactNode;
  label: string;
}) {
  return (
    <div className="rounded-[24px] bg-card p-3 text-center shadow-card">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-[18px] bg-accent text-primary">
        {icon ?? <MiniPlane className="h-6 w-6 rotate-12" />}
      </div>
      <p className="mt-2 text-2xl font-extrabold leading-none text-primary">{value}</p>
      <p className="mt-1 text-[11px] font-extrabold leading-tight text-ink-soft">{label}</p>
    </div>
  );
}

function BadgeCard({ badge }: { badge: Collectible & { unlocked: boolean } }) {
  return (
    <div
      className={cn(
        "hover-lift min-h-[164px] rounded-[26px] p-4 text-center transition-all",
        badge.unlocked ? "bg-card shadow-card" : "border-2 border-dashed border-accent bg-card/70",
      )}
    >
      <RewardMedal badge={badge} />
      <p
        className={cn(
          "mt-3 text-sm font-extrabold leading-tight",
          badge.unlocked ? "text-primary" : "text-ink-soft",
        )}
      >
        {badge.name}
      </p>
      <p className="mt-1 text-[11px] font-semibold leading-snug text-ink-soft">
        {badge.unlocked ? badge.description : (badge.unlockCondition ?? badge.description)}
      </p>
    </div>
  );
}

function RewardMedal({
  badge,
  size = "md",
}: {
  badge: Collectible & { unlocked: boolean };
  size?: "md" | "lg";
}) {
  return (
    <div
      className={cn(
        "relative mx-auto flex items-center justify-center rounded-[24px] border-4 border-card bg-gradient-to-br from-secondary to-secondary-deep text-primary shadow-card",
        size === "lg" ? "h-24 w-24" : "h-16 w-16",
        !badge.unlocked && "grayscale",
      )}
    >
      <MedalIcon className={size === "lg" ? "h-12 w-12" : "h-8 w-8"} />
      {!badge.unlocked && (
        <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card">
          <LockIcon />
        </span>
      )}
    </div>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      aria-hidden
    >
      <rect x="5" y="10" width="14" height="10" rx="2.5" />
      <path d="M8 10V8a4 4 0 018 0v2" strokeLinecap="round" />
    </svg>
  );
}
