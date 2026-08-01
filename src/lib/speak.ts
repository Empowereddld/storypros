/* ─────────────────────────────────────────────
 * UI label speech (tap-to-hear)
 *
 * Child-initiated only. Nothing here ever runs on
 * page load or hover — a tap always starts it.
 * Uses the Web Speech API directly (no audio files),
 * so any label in the interface can be spoken.
 *
 * Story narration keeps using services/tts.ts, which
 * prefers pre-generated narrator clips.
 * ───────────────────────────────────────────── */

export const LABEL_SPEECH_RATE = 0.85;

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickVoice(): SpeechSynthesisVoice | null {
  if (!isSpeechSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;
  const english = voices.filter((v) => v.lang.startsWith("en"));
  const preferred = ["Samantha", "Victoria", "Karen", "Microsoft Zira", "Google US English"];
  for (const name of preferred) {
    const found = english.find((v) => v.name.includes(name));
    if (found) return found;
  }
  return english[0] ?? voices[0] ?? null;
}

/** Speak a UI label aloud. Cancels anything already speaking first. */
export function speakLabel(text: string, onEnd?: () => void): void {
  if (!isSpeechSupported()) {
    onEnd?.();
    return;
  }
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) {
    onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.rate = LABEL_SPEECH_RATE;
  utterance.lang = "en-US";
  const voice = pickVoice();
  if (voice) utterance.voice = voice;
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();
  window.speechSynthesis.speak(utterance);
}

/** Stop any label speech in flight. */
export function stopLabelSpeech(): void {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.cancel();
}
