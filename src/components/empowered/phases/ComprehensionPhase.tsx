/* ─────────────────────────────────────────────
 * Comprehension Phase — Must-Complete Model
 * 6 questions, 4 choices each.
 * Child must answer correctly before moving on.
 * Brain checks: correct confirms, wrong prompts.
 * ───────────────────────────────────────────── */

import { useState, useRef, useEffect } from "react";
import { TactileButton } from "../TactileButton";
import { ProgressHeader } from "./ProgressHeader";
import type { StoryPhaseProps, PhaseResult, ActivityAttempt, ComprehensionQuestion, AnswerOption } from "@/types/story";
import { cn } from "@/lib/utils";
import { speak, stop, speedToRate, preloadVoices, isSupported } from "@/services/tts";
import dariaSolo from "@/assets/daria-solo.png";

type BrainCheckState =
  | { type: "none" }
  | { type: "correct"; message: string }
  | { type: "wrong"; message: string }
  | { type: "explain"; actual: string; expected: string };

export function ComprehensionPhase({ storyData, onComplete, onClose, ttsSpeed = "normal" }: StoryPhaseProps) {
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

    // Record attempt
    const attempt: ActivityAttempt = {
      child_id: "demo",
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
      // Show confirming brain check
      setBrainCheck({ type: "correct", message: q.brain_check_correct });
    } else {
      // Show prompting brain check
      setWrongIds((prev) => new Set(prev).add(selected));
      setBrainCheck({ type: "wrong", message: q.brain_check_wrong });
      setCurrentAttempt((a) => a + 1);
    }
  }

  function handleBrainCheckContinue() {
    if (brainCheck.type === "correct") {
      // Move to next question
      if (qi + 1 >= questions.length) {
        // All done — calculate first-attempt accuracy
        const firstAttempts = attempts.filter(
          (a) => a.attempt_number === 1 && a.activity_type === "comprehension",
        );
        // Include the current correct attempt if it was attempt 1
        const allFirst = [...firstAttempts];
        if (currentAttempt === 1) {
          // This correct answer was first attempt — already in attempts
        }
        const uniqueQuestions = new Set(allFirst.map((a) => a.question_index));
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
      // Wrong answer — let child try again
      setSelected(null);
      setBrainCheck({ type: "none" });
    }
  }

  const showingBrainCheck = brainCheck.type !== "none";

  // Find the matching slide text for the "Look Again" hint
  const hintSlide = storyData.slides.find(
    (s) => s.story_element === q.story_element,
  );

  return (
    <div className="flex h-full flex-col">
      <ProgressHeader
        progress={progress}
        label={`Question ${qi + 1} of ${questions.length}`}
        onClose={onClose}
      />

      {/* Brain check overlay */}
      {showingBrainCheck && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm animate-slide-up">
          <div className="w-full rounded-t-[32px] bg-card p-6 pb-8 shadow-soft" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted" />

            <div className="flex items-start gap-3">
              <img src={dariaSolo} alt="" className="h-16 w-auto object-contain" />
              <div className="flex-1">
                <div className={cn(
                  "rounded-2xl rounded-bl-sm p-4 shadow-card",
                  brainCheck.type === "correct" ? "bg-success/10 border-2 border-success" : "bg-sky",
                )}>
                  <p className="text-base font-semibold leading-snug text-primary">
                    {brainCheck.type === "correct"
                      ? brainCheck.message
                      : brainCheck.message}
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

      {/* Question prompt — always visible */}
      <div key={`q-${qi}`} className="mx-5 mt-5 flex items-start gap-3 animate-slide-up">
        <h2 className="flex-1 font-display text-[26px] leading-tight font-extrabold text-primary">
          {q.prompt}
        </h2>
        {isSupported() && (
          <button
            onClick={handleListen}
            className={cn(
              "mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full btn-tactile transition-all",
              speaking ? "bg-destructive text-destructive-foreground animate-pulse-glow" : "bg-primary text-primary-foreground",
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

      {/* Say-Then-Choose: show prompt first, reveal options on tap */}
      {!optionsRevealed ? (
        /* Step 1 — Child reads/listens to the question, then taps to see choices */
        <div className="flex flex-1 flex-col items-center justify-center px-5">
          <p className="text-center text-base font-semibold text-ink-soft mb-4">
            Think about the answer, then tap below!
          </p>
          <TactileButton onClick={() => { setOptionsRevealed(true); startTime.current = Date.now(); }}>
            Show answers
          </TactileButton>
        </div>
      ) : (
        <>
          {/* Step 2 — Answer options revealed */}
          <div className="mx-5 mt-5 space-y-3 flex-1 overflow-y-auto no-scrollbar pb-2 animate-slide-up">
            {q.options.map((opt) => {
              const isSelected = selected === opt.id;
              const isDisabled = wrongIds.has(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => !isDisabled && setSelected(opt.id)}
                  disabled={isDisabled}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-3xl border-2 bg-card p-3 text-left shadow-card transition-all",
                    isSelected && "border-primary bg-primary/5 -translate-y-0.5",
                    !isSelected && !isDisabled && "border-transparent hover:border-primary/40",
                    isDisabled && "opacity-40 border-destructive/30 bg-destructive/5",
                  )}
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky text-3xl">
                    {opt.emoji || "📝"}
                  </span>
                  <span className={cn(
                    "flex-1 text-lg font-bold",
                    isDisabled ? "text-ink-soft line-through" : "text-primary",
                  )}>
                    {opt.label || opt.text}
                  </span>
                  {isDisabled && <CrossBadge />}
                </button>
              );
            })}
          </div>

          {/* Support buttons — Listen Again + Look Again */}
          <div className="mx-5 mt-2 flex items-center gap-2">
            {isSupported() && (
              <button
                onClick={handleListen}
                className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary btn-tactile"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                Listen again
              </button>
            )}
            {hintSlide && (
              <button
                onClick={() => setShowHint(!showHint)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold btn-tactile",
                  showHint ? "bg-sky text-primary" : "bg-primary/10 text-primary",
                )}
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                {showHint ? "Hide hint" : "Look again"}
              </button>
            )}
          </div>

          {/* Look Again hint — shows matching slide text */}
          {showHint && hintSlide && (
            <div className="mx-5 mt-2 rounded-2xl bg-sky/50 p-3 animate-slide-up">
              <p className="text-sm font-semibold text-primary/80 leading-snug">
                📖 {hintSlide.text}
              </p>
            </div>
          )}

          {/* Check button */}
          <div className="mx-5 mb-5 mt-2">
            <TactileButton onClick={handleCheck} disabled={!selected || showingBrainCheck}>
              Check
            </TactileButton>
          </div>
        </>
      )}
    </div>
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
