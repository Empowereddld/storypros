/* ─────────────────────────────────────────────
 * Profile Selection — "Who's Reading Today?"
 * Pick which child is using the app (multi-child
 * households). Rebuilt from the mockup.
 * ───────────────────────────────────────────── */

import { useState } from "react";
import { TactileButton } from "./TactileButton";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import childAvatar from "@/assets/child-avatar.png";
import dariaSolo from "@/assets/daria-solo.png";
import { AuthBackdrop, MiniPlane, Star, StoryProsLogo } from "./StoryProsBrand";
import { ChevronRightIcon } from "./StoryProsUi";

interface ProfileSelectionScreenProps {
  onSelected: () => void;
  onAddChild: () => void;
}

const PROFILE_ART = [childAvatar, dariaSolo];

export function ProfileSelectionScreen({ onSelected, onAddChild }: ProfileSelectionScreenProps) {
  const { children, activeChild, setActiveChild } = useAuth();
  const [selectedId, setSelectedId] = useState<string | null>(
    activeChild?.id ?? children[0]?.id ?? null,
  );

  function handleContinue() {
    const child = children.find((c) => c.id === selectedId);
    if (child) setActiveChild(child);
    onSelected();
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-cream">
      <AuthBackdrop />
      <Star className="absolute left-9 top-28 z-10 h-5 w-5 text-secondary animate-sparkle" />
      <Star className="absolute right-10 top-36 z-10 h-4 w-4 text-primary/40 animate-sparkle" />
      <MiniPlane className="absolute right-8 top-20 z-10 h-8 w-8 rotate-[18deg] text-secondary animate-float" />

      <div className="relative z-10 flex h-full flex-col px-5 pb-5 pt-5">
        <StoryProsLogo layout="row" size="md" className="mx-auto scale-95" />

        <h1 className="mt-5 text-center font-display text-[30px] font-extrabold leading-tight text-primary">
          Who's Reading Today?
        </h1>
        <p className="mt-1 text-center text-[16px] font-semibold text-ink-soft">
          Pick a profile to get started.
        </p>

        <div className="mt-5 flex-1 overflow-y-auto no-scrollbar pb-2">
          <div className="grid grid-cols-2 gap-3 stagger-in">
            {children.map((child, i) => {
              const selected = selectedId === child.id;
              const art = PROFILE_ART[i % PROFILE_ART.length];
              return (
                <button
                  key={child.id}
                  onClick={() => setSelectedId(child.id)}
                  className={cn(
                    "group relative min-h-[270px] overflow-hidden rounded-[32px] border-[5px] bg-card text-left shadow-soft transition-all hover-lift",
                    selected
                      ? "border-primary -translate-y-0.5"
                      : "border-card hover:border-accent",
                  )}
                >
                  <span className="absolute inset-0 bg-gradient-to-b from-accent/80 via-card to-card" />
                  <Star className="absolute left-4 top-9 h-4 w-4 text-secondary" />
                  <Star className="absolute right-5 top-16 h-3.5 w-3.5 text-primary/35" />
                  <MiniPlane className="absolute right-4 top-5 h-7 w-7 rotate-[18deg] text-secondary" />

                  {selected && (
                    <span className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card">
                      <CheckIcon className="h-5 w-5" />
                    </span>
                  )}

                  <span className="relative block h-[150px] w-full overflow-hidden rounded-t-[24px]">
                    <img
                      src={art}
                      alt=""
                      className={cn(
                        "absolute bottom-[-16px] left-1/2 h-[185px] w-auto -translate-x-1/2 object-contain transition-transform duration-300 group-hover:scale-105",
                        i % 2 === 0 ? "scale-[1.12]" : "scale-[1.02]",
                      )}
                    />
                    <span className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />
                    <span className="absolute -bottom-10 -left-6 h-24 w-24 rounded-full bg-card" />
                    <span className="absolute -bottom-10 -right-6 h-24 w-24 rounded-full bg-card" />
                  </span>

                  <span className="relative flex min-h-[112px] flex-col items-center justify-end px-3 pb-5 text-center">
                    <span className="mb-1 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-4 border-card bg-accent shadow-card">
                      <img
                        src={art}
                        alt=""
                        className="h-full w-full object-cover object-top scale-[1.55]"
                      />
                    </span>
                    <span className="line-clamp-2 text-[27px] font-display font-extrabold leading-none text-primary">
                      {child.name}
                    </span>
                    {child.age ? (
                      <span className="mt-1 text-xs font-bold text-ink-soft">Age {child.age}</span>
                    ) : null}
                  </span>
                </button>
              );
            })}

            <button
              onClick={onAddChild}
              className="col-span-2 mt-1 flex min-h-[86px] items-center justify-center gap-4 rounded-[28px] border-2 border-dashed border-primary/35 bg-card/60 px-5 text-primary shadow-card transition-colors hover:bg-card"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-card bg-accent text-[36px] font-semibold shadow-card">
                +
              </span>
              <span className="font-display text-[25px] font-extrabold">Add Profile</span>
            </button>
          </div>
        </div>

        <TactileButton className="mt-4" onClick={handleContinue} disabled={!selectedId}>
          Continue <ChevronRightIcon className="h-6 w-6 text-secondary" />
        </TactileButton>
      </div>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      aria-hidden
    >
      <path d="M5 12.5l4.2 4.2L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
