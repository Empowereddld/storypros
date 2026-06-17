/* ─────────────────────────────────────────────
 * Sign Up Screen
 * Creates a new account with email + password.
 * Google OAuth placeholder for Supabase.
 * ───────────────────────────────────────────── */

import { useState } from "react";
import { TactileButton } from "./TactileButton";
import { useAuth } from "@/contexts/AuthContext";

interface SignUpScreenProps {
  onContinue: (role?: "parent" | "slp" | "teacher") => void;
  onSignIn: () => void;
}

type AccountRole = "parent" | "slp" | "teacher";

export function SignUpScreen({ onContinue, onSignIn }: SignUpScreenProps) {
  const { signUp, signInWithGoogle, signInWithApple } = useAuth();
  const [mode, setMode] = useState<"choose" | "role" | "email">("choose");
  const [accountRole, setAccountRole] = useState<AccountRole>("parent");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "apple" | null>(null);

  async function handleOAuth(provider: "google" | "apple") {
    setOauthLoading(provider);
    setError("");
    const fn = provider === "google" ? signInWithGoogle : signInWithApple;
    const result = await fn();
    if (result.error) {
      setError(result.error);
      setOauthLoading(null);
    }
    // On success the browser is redirected; no further action needed.
  }

  async function handleEmailSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password || !displayName.trim()) return;

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    const result = await signUp(email.trim(), password, displayName.trim(), accountRole);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      onContinue(accountRole);
    }
  }

  if (mode === "role") {
    return (
      <div className="flex h-full flex-col bg-cream">
        <div className="px-5 pt-4">
          <button
            onClick={() => setMode("choose")}
            className="text-sm font-semibold text-ink-soft hover:text-primary transition-colors"
          >
            ← Back
          </button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-6">
          <div className="w-full animate-slide-up">
            <div className="text-center mb-8">
              <h2 className="font-display text-[26px] font-extrabold text-primary mb-2">
                I am a...
              </h2>
              <p className="text-sm font-semibold text-ink-soft">
                This helps us set up the right experience for you.
              </p>
            </div>

            <div className="space-y-3">
              {([
                { role: "parent" as const, emoji: "👨‍👩‍👧", title: "Parent / Caregiver", desc: "Track your child's language journey at home" },
                { role: "slp" as const, emoji: "🩺", title: "Speech-Language Pathologist", desc: "Monitor your caseload and assign stories" },
                { role: "teacher" as const, emoji: "📚", title: "Teacher / Educator", desc: "Track classroom progress and assign activities" },
              ]).map((opt) => (
                <button
                  key={opt.role}
                  onClick={() => { setAccountRole(opt.role); setMode("email"); }}
                  className={`w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all active:scale-[0.98] ${
                    accountRole === opt.role
                      ? "border-primary bg-primary/5"
                      : "border-muted bg-card hover:border-primary/40"
                  }`}
                >
                  <span className="text-3xl">{opt.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-primary text-base">{opt.title}</p>
                    <p className="text-xs text-ink-soft mt-0.5">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "email") {
    return (
      <div className="flex h-full flex-col bg-cream">
        <div className="px-5 pt-4">
          <button
            onClick={() => setMode("choose")}
            className="text-sm font-semibold text-ink-soft hover:text-primary transition-colors"
          >
            ← Back
          </button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-6">
          <div className="w-full animate-slide-up">
            <div className="text-center mb-6">
              <h2 className="font-display text-[26px] font-extrabold text-primary mb-2">
                Create your account
              </h2>
              <p className="text-sm font-semibold text-ink-soft">
                {accountRole === "parent"
                  ? "Set up your parent account to get started."
                  : accountRole === "slp"
                  ? "Set up your SLP account to track your caseload."
                  : "Set up your teacher account to track your students."}
              </p>
            </div>

            <form onSubmit={handleEmailSignUp} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1.5">
                  Your name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                  autoComplete="name"
                  className="w-full rounded-2xl border-2 border-muted bg-card p-4 text-base font-semibold text-primary placeholder:text-ink-soft/40 focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="parent@email.com"
                  autoComplete="email"
                  className="w-full rounded-2xl border-2 border-muted bg-card p-4 text-base font-semibold text-primary placeholder:text-ink-soft/40 focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  className="w-full rounded-2xl border-2 border-muted bg-card p-4 text-base font-semibold text-primary placeholder:text-ink-soft/40 focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {error && (
                <div className="rounded-2xl bg-destructive/10 border border-destructive/30 p-3">
                  <p className="text-sm font-semibold text-destructive">{error}</p>
                </div>
              )}

              <TactileButton
                onClick={() => {}}
                disabled={loading || !email.trim() || !password || !displayName.trim()}
              >
                {loading ? "Creating account..." : "Create account"}
              </TactileButton>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── Choose method screen ──
  return (
    <div className="flex h-full flex-col px-6 pb-8 pt-6 bg-cream">
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
      <div className="space-y-3 animate-slide-up">
        <TactileButton
          onClick={() => handleOAuth("google")}
          leadingIcon={<GoogleMark />}
          disabled={oauthLoading !== null}
        >
          {oauthLoading === "google" ? "Connecting…" : "Continue with Google"}
        </TactileButton>
        <TactileButton
          onClick={() => handleOAuth("apple")}
          leadingIcon={<AppleMark />}
          disabled={oauthLoading !== null}
          variant="secondary"
        >
          {oauthLoading === "apple" ? "Connecting…" : "Continue with Apple"}
        </TactileButton>
        <TactileButton onClick={() => setMode("role")} leadingIcon={<MailIcon />}>
          Continue with Email
        </TactileButton>

        {error && (
          <div className="rounded-2xl bg-destructive/10 border border-destructive/30 p-3">
            <p className="text-sm font-semibold text-destructive">{error}</p>
          </div>
        )}

        <button
          type="button"
          onClick={onSignIn}
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

function AppleMark() {
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#000" aria-hidden>
        <path d="M16.4 12.6c0-2.5 2-3.7 2.1-3.8-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.8.9s-2-.9-3.3-.9c-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.3.9 1.3 1.9 2.7 3.3 2.6 1.3-.1 1.8-.9 3.4-.9s2 .9 3.4.9c1.4 0 2.3-1.3 3.1-2.6.7-1 1.3-2.1 1.7-3.3-2.6-1-3.4-3.9-3.4-3.7zM14 5.6c.7-.9 1.2-2.1 1.1-3.3-1 0-2.3.7-3 1.5-.7.8-1.3 2-1.1 3.2 1.2.1 2.3-.5 3-1.4z" />
      </svg>
    </span>
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
