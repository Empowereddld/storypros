# For Grown-Ups section — design critique and fix

## What's wrong

1. **The copy repeats itself.** The headline is "See what they practised. Know what to try next." and the two support items are titled, word for word, "See what they practised" and "Know what to try next." The paragraph then says the same thing a third time. Three passes at one idea reads unfinished, not premium.
2. **The section dead-ends.** Every other section on the page offers a next move; this one has no link or button, so the strongest proof block on the page leads nowhere.
3. **The columns don't balance.** The image is tall, the copy is short, so the right column ends around two-thirds down and leaves a visible hole of empty space under the last bullet. Centering makes it read as floating rather than composed.
4. **The product proof doesn't actually prove anything.** At 43/57 the dashboard UI text is too small to read, so the screenshot works only as a shape. The one thing this section exists to show is unreadable.
5. **The headline wraps awkwardly.** Three lines with "Know what / to try next." split across a break.
6. **The image isn't grounded.** A tablet mockup with its own bezel sits on a near-white background with only a soft drop shadow, so it floats, and the bezel plus its inner margins eat width the UI needed.

## The fix

**Copy (src/data/landingContent.ts)**
- Keep the headline as the promise; rewrite the two items so they add new information instead of echoing it. Item one becomes the weekly-snapshot idea (skills practised, stories finished, saved retells), item two becomes the concrete at-home step with a real example of a prompt.
- Shorten the paragraph to two lines so it sets up the image instead of summarising the bullets.
- Add a CTA label + target for the section.

**Layout (src/components/empowered/LandingPage.tsx)**
- Shift the split to 62/38 so the dashboard renders larger and its UI text becomes legible.
- Change `items-center` to `items-start` on the grid and let the copy column sit at the top of the image, removing the orphaned gap.
- Reduce the headline size one step at `sm` and above so it lands in two lines.
- Give the image a grounded container: a soft tinted panel with rounded corners and a light inner border behind the mockup, so it sits on a surface instead of floating.
- Add the CTA button below the two items, styled to match the Community section's primary button.
- Preserve the existing mobile order (eyebrow → headline → paragraph → dashboard → items → CTA).

## Verification

Screenshot the section at 1440, 1024, and 390 wide and confirm: headline is two lines, dashboard UI text is readable, no empty gap under the copy column, CTA visible in all three.
