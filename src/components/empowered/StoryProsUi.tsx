/* ─────────────────────────────────────────────
 * Story Pros — shared UI primitives
 *
 * Small, reusable building blocks that match the
 * "Playful Clarity" design system (see DESIGN.md):
 * white cards, 24px radius, soft purple-tinted
 * shadows, tactile depth, Lexend type.
 *
 * Used by the new dashboard Home and reused across
 * the screens being rebuilt from the client mockups.
 * ───────────────────────────────────────────── */

import { type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useLongPressSpeak } from "./SpeakButton";

/* ───────── Currency badge (Coins) ───────── */

export function CurrencyBadge({
  count,
  onClick,
  className,
}: {
  count: number;
  onClick?: () => void;
  className?: string;
}) {
  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border-2 border-secondary/60 bg-secondary/25 px-3 py-1.5 text-sm font-bold leading-none text-secondary-foreground",
        className,
      )}
    >
      <CoinIcon className="h-4 w-4" />
      {count}
    </span>
  );
  if (!onClick) return content;
  return (
    <button
      onClick={onClick}
      aria-label={`${count} Coins — open shop`}
      className="active:scale-95 transition-transform"
    >
      {content}
    </button>
  );
}

/* ───────── Stat card (glanceable progress tile) ───────── */

type StatTone = "primary" | "secondary";

export function StatCard({
  icon,
  value,
  label,
  subtitle,
  tone = "primary",
  onClick,
}: {
  icon: ReactNode;
  value: ReactNode;
  label: string;
  subtitle?: string;
  tone?: StatTone;
  onClick?: () => void;
}) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      className={cn(
        "flex flex-1 items-center gap-3 rounded-3xl border border-accent/50 bg-card p-3.5 text-left shadow-card",
        onClick && "transition-transform active:scale-[0.98]",
      )}
    >
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
          tone === "primary"
            ? "bg-accent text-primary"
            : "bg-secondary/25 text-secondary-foreground",
        )}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="flex items-baseline gap-1.5">
          <span className="text-xl font-extrabold leading-none text-ink">{value}</span>
          <span className="truncate text-xs font-bold leading-tight text-primary">{label}</span>
        </span>
        {subtitle && (
          <span className="mt-0.5 block truncate text-[11px] leading-snug text-ink-soft">
            {subtitle}
          </span>
        )}
      </span>
    </Comp>
  );
}

/* ───────── Bottom navigation ───────── */

export type NavKey = "home" | "library" | "map" | "achievements";

export function AppBottomNav({
  active,
  onNavigate,
}: {
  active: NavKey;
  onNavigate: (destination: string) => void;
}) {
  const navigate = useNavigate();
  const items: { key: NavKey; label: string; dest: string; icon: ReactNode }[] = [
    { key: "home", label: "Home", dest: "home", icon: <HomeIcon className="h-7 w-7" /> },
    { key: "library", label: "Stories", dest: "library", icon: <BookIcon className="h-7 w-7" /> },
    { key: "map", label: "Map", dest: "map", icon: <MapIcon className="h-7 w-7" /> },
    {
      key: "achievements",
      label: "Rewards",
      dest: "achievements",
      icon: <MedalIcon className="h-7 w-7" />,
    },
  ];
  return (
    // App-style tabs for phones/tablets; laptop uses the top DesktopNav instead
    <nav className="absolute bottom-0 left-0 right-0 z-30 flex items-end justify-around gap-1 px-2 pt-2 pb-3 bg-card/95 backdrop-blur rounded-t-3xl border-t-4 border-accent/60 shadow-[0_-8px_30px_-10px_oklch(0.36_0.18_305/0.18)] lg:hidden">
      {items.map((it) => (
        <NavTab
          key={it.key}
          label={it.label}
          icon={it.icon}
          active={active === it.key}
          onActivate={() => onNavigate(it.dest)}
        />
      ))}
      {/* Review-period tab — navigates directly so screens don't need
          a new destination handler; remove before public launch */}
      <NavTab
        label="Feedback"
        icon={<FeedbackTabIcon className="h-7 w-7" />}
        onActivate={() => navigate({ to: "/review" })}
      />
    </nav>
  );
}

/** Icon-first tab: large icon above a short word, 44px+ target, long-press to hear */
function NavTab({
  label,
  icon,
  active,
  onActivate,
}: {
  label: string;
  icon: ReactNode;
  active?: boolean;
  onActivate: () => void;
}) {
  const press = useLongPressSpeak(label);
  return (
    <button
      {...press}
      onClick={() => {
        if (press.didSpeak()) return;
        onActivate();
      }}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-[58px] min-w-[58px] flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1.5 py-2 transition-all active:translate-y-0.5",
        active
          ? "bg-secondary text-secondary-foreground shadow-[0_4px_0_0_var(--secondary-deep)]"
          : "text-ink-soft hover:bg-accent/40",
      )}
    >
      {icon}
      <span className="text-[11px] font-extrabold leading-none">{label}</span>
    </button>
  );
}


function FeedbackTabIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden
    >
      <path
        d="M21 11.5a8.5 8.5 0 01-8.5 8.5c-1.3 0-2.6-.3-3.7-.8L3 21l1.8-5.8A8.5 8.5 0 1121 11.5z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 10h8M8 13.5h5" strokeLinecap="round" />
    </svg>
  );
}

/* ───────── Icons (rounded, thick stroke — brand style) ───────── */

export function PaperPlaneIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M21 3L3 10.5l7 2.5 2.5 7L21 3z" />
    </svg>
  );
}

export function CoinIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9.5" fill="currentColor" />
      <circle
        cx="12"
        cy="12"
        r="6.9"
        fill="none"
        stroke="var(--card)"
        strokeOpacity="0.55"
        strokeWidth="1.2"
      />
      <path
        d="M12 7.4l1.12 2.95 3.15.2-2.47 2 .87 3.05-2.67-1.8-2.67 1.8.87-3.05-2.47-2 3.15-.2L12 7.4z"
        fill="var(--card)"
      />
    </svg>
  );
}


export function BookCheckIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden
    >
      <path d="M4 5h7v15H6a2 2 0 01-2-2V5z" strokeLinejoin="round" />
      <path d="M13 5h7v8" strokeLinejoin="round" />
      <path d="M14 18l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HomeIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden
    >
      <path d="M4 11l8-7 8 7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9a1 1 0 001 1h10a1 1 0 001-1v-9" strokeLinejoin="round" />
    </svg>
  );
}

export function BookIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden
    >
      <path d="M4 5h7v15H6a2 2 0 01-2-2V5zM20 5h-7v15h5a2 2 0 002-2V5z" strokeLinejoin="round" />
    </svg>
  );
}

export function MapIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M4 5l5-2 6 2 5-2v16l-5 2-6-2-5 2V5z" />
    </svg>
  );
}

export function MedalIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden
    >
      <circle cx="12" cy="15" r="5" />
      <path d="M8 3l4 7 4-7" strokeLinejoin="round" />
    </svg>
  );
}

export function MenuIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      aria-hidden
    >
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

export function StarIcon({
  filled,
  className = "h-4 w-4",
}: {
  filled?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path
        strokeLinejoin="round"
        d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.8-5.4 2.8 1-6L3 9.4l6.1-.9L12 3z"
      />
    </svg>
  );
}

export function ChevronRightIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      aria-hidden
    >
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronLeftIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      aria-hidden
    >
      <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
