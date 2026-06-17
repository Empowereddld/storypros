import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TactileButton } from "@/components/empowered/TactileButton";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setDone(true);
    setTimeout(() => navigate({ to: "/" }), 1500);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl font-extrabold text-primary mb-4 text-center">
          Set a new password
        </h1>
        {done ? (
          <p className="text-center text-sm text-ink-soft">Password updated. Redirecting…</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              autoComplete="new-password"
              className="w-full rounded-2xl border-2 border-muted bg-card p-4 text-base font-semibold text-primary placeholder:text-ink-soft/40 focus:border-primary focus:outline-none"
            />
            {error && (
              <p className="text-sm font-semibold text-destructive">{error}</p>
            )}
            <TactileButton onClick={() => {}} disabled={loading || password.length < 6}>
              {loading ? "Saving…" : "Update password"}
            </TactileButton>
          </form>
        )}
      </div>
    </div>
  );
}
