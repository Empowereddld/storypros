import dariaAndFriend from "@/assets/daria-and-friend.webp";

interface SplashScreenProps {
  onContinue: () => void;
}

export function SplashScreen({ onContinue }: SplashScreenProps) {
  return (
    <button
      onClick={onContinue}
      className="relative h-full w-full overflow-hidden text-left"
      aria-label="Continue"
    >
      {/* Sky gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky via-sky/60 to-cream" />

      {/* Soft clouds */}
      <Cloud className="absolute top-32 left-4 w-24 opacity-80" />
      <Cloud className="absolute top-16 right-6 w-16 opacity-70" />
      <Cloud className="absolute bottom-24 left-8 w-28 opacity-60" />
      <Cloud className="absolute bottom-40 right-4 w-20 opacity-70" />

      {/* Wordmark with golden glow */}
      <div className="relative z-10 pt-20 px-6 text-center">
        <div className="relative inline-block">
          <div className="absolute inset-0 -m-8 rounded-full bg-secondary/70 blur-2xl" aria-hidden />
          <h1 className="relative font-display text-4xl font-extrabold tracking-tight text-primary">
            EmpoweredDLD
          </h1>
        </div>
      </div>

      {/* Paper airplane with characters */}
      <div className="relative z-10 mt-10 flex items-end justify-center px-2">
        <div className="relative w-[88%] animate-float">
          <PaperAirplane className="absolute -bottom-2 left-0 right-0 mx-auto w-full" />
          <img
            src={dariaAndFriend}
            alt="Two children flying on a paper airplane"
            className="relative z-10 w-full object-contain drop-shadow-[0_18px_30px_rgba(28,28,21,0.18)]"
          />
        </div>
      </div>

      {/* Tagline */}
      <div className="relative z-10 mt-4 text-center px-6">
        <p className="font-script text-3xl text-primary">Words take flight.</p>
      </div>

      {/* Tap hint */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary/60">
          Tap to begin
        </span>
      </div>
    </button>
  );
}

function Cloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 36" className={className} aria-hidden>
      <path
        d="M16 28c-7 0-12-5-12-11s5-10 11-10c1-5 6-7 10-7 5 0 9 3 10 7 1 0 2-1 4-1 5 0 9 4 9 8 5 0 9 4 9 9s-4 9-9 9H16z"
        fill="white"
        opacity="0.95"
      />
    </svg>
  );
}

function PaperAirplane({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 80" className={className} aria-hidden>
      <path d="M10 60 L310 22 L160 70 Z" fill="white" stroke="oklch(0.78 0.014 92)" strokeWidth="2" strokeLinejoin="round" />
      <path d="M160 70 L195 50 L310 22 Z" fill="oklch(0.92 0.018 92)" stroke="oklch(0.78 0.014 92)" strokeWidth="2" strokeLinejoin="round" />
      <path d="M30 56 L120 64" stroke="oklch(0.7 0.02 250 / 0.4)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M50 70 L130 76" stroke="oklch(0.7 0.02 250 / 0.3)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
