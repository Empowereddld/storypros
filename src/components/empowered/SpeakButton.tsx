/* ─────────────────────────────────────────────
 * Tap-to-hear building blocks
 *
 * SpeakButton   — a 44px speaker button that reads text aloud.
 * SpeakableText — text with the speaker button beside it.
 * useLongPressSpeak — long-press a nav item to hear its label.
 *
 * Rules: the child always starts the audio, and tapping a
 * speaker never navigates (the handler stops propagation).
 * ───────────────────────────────────────────── */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { speakLabel, stopLabelSpeech } from "@/lib/speak";

export function SpeakButton({
  text,
  label,
  size = "md",
  tone = "primary",
  className,
}: {
  text: string;
  /** Accessible name; defaults to "Hear …" */
  label?: string;
  size?: "sm" | "md";
  tone?: "primary" | "secondary" | "soft";
  className?: string;
}) {
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => () => stopLabelSpeech(), []);

  function handle(event: React.MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    if (speaking) {
      stopLabelSpeech();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    speakLabel(text, () => setSpeaking(false));
  }

  return (
    <button
      type="button"
      onClick={handle}
      aria-label={label ?? `Hear "${text}"`}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full transition-transform active:scale-95",
        // 44px minimum tap target on every speaker
        "min-h-11 min-w-11",
        size === "sm" ? "h-11 w-11" : "h-12 w-12",
        tone === "primary" && "bg-primary text-primary-foreground shadow-card",
        tone === "secondary" && "bg-secondary text-secondary-foreground shadow-card",
        tone === "soft" && "bg-accent text-primary",
        speaking && "animate-pulse",
        className,
      )}
    >
      <SpeakerIcon className={size === "sm" ? "h-5 w-5" : "h-6 w-6"} />
    </button>
  );
}

export function SpeakableText({
  text,
  children,
  tone = "soft",
  size = "sm",
  className,
  align = "start",
}: {
  /** What gets read aloud */
  text: string;
  /** Rendered text (defaults to `text`) */
  children?: ReactNode;
  tone?: "primary" | "secondary" | "soft";
  size?: "sm" | "md";
  className?: string;
  align?: "start" | "center";
}) {
  return (
    <span
      className={cn(
        "flex items-center gap-2",
        align === "center" ? "justify-center" : "justify-start",
        className,
      )}
    >
      <span className="min-w-0">{children ?? text}</span>
      <SpeakButton text={text} tone={tone} size={size} />
    </span>
  );
}

/**
 * Long-press handlers that speak a label. Attach to nav items so a
 * press-and-hold reads the word without triggering navigation.
 */
export function useLongPressSpeak(text: string, holdMs = 500) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const spoke = useRef(false);

  function clear() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }

  useEffect(() => clear, []);

  return {
    /** Spread onto the element */
    handlers: {
      onPointerDown: () => {
        spoke.current = false;
        clear();
        timer.current = setTimeout(() => {
          spoke.current = true;
          speakLabel(text);
        }, holdMs);
      },
      onPointerUp: clear,
      onPointerLeave: clear,
      onPointerCancel: clear,
      onContextMenu: (event: React.MouseEvent) => event.preventDefault(),
    },
    /** True when the last interaction was a long press (suppress navigation) */
    didSpeak: () => spoke.current,
  };
}

export function SpeakerIcon({ className = "h-5 w-5" }: { className?: string }) {
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
