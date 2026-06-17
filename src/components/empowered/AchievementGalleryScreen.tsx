/* ─────────────────────────────────────────────
 * Achievement Gallery / "Your Rewards"
 * Rebuilt from the Rewards mockup: stars hero with
 * level + mastery, featured next badge, milestones,
 * and the badge grid. Live data + demo triple-tap
 * preserved.
 * ───────────────────────────────────────────── */

import { useState, useMemo } from "react";
import { TactileButton } from "./TactileButton";
import msLopez from "@/assets/ms-lopez.png";
import dariaAndFriend from "@/assets/daria-and-friend.webp";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  getProgress,
  getPaperPlanes,
  getCurrentLevel,
  getCompletedStoryIds,
  getMasteryProgress,
} from "@/services/progress";
import {
  getCatalogByCategory,
  getOwnedItems,
  awardBadge,
  type Collectible,
} from "@/services/shop";
import { AppBottomNav, CurrencyBadge } from "./StoryProsUi";
import { StoryProsLogo } from "./StoryProsBrand";

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
  awardBadge(childId, "badge-5-streak");
  awardBadge(childId, "badge-all-elements");
}

export function AchievementGalleryScreen({ childName, onClose, onNavigate }: AchievementGalleryScreenProps) {
  const { children, activeChild } = useAuth();
  const childId = activeChild?.id ?? children[0]?.id ?? "demo";

  const [demoMode, setDemoMode] = useState(false);
  const [tapCount, setTapCount] = useState(0);

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
      setTapCount(0);
    }
    setTimeout(() => setTapCount(0), 1000);
  }

  const progress = getProgress();
  const paperPlanes = demoMode ? 245 : getPaperPlanes();
  const level = demoMode ? 2 : getCurrentLevel();
  const completedIds = getCompletedStoryIds();
  const mastery = getMasteryProgress();
  const streak = demoMode ? 7 : progress.streak;
  const storiesCompleted = demoMode ? 10 : completedIds.length;

  const levelTitle = LEVEL_TITLES[level] ?? `Level ${level}`;
  const masteryPercent = demoMode
    ? 80
    : mastery.storiesRequired > 0
      ? Math.min(100, (mastery.storiesMastered / mastery.storiesRequired) * 100)
      : 0;

  const badges = useMemo(() => {
    const catalog = getCatalogByCategory("badge");
    const owned = new Set(getOwnedItems(childId));
    return catalog.map((item) => ({ ...item, unlocked: owned.has(item.id) }));
  }, [childId, demoMode]);

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const nextBadge = badges.find((b) => !b.unlocked);

  const coachMessage = unlockedCount === 0
    ? `Hey ${childName || "friend"}! Complete stories to start earning badges!`
    : unlockedCount >= 4
      ? `Incredible, ${childName || "friend"}! ${unlockedCount} badges earned — you're a real Story Pro!`
      : `Great job, ${childName || "friend"}! ${unlockedCount} ${unlockedCount === 1 ? "badge" : "badges"} so far — keep going!`;

  return (
    <div className="relative flex h-full flex-col bg-background">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-2 bg-card/95 px-4 py-3 backdrop-blur">
        <button
          onClick={onClose}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-soft transition-colors hover:bg-accent/60 active:scale-95"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <StoryProsLogo layout="row" size="sm" />
        <CurrencyBadge count={paperPlanes} />
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-28 pt-2">
        {/* Intro */}
        <div className="flex items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl font-extrabold text-primary">Your Rewards</h1>
            <p className="mt-0.5 max-w-[12rem] text-sm text-ink-soft">Earn Paper Planes, badges, and unlock magic!</p>
          </div>
          <img src={dariaAndFriend} alt="" className="h-20 w-auto object-contain" />
        </div>

        {/* Stars / level hero (triple-tap = demo) */}
        <section onClick={handleHeaderTap} className="mt-3 rounded-3xl border-2 border-secondary/50 bg-secondary/10 p-4 shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl">✈️</span>
              <div>
                <p className="font-display text-[28px] font-extrabold leading-none text-primary">{paperPlanes}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">Paper Planes</p>
              </div>
            </div>
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-extrabold text-primary-foreground">
              Lv.{level} · {levelTitle}
            </span>
          </div>
          <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-card">
            <div className="h-full rounded-full bg-success transition-all duration-500" style={{ width: masteryPercent + "%" }} />
          </div>
          <div className="mt-1.5 flex justify-between text-xs font-bold">
            <span className="text-success">{mastery.storiesMastered}/{mastery.storiesRequired} mastered</span>
            <span className="text-ink-soft">{mastery.ready ? "Ready to level up!" : `${Math.max(0, mastery.storiesRequired - mastery.storiesMastered)} more to level up`}</span>
          </div>
          {demoMode && <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-wider text-secondary-foreground/60">Demo mode active</p>}
        </section>

        {/* Coach bubble */}
        <section className="mt-4 flex items-end gap-2">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-coral/30">
            <img src={msLopez} alt="" className="h-full w-full object-cover object-top scale-[1.4] -translate-y-1" />
          </div>
          <div className="relative flex-1 rounded-2xl rounded-bl-sm bg-sky p-3 shadow-card">
            <p className="text-sm font-semibold leading-snug text-primary">{coachMessage}</p>
          </div>
        </section>

        {/* Featured next badge */}
        {nextBadge && (
          <section className="mt-5">
            <SectionHeader icon="⭐" title="Featured Reward" />
            <div className="flex items-center gap-3 rounded-3xl border border-accent/60 bg-card p-4 shadow-card">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-accent text-3xl">{nextBadge.icon}</span>
              <div className="min-w-0">
                <p className="font-extrabold text-primary">{nextBadge.name}</p>
                <p className="mt-0.5 text-xs font-semibold text-ink-soft">{nextBadge.unlockCondition ?? nextBadge.description}</p>
              </div>
            </div>
          </section>
        )}

        {/* Milestones */}
        <SectionHeader icon="🔥" title="Milestones" />
        <div className="space-y-3">
          <div className="rounded-3xl bg-secondary p-4 shadow-[0_4px_0_0_var(--secondary-deep)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card text-2xl">🔥</div>
              <div className="flex-1">
                <p className="text-base font-extrabold leading-tight text-secondary-foreground">
                  {streak > 0 ? `${streak} Day${streak !== 1 ? "s" : ""} in a Row!` : "Start Your Streak!"}
                </p>
                <p className="text-xs font-semibold text-secondary-foreground/80">
                  {streak > 0 ? "Keep the streak going!" : "Play today to begin!"}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border-2 border-primary/20 bg-primary/10 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card text-2xl">📖</div>
              <div className="flex-1">
                <p className="text-base font-extrabold leading-tight text-primary">
                  {storiesCompleted} {storiesCompleted === 1 ? "Story" : "Stories"} Completed
                </p>
                <p className="text-xs font-semibold text-ink-soft">
                  {storiesCompleted === 0 ? "Your adventure awaits!" : "Each story makes you stronger!"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Badges */}
        <SectionHeader icon="✨" title="My Badges" />
        <div className="grid grid-cols-2 gap-3">
          {badges.map((b) => (
            <BadgeCard key={b.id} badge={b} />
          ))}
        </div>

        <div className="mt-6">
          <TactileButton onClick={() => (onNavigate ? onNavigate("home") : onClose())}>Play to Earn More!</TactileButton>
        </div>
      </div>

      {onNavigate ? (
        <AppBottomNav active="achievements" onNavigate={onNavigate} />
      ) : null}
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="mb-3 mt-6 flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">{icon}</span>
      <h2 className="text-base font-extrabold text-primary">{title}</h2>
    </div>
  );
}

