/* ─────────────────────────────────────────────
 * Coins Collectible Shop Service
 * In-memory store for V1. Supabase later.
 *
 * Five categories (per April 25 decisions):
 *  - airplane_design  (skins for the paper plane)
 *  - badge            (auto-awarded milestones)
 *  - wallpaper        (adventure map backgrounds)
 *  - lore_card        (character backstory cards)
 *  - airplane_trick   (animations the plane does)
 * ───────────────────────────────────────────── */

import { db, isCloudId, logSyncError, emitDataUpdated } from "./cloud";

export type CollectibleCategory =
  | "airplane_design"
  | "badge"
  | "wallpaper"
  | "lore_card"
  | "airplane_trick";

export interface Collectible {
  id: string;
  category: CollectibleCategory;
  name: string;
  description: string;
  icon: string; // emoji for V1
  price: number; // 0 = auto-awarded badge
  rarity: "common" | "uncommon" | "rare" | "legendary";
  unlockCondition?: string; // human-readable for badges
}

// ── Seed catalog ──

const CATALOG: Collectible[] = [
  // Airplane designs
  {
    id: "plane-classic",
    category: "airplane_design",
    name: "Classic White",
    description: "The original paper plane.",
    icon: "✈️",
    price: 0,
    rarity: "common",
  },
  {
    id: "plane-sunset",
    category: "airplane_design",
    name: "Sunset Glider",
    description: "Orange and pink gradient wings.",
    icon: "🌅",
    price: 15,
    rarity: "common",
  },
  {
    id: "plane-ocean",
    category: "airplane_design",
    name: "Ocean Breeze",
    description: "Blue waves painted on the wings.",
    icon: "🌊",
    price: 20,
    rarity: "uncommon",
  },
  {
    id: "plane-star",
    category: "airplane_design",
    name: "Starlight Jet",
    description: "Covered in twinkling stars.",
    icon: "⭐",
    price: 30,
    rarity: "uncommon",
  },
  {
    id: "plane-rainbow",
    category: "airplane_design",
    name: "Rainbow Racer",
    description: "Every color of the rainbow!",
    icon: "🌈",
    price: 50,
    rarity: "rare",
  },
  {
    id: "plane-golden",
    category: "airplane_design",
    name: "Golden Eagle",
    description: "A legendary golden plane.",
    icon: "🦅",
    price: 100,
    rarity: "legendary",
  },

  // Badges (auto-awarded, price = 0)
  {
    id: "badge-first-story",
    category: "badge",
    name: "First Flight",
    description: "Completed your first story!",
    icon: "🏅",
    price: 0,
    rarity: "common",
    unlockCondition: "Complete 1 story",
  },
  {
    id: "badge-3-stories",
    category: "badge",
    name: "Frequent Flyer",
    description: "Completed 3 stories.",
    icon: "🎖️",
    price: 0,
    rarity: "uncommon",
    unlockCondition: "Complete 3 stories",
  },
  {
    id: "badge-perfect",
    category: "badge",
    name: "Perfect Landing",
    description: "Got 100% on a story!",
    icon: "💎",
    price: 0,
    rarity: "rare",
    unlockCondition: "100% first-attempt accuracy",
  },
  {
    id: "badge-5-streak",
    category: "badge",
    name: "Five Day Streak",
    description: "Played 5 days in a row!",
    icon: "🔥",
    price: 0,
    rarity: "rare",
    unlockCondition: "5-day streak",
  },
  {
    id: "badge-all-elements",
    category: "badge",
    name: "Story Master",
    description: "Aced every story element.",
    icon: "👑",
    price: 0,
    rarity: "legendary",
    unlockCondition: "All domains above 90%",
  },
  {
    id: "badge-level-2",
    category: "badge",
    name: "Level Up!",
    description: "Reached Level 2!",
    icon: "🚀",
    price: 0,
    rarity: "rare",
    unlockCondition: "Advance to Level 2",
  },
  {
    id: "badge-all-stories",
    category: "badge",
    name: "Story Explorer",
    description: "Completed all 11 stories!",
    icon: "🗺️",
    price: 0,
    rarity: "legendary",
    unlockCondition: "Complete all Level 1 stories",
  },

  // Wallpapers
  {
    id: "wall-meadow",
    category: "wallpaper",
    name: "Sunny Meadow",
    description: "A bright field of wildflowers.",
    icon: "🌻",
    price: 10,
    rarity: "common",
  },
  {
    id: "wall-night",
    category: "wallpaper",
    name: "Starry Night",
    description: "A sky full of twinkling stars.",
    icon: "🌙",
    price: 20,
    rarity: "uncommon",
  },
  {
    id: "wall-underwater",
    category: "wallpaper",
    name: "Under the Sea",
    description: "Coral reefs and friendly fish.",
    icon: "🐠",
    price: 30,
    rarity: "uncommon",
  },
  {
    id: "wall-castle",
    category: "wallpaper",
    name: "Enchanted Castle",
    description: "A magical castle in the clouds.",
    icon: "🏰",
    price: 50,
    rarity: "rare",
  },

  // Lore cards (Dan & Daria backstories)
  {
    id: "lore-dan-origin",
    category: "lore_card",
    name: "Dan's First Word",
    description: "How Dan discovered his love for stories.",
    icon: "📖",
    price: 10,
    rarity: "common",
  },
  {
    id: "lore-daria-wings",
    category: "lore_card",
    name: "Daria Gets Wings",
    description: "The day Daria learned to fly.",
    icon: "🦋",
    price: 15,
    rarity: "uncommon",
  },
  {
    id: "lore-secret-map",
    category: "lore_card",
    name: "The Secret Map",
    description: "A hidden map behind the bookshelf...",
    icon: "🗺️",
    price: 25,
    rarity: "rare",
  },
  {
    id: "lore-founders",
    category: "lore_card",
    name: "The Founders' Tale",
    description: "Who built the Story Pros world?",
    icon: "📜",
    price: 40,
    rarity: "legendary",
  },

  // Airplane tricks (visual animations)
  {
    id: "trick-loop",
    category: "airplane_trick",
    name: "Loop-de-Loop",
    description: "Your plane does a loop!",
    icon: "🔄",
    price: 15,
    rarity: "common",
  },
  {
    id: "trick-barrel",
    category: "airplane_trick",
    name: "Barrel Roll",
    description: "Spin through the air!",
    icon: "🌀",
    price: 25,
    rarity: "uncommon",
  },
  {
    id: "trick-skywrite",
    category: "airplane_trick",
    name: "Sky Writer",
    description: "Write your name in the clouds.",
    icon: "☁️",
    price: 35,
    rarity: "rare",
  },
  {
    id: "trick-sonic",
    category: "airplane_trick",
    name: "Sonic Boom",
    description: "Break the sound barrier!",
    icon: "💥",
    price: 60,
    rarity: "legendary",
  },
];

