# Story Reader: image framing + Next button fix

Two fixes in the story slide reader.

## 1. Photos look too close up / heads near the edge

The slide art is already 16:9 (1672x941), so nothing is actually being cropped — the problem is scale. On desktop the reader stretches to 1024px wide, so each illustration is blown up to roughly 1024x576 and the characters' faces fill the frame, which reads as "cut off / too zoomed in."

Fix: give the story reader a comfortable reading column instead of letting it fill the desktop width.

- Constrain the slide card (and header/progress row) to a centered max width of about 560px on larger screens, full width on mobile.
- Keep the 16:9 frame and `object-cover` so the full illustration is shown edge to edge with no cropping.
- Add a small amount of top framing safety by switching the image position to `object-[center_35%]` so any minor overflow trims from the bottom, never the heads.

## 2. "Next" and the yellow arrow wrap to two lines

`TactileButton` wraps all children in a single `<span>`, so the label and the chevron are treated as wrapping inline content and break onto separate lines.

Fix: make that content wrapper an `inline-flex` row with `items-center`, `gap`, and `whitespace-nowrap` so label + icon always stay on one line, in every button that passes an icon as a child.

## Files

- `src/components/empowered/phases/StorySlidesPhase.tsx` — reader width + image framing
- `src/components/empowered/TactileButton.tsx` — one-line label/icon layout
