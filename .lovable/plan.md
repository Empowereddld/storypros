# Plan: Home Dashboard — Coins & Badges Side-by-Side

## Goal
On the home dashboard, place the **Coins** card on the left and **My Badges** card on the right in a single shared row, instead of the current vertical stack in the right rail.

## What will change
- In `src/components/empowered/HomeDashboardScreen.tsx`, wrap `CoinsCard` and `BadgesCard` in a two-column grid inside the right-rail `aside`.
- Coins card stays left; Badges card stays right.
- Both cards keep their existing content and behaviour (Shop button, See All button, locked/earned badge previews).
- The `WeekStrip` remains above this new row, still full-width.
- Mobile: the two cards stack vertically ( Coins on top, Badges below ) so touch targets and readability stay comfortable.

## Out of scope
- No changes to card internals, copy, icons, or data logic.
- No changes to the hero story card, vocabulary strip, streak strip, or navigation.

## Files to edit
- `src/components/empowered/HomeDashboardScreen.tsx`
