import { useEffect, useState } from "react";
import { resolveStoryImage } from "@/services/storyImages";
import type { StoryPhaseProps } from "@/types/story";
import { TactileButton } from "../TactileButton";
import { MiniPlane, Star } from "../StoryProsBrand";
import { ChevronRightIcon, PaperPlaneIcon } from "../StoryProsUi";
import { ProgressHeader } from "./ProgressHeader";
import { ListenButton, useListen } from "./ListenButton";

type Step = "intro" | "meaning1" | "meaning2" | "joke";

const PROGRESS: Record<Step, number> = {
  intro: 0,
  meaning1: 33,
  meaning2: 66,
  joke: 90,
};

export function JokePhase({ storyData, onComplete, onClose, ttsSpeed = "normal" }: StoryPhaseProps) {
  const [step, setStep] = useState<Step>("intro");
  const joke = storyData.joke;
  const { supported, isPlaying, toggle, cancel } = useListen(ttsSpeed);

  // Stop narration when the child moves to another step.
  useEffect(() => cancel, [step, cancel]);
  const meaningOneImage = resolveStoryImage(storyData.id, joke.meaning_1.image);
  const meaningTwoImage = resolveStoryImage(storyData.id, joke.meaning_2.image);

  function handleNext() {
    if (step === "intro") setStep("meaning1");
    if (step === "meaning1") setStep("meaning2");
    if (step === "meaning2") setStep("joke");
    if (step === "joke") {
      onComplete({
        phase: "joke",
        attempts: [],
        first_attempt_accuracy: 1,
        completed: true,
      });
    }
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
        <ProgressHeader progress={PROGRESS[step]} label="Word Play" onClose={onClose} />
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-5 pb-5 pt-4">
        <section className="flex flex-1 flex-col justify-center rounded-[34px] bg-card p-5 text-center shadow-soft animate-pop-in">
          {step === "intro" && (
            <>
              <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-secondary text-secondary-foreground shadow-card">
                <PaperPlaneIcon className="h-10 w-10" />
              </span>
              <h1 className="mt-5 text-[34px] font-extrabold leading-tight text-primary">
                Words Can Have Two Meanings
              </h1>
              <p className="mt-3 text-base font-semibold leading-snug text-ink-soft">
                Today&apos;s word is{" "}
                <span className="font-extrabold capitalize text-primary">{joke.word}</span>.
              </p>
            </>
          )}

          {step === "meaning1" && (
            <MeaningCard
              number={1}
              word={joke.word}
              text={joke.meaning_1.text}
              image={meaningOneImage}
            />
          )}

          {step === "meaning2" && (
            <MeaningCard
              number={2}
              word={joke.word}
              text={joke.meaning_2.text}
              image={meaningTwoImage}
            />
          )}

          {step === "joke" && (
            <>
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-secondary text-secondary-foreground shadow-card">
                <Star className="h-9 w-9" />
              </span>
              <p className="mt-5 text-[28px] font-extrabold leading-tight text-primary">
                {joke.joke_text}
              </p>
              {supported && (
                <div className="mt-4 flex justify-center">
                  <ListenButton
                    playing={isPlaying("joke")}
                    onClick={() => toggle(joke.joke_text, "joke")}
                    className="h-12 w-12"
                    ariaLabel="Hear the joke"
                  />
                </div>
              )}
              <p className="mt-4 text-sm font-semibold text-ink-soft">
                Both meanings of &quot;{joke.word}&quot; make the joke work.
              </p>
            </>
          )}
        </section>

        <TactileButton className="mt-4" onClick={handleNext}>
          {step === "joke" ? "Keep Going" : "Next"}
          <ChevronRightIcon className="h-5 w-5 text-secondary" />
        </TactileButton>
      </div>
    </div>
  );
}

function MeaningCard({
  number,
  word,
  text,
  image,
}: {
  number: number;
  word: string;
  text: string;
  image: string | null;
}) {
  return (
    <>
      <span className="mx-auto rounded-full bg-primary px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide text-primary-foreground">
        Meaning {number}
      </span>
      <div className="mt-4 h-48 overflow-hidden rounded-[28px] bg-accent shadow-card">
        {image ? (
          <img src={image} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-primary">
            <PaperPlaneIcon className="h-14 w-14" />
          </div>
        )}
      </div>
      <p className="mt-5 text-[24px] font-extrabold leading-snug text-primary">
        <span className="capitalize">{word}</span>: {text}
      </p>
    </>
  );
}
