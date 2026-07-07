# Story Pros — Story Content, Flow & Audio Reference

Companion to `SCREEN-FIDELITY-PLAN.md`. This documents the **story data model, playback order/flow, image wiring, and audio/voice status** so any agent building on the app gets the order, flow, and assets right and does not reinvent them.

---

## 1. Story content — single source of truth

All 11 stories live as JSON in **`content/story-01…11-*.json`** and are bundled via **`src/services/stories.ts`**. Each file holds *everything* for that story. Per-story shape:

```
{
  id, title, level, theme, target_connective,
  slides[6]:               { position, text, story_element, image }
  comprehension_questions[6]: { position, prompt, story_element,
                                options[3]{ id, label, emoji, correct },
                                brain_check_correct, brain_check_wrong }
  vocabulary_words[3]:     { word, type, image,
                             sfa{ category, function, appearance, parts, location },
                             quiz_questions[6]{ position, prompt, options[3]{id,text,correct} },
                             sfa_teaching{ intro_text, intro_narration,
                                           slides[5]{ feature, prompt, teaching_text, narration },
                                           transition_text, connection_text, connection_narration } }
  sentence_frames[3]:      { position, frame_text, choices[3]{id,text}, brain_check_prompt }
  sequencing_frames[6]:    { correct_position, caption, image }
  phonological_items[1]:   { type, prompt, options[3]{id,text,correct} }
  joke:                    { word, meaning_1{text,image}, meaning_2{text,image}, joke_text }
  personal_connection:     { prompt }
  retell_prompts:          { immediate, delayed, story_elements[6] }
}
```

**Rule for any agent:** story content (titles, text, questions, order) comes from these JSON files — never hardcode it in components. All 11 stories are currently `level: 1`.

### The 11 stories (id — title)
1. `dan-and-the-paper-cut` — Dan and the Paper Cut
2. `darias-carnival-ticket` — Daria's Carnival Ticket
3. `dan-joins-the-game` — Dan Joins the Game
4. `daria-and-the-puzzle-piece` — Daria and the Puzzle Piece
5. `dan-and-darias-treasure-hunt` — Dan and Daria's Treasure Hunt
6. `the-kite-in-the-tree` — The Kite in the Tree
7. `the-sandcastle-and-the-wave` — The Sandcastle and the Wave
8. `dan-talks-about-recess` — Dan Talks About Recess
9. `daria-asks-for-the-next-step` — Daria Asks for the Next Step
10. `dans-lunchroom-moment` — Dan's Lunchroom Moment
11. `daria-asks-again` — Daria Asks Again

---

## 2. Order & flow

**Within a story — the 12-phase sequence** is defined in `src/components/empowered/phases/StoryEngine.tsx` → `PHASE_ORDER` (do not reorder without intent):

```
slides → comprehension → sequencing → immediate-retell → vocab-intro →
vocab-quiz → sentence-builder → delayed-retell → phonological → joke →
personal-connection → story-complete
```

- **Slide order** inside the slides phase = the `position` field (1→6).
- **Sequencing** uses the same 6 slide images shuffled; the child restores `correct_position` order.
- **Retell (V1)** = the child taps `retell_prompts.story_elements` icons — **no microphone / no AI feedback** (AI retell is V2).
- **Resume** — `src/services/checkpoint.ts` stores the phase index so a child continues mid-story.

**Across stories — level unlock:** `stories.ts` → `getStoriesByLevel`, `getStoryIds`, `isLevelComplete`. Rule: all stories in a level are available; the child picks order; completing **all** stories in a level unlocks the next. (Everything is Level 1 today.)

---

## 3. Images in the story flow — all created & organized ✓

Every image that appears anywhere in a story is one we generated, background-processed, and placed. They live in **`src/assets/stories/<story-id>/`** and are resolved at runtime by **`src/services/storyImages.ts`** → `resolveStoryImage(storyId, filename)`. **Never hardcode asset paths — always go through the resolver** (returns `null` + graceful placeholder if an asset is missing).

Full inventory — **121 images, all present, 0 missing:**

| Where it appears | Files (per story) | Count | Notes |
|---|---|---|---|
| Story slides (read-along) | `slide-01…06.webp` | 66 | Full scenes, keep backgrounds. |
| Sequencing activity | *(reuses the slide files)* | — | No separate art; shuffles `slide-0N.webp`. |
| Vocabulary cards | `vocab-<word>.webp` | 33 | 3 per story; transparent cutouts. |
| Joke panels | `joke-<word>-1/2.webp` | 22 | 2 per story; transparent cutouts. |
| Comprehension / sentence / phonological | *(none — uses emojis in the JSON `options`)* | — | No custom images needed. |

Notes for the next agent:
- The 3 emotion vocab cards that repeat across two stories (`vocab-worried`, `vocab-embarrassed`, `vocab-confused`) are duplicated into both story folders — that's intentional.
- All content JSON image refs point at `.webp`. If you add new art, match the filename the JSON expects (or update the JSON) and it resolves automatically.
- Character art (Dan, Daria, Ms. Lopez, and pose variants) for UI/screens lives in `src/assets/` (separate from per-story art).

---

## 4. Audio & voice — current status (read carefully)

**Today, audio = browser Text-to-Speech**, implemented in `src/services/tts.ts` using the Web Speech API (`SpeechSynthesis`). It picks a child-friendly device voice (prefers Samantha/Victoria/Zira/Google US English), speed configurable per child (slow 0.6 / normal 0.85 / fast 1.1) via Settings (`ttsSpeed`).

**Where voice plays** — five phases call `speak()`:
`StorySlidesPhase` (reads each slide's `text`), `ComprehensionPhase`, `VocabularyIntroPhase`, `SentenceBuilderPhase`, `PhonologicalPhase`.

**The spoken scripts are already authored in the JSON:** slide `text`, plus vocab `intro_narration` and per-slide `narration`. So *what* is said is content; it's just read by a synthetic voice.

### ⚠️ There are NO Dan & Daria character voices yet
- **Zero recorded/generated audio files in the repo.** It is one generic device voice acting as a narrator — Dan and Daria do **not** speak in their own voices anywhere.
- This is an **unbuilt feature** (aligns with the still-open "voice cloning" decision from the April 25 meeting). An agent must not assume character voice-acting exists.

### To add real Dan & Daria voices (future work)
1. Choose voices — cloned/actor voices or a premium cloud TTS with 2+ distinct voices (e.g., ElevenLabs), one for Dan, one for Daria, one narrator.
2. Decide generate-ahead (store `.mp3` clips per line in `src/assets/audio/<story-id>/`) **or** call the TTS API at runtime and cache.
3. Add an audio-player layer (swap/augment `tts.ts`) that plays the clip if present, else falls back to Web Speech.
4. Tag lines by speaker — extend the JSON (e.g., `slides[].speaker: "dan" | "daria" | "narrator"`) so the right voice reads the right line.

Until that's built, keep the Web Speech TTS path as-is (it works and is free).

---

## 5. Guardrails for the next agent
- Content (text, questions, order) = the JSON. Images = `resolveStoryImage`. Don't hardcode either.
- Don't reorder `PHASE_ORDER` or the slide `position` logic without intent.
- Audio is Web Speech TTS; character voices are future — don't fake or assume them.
- Preserve `checkpoint.ts` resume and `stories.ts` level-unlock logic.
