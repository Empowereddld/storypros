# ElevenLabs Voice Generation Plan

This plan turns the existing Story Pros story scripts into generated audio assets while preserving the current story JSON, route flow, checkpoint logic, and Web Speech fallback.

## Current Status

- Story images are complete for all 11 stories.
- Asset validation found 187 story image references and 0 missing files.
- The app currently uses browser Text-to-Speech from `src/services/tts.ts`.
- No ElevenLabs audio files are stored or wired yet.
- No `ELEVENLABS_API_KEY` / `XI_API_KEY` is currently available in the local environment.
- No ElevenLabs MCP connector is available in this Codex session; use ElevenLabs HTTP API or SDK from local scripts.

## Voice Inputs Needed

Add these locally as environment variables or a private `.env.local` file that is never committed:

```bash
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_NARRATOR=...
ELEVENLABS_VOICE_DAN=...
ELEVENLABS_VOICE_DARIA=...
```

If the voice IDs are unknown, use the ElevenLabs voices endpoint with the API key to list the custom voices in the account, then map the correct IDs to Dan, Daria, and Narrator.

## Recommended Voice Roles

- `narrator`: story slides, sequencing captions, vocabulary teaching, sentence frames, phonological prompts, jokes, and personal connection prompts.
- `daria`: child-facing coaching, comprehension feedback, retell prompts, and friendly guide lines.
- `dan`: reserve for future direct Dan dialogue or story lines explicitly tagged as Dan.

Important: the current JSON does not have `speaker` metadata per line. Most current lines are narrator-style third-person text, so Phase 1 should generate everything with `narrator` / `daria` rules above. A later content pass can add explicit `speaker` tags if true character acting is needed.

## Audio Inventory

Candidate generated lines from the 11 story JSON files:

| Category | Count |
| --- | ---: |
| Story slide narration | 66 |
| Comprehension question prompts | 66 |
| Comprehension feedback, correct/wrong | 132 |
| Sequencing captions | 66 |
| Immediate/delayed retell prompts | 22 |
| Vocabulary intro narration | 22 |
| Vocabulary SFA teaching narration | 110 |
| Vocabulary connection narration | 22 |
| Vocabulary quiz prompts | 198 |
| Sentence frames | 33 |
| Sentence brain-check prompts | 33 |
| Phonological prompts | 11 |
| Jokes | 11 |
| Personal connection prompts | 11 |
| **Total candidate audio lines** | **803** |

Each story has 73 candidate lines.

## Asset Naming

Store generated files under:

```text
src/assets/audio/<story-id>/
```

Use stable IDs so audio can be regenerated safely:

```text
slide-01.mp3
comprehension-01-prompt.mp3
comprehension-01-correct.mp3
comprehension-01-wrong.mp3
sequence-01.mp3
retell-immediate.mp3
retell-delayed.mp3
vocab-01-intro.mp3
vocab-01-category.mp3
vocab-01-function.mp3
vocab-01-appearance.mp3
vocab-01-parts.mp3
vocab-01-location.mp3
vocab-01-connection.mp3
vocab-01-quiz-01.mp3
sentence-01-frame.mp3
sentence-01-check.mp3
phonological-01-prompt.mp3
joke.mp3
personal-connection.mp3
```

Also generate a manifest:

```text
src/assets/audio/audioManifest.json
```

The manifest should map each story/phase/key to `{ text, voiceRole, file, checksum }`.

## Generation Flow

1. Create an extraction script that reads `content/story-*.json` and writes a deterministic `audioManifest.json`.
2. Create a generation script that:
   - reads the manifest,
   - skips files that already exist with the same checksum,
   - calls ElevenLabs Text to Speech per line,
   - writes `.mp3` files into `src/assets/audio/<story-id>/`,
   - logs failures and retries without corrupting completed files.
3. Do a small pilot first:
   - generate one complete story, preferably `dan-and-the-paper-cut`,
   - listen to every clip,
   - adjust voice settings, speed, stability, style, and speaker-role mapping.
4. Generate the remaining 10 stories after voice QA.
5. Add an audio playback service that:
   - plays a generated clip if it exists,
   - falls back to current browser TTS if it does not,
   - keeps the existing `ttsSpeed` behavior for fallback only.
6. Add listen controls to any story-flow phases that do not yet expose full audio coverage.

## App Wiring Phases

### Phase A - Manifest And One-Story Pilot

- Build manifest extraction.
- Generate all clips for `dan-and-the-paper-cut`.
- Wire generated slide audio first.
- Verify fallback still works when a clip is missing.

### Phase B - Full Story Audio Generation

- Generate the remaining 10 stories.
- Validate every manifest entry has a file.
- Spot-check pronunciation and pacing.

### Phase C - Full Audio UI Coverage

- Slides: already have a listen control; swap to generated clip first.
- Comprehension: add/generated audio for prompt, answer choices if desired, and brain-check feedback.
- Sequencing: add listen per caption/card.
- Retell: add listen for immediate and delayed prompts.
- Vocabulary: expand from word-only playback to intro, teaching slides, connection, and quiz prompts.
- Sentence builder: keep frame listen and add brain-check prompt if needed.
- Phonological: keep prompt listen.
- Joke and personal connection: add listen controls.
- Completion: optional celebratory coach line only if product wants it.

## API Notes

Use ElevenLabs Text to Speech for stable file generation:

```text
POST https://api.elevenlabs.io/v1/text-to-speech/:voice_id
```

Recommended output for app assets:

```text
mp3_44100_128
```

Use one request per manifest line for easy caching, QA, and replacement. Dialogue/multi-voice endpoints are useful later if full scenes become true speaker-tagged dialogue, but the current story scripts are line-based and mostly narration.

## QA Checklist

- 803 manifest entries generated or intentionally deferred.
- 0 missing story image refs.
- 0 missing audio refs after generation.
- Every generated audio button stops/starts cleanly.
- Browser TTS fallback still works.
- No mic/AI retell added.
- No story text hardcoded in components.
- `npm run build` passes.
- `npx tsc --noEmit` has only the known Tailwind Merge parser noise.
