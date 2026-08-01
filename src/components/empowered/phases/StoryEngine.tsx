/* ---------------------------------------------
 * Story Engine - Phase Machine
 * Orchestrates the full story flow:
 *   Slides -> Comprehension -> Sequencing ->
 *   Immediate Retell -> Vocab Intro -> Vocab Quiz ->
 *   Sentence Builder -> Delayed Retell ->
 *   Phonological -> Joke -> Personal Connection ->
 *   Story Complete
 *
 * Each phase reports its result; the engine
 * accumulates and passes them to StoryComplete.
 *
 * Pause/resume: a checkpoint is saved after every
 * completed phase. Re-entering a story with a
 * checkpoint offers "Keep going" or "Start over".
 * --------------------------------------------- */

import { useState, useCallback } from "react";
import type { StoryData, StoryPhase, PhaseResult } from "@/types/story";
import { recordPhaseAttempts, recordStoryCompletion, getPaperPlanes } from "@/services/progress";
import { saveCheckpoint, getCheckpoint, clearCheckpoint } from "@/services/checkpoint";
import { useAuth } from "@/contexts/AuthContext";
import { TactileButton } from "../TactileButton";
import { AuthBackdrop, MiniPlane, Star, StoryProsLogo } from "../StoryProsBrand";
import { ChevronRightIcon, PaperPlaneIcon } from "../StoryProsUi";
import { resolveStoryImage } from "@/services/storyImages";

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
  "immediate-retell",
  "comprehension",
  "sequencing",

  "vocab-intro",
  "vocab-quiz",
  "sentence-builder",
  "delayed-retell",
  "phonological",
  "joke",
  "personal-connection",
  "story-complete",
];

/** Human-readable labels for resume prompts. */
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
        // Story finished - the checkpoint has served its purpose
        clearCheckpoint(childId, storyData.id);
      } else {
        // Mid-story - save where we are so an interrupted
        // session resumes at the start of the next phase
        saveCheckpoint(childId, storyData.id, nextIdx, updated);
      }

      setPhaseIndex(nextIdx);
    },
    [phaseResults, phaseIndex, storyData.id, totalPaperPlanes, onFinish, childId],
  );

  const handleClose = useCallback(() => {
    // Quit early - checkpoint from the last completed phase
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

  // -- Resume prompt --
  if (showResumePrompt && checkpoint) {
    const nextPhase = PHASE_ORDER[Math.min(checkpoint.phaseIndex, PHASE_ORDER.length - 1)];
    const nextLabel = PHASE_LABELS[nextPhase] ?? "where you left off";
    const done = checkpoint.phaseIndex;
    const total = PHASE_ORDER.length - 1; // story-complete isn't a playable step
    const percent = Math.round((done / total) * 100);
    const cover = resolveStoryImage(storyData.id, storyData.slides[0]?.image);

    return (
      <div className="relative flex h-full w-full flex-col overflow-y-auto bg-cream px-5">
        <AuthBackdrop />
        <Star className="absolute left-8 top-28 z-10 h-4 w-4 text-secondary animate-sparkle" />
        <Star className="absolute right-8 top-44 z-10 h-4 w-4 text-primary/35 animate-sparkle" />
        <MiniPlane className="absolute right-10 top-24 z-10 h-7 w-7 rotate-[18deg] text-secondary animate-float" />

        <div className="relative z-10 mx-auto flex w-full max-w-[600px] items-center justify-between pt-5">
          <StoryProsLogo layout="row" size="sm" />
          <div className="flex items-center gap-1.5 rounded-full border-2 border-secondary/50 bg-card/90 px-3 py-1.5 text-sm font-extrabold text-primary shadow-card">
            <PaperPlaneIcon className="h-4 w-4 text-secondary" />
            Pick up
          </div>
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-[600px] flex-1 flex-col justify-center py-6">
          <div className="overflow-hidden rounded-[28px] border-[6px] border-card bg-card shadow-soft animate-pop-in">
            {cover ? (
              <div className="aspect-video w-full overflow-hidden rounded-[20px] bg-accent/40">
                <img
                  src={cover}
                  alt=""
                  className="h-full w-full object-cover object-[center_30%]"
                />
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-[20px] bg-accent/50">
                <PaperPlaneIcon className="h-16 w-16 text-secondary" />
              </div>
            )}
            <div className="px-5 pb-5 pt-4">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-secondary-deep">
                Welcome back
              </p>
              <h2 className="mt-1.5 font-display text-[28px] font-extrabold leading-tight text-primary">
                Keep going?
              </h2>
              <p className="mt-2 text-[15px] font-semibold leading-snug text-ink-soft">
                You were partway through{" "}
                <span className="font-extrabold text-ink">{storyData.title}</span>. Next up:{" "}
                <span className="font-extrabold text-primary">{nextLabel}</span>.
              </p>

              <div className="mt-5">
                <div
                  className="h-3 overflow-hidden rounded-full bg-accent/60"
                  role="progressbar"
                  aria-label={`${done} of ${total} parts done`}
                  aria-valuenow={percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className="mt-2 text-xs font-extrabold text-primary">
                  {done} of {total} parts done · {percent}%
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <TactileButton
                  className="h-12"
                  onClick={handleResume}
                  leadingIcon={<ChevronRightIcon />}
                >
                  Keep going
                </TactileButton>
                <TactileButton className="h-12" variant="ghost" onClick={handleStartOver}>
                  Start over
                </TactileButton>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }

  const overallProgress = Math.min(100, (phaseIndex / (PHASE_ORDER.length - 1)) * 100);

  return (
    <div className="relative h-full w-full overflow-hidden bg-cream">
      {currentPhase !== "story-complete" && (
        <div
          className="absolute inset-x-0 top-0 z-40 h-1 bg-accent/40"
          role="progressbar"
          aria-label="Whole story progress"
          aria-valuenow={Math.round(overallProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      )}
      {renderPhase()}
    </div>
  );
}
