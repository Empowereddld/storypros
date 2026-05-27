/* ─────────────────────────────────────────────
 * Demo Seed — Pre-populated account for Rovonn
 * Creates a demo parent account with a child "Ava"
 * who has 4 completed stories, badges, paper planes,
 * and a premium subscription. Run once on first load
 * so every screen has real data to showcase.
 * ───────────────────────────────────────────── */

const DEMO_SEEDED_KEY = "storypros_demo_seeded";
const DEMO_EMAIL = "rovonn@demo.com";
const DEMO_USER_ID = "demo-rovonn-001";

function promoteExistingRovonnDemo(): void {
  try {
    const authRaw = localStorage.getItem("storypros_auth");
    if (authRaw) {
      const auth = JSON.parse(authRaw);
      if (auth?.user?.id === DEMO_USER_ID || auth?.profile?.email === DEMO_EMAIL) {
        auth.profile = { ...auth.profile, role: "admin" };
        localStorage.setItem("storypros_auth", JSON.stringify(auth));
      }
    }

    const accountsRaw = localStorage.getItem("storypros_accounts");
    if (accountsRaw) {
      const accounts = JSON.parse(accountsRaw);
      if (Array.isArray(accounts)) {
        const updated = accounts.map((account) =>
          account?.email === DEMO_EMAIL || account?.userId === DEMO_USER_ID
            ? { ...account, profile: { ...account.profile, role: "admin" } }
            : account,
        );
        localStorage.setItem("storypros_accounts", JSON.stringify(updated));
      }
    }
  } catch {
    // Ignore malformed demo storage and let the normal seed path repair it.
  }
}

/** Check if demo has already been seeded */
export function isDemoSeeded(): boolean {
  return localStorage.getItem(DEMO_SEEDED_KEY) === "true";
}

/** Seed the full demo account — safe to call multiple times, only runs once */
export function seedDemoAccount(): void {
  if (typeof window === "undefined") return;
  promoteExistingRovonnDemo();
  if (isDemoSeeded()) return;


  const userId = DEMO_USER_ID;
  const childId = "demo-child-ava";
  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  // ── 1. Auth — create Rovonn's account with child Ava ──

  const profile = {
    id: userId,
    email: DEMO_EMAIL,
    displayName: "Rovonn",
    role: "admin",
    onboarded: true,
  };

  const child = {
    id: childId,
    profileId: userId,
    name: "Ava",
    age: 6,
    currentLevel: 1,
    levelOverride: false,
    ttsSpeed: "normal",
    ttsAutoplay: false,
  };

  // Auth session (auto-logged-in)
  localStorage.setItem(
    "storypros_auth",
    JSON.stringify({
      user: { id: userId, email: DEMO_EMAIL },
      profile,
      children: [child],
      activeChildId: childId,
    }),
  );

  // Accounts store (for login flow)
  localStorage.setItem(
    "storypros_accounts",
    JSON.stringify([
      {
        email: DEMO_EMAIL,
        password: "demo1234",
        userId,
        profile,
        children: [child],
      },
    ]),
  );

  // ── 2. Progress — 4 completed stories with varied scores ──

  function daysAgo(d: number): string {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    return date.toISOString();
  }

  const completions = [
    {
      storyId: "dan-and-the-paper-cut",
      completedAt: daysAgo(6),
      firstAttemptAccuracy: 0.88,
      replayCount: 0,
      domainScores: {
        listening: 92,
        story_structure: 85,
        vocabulary: 88,
        grammar: 80,
        phonological: 90,
      },
      overallScore: 87,
    },
    {
      storyId: "darias-carnival-ticket",
      completedAt: daysAgo(4),
      firstAttemptAccuracy: 0.76,
      replayCount: 0,
      domainScores: {
        listening: 80,
        story_structure: 72,
        vocabulary: 75,
        grammar: 70,
        phonological: 78,
      },
      overallScore: 75,
    },
    {
      storyId: "dan-joins-the-game",
      completedAt: daysAgo(2),
      firstAttemptAccuracy: 0.93,
      replayCount: 0,
      domainScores: {
        listening: 95,
        story_structure: 92,
        vocabulary: 90,
        grammar: 88,
        phonological: 95,
      },
      overallScore: 92,
    },
    {
      storyId: "daria-and-the-puzzle-piece",
      completedAt: daysAgo(0),
      firstAttemptAccuracy: 0.82,
      replayCount: 0,
      domainScores: {
        listening: 85,
        story_structure: 80,
        vocabulary: 82,
        grammar: 78,
        phonological: 85,
      },
      overallScore: 82,
    },
  ];

  // Paper planes: base 10 + performance bonuses per story
  // Story 1: 10+10=20, Story 2: 10+5=15, Story 3: 10+15=25, Story 4: 10+10=20 = 80 total
  const paperPlanes = 80;

  localStorage.setItem(
    "storypros_progress",
    JSON.stringify({
      completions,
      attempts: [], // phase-level attempts not needed for demo display
      paperPlanes,
      currentLevel: 1,
      streak: 3, // played 3 days in a row
      lastPlayedDate: today,
    }),
  );

  // ── 3. Shop — award earned badges ──

  const ownedItems: Record<string, string[]> = {
    [childId]: [
      "plane-classic",        // default
      "badge-first-story",    // completed 1 story
      "badge-3-stories",      // completed 3 stories
    ],
  };

  localStorage.setItem("storypros_shop", JSON.stringify(ownedItems));

  // ── 4. Subscription — premium for Ava ──

  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  localStorage.setItem(
    "storypros_subscriptions",
    JSON.stringify({
      children: {
        [childId]: {
          childId,
          tier: "premium",
          subscribedAt: daysAgo(10),
          currentPeriodEnd: periodEnd.toISOString(),
          cancelAtPeriodEnd: false,
        },
      },
    }),
  );

  // ── 5. Mark as seeded ──
  localStorage.setItem(DEMO_SEEDED_KEY, "true");
}

/** Clear all demo data (for testing or resetting) */
export function clearDemoSeed(): void {
  localStorage.removeItem(DEMO_SEEDED_KEY);
  localStorage.removeItem("storypros_auth");
  localStorage.removeItem("storypros_accounts");
  localStorage.removeItem("storypros_progress");
  localStorage.removeItem("storypros_shop");
  localStorage.removeItem("storypros_subscriptions");
}
