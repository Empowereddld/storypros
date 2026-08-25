# Redesign Word Play / Joke Phase

Apply the selected "Playful Activity Card" direction to `src/components/empowered/phases/JokePhase.tsx` while staying on the existing Story Pros brand and preserving all current behavior.

## Goals

- Make the Word Play screen feel more polished, premium, and joyful.
- Keep the existing 4-step flow (intro → meaning 1 → meaning 2 → joke).
- Preserve all functionality: progress header, TTS/audio, coin reward, navigation, close action.
- Use the project’s existing semantic design tokens; avoid hardcoded hex colors except where the prototype’s exact brand values are intentional.

## Visual direction (from selected prototype)

- A single, centered activity card with rounded corners and a soft shadow.
- The top portion of the card uses the primary purple background with the white question text.
- A curved, elliptical transition separates the purple header from the white body.
- The punchline sits inside a dashed-gold-bordered, rounded box on a light secondary background.
- A large, overlapping circular audio button sits at the bottom edge of the punchline box.
- A smaller "Why it works" / meaning caption appears below the audio button.
- The primary CTA is a chunky, gold button with an offset shadow and press-down state.

## Implementation details

### 1. Joke step redesign

- Replace the current `step === "joke"` inner layout with a new card structure:
  - Header band: `bg-primary` with `rounded-t-[34px]`, containing the Word Play label pill and the joke setup text in white.
  - Curved divider: an absolute pseudo-element or div at the bottom of the header that uses `clip-path: ellipse(60% 100% at 50% 100%)` to create a smooth scalloped transition to the white body.
  - Body band: white background with `rounded-b-[34px]`, containing the punchline box, audio button, meaning caption, and CTA.
- Punchline box: light secondary/amber background, dashed secondary border, rounded-2xl, centered text. Highlight the target word inline with a subtle gold tint.
- Audio button: circular, primary background, white icon, white border, positioned to overlap the bottom edge of the punchline box.
- Meaning caption: a subtle rounded panel with the "Why it works" label.

### 2. CTA button

- Convert the bottom `TactileButton` on the joke step to a gold/secondary button with a visible bottom offset shadow (`shadow-[0_8px_0_0_...]`) and an active translate-y press state.
- Keep using `TactileButton` where possible; if its variant system can’t express the chunky shadow, add a one-off className override.
- For non-joke steps, keep the existing button style or lightly upgrade it to match the new card language.

### 3. Intro and meaning steps

- Wrap the intro and meaning cards inside the same rounded activity-card structure so the whole Word Play phase has one consistent container.
- Intro: keep the hero word badge and Listen button, but place them inside the white card body below a purple header that says "Words Can Have Two Meanings".
- Meaning 1 / 2: keep the image and meaning text, but place them inside the unified card structure.

### 4. Brand compliance

- Use semantic tokens: `bg-primary`, `text-primary-foreground`, `bg-secondary`, `text-secondary-foreground`, `bg-card`, `border-secondary`, etc.
- The prototype uses `#521d99` and `#fdc003`; map these to the existing `primary` and `secondary` tokens.
- Avoid arbitrary hex classes in the final component.

### 5. Behavior preservation

- Keep `ProgressHeader`, `useDevSubSteps`, `useListen`, `earnCoins`, and `onComplete` exactly as they are wired.
- Ensure the audio button still calls `toggle(joke.joke_text, "joke")` and reflects `isPlaying("joke")`.
- Ensure the CTA still advances through the steps and calls `onComplete` at the end.

### 6. Responsive and touch-friendly

- Keep the card centered with `max-w-[520px]` and responsive padding.
- Maintain at least 44px touch targets for the audio button and CTA.
- Ensure the overlapping audio button does not clip or hide content on smaller screens.

## Files to edit

- `src/components/empowered/phases/JokePhase.tsx`

## Verification

- Open the preview at the Word Play / joke step.
- Confirm the layout matches the selected "Playful Activity Card" direction: purple header, curved divider, white body, punchline box, overlapping audio button, meaning caption, and chunky gold CTA.
- Confirm the CTA advances through the steps and completes the phase.
- Confirm the audio button still plays the joke text.
- Confirm coins are still awarded at completion.
