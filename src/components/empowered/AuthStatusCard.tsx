import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LockIcon, MiniPlane } from "./StoryProsBrand";
import { PaperPlaneIcon } from "./StoryProsUi";

type AuthStatusTone = "error" | "success" | "loading" | "info";

interface AuthStatusCardProps {
  tone: AuthStatusTone;
  title: string;
  message?: string;
  action?: ReactNode;
  className?: string;
}

export function AuthStatusCard({
  tone,
  title,
  message,
  action,
  className,
}: AuthStatusCardProps) {
  const isError = tone === "error";
  const isSuccess = tone === "success";
  const isLoading = tone === "loading";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[26px] border bg-card/95 p-4 shadow-card",
        isError && "border-destructive/25 bg-destructive/10",
        isSuccess && "border-secondary/45 bg-secondary/10",
        isLoading && "border-accent/70 bg-card/90",
        tone === "info" && "border-accent/70 bg-accent/25",
        className,
      )}
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-card",
            isError && "bg-destructive/15 text-destructive",
            isSuccess && "bg-secondary text-secondary-foreground",
            isLoading && "bg-accent text-primary",
            tone === "info" && "bg-card text-primary",
          )}
        >
          {isError ? (
            <LockIcon className="h-6 w-6" />
          ) : isSuccess ? (
            <PaperPlaneIcon className="h-7 w-7" />
          ) : (
            <MiniPlane className={cn("h-7 w-7 rotate-12", isLoading && "animate-float")} />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-sm font-extrabold leading-tight",
              isError ? "text-destructive" : "text-primary",
            )}
          >
            {title}
          </p>
          {message && (
            <p className="mt-1 text-xs font-semibold leading-relaxed text-ink-soft">{message}</p>
          )}
          {action && <div className="mt-3">{action}</div>}
        </div>
      </div>
    </div>
  );
}
