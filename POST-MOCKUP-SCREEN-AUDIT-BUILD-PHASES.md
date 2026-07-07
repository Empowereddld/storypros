# Story Pros Remaining Screen Audit & Build Phases

This plan covers screens and variants that are not fully in the new high-end mockup style yet, or that still need route-level visual QA against the `StoryPros-Client-Screen-Options` references.

The implementation rule remains unchanged: presentation only. Do not change business logic, routing, services, data contracts, auth behavior, purchases, story progression, or saved state. Keep real app content wired in, use Paper Planes as currency, and avoid out-of-scope mockup content.

## Current Audit Findings

| Area | Files | Finding | Priority |
| --- | --- | --- | --- |
| Story resume state | `src/components/empowered/phases/StoryEngine.tsx` | Resume prompt still has a compact legacy card feel and emoji-led copy. Needs new Story Pros treatment while preserving checkpoint resume/restart logic. | High |
| Comprehension / quiz phase | `src/components/empowered/phases/ComprehensionPhase.tsx` | Brain-check sheet, answer option rows, hints, and fallback emoji affordances need closer match to the quiz mockups. Preserve TTS and answer handling. | High |
| Story complete breakdown | `src/components/empowered/phases/StoryCompletePhase.tsx` | Completion screen is mostly updated, but the skill breakdown still uses emoji domain icons and needs a more polished mockup-style breakdown/card treatment. Keep the real 1-3 star performance rating. | High |
| Shop detail states | `src/components/empowered/CollectibleShopScreen.tsx` | Shop landing is mostly updated, but product detail, reward unlocked, owned/locked/insufficient Paper Planes states need the product-detail and reward-unlocked mockup style. Preserve purchase logic. | High |
| Adventure map locked states | `src/components/empowered/AdventureMapScreen.tsx` | Main map is updated, but locked pin and locked/premium story sheet still have legacy muted elements. Preserve story access rules. | Medium |
| Settings variants | `src/components/empowered/SettingsScreen.tsx` | Main settings is updated, but add/edit child, invite-code copy/error, subscription cancel/reactivate, and role-specific sections need route-level QA against parent-side mockups. | Medium |
| Auth account variants | `src/components/empowered/ForgotPasswordScreen.tsx`, `src/routes/reset-password.tsx` | Base screens are updated, but sent/error/loading/reset-token states need visual QA and polish. | Medium |
| Generic state screens | `src/components/empowered/StateScreens.tsx`, `src/components/empowered/ErrorBoundary.tsx`, `src/routes/not-found.tsx` | Error and not-found are updated; shared empty/offline/search states still allow emoji placeholders and need icon/art consistency. | Medium |
| Deprecated screen stubs | `src/components/empowered/ComprehensionScreen.tsx`, `src/components/empowered/StoryReaderScreen.tsx` | Deprecated, non-routed stubs still use old muted styling. Confirm unused, then delete or convert to explicitly retired placeholders. | Low |
| Parent dashboard metric copy | `src/components/empowered/ParentDashboardScreen.tsx` | Includes `Day Streak`, which is banned on kid screens but may be acceptable on parent progress screens. Needs product decision during parent-side QA. | Watch |

## Phase 0 - QA Harness And Route Inventory

Goal: make every remaining screen reachable and testable before more visual work.

Tasks:
- Confirm route access for kid, parent, SLP, and admin contexts.
- Capture current screenshots for the remaining files above at mobile phone-frame size and any desktop/tablet parent-dashboard widths.
- Record the exact mockup reference for each variant when multiple folder options exist.
- If authentication blocks a route, use real app sign-in state or an uncommitted local QA harness only. Do not commit mock data or routing shortcuts.

Verification:
- `npm run build`
- `npx tsc --noEmit`, ignoring only the known `tailwind-merge` noise from the fidelity plan.
- Screenshot each route/variant before moving to Phase 1.

## Phase 1 - Story Flow Micro-States

Goal: finish the screens kids hit during a story session.

Screens:
- Resume prompt / checkpoint state in `StoryEngine.tsx`
- Quiz / comprehension question state in `ComprehensionPhase.tsx`
- Story complete skill breakdown in `StoryCompletePhase.tsx`

Mockup families:
- `05 In Story/Quiz`
- `05 In Story/Success Screen`
- Existing reading, reflection, and retell references already applied in prior passes

Implementation notes:
- Replace emoji-led presentation with existing icons/components where possible.
- Keep real question data, answer state, TTS behavior, attempts, and progression.
- Keep V1 retell as tap story-element icons only.
- Keep the real 1-3 star completion rating; do not introduce fake reviews.

Done when:
- Resume/restart works.
- Answers, hints, TTS, and next-step progression work.
- Story completion still records progress and awards Paper Planes correctly.

## Phase 2 - Shop, Collection, And Reward Detail States

Goal: finish all shop variants beyond the main shop landing.

Screens:
- Product detail sheet
- Reward unlocked celebration
- My collection / owned state
- Empty or insufficient Paper Planes state

Files:
- `src/components/empowered/CollectibleShopScreen.tsx`

Mockup families:
- `07 Shop And Customization/My Collection`
- `07 Shop And Customization/Product Detail`
- `07 Shop And Customization/Reward Unlocked`
- `07 Shop And Customization/Shop Landing`
- `07 Shop And Customization/Unlock Premium`

Implementation notes:
- Use PaperPlaneIcon and Paper Planes copy everywhere.
- Do not add avatar dress-up or social/customization systems beyond what is already real.
- Preserve `spendPaperPlanes`, `purchaseItem`, ownership checks, and premium gating.

