import { useMemo, useState, type ReactNode } from "react";
import danDariaThinking from "@/assets/dan-daria-thinking.webp";
import { cn } from "@/lib/utils";
import { TactileButton } from "./TactileButton";
import { AuthBackdrop, LockIcon, MiniPlane, Star, StoryProsLogo } from "./StoryProsBrand";

const GATE_KEY = "storypros_parent_gate_until";
const GATE_VALID_MS = 10 * 60 * 1000;

function isGateOpen(): boolean {
  try {
    const until = sessionStorage.getItem(GATE_KEY);
    return !!until && Date.now() < Number(until);
  } catch {
    return false;
  }
}

function openGate(): void {
  try {
    sessionStorage.setItem(GATE_KEY, String(Date.now() + GATE_VALID_MS));
  } catch {
    /* ignore */
  }
}

function makeChallenge(): { a: number; b: number } {
  const a = 12 + Math.floor(Math.random() * 77);
  const b = 13 + Math.floor(Math.random() * 78);
  return { a, b };
}

interface ParentGateProps {
  children: ReactNode;
  onCancel: () => void;
  message?: string;
}

export function ParentGate({ children, onCancel, message }: ParentGateProps) {
  const [passed, setPassed] = useState(isGateOpen);
  const [challenge, setChallenge] = useState(makeChallenge);
  const [entry, setEntry] = useState("");
  const [shake, setShake] = useState(false);

  const answer = useMemo(() => String(challenge.a + challenge.b), [challenge]);

  if (passed) return <>{children}</>;

  function press(digit: string) {
    if (entry.length >= 3) return;
    const next = entry + digit;
    setEntry(next);

    if (next.length === answer.length) {
      if (next === answer) {
        openGate();
        setPassed(true);
      } else {
        setShake(true);
        setTimeout(() => {
          setShake(false);
          setChallenge(makeChallenge());
          setEntry("");
        }, 450);
      }
    }
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-cream">
      <AuthBackdrop />
      <Star className="absolute left-9 top-24 z-10 h-5 w-5 text-secondary animate-sparkle" />
      <Star className="absolute right-8 top-36 z-10 h-4 w-4 text-primary/35 animate-sparkle" />
      <MiniPlane className="absolute right-14 top-16 z-10 h-9 w-9 rotate-[18deg] text-secondary animate-float" />

      <div className="relative z-20 flex items-center justify-between px-5 pt-5">
        <button
          onClick={onCancel}
          aria-label="Go back"
          className="press-pop flex h-11 w-11 items-center justify-center rounded-full bg-card text-primary shadow-card"
        >
          <BackIcon />
        </button>
        <span className="rounded-full bg-card/80 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-primary shadow-card">
          Grown-ups only
        </span>
        <span className="w-11" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center overflow-y-auto no-scrollbar px-5 pb-5 pt-1">
        <StoryProsLogo layout="row" size="md" className="scale-95" />

        <div className="relative mt-2 h-36 w-full">
          <span className="absolute inset-x-12 bottom-2 h-28 rounded-full bg-primary/10" />
          <img
            src={danDariaThinking}
            alt=""
            className="relative z-10 mx-auto h-36 w-auto object-contain object-bottom drop-shadow-[0_14px_22px_rgba(63,38,140,0.16)]"
          />
        </div>

        <h1 className="mt-1 text-center font-display text-[33px] font-extrabold leading-none text-primary">
          Grown-Up Check
        </h1>
        <div className="mt-3 flex items-center gap-2 text-secondary">
          <span className="h-px w-16 bg-accent" />
          <Star className="h-5 w-5" />
          <span className="h-px w-16 bg-accent" />
        </div>
        <p className="mt-3 max-w-[300px] text-center text-[15px] font-medium leading-snug text-ink-soft">
          {message ?? "This area is for parents and caregivers."}
        </p>

        <div
          className={cn(
            "mt-5 w-full rounded-[28px] border border-accent/70 bg-card/92 p-4 shadow-soft backdrop-blur transition-transform",
            shake && "animate-[shake_0.4s_ease-in-out]",
          )}
        >
          <p className="text-center text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
            Enter the answer
          </p>
          <p className="mt-2 text-center text-[31px] font-extrabold tracking-wide text-primary">
            {challenge.a} + {challenge.b} = {entry || "?"}
            {entry && entry.length < answer.length ? "..." : ""}
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2.5">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
              <KeyButton key={digit} onClick={() => press(digit)}>
                {digit}
              </KeyButton>
            ))}
            <KeyButton onClick={() => setEntry("")} small ariaLabel="Clear">
              Clear
            </KeyButton>
            <KeyButton onClick={() => press("0")}>0</KeyButton>
            <span className="h-12" />
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs font-bold text-ink-soft">
            <LockIcon className="h-4 w-4 text-primary" />
            This helps us keep Story Pros safe.
          </div>
        </div>

        <div className="mt-4 flex w-full items-center gap-3 rounded-[22px] bg-card/80 px-4 py-3 text-left shadow-card">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
            <ShieldIcon />
          </span>
          <p className="text-xs font-bold leading-snug text-ink-soft">
            We never share your information. Parent-only areas stay behind this check.
          </p>
        </div>
      </div>

      <div className="relative z-20 px-6 pb-6">
        <TactileButton variant="ghost" onClick={onCancel}>
          Back
        </TactileButton>
      </div>
    </div>
  );
}

function KeyButton({
  children,
  onClick,
  small,
  ariaLabel,
}: {
  children: ReactNode;
  onClick: () => void;
  small?: boolean;
  ariaLabel?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "press-pop flex h-12 items-center justify-center rounded-2xl border border-accent/60 bg-card text-primary shadow-card",
        small ? "text-xs font-extrabold uppercase tracking-wide" : "text-2xl font-extrabold",
      )}
    >
      {children}
    </button>
  );
}

function BackIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden
    >
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      aria-hidden
    >
      <path d="M12 3l7 3v5c0 4.5-2.8 8.2-7 10-4.2-1.8-7-5.5-7-10V6l7-3z" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
