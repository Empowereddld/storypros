import { useState, useMemo } from "react";
import dariaSolo from "@/assets/daria-solo.png";
import childAvatar from "@/assets/child-avatar.png";
import { cn } from "@/lib/utils";
import { getStoriesByLevel } from "@/services/stories";
import { getCompletedStoryIds, getPaperPlanes, getCurrentLevel, getProgress } from "@/services/progress";
import type { StoryData } from "@/types/story";

export type MapDestination = "story" | "achievements";

interface AdventureMapScreenProps {
  childName: string;
  onReset: () => void;
  onNavigate: (destination: string) => void;
}

type PinStatus = "active" | "completed" | "locked";
interface Pin {
  id: string;
  storyId: string;
  label: string;
  status: PinStatus;
  stars: number; // 0-3 based on first-attempt accuracy
  /** horizontal offset in px from the centerline (positive = right) */
  offset: number;
  /** vertical position in px down the canvas */
  y: number;
}

/** Map alternating offsets for visual winding path */
const PIN_OFFSETS = [0, 70, -80, 50, -60, 70];
const PIN_Y_START = 80;
const PIN_Y_SPACING = 280;

function buildPins(level: number, completedIds: string[]): Pin[] {
  const stories = getStoriesByLevel(level);

  // If no stories from service, show placeholder pins
  if (stories.length === 0) {
    return [
      { id: "p1", storyId: "dans-papercut", label: "Dan and the Paper Cut", status: "active", stars: 0, offset: 0, y: 80 },
      { id: "p2", storyId: "coming-2", label: "The Giant's Sneeze", status: "locked", stars: 0, offset: 70, y: 360 },
      { id: "p3", storyId: "coming-3", label: "Library of Whispers", status: "locked", stars: 0, offset: -80, y: 600 },
      { id: "p4", storyId: "coming-4", label: "Castle of Commas", status: "locked", stars: 0, offset: 50, y: 840 },
    ];
  }

  let foundActive = false;
  return stories.map((story, i) => {
    const isCompleted = completedIds.includes(story.id);
    let status: PinStatus;

    if (isCompleted) {
      status = "completed";
    } else if (!foundActive) {
      status = "active";
      foundActive = true;
    } else {
      status = "locked";
    }

    // Calculate stars from completion data (placeholder: 2 stars for completed)
    const stars = isCompleted ? 2 : 0;

    return {
      id: `p${i + 1}`,
      storyId: story.id,
      label: story.title,
      status,
      stars,
      offset: PIN_OFFSETS[i % PIN_OFFSETS.length],
      y: PIN_Y_START + i * PIN_Y_SPACING,
    };
  });
}

const CANVAS_HEIGHT = 1020;

