/* ─────────────────────────────────────────────
 * Demo Screen
 * A no-signup picker: choose a canned demo persona and
 * explore Story Pros immediately, with full access to every
 * screen and the ability to switch between parent/child, SLP,
 * and teacher views (from Settings) to see the differences.
 * ───────────────────────────────────────────── */
import { useAuth } from "@/contexts/AuthContext";
import { DEMO_PERSONAS } from "@/services/demoAccounts";
import { AuthBackdrop, StoryProsLogo } from "./StoryProsBrand";
import { ChevronRightIcon } from "./StoryProsUi";

interface DemoScreenProps {
  onSelect: () => void;
  onBack: () => void;
}

export function DemoScreen({ onSelect, onBack }: DemoScreenProps) {
  const { startDemoSession } = useAuth();

  function handlePick(personaId: string) {
    startDemoSession(personaId);
    onSelect();
  }

  return (
    <div className="relative flex h-full flex-col bg-cream">
      <AuthBackdrop />

      <div className="relative z-10 flex h-full flex-col overflow-y-auto no-scrollbar px-6 pb-8">
        <StoryProsLogo layout="row" size="sm" className="mx-auto pt-6" />

        <h1 className="mt-5 text-center font-display text-[28px] font-extrabold leading-tight text-primary">
          Try a Demo Account
        </h1>
        <p className="mt-2 text-center text-sm font-medium text-ink-soft">
          Explore every screen — no sign-up needed. Pick a name below, then switch
          between parent/child, SLP, and teacher views anytime from Settings.
        </p>

        <div className="mt-6 space-y-3">
          {DEMO_PERSONAS.map((persona) => (
            <button
              key={persona.id}
              onClick={() => handlePick(persona.id)}
              className="press-pop hover-lift flex w-full items-center gap-3 rounded-[24px] border border-accent/60 bg-card p-4 text-left shadow-card transition-all"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-xl font-extrabold text-primary shadow-card">
                {persona.displayName.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-extrabold text-primary">{persona.displayName}</p>
                <p className="text-xs font-semibold text-ink-soft">
                  Full access · switch views anytime
                </p>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                <ChevronRightIcon className="h-5 w-5" />
              </span>
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <button
          type="button"
          onClick={onBack}
          className="mt-6 w-full text-center text-sm font-bold text-primary hover:text-primary/80 transition-colors"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
