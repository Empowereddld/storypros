# "Why stories?" section: layout and rhythm fix

Design-only pass. Copy stays identical, all existing elements stay (headline, lead, formula card, "A framework that works everywhere" heading, lead, two benefit cards, Dan & Daria illustration).

## The core problem

Two separate ideas share one narrow 56% column, and one small illustration is asked to balance the whole stack. Result: the formula card wraps 4+2 instead of reading as one equation, the benefit cards are squeezed, and the illustration floats in dead space on desktop and gets orphaned at the bottom on tablet/mobile.

## What changes

1. **Split into two stacked beats inside the same band**

   ```text
   Beat 1   Why stories? + lead        LEFT  | Dan & Daria  RIGHT
   Beat 2   Formula card                    full width
   Beat 3   A framework that works everywhere + lead
            At school | With friends        two cards, full width
   ```

   The illustration pairs with the short intro copy (where it actually balances), and the formula plus cards get the full container width.

2. **Let the formula breathe**
   At full width the six elements can sit on one line on desktop and wrap evenly (3+3) on tablet. Slightly larger element chips and labels, a bit more padding, and clearer separation before the "= A Complete Story" pill so the equation reads left to right.

3. **Fix the illustration behaviour**
   Pair it with beat 1 and align it to the copy instead of centering it against a tall column, so no large empty gutter on desktop. On tablet and mobile it sits right after the intro copy rather than dangling below the benefit cards.

4. **Separate the second idea**
   Add clear vertical space before "A framework that works everywhere" and step its size down further from the section h2, so it reads as its own sub-beat rather than competing with the section heading.

5. **Even out the benefit cards**
   At full width the two cards get comfortable measure; equalise their internal padding and title/body rhythm so they read as a matched pair.

6. **Section padding**
   Slightly more top/bottom padding so this denser section still reads as one beat against the neighbouring sections.

## Out of scope

- No copy changes.
- No new elements, colors, or backgrounds; the existing top/bottom border and card tint stay.
- No changes to the hero, parent-problem, or pathway sections.

## Technical notes

Edits in the `#why-stories` section of `src/components/empowered/LandingPage.tsx` (restructure the grid into an intro grid plus full-width blocks) and `src/components/empowered/StoryMathFormula.tsx` (chip/label sizing, padding, equals separation). Verify at 1440px, 1024px, 768px, and 393px.
