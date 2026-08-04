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
  eyebrow: "For ages 5–12 with DLD + language-based needs",
  /** Split so the headline lands on two lines on desktop */
  headingLine1: "Language learning through interactive",
  headingLine2: "stories",
  heading: "Language learning through interactive stories",
  subheading: "Learning that feels like a story, not a lesson.",
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
  heading: "See what they practised. Know what to try next.",
  body: "The Family Dashboard turns each story into a short, plain-language read on your child's language skills.",
  points: [
    {
      icon: "Sparkles",
      title: "A weekly snapshot",
      detail:
        "Stories finished, skill areas practised, the current focus, and every saved retell in one place.",
    },
    {
      icon: "Home",
      title: "One step for home",
      detail:
        "A single prompt to try together — like “Why do you think he did that?” — with the reason it helps.",
    },
  ],
};



/* ── Who it is designed for ── */

export const DESIGNED_FOR_HEADING = "Could Story Pros be a good fit for your child?";

export const DESIGNED_FOR_INTRO = "Story Pros may be helpful for children who:";

export const DESIGNED_FOR: { icon: string; text: string }[] = [
  {
    icon: "MessagesSquare",
    text: "Have lots to say, but organizing words and ideas can be hard",
  },
  {
    icon: "Ear",
    text: "Find it difficult to understand or remember spoken information",
  },
  {
    icon: "BookOpen",
    text: "Have trouble retelling stories or explaining what happened",
  },
  {
    icon: "Clock",
    text: "Need extra time to process questions and respond",
  },
  {
    icon: "Search",
    text: "Have difficulty finding the words they want",
  },
  {
    icon: "LayoutGrid",
    text: "Do better with visuals, repetition, models, and clear choices",
  },
];

export const DESIGNED_FOR_NOTE =
  "Created with children with DLD in mind, with supports that may also help children with related language-based needs.";


/* ── Created by ── */

export const FOUNDERS = {
  eyebrow: "Built with expertise",
  heading: "Built around how children learn language",
  body: "Story Pros is developed by Empowered DLD, bringing together clinical expertise, classroom experience, and thoughtful language-learning design.",
  close:
    "Grounded in research and best practices, and shaped through collaboration with speech pathologists, educators, researchers, and families.",
  pillars: [
    {
      icon: "MessagesSquare",
      title: "Clinical expertise",
      detail: "DLD-informed language design",
    },
    {
      icon: "GraduationCap",
      title: "Classroom experience",
      detail: "Built with real learners and learning environments in mind",
    },
    {
      icon: "Handshake",
      title: "Collaborative development",
      detail: "Shaped through research, professional input, and ongoing evaluation",
    },
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


/* ── Membership ── */



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
  {
    q: "How is Story Pros different from other learning apps?",
    a: "Story Pros uses connected stories to build language in context, with built-in supports such as repetition, visuals, choices, and extra processing time. It also extends beyond the child’s screen with a Family Dashboard and monthly Community Circle for members.",
  },
];
