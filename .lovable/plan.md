# Convert in-app "steps" to real routes

Today `src/routes/index.tsx` is a giant state machine that swaps ~17 screen components based on a local `step` string. Nothing has a URL, the back button doesn't work, and links can't be shared. I'll give every screen its own route under `src/routes/` so the navigator drives the app.

## New route map

Public (no auth required):
- `/` → Splash (auto-forwards signed-in users to their home)
- `/intro` → IntroCarousel
- `/signup` → SignUpScreen
- `/login` → LoginScreen
- `/forgot-password` → ForgotPasswordScreen
- `/reset-password` → existing, unchanged

Authenticated layout (`_authenticated.tsx`, redirects to `/login` if no session):
- `/onboarding/profile` → DataFormScreen (add child)
- `/onboarding/success` → SuccessScreen
- `/onboarding/assessment` → OnboardingAssessment
- `/home` → AdventureMapScreen (parent/child)
- `/library` → LibraryScreen
- `/achievements` → AchievementGalleryScreen
- `/shop` → CollectibleShopScreen
- `/settings` → SettingsScreen
- `/dashboard` → ParentDashboardScreen
- `/slp` → SlpDashboardScreen (for `role === "slp" | "teacher"`)
- `/paywall` → PaywallScreen (reads `?storyId=` from search)
- `/story/$storyId` → StoryEngine wrapped in StoryErrorBoundary

Admin (unchanged): `/admin/content`.

## Routing/redirect rules

A small `beforeLoad` in `_authenticated.tsx` (and on `/login`, `/signup`) handles all the role-based gating that's currently in `getInitialStep()`:
- Not signed in + protected route → redirect `/login`.
- Signed in + on `/login` or `/signup` → redirect to home/slp.
- Signed in, role=slp/teacher → redirect non-slp app routes to `/slp`.
- Signed in, parent, `!profile.onboarded` → redirect to `/onboarding/profile`.
- `/` always renders Splash; a "Continue" button just navigates to `/intro` (or to the right home if already signed in).

## Screen wiring changes

Each screen currently takes callbacks like `onClose`, `onContinue`, `onNavigate`. I'll keep the components' props as-is and pass `useNavigate()`-based handlers from the new route files — no changes to the empowered components themselves. Examples:
- `SettingsScreen onClose={() => navigate({ to: "/home" })}`
- `AdventureMapScreen onNavigate={(dest, storyId) => navigate(...)}` maps `"story"` → `/story/$storyId`, `"achievements"` → `/achievements`, etc.
- `LibraryScreen onPlayStory={(id) => navigate({ to: "/story/$storyId", params: { storyId: id } })}`.
- `PaywallScreen` reads `storyId` from `Route.useSearch()` to look up the title; subscription path navigates to `/home`.
- `StoryEngine` route loads the story via `getStory(storyId)` in the loader; `notFoundComponent` handles unknown IDs; `onFinish` navigates to `/home`.

Paywall gating (currently inside `handlePlayStory`) moves into `/story/$storyId`'s `beforeLoad`: if `!canAccessStory(activeChildId, storyId)`, throw `redirect({ to: "/paywall", search: { storyId } })`.

`processExpiredSubscriptions()` moves into `_authenticated.tsx`'s component (one-shot `useEffect`).

## Files to add

```
src/routes/
  _authenticated.tsx
  _authenticated/home.tsx
  _authenticated/library.tsx
  _authenticated/achievements.tsx
  _authenticated/shop.tsx
  _authenticated/settings.tsx
  _authenticated/dashboard.tsx
  _authenticated/slp.tsx
  _authenticated/paywall.tsx
  _authenticated/story.$storyId.tsx
  _authenticated/onboarding.profile.tsx
  _authenticated/onboarding.success.tsx
  _authenticated/onboarding.assessment.tsx
  intro.tsx
  signup.tsx
  login.tsx
  forgot-password.tsx
```

`src/routes/index.tsx` shrinks to just the Splash screen + redirect logic. The `PhoneFrame` wrapper moves into `__root.tsx` (or a thin layout) so every page keeps the device frame.

## Not in scope

- No visual changes to the screens themselves.
- No new features, no auth/RBAC changes beyond moving the existing gating into route guards.
- Admin route untouched.

## Notes for review

- Deep-linking now works (e.g. `/story/dan-and-the-paper-cut`), which is a behavior change vs. the current step machine where you can only reach a story by clicking through the map.
- The slide-up animation that's keyed on `step` will instead key on route pathname inside `__root.tsx` so the transition feel is preserved.
