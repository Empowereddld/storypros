import { useEffect, useMemo, useState, type ReactNode } from "react";
import { BookOpen } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { getCompletedStoryIds, getPaperPlanes, getPlayedDates } from "@/services/progress";
import { getContinueStory, type ContinueInfo } from "@/services/continueStory";
import { resolveStoryImage } from "@/services/storyImages";
import { getCatalogByCategory, getOwnedItems } from "@/services/shop";
import type { VocabularyWord } from "@/types/story";
import { TactileButton } from "@/components/empowered/TactileButton";
import { MiniPlane, LockIcon, Star, StoryProsLogo } from "@/components/empowered/StoryProsBrand";
import { SpeakButton } from "@/components/empowered/SpeakButton";
import { GrownUpsButton } from "@/components/empowered/GrownUpsButton";
import {
  AppBottomNav,
  ChevronRightIcon,
  CoinIcon,
  CurrencyBadge,
  MedalIcon,
  StarIcon,
} from "@/components/empowered/StoryProsUi";

interface HomeDashboardScreenProps {
  childName: string;
  onReset: () => void;
  onNavigate: (destination: string, storyId?: string) => void;
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Monday-first list of the current week's dates as YYYY-MM-DD */
function currentWeekDates(): string[] {
  const now = new Date();
  const dayOfWeek = (now.getDay() + 6) % 7; // 0 = Monday
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayOfWeek);
  return DAY_LABELS.map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
}

