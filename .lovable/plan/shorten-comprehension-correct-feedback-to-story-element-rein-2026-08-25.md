# Shorten comprehension correct feedback to story-element reinforcement

## Goal
Replace the current per-question `brain_check_correct` messages with a single, consistent pattern: `Great job answering with a CHARACTER!`, `PLACE!`, `PROBLEM!`, `FEELING!`, `ACTION!`, or `RESULT!` based on the question's `story_element`.

## Current state
- `ComprehensionPhase.tsx` displays `q.brain_check_correct` in the correct feedback bubble.
- Each story JSON contains a hand-written `brain_check_correct` string per comprehension question.
- The element label is already derived in `ComprehensionPhase.tsx` via `ELEMENT_LABELS` (Character, Place, Problem, Feeling, Action, Result).

## Proposed change
1. In `ComprehensionPhase.tsx`, when `isCorrect` is true, build the message dynamically: `Great job answering with a ${elementLabel.toUpperCase()}!`.
2. Keep `brain_check_wrong` unchanged; wrong answers still use the per-question guidance.
3. No layout changes needed; the existing feedback bubble already renders the element chip.

## Files to modify
- `src/components/empowered/phases/ComprehensionPhase.tsx`

## Optional cleanup
- The `brain_check_correct` field in `content/story-*.json` files will become unused. Leave them in place for now to avoid touching 11 story files and to preserve backward compatibility if the editorial preference changes later.

## Verification
- Open a comprehension question in the preview.
- Answer correctly and confirm the bubble reads "Great job answering with a [ELEMENT]!" in place of the old story-specific message.
- Check each of the six story elements across the story's six questions.
