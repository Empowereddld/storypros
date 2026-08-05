# Fix Sequencing Timeline Slot 6 Cut-Off

## Problem
On the "Put the Story in Order" screen, the 6th timeline slot label "Finally" is truncated to "FINA" at ~1090px desktop viewport. The fixed slot widths (150px at `sm`, 168px at `lg`) plus gaps cause the horizontal rail to overflow its container before the `lg` breakpoint's wider slots kick in.

## Goal
Ensure all 6 timeline slots are fully visible and readable across desktop/tablet viewports without requiring the user to horizontally scroll to discover the last slot.

## Approach
1. **Add a mid-breakpoint slot size** for viewports between `sm` and `lg` (e.g., ~1090px) so 6 slots + gaps fit comfortably within the available width.
2. **Tighten label typography** inside ghost slots: slightly smaller uppercase text and reduced letter-spacing to prevent "Finally"/"After that" from overflowing.
3. **Verify the rail padding/negative-margin math** so the scrollable area doesn't clip the rightmost slot.
4. **Test visually** at 1090px, 1280px, and 834px to confirm all labels read fully.

## Files to modify
- `src/components/empowered/phases/SequencingPhase.tsx`

## Acceptance criteria
- All 6 slot labels ("First", "Next", "Then", "Then", "After that", "Finally") are fully visible at the user's ~1090px viewport.
- No horizontal clipping of the 6th slot.
- Mobile and large-desktop layouts remain unchanged or improved.
