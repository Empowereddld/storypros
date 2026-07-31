# Navigation clarity: remove "See the App", rename "Watch Demo"

## Goal
Make the landing-page navigation clearer by removing the redundant "See the App" link and renaming the interactive-demo button to "Try the Demo".

## Changes
1. In `src/components/empowered/LandingPage.tsx`, remove the `NAV_LINKS` entry `{ href: "#in-action", label: "See the App" }`.
2. Rename the header demo button label from "Watch Demo" to "Try the Demo".
3. Rename the mobile-only demo button label from "Watch Demo" to "Try the Demo".

## Outcome
Navigation becomes: How It Works | Community | Membership | FAQ | Try the Demo | Log in | Join the Waitlist.

No other navigation, layout, or functionality changes.