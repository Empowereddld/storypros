/* ─────────────────────────────────────────────
 * Login Screen
 * Rebuilt from the "Colorful Kids App Login" mockup:
 * Story Pros header + Dan/Daria, icon inputs, and a
 * "Create an Account" path. Google/Apple sign-in is
 * preserved as a secondary option.
 * ───────────────────────────────────────────── */

import { useState } from "react";
import { AuthStatusCard } from "./AuthStatusCard";
import { TactileButton } from "./TactileButton";
import { useAuth } from "@/contexts/AuthContext";
import type { Profile } from "@/contexts/AuthContext";
import dariaAndFriend from "@/assets/daria-and-friend.webp";
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

  return (
    <div className="relative flex h-full flex-col bg-cream">
      <AuthBackdrop />

      <div className="relative z-10 flex h-full flex-col overflow-y-auto no-scrollbar px-6 pb-8">
        {/* Header: characters + logo */}
        <div className="flex items-start justify-between pt-6">
          <img
            src={dariaAndFriend}
            alt="Dan and Daria"
            className="h-24 w-auto object-contain drop-shadow-[0_10px_18px_rgba(28,28,21,0.14)]"
          />
          <StoryProsLogo layout="row" size="sm" className="pt-2" />
        </div>

        {/* curved divider */}
        <div className="mt-1 h-1 rounded-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <h1 className="mt-5 text-center font-display text-3xl font-extrabold text-primary">
          Log In
        </h1>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
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
            placeholder="Password"
            autoComplete="current-password"
          />

          {error && <AuthStatusCard tone="error" title="Let's try that again" message={error} />}

          {(loading || oauthLoading) && (
            <AuthStatusCard
              tone="loading"
              title={oauthLoading ? "Opening secure sign-in" : "Checking your account"}
              message="Story Pros is making sure everything is ready."
            />
          )}

          <TactileButton type="submit" disabled={loading || !email.trim() || !password}>
            {loading ? "Logging in…" : "Log In"}
          </TactileButton>
        </form>

        <button
          type="button"
          onClick={onForgotPassword}
          className="mt-3 w-full text-center text-sm font-bold text-primary hover:text-primary/80 transition-colors"
        >
          Forgot Password?
        </button>

        {/* Divider */}
        <div className="mt-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-accent" />
          <span className="text-xs font-bold uppercase tracking-wider text-ink-soft/70">or</span>
          <div className="h-px flex-1 bg-accent" />
        </div>

        {/* OAuth */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleOAuth("google")}
            disabled={oauthLoading !== null}
            className="flex items-center justify-center gap-2 rounded-2xl border-2 border-accent/80 bg-card py-3 text-sm font-bold text-ink hover:border-primary/50 transition-colors disabled:opacity-50"
          >
            <GoogleMark />
            {oauthLoading === "google" ? "…" : "Google"}
          </button>
          <button
            type="button"
            onClick={() => handleOAuth("apple")}
            disabled={oauthLoading !== null}
            className="flex items-center justify-center gap-2 rounded-2xl border-2 border-ink bg-ink py-3 text-sm font-bold text-cream hover:bg-ink/90 transition-colors disabled:opacity-50"
          >
            <AppleMark />
            {oauthLoading === "apple" ? "…" : "Apple"}
          </button>
        </div>

        <div className="flex-1" />

        <TactileButton variant="ghost" className="mt-6" onClick={onSignUp}>
          Create an Account
        </TactileButton>

        {onDemo && (
          <button
            type="button"
            onClick={onDemo}
            className="mt-3 w-full text-center text-sm font-bold text-primary hover:text-primary/80 transition-colors"
          >
            Just exploring? Try a Demo Account
          </button>
        )}
      </div>
    </div>
  );
}
