import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PhoneFrameProps {
  children: ReactNode;
  className?: string;
  /**
   * "focus"  — centered column for auth/onboarding flows
   * "app"    — full-width website canvas; on laptop (lg+) the
   *            signed-in app adds a top nav (see AppChrome) while
   *            tablets/phones keep app-style bottom tabs
   */
  variant?: "focus" | "app";
}

/**
 * Adaptive shell (formerly a phone mockup — the name is kept so
 * existing imports keep working). Fills the viewport on every
 * device; no fake device chrome.
 */
export function PhoneFrame({ children, className, variant = "focus" }: PhoneFrameProps) {
  if (variant === "app") {
    // Full-bleed website canvas
    return (
      <div
        className={cn("relative flex h-dvh w-full flex-col overflow-hidden bg-cream", className)}
      >
        <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar">{children}</div>
      </div>
    );
  }

  // Focused column (login, signup, intro, demo picker)
  return (
    <div className="min-h-dvh w-full bg-gradient-to-br from-cream-deep via-cream to-sky/40">
      <div
        className={cn(
          "relative mx-auto flex h-dvh w-full flex-col overflow-hidden bg-cream",
          "sm:max-w-[560px] lg:max-w-[600px]",
          "sm:shadow-[0_0_60px_-24px_rgba(63,38,140,0.25)]",
          className,
        )}
      >
        <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar">{children}</div>
      </div>
    </div>
  );
}
