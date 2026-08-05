# Center the vocabulary word screens vertically

You're right — the word card currently sits top-aligned under the progress bar, so on taller screens there's a big empty gap below the "Explore the Word" button and the content reads as too high.

## What changes

- Vertically center the word card + CTA block in the space between the progress header and the bottom of the screen, on the "Bandage"-style word intro screen.
- Keep it safe on short screens: if the card is taller than the available space, it scrolls normally instead of clipping.
- Apply the same centering to the "Explore the Word" feature screens (word 1/3 detail view) so the flow doesn't jump vertically between steps.
- No visual redesign: same card, same picture tile, same yellow corner speaker, same speaker-left-of-definition layout, same spacing inside the card.

## Technical notes

In `src/components/empowered/phases/VocabularyIntroPhase.tsx`:
- Title-card container: add `justify-center` to the existing `flex flex-1 flex-col` wrapper, and use `my-auto` on the inner `max-w-[580px]` block so centering survives the `overflow-y-auto` scroll container (a plain `justify-center` alone clips overflow at the top).
- Feature-card branch (the `overflow-hidden` container): center its content block the same way, keeping the inner list scrollable.
- Verify at 1090x779 (current preview size), a short viewport (~700px tall), and mobile via Playwright screenshots.
