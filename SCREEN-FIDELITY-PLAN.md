# Story Pros — Pixel-Faithful Screen Rebuild Plan (for Claude Code)

## 0. Mission

Rebuild every screen so it **looks exactly like the selected mockups** (the high-end AI-generated designs), while swapping all placeholder content for the **real app data, names, rewards, and scoped features**. The mockups are visual truth; our data/logic is content truth.

**Hard guardrails — do not violate:**
1. **Do not touch business logic or data wiring.** All Supabase reads/writes, auth, routing, TTS, scoring, and the story engine already work. Only change presentation (JSX/markup + classes + which real asset is shown).
2. **Keep the build green.** Run `npx tsc --noEmit` before every commit. Known pre-existing tsc noise: `node_modules/tailwind-merge/dist/types.d.ts` and `AdventureMapScreen.tsx` — ignore those two only; everything else must be clean.
3. **Reuse the design system** (Section 3). Do not invent new colors, fonts, buttons, or spacing — use the existing tokens/components.
4. **Every screen stays inside `<PhoneFrame>`** (390×844).
5. **Respect `prefers-reduced-motion`** (already handled globally in styles.css — don't remove it).
6. Preserve `resolveStoryImage()` usage for all story art. Never hardcode asset paths in components.

---

## 1. Repo map

- **Code:** `src/` (React 19 + TanStack Router file-based routes + TanStack Start, Tailwind CSS v4, Vite 7).
- **Screens:** `src/components/empowered/*.tsx` and `src/components/empowered/phases/*.tsx`.
- **Routes:** `src/routes/**` (file-based). Each route is a thin wrapper that renders a screen component.
- **Design tokens + keyframes:** `src/styles.css` (Tailwind v4 `@theme`).
- **Shared UI primitives:** `StoryProsUi.tsx` (StatCard, Paper-Planes badge, `AppBottomNav`, icons), `StoryProsBrand.tsx` (logo, `AuthBackdrop`, `IconInput`), `TactileButton.tsx`, `PhoneFrame.tsx`.
- **Story content:** `content/story-01…11-*.json` (bundled via `src/services/stories.ts`). This is the source of truth for titles, themes, levels, slides, vocab, jokes.
- **Story art:** `src/assets/stories/<story-id>/slide-01…06.webp` + `vocab-*.webp` + `joke-*.webp` (already resolved by `src/services/storyImages.ts`).
- **Character art:** `src/assets/` — `daria-and-friend.webp` (Dan+Daria hero), `daria-solo.png`, `child-avatar.png` (Dan solo), `ms-lopez.png`, plus poses `dan-daria-celebrate/reading/highfive/thinking.webp`, `dan-daria-airplane/surprised/thumbsup.webp`, `daria-pointing.webp`.
- **The mockups (visual target):** `Children Development App/StoryPros-Selections/` (PICK-prefixed PNGs), organized by screen category `01…10`.
- **Data services (DO NOT rewrite):** `progress.ts`, `shop.ts`, `subscription.ts`, `slp.ts`, `scoring.ts`, `checkpoint.ts`, `continueStory.ts`, `tts.ts`, `cloud.ts`.

---

## 2. THE GOLDEN RULE — Global content & feature corrections

The mockups contain **made-up filler**. Apply these substitutions on EVERY screen. This is the most important section.

### 2a. Naming & branding
| Mockup shows | Use instead |
|---|---|
| App/logo | **Story Pros** logo (`StoryProsLogo` from `StoryProsBrand.tsx`). Company is Empowered DLD; app is Story Pros. |
| Characters | **Dan** (boy, glasses, white tee) & **Daria** (girl, curly hair, yellow tee); coach = **Ms. Lopez**. Use the real character art assets, never generic kids. |
| Placeholder story titles ("The Hidden Star Map," "The Magical Treehouse," "Beyond the Stars," "The Secret Door," "Dragon Detective") | The **real 11 stories** (Section 6). Pull titles/themes from the story JSON. |
| Story cover images | Each story's `slide-01.webp` (via `resolveStoryImage(storyId, "slide-01.webp")`). |

### 2b. Rewards & currency
| Mockup shows | Use instead |
|---|---|
| "Stars" / "125 Stars" as the **spendable currency** counter | **Paper Planes** (kid-facing name; backed by `coins_ledger`). Use `PaperPlaneIcon` + the Paper-Planes badge from `StoryProsUi.tsx`. |
| "+30 Stars Earned" on completion | "**Paper Planes**" earned — use the real awarded amount from `recordStoryCompletion`. |
| 3 gold **stars** as a performance rating on the completion screen | KEEP as-is — the 1–3 star rating is real (based on score). Only the *currency* is Paper Planes, not the rating. |
| Collectibles = avatar clothing / outfits | **V1 collectibles** = paper-airplane designs, badges, wallpapers, character lore. (Avatar clothing is V2/parked.) |

### 2c. Features that are OUT — delete these from any mockup that shows them
- **Story Creation / "Create" / "Create your own story" FAB / "My Stories" authoring** → REMOVED in V1. The app is a curated library of 11 pre-authored stories.
- **Daily Streaks on kid-facing screens** ("7 Day Streak," fire icon on Home/Library) → REMOVE from kid Home. (Streak data exists but is intentionally hidden from young DLD users to avoid pressure. It may appear in the Parent Dashboard only.)
- **"Challenges" / "Daily Challenge"** tab or cards → PARKED, remove.
- **Emotion Check-in** → PARKED, remove.
- **Avatar Shop / avatar dress-up** → PARKED, remove (see collectibles above).
- **Chat, friend requests, in-app community/social** → NONE. Remove any social UI (social happens via external Zooms).
- **User ratings/reviews** ("4.9 ★", "4.7 ★ · 10 min") → we have no user ratings. Replace with the story's real **level / suggested age** (from JSON `level`) or a simple theme tag, or omit. Do NOT invent review scores.
- **Invented genres** ("Sci-Fi," "Fantasy," "Space Adventure") → our stories are social-emotional DLD scenarios. Use the real `theme` from JSON (e.g., "self-regulation," "asking for help") or a neutral tag. No sci-fi/fantasy labeling.

### 2d. Features that are IN (V1 scope)
Curated 11-story library → per-story flow: **slides → comprehension quiz → sequencing → immediate retell → vocab intro → vocab quiz → sentence builder → delayed retell → phonological → joke → personal connection → complete**. Plus Rewards (badges + collectibles + Paper Planes), Shop (collectibles), Parent Dashboard, SLP/teacher dashboard, Settings, Paywall.

### 2e. Copy / pricing corrections
- **Pricing:** $9.99/month standard, **$7.99/month early adopter**. **Free forever tier** = one full story, no credit card. (Override any other pricing in mockups.)
- **Retell (V1):** child taps story-element icons to retell — **no microphone / no AI feedback**. If a mockup shows a mic or "record," use the icon-tap version.
- **Onboarding assessment:** a short, friendly level-placement quiz (fun, low-pressure). Keep it playful; it sets starting level.
- Age range across the app is **4–10**, not "7+".

### 2f. Bottom navigation (real tabs)
Mockups show varying tabs (Home / My Stories / Create / Challenges / Learn / Progress / Profile). The **real** nav is `AppBottomNav` with exactly:
**Home · Library · Adventure Map · Rewards** — plus the **Paper Planes counter** in the header that opens the Shop. No Create, no Challenges, no My Stories.

---

## 3. Design system — reuse, don't reinvent

All tokens live in `src/styles.css` (`@theme`). Use Tailwind classes that map to them.

**Color tokens** (semantic; oklch under the hood): `primary` (purple ~#521d99) + `primary-deep`, `secondary` (golden-yellow ~#fdc003) + `secondary-deep`, `cream`/`background` (light surface), `card` (white), `ink` / `ink-soft` (text), `accent` (pale purple), `sky`, `success`, `coral`, `destructive`. Use `bg-primary`, `text-secondary`, `bg-card`, `text-ink-soft`, etc.

**Typography:** `font-display` = **Lexend** (headings — extrabold, tight tracking), `font-script` = **Caveat** (playful accents). Body copy = Lexend.

**Radius:** `--radius: 1.5rem` → use `rounded-3xl` / `rounded-[28px]` for cards, `rounded-2xl` for inner elements, `rounded-full` for pills/avatars.

**Shadows:** `shadow-card` (soft card lift), `shadow-soft` (modal/hero), and the **tactile button depth** `--shadow-tactile` (`0 6px 0 primary-deep`) via the `.btn-tactile` utility (that "thick 3D border" pressable look).

**Core components (use these, don't rebuild):**
- `<TactileButton variant="primary|secondary|ghost">` — 56px tall, tactile depth, now includes `press-pop`. This is THE button everywhere.
- `<PhoneFrame>` — wraps every screen (390×844, faux status bar).
- `StoryProsBrand.tsx`: `<StoryProsLogo>` (the paper-plane + book "STORY PROS" wordmark), `<AuthBackdrop>` (cloud + star soft background — use it behind auth/onboarding screens), `<IconInput>` (rounded input with a leading icon).
- `StoryProsUi.tsx`: `<StatCard>`, the Paper-Planes currency badge, `<AppBottomNav>`, and shared icons (`HomeIcon`, `BookIcon`, `MapIcon`, `MedalIcon`, `PaperPlaneIcon`, `StarIcon`).

**Motion system (already added to styles.css — use for the "high-end feel"):**
- Entrances: `animate-slide-up`, `animate-pop-in`, `animate-bounce-in`, `animate-drop-in`; stagger a list of children with parent class `stagger-in`.
- Idle/ambient: `animate-float`, `animate-bob`, `animate-sparkle`, `animate-pulse-glow`, `animate-heart-beat`, `animate-gradient-pan`.
- Reactions: `animate-wiggle`, `animate-tada` (celebrate), `animate-jelly`, `animate-shake` (gentle "try again"), `animate-coin-pop`, `animate-star-pop`, `animate-confetti`.
- Interaction utilities: `press-pop` (buttons), `tap-squish`, `hover-lift` (cards), `shine-overlay` (premium sheen).
- Guideline: entrances on mount, `stagger-in` for grids/lists, `press-pop`/`hover-lift` on every tappable card, celebration animations only at reward moments. Keep it delightful, not busy. The global `prefers-reduced-motion` guard neutralizes all of it for sensitive users — never remove that block.

---

## 4. Screen-by-screen build spec

For each: **mockup file → route → component → what to match → corrections → data (already wired, just render it).**

> Convention: "match" = replicate layout, hierarchy, colors, rounded shapes, decorative backdrop, and character art placement from the mockup. "Correct" = apply Section 2 substitutions.

### A. Onboarding & Auth — `StoryPros-Selections/01 Onboarding Auth Profile/` + `09 …/Child Profile Creation`
These are the **known gap** — bring them fully to mockup quality.

1. **Splash** → `routes/index.tsx` → `SplashScreen`. Match *Story Pros App Splash Design*: centered Story Pros logo on cream + cloud/star `AuthBackdrop`, gentle `animate-float` on the logo. (Already close — verify logo, not old "EmpoweredDLD" wordmark.)
2. **Welcome / Onboarding carousel** → `routes/intro.tsx` → `IntroCarousel`. Match *Playful App Onboarding* + *Meet Dan and Daria Story Pals*: 4 slides, big character art, dot indicators, `TactileButton` "Next/Get Started." Keep the "Meet Dan & Daria" slide.
3. **Login** → `routes/login.tsx` → `LoginScreen`. Match *Colorful Kids App Login*: logo, `AuthBackdrop`, `IconInput` (email/password), primary "Log In," Google/Apple, link to Sign Up.
4. **Sign Up** → `routes/signup.tsx` → `SignUpScreen`. Match *Create Your Account with Story Pros*: same styling, role selector (parent/SLP/teacher) preserved.
5. **Onboarding assessment** → `routes/_authenticated/onboarding/assessment.tsx` → `OnboardingAssessment` **(OLD — predates rebuild, fully restyle)**. Make it a fun, low-pressure level-placement quiz in the Story Pros style (logo, backdrop, tactile answer chips, progress dots, character encouragement). No scores shown to the child.
6. **Child profile** → `routes/_authenticated/onboarding/profile.tsx` → `DataFormScreen` **(restyle to full mockup)**. Match *Child Profile Creation App Interface* exactly: Story Pros logo, paper-plane flight-path + star backdrop, purple "Create Child Profile" heading, `IconInput` name field, **age as a styled control (4–10)**, the **"Choose an Avatar" grid (8 Dan/Daria faces)** — see Section 5 on whether to include — a "Safe & Secure" shield card, and a primary Continue button with a trailing arrow. Keep `addChild()` wiring.
7. **Profile selection ("Who's Reading Today?")** → `routes/_authenticated/select-child.tsx` → `ProfileSelectionScreen`. Match *Bright and Playful Profile Selection*: child avatar cards in a grid, `stagger-in`, tap to select.
8. **Onboarding success** → `routes/_authenticated/onboarding/success.tsx` → `SuccessScreen`. Match *Celebratory Success* style: confetti, celebrating Dan & Daria, `TactileButton` into the app.

### B. Home Dashboard — `03 Main Dashboard/`
→ `routes/_authenticated/home.tsx` → `HomeDashboardScreen`. Match *Continue Your Adventure Story Pro*: Story Pros header logo, Paper-Planes badge (opens shop), "Hi there, Story Pro!" greeting, big **Continue Story** hero card (real current story cover + title + progress bar + "Continue Reading" with arrow), then a row of two stat cards.
**Corrections:** stat cards = **"Stories Completed"** + **"Paper Planes"** (NOT "Stories Created" / "Day Streak"). Remove the "Create" pencil FAB and any streak/fire UI. Bottom nav = the real 4 tabs. Data: `continueStory.ts`, `progress.ts` (already wired).

### C. Story Library — `04 Story Library/`
→ `routes/_authenticated/library.tsx` → `LibraryScreen`. Match *Story Library for Young Adventurers* + *Recommended Next Stories*: big "Story Library" title, star/plane backdrop, a featured "Top Pick" card, a 2-col grid of story cards (cover art + title + theme tag + lock state for premium), `stagger-in` + `hover-lift`.
**Corrections:** real 11 stories + covers; tags from JSON `theme` (no sci-fi/genres); **no ratings/reviews** — show level/age or nothing; **no Create tab**; lock icon reflects real `canAccessStory()` premium gating. Completed-story treatment can follow *Completed Story Treefort Plan Victory*; locked follows *Locked Space Adventure* (restyle to our purple, not space).

### D. In-Story Learning — `05 In Story Learning/`
→ `routes/_authenticated/story.$storyId.tsx` → `phases/*`. Match the quiz/retell/success mockups:
- **Slides** (`StorySlidesPhase`): full-bleed real slide art in a rounded card, element chip, TTS controls, page dots; each page `animate-pop-in`.
- **Quiz** (`ComprehensionPhase`): match *Colorful Quiz App for Kids* / *Storypros Quiz Interface* — question card, tactile answer options, Daria helper bubble; correct = `animate-tada`, wrong = gentle `animate-shake` (already added).
- **Sequencing / Retell** (`SequencingPhase`, `ImmediateRetellPhase`, `DelayedRetellPhase`): match *Story Retell Activity Interface* — **tap story-element icons** (no mic/AI in V1).
- **Success/Complete** (`StoryCompletePhase`): match *You Did It Story Pro* / *Celebratory Success* — celebrating Dan & Daria (`animate-bounce-in`), confetti, "Paper Planes earned," 1–3 star rating (`animate-star-pop`), Continue. (Already close.)

### E. Rewards & Progress — `06 Rewards Progress/`
→ `routes/_authenticated/achievements.tsx` → `AchievementGalleryScreen`. Match *Your Rewards Dashboard* / *Badge Earned Celebration* / *Your Progress Path* / *Skill Growth Dashboard*: Paper-Planes total, badge grid (`stagger-in`, `hover-lift`), Ms. Lopez coach bubble, skill-growth section, next-badge progress. **Corrections:** real badge/collectible data (`shop.ts`, `progress.ts`), Paper Planes not stars, no streak pressure framing.

### F. Shop / Customization — `07 Shop Customization/`
→ `routes/_authenticated/shop.tsx` → `CollectibleShopScreen`. Match *Colorful App Store for Kids Stories* / *Sticker Shop* / *Reward Unlocked Sky Explorer Pack* / *Unlock the Full Adventure*: category tabs, 2-col collectible grid (`stagger-in`), owned/price states (Paper Planes), reward-unlocked celebration (`animate-bounce-in`), premium "Unlock" → paywall.
**Corrections:** collectible categories = **paper-airplane designs, badges, wallpapers, character lore** (NOT avatar clothing). Prices in Paper Planes. Premium copy = free-forever + $9.99 / $7.99 early adopter.

### G. Parent & SLP side — `09 Parent Setup and Parent Side/`
→ `dashboard.tsx`→`ParentDashboardScreen`, `settings.tsx`→`SettingsScreen`, `paywall.tsx`→`PaywallScreen`, `slp.tsx`→SLP dashboard. Match *Colorful Parent Dashboard* / *Account Settings* / *Premium Subscription* / *Grown Up Check*: parent gate (keep existing math-question gate), child progress overview, settings (SLP invites, subscription, TTS, level override — **preserve all logic verbatim**), paywall with real pricing. **Corrections:** pricing + free-forever; no parent community/social; *Parental Control Settings* mockup = future feature (leave a styled placeholder only if already routed).

### H. States — `10 Empty Loading Error States/`
→ `StateScreens.tsx` (Loading/Empty/Offline) + `ErrorBoundary`. Match *Loading Your Stories in a Magical World* / *No Stories Yet* / *Offline Connection with Friendly Characters* / *Almost There Let's Try Again*: friendly Dan/Daria art, playful copy, tactile retry. (Already built — verify they match.)

### PARKED (do not build) — `_Parked/`
Avatar Shop, Daily Challenge, Emotion Check-in. Skip entirely.

---

## 5. Decision needed before building the profile step
The child-profile mockup includes an **8-avatar chooser**. Two options — pick per product direction:
- **Include it:** wire an avatar picker using existing Dan/Daria face crops; persist the choice on the child record (needs a small `avatar` field on `children` + in `addChild`). Matches the mockup fully.
- **Skip for V1:** match the styling (logo, backdrop, Safe & Secure card, arrow button) but keep just name + age. Fastest, still high-end.
Default to **Skip for V1** unless told otherwise (avoids a schema/logic change, honoring guardrail #1).

---

## 6. The real 11 stories (titles + ids)
Use these everywhere the mockups show fake titles. Cover art = `<story-id>/slide-01.webp`.

1. Dan and the Paper Cut — `dan-and-the-paper-cut`
2. Daria's Carnival Ticket — `darias-carnival-ticket`
3. Dan Joins the Game — `dan-joins-the-game`
4. Daria and the Puzzle Piece — `daria-and-the-puzzle-piece`
5. Dan and Daria's Treasure Hunt — `dan-and-darias-treasure-hunt`
6. The Kite in the Tree — `the-kite-in-the-tree`
7. The Sandcastle and the Wave — `the-sandcastle-and-the-wave`
8. Dan Talks About Recess — `dan-talks-about-recess`
9. Daria Asks for the Next Step — `daria-asks-for-the-next-step`
10. Dan's Lunchroom Moment — `dans-lunchroom-moment`
11. Daria Asks Again — `daria-asks-again`

Each story JSON also has `level`, `theme`, and `target_connective` — use those for tags/metadata instead of invented genres/ratings.

---

## 7. Execution order & definition of done

**Order (highest visual impact first):**
1. Onboarding assessment + child-profile (the known gap) → Home → Library → In-story phases → Rewards → Shop → Parent/SLP → States.
2. Do one screen at a time. After each: `npx tsc --noEmit` (ignore only the 2 known noise files), then visually diff against the mockup.

**For each screen, "done" means:**
- Layout, colors, rounded shapes, decorative backdrop, and character-art placement visually match the mockup.
- All Section 2 corrections applied (real names, Paper Planes, no Create/streak/challenges, real pricing).
- Motion applied per Section 3 (entrances, tap feedback, celebrations).
- No new tsc errors; all existing data wiring intact (buttons still navigate, data still loads/saves).
- Works inside `<PhoneFrame>` and respects reduced-motion.

**Deploy:** commit per screen (or per logical group) with a clear message; push to `main`; the repo is `EntrepreNerds2025/identical-view-script` and Lovable auto-deploys from `main`. Confirm the Lovable build shows no error before moving on.

**Final check:** click through the whole flow (onboarding → home → pick a story → complete it → rewards → shop → parent dashboard) and confirm every screen matches its mockup and nothing shows placeholder/fake content.
