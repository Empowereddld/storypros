import { useEffect, useState } from "react";
import { resolveStoryImage } from "@/services/storyImages";
import type { StoryPhaseProps } from "@/types/story";
import { TactileButton } from "../TactileButton";
import { MiniPlane, Star } from "../StoryProsBrand";
import { ChevronRightIcon, PaperPlaneIcon } from "../StoryProsUi";
import { ProgressHeader } from "./ProgressHeader";
import { ListenButton, useListen } from "./ListenButton";
import { useDevSubSteps } from "./DevPhaseNav";

function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2l2.4 5.6L20 9l-4.6 3.8L17 19l-5-3-5 3 1.6-6.2L4 9l5.6-1.4L12 2z" />
    </svg>
  );
}

function splitJoke(jokeText: string): { setup: string; punchline: string } {
  const split = jokeText.split("? ");
  if (split.length >= 2) {
    return { setup: `${split[0]}?`, punchline: split.slice(1).join("? ") };
  }
  return { setup: "", punchline: jokeText };
}



type Step = "intro" | "meaning1" | "meaning2" | "joke";

const PROGRESS: Record<Step, number> = {
  intro: 0,
  meaning1: 33,
  meaning2: 66,
  joke: 90,
};

export function JokePhase({
  storyData,
  onComplete,
  onClose,
  ttsSpeed = "normal",
}: StoryPhaseProps) {
  const [step, setStep] = useState<Step>("intro");
  const JOKE_STEPS: Step[] = ["intro", "meaning1", "meaning2", "joke"];
  useDevSubSteps(
    JOKE_STEPS.length,
    JOKE_STEPS.indexOf(step),
    (i: number) => setStep(JOKE_STEPS[i]),
    "step",
  );
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

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pb-5 pt-4">
        <section className="relative w-full max-w-[520px] overflow-hidden rounded-[34px] bg-card p-6 text-center shadow-soft animate-pop-in">
          {step === "intro" && (
            <div className="flex flex-col items-center gap-6">
              <span
                className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-secondary/10 blur-[2px]"
                aria-hidden
              />


              <div className="space-y-2">
                <h1 className="text-[30px] font-extrabold leading-tight text-primary">
                  Words Can Have
                  <br />
                  Two Meanings
                </h1>
                <p className="text-base font-bold text-ink-soft">Today&apos;s word is…</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="-rotate-1 rounded-[24px] bg-secondary px-10 py-4 shadow-[0_6px_0_0_color-mix(in_oklab,var(--secondary)_70%,black)]">
                  <span className="text-[40px] font-extrabold uppercase leading-none tracking-[0.12em] text-secondary-foreground">
                    {joke.word}
                  </span>
                </div>
                {supported && (
                  <ListenButton
                    playing={isPlaying("word")}
                    onClick={() => toggle(joke.word, "word")}
                    ariaLabel={`Hear the word ${joke.word}`}
                    size="md"
                  />
                )}
              </div>

            </div>
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
            <div className="flex flex-col items-center gap-6">
              {/* Floating star badge */}
              <span
                className="absolute -top-8 left-1/2 z-10 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-2xl border-4 border-card bg-secondary text-secondary-foreground shadow-card rotate-3"
                aria-hidden
              >
                <StarIcon className="h-8 w-8" />
              </span>

              {/* Joke content */}
              <div className="space-y-4 pt-2">
                <p className="text-xl font-medium leading-tight text-primary/80">
                  {splitJoke(joke.joke_text).setup}
                </p>
                <p className="text-[28px] font-extrabold leading-tight text-primary">
                  {splitJoke(joke.joke_text).punchline}
                </p>
              </div>

              {/* Audio action */}
              {supported && (
                <ListenButton
                  playing={isPlaying("joke")}
                  onClick={() => toggle(joke.joke_text, "joke")}
                  ariaLabel="Hear the joke"
                  size="xl"
                  tone="primary"
                />
              )}

              {/* Why it works caption */}
              <p className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
                Both meanings of &quot;{joke.word}&quot; make the joke work
              </p>
            </div>
          )}
        </section>

        <div className="w-full max-w-[520px]">
          <TactileButton className="mt-4" onClick={handleNext}>
            {step === "joke" ? "Keep Going" : "Next"}
            <ChevronRightIcon className="h-5 w-5 text-secondary" />
          </TactileButton>
        </div>

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
      <div className="mt-4 aspect-video w-full overflow-hidden rounded-[28px] bg-accent shadow-card">
        {image ? (
          <img src={image} alt="" className="h-full w-full object-contain" />
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
