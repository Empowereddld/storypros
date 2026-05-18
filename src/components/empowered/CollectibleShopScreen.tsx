/* ─────────────────────────────────────────────
 * Paper Planes Collectible Shop
 * Five category tabs, purchase flow, badge display.
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
  legendary: "bg-secondary/20 text-secondary-foreground",
};

export function CollectibleShopScreen({ onClose }: CollectibleShopScreenProps) {
  const { activeChild } = useAuth();
  const childId = activeChild?.id ?? "default";

  const [activeTab, setActiveTab] = useState<CollectibleCategory>("airplane_design");
  const [selectedItem, setSelectedItem] = useState<Collectible | null>(null);
  const [planes, setPlanes] = useState(getPaperPlanes());
  const [justPurchased, setJustPurchased] = useState<string | null>(null);

  const items = getCatalogByCategory(activeTab);

  function handlePurchase(item: Collectible) {
    const result = purchaseItem(childId, item.id, planes);
    if (result.success && result.remaining !== undefined) {
      spendPaperPlanes(item.price);
      setPlanes(result.remaining);
      setJustPurchased(item.id);
      setTimeout(() => setJustPurchased(null), 1500);
      setSelectedItem(null);
    }
  }

  return (
    <div className="flex h-full flex-col bg-cream">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-card text-primary"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h2 className="font-display text-xl font-extrabold text-primary">Shop</h2>
        </div>

        {/* Paper Planes balance */}
        <div className="flex items-center gap-1.5 rounded-full bg-secondary/20 px-3 py-1.5">
          <span className="text-lg">✈️</span>
          <span className="text-sm font-extrabold text-primary">{planes}</span>
        </div>
      </header>

      {/* Category tabs */}
      <div className="flex gap-1 overflow-x-auto px-5 py-2 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const meta = CATEGORY_META[cat];
          const active = activeTab === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold transition-all whitespace-nowrap",
                active
                  ? "bg-primary text-primary-foreground shadow-[0_2px_0_0_var(--primary-deep)] -translate-y-0.5"
                  : "bg-card text-ink-soft hover:bg-cream-deep",
              )}
            >
              <span>{meta.icon}</span>
              {meta.label}
            </button>
          );
        })}
      </div>

      {/* Items grid */}
      <div className="flex-1 overflow-y-auto px-5 pt-2 pb-5 no-scrollbar">
        {activeTab === "badge" && (
          <p className="mb-3 text-xs font-semibold text-ink-soft text-center">
            Badges are earned automatically through your adventures!
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => {
            const owned = isOwned(childId, item.id);
            const justBought = justPurchased === item.id;

            return (
              <button
                key={item.id}
                onClick={() => !owned && setSelectedItem(item)}
                disabled={owned}
                className={cn(
                  "relative flex flex-col items-center rounded-3xl bg-card p-4 shadow-card text-center transition-all",
                  owned
                    ? "opacity-75"
                    : "hover:shadow-lg hover:-translate-y-0.5 active:scale-95",
                  justBought && "animate-pop-in",
                )}
              >
                {/* Rarity badge */}
                <span
                  className={cn(
                    "absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                    RARITY_COLORS[item.rarity],
                  )}
                >
                  {item.rarity}
                </span>

                {/* Icon */}
                <span className="text-4xl mt-2 mb-2">{item.icon}</span>

                {/* Name */}
                <p className="text-sm font-bold text-primary leading-tight">{item.name}</p>

                {/* Price or owned */}
                <div className="mt-2">
                  {owned ? (
                    <span className="text-xs font-bold text-success">
                      {item.category === "badge" ? "Earned!" : "Owned"}
                    </span>
                  ) : item.price === 0 ? (
                    <span className="text-xs font-bold text-ink-soft">
                      {item.category === "badge" ? "Not earned yet" : "Free"}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-primary">
                      <span>✈️</span> {item.price}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Purchase modal */}
      {selectedItem && (
        <PurchaseModal
          item={selectedItem}
          planes={planes}
          onPurchase={() => handlePurchase(selectedItem)}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}

// ── Purchase confirmation modal ──

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
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-ink/40">
      <div className="w-full rounded-t-3xl bg-card p-6 shadow-2xl animate-slide-up">
        <div className="text-center">
          <span className="text-6xl block mb-3">{item.icon}</span>
          <h3 className="font-display text-xl font-extrabold text-primary">{item.name}</h3>
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
          <TactileButton onClick={onPurchase} disabled={!canAfford}>
            {canAfford ? "Buy it!" : "Not enough"}
          </TactileButton>
          <TactileButton variant="ghost" onClick={onClose}>
            Maybe later
          </TactileButton>
        </div>
      </div>
    </div>
  );
}
