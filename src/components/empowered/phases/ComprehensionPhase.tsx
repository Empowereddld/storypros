/* ---------------------------------------------
 * Comprehension Phase - Must-Complete Model
 * Say-then-choose: child considers the question,
 * then reveals choices. Must answer correctly to
 * advance. Brain checks confirm / prompt.
 * --------------------------------------------- */

import { useState, useRef, useEffect } from "react";
import { TactileButton } from "../TactileButton";
import { ProgressHeader } from "./ProgressHeader";
import type { StoryPhaseProps, ActivityAttempt } from "@/types/story";
import { cn } from "@/lib/utils";
import { speak, stop, speedToRate, preloadVoices, isSupported } from "@/services/tts";
import dariaSolo from "@/assets/daria-pointing.webp";
import { resolveStoryImage } from "@/services/storyImages";
import { MiniPlane, Star } from "../StoryProsBrand";

type BrainCheckState =
  | { type: "none" }
  | { type: "correct"; message: string }
  | { type: "wrong"; message: string };

export function ComprehensionPhase({ storyData, onComplete, onClose, ttsSpeed = "normal", childId = "demo" }: StoryPhaseProps) {
  const questions = storyData.comprehension_questions;
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [brainCheck, setBrainCheck] = useState<BrainCheckState>({ type: "none" });
  const [attempts, setAttempts] = useState<ActivityAttempt[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [wrongIds, setWrongIds] = useState<Set<string>>(new Set());
  const [optionsRevealed, setOptionsRevealed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const startTime = useRef(Date.now());

  useEffect(() => { preloadVoices(); }, []);
  useEffect(() => { return () => { stop(); setSpeaking(false); }; }, [qi]);

  async function handleListen() {
    if (speaking) { stop(); setSpeaking(false); return; }
    setSpeaking(true);
    try { await speak(q.prompt, { rate: speedToRate(ttsSpeed) }); } catch {}
    setSpeaking(false);
  }

  const q = questions[qi];
  const progress = (qi / questions.length) * 100;

  function handleCheck() {
    if (!selected) return;

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
      setOptionsRevealed(false);
      setShowHint(false);
      startTime.current = Date.now();
    } else {
      setSelected(null);
      setBrainCheck({ type: "none" });
    }
  }

  const showingBrainCheck = brainCheck.type !== "none";

  const hintSlide = storyData.slides.find(
    (s) => s.story_element === q.story_element,
  );
  const hintImage = resolveStoryImage(storyData.id, hintSlide?.image);

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <Star className="pointer-events-none absolute right-7 top-24 z-0 h-5 w-5 text-secondary/45 animate-sparkle" />
      <MiniPlane className="pointer-events-none absolute left-7 top-28 z-0 h-6 w-6 -rotate-12 text-secondary/40 animate-float" />
      <ProgressHeader
        progress={progress}
        label={`Question ${qi + 1} of ${questions.length}`}
        onClose={onClose}
      />

      {/* Brain check overlay */}
      {showingBrainCheck && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm animate-slide-up">
          <div className="w-full rounded-t-[32px] bg-card p-6 pb-8 shadow-soft" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-accent" />

            <div className="flex items-start gap-3">
              <img src={dariaSolo} alt="" className="h-16 w-auto object-contain" />
              <div className="flex-1">
                <div className={cn(
                  "rounded-2xl rounded-bl-sm p-4 shadow-card",
                  brainCheck.type === "correct" ? "bg-success/10 border-2 border-success animate-tada" : "bg-sky animate-shake",
                )}>
                  <p className="text-base font-semibold leading-snug text-primary">
                    {brainCheck.message}
                  </p>
                </div>
              </div>
            </div>

            {brainCheck.type === "correct" && (
              <div className="mt-4 flex items-center justify-center gap-2 text-success">
                <CheckBadge />
                <span className="text-lg font-bold">Correct!</span>
              </div>
            )}

            {brainCheck.type === "wrong" && (
              <div className="mt-4 flex items-center justify-center gap-2 text-destructive">
                <CrossBadge />
                <span className="text-lg font-bold">Let's try again!</span>
              </div>
            )}

            <div className="mt-5">
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
      )}

      {/* Question prompt - always visible */}
      <div key={`q-${qi}`} className="relative z-10 mx-5 mt-4 animate-slide-up">
        {hintImage && (
          <div className="relative mb-3 overflow-hidden rounded-[30px] border-[5px] border-card bg-card shadow-soft">
            <img src={hintImage} alt="" className="h-[178px] w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink/45 to-transparent" />
            <div className="absolute bottom-3 left-3 rounded-full bg-card/95 px-3 py-1 text-xs font-extrabold text-primary shadow-card">
              Story clue
            </div>
          </div>
        )}
        <div className="relative overflow-hidden rounded-[28px] border-2 border-accent/70 bg-card p-4 shadow-card">
          <div className="absolute -right-8 -top-10 h-24 w-24 rounded-full bg-secondary/12" />
          <div className="relative flex items-start gap-3">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-xl font-extrabold text-primary-foreground shadow-[0_4px_0_var(--primary-deep)]">
              ?
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold uppercase tracking-wider text-secondary-deep">
                Question {qi + 1}
              </p>
              <h2 className="mt-1 font-display text-[24px] font-extrabold leading-tight text-primary">
                {q.prompt}
              </h2>
              <p className="mt-1.5 text-sm font-semibold text-ink-soft">Choose the right answer.</p>
            </div>
            {isSupported() && (
              <button
                onClick={handleListen}
                className={cn(
                  "mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full btn-tactile transition-all",
                  speaking ? "bg-destructive text-destructive-foreground animate-pulse-glow" : "bg-secondary text-secondary-foreground",
                )}
                aria-label={speaking ? "Stop audio" : "Hear question"}
              >
                {speaking ? (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Say-Then-Choose: show prompt first, reveal options on tap */}
      {!optionsRevealed ? (
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5">
          <div className="w-full rounded-[30px] border-2 border-accent/70 bg-card p-5 text-center shadow-card">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky text-primary">
              <ThoughtIcon />
            </div>
            <p className="mx-auto mb-4 max-w-[16rem] text-base font-bold leading-snug text-primary">
              Think about the story first. Then choose your answer.
            </p>
            <TactileButton onClick={() => { setOptionsRevealed(true); startTime.current = Date.now(); }}>
              Show answers
            </TactileButton>
          </div>
        </div>
      ) : (
        <>
          <div className="relative z-10 mx-5 mt-4 space-y-3 flex-1 overflow-y-auto no-scrollbar pb-2 animate-slide-up">
            {q.options.map((opt, oidx) => {
              const isSelected = selected === opt.id;
              const isDisabled = wrongIds.has(opt.id);
              const letter = String.fromCharCode(65 + oidx);
              return (
                <button
                  key={opt.id}
                  onClick={() => !isDisabled && setSelected(opt.id)}
                  disabled={isDisabled}
                  className={cn(
                    "flex min-h-[76px] w-full items-center gap-3 rounded-[24px] border-2 bg-card p-3 text-left shadow-card transition-all",
                    isSelected && "border-primary bg-primary/5 -translate-y-0.5 shadow-soft",
                    !isSelected && !isDisabled && "border-accent/60 hover:border-primary/40",
                    isDisabled && "opacity-40 border-destructive/30 bg-destructive/5",
                  )}
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-sky text-primary">
                    <OptionGlyph />
                  </span>
                  <span className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold shadow-[0_2px_0_rgba(0,0,0,0.08)]",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-accent text-primary",
                  )}>
                    {letter}
                  </span>
                  <span className={cn(
                    "flex-1 text-base font-bold",
                    isDisabled ? "text-ink-soft line-through" : "text-ink",
                  )}>
                    {opt.label || opt.text}
                  </span>
                  {isSelected && <SelectedCheck />}
                  {isDisabled && <CrossBadge />}
                </button>
              );
            })}
          </div>

          {/* Support buttons - Listen Again + Look Again */}
          <div className="relative z-10 mx-5 mt-2 flex items-center gap-2">
            {isSupported() && (
              <button
                onClick={handleListen}
                className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-bold text-primary shadow-card btn-tactile"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                Listen again
              </button>
            )}
            {hintSlide && (
              <button
                onClick={() => setShowHint(!showHint)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-card btn-tactile",
                  showHint ? "bg-sky text-primary" : "bg-card text-primary",
                )}
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                {showHint ? "Hide hint" : "Look again"}
              </button>
            )}
          </div>

          {showHint && hintSlide && (
            <div className="relative z-10 mx-5 mt-2 rounded-[22px] border-2 border-sky bg-sky/50 p-3 animate-slide-up">
              <p className="flex gap-2 text-sm font-semibold text-primary/80 leading-snug">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-primary-foreground">
                  i
                </span>
                <span>{hintSlide.text}</span>
              </p>
            </div>
          )}

          {/* Check button */}
          <div className="relative z-10 mx-5 mb-5 mt-2">
            <TactileButton
              variant="secondary"
              onClick={handleCheck}
              disabled={!selected || showingBrainCheck}
              leadingIcon={
                <svg viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor" strokeWidth="3" fill="none"><path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" /></svg>
              }
            >
              Check Answer
            </TactileButton>
          </div>
        </>
      )}
    </div>
  );
}

function ThoughtIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
      <path d="M9 18h6" strokeLinecap="round" />
      <path d="M10 22h4" strokeLinecap="round" />
      <path
        d="M8 14.5c-1.3-1.1-2-2.6-2-4.3C6 6.8 8.7 4 12 4s6 2.8 6 6.2c0 1.7-.7 3.2-2 4.3-.7.6-1.1 1.3-1.2 2.1H9.2c-.1-.8-.5-1.5-1.2-2.1Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function OptionGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
      <path d="M5 12h12" strokeLinecap="round" />
      <path d="M13 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SelectedCheck() {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
      <svg viewBox="0 0 24 24" className="h-4 w-4" stroke="currentColor" strokeWidth="3" fill="none">
        <path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function CheckBadge() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success text-success-foreground">
      <svg viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor" strokeWidth="3" fill="none">
        <path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function CrossBadge() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
      <svg viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor" strokeWidth="3" fill="none">
        <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
      </svg>
    </span>
  );
}
