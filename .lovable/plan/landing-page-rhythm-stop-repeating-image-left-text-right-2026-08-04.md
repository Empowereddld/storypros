# Landing page rhythm: stop repeating image-left / text-right

## What's wrong

Reading the page top to bottom, every two-column block puts the visual on the left and the copy on the right:

```text
Hero                     copy LEFT   | art RIGHT
Your child has so much…  heading LEFT| copy RIGHT   (no image)
Why stories?             image LEFT  | copy RIGHT
Community Circle         image LEFT  | copy RIGHT
Family Dashboard         image LEFT  | copy RIGHT
What's included          Daria LEFT  | list RIGHT
```

Four image-left blocks in a row means the eye lands in the same place every time. Nothing signals "new idea", the page reads flat and long, and the two strongest proof blocks (Community photo, Dashboard mockup) look like the same slide twice — which is exactly what the two screenshots show.

## The fix: alternate the visual side

Establish a simple zig-zag so each section resets where the eye enters:

```text
Hero                     copy LEFT   | art RIGHT
Your child has so much…  heading LEFT| copy RIGHT
Why stories?             copy LEFT   | Dan & Daria RIGHT
Community Circle         image LEFT  | copy RIGHT      (unchanged)
Family Dashboard         copy LEFT   | dashboard RIGHT
What's included          list LEFT   | Daria RIGHT
```

Changes, all in `src/components/empowered/LandingPage.tsx`:

1. **Why stories?** — swap the desktop order so the copy leads and the Dan & Daria illustration sits right (flip the existing `lg:order-1` / `lg:order-2`).
2. **Community Circle** — keep as-is. It becomes the one image-left beat, and now it reads as a deliberate change of pace rather than more of the same.
3. **Family Dashboard** — flip to copy left / mockup right. Keep the 62/38 weighting on the mockup column so the dashboard UI text stays legible (grid becomes `38fr_62fr` with the image in column two).
4. **What's included** — flip so the feature list leads and Daria sits on the right, closing the page's zig-zag instead of restarting the left-image pattern.

Mobile stays exactly as it is today: content order on small screens is untouched in every section (headline → copy → image → supporting items), since all of these are desktop-only `lg:order` changes.

## Also worth tightening while we're in there

- The Community section's heading is `sm:text-[38px]` while the Dashboard heading directly below is `sm:text-[32px]`, so two adjacent section headings sit at different sizes. Align the Dashboard heading to the same scale as the other section headings for a consistent vertical rhythm.

## Out of scope

- No copy changes.
- No section reordering, no colour/background changes, no changes to the pathway, in-action, pricing, or FAQ blocks.

## Verification

Screenshot the full page at 1440, 1024, and 390 wide and confirm: the visual side alternates on desktop, the dashboard UI text is still readable, mobile stacking order is unchanged, and no section overflows or gaps.
