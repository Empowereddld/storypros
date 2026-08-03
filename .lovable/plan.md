# Fix Community Circle note text wrapping

## Problem
The explanatory sentence under the Community Circle chips ("Session times rotate throughout the year...") is constrained by `max-w-[54ch]` in `src/components/empowered/LandingPage.tsx`. At tablet/desktop widths this creates a narrow, ragged block with a poor line break that feels cut-off and cheap, not premium.

## Goal
Let the note breathe and align with the section's confident, spacious layout so it reads as one polished thought instead of a cramped caption.

## Changes
1. In `src/components/empowered/LandingPage.tsx`, remove the `max-w-[54ch]` width cap from the Community Circle note paragraph.
2. Allow the note to flow to the natural column width, which lets it sit as a single line on desktop and a balanced wrap on smaller screens.
3. Keep the existing font size, color, and line-height; only the width constraint changes.
4. Verify the change at mobile, tablet, and desktop widths so the note no longer breaks mid-phrase.

## Out of scope
- No copy changes.
- No changes to the chips, image, button, or section background.
