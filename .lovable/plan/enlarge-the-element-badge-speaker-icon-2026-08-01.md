# Enlarge the element-badge speaker icon

## Current state
Each story slide has a color-coded badge for the grammar element (Character, Place, Problem, Feeling, Action, Result). A speaker button was just added inside the badge so children can hear the label spoken aloud. The button is currently `28 × 28 px` with a `14 × 14 px` icon, which is hard to tap accurately — especially for kids with fine-motor challenges.

## Goal
Make the badge speaker button large enough to be inviting and easy to press without making the badge feel bloated or unbalanced.

## Proposed changes

### 1. Increase the speaker button touch target
- Bump the speaker button from `h-7 w-7` to `h-9 w-9`.
- Increase the icon from `h-3.5 w-3.5` to `h-5 w-5`.
- This raises the hit area to `36 × 36 px`, closer to an accessible minimum for children.

### 2. Re-balance the badge proportions
- Increase the left icon circle from `h-9 w-9` to `h-10 w-10` so the two circular elements feel evenly weighted.
- Slightly increase badge vertical padding (`py-1.5` → `py-2`) and horizontal gap (`gap-2` → `gap-2.5`) so the larger pieces don't touch.
- Keep the pill shape and color coding intact.

### 3. Keep the label prominent
- Leave the label text at `text-sm font-extrabold uppercase tracking-wide` so the grammar word remains the visual anchor.
- The speaker button sits to the right of the label as a secondary, clearly subordinate control.

### 4. Verify on real slides
- Check the Character, Place, Problem, Feeling, Action, and Result badges at desktop and mobile widths.
- Confirm the badge does not wrap or push the layout on narrow screens.

## Out of scope
- No changes to audio behavior or which text is spoken.
- No changes to the sentence speaker button below the illustration.
- No new colors, icons, or animations.

## Files to edit
- `src/components/empowered/phases/StorySlidesPhase.tsx` — adjust badge and speaker button sizes.