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

One shared component, one glyph (the outlined speaker), three sizes only:

| Size | Use |
| --- | --- |
| 48px | The main thing on the screen: question, sentence, story word |
| 40px | A row item: an answer option, a scene card |
| 32px | Inline label inside a chip/pill |

Two states only: **idle** (speaker) and **playing** (same speaker, gentle pulse + tinted). No swapping to a ▶ play triangle or a ■ stop square — the icon never changes shape, so the symbol stays learnable.

Two tones only: **primary** (filled purple — the main audio on the screen) and **quiet** (soft tinted circle — secondary audio like an answer option). Never more than one primary speaker per screen.

### 2. Placement rule

The speaker always sits **at the start (left) of the thing it reads**, immediately adjacent to it — never floated to the far edge of a long pill (the current rhyme options), and never centred below the text.

### 3. Never overload another icon with audio

The story-element badge (Character / Place / Problem) is a *teaching* marker, not a button. It gets its own dedicated speaker next to it instead of being tappable.

### 4. Wording

Speakers carry no visible text label. Their accessible name is always `Hear "<the exact words>"`. "Listen", "Listen again" and "Hear It" as button copy are retired.

## Screen-by-screen changes

**Comprehension (the missing audio)**
- Add a 48px primary speaker to the left of the question text; the element badge becomes a non-interactive marker beside it.
- Add a 40px quiet speaker inside each of the four answer pills, at the left of the label, so a child can hear every option before choosing. Pills stay in the 2×2 grid; the speaker replaces the current empty left padding so heights don't grow.
- Feedback bubble gets a 40px quiet speaker for the spoken feedback line.

**Phonological (three styles → one)**
- Prompt: replace `ListenButton` (▶/■) with the 48px primary speaker.
- Options: move the far-right purple play circle **inside** the pill, at the left of the word, as a 40px quiet speaker; drop the pill from `min-h-[74px]` to a tighter row so it no longer reads as a long empty bar.
- "Listen again" in the wrong-answer feedback becomes "Try again".

**Vocabulary intro / quiz**
- Yellow floating play circle → primary speaker in the standard position.
- "Hear It ▶" button → the standard speaker beside the word.

**Story slides / section intros / retell / sentence builder / joke / personal connection**
- Swap their local speaker markup for the shared control at the size and tone above; keep existing positions where they already follow the rule (section intro's corner speaker moves inline to the left of the bubble text).

**Home / nav**
- `SpeakButton` becomes a thin wrapper over the shared control so sizes and glyph match the story flow.

## Technical notes

- New `src/components/empowered/AudioButton.tsx`: props `text`, `size: "lg" | "md" | "sm"`, `tone: "primary" | "quiet"`, `playing`, `onClick`. Pure presentation.
- Keep both audio engines as-is: `useListen`/`services/tts` for narration that has pre-generated clips, `speakLabel` for UI/answer text. The visual control is shared; the engine choice per screen doesn't change.
- `ListenButton.tsx` keeps `useListen` (the playback hook) and re-exports the new visual so existing imports don't break, then call sites are migrated.
- Colours stay on existing tokens (`primary`, `accent`, `secondary`); no new palette values.
- Files touched: `AudioButton.tsx` (new), `SpeakButton.tsx`, `ListenButton.tsx`, `ComprehensionPhase.tsx`, `PhonologicalPhase.tsx`, `VocabularyIntroPhase.tsx`, `VocabularyQuizPhase.tsx`, `StorySlidesPhase.tsx`, `SectionIntro.tsx`, `ImmediateRetellPhase.tsx`, `DelayedRetellPhase.tsx`, `SentenceBuilderPhase.tsx`, `JokePhase.tsx`, `PersonalConnectionPhase.tsx`.
