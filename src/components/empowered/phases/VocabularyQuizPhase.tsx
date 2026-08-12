import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { ActivityAttempt, StoryPhaseProps } from "@/types/story";
import { TactileButton } from "../TactileButton";
import { MiniPlane, Star } from "../StoryProsBrand";
import { BookCheckIcon, ChevronRightIcon } from "../StoryProsUi";
import { ProgressHeader } from "./ProgressHeader";
import { useListen } from "./ListenButton";
import { AudioButton } from "../AudioButton";
import { useDevSubSteps } from "./DevPhaseNav";

type FeedbackState = { type: "none" } | { type: "correct" } | { type: "wrong" };

export function VocabularyQuizPhase({
  storyData,
  onComplete,
  onClose,
  ttsSpeed = "normal",
  childId = "demo",
}: StoryPhaseProps) {
  const { supported, isPlaying, toggle, cancel } = useListen(ttsSpeed);
  const words = storyData.vocabulary_words;
  const [wordIdx, setWordIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const devFlatQuestions = words.flatMap((w, wi) =>
    w.quiz_questions.map((_, qi2) => ({ wi, qi2 })),
  );
  useDevSubSteps(
    devFlatQuestions.length,
    Math.max(
      0,
      devFlatQuestions.findIndex((q) => q.wi === wordIdx && q.qi2 === qIdx),
    ),
    (i: number) => {
      const target = devFlatQuestions[i];
      if (!target) return;
      setWordIdx(target.wi);
      setQIdx(target.qi2);
    },
    "question",
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>({ type: "none" });
  const [attempts, setAttempts] = useState<ActivityAttempt[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [wrongIds, setWrongIds] = useState<Set<string>>(new Set());
  const [optionsRevealed, setOptionsRevealed] = useState(false);
  const startTime = useRef(Date.now());

  const word = words[wordIdx];
  const questions = word.quiz_questions;
  const question = questions[qIdx];
  const totalQuestions = words.reduce((sum, item) => sum + item.quiz_questions.length, 0);
  const questionsCompleted =
    words.slice(0, wordIdx).reduce((sum, item) => sum + item.quiz_questions.length, 0) + qIdx;
  const progress = (questionsCompleted / totalQuestions) * 100;
  const showingFeedback = feedback.type !== "none";

  // Stop narration when the question changes.
  useEffect(() => cancel, [wordIdx, qIdx, cancel]);

  function handleCheck() {
    if (!selected) return;

    const elapsed = Date.now() - startTime.current;
    const option = question.options.find((item) => item.id === selected);
    const isCorrect = !!option?.correct;
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
      setCurrentAttempt((attemptNumber) => attemptNumber + 1);
    }
  }

  function handleContinue() {
    if (feedback.type === "correct") {
      if (qIdx + 1 < questions.length) {
        setQIdx(qIdx + 1);
      } else if (wordIdx + 1 < words.length) {
        setWordIdx(wordIdx + 1);
        setQIdx(0);
      } else {
        earnCoins({
          storyId: storyData.id,
          activity: "vocabulary",
          amount: COIN_ECONOMY.vocabulary.completion,
          label: "Story Words complete!",
        });
        const firstAttempts = attempts.filter((attempt) => attempt.attempt_number === 1);
        const correctFirst = firstAttempts.filter((attempt) => attempt.is_correct).length;
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
      return;
    }

    setSelected(null);
    setFeedback({ type: "none" });
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-accent/10 to-accent/35" />
        <Star className="absolute left-8 top-32 h-4 w-4 text-secondary animate-sparkle" />
        <Star className="absolute right-9 top-48 h-5 w-5 text-primary/30 animate-sparkle" />
        <MiniPlane className="absolute right-10 bottom-24 h-9 w-9 rotate-12 text-secondary animate-float" />
      </div>

      <div className="relative z-10">
        <ProgressHeader
          progress={progress}
          label={`Q${qIdx + 1}/${questions.length}`}
          onClose={onClose}
        />
      </div>

      {showingFeedback && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm">
          <div className="w-full rounded-t-[32px] bg-card p-6 pb-8 shadow-soft animate-slide-up">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-accent" />
            <div
              className={cn(
                "rounded-[24px] p-4 text-center shadow-card",
                feedback.type === "correct"
                  ? "border-2 border-success bg-success/10 animate-tada"
                  : "bg-sky animate-shake",
              )}
            >
              <p className="text-xl font-extrabold text-primary">
                {feedback.type === "correct" ? "Correct!" : "Try again"}
              </p>
              <p className="mt-2 text-sm font-semibold leading-snug text-ink-soft">
                {feedback.type === "correct"
                  ? `You know what "${word.word}" means.`
                  : `Think about what we learned about "${word.word}".`}
              </p>
            </div>
            <div className="mt-5">
              <TactileButton
                variant={feedback.type === "correct" ? "primary" : "secondary"}
                onClick={handleContinue}
              >
                {feedback.type === "correct" ? "Next" : "Try Again"}
              </TactileButton>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-1 flex-col overflow-hidden px-5 pb-5 pt-4">
        <section className="rounded-[30px] bg-card p-5 text-center shadow-soft animate-slide-up">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-[22px] bg-accent text-primary">
            <BookCheckIcon className="h-8 w-8" />
          </span>
          <p className="mt-3 text-xs font-extrabold uppercase tracking-wide text-secondary-foreground">
            Word Check
          </p>
          <h1 className="mt-1 text-[32px] font-extrabold capitalize leading-none text-primary">
            {word.word}
          </h1>
          <div className="mt-4 flex items-center gap-3 text-left">
            {supported && (
              <AudioButton
                size="md"
                playing={isPlaying("prompt")}
                onClick={() => toggle(question.prompt, "prompt")}
                ariaLabel="Hear the question"
              />
            )}
            <p className="flex-1 text-[23px] font-extrabold leading-tight text-ink">
              {question.prompt}
            </p>
          </div>

        </section>

        {!optionsRevealed ? (
          <div className="flex flex-1 flex-col items-center justify-center">
            <p className="mb-4 max-w-[260px] text-center text-base font-semibold leading-snug text-ink-soft">
              Think about the word, then choose your answer.
            </p>
            <TactileButton
              onClick={() => {
                setOptionsRevealed(true);
                startTime.current = Date.now();
              }}
            >
              Show Answers <ChevronRightIcon className="h-5 w-5 text-secondary" />
            </TactileButton>
          </div>
        ) : (
          <>
            <div className="mt-4 flex-1 space-y-3 overflow-y-auto no-scrollbar pb-2 animate-slide-up">
              {question.options.map((option, index) => {
                const isSelected = selected === option.id;
                const isDisabled = wrongIds.has(option.id);
                const label = option.text || option.label || "";
                return (
                  <div
                    key={option.id}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-[26px] border-2 bg-card px-3 py-3 shadow-card transition-all",
                      isSelected && "border-primary bg-primary/5",
                      !isSelected && !isDisabled && "border-accent/60 hover:border-primary/50",
                      isDisabled && "border-destructive/30 bg-destructive/5 opacity-45",
                    )}
                  >
                    {supported && !isDisabled && (
                      <AudioButton
                        size="md"
                        tone="quiet"
                        playing={isPlaying(`opt-${option.id}`)}
                        onClick={() => toggle(label, `opt-${option.id}`)}
                        text={label}
                        className="-my-1"
                      />
                    )}
                    <button
                      onClick={() => !isDisabled && setSelected(option.id)}
                      disabled={isDisabled}
                      className="flex min-w-0 flex-1 items-center gap-3 self-stretch text-left"
                    >
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-accent/70 text-primary",
                        )}
                      >
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span
                        className={cn(
                          "min-w-0 flex-1 text-base font-extrabold leading-snug",
                          isDisabled ? "text-ink-soft line-through" : "text-ink",
                        )}
                      >
                        {label}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>

            <TactileButton onClick={handleCheck} disabled={!selected || showingFeedback}>
              Check Answer
            </TactileButton>
          </>
        )}
      </div>
    </div>
  );
}
