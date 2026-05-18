/* ─────────────────────────────────────────────
 * Achievement Gallery Screen
 * Shows real badges, streaks, level, Paper Planes
 * from progress + shop services.
 *
 * Demo mode: triple-tap the level card header
 * to load a showcase state for presentations.
 * ───────────────────────────────────────────── */

import { useState, useMemo } from "react";
import { TactileButton } from "./TactileButton";
import childAvatar from "@/assets/child-avatar.png";
import msLopez from "@/assets/ms-lopez.png";
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

interface AchievementGalleryScreenProps {
  childName: string;
  onClose: () => void;
}

// ── Level titles by level number ──
const LEVEL_TITLES: Record<number, string> = {
  1: "Story Starter",
  2: "Word Builder",
  3: "Narrative Navigator",
};

// ── Demo showcase data ──
function loadDemoState(childId: string) {
  // Award all badges for demo
  awardBadge(childId, "badge-first-story");
  awardBadge(childId, "badge-3-stories");
  awardBadge(childId, "badge-perfect");
  awardBadge(childId, "badge-5-streak");
  awardBadge(childId, "badge-all-elements");
}

export function AchievementGalleryScreen({ childName, onClose }: AchievementGalleryScreenProps) {
  const { children, activeChild } = useAuth();
  const childId = activeChild?.id ?? children[0]?.id ?? "demo";

  const [demoMode, setDemoMode] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  // Triple-tap the header to toggle demo mode
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
    // Reset tap counter after 1 second
    setTimeout(() => setTapCount(0), 1000);
  }

  // ── Live data from services ──
  const progress = getProgress();
  const paperPlanes = demoMode ? 245 : getPaperPlanes();
  const level = demoMode ? 2 : getCurrentLevel();
  const completedIds = getCompletedStoryIds();
  const mastery = getMasteryProgress();
  const streak = demoMode ? 7 : progress.streak;
  const storiesCompleted = demoMode ? 10 : completedIds.length;

  const levelTitle = LEVEL_TITLES[level] ?? `Level ${level}`;

  // Mastery progress as percentage for the XP bar
  const masteryPercent = demoMode
    ? 80
    : mastery.storiesRequired > 0
      ? Math.min(100, (mastery.storiesMastered / mastery.storiesRequired) * 100)
      : 0;

  // ── Badges from shop catalog ──
  const badges = useMemo(() => {
    const catalog = getCatalogByCategory("badge");
    const owned = new Set(getOwnedItems(childId));
    return catalog.map((item) => ({
      ...item,
      unlocked: owned.has(item.id),
    }));
  }, [childId, demoMode]); // demoMode dependency forces re-read after demo load

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  // Coach message adapts to progress
  const coachMessage = unlockedCount === 0
    ? `Hey ${childName || "friend"}! Complete stories to start earning badges!`
    : unlockedCount >= 4
      ? `Incredible, ${childName || "friend"}! You've earned ${unlockedCount} badges! You're a real Story Pro!`
      : `Great job, ${childName || "friend"}! You've earned ${unlockedCount} ${unlockedCount === 1 ? "badge" : "badges"}! Keep going to unlock more!`;

  return (
    <div className="flex h-full flex-col bg-cream">
      {/* Header */}
      <header className="flex items-center gap-3 px-5 pt-3 pb-3">
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full text-primary hover:bg-primary/10"
          aria-label="Back"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" stroke="currentColor" strokeWidth="2.5" fill="none">
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="flex-1 text-center font-display text-xl font-extrabold text-primary">
          My Achievements
        </h1>
        <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary/30 bg-sky">
          <img src={childAvatar} alt="" className="h-full w-full object-cover object-top scale-[1.6] translate-y-1" />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-32">
        {/* Level card */}
        <section
          className="rounded-3xl bg-card p-4 shadow-card"
          onClick={handleHeaderTap}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                Current status
              </p>
              <p className="mt-0.5 text-lg font-extrabold text-primary">
                Level {level} — {levelTitle}
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-secondary-foreground shadow-[0_3px_0_0_var(--secondary-deep)]">
              <span className="text-base">✈️</span>
              <span className="text-sm font-extrabold">{paperPlanes}</span>
            </div>
          </div>
          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-cream-deep">
            <div
              className="h-full rounded-full bg-success transition-all duration-500"
              style={{ width: `${masteryPercent}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs font-bold">
            <span className="text-success">
              {mastery.storiesMastered}/{mastery.storiesRequired} mastered
            </span>
            <span className="text-ink-soft">
              {mastery.ready ? "Ready for next level!" : `${mastery.storiesRequired - mastery.storiesMastered} more to level up`}
            </span>
          </div>

          {demoMode && (
            <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-wider text-secondary-foreground/60">
              Demo mode active
            </p>
          )}
        </section>

        {/* Coach speech bubble */}
        <section className="mt-5 flex items-end gap-2">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-coral/30">
            <img src={msLopez} alt="" className="h-full w-full object-cover object-top scale-[1.4] -translate-y-1" />
          </div>
          <div className="relative flex-1 rounded-2xl rounded-bl-sm bg-sky p-3 shadow-card">
            <p className="text-sm font-semibold leading-snug text-primary">
              {coachMessage}
            </p>
          </div>
        </section>

        {/* Milestones — streak + stories completed */}
        <SectionHeader icon="⭐" title="Milestones" />
        <div className="space-y-3">
          <div className="rounded-3xl bg-secondary p-4 shadow-[0_4px_0_0_var(--secondary-deep)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card text-2xl">🔥</div>
              <div className="flex-1">
                <p className="text-base font-extrabold text-secondary-foreground leading-tight">
                  {streak > 0 ? `${streak} Day${streak !== 1 ? "s" : ""} in a Row!` : "Start Your Streak!"}
                </p>
                <p className="text-xs font-semibold text-secondary-foreground/80">
                  {streak > 0 ? "Keep the streak going!" : "Play today to begin!"}
                </p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-card/80 px-3 py-1.5">
                <span className="text-sm">🔥</span>
                <span className="text-sm font-extrabold text-secondary-foreground">{streak}</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-primary/10 p-4 border-2 border-primary/20">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card text-2xl">📖</div>
              <div className="flex-1">
                <p className="text-base font-extrabold text-primary leading-tight">
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
          <TactileButton onClick={onClose}>Play to Earn More!</TactileButton>
          <p className="mt-3 text-center text-sm font-semibold text-ink-soft">
            {storiesCompleted > 0
              ? `You're doing amazing, ${childName || "Champ"}!`
              : `Let's start your journey, ${childName || "Champ"}!`}
          </p>
        </div>
      </div>

      {/* Bottom nav */}
      <nav className="absolute bottom-0 left-0 right-0 flex items-center justify-around border-t border-border bg-card/95 px-2 pt-2 pb-4 backdrop-blur">
        {[
          { label: "Learn", icon: "📚" },
          { label: "Play", icon: "🎮" },
          { label: "Awards", icon: "🏅", active: true },
          { label: "Profile", icon: "👤" },
        ].map((tab) => (
          <button
            key={tab.label}
            onClick={onClose}
            className={cn(
              "flex flex-col items-center gap-1 rounded-2xl px-4 py-1.5 text-[11px] font-bold",
              tab.active ? "bg-primary text-primary-foreground" : "text-ink-soft",
            )}
          >
            <span className="text-base">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="mt-6 mb-3 flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
        {icon}
      </span>
      <h2 className="text-base font-extrabold text-primary">{title}</h2>
    </div>
  );
}

// ── Badge tone mapping by rarity ──
const RARITY_TONE: Record<string, string> = {
  common: "bg-sky",
  uncommon: "bg-secondary/40",
  rare: "bg-success/20",
  legendary: "bg-secondary",
};

function BadgeCard({ badge }: { badge: Collectible & { unlocked: boolean } }) {
  const toneBg = RARITY_TONE[badge.rarity] ?? "bg-sky";

  return (
    <div
      className={cn(
        "rounded-3xl p-4 text-center transition-all",
        badge.unlocked ? "bg-card shadow-card" : "border-2 border-dashed border-cream-deep bg-cream/40",
      )}
    >
      <div
        className={cn(
          "relative mx-auto flex h-16 w-16 items-center justify-center rounded-full text-3xl",
          badge.unlocked ? toneBg : "bg-cream-deep",
        )}
      >
        <span className={cn(badge.unlocked ? "" : "opacity-30")}>{badge.icon}</span>
        {!badge.unlocked && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-card text-xs shadow-sm">
            🔒
          </span>
        )}
      </div>
      <p className={cn("mt-3 text-sm font-extrabold leading-tight", badge.unlocked ? "text-primary" : "text-ink-soft")}>
        {badge.name}
      </p>
      <p className={cn("mt-1 text-xs font-semibold", badge.unlocked ? "text-ink-soft" : "text-ink-soft/70")}>
        {badge.unlocked ? badge.description : badge.unlockCondition ?? badge.description}
      </p>
    </div>
  );
}
