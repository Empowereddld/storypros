import { useEffect, useMemo, useState, type ReactNode } from "react";
import childAvatar from "@/assets/child-avatar.png";
import dariaSolo from "@/assets/daria-solo.png";
import { cn } from "@/lib/utils";
import { getStoriesByLevel } from "@/services/stories";
import { getCompletedStoryIds, getCurrentLevel, getPaperPlanes } from "@/services/progress";
import { canAccessStory } from "@/services/subscription";
import { resolveStoryImage } from "@/services/storyImages";
import { useAuth } from "@/contexts/AuthContext";
import { prettifyTheme } from "@/services/continueStory";
import { MiniPlane, Star, StoryProsLogo } from "./StoryProsBrand";
import { TactileButton } from "./TactileButton";
import {
  AppBottomNav,
  BookCheckIcon,
  ChevronRightIcon,
  CoinIcon,
  CurrencyBadge,
  PaperPlaneIcon,
} from "./StoryProsUi";

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

type PinStatus = "active" | "completed" | "locked";

interface Pin {
  id: string;
  storyId: string;
  label: string;
  theme: string;
  cover: string | null;
  status: PinStatus;
  offset: number;
  y: number;
  isPremium: boolean;
  storyNum: number;
}

const PIN_OFFSETS = [-50, 52, -34, 48, -54, 44, -36, 52, -46, 40, -50];
const PIN_Y_START = 132;
const PIN_Y_SPACING = 158;

function buildPins(level: number, completedIds: string[], childId: string): Pin[] {
  const stories = getStoriesByLevel(level);
  let foundActive = false;

  return stories.map((story, index) => {
    const isCompleted = completedIds.includes(story.id);
    const isPremium = !canAccessStory(childId, story.id);
    let status: PinStatus;

    if (isCompleted) {
      status = "completed";
    } else if (isPremium) {
      status = "locked";
    } else if (!foundActive) {
      status = "active";
      foundActive = true;
    } else {
      status = "locked";
    }

    return {
      id: `pin-${story.id}`,
      storyId: story.id,
      label: story.title,
      theme: story.theme,
      cover: resolveStoryImage(story.id, story.slides[0]?.image || "slide-01.webp"),
      status,
      offset: PIN_OFFSETS[index % PIN_OFFSETS.length],
      y: PIN_Y_START + index * PIN_Y_SPACING,
      isPremium,
      storyNum: index + 1,
    };
  });
}

function buildRoadPath(pins: Pin[], height: number): string {
  if (pins.length === 0) return "";
  const points = pins.map((pin) => ({ x: 200 + pin.offset, y: pin.y + 28 }));

  let d = `M ${points[0].x} ${Math.max(44, points[0].y - 118)}`;
  for (let index = 0; index < points.length - 1; index++) {
    const current = points[index];
    const next = points[index + 1];
    const midY = (current.y + next.y) / 2;
    const pull = next.x > current.x ? 88 : -88;
    d += ` C ${current.x + pull} ${midY - 40}, ${next.x - pull} ${midY + 40}, ${next.x} ${next.y}`;
  }

  const last = points[points.length - 1];
  d += ` C ${last.x + 52} ${last.y + 78}, ${last.x - 60} ${Math.min(height - 70, last.y + 130)}, ${last.x} ${Math.min(height - 24, last.y + 170)}`;
  return d;
}

