import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { PhoneFrame } from "@/components/empowered/PhoneFrame";
import {
  AuthBackdrop,
  MiniPlane,
  Star,
  StoryProsLogo,
} from "@/components/empowered/StoryProsBrand";
import { BookIcon } from "@/components/empowered/StoryProsUi";
import { TactileButton } from "@/components/empowered/TactileButton";
import type { StoryData } from "@/types/story";

export const Route = createFileRoute("/admin/content")({
  component: AdminContent,
});

interface ValidationError {
  field: string;
  message: string;
}

function validateStoryData(data: unknown): {
  valid: boolean;
  errors: ValidationError[];
  story?: StoryData;
} {
  const errors: ValidationError[] = [];

  if (!data || typeof data !== "object") {
    errors.push({ field: "root", message: "JSON must be an object" });
    return { valid: false, errors };
  }

  const d = data as Record<string, unknown>;

  const requiredStrings = ["id", "title", "theme", "target_connective"];
  for (const field of requiredStrings) {
    if (!d[field] || typeof d[field] !== "string") {
      errors.push({ field, message: `"${field}" is required and must be a string` });
    }
  }

  if (typeof d.level !== "number" || d.level < 1) {
    errors.push({ field: "level", message: '"level" must be a positive number' });
  }

  if (!Array.isArray(d.slides) || d.slides.length === 0) {
    errors.push({ field: "slides", message: '"slides" must be a non-empty array' });
  } else {
    d.slides.forEach((slide, index) => {
      if (!slide.text) {
        errors.push({ field: `slides[${index}].text`, message: "Slide text is required" });
      }
      if (!slide.story_element) {
        errors.push({
          field: `slides[${index}].story_element`,
          message: "story_element is required",
        });
      }
    });
  }

  if (!Array.isArray(d.comprehension_questions)) {
    errors.push({ field: "comprehension_questions", message: "Must be an array" });
  } else {
    d.comprehension_questions.forEach((question, index) => {
      if (!question.prompt) {
        errors.push({
          field: `comprehension_questions[${index}].prompt`,
          message: "prompt required",
        });
      }
      if (!Array.isArray(question.options) || question.options.length < 2) {
        errors.push({
          field: `comprehension_questions[${index}].options`,
          message: "At least 2 options required",
        });
      } else {
        const hasCorrect = question.options.some((option: { correct?: boolean }) => option.correct === true);
        if (!hasCorrect) {
          errors.push({
            field: `comprehension_questions[${index}].options`,
            message: "At least one option must be correct",
          });
        }
      }
      if (!question.brain_check_correct) {
        errors.push({
          field: `comprehension_questions[${index}].brain_check_correct`,
          message: "brain_check_correct required",
        });
      }
      if (!question.brain_check_wrong) {
        errors.push({
          field: `comprehension_questions[${index}].brain_check_wrong`,
          message: "brain_check_wrong required",
        });
      }
    });
  }

  if (!Array.isArray(d.vocabulary_words)) {
    errors.push({ field: "vocabulary_words", message: "Must be an array" });
  } else {
    d.vocabulary_words.forEach((word, index) => {
      if (!word.word) {
        errors.push({ field: `vocabulary_words[${index}].word`, message: "word required" });
      }
      if (!word.sfa || typeof word.sfa !== "object") {
        errors.push({
          field: `vocabulary_words[${index}].sfa`,
          message: "SFA features object required",
        });
      } else {
        const sfa = word.sfa as Record<string, unknown>;
        const sfaKeys = ["category", "function", "appearance", "parts", "location"];
        for (const key of sfaKeys) {
          if (!sfa[key]) {
            errors.push({
              field: `vocabulary_words[${index}].sfa.${key}`,
              message: `SFA "${key}" required`,
            });
          }
        }
      }
      if (!Array.isArray(word.quiz_questions) || word.quiz_questions.length < 1) {
        errors.push({
          field: `vocabulary_words[${index}].quiz_questions`,
          message: "At least 1 quiz question required",
        });
      }
    });
  }

  if (!Array.isArray(d.sentence_frames)) {
    errors.push({ field: "sentence_frames", message: "Must be an array" });
  } else {
    d.sentence_frames.forEach((frame, index) => {
      if (!frame.frame_text) {
        errors.push({
          field: `sentence_frames[${index}].frame_text`,
          message: "frame_text required",
        });
      }
      if (!Array.isArray(frame.choices) || frame.choices.length < 2) {
        errors.push({
          field: `sentence_frames[${index}].choices`,
          message: "At least 2 choices required",
        });
      }
    });
  }

  if (!Array.isArray(d.sequencing_frames)) {
    errors.push({ field: "sequencing_frames", message: "Must be an array" });
  } else if (d.sequencing_frames.length < 3) {
    errors.push({ field: "sequencing_frames", message: "At least 3 sequencing frames required" });
  }

  if (!d.joke || typeof d.joke !== "object") {
    errors.push({ field: "joke", message: "joke object required" });
  }

  if (!d.personal_connection || typeof d.personal_connection !== "object") {
    errors.push({ field: "personal_connection", message: "personal_connection required" });
  }

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
  const [result, setResult] = useState<{
    valid: boolean;
    errors: ValidationError[];
    story?: StoryData;
  } | null>(null);
  const [imported, setImported] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleValidate() {
    try {
      const parsed = JSON.parse(jsonText);
      const validation = validateStoryData(parsed);
      setResult(validation);
      setImported(false);
    } catch (error) {
      setResult({
        valid: false,
        errors: [
          {
            field: "JSON",
            message: `Invalid JSON: ${(error as Error).message}`,
          },
        ],
      });
    }
  }

  function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      setJsonText(readerEvent.target?.result as string);
    };
    reader.readAsText(file);
  }

  function handleImport() {
    if (!result?.story) return;
    setImported(true);
  }

  return (
    <PhoneFrame>
      <div className="relative flex h-full flex-col overflow-hidden bg-background">
        <AuthBackdrop />
        <Star className="absolute left-8 top-28 z-10 h-4 w-4 text-secondary animate-sparkle" />
        <MiniPlane className="absolute right-10 top-24 z-10 h-8 w-8 rotate-12 text-secondary animate-float" />

        <header className="relative z-20 flex items-center justify-center px-5 pb-2 pt-4">
          <StoryProsLogo layout="row" size="md" className="scale-90" />
        </header>

        <main className="relative z-10 flex-1 overflow-y-auto no-scrollbar px-4 pb-8 pt-2">
          <section className="animate-slide-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-xs font-extrabold text-primary shadow-card">
              <BookIcon className="h-4 w-4" />
              Admin Tool
            </span>
            <h1 className="mt-3 text-[36px] font-extrabold leading-none text-primary">
              Story Content Import
            </h1>
            <p className="mt-2 text-base font-semibold leading-snug text-ink-soft">
              Paste or upload story JSON to validate content before database import.
            </p>
          </section>

          <section className="mt-5 rounded-[30px] bg-card p-4 shadow-soft animate-slide-up">
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="press-pop flex w-full items-center justify-between rounded-[24px] border-2 border-dashed border-primary/35 bg-background/70 p-4 text-left shadow-card"
            >
              <span>
                <span className="block text-base font-extrabold text-primary">
                  Upload JSON File
                </span>
                <span className="mt-1 block text-xs font-semibold text-ink-soft">
                  Choose a local .json story file.
                </span>
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-primary">
                <UploadIcon />
              </span>
            </button>

            <label className="mt-4 block text-xs font-extrabold uppercase tracking-wide text-primary">
              Story JSON
            </label>
            <textarea
              value={jsonText}
              onChange={(event) => setJsonText(event.target.value)}
              placeholder="Paste story JSON here..."
              className="mt-2 h-72 w-full resize-y rounded-[24px] border-2 border-accent/70 bg-background/80 p-4 font-mono text-xs leading-relaxed text-ink placeholder:text-ink-soft/45 focus:border-primary focus:outline-none"
            />

            <div className="mt-4 space-y-3">
              <TactileButton
                onClick={handleValidate}
                disabled={!jsonText.trim()}
                leadingIcon={<CheckCircleIcon />}
              >
                Validate JSON
              </TactileButton>
              {result?.valid && (
                <TactileButton
                  variant="secondary"
                  onClick={handleImport}
                  disabled={imported}
                  leadingIcon={<DatabaseIcon />}
                >
                  {imported ? "Imported" : "Import to Database"}
                </TactileButton>
              )}
            </div>
          </section>

          {result && (
            <section className="mt-5 animate-slide-up">
              {result.valid ? (
                <ValidResult story={result.story} imported={imported} />
              ) : (
                <InvalidResult errors={result.errors} />
              )}
            </section>
          )}
        </main>
      </div>
    </PhoneFrame>
  );
}

