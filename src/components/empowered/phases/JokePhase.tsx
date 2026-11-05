import { useEffect, useState } from "react";
import { resolveStoryImage } from "@/services/storyImages";
import type { StoryPhaseProps } from "@/types/story";
import { cn } from "@/lib/utils";
import { TactileButton } from "../TactileButton";
import { MiniPlane, Star } from "../StoryProsBrand";
import { ChevronRightIcon, PaperPlaneIcon } from "../StoryProsUi";
import { ProgressHeader } from "./ProgressHeader";
import { ListenButton, useListen } from "./ListenButton";
import { AudioButton } from "../AudioButton";
import { useDevSubSteps } from "./DevPhaseNav";
import { earnCoins } from "@/services/coins";
import { COIN_ECONOMY } from "@/services/coinEconomy";


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

interface ActivityCardProps {
  children: React.ReactNode;
  header: React.ReactNode;
  headerClassName?: string;
}

function ActivityCard({ children, header, headerClassName }: ActivityCardProps) {
  return (
    <div className="w-full max-w-[520px] overflow-hidden rounded-[34px] bg-card shadow-soft animate-pop-in">
      <div
        className={cn(
          "relative bg-primary px-6 pb-12 pt-6 text-center",
          headerClassName,
        )}
      >
        {header}
        <div
          className="absolute -bottom-1 left-0 right-0 h-10 bg-card"
          style={{ clipPath: "ellipse(60% 100% at 50% 100%)" }}
          aria-hidden
        />
      </div>
      <div className="relative z-10 flex flex-col gap-6 px-6 pb-8 pt-4">
        {children}
      </div>
    </div>
  );
}

export function JokePhase({
  storyData,
  onComplete,
  onClose,
  ttsSpeed = "normal",
}: StoryPhaseProps) {
  const [step, setStep] = useState<Step>("intro");
  const [revealed, setRevealed] = useState(false);
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
  useEffect(() => setRevealed(false), [step]);
  const { setup, punchline } = splitJoke(joke.joke_text);
  const spokenJoke = revealed ? joke.joke_text : setup || joke.joke_text;
  const meaningOneImage = resolveStoryImage(storyData.id, joke.meaning_1.image);
  const meaningTwoImage = resolveStoryImage(storyData.id, joke.meaning_2.image);

  function handleNext() {
    if (step === "intro") setStep("meaning1");
    if (step === "meaning1") setStep("meaning2");
    if (step === "meaning2") setStep("joke");
    if (step === "joke") {
      earnCoins({
        storyId: storyData.id,
        activity: "jokes",
        amount: COIN_ECONOMY.jokes.completion,
        label: "Joke complete!",
      });
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
        <ProgressHeader progress={PROGRESS[step]} label="Joke" onClose={onClose} />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pb-5 pt-4">
        {step === "intro" && (
          <ActivityCard
            header={
              <h1 className="text-[28px] font-extrabold leading-tight text-primary-foreground">
                Words Can Have
                <br />
                Two Meanings
              </h1>
            }
          >
            <div className="flex flex-col items-center gap-6 pt-2">
              <p className="text-base font-bold text-ink-soft">Today&apos;s word is…</p>

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

            <TactileButton
              variant="secondary"
              className="shadow-[0_8px_0_0_var(--secondary-deep)] active:translate-y-2 active:shadow-none"
              onClick={handleNext}
            >
              Next <ChevronRightIcon className="h-5 w-5 text-secondary-foreground" />
            </TactileButton>
          </ActivityCard>
        )}

        {step === "meaning1" && (
          <MeaningStep
            number={1}
            word={joke.word}
            text={joke.meaning_1.text}
            image={meaningOneImage}
            onNext={handleNext}
          />
        )}

        {step === "meaning2" && (
          <MeaningStep
            number={2}
            word={joke.word}
            text={joke.meaning_2.text}
            image={meaningTwoImage}
            onNext={handleNext}
          />
        )}

        {step === "joke" && (
          <ActivityCard
            header={
              <>
                <div className="mb-4 inline-flex items-center rounded-full bg-secondary px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-secondary-foreground shadow-md">
                  Joke
                </div>
                <h2 className="text-[22px] font-bold leading-tight text-primary-foreground">
                  {setup}
                </h2>
              </>
            }
          >
            <div className="flex flex-col items-center gap-5">
              {revealed ? (
                <div className="w-full rounded-[2rem] border-2 border-dashed border-secondary bg-secondary/20 p-6 text-center animate-pop-in">
                  <p className="text-[26px] font-extrabold leading-snug text-primary">
                    {punchline} 😂
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    cancel();
                    setRevealed(true);
                  }}
                  className="w-full rounded-[2rem] border-2 border-dashed border-secondary bg-secondary/20 p-6 text-center text-[22px] font-extrabold text-primary transition-transform hover:scale-[1.02] active:scale-95"
                >
                  🤔 Tap to see the answer!
                </button>
              )}

              {supported && (
                <AudioButton
                  size="xl"
                  tone="primary"
                  playing={isPlaying("joke")}
                  onClick={() => toggle(spokenJoke, "joke")}
                  ariaLabel="Hear the joke"
                  text={spokenJoke}
                  className="rounded-full border-4 border-card bg-primary text-primary-foreground shadow-xl hover:bg-primary/95"
                />
              )}
            </div>

            {revealed && (
            <div className="rounded-2xl border border-accent bg-accent/50 p-4 text-center">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-primary">
                Get the joke? 💡
              </span>
              <div className="space-y-1 text-sm font-semibold leading-snug text-ink">
                {(joke.explanation?.length
                  ? joke.explanation
                  : [`The joke uses two meanings of the word ${joke.word}!`]
                ).map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
            )}

            <TactileButton
              variant="secondary"
              className="shadow-[0_8px_0_0_var(--secondary-deep)] active:translate-y-2 active:shadow-none"
              onClick={handleNext}
              disabled={!revealed}
            >
              Keep Going <ChevronRightIcon className="h-5 w-5 text-secondary-foreground" />
            </TactileButton>
          </ActivityCard>
        )}
      </div>
    </div>
  );
}

function MeaningStep({
  number,
  word,
  text,
  image,
  onNext,
}: {
  number: number;
  word: string;
  text: string;
  image: string | null;
  onNext: () => void;
}) {
  return (
    <ActivityCard
      header={
        <>
          <span className="mb-3 inline-block rounded-full bg-secondary px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-secondary-foreground shadow-md">
            Meaning {number}
          </span>
          <h2 className="text-[26px] font-extrabold leading-tight text-primary-foreground">
            <span className="capitalize">{word}</span>
          </h2>
        </>
      }
    >
      <div className="aspect-video w-full overflow-hidden rounded-[28px] bg-accent shadow-card">
        {image ? (
          <img src={image} alt="" className="h-full w-full object-contain" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-primary">
            <PaperPlaneIcon className="h-14 w-14" />
          </div>
        )}
      </div>

      <p className="text-center text-[24px] font-extrabold leading-snug text-primary">
        <span className="capitalize">{word}</span>: {text}
      </p>

      <TactileButton
        variant="secondary"
        className="shadow-[0_8px_0_0_var(--secondary-deep)] active:translate-y-2 active:shadow-none"
        onClick={onNext}
      >
        Next <ChevronRightIcon className="h-5 w-5 text-secondary-foreground" />
      </TactileButton>
    </ActivityCard>
  );
}
