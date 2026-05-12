## Build #2 — Story Engine + Scoring + Supabase Backend

Build on the existing Build #1 (onboarding flow, adventure map, basic story reader, comprehension, achievement gallery). This build adds the real clinical engine: must-complete scoring, vocabulary/SFA module, sentence builder with brain checks, sequencing with retry, and Supabase backend for persistence.

### Design system (already built — do not change)

Everything in `src/styles.css` stays. Same tokens, same `<TactileButton>`, same `<PhoneFrame>`. All new screens use the existing palette: purple primary, golden yellow secondary, cream backgrounds, Lexend font, 24px rounded cards, tactile button depth.

---

### 1. Supabase Backend Setup

Connect Supabase. Create these tables in a single migration:

**`profiles`** — parent accounts
- `id` uuid PK (from auth.users)
- `email` text
- `display_name` text
- `role` enum ('parent', 'slp', 'teacher')
- `created_at` timestamptz

**`children`** — child profiles under a parent
- `id` uuid PK
- `profile_id` uuid FK → profiles
- `name` text
- `age` int
- `current_level` int default 1
- `level_override` boolean default false (true if parent manually set the level)
- `created_at` timestamptz

**`stories`** — story metadata
- `id` text PK (slug like 'dans-papercut')
- `title` text
- `level` int
- `theme` text
- `target_connective` text (e.g., 'because')
- `slide_count` int
- `published` boolean default false
- `created_at` timestamptz

**`story_slides`** — one row per slide
- `id` uuid PK
- `story_id` text FK → stories
- `position` int
- `text` text
- `story_element` enum ('character','setting','problem','feeling','action','solution')
- `image_url` text

**`comprehension_questions`** — 6 per story (Level 1)
- `id` uuid PK
- `story_id` text FK → stories
- `position` int (1–6)
- `prompt` text
- `story_element` enum
- `options` jsonb — array of {id, label, emoji, correct: boolean}
- `brain_check_correct` text (e.g., "Great job answering that WHO question with a PERSON!")
- `brain_check_wrong` text (e.g., "Did you answer the WHO question with a person?")

**`vocabulary_words`** — 3 per story (2 nouns + 1 emotion)
- `id` uuid PK
- `story_id` text FK → stories
- `word` text
- `type` enum ('noun', 'emotion')
- `sfa_category` text
- `sfa_function` text
- `sfa_appearance` text
- `sfa_parts` text
- `sfa_location` text
- `image_url` text

**`vocabulary_quiz_questions`** — 6 per word (Level 1)
- `id` uuid PK
- `vocabulary_word_id` uuid FK → vocabulary_words
- `position` int
- `prompt` text
- `options` jsonb
- `correct_option_id` text

**`sentence_frames`** — 3 per story
- `id` uuid PK
- `story_id` text FK → stories
- `position` int (1–3)
- `frame_text` text (e.g., "Dan asked for a bandage because ___")
- `choices` jsonb — array of {id, text, correct: boolean}
- `brain_check_prompt` text (e.g., "Does your ending tell why?")

**`sequencing_frames`** — 6 per story (Level 1)
- `id` uuid PK
- `story_id` text FK → stories
- `correct_position` int
- `image_url` text
- `caption` text

**`story_progress`** — one row per child × story
- `id` uuid PK
- `child_id` uuid FK → children
- `story_id` text FK → stories
- `completed` boolean default false
- `completed_at` timestamptz
- `replay_count` int default 0

**`activity_attempts`** — every question the child answers
- `id` uuid PK
- `child_id` uuid FK → children
- `story_id` text FK → stories
- `activity_type` enum ('comprehension','sequencing','vocab_quiz','sentence_builder','phonological')
- `question_id` uuid (FK to the specific question table)
- `attempt_number` int
- `selected_option` text
- `is_correct` boolean
- `brain_check_response` text nullable
- `time_ms` int
- `created_at` timestamptz

**`skill_scores`** — rolling domain scores per child
- `id` uuid PK
- `child_id` uuid FK → children
- `domain` enum ('listening','story_structure','vocabulary','grammar','phonological','retell')
- `score` float (0–100, based on first-attempt accuracy)
- `stories_counted` int
- `updated_at` timestamptz

