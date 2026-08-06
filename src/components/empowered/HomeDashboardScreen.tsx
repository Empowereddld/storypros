import { useEffect, useMemo, useState, type ReactNode } from "react";
import { BookOpen, CalendarDays, ShieldCheck } from "lucide-react";
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
  BookIcon,
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

  const greeting = `Hi, ${firstName}!`;
  const subtitle = doneToday
    ? "You did your story today. Great work!"
    : cont?.status === "in-progress"
      ? "Let's finish your story and keep your streak going!"
      : cont?.status === "replay"
        ? "You finished every story. Read a favourite again!"
        : "Let's start your story and build your streak!";

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
        <div className="mx-auto w-full max-w-[1180px]">
          {/* ── Greeting with star mascot ── */}
          <div className="flex items-center gap-3 lg:gap-4">
            <span
              aria-hidden
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary shadow-soft lg:h-[68px] lg:w-[68px]"
            >
              <StarIcon filled className="h-8 w-8 text-secondary lg:h-10 lg:w-10" />
            </span>
            <div className="min-w-0">
              <h1 className="text-[27px] font-extrabold leading-tight text-primary lg:text-[38px]">
                {greeting}
              </h1>
              <p className="mt-0.5 text-[15px] font-medium text-ink-soft lg:text-[17px]">
                {subtitle}
              </p>
            </div>
          </div>

          {/* ── Hero story + right rail ── */}
          <div className="mt-5 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-6">
            <div className="min-w-0">
              {cont && (
                <article className="overflow-hidden rounded-[32px] bg-card p-2.5 shadow-soft animate-slide-up lg:p-3">
                  <div className="relative h-[210px] w-full overflow-hidden rounded-[24px] bg-accent/40 lg:h-[300px]">
                    {cover ? (
                      <img src={cover} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-accent text-primary">
                        <BookOpen className="h-16 w-16" />
                      </div>
                    )}
                  </div>

                  <div className="relative px-2 pb-2 pt-3 lg:px-4">
                    {/* Book badge tucked over the image edge */}
                    <span
                      aria-hidden
                      className="absolute -top-8 left-2 flex h-16 w-16 items-center justify-center rounded-[22px] border-4 border-card bg-accent text-primary shadow-card lg:left-4"
                    >
                      <BookIcon className="h-7 w-7" />
                    </span>

                    <div className="ml-[76px] flex items-start justify-between gap-3 lg:ml-[80px]">
                      <h2 className="min-w-0 text-[23px] font-extrabold leading-[1.1] text-primary lg:text-[30px]">
                        {cont.story.title}
                      </h2>
                      <SpeakButton
                        text={cont.story.title}
                        label="Hear the story title"
                        tone="primary"
                        size="sm"
                      />
                    </div>



                    <div className="mt-4 flex items-center justify-between text-[13px] font-extrabold">
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
                          <span className="block font-medium text-ink-soft">
                            Come back tomorrow.
                          </span>
                        </p>
                        <button
                          onClick={openContinue}
                          className="mt-3 min-h-11 rounded-full border border-primary/30 px-4 text-xs font-extrabold text-primary"
                        >
                          Read more anyway
                        </button>
                      </div>
                    ) : (
                      <TactileButton className="mt-4 w-full" onClick={openContinue} noShadow>
                        {ctaLabel} <ChevronRightIcon className="h-5 w-5 text-secondary" />
                      </TactileButton>
                    )}
                  </div>
                </article>
              )}
            </div>

            {/* Right rail on laptop; flows underneath on phones/tablets */}
            <aside className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-0 lg:grid-cols-1 lg:gap-4">
              <div className="sm:col-span-2 lg:col-span-1">
                <WeekStrip week={week} playedDates={playedDates} days={daysThisWeek} today={today} />
              </div>
              <CoinsCard coins={coins} onOpenShop={() => onNavigate("shop")} />
              <BadgesCard
                childId={childId}
                completedCount={completedCount}
                onSeeAll={() => onNavigate("achievements")}
              />
            </aside>
          </div>

          {cont && cont.story.vocabulary_words.length > 0 && (
            <WordsStrip
              storyId={cont.story.id}
              words={cont.story.vocabulary_words}
              onViewAll={() => onNavigate("library")}
            />
          )}

          <div className="mt-6 flex justify-center lg:justify-end">
            <GrownUpsButton onEnter={() => navigate({ to: "/settings" })} />
          </div>
        </div>
      </div>

      <AppBottomNav active="home" onNavigate={(dest) => onNavigate(dest)} />
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
  const milestone =
    days >= 7
      ? "Seven days. Amazing!"
      : days === 5
        ? "Five days. You're on a roll!"
        : days === 3
          ? "Three days in a row!"
          : days === 1
            ? "First day done!"
            : "Read a story every day to keep your streak!";

  return (
    <Card>
      <CardHeading icon={<CalendarDays className="h-5 w-5 text-primary" />} title="This week" />

      <div className="mt-4 flex items-start justify-between gap-1">
        {week.map((date, i) => {
          const filled = playedDates.includes(date);
          const isToday = date === today;
          return (
            <span key={date} className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2",
                  filled
                    ? "border-secondary bg-secondary text-secondary-foreground"
                    : "border-accent bg-card",
                  isToday && "border-primary border-[3px]",
                )}
              >
                {filled && <StarIcon filled className="h-4 w-4" />}
                {!filled && isToday && <StarIcon filled className="h-4 w-4 text-secondary" />}
              </span>
              <span
                className={cn(
                  "text-[11px] font-bold",
                  isToday ? "text-primary" : "text-ink-soft",
                )}
              >
                {DAY_LABELS[i]}
              </span>
            </span>
          );
        })}
      </div>
      <p className="mt-3 text-[13px] font-medium leading-snug text-ink-soft">{milestone}</p>
    </Card>
  );
}