Done when:
- Buy, owned, locked, and insufficient-funds paths all render in the new style.
- Paper Planes balance opens shop from app chrome and remains accurate after purchase.

## Phase 3 - Adventure Map Locked And Premium States

Goal: bring all map pin states and bottom sheets to the same polish level as the main map.

Screens:
- Active story pin
- Completed story pin
- Locked story pin
- Locked/premium story detail sheet
- No-access and no-story fallback states, if reachable

Files:
- `src/components/empowered/AdventureMapScreen.tsx`

Mockup families:
- `06 Rewards And Progress/Progress Path`
- Any map or reward-path references from the selected set

Implementation notes:
- Preserve `canAccessStory`, real story titles, covers, levels, themes, and route navigation.
- Do not invent challenge, streak, or genre labels.

Done when:
- Tapping each pin state gives the correct UI and navigation.
- Locked premium states explain access without changing entitlement logic.

## Phase 4 - Parent And Settings Variants

Goal: finish parent-side and account management variants that were not primary-screen passes.

Screens:
- Add child
- Edit child
- Child profile/settings rows
- SLP invite/share code
- Copy success/error states
- Subscription cancel/reactivate and premium management states
- Parent gate retry/error state

Files:
- `src/components/empowered/SettingsScreen.tsx`
- `src/components/empowered/ParentGate.tsx`
- `src/components/empowered/ParentDashboardScreen.tsx`

Mockup families:
- `09 Parent Setup And Side/Child Profile`
- `09 Parent Setup And Side/Parent Dashboard`
- `09 Parent Setup And Side/Parent Pin`
- `09 Parent Setup And Side/Parent Gate`
- `09 Parent Setup And Side/Premium`

Implementation notes:
- Parent-side reporting may use growth metrics, but kid-facing daily streaks remain out of scope.
- Decide whether parent dashboard `Day Streak` should remain as an adult-only metric or become another real progress metric.
- Preserve every settings save, invite-code, subscription, and auth path.

Done when:
- Each settings subview can be opened, saved/canceled, and visually matches the parent-side style.
- Parent gate still blocks kid access to parent-only areas.

## Phase 5 - Auth And Account Edge States

Goal: make auth states feel first-class instead of just the base forms.

Screens:
- Forgot password loading, sent, and error states
- Reset password valid-token, invalid-token, loading, success, and error states
- Login/signup auth error states

Files:
- `src/components/empowered/ForgotPasswordScreen.tsx`
- `src/routes/reset-password.tsx`
- `src/components/empowered/AuthScreen.tsx`
- `src/components/empowered/SignupScreen.tsx`

Mockup families:
- `01 Onboarding And Auth`
- `10 Loading Empty Error Offline`

Implementation notes:
- Keep real auth flows and copy that matches actual behavior.
- Do not introduce marketing-only claims or fake success paths.

Done when:
- Each account state is visually aligned and all form submission paths still work.

## Phase 6 - Shared Empty, Loading, Error, And Offline States

Goal: standardize all unplanned/rare states so screens the user did not explicitly think of still feel designed.

Screens:
- Empty state
- No results
- Loading state
- Offline state
- Error boundary
- Not found

Files:
- `src/components/empowered/StateScreens.tsx`
- `src/components/empowered/ErrorBoundary.tsx`
- `src/routes/not-found.tsx`

Mockup families:
- `10 Loading Empty Error Offline`

Implementation notes:
- Replace generic emoji placeholders with the icon/art language used elsewhere.
- Keep retry buttons wired to existing callbacks.
- Preserve reduced-motion guards.

Done when:
- Shared states can be dropped into any route without looking older than the route itself.

## Phase 7 - Deprecated Stub Cleanup

Goal: remove or neutralize old visual code that is not part of the active app.

Files:
- `src/components/empowered/ComprehensionScreen.tsx`
- `src/components/empowered/StoryReaderScreen.tsx`

Tasks:
- Confirm with `rg` that the stubs are not imported.
- If unused, delete them.
- If still imported, convert them to use the new shell while keeping behavior identical.

Done when:
- No active or inactive component in the repo exposes the old muted placeholder style.
- TypeScript and build still pass.

## Phase 8 - Parked / Explicitly Out-Of-Scope Mockup Areas

These mockup families should not be implemented unless product scope changes:

- Daily Challenge on kid screens
- Emotion check-in
- Story creation / create-your-own / My Stories authoring
- Avatar dress-up or avatar shop systems
- Chat, social, ratings, or reviews
- Mic/AI retell

If a visual element from these folders is useful, borrow only the style language, not the feature.

## Phase 9 - Full Flow QA And Release

Goal: verify the full product after the remaining polish phases.

Required flow:
- Onboarding/profile assessment
- Home
- Library
- Adventure Map
- Story read
- Quiz/comprehension
- Reflection
- Retell
- Story complete
- Rewards/shop
- Parent dashboard
- Settings
- SLP dashboard
- Admin import
- Auth and error states

Required checks:
- `npm run build`
- `npx tsc --noEmit`, ignoring only the known `tailwind-merge` noise from the fidelity plan
- Visual screenshots against selected mockups
- No fake data, fake titles, fake ratings/reviews, stars-as-currency, daily challenges, story creation, avatar dress-up, or mic/AI retell
- Real story titles, covers, themes, levels, and progress data remain wired
- All buttons still navigate or submit as before

Release notes:
- Commit and push each phase separately to `main`.
- Confirm GitHub status after each push.
- Lovable MCP is only needed if we have a Lovable project/deployment handle to inspect; otherwise local build plus pushed `main` is the source of truth for auto-deploy.
