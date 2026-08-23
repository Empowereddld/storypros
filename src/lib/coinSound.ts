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

/** A punchy chiptune blip. */
function blip(
  context: AudioContext,
  freq: number,
  at: number,
  dur: number,
  gain: number,
  type: OscillatorType = "square"
) {
  const osc = context.createOscillator();
  const amp = context.createGain();
  // Soften the raw square edge a touch so it stays cute, not harsh.
  const tone = context.createBiquadFilter();
  tone.type = "lowpass";
  tone.frequency.value = 6000;

  osc.type = type;
  osc.frequency.setValueAtTime(freq, at);

  amp.gain.setValueAtTime(0.0001, at);
  amp.gain.exponentialRampToValueAtTime(gain, at + 0.008);
  amp.gain.setValueAtTime(gain, at + dur * 0.55);
  amp.gain.exponentialRampToValueAtTime(0.0001, at + dur);

  osc.connect(tone).connect(amp).connect(context.destination);
  osc.start(at);
  osc.stop(at + dur + 0.02);
}

function sparkleNoise(context: AudioContext, at: number, gain: number) {
  const bufferSize = Math.floor(context.sampleRate * 0.06);
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const src = context.createBufferSource();
  src.buffer = buffer;

  const band = context.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 5200;
  band.Q.value = 4;

  const amp = context.createGain();
  amp.gain.setValueAtTime(0.0001, at);
  amp.gain.exponentialRampToValueAtTime(gain, at + 0.004);
  amp.gain.exponentialRampToValueAtTime(0.0001, at + 0.05);

  src.connect(band).connect(amp).connect(context.destination);
  src.start(at);
  src.stop(at + 0.08);
}

/** Playful arcade coin payoff — blip, blip, then a happy little run up. */
export function playCoinReward(): void {
  try {
    const context = getContext();
    if (!context) return;
    const t = context.currentTime + 0.01;

    // Classic coin: quick B5 grace note snapping into a held E6.
    blip(context, 988, t, 0.075, 0.16); // B5
    blip(context, 1319, t + 0.075, 0.24, 0.17); // E6 (held)
    blip(context, 2637, t + 0.075, 0.2, 0.045, "triangle"); // octave shimmer

    // Bright metallic attack.
    sparkleNoise(context, t, 0.1);

    // Bouncy ascending tail: G6 - B6 - E7.
    blip(context, 1568, t + 0.3, 0.07, 0.1, "triangle");
    blip(context, 1976, t + 0.37, 0.07, 0.09, "triangle");
    blip(context, 2637, t + 0.44, 0.16, 0.08, "triangle");
  } catch {
    /* audio is decorative — never break the activity */
  }
}

