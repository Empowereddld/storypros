/* ─────────────────────────────────────────────
 * Shared state screens — loading, empty, offline.
 * Rebuilt from the mockups: branded backdrop + logo
 * + characters + friendly copy.
 * ───────────────────────────────────────────── */

import { type ReactNode } from "react";
import { TactileButton } from "./TactileButton";
import dariaAndFriend from "@/assets/daria-and-friend.webp";
import danDariaThinking from "@/assets/dan-daria-thinking.webp";
import { AuthBackdrop, StoryProsLogo, Star } from "./StoryProsBrand";

/* ───────── Loading ───────── */

export function LoadingScreen({ message = "Loading your stories…" }: { message?: string }) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center bg-cream px-6 text-center">
      <AuthBackdrop />
      <div className="relative z-10 flex flex-col items-center">
        <StoryProsLogo layout="stacked" size="lg" className="animate-pop-in" />
        <img src={dariaAndFriend} alt="" className="mt-6 h-28 w-auto object-contain animate-float" />
        <div className="mt-6 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: i * 150 + "ms" }} />
          ))}
        </div>
        <p className="mt-3 text-sm font-bold text-primary/80">{message}</p>
      </div>
    </div>
  );
}

/* ───────── Empty ───────── */

export function EmptyState({
  emoji = "📚",
  title,
  message,
  actionLabel,
  onAction,
}: {
  emoji?: string;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <span className="text-5xl">{emoji}</span>
      <h2 className="mt-3 font-display text-xl font-extrabold text-primary">{title}</h2>
      {message && <p className="mt-1 max-w-[18rem] text-sm font-medium text-ink-soft">{message}</p>}
      {actionLabel && onAction && (
        <div className="mt-5 w-full max-w-[16rem]">
          <TactileButton onClick={onAction}>{actionLabel}</TactileButton>
        </div>
      )}
    </div>
  );
}

/* ───────── Offline ───────── */

export function OfflineState({ onRetry, onBack }: { onRetry?: () => void; onBack?: () => void }) {
  return (
    <StateShell
      title={<><span className="text-primary">You're offline </span><span className="text-secondary">right now</span></>}
      message="Check your connection and try again. We'll be here when you're back!"
    >
      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-accent/60 bg-card p-3 text-left shadow-card">
        <span className="text-xl">📶</span>
        <div>
          <p className="text-sm font-bold text-ink">No internet connection</p>
          <p className="text-xs text-ink-soft">Some features may not be available.</p>
        </div>
      </div>
      <div className="mt-5 w-full max-w-[16rem] space-y-3">
        {onRetry && <TactileButton onClick={onRetry}>Try Again</TactileButton>}
        {onBack && <TactileButton variant="ghost" onClick={onBack}>Go Back</TactileButton>}
      </div>
    </StateShell>
  );
}

/* ───────── Shared shell ───────── */

function StateShell({ title, message, children }: { title: ReactNode; message: string; children?: ReactNode }) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center bg-cream px-6 text-center">
      <AuthBackdrop />
      <div className="relative z-10 flex flex-col items-center">
        <Star className="h-6 w-6 text-secondary" />
        <img src={danDariaThinking} alt="" className="mt-2 h-32 w-auto object-contain" />
        <h1 className="mt-3 font-display text-[26px] font-extrabold leading-tight">{title}</h1>
        <p className="mt-1.5 max-w-[18rem] text-sm font-medium text-ink-soft">{message}</p>
        {children}
      </div>
    </div>
  );
}
