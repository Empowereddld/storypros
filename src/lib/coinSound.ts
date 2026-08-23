/* Fun arcade coin sound — synthesised with WebAudio so there is
 * no asset to load and nothing to buffer before the animation starts.
 *
 * Layers:
 *  1. The classic two-note arcade "coin blip" (B5 snap into a held E6).
 *  2. A short metallic sparkle on the attack.
 *  3. A bouncy ascending arpeggio tail for the payoff.
 */


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

function bellTone(
  context: AudioContext,
  freq: number,
  at: number,
  dur: number,
  gain: number,
  type: OscillatorType = "sine"
) {
  const osc = context.createOscillator();
  const amp = context.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, at);
  // Slight pitch drop gives a physical "strike" feel.
  osc.frequency.exponentialRampToValueAtTime(freq * 0.96, at + dur * 0.6);
  amp.gain.setValueAtTime(0.0001, at);
  amp.gain.exponentialRampToValueAtTime(gain, at + 0.01);
  amp.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(amp).connect(context.destination);
  osc.start(at);
  osc.stop(at + dur + 0.03);
}

function clinkNoise(context: AudioContext, at: number, gain: number) {
  const bufferSize = context.sampleRate * 0.08;
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const src = context.createBufferSource();
  src.buffer = buffer;

  // Band-pass around the "coin" metallic region (~4kHz).
  const band = context.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 4200;
  band.Q.value = 8;

  const amp = context.createGain();
  amp.gain.setValueAtTime(0.0001, at);
  amp.gain.exponentialRampToValueAtTime(gain, at + 0.005);
  amp.gain.exponentialRampToValueAtTime(0.0001, at + 0.07);

  src.connect(band).connect(amp).connect(context.destination);
  src.start(at);
  src.stop(at + 0.1);
}

/** Bright, satisfying coin payoff — a ding, a clink, and a sparkle. */
export function playCoinReward(): void {
  try {
    const context = getContext();
    if (!context) return;
    const t = context.currentTime + 0.01;

    // Main coin "ding" — two slightly detuned sines for richness.
    bellTone(context, 1568, t, 0.28, 0.18); // G6
    bellTone(context, 1578, t + 0.005, 0.26, 0.1, "sine"); // subtle detune
    bellTone(context, 3136, t, 0.18, 0.07, "triangle"); // harmonic octave

    // Metallic clink on attack.
    clinkNoise(context, t, 0.14);

    // Echo sparkle — two quick high notes that trail off.
    bellTone(context, 2093, t + 0.09, 0.16, 0.09); // C7
    bellTone(context, 2637, t + 0.15, 0.14, 0.06); // E7
  } catch {
    /* audio is decorative — never break the activity */
  }
}
