# Onboarding Profile Page — Reduce Cramped Feeling

## Goal
Make the `/onboarding/profile` page feel calmer, more breathable, and more polished while preserving the Story Pros brand colors, rounded shapes, and centered single-column layout.

## Current Issues
- The header packs a back button, logo, and "Step 1 of 3" pill into a tight row.
- The three progress lines are thick (`h-1`) and visually compete with the logo.
- The supporting copy is constrained to `max-w-[340px]` and sits only `mt-2.5` below the heading.
- The form card starts only `mt-7` below the copy with `p-5` internal padding.
- The name and age fields are only `mt-5` apart.
- The Continue button is `h-14` (56 px) and visually heavy relative to the form.

## Proposed Changes

### Header
- Increase header vertical padding slightly (`py-3` instead of `py-2.5`).
- Keep the back button, logo, and step pill; just give them more room.

### Progress Indicator
- Reduce line height to `h-0.5`.
- Shorten the bar container to `max-w-[420px]` so it does not span the full card width.
- Use `bg-primary/20` for inactive segments instead of `bg-accent` for a softer, less competing look.

### Heading & Supporting Copy
- Increase heading size slightly on desktop (`text-[32px]`) while keeping mobile at `text-[26px]`.
- Widen supporting copy to `max-w-[420px]`.
- Increase space between heading and copy to `mt-4`.

### Form Card
- Increase top margin to `mt-10` so the card has clear separation from the copy.
- Increase internal padding to `p-6 sm:p-7`.
- Increase space between the name field and the Age label to `mt-6`.
- Keep the rounded `24px` corners and soft shadow.

### Continue Button
- Reduce height to `h-12` (48 px) to feel less bulky.
- Keep full width and primary purple color.
- Maintain the disabled contrast improvements already in place.
- Increase space above the button to `mt-8`.

### Overall Container
- Keep `max-w-[540px]` centered container.
- Ensure the button remains visible above the fold on a standard laptop by balancing the added vertical space — the extra room comes from better proportions, not from pushing content downward excessively.

## Files to Modify
- `src/components/empowered/DataFormScreen.tsx`
- Possibly `src/components/empowered/TactileButton.tsx` if we add a compact size variant instead of overriding height locally.

## Verification
- Typecheck the project after edits.
- Capture a preview screenshot of `/onboarding/profile` to confirm the page looks more open and the button remains above the fold.
