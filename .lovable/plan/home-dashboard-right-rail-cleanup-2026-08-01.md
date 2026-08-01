# Home dashboard right-rail cleanup

## Why these changes work

The three stacked cards (This week / Coins / My Badges) each have different borders, accent colours and shadow treatments, which makes the right side feel busy. Merging them into one panel with thin dividers gives the dashboard a calmer hierarchy. Celebrating streak milestones at 1, 3, 5 and 7 days adds frequent early wins without changing the underlying data model.

## What we'll change

### 1. Unify the right column into one panel

Replace the separate `WeekStrip`, `CoinsCard` and `BadgesCard` blocks in `HomeDashboardScreen.tsx` with a single `ProgressPanel` component.

- One shared container: `rounded-[28px] border border-accent/50 bg-card p-4 shadow-card`.
- Sections separated by thin `border-t border-accent/30` dividers.
- Remove the per-card left accent bars and mismatched radius values.
- Keep all existing content: 7-day circles, coin count / shop CTA, badge preview row, "See All" link.
- Preserve the Grown-ups button below the panel.

### 2. Strengthen the "This week" milestone celebrations

The milestone text already fires at 1, 3, 5 and 7 days. We will make them more visible:

- Add a small celebratory icon/star next to the milestone message when a milestone is reached.
- Use the existing `text-primary` + `font-bold` style for the message.
- Keep the fallback copy "Read a story to fill a circle." when no days are logged.
- No change to the milestone thresholds (1, 3, 5, 7); the logic stays the same.

## Technical details

- File: `src/components/empowered/HomeDashboardScreen.tsx`
- Create a new internal `ProgressPanel` component that wraps the three existing sub-components.
- Re-use the existing `Card` helper as a styled wrapper if it already matches the unified look; otherwise replace it with the new panel markup.
- Keep semantic tokens only (`bg-card`, `border-accent/50`, `text-primary`, `text-secondary`, etc.).
- No new dependencies.

## Out of scope

- The hero card and vocabulary strip remain unchanged.
- Navigation tabs remain unchanged.
- No changes to progress data or streak calculation logic.
