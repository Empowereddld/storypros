/* ---------------------------------------------
 * Paper Planes Collectible Shop
 * Rebuilt from the "Shop" mockup: logo + currency
 * header, category chips, pastel item cards, and a
 * product-detail purchase sheet. Catalog / purchase /
 * ownership logic and Paper Planes spend preserved.
 * --------------------------------------------- */

import { useState, type ReactNode } from "react";
import { TactileButton } from "./TactileButton";
import { useAuth } from "@/contexts/AuthContext";
import { getPaperPlanes, spendPaperPlanes } from "@/services/progress";
import {
  getCatalogByCategory,
  isOwned,
  purchaseItem,
  type CollectibleCategory,
  type Collectible,
} from "@/services/shop";
import { cn } from "@/lib/utils";
import dariaAndFriend from "@/assets/dan-daria-airplane.webp";
import danDariaSurprised from "@/assets/dan-daria-surprised.webp";
import { MiniPlane, Star, StoryProsLogo } from "./StoryProsBrand";
import { ChevronRightIcon, CurrencyBadge, PaperPlaneIcon } from "./StoryProsUi";

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

const CATEGORY_TREATMENT: Record<
  CollectibleCategory,
  { label: string; shortLabel: string; description: string; className: string }
> = {
  airplane_design: {
    label: "Paper Planes",
    shortLabel: "Planes",
    description: "New looks for your story plane",
    className: "from-sky/70 via-card to-accent/70 text-primary",
  },
  badge: {
    label: "Badges",
    shortLabel: "Badges",
    description: "Milestones you earn by playing",
    className: "from-secondary/45 via-card to-accent/50 text-secondary-foreground",
  },
  wallpaper: {
    label: "Wallpapers",
    shortLabel: "Walls",
    description: "Backgrounds for your adventure map",
    className: "from-success/25 via-card to-sky/60 text-success",
  },
  lore_card: {
    label: "Character Lore",
    shortLabel: "Lore",
    description: "Dan, Daria, and Story Pros extras",
    className: "from-accent/70 via-card to-secondary/20 text-primary",
  },
  airplane_trick: {
    label: "Plane Tricks",
    shortLabel: "Tricks",
    description: "Little flight animations to collect",
    className: "from-coral/25 via-card to-secondary/25 text-coral",
  },
};

