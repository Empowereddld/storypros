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
    { key: "home", label: "Home", dest: "home", icon: <HomeIcon /> },
    { key: "library", label: "Library", dest: "library", icon: <BookIcon /> },
    { key: "map", label: "Adventure Map", dest: "map", icon: <MapIcon /> },
    { key: "achievements", label: "Rewards", dest: "achievements", icon: <MedalIcon /> },
  ];
  return (
    // App-style tabs for phones/tablets; laptop uses the top DesktopNav instead
    <nav className="absolute bottom-0 left-0 right-0 z-30 flex items-end justify-around px-2 pt-2 pb-3 bg-card/95 backdrop-blur rounded-t-3xl border-t-4 border-accent/60 shadow-[0_-8px_30px_-10px_oklch(0.36_0.18_305/0.18)] lg:hidden">
      {items.map((it) => (
        <button
          key={it.key}
          onClick={() => onNavigate(it.dest)}
          aria-current={active === it.key ? "page" : undefined}
          className={cn(
            "flex flex-col items-center justify-center gap-0.5 rounded-2xl px-2.5 py-1.5 transition-all active:translate-y-0.5",
            active === it.key
              ? "bg-secondary text-secondary-foreground shadow-[0_4px_0_0_var(--secondary-deep)]"
              : "text-ink-soft/70 hover:bg-accent/40",
          )}
        >
          {it.icon}
          <span className="text-[10px] font-bold leading-none">{it.label}</span>
        </button>
      ))}
      {/* Review-period tab — navigates directly so screens don't need
          a new destination handler; remove before public launch */}
      <button
        onClick={() => navigate({ to: "/review" })}
        className="flex flex-col items-center justify-center gap-0.5 rounded-2xl px-2.5 py-1.5 text-ink-soft/70 transition-all hover:bg-accent/40 active:translate-y-0.5"
      >
        <FeedbackTabIcon />
        <span className="text-[10px] font-bold leading-none">Feedback</span>
      </button>
    </nav>
  );
}

function FeedbackTabIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <path d="M21 11.5a8.5 8.5 0 01-8.5 8.5c-1.3 0-2.6-.3-3.7-.8L3 21l1.8-5.8A8.5 8.5 0 1121 11.5z" strokeLinecap="round" strokeLinejoin="round" />
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
      <circle cx="12" cy="12" r="6.75" fill="none" stroke="#000" strokeOpacity="0.14" strokeWidth="1.4" />
      <path
        d="M12 7.2l1.15 3.05 3.25.2-2.55 2.05.9 3.15-2.75-1.85-2.75 1.85.9-3.15-2.55-2.05 3.25-.2L12 7.2z"
        fill="#000"
        fillOpacity="0.18"
      />
    </svg>
  );
}

export function BookCheckIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <path d="M4 5h7v15H6a2 2 0 01-2-2V5z" strokeLinejoin="round" />
      <path d="M13 5h7v8" strokeLinejoin="round" />
      <path d="M14 18l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HomeIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <path d="M4 11l8-7 8 7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9a1 1 0 001 1h10a1 1 0 001-1v-9" strokeLinejoin="round" />
    </svg>
  );
}

export function BookIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
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
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <circle cx="12" cy="15" r="5" />
      <path d="M8 3l4 7 4-7" strokeLinejoin="round" />
    </svg>
  );
}

export function MenuIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

export function StarIcon({ filled, className = "h-4 w-4" }: { filled?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden>
      <path strokeLinejoin="round" d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.8-5.4 2.8 1-6L3 9.4l6.1-.9L12 3z" />
    </svg>
  );
}

export function ChevronRightIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronLeftIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
      <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