export function AdventureMapScreen({ childName, onReset, onNavigate }: AdventureMapScreenProps) {
  const [openPin, setOpenPin] = useState<Pin | null>(null);

  const level = getCurrentLevel();
  const completedIds = getCompletedStoryIds();
  const paperPlanes = getPaperPlanes();
  const progress = getProgress();

  const pins = useMemo(() => {
    const built = buildPins(level, completedIds);
    // Ensure at least 4 pins for visual completeness
    if (built.length < 4) {
      const placeholders: Pin[] = [
        { id: "ph2", storyId: "", label: "The Giant's Sneeze", status: "locked", stars: 0, offset: 70, y: 360 },
        { id: "ph3", storyId: "", label: "Library of Whispers", status: "locked", stars: 0, offset: -80, y: 600 },
        { id: "ph4", storyId: "", label: "Castle of Commas", status: "locked", stars: 0, offset: 50, y: 840 },
      ];
      return [...built, ...placeholders.slice(0, 4 - built.length)];
    }
    return built;
  }, [level, completedIds]);

  function activate(pin: Pin) {
    if (pin.status === "locked") {
      setOpenPin(pin);
    } else {
      // For completed or active stories, navigate to play
      onNavigate("story");
    }
  }

  return (
    <div className="relative flex h-full flex-col bg-background">
      {/* Top app bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-2 bg-card/95 backdrop-blur px-4 py-3 rounded-b-2xl border-b-4 border-accent/60 shadow-card">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 overflow-hidden rounded-full bg-accent border-2 border-primary">
            <img src={childAvatar} alt="" className="h-full w-full object-cover object-top scale-[1.6] translate-y-1" />
          </div>
          <span className="font-extrabold italic tracking-tight text-primary leading-none text-lg">
            Story<br />Pros
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Chip tone="primary" icon={<StarIcon />}>Lv. {level}</Chip>
          <Chip tone="secondary" icon={<PlaneIcon />}>{paperPlanes}</Chip>
          <button
            onClick={onReset}
            aria-label="Settings"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-soft hover:bg-accent/60 transition-colors active:scale-95"
          >
            <SettingsIcon />
          </button>
        </div>
      </header>

      {/* Map canvas (scrolls inside phone frame) */}
      <div className="relative flex-1 overflow-y-auto no-scrollbar">
        {/* Soft background glows */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute top-24 -left-12 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-40 -right-12 h-72 w-72 rounded-full bg-secondary/15 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto" style={{ height: CANVAS_HEIGHT, width: "100%" }}>
          {/* Dotted winding path */}
          <svg
            className="absolute inset-0 h-full w-full pointer-events-none"
            viewBox={`0 0 400 ${CANVAS_HEIGHT}`}
            preserveAspectRatio="none"
          >
            <path
              d={`M 200 60 C 320 220 80 380 240 ${pins[1]?.y ? pins[1].y + 40 : 400}
                  C 360 ${pins[1]?.y ? pins[1].y + 200 : 560} 80 ${pins[2]?.y ? pins[2].y - 20 : 580} 120 ${pins[2]?.y ? pins[2].y + 40 : 640}
                  C 40 ${pins[2]?.y ? pins[2].y + 220 : 820} 320 ${pins[3]?.y ? pins[3].y - 40 : 800} 240 ${pins[3]?.y ? pins[3].y + 40 : 880}
                  C 160 ${pins[3]?.y ? pins[3].y + 200 : 1040} 200 ${CANVAS_HEIGHT - 60} 200 ${CANVAS_HEIGHT - 20}`}
              fill="none"
              stroke="oklch(0.86 0.018 305)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="4 14"
            />
          </svg>

          {/* Pins */}
          {pins.map((pin) => (
            <PinNode key={pin.id} pin={pin} onClick={() => activate(pin)} />
          ))}
        </div>

        {/* Bottom spacer so nav + daily card don't cover content */}
        <div className="h-56" />
      </div>

      {/* Daily challenge / streak */}
      <div className="absolute bottom-24 left-4 right-4 z-30">
        <div className="rounded-3xl bg-card/95 backdrop-blur p-4 shadow-soft border-2 border-accent/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
              <SparkleIcon />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                {progress.streak > 0 ? `${progress.streak} Story Streak!` : "Daily Challenge"}
              </p>
              <p className="text-sm text-ink-soft leading-snug">
                {completedIds.length === 0
                  ? "Complete your first story to start earning Paper Planes!"
                  : `${completedIds.length} ${completedIds.length === 1 ? "story" : "stories"} completed — keep going!`}
              </p>
            </div>
          </div>
          <div className="h-2.5 w-full rounded-full bg-accent/60 overflow-hidden">
            <div
              className="h-full rounded-full bg-success transition-all duration-500"
              style={{ width: `${Math.min(100, (completedIds.length / Math.max(1, pins.filter(p => p.storyId).length)) * 100)}%` }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] font-bold tracking-wider">
            <span className="text-ink-soft/70">{completedIds.length}/{pins.filter(p => p.storyId).length} STORIES</span>
            <span className="text-primary">LEVEL {level}</span>
          </div>
        </div>
      </div>

      {/* Play FAB */}
      <button
        onClick={() => onNavigate("story")}
        aria-label="Play active adventure"
        className="absolute bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground btn-tactile translate-y-[-72px]"
      >
        <PlayIcon />
      </button>

      {/* Bottom nav */}
      <nav className="absolute bottom-0 left-0 right-0 z-30 flex items-end justify-around px-3 pt-2 pb-3 bg-card/95 backdrop-blur rounded-t-3xl border-t-4 border-accent/60 shadow-[0_-8px_30px_-10px_oklch(0.36_0.18_305/0.18)]">
        <NavItem icon={<BookIcon />} label="Library" onClick={() => setOpenPin({ id: "soon", label: "Library", status: "locked", offset: 0, y: 0 })} />
        <NavItem icon={<MapIcon />} label="Adventures" active />
        <NavItem icon={<MicIcon />} label="Speak" onClick={() => setOpenPin({ id: "soon", label: "Speak", status: "locked", offset: 0, y: 0 })} />
        <NavItem icon={<MedalIcon />} label="Rewards" onClick={() => onNavigate("achievements")} />
      </nav>

      {openPin && <ComingSoonSheet pin={openPin} onClose={() => setOpenPin(null)} />}
    </div>
  );
}

/* ───────── Pins ───────── */

function PinNode({ pin, onClick }: { pin: Pin; onClick: () => void }) {
  const isActive = pin.status === "active";
  const isCompleted = pin.status === "completed";
  const isLocked = pin.status === "locked";

  return (
    <div
      className="absolute left-1/2 flex flex-col items-center"
      style={{ top: pin.y, transform: `translate(calc(-50% + ${pin.offset}px), 0)` }}
    >
      <div className="relative">
        {isActive && (
          <img
            src={dariaSolo}
            alt=""
            className="absolute -top-14 -right-20 w-24 h-auto object-contain animate-float drop-shadow-[0_8px_12px_oklch(0.36_0.18_305/0.25)] pointer-events-none"
          />
        )}
        <button
          onClick={onClick}
          className={cn(
            "flex items-center justify-center rounded-full border-4 border-card transition-all active:translate-y-1",
            isActive && "h-20 w-20 bg-secondary text-secondary-foreground shadow-[0_5px_0_0_var(--secondary-deep)] hover:scale-105 animate-pulse-glow",
            isCompleted && "h-18 w-18 bg-success text-success-foreground shadow-[0_4px_0_0_oklch(0.45_0.15_155)] hover:scale-105",
            isLocked && "h-16 w-16 bg-muted text-muted-foreground shadow-[0_4px_0_0_oklch(0.86_0.018_305)] opacity-80",
          )}
        >
          {isCompleted ? (
            <svg viewBox="0 0 24 24" className="h-8 w-8" stroke="currentColor" strokeWidth="3" fill="none">
              <path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : isActive ? (
            <span className="text-3xl font-extrabold leading-none">
              <PlayIcon />
            </span>
          ) : (
            <LockIcon />
          )}
        </button>
      </div>

      {isActive ? (
        <div className="mt-3 bg-card px-5 py-3 rounded-2xl shadow-card border-b-4 border-accent/60 flex flex-col items-center min-w-[220px]">
          <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-ink-soft/70">
            Active Adventure
          </span>
          <h3 className="text-lg font-bold text-primary leading-tight text-center mt-0.5">
            {pin.label}
          </h3>
        </div>
      ) : isCompleted ? (
        <div className="mt-3 bg-card px-4 py-2.5 rounded-2xl shadow-card border-b-4 border-success/40 flex flex-col items-center min-w-[200px]">
          <h3 className="text-sm font-bold text-primary leading-tight text-center">
            {pin.label}
          </h3>
          <div className="mt-1.5 flex gap-0.5 text-secondary">
            {[1, 2, 3].map((n) => (
              <StarIcon key={n} filled={n <= pin.stars} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-3 bg-card/60 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-accent/40">
          <h3 className="text-sm font-medium text-ink-soft">{pin.label}</h3>
        </div>
      )}
    </div>
  );
}

/* ───────── Top-bar chips ───────── */

function Chip({
  icon,
  children,
  tone,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  tone: "primary" | "secondary";
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-full border-2 text-xs font-bold leading-none",
        tone === "primary"
          ? "bg-accent/60 border-accent text-primary"
          : "bg-secondary/25 border-secondary/60 text-secondary-foreground",
      )}
    >
      {icon}
      <span>{children}</span>
    </div>
  );
}

/* ───────── Bottom nav ───────── */

function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-0.5 rounded-2xl px-3 py-1.5 transition-all active:translate-y-0.5",
        active
          ? "bg-secondary text-secondary-foreground shadow-[0_4px_0_0_var(--secondary-deep)]"
          : "text-ink-soft/70 hover:bg-accent/40",
      )}
    >
      {icon}
      <span className="text-[11px] font-bold">{label}</span>
    </button>
  );
}

