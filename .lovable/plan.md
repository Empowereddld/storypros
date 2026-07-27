## Goal
Make the mobile landing page feel less crowded by simplifying the header and compacting the hero text/block, while keeping the Story Pros brand voice and the existing desktop layout intact.

## What we’ll change

### 1. Mobile header: give the logo room
- On screens below `sm` (mobile), hide the desktop-style "Watch Demo" pill and the "Log in" text button.
- Replace them with a single compact primary action: keep "Join the Waitlist" as a slim pill.
- Move "Watch Demo" out of the header on mobile and into the hero body as a secondary link/button (so the action is still available without crowding the top bar).
- Slightly reduce header horizontal padding on mobile so the logo and CTA don’t touch the edges.

### 2. Mobile hero: compact text-first stack
- Reduce the headline font size one more step on mobile (e.g. from `text-[32px]` to `text-[28px]` or `text-[26px]`) and tighten line-height.
- Reduce vertical spacing between eyebrow pill, headline, subheading, and body paragraph.
- Slim the eyebrow pill padding on mobile so it reads as a label, not a button.
- Shorten/left-align the body paragraph on mobile for easier scanning (centered multi-line paragraphs are harder to read on phones).
- Reduce CTA button height from `h-14` to `h-12` on mobile and use a slightly smaller font so the pills feel lighter.
- Keep the two CTAs stacked and centered, but cap their max-width a little lower so they don’t feel like they’re pressing against the screen edges.

### 3. Bring the app preview closer
- On mobile, reduce the top padding of the hero section so the tablet/app mockup appears sooner on first load.
- Ensure the mockup scales down cleanly and doesn’t create horizontal overflow.

### 4. Verification
- Capture a mobile preview screenshot after the changes.
- Check that the header no longer wraps or crowds, the hero fits comfortably in the first viewport, and the CTAs remain tappable.

## Files to touch
- `src/components/empowered/LandingPage.tsx` (header + hero section)
- Possibly `src/data/landingContent.ts` only if we decide to shorten the hero body copy

## Out of scope
- No changes to desktop layout, colors, fonts, or other sections below the hero.
- No backend or routing changes.