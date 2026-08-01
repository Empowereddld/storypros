import { useEffect, useMemo, useState, type ReactNode } from "react";
import { BookOpen, BookOpenCheck, Play } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { getCompletedStoryIds, getPaperPlanes } from "@/services/progress";
import { getContinueStory, prettifyTheme, type ContinueInfo } from "@/services/continueStory";
import { resolveStoryImage } from "@/services/storyImages";
import { TactileButton } from "@/components/empowered/TactileButton";
import { MiniPlane, Star, StoryProsLogo } from "@/components/empowered/StoryProsBrand";
import {
  AppBottomNav,
  ChevronRightIcon,
  CoinIcon,
  CurrencyBadge,
  MapIcon,
  MenuIcon,
} from "@/components/empowered/StoryProsUi";

interface HomeDashboardScreenProps {
  childName: string;
  onReset: () => void;
  onNavigate: (destination: string, storyId?: string) => void;
}

export function HomeDashboardScreen({ childName, onNavigate }: HomeDashboardScreenProps) {
  const { activeChild, children } = useAuth();
  const childId = activeChild?.id ?? children[0]?.id ?? "";

  const [progressVersion, setProgressVersion] = useState(0);
  useEffect(() => {
    const onUpdate = () => setProgressVersion((v) => v + 1);
    window.addEventListener("storypros:progress-updated", onUpdate);
    return () => window.removeEventListener("storypros:progress-updated", onUpdate);
  }, []);

  const completedCount = getCompletedStoryIds().length;
  const paperPlanes = getPaperPlanes();
  const cont = useMemo<ContinueInfo | null>(
    () => getContinueStory(childId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childId, progressVersion],
  );

  const firstName = (childName || "Story Pro").trim().split(/\s+/)[0];
  const cover = cont
    ? resolveStoryImage(cont.story.id, cont.story.slides[0]?.image || "slide-01.webp")
    : null;

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
        <Star className="absolute right-12 top-20 h-4 w-4 text-primary/30 animate-sparkle" />
        <Star className="absolute right-8 top-36 h-5 w-5 text-secondary animate-sparkle" />
        <MiniPlane className="absolute right-16 top-9 h-8 w-8 rotate-[18deg] text-secondary drop-shadow-md animate-float" />
      </div>

      {/* App-style header for phones/tablets — laptop uses the top DesktopNav */}
      <header className="relative z-30 flex items-center justify-between gap-2 px-5 pb-1 pt-3 lg:hidden">
        <button
          onClick={() => onNavigate("settings")}
          aria-label="Menu"
          className="press-pop flex h-12 w-12 items-center justify-center rounded-full bg-card text-primary shadow-card"
        >
          <MenuIcon />
        </button>
        <StoryProsLogo layout="row" size="md" className="scale-90" />
        <CurrencyBadge
          count={paperPlanes}
          onClick={() => onNavigate("shop")}
          className="shadow-card"
        />
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar px-4 pb-28 pt-0 lg:px-8 lg:pb-10 lg:pt-6">
        <div className="text-center lg:text-left">
          <h1 className="text-[27px] font-extrabold leading-tight text-primary lg:text-[34px]">
            Hi, {firstName}!
          </h1>
          <p className="mt-1 text-[15px] font-medium text-ink-soft lg:text-base">
            {cont?.status === "in-progress"
              ? "Ready to continue your adventure?"
              : cont?.status === "replay"
                ? "You've finished every story - replay a favorite!"
                : "Ready to start a new adventure?"}
          </p>
        </div>

        {/* Laptop: story hero on the left, quick actions on the right */}
        <div className="mt-4 lg:grid lg:grid-cols-[1fr_320px] lg:items-start lg:gap-6">
          <div className="min-w-0">
            {cont && (
              <article className="overflow-hidden rounded-[32px] border-[6px] border-card bg-card shadow-soft animate-slide-up hover-lift">
                <div className="relative h-[200px] w-full overflow-hidden rounded-[25px] bg-accent/40 lg:h-[260px]">
                  {cover ? (
                    <img src={cover} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-accent text-primary">
                      <BookOpen className="h-16 w-16" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-primary/70 via-primary/20 to-transparent" />
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-primary-foreground shadow-card">
                    <Play className="h-3.5 w-3.5 fill-current" />
                    {cont.status === "in-progress"
                      ? "Continue Story"
                      : cont.status === "replay"
                        ? "Replay Story"
                        : "Next Story"}
                  </span>
                </div>

                <div className="relative -mt-10 rounded-t-[32px] bg-card px-4 pb-4 pt-4 lg:px-5">
                  <div className="absolute -top-10 left-0 right-0 h-14 bg-card [clip-path:ellipse(62%_58%_at_50%_100%)]" />
                  <div className="relative">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="min-w-0 text-[23px] font-extrabold leading-[1.05] text-primary lg:text-[26px]">
                        {cont.story.title}
                      </h2>
                      <span className="mt-1 shrink-0 rounded-full bg-accent px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-primary">
                        Level {cont.story.level}
                      </span>
                    </div>
                    <p className="mt-2 text-[13px] font-medium leading-snug text-ink-soft">
                      Practising {prettifyTheme(cont.story.theme).toLowerCase()}.
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs font-extrabold">
                    <span className="text-ink-soft">
                      {cont.status === "in-progress"
                        ? `Part ${cont.phaseIndex} of ${cont.totalPhases}`
                        : "Not started yet"}
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

                  <TactileButton className="mt-4" onClick={openContinue}>
                    {cont.status === "in-progress"
                      ? "Continue Reading"
                      : cont.status === "replay"
                        ? "Read Again"
                        : "Start Story"}{" "}
                    <ChevronRightIcon className="h-5 w-5 text-secondary" />
                  </TactileButton>
                </div>
              </article>
            )}
          </div>

          {/* Right rail on laptop; flows underneath on phones/tablets */}
          <aside className="mt-3 lg:mt-0 lg:sticky lg:top-2">
            <button
              onClick={() => onNavigate("map")}
              className="press-pop flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-primary/30 bg-card/70 py-3 text-sm font-bold text-primary shadow-card transition-colors hover:bg-card"
            >
              <MapIcon className="h-4 w-4" />
              Explore the Adventure Map
              <ChevronRightIcon />
            </button>

            <div className="mt-3 grid grid-cols-2 gap-3 stagger-in lg:grid-cols-1">
              <StatCardLite
                tone="primary"
                icon={<BookOpenCheck className="h-5 w-5" />}
                value={completedCount}
                label={completedCount === 1 ? "Story Completed" : "Stories Completed"}
                subtitle={
                  completedCount === 0 ? "Finish one to start!" : "You're a real Story Pro!"
                }
              />
              <StatCardLite
                tone="secondary"
                icon={<CoinIcon className="h-6 w-6" />}
                value={paperPlanes}
                label="Coins"
                subtitle="Spend them in the Shop!"
                onClick={() => onNavigate("shop")}
              />
            </div>
          </aside>
        </div>
      </div>


      <AppBottomNav active="home" onNavigate={(dest) => onNavigate(dest)} />
    </div>
  );
}

function StatCardLite({
  icon,
  value,
  label,
  subtitle,
  tone,
  onClick,
}: {
  icon: ReactNode;
  value: ReactNode;
  label: string;
  subtitle?: string;
  tone: "primary" | "secondary";
  onClick?: () => void;
}) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      className={cn(
        "flex min-h-[104px] flex-col items-start justify-between rounded-[24px] border border-accent/50 bg-card p-3 text-left shadow-card",
        onClick && "transition-transform active:scale-[0.98]",
      )}
    >
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px]",
          tone === "primary"
            ? "bg-accent text-primary"
            : "bg-secondary/25 text-secondary-foreground",
        )}
      >
        {icon}
      </span>
      <span className="mt-3 min-w-0">
        <span className="block text-[22px] font-extrabold leading-none text-ink">{value}</span>
        <span className="mt-1 block text-sm font-extrabold leading-tight text-primary">
          {label}
        </span>
        {subtitle && (
          <span className="mt-1 block text-[11px] leading-snug text-ink-soft">{subtitle}</span>
        )}
      </span>
    </Comp>
  );
}
