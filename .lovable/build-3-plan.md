## Build #3 — Auth, Settings, Collectible Shop, Audio

Build on Build #2 (story engine, scoring, phase machine, adventure map, onboarding assessment). This build adds real authentication, parent account management, the Paper Planes collectible shop, and text-to-speech audio for story reading.

### Design system (already built — do not change)

Everything in `src/styles.css` stays. Same tokens, same `<TactileButton>`, same `<PhoneFrame>`. All new screens use the existing palette: purple primary, golden yellow secondary, cream backgrounds, Lexend font, 24px rounded cards, tactile button depth.

---

### 1. Supabase Auth + Account System

Replace mock auth with real Supabase authentication.

**Sign Up flow:**
- Email + password registration using `supabase.auth.signUp()`
- On successful signup, create a `profiles` row with `role = 'parent'`
- Email verification (Supabase handles the email — configure redirect URL in Supabase dashboard)
- After first login, the existing onboarding flow runs (intro carousel → data form → assessment)

**Login flow:**
- Email + password login using `supabase.auth.signInWithPassword()`
- After login, load the parent's children from `children` table
- If children exist, go straight to adventure map
- If no children, run onboarding flow

**Session management:**
- Use `supabase.auth.onAuthStateChange()` to persist session across page reloads
- Store auth state in a React context (`AuthProvider`)
- Create `src/contexts/AuthContext.tsx`:
  ```tsx
  interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    children: Child[];
    activeChild: Child | null;
    setActiveChild: (child: Child) => void;
    signOut: () => Promise<void>;
    loading: boolean;
  }
  ```
- Wrap the app in `<AuthProvider>` at the root level
- All services (`progress.ts`, `stories.ts`) read `activeChild.id` from context instead of hardcoded "demo"

**Password reset:**
- "Forgot password?" link on login screen
- Uses `supabase.auth.resetPasswordForEmail()`
- Redirect to password update page

**New screens needed:**
- `LoginScreen.tsx` — email + password form, "Forgot password?" link, "Create account" link
- `ForgotPasswordScreen.tsx` — email input, sends reset link
- Update `SignUpScreen.tsx` — wire to `supabase.auth.signUp()` instead of just advancing step

**Route changes:**
- If no session → show LoginScreen (or SignUpScreen for new users)
- If session + no children → onboarding flow
- If session + children → adventure map
- Settings gear in adventure map header → SettingsScreen
- `/admin/content` requires `role = 'parent'` or `role = 'slp'`

---

### 2. Parent Settings Screen

New `SettingsScreen.tsx` component accessible from the gear icon on the adventure map header.

**Sections:**

**Child Profile:**
- Child's name (editable)
- Child's age (editable)
- Current level (display + override toggle)
- Level override: parent can tap Level 1 or Level 2 to manually set placement
- "Run assessment again" button to re-run the onboarding assessment

**Account:**
- Parent email (display only)
- Change password button → navigates to password change flow
- Sign out button

**App Preferences:**
- Text-to-speech speed: Slow / Normal / Fast (stored in local preferences, not Supabase)
- Auto-play audio on story slides: On / Off

**About:**
- App version
- "Contact us" link (mailto:camesha.russell03@gmail.com)
- "Privacy Policy" link (placeholder URL)
- "Terms of Service" link (placeholder URL)

**Visual style:**
- Full-screen panel (not a modal)
- Grouped settings in rounded cards with `shadow-card`
- Use the existing cream background
- Back button in top-left returns to adventure map

---

### 3. Paper Planes Collectible Shop

New `CollectibleShopScreen.tsx` — accessible from the "Rewards" tab in the bottom navigation bar (currently shows AchievementGalleryScreen).

**Economy rules (from April 25 meeting decisions):**
- Paper Planes are earned through learning only — no real-money purchases
- All items are non-weapon, non-combat, inclusive, avoid gender stereotypes
- Append-only ledger: every earn and spend is recorded

**Collectible categories (V1):**

