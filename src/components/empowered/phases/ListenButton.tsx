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
  /** Visible circle size; the tap target stays >= 44px */
  size?: AudioButtonSize;
  tone?: AudioButtonTone;
  ariaLabel?: string;
  text?: string;
}

/**
 * Thin wrapper kept for existing call sites — the visual is the
 * shared AudioButton, so every "hear this" control looks the same.
 */
export function ListenButton({
  playing,
  onClick,
  className,
  size = "lg",
  tone = "primary",
  ariaLabel,
  text,
}: ListenButtonProps) {
  return (
    <AudioButton
      playing={playing}
      onClick={onClick}
      size={size}
      tone={tone}
      ariaLabel={ariaLabel}
      text={text}
      className={className}
    />
  );
}

