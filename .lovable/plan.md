## Build #1 — EmpoweredDLD Onboarding + Child Home

A clickable, mobile-first prototype of the parent onboarding flow plus the child's home screen. UI only — nothing saved to a backend yet.

### Design system (foundation)

Built from the project's `DESIGN.md` so every later screen stays consistent:

- **Palette**: warm cream background (`#fdf9ee`), denim blue primary (`#1e406a`), golden yellow secondary (`#ffde59`) reserved for celebration moments, soft sky blue for character bubbles.
- **Typography**: Lexend (loaded from Google Fonts). Child-facing copy at 24px, generous 1.5× line height.
- **Shapes**: 24px rounded cards/buttons, fully-rounded progress pills, no sharp corners.
- **Buttons**: 56px tall, "tactile" thick-border depth (4px darker shade at the bottom), shifts down 2px on press.
- **Cards**: white fill, soft ambient shadow.

All values land in `src/styles.css` as semantic tokens so future screens (story reader, achievement gallery, etc.) can plug in without restyling.

### Phone frame shell

A reusable `<PhoneFrame>` component renders a 390×844 device frame centered on desktop (rounded bezel, subtle shadow, status bar with time + battery icons). On real mobile it falls back to full-screen.

### Screens & flow

A single onboarding state machine drives navigation between screens (no URL routing inside the flow yet — feels like a native app). Order:

1. **Splash** (`/`) — "EmpoweredDLD / Words take flight." Paper-airplane illustration of Daria + her friend, golden glow behind the wordmark. Auto-advances after ~2s, or tap to continue.
2. **Intro carousel** — 3 swipeable slides with page dots, Skip + Next:
   - *Stories that grow with your child* — forest reading illustration
   - *Vocabulary, comprehension, and storytelling* — Ms. Lopez (Daria) with speech bubble of words
   - *Adventure through every story* — adventure map illustration, "Get Started" CTA on last slide
3. **Welcome / sign-up** — "Welcome — let's get your child started." Two big tactile buttons: *Continue with Google*, *Continue with Email*. "Already have an account? Sign in." link. Privacy reassurance footer. (Both buttons advance to the next step — no real auth.)
4. **Minimal data form** — 4 cards: child's first name, child's age (chip selector 4–10), parent name, parent email. Page-dot progress at top. Validation: Continue disabled until all four are filled.
5. **Success / handoff** — short "All set, [child name]!" celebration with confetti-style golden burst, then auto-advance to the child home.
6. **Child home — adventure map** — full illustrated map with path nodes (lessons), the child's avatar standing on a glowing golden tile, coin counter and streak in the top bar, current node pulsing. Tapping a node opens a placeholder modal ("Coming in build #2").

### Characters & art

I'll use the four uploaded character illustrations as bitmap assets:
- Daria + friend (paper airplane scene + intro slide 1)
- Daria solo (intro slide 2 / Ms. Lopez stand-in)
- The boy character (child avatar on the adventure map)
- Ms. Lopez (yellow blazer) reserved for later builds (SLP-facing screens)

The adventure map illustration and small UI icons (coin, star, book, lock) will be inline SVG so they tint cleanly with the palette.

### Interactions

- Swipe + dot navigation on the intro carousel
- Form fields show inline validation; age chips toggle with a clear selected state (denim blue tint)
- Buttons have the press-down depth animation specified in the design system
- Confetti celebration on the success screen uses CSS keyframes (no heavy library)

### Out of scope for build #1 (called out so we can plan build #2)

- Real authentication and any database persistence
- The actual lesson screens (story reader, comprehension question, level-up, etc.)
- SLP/parent dashboards, message center, progress reports
- Audio recording, daily language minute, achievement gallery

### Acceptance check

When you click *Implement plan*, you'll be able to: open the preview, see the phone frame with the splash, swipe through the 3 intro slides, "sign up" with either button, fill in the form, see the celebration, and land on the adventure map — end-to-end, in the EmpoweredDLD visual style.