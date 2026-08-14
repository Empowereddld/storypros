# "Does your child struggle..." section polish

Typographic and spacing refinements only. Copy stays identical, layout stays two-column text-only, and the section stays visually seamless with the hero (no divider, no background tint).

## What changes

1. **Step the headline down from the hero**
   Reduce the desktop headline so it clearly reads as a section heading beneath the hero H1 (roughly 50px to 42-44px on desktop, small trims on tablet/mobile). Keeps the editorial scale without competing with the hero.

2. **Align the two columns optically**
   Nudge the right text column's first line so it aligns with the headline's cap-height instead of its bounding box, so the pair reads intentionally aligned rather than slightly off.

3. **Add an intermediate type step**
   Treat the first paragraph as a lead: slightly larger than the following paragraph, so the eye steps headline → lead → body instead of jumping from extrabold display to body text.

4. **Loosen paragraph rhythm**
   Increase spacing between paragraphs so each reads as its own thought at the current line-height, and slightly tighten the max line length for comfortable measure.

5. **Rebalance section padding**
   Even out top/bottom padding so the section reads as its own beat while staying seamless with the hero — no separator added.

## Out of scope

- No copy changes.
- No new visual elements, accents, rules, or background tints.
- No changes to the hero or any section below.

## Technical notes

All edits are Tailwind class changes in the "Parent problem" `<section>` of `src/components/empowered/LandingPage.tsx` (section padding, grid gap, h2 sizing, paragraph sizing/spacing with a first-paragraph lead variant). Verify at 1440px, 1024px, and 393px.
