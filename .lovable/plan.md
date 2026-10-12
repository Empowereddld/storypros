# Feature-matched hint on wrong answers in the Word Check

## What changes

In the vocabulary quiz ("Word Check"), when a child answers the "Which sentence uses 'bandage' correctly?" question incorrectly, the hint under "Try again" should point to the relevant semantic feature — function, because that is why the wrong sentences are wrong (e.g. "I ride it to school", "I put it on a sandwich"):

- Sentence-use questions get the specific hint:
  - Object words (e.g. "Which sentence uses 'bandage' correctly?") -> `Think about what a bandage is used for.`
  - Feeling words (e.g. "Which sentence uses 'calm' correctly?") -> `Think about when you feel calm.`
- All other question types keep the current general hint: `Think about what we learned about "bandage".`

## Where

`src/components/empowered/phases/VocabularyQuizPhase.tsx`

- Add a small `hintFeedback(prompt, wordText)` helper next to the existing `correctFeedback` helper. It checks the prompt the same way `correctFeedback` does:
  - Prompts starting with "which sentence" -> `Think about what a ${word} is used for.` for object words, `Think about when you feel ${word}.` for feeling words (word type from `word.sfa.category`).
  - Everything else -> current general message `Think about what we learned about "${word}".`
- Replace the hardcoded wrong-feedback string in the feedback card (line ~188) with `hintFeedback(question.prompt, word.word)`.

Correct-answer feedback is unchanged. No data files change — the hints are built from the question prompts that already exist.

## Verification

Build stays clean; the wrong-answer hint text is visible by answering a function question incorrectly in the preview.
