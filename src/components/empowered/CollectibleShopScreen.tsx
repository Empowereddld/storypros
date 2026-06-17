/* ─────────────────────────────────────────────
 * Paper Planes Collectible Shop
 * Rebuilt from the "Shop" mockup: logo + currency
 * header, category chips, pastel item cards, and a
 * product-detail purchase sheet. Catalog / purchase /
 * ownership logic and Paper Planes spend preserved.
 * ───────────────────────────────────────────── */

import { useState } from "react";
import { TactileButton } from "./TactileButton";
import { useAuth } from "@/contexts/AuthContext";
import { getPaperPlanes, spendPaperPlanes } from "@/services/progress";
import {
  getCatalogByCategory,
  isOwned,
  purchaseItem,
  CATEGORY_META,
  type CollectibleCategory,
  type Collectible,
} from "@/services/shop";
import { cn } from "@/lib/utils";
import dariaAndFriend from "@/assets/daria-and-friend.webp";
import { StoryProsLogo, CurrencyBadge } from "./StoryProsBrand";

interface CollectibleShopScreenProps {
  onClose: () => void;
}

const CATEGORIES: CollectibleCategory[] = [
  "airplane_design",
  "badge",
  "wallpaper",
  "lore_card",
  "airplane_trick",
];

const RARITY_COLORS: Record<string, string> = {
  common: "bg-ink-soft/20 text-ink-soft",
  uncommon: "bg-success/20 text-success",
  rare: "bg-primary/20 text-primary",
  legendary: "bg-secondary/30 text-secondary-foreground",
};

const TILE_TINTS = ["bg-accent/40", "bg-sky/50", "bg-secondary/15", "bg-success/15", "bg-coral/15"];

export function CollectibleShopScreen({ onClose }: CollectibleShopScreenProps) {
  const { activeChild } = useAuth();
  const childId = activeChild?.id ?? "default";

  const [activeTab, setActiveTab] = useState<CollectibleCategory>("airplane_design");
  const [selectedItem, setSelectedItem] = useState<Collectible | null>(null);
  const [planes, setPlanes] = useState(getPaperPlanes());
  const [justPurchased, setJustPurchased] = useState<Collectible | null>(null);

  const items = getCatalogByCategory(activeTab);

  function handlePurchase(item: Collectible) {
    const result = purchaseItem(childId, item.id, planes);
    if (result.success && result.remaining !== undefined) {
      spendPaperPlanes(item.price);
      setPlanes(result.remaining);
      setSelectedItem(null);
      setJustPurchased(item);
      setTimeout(() => setJustPurchased(null), 1800);
    }
  }

  return (
    <div className="relative flex h-full flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-2 bg-card/95 px-4 py-3 backdrop-blur">
        <button
          onClick={onClose}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-soft transition-colors hover:bg-accent/60 active:scale-95"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <StoryProsLogo layout="row" size="sm" />
        <CurrencyBadge count={planes} />
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-6 pt-2">
        {/* Intro */}
        <div className="flex items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl font-extrabold text-primary">Shop</h1>
            <p className="mt-0.5 max-w-[12rem] text-sm text-ink-soft">
              Spend your Paper Planes and make your story world yours!
            </p>
          </div>
          <img src={dariaAndFriend} alt="" className="h-20 w-auto object-contain" />
        </div>

        {/* Category chips */}
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => {
            const meta = CATEGORY_META[cat];
            const active = activeTab === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-bold transition-all",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "border border-accent bg-card text-ink-soft hover:text-primary",
                )}
              >
                <span>{meta.icon}</span>
                {meta.label}
              </button>
            );
          })}
        </div>

        {activeTab === "badge" && (
          <p className="mt-3 rounded-2xl bg-accent/40 p-3 text-center text-xs font-semibold text-ink-soft">
            Badges are earned automatically through your adventures!
          </p>
        )}

        {/* Item grid */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          {items.map((item, i) => {
            const owned = isOwned(childId, item.id);
            return (
              <button
                key={item.id}
                onClick={() => !owned && setSelectedItem(item)}
                disabled={owned}
                className={cn(
                  "relative flex flex-col items-center overflow-hidden rounded-3xl border border-accent/50 bg-card text-center shadow-card transition-all",
                  owned ? "opacity-80" : "active:scale-[0.98]",
                )}
              >
                <span className={cn("absolute right-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase", RARITY_COLORS[item.rarity])}>
                  {item.rarity}
                </span>
                <span className={cn("flex h-24 w-full items-center justify-center text-4xl", TILE_TINTS[i % TILE_TINTS.length])}>
                  {item.icon}
                </span>
                <div className="flex w-full flex-1 flex-col items-center p-3">
                  <p className="text-sm font-extrabold leading-tight text-ink">{item.name}</p>
                  <div className="mt-2">
                    {owned ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-bold text-success">
                        ✓ {item.category === "badge" ? "Earned" : "Owned"}
                      </span>
                    ) : item.price === 0 ? (
                      <span className="text-xs font-bold text-ink-soft">
                        {item.category === "badge" ? "Not earned yet" : "Free"}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-secondary/20 px-2.5 py-1 text-xs font-extrabold text-secondary-foreground">
                        ✈️ {item.price}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Purchase sheet */}
      {selectedItem && (
        <PurchaseModal
          item={selectedItem}
          planes={planes}
          onPurchase={() => handlePurchase(selectedItem)}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {/* Reward unlocked celebration */}
      {justPurchased && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm">
          <div className="mx-6 w-full max-w-xs rounded-[28px] bg-card p-6 text-center shadow-soft animate-pop-in">
            <p className="text-sm font-extrabold uppercase tracking-wider text-secondary-foreground">Reward Unlocked!</p>
            <span className="mt-3 block text-6xl">{justPurchased.icon}</span>
            <h3 className="mt-2 font-display text-xl font-extrabold text-primary">{justPurchased.name}</h3>
            <p className="mt-1 text-sm text-ink-soft">It's yours — find it in My Collection.</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Purchase confirmation sheet ──

function PurchaseModal({
  item,
  planes,
  onPurchase,
  onClose,
}: {
  item: Collectible;
  planes: number;
  onPurchase: () => void;
  onClose: () => void;
}) {
  const canAfford = planes >= item.price;

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-ink/40" onClick={onClose}>
      <div className="w-full rounded-t-[32px] bg-card p-6 pb-8 shadow-soft animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted" />
        <div className="text-center">
          <span className="mb-3 block text-6xl">{item.icon}</span>
          <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase", RARITY_COLORS[item.rarity])}>
            {item.rarity}
          </span>
          <h3 className="mt-2 font-display text-xl font-extrabold text-primary">{item.name}</h3>
          <p className="mt-1 text-sm text-ink-soft">{item.description}</p>

          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-lg">✈️</span>
            <span className="text-2xl font-extrabold text-primary">{item.price}</span>
            <span className="text-sm text-ink-soft">Paper Planes</span>
          </div>

          {!canAfford && (
            <p className="mt-2 text-sm font-semibold text-destructive">
              You need {item.price - planes} more Paper Planes!
            </p>
          )}
        </div>

        <div className="mt-5 space-y-3">
          <TactileButton variant="secondary" onClick={onPurchase} disabled={!canAfford}>
            {canAfford ? "Unlock " + item.price + " ✈️" : "Not enough"}
          </TactileButton>
          <TactileButton variant="ghost" onClick={onClose}>
            Maybe later
          </TactileButton>
        </div>
      </div>
    </div>
  );
}
