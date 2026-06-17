/* ─────────────────────────────────────────────
 * Home Dashboard — "Continue your adventure"
 *
 * Rebuilt from the client mockup
 * ("Continue Your Adventure Story Pro") with the
 * confirmed changes:
 *   • personalized greeting
 *   • real in-progress story in the Continue card
 *   • stat cards = Stories Completed + Paper Planes
 *     (no daily streak, no story-creation)
 *   • bottom nav routes to the Adventure Map
 *
 * Adventure Map remains the "browse all stories"
 * destination, reachable from here.
 * ───────────────────────────────────────────── */

import { useEffect, useMemo, useState } from "react";
import storyHero from "@/assets/daria-and-friend.webp";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { getCompletedStoryIds, getPaperPlanes } from "@/services/progress";
import { getContinueStory, prettifyTheme, type ContinueInfo } from "@/services/continueStory";
import { TactileButton } from "@/components/empowered/TactileButton";
import {
  AppBottomNav,
  BookCheckIcon,
  ChevronRightIcon,
  CurrencyBadge,
  MapIcon,
  MenuIcon,
  PaperPlaneIcon,
  StarIcon,
} from "@/components/empowered/StoryProsUi";

interface HomeDashboardScreenProps {
  childName: string;
  onReset: () => void;
  onNavigate: (destination: string, storyId?: string) => void;
}

export function HomeDashboardScreen({ childName, onNavigate }: HomeDashboardScreenProps) {
  const { activeChild, children } = useAuth();
  const childId = activeChild?.id ?? children[0]?.id ?? "";

  // Re-render when cloud hydration refreshes the progress cache
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

  function openContinue() {
    if (!cont) return;
    if (cont.locked) {
      onNavigate("story", cont.story.id); // story route redirects locked → paywall
      return;
    }
    onNavigate("story", cont.story.id);
  }

  return (
    <div className="relative flex h-full flex-col bg-background">
      {/* Top app bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-2 bg-card/95 px-4 py-3 backdrop-blur">
        <button
          onClick={() => onNavigate("settings")}
          aria-label="Menu"
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/60 text-primary transition-colors hover:bg-accent active:scale-95"
        >
          <MenuIcon />
        </button>
        <span className="flex items-center gap-1 text-lg font-extrabold italic tracking-tight text-primary">
          <PaperPlaneIcon className="h-5 w-5 text-secondary" />
          Story Pros
        </span>
        <CurrencyBadge count={paperPlanes} onClick={() => onNavigate("shop")} />
      </header>

      {/* Scroll area */}
      <div className="relative flex-1 overflow-y-auto no-scrollbar px-4 pb-32 pt-2">
        {/* Greeting */}
        <h1 className="text-2xl font-extrabold leading-tight text-primary">
          Hi, {firstName}!
        </h1>
        <p className="mt-0.5 text-sm text-ink-soft">
          {cont?.status === "in-progress"
            ? "Ready to continue your adventure?"
            : cont?.status === "replay"
              ? "You've finished every story — replay a favorite!"
              : "Ready to start a new adventure?"}
        </p>

        {/* Continue card */}
        {cont && (
          <article className="mt-4 overflow-hidden rounded-[28px] border border-accent/50 bg-card shadow-card">
            {/* Hero */}
            <div className="relative h-44 w-full overflow-hidden bg-accent/40">
              <img src={storyHero} alt="" className="h-full w-full object-cover" />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-primary-foreground shadow-card">
                {cont.status === "in-progress" ? "Continue Story" : cont.status === "replay" ? "Replay Story" : "Next Story"}
              </span>
            </div>

            {/* Body */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-2">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                    <StarIcon filled className="h-4 w-4" />
                  </span>
                  <h2 className="text-lg font-extrabold leading-tight text-primary">
                    {cont.story.title}
                  </h2>
                </div>
                <span className="shrink-0 rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold text-primary">
                  {prettifyTheme(cont.story.theme)}
                </span>
              </div>

              {/* Progress row */}
              <div className="mt-4 flex items-center justify-between text-xs font-bold">
                <span className="text-ink-soft">
                  {cont.status === "in-progress"
                    ? `Part ${cont.phaseIndex} of ${cont.totalPhases}`
                    : "Not started yet"}
                </span>
                <span className="text-primary">{cont.percent}% complete</span>
              </div>
              <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-accent/60">
                <div
                  className="h-full rounded-full bg-success transition-all duration-500"
                  style={{ width: `${Math.max(cont.percent, cont.status === "in-progress" ? 6 : 0)}%` }}
                />
              </div>

              <TactileButton className="mt-5" onClick={openContinue}>
                {cont.status === "in-progress" ? "Continue Reading" : cont.status === "replay" ? "Read Again" : "Start Story"}
              </TactileButton>
            </div>
          </article>
        )}

        {/* Browse-more path → Adventure Map */}
        <button
          onClick={() => onNavigate("map")}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-primary/30 bg-transparent py-3 text-sm font-bold text-primary transition-colors hover:bg-primary/5 active:translate-y-0.5"
        >
          <MapIcon className="h-4 w-4" />
          Explore the Adventure Map
          <ChevronRightIcon />
        </button>

        {/* Stat cards */}
        <div className="mt-4 flex gap-3">
          <StatCardLite
            tone="primary"
            icon={<BookCheckIcon />}
            value={completedCount}
            label={completedCount === 1 ? "Story Completed" : "Stories Completed"}
            subtitle={completedCount === 0 ? "Finish one to start!" : "You're a real Story Pro!"}
          />
          <StatCardLite
            tone="secondary"
            icon={<PaperPlaneIcon className="h-5 w-5" />}
            value={paperPlanes}
            label="Paper Planes"
            subtitle="Spend them in the Shop!"
            onClick={() => onNavigate("shop")}
          />
        </div>
      </div>

      {/* Bottom nav */}
      <AppBottomNav active="home" onNavigate={(dest) => onNavigate(dest)} />
    </div>
  );
}

/* Local stat tile (kept inline to control the exact home layout) */
function StatCardLite({
  icon,
  value,
  label,
  subtitle,
  tone,
  onClick,
}: {
  icon: React.ReactNode;
  value: React.ReactNode;
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
        "flex flex-1 items-center gap-2.5 rounded-3xl border border-accent/50 bg-card p-3 text-left shadow-card",
        onClick && "transition-transform active:scale-[0.98]",
      )}
    >
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
          tone === "primary" ? "bg-accent text-primary" : "bg-secondary/25 text-secondary-foreground",
        )}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xl font-extrabold leading-none text-ink">{value}</span>
        <span className="mt-0.5 block text-[11px] font-bold leading-tight text-primary">{label}</span>
        {subtitle && <span className="block text-[10px] leading-snug text-ink-soft">{subtitle}</span>}
      </span>
    </Comp>
  );
}
