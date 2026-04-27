import { TactileButton } from "./TactileButton";

interface SignUpScreenProps {
  onContinue: () => void;
}

export function SignUpScreen({ onContinue }: SignUpScreenProps) {
  return (
    <div className="flex h-full flex-col px-6 pb-8 pt-6">
      {/* Floating paper airplane */}
      <div className="flex justify-end animate-float">
        <PaperPlane className="w-24 text-sky-foreground" />
      </div>

      {/* Heading */}
      <div className="mt-6 animate-slide-up">
        <h1 className="font-display text-[34px] leading-[1.15] font-extrabold tracking-tight text-ink">
          Welcome —<br />
          let&rsquo;s get your<br />
          child started.
        </h1>
      </div>

      <div className="flex-1" />

      {/* Auth options */}
      <div className="space-y-4 animate-slide-up">
        <TactileButton onClick={onContinue} leadingIcon={<GoogleMark />}>
          Continue with Google
        </TactileButton>
        <TactileButton onClick={onContinue} leadingIcon={<MailIcon />}>
          Continue with Email
        </TactileButton>

        <button
          type="button"
          onClick={onContinue}
          className="block w-full text-center text-sm font-semibold text-ink underline underline-offset-4"
        >
          Already have an account? Sign in.
        </button>

        <p className="px-2 pt-2 text-center text-xs leading-relaxed text-ink-soft">
          We only collect what we need to support your child&rsquo;s learning.
        </p>
      </div>
    </div>
  );
}

function PaperPlane({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 70" className={className} aria-hidden>
      <path d="M6 56 L92 8 L40 64 Z" fill="oklch(0.91 0.045 235)" stroke="oklch(0.45 0.06 240)" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M40 64 L52 42 L92 8 Z" fill="oklch(0.83 0.05 235)" stroke="oklch(0.45 0.06 240)" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function GoogleMark() {
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white">
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
        <path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4c-.2 1.3-1 2.4-2 3.1v2.6h3.3c1.9-1.8 3-4.4 3-7.5z" fill="#4285F4" />
        <path d="M12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.6c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3v2.6C4.7 19.9 8.1 22 12 22z" fill="#34A853" />
        <path d="M6.4 13.9a6 6 0 010-3.8V7.5H3a10 10 0 000 9l3.4-2.6z" fill="#FBBC05" />
        <path d="M12 6.1c1.5 0 2.8.5 3.8 1.5l2.9-2.9C17 3 14.7 2 12 2 8.1 2 4.7 4.1 3 7.5l3.4 2.6C7.2 7.9 9.4 6.1 12 6.1z" fill="#EA4335" />
      </svg>
    </span>
  );
}

function MailIcon() {
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
