# Move the element-badge speaker button outside the pill

## Current state
The story element badge (e.g., "Character") is a single pill containing the element icon circle, the uppercase label, and a small speaker button on the right. The speaker sits inside the colored pill, which makes the badge feel like it has two competing jobs: identifying the grammar element and offering an audio control.

## Goal
Separate the grammar label from the audio action so the pill reads as a clean teaching marker and the speaker reads as a distinct, tappable control placed at the front (left) of the pill.

## Proposed changes

### 1. Remove the speaker button from inside the pill
- Keep the pill as icon circle + label text only.
- Preserve the enlarged `h-10 w-10` icon circle and `py-2` padding from the previous refinement.

### 2. Add a standalone speaker button to the left of the pill
- Render a circular `h-9 w-9` speaker button immediately before the pill in the same row.
- Use the same `h-5 w-5` icon size so it matches the sentence speaker button and the previous badge-speaker size.

### 3. Keep the pair visually connected
- Use the element’s foreground/text color on the speaker button (e.g., a subtle tinted background matching the pill color) so it’s clear which label the button belongs to.
- Add a `gap-2.5` or `gap-3` between the speaker and the pill so they don’t fuse into one shape.

### 4. Preserve audio behavior
- Tapping the front speaker still reads the element label aloud.
- It still stops other playing audio via `useListen` so only one clip plays at a time.

### 5. Maintain layout stability
- Keep the badge row left-aligned above the artwork.
- Confirm the wider row does not wrap on narrow mobile screens.

## Files to edit
- `src/components/empowered/phases/StorySlidesPhase.tsx` — restructure the element badge row.

## Out of scope
- No changes to the sentence speaker button below the artwork.
- No changes to audio playback logic or TTS behavior.
- No new colors, icons, or animations.

## Verification
- Check the Character, Place, Problem, Feeling, Action, and Result badges at desktop and mobile widths.
- Confirm the speaker button is clearly associated with its pill and easy to tap without mis-tapping the pill itself.
