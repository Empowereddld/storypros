# Home screen for non-readers: tap-to-hear, coins, streak and words

Rebuild the child's home screen and navigation around the rules you listed: calm, predictable, one clear action, nothing plays on its own, no bare zeros.

Your answers are locked in: **Coins stays the name** (no rename to Stars), **Adventure Map stays in the nav**, and I'll **write a one-line recap per story** into the 11 content files.

## About the "Grown-ups" button

Its purpose is to keep adult-only controls (settings, account, sign out, child profile, subscription) out of reach of a child tapping around, while still being one tap away for a parent. Today Settings sits in the child's nav and a tap can change or undo things the child can't recover from.

My recommendation: **hold-to-enter** (press and hold ~3 seconds, with a filling ring). No maths, no reading, works one-handed, and a young child rarely holds long enough by accident. A maths gate is stronger but adds a puzzle for parents who just want to change the voice speed. I'll go with hold-to-enter unless you say otherwise.

## Layout (final order)

```text
[ Logo ]     [ Home  Library  Map  Rewards ]        [ Coins: N ]

Hi, Ava!  (speaker)
Ready to continue your adventure?

+--------------------------------+   +------------------+
| CONTINUE STORY                 |   | This week        |
| [ scene illustration ]         |   | * * * o o o o    |
| Dan and the Paper Cut (speaker)|   +------------------+
| Dan got a paper cut at school. |   | Coins  (or goal  |
| Part 4 of 12      33% complete |   |  copy when 0)    |
| [====------------------]       |   +------------------+
| [   Continue Reading  >    ]   |   | My Badges (locked|
+--------------------------------+   |  peek)           |
                                     +------------------+
Words you're learning
[ bandage ] [ paper airplane ] [ calm ]     (each tap-to-hear)

                                            [ Grown-ups ]
```

## What changes

**1. Tap-to-hear everywhere (top priority)**
Greeting, subtitle, story title, recap line, stat cards, word cards, nav labels and the primary button all get a speak affordance. A small speaker icon sits next to text; on cards the speaker is its own button so tapping it never navigates. Nothing speaks on load or on hover — the child always starts it. Rate 0.85, English voice, any in-flight speech cancelled first.

**2. Navigation**
Four destinations kept (Home, Library, Adventure Map, Rewards) since you want the map to stay. Icon-first: large icon above a short word, both on the desktop top bar and the mobile bottom bar, every item at least 44x44 with roomier spacing. Each item is tap-to-hear via long-press. Feedback tab is left alone (out of scope).

**3. Adult controls out of the child's view**
Settings leaves the child nav and the home header menu. A calm "Grown-ups" button at the bottom of home opens a hold-to-enter gate, then goes to Settings. Direct URLs still work for you and for parents.

**4. No bare zeros**
When a counter is 0 the card shows goal copy instead of the number: "Finish today's story to earn your first coins." Same for stories completed. A number only appears once there's something to celebrate.

**5. One visible reward number**
Coins is the only number on the dashboard. The separate "Stories Completed" counter card goes away (it's still in Rewards), and the "LEVEL 1" chip on the story card becomes three filled/unfilled dots so it reads as progress, not a second economy.

**6. Today state + week streak**
A 7-dot Mon–Sun strip filled from real per-day completion data. A "You're done for today!" panel replaces the Continue button once today's session is finished, with a calm illustration and no new task pushed. Small milestone messages at 1, 3, 5 and 7 days.

**7. Words you're learning**
A row of the current story's target words (story 1: bandage, paper airplane, calm), each card with the word, its illustration, and tap-to-hear. Tapping a card opens a short definition and example sentence built from the word's existing description data. No quiz, no score.

**8. Concrete story card recap**
"Practising with friends." is replaced by a past-tense recap sentence I add to each story file, e.g. "Dan got a paper cut at school." "Part 4 of 12" and the progress bar both stay.

**9. My Badges with a locked peek**
A compact strip under the stats: earned badges in colour, the next two or three as shadowed silhouettes with a small lock, plus "See All" into Rewards. Locked badges are shown as what's coming, never as failure.

## Technical notes

- New `src/lib/speak.ts` wrapping `SpeechSynthesisUtterance` (rate 0.85, cancel-before-speak, English voice pick), plus a small `SpeakableText` / `SpeakButton` pair in `src/components/empowered/` reused across screens. Existing `services/tts.ts` stays for story narration (it prefers pre-generated clips); the UI helper is browser-speech only so labels never need audio files.
- `src/services/progress.ts`: expose per-day completion dates (`getPlayedDates()` / `hasPlayedToday()`) and cache the `daily_streaks` dates already fetched from the cloud, so the week strip and today-state read real data.
- `src/services/continueStory.ts` + `src/types/story.ts`: add a `recap` field, threaded from a new `recap` key in each `content/story-*.json`.
- `src/components/empowered/HomeDashboardScreen.tsx`: restructure into greeting, hero card, right rail (week strip, coins, badges), words strip, Grown-ups footer. `StatCardLite` gains zero-state goal copy and loses the stories counter call site.
- `src/components/empowered/StoryProsUi.tsx` (`AppBottomNav`) and `AppChrome.tsx` (`DesktopNav`): icon-above-label, larger targets, Settings removed, long-press to hear.
- New `ParentGate`-style hold-to-enter usage for the Grown-ups button (project already has `ParentGate.tsx` — I'll reuse or extend it rather than adding a second gate).
- All colours via existing semantic tokens; touch targets min 44px; badge locks use opacity plus an icon, not colour alone.
