import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PhoneFrameProps {
  children: ReactNode;
  className?: string;
}

/**
 * Adaptive app shell (formerly a phone mockup).
 *
 * Story Pros now renders like a website: it fills the viewport on
 * every device and the content column widens with the screen —
 * edge-to-edge on phones, a comfortable reading/playing column on
 * tablets and laptops. No fake device chrome.
 *
 * The name `PhoneFrame` is kept so existing imports keep working.
 */
export function PhoneFrame({ children, className }: PhoneFrameProps) {
  return (
    <div className="min-h-dvh w-full bg-gradient-to-br from-cream-deep via-cream to-sky/40">
      <div
        className={cn(
          // Fluid, device-adaptive column:
          //  - phones: full width, full height
          //  - tablets: centered 640px column
          //  - laptops+: centered 720px column with soft edges
          "relative mx-auto flex h-dvh w-full flex-col overflow-hidden bg-cream",
          "sm:max-w-[640px] lg:max-w-[720px]",
          "sm:shadow-[0_0_60px_-24px_rgba(63,38,140,0.25)]",
          className,
        )}
      >
        {/* Inner scroll area */}
        <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
