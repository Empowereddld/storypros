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
import { speak, stop, speedToRate, preloadVoices, isSupported } from "@/services/tts";
import dariaSolo from "@/assets/daria-pointing.webp";
import { resolveStoryImage } from "@/services/storyImages";
import { MiniPlane, Star } from "../StoryProsBrand";
import { useDevSubSteps } from "./DevPhaseNav";

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

  const [speaking, setSpeaking] = useState(false);
  const startTime = useRef(Date.now());

  useEffect(() => {
    preloadVoices();
  }, []);
  useEffect(() => {
    return () => {
      stop();
      setSpeaking(false);
    };
  }, [qi]);

  async function handleListen() {
    if (speaking) {
      stop();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    try {
      await speak(q.prompt, { rate: speedToRate(ttsSpeed) });
    } catch {
      /* TTS unavailable — the child can still read the prompt */
    }
    setSpeaking(false);
  }

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
            <div className="mt-6 space-y-3">
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

                    <p className="text-lg font-bold leading-snug text-primary">
                      {brainCheck.message}
                    </p>
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


      {/* Question prompt - always visible */}
      <div key={`q-${qi}`} className="relative z-10 mx-auto mt-3 w-full max-w-[560px] shrink-0 px-5 animate-slide-up">
        {hintImage && (
          <div className="relative mb-2 aspect-video w-full overflow-hidden rounded-[24px] border-[4px] border-card bg-card shadow-soft">
            <img src={hintImage} alt="" className="h-full w-full object-cover object-center" />
          </div>
        )}
        <div className="relative overflow-hidden rounded-[24px] border-2 border-accent/70 bg-card p-3.5 shadow-card">
          <div className="absolute -right-8 -top-10 h-24 w-24 rounded-full bg-secondary/12" />
          <div className="relative flex items-center gap-3">
            <button
              onClick={handleListen}
              disabled={!isSupported()}
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-full ring-2 transition-all active:scale-95",
                elementStyle.bg,
                elementStyle.text,
                elementStyle.ring,
                speaking && "animate-pulse-glow",
              )}
              aria-label={isSupported() ? "Hear question" : elementLabel}
              title={elementLabel}
            >
              <ElementIcon className="h-5 w-5" />
            </button>

            <h2 className="min-w-0 flex-1 font-display text-[22px] font-extrabold leading-tight text-primary">
              {q.prompt}
            </h2>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-3 grid w-full max-w-[560px] flex-1 grid-cols-2 gap-2.5 overflow-y-auto px-5 pb-2 no-scrollbar animate-slide-up">
        {q.options.map((opt) => {
          const isSelected = selected === opt.id;
          const isDisabled = wrongIds.has(opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => !isDisabled && setSelected(opt.id)}
              disabled={isDisabled}
              className={cn(
                "flex min-h-[60px] w-full items-center justify-center gap-2 rounded-[20px] border-2 bg-card px-4 py-2.5 text-center shadow-card transition-all",
                isSelected && "border-primary bg-primary/5 shadow-sm",
                !isSelected && !isDisabled && "border-accent/60 hover:border-primary/40",
                isDisabled && "opacity-40 border-destructive/30 bg-destructive/5",
              )}
            >
              <span
                className={cn(
                  "text-[15px] font-bold leading-snug",
                  isDisabled ? "text-ink-soft line-through" : "text-ink",
                )}
              >
                {opt.label || opt.text}
              </span>
              {isSelected && <SelectedCheck />}
              {isDisabled && <CrossBadge />}
            </button>
          );
        })}
      </div>

      {/* Check button */}
      <div className="relative z-10 mx-auto mb-5 mt-2 w-full max-w-[600px] px-5">
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
