# Fix the "Create Child Profile" onboarding page

## What's wrong with it today

Looking at your screenshot as a designer, this screen was built for a 390px phone and is now being rendered full-width on desktop. That single mismatch causes most of the problems:

1. **Form fields are ~1200px wide.** A name input that stretches across the screen looks broken and makes the eye travel absurdly far from label to cursor. Forms should never exceed ~480–560px.
2. **Two logos on screen.** The top nav already shows Story Pros; the screen repeats it directly beneath. Redundant branding eats the most valuable vertical space.
3. **Decoration collides with content.** The dashed flight path runs straight through the "Create Child Profile" headline, and the plane/stars are positioned for a narrow phone so they float in odd spots on desktop.
4. **The primary action is below the fold / behind the toolbar.** "Continue" is clipped at the bottom edge — on a signup step, the CTA must always be visible.
5. **No sense of progress.** This is step 1 of 3 (profile → success → assessment), but nothing tells the parent how much is left, so drop-off risk is high.
6. **Weak field affordance.** The age control is a raw native `<select>` with a placeholder that reads like an input, and there is no inline validation or error state — the button just sits disabled with no explanation of why.
7. **Trust card is over-weighted.** The purple "Safe & Secure" block is visually louder than the form itself and competes with the CTA.
8. **A back button that calls `window.history.back()`** — unreliable when this is the first page after signup.

## What I'll change

**Layout / responsiveness**
- Wrap the whole screen in a centered `max-w-[560px]` column so it reads as a proper card on desktop and untouched on mobile.
- Remove the duplicate in-screen logo on `lg+` (keep it on mobile where there's no top nav).
- Reposition decorative plane/stars and the dashed flight path so they sit behind the card edges, never across type. Clip the flight path on desktop.
- Make the page a fixed-height flex column with the CTA in a sticky footer area so "Continue" is always visible.

**Hierarchy**
- Tighten the top spacing (`mt-28` → responsive `mt-8 lg:mt-10`), so headline, copy, and form appear together above the fold.
- Add a slim 3-dot / 1-of-3 step indicator above the headline.
- Demote the "Safe & Secure" card to a single quiet line with a small lock icon, so the CTA is clearly the loudest element.

**Form quality**
- Real labels tied to inputs, with helper text ("This is how we'll greet them in stories").
- Age as a row of tappable age chips (4–10) instead of a native dropdown — faster, more playful, better on touch, and matches the app's tactile style.
- Inline validation: name required, trimmed, max 40 chars; friendly message under the field once touched.
- Replace the history-based back button with an explicit route back (or hide it when there's nowhere to go).

**Accessibility**
- `htmlFor`/`id` pairing, `aria-invalid` + `aria-describedby` on errors, 44px minimum targets, visible focus rings, decorative SVGs `aria-hidden`.

## Technical notes

- All work is confined to `src/components/empowered/DataFormScreen.tsx` (presentation only). No change to `addChild`, routing, or the database.
- Age chips keep the same `OnboardingFormValues { childName, childAge }` contract, so `src/routes/_authenticated/onboarding/profile.tsx` needs no edit.
- Styling uses existing semantic tokens (`primary`, `secondary`, `accent`, `card`, `ink-soft`, `shadow-soft`) — no new colors.
- I'll apply the same width/centering pattern to `OnboardingAssessment.tsx` and the success screen afterward if you want the whole flow consistent.