export function HomeDashboardScreen({ childName, onNavigate }: HomeDashboardScreenProps) {
  const { activeChild, children } = useAuth();
  const navigate = useNavigate();
  const childId = activeChild?.id ?? children[0]?.id ?? "";

  const [progressVersion, setProgressVersion] = useState(0);
  useEffect(() => {
    const onUpdate = () => setProgressVersion((v) => v + 1);
    window.addEventListener("storypros:progress-updated", onUpdate);
    return () => window.removeEventListener("storypros:progress-updated", onUpdate);
  }, []);

  const completedCount = getCompletedStoryIds().length;
  const coins = getPaperPlanes();
  const playedDates = getPlayedDates();
  const cont = useMemo<ContinueInfo | null>(
    () => getContinueStory(childId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childId, progressVersion],
  );

  const week = useMemo(currentWeekDates, [progressVersion]);
  const today = week[(new Date().getDay() + 6) % 7];
  const doneToday = playedDates.includes(today);
  const daysThisWeek = week.filter((d) => playedDates.includes(d)).length;

  const firstName = (childName || "Story Pro").trim().split(/\s+/)[0];
  const cover = cont
    ? resolveStoryImage(cont.story.id, cont.story.slides[0]?.image || "slide-01.webp")
    : null;
  const recap = cont?.story.recap ?? cont?.story.slides[2]?.text ?? "";

  const greeting = `Hi, ${firstName}!`;
  const subtitle = doneToday
    ? "You did your story today. Great work!"
    : cont?.status === "in-progress"
      ? "Let's finish your story."
      : cont?.status === "replay"
        ? "You finished every story. Read a favourite again!"
        : "Let's start your story.";

  const ctaLabel =
    cont?.status === "in-progress"
      ? "Continue Reading"
      : cont?.status === "replay"
        ? "Read Again"
        : "Start Story";

  function openContinue() {
    if (!cont) return;
    onNavigate("story", cont.story.id);
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-accent/15 to-accent/35" />
        <div className="absolute -left-12 top-32 h-28 w-40 rounded-full bg-accent/50 blur-2xl" />
        <div className="absolute -right-12 top-24 h-32 w-44 rounded-full bg-sky/50 blur-2xl" />
        <Star className="absolute left-12 top-28 h-4 w-4 text-secondary animate-sparkle" />
        <Star className="absolute right-8 top-36 h-5 w-5 text-secondary animate-sparkle" />
        <MiniPlane className="absolute right-16 top-9 h-8 w-8 rotate-[18deg] text-secondary drop-shadow-md animate-float" />
      </div>

      {/* App-style header for phones/tablets — laptop uses the top DesktopNav.
          No settings/account controls here: those live behind Grown-ups. */}
      <header className="relative z-30 flex items-center justify-between gap-2 px-5 pb-1 pt-3 lg:hidden">
        <StoryProsLogo layout="row" size="md" className="scale-90" />
        <CurrencyBadge
          count={coins}
          onClick={() => onNavigate("shop")}
          className="min-h-11 px-4 py-2.5 text-base"
        />
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar px-4 pb-28 pt-0 lg:px-8 lg:pb-10 lg:pt-6">
        <div className="lg:text-left">
          <h1 className="text-[27px] font-extrabold leading-tight text-primary lg:text-[34px]">
            {greeting}
          </h1>
          <p className="mt-1 text-[15px] font-medium text-ink-soft lg:text-base">{subtitle}</p>
        </div>


        {/* Laptop: story hero on the left, quick cards on the right */}
        <div className="mt-4 lg:grid lg:grid-cols-[1fr_320px] lg:items-start lg:gap-6">
          <div className="min-w-0">
            {cont && (
              <article className="overflow-hidden rounded-[32px] border-[6px] border-card bg-card shadow-soft animate-slide-up">
                <div className="relative h-[200px] w-full overflow-hidden rounded-[25px] bg-accent/40 lg:h-[260px]">
                  {cover ? (
                    <img src={cover} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-accent text-primary">
                      <BookOpen className="h-16 w-16" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-primary/70 via-primary/20 to-transparent" />

                </div>

                <div className="relative -mt-10 rounded-t-[32px] bg-card px-4 pb-4 pt-4 lg:px-5">
                  <div className="absolute -top-10 left-0 right-0 h-14 bg-card [clip-path:ellipse(62%_58%_at_50%_100%)]" />
                  <div className="relative">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="min-w-0 text-[23px] font-extrabold leading-[1.05] text-primary lg:text-[26px]">
                        {cont.story.title}
                      </h2>
                      <SpeakButton
                        text={`${cont.story.title}. ${recap}`}
                        label={`Hear the story title and what happened`}
                        tone="primary"
                        size="sm"
                      />
                    </div>
                    {recap && (
                      <p className="mt-2 text-[14px] font-medium leading-snug text-ink">{recap}</p>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs font-extrabold">
                    <span className="text-ink-soft">
                      {cont.status === "in-progress"
                        ? `Part ${cont.phaseIndex} of ${cont.totalPhases}`
                        : `Part 1 of ${cont.totalPhases}`}
                    </span>
                    <span className="text-primary">{cont.percent}% complete</span>
                  </div>
                  <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-accent/70">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{
                        width: `${Math.max(cont.percent, cont.status === "in-progress" ? 6 : 0)}%`,
                      }}
                    />
                  </div>

                  {doneToday ? (
                    <div className="mt-4 rounded-[24px] border border-accent/70 bg-accent/30 p-4 text-center">
                      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-card text-primary shadow-card">
                        <StarIcon filled className="h-6 w-6 text-secondary" />
                      </span>
                      <p className="mt-2 text-[15px] font-extrabold leading-snug text-primary">
                        You&apos;re done for today!
                        <span className="block font-medium text-ink-soft">Come back tomorrow.</span>
                      </p>

                      <button
                        onClick={openContinue}
                        className="mt-3 min-h-11 rounded-full border border-primary/30 px-4 text-xs font-extrabold text-primary"
                      >
                        Read more anyway
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4 flex items-center gap-2">
                      <TactileButton className="flex-1" onClick={openContinue}>
                        {ctaLabel} <ChevronRightIcon className="h-5 w-5 text-secondary" />
                      </TactileButton>
                    </div>

                  )}
                </div>
              </article>
            )}
          </div>

          {/* Right rail on laptop; flows underneath on phones/tablets */}
          <aside className="mt-3 lg:mt-0">
            <ProgressPanel
              week={week}
              playedDates={playedDates}
              days={daysThisWeek}
              today={today}
              coins={coins}
              childId={childId}
              completedCount={completedCount}
              onOpenShop={() => onNavigate("shop")}
              onSeeAll={() => onNavigate("achievements")}
            />
          </aside>
        </div>

        {cont && cont.story.vocabulary_words.length > 0 && (
          <WordsStrip storyId={cont.story.id} words={cont.story.vocabulary_words} />
        )}

        <div className="mt-6 flex justify-center lg:justify-end">
          <GrownUpsButton onEnter={() => navigate({ to: "/settings" })} />
        </div>
      </div>

      <AppBottomNav active="home" onNavigate={(dest) => onNavigate(dest)} />
    </div>
  );
}

/* ───────── Unified right-rail panel ───────── */

function ProgressPanel({
  week,
  playedDates,
  days,
  today,
  coins,
  childId,
  completedCount,
  onOpenShop,
  onSeeAll,
}: {
  week: string[];
  playedDates: string[];
  days: number;
  today: string;
  coins: number;
  childId: string;
  completedCount: number;
  onOpenShop: () => void;
  onSeeAll: () => void;
}) {
  return (
    <div className="rounded-[28px] border border-accent/50 bg-card p-4 shadow-card">
      <div className="space-y-4">
        <WeekStrip week={week} playedDates={playedDates} days={days} today={today} />
        <div className="border-t border-accent/30" />
        <CoinsCard coins={coins} onOpenShop={onOpenShop} />
        <div className="border-t border-accent/30" />
        <BadgesCard
          childId={childId}
          completedCount={completedCount}
          onSeeAll={onSeeAll}
        />
      </div>
    </div>
  );
}

/* ───────── Week streak strip (real per-day data) ───────── */

function WeekStrip({
  week,
  playedDates,
  days,
  today,
}: {
  week: string[];
  playedDates: string[];
  days: number;
  today: string;
}) {
  const reachedMilestone = days === 1 || days === 3 || days === 5 || days >= 7;
  const milestone =
    days >= 7
      ? "Seven days. Amazing!"
      : days === 5
        ? "Five days. You're on a roll!"
        : days === 3
          ? "Three days in a row!"
          : days === 1
            ? "First day done!"
            : "Read a story to fill a circle.";

  return (
    <section>
      <span className="text-sm font-extrabold text-ink">This week</span>

      <div className="mt-3 flex items-end justify-between gap-1">
        {week.map((date, i) => {
          const filled = playedDates.includes(date);
          const isToday = date === today;
          return (
            <span key={date} className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2",
                  filled
                    ? "border-secondary bg-secondary text-secondary-foreground"
                    : "border-accent bg-card",
                  isToday && !filled && "border-primary",
                )}
              >
                {filled && <StarIcon filled className="h-4 w-4" />}
              </span>
              <span className="text-[10px] font-bold text-ink-soft">{DAY_LABELS[i]}</span>
            </span>
          );
        })}
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-[12px] font-bold leading-snug text-primary">
        {reachedMilestone && (
          <Star className="h-3.5 w-3.5 text-secondary" aria-hidden />
        )}
        {milestone}
      </p>
    </section>
  );
}

