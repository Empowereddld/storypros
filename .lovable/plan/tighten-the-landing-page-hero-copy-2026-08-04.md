# Tighten the landing-page hero copy

## Goal

Each hero line should have one distinct job: audience → product → experience → action.

## Approved hero copy

- **Eyebrow**: "For ages 5–12 with DLD + language-based needs"
- **H1**: "Language learning through interactive stories"
- **Subheading**: "Learning that feels like a story, not a lesson."
- **CTAs**: Keep existing "Try the Demo" and "Join the Waitlist" buttons.

The body paragraph is removed entirely and not replaced.

## Changes

1. `src/data/landingContent.ts`
   - Update `HERO.eyebrow` to "For ages 5–12 with DLD + language-based needs".
   - Remove the `body` field from the `HERO` object.

2. `src/components/empowered/LandingPage.tsx`
   - Remove the body paragraph element below the subheading.
   - Tighten vertical spacing (margins/padding) between the subheading and the CTA buttons so the buttons move up naturally and no empty gap remains.
   - Keep the app preview and button wording unchanged.

## Verification

Screenshot the hero at desktop (1440px), tablet (768px), and mobile (390px) and confirm:
- Only eyebrow, H1, subheading, and CTAs appear in the hero text column.
- CTA buttons sit directly below the subheading with no awkward gap.
- App preview remains unchanged and well-positioned.
