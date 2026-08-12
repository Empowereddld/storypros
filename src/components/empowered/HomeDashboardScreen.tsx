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
import treasureChest from "@/assets/treasure-chest.png";



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
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-background lg:h-[calc(100dvh-5rem-1px)]">
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
      <header className="relative z-30 flex shrink-0 items-center justify-between gap-2 px-5 pb-1 pt-3 lg:hidden">
        <StoryProsLogo layout="row" size="md" className="scale-90" />
        <CurrencyBadge
          count={coins}
          onClick={() => onNavigate("shop")}
          className="min-h-11 px-4 py-2.5 text-base"
        />
      </header>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto no-scrollbar px-4 pb-28 pt-1 sm:overflow-hidden sm:pb-24 lg:px-8 lg:pb-6 lg:pt-4">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col sm:min-h-0 sm:flex-1">
          {/* ── Greeting ── */}
          <div className="flex shrink-0 items-end justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-[26px] font-extrabold leading-tight text-primary lg:text-[34px]">
                {greeting}
              </h1>
              <p className="mt-0.5 truncate text-[14px] font-medium text-ink-soft lg:text-[16px]">
                {subtitle}
              </p>
            </div>
            <div className="hidden shrink-0 sm:block">
              <GrownUpsButton onEnter={() => navigate({ to: "/settings" })} />
            </div>
          </div>

          {/* ── Hero story + right rail ── */}
          <div className="mt-3 sm:grid sm:min-h-0 sm:flex-1 sm:grid-cols-[minmax(0,1fr)_300px] sm:items-stretch sm:gap-4 lg:mt-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-6">
            <div className="flex min-h-0 min-w-0">
              {cont && (
                <article className="flex min-h-0 w-full flex-col overflow-hidden rounded-[28px] bg-card p-2.5 shadow-soft animate-slide-up lg:rounded-[32px] lg:p-3">
                  <div className="relative h-[190px] w-full shrink-0 overflow-hidden rounded-[22px] bg-accent/40 sm:h-auto sm:min-h-0 sm:flex-1">
                    {cover ? (
                      <img
                        src={cover}
                        alt=""
                        className="h-full w-full object-cover object-[50%_35%]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-accent text-primary">
                        <BookOpen className="h-16 w-16" />
                      </div>
                    )}
                  </div>

                  <div className="relative shrink-0 px-2 pb-1 pt-3 lg:px-4">
                    {/* Book badge tucked over the image edge */}
                    <span
                      aria-hidden
                      className="absolute -top-7 left-2 flex h-14 w-14 items-center justify-center rounded-[20px] border-4 border-card bg-accent text-primary shadow-card lg:left-4"
                    >
                      <BookIcon className="h-6 w-6" />
                    </span>

                    <div className="ml-[68px] flex items-center justify-between gap-3 lg:ml-[72px]">
                      <h2 className="min-w-0 truncate text-[20px] font-extrabold leading-[1.15] text-primary lg:text-[26px]">
                        {cont.story.title}
                      </h2>
                      <SpeakButton
                        text={cont.story.title}
                        label="Hear the story title"
                        tone="primary"
                        size="sm"
                      />
                    </div>

                    <div className="mt-3 rounded-[18px] bg-accent/25 px-4 py-2.5">
                      {cont.percent >= 100 ? (
                        <p className="text-center text-[14px] font-extrabold text-primary">
                          Story complete!
                        </p>
                      ) : (
                        <>
                          <div className="flex items-center justify-between text-[13px] font-extrabold">
                            <span className="text-ink-soft">
                              {cont.status === "in-progress"
                                ? `Part ${cont.phaseIndex} of ${cont.totalPhases}`
                                : `Part 1 of ${cont.totalPhases}`}
                            </span>
                            <span className="text-primary">{cont.percent}% complete</span>
                          </div>
                          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-card">
                            <div
                              className="h-full rounded-full bg-primary transition-all duration-500"
                              style={{
                                width: `${Math.max(cont.percent, cont.status === "in-progress" ? 6 : 0)}%`,
                              }}
                            />
                          </div>
                        </>
                      )}
                    </div>

                    {doneToday ? (
                      <div className="mt-3 flex items-center gap-3 rounded-[20px] border border-accent/70 bg-accent/30 p-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-card text-primary shadow-card">
                          <StarIcon filled className="h-6 w-6 text-secondary" />
                        </span>
                        <p className="min-w-0 flex-1 text-[14px] font-extrabold leading-snug text-primary">
                          You&apos;re done for today!
                          <span className="block font-medium text-ink-soft">
                            Come back tomorrow.
                          </span>
                        </p>
                        <button
                          onClick={openContinue}
                          className="min-h-11 shrink-0 rounded-full border border-primary/30 px-4 text-xs font-extrabold text-primary"
                        >
                          Read more
                        </button>
                      </div>
                    ) : (
                      <TactileButton className="mt-3 w-full" onClick={openContinue} noShadow>
                        {ctaLabel} <ChevronRightIcon className="h-5 w-5 text-secondary" />
                      </TactileButton>
                    )}
                  </div>
                </article>
              )}
            </div>

            {/* Right rail — compact stack that shares the same viewport height */}
            <aside className="mt-3 grid min-h-0 grid-cols-1 gap-3 sm:mt-0 sm:auto-rows-min sm:content-start lg:gap-4">
              <WeekStrip week={week} playedDates={playedDates} days={daysThisWeek} today={today} />
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

          <div className="mt-5 flex shrink-0 justify-center sm:hidden">
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

      <div className="mt-2 flex items-start justify-between gap-1">
        {week.map((date, i) => {
          const filled = playedDates.includes(date);
          const isToday = date === today;
          return (
            <span key={date} className="flex flex-col items-center gap-0.5">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border-2",
                  filled
                    ? "border-secondary bg-secondary text-secondary-foreground"
                    : "border-accent bg-card",
                  isToday && "border-primary border-[3px]",
                )}
              >
                {filled && <StarIcon filled className="h-3.5 w-3.5" />}
                {!filled && isToday && <StarIcon filled className="h-3.5 w-3.5 text-secondary" />}
              </span>
              <span
                className={cn(
                  "text-[10px] font-bold",
                  isToday ? "text-primary" : "text-ink-soft",
                )}
              >
                {DAY_LABELS[i]}
              </span>
            </span>
          );
        })}
      </div>
      <p className="mt-1.5 text-[11.5px] font-medium leading-snug text-ink-soft">{milestone}</p>


    </Card>
  );
}