export function CollectibleShopScreen({ onClose }: CollectibleShopScreenProps) {
  const { activeChild } = useAuth();
  const childId = activeChild?.id ?? "default";

  const [activeTab, setActiveTab] = useState<CollectibleCategory>("airplane_design");
  const [selectedItem, setSelectedItem] = useState<Collectible | null>(null);
  const [planes, setPlanes] = useState(getPaperPlanes());
  const [justPurchased, setJustPurchased] = useState<Collectible | null>(null);

  const items = getCatalogByCategory(activeTab).filter((item) => item.id !== "badge-5-streak");

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
        <div className="absolute inset-0 bg-gradient-to-b from-white via-accent/10 to-sky/20" />
        <Star className="absolute left-8 top-24 h-5 w-5 text-secondary animate-sparkle" />
        <Star className="absolute right-10 top-40 h-6 w-6 text-secondary animate-sparkle" />
        <Star className="absolute left-12 bottom-36 h-4 w-4 text-primary/25 animate-sparkle" />
        <MiniPlane className="absolute right-12 top-28 h-9 w-9 rotate-12 text-secondary animate-float" />
      </div>

      {/* Header */}
      <header className="relative z-30 flex items-center justify-between gap-2 px-4 pb-1 pt-4">
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
        <StoryProsLogo layout="row" size="sm" className="min-w-0 shrink" />
        <CurrencyBadge count={planes} className="bg-card px-2.5 shadow-card" />
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar px-4 pb-6 pt-3">
        {/* Intro */}
        <div className="relative min-h-[248px] overflow-hidden rounded-[34px] border-2 border-card bg-card p-5 shadow-soft animate-pop-in">
          <div className="relative z-10">
            <p className="text-xs font-extrabold uppercase tracking-wider text-secondary-deep">
              Story Pros Shop
            </p>
            <h1 className="mt-1 text-[46px] font-extrabold leading-none text-primary">Shop</h1>
            <p className="mt-3 max-w-[164px] text-base font-semibold leading-snug text-ink-soft">
              Spend Paper Planes on V1 collectibles for your story world.
            </p>
          </div>
          <div className="absolute bottom-4 left-5 z-10 flex items-center gap-2 rounded-full bg-secondary/20 px-3 py-1.5 text-xs font-extrabold text-secondary-foreground">
            <PaperPlaneIcon className="h-4 w-4" />
            Paper Planes only
          </div>
          <img
            src={dariaAndFriend}
            alt=""
            className="absolute -right-16 bottom-0 h-56 w-auto object-contain"
          />
        </div>

        {/* Category chips */}
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => {
            const meta = CATEGORY_TREATMENT[cat];
            const active = activeTab === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={cn(
                  "press-pop flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-bold transition-all",
                  active
                    ? "bg-primary text-primary-foreground shadow-[0_4px_0_var(--primary-deep)]"
                    : "border border-accent bg-card text-ink-soft shadow-card hover:text-primary",
                )}
              >
                <CategoryIcon category={cat} className="h-4 w-4" />
                {meta.shortLabel}
              </button>
            );
          })}
        </div>

        {activeTab === "badge" && (
          <p className="mt-3 rounded-2xl bg-accent/40 p-3 text-center text-xs font-semibold text-ink-soft">
            Badges are earned automatically through your adventures!
          </p>
        )}

        <div
          className={cn(
            "mt-3 flex items-center justify-between overflow-hidden rounded-[28px] bg-gradient-to-br p-4 shadow-card",
            CATEGORY_TREATMENT[activeTab].className,
          )}
        >
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider opacity-75">Collection</p>
            <h2 className="mt-1 text-xl font-extrabold leading-tight">{CATEGORY_TREATMENT[activeTab].label}</h2>
            <p className="mt-1 max-w-[190px] text-xs font-semibold leading-snug text-ink-soft">
              {CATEGORY_TREATMENT[activeTab].description}
            </p>
          </div>
          <div className="flex h-20 w-24 shrink-0 items-center justify-center rounded-[24px] bg-card/80 text-primary shadow-card">
            <CategoryIcon category={activeTab} className="h-12 w-12" />
          </div>
        </div>

        {/* Item grid */}
        <div className="mt-3 grid grid-cols-2 gap-3 stagger-in">
          {items.map((item, i) => {
            const owned = isOwned(childId, item.id);
            return (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={cn(
                  "relative flex min-h-[214px] flex-col items-center overflow-hidden rounded-[26px] border-2 border-accent/50 bg-card text-center shadow-card transition-all hover-lift active:scale-[0.98]",
                  owned && "border-success/35",
                )}
              >
                <span
                  className={cn(
                    "absolute right-2 top-2 z-10 rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase",
                    RARITY_COLORS[item.rarity],
                  )}
                >
                  {item.rarity}
                </span>
                <div
                  className={cn(
                    "flex h-28 w-full items-center justify-center",
                    TILE_TINTS[i % TILE_TINTS.length],
                  )}
                >
                  <ProductVisual item={item} size="sm" />
                </div>
                <div className="flex w-full flex-1 flex-col items-center p-3">
                  <p className="text-sm font-extrabold leading-tight text-ink">{item.name}</p>
                  <div className="mt-2">
                    {owned ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-bold text-success">
                        <CheckIcon /> {item.category === "badge" ? "Earned" : "Owned"}
                      </span>
                    ) : item.price === 0 ? (
                      <span className="inline-flex items-center rounded-full bg-accent/50 px-2.5 py-1 text-xs font-bold text-ink-soft">
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
          owned={isOwned(childId, selectedItem.id)}
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
            <div className="mx-auto mt-3 flex h-28 w-28 items-center justify-center rounded-[28px] bg-accent/45">
              <ProductVisual item={justPurchased} size="lg" />
            </div>
            <h3 className="mt-2 font-display text-xl font-extrabold text-primary">
              {justPurchased.name}
            </h3>
            <p className="mt-1 text-sm text-ink-soft">It's yours - find it in your collection.</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Purchase confirmation sheet

function PurchaseModal({
  item,
  planes,
  owned,
  onPurchase,
  onClose,
}: {
  item: Collectible;
  planes: number;
  owned: boolean;
  onPurchase: () => void;
  onClose: () => void;
}) {
  const canAfford = planes >= item.price;
  const isEarnedReward = item.category === "badge" && item.price === 0 && !owned;
  const showPrice = item.price > 0 && !owned;

  return (
    <div
      className="absolute inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-[36px] bg-card p-5 pb-7 shadow-soft animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-accent" />
        <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-accent/50 via-card to-sky/40 p-4">
          <Star className="absolute left-5 top-5 h-4 w-4 text-secondary animate-sparkle" />
          <MiniPlane className="absolute right-5 top-6 h-6 w-6 rotate-12 text-secondary/70 animate-float" />
          <div className="mx-auto flex h-40 w-full items-center justify-center">
            <ProductVisual item={item} size="xl" />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span
                className={cn(
                  "inline-block rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase",
                  RARITY_COLORS[item.rarity],
                )}
              >
                {item.rarity}
              </span>
              <h3 className="mt-2 font-display text-2xl font-extrabold leading-tight text-primary">{item.name}</h3>
            </div>
            {showPrice ? (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-secondary/25 px-3 py-2 text-lg font-extrabold text-secondary-foreground">
                <PaperPlaneIcon className="h-5 w-5" />
                {item.price}
              </span>
            ) : owned ? (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success/15 px-3 py-2 text-xs font-extrabold text-success">
                <CheckIcon />
                Owned
              </span>
            ) : null}
          </div>

          <p className="mt-2 text-sm font-semibold leading-snug text-ink-soft">{item.description}</p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <FeatureChip icon={<CategoryIcon category={item.category} className="h-4 w-4" />} label={CATEGORY_TREATMENT[item.category].shortLabel} />
            <FeatureChip icon={<PaperPlaneIcon className="h-4 w-4" />} label={item.price === 0 ? "Earned" : "Unlock"} />
            <FeatureChip icon={<CheckIcon />} label="Story-ready" />
          </div>

          <div className="mt-4 flex items-center justify-between rounded-[22px] bg-accent/35 px-4 py-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-ink-soft">Your balance</span>
            <span className="inline-flex items-center gap-1 text-sm font-extrabold text-primary">
              <PaperPlaneIcon className="h-4 w-4 text-secondary" />
              {planes}
            </span>
          </div>

          {!owned && !isEarnedReward && !canAfford && (
            <p className="mt-3 rounded-2xl bg-destructive/10 p-3 text-center text-sm font-semibold text-destructive">
              You need {item.price - planes} more Paper Planes!
            </p>
          )}

          {isEarnedReward && (
            <p className="mt-3 rounded-2xl bg-accent/40 p-3 text-center text-sm font-semibold text-primary">
              This badge unlocks automatically when you reach its story goal.
            </p>
          )}
        </div>

        <div className="mt-5 space-y-3">
          <TactileButton
            variant="secondary"
            onClick={owned || isEarnedReward ? onClose : onPurchase}
            disabled={!owned && !isEarnedReward && !canAfford}
            leadingIcon={owned ? <CheckIcon /> : <ChevronRightIcon className="h-5 w-5" />}
          >
            {owned
              ? "In your collection"
              : isEarnedReward
                ? "Got it"
                : canAfford
                  ? `Unlock for ${item.price}`
                  : "Not enough Paper Planes"}
          </TactileButton>
          <TactileButton variant="ghost" onClick={onClose}>
            Maybe later
          </TactileButton>
        </div>
      </div>
    </div>
  );
}

function FeatureChip({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="flex min-h-[54px] flex-col items-center justify-center gap-1 rounded-2xl bg-card/85 px-2 py-2 text-center text-[10px] font-extrabold leading-tight text-primary shadow-card">
      <span className="text-primary">{icon}</span>
      {label}
    </span>
  );
}

function CategoryIcon({
  category,
  className = "h-5 w-5",
}: {
  category: CollectibleCategory;
  className?: string;
}) {
  switch (category) {
    case "airplane_design":
      return <PaperPlaneIcon className={className} />;
    case "badge":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
          <circle cx="12" cy="14" r="5" />
          <path d="M8 3l4 6 4-6" strokeLinejoin="round" />
          <path d="m10.5 14 1 1 2.5-2.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "wallpaper":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
          <rect x="4" y="5" width="16" height="14" rx="3" />
          <path d="m7 16 3.5-4 2.5 3 2-2 2 3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="15.5" cy="9.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "lore_card":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
          <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H19v18H8.5A3.5 3.5 0 0 0 5 23V5.5Z" />
          <path d="M9 7h6M9 11h5" strokeLinecap="round" />
        </svg>
      );
    case "airplane_trick":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
          <path d="M4 14c4-6 10 4 16-2" strokeLinecap="round" />
          <path d="M15 7l5 5-6 3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

function ProductVisual({ item, size }: { item: Collectible; size: "sm" | "lg" | "xl" }) {
  const sizeClass = size === "xl" ? "h-36 w-36" : size === "lg" ? "h-24 w-24" : "h-20 w-20";
  const planeTone =
    item.id.includes("ocean")
      ? "text-sky"
      : item.id.includes("golden")
        ? "text-secondary"
        : item.id.includes("rainbow")
          ? "text-coral"
          : "text-primary";

  if (item.category === "airplane_design") {
    return (
      <div className={cn("relative flex items-center justify-center", sizeClass, planeTone)}>
        <svg viewBox="0 0 120 120" className="h-full w-full drop-shadow-lg" fill="none" aria-hidden>
          <path d="M104 16 18 53l34 12 15 39 37-88Z" fill="currentColor" opacity="0.96" />
          <path d="M52 65 104 16 67 104" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
          <path d="M18 53 52 65 42 80" fill="white" opacity="0.28" />
          {item.id.includes("ocean") && (
            <>
              <path d="M36 54c7-7 13 7 21 0s14 7 22-1" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
              <path d="M51 72c6-5 12 5 18 0s11 5 17-1" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
            </>
          )}
          {item.id.includes("star") || item.id.includes("golden") ? (
            <>
              <path d="m49 42 2 4.5 5 .7-3.6 3.4.9 4.9-4.3-2.3-4.3 2.3.9-4.9-3.6-3.4 5-.7L49 42Z" fill="white" />
              <path d="m74 52 1.6 3.4 3.7.5-2.6 2.6.6 3.7-3.3-1.8-3.3 1.8.6-3.7-2.6-2.6 3.7-.5L74 52Z" fill="white" />
            </>
          ) : null}
        </svg>
      </div>
    );
  }

  if (item.category === "badge") {
    return (
      <div className={cn("relative flex items-center justify-center", sizeClass)}>
        <div className="absolute inset-2 rounded-full bg-secondary shadow-[0_6px_0_var(--secondary-deep)]" />
        <div className="absolute inset-5 rounded-full bg-card/75" />
        <Star className="relative h-10 w-10 text-primary" />
      </div>
    );
  }

  if (item.category === "wallpaper") {
    return (
      <div className={cn("relative", sizeClass)}>
        <div className="absolute left-5 top-4 h-20 w-16 rotate-[-10deg] rounded-2xl bg-sky shadow-card" />
        <div className="absolute left-9 top-2 h-20 w-16 rotate-[8deg] rounded-2xl bg-success/70 shadow-card" />
        <div className="absolute left-2 top-9 h-20 w-16 rotate-[-2deg] rounded-2xl bg-secondary/65 shadow-card" />
        <MiniPlane className="absolute left-9 top-12 h-8 w-8 text-primary" />
      </div>
    );
  }

  if (item.category === "lore_card") {
    return (
      <div className={cn("relative flex items-center justify-center", sizeClass)}>
        <div className="h-24 w-20 rotate-[-4deg] rounded-[22px] border-4 border-card bg-primary shadow-card" />
        <div className="absolute h-16 w-12 rounded-2xl bg-secondary/90" />
        <div className="absolute bottom-6 h-2 w-12 rounded-full bg-card/75" />
      </div>
    );
  }

  return (
    <div className={cn("relative flex items-center justify-center", sizeClass)}>
      <svg viewBox="0 0 120 120" className="h-full w-full text-coral drop-shadow-lg" fill="none" aria-hidden>
        <path d="M22 70c18-30 46 14 76-18" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
        <path d="M73 34 99 52 70 67" fill="currentColor" />
        <path d="M32 88c10-8 19 8 30-2" stroke="var(--secondary)" strokeWidth="8" strokeLinecap="round" />
      </svg>
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
