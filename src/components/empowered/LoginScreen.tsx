/* ─────────────────────────────────────────────
 * Login Screen
 * Email + password form with forgot password
 * and create account links.
 * ───────────────────────────────────────────── */

import { useState } from "react";
import { TactileButton } from "./TactileButton";
import { useAuth } from "@/contexts/AuthContext";
import type { Profile } from "@/contexts/AuthContext";

interface LoginScreenProps {
  onSignUp: () => void;
  onForgotPassword: () => void;
  onSuccess: (role?: Profile["role"]) => void;
}

export function LoginScreen({ onSignUp, onForgotPassword, onSuccess }: LoginScreenProps) {
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
    // On success, browser redirects; auth state listener handles the rest.
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

  return (
    <div className="flex h-full flex-col bg-cream">
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        {/* Logo */}
        <div className="mb-8 text-center animate-pop-in">
          <span className="text-5xl block mb-2">✈️</span>
          <h1 className="font-display text-[32px] font-extrabold text-primary leading-none">
            Story<br />Pros
          </h1>
          <p className="mt-2 text-sm font-semibold text-ink-soft">
            Words take flight
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4 animate-slide-up">
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
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full rounded-2xl border-2 border-muted bg-card p-4 text-base font-semibold text-primary placeholder:text-ink-soft/40 focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          {error && (
            <div className="rounded-2xl bg-destructive/10 border border-destructive/30 p-3">
              <p className="text-sm font-semibold text-destructive">{error}</p>
            </div>
          )}

          <TactileButton type="submit" disabled={loading || !email.trim() || !password}>
            {loading ? "Signing in..." : "Sign in with email"}
          </TactileButton>

          <button
            type="button"
            onClick={onForgotPassword}
            className="w-full text-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Forgot password?
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 pt-2">
            <div className="h-px flex-1 bg-muted" />
            <span className="text-xs font-bold uppercase tracking-wider text-ink-soft">or</span>
            <div className="h-px flex-1 bg-muted" />
          </div>

          {/* OAuth buttons */}
          <button
            type="button"
            onClick={() => handleOAuth("google")}
            disabled={oauthLoading !== null}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-muted bg-card p-4 text-base font-bold text-primary hover:border-primary transition-colors disabled:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
            </svg>
            {oauthLoading === "google" ? "Redirecting..." : "Continue with Google"}
          </button>

          <button
            type="button"
            onClick={() => handleOAuth("apple")}
            disabled={oauthLoading !== null}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-ink bg-ink p-4 text-base font-bold text-cream hover:bg-ink/90 transition-colors disabled:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.05 12.04c-.03-2.77 2.26-4.1 2.36-4.17-1.29-1.88-3.29-2.14-4-2.17-1.7-.17-3.32 1-4.18 1-.88 0-2.2-.98-3.62-.95-1.86.03-3.58 1.08-4.54 2.75-1.94 3.36-.5 8.33 1.39 11.06.92 1.34 2.02 2.84 3.46 2.78 1.39-.06 1.92-.9 3.6-.9 1.67 0 2.15.9 3.62.87 1.5-.03 2.44-1.36 3.36-2.71 1.06-1.55 1.5-3.06 1.52-3.14-.03-.01-2.92-1.12-2.97-4.42zM14.29 3.86c.77-.93 1.28-2.22 1.14-3.51-1.1.04-2.43.73-3.22 1.66-.71.82-1.33 2.13-1.16 3.39 1.22.1 2.47-.62 3.24-1.54z"/>
            </svg>
            {oauthLoading === "apple" ? "Redirecting..." : "Continue with Apple"}
          </button>
        </form>
      </div>

      {/* Create account */}
      <div className="px-6 pb-6">
        <div className="rounded-2xl bg-card p-4 shadow-card text-center">
          <p className="text-sm text-ink-soft">
            Don't have an account?{" "}
            <button
              onClick={onSignUp}
              className="font-bold text-primary hover:text-primary/80 transition-colors"
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
