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
 * ───────────────────────────────────────────── */

import { useState, useCallback } from "react";
import type { StoryData, StoryPhase, PhaseResult } from "@/types/story";
import { recordPhaseAttempts, recordStoryCompletion, getPaperPlanes } from "@/services/progress";
import { useAuth } from "@/contexts/AuthContext";

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

interface StoryEngineProps {
  storyData: StoryData;
  onFinish: () => void; // called when child exits story (complete or quit)
}

export function StoryEngine({ storyData, onFinish }: StoryEngineProps) {
  const { activeChild } = useAuth();
  const ttsSpeed = activeChild?.ttsSpeed ?? "normal";

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseResults, setPhaseResults] = useState<PhaseResult[]>([]);
  const [paperPlanesEarned, setPaperPlanesEarned] = useState(0);
  const [totalPaperPlanes, setTotalPaperPlanes] = useState(getPaperPlanes());

  const currentPhase = PHASE_ORDER[phaseIndex];

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
        const completion = recordStoryCompletion(storyData.id, updated);
        const newTotal = getPaperPlanes();
        const earned = newTotal - totalPaperPlanes;
        setPaperPlanesEarned(earned);
        setTotalPaperPlanes(newTotal);
      }

      setPhaseIndex(nextIdx);
    },
    [phaseResults, phaseIndex, storyData.id, totalPaperPlanes, onFinish],
  );

  const handleClose = useCallback(() => {
    // Quit early — return to map
    onFinish();
  }, [onFinish]);

  // Common props for all phase components
  const phaseProps = {
    storyData,
    onComplete: handlePhaseComplete,
    onClose: handleClose,
    ttsSpeed,
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

  return (
    <div className="relative h-full w-full overflow-hidden bg-cream">
      {renderPhase()}
    </div>
  );
}
