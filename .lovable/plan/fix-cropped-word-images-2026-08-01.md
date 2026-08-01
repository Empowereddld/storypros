# Fix cropped word images

The vocabulary word pictures (bandage, paper airplane, calm face) sit in a small 64px square and are cropped to fill it, so the edges of each illustration get cut off.

## Change

- On the home screen "Words you're learning" cards: make the picture tile larger (about 80px), give it a little inner padding, and show the whole illustration instead of cropping it — so each image fits fully inside the rounded tile.
- Apply the same fix to the word picture on the vocabulary intro screen inside a story, so the two match.

No copy, layout order, or behaviour changes; tap-to-hear and definitions stay as they are.

## Technical notes

- `src/components/empowered/HomeDashboardScreen.tsx` (`WordsStrip`, line ~465): swap `object-cover` for `object-contain`, bump tile to `h-20 w-20`, add `p-1.5`.
- `src/components/empowered/phases/VocabularyIntroPhase.tsx` (line ~92): same `object-contain` + padding treatment.
- Story cover art keeps `object-cover` (intentional full-bleed).
