/* ─────────────────────────────────────────────
 * AudioButton — the one and only "tap to hear this" control
 *
 * One glyph (speaker), one meaning. It never becomes a play
 * triangle or a stop square, and it never animates while
 * playing — the playing state is a quiet tint + ring only.
 *
 * Sizes describe the VISIBLE circle. The tap target is always
 * at least 44px, whatever the circle size, so secondary
 * speakers can look small without being hard to press.
 *
 * It always stops event propagation, so it can sit safely
 * inside a selectable card without triggering the selection.
 * ───────────────────────────────────────────── */

import { cn } from "@/lib/utils";

export type AudioButtonSize = "lg" | "md" | "sm" | "xl";
export type AudioButtonTone = "primary" | "quiet";

/** Visible circle: xl 64px, lg 48px, md 40px, sm 32px */
const CIRCLE: Record<AudioButtonSize, string> = {
  xl: "h-16 w-16",
  lg: "h-12 w-12",
  md: "h-10 w-10",
  sm: "h-8 w-8",
};

const ICON: Record<AudioButtonSize, string> = {
  xl: "h-7 w-7",
  lg: "h-6 w-6",
  md: "h-5 w-5",
  sm: "h-4 w-4",
};

export interface AudioButtonProps {
  /** True while this control's audio is playing */
  playing?: boolean;
  onClick: () => void;
  /** Visible circle size (tap target stays >= 44px) */
  size?: AudioButtonSize;
  tone?: AudioButtonTone;
  /** Accessible name. Defaults to Hear "<text>" when `text` is given. */
  ariaLabel?: string;
  /** The words this button reads — used for the default accessible name */
  text?: string;
  /** Optional visible label, only where it genuinely adds clarity */
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function AudioButton({
  playing = false,
  onClick,
  size = "md",
  tone = "quiet",
  ariaLabel,
  text,
  label,
  disabled,
  className,
}: AudioButtonProps) {
  const name = ariaLabel ?? (text ? `Hear "${text}"` : "Hear this");

  function handle(event: React.MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    if (disabled) return;
    onClick();
  }

  return (
    <button
      type="button"
      onClick={handle}
      onPointerDown={(event) => event.stopPropagation()}
      disabled={disabled}
      aria-label={name}
      aria-pressed={playing}
      className={cn(
        // >= 44px tap target regardless of the visible circle
        "inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full transition-colors",
        label && "min-w-0 gap-2",
        disabled && "opacity-40",
        className,
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-full ring-2 transition-colors",
          CIRCLE[size],
          tone === "primary"
            ? playing
              ? "bg-primary text-primary-foreground ring-primary/45"
              : "bg-primary text-primary-foreground ring-transparent"
            : playing
              ? "bg-primary/15 text-primary ring-primary/40"
              : "bg-accent text-primary ring-transparent",
        )}
      >
        <SpeakerGlyph className={ICON[size]} />
      </span>
      {label && (
        <span className="text-sm font-extrabold uppercase tracking-wide text-primary">{label}</span>
      )}
    </button>
  );
}

export function SpeakerGlyph({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M4 9.5h3.2L12 5.2v13.6L7.2 14.5H4a1 1 0 01-1-1v-3a1 1 0 011-1z" />
      <path
        d="M15.5 8.8a4.6 4.6 0 010 6.4M18 6.3a8 8 0 010 11.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
    </svg>
  );
}
