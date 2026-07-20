/* ─────────────────────────────────────────────
 * Legal page layout — shared by /privacy and /terms.
 * Website-style prose page with the brand header.
 * ───────────────────────────────────────────── */

import { Link } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { StoryProsLogo } from "./StoryProsBrand";
import { LEGAL, LEGAL_HAS_PLACEHOLDERS } from "@/data/legalConfig";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh w-full bg-gradient-to-br from-cream-deep via-cream to-sky/40 text-ink">
      <header className="sticky top-0 z-40 border-b border-accent/40 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link to="/" aria-label="Story Pros home">
            <StoryProsLogo layout="row" size="sm" />
          </Link>
          <Link
            to="/"
            className="press-pop rounded-2xl px-4 py-2 text-sm font-extrabold text-primary transition-colors hover:bg-primary/5"
          >
            Back to Story Pros
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl font-extrabold text-primary sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm font-semibold text-ink-soft">
          Effective: {LEGAL.effectiveDate}
        </p>
        {LEGAL_HAS_PLACEHOLDERS && (
          <p className="mt-3 rounded-2xl bg-secondary/20 px-4 py-2 text-xs font-bold text-secondary-foreground">
            Beta preview — a few company details are still being finalized.
          </p>
        )}

        <div className="mt-8 space-y-8">{children}</div>

        <footer className="mt-12 border-t border-accent/40 pt-6 pb-10 text-sm font-medium text-ink-soft">
          <p className="font-extrabold text-primary">{LEGAL.businessName}</p>
          <p className="mt-1">Questions: {LEGAL.contactEmail}</p>
          <p className="mt-4 text-xs">
            <Link to="/privacy" className="font-bold text-primary hover:underline">
              Privacy Policy
            </Link>
            {" · "}
            <Link to="/terms" className="font-bold text-primary hover:underline">
              Terms of Service
            </Link>
          </p>
        </footer>
      </main>
    </div>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-extrabold text-primary">{heading}</h2>
      <div className="mt-3 space-y-3 text-[15px] font-medium leading-relaxed text-ink-soft">
        {children}
      </div>
    </section>
  );
}
