import { type ReactNode } from "react";
import danDariaThinking from "@/assets/dan-daria-thinking.webp";
import danDariaAirplane from "@/assets/dan-daria-airplane.webp";
import danDariaSurprised from "@/assets/dan-daria-surprised.webp";
import { cn } from "@/lib/utils";
import { TactileButton } from "./TactileButton";
import { AuthBackdrop, MiniPlane, Star, StoryProsLogo } from "./StoryProsBrand";
import { BookIcon, HomeIcon, PaperPlaneIcon } from "./StoryProsUi";

export function LoadingScreen({ message = "Magic is in the works..." }: { message?: string }) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-cream text-center">
      <AuthBackdrop />

      <div className="relative z-10 flex flex-1 flex-col items-center px-6 pt-5">
        <StoryProsLogo layout="stacked" size="lg" className="animate-pop-in" />
        <img
          src={dariaAndFriend}
          alt=""
          className="mt-4 h-52 w-auto object-contain drop-shadow-[0_18px_28px_rgba(46,25,109,0.16)] animate-float"
        />
      </div>

      <div className="relative z-20 rounded-t-[2.5rem] bg-card px-7 pb-6 pt-7 shadow-[0_-18px_40px_-24px_oklch(0.36_0.18_305/0.45)]">
        <h1 className="font-display text-[38px] font-extrabold leading-tight text-primary">
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
            <div
              key={i}
              className="h-28 rounded-[1.5rem] border border-accent/70 bg-accent/45 p-4 shadow-card"
            >
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
        <div className="mt-5 flex items-center gap-4 rounded-[28px] border border-accent/70 bg-card p-4 text-left shadow-card">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Star className="h-8 w-8" />
          </span>
          <p className="text-sm font-semibold leading-snug text-primary">
            <span className="block text-base font-extrabold">Did you know?</span>
            Every great story starts with a little imagination.
          </p>
          <Star className="ml-auto h-6 w-6 shrink-0 text-secondary" />
        </div>
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  tone = "library",
  title,
  message,
  actionLabel,
  onAction,
}: {
  emoji?: string;
  icon?: ReactNode;
  tone?: "library" | "search";
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="relative flex min-h-full flex-col items-center overflow-hidden bg-cream px-6 py-6 text-center">
      <AuthBackdrop />
      <div className="relative z-10 flex w-full flex-col items-center">
        <StoryProsLogo layout="row" size="md" className="mx-auto" />
        <h2 className="mt-10 max-w-[20rem] font-display text-[38px] font-extrabold leading-tight text-primary">
          <EmphasizedTitle>{title}</EmphasizedTitle>
        </h2>
        {message && (
          <p className="mt-2 max-w-[18rem] text-lg font-semibold leading-relaxed text-ink-soft">
            {message}
          </p>
        )}

        <div className="relative mt-8 flex h-[22rem] w-full max-w-[23rem] items-end justify-center">
          <span className="absolute inset-x-3 bottom-8 h-56 rounded-[45%] bg-accent/55" />
          <img
            src={tone === "search" ? danDariaSurprised : danDariaThinking}
            alt=""
            className="relative z-10 h-[21rem] w-auto object-contain object-bottom drop-shadow-[0_18px_30px_rgba(28,28,21,0.14)]"
          />
          <span
            className={cn(
              "absolute left-1/2 z-20 flex -translate-x-1/2 items-center justify-center border-2 border-dashed border-primary/20 bg-card/90 text-primary/25 shadow-card",
              tone === "search"
                ? "top-24 h-32 w-32 rounded-[32px]"
                : "top-16 h-28 w-24 rounded-[28px]",
            )}
          >
            {icon ??
              (tone === "search" ? (
                <SearchIcon className="h-14 w-14" />
              ) : (
                <BookIcon className="h-11 w-11" />
              ))}
          </span>
          <MiniPlane className="absolute right-5 top-16 h-9 w-9 rotate-12 text-secondary animate-float" />
          <Star className="absolute left-5 top-24 h-5 w-5 text-secondary animate-sparkle" />
        </div>

        {actionLabel && onAction && (
          <div className="mt-5 w-full max-w-[20rem]">
            <TactileButton
              onClick={onAction}
              leadingIcon={
                tone === "search" ? (
                  <SearchIcon className="h-6 w-6" />
                ) : (
                  <BookIcon className="h-6 w-6" />
                )
              }
            >
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
      eyebrow="Connection paused"
      art={danDariaAirplane}
      icon={<OfflineIcon />}
      title={
        <>
          <span className="text-primary">You're offline </span>
          <span className="text-secondary">right now</span>
        </>
      }
      message="Check your connection and try again. Your stories will be here when you're back."
    >
      <div className="mt-5 flex w-full max-w-[20rem] items-center gap-3 rounded-[28px] border border-accent/70 bg-card p-4 text-left shadow-card">
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

export function ErrorState({
  message = "That did not load quite right.",
  detail,
  onRetry,
  onBack,
}: {
  message?: string;
  detail?: string;
  onRetry?: () => void;
  onBack?: () => void;
}) {
  return (
    <StateShell
      eyebrow="Almost there"
      icon={<Star className="h-12 w-12" />}
      title={
        <>
          <span className="text-primary">Let's look </span>
          <span className="text-secondary">again.</span>
        </>
      }
      message={message}
      art={danDariaThinking}
      hintTitle="Hint"
      hint="Your progress is saved. Try again, or go back to a safe screen."
    >
      <div className="mt-6 w-full max-w-[20rem] space-y-3">
        {onRetry && (
          <TactileButton
            variant="secondary"
            onClick={onRetry}
            leadingIcon={<RefreshIcon className="h-6 w-6" />}
          >
            Try Again
          </TactileButton>
        )}
        {onBack && (
          <TactileButton variant="ghost" onClick={onBack}>
            Go Back
          </TactileButton>
        )}
      </div>

      {detail && (
        <details className="mt-4 w-full max-w-[20rem] text-left">
          <summary className="cursor-pointer text-[10px] font-bold uppercase tracking-wider text-ink-soft/55">
            Error details
          </summary>
          <pre className="mt-2 max-h-24 overflow-auto whitespace-pre-wrap break-words rounded-2xl bg-card p-3 text-[10px] text-ink-soft shadow-card">
            {detail}
          </pre>
        </details>
      )}
    </StateShell>
  );
}

export function NotFoundState({ onHome }: { onHome: () => void }) {
  return (
    <StateShell
      eyebrow="Page not found"
      icon={<CompassIcon />}
      title={
        <>
          <span className="text-primary">This path flew </span>
          <span className="text-secondary">off course</span>
        </>
      }
      message="This page is not part of the Story Pros adventure."
      art={danDariaAirplane}
      hintTitle="Next step"
      hint="Head home and choose a real story, reward, or adventure map stop."
    >
      <div className="mt-6 w-full max-w-[20rem]">
        <TactileButton onClick={onHome} leadingIcon={<HomeIcon className="h-6 w-6" />}>
          Go Home
        </TactileButton>
      </div>
    </StateShell>
  );
}

function StateShell({
  eyebrow,
  icon,
  title,
  message,
  art = danDariaThinking,
  hintTitle,
  hint,
  children,
}: {
  eyebrow?: string;
  icon?: ReactNode;
  title: ReactNode;
  message: string;
  art?: string;
  hintTitle?: string;
  hint?: string;
  children?: ReactNode;
}) {
  return (
    <div className="relative flex h-full flex-col items-center overflow-hidden bg-cream px-6 py-5 text-center">
      <AuthBackdrop />
      <MiniPlane className="absolute right-11 top-24 z-10 h-9 w-9 rotate-[18deg] text-secondary animate-float" />
      <Star className="absolute left-8 top-32 z-10 h-5 w-5 text-secondary animate-sparkle" />
      <Star className="absolute right-10 top-44 z-10 h-4 w-4 text-primary/35 animate-sparkle" />

      <div className="relative z-10 flex h-full w-full flex-col items-center">
        <StoryProsLogo layout="row" size="md" className="mx-auto" />
        {eyebrow && (
          <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.18em] text-primary/60">
            {eyebrow}
          </p>
        )}
        <span className="mt-3 flex h-20 w-20 items-center justify-center rounded-full border-[6px] border-card bg-secondary text-secondary-foreground shadow-card animate-bounce-in">
          {icon ?? <PaperPlaneIcon className="h-11 w-11" />}
        </span>
        <h1 className="mt-5 max-w-[20rem] font-display text-[34px] font-extrabold leading-tight">
          {title}
        </h1>
        <p className="mt-2 max-w-[19rem] text-base font-semibold leading-relaxed text-ink-soft">
          {message}
        </p>
        <div className="mt-5 w-full overflow-hidden rounded-[30px] border-[6px] border-card bg-gradient-to-b from-white to-accent/45 shadow-soft">
          <img src={art} alt="" className="h-[218px] w-full object-contain object-bottom" />
        </div>
        {hint && (
          <div className="mt-4 flex w-full max-w-[20rem] items-center gap-3 rounded-[26px] border border-accent/70 bg-card/95 p-4 text-left shadow-card">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <LightbulbIcon />
            </span>
            <p className="text-sm font-semibold leading-snug text-ink-soft">
              {hintTitle && <span className="block font-extrabold text-primary">{hintTitle}</span>}
              {hint}
            </p>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

function EmphasizedTitle({ children }: { children: string }) {
  const words = children.split(" ");
  if (words.length < 3) return <>{children}</>;
  return (
    <>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className={index === 1 ? "text-secondary" : undefined}>
          {word}
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}

function SearchIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      aria-hidden
    >
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.4 15.4L21 21" strokeLinecap="round" />
    </svg>
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

function RefreshIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden
    >
      <path d="M20 12a8 8 0 1 1-2.3-5.6" strokeLinecap="round" />
      <path d="M20 4v5h-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden
    >
      <path d="M9 18h6" strokeLinecap="round" />
      <path d="M10 21h4" strokeLinecap="round" />
      <path d="M8 14a6 6 0 1 1 8 0c-.8.7-1.2 1.5-1.2 2.4H9.2C9.2 15.5 8.8 14.7 8 14z" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-11 w-11"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2.2 5-4.8 2 2.2-5 4.8-2z" strokeLinejoin="round" />
    </svg>
  );
}
