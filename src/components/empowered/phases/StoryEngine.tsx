/* ─────────────────────────────────────────────
 * Story Engine — Phase Machine
 * Orchestrates the full story flow:
 *   Slides → Comprehension → Sequencing →
 *   Immediate Retell → Vocab Intro → Vocab Quiz →
 *   Sentence Builder → Delayed Retell →
 *   Phonological → Joke → Personal Connection →
 *   Story Complete
 *
 * Each phase reports its result; the engine
 * accumulates and passes them to StoryComplete.
 *
 * Pause/resume: a checkpoint is saved after every
 * completed phase. Re-entering a story with a
 * checkpoint offers "Keep going" or "Start over".
 * ───────────────────────────────────────────── */

import { useState, useCallback } from "react";
import type { StoryData, StoryPhase, PhaseResult } from "@/types/story";
import { recordPhaseAttempts, recordStoryCompletion, getPaperPlanes } from "@/services/progress";
import { saveCheckpoint, getCheckpoint, clearCheckpoint } from "@/services/checkpoint";
import { useAuth } from "@/contexts/AuthContext";
import { TactileButton } from "../TactileButton";

// Phase components
import { StorySlidesPhase } from "./StorySlidesPhase";
import { ComprehensionPhase } from "./ComprehensionPhase";
import { SequencingPhase } from "./SequencingPhase";
import { ImmediateRetellPhase } from "./ImmediateRetellPhase";
import { VocabularyIntroPhase } from "./VocabularyIntroPhase";
import { VocabularyQuizPhase } from "./VocabularyQuizPhase";
import { SentenceBuilderPhase } from "./SentenceBuilderPhase";
import { DelayedRetellPhase } from "./DelayedRetellPhase";
import { PhonologicalPhase } from "./PhonologicalPhase";
import { JokePhase } from "./JokePhase";
import { PersonalConnectionPhase } from "./PersonalConnectionPhase";
import { StoryCompletePhase } from "./StoryCompletePhase";

/** The ordered list of phases a child goes through */
const PHASE_ORDER: StoryPhase[] = [
  "slides",
  "comprehension",
  "sequencing",
  "immediate-retell",
  "vocab-intro",
  "vocab-quiz",
  "sentence-builder",
  "delayed-retell",
  "phonological",
  "joke",
  "personal-connection",
  "story-complete",
];

/** Kid-friendly names for the resume prompt */
const PHASE_LABELS: Partial<Record<StoryPhase, string>> = {
  slides: "the story",
  comprehension: "story questions",
  sequencing: "putting the story in order",
  "immediate-retell": "telling the story back",
  "vocab-intro": "new words",
  "vocab-quiz": "the word quiz",
  "sentence-builder": "building sentences",
  "delayed-retell": "telling the story again",
  phonological: "sound games",
  joke: "a joke",
  "personal-connection": "your story",
};

interface StoryEngineProps {
  storyData: StoryData;
  onFinish: () => void; // called when child exits story (complete or quit)
}

