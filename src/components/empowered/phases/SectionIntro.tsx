/* ─────────────────────────────────────────────
 * Section Intro
 *
 * One of these appears before each activity in the
 * story flow. Its only job: tell the child what is
 * about to happen, in plain language, spoken aloud
 * by a story buddy, before any task begins.
 *
 * Audio is child-controlled only — never autoplay.
 * The buddy fades up once and then holds completely
 * still (no floating / bobbing loops).
 * ───────────────────────────────────────────── */

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AudioButton } from "../AudioButton";
import { TactileButton } from "../TactileButton";
import { speakLabel, stopLabelSpeech } from "@/lib/speak";
import danImg from "@/assets/child-avatar.png";
import dariaImg from "@/assets/daria-solo.png";

export type Buddy = "dan" | "daria";

export interface SectionIntroProps {
  title: string;
  buddy: Buddy;
  /** Spoken + displayed script. Newlines are preserved. */
  script: string;
  onNext: () => void;
}

const BUDDY = {
  dan: {
    name: "Dan",
    image: danImg,
    alt: "Dan, a boy with glasses, waving hello",
    bubble: "bg-accent/35 border-primary/30",
    tail: "bg-accent/35 border-primary/30",
  },
  daria: {
    name: "Daria",
    image: dariaImg,
    alt: "Daria, a girl with curly hair, standing and smiling",
    bubble: "bg-secondary/15 border-secondary-deep/35",
    tail: "bg-secondary/15 border-secondary-deep/35",
  },
} as const;


function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden>
      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SectionIntro({ title, buddy, script, onNext }: SectionIntroProps) {
  const b = BUDDY[buddy];
  const [speaking, setSpeaking] = useState(false);

  // Never leave speech running behind us
  useEffect(() => () => stopLabelSpeech(), []);

  const speak = useCallback(() => {
    stopLabelSpeech();
    setSpeaking(true);
    speakLabel(script, () => setSpeaking(false));
  }, [script]);

  const toggleSpeak = useCallback(() => {
    if (speaking) {
      stopLabelSpeech();
      setSpeaking(false);
      return;
    }
    speak();
  }, [speaking, speak]);

  const handleNext = useCallback(() => {
    stopLabelSpeech();
    setSpeaking(false);
    onNext();
  }, [onNext]);

  return (
    <div className="h-full w-full overflow-y-auto bg-cream px-4 pb-10 pt-6 sm:px-6">
      {/* Sits slightly above true centre so the panel never drifts into a tall void */}
      <div className="mx-auto flex min-h-full w-full max-w-[640px] flex-col justify-center py-2">
        <header className="animate-slide-up text-center" style={{ animationDelay: "0ms" }}>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Next activity
          </p>
          <h1 className="mt-2 font-display text-[22px] font-extrabold leading-tight text-primary sm:text-[26px]">
            {title}
          </h1>
        </header>

        {/* One panel holds the buddy, the instruction and the action */}
        <section
          className="animate-slide-up mt-6 rounded-[28px] border border-primary/10 bg-card px-4 pb-5 pt-5 shadow-card sm:mt-7 sm:px-7 sm:pb-6 sm:pt-6"
          style={{ animationDelay: "120ms" }}
        >
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-7">
            {/* Buddy, grounded with a soft contact shadow */}
            <div className="relative shrink-0 pb-3">
              <img
                src={b.image}
                alt={b.alt}
                className="h-[170px] w-auto select-none object-contain sm:h-[230px]"
                draggable={false}
              />
              <div
                className="absolute bottom-0 left-1/2 h-3 w-[68%] -translate-x-1/2 rounded-[50%] bg-ink/10 blur-[6px]"
                aria-hidden
              />
            </div>

            <div className="relative w-full sm:mb-6 sm:min-w-0 sm:flex-1">
              {/* Tail pointing back at the buddy */}
              <div
                className={cn(
                  "absolute left-1/2 top-[-8px] h-4 w-4 -translate-x-1/2 rotate-45 border-l-2 border-t-2 sm:left-[-10px] sm:top-1/2 sm:-translate-x-0 sm:-translate-y-1/2 sm:-rotate-45",
                  b.tail,
                )}
                aria-hidden
              />
              <div className={cn("relative rounded-[24px] border-2 px-5 pb-5 pt-7 sm:px-6 sm:pb-6 sm:pt-8", b.bubble)}>
                {/* Speaker pinned to the corner so the sentence keeps a clean left edge */}
                <AudioButton
                  size="md"
                  tone="quiet"
                  playing={speaking}
                  onClick={toggleSpeak}
                  ariaLabel={`Listen to ${b.name}`}
                  className="absolute left-3 top-[-22px] bg-card shadow-card ring-2 ring-primary/15 sm:left-4"
                />
                <p className="max-w-[34ch] whitespace-pre-line text-left text-[17px] font-semibold leading-[1.5] text-ink sm:text-[19px]">
                  {script}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-primary/10 pt-5">
            <div className="flex justify-center">
              <TactileButton
                onClick={handleNext}
                fullWidth={false}
                noShadow
                className="w-full max-w-[260px] shadow-card sm:max-w-[300px]"
              >
                Start
                <ChevronIcon className="h-5 w-5" />
              </TactileButton>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
