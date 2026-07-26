/* ─────────────────────────────────────────────
 * Landing page content — CLIENT-APPROVED COPY
 *
 * Wording and section order come from the approved
 * preview page. Keep edits here (not in the layout)
 * so the copy stays reviewable in one place.
 * ───────────────────────────────────────────── */

export const PRICE = "$7.99";
export const PRICE_PERIOD = "/month";
export const TRIAL_DAYS = 7;

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Pick a Story",
    body: "Choose from engaging stories designed by speech-language pathologists. Each story targets specific vocabulary and language skills.",
  },
  {
    step: "02",
    title: "Learn Through Repetition",
    body: "Target words appear 36+ times per story, which is the amount research shows kids with DLD need to truly learn new language.",
  },
  {
    step: "03",
    title: "Track Progress Together",
    body: "See exactly what your child learned today through your dashboard, with simple tips to practice at home.",
  },
];

export const DIFFERENTIATORS = [
  {
    icon: "🧩",
    title: "Builds Story Framework",
    body: "Consistent icons for character, setting, problem, feeling, action, and solution help kids understand ANY story.",
  },
  {
    icon: "💬",
    title: "Vocabulary Learning",
    body: "Semantic Feature Analysis teaches not just what words mean, but how they connect to other words.",
  },
  {
    icon: "🧠",
    title: "Metacognitive Checks",
    body: "Built-in prompts teach kids to think about their thinking: 'Did you answer the WHO question with a PERSON?'",
  },
  {
    icon: "📊",
    title: "Family Dashboard",
    body: "See exactly what your child learned today, with simple tips and conversation starters to practice at home.",
  },
];

export const PERFECT_FOR = [
  "Developmental Language Disorder (DLD)",
  "Language delays or difficulties",
  "ADHD affecting comprehension",
  "Autism with language challenges",
  "Dyslexia (listening comprehension support)",
  "Multi-language learners",
  "English language learners (ELL)",
  "Neurotypical children seeking language enrichment",
  "Children with word-finding difficulties",
  "Children seeking advanced language development",
];

export const TESTIMONIALS = [
  {
    quote:
      "We've been on a waitlist for speech therapy for 6 months. Story Pros gave us something we could do NOW. My son actually asks to do his story every day.",
    name: "Sarah M.",
    role: "Mother of a 7-year-old with DLD",
  },
  {
    quote:
      "Finally, a language app that doesn't feel like a flashcard drill! The stories keep my daughter engaged, and I love seeing her progress in the parent dashboard.",
    name: "Michael T.",
    role: "Father of two",
  },
  {
    quote:
      "As a speech-language pathologist myself, I recommend Story Pros to all my clients' families. The evidence-based approach is exactly what these kids need.",
    name: "Dr. Jennifer L.",
    role: "Speech-Language Pathologist",
  },
  {
    quote:
      "My son has ADHD and struggles with comprehension. Story Pros breaks everything down in a way he can follow. We've seen real improvement in just a few weeks.",
    name: "Rachel K.",
    role: "Parent of an 8-year-old",
  },
];

export type Cell = boolean | "partial" | "sometimes" | string;

export const COMPARISON_COLUMNS = ["Private SLP", "Speech Blubs", "Otsimo", "Story Pros"];

export const COMPARISON_ROWS: { feature: string; cells: Cell[] }[] = [
  { feature: "Monthly Cost", cells: ["$600+", "$9.99", "$6.99", PRICE] },
  { feature: "Unlimited daily practice", cells: [false, true, true, true] },
  { feature: "Story grammar framework", cells: [true, false, "sometimes", true] },
  { feature: "Deep vocabulary learning", cells: [true, false, false, true] },
  { feature: "Narrative retelling practice", cells: [true, false, false, true] },
  { feature: "Comprehension questions", cells: [true, false, false, true] },
  { feature: "Sentence building & grammar", cells: [true, false, false, true] },
  { feature: "Phonological awareness", cells: [true, true, true, true] },
  { feature: "Designed specifically for DLD", cells: [true, false, false, true] },
  { feature: "Monthly Community Zoom Meet-ups", cells: [false, false, false, true] },
  { feature: "Created by SLPs & educators", cells: [true, "partial", "partial", true] },
];

export const COMPARISON_NOTE =
  "Speech Blubs and Otsimo are excellent apps for articulation and sound production. Story Pros focuses on language comprehension, vocabulary, and narrative skills—essential for children with DLD.";

export const PRICING_FEATURES = [
  "Unlimited stories",
  "Progress tracking",
  "Family dashboard with tips",
  "Monthly Community Zoom Meet-ups",
  "Cancel anytime",
];

export const FAQS = [
  {
    q: "Why stories? Why does it work?",
    a: "Stories are how children naturally learn language. For kids with DLD, stories provide a predictable framework (who, where, problem, feeling, action, solution) that makes language easier to understand and remember.\n\nResearch shows that narrative skills—understanding and telling stories—are the foundation for vocabulary, grammar, reading, and writing. Story Pros gives your child repeated practice with this framework in every session, building the language skills they need for school and life.",
  },
  {
    q: "What will my child learn?",
    a: 'Your child will build:\n\nVocabulary through deep word learning (Semantic Feature Analysis)\nComprehension by answering who, where, what, and why questions\nGrammar by practicing sentence patterns with "because" and other connecting words\nNarrative skills by learning to organize and retell stories\nPhonological awareness through rhyming and sound activities\nConfidence with self-monitoring "brain checks" that celebrate progress',
  },
  {
    q: "What ages is Story Pros designed for?",
    a: "Story Pros is designed for children ages 5-12 with language-based learning differences, including DLD, language delays, ADHD, autism, and dyslexia.",
  },
  {
    q: "Does my child need a formal diagnosis to use Story Pros?",
    a: "No! Story Pros is helpful for any child who struggles with language, whether they have a formal diagnosis or not. Many children on waitlists for evaluation benefit from starting practice right away.",
  },
  {
    q: "How often should my child use the app?",
    a: "We recommend daily sessions for the best results. Research shows children with DLD need consistent, repeated exposure to new language skills.",
  },
  {
    q: "Do I need to sit with my child while they use the app?",
    a: "For younger children (ages 5-7) or children who need more support, we recommend parents stay nearby, especially at first. Older or more independent children can often complete stories on their own. The app includes an optional retell section where children can practice telling the story to you!",
  },
  {
    q: "How does this fit with my child's speech therapy or school support?",
    a: "Story Pros is designed to complement professional therapy, not replace it. Think of it as daily practice between therapy sessions—like homework that's actually engaging. Many SLPs recommend our app to families.",
  },
  {
    q: "Why do you need my credit card for a free trial?",
    a: "We require a credit card to start your free trial so that if you and your child love Story Pros, your access continues seamlessly after 7 days. You won't be charged during the trial period, and you can cancel anytime before Day 7. We'll send reminder emails on Day 5 and Day 6.",
  },
];
