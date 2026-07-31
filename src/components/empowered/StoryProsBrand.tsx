/* ─────────────────────────────────────────────
 * Story Pros — brand & auth scaffolding
 *
 * Shared pieces used across the onboarding / auth
 * screens, rebuilt to match the client mockups:
 *   • StoryProsLogo — paper-airplane-over-book mark
 *     + "STORY / PROS" wordmark (purple + gold)
 *   • AuthBackdrop — soft clouds, stars, mini planes
 *   • IconInput — rounded field with a leading icon
 *     (+ optional password reveal toggle)
 *
 * Character art (Dan & Daria) is referenced via the
 * existing placeholder asset until final art lands.
 * ───────────────────────────────────────────── */

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FEATURES } from "@/config/features";
import logoLockup from "@/assets/story-pros-logo.png";
import logoMark from "@/assets/story-pros-mark.png";
import logoWordmark from "@/assets/story-pros-wordmark.png";

/* ───────── Logo ───────── */

/**
 * The official Story Pros logo.
 * `row` uses the full horizontal lockup; `stacked` uses the
 * book-and-plane mark above the wordmark for narrow spaces.
 */
export function StoryProsLogo({
  layout = "row",
  size = "md",
  tagline = false,
  className,
}: {
  layout?: "row" | "stacked";
  size?: "sm" | "md" | "lg";
  tagline?: boolean;
  className?: string;
}) {
  const lockupHeight = { sm: "h-8", md: "h-11", lg: "h-16" }[size];
  const markHeight = { sm: "h-9", md: "h-14", lg: "h-20" }[size];
  const stackedWord = { sm: "h-5", md: "h-7", lg: "h-10" }[size];

  if (layout === "stacked") {
    return (
      <div className={cn("flex flex-col items-center text-center", className)}>
        <img src={logoMark} alt="" className={cn(markHeight, "w-auto object-contain")} />
        <img
          src={logoWordmark}
          alt="Story Pros"
          className={cn(stackedWord, "mt-1.5 w-auto object-contain")}
        />
        {tagline && (
          <p className="mt-2 text-sm font-bold text-primary/80">
            Read. <span className="text-secondary">Imagine.</span> Grow.
          </p>
        )}
      </div>
    );
  }

  return (
    <img
      src={logoLockup}
      alt="Story Pros"
      className={cn(lockupHeight, "w-auto object-contain", className)}
    />
  );
}

/** Open-book + paper-airplane icon (purple book, gold plane, dotted trail). */
export function BookPlaneMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 56" className={className} fill="none" aria-hidden>
      {/* dotted swoosh trail */}
      <path
        d="M14 30 C 22 14, 34 12, 46 8"
        stroke="var(--secondary-deep)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeDasharray="1 5"
        opacity="0.7"
      />
      {/* paper airplane */}
      <path
        d="M40 6 L60 2 L48 20 Z"
        fill="var(--secondary)"
        stroke="var(--secondary-deep)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M48 20 L46 12 L60 2 Z" fill="var(--secondary-deep)" />
      {/* sparkle */}
      <path
        d="M20 6 l1.6 3.4 3.4 1.6 -3.4 1.6 -1.6 3.4 -1.6 -3.4 -3.4 -1.6 3.4 -1.6 Z"
        fill="var(--secondary)"
      />
      {/* open book */}
      <path d="M6 34 C 16 28, 26 28, 32 34 L32 52 C 26 46, 16 46, 6 52 Z" fill="var(--primary)" />
      <path
        d="M58 34 C 48 28, 38 28, 32 34 L32 52 C 38 46, 48 46, 58 52 Z"
        fill="var(--primary)"
        opacity="0.82"
      />
      <path d="M32 34 L32 52" stroke="white" strokeWidth="1.6" opacity="0.6" />
    </svg>
  );
}

/* ───────── Decorative backdrop ───────── */

export function AuthBackdrop({ className }: { className?: string }) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      {/* base wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-accent/20 to-accent/45" />
      {/* soft cloud blobs */}
      <div className="absolute -top-6 -left-8 h-40 w-56 rounded-full bg-accent/40 blur-2xl" />
      <div className="absolute top-24 -right-10 h-36 w-52 rounded-full bg-sky/50 blur-2xl" />
      <div className="absolute bottom-10 -left-10 h-44 w-60 rounded-full bg-accent/40 blur-3xl" />
      {/* stars */}
      <Star className="absolute left-6 top-28 h-3.5 w-3.5 text-secondary/80" />
      <Star className="absolute right-8 top-16 h-3 w-3 text-primary/40" />
      <Star className="absolute right-12 top-44 h-4 w-4 text-secondary/70" />
      <Star className="absolute left-10 bottom-40 h-3 w-3 text-primary/30" />
      <Star className="absolute right-6 bottom-28 h-3.5 w-3.5 text-secondary/60" />
      {/* mini planes */}
      <MiniPlane className="absolute right-6 top-28 h-5 w-5 text-secondary/70 rotate-[12deg]" />
      <MiniPlane className="absolute left-8 top-52 h-4 w-4 text-primary/25 -rotate-12" />
    </div>
  );
}

