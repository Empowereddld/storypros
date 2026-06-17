/* ─────────────────────────────────────────────
 * Vocabulary Quiz Phase — Must-Complete
 * 6 questions per word, cycles through all words.
 * Same must-complete model as Comprehension.
 * ───────────────────────────────────────────── */

import { useState, useRef } from "react";
import { TactileButton } from "../TactileButton";
import { ProgressHeader } from "./ProgressHeader";
import type { StoryPhaseProps, PhaseResult, ActivityAttempt, VocabularyWord, VocabQuizQuestion } from "@/types/story";
import { cn } from "@/lib/utils";
import dariaSolo from "@/assets/daria-solo.png";

type FeedbackState =
  | { type: "none" }
  | { type: "correct" }
  | { type: "wrong" };

export function VocabularyQuizPhase({ storyData, onComplete, onClose, childId = "demo" }: StoryPhaseProps) {
  const words = storyData.vocabulary_words;
  const [wordIdx, setWordIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>({ type: "none" });
  const [attempts, setAttempts] = useState<ActivityAttempt[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [wrongIds, setWrongIds] = useState<Set<string>>(new Set());
  const [optionsRevealed, setOptionsRevealed] = useState(false);
  const startTime = useRef(Date.now());

  const word = words[wordIdx];
  const questions = word.quiz_questions;
  const q = questions[qIdx];

  // Total questions across all words
  const totalQuestions = words.reduce((sum, w) => sum + w.quiz_questions.length, 0);
  const questionsCompleted = words.slice(0, wordIdx).reduce((sum, w) => sum + w.quiz_questions.length, 0) + qIdx;
  const progress = (questionsCompleted / totalQuestions) * 100;

  function handleCheck() {
    if (!selected) return;

    const elapsed = Date.now() - startTime.current;
    const option = q.options.find((o) => o.id === selected)!;
    const isCorrect = option.correct;

    const attempt: ActivityAttempt = {
      child_id: childId,
      story_id: storyData.id,
      activity_type: "vocab_quiz",
      question_index: questionsCompleted,
      attempt_number: currentAttempt,
      selected_option: selected,
      is_correct: isCorrect,
      time_ms: elapsed,
    };
    setAttempts((prev) => [...prev, attempt]);

    if (isCorrect) {
      setFeedback({ type: "correct" });
    } else {
      setWrongIds((prev) => new Set(prev).add(selected));
      setFeedback({ type: "wrong" });
      setCurrentAttempt((a) => a + 1);
    }
  }

  function handleContinue() {
    if (feedback.type === "correct") {
      // Next question or next word or done
      if (qIdx + 1 < questions.length) {
        setQIdx(qIdx + 1);
      } else if (wordIdx + 1 < words.length) {
        setWordIdx(wordIdx + 1);
        setQIdx(0);
      } else {
        // All done
        const firstAttempts = attempts.filter((a) => a.attempt_number === 1);
        const correctFirst = firstAttempts.filter((a) => a.is_correct).length;
        const accuracy = totalQuestions > 0 ? correctFirst / totalQuestions : 0;

        onComplete({
          phase: "vocab-quiz",
          attempts: [...attempts],
          first_attempt_accuracy: accuracy,
          completed: true,
        });
        return;
      }
      setSelected(null);
      setFeedback({ type: "none" });
      setCurrentAttempt(1);
      setWrongIds(new Set());
      setOptionsRevealed(false);
      startTime.current = Date.now();
    } else {
      // Wrong — try again
      setSelected(null);
      setFeedback({ type: "none" });
    }
  }

  const showingFeedback = feedback.type !== "none";

  return (
    <div className="flex h-full flex-col">
      <ProgressHeader
        progress={progress}
        label={`${word.word} — Q${qIdx + 1} of ${questions.length}`}
        onClose={onClose}
      />

      {/* Feedback overlay */}
      {showingFeedback && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm animate-slide-up">
          <div className="w-full rounded-t-[32px] bg-card p-6 pb-8 shadow-soft" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted" />

            <div className="flex items-start gap-3">
              <img src={dariaSolo} alt="" className="h-16 w-auto object-contain" />
              <div className="flex-1">
                <div className={cn(
                  "rounded-2xl rounded-bl-sm p-4 shadow-card",
                  feedback.type === "correct" ? "bg-success/10 border-2 border-success" : "bg-sky",
                )}>
                  <p className="text-base font-semibold leading-snug text-primary">
                    {feedback.type === "correct"
                      ? `You really know what "${word.word}" means!`
                      : `Think about what we learned about "${word.word}." Let's try again!`}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              {feedback.type === "correct" ? (
                <>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success text-success-foreground">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor" strokeWidth="3" fill="none">
                      <path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-lg font-bold text-success">Correct!</span>
                </>
              ) : (
                <>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor" strokeWidth="3" fill="none">
                      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span className="text-lg font-bold text-destructive">Let's try again!</span>
                </>
              )}
            </div>

            <div className="mt-5">
              <TactileButton
                variant={feedback.type === "correct" ? "primary" : "secondary"}
                onClick={handleContinue}
              >
                {feedback.type === "correct"
                  ? qIdx + 1 >= questions.length && wordIdx + 1 >= words.length
                    ? "See results"
                    : "Next"
                  : "Try again"}
              </TactileButton>
            </div>
          </div>
        </div>
      )}

      {/* Word badge */}
      <div className="mx-5 mt-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-sm font-bold capitalize">
          {word.word[0]}
        </span>
        <span className="text-sm font-bold uppercase tracking-wider text-primary capitalize">
          {word.word}
        </span>
      </div>

      {/* Question prompt — always visible */}
      <h2
        key={`vq-${wordIdx}-${qIdx}`}
        className="mx-5 mt-3 font-display text-[24px] leading-tight font-extrabold text-primary animate-slide-up"
      >
        {q.prompt}
      </h2>

      {/* Say-Then-Choose: show prompt first, reveal options on tap */}
      {!optionsRevealed ? (
        <div className="flex flex-1 flex-col items-center justify-center px-5">
          <p className="text-center text-base font-semibold text-ink-soft mb-4">
            Think about what you learned, then tap below!
          </p>
          <TactileButton onClick={() => { setOptionsRevealed(true); startTime.current = Date.now(); }}>
            Show answers
          </TactileButton>
        </div>
      ) : (
        <>
          {/* Options revealed */}
          <div className="mx-5 mt-4 space-y-3 flex-1 overflow-y-auto no-scrollbar pb-2 animate-slide-up">
            {q.options.map((opt) => {
              const isSelected = selected === opt.id;
              const isDisabled = wrongIds.has(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => !isDisabled && setSelected(opt.id)}
                  disabled={isDisabled}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-3xl border-2 bg-card p-4 text-left shadow-card transition-all",
                    isSelected && "border-primary bg-primary/5 -translate-y-0.5",
                    !isSelected && !isDisabled && "border-transparent hover:border-primary/40",
                    isDisabled && "opacity-40 border-destructive/30 bg-destructive/5",
                  )}
                >
                  <span className={cn(
                    "flex-1 text-base font-bold",
                    isDisabled ? "text-ink-soft line-through" : "text-primary",
                  )}>
                    {opt.text || opt.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Check button */}
          <div className="mx-5 mb-5">
            <TactileButton onClick={handleCheck} disabled={!selected || showingFeedback}>
              Check
            </TactileButton>
          </div>
        </>
      )}
    </div>
  );
}
