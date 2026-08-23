# Fix coin bursts getting clipped at screen edges

Yes — I see it. In your screenshots the burst that starts near the right edge (the sequencing screen) throws coins off-screen and the "+N coins" chip overlaps the header, while the burst that starts mid-screen (comprehension) looks right.

## Why it happens

The burst is anchored to the exact center of whatever button was tapped, and the coins always fan out a fixed ±128px horizontally and ~180px upward from that point. Nothing checks whether that fan or the chip actually fits inside the viewport, so any origin close to an edge (or close to the header) pushes coins and the label outside the visible area.

## The fix

1. **Clamp the burst origin.** Before rendering, pull the origin inward so the whole effect fits: keep it at least the fan radius away from the left/right edges and far enough below the top for the upward pop and the chip.
2. **Scale the fan to the space available.** When the clamped origin still sits in a narrow area (small screens, side rails), shrink the horizontal spread and pop height proportionally instead of using fixed pixels.
3. **Flip the chip when needed.** If there isn't room above the origin, render the "+N coins" chip below it, so it never collides with the activity header or sits half off the card.
4. **Keep the flight target honest.** Recompute the arc offsets from the clamped origin to the coin pill so coins still land in the counter after clamping.
5. **Clamp per burst, on the actual viewport at fire time**, so the behaviour is right on mobile, tablet and desktop without separate breakpoint rules.

## Technical notes

All changes are contained in `src/components/empowered/CoinRewards.tsx` (`CoinRewardLayer`): clamp `x`/`y` and derive `popX`/`popY` from the available space, add a chip-direction flag to the `Burst` type, and recompute `dx`/`dy` from the clamped origin. `src/services/coins.ts` keeps dispatching the raw anchor position — no change to award logic, coin values, sounds, or timing.