const RARITY_TONE: Record<string, string> = {
  common: "bg-sky",
  uncommon: "bg-secondary/40",
  rare: "bg-success/20",
  legendary: "bg-secondary",
};

function BadgeCard({ badge }: { badge: Collectible & { unlocked: boolean } }) {
  const toneBg = RARITY_TONE[badge.rarity] ?? "bg-sky";
  return (
    <div className={cn("rounded-3xl p-4 text-center transition-all", badge.unlocked ? "bg-card shadow-card" : "border-2 border-dashed border-cream-deep bg-cream/40")}>
      <div className={cn("relative mx-auto flex h-16 w-16 items-center justify-center rounded-full text-3xl", badge.unlocked ? toneBg : "bg-cream-deep")}>
        <span className={cn(badge.unlocked ? "" : "opacity-30")}>{badge.icon}</span>
        {!badge.unlocked && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-card text-xs shadow-sm">🔒</span>
        )}
      </div>
      <p className={cn("mt-3 text-sm font-extrabold leading-tight", badge.unlocked ? "text-primary" : "text-ink-soft")}>{badge.name}</p>
      <p className={cn("mt-1 text-xs font-semibold", badge.unlocked ? "text-ink-soft" : "text-ink-soft/70")}>
        {badge.unlocked ? badge.description : badge.unlockCondition ?? badge.description}
      </p>
    </div>
  );
}
