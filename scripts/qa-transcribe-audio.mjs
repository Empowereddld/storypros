#!/usr/bin/env node
// QA pass for generated narrator clips: transcribes every .mp3 in src/assets/audio
// with ElevenLabs Speech-to-Text (Scribe) and diffs the transcript against the
// original source line, flagging anything that doesn't match closely — wrong
// words, dropped/garbled audio, or a mispronunciation bad enough to confuse STT.
// Run this after a generation pass, before committing the clips.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadApiKey } from "./lib/env.mjs";
import { collectLines, groupById, normalize } from "./lib/content.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");
const AUDIO_DIR = path.join(ROOT, "src", "assets", "audio");
const REPORT_PATH = path.join(ROOT, "audio-qa-report.json");

const STT_MODEL_ID = "scribe_v1";
const WER_FLAG_THRESHOLD = 0.2; // flag if >20% of words differ from the source line

function normalizeForCompare(text) {
  return normalize(text)
    .toLowerCase()
    .replace(/-/g, " ") // "grown-up" vs "grown up" shouldn't count as a mismatch
    .replace(/[.,!?;:"'’‘“”]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function wordEditDistance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

function wordErrorRate(original, transcript) {
  const a = normalizeForCompare(original).split(" ").filter(Boolean);
  const b = normalizeForCompare(transcript).split(" ").filter(Boolean);
  if (a.length === 0) return 0;
  return wordEditDistance(a, b) / a.length;
}

async function transcribeClip(filePath, apiKey) {
  const buffer = fs.readFileSync(filePath);
  const form = new FormData();
  form.append("file", new Blob([buffer], { type: "audio/mpeg" }), path.basename(filePath));
  form.append("model_id", STT_MODEL_ID);

  const res = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
    method: "POST",
    headers: { "xi-api-key": apiKey },
    body: form,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`STT failed (${res.status}): ${body.slice(0, 300)}`);
  }

  const data = await res.json();
  return data.text ?? "";
}

async function main() {
  const apiKey = loadApiKey(ROOT);
  if (!apiKey) {
    console.error(
      "No ElevenLabs API key found. Set ELEVENLABS_API_KEY, or place it in a gitignored " +
        "repo-root .env.local, or in the external Voice Generations .env.",
    );
    process.exit(1);
  }

  // Build the full id -> source-text lookup (scope "all" is a superset of "slides").
  const byId = groupById(collectLines(CONTENT_DIR, "all"));

  const onlyArgIndex = process.argv.indexOf("--only");
  const onlyIds =
    onlyArgIndex !== -1 ? new Set(process.argv[onlyArgIndex + 1].split(",").map((s) => s.trim())) : null;

  let files = fs.readdirSync(AUDIO_DIR).filter((f) => f.endsWith(".mp3"));
  if (onlyIds) files = files.filter((f) => onlyIds.has(f.replace(/\.mp3$/, "")));
  console.log(`Clips on disk: ${files.length}${onlyIds ? ` (filtered to ${onlyIds.size} requested ids)` : ""}`);

  const results = [];
  let flagged = 0;
  let missingText = 0;
  let failed = 0;

  for (const [i, file] of files.entries()) {
    const id = file.replace(/\.mp3$/, "");
    const entry = byId.get(id);
    if (!entry) {
      missingText++;
      console.warn(`SKIP ${id}: no matching source line found (stale/renamed content?)`);
      continue;
    }

    try {
      const transcript = await transcribeClip(path.join(AUDIO_DIR, file), apiKey);
      const wer = wordErrorRate(entry.text, transcript);
      const isFlagged = wer > WER_FLAG_THRESHOLD;
      if (isFlagged) flagged++;

      console.log(
        `[${i + 1}/${files.length}] ${isFlagged ? "FLAG" : "ok"} ${id} wer=${wer.toFixed(2)} ` +
          `[${entry.sources[0]}]`,
      );
      if (isFlagged) {
        console.log(`    source:     "${entry.text}"`);
        console.log(`    transcript: "${transcript}"`);
      }

      results.push({
        id,
        sources: entry.sources,
        source_text: entry.text,
        transcript,
        wer,
        flagged: isFlagged,
      });
    } catch (err) {
      failed++;
      console.error(`FAILED ${id} [${entry.sources[0]}]: ${err.message}`);
      results.push({
        id,
        sources: entry.sources,
        source_text: entry.text,
        error: err.message,
        flagged: true,
      });
    }
  }

  // Merge into any existing report (so a --only re-check updates just those entries
  // instead of clobbering results already recorded for the rest of the clips).
  let merged = new Map(results.map((r) => [r.id, r]));
  if (fs.existsSync(REPORT_PATH)) {
    const prior = JSON.parse(fs.readFileSync(REPORT_PATH, "utf8"));
    for (const r of prior.results ?? []) {
      if (!merged.has(r.id)) merged.set(r.id, r);
    }
  }
  const allResults = [...merged.values()].sort((a, b) => (b.wer ?? 1) - (a.wer ?? 1));

  fs.writeFileSync(
    REPORT_PATH,
    JSON.stringify(
      {
        threshold: WER_FLAG_THRESHOLD,
        checked: allResults.length,
        flagged: allResults.filter((r) => r.flagged).length,
        results: allResults,
      },
      null,
      2,
    ),
  );

  console.log("---");
  console.log(`Checked this run: ${results.length}`);
  console.log(`Flagged this run: ${flagged}`);
  if (missingText) console.log(`Clips with no matching source line: ${missingText}`);
  if (failed) console.log(`STT failures: ${failed}`);
  console.log(`Full report (${allResults.length} total): ${REPORT_PATH}`);

  if (flagged || failed) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
