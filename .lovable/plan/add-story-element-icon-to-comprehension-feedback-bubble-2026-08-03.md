# Add Story Element Icon to Comprehension Feedback Bubble

## Goal
Show the current story element icon (character, place, problem, feeling, action, result) inside the comprehension feedback sheet, alongside the "That's the place!" / "Great job!" message.

## Current state
- `ComprehensionPhase.tsx` already maps each question's `story_element` to an icon, colour, and label via `ELEMENT_ICONS`, `ELEMENT_COLORS`, and `ELEMENT_LABELS`.
- The icon currently appears only on the question prompt's speaker button.
- The feedback bubble shows a generic correct/wrong status chip and the `brain_check_correct` / `brain_check_wrong` message, but no element icon.

## Proposed change
1. In `ComprehensionPhase.tsx`, update the feedback bubble so it includes the element icon and label inline with the message.
2. Place the icon inside the bubble, styled with the existing element colour tokens (`elementStyle.bg`, `elementStyle.text`) so it is visually consistent with the question prompt.
3. Keep the existing Daria portrait, status chip, and continue button layout untouched.
4. Ensure the icon does not crowd the message on small screens.

## Files to modify
- `src/components/empowered/phases/ComprehensionPhase.tsx`

## Verification
- Open the comprehension phase for "Dan and the Paper Cut".
- Answer a question correctly and confirm the feedback bubble shows the matching element icon (e.g., MapPin for place) with the "That's the place!" message.
- Confirm the layout remains clean on desktop and mobile.