/* ───────── Coins (goal framing instead of a bare zero) ───────── */

function CoinsCard({ coins, onOpenShop }: { coins: number; onOpenShop: () => void }) {
  const goal = "Finish today's story to earn your first coins.";
  return (
    <Card>
      <div className="relative flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <CardHeading
            icon={<CoinIcon className="h-6 w-6 text-secondary" />}
            title={coins > 0 ? `${coins} Coins` : "Coins"}
          />

          <p className="mt-1 hidden text-[12.5px] font-medium leading-snug text-ink-soft sm:block lg:hidden">
            {coins > 0 ? "Spend them in the Rewards shop!" : goal}
          </p>
          <button
            onClick={onOpenShop}
            className="mt-2 inline-flex min-h-9 items-center gap-1.5 rounded-full border-2 border-secondary/70 px-4 text-[12.5px] font-extrabold text-secondary-foreground transition-transform active:scale-95"
          >
            Shop Rewards <ChevronRightIcon />
          </button>
        </div>

        <img
          src={treasureChest}
          alt=""
          loading="lazy"
          width={816}
          height={816}
          className="pointer-events-none -mr-1 h-16 w-16 shrink-0 self-end object-contain drop-shadow-sm lg:h-20 lg:w-20"
        />


      </div>
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
          className="inline-flex min-h-9 items-center gap-1 rounded-full px-2 text-[12.5px] font-extrabold text-primary"
        >
          See all <ChevronRightIcon />
        </button>
      </div>

      <div className="mt-2 flex items-center gap-2">
        {shown.map((badge) => {
          const isEarned = owned.has(badge.id);
          return (
            <span
              key={badge.id}
              title={isEarned ? badge.name : "Coming soon"}
              className={cn(
                "relative flex h-11 w-11 items-center justify-center rounded-2xl text-xl",
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
      <p className="mt-1.5 text-[11.5px] font-medium leading-snug text-ink-soft">{footnote}</p>


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
    <section className="mt-3 shrink-0 rounded-[22px] bg-card p-3 shadow-soft lg:mt-4 lg:flex lg:items-center lg:gap-3 lg:p-3.5">
      <div className="flex shrink-0 items-center justify-between gap-2">
        <CardHeading
          icon={<BookIcon className="h-5 w-5 text-primary" />}
          title="Words you're learning"
        />
        <button
          onClick={onViewAll}
          className="inline-flex min-h-9 items-center gap-1 rounded-full px-2 text-[12.5px] font-extrabold text-primary lg:hidden"
        >
          View all <ChevronRightIcon />
        </button>
      </div>

      <div className="mt-2.5 grid min-w-0 flex-1 grid-cols-1 gap-2.5 sm:grid-cols-3 lg:mt-0">

        {words.slice(0, 3).map((word) => {
          const image = resolveStoryImage(storyId, word.image);
          return (
            <div
              key={word.word}
              className="flex min-w-0 items-center gap-2 rounded-full border border-accent/60 bg-card px-2 py-1.5 shadow-card"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent/50">
                {image ? (
                  <img src={image} alt="" className="h-full w-full object-contain p-1.5" />
                ) : (
                  <BookOpen className="h-4 w-4 text-primary" />
                )}
              </span>
              <span className="min-w-0 flex-1 truncate text-[14.5px] font-extrabold text-ink">
                {word.word}
              </span>
              <SpeakButton text={word.word} tone="soft" size="sm" />
            </div>
          );
        })}
      </div>

      <button
        onClick={onViewAll}
        className="hidden shrink-0 items-center gap-1 rounded-full px-2 text-[12.5px] font-extrabold text-primary lg:inline-flex"
      >
        View all <ChevronRightIcon />
      </button>
    </section>
  );
}


function CardHeading({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent/60">
        {icon}
      </span>
      <span className="truncate text-[14.5px] font-extrabold text-ink">{title}</span>
    </span>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-0 rounded-[22px] bg-card p-3.5 shadow-soft lg:p-4">{children}</div>
  );
}

