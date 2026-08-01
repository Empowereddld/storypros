# Mobile hero: make it airier and easier on the eyes

Scope: the mobile hero only (nav and everything below the hero untouched). No copy or CTA wording changes.

## What feels heavy right now

- The eyebrow pill spans nearly the full width and reads like a headline block instead of a small label.
- The H1 is very large and bold, so it fills most of the first screen; purple-on-purple weight makes it feel dense.
- Subheading, body, and two full-width solid-ish buttons all sit at similar visual weight, so nothing recedes.
- Gaps are even throughout, so the block reads as five stacked slabs rather than one calm unit.

## Changes

1. Eyebrow pill
   - Smaller text, tighter letter-spacing, less horizontal padding, and let it hug its content (not near full width) so it sits on one or two short lines and reads as a quiet label.
   - Softer background tint instead of a bright card with shadow.

2. Headline
   - Slightly smaller on mobile (about 32-34px) with a narrower measure so it wraps to 3 balanced lines.
   - Marginally looser line-height for air between lines.

3. Supporting text
   - Keep the positioning statement prominent but reduce its weight a step so it feels like a bridge, not a second headline.
   - Body copy: comfortable line height, slightly narrower measure so no line runs edge to edge.

4. Rhythm and breathing room
   - Group related items closer (pill to H1, H1 to statement) and use one larger gap before the CTA group, so the hero reads as one connected unit with a clear pause before action.
   - Trim total hero height so the top of the app mockup remains visible near the fold.

5. CTAs
   - Keep both buttons and their wording. Make the secondary button visually lighter (thinner border, no heavy fill) so the primary clearly leads and the pair feels less blocky.
   - Slightly narrower max width on mobile so they do not stretch the full screen edge to edge.

## Technical notes

All changes are Tailwind class adjustments inside the hero block of `src/components/empowered/LandingPage.tsx` (mobile-first values with `sm:`/`lg:` overrides preserved so desktop and tablet stay as approved). Colours come from existing semantic tokens; no new tokens, assets, or content. Verified afterwards with mobile (390x844) and desktop screenshots.
