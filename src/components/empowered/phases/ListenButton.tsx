/* ─────────────────────────────────────────────
 * Listen controls
 * `useListen` is a phase-level hook that owns a single "what is
 * playing right now" key, so multiple listen buttons in one phase
 * share the global audio channel cleanly (tapping one stops another).
 * `ListenButton` is the presentational play/stop control.
 *
 * The text passed to `toggle` must match the exact narration string a
 * clip was generated from — `speak()` hashes it to find the ElevenLabs
 * clip, and falls back to Web Speech when there is no match.
 * ───────────────────────────────────────────── */
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { isSupported, preloadVoices, speak, speedToRate, stop } from "@/services/tts";

type Speed = "slow" | "normal" | "fast";

export function useListen(ttsSpeed: Speed = "normal") {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    preloadVoices();
  }, []);

  // Stop playback when the phase using the hook unmounts.
  useEffect(() => {
    return () => stop();
  }, []);

  const cancel = useCallback(() => {
    stop();
    setActiveKey(null);
  }, []);

  const toggle = useCallback(
    async (text: string, key?: string) => {
      const clipKey = key ?? text;
      if (activeKey === clipKey) {
        cancel();
        return;
      }
      stop();
      setActiveKey(clipKey);
      try {
        await speak(text, { rate: speedToRate(ttsSpeed) });
      } catch {
        // Ignore TTS errors; still clear the playing state below.
      }
      setActiveKey((current) => (current === clipKey ? null : current));
    },
    [activeKey, cancel, ttsSpeed],
  );

  return {
    supported: isSupported(),
    isPlaying: (key: string) => activeKey === key,
    toggle,
    cancel,
  };
}

interface ListenButtonProps {
  playing: boolean;
  onClick: () => void;
  className?: string;
  playingClassName?: string;
  idleClassName?: string;
  ariaLabel?: string;
  iconSize?: string;
}

export function ListenButton({
  playing,
  onClick,
  className,
  playingClassName = "bg-destructive text-destructive-foreground animate-pulse-glow",
  idleClassName = "bg-secondary text-secondary-foreground",
  ariaLabel = "Listen",
  iconSize = "h-5 w-5",
}: ListenButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={playing ? "Stop audio" : ariaLabel}
      className={cn(
        "press-pop flex shrink-0 items-center justify-center rounded-full shadow-card transition-all",
        playing ? playingClassName : idleClassName,
        className,
      )}
    >
      {playing ? (
        <svg viewBox="0 0 24 24" className={iconSize} fill="currentColor" aria-hidden>
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className={cn("ml-0.5", iconSize)} fill="currentColor" aria-hidden>
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
    </button>
  );
}
