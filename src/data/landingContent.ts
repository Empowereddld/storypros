/* ─────────────────────────────────────────────
 * Landing page content
 *
 * Positioning follows the client review (July 2026):
 * Story Pros is a story-based membership for children
 * ages 5 to 12, combining guided language practice,
 * family support, and monthly community.
 *
 * Keep copy edits here (not in the layout) so wording
 * stays reviewable in one place.
 *
 * TODO (Camesha/Jinean): the Community Circle FAQ still
 * needs confirmed answers on caregiver presence, age
 * grouping, group size, recording, and time zones.
 * ───────────────────────────────────────────── */

export const AGE_RANGE = "ages 5 to 12";

/** Public waitlist page (founding member offer lives there) */
export const WAITLIST_URL = "https://www.empowereddld.com/storypros";

export const PRICE = "$7.99";
export const PRICE_PERIOD = "/month";
export const FOUNDING_PRICE = "$5.99";
export const FOUNDING_SPOTS = 100;

/* ── Hero ── */

export const HERO = {
  eyebrow: "Story-based language learning for ages 5–12",
  /** Split so the headline lands on two lines on desktop */
  headingLine1: "Language learning through interactive",
  headingLine2: "stories",
  subheading: "Learning that feels like a story,\u00a0\nnot a lesson.",
  body: "Story Pros helps children with DLD and other language-based learning needs build vocabulary, understand and retell stories, and express their ideas through calm, guided practice.",
};

/** The three benefits, introduced in the section after the hero */
export const HERO_BENEFITS = [
  "Understand key story information.",
  "Organize and retell ideas",
  "Connect stories to everyday life",
];

/* ── Parent problem ── */

export const PARENT_PROBLEM = {
  heading: "Your child has so much to say.",
  lead: "",
  body: "You may hear “I don't know” when you ask about their day, even when you know there is more they want to share. The details may come out in pieces, or they may become frustrated as they try to explain.\n\nStory Pros gives children calm, guided practice understanding stories, organizing their thoughts, and sharing ideas in ways that feel manageable.",
};

/* ── Why stories work ── */

export const WHY_STORIES = {
  eyebrow: "Why stories?",
  heading: "Why does it work?",
  lead: "Stories are how children naturally learn language. For kids with DLD, stories provide a predictable framework that makes language easier to understand and remember.",
  framework: [
    { icon: "🧒", label: "Who" },
    { icon: "📍", label: "Where" },
    { icon: "❓", label: "Problem" },
    { icon: "💜", label: "Feeling" },
    { icon: "⚡", label: "Action" },
    { icon: "✅", label: "Solution" },
  ],
  close:
    "Research shows that narrative skills, understanding and telling stories, are the foundation for vocabulary, grammar, reading, and writing. Story Pros gives your child repeated practice with this framework in every session, building the language skills they need for school and life.",
};

/* ── The four-part pathway ── */

export const PATHWAY = [
  {
    step: "1",
    icon: "🎧",
    title: "Read & Understand",
    body: "Children explore a short interactive story, learn vocabulary, and identify important details.",
  },
  {
    step: "2",
    icon: "🗣️",
    title: "Retell & Express",
    body: "Visual supports, models, and choices help children organize the story and share it in their own words.",
  },
  {
    step: "3",
    icon: "💜",
    title: "Connect & Grow",
    body: "Children connect the story to their own experiences, feelings, and ideas, helping language become more meaningful.",
  },
];


export const PATHWAY_NOTE =
  "The same supportive sequence is used across stories, creating a predictable routine that children can become more confident using over time.";

/* ── What your child will learn ── */

export const WILL_LEARN = [
  {
    icon: "💬",
    skill: "Vocabulary",
    detail: "through deep word learning (Semantic Feature Analysis)",
  },
  {
    icon: "👂",
    skill: "Comprehension",
    detail: "by answering who, where, what, and why questions",
  },
  {
    icon: "✏️",
    skill: "Grammar",
    detail: 'by practicing sentence patterns with "because" and other connecting words',
  },
  { icon: "📖", skill: "Narrative skills", detail: "by learning to organize and retell stories" },
  {
    icon: "🔤",
    skill: "Phonological awareness",
    detail: "through rhyming and sound activities",
  },
  {
    icon: "⭐",
    skill: "Confidence",
    detail: 'with self-monitoring "brain checks" that celebrate progress',
  },
];

