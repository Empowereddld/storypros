# Story reader: focus mode + character marker with speaker buttons

Two changes to the story reading screen.

## 1. Hide the app header during stories

The reader currently sits under the global nav (Home / Library / Adventure Map / Rewards / Feedback), so two headers stack on top of each other. Reading should be a focus surface: the reader already has its own X quit button, progress rail, and page counter.

- In `src/routes/_authenticated.tsx`, extend the existing onboarding exception so `DesktopNav` is also hidden when the path starts with `/story`.
- Keep the demo banner (it is the escape hatch during demos).
- The story X button keeps returning to the previous screen as it does now.

## 2. Bring back the separate character marker and paired speaker buttons

Matching the older layout the user liked:

- Move the story-element indicator **out of the image**. Instead of the pill overlaid on the top-left of the illustration, render a standalone circle to the left of the art: filled circle, white element icon (person for character, map pin for place, etc.).
- Under the circle, show the element label. Use **Character** (not "Who") and the same wording for the other elements: Place, Problem, Feeling, Action, Result.
- Under the label, a small round speaker button that reads the element label / prompt aloud.
- In the sentence card, add a small round speaker button on the left of the text that reads the sentence aloud — text sits beside it, as in the reference.
- Remove the current full-width yellow "Listen" button; the two small speaker buttons replace it, so Back / Next become the only large buttons.
- Both speaker buttons share one audio channel: tapping one stops the other. Playing state shows a stop icon.

### Responsive

- Desktop / tablet: circle + label + speaker in a narrow left gutter beside the image, vertically centered like the reference.
- Mobile: the circle, label, and its speaker move to a compact horizontal row directly above the image so nothing gets squeezed.

## Technical notes

- `src/routes/_authenticated.tsx` — add `path.startsWith("/story")` to the nav-hiding condition.
- `src/components/empowered/phases/StorySlidesPhase.tsx` — remove the overlay badge and the full-width Listen button; add the left marker column and the inline sentence speaker.
- Reuse the existing `useListen` + `ListenButton` from `src/components/empowered/phases/ListenButton.tsx` so both buttons share the single playing key, instead of the local `speaking` state currently in the slides phase.
- Keep the 560px reading column, image crop, fixed text min-height, and Back/Next row unchanged.

## Acceptance criteria

- No global nav on `/story/*`; reader chrome (X, rail, `1/6`) unchanged.
- Circle icon + "Character" label + speaker sit outside the illustration.
- Sentence has its own speaker button to its left; tapping either speaker stops the other.
- No full-width Listen button remains.
- Layout does not break at mobile width.