function ValidResult({ story, imported }: { story?: StoryData; imported: boolean }) {
  return (
    <div className="rounded-[28px] border-2 border-success/40 bg-card p-4 shadow-card">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircleIcon />
        </span>
        <div>
          <h2 className="text-xl font-extrabold text-success">Valid Story JSON</h2>
          <p className="text-xs font-semibold text-ink-soft">Ready for import review.</p>
        </div>
      </div>

      {story && (
        <div className="mt-4 space-y-2">
          <SummaryRow label="ID" value={story.id} />
          <SummaryRow label="Title" value={story.title} />
          <SummaryRow label="Level" value={story.level} />
          <SummaryRow label="Theme" value={story.theme} />
          <SummaryRow label="Target connective" value={story.target_connective} />
          <SummaryRow label="Slides" value={story.slides.length} />
          <SummaryRow
            label="Comprehension"
            value={`${story.comprehension_questions.length} questions`}
          />
          <SummaryRow
            label="Vocabulary"
            value={`${story.vocabulary_words.length}${story.vocabulary_words
              .map((word) => ` (${word.word})`)
              .join("")}`}
          />
          <SummaryRow
            label="Vocab quiz"
            value={`${story.vocabulary_words.reduce(
              (sum, word) => sum + word.quiz_questions.length,
              0,
            )} total`}
          />
          <SummaryRow label="Sentence frames" value={story.sentence_frames.length} />
          <SummaryRow label="Sequencing frames" value={story.sequencing_frames.length} />
          <SummaryRow label="Phonological items" value={story.phonological_items.length} />
          <SummaryRow label="Joke word" value={story.joke.word} />
        </div>
      )}

      {imported && (
        <div className="mt-4 rounded-[20px] bg-success/15 p-3 text-sm font-extrabold text-success">
          Story imported successfully. Supabase import will be available once connected.
        </div>
      )}
    </div>
  );
}

