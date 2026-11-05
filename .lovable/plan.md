# Make the Sentence Builder screen lighter and more fun

## Quick fixes (what you asked for)
1. **Remove "Finish the idea"** and the small "Sentence Builder" label above it. The book icon goes too, so the sentence becomes the first thing the child sees.
2. **Add a speaker button to each answer choice (A, B, C)**, the same as on the word-check pictures, so a child who can't read yet can hear every ending.
3. **Shorten the Check Answer button** to a centered pill sized to its words (the same fix as on the word check). On iPad, full-width bars are a phone pattern. A centered pill that's at least 44pt tall is the tablet best practice. It will sit right under the choices instead of pinned to the bottom.

## Suggestions to make it feel more fun (less text-heavy)
4. **Picture cue on each choice.** Each ending gets a big emoji picture (for example 🩹 "he needed a bandage."), using the same picture cues as the word check. Kids scan pictures first, and words second.
5. **Choices as cards in a row, not stacked text bars.** Three tiles side by side, each with a letter badge, a picture, the ending and a speaker, matching the word-check layout so the app feels consistent.
6. **A glowing, bouncy blank.** The empty slot in the sentence becomes a dashed gold "?" bubble that gently pulses. When a choice is tapped, the words "drop" into it with a little pop.
7. **Make the target word a sticker.** Instead of the plain "Word: because" chip, the connective word (because, so, but) shows inside the sentence as a gold highlighted sticker. That removes one extra line of text.
8. **Character peek.** Dan or Daria peeks in from the corner of the sentence card. This uses art we already have, and adds warmth without adding words.

Feedback, coins and the rules for right answers stay exactly as they are.

## Technical notes
- File: `SentenceBuilderPhase.tsx` only (plus reuse of `getOptionPictureCue`, `AudioButton`, the existing `useListen` toggle, and the character images).
- Check Answer: `fullWidth={false}` inside a centered wrapper. Tiles and button are grouped in a `flex min-h-full flex-col justify-center` container, the same as in VocabularyQuizPhase.
- Per-choice audio key `choice-${id}`. Audio is cancelled on check/continue.
- Single-viewport rule respected: 3-column tile grid on tablet/desktop, stacking on narrow phones.
