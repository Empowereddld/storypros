# Fix Community Circle text from feeling squeezed

## Problem
In the Community Circle section of `src/components/empowered/LandingPage.tsx`, three text elements are locked to narrow character widths:
- Heading: `max-w-[22ch]`
- Body copy: `max-w-[52ch]`
- Note under chips: `max-w-[54ch]`

At desktop/tablet widths these constraints squeeze the copy to the left side of the text column, create awkward mid-phrase line breaks, and make the section look cheap and unbalanced rather than premium and confident.

## Goal
Let the text fill the column naturally so the section feels open, balanced, and high-quality across all breakpoints.

## Changes
1. In `src/components/empowered/LandingPage.tsx`, remove the width caps from the Community Circle text blocks:
   - Remove `max-w-[22ch]` from the heading.
   - Remove `max-w-[52ch]` from the body paragraph.
   - Remove `max-w-[54ch]` from the note paragraph under the chips.
2. Keep existing font sizes, weights, colors, and line-heights unchanged.
3. Verify the text now flows cleanly in the two-column desktop layout and stacks gracefully on mobile/tablet without awkward breaks.

## Out of scope
- No copy changes.
- No changes to the chips, image, button, section background, or breakpoints.
