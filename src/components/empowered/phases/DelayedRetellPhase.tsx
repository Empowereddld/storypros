/* ─────────────────────────────────────────────
 * Delayed Retell Phase
 * Child retells story using tappable element icons.
 * Not scored in V1 (retell domain dormant).
 * Placed AFTER vocab + grammar activities.
 * ───────────────────────────────────────────── */

import { useEffect } from "react";
import { TactileButton } from "../TactileButton";
import { ProgressHeader } from "./ProgressHeader";
import { MiniPlane, Star } from "../StoryProsBrand";
import { ChevronRightIcon, PaperPlaneIcon } from "../StoryProsUi";
import { resolveStoryImage } from "@/services/storyImages";
import type { StoryPhaseProps, StoryElement } from "@/types/story";
import { ListenButton, useListen } from "./ListenButton";
import { RetellRecorder } from "../RetellRecorder";
import { earnCoins } from "@/services/coins";
import { COIN_ECONOMY } from "@/services/coinEconomy";

const ELEMENT_LABELS: Record<StoryElement, string> = {
  character: "Who",
  place: "Where",
  problem: "Problem",
  emotion: "Feeling",
  action: "What happened",
  result: "Result",
};

export function DelayedRetellPhase({
  storyData,
  onComplete,
  onClose,
  ttsSpeed = "normal",
  childId,
}: StoryPhaseProps) {
  const elements = storyData.retell_prompts.story_elements;
  const delayedPrompt = storyData.retell_prompts.delayed;
  const { supported, isPlaying, toggle, cancel } = useListen(ttsSpeed);

  useEffect(() => cancel, [cancel]);
  const progress = 50;

  function handleDone() {
    cancel();
    earnCoins({
      storyId: storyData.id,
      activity: "delayed-retell",
      amount: COIN_ECONOMY["delayed-retell"].completion,
      label: "You told the whole story!",
    });
    onComplete({
      phase: "delayed-retell",
      attempts: [],
      first_attempt_accuracy: 1, // not scored V1
      completed: true,
    });
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-accent/10 to-accent/35" />
        <Star className="absolute right-8 top-28 h-5 w-5 text-secondary animate-sparkle" />
        <Star className="absolute left-8 bottom-32 h-4 w-4 text-primary/30 animate-sparkle" />
        <MiniPlane className="absolute right-10 bottom-24 h-9 w-9 rotate-12 text-secondary/70 animate-float" />
      </div>

      <div className="relative z-10">
        <ProgressHeader progress={progress} label="Tell it again!" onClose={onClose} />
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto no-scrollbar px-5 pb-4 pt-4">
        <section className="flex min-h-0 flex-1 flex-col rounded-[30px] bg-card p-5 shadow-soft animate-slide-up">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] bg-accent text-primary">
              <BrainIcon className="h-8 w-8" />
            </div>
            <h1 className="text-[28px] font-extrabold leading-tight text-primary">
              Remember the Story?
            </h1>
          </div>

          <div className="mt-3 flex items-start gap-3 rounded-[24px] bg-accent/60 p-4">
            <p className="flex-1 text-lg font-extrabold leading-snug text-primary sm:text-xl">
              {delayedPrompt}
            </p>
            {supported && (
              <ListenButton
                playing={isPlaying("delayed")}
                onClick={() => toggle(delayedPrompt, "delayed")}
                ariaLabel="Hear the retell prompt"
              />
            )}
          </div>

          <div className="mt-3 flex gap-2">
            {elements.map((element, index) => {
              const slide = storyData.slides.find((item) => item.story_element === element);
              const image = slide ? resolveStoryImage(storyData.id, slide.image) : null;
              return (
                <div
                  key={`${element}-${index}`}
                  className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[16px] border-2 border-accent/60 bg-card"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-accent/40">
                    {image ? (
                      <img src={image} alt="" className="h-full w-full object-contain" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-primary">
                        <PaperPlaneIcon className="h-8 w-8" />
                      </div>
                    )}
                    <span className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-primary-foreground">
                      {index + 1}
                    </span>
                  </div>
                  <p className="px-1 py-1 text-center text-xs font-extrabold leading-tight text-primary sm:text-sm">
                    {ELEMENT_LABELS[element]}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-3 min-h-0 flex-1">
            <RetellRecorder childId={childId} storyId={storyData.id} phase="delayed" />
          </div>
        </section>
      </div>

      <div className="relative z-10 mx-5 mb-4 flex shrink-0 justify-center">
        <TactileButton onClick={handleDone} fullWidth={false}>
          Done <ChevronRightIcon className="h-5 w-5 text-secondary" />
        </TactileButton>
      </div>
    </div>
  );
}

function BrainIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden
    >
      <path
        d="M9 4a3 3 0 0 0-3 3v.3A3 3 0 0 0 4 10v1a3 3 0 0 0 1.5 2.6A3 3 0 0 0 8 18h1v-2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 4a3 3 0 0 1 3 3v.3A3 3 0 0 1 20 10v1a3 3 0 0 1-1.5 2.6A3 3 0 0 1 16 18h-1v-2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 4h6v11.5a2.5 2.5 0 0 1-5 0" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