export function Star({ className }: { className?: string }) {
  if (!FEATURES.decorations) return null;
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2l2.4 5.6L20 9l-4.6 3.8L17 19l-5-3-5 3 1.6-6.2L4 9l5.6-1.4L12 2z" />
    </svg>
  );
}

export function MiniPlane({ className }: { className?: string }) {
  if (!FEATURES.decorations) return null;
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M22 3L3 10.5l7 2.5 2.5 7L22 3z" />
    </svg>
  );
}

/* ───────── Icon input ───────── */

export function IconInput({
  id,
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  revealable = false,
  className,
}: {
  id?: string;
  icon: ReactNode;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  /** show a password reveal eye toggle */
  revealable?: boolean;
  className?: string;
}) {
  const [show, setShow] = useState(false);
  const effectiveType = revealable ? (show ? "text" : "password") : type;

  return (
    <div className={cn("relative", className)}>
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary/60">
        {icon}
      </span>
      <input
        id={id}
        type={effectiveType}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={cn(
          "w-full rounded-2xl border-2 border-primary/30 bg-card py-3.5 pl-12 text-base font-semibold text-ink placeholder:font-medium placeholder:text-ink-soft focus:border-primary focus:outline-none transition-colors",
          revealable ? "pr-12" : "pr-4",
        )}
      />

      {revealable && (
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full text-primary/60 hover:bg-accent/50 transition-colors"
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      )}
    </div>
  );
}

/* ───────── Field icons ───────── */

export function MailIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M3.5 7.5l8.5 6 8.5-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function LockIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <rect x="5" y="11" width="14" height="9" rx="2.5" />
      <path d="M8 11V8a4 4 0 018 0v3" strokeLinecap="round" />
    </svg>
  );
}
export function UserIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6" strokeLinecap="round" />
    </svg>
  );
}
export function SmileIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 14c.9 1.2 2.1 1.8 3.5 1.8s2.6-.6 3.5-1.8" strokeLinecap="round" />
      <circle cx="9" cy="10" r="0.6" fill="currentColor" />
      <circle cx="15" cy="10" r="0.6" fill="currentColor" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function EyeOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M3 3l18 18" strokeLinecap="round" />
      <path
        d="M10.6 6.2A9.7 9.7 0 0112 6c6.5 0 10 7 10 7a17 17 0 01-3.3 4M6.1 8.1A17 17 0 002 13s3.5 7 10 7a9.6 9.6 0 004.2-1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ───────── Google / Apple marks (for OAuth buttons) ───────── */

export function GoogleMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4c-.2 1.3-1 2.4-2 3.1v2.6h3.3c1.9-1.8 3-4.4 3-7.5z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.6c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3v2.6C4.7 19.9 8.1 22 12 22z"
        fill="#34A853"
      />
      <path d="M6.4 13.9a6 6 0 010-3.8V7.5H3a10 10 0 000 9l3.4-2.6z" fill="#FBBC05" />
      <path
        d="M12 6.1c1.5 0 2.8.5 3.8 1.5l2.9-2.9C17 3 14.7 2 12 2 8.1 2 4.7 4.1 3 7.5l3.4 2.6C7.2 7.9 9.4 6.1 12 6.1z"
        fill="#EA4335"
      />
    </svg>
  );
}
export function AppleMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M16.4 12.6c0-2.5 2-3.7 2.1-3.8-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.8.9s-2-.9-3.3-.9c-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.3.9 1.3 1.9 2.7 3.3 2.6 1.3-.1 1.8-.9 3.4-.9s2 .9 3.4.9c1.4 0 2.3-1.3 3.1-2.6.7-1 1.3-2.1 1.7-3.3-2.6-1-3.4-3.9-3.4-3.7zM14 5.6c.7-.9 1.2-2.1 1.1-3.3-1 0-2.3.7-3 1.5-.7.8-1.3 2-1.1 3.2 1.2.1 2.3-.5 3-1.4z" />
    </svg>
  );
}
