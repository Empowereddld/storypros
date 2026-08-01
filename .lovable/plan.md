# Story Reader — UI/UX Review & Refinements

## What's not working (from the current screen)

1. **Misaligned columns.** The progress rail spans the full 680px column, but the artwork and text card sit in a narrower sub-column (because the marker takes an 86px gutter). The X, rail, image and buttons never line up on a shared grid, so the screen reads as two unrelated blocks.
2. **The marker floats in space.** The purple circle + label + speaker sit in an empty left gutter, vertically centered against the image with a large gap. It looks detached rather than attached to the story moment.
3. **Two speaker buttons compete.** One under the marker (reads the word "Character") and one beside the sentence. Kids can't tell which one reads the story. The label-reading button has low value and steals attention from the sentence audio.
4. **Sentence card is bottom-heavy.** The text is large and bold but the card has an off-center speaker column, so the sentence hangs to the right and the card's left padding looks uneven.
5. **Back/Next imbalance.** The ghost "Back" pill has a lighter visual weight than the marker circle beside it, and the pair sits tight (16px) under the card while the card sits 16px under the image — no rhythm between the three stacked elements.
6. **Wasted vertical space.** With `justify-center` the whole stack floats mid-screen, leaving a big empty band under the progress bar on desktop and pushing content around when text length changes.
7. **Decorative sparkles/plane** land behind the card at random positions and clip near the reading area, adding noise to a focus-mode screen.

## Proposed changes

**Grid & alignment**
- Put the marker inside the same column as the art: header rail, image, text card and buttons all share one 560–600px content column, centered.
- Move the marker to a small pill row directly above the artwork (icon circle + "Character" label), left-aligned to the image edge, on both mobile and desktop. Removes the empty gutter and the mobile/desktop layout fork.

**Audio**
- Keep one speaker control: the one beside the sentence. Drop the label-reading speaker button.
- Make the sentence speaker slightly larger (48px) and align it to the first line of text so the card reads left-to-right: listen, then read.

**Spacing rhythm**
- Consistent stack: image → 20px → text card → 24px → buttons.
- Anchor the stack to the top of the content area (with generous top padding) instead of vertical centering, so nothing shifts between slides.
- Give the text card a fixed min-height so 1-line and 3-line slides keep the buttons in the same place.

**Buttons**
- Back becomes an icon-only 56px circle (chevron), matching the X and speaker circle language; Next stays the full-width primary pill. Fixes the weight imbalance and gives Next more presence.

**Polish**
- Reduce decorative sparkles to two, positioned outside the content column, and drop the plane from the reading screen.
- Slightly tighten the sentence type (22px mobile / 24px desktop kept, leading nudged) and keep the connective highlight.

## Technical notes

All changes are contained in `src/components/empowered/phases/StorySlidesPhase.tsx`, with a small spacing tweak in `phases/ProgressHeader.tsx` so the header shares the same content max-width and horizontal padding as the card stack. No data, routing, or story-content changes.
