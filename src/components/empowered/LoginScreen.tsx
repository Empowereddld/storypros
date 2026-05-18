/* ─────────────────────────────────────────────
 * Login Screen
 * Email + password form with forgot password
 * and create account links.
 * ───────────────────────────────────────────── */

import { useState } from "react";
import { TactileButton } from "./TactileButton";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface LoginScreenProps {
  onSignUp: () => void;
  onForgotPassword: () => void;
  onSuccess: (role?: "parent" | "slp" | "teacher") => void;
}

export function LoginScreen({ onSignUp, onForgotPassword, onSuccess }: LoginScreenProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

          <TactileButton onClick={() => {}} disabled={loading || !email.trim() || !password}>
            {loading ? "Signing in..." : "Sign in"}
          </TactileButton>

          <button
            type="button"
            onClick={onForgotPassword}
            className="w-full text-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Forgot password?
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
