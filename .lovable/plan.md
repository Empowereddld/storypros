# Remove the Family Dashboard CTA button

## What to change

Remove the "See a sample dashboard" button from the Family Dashboard section on the landing page, since the dashboard mockup is the section's primary proof and the button no longer adds value.

## Files

1. `src/components/empowered/LandingPage.tsx`
   - Delete the dashboard CTA `<a>` element (currently rendered below the two support items).
   - Remove the `order-4` and `mt-7` spacing it provided; ensure the two support items still sit cleanly above the following section without an orphaned gap.

2. `src/data/landingContent.ts`
   - Remove the now-unused `cta` and `ctaHref` fields from the `DASHBOARD` object.

## Verification

- Screenshot the Family Dashboard section at desktop, tablet, and mobile widths to confirm the button is gone and the remaining content still balances with the dashboard image.
- Confirm no TypeScript or build errors from the removed fields.
