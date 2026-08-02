/* ─────────────────────────────────────────────
 * Sign Up Screen
 * Rebuilt from the "Create Your Account" mockup as a
 * single clean form. Keeps role selection (parent /
 * SLP / teacher) and Google/Apple sign-in.
 * (Child profile is created later in onboarding.)
 * ───────────────────────────────────────────── */

import { useState } from "react";
import { AuthStatusCard } from "./AuthStatusCard";
import { TactileButton } from "./TactileButton";
import { useAuth } from "@/contexts/AuthContext";
import dariaAndFriend from "@/assets/dan-daria-highfive.webp";
import {
  AuthBackdrop,
  StoryProsLogo,
  IconInput,
  UserIcon,
  MailIcon,
  LockIcon,
  GoogleMark,
  AppleMark,
} from "./StoryProsBrand";
import { cn } from "@/lib/utils";
import { FEATURES } from "@/config/features";

interface SignUpScreenProps {
  onContinue: (role?: "parent" | "slp" | "teacher") => void;
  onSignIn: () => void;
  onDemo?: () => void;
}

type AccountRole = "parent" | "slp" | "teacher";

const ROLES: { role: AccountRole; label: string }[] = [
  { role: "parent", label: "Parent" },
  { role: "slp", label: "SLP" },
  { role: "teacher", label: "Teacher" },
];

export function SignUpScreen({ onContinue, onSignIn, onDemo }: SignUpScreenProps) {
  const { signUp, signInWithGoogle, signInWithApple } = useAuth();
  const [accountRole, setAccountRole] = useState<AccountRole>("parent");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "apple" | null>(null);

  async function handleOAuth(provider: "google" | "apple") {
    setError("");
    setOauthLoading(provider);
    const result = provider === "google" ? await signInWithGoogle() : await signInWithApple();
    if (result.error) {
      setError(result.error);
      setOauthLoading(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
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

  const nameLabel = accountRole === "parent" ? "Parent name" : "Your name";

  return (
    <div className="relative flex min-h-full flex-col bg-cream">
      <AuthBackdrop />

      <div className="relative z-10 flex min-h-full flex-col items-center overflow-y-auto no-scrollbar px-5 py-8 sm:px-6">
        <StoryProsLogo layout="row" size="lg" />

        <div className="mt-8 w-full max-w-[520px] rounded-3xl border border-primary/10 bg-card p-8 shadow-[0_18px_44px_-24px_rgba(82,29,153,0.28)] sm:p-10">
          <h1 className="text-center font-display text-3xl font-extrabold leading-tight text-primary">
            Create your account
          </h1>
          <p className="mt-2.5 text-center text-sm font-medium text-ink-soft">
            Start a learning journey filled with stories, growth, and fun.
          </p>

          {/* Role selector — hidden while SLP/teacher accounts are off;
              every signup is a parent account */}
          {FEATURES.slp && (
            <div className="mt-6 flex gap-2 rounded-2xl bg-accent/40 p-1">
              {ROLES.map((r) => (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => setAccountRole(r.role)}
                  className={cn(
                    "flex-1 rounded-xl py-2 text-sm font-bold transition-all",
                    accountRole === r.role
                      ? "bg-card text-primary shadow-card"
                      : "text-ink-soft hover:text-primary",
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <IconInput
              icon={<UserIcon />}
              value={displayName}
              onChange={setDisplayName}
              placeholder={nameLabel}
              autoComplete="name"
            />
            <IconInput
              icon={<MailIcon />}
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Email"
              autoComplete="email"
            />
            <IconInput
              icon={<LockIcon />}
              revealable
              value={password}
              onChange={setPassword}
              placeholder="Create password"
              autoComplete="new-password"
            />

            {error && <AuthStatusCard tone="error" title="Almost there" message={error} />}

            {(loading || oauthLoading) && (
              <AuthStatusCard
                tone="loading"
                title={oauthLoading ? "Opening secure sign-up" : "Creating your account"}
                message="We are setting up your grown-up account."
              />
            )}

            <div className="pt-1">
              <TactileButton
                type="submit"
                disabled={loading || !email.trim() || !password || !displayName.trim()}
              >
                {loading ? "Creating account…" : "Create Account"}
              </TactileButton>
            </div>
          </form>

          <p className="mt-4 text-center text-[11px] font-semibold leading-relaxed text-ink-soft">
            By creating an account you agree to our{" "}
            <a href="/terms" target="_blank" rel="noopener" className="font-bold text-primary hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="/privacy" target="_blank" rel="noopener" className="font-bold text-primary hover:underline">
              Privacy Policy
            </a>
            .
          </p>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-primary/15" />
            <span className="text-xs font-bold uppercase tracking-wider text-ink-soft/70">or</span>
            <div className="h-px flex-1 bg-primary/15" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              disabled={oauthLoading !== null}
              className="flex h-[52px] items-center justify-center gap-2 rounded-2xl border-2 border-primary/20 bg-card text-sm font-bold text-ink hover:border-primary/40 transition-colors disabled:opacity-50"
            >
              <GoogleMark />
              {oauthLoading === "google" ? "…" : "Google"}
            </button>
            <button
              type="button"
              onClick={() => handleOAuth("apple")}
              disabled={oauthLoading !== null}
              className="flex h-[52px] items-center justify-center gap-2 rounded-2xl border-2 border-ink bg-ink text-sm font-bold text-cream hover:bg-ink/90 transition-colors disabled:opacity-50"
            >
              <AppleMark />
              {oauthLoading === "apple" ? "…" : "Apple"}
            </button>
          </div>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={onSignIn}
              className="w-full text-center text-sm font-semibold text-ink-soft"
            >
              Already have an account? <span className="font-bold text-primary">Log in</span>
            </button>

            {onDemo && (
              <button
                type="button"
                onClick={onDemo}
                className="mt-4 w-full text-center text-xs font-semibold text-ink-soft underline underline-offset-4 transition-colors hover:text-primary"
              >
                Just exploring? Try a demo account
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

