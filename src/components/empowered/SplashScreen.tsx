/* ─────────────────────────────────────────────
 * Splash Screen — first screen on launch
 * Rebuilt from the "Story Pros App Splash" mockup:
 * centered logo + tagline, Dan & Daria, soft
 * cloud/star backdrop. Tap anywhere to begin.
 * ───────────────────────────────────────────── */

import dariaAndFriend from "@/assets/daria-and-friend.webp";
import { AuthBackdrop, StoryProsLogo } from "./StoryProsBrand";

interface SplashScreenProps {
  onContinue: () => void;
}

export function SplashScreen({ onContinue }: SplashScreenProps) {
  return (
    <button
      onClick={onContinue}
      className="relative h-full w-full overflow-hidden text-left"
      aria-label="Tap to begin"
    >
      <AuthBackdrop />

      {/* Logo + tagline */}
      <div className="relative z-10 px-6 pt-20">
        <StoryProsLogo layout="stacked" size="lg" tagline className="animate-pop-in" />
      </div>

      {/* Characters */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center">
        {/* soft purple hill */}
        <div className="absolute bottom-0 left-0 right-0 h-48 rounded-t-[100%] bg-gradient-to-b from-accent/60 to-accent/30" aria-hidden />
        <img
          src={dariaAndFriend}
          alt="Dan and Daria"
          className="relative w-[86%] max-w-[330px] object-contain drop-shadow-[0_18px_30px_rgba(28,28,21,0.18)] animate-float"
        />
      </div>

      {/* Tap hint */}
      <div className="absolute bottom-5 left-0 right-0 z-20 text-center">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary/55">
          Tap to begin
        </span>
      </div>
    </button>
  );
}
