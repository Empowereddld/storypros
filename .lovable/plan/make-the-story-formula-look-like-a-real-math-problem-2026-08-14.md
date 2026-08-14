# Make the story formula look like a real math problem

## What changes
Right now the formula card repeats a `+` after every element (and spreads into a row on
desktop). Real column arithmetic looks like your screenshot: terms stacked, **one**
plus sign at the bottom-left, a rule underneath, then the answer.

New layout for the formula card (all screen sizes, stacked column):

```text
        Character
        Place
        Problem
        Feeling
        Action
   +    Result
   ─────────────────────
        A Complete Story
```

- Six element rows stacked vertically: colored icon circle + label, all rows sharing the
  same left alignment so the labels line up like digits in a column.
- A narrow left gutter column reserved on every row; the `+` appears only in the gutter
  of the **last** row (Result), sized large like a real operator.
- A single solid horizontal rule spanning the terms, directly under the last row —
  replacing the current `=` + divider treatment.
- Under the rule, the answer: the purple "A Complete Story" pill, aligned with the
  labels (not centered on the whole card).
- Keep the notebook-grid tinted surface, the "THINK OF IT LIKE A MATH FORMULA" eyebrow,
  and the existing element colors/icons exactly as they are.
- The whole card stays comfortably narrow (max-width centered) so on desktop it reads as
  one worksheet problem instead of a wide six-across strip.

## Technical notes
- Single file: `src/components/empowered/StoryMathFormula.tsx`.
- Replace the responsive `grid-cols-1 / sm:grid-cols-3 / lg:grid-cols-6` term grid with a
  single-column stack using a two-column row grid (`auto` gutter + content).
- Drop the per-term `+` operator and the invisible trailing operator hack; the `Operator`
  helper is reused once for the final `+`.
- Replace the `=` row with a `border-t` rule plus the answer pill below it.
- No content, copy, or landing-page structure changes; `LandingPage.tsx` untouched.