/* ── What makes Story Pros different ── */

export const DIFFERENTIATORS = [
  {
    icon: "📖",
    title: "Understand and Retell Stories",
    body: "Children practise identifying important information, organizing events, and sharing ideas in a meaningful order.",
  },
  {
    icon: "💬",
    title: "Vocabulary in Context",
    body: "New words are introduced through stories and revisited to support understanding and use.",
  },
  {
    icon: "🧩",
    title: "Built-In Language Supports",
    body: "Visual cues, repetition, models, choices, and extra processing time are included throughout.",
  },
  {
    icon: "🏡",
    title: "Guidance for Families",
    body: "The family dashboard shows what the child has practised and offers simple ideas for supporting their next step.",
  },
];

/* ── Monthly Community Circle ── */

export const COMMUNITY = {
  eyebrow: "Included with membership",
  heading: "Learn, connect, and grow together",
  lead: "More than an app: every Story Pros membership includes access to a live monthly Story Pros Global Community Circle on Zoom.",
  body: "Children and families can join guided story activities, practise communication in a welcoming environment, and connect with others who understand language differences.",
  checks: [
    "Practise communication in a welcoming, low-pressure setting",
    "Connect with other children and families who understand language differences",
    "Build confidence, belonging, and self-advocacy",
  ],
  close: "Stories help children practise language. Community helps them feel understood.",
};

/* ── Family dashboard ── */

export const DASHBOARD = {
  eyebrow: "For grown-ups",
  heading: "You see what they practised, and what to try next",
  body: "The family dashboard shows what your child worked on today across understanding, vocabulary, retelling, and sounds, along with a simple next step you can practise together at home.",
  points: [
    "A clear picture of what grew this week",
    "Conversation starters that fit the story they just finished",
    "Progress that saves automatically across devices",
  ],
};

/* ── Who it is designed for ── */

export const DESIGNED_FOR = [
  "Have DLD or other language-based learning needs",
  "Find it difficult to understand or retell stories",
  "Need extra time to process spoken language",
  "Have ideas they cannot easily organize or explain",
  "Benefit from visuals, repetition, models, and choices",
  "Feel overwhelmed by language-heavy learning activities",
  "Need support connecting stories to their own experiences",
];

export const DESIGNED_FOR_NOTE =
  "Story Pros was created with children with DLD in mind. Children with related language and learning needs may also benefit from its calm, structured approach.";

/* ── Created by ── */

export const FOUNDERS = {
  eyebrow: "Who made this",
  heading: "Created with language development in mind",
  body: "Story Pros is being developed by Jinean Whitley Cheng, a speech pathologist, and Camesha Russell, an experienced educator.",
  close:
    "Grounded in research and best practices, and shaped through collaboration with speech pathologists and educators, Story Pros brings together clinical knowledge, classroom experience, and meaningful storytelling.",
  people: [
    { name: "Jinean Whitley Cheng", role: "Speech-language pathologist" },
    { name: "Camesha Russell", role: "Educator" },
  ],
};

/* ── See Story Pros in action ── */

export const IN_ACTION = {
  eyebrow: "See Story Pros in action",
  heading: "One story, start to finish",
  storyTitle: "Dan and the Paper Cut",
  steps: [
    "The child reads or listens to the story.",
    "Important vocabulary is introduced in context.",
    "The child answers supported comprehension questions.",
    "Visuals help them sequence and retell.",
    "The child connects the story to something from their own life.",
    "The family dashboard provides a helpful next step.",
  ],
};

/* ── How Story Pros differs from typical learning apps ── */

export const APP_COMPARISON: { typical: string; storyPros: string }[] = [
  {
    typical: "Practise isolated answers",
    storyPros: "Builds language through connected stories",
  },
  {
    typical: "Move quickly from question to question",
    storyPros: "Allows time, repetition, and supported practice",
  },
  {
    typical: "Focus mainly on right or wrong answers",
    storyPros: "Helps children understand, organize, retell, and connect",
  },
  {
    typical: "Provide limited support for families",
    storyPros: "Includes a family dashboard and monthly Community Circle",
  },
  {
    typical: "May feel busy or overstimulating",
    storyPros: "Uses a calm, predictable, age-respectful experience",
  },
];

