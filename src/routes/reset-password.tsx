import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import danDariaThinking from "@/assets/dan-daria-thinking.webp";
import { AuthStatusCard } from "@/components/empowered/AuthStatusCard";
import { PhoneFrame } from "@/components/empowered/PhoneFrame";
import { AuthBackdrop, LockIcon, StoryProsLogo } from "@/components/empowered/StoryProsBrand";
import { PaperPlaneIcon } from "@/components/empowered/StoryProsUi";
import { TactileButton } from "@/components/empowered/TactileButton";
import { supabase } from "@/integrations/supabase/client";

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
    <PhoneFrame>
      <div className="relative flex h-full flex-col overflow-hidden bg-cream">
        <AuthBackdrop />

        <div className="relative z-10 flex flex-1 flex-col px-6 pb-7 pt-8">
          <StoryProsLogo layout="row" size="md" className="mx-auto scale-90" />

          <div className="mt-10 text-center">
            <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-secondary/25 text-secondary-foreground shadow-card">
              {done ? <PaperPlaneIcon className="h-11 w-11" /> : <LockIcon className="h-10 w-10" />}
            </span>
            <h1 className="mt-5 font-display text-[34px] font-extrabold leading-tight text-primary">
              {done ? "Password updated" : "Set a new password"}
            </h1>
            <p className="mx-auto mt-2 max-w-[19rem] text-base font-semibold leading-relaxed text-ink-soft">
              {done
                ? "You're all set. We'll send you back to Story Pros."
                : "Choose a secure password so you can get back to the stories."}
            </p>
          </div>

          <img src={danDariaThinking} alt="" className="mx-auto mt-7 h-44 w-auto object-contain" />

          {done ? (
            <div className="mt-7">
              <AuthStatusCard
                tone="success"
                title="Password updated"
                message="You're all set. We'll send you back to Story Pros."
              />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary/60">
                  <LockIcon />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password"
                  autoComplete="new-password"
                  className="w-full rounded-2xl border-2 border-accent/70 bg-card py-3.5 pl-12 pr-4 text-base font-semibold text-ink placeholder:font-medium placeholder:text-ink-soft/50 transition-colors focus:border-primary focus:outline-none"
                />
              </div>
              {password.length > 0 && password.length < 6 && (
                <AuthStatusCard
                  tone="info"
                  title="A little longer"
                  message="Use at least 6 characters for your new password."
                />
              )}
              {error && (
                <AuthStatusCard tone="error" title="Almost there" message={error} />
              )}
              {loading && (
                <AuthStatusCard
                  tone="loading"
                  title="Saving your password"
                  message="Keeping your Story Pros account secure."
                />
              )}
              <TactileButton
                type="submit"
                disabled={loading || password.length < 6}
                leadingIcon={<PaperPlaneIcon className="h-6 w-6" />}
              >
                {loading ? "Saving..." : "Update Password"}
              </TactileButton>
            </form>
          )}
        </div>
      </div>
    </PhoneFrame>
  );
}
