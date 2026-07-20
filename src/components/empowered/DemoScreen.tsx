/* ─────────────────────────────────────────────
 * Demo Screen
 * One demo account, two ways in:
 *   • Explore the app — seeded family, every screen open
 *   • Walk through onboarding — the full first-run flow
 * (The landing page's Demo button skips this screen and
 * jumps straight into Explore.)
 * ───────────────────────────────────────────── */
import { useAuth } from "@/contexts/AuthContext";
import { DEMO_PERSONA_ID } from "@/services/demoAccounts";
import { AuthBackdrop, StoryProsLogo } from "./StoryProsBrand";
import { ChevronRightIcon } from "./StoryProsUi";

interface DemoScreenProps {
  onSelect: () => void;
  /** Chosen when the visitor wants the full first-run experience */
  onSelectOnboarding: () => void;
  onBack: () => void;
}

export function DemoScreen({ onSelect, onSelectOnboarding, onBack }: DemoScreenProps) {
  const { startDemoSession } = useAuth();

  function handleExplore() {
    startDemoSession(DEMO_PERSONA_ID);
    onSelect();
  }

  function handleOnboardingWalkthrough() {
    startDemoSession(DEMO_PERSONA_ID, { onboarding: true });
    onSelectOnboarding();
  }

  return (
    <div className="relative flex h-full flex-col bg-cream">
      <AuthBackdrop />

      <div className="relative z-10 flex h-full flex-col overflow-y-auto no-scrollbar px-6 pb-8">
        <StoryProsLogo layout="row" size="sm" className="mx-auto pt-6" />

        <h1 className="mt-5 text-center font-display text-[28px] font-extrabold leading-tight text-primary">
          Try Story Pros
        </h1>
        <p className="mt-2 text-center text-sm font-medium text-ink-soft">
          No sign-up needed. Explore every screen freely, or experience the app
          exactly the way a new family does.
        </p>

        <div className="mt-6 space-y-3">
          <button
            onClick={handleExplore}
            className="press-pop hover-lift flex w-full items-center gap-3 rounded-[24px] border border-accent/60 bg-card p-4 text-left shadow-card transition-all"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-2xl shadow-card">
              🚀
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-extrabold text-primary">Explore the app</p>
              <p className="text-xs font-semibold text-ink-soft">
                Jump straight in with a sample family and some progress already earned
              </p>
            </div>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
              <ChevronRightIcon className="h-5 w-5" />
            </span>
          </button>

          <button
            onClick={handleOnboardingWalkthrough}
            className="press-pop hover-lift flex w-full items-center gap-3 rounded-[24px] border-2 border-primary/50 bg-primary/5 p-4 text-left shadow-card transition-all"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-2xl text-primary-foreground shadow-card">
              ✨
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-extrabold text-primary">Walk through onboarding</p>
              <p className="text-xs font-semibold text-ink-soft">
                The full first-run experience: intro, child setup, placement quiz, then home
              </p>
            </div>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
              <ChevronRightIcon className="h-5 w-5" />
            </span>
          </button>
        </div>

        <p className="mt-5 text-center text-xs font-semibold text-ink-soft">
          Once inside, use the yellow demo bar to replay onboarding or exit anytime.
        </p>

        <div className="flex-1" />

        <button
          type="button"
          onClick={onBack}
          className="mt-6 w-full text-center text-sm font-bold text-primary hover:text-primary/80 transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );
}
