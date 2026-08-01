import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

interface TactileButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  noShadow?: boolean;
}

/**
 * EmpoweredDLD button: 56px tall, 24px radius, "thick-border" tactile depth.
 * Pressing shifts the button down 2-4px (handled by .btn-tactile utility).
 * Set noShadow to remove the dark drop-shadow while keeping the colour/press feel.
 */
export const TactileButton = forwardRef<HTMLButtonElement, TactileButtonProps>(
  (
    { className, variant = "primary", fullWidth = true, leadingIcon, children, disabled, noShadow, ...props },
    ref,
  ) => {
    const base =
      "press-pop relative inline-flex items-center justify-center gap-3 rounded-3xl px-7 text-lg font-semibold tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cream focus-visible:ring-primary/60 disabled:opacity-60 disabled:cursor-not-allowed";

    const variants: Record<Variant, string> = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/95",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/95",
      ghost:
        "border-2 border-primary/80 text-primary bg-transparent hover:bg-primary/5 transition-all",
    };

    const tactile: Record<Variant, string> = {
      primary: "btn-tactile",
      secondary: "btn-tactile-secondary",
      ghost: "",
    };

    return (
      <button
        ref={ref}
        className={cn(
          base,
          variants[variant],
          !noShadow && tactile[variant],
          fullWidth && "w-full",
          "h-14",
          disabled && "shadow-none active:translate-y-0",
          className,
        )}
        disabled={disabled}
        {...props}
      >
        {leadingIcon && <span className="shrink-0">{leadingIcon}</span>}
        <span className="inline-flex items-center gap-2 whitespace-nowrap">{children}</span>
      </button>
    );
  },
);
TactileButton.displayName = "TactileButton";
