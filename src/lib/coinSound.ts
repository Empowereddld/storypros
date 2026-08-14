/* Short, warm reward chime for coin payoffs.
 * Synthesised with WebAudio so there is no asset to load and
 * nothing to buffer before the animation starts. */

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function ping(context: AudioContext, freq: number, at: number, dur: number, gain: number) {
  const osc = context.createOscillator();
  const amp = context.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(freq, at);
  osc.frequency.linearRampToValueAtTime(freq * 1.02, at + dur);
  amp.gain.setValueAtTime(0.0001, at);
  amp.gain.exponentialRampToValueAtTime(gain, at + 0.015);
  amp.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(amp).connect(context.destination);
  osc.start(at);
  osc.stop(at + dur + 0.05);
}

/** Rising sparkle arpeggio + a soft landing "chink". */
export function playCoinReward(): void {
  try {
    const context = getContext();
    if (!context) return;
    const t = context.currentTime + 0.01;

    // sparkle run (C6 - E6 - G6 - C7)
    const notes = [1046.5, 1318.5, 1568, 2093];
    notes.forEach((freq, i) => ping(context, freq, t + i * 0.085, 0.22, 0.16));

    // landing chime, a beat later — coins hitting the pile
    ping(context, 1760, t + 0.52, 0.5, 0.13);
    ping(context, 2637, t + 0.55, 0.42, 0.08);
  } catch {
    /* audio is decorative — never break the activity */
  }
}
