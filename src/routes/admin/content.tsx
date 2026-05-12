/* ─────────────────────────────────────────────
 * Admin — Content Import
 * Validates story JSON and previews content
 * before importing to Supabase (when connected).
 * ───────────────────────────────────────────── */

import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import type { StoryData } from "@/types/story";

export const Route = createFileRoute("/admin/content")({
  component: AdminContent,
});

interface ValidationError {
  field: string;
  message: string;
}

function validateStoryData(data: unknown): { valid: boolean; errors: ValidationError[]; story?: StoryData } {
  const errors: ValidationError[] = [];

  if (!data || typeof data !== "object") {
    errors.push({ field: "root", message: "JSON must be an object" });
    return { valid: false, errors };
  }

  const d = data as Record<string, unknown>;

  // Required string fields
  const requiredStrings = ["id", "title", "theme", "target_connective"];
  for (const f of requiredStrings) {
    if (!d[f] || typeof d[f] !== "string") {
      errors.push({ field: f, message: `"${f}" is required and must be a string` });
    }
  }

  // Required number
  if (typeof d.level !== "number" || d.level < 1) {
    errors.push({ field: "level", message: '"level" must be a positive number' });
  }

  // Slides
  if (!Array.isArray(d.slides) || d.slides.length === 0) {
    errors.push({ field: "slides", message: '"slides" must be a non-empty array' });
  } else {
    d.slides.forEach((slide: any, i: number) => {
      if (!slide.text) errors.push({ field: `slides[${i}].text`, message: "Slide text is required" });
      if (!slide.story_element) errors.push({ field: `slides[${i}].story_element`, message: "story_element is required" });
    });
  }

  // Comprehension questions
  if (!Array.isArray(d.comprehension_questions)) {
    errors.push({ field: "comprehension_questions", message: "Must be an array" });
  } else {
    d.comprehension_questions.forEach((q: any, i: number) => {
      if (!q.prompt) errors.push({ field: `comprehension_questions[${i}].prompt`, message: "prompt required" });
      if (!Array.isArray(q.options) || q.options.length < 2) {
        errors.push({ field: `comprehension_questions[${i}].options`, message: "At least 2 options required" });
      } else {
        const hasCorrect = q.options.some((o: any) => o.correct === true);
        if (!hasCorrect) errors.push({ field: `comprehension_questions[${i}].options`, message: "At least one option must be correct" });
      }
      if (!q.brain_check_correct) errors.push({ field: `comprehension_questions[${i}].brain_check_correct`, message: "brain_check_correct required" });
      if (!q.brain_check_wrong) errors.push({ field: `comprehension_questions[${i}].brain_check_wrong`, message: "brain_check_wrong required" });
    });
  }

  // Vocabulary words
  if (!Array.isArray(d.vocabulary_words)) {
    errors.push({ field: "vocabulary_words", message: "Must be an array" });
  } else {
    d.vocabulary_words.forEach((w: any, i: number) => {
      if (!w.word) errors.push({ field: `vocabulary_words[${i}].word`, message: "word required" });
      if (!w.sfa || typeof w.sfa !== "object") {
        errors.push({ field: `vocabulary_words[${i}].sfa`, message: "SFA features object required" });
      } else {
        const sfaKeys = ["category", "function", "appearance", "parts", "location"];
        for (const k of sfaKeys) {
          if (!w.sfa[k]) errors.push({ field: `vocabulary_words[${i}].sfa.${k}`, message: `SFA "${k}" required` });
        }
      }
      if (!Array.isArray(w.quiz_questions) || w.quiz_questions.length < 1) {
        errors.push({ field: `vocabulary_words[${i}].quiz_questions`, message: "At least 1 quiz question required" });
      }
    });
  }

  // Sentence frames
  if (!Array.isArray(d.sentence_frames)) {
    errors.push({ field: "sentence_frames", message: "Must be an array" });
  } else {
    d.sentence_frames.forEach((f: any, i: number) => {
      if (!f.frame_text) errors.push({ field: `sentence_frames[${i}].frame_text`, message: "frame_text required" });
      if (!Array.isArray(f.choices) || f.choices.length < 2) {
        errors.push({ field: `sentence_frames[${i}].choices`, message: "At least 2 choices required" });
      }
    });
  }

  // Sequencing frames
  if (!Array.isArray(d.sequencing_frames)) {
    errors.push({ field: "sequencing_frames", message: "Must be an array" });
  } else if (d.sequencing_frames.length < 3) {
    errors.push({ field: "sequencing_frames", message: "At least 3 sequencing frames required" });
  }

  // Joke
  if (!d.joke || typeof d.joke !== "object") {
    errors.push({ field: "joke", message: "joke object required" });
  }

  // Personal connection
  if (!d.personal_connection || typeof d.personal_connection !== "object") {
    errors.push({ field: "personal_connection", message: "personal_connection required" });
  }

  // Retell prompts
  if (!d.retell_prompts || typeof d.retell_prompts !== "object") {
    errors.push({ field: "retell_prompts", message: "retell_prompts required" });
  }

  return {
    valid: errors.length === 0,
    errors,
    story: errors.length === 0 ? (data as StoryData) : undefined,
  };
}

