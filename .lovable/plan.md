# Plan: Clarify Community Circle scheduling copy

## Goal
Replace the ambiguous "Rotating Saturdays" chip on the landing-page Community Circle section with copy that clearly means the *time* rotates while the day stays Saturday.

## Change
In `src/data/landingContent.ts`, update the third chip in `COMMUNITY.chips`:

- From: `{ icon: "Repeat", label: "Rotating Saturdays" }`
- To: `{ icon: "Repeat", label: "Rotating Times" }`

The existing note below the chips already explains that session times rotate throughout the year; this change makes the chip itself consistent with that note.

## Verification
- Load `/landingpage` and confirm the third chip in the Community Circle section reads "Rotating Times".
- Confirm desktop and mobile layouts still wrap chips cleanly.
