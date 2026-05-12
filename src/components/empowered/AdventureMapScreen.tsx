import { useState } from "react";
import dariaSolo from "@/assets/daria-solo.png";
import childAvatar from "@/assets/child-avatar.png";
import { cn } from "@/lib/utils";

export type MapDestination = "story" | "comprehension" | "achievements";

interface AdventureMapScreenProps {
  childName: string;
  onReset: () => void;
  onNavigate: (destination: MapDestination) => void;
}

type PinStatus = "active" | "locked";
interface Pin {
  id: string;
  label: string;
  status: PinStatus;
  /** horizontal offset in px from the centerline (positive = right) */
  offset: number;
  /** vertical position in px down the canvas */
  y: number;
}

const PINS: Pin[] = [
  { id: "p1", label: "Dan and the Paper Cut", status: "active", offset: 0,    y: 80 },
  { id: "p2", label: "The Giant's Sneeze",    status: "locked", offset: 70,  y: 360 },
  { id: "p3", label: "Library of Whispers",   status: "locked", offset: -80, y: 600 },
  { id: "p4", label: "Castle of Commas",      status: "locked", offset: 50,  y: 840 },
];

const CANVAS_HEIGHT = 1020;

export function AdventureMapScreen({ onReset, onNavigate }: AdventureMapScreenProps) {
  const [openPin, setOpenPin] = useState<Pin | null>(null);

  function activate(pin: Pin) {
    if (pin.status === "locked") setOpenPin(pin);
    else onNavigate("story");
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
          <Chip tone="primary" icon={<StarIcon />}>Lv. 12</Chip>
          <Chip tone="secondary" icon={<CoinIcon />}>450</Chip>
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
              d={`M 200 60 C 320 220 80 380 240 ${PINS[1].y + 40}
                  C 360 ${PINS[1].y + 200} 80 ${PINS[2].y - 20} 120 ${PINS[2].y + 40}
                  C 40 ${PINS[2].y + 220} 320 ${PINS[3].y - 40} 240 ${PINS[3].y + 40}
                  C 160 ${PINS[3].y + 200} 200 ${CANVAS_HEIGHT - 60} 200 ${CANVAS_HEIGHT - 20}`}
              fill="none"
              stroke="oklch(0.86 0.018 305)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="4 14"
            />
          </svg>

          {/* Pins */}
          {PINS.map((pin) => (
            <PinNode key={pin.id} pin={pin} onClick={() => activate(pin)} />
          ))}
        </div>

        {/* Bottom spacer so nav + daily card don't cover content */}
        <div className="h-56" />
      </div>

      {/* Daily challenge */}
      <div className="absolute bottom-24 left-4 right-4 z-30">
        <div className="rounded-3xl bg-card/95 backdrop-blur p-4 shadow-soft border-2 border-accent/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
              <SparkleIcon />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Daily Challenge</p>
              <p className="text-sm text-ink-soft leading-snug">Read 5 pages to earn 50 coins!</p>
            </div>
          </div>
          <div className="h-2.5 w-full rounded-full bg-accent/60 overflow-hidden">
            <div className="h-full rounded-full bg-success" style={{ width: "60%" }} />
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] font-bold tracking-wider">
            <span className="text-ink-soft/70">3/5 PAGES</span>
            <span className="text-primary">60% COMPLETE</span>
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
            isActive
              ? "h-20 w-20 bg-secondary text-secondary-foreground shadow-[0_5px_0_0_var(--secondary-deep)] hover:scale-105 animate-pulse-glow"
              : "h-16 w-16 bg-muted text-muted-foreground shadow-[0_4px_0_0_oklch(0.86_0.018_305)] opacity-80",
          )}
        >
          {isActive ? (
            <span className="text-3xl font-extrabold leading-none">1</span>
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
          <div className="mt-1.5 flex gap-0.5 text-secondary">
            <StarIcon filled /><StarIcon filled /><StarIcon />
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
function CoinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="800" fill="oklch(0.30 0.05 80)">$</text>
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
