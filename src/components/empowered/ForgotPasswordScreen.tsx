import { useState } from "react";
import danDariaThinking from "@/assets/dan-daria-thinking.webp";
import { useAuth } from "@/contexts/AuthContext";
import { TactileButton } from "./TactileButton";
import { AuthBackdrop, LockIcon, MailIcon, MiniPlane, StoryProsLogo } from "./StoryProsBrand";
import { PaperPlaneIcon } from "./StoryProsUi";

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
    <div className="relative flex h-full flex-col overflow-hidden bg-cream">
      <AuthBackdrop />

      <header className="relative z-10 flex items-center justify-between px-5 pt-5">
        <button
          onClick={onBack}
          aria-label="Back to sign in"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-primary shadow-card transition-transform active:scale-95"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.7"
            aria-hidden
          >
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <StoryProsLogo layout="row" size="md" className="scale-90" />
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-primary shadow-card">
          <LockIcon className="h-5 w-5" />
        </span>
      </header>

      <div className="relative z-10 flex flex-1 flex-col px-6 pb-7 pt-6">
        <div className="text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-secondary/25 text-secondary-foreground shadow-card">
            {sent ? <PaperPlaneIcon className="h-11 w-11" /> : <LockIcon className="h-10 w-10" />}
          </span>
          <h1 className="mt-5 font-display text-[34px] font-extrabold leading-tight text-primary">
            {sent ? "Check your email" : "Reset password"}
          </h1>
          <p className="mx-auto mt-2 max-w-[20rem] text-base font-semibold leading-relaxed text-ink-soft">
            {sent
              ? `If an account exists for ${email}, we sent a reset link.`
              : "Enter your email and we'll send a secure reset link."}
          </p>
        </div>

        <img src={danDariaThinking} alt="" className="mx-auto mt-6 h-44 w-auto object-contain" />

        {sent ? (
          <div className="mt-7">
            <TactileButton onClick={onBack} leadingIcon={<PaperPlaneIcon className="h-6 w-6" />}>
              Back to Log In
            </TactileButton>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary/60">
                <MailIcon />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                autoComplete="email"
                className="w-full rounded-2xl border-2 border-accent/70 bg-card py-3.5 pl-12 pr-4 text-base font-semibold text-ink placeholder:font-medium placeholder:text-ink-soft/50 transition-colors focus:border-primary focus:outline-none"
              />
            </div>

            <TactileButton
              type="submit"
              disabled={loading || !email.trim()}
              leadingIcon={<MiniPlane className="h-6 w-6" />}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </TactileButton>
          </form>
        )}
      </div>
    </div>
  );
}
