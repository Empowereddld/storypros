/* ─────────────────────────────────────────────
 * Text-to-Speech Service
 * Uses the Web Speech API (SpeechSynthesis).
 * Provides speak/stop/isSpeaking functions.
 * ───────────────────────────────────────────── */

export interface TTSOptions {
  rate: number;   // 0.6 = slow, 0.85 = normal, 1.1 = fast
  pitch?: number; // 1.0 default
}

const SPEED_MAP: Record<string, number> = {
  slow: 0.6,
  normal: 0.85,
  fast: 1.1,
};

let currentUtterance: SpeechSynthesisUtterance | null = null;

/** Check if browser supports speech synthesis */
export function isSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** Get a child-friendly voice (prefer female, avoid robotic names) */
function getPreferredVoice(): SpeechSynthesisVoice | null {
  if (!isSupported()) return null;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  // Prefer English voices with friendly names
  const english = voices.filter((v) => v.lang.startsWith("en"));

  // Look for specific good voices
  const preferred = [
    "Samantha", "Victoria", "Karen", "Moira", // macOS/iOS
    "Microsoft Zira", "Microsoft Jenny", // Windows
    "Google US English", // Chrome
  ];

  for (const name of preferred) {
    const found = english.find((v) => v.name.includes(name));
    if (found) return found;
  }

  // Fall back to first female-sounding English voice, or just first English
  const female = english.find((v) =>
    /female|woman|girl/i.test(v.name),
  );
  return female ?? english[0] ?? voices[0] ?? null;
}

/** Speak text aloud */
export function speak(text: string, options: TTSOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!isSupported()) {
      resolve();
      return;
    }

    // Stop any current speech
    stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate;
    utterance.pitch = options.pitch ?? 1.0;

    const voice = getPreferredVoice();
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      currentUtterance = null;
      resolve();
    };

    utterance.onerror = (event) => {
      currentUtterance = null;
      // "interrupted" is expected when we call stop()
      if (event.error === "interrupted" || event.error === "canceled") {
        resolve();
      } else {
        reject(new Error(`TTS error: ${event.error}`));
      }
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  });
}

/** Convert speed label to rate number */
export function speedToRate(speed: "slow" | "normal" | "fast"): number {
  return SPEED_MAP[speed] ?? 0.85;
}

/** Stop any current speech */
export function stop(): void {
  if (isSupported()) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
}

/** Check if currently speaking */
export function isSpeaking(): boolean {
  if (!isSupported()) return false;
  return window.speechSynthesis.speaking;
}

/** Preload voices (some browsers need this) */
export function preloadVoices(): void {
  if (!isSupported()) return;
  window.speechSynthesis.getVoices();
  // Chrome loads voices asynchronously
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}
