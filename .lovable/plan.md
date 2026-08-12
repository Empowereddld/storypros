# Fix: My Badges card bleeding into "Words you're learning"

## What's happening

The dashboard is a fixed-height, no-scroll screen. The right column ("This week", "Coins", "My Badges") is laid out as a grid with `auto-rows-min` and `content-start`, so its three cards keep their natural heights no matter how much room the row actually has. At shorter desktop heights (your 707px viewport) the three stacked cards are taller than the row, and because nothing clips or compresses them, the bottom card (My Badges) spills out of its column and lands on top of the words strip below.

The left hero column doesn't have this problem because its image flexes (`flex-1`) to absorb leftover space.

## Fix

Make the right rail fit the space it's given instead of overflowing it:

1. Distribute the rail height across the three cards instead of stacking at natural size (drop `auto-rows-min` / `content-start` on tablet+, let rows share the available height, keep `min-h-0` on each card).
2. Let the badges card shrink gracefully at short heights: badge tiles step down in size and the footnote hides when vertical room is tight, so the card never needs more height than the row offers.
3. Add overflow containment on the rail as a safety net so no child can ever paint over the section below.
4. Reserve the words strip as a fixed-height row at the bottom of the layout so the grid above always knows its real budget.

## Verification

Screenshot the dashboard with Playwright at 1065x707, 1280x800, and 768x1024 tablet, confirming: no vertical scrolling, all three right-rail cards fully visible inside their column, and the words strip sitting clear of the badges card.

## Technical notes

All changes stay in `src/components/empowered/HomeDashboardScreen.tsx` — the outer grid at line 146, the `<aside>` at line 244, and `BadgesCard` (lines 404-440). Presentation only; no data or logic changes.
