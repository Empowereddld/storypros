import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { getStoriesByLevel } from "@/services/stories";
import { getCompletedStoryIds, getCurrentLevel, getPaperPlanes } from "@/services/progress";
import { canAccessStory } from "@/services/subscription";
import { resolveStoryImage } from "@/services/storyImages";
import { getCheckpoint } from "@/services/checkpoint";
import { TOTAL_PLAYABLE_PHASES } from "@/services/continueStory";
import { useAuth } from "@/contexts/AuthContext";
import { MiniPlane, Star, StoryProsLogo } from "./StoryProsBrand";
import { TactileButton } from "./TactileButton";
import { AppBottomNav, ChevronRightIcon, CurrencyBadge, PaperPlaneIcon } from "./StoryProsUi";

export type MapDestination =
  | "story"
  | "achievements"
  | "settings"
  | "shop"
  | "dashboard"
  | "library"
  | "paywall";

interface AdventureMapScreenProps {
  childName: string;
  onReset: () => void;
  onNavigate: (destination: string, storyId?: string) => void;
}

type CheckpointState = "completed" | "current" | "available";

interface Checkpoint {
  storyId: string;
  title: string;
  cover: string | null;
  state: CheckpointState;
  storyNum: number;
  /** for the current story only */
  inProgress?: boolean;
  phaseIndex?: number;
}

/** Build the small, progression-focused checkpoint list (not a catalogue). */
function buildCheckpoints(
  level: number,
  completedIds: string[],
  childId: string,
): { checkpoints: Checkpoint[]; remaining: number; isFree: boolean } {
  const stories = getStoriesByLevel(level);
  const completedSet = new Set(completedIds);

  const accessible = stories
    .map((story, index) => ({ story, index }))
    .filter(({ story }) => (childId ? canAccessStory(childId, story.id) : true));

  const done = accessible.filter(({ story }) => completedSet.has(story.id));
  const open = accessible.filter(({ story }) => !completedSet.has(story.id));

  const picked: Checkpoint[] = [];

  // One recently completed checkpoint, for a sense of momentum.
  const lastDone = done[done.length - 1];
  if (lastDone) {
    picked.push({
      storyId: lastDone.story.id,
      title: lastDone.story.title,
      cover: resolveStoryImage(lastDone.story.id, lastDone.story.slides[0]?.image ?? ""),
      state: "completed",
      storyNum: lastDone.index + 1,
    });
  }

  open.slice(0, 3).forEach(({ story, index }, i) => {
    const cp = childId ? getCheckpoint(childId, story.id) : null;
    picked.push({
      storyId: story.id,
      title: story.title,
      cover: resolveStoryImage(story.id, story.slides[0]?.image ?? ""),
      state: i === 0 ? "current" : "available",
      storyNum: index + 1,
      inProgress: i === 0 ? Boolean(cp) : undefined,
      phaseIndex: i === 0 && cp ? Math.min(cp.phaseIndex, TOTAL_PLAYABLE_PHASES) : undefined,
    });
  });

  const remaining = stories.length - accessible.length + Math.max(0, open.length - 3);
  return { checkpoints: picked, remaining, isFree: accessible.length < stories.length };
}

export function AdventureMapScreen({ onNavigate }: AdventureMapScreenProps) {
  const { children, activeChild } = useAuth();
  const [, setProgressVersion] = useState(0);

  useEffect(() => {
    const onUpdate = () => setProgressVersion((version) => version + 1);
    window.addEventListener("storypros:progress-updated", onUpdate);
    return () => window.removeEventListener("storypros:progress-updated", onUpdate);
  }, []);

  const level = getCurrentLevel();
  const completedIds = getCompletedStoryIds();
  const paperPlanes = getPaperPlanes();
  const childId = activeChild?.id ?? children[0]?.id ?? "";

  const { checkpoints, remaining, isFree } = useMemo(
    () => buildCheckpoints(level, completedIds, childId),
    [level, completedIds, childId],
  );

  const completedCount = completedIds.length;

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#fff_0%,oklch(0.98_0.02_305)_45%,oklch(0.95_0.035_305)_100%)]" />
        <Star className="absolute left-8 top-40 h-4 w-4 text-secondary/70" />
        <Star className="absolute right-12 top-24 h-5 w-5 text-secondary/60" />
        <MiniPlane className="absolute right-16 top-[52%] h-7 w-7 rotate-[18deg] text-secondary/70" />
      </div>

      {/* App-style header for phones/tablets — laptop uses the top DesktopNav */}
      <header className="relative z-30 flex items-center justify-between gap-2 px-4 pb-1 pt-3 lg:hidden">
        <button
          onClick={() => onNavigate("home")}
          aria-label="Back to home"
          className="press-pop flex h-12 w-12 items-center justify-center rounded-full bg-card text-primary shadow-card"
        >
          <BackIcon />
        </button>
        <StoryProsLogo layout="row" size="sm" className="scale-95" />
        <CurrencyBadge
          count={paperPlanes}
          onClick={() => onNavigate("shop")}
          className="bg-card shadow-card"
        />
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar pb-28 lg:pb-12">
        <div className="mx-auto w-full max-w-[560px] px-4 pt-4 sm:px-6">
          <header className="text-center">
            <h1 className="font-display text-[30px] font-extrabold leading-tight text-primary sm:text-[34px]">
              Adventure Map
            </h1>
            <p className="mt-2.5 text-[15px] font-bold text-ink">Your next story is ready.</p>
            <p className="mt-1.5 text-[12px] font-semibold text-ink-soft">
              {completedCount} {completedCount === 1 ? "story" : "stories"} completed
            </p>
          </header>

          <div className="relative mt-10">
            {/* winding path behind the checkpoints */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path
                d="M 50 0 C 20 18, 80 32, 50 50 C 20 68, 80 82, 50 100"
                fill="none"
                stroke="oklch(0.83 0.08 305 / 0.55)"
                strokeWidth="9"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M 50 0 C 20 18, 80 32, 50 50 C 20 68, 80 82, 50 100"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="8 10"
                strokeLinecap="round"
                opacity="0.8"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            <ol className="relative space-y-10">
              {checkpoints.map((checkpoint, index) => (
                <li
                  key={checkpoint.storyId}
                  className={cn(
                    "relative",
                    index % 2 === 0 ? "mr-6 sm:mr-12" : "ml-6 sm:ml-12",
                  )}
                >
                  <CheckpointCard
                    checkpoint={checkpoint}
                    onStart={() => onNavigate("story", checkpoint.storyId)}
                  />

                </li>
              ))}

              {remaining > 0 && (
                <li className="relative mx-3 sm:mx-6">
                  <FutureMarker
                    isFree={isFree}
                    onUpgrade={() => onNavigate("paywall")}
                  />
                </li>
              )}
            </ol>
          </div>
        </div>
      </div>

      <AppBottomNav active="map" onNavigate={(destination) => onNavigate(destination)} />
    </div>
  );
}