1. **Paper Airplane Designs** (cosmetic — shown on celebration screens and profile)
   - Standard (free, default)
   - Fighter Jet — 50 Paper Planes
   - Origami Crane — 75 Paper Planes
   - Glider — 60 Paper Planes
   - Dart — 40 Paper Planes
   - Loop-de-Loop — 100 Paper Planes
   - Rainbow Flyer — 150 Paper Planes

2. **Badges** (auto-awarded on milestones, displayed in profile)
   - First Story Complete — 0 cost (auto-awarded)
   - 3-Story Streak — 0 cost (auto-awarded)
   - 5-Story Streak — 0 cost (auto-awarded)
   - Vocabulary Master (all words correct first try) — 0 cost (auto-awarded)
   - Perfect Story (100% first-attempt across all domains) — 0 cost (auto-awarded)
   - Level 1 Complete — 0 cost (auto-awarded)
   - Collector (own 5+ airplane designs) — 0 cost (auto-awarded)

3. **Wallpapers** (background themes for the adventure map)
   - Sky Blue (default, free)
   - Sunset Orange — 80 Paper Planes
   - Night Stars — 100 Paper Planes
   - Forest Green — 80 Paper Planes
   - Ocean Waves — 120 Paper Planes

4. **Character Lore Cards** (fun facts about story characters)
   - "Dan's favorite color is green" — 20 Paper Planes
   - "Daria's dad plays saxophone on weekends" — 20 Paper Planes
   - "Dan has a pet goldfish named Bubbles" — 20 Paper Planes
   - More unlock as stories are added

5. **Airplane Tricks** (cosmetic animations on celebration screen)
   - Loop — 60 Paper Planes
   - Boomerang — 80 Paper Planes
   - Spiral — 100 Paper Planes

**Supabase tables needed:**

**`collectibles`** — catalog of all purchasable items
- `id` text PK (slug like 'airplane-fighter-jet')
- `category` enum ('airplane_design', 'badge', 'wallpaper', 'lore_card', 'airplane_trick')
- `name` text
- `description` text
- `cost` int (Paper Planes, 0 for auto-awarded badges)
- `image_url` text
- `auto_award_condition` text nullable (for badges: 'first_story', '3_streak', etc.)
- `sort_order` int

**`child_collectibles`** — owned items per child
- `id` uuid PK
- `child_id` uuid FK → children
- `collectible_id` text FK → collectibles
- `acquired_at` timestamptz
- `equipped` boolean default false (for airplane designs and wallpapers — which is active)

Update `coins_ledger` table (rename to `paper_planes_ledger`):
- `id` uuid PK
- `child_id` uuid FK → children
- `amount` int (positive = earn, negative = spend)
- `reason` text ('story_completion', 'mastery_bonus', 'streak_bonus', 'purchase')
- `reference_id` text nullable (story_id or collectible_id)
- `created_at` timestamptz

**Shop UI:**
- Tab bar at top: All | Airplanes | Wallpapers | Lore | Tricks
- Each item is a card with image, name, cost (Paper Planes icon + number)
- Owned items show a checkmark instead of price
- Equipped items (active airplane/wallpaper) show "Active" badge
- Tapping an unowned item shows a purchase confirmation sheet:
  "Get [item name] for [cost] Paper Planes?" with Cancel / Get it! buttons
- Tapping an owned item lets you equip/unequip it
- Paper Planes balance shown in header
- Badges section shows earned vs locked badges with progress hints

**Shop service (`src/services/shop.ts`):**
- `getCollectibles()` — all items from catalog
- `getOwnedCollectibles(childId)` — child's owned items
- `purchaseCollectible(childId, collectibleId)` — deduct Paper Planes, add to owned, record in ledger
- `equipCollectible(childId, collectibleId)` — set as active (unequip others in same category)
- `checkAndAwardBadges(childId)` — check milestone conditions, auto-award badges
- `getPaperPlanesBalance(childId)` — sum of ledger for child

---

### 4. Text-to-Speech Audio

