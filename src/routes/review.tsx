/* ─────────────────────────────────────────────
 * /review — screen-by-screen feedback hub
 *
 * Share this link with anyone reviewing the app.
 * Every screen is listed under collapsible categories;
 * each one has an "Open this screen" jump (via demo
 * mode when sign-in is needed), a suggestion box, and
 * the list of changes already requested with an
 * open/done toggle. Requests save to the cloud.
 * ───────────────────────────────────────────── */

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db, logSyncError } from "@/services/cloud";
import { DEMO_PERSONA_ID } from "@/services/demoAccounts";
import {
  SCREEN_CATALOG,
  TOTAL_SCREENS,
  type CatalogScreen,
} from "@/data/screenCatalog";
import { StoryProsLogo } from "@/components/empowered/StoryProsBrand";
import { ChevronRightIcon } from "@/components/empowered/StoryProsUi";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/review")({
  component: ReviewPage,
});

interface FeedbackRow {
  id: string;
  screen_key: string;
  screen_label: string;
  category: string;
  author: string | null;
  content: string;
  status: "open" | "done";
  created_at: string;
}

const AUTHOR_KEY = "storypros_review_author";

function ReviewPage() {
  const [feedback, setFeedback] = useState<FeedbackRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openScreen, setOpenScreen] = useState<string | null>(null);
  const [filterOpenOnly, setFilterOpenOnly] = useState(false);

  async function loadFeedback() {
    try {
      const { data, error } = await db
        .from("screen_feedback")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setFeedback((data ?? []) as FeedbackRow[]);
    } catch (err) {
      logSyncError("load feedback")(err);
    } finally {
      setLoaded(true);
    }
  }

  useEffect(() => {
    void loadFeedback();
  }, []);

  const byScreen = useMemo(() => {
    const map = new Map<string, FeedbackRow[]>();
    for (const row of feedback) {
      const list = map.get(row.screen_key) ?? [];
      list.push(row);
      map.set(row.screen_key, list);
    }
    return map;
  }, [feedback]);

  const openCount = feedback.filter((f) => f.status === "open").length;

  async function toggleStatus(row: FeedbackRow) {
    const next = row.status === "open" ? "done" : "open";
    setFeedback((prev) =>
      prev.map((f) => (f.id === row.id ? { ...f, status: next } : f)),
    );
    const { error } = await db
      .from("screen_feedback")
      .update({ status: next })
      .eq("id", row.id);
    if (error) {
      logSyncError("toggle feedback")(error);
      void loadFeedback();
    }
  }

  return (
    <div className="min-h-dvh w-full bg-gradient-to-br from-cream-deep via-cream to-sky/40 text-ink">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-accent/40 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between px-4 sm:px-6">
          <StoryProsLogo layout="row" size="sm" />
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-card px-3 py-1.5 text-xs font-extrabold text-primary shadow-card">
              {TOTAL_SCREENS} screens
            </span>
            <button
              onClick={() => setFilterOpenOnly((v) => !v)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-extrabold shadow-card transition-colors",
                filterOpenOnly
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground",
              )}
            >
              {openCount} open {openCount === 1 ? "request" : "requests"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        <h1 className="font-display text-3xl font-extrabold text-primary">
          Design Review
        </h1>
        <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-ink-soft">
          Every screen in Story Pros, organized by area. Open a category, pick a
          screen, jump into the live app to look at it, then write what you'd
          like changed. Everything submitted here lands in one list the team
          works from.
        </p>

        {/* Categories accordion */}
        <div className="mt-8 space-y-3">
          {SCREEN_CATALOG.map((category) => {
            const isOpen = openCategory === category.key;
            const categoryFeedback = category.screens.reduce(
              (sum, s) => sum + (byScreen.get(s.key)?.filter((f) => f.status === "open").length ?? 0),
              0,
            );
            const visibleScreens = filterOpenOnly
              ? category.screens.filter((s) =>
                  (byScreen.get(s.key) ?? []).some((f) => f.status === "open"),
                )
              : category.screens;
            if (filterOpenOnly && visibleScreens.length === 0) return null;

            return (
              <section
                key={category.key}
                className="overflow-hidden rounded-[24px] border border-accent/60 bg-card shadow-card"
              >
                <button
                  onClick={() => {
                    setOpenCategory(isOpen ? null : category.key);
                    setOpenScreen(null);
                  }}
                  className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-accent/20"
                >
                  <span className="text-2xl" aria-hidden>{category.icon}</span>
                  <span className="flex-1">
                    <span className="block text-lg font-extrabold text-primary">
                      {category.label}
                    </span>
                    <span className="text-xs font-semibold text-ink-soft">
                      {category.screens.length} screens
                      {categoryFeedback > 0 && ` · ${categoryFeedback} open`}
                    </span>
                  </span>
                  <ChevronRightIcon
                    className={cn(
                      "h-5 w-5 text-ink-soft transition-transform",
                      isOpen && "rotate-90",
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="divide-y divide-accent/40 border-t border-accent/40">
                    {visibleScreens.map((screen) => (
                      <ScreenRow
                        key={screen.key}
                        screen={screen}
                        category={category.label}
                        expanded={openScreen === screen.key}
                        onToggle={() =>
                          setOpenScreen(openScreen === screen.key ? null : screen.key)
                        }
                        rows={byScreen.get(screen.key) ?? []}
                        onSubmitted={loadFeedback}
                        onToggleStatus={toggleStatus}
                      />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {!loaded && (
          <p className="mt-6 text-center text-sm font-semibold text-ink-soft">
            Loading requests…
          </p>
        )}

        <footer className="mt-10 pb-8 text-center text-xs font-semibold text-ink-soft">
          Story Pros · internal review page — share the link only with the team.
        </footer>
      </main>
    </div>
  );
}

/* ── One screen row ── */

function ScreenRow({
  screen,
  category,
  expanded,
  onToggle,
  rows,
  onSubmitted,
  onToggleStatus,
}: {
  screen: CatalogScreen;
  category: string;
  expanded: boolean;
  onToggle: () => void;
  rows: FeedbackRow[];
  onSubmitted: () => Promise<void> | void;
  onToggleStatus: (row: FeedbackRow) => void;
}) {
  const { startDemoSession } = useAuth();
  const openRows = rows.filter((r) => r.status === "open");

  function openLive() {
    if (!screen.route) return;
    // Start the demo session first — it persists in localStorage,
    // so the new tab picks it up automatically
    if (screen.needsAuth) {
      startDemoSession(
        DEMO_PERSONA_ID,
        screen.route.startsWith("/onboarding") ? { onboarding: true } : undefined,
      );
    }
    // Open in a new tab so the review page stays put for writing feedback
    window.open(screen.route, "_blank", "noopener");
  }

  return (
    <div className="bg-card">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-accent/15"
      >
        <span className="flex-1">
          <span className="block text-sm font-extrabold text-ink">{screen.label}</span>
          {openRows.length > 0 && (
            <span className="text-[11px] font-bold text-secondary-foreground/80">
              {openRows.length} open {openRows.length === 1 ? "request" : "requests"}
            </span>
          )}
        </span>
        <ChevronRightIcon
          className={cn(
            "h-4 w-4 text-ink-soft transition-transform",
            expanded && "rotate-90",
          )}
        />
      </button>

      {expanded && (
        <div className="space-y-4 bg-cream/60 px-5 py-4">
          <p className="text-sm font-medium leading-relaxed text-ink-soft">
            {screen.description}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {screen.route && (
              <button
                onClick={openLive}
                className="press-pop inline-flex items-center gap-1.5 rounded-2xl bg-primary px-4 py-2 text-xs font-extrabold text-primary-foreground shadow-card"
              >
                Open this screen
                <ChevronRightIcon className="h-3.5 w-3.5" />
              </button>
            )}
            {screen.howToReach && (
              <span className="text-[11px] font-semibold text-ink-soft">
                {screen.howToReach}
              </span>
            )}
          </div>

          <FeedbackForm screen={screen} category={category} onSubmitted={onSubmitted} />

          {rows.length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-ink-soft">
                Requested changes
              </p>
              {rows.map((row) => (
                <div
                  key={row.id}
                  className={cn(
                    "rounded-2xl border px-4 py-3",
                    row.status === "done"
                      ? "border-accent/40 bg-card/60 opacity-70"
                      : "border-accent/70 bg-card",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p
                      className={cn(
                        "flex-1 whitespace-pre-wrap text-sm font-medium leading-relaxed text-ink",
                        row.status === "done" && "line-through decoration-ink-soft/50",
                      )}
                    >
                      {row.content}
                    </p>
                    <button
                      onClick={() => onToggleStatus(row)}
                      className={cn(
                        "shrink-0 rounded-full px-3 py-1 text-[11px] font-extrabold transition-colors",
                        row.status === "done"
                          ? "bg-success/15 text-success"
                          : "bg-secondary/25 text-secondary-foreground hover:bg-secondary/40",
                      )}
                    >
                      {row.status === "done" ? "Done ✓" : "Mark done"}
                    </button>
                  </div>
                  <p className="mt-1.5 text-[11px] font-semibold text-ink-soft">
                    {row.author?.trim() || "Anonymous"} ·{" "}
                    {new Date(row.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Suggestion box ── */

function FeedbackForm({
  screen,
  category,
  onSubmitted,
}: {
  screen: CatalogScreen;
  category: string;
  onSubmitted: () => Promise<void> | void;
}) {
  const [author, setAuthor] = useState(() => {
    try {
      return localStorage.getItem(AUTHOR_KEY) ?? "";
    } catch {
      return "";
    }
  });
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (content.trim().length < 3 || busy) return;
    setBusy(true);
    setError("");
    try {
      localStorage.setItem(AUTHOR_KEY, author.trim());
    } catch { /* ignore */ }

    const { error: insertError } = await db.from("screen_feedback").insert({
      screen_key: screen.key,
      screen_label: screen.label,
      category,
      author: author.trim() || null,
      content: content.trim(),
    });
    setBusy(false);
    if (insertError) {
      logSyncError("submit feedback")(insertError);
      setError("Couldn't save that. Please try again.");
      return;
    }
    setContent("");
    setSent(true);
    setTimeout(() => setSent(false), 2000);
    await onSubmitted();
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={`What would you change about "${screen.label}"?`}
        rows={3}
        maxLength={2000}
        className="w-full rounded-2xl border-2 border-accent/60 bg-card p-3 text-sm font-medium text-ink placeholder:text-ink-soft/50 focus:border-primary focus:outline-none transition-colors"
      />
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your name (optional)"
          maxLength={60}
          className="w-40 rounded-2xl border-2 border-accent/60 bg-card px-3 py-2 text-xs font-semibold text-ink placeholder:text-ink-soft/50 focus:border-primary focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={content.trim().length < 3 || busy}
          className="press-pop rounded-2xl bg-secondary px-5 py-2 text-xs font-extrabold text-secondary-foreground shadow-[0_3px_0_0_var(--secondary-deep)] transition-all disabled:opacity-40"
        >
          {busy ? "Saving…" : sent ? "Saved ✓" : "Submit"}
        </button>
        {error && <span className="text-xs font-bold text-destructive">{error}</span>}
      </div>
    </form>
  );
}