/* ───────── Coins (goal framing instead of a bare zero) ───────── */

function CoinsCard({ coins, onOpenShop }: { coins: number; onOpenShop: () => void }) {
  const goal = "Finish today's story to earn your first coins.";
  return (
    <section>
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <CoinIcon className="h-6 w-6 text-secondary" />
          {coins > 0 ? (
            <span className="text-[26px] font-extrabold leading-none text-secondary-foreground">
              {coins}
            </span>
          ) : (
            <span className="text-sm font-extrabold text-ink">Coins</span>
          )}
        </span>
      </div>

      <p className="mt-1 text-[12px] font-bold leading-snug text-ink-soft">
        {coins > 0 ? "Spend them in the Shop!" : goal}
      </p>
      <button
        onClick={onOpenShop}
        className="mt-2 inline-flex min-h-11 items-center gap-1 rounded-full border border-secondary/60 px-4 text-xs font-extrabold text-secondary-foreground transition-transform active:scale-95"
      >
        Shop <ChevronRightIcon />
      </button>
    </section>
  );
}

/* ───────── Badges: earned in colour, next ones locked ───────── */

function BadgesCard({
  childId,
  completedCount,
  onSeeAll,
}: {
  childId: string;
  completedCount: number;
  onSeeAll: () => void;
}) {
  const badges = getCatalogByCategory("badge");
  const owned = new Set(childId ? getOwnedItems(childId) : []);
  const earned = badges.filter((b) => owned.has(b.id));
  const locked = badges.filter((b) => !owned.has(b.id)).slice(0, earned.length > 0 ? 2 : 3);
  const shown = [...earned.slice(0, 3), ...locked];

  const footnote =
    earned.length > 0
      ? "More badges are waiting."
      : completedCount > 0
        ? "Your first badge is coming soon."
        : "Your first badge is waiting.";



  return (
    <section>
      <span className="flex w-full items-center justify-between gap-2">
        <span className="text-sm font-extrabold text-ink">My Badges</span>

        <button
          onClick={onSeeAll}
          className="inline-flex min-h-11 items-center gap-1 rounded-full px-2 text-[12px] font-extrabold text-primary"
        >
          See All <ChevronRightIcon />
        </button>
      </span>

      <div className="mt-3 flex items-center gap-2">
        {shown.map((badge) => {
          const isEarned = owned.has(badge.id);
          return (
            <span
              key={badge.id}
              title={isEarned ? badge.name : "Coming soon"}
              className={cn(
                "relative flex h-12 w-12 items-center justify-center rounded-2xl text-xl",
                isEarned ? "bg-secondary/25" : "bg-accent/60",
              )}
            >
              <span className={cn(!isEarned && "opacity-25 blur-[1px] grayscale")}>
                {badge.icon}
              </span>
              {!isEarned && (
                <LockIcon className="absolute h-4 w-4 text-primary/70" aria-hidden={false} />
              )}
            </span>
          );
        })}
        {shown.length === 0 && <MedalIcon className="h-6 w-6 text-primary/40" />}
      </div>
      <p className="mt-2 text-[12px] font-bold leading-snug text-primary">
        {footnote}
      </p>
    </section>
  );
}