function InvalidResult({ errors }: { errors: ValidationError[] }) {
  return (
    <div className="rounded-[28px] border-2 border-destructive/35 bg-card p-4 shadow-card">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <AlertIcon />
        </span>
        <div>
          <h2 className="text-xl font-extrabold text-destructive">
            Validation Errors ({errors.length})
          </h2>
          <p className="text-xs font-semibold text-ink-soft">Fix these fields and try again.</p>
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {errors.map((error, index) => (
          <li key={`${error.field}-${index}`} className="rounded-[18px] bg-background/80 p-3">
            <p className="font-mono text-xs font-extrabold text-destructive">{error.field}</p>
            <p className="mt-1 text-sm font-semibold leading-snug text-ink-soft">{error.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-[18px] bg-background/75 px-3 py-2">
      <span className="text-xs font-extrabold uppercase tracking-wide text-primary">{label}</span>
      <span className="min-w-0 text-right text-sm font-bold text-ink">{value}</span>
    </div>
  );
}

function UploadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden
    >
      <path d="M12 16V5" strokeLinecap="round" />
      <path d="M7 10l5-5 5 5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 19h14" strokeLinecap="round" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l2.5 2.5L16 9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden
    >
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
      <path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden
    >
      <path d="M12 8v5" strokeLinecap="round" />
      <path d="M12 17h.01" strokeLinecap="round" />
      <path d="M10.3 4.6L2.8 18a2 2 0 001.7 3h15a2 2 0 001.7-3L13.7 4.6a2 2 0 00-3.4 0z" />
    </svg>
  );
}