function CheckpointCard({
  checkpoint,
  onStart,
}: {
  checkpoint: Checkpoint;
  onStart: () => void;
}) {
  const isCurrent = checkpoint.state === "current";
  const isCompleted = checkpoint.state === "completed";

  return (
    <div
      className={cn(
        "relative rounded-[24px] border bg-card/95 p-3.5 backdrop-blur",
        isCurrent
          ? "border-primary/30 bg-card px-4 pt-6 pb-5 shadow-[0_14px_28px_rgba(73,32,191,0.16)] ring-2 ring-secondary/60"
          : "border-accent/60 shadow-card",
        isCompleted && "bg-card/80",
      )}
    >
      {isCurrent && (
        <span className="absolute -top-3 left-4 rounded-full bg-secondary px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-secondary-foreground shadow-card">
          Next
        </span>
      )}

      <div className="flex items-center gap-3">
        <span
          className={cn(
            "relative shrink-0 overflow-hidden rounded-[18px] bg-accent",
            isCurrent ? "h-20 w-20" : "h-14 w-14",
          )}
        >
          {checkpoint.cover ? (
            <img
              src={checkpoint.cover}
              alt=""
              className={cn("h-full w-full object-cover", isCompleted && "opacity-80")}
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-primary">
              <PaperPlaneIcon className="h-7 w-7" />
            </span>
          )}
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-extrabold uppercase tracking-wide text-primary">
            Story {checkpoint.storyNum}
          </p>
          <p
            className={cn(
              "mt-0.5 font-extrabold leading-tight text-ink",
              isCurrent ? "text-[18px]" : "text-[14px]",
            )}
          >
            {checkpoint.title}
          </p>
          {isCompleted && (
            <p className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-[11px] font-extrabold text-success">
              <CheckIcon className="h-3.5 w-3.5" /> Completed
            </p>
          )}
          {checkpoint.state === "available" && (
            <p className="mt-1.5 inline-flex items-center rounded-full bg-accent/70 px-2.5 py-1 text-[11px] font-bold text-primary">
              Available
            </p>
          )}
          {isCurrent && checkpoint.inProgress && (
            <p className="mt-1.5 text-[12px] font-semibold text-ink-soft">
              {checkpoint.phaseIndex ?? 0} of {TOTAL_PLAYABLE_PHASES} sections complete
            </p>
          )}
        </div>

        {!isCurrent && (
          <button
            onClick={onStart}
            aria-label={`Open ${checkpoint.title}`}
            className="press-pop flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/60 text-primary"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {isCurrent && (
        <TactileButton
          onClick={onStart}
          className="mt-3.5 text-base"
          leadingIcon={<PaperPlaneIcon className="h-5 w-5" />}
        >
          {checkpoint.inProgress ? "Continue Story" : "Start Story"}
        </TactileButton>
      )}
    </div>
  );
}

function FutureMarker({ isFree, onUpgrade }: { isFree: boolean; onUpgrade: () => void }) {
  return (
    <div className="rounded-[24px] border border-dashed border-primary/25 bg-card/70 p-4 text-center backdrop-blur">
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-accent/70 text-primary">
        <LockIcon />
      </span>
      <p className="mt-2 text-[15px] font-extrabold text-ink">More stories ahead</p>
      <p className="mt-1 text-[13px] font-semibold leading-relaxed text-ink-soft">
        {isFree
          ? "Join Story Pros to continue your adventure."
          : "Finish a story to unlock the next one."}
      </p>
      {isFree && (
        <button
          onClick={onUpgrade}
          className="press-pop mt-3 inline-flex items-center rounded-full bg-accent/50 px-4 py-2 text-[13px] font-extrabold text-primary"
        >
          See Membership
        </button>
      )}
    </div>
  );
}

function BackIcon() {
  return (
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
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className ?? "h-5 w-5"}
      fill="none"
      stroke="currentColor"
      strokeWidth="3.2"
      aria-hidden
    >
      <path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      aria-hidden
    >
      <rect x="5" y="10" width="14" height="11" rx="3" />
      <path d="M8 10V8a4 4 0 018 0v2" strokeLinecap="round" />
    </svg>
  );
}
