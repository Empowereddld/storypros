import { useEffect, useState } from "react";
import type { StoryPhaseProps, StoryElement } from "@/types/story";
import { TactileButton } from "../TactileButton";
import { MiniPlane, Star } from "../StoryProsBrand";
import { ChevronRightIcon, PaperPlaneIcon } from "../StoryProsUi";
import { ProgressHeader } from "./ProgressHeader";
import { ListenButton, useListen } from "./ListenButton";
import { StoryElementFramework } from "../StoryElementFramework";

const ELEMENT_LABELS: Record<StoryElement, string> = {
  character: "Who",
  place: "Where",
  problem: "Problem",
  emotion: "Feeling",
  action: "Action",
  result: "Result",
};

export function PersonalConnectionPhase({
  storyData,
  onComplete,
  onClose,
  ttsSpeed = "normal",
}: StoryPhaseProps) {
  const [started, setStarted] = useState(true);
  const prompt = storyData.personal_connection.prompt;
  const { supported, isPlaying, toggle, cancel } = useListen(ttsSpeed);

  // Stop narration when leaving the prompt view.
  useEffect(() => cancel, [started, cancel]);

  function handleDone() {
    onComplete({
      phase: "personal-connection",
      attempts: [],
      first_attempt_accuracy: 1,
      completed: true,
    });
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-accent/10 to-accent/35" />
        <Star className="absolute left-8 top-32 h-4 w-4 text-secondary animate-sparkle" />
        <Star className="absolute right-9 top-48 h-5 w-5 text-primary/30 animate-sparkle" />
        <MiniPlane className="absolute right-12 bottom-24 h-9 w-9 rotate-12 text-secondary animate-float" />
      </div>

      <div className="relative z-10">
        <ProgressHeader progress={started ? 60 : 0} label="Your Turn" onClose={onClose} />
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-5 pb-5 pt-4">
        {!started ? (
          <section className="flex flex-1 flex-col items-center justify-center rounded-[34px] bg-card p-6 text-center shadow-soft animate-pop-in">
            <span className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-accent text-primary shadow-card">
              <PaperPlaneIcon className="h-11 w-11" />
            </span>
            <h1 className="mt-5 text-[36px] font-extrabold leading-tight text-primary">
              What About You?
            </h1>
            <p className="mt-3 max-w-[280px] text-base font-semibold leading-snug text-ink-soft">
              Connect the story to something from your own life.
            </p>
          </section>
        ) : (
          <section className="flex flex-1 flex-col justify-center rounded-[34px] bg-card p-5 shadow-soft animate-slide-up">
            <span className="mb-4 inline-flex w-fit rounded-full bg-secondary/25 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide text-secondary-foreground">
              Think and Share
            </span>
            <div className="flex items-start gap-3">
              <h1 className="flex-1 text-[30px] font-extrabold leading-tight text-primary">
                {prompt}
              </h1>
              {supported && (
                <ListenButton
                  playing={isPlaying("prompt")}
                  onClick={() => toggle(prompt, "prompt")}
                  ariaLabel="Hear the question"
                />
              )}
            </div>
            <StoryElementFramework
              className="mt-8"
              items={storyData.retell_prompts.story_elements.map((element) => ({
                element,
                label: ELEMENT_LABELS[element as StoryElement] ?? element,
              }))}
            />
          </section>
        )}

        {!started ? (
          <TactileButton className="mt-4" onClick={() => setStarted(true)}>
            Start Reflection <ChevronRightIcon className="h-5 w-5 text-secondary" />
          </TactileButton>
        ) : (
          <TactileButton className="mt-4" onClick={handleDone}>
            I Shared My Story <ChevronRightIcon className="h-5 w-5 text-secondary" />
          </TactileButton>
        )}
      </div>
    </div>
  );
}