RLS: parents see only their own children's data. Children see only their own progress. SLP/teacher accounts see all attached children.

---

### 2. Story Data Model + Seed Story 1

Create a `content/` folder with Story 1 ("Dan's Papercut") as a JSON file that matches the database schema above. Include all 6 comprehension questions with brain check text, 3 vocabulary words with SFA features and 6 quiz questions each, 3 sentence frames with choices and brain checks, and 6 sequencing frames.

Build an admin import route at `/admin/content` that validates the JSON and upserts into Supabase.

---

### 3. Updated ComprehensionScreen — Must-Complete Model

Replace the current `ComprehensionScreen.tsx` which has 3 hardcoded questions and allows moving on after wrong answers.

New behavior:
- Load questions from Supabase (6 questions for Level 1)
- 4 answer choices per question (already correct in Build #1)
- **Child MUST answer correctly before moving to next question**
- On correct first attempt: show green confirmation + brain check that CONFIRMS (e.g., "Great job answering that WHO question with a PERSON!")
- On incorrect: show red indicator + brain check that PROMPTS (e.g., "Did you answer the WHO question with a person?")
  - If child responds "yes" but their answer wasn't correct type: app tells them what they actually answered with and prompts retry
  - Child retries until correct
- Track each attempt in `activity_attempts` table
- Show attempt count subtly (for parent dashboard, not prominently to child)
- Progress bar updates only when a question is answered correctly
- After all 6 correct: transition to next phase

Keep the existing visual style: rounded cards, emoji icons, purple/green/red coloring, TactileButton, slide-up animations.

---

### 4. VocabularyIntroScreen — SFA Exploration (New)

New screen component. NOT scored — this is teaching/exposure only.

For each of the 3 vocabulary words:
- Show the word prominently with its image
- Walk through 5 SFA dimensions one at a time:
  1. Category: "What group does [word] belong to?"
  2. Function: "What do you do with [word]?"
  3. Appearance: "What does [word] look like?"
  4. Parts: "What parts does [word] have?"
  5. Location: "Where do you find [word]?"
- Each dimension shown as a card with the answer revealed after a tap
- Child taps through at their own pace — no right/wrong, just exploration
- Use the existing card style with sky-blue backgrounds for the feature cards
- Daria character appears with a speech bubble introducing each word

---

### 5. VocabularyQuizScreen — Must-Complete (New)

After SFA exploration, quiz on each vocabulary word.

- 6 quiz questions per word (Level 1), loaded from `vocabulary_quiz_questions`
- 4 answer choices per question
- Must-complete model: child retries until correct
- Track attempts in `activity_attempts` with `activity_type = 'vocab_quiz'`
- Same visual pattern as ComprehensionScreen (card-based options, check/reveal flow)
- Progress bar shows progress across all words (e.g., 3 words × 6 questions = 18 total)

---

### 6. SentenceBuilderScreen — Drag-and-Drop with Brain Checks (New)

New screen component implementing Jinean's specific design.

- 3 sentence frames per story, loaded from `sentence_frames`
- All target the same connective (e.g., "because" for Level 1)
- **Design:** Sentence frame text displays up to the connective word. Below it, 3 draggable ending options appear as cards.
- Child drags the correct ending to the blank area (or taps to select on mobile)
- After selection: brain check appears — "Does your ending tell why?" with Yes/Oops buttons
  - If child answers "Oops" (or selects wrong ending): retry with remaining choices
  - If child answers "Yes" and it IS correct: celebrate and move to next frame
  - If child answers "Yes" but it's WRONG: app explains and prompts retry
- Must-complete: child must get each frame correct before the next one
- Track attempts in `activity_attempts` with `activity_type = 'sentence_builder'`
- Visual style: large readable text, draggable cards with shadow-card styling, purple accent for selected items

---

### 7. Updated SequencingScreen (New)

Build a new sequencing component (not in Build #1).

- 6 story pictures displayed in random order
- Child drags them into 6 numbered slots in correct order
- **Must-complete:** child keeps trying until the order is correct
- Hints available: story element icons can be toggled to help
- Track total attempts in `activity_attempts` with `activity_type = 'sequencing'`
- Visual: cards with story images, numbered drop zones, green checkmarks on correct placement, gentle shake animation on incorrect

---

### 8. Story Engine Phase Machine

Create a central story orchestrator that manages the phase flow:

```
StorySlides → StoryOverview → Comprehension → Sequencing →
ImmediateRetell → VocabIntro → VocabQuiz → SentenceBuilder →
DelayedRetell → PhonologicalAwareness → JokeSection →
PersonalConnection → StoryComplete
```

Each phase is a self-contained React component that:
- Receives story data as props
- Manages its own internal state
- Calls `onComplete(result)` when done
- The orchestrator writes results to Supabase via a `ProgressService`

Keep the orchestrator under 200 lines. Phase components own their completion logic.

For V1, these phases are simplified or placeholder:
- **ImmediateRetell:** Simple prompt screen ("Tell the story to someone!") with a "Done" button
- **DelayedRetell:** Show 6 story element icons, child taps each as they retell. Not scored in V1.
- **PhonologicalAwareness:** 1–3 rhyme/sound items. Tracked separately, doesn't affect passing.
- **JokeSection:** Multiple meaning word with two meanings pre-taught, then matching. Tracked separately.
- **PersonalConnection:** Prompt screen ("Has something like this happened to you?") with "Done" button.

---

### 9. Scoring Service

Create `src/services/scoring.ts`:

- Calculate first-attempt accuracy per activity per story
- Calculate domain scores using Jinean's weights:
  - Listening = (comp_questions × 0.50) + (brain_checks × 0.30) + (story_engagement × 0.20)
  - Grammar = sentence_builder × 1.00 (V1)
  - Vocabulary = vocab_quiz × 1.00 (V1, SFA intro not scored)
  - Story Structure = sequencing primary, comprehension secondary
  - Phonological = tracked separately, needs 3–4 stories before showing rating
  - Retell = dormant in V1
- Calculate overall composite: each domain weighted 18/100 except phonological at 10/100
  - In V1 with retell dormant, redistribute retell's 18 across the other 4 active domains
- Update `skill_scores` table after each story completion
- Translate scores to parent-facing language:
  - High first-attempt accuracy → "Strength"
  - Improving → "Growing area"
  - Needs multiple attempts → "Budding skill"
  - Consistently needs support → "Needs extra support right now"

---

### 10. Story Progress Persistence

Create `src/services/progress.ts`:

- After each story completion: create/update `story_progress` row
- On replay: increment `replay_count`, store both scores (not replaced, not averaged)
- Check level progression: if all stories at current level are completed → unlock next level celebration
- Support parent override: parent can change `current_level` and set `level_override = true`
- Support level skip: parent can jump child to any level

---

### 11. Adventure Map Updates

Update `AdventureMapScreen.tsx`:
- Load story data from Supabase instead of hardcoded PINS
- Show completion status per pin (completed/active/locked)
- Pin status driven by `story_progress` table
- Show first-attempt accuracy stars on completed pins (1–3 stars)
- Level unlock celebration animation when all stories at a level are done

---

### 12. Onboarding Assessment

After the existing onboarding form (name, age, parent info):
- Run child through a complete Level 1 story (the same full flow)
- Track first-attempt accuracy across all sections
- If 90%+ first-attempt accuracy in each section → place in Level 2
- Otherwise → place in Level 1
- Show placement result to parent with explanation
- Parent can override placement immediately

---

### Out of scope for Build #2

- Real authentication (keep mock auth from Build #1, but wire Supabase client)
- Parent dashboard with full insights (Build #3)
- SLP/teacher multi-child dashboard
- Audio narration / text-to-speech
- Microphone recording / AI retell analysis (V2)
- Paper Planes economy / collectible shop
- Phaser adventure hub
- Stripe payments

### Acceptance check

When done: open the preview, complete Story 1 end-to-end through all phases (slides → comprehension with must-retry → sequencing → vocab intro → vocab quiz → sentence builder with brain checks → retell prompts → phonological → joke → personal connection → completion), verify that attempt data is written to Supabase, verify that skill scores update, and verify the adventure map reflects completion status.
