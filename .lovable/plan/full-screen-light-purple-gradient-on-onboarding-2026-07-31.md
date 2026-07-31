# Full-screen light purple gradient on onboarding

## Goal
Make the soft light-purple wash from the onboarding background extend edge-to-edge on all screen sizes, so there are no plain cream/white side gutters cutting it off.

## Current state
- `src/routes/_authenticated.tsx` sets the outer wrapper to `bg-cream` and constrains content to `lg:max-w-5xl`, leaving cream gutters on large screens.
- `src/components/empowered/DataFormScreen.tsx` has its own `bg-background` root and renders `AuthBackdrop` (gradient `from-white via-accent/20 to-accent/45`) only inside the centered column.
- The result is the gradient is visually boxed in the middle, with flat cream/white bands on the left and right.

## Changes
1. **Move the gradient to the full-bleed layout.**
   - In `src/routes/_authenticated.tsx`, replace the outer `bg-cream` with the same light purple gradient used by `AuthBackdrop` (`bg-gradient-to-b from-white via-accent/20 to-accent/45`).
   - Keep the inner `max-w-5xl` content column centered; only the background changes.

2. **Let the onboarding screen show through.**
   - In `src/components/empowered/DataFormScreen.tsx`, change the root background from `bg-background` to transparent so the layout-level gradient is visible behind the form card.
   - Keep the form card itself as `bg-card/95` so it stays readable and elevated.

3. **Avoid double gradients.**
   - Either remove the base-wash `<div>` inside `AuthBackdrop` (since the layout now provides it) or keep `AuthBackdrop` for decorative clouds/stars only.

4. **Verify responsiveness.**
   - Confirm the gradient covers the full viewport on desktop, tablet, and mobile.
   - Confirm the white form card and primary CTA remain clearly visible and accessible.

## Out of scope
- No changes to copy, form fields, validation, or navigation behavior.
- No new images or animations.
