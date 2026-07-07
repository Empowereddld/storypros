#!/usr/bin/env node
// Generates ElevenLabs narrator audio clips for story-content spoken lines.
// Content-hash addressed: each generated file is named `<sha1(normalized text)>.mp3`
// so re-running the script only fills in missing/new lines and never re-generates
// (or duplicates) a line that already has audio, even if it repeats across stories.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadApiKey } from "./lib/env.mjs";
import { collectLines, groupById } from "./lib/content.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");
const AUDIO_DIR = path.join(ROOT, "src", "assets", "audio");

const DEFAULT_VOICE_ID = "HLA4lZpsFIFy14jAVh7T";
const MODEL_ID = "eleven_multilingual_v2";
const OUTPUT_FORMAT = "mp3_44100_128";

// Every generated clip is mirrored here too, so all ElevenLabs voice generations
// live together outside the repo (this app's clips plus any future voice work).
const EXTERNAL_AUDIO_DIR = path.join(
  "C:\\Users\\Rovonn\\OneDrive\\Desktop\\Empowered Work\\Children Development App\\Voice Generations",
  "narrator-audio",
);

async function generateClip(text, apiKey, voiceId) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=${OUTPUT_FORMAT}`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({ text, model_id: MODEL_ID }),
    });

    if (res.ok) return Buffer.from(await res.arrayBuffer());

    if (res.status === 429 && attempt < 3) {
      await new Promise((r) => setTimeout(r, 1500 * attempt));
      continue;
    }

    const body = await res.text().catch(() => "");
    throw new Error(`ElevenLabs TTS failed (${res.status}): ${body.slice(0, 300)}`);
  }
}

async function main() {
  const scopeArgIndex = process.argv.indexOf("--scope");
  const scope = scopeArgIndex !== -1 ? process.argv[scopeArgIndex + 1] : "slides";
  if (!["slides", "all"].includes(scope)) {
    console.error(`Unknown --scope "${scope}". Use "slides" or "all".`);
    process.exit(1);
  }

  const apiKey = loadApiKey(ROOT);
  if (!apiKey) {
    console.error(
      "No ElevenLabs API key found. Set ELEVENLABS_API_KEY, or place it in a gitignored " +
        "repo-root .env.local, or in the external Voice Generations .env.",
    );
    process.exit(1);
  }
  const voiceId = process.env.ELEVENLABS_VOICE_NARRATOR || DEFAULT_VOICE_ID;

  fs.mkdirSync(AUDIO_DIR, { recursive: true });
  fs.mkdirSync(EXTERNAL_AUDIO_DIR, { recursive: true });

  // Backfill: mirror any clip that already exists in the repo but not yet externally
  // (covers clips generated before the external mirror existed).
  let backfilled = 0;
  for (const file of fs.readdirSync(AUDIO_DIR)) {
    if (!file.endsWith(".mp3")) continue;
    const externalPath = path.join(EXTERNAL_AUDIO_DIR, file);
    if (!fs.existsSync(externalPath)) {
      fs.copyFileSync(path.join(AUDIO_DIR, file), externalPath);
      backfilled++;
    }
  }
  if (backfilled) console.log(`Mirrored ${backfilled} existing clip(s) to ${EXTERNAL_AUDIO_DIR}`);

  const rawLines = collectLines(CONTENT_DIR, scope);
  const byId = groupById(rawLines);

  console.log(`Scope: ${scope}`);
  console.log(`Voice: ${voiceId}`);
  console.log(`Lines collected: ${rawLines.length}`);
  console.log(`Unique clips: ${byId.size}`);
  console.log("---");

  let generated = 0;
  let skipped = 0;
  let failed = 0;
  let generatedChars = 0;
  let skippedChars = 0;

  for (const [id, { text, sources }] of byId) {
    const outPath = path.join(AUDIO_DIR, `${id}.mp3`);
    if (fs.existsSync(outPath)) {
      skipped++;
      skippedChars += text.length;
      continue;
    }

    try {
      console.log(`generating ${id} (${text.length} chars) [${sources[0]}]`);
      const buffer = await generateClip(text, apiKey, voiceId);
      fs.writeFileSync(outPath, buffer);
      fs.writeFileSync(path.join(EXTERNAL_AUDIO_DIR, `${id}.mp3`), buffer);
      generated++;
      generatedChars += text.length;
    } catch (err) {
      failed++;
      console.error(`FAILED ${id} [${sources[0]}]: ${err.message}`);
    }
  }

  console.log("---");
  console.log(`Generated: ${generated} clips (${generatedChars} chars)`);
  console.log(`Skipped (already exist): ${skipped} clips (${skippedChars} chars)`);
  if (failed) console.log(`Failed: ${failed} clips`);
  console.log(`Total unique clips: ${byId.size}`);

  if (failed) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
