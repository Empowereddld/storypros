# Story Reader UI Cleanup

Update the story slide reader (`StorySlidesPhase.tsx`) to clean up the iconography and audio-button placement.

## Changes

1. **Character badge icon**
   - Replace the book icon in the top-left story-element badge with a person/face icon so it reads as "Character".

2. **Remove the target-word pill**
   - Remove the yellow "Word: because" pill that appears on slide 1.

3. **Relocate and re-style the audio button**
   - Remove the circular audio button currently sitting beside the "Next" button.
   - Add a speaker icon button in the upper-left text area, where the "Word: because" pill used to be.
   - Use a true speaker icon (not a play triangle) for both play and stop states.
   - Keep the "Next" button as the single primary action at the bottom.

## Files

- `src/components/empowered/phases/StorySlidesPhase.tsx`
