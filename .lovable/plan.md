## Goal
Restyle the "Your child has so much to say." section as a two-column editorial layout like the Conceive Health reference, with no character illustration and a wider, roomier paragraph column.

## Changes (all in `src/components/empowered/LandingPage.tsx`)

Replace the `<CharacterSection side="right" image={danDariaThinking} …>` wrapper for the parent-problem block with a plain `<section>`:

```text
[ Your child has     ]   [ You may hear "I don't know"...            ]
[ so much to say.    ]   [                                           ]
                         [ Story Pros gives children calm, guided... ]
```

- Two-column grid on desktop with the text column noticeably wider than the heading — roughly 1fr / 1.6fr (about 38/62) — inside a wide container (`max-w-6xl`) with generous column gap.
- Left: `PARENT_PROBLEM.heading` in the existing display font/primary purple, large and tight, top-aligned, allowed to wrap to two lines.
- Right: the two paragraphs from `PARENT_PROBLEM.body` (split on blank line), relaxed line-height, roomy paragraph spacing, no narrow max-width clamp so lines run long and don't feel cramped.
- Mobile: single stacked column, heading first, full width.
- Keep the existing scroll-reveal animation by wrapping in `Reveal` (already imported).
- Remove the Dan & Daria floating image from this section only; drop the `danDariaThinking` import only if it becomes unused.

## Out of scope
- No copy changes.
- No changes to other sections or their character art.
