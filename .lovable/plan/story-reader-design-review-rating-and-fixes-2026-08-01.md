# Story Reader design review — rating and fixes

**Rating: 6.5/10.** The art is excellent, the type is bold and readable, and the tactile purple button feels right for kids. What holds it back: three competing progress indicators, duplicated branding, an icon that no longer matches its label, a weak "Listen" affordance, and a desktop layout with a lot of dead space around a narrow card.

## What's wrong

1. **Three progress systems at once** — the `1/6` pill, the purple progress rail, and the dot row above Next all say the same thing.
2. **Two logos on screen** — the app nav logo plus the reader header logo. Reading mode should feel like a focused surface, not a page inside a site.
3. **Icon/label mismatch** — every element badge uses the person icon, so slide 2 reads "PLACE" with a person icon and slide 3 reads "PROBLEM" with a person icon.
4. **"Listen" is the weakest element on the screen** but is the most important control for a child who can't read yet — small, pale, top-left, easy to miss.
5. **Dead vertical space** — one-line slides leave a large gap between the sentence and Next, so the layout jumps between short and long slides.
6. **Purple wash over the bottom of every illustration** dulls the art and serves no purpose now that no caption sits there.
7. **Ambiguous top-left chevron** — looks like "previous slide" but quits the story. There is no way back a slide.
8. **Highlight feature is dead on this story** — the target connective is "because", but slides 4 and 6 actually use "so", so nothing is ever highlighted.

## Proposed changes

### Reader chrome
- Drop the reader's duplicate logo; keep a single slim bar: quit (X, not a chevron) on the left, progress rail centered, `1/6` on the right.
- Remove the dot row above Next — the rail plus counter is enough.
- Add a **Back** text/ghost button beside Next so a child can re-hear the previous slide; disable it on slide 1.

### Slide card
- Map each story element to its own icon: character → person, place → map pin, problem → alert, emotion → heart, action → hand/spark, result → check/star. Keep the current badge styling.
- Remove the purple gradient overlay on the image.
- Give the text block a `min-height` sized for three lines so short and long slides keep Next in the same place.

### Listen control
- Promote Listen to a full-width secondary button directly under the illustration, with a large speaker icon, at the same 56px height as Next — the two primary child actions become "hear it" and "go on".
- Keep the stop state (destructive fill + speaker-off icon).

### Desktop layout
- Keep the 560px reading column, but center the card vertically and add a soft page-level backdrop so the surrounding purple reads intentional rather than empty.

### Content note (no code)
- Story 01's `target_connective` is `because`, which never appears in its six slides. Either change it to `so` or reword slides 4/6 — I'll leave this to you since it affects teaching content, not UI.

## Files
- `src/components/empowered/phases/StorySlidesPhase.tsx`
- `src/components/empowered/phases/ProgressHeader.tsx`
