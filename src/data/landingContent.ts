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
  heading: "Language learning through interactive stories",
  subheading: "Learning that feels like a story, not a lesson.",
  body: "Designed for children with DLD and other language-learning needs, Story Pros turns relatable stories into meaningful, guided language practice.",
};


/* ── Parent problem ── */

export const PARENT_PROBLEM = {
  heading: "Your child has so much to say.",
  paragraphs: [
    "You may hear “I don’t know” or get only part of the story, even when your child has more they want to share.",
    "Story Pros gives children calm, guided practice understanding stories, organizing ideas, and putting their thoughts into words.",
  ],
};

/* ── Why stories work ── */

/** Story elements use the same keys/labels as the in-product story engine */
export const WHY_STORIES = {
  heading: "Why stories?",
  lead: "Stories give language a clear, meaningful structure. Story Pros helps children notice key parts of a story, understand how events connect, and use that structure to remember and retell what happened.",
  framework: [
    { element: "character", label: "Character" },
    { element: "place", label: "Place" },
    { element: "problem", label: "Problem" },
    { element: "emotion", label: "Feeling" },
    { element: "action", label: "Action" },
    { element: "result", label: "Result" },
  ] as const,
};

/* ── The four-part pathway ── */

export const PATHWAY = [
  {
    step: "1",
    icon: "🎧",
    title: "Read & Understand",
    body: "Read or listen to a short story, learn key words, and notice important details.",
  },
  {
    step: "2",
    icon: "🗣️",
    title: "Retell with Support",
    body: "Use visuals, prompts, and choices to organize the story and share it in your own words.",
  },
  {
    step: "3",
    icon: "💜",
    title: "Connect to Real Life",
    body: "Link the story to feelings, experiences, and everyday situations so language feels meaningful.",
  },
];


export const PATHWAY_NOTE =
  "The same simple routine is used across stories, helping children feel confident and know what to expect.";


/* ── What your child will learn ── */

export const WILL_LEARN = [
  {
    icon: "MessageCircle",
    skill: "Vocabulary",
    detail: "Learn and use important story words.",
  },
  {
    icon: "Headphones",
    skill: "Comprehension",
    detail: "Understand key details and ideas.",
  },
  {
    icon: "AlignLeft",
    skill: "Sentence building",
    detail: "Practise putting ideas into clear sentences.",
  },
  {
    icon: "BookOpen",
    skill: "Storytelling",
    detail: "Organize and retell what happened.",
  },
  {
    icon: "Volume2",
    skill: "Sound awareness",
    detail: "Notice rhymes and beginning sounds.",
  },
  {
    icon: "CheckCircle2",
    skill: "Self-monitoring",
    detail: "Pause, check understanding, and try again.",
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
  heading: "More than an app. A community too.",
  subheading: "Story Pros Community Circle",
  body: "Once a month, children can come together live on Zoom to talk, share, connect, and spend time with other kids who understand that communication can sometimes be hard.",
  chips: [
    { icon: "CalendarDays", label: "Monthly" },
    { icon: "Clock", label: "About 1 hour" },
    { icon: "Repeat", label: "Rotating Times" },
    { icon: "Users", label: "Parents welcome" },
  ],
  note: "Session times rotate throughout the year to make it easier for families in different parts of the world to join.",
  cta: "Explore Membership",
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
