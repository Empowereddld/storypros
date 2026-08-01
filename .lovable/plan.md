# Skill pill on the featured library card

Yes — exactly where you circled. The third pill would sit in that same row under the featured title, right after `Level 1` and `Social`.

```text
Dan and the Paper Cut
[ Level 1 ]  [ Social ]  [ Working Memory ]
```

## What changes

- Add one extra pill to the featured "Recommended for You" card only. The smaller story cards in "All Stories" keep just Level + Setting so the grid stays calm.
- Style it distinctly from the other two so the row reads as three different kinds of info: Level (purple outline), Setting (light yellow), Skill (soft purple/lavender fill with a small brain icon).
- Skill pills are short (1-2 words) so the row never wraps on desktop. On narrow screens the row wraps cleanly with the skill pill dropping to a second line.

## Skill labels per story

There is no executive-functioning field in the story content yet, so a mapping gets added alongside the existing setting mapping. Proposed defaults, which you can override story by story:

- Dan and the Paper Cut — Flexible Thinking
- Daria's Carnival Ticket — Planning
- Dan Joins the Game — Self-Control
- The Kite in the Tree — Problem Solving
- Dan and Daria's Treasure Hunt — Planning
- The Sandcastle and the Wave — Emotional Control
- Remaining stories — Working Memory as the fallback

## Technical notes

- `src/components/empowered/LibraryScreen.tsx`: add a `SKILL_BY_ID` map next to `SETTING_BY_ID`, plus a `skillFor(story)` helper with a default. Render one new pill after the setting pill inside the featured card pill row (near line 183). Add a `skill` variant to the local `StoryPill` component for the new colour treatment.
- No content JSON or data-layer changes; nothing on the small cards changes.
