# Story Pros Screen Targets

Source options live in:
`C:\Users\Rovonn\OneDrive\Desktop\Empowered Work\Children Development App\StoryPros-Client-Screen-Options`

Chosen targets generally live in:
`C:\Users\Rovonn\OneDrive\Desktop\Empowered Work\Children Development App\StoryPros-Selections`

Use the larger options folder only when a routed screen has a better direct match than
the curated `PICK -` image. Visual style comes from the mockup; product truth comes
from the real app.

## Global Corrections

- Currency is Paper Planes, never spendable stars.
- Keep 1-3 performance stars only on story completion.
- Use the real 11 stories, their real `theme` and `level`, and `resolveStoryImage()`.
- Remove Create, My Stories authoring, Daily Challenge, kid streak pressure, chat,
  social, avatar clothing, fake ratings, fake reviews, and invented genres.
- Kid bottom nav is Home, Library, Adventure Map, Rewards.
- Pricing is free forever for 1 full story, then $9.99/mo or $7.99 early adopter.
- V1 retell is tap story-element icons, not mic/AI feedback.

## Chosen Screen Map

| App screen | Route/component | Visual target |
| --- | --- | --- |
| Splash | `routes/index.tsx` / `SplashScreen` | `StoryPros-Selections\01 Onboarding Auth Profile\PICK - Story Pros App Splash Design.png` |
| Intro carousel | `routes/intro.tsx` / `IntroCarousel` | `PICK - Playful App Onboarding Design for Kids.png`, `PICK - Story Pros App Onboarding Screen.png`, `PICK - Storypros App Onboarding Illustration.png`, `PICK - Meet Dan and Daria Story Pals.png` |
| Login | `routes/login.tsx` / `LoginScreen` | `PICK - Colorful Kids App Login Screen.png` |
| Sign up | `routes/signup.tsx` / `SignUpScreen` | `PICK - Create Your Account with Story Pros.png` |
| Onboarding assessment | `routes/_authenticated/onboarding/assessment.tsx` / `OnboardingAssessment` | Use onboarding/profile visual language; keep assessment wiring unchanged. |
| Child profile | `routes/_authenticated/onboarding/profile.tsx` / `DataFormScreen` | `PICK - Child Profile Creation App Interface.png` |
| Profile selection | `routes/_authenticated/select-child.tsx` / `ProfileSelectionScreen` | `PICK - Bright and Playful Profile Selection Screen.png` |
| Onboarding success | `routes/_authenticated/onboarding/success.tsx` / `SuccessScreen` | `PICK - Celebratory Success Screen for Kids.png` |
| Kid home | `routes/_authenticated/home.tsx` / `HomeDashboardScreen` | `PICK - Continue Your Adventure Story Pro.png` |
| Parent progress overview | `routes/_authenticated/dashboard.tsx` / `ParentDashboardScreen` | `StoryPros-Client-Screen-Options\03 Main Dashboard\Progress Overview\Child Progress Overview Dashboard Design.png` |
| Library | `routes/_authenticated/library.tsx` / `LibraryScreen` | `PICK - Story Library for Young Adventurers.png` plus completed/locked/recommended card picks |
| Story slides | `routes/_authenticated/story.$storyId.tsx` / `StorySlidesPhase` | `PICK - Bright and Playful Learning App Onboarding.png` style language |
| Quiz phases | story route / `ComprehensionPhase`, `VocabularyQuizPhase`, `PhonologicalPhase`, `SentenceBuilderPhase` | `PICK - Colorful Quiz App for Kids.png`, `PICK - Storypros Quiz Interface for Kids.png` |
| Retell phases | story route / `ImmediateRetellPhase`, `DelayedRetellPhase`, `SequencingPhase` | `PICK - Story Retell Activity Interface.png` with V1 icon tapping |
| Story complete | story route / `StoryCompletePhase` | `PICK - You Did It Story Pro.png` |
| Rewards | `routes/_authenticated/achievements.tsx` / `AchievementGalleryScreen` | `PICK - Your Rewards Dashboard Overview.png`, `PICK - Skill Growth App Dashboard for Kids.png` |
| Adventure map | `routes/_authenticated/map.tsx` / `AdventureMapScreen` | `PICK - Your Progress Path in Storytelling.png` |
| Shop | `routes/_authenticated/shop.tsx` / `CollectibleShopScreen` | `PICK - Colorful App Store for Kids Stories.png`, `PICK - Sticker Shop Fun for Story Lovers.png`, `PICK - Colorful Story Themes for Kids.png` |
| Paywall | `routes/_authenticated/paywall.tsx` / `PaywallScreen` | `PICK - Unlock the Full Adventure Now.png`, `PICK - Premium Subscription for Creative Kids.png` |
| Parent gate | `ParentGate` | `PICK - Grown Up Check Verification for Kids.png` |
| Settings | `routes/_authenticated/settings.tsx` / `SettingsScreen` | `PICK - Account Settings for Story Pros App.png` |
| Loading/offline/empty/error | `StateScreens`, `ErrorBoundary` | Section 10 `PICK -` state images |

## Parked

Do not build Section 08 Story Creation, Daily Challenge, Emotion Check-in, or Avatar
Shop/dress-up. They may be used only as broad style references if a real V1 screen
needs a compatible pattern.