export function AdventureMapScreen({ childName, onNavigate }: AdventureMapScreenProps) {
  const { children, activeChild } = useAuth();
  const [openPin, setOpenPin] = useState<Pin | null>(null);
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
  const firstName = (childName || activeChild?.name || "Story Pro").trim().split(/\s+/)[0];

  const pins = useMemo(
    () => buildPins(level, completedIds, childId),
    [level, completedIds, childId],
  );
  const activePin = pins.find((pin) => pin.status === "active") ?? pins[pins.length - 1];
  const completedCount = pins.filter((pin) => pin.status === "completed").length;
  const canvasHeight = Math.max(
    1420,
    PIN_Y_START + Math.max(0, pins.length - 1) * PIN_Y_SPACING + 330,
  );
  const progressPercent = pins.length > 0 ? Math.round((completedCount / pins.length) * 100) : 0;

  function activate(pin: Pin) {
    if (pin.status === "locked") {
      setOpenPin(pin);
      return;
    }
    onNavigate("story", pin.storyId);
  }

  function continueJourney() {
    if (!activePin) return;
    activate(activePin);
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#fff_0%,oklch(0.98_0.02_305)_42%,oklch(0.94_0.04_305)_100%)]" />
        <div className="absolute inset-x-0 top-[78px] h-px bg-primary/10" />
        <div className="absolute inset-x-8 top-[308px] h-px bg-primary/10" />
        <Star className="absolute left-9 top-40 h-4 w-4 text-secondary animate-sparkle" />
        <Star className="absolute right-14 top-56 h-6 w-6 text-secondary animate-sparkle" />
        <Star className="absolute left-12 bottom-40 h-4 w-4 text-primary/30 animate-sparkle" />
        <MiniPlane className="absolute right-20 top-9 h-8 w-8 rotate-[18deg] text-secondary drop-shadow-md animate-float" />
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

      <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar pb-44">
        <section className="relative min-h-[365px] px-4 pt-5 text-center">
          <img
            src={childAvatar}
            alt=""
            className="pointer-events-none absolute -left-3 top-20 z-10 h-52 w-auto object-contain drop-shadow-[0_18px_24px_rgba(63,38,140,0.18)]"
          />
          <img
            src={dariaSolo}
            alt=""
            className="pointer-events-none absolute -right-3 top-28 z-10 h-48 w-auto object-contain drop-shadow-[0_18px_24px_rgba(63,38,140,0.18)]"
          />

          <div className="relative z-20 mx-auto max-w-[184px]">
            <h1 className="font-display text-[27px] font-extrabold leading-[0.96] text-primary">
              <span className="block">Your</span>
              <span className="block">Adventure</span>
              <span className="block">Map</span>
            </h1>
            <p className="mt-2 text-[13px] font-semibold leading-snug text-ink-soft">
              Keep going, {firstName}. Every story builds your skills.
            </p>
          </div>

          <div className="relative z-20 mx-auto mt-11 grid max-w-[262px] grid-cols-3 overflow-hidden rounded-[26px] border border-accent/50 bg-card/92 shadow-soft backdrop-blur">
            <HeroStat
              icon={<BookCheckIcon className="h-7 w-7" />}
              value={completedCount}
              label={completedCount === 1 ? "Story Done" : "Stories Done"}
              tone="primary"
            />
            <HeroStat
              icon={<CoinIcon className="h-7 w-7" />}
              value={paperPlanes}
              label="Coins"
              tone="secondary"
            />
            <HeroStat
              icon={<MapPinIcon />}
              value={`${progressPercent}%`}
              label="Path"
              tone="primary"
            />
          </div>
        </section>

        {/* Map canvas keeps its designed 400px proportions; centers on wider screens */}
        {/* Map canvas keeps its designed 400px coordinate system; on laptop the
            whole canvas zooms up ~30% so road, pins, and covers stay in sync */}
        <section
          className="relative mx-auto -mt-2 w-full max-w-[430px] lg:[zoom:1.3]"
          style={{ height: canvasHeight }}
        >
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox={`0 0 400 ${canvasHeight}`}
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d={buildRoadPath(pins, canvasHeight)}
              fill="none"
              stroke="oklch(0.83 0.08 305 / 0.65)"
              strokeWidth="62"
              strokeLinecap="round"
            />
            <path
              d={buildRoadPath(pins, canvasHeight)}
              fill="none"
              stroke="oklch(0.69 0.17 305)"
              strokeWidth="46"
              strokeLinecap="round"
            />
            <path
              d={buildRoadPath(pins, canvasHeight)}
              fill="none"
              stroke="white"
              strokeWidth="4"
              strokeDasharray="18 18"
              strokeLinecap="round"
              opacity="0.72"
            />
          </svg>

          <span
            className="absolute left-7 top-[635px] h-9 w-14 rounded-[60%] bg-success/25 blur-sm"
            aria-hidden
          />
          <span
            className="absolute right-5 top-[990px] h-12 w-20 rounded-[60%] bg-success/25 blur-sm"
            aria-hidden
          />
          <span
            className="absolute left-8 bottom-16 h-10 w-20 rounded-[60%] bg-success/20 blur-sm"
            aria-hidden
          />

          {pins.map((pin) => (
            <PinNode key={pin.id} pin={pin} onClick={() => activate(pin)} />
          ))}
        </section>
      </div>

      <div className="absolute bottom-[78px] left-5 right-5 z-40">
        <button
          onClick={continueJourney}
          className="press-pop flex h-[76px] w-full items-center justify-between rounded-full border-[6px] border-card bg-primary px-7 text-primary-foreground shadow-[0_18px_28px_rgba(73,32,191,0.22)]"
        >
          <span className="flex items-center gap-3 text-[25px] font-extrabold leading-none">
            <PaperPlaneIcon className="h-9 w-9 text-secondary" />
            Continue Journey
          </span>
          <ChevronRightIcon className="h-7 w-7 text-primary-foreground" />
        </button>
      </div>

      <AppBottomNav active="map" onNavigate={(destination) => onNavigate(destination)} />

      {openPin && (
        <LockedStorySheet
          pin={openPin}
          onClose={() => setOpenPin(null)}
          onUpgrade={() => {
            setOpenPin(null);
            onNavigate("paywall");
          }}
        />
      )}
    </div>
  );
}

