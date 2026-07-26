/* ─────────────────────────────────────────────
 * Screen catalog — every screen in Story Pros,
 * grouped for the /review feedback page.
 *
 * `route` — where "Open this screen" jumps (demo
 *   session starts first for signed-in screens).
 * `howToReach` — extra steps when a screen can't be
 *   deep-linked (e.g. story phases).
 * ───────────────────────────────────────────── */

export interface CatalogScreen {
  key: string;
  label: string;
  description: string;
  route?: string;
  /** Route requires a session — the review page starts demo mode first */
  needsAuth?: boolean;
  howToReach?: string;
}

export interface CatalogCategory {
  key: string;
  label: string;
  icon: string;
  screens: CatalogScreen[];
}

const DEMO_STORY_ROUTE = "/story/dan-and-the-paper-cut";

export const SCREEN_CATALOG: CatalogCategory[] = [
  {
    key: "public",
    label: "Public & Landing",
    icon: "🌐",
    screens: [
      {
        key: "landing",
        label: "Landing page",
        description:
          "The public front door at the main link: hero, five skills, how it works, pricing, demo button.",
        route: "/",
      },
      {
        key: "demo-picker",
        label: "Demo picker",
        description:
          "Choice between exploring the app with sample data or walking through onboarding.",
        route: "/demo",
      },
      {
        key: "privacy",
        label: "Privacy Policy",
        description: "Plain-language privacy policy covering family and child data.",
        route: "/privacy",
      },
      {
        key: "terms",
        label: "Terms of Service",
        description: "Terms covering accounts, subscriptions, and the educational-tool disclaimer.",
        route: "/terms",
      },
    ],
  },
  {
    key: "auth",
    label: "Sign Up & Log In",
    icon: "🔑",
    screens: [
      {
        key: "signup",
        label: "Create account",
        description: "Parent signup form with email/password plus Google and Apple sign-in.",
        route: "/signup",
      },
      {
        key: "login",
        label: "Log in",
        description: "Returning-family login with email/password, Google, and Apple.",
        route: "/login",
      },
      {
        key: "forgot-password",
        label: "Forgot password",
        description: "Request a password reset email.",
        route: "/forgot-password",
      },
      {
        key: "reset-password",
        label: "Reset password",
        description: "Set a new password after following the email link.",
        howToReach: "Reached from the reset link in the email.",
      },
    ],
  },
  {
    key: "onboarding",
    label: "Onboarding",
    icon: "🚀",
    screens: [
      {
        key: "intro-carousel",
        label: "Intro carousel",
        description: "The welcome slides that introduce Story Pros before account setup.",
        route: "/intro",
      },
      {
        key: "child-profile",
        label: "Child profile setup",
        description: "Parent adds the child's name and age.",
        route: "/onboarding/profile",
        needsAuth: true,
        howToReach: "Opens inside the demo onboarding walkthrough.",
      },
      {
        key: "onboarding-success",
        label: "Welcome celebration",
        description: "The celebration screen after the child profile is created.",
        howToReach: "Appears right after child setup during onboarding.",
      },
      {
        key: "assessment",
        label: "Placement quiz",
        description: "The short starting assessment that places the child at Level 1 or 2.",
        route: "/onboarding/assessment",
        needsAuth: true,
        howToReach: "Opens inside the demo onboarding walkthrough.",
      },
      {
        key: "select-child",
        label: "Child picker",
        description: "Families with more than one child pick who's playing.",
        howToReach: "Appears at sign-in when an account has multiple children.",
      },
    ],
  },
  {
    key: "home",
    label: "Home & Navigation",
    icon: "🏠",
    screens: [
      {
        key: "home-dashboard",
        label: "Home",
        description:
          "The child's home: greeting, next story card, adventure map link, quick stats, bottom tabs (tablet) or top nav (laptop).",
        route: "/home",
        needsAuth: true,
      },
      {
        key: "adventure-map",
        label: "Adventure Map",
        description:
          "The winding story road with pins for every story: completed, active, and locked.",
        route: "/map",
        needsAuth: true,
      },
      {
        key: "library",
        label: "Story Library",
        description: "Browsable list of all stories with covers, stars earned, and filters.",
        route: "/library",
        needsAuth: true,
      },
    ],
  },
  {
    key: "story",
    label: "Story Play (13 phases)",
    icon: "📖",
    screens: [
      {
        key: "phase-resume",
        label: "Welcome back / resume",
        description: "Offered when a story was left partway: keep going or start over.",
        howToReach: "Leave a story partway, then open the same story again.",
      },
      {
        key: "phase-slides",
        label: "1 · Story slides",
        description: "Six illustrated slides with narration and highlighted connective words.",
        route: DEMO_STORY_ROUTE,
        needsAuth: true,
      },
      {
        key: "phase-overview",
        label: "2 · Story map overview",
        description: "The story's six beats laid out as a grid before questions begin.",
        route: DEMO_STORY_ROUTE,
        needsAuth: true,
        howToReach: "Play through the slides first.",
      },
      {
        key: "phase-comprehension",
        label: "3 · Comprehension questions",
        description: "Six listen-then-choose questions with brain-check feedback.",
        route: DEMO_STORY_ROUTE,
        needsAuth: true,
        howToReach: "Continue past the story slides.",
      },
      {
        key: "phase-sequencing",
        label: "4 · Put the story in order",
        description: "Tap the story frames into the right order; partial credit on first try.",
        route: DEMO_STORY_ROUTE,
        needsAuth: true,
        howToReach: "Continue past comprehension.",
      },
      {
        key: "phase-retell-1",
        label: "5 · First retell",
        description: "The child retells the story with element prompts; can record their voice.",
        route: DEMO_STORY_ROUTE,
        needsAuth: true,
        howToReach: "Continue past sequencing.",
      },
      {
        key: "phase-vocab-intro",
        label: "6 · New words",
        description: "Three target words taught with the five-question word map (SFA).",
        route: DEMO_STORY_ROUTE,
        needsAuth: true,
        howToReach: "Continue past the first retell.",
      },
      {
        key: "phase-vocab-quiz",
        label: "7 · Word quiz",
        description: "Multiple-choice check on the three new words.",
        route: DEMO_STORY_ROUTE,
        needsAuth: true,
        howToReach: "Continue past new words.",
      },
      {
        key: "phase-sentence-builder",
        label: "8 · Sentence builder",
        description: "Finish sentences using the story's connective word (because, so, and then).",
        route: DEMO_STORY_ROUTE,
        needsAuth: true,
        howToReach: "Continue past the word quiz.",
      },
      {
        key: "phase-retell-2",
        label: "9 · Second retell",
        description: "A second retell attempt after the word work.",
        route: DEMO_STORY_ROUTE,
        needsAuth: true,
        howToReach: "Continue past sentence builder.",
      },
      {
        key: "phase-phonological",
        label: "10 · Sound games",
        description: "Rhyming and first-sound matching.",
        route: DEMO_STORY_ROUTE,
        needsAuth: true,
        howToReach: "Continue past the second retell.",
      },
      {
        key: "phase-joke",
        label: "11 · Joke break",
        description: "A wordplay joke tied to the story's vocabulary.",
        route: DEMO_STORY_ROUTE,
        needsAuth: true,
        howToReach: "Continue past sound games.",
      },
      {
        key: "phase-personal",
        label: "12 · Your story",
        description: "An open question connecting the story to the child's own life.",
        route: DEMO_STORY_ROUTE,
        needsAuth: true,
        howToReach: "Continue past the joke.",
      },
      {
        key: "phase-complete",
        label: "13 · Story complete",
        description: "Score summary, stars, and Paper Planes earned.",
        route: DEMO_STORY_ROUTE,
        needsAuth: true,
        howToReach: "Finish the whole story.",
      },
    ],
  },
  {
    key: "rewards",
    label: "Rewards & Shop",
    icon: "🏅",
    screens: [
      {
        key: "achievements",
        label: "Rewards gallery",
        description: "Badges earned and collectibles owned.",
        route: "/achievements",
        needsAuth: true,
      },
      {
        key: "shop",
        label: "Collectible shop",
        description: "Spend Paper Planes on plane skins, wallpapers, lore cards, and tricks.",
        route: "/shop",
        needsAuth: true,
      },
    ],
  },
  {
    key: "parents",
    label: "Parent Area",
    icon: "👨‍👩‍👧",
    screens: [
      {
        key: "parent-dashboard",
        label: "Progress dashboard",
        description: "Scores and trends across the five skill areas, story by story.",
        route: "/dashboard",
        needsAuth: true,
      },
      {
        key: "settings",
        label: "Settings",
        description:
          "Children, read-aloud speed, level placement, subscription, retell library, log out.",
        route: "/settings",
        needsAuth: true,
      },
      {
        key: "retell-library",
        label: "Retell library",
        description: "Saved voice recordings from the retell phases.",
        route: "/retell-library",
        needsAuth: true,
      },
      {
        key: "paywall",
        label: "Premium upgrade",
        description:
          "The subscription screen: free tier (one story) vs membership, $7.99 USD per child.",
        route: "/paywall",
        needsAuth: true,
      },
    ],
  },
  {
    key: "system",
    label: "System States",
    icon: "⚙️",
    screens: [
      {
        key: "loading",
        label: "Loading screen",
        description: "Shown briefly while the app checks the session.",
        howToReach: "Flashes when opening the app or refreshing.",
      },
      {
        key: "error-states",
        label: "Error / empty states",
        description: "What appears when something fails to load or a list is empty.",
        howToReach: "Various; note which one you saw in your feedback.",
      },
    ],
  },
];

export const TOTAL_SCREENS = SCREEN_CATALOG.reduce(
  (sum, category) => sum + category.screens.length,
  0,
);
