/* ─────────────────────────────────────────────
 * Profile Selection — "Who's Reading Today?"
 * Pick which child is using the app (multi-child
 * households). Rebuilt from the mockup.
 * ───────────────────────────────────────────── */

import { useState } from "react";
import { TactileButton } from "./TactileButton";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { AuthBackdrop, StoryProsLogo, Star } from "./StoryProsBrand";

interface ProfileSelectionScreenProps {
  onSelected: () => void;
  onAddChild: () => void;
}

const AVATAR_TINTS = ["bg-accent", "bg-sky", "bg-secondary/30", "bg-success/25", "bg-coral/25"];

export function ProfileSelectionScreen({ onSelected, onAddChild }: ProfileSelectionScreenProps) {
  const { children, activeChild, setActiveChild } = useAuth();
  const [selectedId, setSelectedId] = useState<string | null>(activeChild?.id ?? children[0]?.id ?? null);

  function handleContinue() {
    const child = children.find((c) => c.id === selectedId);
    if (child) setActiveChild(child);
    onSelected();
  }

  return (
    <div className="relative flex h-full flex-col bg-cream">
      <AuthBackdrop />

      <div className="relative z-10 flex h-full flex-col px-6 pb-6 pt-8">
        <StoryProsLogo layout="row" size="sm" className="mx-auto" />

        <h1 className="mt-5 text-center font-display text-2xl font-extrabold text-primary">
          Who's Reading Today?
        </h1>
        <p className="mt-1 text-center text-sm font-medium text-ink-soft">Pick a profile to get started.</p>

        <div className="mt-6 flex-1 overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-2 gap-3">
            {children.map((child, i) => {
              const selected = selectedId === child.id;
              return (
                <button
                  key={child.id}
                  onClick={() => setSelectedId(child.id)}
                  className={cn(
                    "flex flex-col items-center gap-3 rounded-3xl border-2 bg-card p-5 shadow-card transition-all",
                    selected ? "border-primary -translate-y-0.5" : "border-transparent",
                  )}
                >
                  <span className={cn("flex h-20 w-20 items-center justify-center rounded-full text-3xl font-extrabold text-primary", AVATAR_TINTS[i % AVATAR_TINTS.length])}>
                    {child.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="flex items-center gap-1 font-extrabold text-primary">
                    {child.name}
                    {selected && <Star className="h-4 w-4 text-secondary" />}
                  </span>
                </button>
              );
            })}

            <button
              onClick={onAddChild}
              className="flex flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-primary/40 bg-card/50 p-5 text-primary transition-colors hover:bg-card"
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/60 text-3xl">+</span>
              <span className="text-sm font-bold">Add Profile</span>
            </button>
          </div>
        </div>

        <TactileButton className="mt-4" onClick={handleContinue} disabled={!selectedId}>
          Continue
        </TactileButton>
      </div>
    </div>
  );
}
