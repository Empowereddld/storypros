/* ─────────────────────────────────────────────
 * Retell Check (metacognitive check)
 * Shown right after "Tell it again". A buddy explains what makes a
 * complete story and asks the child to reflect. Audio only — no
 * script on screen — with a replay button. Two picture placeholders
 * until the real artwork arrives.
 * ───────────────────────────────────────────── */

import { useEffect, useRef } from "react";
import { TactileButton } from "../TactileButton";
import { ProgressHeader } from "./ProgressHeader";
import { ChevronRightIcon } from "../StoryProsUi";
import { useListen } from "./ListenButton";
import type { StoryPhaseProps } from "@/types/story";

export const RETELL_CHECK_SCRIPT =
  "A complete story includes all the story parts. When we tell a story with all those parts in the right order, our listener can understand our story. But if we forget some of the parts, or we mix up the order, sometimes our listener will get confused. Did your story have all the parts?";

export function RetellCheckPhase({ onComplete, onClose, ttsSpeed = "normal" }: StoryPhaseProps) {
  const { isPlaying, toggle, cancel } = useListen(ttsSpeed);
  const playing = isPlaying("check");
  const startedRef = useRef(false);

  // Play once on arrival (browsers may block this; the replay button still works).
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const t = setTimeout(() => void toggle(RETELL_CHECK_SCRIPT, "check"), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleReplay() {
    if (playing) cancel();
    void toggle(RETELL_CHECK_SCRIPT, playing ? "check-replay" : "check");
  }

  function handleDone() {
    cancel();
    onComplete({ phase: "retell-check", attempts: [], first_attempt_accuracy: 1, completed: true });
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-card via-accent/10 to-accent/35" aria-hidden />

      <div className="relative z-10">
        <ProgressHeader progress={50} label="Story check" onClose={onClose} />
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col px-5 pb-4 pt-4">
        <section className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 rounded-[30px] bg-card p-5 shadow-soft animate-slide-up">
          <div className="grid w-full max-w-3xl grid-cols-2 gap-4">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="flex aspect-[4/3] items-center justify-center rounded-[24px] border-2 border-dashed border-primary/30 bg-accent/40 text-base font-extrabold text-primary/60"
              >
                Picture {n} coming soon
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleReplay}
              aria-label={playing ? "Playing — tap to start over" : "Hear it again"}
              className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft press-pop"
            >
              {playing && <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" aria-hidden />}
              <svg viewBox="0 0 24 24" className="relative h-9 w-9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M11 5 6 9H3v6h3l5 4V5z" />
                <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
              </svg>
            </button>
            <p className="text-base font-extrabold text-primary">{playing ? "Listening..." : "Hear it again"}</p>
          </div>

          <TactileButton onClick={handleDone} fullWidth={false}>
            Keep Going <ChevronRightIcon className="h-5 w-5 text-secondary" />
          </TactileButton>
        </section>
      </div>
    </div>
  );
}
