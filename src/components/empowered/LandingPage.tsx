/* ─────────────────────────────────────────────
 * Landing Page — the public front door
 *
 * Copy and section order are CLIENT-APPROVED (see
 * src/data/landingContent.ts). Colors, typography,
 * cards, tactile buttons, and animations come from
 * the Story Pros design system.
 * ───────────────────────────────────────────── */

import { useState } from "react";
import { StoryProsLogo } from "./StoryProsBrand";
import { PaperPlaneIcon, ChevronRightIcon } from "./StoryProsUi";
import { cn } from "@/lib/utils";
import {
  PRICE,
  PRICE_PERIOD,
  TRIAL_DAYS,
  HOW_IT_WORKS,
  DIFFERENTIATORS,
  PERFECT_FOR,
  TESTIMONIALS,
  COMPARISON_COLUMNS,
  COMPARISON_ROWS,
  COMPARISON_NOTE,
  PRICING_FEATURES,
  FAQS,
  type Cell,
} from "@/data/landingContent";
import danDariaAirplane from "@/assets/dan-daria-airplane.webp";
import danDariaReading from "@/assets/dan-daria-reading.webp";
import danDariaHighfive from "@/assets/dan-daria-highfive.webp";
import danDariaThinking from "@/assets/dan-daria-thinking.webp";
import dariaPointing from "@/assets/daria-pointing.webp";

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  /** One click, straight into the live demo */
  onDemo: () => void;
}

const NAV_LINKS = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#clinicians", label: "For Clinicians" },
  { href: "#faq", label: "FAQ" },
];

const STEP_IMAGES = [danDariaReading, danDariaAirplane, danDariaHighfive];