Wire up the Web Speech API for story narration.

**Implementation:**

Create `src/services/tts.ts`:
```typescript
interface TTSOptions {
  rate: number;    // 0.5 = slow, 0.85 = normal, 1.1 = fast
  pitch: number;   // 1.0 default
  voice?: string;  // preferred voice name
}

function speak(text: string, options: TTSOptions): Promise<void>;
function stop(): void;
function isSpeaking(): boolean;
```

**Where TTS is used:**
- `StorySlidesPhase.tsx` — "Listen" button reads the current slide's text aloud
  - Button shows a speaker icon, toggles to a stop icon while speaking
  - Highlight words as they're read (if SpeechSynthesis provides word boundaries)
  - Auto-advance to next word boundary for visual tracking
- `ComprehensionPhase.tsx` — option to hear the question read aloud (small speaker icon next to question text)
- `VocabularyIntroPhase.tsx` — pronounce the vocabulary word when the title card appears
- `PhonologicalPhase.tsx` — pronounce phonological options when tapped (critical for sound-based activities)

**Auto-play setting:**
- If parent enabled "auto-play audio" in settings, story slides auto-narrate when they appear
- Otherwise, child taps the Listen button manually

**Voice selection:**
- Prefer a child-friendly voice (look for voices with "child" or "female" in the name)
- Fall back to the default system voice
- Store the selected voice preference in localStorage

**Update `StorySlidesPhase.tsx`:**
- Import the TTS service
- Listen button calls `speak(current.text, options)`
- While speaking, show a pulsing audio indicator and a stop button
- When speech ends, optionally auto-advance to next slide (if auto-play is on)

---

### 5. Wire Updated Navigation

**Bottom nav bar changes:**
- "Rewards" tab now opens `CollectibleShopScreen` instead of `AchievementGalleryScreen`
- AchievementGalleryScreen becomes a sub-section within the shop (Badges tab)

**Settings access:**
- Gear icon in adventure map header → `SettingsScreen`

**Auth gates:**
- If not authenticated → LoginScreen
- If authenticated but no child profile → onboarding
- If authenticated with child → adventure map

**Route updates in `index.tsx`:**
- Add steps: `"login"`, `"forgot-password"`, `"settings"`, `"shop"`
- Login is the new default step (replacing splash) when no session exists
- Splash → intro carousel only runs once per account (track in profiles table: `onboarded: boolean`)

---

### 6. Migration SQL

Add new tables and modify existing ones:

