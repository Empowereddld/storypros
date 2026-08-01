# Clean up the profile setup header and required markers

## What's wrong today

The header stacks a logo row on top of two short segmented lines that float awkwardly under the wordmark — they read like a stray underline rather than progress. The step pill and back circle are both filled with the same lavender, so nothing leads the eye. Separately, the word "Required" is spelled out in coral four times, which makes the form feel like a warning screen.

## Header redesign

- Rebuild as a single slim bar: back chevron on the left, logo centered, step label on the right — same row, tighter height (56px), thin bottom hairline.
- Replace the two-segment lines with one continuous full-width progress rail flush to the bottom edge of the header (2px track, filled portion animating to 50% / 100%). No gaps, no floating stubs.
- Quiet the chrome: back button becomes a subtle bordered ghost circle, and "Step 2 of 2" becomes small uppercase muted text instead of a filled pill, so the logo is the only strong element.
- Keep the logo at its current size but let the bar's own padding give it breathing room instead of the extra stacked block.

## Required indicator

- Add one legend line directly under the "Create your child's profile" heading: a coral star followed by "= required".
- Replace every spelled-out "Required" on Child's name, Age, Country, and the diagnosis question with a single coral star (`*`) after the label, marked `aria-hidden` with the accessible requirement carried by `required` / `aria-required` on the inputs so screen readers still announce it.
- Leave "(optional)" on the Another diagnosis field as-is — it's the useful contrast to the stars.

## Files

- `src/components/empowered/DataFormScreen.tsx` — header markup, progress rail, star legend, label markers.
