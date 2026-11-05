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
        <section className="flex min-h-0 flex-1 flex-col justify-center rounded-[30px] bg-card p-5 shadow-soft animate-slide-up">
          <div className="flex items-center justify-center">
            <h1 className="text-center text-[28px] font-extrabold leading-tight text-primary">
              Remember the Story?
            </h1>
          </div>

          <div className="mx-auto mt-3 flex w-full max-w-3xl items-center gap-3 rounded-[24px] bg-accent/60 px-4 py-3">
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

          <div className="mt-4 grid grid-cols-6 gap-2 sm:gap-3">
            {elements.map((element, index) => {
              const slide = storyData.slides.find((item) => item.story_element === element);
              const image = slide ? resolveStoryImage(storyData.id, slide.image) : null;
              return (
                <div
                  key={`${element}-${index}`}
                  className="flex min-w-0 flex-col overflow-hidden rounded-[18px] border-2 border-accent bg-card shadow-card"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-accent/40">
                    {image ? (
                      <img src={image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-primary">
                        <PaperPlaneIcon className="h-8 w-8" />
                      </div>
                    )}
                    <span className="absolute left-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-sm font-extrabold text-primary shadow-card">
                      {index + 1}
                    </span>
                  </div>
                  <p className="bg-primary px-1 py-1.5 text-center text-xs font-extrabold leading-tight text-primary-foreground sm:text-sm">
                    {ELEMENT_LABELS[element]}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex justify-center">
            <RetellRecorder childId={childId} storyId={storyData.id} phase="delayed" size="large" />
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