```sql
-- Collectibles catalog
CREATE TABLE collectibles (
  id text PRIMARY KEY,
  category text NOT NULL CHECK (category IN ('airplane_design','badge','wallpaper','lore_card','airplane_trick')),
  name text NOT NULL,
  description text,
  cost integer NOT NULL DEFAULT 0,
  image_url text,
  auto_award_condition text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Child's owned collectibles
CREATE TABLE child_collectibles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  collectible_id text REFERENCES collectibles(id),
  acquired_at timestamptz DEFAULT now(),
  equipped boolean DEFAULT false,
  UNIQUE(child_id, collectible_id)
);

-- Paper Planes ledger (append-only)
CREATE TABLE paper_planes_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  reason text NOT NULL,
  reference_id text,
  created_at timestamptz DEFAULT now()
);

-- Add onboarded flag to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarded boolean DEFAULT false;

-- Add TTS preferences to children
ALTER TABLE children ADD COLUMN IF NOT EXISTS tts_speed text DEFAULT 'normal' CHECK (tts_speed IN ('slow','normal','fast'));
ALTER TABLE children ADD COLUMN IF NOT EXISTS tts_autoplay boolean DEFAULT false;

-- RLS for new tables
ALTER TABLE collectibles ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_collectibles ENABLE ROW LEVEL SECURITY;
ALTER TABLE paper_planes_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Collectibles are readable by everyone"
  ON collectibles FOR SELECT USING (true);

CREATE POLICY "Parents manage their children's collectibles"
  ON child_collectibles FOR ALL
  USING (child_id IN (SELECT id FROM children WHERE profile_id = auth.uid()));

CREATE POLICY "Parents see their children's ledger"
  ON paper_planes_ledger FOR ALL
  USING (child_id IN (SELECT id FROM children WHERE profile_id = auth.uid()));

-- Seed collectibles catalog
INSERT INTO collectibles (id, category, name, description, cost, sort_order) VALUES
  ('airplane-standard', 'airplane_design', 'Standard', 'The classic paper airplane', 0, 1),
  ('airplane-fighter', 'airplane_design', 'Fighter Jet', 'Sleek and fast!', 50, 2),
  ('airplane-crane', 'airplane_design', 'Origami Crane', 'Beautiful folded crane', 75, 3),
  ('airplane-glider', 'airplane_design', 'Glider', 'Soars long distances', 60, 4),
  ('airplane-dart', 'airplane_design', 'Dart', 'Sharp and speedy', 40, 5),
  ('airplane-loop', 'airplane_design', 'Loop-de-Loop', 'Does tricks in the air!', 100, 6),
  ('airplane-rainbow', 'airplane_design', 'Rainbow Flyer', 'All the colors!', 150, 7),
  ('badge-first-story', 'badge', 'First Story', 'Completed your first story!', 0, 1),
  ('badge-3-streak', 'badge', '3-Story Streak', 'Completed 3 stories in a row', 0, 2),
  ('badge-5-streak', 'badge', '5-Story Streak', 'Completed 5 stories in a row', 0, 3),
  ('badge-vocab-master', 'badge', 'Vocabulary Master', 'All words correct first try', 0, 4),
  ('badge-perfect-story', 'badge', 'Perfect Story', '100% first-attempt accuracy', 0, 5),
  ('badge-level1-complete', 'badge', 'Level 1 Complete', 'Finished all Level 1 stories', 0, 6),
  ('badge-collector', 'badge', 'Collector', 'Own 5 or more airplane designs', 0, 7),
  ('wallpaper-sky', 'wallpaper', 'Sky Blue', 'The classic sky', 0, 1),
  ('wallpaper-sunset', 'wallpaper', 'Sunset Orange', 'Warm evening colors', 80, 2),
  ('wallpaper-stars', 'wallpaper', 'Night Stars', 'Twinkling night sky', 100, 3),
  ('wallpaper-forest', 'wallpaper', 'Forest Green', 'Deep in the woods', 80, 4),
  ('wallpaper-ocean', 'wallpaper', 'Ocean Waves', 'Rolling blue waves', 120, 5),
  ('lore-dan-color', 'lore_card', 'Dan''s Favorite Color', 'Dan''s favorite color is green!', 20, 1),
  ('lore-dad-sax', 'lore_card', 'Musical Dad', 'Daria''s dad plays saxophone on weekends', 20, 2),
  ('lore-dan-fish', 'lore_card', 'Bubbles', 'Dan has a pet goldfish named Bubbles', 20, 3),
  ('trick-loop', 'airplane_trick', 'Loop', 'Your plane does a loop!', 60, 1),
  ('trick-boomerang', 'airplane_trick', 'Boomerang', 'Your plane comes back!', 80, 2),
  ('trick-spiral', 'airplane_trick', 'Spiral', 'Your plane spirals through the air!', 100, 3);
```

---

### Out of scope for Build #3

- SLP/teacher multi-child dashboard (Build #4)
- Full parent dashboard with insights over time (Build #4)
- Microphone recording / AI retell analysis (V2)
- Avatar clothing system (V2, requires Phaser hub)
- Phaser adventure hub
- Stripe payments (Build #4)
- Push notifications
- More story content (separate content sprint)

### Acceptance check

When done: create an account, log in, complete onboarding assessment, play Story 1 with audio narration on, earn Paper Planes, open the collectible shop, purchase an airplane design, equip it, check that the badge auto-awards, open settings, change level, sign out, sign back in and verify everything persists.
