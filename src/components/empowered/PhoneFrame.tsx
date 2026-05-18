import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PhoneFrameProps {
  children: ReactNode;
  className?: string;
}

/**
 * Mobile-first phone frame: 390x844 device on desktop, fullscreen on phones.
 * Inner content scrolls; status bar is faked at the top.
 */
export function PhoneFrame({ children, className }: PhoneFrameProps) {
  return (
    <div className="min-h-dvh w-full bg-gradient-to-br from-cream-deep via-cream to-sky/40 flex items-center justify-center sm:p-6">
      <div
        className={cn(
          // Fullscreen on small phones, framed device on tablet+.
          "relative w-full h-dvh sm:h-[844px] sm:w-[390px] sm:rounded-[44px] sm:border-[10px] sm:border-ink/90 sm:shadow-[0_30px_80px_-20px_rgba(28,28,21,0.45)] overflow-hidden bg-cream",
          className,
        )}
      >
        {/* Notch (decorative, only on framed view) */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 z-30 h-7 w-32 rounded-b-2xl bg-ink/90" />

        {/* Status bar */}
        <div className="relative z-20 flex items-center justify-between px-7 pt-3 pb-1 text-xs font-semibold text-ink sm:pt-4">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <SignalIcon />
            <WifiIcon />
            <BatteryIcon />
          </div>
        </div>

        {/* Inner scroll area */}
        <div className="relative z-10 h-[calc(100%-28px)] sm:h-[calc(100%-32px)] overflow-y-auto no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}

function SignalIcon() {
  return (
    <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden>
      <rect x="0" y="7" width="2.5" height="3" rx="0.6" fill="currentColor" />
      <rect x="3.8" y="5" width="2.5" height="5" rx="0.6" fill="currentColor" />
      <rect x="7.6" y="3" width="2.5" height="7" rx="0.6" fill="currentColor" />
      <rect x="11.4" y="0" width="2.5" height="10" rx="0.6" fill="currentColor" />
    </svg>
  );
}
function WifiIcon() {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden>
      <path d="M7 9.2a1 1 0 100-2 1 1 0 000 2z" fill="currentColor" />
      <path d="M2.4 5.4a6.5 6.5 0 019.2 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M0.6 3.4a9 9 0 0112.8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}
function BatteryIcon() {
  return (
    <svg width="24" height="11" viewBox="0 0 24 11" fill="none" aria-hidden>
      <rect x="0.5" y="0.5" width="20" height="10" rx="2.5" stroke="currentColor" fill="none" />
      <rect x="2" y="2" width="17" height="7" rx="1.4" fill="currentColor" />
      <rect x="21.4" y="3.5" width="1.6" height="4" rx="0.7" fill="currentColor" />
    </svg>
  );
}