/* ───────── Modal ───────── */

function ComingSoonSheet({ pin, onClose }: { pin: Pin; onClose: () => void }) {
  return (
    <div
      className="absolute inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-[32px] bg-card p-6 pb-8 shadow-soft animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted" />
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-primary text-xl">
            🔒
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Coming soon</p>
            <p className="text-lg font-extrabold text-ink leading-tight">{pin.label}</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft">
          Finish today's adventure to unlock this stop on your map.
        </p>
        <button
          onClick={onClose}
          className="mt-5 h-12 w-full rounded-2xl bg-primary text-primary-foreground font-bold btn-tactile"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

/* ───────── Icons ───────── */

function StarIcon({ filled }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden>
      <path strokeLinejoin="round" d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.8-5.4 2.8 1-6L3 9.4l6.1-.9L12 3z" />
    </svg>
  );
}
function PlaneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
      <path d="M21 3L3 10.5l7 2.5 2.5 7L21 3z" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1A2 2 0 113.3 17l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H2a2 2 0 110-4h.1A1.7 1.7 0 003.6 9a1.7 1.7 0 00-.3-1.8l-.1-.1A2 2 0 116 4.3l.1.1a1.7 1.7 0 001.8.3H8a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" />
    </svg>
  );
}
function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden>
      <path d="M8 5l12 7-12 7z" />
    </svg>
  );
}
function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M12 2l1.7 5.3L19 9l-5.3 1.7L12 16l-1.7-5.3L5 9l5.3-1.7L12 2zM18 14l.8 2.4L21 17l-2.2.6L18 20l-.8-2.4L15 17l2.2-.6L18 14z" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" strokeLinecap="round" />
    </svg>
  );
}
function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 5h7v15H6a2 2 0 01-2-2V5zM20 5h-7v15h5a2 2 0 002-2V5z" strokeLinejoin="round" />
    </svg>
  );
}
function MapIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M4 5l5-2 6 2 5-2v16l-5 2-6-2-5 2V5z" />
    </svg>
  );
}
function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="9" y="3" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0014 0M12 18v3" strokeLinecap="round" />
    </svg>
  );
}
function MedalIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="15" r="5" />
      <path d="M8 3l4 7 4-7" strokeLinejoin="round" />
    </svg>
  );
}