/* ───────── Words you're learning ───────── */

function WordsStrip({ storyId, words }: { storyId: string; words: VocabularyWord[] }) {
  const [openWord, setOpenWord] = useState<string | null>(null);
  const selected = words.find((w) => w.word === openWord) ?? null;

  return (
    <section className="mt-6">
      <h2 className="text-[17px] font-extrabold text-primary">Words you&apos;re learning</h2>


      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {words.slice(0, 5).map((word) => {
          const image = resolveStoryImage(storyId, word.image);
          const isOpen = openWord === word.word;
          return (
            <div
              key={word.word}
              className={cn(
                "flex min-w-0 flex-col items-center gap-2 rounded-[22px] border bg-card p-3 shadow-card",
                isOpen ? "border-primary" : "border-accent/60",
              )}
            >
              <button
                onClick={() => setOpenWord(isOpen ? null : word.word)}
                className="flex w-full flex-col items-center gap-2"
                aria-expanded={isOpen}
              >
                <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-accent/50">
                  {image ? (
                    <img src={image} alt="" className="h-full w-full object-contain p-1.5" />
                  ) : (
                    <BookOpen className="h-7 w-7 text-primary" />
                  )}
                </span>
                <span className="flex h-9 w-full items-center justify-center text-center text-[14px] font-extrabold leading-tight text-ink">
                  {word.word}
                </span>
              </button>
              <SpeakButton text={word.word} tone="soft" size="sm" />
            </div>
          );
        })}
      </div>


      {selected && (
        <div className="mt-3 rounded-[22px] border border-accent/70 bg-card p-4 shadow-card">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[16px] font-extrabold text-primary">{selected.word}</h3>
          </div>

          <p className="mt-1.5 text-[14px] font-medium leading-snug text-ink">
            {selected.sfa.function}
          </p>
          <p className="mt-1 text-[13px] leading-snug text-ink-soft">{selected.sfa.appearance}</p>
          <button
            onClick={() => setOpenWord(null)}
            className="mt-3 min-h-11 rounded-full border border-primary/30 px-4 text-xs font-extrabold text-primary"
          >
            Close
          </button>
        </div>
      )}
    </section>
  );
}

