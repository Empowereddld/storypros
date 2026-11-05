import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { ActivityAttempt, StoryPhaseProps } from "@/types/story";
import { TactileButton } from "../TactileButton";
import { MiniPlane, Star } from "../StoryProsBrand";
import { BookCheckIcon } from "../StoryProsUi";
import { ProgressHeader } from "./ProgressHeader";
import { useListen } from "./ListenButton";
import { AudioButton } from "../AudioButton";
import { useDevSubSteps } from "./DevPhaseNav";
import { earnCoins } from "@/services/coins";
import { COIN_ECONOMY } from "@/services/coinEconomy";
import { getOptionPictureCue } from "@/data/optionPictureCues";
import { resolveStoryImage } from "@/services/storyImages";

type FeedbackState = { type: "none" } | { type: "correct" } | { type: "wrong" };

function correctFeedback(prompt: string, wordText: string): string {
  const p = prompt.toLowerCase();
  if (p.startsWith("what category") || p.startsWith("what group"))
    return `You know what category ${wordText} is in.`;
  if (p.startsWith("what do you do with"))
    return `You know what you do with a ${wordText}.`;
  if (p.startsWith("when do you feel")) return `You know when you feel ${wordText}.`;
  if (p.startsWith("what does someone look like"))
    return `You know what someone looks like when they feel ${wordText}.`;
  if (p.startsWith("what does") && p.includes("look like"))
    return `You know what ${wordText} looks like.`;
  if (p.startsWith("what is a part") || p.startsWith("what parts"))
    return `You know what parts a ${wordText} has.`;
  if (p.startsWith("where or when"))
    return `You know where you might find a ${wordText}.`;
  if (p.startsWith("which sentence"))
    return `You know how to use "${wordText}" in a sentence.`;
  return `You know what "${wordText}" means.`;
}

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
  const startTime = useRef(Date.now());

  const word = words[wordIdx];
  const wordImage = resolveStoryImage(storyData.id, word.image);
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
                  ? correctFeedback(question.prompt, word.word)
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

      <div className="relative z-10 flex flex-1 flex-col overflow-hidden px-4 pb-5 pt-3 sm:px-6">
        <div className="mx-auto flex w-full max-w-[980px] flex-1 flex-col overflow-hidden">
          {/* Hero: picture beside the target word */}
          <section className="flex items-center gap-4 rounded-[30px] bg-card p-4 shadow-soft animate-slide-up sm:gap-8 sm:p-4">
            <div className="flex h-[100px] w-[132px] shrink-0 items-center justify-center pl-6 sm:h-[130px] sm:w-[210px] sm:pl-12 lg:h-[150px] lg:w-[240px] lg:pl-14">
              {wordImage ? (
                <img
                  src={wordImage}
                  alt={word.word}
                  className="h-full w-full -rotate-[8deg] object-contain drop-shadow-[0_14px_22px_rgba(48,20,80,0.18)]"
                />
              ) : (
                <BookCheckIcon className="h-12 w-12 text-primary" />
              )}
            </div>

            <div className="min-w-0 flex-1 text-center">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-secondary-foreground sm:text-[13px]">
                Word Check
              </p>
              <h1 className="mt-1.5 break-words pb-1 text-[36px] font-extrabold capitalize leading-[1.15] tracking-tight text-primary sm:text-[44px] lg:text-[50px]">
                {word.word}
              </h1>
            </div>
          </section>


          {/* Question bar */}
          <section className="mt-3 flex items-center gap-3 rounded-[26px] bg-card px-4 py-3 shadow-soft sm:mt-4">
            {supported && (
              <AudioButton
                size="md"
                playing={isPlaying("prompt")}
                onClick={() => toggle(question.prompt, "prompt")}
                ariaLabel="Hear the question"
              />
            )}
            <p className="min-w-0 flex-1 text-[19px] font-extrabold leading-tight text-ink sm:text-[23px]">
              {question.prompt}
            </p>
            {supported && (
              <AudioButton
                size="sm"
                playing={isPlaying("prompt")}
                onClick={() => toggle(question.prompt, "prompt")}
                ariaLabel="Hear the question"
                className="hidden shrink-0 rounded-full bg-accent/40 px-3 sm:inline-flex"
              />
            )}
          </section>


          <p className="mt-3 flex items-center justify-center gap-2 text-center text-[13px] font-extrabold text-primary sm:text-sm">
                <span aria-hidden>💡</span>
                Look at the pictures, then tap your answer.
              </p>

              <div className="mt-2 flex-1 overflow-y-auto no-scrollbar pb-1 animate-slide-up sm:mt-3">
                <div className="grid gap-3 sm:grid-cols-3 sm:gap-5">
                  {question.options.map((option, index) => {
                    const isSelected = selected === option.id;
                    const isDisabled = wrongIds.has(option.id);
                    const label = option.text || option.label || "";
                    // Picture cue sits with the words (never instead of them) so a
                    // child with DLD can hold each choice in mind while comparing.
                    const cue = getOptionPictureCue(label, option.emoji);
                    // Category cues are a group of member emojis — render them
                    // smaller so the whole group fits inside the picture tile.
                    const isGroupCue = cue !== null && [...cue].length > 2;
                    return (
                      <div
                        key={option.id}
                        className={cn(
                          "relative flex items-center gap-3 rounded-[28px] bg-card p-3 shadow-soft ring-2 transition-all sm:flex-col sm:items-stretch sm:p-3.5",
                          isSelected ? "ring-primary" : "ring-transparent hover:ring-primary/30",
                          isDisabled && "bg-destructive/5 opacity-45 ring-destructive/25",
                        )}
                      >
                        <button
                          onClick={() => !isDisabled && setSelected(option.id)}
                          disabled={isDisabled}
                          className="flex min-w-0 flex-1 items-center gap-3 text-left sm:flex-col sm:items-stretch sm:gap-3"
                        >
                          <span
                            aria-hidden
                            className={cn(
                              "flex h-[78px] w-[88px] shrink-0 items-center justify-center rounded-[20px] leading-none sm:h-[104px] sm:w-full sm:rounded-[22px]",
                              isGroupCue
                                ? "text-xl sm:text-3xl lg:text-4xl"
                                : "text-4xl sm:text-[52px] lg:text-[60px]",
                              isSelected ? "bg-primary/15" : "bg-accent/40",
                            )}
                          >
                            {cue ?? String.fromCharCode(65 + index)}
                          </span>
                          <span
                            className={cn(
                              "min-w-0 flex-1 text-[17px] font-extrabold leading-snug sm:flex-none sm:pb-1 sm:text-center sm:text-xl",
                              isDisabled ? "text-ink-soft line-through" : "text-ink",
                            )}
                          >
                            {label}
                          </span>
                        </button>

                        <span
                          className={cn(
                            "absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-sm font-extrabold shadow-card sm:left-4 sm:top-4",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-card text-primary",
                          )}
                        >
                          {String.fromCharCode(65 + index)}
                        </span>

                        {supported && !isDisabled && (
                          <AudioButton
                            size="sm"
                            tone="quiet"
                            playing={isPlaying(`opt-${option.id}`)}
                            onClick={() => toggle(label, `opt-${option.id}`)}
                            text={label}
                            className="shrink-0 sm:absolute sm:right-2 sm:top-2"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3">
              <TactileButton onClick={handleCheck} disabled={!selected || showingFeedback}>
                Check Answer
              </TactileButton>
            </div>
        </div>
      </div>

    </div>
  );
}