export function StoryEngine({ storyData, onFinish }: StoryEngineProps) {
  const { activeChild } = useAuth();
  const ttsSpeed = activeChild?.ttsSpeed ?? "normal";
  const childId = activeChild?.id ?? "demo";

  // A checkpoint exists when a previous session ended mid-story
  const [checkpoint] = useState(() => getCheckpoint(childId, storyData.id));
  const [showResumePrompt, setShowResumePrompt] = useState(!!checkpoint);

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseResults, setPhaseResults] = useState<PhaseResult[]>([]);
  const [paperPlanesEarned, setPaperPlanesEarned] = useState(0);
  const [totalPaperPlanes, setTotalPaperPlanes] = useState(getPaperPlanes());

  const currentPhase = PHASE_ORDER[phaseIndex];

  const handleResume = useCallback(() => {
    if (checkpoint) {
      setPhaseResults(checkpoint.phaseResults);
      setPhaseIndex(Math.min(checkpoint.phaseIndex, PHASE_ORDER.length - 1));
    }
    setShowResumePrompt(false);
  }, [checkpoint]);

  const handleStartOver = useCallback(() => {
    clearCheckpoint(childId, storyData.id);
    setShowResumePrompt(false);
  }, [childId, storyData.id]);

  const handlePhaseComplete = useCallback(
    (result: PhaseResult) => {
      const updated = [...phaseResults, result];
      setPhaseResults(updated);

      // Record attempts to progress service
      if (result.attempts.length > 0) {
        recordPhaseAttempts(result.attempts);
      }

      // If story complete phase just finished, we're done
      if (result.phase === "story-complete") {
        onFinish();
        return;
      }

      // If we're about to enter story-complete, calculate scores first
      const nextIdx = phaseIndex + 1;
      if (PHASE_ORDER[nextIdx] === "story-complete") {
        recordStoryCompletion(storyData.id, updated);
        const newTotal = getPaperPlanes();
        const earned = newTotal - totalPaperPlanes;
        setPaperPlanesEarned(earned);
        setTotalPaperPlanes(newTotal);
        // Story finished — the checkpoint has served its purpose
        clearCheckpoint(childId, storyData.id);
      } else {
        // Mid-story — save where we are so an interrupted
        // session resumes at the start of the next phase
        saveCheckpoint(childId, storyData.id, nextIdx, updated);
      }

      setPhaseIndex(nextIdx);
    },
    [phaseResults, phaseIndex, storyData.id, totalPaperPlanes, onFinish, childId],
  );

  const handleClose = useCallback(() => {
    // Quit early — checkpoint from the last completed phase
    // is already saved, so the child can pick up later
    onFinish();
  }, [onFinish]);

  // Common props for all phase components
  const phaseProps = {
    storyData,
    onComplete: handlePhaseComplete,
    onClose: handleClose,
    ttsSpeed,
    childId,
  };

  function renderPhase() {
    switch (currentPhase) {
      case "slides":
        return <StorySlidesPhase {...phaseProps} />;
      case "comprehension":
        return <ComprehensionPhase {...phaseProps} />;
      case "sequencing":
        return <SequencingPhase {...phaseProps} />;
      case "immediate-retell":
        return <ImmediateRetellPhase {...phaseProps} />;
      case "vocab-intro":
        return <VocabularyIntroPhase {...phaseProps} />;
      case "vocab-quiz":
        return <VocabularyQuizPhase {...phaseProps} />;
      case "sentence-builder":
        return <SentenceBuilderPhase {...phaseProps} />;
      case "delayed-retell":
        return <DelayedRetellPhase {...phaseProps} />;
      case "phonological":
        return <PhonologicalPhase {...phaseProps} />;
      case "joke":
        return <JokePhase {...phaseProps} />;
      case "personal-connection":
        return <PersonalConnectionPhase {...phaseProps} />;
      case "story-complete":
        return (
          <StoryCompletePhase
            {...phaseProps}
            phaseData={{
              phaseResults,
              paperPlanesEarned,
              totalPaperPlanes,
            }}
          />
        );
      default:
        return null;
    }
  }

  // ── Resume prompt ──
  if (showResumePrompt && checkpoint) {
    const nextPhase = PHASE_ORDER[Math.min(checkpoint.phaseIndex, PHASE_ORDER.length - 1)];
    const nextLabel = PHASE_LABELS[nextPhase] ?? "where you left off";
    const done = checkpoint.phaseIndex;
    const total = PHASE_ORDER.length - 1; // story-complete isn't a playable step

    return (
      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-cream px-8">
        <span className="text-5xl animate-float" aria-hidden>📖</span>
        <h2 className="mt-4 text-center text-xl font-extrabold text-ink">
          Welcome back!
        </h2>
        <p className="mt-2 text-center text-base font-medium text-ink-soft">
          You were partway through{" "}
          <span className="font-bold text-primary">{storyData.title}</span>.
          Next up: {nextLabel}.
        </p>

        {/* Progress dots */}
        <div className="mt-5 flex gap-1.5" aria-label={`${done} of ${total} parts done`}>
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={
                i < done
                  ? "h-2.5 w-2.5 rounded-full bg-primary"
                  : "h-2.5 w-2.5 rounded-full bg-cream-deep"
              }
            />
          ))}
        </div>

        <div className="mt-8 w-full space-y-3">
          <TactileButton onClick={handleResume}>Keep going!</TactileButton>
          <TactileButton variant="ghost" onClick={handleStartOver}>
            Start over
          </TactileButton>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-cream">
      {renderPhase()}
    </div>
  );
}