function AdminContent() {
  const [jsonText, setJsonText] = useState("");
  const [result, setResult] = useState<{ valid: boolean; errors: ValidationError[]; story?: StoryData } | null>(null);
  const [imported, setImported] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleValidate() {
    try {
      const parsed = JSON.parse(jsonText);
      const validation = validateStoryData(parsed);
      setResult(validation);
      setImported(false);
    } catch (e) {
      setResult({ valid: false, errors: [{ field: "JSON", message: `Invalid JSON: ${(e as Error).message}` }] });
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setJsonText(ev.target?.result as string);
    };
    reader.readAsText(file);
  }

  function handleImport() {
    if (!result?.story) return;
    // TODO: Upsert to Supabase when connected
    // For now, just mark as imported
    setImported(true);
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Story Content Import</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Paste or upload a story JSON file to validate and import into the database.
          </p>
        </div>

        {/* File upload */}
        <div className="mb-4">
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/80 transition-colors"
          >
            Upload JSON file
          </button>
        </div>

        {/* JSON textarea */}
        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          placeholder='Paste story JSON here...'
          className="w-full h-64 rounded-xl border-2 border-muted bg-card p-4 font-mono text-sm text-foreground focus:border-primary focus:outline-none resize-y"
        />

        {/* Validate button */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleValidate}
            disabled={!jsonText.trim()}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            Validate
          </button>
          {result?.valid && (
            <button
              onClick={handleImport}
              disabled={imported}
              className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {imported ? "Imported ✓" : "Import to Database"}
            </button>
          )}
        </div>

        {/* Validation results */}
        {result && (
          <div className="mt-6">
            {result.valid ? (
              <div className="rounded-xl border-2 border-green-500 bg-green-50 p-5">
                <h2 className="text-lg font-bold text-green-800 flex items-center gap-2">
                  <span>✅</span> Valid Story JSON
                </h2>
                {result.story && (
                  <div className="mt-4 space-y-2 text-sm text-green-900">
                    <p><strong>ID:</strong> {result.story.id}</p>
                    <p><strong>Title:</strong> {result.story.title}</p>
                    <p><strong>Level:</strong> {result.story.level}</p>
                    <p><strong>Theme:</strong> {result.story.theme}</p>
                    <p><strong>Target connective:</strong> {result.story.target_connective}</p>
                    <p><strong>Slides:</strong> {result.story.slides.length}</p>
                    <p><strong>Comprehension questions:</strong> {result.story.comprehension_questions.length}</p>
                    <p><strong>Vocabulary words:</strong> {result.story.vocabulary_words.length}
                      {result.story.vocabulary_words.map((w) => ` (${w.word})`).join("")}
                    </p>
                    <p><strong>Vocab quiz questions:</strong> {result.story.vocabulary_words.reduce((sum, w) => sum + w.quiz_questions.length, 0)} total</p>
                    <p><strong>Sentence frames:</strong> {result.story.sentence_frames.length}</p>
                    <p><strong>Sequencing frames:</strong> {result.story.sequencing_frames.length}</p>
                    <p><strong>Phonological items:</strong> {result.story.phonological_items.length}</p>
                    <p><strong>Joke word:</strong> {result.story.joke.word}</p>
                  </div>
                )}
                {imported && (
                  <div className="mt-3 rounded-lg bg-green-200 p-3 text-sm font-semibold text-green-900">
                    Story imported successfully! (Supabase import will be available once connected.)
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl border-2 border-red-400 bg-red-50 p-5">
                <h2 className="text-lg font-bold text-red-800 flex items-center gap-2">
                  <span>❌</span> Validation Errors ({result.errors.length})
                </h2>
                <ul className="mt-3 space-y-1.5">
                  {result.errors.map((err, i) => (
                    <li key={i} className="text-sm text-red-700">
                      <span className="font-mono font-bold">{err.field}</span>: {err.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
