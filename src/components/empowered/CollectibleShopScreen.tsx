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
import dariaAndFriend from "@/assets/dan-daria-airplane.webp";
import danDariaSurprised from "@/assets/dan-daria-surprised.webp";
import { MiniPlane, Star, StoryProsLogo } from "./StoryProsBrand";
import { CurrencyBadge, PaperPlaneIcon } from "./StoryProsUi";

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
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-accent/10 to-accent/35" />
        <div className="absolute -left-20 top-28 h-52 w-60 rounded-full bg-accent/50 blur-3xl" />
        <div className="absolute -right-20 bottom-24 h-56 w-64 rounded-full bg-sky/40 blur-3xl" />
        <Star className="absolute left-8 top-24 h-5 w-5 text-secondary animate-sparkle" />
        <Star className="absolute right-10 top-40 h-6 w-6 text-secondary animate-sparkle" />
        <MiniPlane className="absolute right-12 top-28 h-9 w-9 rotate-12 text-secondary animate-float" />
      </div>

      {/* Header */}
      <header className="relative z-30 flex items-center justify-between gap-2 px-5 pb-1 pt-4">
        <button
          onClick={onClose}
          aria-label="Back"
          className="press-pop flex h-11 w-11 items-center justify-center rounded-full bg-card text-primary shadow-card"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            aria-hidden
          >
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <StoryProsLogo layout="row" size="md" className="scale-90" />
        <CurrencyBadge count={planes} className="bg-card shadow-card" />
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar px-4 pb-6 pt-3">
        {/* Intro */}
        <div className="relative min-h-[230px] overflow-hidden rounded-[34px] bg-card p-5 shadow-soft">
          <div>
            <h1 className="text-[44px] font-extrabold leading-none text-primary">Shop</h1>
            <p className="mt-3 max-w-[160px] text-base font-medium leading-snug text-ink-soft">
              Spend your Paper Planes and make your story world yours!
            </p>
          </div>
          <img
            src={dariaAndFriend}
            alt=""
            className="absolute -right-12 bottom-0 h-48 w-auto object-contain"
          />
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
                  "press-pop flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-bold transition-all",
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
        <div className="mt-3 grid grid-cols-2 gap-3 stagger-in">
          {items.map((item, i) => {
            const owned = isOwned(childId, item.id);
            return (
              <button
                key={item.id}
                onClick={() => !owned && setSelectedItem(item)}
                disabled={owned}
                className={cn(
                  "relative flex flex-col items-center overflow-hidden rounded-[26px] border border-accent/50 bg-card text-center shadow-card transition-all",
                  owned ? "opacity-80" : "hover-lift active:scale-[0.98]",
                )}
              >
                <span
                  className={cn(
                    "absolute right-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase",
                    RARITY_COLORS[item.rarity],
                  )}
                >
                  {item.rarity}
                </span>
                <span
                  className={cn(
                    "flex h-24 w-full items-center justify-center text-4xl",
                    TILE_TINTS[i % TILE_TINTS.length],
                  )}
                >
                  {item.icon}
                </span>
                <div className="flex w-full flex-1 flex-col items-center p-3">
                  <p className="text-sm font-extrabold leading-tight text-ink">{item.name}</p>
                  <div className="mt-2">
                    {owned ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-bold text-success">
                        <CheckIcon /> {item.category === "badge" ? "Earned" : "Owned"}
                      </span>
                    ) : item.price === 0 ? (
                      <span className="text-xs font-bold text-ink-soft">
                        {item.category === "badge" ? "Not earned yet" : "Free"}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-secondary/20 px-2.5 py-1 text-xs font-extrabold text-secondary-foreground">
                        <PaperPlaneIcon className="h-3.5 w-3.5" /> {item.price}
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
          <div className="mx-6 w-full max-w-xs rounded-[28px] bg-card p-6 text-center shadow-soft animate-bounce-in">
            <p className="text-sm font-extrabold uppercase tracking-wider text-secondary-foreground">
              Reward Unlocked!
            </p>
            <img
              src={danDariaSurprised}
              alt=""
              className="mx-auto mt-2 h-24 w-auto object-contain"
            />
            <span className="mt-3 block text-6xl">{justPurchased.icon}</span>
            <h3 className="mt-2 font-display text-xl font-extrabold text-primary">
              {justPurchased.name}
            </h3>
            <p className="mt-1 text-sm text-ink-soft">It's yours - find it in My Collection.</p>
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
    <div
      className="absolute inset-0 z-50 flex items-end justify-center bg-ink/40"
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-[32px] bg-card p-6 pb-8 shadow-soft animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted" />
        <div className="text-center">
          <span className="mb-3 block text-6xl">{item.icon}</span>
          <span
            className={cn(
              "inline-block rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase",
              RARITY_COLORS[item.rarity],
            )}
          >
            {item.rarity}
          </span>
          <h3 className="mt-2 font-display text-xl font-extrabold text-primary">{item.name}</h3>
          <p className="mt-1 text-sm text-ink-soft">{item.description}</p>

          <div className="mt-4 flex items-center justify-center gap-2">
            <PaperPlaneIcon className="h-6 w-6 text-secondary" />
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
            {canAfford ? `Unlock ${item.price}` : "Not enough"}
          </TactileButton>
          <TactileButton variant="ghost" onClick={onClose}>
            Maybe later
          </TactileButton>
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      aria-hidden
    >
      <path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
