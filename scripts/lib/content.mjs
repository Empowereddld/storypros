import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export function normalize(text) {
  return text.trim().replace(/\s+/g, " ");
}

export function hashText(text) {
  return crypto.createHash("sha1").update(text, "utf8").digest("hex").slice(0, 16);
}

/** Extract every spoken line from content/*.json for the given scope ("slides" | "all"). */
export function collectLines(contentDir, scope) {
  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".json"));
  const lines = [];

  const push = (text, source) => {
    if (text) lines.push({ text, source });
  };

  for (const file of files) {
    const storyId = file.replace(/\.json$/, "");
    const story = JSON.parse(fs.readFileSync(path.join(contentDir, file), "utf8"));

    for (const slide of story.slides ?? []) {
      push(slide.text, `${storyId}/slide-${slide.position}/text`);
    }

    if (scope === "all") {
      for (const q of story.comprehension_questions ?? []) {
        push(q.prompt, `${storyId}/comprehension-${q.position}/prompt`);
      }

      story.vocabulary_words?.forEach((word, wi) => {
        const teach = word.sfa_teaching;
        if (teach) {
          push(teach.intro_narration, `${storyId}/vocab-${wi + 1}/intro_narration`);
          teach.slides?.forEach((slide, si) => {
            push(slide.narration, `${storyId}/vocab-${wi + 1}/teach-slide-${si + 1}/narration`);
          });
        }
        word.quiz_questions?.forEach((q) => {
          push(q.prompt, `${storyId}/vocab-${wi + 1}/quiz-${q.position}/prompt`);
        });
      });

      for (const frame of story.sentence_frames ?? []) {
        // Must match SentenceBuilderPhase's handleListenFrame() exactly: it speaks
        // frame_text.replace("___", "blank"), never the raw "___" placeholder — sending
        // the literal underscores to TTS causes the model to hallucinate filler words.
        push(frame.frame_text?.replace("___", "blank"), `${storyId}/sentence-${frame.position}/frame_text`);
      }

      for (const item of story.phonological_items ?? []) {
        push(item.prompt, `${storyId}/phonological/prompt`);
      }

      push(story.joke?.joke_text, `${storyId}/joke/joke_text`);
      push(story.personal_connection?.prompt, `${storyId}/personal_connection/prompt`);
      push(story.retell_prompts?.immediate, `${storyId}/retell/immediate`);
      push(story.retell_prompts?.delayed, `${storyId}/retell/delayed`);
    }
  }

  return lines;
}

/** Collapse raw {text, source} lines into a Map<id, {text, sources[]}> keyed by content hash. */
export function groupById(rawLines) {
  const byId = new Map();
  for (const { text, source } of rawLines) {
    const normalized = normalize(text);
    if (!normalized) continue;
    const id = hashText(normalized);
    if (!byId.has(id)) byId.set(id, { text: normalized, sources: [source] });
    else byId.get(id).sources.push(source);
  }
  return byId;
}
