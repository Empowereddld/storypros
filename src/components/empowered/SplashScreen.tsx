import danDariaThumbsUp from "@/assets/dan-daria-thumbsup.webp";
import { AuthBackdrop, MiniPlane, StoryProsLogo } from "./StoryProsBrand";

interface SplashScreenProps {
  onContinue: () => void;
}

export function SplashScreen({ onContinue }: SplashScreenProps) {
  return (
    <button
      onClick={onContinue}
      className="relative h-full w-full overflow-hidden bg-cream text-left"
      aria-label="Tap to begin"
    >
      <AuthBackdrop />
      <MiniPlane className="absolute left-7 top-24 z-10 h-12 w-12 -rotate-12 text-primary/20" />
      <MiniPlane className="absolute right-8 top-80 z-10 h-12 w-12 rotate-12 text-secondary/55" />

      <div className="relative z-10 flex h-full flex-col items-center px-6 pb-0 pt-16 text-center">
        <StoryProsLogo layout="stacked" size="md" tagline className="animate-pop-in" />

        <div className="relative mt-8 flex w-full flex-1 items-end justify-center">
          <span className="absolute inset-x-[-2rem] bottom-0 h-64 rounded-t-[55%] bg-gradient-to-b from-accent/35 to-primary/25" />
          <span className="absolute inset-x-[-2rem] bottom-0 h-40 bg-gradient-to-t from-primary/25 to-transparent" />
          <img
            src={danDariaThumbsUp}
            alt="Dan and Daria"
            className="relative z-10 h-[82%] max-h-[560px] w-auto object-contain object-bottom drop-shadow-[0_18px_30px_rgba(28,28,21,0.18)] animate-float"
          />
        </div>
      </div>

      <div className="absolute bottom-5 left-0 right-0 z-20 text-center">
        <span className="rounded-full bg-card/85 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-primary/65 shadow-card">
          Tap to begin
        </span>
      </div>
    </button>
  );
}
