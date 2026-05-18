/* ─────────────────────────────────────────────
 * Forgot Password Screen
 * Email input → sends reset link.
 * ───────────────────────────────────────────── */

import { useState } from "react";
import { TactileButton } from "./TactileButton";
import { useAuth } from "@/contexts/AuthContext";

interface ForgotPasswordScreenProps {
  onBack: () => void;
}

export function ForgotPasswordScreen({ onBack }: ForgotPasswordScreenProps) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    await resetPassword(email.trim());
    setLoading(false);
    setSent(true);
  }

  return (
    <div className="flex h-full flex-col bg-cream">
      <div className="px-5 pt-4">
        <button
          onClick={onBack}
          className="text-sm font-semibold text-ink-soft hover:text-primary transition-colors"
        >
          ← Back to sign in
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6">
        {sent ? (
          <div className="text-center animate-pop-in">
            <span className="text-5xl block mb-4">📬</span>
            <h2 className="font-display text-[26px] font-extrabold text-primary mb-3">
              Check your email
            </h2>
            <p className="text-base font-semibold text-ink-soft mb-6">
              If an account exists for {email}, we sent a link to reset your password.
            </p>
            <TactileButton onClick={onBack}>
              Back to sign in
            </TactileButton>
          </div>
        ) : (
          <div className="w-full animate-slide-up">
            <div className="text-center mb-6">
              <span className="text-5xl block mb-3">🔑</span>
              <h2 className="font-display text-[26px] font-extrabold text-primary mb-2">
                Reset password
              </h2>
              <p className="text-sm font-semibold text-ink-soft">
                Enter your email and we'll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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

              <TactileButton onClick={() => {}} disabled={loading || !email.trim()}>
                {loading ? "Sending..." : "Send reset link"}
              </TactileButton>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
