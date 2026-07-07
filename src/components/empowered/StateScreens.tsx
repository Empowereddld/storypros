import { type ReactNode } from "react";
import danDariaThinking from "@/assets/dan-daria-thinking.webp";
import dariaAndFriend from "@/assets/daria-and-friend.webp";
import { TactileButton } from "./TactileButton";
import { AuthBackdrop, MiniPlane, Star, StoryProsLogo } from "./StoryProsBrand";
import { BookIcon, PaperPlaneIcon } from "./StoryProsUi";

export function LoadingScreen({ message = "Loading your stories..." }: { message?: string }) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-cream text-center">
      <AuthBackdrop />

      <div className="relative z-10 flex flex-1 flex-col items-center px-6 pt-8">
        <StoryProsLogo layout="stacked" size="lg" className="animate-pop-in" />
        <img
          src={dariaAndFriend}
          alt=""
          className="mt-5 h-48 w-auto object-contain drop-shadow-[0_18px_28px_rgba(46,25,109,0.16)] animate-float"
        />
      </div>

      <div className="relative z-20 rounded-t-[2.5rem] bg-card px-7 pb-7 pt-7 shadow-[0_-18px_40px_-24px_oklch(0.36_0.18_305/0.45)]">
        <h1 className="font-display text-[34px] font-extrabold leading-tight text-primary">
          Loading your stories
        </h1>
        <p className="mt-2 flex items-center justify-center gap-3 text-lg font-semibold text-primary/85">
          <Star className="h-5 w-5 text-secondary" />
          {message}
          <Star className="h-5 w-5 text-secondary" />
        </p>
        <div className="relative mx-auto mt-5 h-16 max-w-[18rem]">
          <MiniPlane className="absolute right-7 top-0 h-12 w-12 rotate-12 text-secondary drop-shadow-[0_10px_12px_rgba(251,178,0,0.28)]" />
          <div className="absolute left-8 right-16 top-8 border-t-4 border-dashed border-primary/25" />
          <Star className="absolute left-3 top-5 h-4 w-4 text-secondary" />
          <Star className="absolute left-24 top-1 h-3 w-3 text-primary/45" />
        </div>
        <div className="mt-2 grid grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 rounded-[1.5rem] border border-accent/60 bg-accent/45 p-4">
              <div className="flex h-full items-center justify-center rounded-[1.2rem] bg-white/35 text-primary/20">
                <BookIcon className="h-12 w-12" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`h-2.5 rounded-full ${i === 2 ? "w-5 bg-primary" : "w-2.5 bg-accent"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function EmptyState({
  emoji,
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
    <div className="relative flex min-h-full flex-col items-center overflow-hidden bg-cream px-6 py-10 text-center">
      <AuthBackdrop />
      <div className="relative z-10 flex w-full flex-col items-center">
        <StoryProsLogo layout="row" size="md" className="mx-auto" />
        <h2 className="mt-10 font-display text-[36px] font-extrabold leading-tight text-primary">
          {title}
        </h2>
        {message && (
          <p className="mt-2 max-w-[18rem] text-lg font-semibold leading-relaxed text-ink-soft">
            {message}
          </p>
        )}

        <div className="relative mt-10 flex h-72 w-full max-w-[22rem] items-end justify-center">
          <span className="absolute inset-x-6 bottom-7 h-48 rounded-[45%] bg-accent/55" />
          <img
            src={danDariaThinking}
            alt=""
            className="relative z-10 h-72 w-auto object-contain object-bottom"
          />
          <span className="absolute left-1/2 top-20 z-20 flex h-24 w-20 -translate-x-1/2 items-center justify-center rounded-3xl border-2 border-dashed border-primary/20 bg-card/80 text-primary/25 shadow-card">
            {emoji ? <span className="text-4xl">{emoji}</span> : <BookIcon className="h-10 w-10" />}
          </span>
        </div>

        {actionLabel && onAction && (
          <div className="mt-8 w-full max-w-[18rem]">
            <TactileButton onClick={onAction} leadingIcon={<BookIcon className="h-6 w-6" />}>
              {actionLabel}
            </TactileButton>
          </div>
        )}
      </div>
    </div>
  );
}

export function OfflineState({ onRetry, onBack }: { onRetry?: () => void; onBack?: () => void }) {
  return (
    <StateShell
      title={
        <>
          <span className="text-primary">You're offline </span>
          <span className="text-secondary">right now</span>
        </>
      }
      message="Check your connection and try again. Your stories will be here when you're back."
    >
      <div className="mt-6 flex w-full max-w-[19rem] items-center gap-3 rounded-3xl border border-accent/60 bg-card p-4 text-left shadow-card">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary">
          <OfflineIcon />
        </span>
        <div>
          <p className="text-sm font-extrabold text-ink">No internet connection</p>
          <p className="text-xs font-semibold leading-relaxed text-ink-soft">
            Some features may not be available.
          </p>
        </div>
      </div>
      <div className="mt-6 w-full max-w-[18rem] space-y-3">
        {onRetry && (
          <TactileButton onClick={onRetry} leadingIcon={<PaperPlaneIcon className="h-6 w-6" />}>
            Try Again
          </TactileButton>
        )}
        {onBack && (
          <TactileButton variant="ghost" onClick={onBack}>
            Go Back
          </TactileButton>
        )}
      </div>
    </StateShell>
  );
}

function StateShell({
  title,
  message,
  children,
}: {
  title: ReactNode;
  message: string;
  children?: ReactNode;
}) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-cream px-6 text-center">
      <AuthBackdrop />
      <div className="relative z-10 flex w-full flex-col items-center">
        <StoryProsLogo layout="row" size="md" className="mx-auto mb-8" />
        <span className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-secondary/25 text-secondary-foreground shadow-card">
          <PaperPlaneIcon className="h-11 w-11" />
        </span>
        <h1 className="mt-6 font-display text-[36px] font-extrabold leading-tight">{title}</h1>
        <p className="mt-3 max-w-[19rem] text-base font-semibold leading-relaxed text-ink-soft">
          {message}
        </p>
        <img src={danDariaThinking} alt="" className="mt-6 h-44 w-auto object-contain" />
        {children}
      </div>
    </div>
  );
}

function OfflineIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      aria-hidden
    >
      <path d="M3 3l18 18" strokeLinecap="round" />
      <path d="M2.5 8.5A15.2 15.2 0 0112 5c3.2 0 6.2 1 8.5 2.8" strokeLinecap="round" />
      <path d="M6 12.3A9.7 9.7 0 0112 10c1 0 1.9.1 2.8.4" strokeLinecap="round" />
      <path d="M9.5 16.2A4.7 4.7 0 0112 15.5c.4 0 .8 0 1.2.1" strokeLinecap="round" />
      <circle cx="12" cy="20" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
