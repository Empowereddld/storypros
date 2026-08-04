# Premium hero spacing pass

## What feels off right now

Looking at the hero, the text column has too much vertical drift:

- The eyebrow pill floats with generous top/outer padding before the headline.
- The gap between the headline and subheading is slightly loose, so the two lines feel disconnected.
- The gap between the subheading and the CTA stack is large enough that the buttons feel like a separate block rather than the natural next step.
- The overall text block sits high and leaves a lot of empty space beneath the buttons, which makes the column feel unanchored next to the app preview.

## The fix: tighter, more intentional vertical rhythm

Make the hero read as one tight typographic unit:

```text
Eyebrow
small gap
H1
medium gap
Subhead
larger gap
CTA stack
```

Specific changes in `src/components/empowered/LandingPage.tsx`:

1. **Reduce eyebrow-to-H1 margin** on desktop/tablet so the label feels attached to the headline.
2. **Tighten H1-to-subhead margin** slightly so the positioning line follows the headline immediately.
3. **Reduce subhead-to-CTA gap** so the buttons feel like the direct response to the message.
4. **Slightly reduce top padding** on the section so the whole text block sits more comfortably in the viewport and the app preview stays prominent.
5. **Keep mobile stacking unchanged** in terms of order, but apply proportionally tighter margins so the mobile hero also feels compact.

## Out of scope

- No copy changes.
- No button style or wording changes.
- No app preview changes.
- No color or background changes.

## Verification

Screenshot the hero at 1440px, 768px, and 390px and confirm:
- The eyebrow, headline, subhead, and CTAs feel like one connected block.
- No single gap dominates or feels accidental.
- The app preview remains visually balanced with the text column.
