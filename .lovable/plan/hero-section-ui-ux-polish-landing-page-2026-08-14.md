# Hero section UI/UX polish (landing page)

Presentation-only refinements to the hero. No copy changes, no logic changes. Mobile stays close to today; the main gains are desktop and tablet.

## What changes

1. **Bigger, more confident headline on desktop**
   Raise the desktop H1 from 46px to ~58-60px and widen its wrap cap so it lands on 3 lines instead of 4. Tablet nudges up slightly; mobile unchanged.

2. **Restore hierarchy between headline and subhead**
   Drop the subhead from semibold to medium and slightly reduce desktop size, using the softer body ink color so it supports rather than competes with the headline.

3. **Lighter eyebrow label**
   Replace the shadowed white card with a subtle tinted pill (no card shadow), so a 10-11px label no longer carries Level-1 card weight.

4. **Fix vertical rhythm**
   Use a consistent, intentional rhythm: small gap eyebrow → headline, slightly larger headline → subhead, largest subhead → CTAs. Groups read as grouped.

5. **Slimmer CTA pair on tablet**
   Let the two buttons sit side by side from the tablet breakpoint (auto width instead of full-width slabs), keeping the primary/secondary contrast as is.

6. **Balance the visual column on large desktop**
   Increase the tablet mockup's max width at 1200px+ so the right column carries visual weight equal to the text column, keeping the existing float animation and shadow.

## Out of scope

- All copy stays byte-identical.
- Section order, imagery, and everything below the hero unchanged.
- No changes to routing, data, or backend.

## Technical notes

All edits are Tailwind class changes inside the hero `<section>` of `src/components/empowered/LandingPage.tsx` (headline, subhead, eyebrow, CTA wrapper, image wrapper). After the edits, verify at 1440px, 1024px, and 393px widths that the hero still fills the first viewport at 1200px+ without vertical overflow.
