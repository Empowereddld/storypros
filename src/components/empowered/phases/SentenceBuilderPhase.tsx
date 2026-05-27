/* ─────────────────────────────────────────────
 * Sentence Builder Phase — Must-Complete
 * Child selects the correct ending for sentence frames.
 * Brain check: "Does your ending tell why?"
 * ───────────────────────────────────────────── */

import { useState, useRef, useEffect } from "react";
import { TactileButton } from "../TactileButton";
import { ProgressHeader } from "./ProgressHeader";
import type { StoryPhaseProps, ActivityAttempt } from "@/types/story";
import { cn } from "@/lib/utils";
import { speak, stop, speedToRate, preloadVoices, isSupported } from "@/services/tts";
import dariaSolo from "@/assets/daria-solo.png";

type FeedbackState =
  | { type: "none" }
  | { type: "correct"; brainCheck: string }
  | { type: "wrong"; brainCheck: string };

/** Highlight the target connective in frame text (before the blank) */
function highlightConnective(text: string, connective: string): React.ReactNode {
  if (!connective) return text;
  const regex = new RegExp(`(\\b${connective}\\b)`, "gi");
  const parts = text.split(regex);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    part.toLowerCase() === connective.toLowerCase() ? (
      <span key={i} className="inline-block rounded-lg bg-secondary/25 px-1 font-extrabold text-secondary-foreground">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export function SentenceBuilderPhase({ storyData, onComplete, onClose, ttsSpeed = "normal" }: StoryPhaseProps) {
  const frames = storyData.sentence_frames;
  const [frameIdx, setFrameIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>({ type: "none" });
  const [attempts, setAttempts] = useState<ActivityAttempt[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [wrongIds, setWrongIds] = useState<Set<string>>(new Set());
  const [speaking, setSpeaking] = useState(false);
  const startTime = useRef(Date.now());

  useEffect(() => { preloadVoices(); }, []);
  useEffect(() => { return () => { stop(); setSpeaking(false); }; }, [frameIdx]);

  async function handleListenFrame() {
    if (speaking) { stop(); setSpeaking(false); return; }
    setSpeaking(true);
    try { await speak(frame.frame_text.replace("___", "blank"), { rate: speedToRate(ttsSpeed) }); } catch {}
    setSpeaking(false);
  }

  const frame = frames[frameIdx];
  const progress = (frameIdx / frames.length) * 100;

  function handleCheck() {
    if (!selected) return;

    const elapsed = Date.now() - startTime.current;
    const choice = frame.choices.find((c) => c.id === selected)!;
    const isCorrect = choice.correct;

    const attempt: ActivityAttempt = {
      child_id: "demo",
      story_id: storyData.id,
      activity_type: "sentence_builder",
      question_index: frameIdx,
      attempt_number: currentAttempt,
      selected_option: selected,
      is_correct: isCorrect,
      time_ms: elapsed,
    };
    setAttempts((prev) => [...prev, attempt]);

    if (isCorrect) {
      setFeedback({ type: "correct", brainCheck: frame.brain_check_prompt });
    } else {
      setWrongIds((prev) => new Set(prev).add(selected));
      setFeedback({ type: "wrong", brainCheck: frame.brain_check_prompt });
      setCurrentAttempt((a) => a + 1);
    }
  }

  function handleContinue() {
    if (feedback.type === "correct") {
      if (frameIdx + 1 >= frames.length) {
        const firstAttempts = attempts.filter((a) => a.attempt_number === 1);
        const correctFirst = firstAttempts.filter((a) => a.is_correct).length;
        const accuracy = frames.length > 0 ? correctFirst / frames.length : 0;

        onComplete({
          phase: "sentence-builder",
          attempts: [...attempts],
          first_attempt_accuracy: accuracy,
          completed: true,
        });
        return;
      }
      setFrameIdx(frameIdx + 1);
      setSelected(null);
      setFeedback({ type: "none" });
      setCurrentAttempt(1);
      setWrongIds(new Set());
      startTime.current = Date.now();
    } else {
      setSelected(null);
      setFeedback({ type: "none" });
    }
  }

  const showingFeedback = feedback.type !== "none";

  // Split the frame text at the blank
  const [beforeBlank] = frame.frame_text.split("___");
  const selectedChoice = frame.choices.find((c) => c.id === selected);

  return (
    <div className="flex h-full flex-col">
      <ProgressHeader
        progress={progress}
        label={`Sentence ${frameIdx + 1} of ${frames.length}`}
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
                      ? `Yes! ${feedback.brainCheck} Your ending makes sense!`
                      : `${feedback.brainCheck} Think about the story again.`}
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
                  <span className="text-lg font-bold text-success">Great sentence!</span>
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
                  ? frameIdx + 1 >= frames.length
                    ? "See results"
                    : "Next sentence"
                  : "Try again"}
              </TactileButton>
            </div>
          </div>
        </div>
      )}

      {/* Sentence frame display — connective highlighted */}
      <div key={`frame-${frameIdx}`} className="mx-5 mt-5 animate-slide-up">
        <div className="rounded-3xl bg-card p-5 shadow-card">
          <p className="font-display text-[22px] leading-snug font-semibold text-primary">
            {highlightConnective(beforeBlank, storyData.target_connective)}
            <span className={cn(
              "inline-block min-w-[120px] border-b-3 mx-1 pb-0.5 text-center transition-all",
              selected ? "border-primary text-primary" : "border-ink-soft/30 text-ink-soft/50",
            )}>
              {selectedChoice ? selectedChoice.text : "___"}
            </span>
          </p>
        </div>
      </div>

      {/* Connective hint — dynamic based on target connective */}
      <div className="mx-5 mt-3 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-xs font-bold">
          🔗
        </span>
        <span className="text-sm font-semibold text-ink-soft">
          Use <span className="rounded bg-secondary/25 px-1 font-bold text-secondary-foreground">{storyData.target_connective}</span> to tell <span className="text-primary font-bold">why</span>
        </span>
      </div>

      {/* Support: Listen Again */}
      {isSupported() && (
        <div className="mx-5 mt-2">
          <button
            onClick={handleListenFrame}
            className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary btn-tactile"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            {speaking ? "Stop" : "Listen again"}
          </button>
        </div>
      )}

      {/* Choice chips */}
      <div className="mx-5 mt-4 space-y-3 flex-1 overflow-y-auto no-scrollbar pb-2">
        {frame.choices.map((choice) => {
          const isSelected = selected === choice.id;
          const isDisabled = wrongIds.has(choice.id);
          return (
            <button
              key={choice.id}
              onClick={() => !isDisabled && setSelected(choice.id)}
              disabled={isDisabled}
              className={cn(
                "w-full rounded-3xl border-2 bg-card p-4 text-left text-base font-semibold shadow-card transition-all btn-tactile",
                isSelected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-transparent text-ink",
                isDisabled && "opacity-40 line-through",
              )}
            >
              {choice.text}
            </button>
          );
        })}
      </div>

      <div className="mx-5 mb-4 mt-3">
        <TactileButton onClick={handleCheck} disabled={!selected}>
          Check
        </TactileButton>
      </div>
    </div>
  );
}

                "flex w-full items-center gap-3 rounded-3xl border-2 bg-card