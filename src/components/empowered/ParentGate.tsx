/* ─────────────────────────────────────────────
 * Parent Gate — adult verification
 *
 * App-store kids-category requirement: purchases,
 * settings, and external links must sit behind a
 * gate a young child can't pass. We use a spoken-
 * style math challenge (two-digit addition) with
 * a keypad. Passing is remembered for 10 minutes
 * per session so parents aren't re-asked constantly.
 * ───────────────────────────────────────────── */

import { useState, useMemo, type ReactNode } from "react";
import { TactileButton } from "./TactileButton";
import { cn } from "@/lib/utils";

const GATE_KEY = "storypros_parent_gate_until";
const GATE_VALID_MS = 10 * 60 * 1000; // 10 minutes

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
  } catch { /* ignore */ }
}

function makeChallenge(): { a: number; b: number } {
  // Two-digit addition — trivial for adults, a real barrier for ages 4–10
  const a = 12 + Math.floor(Math.random() * 77); // 12–88
  const b = 13 + Math.floor(Math.random() * 78); // 13–90
  return { a, b };
}

interface ParentGateProps {
  /** Rendered once the gate has been passed */
  children: ReactNode;
  /** Called when the grown-up backs out */
  onCancel: () => void;
  /** Optional context line, e.g. "Settings is for grown-ups" */
  message?: string;
}

export function ParentGate({ children, onCancel, message }: ParentGateProps) {
  const [passed, setPassed] = useState(isGateOpen);
  const [challenge, setChallenge] = useState(makeChallenge);
  const [entry, setEntry] = useState("");
  const [shake, setShake] = useState(false);

  const answer = useMemo(
    () => String(challenge.a + challenge.b),
    [challenge],
  );

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
        // Wrong — shake, new question, clear
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
    <div className="flex h-full flex-col bg-cream">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5">
        <button
          onClick={onCancel}
          aria-label="Go back"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-card text-ink"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor" strokeWidth="2.5" fill="none">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="text-sm font-bold uppercase tracking-wide text-ink-soft">
          Grown-ups only
        </span>
        <span className="w-10" />
      </div>

      {/* Challenge */}
      <div className="flex flex-1 flex-col items-center justify-center px-8">
        <span className="text-5xl" aria-hidden>
          🔒
        </span>
        <h2 className="mt-4 text-center text-xl font-extrabold text-ink">
          Ask a grown-up to continue
        </h2>
        <p className="mt-1 text-center text-sm font-medium text-ink-soft">
          {message ?? "This area is for parents and caregivers."}
        </p>

        <div
          className={cn(
            "mt-6 rounded-3xl bg-card px-8 py-5 shadow-card transition-transform",
            shake && "animate-[shake_0.4s_ease-in-out]",
          )}
        >
          <p className="text-center text-3xl font-extrabold tracking-wide text-primary">
            {challenge.a} + {challenge.b} = {entry || "?"}
            {entry && entry.length < answer.length ? "…" : ""}
          </p>
        </div>

        {/* Keypad */}
        <div className="mt-6 grid w-full max-w-[260px] grid-cols-3 gap-3">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
            <button
              key={d}
              onClick={() => press(d)}
              className="h-14 rounded-2xl bg-card text-xl font-bold text-ink shadow-card transition-transform active:scale-95"
            >
              {d}
            </button>
          ))}
          <button
            onClick={() => setEntry("")}
            aria-label="Clear"
            className="h-14 rounded-2xl bg-card text-sm font-bold text-ink-soft shadow-card transition-transform active:scale-95"
          >
            Clear
          </button>
          <button
            onClick={() => press("0")}
            className="h-14 rounded-2xl bg-card text-xl font-bold text-ink shadow-card transition-transform active:scale-95"
          >
            0
          </button>
          <span />
        </div>
      </div>

      {/* Cancel */}
      <div className="px-8 pb-8">
        <TactileButton variant="ghost" onClick={onCancel}>
          Back to the map
        </TactileButton>
      </div>
    </div>
  );
}