function HeroStat({
  icon,
  value,
  label,
  tone,
}: {
  icon: ReactNode;
  value: ReactNode;
  label: string;
  tone: "primary" | "secondary";
}) {
  return (
    <div className="flex min-h-[112px] flex-col items-center justify-center border-r border-accent/50 px-2 last:border-r-0">
      <span
        className={cn(
          "mb-2 flex h-12 w-12 items-center justify-center rounded-full shadow-card",
          tone === "primary"
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground",
        )}
      >
        {icon}
      </span>
      <span
        className={cn(
          "text-[23px] font-extrabold leading-none",
          tone === "primary" ? "text-primary" : "text-secondary",
        )}
      >
        {value}
      </span>
      <span className="mt-1 text-center text-[11px] font-bold leading-tight text-ink-soft">
        {label}
      </span>
    </div>
  );
}

function PinNode({ pin, onClick }: { pin: Pin; onClick: () => void }) {
  const isCompleted = pin.status === "completed";
  const isActive = pin.status === "active";
  const isLocked = pin.status === "locked";
  const placeCardRight = pin.offset <= 0;

  return (
    <div
      className="absolute left-1/2 z-20 flex items-center"
      style={{ top: pin.y, transform: `translate(calc(-50% + ${pin.offset}px), 0)` }}
    >
      <button
        onClick={onClick}
        className={cn(
          "relative z-20 flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-[6px] border-card transition-all active:translate-y-1",
          isCompleted &&
            "bg-success text-success-foreground shadow-[0_6px_0_0_oklch(0.45_0.15_155)]",
          isActive &&
            "bg-primary text-primary-foreground shadow-[0_7px_0_0_oklch(0.3_0.18_305)] animate-pulse-glow",
          isLocked &&
            (pin.isPremium
              ? "bg-card text-primary shadow-[0_6px_0_0_oklch(0.78_0.05_305)]"
              : "bg-muted text-ink-soft shadow-[0_6px_0_0_oklch(0.78_0.02_305)]"),
        )}
        aria-label={`${pin.label} ${pin.status}`}
      >
        {isCompleted ? (
          <CheckIcon />
        ) : isLocked ? (
          <LockIcon />
        ) : (
          <span className="text-[34px] font-extrabold">{pin.storyNum}</span>
        )}
        {isActive && (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-secondary px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-secondary-foreground shadow-card">
            Next
          </span>
        )}
        {isLocked && pin.isPremium && (
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-secondary px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide text-secondary-foreground shadow-card">
            Premium
          </span>
        )}
      </button>

      <button
        onClick={onClick}
        className={cn(
          "absolute top-1/2 z-10 flex min-h-[96px] w-[188px] -translate-y-1/2 items-center gap-2.5 rounded-[22px] border border-accent/60 bg-card/95 p-2.5 text-left shadow-card backdrop-blur transition-transform active:scale-[0.98]",
          placeCardRight ? "left-14 pl-8" : "right-14 flex-row-reverse pr-8 text-right",
          isLocked && "border-primary/15 bg-card/88",
        )}
      >
        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[18px] bg-accent">
          {pin.cover ? (
            <img
              src={pin.cover}
              alt=""
              className={cn("h-full w-full object-cover", isLocked && "grayscale-[0.25]")}
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-primary">
              <PaperPlaneIcon className="h-8 w-8" />
            </span>
          )}
          {isLocked && (
            <span className="absolute inset-0 flex items-center justify-center bg-ink/28 text-white">
              <LockIcon />
            </span>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-extrabold uppercase tracking-wide text-primary">
            Story {pin.storyNum}
          </span>
          <span className="mt-1 block text-[13px] font-extrabold leading-[1.05] text-ink">
            {pin.label}
          </span>
          <span className="mt-1.5 inline-flex items-center rounded-full bg-accent/70 px-2.5 py-1 text-[10px] font-bold text-primary">
            {isLocked ? (pin.isPremium ? "Premium" : "Locked") : prettifyTheme(pin.theme)}
          </span>
        </span>
      </button>
    </div>
  );
}

function LockedStorySheet({
  pin,
  onClose,
  onUpgrade,
}: {
  pin: Pin;
  onClose: () => void;
  onUpgrade: () => void;
}) {
  return (
    <div
      className="absolute inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-[32px] bg-card p-5 pb-7 shadow-soft animate-slide-up"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted" />
        <div className="relative overflow-hidden rounded-[28px] bg-accent shadow-card">
          <img
            src={pin.cover ?? undefined}
            alt=""
            className="h-40 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/72 via-ink/10 to-transparent" />
          <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-primary shadow-card">
            <LockIcon />
            {pin.isPremium ? "Premium story" : "Locked story"}
          </span>
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-xs font-extrabold uppercase tracking-wide text-secondary">
              Story {pin.storyNum} • {prettifyTheme(pin.theme)}
            </p>
            <h2 className="mt-1 text-2xl font-extrabold leading-tight text-white drop-shadow">
              {pin.label}
            </h2>
          </div>
        </div>

        {pin.isPremium ? (
          <>
            <div className="mt-4 rounded-[24px] border border-accent/70 bg-accent/35 p-4">
              <p className="text-[15px] font-extrabold leading-snug text-ink">
                Unlock the full adventure
              </p>
              <p className="mt-1 text-[13px] font-semibold leading-relaxed text-ink-soft">
                Free forever includes one complete story. Premium opens all 11 Story Pros
                stories, parent progress, and rewards for each child.
              </p>
              <div className="mt-3 flex items-center justify-between rounded-2xl bg-card px-4 py-3 shadow-card">
                <span className="text-[12px] font-bold uppercase tracking-wide text-primary">
                  Early adopter
                </span>
                <span className="text-lg font-extrabold text-primary">
                  $7.99/mo
                  <span className="ml-2 text-xs font-bold text-ink-soft line-through">$9.99/mo</span>
                </span>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-[1fr_auto] gap-3">
              <TactileButton
                variant="secondary"
                onClick={onUpgrade}
                className="text-base"
                leadingIcon={<PaperPlaneIcon className="h-6 w-6" />}
              >
                Unlock Premium
              </TactileButton>
              <button
                onClick={onClose}
                aria-label="Close premium story"
                className="press-pop flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary/15 bg-card text-primary shadow-card"
              >
                <CloseIcon />
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="mt-4 text-sm font-semibold leading-relaxed text-ink-soft">
              Finish the next story on your path to unlock this stop.
            </p>
            <TactileButton onClick={onClose} className="mt-5">
              Got it
            </TactileButton>
          </>
        )}
      </div>
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

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-9 w-9"
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
      className="h-7 w-7"
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

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      aria-hidden
    >
      <path d="M7 7l10 10M17 7L7 17" strokeLinecap="round" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      aria-hidden
    >
      <path d="M12 21s7-5.1 7-11a7 7 0 10-14 0c0 5.9 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
