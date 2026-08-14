/* ---------------------------------------------
 * Comprehension Phase - Must-Complete Model
 * Say-then-choose: child considers the question,
 * then reveals choices. Must answer correctly to
 * advance. Brain checks confirm / prompt.
 * --------------------------------------------- */

import { useState, useRef, useEffect, type ComponentType } from "react";
import { CheckCircle2, Hand, Heart, MapPin, TriangleAlert, User } from "lucide-react";
import { TactileButton } from "../TactileButton";
import { ProgressHeader } from "./ProgressHeader";
import type { StoryPhaseProps, ActivityAttempt, StoryElement } from "@/types/story";
import { cn } from "@/lib/utils";
import dariaSolo from "@/assets/daria-pointing.webp";
import { resolveStoryImage } from "@/services/storyImages";
import { MiniPlane, Star } from "../StoryProsBrand";
import { useDevSubSteps } from "./DevPhaseNav";
import { AudioButton } from "../AudioButton";
import { useListen } from "./ListenButton";
import { earnCoins } from "@/services/coins";
import { COIN_ECONOMY, comprehensionAward } from "@/services/coinEconomy";

const ELEMENT_LABELS: Record<StoryElement, string> = {
  character: "Character",
  place: "Place",
  problem: "Problem",
  emotion: "Feeling",
  action: "Action",
  result: "Result",
};

const ELEMENT_ICONS: Record<StoryElement, ComponentType<{ className?: string }>> = {
  character: User,
  place: MapPin,
  problem: TriangleAlert,
  emotion: Heart,
  action: Hand,
  result: CheckCircle2,
};

const ELEMENT_COLORS: Record<StoryElement, { bg: string; text: string; ring: string }> = {
  character: {
    bg: "bg-element-character",
    text: "text-element-character-foreground",
    ring: "ring-element-character-foreground/30",
  },
  place: {
    bg: "bg-element-place",
    text: "text-element-place-foreground",
    ring: "ring-element-place-foreground/30",
  },
  problem: {
    bg: "bg-element-problem",
    text: "text-element-problem-foreground",
    ring: "ring-element-problem-foreground/30",
  },
  emotion: {
    bg: "bg-element-emotion",
    text: "text-element-emotion-foreground",
    ring: "ring-element-emotion-foreground/30",
  },
  action: {
    bg: "bg-element-action",
    text: "text-element-action-foreground",
    ring: "ring-element-action-foreground/30",
  },
  result: {
    bg: "bg-element-result",
    text: "text-element-result-foreground",
    ring: "ring-element-result-foreground/30",
  },
};

type BrainCheckState =
  | { type: "none" }
  | { type: "correct"; message: string }
  | { type: "wrong"; message: string };