// ── Persisted owned items (per child) ──
// localStorage = synchronous cache; owned_collectibles table = source of truth

const SHOP_KEY = "storypros_shop";

function loadOwnedItems(): Map<string, Set<string>> {
  try {
    const raw = localStorage.getItem(SHOP_KEY);
    if (raw) {
      const obj = JSON.parse(raw) as Record<string, string[]>;
      const map = new Map<string, Set<string>>();
      for (const [k, v] of Object.entries(obj)) {
        map.set(k, new Set(v));
      }
      return map;
    }
  } catch {
    /* ignore */
  }
  return new Map();
}

function saveOwnedItems(): void {
  try {
    const obj: Record<string, string[]> = {};
    for (const [k, v] of ownedItems.entries()) {
      obj[k] = [...v];
    }
    localStorage.setItem(SHOP_KEY, JSON.stringify(obj));
  } catch {
    /* ignore */
  }
}

const ownedItems = loadOwnedItems();

function getOwned(childId: string): Set<string> {
  if (!ownedItems.has(childId)) {
    // Everyone starts with the classic plane
    ownedItems.set(childId, new Set(["plane-classic"]));
    saveOwnedItems();
  }
  return ownedItems.get(childId)!;
}

/**
 * Pull a child's owned collectibles from Supabase into the cache.
 * No-op for demo children. Called by AuthContext on child switch.
 */
export async function hydrateOwnedFromCloud(childId: string): Promise<void> {
  if (!isCloudId(childId)) return;
  try {
    const { data, error } = await db
      .from("owned_collectibles")
      .select("collectible_id")
      .eq("child_id", childId);
    if (error) throw error;
    const ids = new Set((data ?? []).map((r: { collectible_id: string }) => r.collectible_id));
    ids.add("plane-classic"); // everyone owns the default plane
    ownedItems.set(childId, ids);
    saveOwnedItems();
    emitDataUpdated("collectibles");
  } catch (err) {
    logSyncError("hydrate collectibles")(err);
  }
}

/** Write-through a newly acquired collectible (purchase or badge) */
function syncOwnedToCloud(childId: string, collectibleId: string): void {
  if (!isCloudId(childId)) return;
  void db
    .from("owned_collectibles")
    .upsert(
      { child_id: childId, collectible_id: collectibleId },
      { onConflict: "child_id,collectible_id" },
    )
    .then(({ error }) => {
      if (error) logSyncError("insert collectible")(error);
    });
}

// ── Public API ──

export function getCatalog(): Collectible[] {
  return CATALOG;
}

export function getCatalogByCategory(category: CollectibleCategory): Collectible[] {
  return CATALOG.filter((c) => c.category === category);
}

export function getOwnedItems(childId: string): string[] {
  return [...getOwned(childId)];
}

export function isOwned(childId: string, collectibleId: string): boolean {
  return getOwned(childId).has(collectibleId);
}

export function purchaseItem(
  childId: string,
  collectibleId: string,
  currentPlanes: number,
): { success: boolean; error?: string; remaining?: number } {
  const item = CATALOG.find((c) => c.id === collectibleId);
  if (!item) return { success: false, error: "Item not found" };
  if (isOwned(childId, collectibleId)) return { success: false, error: "Already owned" };
  if (item.price > currentPlanes) return { success: false, error: "Not enough Coins" };

  getOwned(childId).add(collectibleId);
  saveOwnedItems();
  syncOwnedToCloud(childId, collectibleId);
  return { success: true, remaining: currentPlanes - item.price };
}

export function awardBadge(childId: string, badgeId: string): boolean {
  const item = CATALOG.find((c) => c.id === badgeId && c.category === "badge");
  if (!item) return false;
  const owned = getOwned(childId);
  if (owned.has(badgeId)) return false;
  owned.add(badgeId);
  saveOwnedItems();
  syncOwnedToCloud(childId, badgeId);
  return true;
}

export const CATEGORY_META: Record<CollectibleCategory, { label: string; icon: string }> = {
  airplane_design: { label: "Planes", icon: "✈️" },
  badge: { label: "Badges", icon: "🏅" },
  wallpaper: { label: "Wallpapers", icon: "🖼️" },
  lore_card: { label: "Lore", icon: "📜" },
  airplane_trick: { label: "Tricks", icon: "🌀" },
};
