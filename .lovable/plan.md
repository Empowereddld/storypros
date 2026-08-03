# One speaker, everywhere: a predictable audio system

## What's actually wrong

Right now the app has at least five different "hear this" controls:

- `SpeakButton` (purple filled circle, one speaker glyph) — home, nav
- `ListenButton` (play triangle ▶ that turns into a stop square) — phonological prompt
- A separate purple `PlayIcon` circle beside each phonological option
- A yellow circular play button in vocabulary / rhyme cards
- The comprehension question has **no** speaker at all — the coloured story-element icon (Character, Place…) is secretly the play button
- Copy varies: "Listen", "Listen again", "Hear It", "Hear the question"

For a child with DLD, that's five different symbols to learn for one action. The rule should be: **one shape, one icon, one meaning — a speaker circle always means "tap to hear this".**

## The system

### 1. A single audio control

One shared component, one glyph (the outlined speaker). Every instance keeps a **44–48px hit area** for accessibility, while the visible circle can be smaller so secondary speakers don't shout:

| Visual circle | Hit area | Use |
| --- | --- | --- |
| 48px | 48px | The main audio on the screen: question, sentence, story word |
| 40px | 44px | A row item: an answer option, a scene card |
| 32px | 44px (padded) | Inline beside a chip/short label |

Two states only: **idle** and **playing**. Playing keeps the identical speaker glyph and changes only a subtle tint plus a ring — no pulsing, glowing, or bouncing animation anywhere. No swapping to a ▶ play triangle or ■ stop square.

Two tones only: **primary** (filled purple — the main audio on the screen) and **quiet** (soft tinted circle — secondary audio like an answer option). Never more than one primary speaker per screen.

### 2. Placement and spacing rule

The speaker always sits **at the start (left) of the thing it reads**, immediately adjacent to it — never floated to the far edge of a long pill (the current rhyme options), never centred below the text. The gap between a speaker and its content is always **10–12px**.

### 3. Separate hit targets in selectable cards

On any answer option the speaker is its own button, not part of the card's tap area:
- Tapping the speaker reads that option aloud and does **not** select it.
- Tapping anywhere else on the card selects the answer.
- Implemented as sibling elements in one row (not a nested button), so the split is unambiguous for both touch and screen readers.

### 4. Never overload another icon with audio

The story-element badge (Character / Place / Problem) is a *teaching* marker, not a button. It gets its own dedicated speaker next to it instead of being tappable.

### 5. Labels

Default to **icon-only** speakers wherever the adjacent content makes the meaning obvious (question, answer option, story word). A visible label stays allowed where it genuinely adds clarity — this is a default, not an absolute ban. Accessible name is always `Hear "<the exact words>"`.

### 6. No duplicate audio actions

A replay speaker appears in feedback only when the feedback is **not** already spoken automatically, or when replay is deliberately offered. Where feedback auto-speaks, no second speaker is added.

## Screen-by-screen changes

No instructional or activity copy changes in this pass — visuals, placement, and interaction only.

**Comprehension (the missing audio)**
- Add a 48px primary speaker to the left of the question text (12px gap); the element badge becomes a non-interactive marker beside it.
- Add a 40px quiet speaker inside each of the four answer pills, at the left of the label, as a separate hit target from the selection area. Pills stay in the 2×2 grid; the speaker uses the existing left padding so heights don't grow.
- Feedback bubble: audit whether the feedback line already auto-speaks. Add a quiet replay speaker only if it does not.

**Phonological (three styles → one)**
- Prompt: replace `ListenButton` (▶/■) with the 48px primary speaker.
- Options: move the far-right purple play circle **inside** the pill, at the left of the word, as a 40px quiet speaker with its own hit target; drop the pill from `min-h-[74px]` to a tighter row so it no longer reads as a long empty bar.

**Vocabulary intro / quiz**
- Yellow floating play circle → primary speaker in the standard position.
- The "Hear It" control becomes the standard speaker beside the word; its wording is left for a separate copy pass.

**Story slides / section intros / retell / sentence builder / joke / personal connection**
- Swap their local speaker markup for the shared control at the size and tone above; keep existing positions where they already follow the rule (section intro's corner speaker moves inline to the left of the bubble text).

**Home / nav**
- `SpeakButton` becomes a thin wrapper over the shared control so sizes and glyph match the story flow.


## Technical notes

- New `src/components/empowered/AudioButton.tsx`: props `text`, `size: "lg" | "md" | "sm"`, `tone: "primary" | "quiet"`, `playing`, `onClick`, `label?`. Pure presentation; enforces the 44px minimum hit area independent of visible circle size, and stops event propagation so it never triggers a parent card's selection.
- Keep both audio engines as-is: `useListen`/`services/tts` for narration that has pre-generated clips, `speakLabel` for UI/answer text. The visual control is shared; the engine choice per screen doesn't change.
- `ListenButton.tsx` keeps `useListen` (the playback hook) and re-exports the new visual so existing imports don't break, then call sites are migrated.
- Remove `animate-pulse` / `animate-pulse-glow` from every speaker; playing state is tint + ring only.
- Colours stay on existing tokens (`primary`, `accent`, `secondary`); no new palette values. No copy edits in this pass.
- Files touched: `AudioButton.tsx` (new), `SpeakButton.tsx`, `ListenButton.tsx`, `ComprehensionPhase.tsx`, `PhonologicalPhase.tsx`, `VocabularyIntroPhase.tsx`, `VocabularyQuizPhase.tsx`, `StorySlidesPhase.tsx`, `SectionIntro.tsx`, `ImmediateRetellPhase.tsx`, `DelayedRetellPhase.tsx`, `SentenceBuilderPhase.tsx`, `JokePhase.tsx`, `PersonalConnectionPhase.tsx`.
