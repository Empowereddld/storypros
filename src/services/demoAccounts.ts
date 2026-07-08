/* ─────────────────────────────────────────────
 * Demo Accounts
 * Canned, no-signup personas for showing off the app. Each one
 * gets a synthetic (non-Supabase) session with full navigation
 * access — see AuthContext's `isDemo` bypass in _authenticated.tsx —
 * plus a bit of seeded progress/shop/subscription data so the
 * parent, SLP, and teacher views don't look empty.
 * ───────────────────────────────────────────── */
import { startPremiumSubscription } from "./subscription";

export type DemoRole = "parent" | "slp" | "teacher";

export interface DemoPersona {
  id: string;
  displayName: string;
  email: string;
  childId: string;
  childName: string;
}

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: "demo-camesha",
    displayName: "Camesha",
    email: "camesha@demo.storypros.app",
    childId: "demo-camesha-child",
    childName: "Ava",
  },
  {
    id: "demo-jinean",
    displayName: "Jinean",
    email: "jinean@demo.storypros.app",
    childId: "demo-jinean-child",
    childName: "Micah",
  },
  {
    id: "demo-enerds-admin",
    displayName: "Enerds Admin",
    email: "admin@demo.storypros.app",
    childId: "demo-enerds-admin-child",
    childName: "Story Pros Demo",
  },
];

export function getDemoPersona(id: string): DemoPersona | undefined {
  return DEMO_PERSONAS.find((p) => p.id === id);
}

const SEEDED_KEY_PREFIX = "storypros_demo_seeded_";

/** Populate a demo persona's child with a bit of realistic-looking progress. Idempotent. */
export function seedDemoPersonaData(persona: DemoPersona): void {
  if (typeof window === "undefined") return;
  const seededKey = SEEDED_KEY_PREFIX + persona.id;
  if (localStorage.getItem(seededKey) === "true") return;

  const now = new Date();
  const daysAgo = (d: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    return date.toISOString();
  };

  localStorage.setItem(
    `storypros_progress_${persona.childId}`,
    JSON.stringify({
      completions: [
        {
          storyId: "dan-and-the-paper-cut",
          completedAt: daysAgo(5),
          firstAttemptAccuracy: 0.9,
          replayCount: 0,
          domainScores: { listening: 92, story_structure: 88, vocabulary: 90, grammar: 85, phonological: 90 },
          overallScore: 89,
        },
        {
          storyId: "darias-carnival-ticket",
          completedAt: daysAgo(2),
          firstAttemptAccuracy: 0.8,
          replayCount: 0,
          domainScores: { listening: 84, story_structure: 78, vocabulary: 80, grammar: 76, phonological: 82 },
          overallScore: 80,
        },
      ],
      attempts: [],
      paperPlanes: 55,
      currentLevel: 1,
      streak: 2,
      lastPlayedDate: now.toISOString().slice(0, 10),
    }),
  );

  const shop = JSON.parse(localStorage.getItem("storypros_shop") || "{}");
  shop[persona.childId] = ["plane-classic", "badge-first-story"];
  localStorage.setItem("storypros_shop", JSON.stringify(shop));

  void startPremiumSubscription(persona.childId);

  localStorage.setItem(seededKey, "true");
}
