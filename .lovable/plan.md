# Optional, clearly labeled audio on the vocabulary feature screens

No redesign. The one-feature-per-screen structure, layout, labels, pictures, and teaching content all stay exactly as they are. The only change is making the audio option obvious and unmistakably optional.

## What changes

1. **Icon-only speaker becomes a labeled control.** On each feature screen, the yellow speaker inside the purple sentence bar becomes a clearly labeled button reading `🔊 Listen` (speaker glyph + the word "Listen").
2. **After it has played once, the label becomes `Listen again`.** Tracked per screen, so moving to the next feature resets it back to "Listen".
3. **Next stays active from the very first moment.** No listening gate is introduced, and none exists today, so this is a confirmation rather than a change.
4. **No auto-play.** Narration only starts when the child taps.
5. **Same treatment on the word intro screen** so the pattern is consistent: the definition bar's speaker gains the `Listen` / `Listen again` label, and the word picture remains a visual support only.

## What does not change

- Feature labels stay `GROUP`, `WHAT IT DOES`, `LOOKS LIKE`, `PARTS`, `WHERE / WHEN YOU USE IT`.
- Word/step progress header, target word, picture, visible teaching sentence, Back and Next all stay in place.
- Uploaded pictures, teaching sentences, feature order, and every other Story Pros activity are untouched.
- Single-viewport fit on tablet and desktop is preserved — the label is added inline beside the existing speaker glyph within the sentence bar.
- The supporting picture remains a visual teaching support, not a tap target. Audio is only triggered by the labeled Listen control.

## Technical notes

Single file: `src/components/empowered/phases/VocabularyIntroPhase.tsx`.

- Add a small `heard` state keyed by the current screen (`${wordIdx}-${featureIdx}`), set when narration is triggered, used to swap the button text between `Listen` and `Listen again`.
- The existing inline tactile speaker buttons become label-bearing buttons: speaker glyph + text, keeping the current yellow tactile shadow treatment, `>= 44px` tap height, and `aria-pressed` playing state. The accessible name stays explicit ("Hear this sentence").
- The narration text passed to `toggle` stays byte-identical so existing generated audio clips still match.
