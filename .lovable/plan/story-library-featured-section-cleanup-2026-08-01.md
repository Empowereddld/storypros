# Story Library: Featured Section Cleanup

## Goal
Remove redundancy in the Story Library's featured-story area so the hierarchy is clearer for children and parents.

## Current Issues
1. The "See All" button next to "Continue Your Story" is redundant — the same stories appear directly below the featured card, so the user can simply scroll.
2. The "Continue Your Story" heading and "Pick up where you left off." subheading duplicate the card's own "Continue" status line and progress bar, creating visual noise.

## Changes
1. **Remove the "See All" button** from the featured section header.
2. **Remove the "Continue Your Story" heading and "Pick up where you left off." subtext** entirely.
3. **Keep the featured story card** as the prominent first element when a story is in progress, with its existing title, pills, progress bar, and "Continue" status.
4. **Keep the filter tabs and "All Stories / More Stories / Available Now" section** unchanged.
5. **Verify** the page still renders correctly when no story is in progress (the featured section should remain hidden in that case).

## Files to Edit
- `src/components/empowered/LibraryScreen.tsx`
