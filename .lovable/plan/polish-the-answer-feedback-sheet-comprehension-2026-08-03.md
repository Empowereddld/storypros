# Polish the answer feedback sheet (comprehension)

The sheet that slides up after a child answers currently feels wide and repetitive on desktop: the speech bubble stretches edge to edge, and "Great job!" is immediately followed by a second "Correct!" line saying the same thing.

## What changes

1. **Contain the width.** Wrap the sheet contents in a centred column (max ~560px, matching the question card above it) so the bubble, status and button share one axis instead of spanning the full screen.

2. **One message, not two.** Keep the buddy speech bubble as the message, and turn the separate "Correct!" / "Let's try again!" row into a small inline status chip (icon + word) placed above the bubble text rather than as a second full-width line. Same information, half the noise.

3. **Balance the buddy.** Slightly larger Daria/Dan portrait, aligned to the bubble's baseline with the bubble tail pointing at her, so the pairing reads as speech rather than two stacked objects.

4. **Calmer motion.** Replace the `animate-tada` bounce on the correct bubble with a soft scale-in, and keep the shake for wrong answers but reduce its amplitude — less jarring on repeat attempts.

5. **Button sizing.** Constrain the primary continue button to ~360–440px on desktop/tablet (full width on mobile), centred, so it matches the Start buttons elsewhere in the story flow.

6. **Spacing rhythm.** Tighten to a consistent scale: 20px sheet padding top, 16px bubble-to-status, 24px status-to-button, 28px bottom padding.

## Technical notes

All edits are confined to the feedback overlay block in `src/components/empowered/phases/ComprehensionPhase.tsx` (the `showingBrainCheck` section, lines ~229–283). No content/data or question logic changes; colours continue to use existing semantic tokens (`success`, `destructive`, `card`, `accent`).
