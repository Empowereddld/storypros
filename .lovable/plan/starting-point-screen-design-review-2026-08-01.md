# Starting Point screen — design review

Wearing a UI/UX designer hat, the screen is close. Structure, hierarchy, and the one-action focus are right. Five things still read as unfinished.

## What's off

1. **The button label breaks onto two lines.** In your screenshot "Start the Story" sits on one line and the arrow drops below it, which makes the primary action look accidental. The label and arrow should always sit on one line, vertically centred.
2. **The story card is the strongest element, but it doesn't look tappable or "chosen."** It reads as a decorative image. A slightly stronger card treatment (crisper shadow, a touch more inner contrast behind the title) will make it feel like the thing the whole screen is about.
3. **Title legibility over the artwork.** "Dan and the Papercut" sits on a purple-to-transparent wash; the bottom-left of the photo is busy. A slightly deeper gradient at the very bottom gives the title dependable contrast on every image without darkening the whole picture.
4. **The reassurance line competes with the heading.** It is currently the same weight family as the supporting sentence, so the eye reads three similar grey lines. Making it a size smaller and slightly lighter keeps it as a footnote instead of a third message.
5. **No way back.** Every other onboarding step has a back affordance; this one has none, so a parent who mistyped the profile is stuck. A quiet top-left back arrow, matching the profile step, closes the loop.

Minor: the character crop is good now, but the pair sits right of centre. Nudging the focal point slightly left centres them in the frame on wide screens.

## What I'd change

- Force the button content onto a single centred line and keep the current width.
- Slightly stronger card shadow and border presence so the card clearly owns the screen.
- Deepen the bottom gradient behind the story title for reliable contrast.
- Step the reassurance text down one size and soften it.
- Add the standard back arrow, top-left, consistent with the profile step.
- Shift the image focal point a touch left so Dan and his mom sit centred.

## Not changing

Colours, typography, route, the copy you approved, and all assessment behaviour stay exactly as they are.

## Technical notes

All edits are presentational and live in `src/components/empowered/OnboardingAssessment.tsx` (the `intro` phase). The back arrow reuses the existing rounded accent-button pattern from `DataFormScreen`, wired to browser history so no routing changes are needed.