export function ComprehensionPhase({
  storyData,
  onComplete,
  onClose,
  ttsSpeed = "normal",
  childId = "demo",
}: StoryPhaseProps) {
  const questions = storyData.comprehension_questions;
  const [qi, setQi] = useState(0);
  useDevSubSteps(questions.length, qi, setQi, "question");
  const [selected, setSelected] = useState<string | null>(null);
  const [brainCheck, setBrainCheck] = useState<BrainCheckState>({ type: "none" });
  const [attempts, setAttempts] = useState<ActivityAttempt[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [wrongIds, setWrongIds] = useState<Set<string>>(new Set());
  const [reflecting, setReflecting] = useState(false);

  const { supported, isPlaying, toggle, cancel } = useListen(ttsSpeed);
  const startTime = useRef(Date.now());

  // Stop any audio when moving to the next question.
  useEffect(() => {
    return () => cancel();
  }, [qi, cancel]);


  const q = questions[qi];
  const progress = (qi / questions.length) * 100;

  function handleReveal() {
    if (!selected) return;
    setReflecting(false);

    const elapsed = Date.now() - startTime.current;
    const option = q.options.find((o) => o.id === selected)!;
    const isCorrect = option.correct;

    const attempt: ActivityAttempt = {
      child_id: childId,
      story_id: storyData.id,
      activity_type: "comprehension",
      question_index: qi,
      attempt_number: currentAttempt,
      selected_option: selected,
      is_correct: isCorrect,
      time_ms: elapsed,
    };
    setAttempts((prev) => [...prev, attempt]);

    if (isCorrect) {
      earnCoins({
        storyId: storyData.id,
        activity: "comprehension",
        item: qi,
        amount: comprehensionAward(currentAttempt),
        anchor: document.querySelector(`[data-answer-option="${selected}"]`),
      });
      setBrainCheck({ type: "correct", message: q.brain_check_correct });
    } else {
      setWrongIds((prev) => new Set(prev).add(selected));
      setBrainCheck({ type: "wrong", message: q.brain_check_wrong });
      setCurrentAttempt((a) => a + 1);
    }
  }

  function handleBrainCheckContinue() {
    if (brainCheck.type === "correct") {
      if (qi + 1 >= questions.length) {
        earnCoins({
          storyId: storyData.id,
          activity: "comprehension",
          amount: COIN_ECONOMY.comprehension.completion,
          label: "Question Time complete!",
        });
        const firstAttempts = attempts.filter(
          (a) => a.attempt_number === 1 && a.activity_type === "comprehension",
        );
        const allFirst = [...firstAttempts];
        const correctFirst = allFirst.filter((a) => a.is_correct).length;
        const accuracy = questions.length > 0 ? correctFirst / questions.length : 0;

        onComplete({
          phase: "comprehension",
          attempts: [...attempts],
          first_attempt_accuracy: accuracy,
          completed: true,
        });
        return;
      }
      setQi(qi + 1);
      setSelected(null);
      setBrainCheck({ type: "none" });
      setCurrentAttempt(1);
      setWrongIds(new Set());
      startTime.current = Date.now();
    } else {
      setSelected(null);
      setBrainCheck({ type: "none" });
    }
  }

  const showingBrainCheck = brainCheck.type !== "none";

  const hintSlide = storyData.slides.find((s) => s.story_element === q.story_element);
  const hintImage = resolveStoryImage(storyData.id, hintSlide?.image);

  const ElementIcon = ELEMENT_ICONS[q.story_element] ?? User;
  const elementLabel = ELEMENT_LABELS[q.story_element] ?? "Story";
  const elementStyle = ELEMENT_COLORS[q.story_element] ?? ELEMENT_COLORS.character;


  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <Star className="pointer-events-none absolute right-7 top-24 z-0 h-5 w-5 text-secondary/45 animate-sparkle" />
      <MiniPlane className="pointer-events-none absolute left-7 top-28 z-0 h-6 w-6 -rotate-12 text-secondary/40 animate-float" />
      <ProgressHeader
        progress={progress}
        label={`Question ${qi + 1} of ${questions.length}`}
        onClose={onClose}
      />

      {/* Brain Check reflection (before the answer is revealed) */}
      {reflecting && !showingBrainCheck && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-ink/40 p-5 backdrop-blur-sm">
          <div className="w-full max-w-[440px] rounded-[28px] bg-card p-6 text-center shadow-soft animate-slide-up">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <BrainIcon />
            </div>
            <h3 className="font-display text-[26px] font-extrabold text-primary">Brain Check!</h3>
            <p className="mt-2 text-lg font-semibold text-ink">
              {q.brain_check_prompt ?? "Did you answer the question type?"}
            </p>
            <div className="mt-4 flex justify-center">
              <AudioButton
                text={`Brain Check! ${q.brain_check_prompt ?? "Did you answer the question type?"}`}
                label="Listen"
                size="lg"
                tone="primary"
                playing={isPlaying("brain-check-prompt")}
                onClick={() =>
                  toggle(
                    `Brain Check! ${q.brain_check_prompt ?? "Did you answer the question type?"}`,
                    "brain-check-prompt",
                  )
                }
              />
            </div>
            <div className="mt-5 space-y-3">
              <TactileButton variant="primary" onClick={handleReveal}>
                Yes 👍
              </TactileButton>
              <TactileButton variant="ghost" onClick={() => setReflecting(false)}>
                No, let me think
              </TactileButton>
            </div>
          </div>
        </div>
      )}

      {/* Brain check overlay */}

      {showingBrainCheck && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm animate-slide-up">
          <div
            className="w-full rounded-t-[32px] bg-card px-5 pb-7 pt-5 shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto w-full max-w-[560px]">
              <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-accent" />

              <div className="flex items-end gap-3 sm:gap-4">
                <img src={dariaSolo} alt="" className="h-24 w-auto shrink-0 object-contain" />
                <div className="min-w-0 flex-1">
                  <div
                    className={cn(
                      "animate-pop-in rounded-2xl rounded-bl-sm border-2 p-4 shadow-card",
                      brainCheck.type === "correct"
                        ? "border-success bg-success/8"
                        : "border-destructive/40 bg-sky",
                    )}
                  >
                    <div className="mb-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-2">
                      <span
                        className={cn(
                          "inline-flex shrink-0 items-center gap-1.5 text-sm font-bold uppercase tracking-wide",
                          brainCheck.type === "correct" ? "text-success" : "text-destructive",
                        )}
                      >
                        {brainCheck.type === "correct" ? <CheckBadge size="sm" /> : <CrossBadge size="sm" />}
                        <span>{brainCheck.type === "correct" ? "Correct" : "Not quite"}</span>
                      </span>

                      <span aria-hidden className="h-4 w-px shrink-0 bg-ink/10" />

                      <span
                        className={cn(
                          "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide",
                          elementStyle.bg,
                          elementStyle.text,
                        )}
                      >
                        <ElementIcon className="h-3.5 w-3.5" />
                        <span>{elementLabel}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {supported && (
                        <AudioButton
                          size="md"
                          tone="quiet"
                          playing={isPlaying("feedback")}
                          onClick={() => toggle(brainCheck.message, "feedback")}
                          text={brainCheck.message}
                        />
                      )}
                      <p className="min-w-0 flex-1 text-lg font-bold leading-snug text-primary">
                        {brainCheck.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mx-auto mt-6 w-full sm:max-w-[400px]">
                <TactileButton
                  variant={brainCheck.type === "correct" ? "primary" : "secondary"}
                  onClick={handleBrainCheckContinue}
                >
                  {brainCheck.type === "correct"
                    ? qi + 1 >= questions.length
                      ? "See results"
                      : "Next question"
                    : "Try again"}
                </TactileButton>
              </div>

            </div>
          </div>
        </div>
      )}


      {/* Question stage — one viewport, no scroll.
          Mobile: stacked column. Desktop: image left / question + answers right. */}
      <div
        key={`q-${qi}`}
        className="relative z-10 mx-auto flex min-h-0 w-full max-w-[520px] flex-1 flex-col justify-center gap-3 px-4 pb-4 pt-2 sm:max-w-[600px] sm:gap-4 sm:px-6 sm:pb-6 lg:max-w-[1040px] lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-8 lg:px-8 lg:pb-6"
      >
        {/* Story image — takes the leftover vertical space on phone/tablet */}
        {hintImage && (
          <figure className="relative min-h-0 w-full flex-1 animate-slide-up sm:h-[52vh] sm:flex-none lg:h-auto lg:flex-none lg:self-center">
            <div className="relative h-full min-h-[96px] w-full overflow-hidden rounded-[24px] sm:max-h-[52vh] border-[3px] border-card bg-card shadow-soft sm:rounded-[28px] sm:border-[5px] lg:h-auto lg:max-h-[58vh] lg:aspect-[4/3] lg:rounded-[32px] lg:border-[6px] lg:shadow-[0_24px_60px_-24px_color-mix(in_oklab,var(--primary)_45%,transparent)]">
              <img src={hintImage} alt="" className="h-full w-full object-cover object-center" />
              <div className="pointer-events-none absolute inset-0 rounded-[20px] ring-1 ring-inset ring-primary/10 lg:rounded-[26px]" />
            </div>
            <span
              className={cn(
                "absolute -bottom-2.5 left-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] shadow-card sm:-bottom-3 sm:px-3 sm:py-1.5 sm:text-[11px]",
                elementStyle.bg,
                elementStyle.text,
              )}
            >
              <ElementIcon className="h-3.5 w-3.5" />
              {elementLabel}
            </span>
          </figure>
        )}

        {/* Question + answers */}
        <div className="flex shrink-0 flex-col gap-2.5 sm:gap-3 lg:gap-4">

          <div className="relative shrink-0 overflow-hidden rounded-[22px] border-2 border-accent/70 bg-card p-3 shadow-card animate-slide-up lg:rounded-[26px] lg:p-4">
            <div className="absolute -right-8 -top-10 h-24 w-24 rounded-full bg-secondary/12" />
            <div className="relative flex items-center gap-3">
              {supported && (
                <AudioButton
                  size="lg"
                  tone="primary"
                  playing={isPlaying("prompt")}
                  onClick={() => toggle(q.prompt, "prompt")}
                  text={q.prompt}
                />
              )}

              <h2 className="min-w-0 flex-1 font-display text-[19px] font-extrabold leading-tight text-primary sm:text-[22px] lg:text-[26px]">
                {q.prompt}
              </h2>

              {/* Element badge lives on the image now — marker hidden here */}
            </div>
          </div>

          <div
            className={cn(
              "grid gap-2 animate-slide-up sm:gap-2.5 lg:gap-2.5",
              q.options.length % 2 === 0 ? "grid-cols-2" : "grid-cols-1",
            )}
          >
            {q.options.map((opt) => {
              const isSelected = selected === opt.id;
              const isDisabled = wrongIds.has(opt.id);
              const label = opt.label || opt.text || "";
              return (
                <div
                  key={opt.id}
                  data-answer-option={opt.id}
                  className={cn(
                    "flex min-h-[50px] w-full items-center gap-3 rounded-[18px] border-2 bg-card px-3 py-2 shadow-card transition-all sm:min-h-[56px] sm:rounded-[20px] sm:px-4 lg:min-h-[60px]",
                    isSelected &&
                      "border-primary bg-primary/5 shadow-[0_10px_24px_-14px_color-mix(in_oklab,var(--primary)_60%,transparent)]",
                    !isSelected && !isDisabled && "border-accent/60 hover:border-primary/40",
                    isDisabled && "opacity-40 border-destructive/30 bg-destructive/5",
                  )}
                >

                  {supported && !isDisabled && (
                    <AudioButton
                      size="md"
                      tone="quiet"
                      playing={isPlaying(`opt-${opt.id}`)}
                      onClick={() => toggle(label, `opt-${opt.id}`)}
                      text={label}
                      className="-my-1"
                    />
                  )}
                  <button
                    onClick={() => !isDisabled && setSelected(opt.id)}
                    disabled={isDisabled}
                    className="flex min-w-0 flex-1 items-center gap-2 self-stretch text-left"
                  >
                    <span
                      className={cn(
                        "min-w-0 flex-1 text-[15px] font-bold leading-snug lg:text-[17px]",
                        isDisabled ? "text-ink-soft line-through" : "text-ink",
                      )}
                    >
                      {label}
                    </span>
                    {isSelected && <SelectedCheck />}
                    {isDisabled && <CrossBadge />}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Check button */}
          <div className="mx-auto w-full shrink-0 lg:max-w-[380px]">
            <TactileButton
              variant="secondary"
              onClick={() => setReflecting(true)}
              disabled={!selected || showingBrainCheck || reflecting}
              leadingIcon={
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                >
                  <path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            >
              Check Answer
            </TactileButton>
          </div>
        </div>
      </div>



    </div>
  );
}


function SelectedCheck() {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
      <svg
        viewBox="0 0 24 24"
        className="h-3 w-3"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
      >
        <path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function CheckBadge({ size = "md" }: { size?: "sm" | "md" }) {
  const box = size === "sm" ? "h-5 w-5" : "h-8 w-8";
  const icon = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-success text-success-foreground",
        box,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className={icon}
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
      >
        <path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function CrossBadge({ size = "md" }: { size?: "sm" | "md" }) {
  const box = size === "sm" ? "h-5 w-5" : "h-8 w-8";
  const icon = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";
  return (
    <span
      className={cn(
        "flex items-center justify-center rounded-full bg-destructive text-destructive-foreground",
        box,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className={icon}
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
      >
        <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function BrainIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-10 w-10 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.5 3.5A2.5 2.5 0 0 1 12 6v12a2.5 2.5 0 0 1-4.96.44A2.5 2.5 0 0 1 4 16.5a2.5 2.5 0 0 1-.5-4.9A2.5 2.5 0 0 1 4 6.9a2.5 2.5 0 0 1 2.5-2.4 2.5 2.5 0 0 1 3-1z" />
      <path d="M14.5 3.5A2.5 2.5 0 0 0 12 6v12a2.5 2.5 0 0 0 4.96.44A2.5 2.5 0 0 0 20 16.5a2.5 2.5 0 0 0 .5-4.9A2.5 2.5 0 0 0 20 6.9a2.5 2.5 0 0 0-2.5-2.4 2.5 2.5 0 0 0-3-1z" />
    </svg>
  );
}
