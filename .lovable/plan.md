# Hide main app header during story reading

## Goal
Create a focused, distraction-free reading experience by hiding the global app navigation (Home / Library / Adventure Map / Rewards / Feedback) while a child is inside a story.

## Why
- The story reader already provides its own exit button, progress rail, and page counter.
- Two stacked headers compete for attention and clutter the screen.
- Children are less likely to accidentally navigate away mid-story.
- Frees vertical space for the story art and text.
- Matches common "focus mode" patterns in reading and learning apps.

## Changes

### 1. Hide `DesktopNav` on story routes
Update `src/routes/_authenticated.tsx` so the top navigation is hidden whenever the current path starts with `/story/`.

Current logic already hides `DesktopNav` during onboarding:

```text
const isOnboarding = path.startsWith("/onboarding");
{!isOnboarding && <DesktopNav />}
```

Extend this to also treat `/story/*` as a focus flow:

```text
const isOnboarding = path.startsWith("/onboarding");
const isStory = path.startsWith("/story");
const hideDesktopNav = isOnboarding || isStory;
{!hideDesktopNav && <DesktopNav />}
```

### 2. Keep the DemoBanner visible
The demo banner is only shown during demo sessions and provides useful escape/replay controls. Leave it as-is.

### 3. Verify the story exit path
Confirm that the story reader’s X/close button returns the user to a sensible location (e.g., `/library` or `/map`). If it currently closes to `/home`, consider routing back to `/library` since that is the natural origin for starting a story.

### 4. Check mobile
`DesktopNav` is already hidden below the `lg` breakpoint, so this change primarily improves the desktop/tablet experience. No mobile bottom-tab changes are needed unless a separate mobile nav exists inside story routes.

## Acceptance criteria
- Opening any `/story/$storyId` route no longer shows the global Home/Library/Adventure Map/Rewards/Feedback header.
- The story reader’s own progress header (X, rail, page count) remains visible.
- Closing the story returns the user to `/library` or `/map`.
- Onboarding routes continue to hide the global nav as before.
- No layout regressions on mobile or desktop.
