/* ─────────────────────────────────────────────
 * Story Pros — shared type definitions
 * Every story phase component imports from here.
 * ───────────────────────────────────────────── */

// ── Story element icons used across all stories ──
export type StoryElement = "character" | "place" | "problem" | "emotion" | "action" | "result";

// ── Phase identifiers ──
export type StoryPhase =
  | "slides"
  | "overview"
  | "intro-questions"
  | "comprehension"
  | "intro-sequencing"
  | "sequencing"
  | "immediate-retell"
  | "intro-vocabulary"
  | "vocab-intro"
  | "vocab-quiz"
  | "intro-sentences"
  | "sentence-builder"
  | "intro-retell"
  | "delayed-retell"
  | "intro-phonological"
  | "phonological"
  | "intro-jokes"
  | "joke"
  | "personal-connection"
  | "story-complete";

// ── Option shape shared by comp questions, vocab quizzes, etc. ──
export interface AnswerOption {
  id: string;
  label: string;
  emoji?: string;
  text?: string;
  correct: boolean;
}

// ── Story slide ──
export interface StorySlide {
  position: number;
  text: string;
  story_element: StoryElement;
  image: string;
}

// ── Comprehension question ──
export interface ComprehensionQuestion {
  position: number;
  prompt: string;
  story_element: StoryElement;
  options: AnswerOption[];
  /** Reflection prompt shown before the answer is revealed */
  brain_check_prompt?: string;
  brain_check_correct: string;
  brain_check_wrong: string;
}

// ── Vocabulary ──
export interface SFAFeatures {
  category: string;
  function: string;
  appearance: string;
  /** Omitted for feeling words, where parts/location don't apply */
  parts?: string;
  location?: string;
}

export interface VocabQuizQuestion {
  position: number;
  prompt: string;
  options: AnswerOption[];
}

/** Per-feature teaching slide data from SFA Slide Details */
export interface SFATeachingSlide {
  feature: keyof SFAFeatures;
  prompt: string; // screen prompt ("What group is a bandage in?")
  teaching_text: string; // on-screen text ("bandage is a first aid item.")
  narration: string; // TTS audio text
}

/** Optional enriched SFA teaching flow (from Excel SFA Slide Details) */
export interface SFATeaching {
  intro_text: string; // word intro definition + context
  intro_narration: string; // TTS for intro
  slides: SFATeachingSlide[];
  transition_text: string; // "Now let's show what you know about..."
  connection_text: string; // "How does [word] connect to the story?"
  connection_narration: string;
}

export interface VocabularyWord {
  word: string;
  type: "noun" | "emotion";
  image: string;
  sfa: SFAFeatures;
  quiz_questions: VocabQuizQuestion[];
  /** Enriched SFA teaching slides (optional — falls back to simple SFA display) */
  sfa_teaching?: SFATeaching;
}

// ── Sentence builder ──
export interface SentenceFrame {
  position: number;
  frame_text: string;
  choices: AnswerOption[];
  brain_check_prompt: string;
}

// ── Sequencing ──
export interface SequencingFrame {
  correct_position: number;
  caption: string;
  image: string;
}

// ── Phonological awareness ──
export interface PhonologicalItem {
  type: "rhyme" | "initial_sound";
  prompt: string;
  options: AnswerOption[];
}

// ── Joke / multiple meaning ──
export interface JokeMeaning {
  text: string;
  image: string;
}

export interface JokeData {
  word: string;
  meaning_1: JokeMeaning;
  meaning_2: JokeMeaning;
  joke_text: string;
}

// ── Retell prompts ──
export interface RetellPrompts {
  immediate: string;
  delayed: string;
  story_elements: StoryElement[];
}

// ── Personal connection ──
export interface PersonalConnectionData {
  prompt: string;
}

// ── Complete story bundle ──
export interface StoryData {
  id: string;
  title: string;
  level: number;
  theme: string;
  /** One-line, past-tense, concrete recap shown on the home story card */
  recap?: string;
  target_connective: string;
  slides: StorySlide[];
  comprehension_questions: ComprehensionQuestion[];
  vocabulary_words: VocabularyWord[];
  sentence_frames: SentenceFrame[];
  sequencing_frames: SequencingFrame[];
  phonological_items: PhonologicalItem[];
  joke: JokeData;
  personal_connection: PersonalConnectionData;
  retell_prompts: RetellPrompts;
}

// ── Activity attempt (what gets saved per question) ──
export type ActivityType =
  | "comprehension"
  | "sequencing"
  | "vocab_quiz"
  | "sentence_builder"
  | "phonological";

export interface ActivityAttempt {
  child_id: string;
  story_id: string;
  activity_type: ActivityType;
  question_index: number;
  attempt_number: number;
  selected_option: string;
  is_correct: boolean;
  time_ms?: number;
}

// ── Skill domains (scoring) ──
export type SkillDomain =
  | "listening"
  | "story_structure"
  | "vocabulary"
  | "grammar"
  | "retell"
  | "phonological";

// ── Phase result, reported by each phase to the engine ──
export interface PhaseResult {
  phase: StoryPhase;
  attempts: ActivityAttempt[];
  first_attempt_accuracy: number;
  completed: boolean;
}

// ── Shared phase component props ──
export interface StoryPhaseProps<TData = unknown> {
  storyData: StoryData;
  onComplete: (result: PhaseResult) => void;
  onClose: () => void;
  ttsSpeed?: "slow" | "normal" | "fast";
  phaseData?: TData;
  /** The child playing this story — used on every recorded attempt */
  childId?: string;
}