export function LandingPage({ onGetStarted, onLogin, onDemo }: LandingPageProps) {
  return (
    <div className="min-h-dvh w-full bg-gradient-to-br from-cream-deep via-cream to-sky/40 text-ink">
      {/* ── Top nav ── */}
      <header className="sticky top-0 z-40 border-b border-accent/40 bg-cream/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <StoryProsLogo layout="row" size="sm" />
          <nav className="hidden items-center gap-6 text-sm font-bold text-ink-soft lg:flex">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="transition-colors hover:text-primary">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onDemo}
              className="press-pop inline-flex items-center gap-1.5 rounded-2xl bg-secondary px-4 py-2 text-sm font-extrabold text-secondary-foreground shadow-[0_3px_0_0_var(--secondary-deep)] transition-all hover:brightness-105"
            >
              <PaperPlaneIcon className="h-4 w-4" />
              Demo
            </button>
            <button
              onClick={onLogin}
              className="press-pop hidden rounded-2xl px-4 py-2 text-sm font-extrabold text-primary transition-colors hover:bg-primary/5 sm:inline-flex"
            >
              Log in
            </button>
            <button
              onClick={onGetStarted}
              className="press-pop rounded-2xl bg-primary px-4 py-2 text-sm font-extrabold text-primary-foreground shadow-card transition-colors hover:bg-primary/95"
            >
              Start Free Trial
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:pb-24 lg:pt-20">
          <div className="animate-slide-up text-center lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide text-primary shadow-card">
              <PaperPlaneIcon className="h-4 w-4" />
              The First App Created For Kids With DLD
            </p>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] text-primary sm:text-5xl lg:text-[54px]">
              Daily story sessions for children with DLD that build:
            </h1>

            <ul className="mx-auto mt-6 flex max-w-md flex-wrap justify-center gap-2.5 lg:mx-0 lg:justify-start">
              {["Vocabulary", "Comprehension", "Confidence"].map((word, i) => (
                <li
                  key={word}
                  className="animate-pop-in rounded-full bg-card px-5 py-2.5 text-lg font-extrabold text-primary shadow-card"
                  style={{ animationDelay: `${i * 90}ms` }}
                >
                  {word}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <button
                onClick={onGetStarted}
                className="press-pop inline-flex h-14 w-full items-center justify-center gap-2 rounded-3xl bg-primary px-8 text-lg font-extrabold text-primary-foreground shadow-[0_5px_0_0_var(--primary-deep)] transition-all hover:brightness-105 sm:w-auto"
              >
                Start {TRIAL_DAYS}-Day Free Trial
                <ChevronRightIcon className="h-5 w-5 text-secondary" />
              </button>
              <button
                onClick={onDemo}
                className="press-pop inline-flex h-14 w-full items-center justify-center rounded-3xl border-2 border-primary/70 bg-card px-8 text-lg font-extrabold text-primary transition-colors hover:bg-primary/5 sm:w-auto"
              >
                Try a demo
              </button>
            </div>

            <p className="mt-4 text-sm font-bold text-ink-soft">
              Then {PRICE}
              {PRICE_PERIOD} • Cancel anytime
            </p>
            <p className="mt-2 text-sm font-medium text-ink-soft/90">
              Designed for Developmental Language Disorder and language-based learning differences.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <span
              className="absolute inset-x-8 bottom-4 h-40 rounded-full bg-primary/10 blur-2xl"
              aria-hidden
            />
            <img
              src={danDariaAirplane}
              alt="Dan and Daria flying a paper airplane"
              className="relative z-10 mx-auto w-full max-w-[420px] animate-float object-contain drop-shadow-[0_24px_40px_rgba(63,38,140,0.18)] lg:max-w-[520px]"
            />
          </div>
        </div>
      </section>

      {/* ── You're not alone ── */}
      <section className="border-y border-accent/40 bg-card/70">
        <div className="mx-auto grid w-full max-w-5xl items-center gap-8 px-4 py-14 sm:px-6 md:grid-cols-[1fr_220px]">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-secondary-foreground/80">
              You're not alone
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight text-primary">
              You know your child struggles with language...
            </h2>
            <p className="mt-4 max-w-2xl text-lg font-medium leading-relaxed text-ink-soft">
              They have trouble following stories, answering questions, or explaining what happened
              at school. You're on a waitlist for speech therapy, or you want to support what
              they're learning between sessions. But you don't know where to start.
            </p>
          </div>
          <img
            src={danDariaThinking}
            alt=""
            className="mx-auto h-44 w-auto animate-bob object-contain drop-shadow-[0_16px_24px_rgba(63,38,140,0.16)]"
          />
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="scroll-mt-20">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center font-display text-3xl font-extrabold text-primary sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-2 text-center text-base font-medium text-ink-soft">
            A simple path to language learning you can trust.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map((step, i) => (
              <article
                key={step.step}
                className="hover-lift animate-slide-up rounded-[28px] border border-accent/60 bg-card p-6 text-center shadow-card transition-all"
                style={{ animationDelay: `${i * 110}ms` }}
              >
                <img src={STEP_IMAGES[i]} alt="" className="mx-auto h-32 w-auto object-contain" />
                <p className="mt-4 font-display text-3xl font-extrabold text-secondary">
                  {step.step}
                </p>
                <h3 className="mt-1 text-xl font-extrabold text-primary">{step.title}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-ink-soft">
                  {step.body}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={onGetStarted}
              className="press-pop inline-flex h-14 items-center justify-center gap-2 rounded-3xl bg-primary px-8 text-lg font-extrabold text-primary-foreground shadow-[0_5px_0_0_var(--primary-deep)] transition-all hover:brightness-105"
            >
              Start {TRIAL_DAYS}-Day Free Trial
              <ChevronRightIcon className="h-5 w-5 text-secondary" />
            </button>
          </div>
        </div>
      </section>

      {/* ── What makes Story Pros different ── */}
      <section className="bg-card/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center font-display text-3xl font-extrabold text-primary sm:text-4xl">
            What Makes Story Pros Different
          </h2>
          <p className="mt-2 text-center text-base font-medium text-ink-soft">
            Evidence-based language learning for your child.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {DIFFERENTIATORS.map((item, i) => (
              <article
                key={item.title}
                className="hover-lift animate-slide-up flex gap-4 rounded-[28px] border border-accent/60 bg-card p-6 shadow-card transition-all"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-accent text-2xl"
                  aria-hidden
                >
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg font-extrabold text-primary">{item.title}</h3>
                  <p className="mt-1.5 text-sm font-medium leading-relaxed text-ink-soft">
                    {item.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Perfect for children with ── */}
      <section id="clinicians" className="scroll-mt-20">
        <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
          <h2 className="text-center font-display text-3xl font-extrabold text-primary sm:text-4xl">
            Perfect For Children With:
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {PERFECT_FOR.map((item, i) => (
              <li
                key={item}
                className="animate-slide-up flex items-center gap-3 rounded-[20px] border border-accent/50 bg-card px-4 py-3 shadow-card"
                style={{ animationDelay: `${i * 45}ms` }}
              >
                <CheckMark />
                <span className="text-[15px] font-bold text-ink">{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center text-base font-bold text-primary">
            Join families already using Story Pros
          </p>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="border-y border-accent/40 bg-card/60">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center font-display text-3xl font-extrabold text-primary sm:text-4xl">
            What They're Saying
          </h2>
          <p className="mt-2 text-center text-base font-medium text-ink-soft">
            Loved by families and therapists.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {TESTIMONIALS.map((t, i) => (
              <figure
                key={t.name}
                className="hover-lift animate-slide-up rounded-[28px] border border-accent/60 bg-card p-6 shadow-card transition-all"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <span className="font-display text-4xl leading-none text-accent" aria-hidden>
                  "
                </span>
                <blockquote className="-mt-3 text-[15px] font-medium leading-relaxed text-ink">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-4 text-sm font-extrabold text-primary">
                  {t.name}
                  <span className="block text-xs font-semibold text-ink-soft">{t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison ── */}
      <section>
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center font-display text-3xl font-extrabold text-primary sm:text-4xl">
            How Story Pros Compares
          </h2>
          <p className="mt-2 text-center text-base font-medium text-ink-soft">
            See what makes us different
          </p>

          <div className="mt-8 overflow-x-auto rounded-[28px] border border-accent/60 bg-card shadow-card">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-accent/50">
                  <th className="px-4 py-4 text-left text-xs font-extrabold uppercase tracking-wide text-ink-soft">
                    Feature
                  </th>
                  {COMPARISON_COLUMNS.map((col) => (
                    <th
                      key={col}
                      className={cn(
                        "px-4 py-4 text-center text-xs font-extrabold uppercase tracking-wide",
                        col === "Story Pros"
                          ? "rounded-t-2xl bg-primary/10 text-primary"
                          : "text-ink-soft",
                      )}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.feature} className="border-b border-accent/30 last:border-0">
                    <td className="px-4 py-3 text-left font-bold text-ink">{row.feature}</td>
                    {row.cells.map((cell, i) => (
                      <td
                        key={i}
                        className={cn(
                          "px-4 py-3 text-center font-bold",
                          i === row.cells.length - 1 && "bg-primary/5 text-primary",
                        )}
                      >
                        <CompareCell value={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mx-auto mt-4 max-w-3xl text-center text-xs font-medium leading-relaxed text-ink-soft">
            {COMPARISON_NOTE}
          </p>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="scroll-mt-20 bg-card/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center font-display text-3xl font-extrabold text-primary sm:text-4xl">
            Pricing
          </h2>

          <div className="mx-auto mt-8 max-w-md rounded-[32px] border-2 border-primary/30 bg-card p-8 text-center shadow-soft">
            <p className="font-display text-6xl font-extrabold leading-none text-primary">
              {PRICE}
              <span className="text-2xl font-bold text-ink-soft">{PRICE_PERIOD}</span>
            </p>
            <p className="mt-2 inline-flex rounded-full bg-secondary px-4 py-1.5 text-sm font-extrabold text-secondary-foreground shadow-[0_3px_0_0_var(--secondary-deep)]">
              {TRIAL_DAYS}-day free trial
            </p>

            <ul className="mt-6 space-y-2.5 text-left">
              {PRICING_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <CheckMark />
                  <span className="text-[15px] font-bold text-ink">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={onGetStarted}
              className="press-pop mt-7 inline-flex h-14 w-full items-center justify-center gap-2 rounded-3xl bg-primary px-8 text-lg font-extrabold text-primary-foreground shadow-[0_5px_0_0_var(--primary-deep)] transition-all hover:brightness-105"
            >
              Start Your Free Trial
              <ChevronRightIcon className="h-5 w-5 text-secondary" />
            </button>
            <p className="mt-3 text-xs font-bold text-ink-soft">
              No credit card charge for {TRIAL_DAYS} days
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="scroll-mt-20">
        <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="text-center font-display text-3xl font-extrabold text-primary sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-center text-base font-medium text-ink-soft">
            Everything you need to know
          </p>

          <div className="mt-8 space-y-3">
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="border-t border-accent/40 bg-card/60">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 text-center sm:px-6">
          <img
            src={dariaPointing}
            alt=""
            className="mx-auto h-28 w-auto animate-bob object-contain"
          />
          <h2 className="mt-4 font-display text-3xl font-extrabold text-primary sm:text-4xl">
            Start Building Language Skills Today
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base font-medium text-ink-soft">
            Join families already using Story Pros to support their child's language development.
          </p>
          <button
            onClick={onGetStarted}
            className="press-pop mt-7 inline-flex h-14 items-center justify-center gap-2 rounded-3xl bg-primary px-8 text-lg font-extrabold text-primary-foreground shadow-[0_5px_0_0_var(--primary-deep)] transition-all hover:brightness-105"
          >
            Start Your {TRIAL_DAYS}-Day Free Trial
            <ChevronRightIcon className="h-5 w-5 text-secondary" />
          </button>
          <p className="mt-3 text-sm font-bold text-ink-soft">
            No charge for {TRIAL_DAYS} days • Cancel anytime
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-accent/40">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <StoryProsLogo layout="row" size="sm" />
            <p className="mt-3 max-w-xs text-sm font-medium leading-relaxed text-ink-soft">
              Story Pros helps families and children connect with language through stories and
              trust.
            </p>
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-wide text-primary">
              Quick Links
            </p>
            <ul className="mt-3 space-y-2 text-sm font-bold text-ink-soft">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="transition-colors hover:text-primary">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-wide text-primary">Legal</p>
            <ul className="mt-3 space-y-2 text-sm font-bold text-ink-soft">
              <li>
                <a href="/privacy" className="transition-colors hover:text-primary">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="transition-colors hover:text-primary">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-accent/30 px-4 py-5 text-center text-xs font-semibold text-ink-soft sm:px-6">
          © {new Date().getFullYear()} Empowered DLD · Story Pros. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

/* ───────── pieces ───────── */

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-[24px] border border-accent/60 bg-card shadow-card">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-accent/20"
      >
        <span className="flex-1 text-[15px] font-extrabold text-primary">{question}</span>
        <ChevronRightIcon
          className={cn("h-5 w-5 shrink-0 text-ink-soft transition-transform", open && "rotate-90")}
        />
      </button>
      {open && (
        <div className="animate-slide-up space-y-2 border-t border-accent/40 px-5 py-4">
          {answer
            .split("\n")
            .filter(Boolean)
            .map((line, i) => (
              <p key={i} className="text-sm font-medium leading-relaxed text-ink-soft">
                {line}
              </p>
            ))}
        </div>
      )}
    </div>
  );
}

function CompareCell({ value }: { value: Cell }) {
  if (value === true) return <CheckMark />;
  if (value === false) return <span className="text-ink-soft/40">—</span>;
  if (value === "partial") return <span className="text-xs text-ink-soft">Partial</span>;
  if (value === "sometimes") return <span className="text-xs text-ink-soft">Sometimes</span>;
  return <span>{value}</span>;
}

function CheckMark() {
  return (
    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        aria-hidden
      >
        <path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
