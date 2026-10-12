# Feature-matched hint on wrong answers in the Word Check

## What changes

In the vocabulary quiz ("Word Check"), when a child answers incorrectly, the hint under "Try again" should match the question's targeted semantic feature:

- Function questions get the specific hint, because function is why the distractor answers are wrong:
  - Object words (e.g. "What do you do with a bandage?") -> `Think about what a bandage is used for.`
  - Feeling words (e.g. "When do you feel calm?") -> `Think about when you feel calm.`
- All other question types keep the current general hint: `Think about what we learned about "bandage".`

## Where

`src/components/empowered/phases/VocabularyQuizPhase.tsx`

- Add a small `hintFeedback(prompt, wordText)` helper next to the existing `correctFeedback` helper. It checks the prompt the same way `correctFeedback` does:
  - Prompts starting with "what do you do with" (function, object words) -> `Think about what a ${word} is used for.`
  - Prompts starting with "when do you feel" (function, feeling words) -> `Think about when you feel ${word}.`
  - Everything else -> current general message `Think about what we learned about "${word}".`
- Replace the hardcoded wrong-feedback string in the feedback card (line ~188) with `hintFeedback(question.prompt, word.word)`.

Correct-answer feedback is unchanged. No data files change — the hints are built from the question prompts that already exist.

## Verification

Build stays clean; the wrong-answer hint text is visible by answering a function question incorrectly in the preview.
