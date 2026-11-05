# Make the "Tell it again" screen fuller and more fun

## What's wrong now
- The six story pictures are small and sit in a thin strip near the top.
- The record button is a small pill on the left of a pale bar, with lots of empty white space below it.
- The bottom of the screen is empty apart from a small "Done" button.

## Changes
1. **Bigger story pictures.** Make the six pictures the main part of the screen, in one row that stretches across the full width. Each picture gets a colored number badge and a label underneath (Who, Where, and so on), so kids can follow along as they talk.
2. **A big round mic button in the middle.** Replace the small pill with a large purple circle with a white mic, in the center under the pictures, labeled "Tap to record."
   - **While recording:** the circle turns red and pulses gently, with a large timer ("0:12") and a "Recording..." label. That way kids always know it's still listening.
   - **After stopping:** a green check and "Saved!" appear in the same spot.
3. **Less empty space.** Center the heading, question, pictures and mic as one group, so the screen feels full instead of top-heavy. Keep the soft gold background and sparkles.
4. **Done button.** Keep it as a centered button sized to its words, matching the other screens. It stays usable at any time.

Everything has to fit on one screen without scrolling, on iPad and on your current window size.

## Technical details
- **Story pictures:** `DelayedRetellPhase.tsx`. Set the picture row to `flex-1` so it fills the spare height, and make the images taller.
- **Mic button:** add a `size="large"` variant to `RetellRecorder.tsx`, so the immediate-retell screen keeps its current compact look. Use semantic tokens only: primary for the idle circle, destructive for recording, success for saved. The pulse uses the existing `animate-pulse`.
- **Check:** use Playwright to look at screen 17 at 1454x715, 991x715 and iPad 1024x768.
