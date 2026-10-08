import { useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";

const SHOW_ON_PATHS = ["/", "/login", "/landingpage"];

/**
 * Small floating shortcut so the admin can jump straight to the
 * parent dashboard or the story library from the landing/login pages.
 */
export function AdminQuickNav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (!SHOW_ON_PATHS.includes(pathname)) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-xl">
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard" })}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:opacity-90"
          >
            Parent Dashboard
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: "/library" })}
            className="rounded-xl bg-secondary px-4 py-2 text-sm font-bold text-secondary-foreground transition hover:opacity-90"
          >
            Stories
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: "/home" })}
            className="rounded-xl bg-muted px-4 py-2 text-sm font-bold text-foreground transition hover:opacity-90"
          >
            Kids Home
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Admin shortcuts"
        className="rounded-full border border-border bg-card px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground shadow-lg transition hover:text-foreground"
      >
        Admin
      </button>
    </div>
  );
}