/* ── Membership ── */

export const MEMBERSHIP_FEATURES: { icon: string; title: string; benefit: string }[] = [
  {
    icon: "📚",
    title: "Access to the interactive story library",
    benefit: "Every story is a full guided session your child can play as often as they like.",
  },
  {
    icon: "✨",
    title: "New stories and activities as they are added",
    benefit: "The library keeps growing, and your membership keeps up with it.",
  },
  {
    icon: "📈",
    title: "Family progress dashboard",
    benefit: "See what your child practised across understanding, vocabulary, and retelling.",
  },
  {
    icon: "🏡",
    title: "Supportive next-step ideas for home",
    benefit: "Simple things to try together after the story, no prep needed.",
  },
  {
    icon: "🎙️",
    title: "One live Community Circle each month",
    benefit: "Guided story activities with other children and families around the world.",
  },
  {
    icon: "🔓",
    title: "Cancel anytime",
    benefit: "No lock-in. Your child's progress stays saved if you come back.",
  },
];

export const INCLUDED = {
  eyebrow: "What's included",
  heading: "Everything in one membership",
  lead: "One membership covers the whole Story Pros experience: the stories your child plays, the guidance you get at home, and the community you both join.",
};

export const PRICING_HEADLINE = "Everything your child needs to find their words";
export const PRICING_SUBHEAD =
  "Start free with one story. Become a member when your family is ready.";

export const FREE_TIER = {
  title: "Free",
  price: "$0",
  note: "Start here",
  body: "Play the first story from beginning to end, no card needed.",
  features: ["One complete story", "Every activity in that story", "Family dashboard preview"],
};

export const MEMBERSHIP_TIER = {
  title: "Story Pros Membership",
  note: "Full access",
  body: "The whole library, the dashboard, and the monthly Community Circle.",
};

export const FOUNDING_OFFER = {
  title: "Founding Membership",
  heading: `${FOUNDING_PRICE} a month, locked in for life`,
  body: `Join the waitlist to claim a founding rate. The first ${FOUNDING_SPOTS} founding members keep ${FOUNDING_PRICE} USD a month for as long as they stay members, even as the regular price rises.`,
  cta: "Join the Founding Member Waitlist",
};

/* ── FAQ ── */

export const FAQS = [
  {
    q: "What ages is Story Pros designed for?",
    a: `Story Pros is designed for children ${AGE_RANGE} with language-based learning differences, including DLD, language delays, ADHD, autism, and dyslexia.`,
  },
  {
    q: "Does my child need a formal diagnosis to use Story Pros?",
    a: "No. Story Pros is helpful for any child who struggles with language, whether they have a formal diagnosis or not. Many children on waitlists for evaluation benefit from starting practice right away.",
  },
  {
    q: "Is there a free version?",
    a: "Yes. The free plan lets your child play the first story from beginning to end, with every activity included and no card required. Membership unlocks the full library, new stories as they are added, and the monthly Community Circle.",
  },
  {
    q: "What is the Story Pros Community Circle?",
    a: "It is a live monthly gathering on Zoom for member families, with guided story activities and a chance to connect with others who understand language differences. It is educational and community-based rather than group speech therapy. Members receive the joining details, timing, and format before each session.",
  },
  {
    q: "How often should my child use the app?",
    a: "We recommend daily sessions for the best results. Research shows children with DLD need consistent, repeated exposure to new language skills.",
  },
  {
    q: "Do I need to sit with my child while they use the app?",
    a: "For younger children or children who need more support, we recommend parents stay nearby, especially at first. Older or more independent children can often complete stories on their own. The app includes an optional retell section where children can practise telling the story to you.",
  },
  {
    q: "How does this fit with my child's speech therapy or school support?",
    a: "Story Pros is designed to complement professional therapy, not replace it. Think of it as daily practice between therapy sessions, like homework that is actually engaging. Many SLPs recommend our app to families.",
  },
  {
    q: "My child is multilingual. Is Story Pros right for us?",
    a: "Being multilingual is not a language disorder. Story Pros may help when a multilingual child also has language-based learning needs, or when they benefit from structured story support for understanding, organizing, and retelling ideas.",
  },
];
