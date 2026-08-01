# Remove the three hero benefit bullets from the landing page

## What we are changing
Remove the three checkmark bullets that currently appear directly below the hero section on the public Story Pros landing page:
- "Understand key story information."
- "Organize and retell ideas"
- "Connect stories to everyday life"

## Why
The user has asked for these bullets to be removed from the landing page.

## Files to change
1. `src/data/landingContent.ts` — delete the `HERO_BENEFITS` export.
2. `src/components/empowered/LandingPage.tsx` — remove the `HERO_BENEFITS` import and delete the entire "The three benefits, moved out of the hero" section (lines 185–199) that renders them.

## Outcome
The landing page will flow directly from the hero/demo section into the "Your child has so much to say" parent problem section, with no intervening benefit bullets.
