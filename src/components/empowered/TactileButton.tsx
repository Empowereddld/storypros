import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

interface TactileButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
}

/**
 * EmpoweredDLD button: 56px tall, 24px radius, "thick-border" tactile depth.
 * Pressing shifts the button down 2-4px (handled by .btn-tactile utility).
 */
export const TactileButton = forwardRef<HTMLButtonElement, TactileButtonProps>(
  ({ className, variant = "primary", fullWidth = true, leadingIcon, children, disabled, ...props }, ref) => {
    const base =
      "press-pop relative inline-flex items-center justify-center gap-3 rounded-3xl px-7 text-lg font-semibold tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cream focus-visible:ring-primary/60 disabled:opacity-60 disabled:cursor-not-allowed";

    const variants: Record<Variant, string> = {
      primary: "btn-tactile bg-primary text-primary-foreground hover:bg-primary/95",
      secondary: "btn-tactile-secondary bg-secondary text-secondary-foreground hover:bg-secondary/95",
      ghost:
        "border-2 border-primary/80 text-primary bg-transparent hover:bg-primary/5 transition-all",
    };

    return (
      <button
        ref={ref}
        className={cn(
          base,
          variants[variant],
          fullWidth && "w-full",
          "h-14",
          disabled && "shadow-none active:translate-y-0",
          className,
        )}
        disabled={disabled}
        {...props}
      >
        {leadingIcon && <span className="shrink-0">{leadingIcon}</span>}
        <span>{children}</span>
      </button>
    );
  },
);
TactileButton.displayName = "TactileButton";
