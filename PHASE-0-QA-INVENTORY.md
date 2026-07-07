# Phase 0 QA Inventory

Phase 0 was run against the local dev server at `http://127.0.0.1:5173/`.

Local screenshot artifacts are intentionally stored outside Git under:

- `.qa/phase-0/screenshots`
- `.qa/phase-0/auth-screenshots`
- `.qa/phase-0/route-screenshot-results.json`
- `.qa/phase-0/auth-route-screenshot-results.json`

The `.qa/` folder is ignored so screenshots do not bloat the repo.

## Access Notes

The current auth provider is Supabase-backed. The older local demo seed still writes local demo cache, but it does not create a Supabase session by itself. A first unauthenticated crawl confirmed that protected routes redirect to `/login`.

For visual access only, Phase 0 used a temporary uncommitted local QA auth fallback against the seeded demo cache, captured protected-route screenshots, then reverted the fallback before committing. No app code, routing, services, or business logic changes from that fallback remain in the worktree.

Parent-only routes such as `/settings` and `/paywall` correctly stop at the grown-up gate unless the gate is passed in session storage.

## Route Inventory

| Route | Component Area | Baseline Status | Screenshot |
| --- | --- | --- | --- |
| `/` | root redirect / splash | Captured unauthenticated loading state; with a real session it should redirect to app home/select child. | `.qa/phase-0/screenshots/00-root.png` |
| `/intro` | onboarding carousel | Captured. | `.qa/phase-0/screenshots/01-intro.png` |
| `/login` | login | Captured. | `.qa/phase-0/screenshots/02-login.png` |
| `/signup` | sign up | Captured. | `.qa/phase-0/screenshots/03-signup.png` |
| `/forgot-password` | forgot password | Captured. | `.qa/phase-0/screenshots/04-forgot-password.png` |
| `/reset-password` | reset password | Captured base form. Token success/error variants still need manual QA. | `.qa/phase-0/screenshots/05-reset-password.png` |
| `/onboarding/profile` | child profile | Captured through temporary QA auth fallback. | `.qa/phase-0/auth-screenshots/06-onboarding-profile.png` |
| `/onboarding/assessment` | level-placement assessment | Captured through temporary QA auth fallback. | `.qa/phase-0/auth-screenshots/07-onboarding-assessment.png` |
| `/onboarding/success` | onboarding success | Captured through temporary QA auth fallback. | `.qa/phase-0/auth-screenshots/08-onboarding-success.png` |
| `/select-child` | profile selection | Captured through temporary QA auth fallback. | `.qa/phase-0/auth-screenshots/09-select-child.png` |
| `/home` | kid home | Captured through temporary QA auth fallback. | `.qa/phase-0/auth-screenshots/10-home.png` |
| `/library` | story library | Captured through temporary QA auth fallback. | `.qa/phase-0/auth-screenshots/11-library.png` |
| `/map` | adventure map | Captured through temporary QA auth fallback. | `.qa/phase-0/auth-screenshots/12-map.png` |
| `/achievements` | rewards | Captured through temporary QA auth fallback. | `.qa/phase-0/auth-screenshots/13-achievements.png` |
| `/shop` | shop | Captured through temporary QA auth fallback. Product detail and purchase variants remain Phase 2 targets. | `.qa/phase-0/auth-screenshots/14-shop.png` |
| `/story/dan-and-the-paper-cut` | story engine | Captured through temporary QA auth fallback. Phase-level variants remain Phase 1 targets. | `.qa/phase-0/auth-screenshots/15-story-start.png` |
| `/dashboard` | parent dashboard | Captured through temporary QA auth fallback. | `.qa/phase-0/auth-screenshots/16-dashboard.png` |
| `/settings` | settings / parent gate | Captured grown-up gate. Inner settings variants still need gate-passed QA. | `.qa/phase-0/auth-screenshots/17-settings.png` |
| `/paywall` | paywall / parent gate | Captured grown-up gate. Inner paywall still needs gate-passed QA. | `.qa/phase-0/auth-screenshots/18-paywall.png` |
| `/slp` | SLP / teacher dashboard | Captured through temporary QA auth fallback. | `.qa/phase-0/auth-screenshots/19-slp.png` |
| `/admin/content` | admin import | Captured unauthenticated/admin route directly. | `.qa/phase-0/screenshots/20-admin-content.png` |
| unknown path | not found | Captured. | `.qa/phase-0/screenshots/21-not-found.png` |

## Mockup Source Inventory

The visual source folder is available at:

`C:/Users/Rovonn/OneDrive/Desktop/Empowered Work/Children Development App/StoryPros-Client-Screen-Options`

Major folders present:

- `01 Onboarding Auth Profile`
- `03 Main Dashboard`
- `04 Story Library`
- `05 In Story Learning`
- `06 Rewards Progress`
- `07 Shop Customization`
- `08 Story Creation Flow`
- `09 Parent Setup and Parent Side`
- `10 Empty Loading Error States`

Out-of-scope mockup folders remain parked unless product scope changes:

- Daily Challenge
- Emotion Check-in
- Story Creation Flow
- Avatar dress-up / avatar shop
- Chat/social/reviews
- Mic/AI retell

## Story Art Inventory

The app already has 11 internal story asset folders under `src/assets/stories`, each with six `slide-*.webp` files. The external story-generation folder is also available:

`C:/Users/Rovonn/OneDrive/Desktop/Empowered Work/Children Development App/StoryPros-Story-Images`

External source folders `Story 1 Slides` through `Story 11 Slides` each contain six `slide-*.png` files. Use these as original-generation references only; components should continue rendering through `resolveStoryImage()`.

## Code Audit Notes

Still-new-style gaps found during Phase 0:

- `src/components/empowered/phases/StoryEngine.tsx`: resume/checkpoint state still needs high-end visual treatment.
- `src/components/empowered/phases/ComprehensionPhase.tsx`: quiz sheet, hint, and option icon treatment need Phase 1 polish.
- `src/components/empowered/phases/StoryCompletePhase.tsx`: skill breakdown still needs icon/treatment polish while keeping the real 1-3 star rating.
- `src/components/empowered/CollectibleShopScreen.tsx`: product detail, owned/locked, insufficient Paper Planes, and reward-unlocked states remain Phase 2.
- `src/components/empowered/AdventureMapScreen.tsx`: locked pin and locked/premium story sheet remain Phase 3.
- `src/components/empowered/SettingsScreen.tsx`: inner settings subviews need gate-passed QA in Phase 4.
- `src/components/empowered/StateScreens.tsx`: shared empty states still support emoji placeholders; standardize in Phase 6.
- `src/components/empowered/ComprehensionScreen.tsx` and `src/components/empowered/StoryReaderScreen.tsx`: deprecated unused stubs remain Phase 7 cleanup.

Watch item:

- Browser console logs captured `Maximum update depth exceeded` during the unauthenticated protected-route crawl. This occurred while protected routes were redirecting to `/login` without a real Supabase session. Re-check with a real authenticated browser session before treating it as a product bug.

## Verification

- `npm run build` passed.
- `npx tsc --noEmit` produced only the known `tailwind-merge` parser noise:
  - `node_modules/tailwind-merge/dist/types.d.ts(1842,8): error TS1005: '}' expected.`

## Phase 1 Entry Criteria

Start with story-flow micro-states:

1. Use the screenshots in `.qa/phase-0/auth-screenshots` as current-state baselines.
2. Compare against the chosen `05 In Story Learning` mockups.
3. Keep the implementation presentation-only.
4. Preserve real story data, `resolveStoryImage()`, TTS, checkpoint, scoring, Paper Planes, and completion logic.
