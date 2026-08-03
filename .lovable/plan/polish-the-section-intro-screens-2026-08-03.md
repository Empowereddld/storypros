# Polish the Section Intro screens

Refine the look and feel of the intro screen that appears before each story activity ("Put It in Order", "Question Time", etc.). Layout and spacing only — no copy changes, no new controls, no logic changes. The same refinements apply to all seven section intros.

## What changes

**Heading**
- Reduce the title size so it no longer overpowers the instruction. The buddy + speech bubble becomes the visual hero.

**Buddy and speech bubble**
- Move the buddy closer to the bubble and increase her size slightly so it clearly reads as "she is talking to me".
- Add a small pointed tail on the bubble aimed at the buddy.
- Keep the bubble comfortably narrow instead of stretching wide, so short instructions feel cozy rather than sparse.

**Start button**
- Constrain the button width on tablet/desktop (roughly 360–440px) instead of full width, centered. Full width stays on phone.
- Soften the heavy drop shadow so it matches the calm cream background used elsewhere.

**Spacing**
- Tighten the vertical rhythm: title to buddy group, and buddy group to button, so the three elements read as one connected unit rather than three floating blocks.
- Reduce the large empty space above and below the group.

## Not included

- No "Step X of Y" indicator and no back arrow.
- No bubble contrast change and no repositioning of the speaker icon.
- No text or script edits.

## Technical notes

- All edits are in `src/components/empowered/phases/SectionIntro.tsx`.
- The existing `compact` prop currently only affects the Question Time intro. The refined proportions become the single default for every intro, so `compact` collapses into the base layout and its call sites in `StoryEngine.tsx` are simplified if they pass it explicitly.
- Button width control uses `TactileButton`'s existing `fullWidth`/`className` props; the softer shadow uses the existing `noShadow` prop or a lighter shadow token rather than new CSS.
- Entrance animations (`animate-slide-up` with staggered delays) stay as-is; no looping motion is added.
