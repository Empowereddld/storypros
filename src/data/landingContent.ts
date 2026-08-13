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
  eyebrow: "FOR KIDS WITH LANGUAGE DISORDERS",
  /** Split so the headline lands on two lines on desktop */
  headingLine1: "Improving language skills through interactive",
  headingLine2: "stories",
  heading: "Improving language skills through interactive stories",
  subheading: "Stories are an ideal way to gain new vocabulary and grammar skills!",
};


/* ── Parent problem ── */

export const PARENT_PROBLEM = {
  heading: "Does your child struggle to share their ideas or tell you about their day?",
  paragraphs: [
    "Kids with language disorders often need help sharing their amazing ideas and experiences in a way others can easily follow. ",
    "Story Pros gives children fun, guided practice with story comprehension and story-telling. They also learn vocabulary words on a deeper level by diving into different features of target words.",
  ],
};

/* ── Why stories work ── */

/** Story elements use the same keys/labels as the in-product story engine */
export const WHY_STORIES = {
  heading: "Why stories?",
  lead: "When children know the elements needed to tell a complete story, they can put more brain power into thinking of specific words and producing complex sentences. That same framework also supports story comprehension, giving them a clear way to organize and make sense of what they hear or read.\u00a0",
  framework: [
    { element: "character", label: "Character" },
    { element: "place", label: "Place" },
    { element: "problem", label: "Problem" },
    { element: "emotion", label: "Feeling" },
    { element: "action", label: "Action" },
    { element: "result", label: "Result" },
  ] as const,
};

export const WHY_STORIES_BENEFITS = {
  heading: "A framework that works everywhere",
  lead: "Once children learn the Story Pros formula, they can use it at school, at home, and with friends.",
  items: [
    {
      icon: "GraduationCap",
      title: "At school",
      body: "The same structure helps children understand what they read, organize their ideas, and share what they know with teachers and classmates.",
    },
    {
      icon: "MessagesSquare",
      title: "With friends",
      body: "Children can tell clearer stories about their own experiences, join conversations more easily, and feel more confident connecting with others.",
    },
  ],
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
    detail: "Deepen understanding of key story words",
  },
  {
    icon: "Headphones",
    skill: "Comprehension",
    detail: "Understand key details and ideas.",
  },
  {
    icon: "AlignLeft",
    skill: "Sentence building",
    detail: "Practise putting ideas into complex sentences.",
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
  body: "Once a month, children can come together live on Zoom to talk, share, connect, and spend time with other kids who understand that communication can sometimes be hard. This is a fantastic opportunity to make friends with people who get it!",
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
        "A single prompt to try together, like “Why do you think he did that?” to help your child think more deeply.",
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
  "Created with children with Developmental Language Disorder (DLD) in mind, with supports that may also help children with related language-based needs.";


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



export const PRICING_HEADLINE = "Start free. Join when you're ready.";
export const PRICING_SUBHEAD =
  "Try one complete story free, then unlock the full Story Pros experience with membership.";

export const FREE_TIER = {
  title: "Free",
  price: "$0",
  note: "Free story",
  body: "Try one complete Story Pros story from beginning to end.",
  features: ["One complete story", "Every activity in that story", "Family Dashboard preview"],
  cta: "Try the Free Story",
  reassurance: "No card needed",
};

export const MEMBERSHIP_TIER = {
  title: "Story Pros Membership",
  note: "Full membership",
  body: "Full access to the Story Pros experience.",
  features: [
    "Every Story Pros story and activity",
    "Family Dashboard with practical support for home",
    "Monthly live Community Circle for children",
  ],
  supporting: "New stories are included as Story Pros grows.",
  cta: "Join the Waitlist",
  reassurance: "Cancel anytime",
};

/* ── FAQ ── */

export const FAQS = [
  {
    q: "Who is Story Pros designed for?",
    a: `Story Pros is designed for children ${AGE_RANGE} with DLD and other language-based learning needs. A formal diagnosis is not required.`,
  },
  {
    q: "Is Story Pros right for multilingual children?",
    a: "Yes, multilingual children can use Story Pros. Multilingualism itself is not a language disorder. Story Pros may be especially relevant for multilingual children who also have DLD or other language-based learning needs.",
  },
  {
    q: "How often should my child use Story Pros?",
    a: "There is no one schedule that will be right for every child. Short, regular sessions are a good place to start, and families can choose a pace that works for their child. Story Pros includes repetition across activities and stories, so children have multiple opportunities to revisit language skills.",
  },
  {
    q: "Do I need to sit with my child while they use Story Pros?",
    a: "Not always. Some children can use Story Pros independently, while younger children or children who need more support may benefit from having an adult nearby, especially at first. Retell activities also create natural opportunities to practise together.",
  },
  {
    q: "How does Story Pros fit with my child's speech therapy or school support?",
    a: "Story Pros is designed to complement, not replace, speech-language therapy or school-based support. It gives children additional opportunities to practise language skills through stories between the other learning and support they receive.",
  },
  {
    q: "What happens in the Story Pros Community Circle?",
    a: "The Community Circle is a live, child-focused Zoom gathering for members, held for about an hour once a month. Children can connect with others in the Story Pros community, and parents are welcome to sit in. Saturday session times will rotate to better support families across different time zones. It is a community experience, not group speech therapy.",
  },
  {
    q: "How is Story Pros different from other learning apps?",
    a: "Story Pros uses connected stories to support language practice in meaningful context. Built-in supports include visuals, repetition, choices, and extra processing time. Membership also extends beyond the app with a Family Dashboard and monthly Community Circle.",
  },
];