/* ───────── Coins (goal framing instead of a bare zero) ───────── */

function CoinsCard({ coins, onOpenShop }: { coins: number; onOpenShop: () => void }) {
  const goal = "Finish today's story to earn your first coins.";
  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <CardHeading
          icon={<CoinIcon className="h-6 w-6 text-secondary" />}
          title={coins > 0 ? `${coins} Coins` : "Coins"}
        />
      </div>

      <p className="mt-2 text-[13px] font-medium leading-snug text-ink-soft">
        {coins > 0 ? "Spend them in the Rewards shop!" : goal}
      </p>
      <button
        onClick={onOpenShop}
        className="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 border-secondary/70 px-5 text-[13px] font-extrabold text-secondary-foreground transition-transform active:scale-95"
      >
        Shop Rewards <ChevronRightIcon />
      </button>
    </Card>
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
        : "Your first badge is waiting. Keep reading!";

  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <CardHeading icon={<ShieldCheck className="h-5 w-5 text-primary" />} title="My Badges" />
        <button
          onClick={onSeeAll}
          className="inline-flex min-h-11 items-center gap-1 rounded-full px-2 text-[13px] font-extrabold text-primary"
        >
          See all <ChevronRightIcon />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-3">
        {shown.map((badge) => {
          const isEarned = owned.has(badge.id);
          return (
            <span
              key={badge.id}
              title={isEarned ? badge.name : "Coming soon"}
              className={cn(
                "relative flex h-14 w-14 items-center justify-center rounded-2xl text-2xl",
                isEarned ? "bg-secondary/25" : "bg-accent/60",
              )}
            >
              <span className={cn(!isEarned && "opacity-25 blur-[1px] grayscale")}>
                {badge.icon}
              </span>
              {!isEarned && (
                <LockIcon className="absolute h-5 w-5 text-primary/70" aria-hidden={false} />
              )}
            </span>
          );
        })}
        {shown.length === 0 && <MedalIcon className="h-6 w-6 text-primary/40" />}
      </div>
      <p className="mt-3 text-[13px] font-medium leading-snug text-ink-soft">{footnote}</p>
    </Card>
  );
}

/* ───────── Words you're learning ───────── */

function WordsStrip({
  storyId,
  words,
  onViewAll,
}: {
  storyId: string;
  words: VocabularyWord[];
  onViewAll: () => void;
}) {
  return (
    <section className="mt-5 rounded-[28px] bg-card p-4 shadow-soft lg:p-5">
      <div className="flex items-center justify-between gap-2">
        <CardHeading
          icon={<BookIcon className="h-5 w-5 text-primary" />}
          title="Words you're learning"
        />
        <button
          onClick={onViewAll}
          className="inline-flex min-h-11 items-center gap-1 rounded-full px-2 text-[13px] font-extrabold text-primary"
        >
          View all words <ChevronRightIcon />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {words.slice(0, 3).map((word) => {
          const image = resolveStoryImage(storyId, word.image);
          return (
            <div
              key={word.word}
              className="flex min-w-0 items-center gap-3 rounded-[22px] border border-accent/60 bg-card p-3 shadow-card"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent/50">
                {image ? (
                  <img src={image} alt="" className="h-full w-full object-contain p-1.5" />
                ) : (
                  <BookOpen className="h-6 w-6 text-primary" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-extrabold italic text-ink">
                  {word.word}
                </span>
                <span className="mt-0.5 block text-[13px] font-medium leading-snug text-ink-soft">
                  {word.sfa.function}
                </span>
              </span>
              <SpeakButton text={word.word} tone="soft" size="sm" />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CardHeading({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/60">
        {icon}
      </span>
      <span className="truncate text-[15px] font-extrabold text-ink">{title}</span>
    </span>
  );
}

function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-[24px] bg-card p-4 shadow-soft lg:p-5">{children}</div>;
}
