/* ─────────────────────────────────────────────
 * Login Screen
 * Centred Story Pros logo + single focused login card.
 * Google/Apple sign-in preserved as secondary options.
 * ───────────────────────────────────────────── */

import { useState } from "react";
import { AuthStatusCard } from "./AuthStatusCard";
import { TactileButton } from "./TactileButton";
import { useAuth } from "@/contexts/AuthContext";
import type { Profile } from "@/contexts/AuthContext";
import {
  AuthBackdrop,
  StoryProsLogo,
  IconInput,
  MailIcon,
  LockIcon,
  GoogleMark,
  AppleMark,
} from "./StoryProsBrand";

interface LoginScreenProps {
  onSignUp: () => void;
  onForgotPassword: () => void;
  onSuccess: (role?: Profile["role"]) => void;
  onDemo?: () => void;
}

export function LoginScreen({ onSignUp, onForgotPassword, onSuccess, onDemo }: LoginScreenProps) {
  const { signIn, signInWithGoogle, signInWithApple } = useAuth();
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
    // On success the browser redirects; the auth listener handles the rest.
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setLoading(true);
    setError("");

    const result = await signIn(email.trim(), password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      onSuccess(result.role);
    }
  }

  const labelClass = "block text-sm font-bold text-ink";
  const socialClass =
    "flex h-[52px] items-center justify-center gap-2 rounded-2xl border-2 px-4 text-sm font-bold transition-colors disabled:opacity-50";

  return (
    <div className="relative flex min-h-full flex-col bg-accent/25">
      <AuthBackdrop />

      <div className="relative z-10 flex min-h-full flex-col items-center overflow-y-auto no-scrollbar px-5 py-8 sm:px-6">
        {/* Centred logo */}
        <StoryProsLogo layout="row" size="sm" />

        {/* Login card — 32px below the logo */}
        <div className="mt-8 w-full max-w-[520px] rounded-3xl border border-primary/10 bg-card p-8 shadow-[0_18px_44px_-24px_rgba(82,29,153,0.28)] sm:p-10">
          <h1 className="text-center font-display text-3xl font-extrabold text-primary">
            Welcome back
          </h1>
          <p className="mt-2.5 text-center text-sm font-medium text-ink-soft">
            Log in to continue your Story Pros journey.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label htmlFor="login-email" className={labelClass}>
                Email
              </label>
              <IconInput
                id="login-email"
                className="mt-2"
                icon={<MailIcon />}
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="name@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="login-password" className={labelClass}>
                Password
              </label>
              <IconInput
                id="login-password"
                className="mt-2"
                icon={<LockIcon />}
                revealable
                value={password}
                onChange={setPassword}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            {error && <AuthStatusCard tone="error" title="Let's try that again" message={error} />}

            {(loading || oauthLoading) && (
              <AuthStatusCard
                tone="loading"
                title={oauthLoading ? "Opening secure sign-in" : "Checking your account"}
                message="Story Pros is making sure everything is ready."
              />
            )}

            <div className="pt-1">
              <TactileButton type="submit" disabled={loading || !email.trim() || !password}>
                {loading ? "Logging in…" : "Log in"}
              </TactileButton>
            </div>
          </form>

          <button
            type="button"
            onClick={onForgotPassword}
            className="mt-3 w-full text-center text-sm font-bold text-primary transition-colors hover:text-primary/80"
          >
            Forgot your password?
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-primary/15" />
            <span className="text-xs font-semibold text-ink-soft">or continue with</span>
            <div className="h-px flex-1 bg-primary/15" />
          </div>

          {/* OAuth */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              disabled={oauthLoading !== null}
              className={`${socialClass} border-primary/20 bg-card text-ink hover:border-primary/40`}
            >
              <GoogleMark />
              {oauthLoading === "google" ? "…" : "Google"}
            </button>
            <button
              type="button"
              onClick={() => handleOAuth("apple")}
              disabled={oauthLoading !== null}
              className={`${socialClass} border-ink bg-ink text-cream hover:bg-ink/90`}
            >
              <AppleMark />
              {oauthLoading === "apple" ? "…" : "Apple"}
            </button>
          </div>

          {/* Account creation */}
          <div className="mt-8 text-center">
            <p className="text-sm font-medium text-ink-soft">New to Story Pros?</p>
            <TactileButton variant="ghost" className="mt-3" onClick={onSignUp}>
              Create an account
            </TactileButton>

            {onDemo && (
              <button
                type="button"
                onClick={onDemo}
                className="mt-4 w-full text-center text-xs font-semibold text-ink-soft underline underline-offset-4 transition-colors hover:text-primary"
              >
                Just exploring? Try the demo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
