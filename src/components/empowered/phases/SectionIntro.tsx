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
  /** Compact layout for the Question Time intro: narrower card, closer buddy, narrower button. */
  compact?: boolean;
}

const BUDDY = {
  dan: {
    name: "Dan",
    image: danImg,
    alt: "Dan, a boy with glasses, waving hello",
    bubble: "bg-accent/50 border-primary/45",
    tail: "bg-accent/50 border-primary/45",
  },
  daria: {
    name: "Daria",
    image: dariaImg,
    alt: "Daria, a girl with curly hair, standing and smiling",
    bubble: "bg-secondary/20 border-secondary-deep/50",
    tail: "bg-secondary/20 border-secondary-deep/50",
  },
} as const;

function SpeakerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
      <path d="M11 5 6 9H3v6h3l5 4V5Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11" strokeLinecap="round" />
    </svg>
  );
}

export function SectionIntro({ title, buddy, script, onNext, compact }: SectionIntroProps) {
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
    <div className="flex h-full w-full flex-col overflow-y-auto bg-cream px-5 pb-8 pt-6">
      <div className="mx-auto flex w-full max-w-[640px] flex-1 flex-col justify-center gap-0">
        <h1
          className="animate-slide-up text-center font-display text-[34px] font-extrabold leading-tight text-primary sm:text-[44px]"
          style={{ animationDelay: "0ms" }}
        >
          {title}
        </h1>

        {/* Buddy + speech bubble. Still after entrance — no looping motion. */}
        <div
          className="animate-slide-up mt-8 flex flex-col items-center gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-5"
          style={{ animationDelay: "100ms" }}
        >
          <img
            src={b.image}
            alt={b.alt}
            className="h-[150px] w-auto shrink-0 select-none object-contain sm:h-[180px]"
            draggable={false}
          />

          <div className="relative w-full sm:min-w-[320px]">
            <div className={cn("rounded-[26px] border-2 px-6 py-6 shadow-card sm:px-[30px] sm:py-[30px]", b.bubble)}>
              <p className="whitespace-pre-line text-left text-[18px] font-semibold leading-[1.45] text-ink sm:text-[21px]">
                <button
                  type="button"
                  onClick={toggleSpeak}
                  aria-pressed={speaking}
                  aria-label={speaking ? `Stop ${b.name}` : `Listen to ${b.name}`}
                  className={cn(
                    "mr-3 inline-flex h-11 w-11 shrink-0 translate-y-[3px] items-center justify-center rounded-full border-2 border-primary/25 bg-card text-primary shadow-card transition-colors hover:border-primary/45",
                    speaking && "bg-primary text-primary-foreground border-primary",
                  )}
                >
                  <SpeakerIcon className="h-5 w-5" />
                </button>
                {script}
              </p>
            </div>
          </div>
        </div>


        <div className="animate-slide-up mt-7" style={{ animationDelay: "300ms" }}>
          <TactileButton onClick={handleNext} className="min-h-[56px]">
            Start
          </TactileButton>
        </div>
      </div>
    </div>
  );
}
