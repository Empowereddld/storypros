/* ─────────────────────────────────────────────
 * Landing Page — the public front door
 *
 * Positioning follows the July 2026 client review:
 * a story-based membership for children ages 5 to 12,
 * combining guided language practice, family support,
 * and monthly community.
 *
 * Copy lives in src/data/landingContent.ts. Colors,
 * type, cards, tactile buttons, and animations come
 * from the Story Pros design system.
 * ───────────────────────────────────────────── */

import { useState } from "react";
import { StoryProsLogo } from "./StoryProsBrand";
import { PaperPlaneIcon, ChevronRightIcon } from "./StoryProsUi";
import {
  Repeat,
  CalendarDays,
  Clock,
  Users,
  MessageCircle,
  Headphones,
  AlignLeft,
  BookOpen,
  Volume2,
  CheckCircle2,
  Sparkles,
  Home,
  MessagesSquare,
  Ear,
  Search,
  LayoutGrid,
  GraduationCap,
  Handshake,
  Menu,
  X,
} from "lucide-react";


const PILLAR_ICONS: Record<string, typeof MessagesSquare> = {
  MessagesSquare,
  GraduationCap,
  Handshake,
};
import { Reveal } from "./CharacterSection";
import { StoryMathFormula } from "./StoryMathFormula";
import familyDashboardAsset from "@/assets/family-dashboard.png.asset.json";
import familyCtaAsset from "@/assets/family-cta.png.asset.json";
import heroTabletAsset from "@/assets/hero-tablet.png.asset.json";

import stepReadAsset from "@/assets/step-read-understand.png.asset.json";
import stepRetellAsset from "@/assets/step-retell-support.png.asset.json";
import stepConnectAsset from "@/assets/step-connect-real-life.png.asset.json";


const PATHWAY_IMAGES = [
  { url: stepReadAsset.url, alt: "A child listening to a Story Pros story on a tablet with headphones" },
  { url: stepRetellAsset.url, alt: "A mother and daughter retelling a Story Pros story together at a table" },
  { url: stepConnectAsset.url, alt: "Two children sharing a tablet and talking about a story" },
];
import { PreviewCarousel } from "./PreviewCarousel";
import { cn } from "@/lib/utils";
import {
  WAITLIST_URL,
  PRICE,
  PRICE_PERIOD,
  HERO,

  PARENT_PROBLEM,
  WHY_STORIES,
  PATHWAY,
  WILL_LEARN,
  COMMUNITY,
  DASHBOARD,
  DESIGNED_FOR,
  DESIGNED_FOR_HEADING,
  DESIGNED_FOR_INTRO,
  DESIGNED_FOR_NOTE,
  FOUNDERS,

  PRICING_HEADLINE,
  PRICING_SUBHEAD,
  FREE_TIER,
  MEMBERSHIP_TIER,

  FAQS,
} from "@/data/landingContent";

import danDariaReading from "@/assets/dan-daria-reading.webp";
import communityCircleZoomAsset from "@/assets/community-circle-zoom.png.asset.json";

interface LandingPageProps {
  onLogin: () => void;
  /** One click, straight into the live demo */
  onDemo: () => void;
}

const NAV_LINKS = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#community", label: "Community" },
  { href: "#membership", label: "Membership" },
  { href: "#faq", label: "FAQ" },
];

const SKILL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageCircle,
  Headphones,
  AlignLeft,
  BookOpen,
  Volume2,
  CheckCircle2,
  CalendarDays,
  Clock,
  Repeat,
  Users,
  Sparkles,
  Home,
  MessagesSquare,
  Ear,
  Search,
  LayoutGrid,
};


export function LandingPage({ onLogin, onDemo }: LandingPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-dvh w-full bg-gradient-to-br from-cream-deep via-cream to-sky/40 text-ink">
      {/* ── Top nav ── */}
      <header className="sticky top-0 z-40 border-b border-accent/40 bg-cream/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-3 sm:gap-4 sm:px-6">
          <StoryProsLogo layout="row" size="sm" className="h-9" />
          <nav className="hidden items-center gap-3.5 text-[12.5px] font-bold text-ink-soft md:flex lg:gap-6 lg:text-sm">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="whitespace-nowrap transition-colors hover:text-primary">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3">
            <button
              onClick={onDemo}
              className="press-pop inline-flex items-center gap-1.5 whitespace-nowrap rounded-2xl bg-secondary px-3 py-2 text-[13px] font-extrabold text-secondary-foreground shadow-[0_3px_0_0_var(--secondary-deep)] transition-all hover:brightness-105 lg:px-4 lg:text-sm"
            >
              <PaperPlaneIcon className="h-4 w-4 shrink-0" />
              <span className="lg:hidden">Free Story</span>
              <span className="hidden lg:inline">Try the Free Story</span>
            </button>
            <button
              onClick={onLogin}
              className="press-pop hidden whitespace-nowrap rounded-2xl px-4 py-2 text-sm font-extrabold text-primary transition-colors hover:bg-primary/5 lg:inline-flex"
            >
              Log in
            </button>

            <a
              href={WAITLIST_URL}
              target="_blank"
              rel="noopener"
              className="press-pop hidden whitespace-nowrap rounded-2xl bg-primary px-3 py-2 text-[13px] font-extrabold text-primary-foreground shadow-card transition-colors hover:bg-primary/95 md:inline-flex lg:px-4 lg:text-sm"
            >
              <span className="lg:hidden">Waitlist</span>
              <span className="hidden lg:inline">Join the Waitlist</span>
            </a>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="press-pop inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/25 bg-card text-primary transition-colors hover:bg-primary/5 md:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>

        {/* Mobile menu panel */}
        {menuOpen && (
          <div
            id="mobile-menu"
            className="border-t border-accent/40 bg-cream/98 px-4 pb-5 pt-2 shadow-card backdrop-blur md:hidden"
          >
            <nav className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-[52px] items-center justify-between border-b border-accent/40 text-[16px] font-bold text-ink transition-colors hover:text-primary"
                >
                  {link.label}
                  <ChevronRightIcon className="h-4 w-4 text-primary/50" />
                </a>
              ))}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onLogin();
                }}
                className="flex min-h-[52px] items-center border-b border-accent/40 text-left text-[16px] font-bold text-ink transition-colors hover:text-primary"
              >
                Log in
              </button>
            </nav>
            <a
              href={WAITLIST_URL}
              target="_blank"
              rel="noopener"
              onClick={() => setMenuOpen(false)}
              className="press-pop mt-4 inline-flex h-[52px] w-full items-center justify-center rounded-3xl bg-primary text-[15px] font-extrabold text-primary-foreground shadow-[0_4px_0_0_var(--primary-deep)] transition-all hover:brightness-105"
            >
              Join the Waitlist
            </a>
          </div>
        )}
      </header>


      {/* ── Hero: audience → product → experience → action ── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1240px] items-center gap-6 px-5 pb-8 pt-4 sm:gap-9 sm:px-8 sm:pb-10 sm:pt-8 lg:grid-cols-[minmax(0,47fr)_minmax(0,53fr)] lg:gap-[56px] lg:pb-[24px] lg:pt-[40px] min-[1200px]:min-h-[calc(100svh-72px)] min-[1200px]:py-[48px]">
          {/* Text first on mobile, matching the requested order */}
          <div className="animate-slide-up text-center lg:text-left">
            <p className="inline-flex max-w-[36ch] items-center justify-center gap-2 rounded-full bg-card px-3.5 py-2 text-center text-[10px] font-bold uppercase leading-[1.5] tracking-[0.06em] text-primary shadow-card text-balance sm:max-w-none sm:px-4 sm:text-[11px] sm:leading-[1.55] sm:tracking-[0.07em]">
              {HERO.eyebrow}
            </p>

            <h1 className="mx-auto mt-3 max-w-[17ch] text-balance font-display text-[33px] font-extrabold leading-[1.12] text-primary sm:mt-4 sm:max-w-[19ch] sm:text-[42px] sm:leading-[1.08] lg:mx-0 lg:mt-4 lg:max-w-[15ch] lg:text-[46px] lg:leading-[1.08]">
              {HERO.heading}
            </h1>

            <p className="mx-auto mt-2 max-w-[30ch] text-[17.5px] font-semibold leading-[1.4] text-ink sm:mt-3 sm:max-w-[34ch] sm:text-[21px] sm:leading-[1.35] lg:mx-0">
              {HERO.subheading}
            </p>

            <div className="mt-5 flex flex-col items-center gap-2.5 sm:mt-6 sm:gap-3 lg:flex-row lg:items-center lg:justify-start">

              <button
                onClick={onDemo}
                className="press-pop inline-flex h-[52px] w-full max-w-[264px] items-center justify-center gap-2 whitespace-nowrap rounded-3xl bg-primary px-8 text-base font-extrabold text-primary-foreground shadow-[0_4px_0_0_var(--primary-deep)] transition-all hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 sm:h-[56px] sm:max-w-[300px] lg:w-auto lg:px-7"
              >
                Try the Free Story
                <ChevronRightIcon className="h-5 w-5 shrink-0 text-secondary" />
              </button>
              <a
                href={WAITLIST_URL}
                target="_blank"
                rel="noopener"
                className="press-pop inline-flex h-[52px] w-full max-w-[264px] items-center justify-center whitespace-nowrap rounded-3xl border border-primary/35 bg-transparent px-8 text-base font-extrabold text-primary transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 sm:h-[56px] sm:max-w-[300px] sm:border-2 sm:border-primary/70 sm:bg-card lg:w-auto lg:px-7"
              >
                Join the Waitlist
              </a>
            </div>
          </div>


          {/* The app preview does the visual talking */}
          <div className="relative mx-auto w-full max-w-[440px] sm:max-w-[500px] lg:max-w-[600px]">
            <img
              src={heroTabletAsset.url}
              alt="A Story Pros comprehension question on a tablet"
              loading="eager"
              className="animate-float w-full drop-shadow-[0_22px_28px_rgba(28,28,21,0.18)]"
            />
          </div>

        </div>

      </section>



      {/* ── Parent problem (two-column editorial) ── */}
      <section className="px-5 pb-14 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-[72px]">
        <Reveal>
          <div className="mx-auto grid w-full max-w-[1240px] gap-6 sm:gap-8 lg:grid-cols-[minmax(0,40fr)_minmax(0,58fr)] lg:gap-[80px]">
            <h2 className="text-left font-display text-[34px] font-extrabold leading-[1.1] text-primary sm:text-[40px] lg:text-[50px]">
              {PARENT_PROBLEM.heading}
            </h2>
            <div className="text-left">
              {PARENT_PROBLEM.paragraphs.map((paragraph, i) => (
                <p
                  key={paragraph.slice(0, 24)}
                  className={cn(
                    "max-w-[620px] text-base font-medium leading-[1.6] text-ink-soft sm:text-lg sm:leading-[1.55]",
                    i > 0 ? "mt-4 sm:mt-5" : "",
                  )}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Reveal>
      </section>


      {/* ── Why stories: one connected story framework ── */}
      <section
        id="why-stories"
        className="scroll-mt-20 border-y border-accent/40 bg-card/50 px-5 py-14 sm:px-6 sm:py-16"
      >
        <Reveal>
          <div className="mx-auto grid w-full max-w-[1180px] items-center gap-10 lg:grid-cols-[minmax(0,56fr)_minmax(0,40fr)] lg:gap-[72px]">
            {/* Content first on mobile and on desktop (copy left, art right) */}
            <div className="lg:order-1">
              <h2 className="font-display text-[32px] font-extrabold leading-[1.1] text-primary sm:text-[38px]">
                {WHY_STORIES.heading}
              </h2>
              <p className="mt-4 max-w-[620px] text-base font-medium leading-[1.6] text-ink-soft sm:text-lg sm:leading-[1.55]">
                {WHY_STORIES.lead}
              </p>
              <StoryMathFormula className="mt-8" />
            </div>

            <div className="lg:order-2">
              <img
                src={danDariaReading}
                alt=""
                loading="lazy"
                className="mx-auto h-48 w-auto object-contain drop-shadow-[0_18px_28px_rgba(63,38,140,0.16)] sm:h-56 lg:h-[260px]"
              />
            </div>
          </div>
        </Reveal>
      </section>


      {/* ── How Story Pros works: the four-part pathway ── */}
      <section id="how-it-works" className="scroll-mt-20">
        <div className="mx-auto w-full max-w-6xl px-4 pt-16 pb-20 sm:px-6">
          <h2 className="font-display text-3xl font-extrabold text-primary sm:text-4xl">
            How Story Pros Works
          </h2>
          <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-ink-soft">
            A familiar, supportive routine helps children focus on language, not on figuring out what
            to do next.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3 md:gap-4 lg:gap-6">
            {PATHWAY.map((step, i) => (
              <Reveal key={step.step} delay={i * 100}>
                <article className="flex h-full flex-col overflow-hidden rounded-[24px] border border-accent/60 bg-card shadow-card">
                  <img
                    src={PATHWAY_IMAGES[i]?.url}
                    alt={PATHWAY_IMAGES[i]?.alt}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-secondary-foreground/80">
                      Step {step.step}
                    </p>
                    <h3 className="mt-1.5 font-display text-lg font-extrabold leading-snug text-primary">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-[14.5px] font-medium leading-relaxed text-ink-soft">
                      {step.body}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-accent/40 px-6 py-2.5 text-center lg:min-h-[52px]">
            <Repeat className="h-4 w-4 shrink-0 text-primary/70" aria-hidden />
            <span className="text-[15px] font-semibold leading-snug text-primary/90 sm:text-base">
              Same 3-step rhythm, every story.
            </span>
          </div>

        </div>
      </section>

      {/* ── Take a peek inside Story Pros ── */}
      <section id="in-action" className="scroll-mt-20 border-y border-accent/40 bg-card/60">
        <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 sm:py-16 lg:max-w-4xl">
          <h2 className="text-center font-display text-3xl font-extrabold text-primary sm:text-4xl">
            Take a peek inside Story Pros
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-base font-medium text-ink-soft">
            See how one story guides children through listening, vocabulary, understanding, and
            retelling.
          </p>

          <PreviewCarousel />

          <div className="mt-8 text-center">
            <button
              onClick={onDemo}
              className="press-pop inline-flex h-14 items-center justify-center gap-2 rounded-3xl bg-primary px-8 text-base font-extrabold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Try the Free Story
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>


      {/* ── What children practise ── */}
      <section
        id="what-they-learn"
        className="scroll-mt-20 border-t border-accent/40 bg-card/50 px-5 py-12 sm:px-6 sm:py-14"
      >
        <div className="mx-auto w-full max-w-5xl">
          <h2 className="font-display text-[34px] font-extrabold leading-[1.1] text-primary sm:text-[40px] lg:text-[44px]">
            What children practise
          </h2>
          <p className="mt-2 max-w-2xl text-[17px] font-medium leading-snug text-ink-soft sm:text-lg">
            Language skills woven into every story.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {WILL_LEARN.map((item) => {
              const Icon = SKILL_ICONS[item.icon];
              return (
                <article
                  key={item.skill}
                  className="flex items-start gap-3 rounded-2xl border border-accent/40 bg-card p-4"
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/60 text-primary"
                    aria-hidden
                  >
                    {Icon && <Icon className="h-[19px] w-[19px]" />}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[17px] font-bold leading-snug text-primary sm:text-[18px]">
                      {item.skill}
                    </h3>
                    <p className="mt-0.5 text-[15px] font-medium leading-snug text-ink-soft">
                      {item.detail}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Monthly Community Circle ── */}
      <section id="community" className="scroll-mt-20 border-y border-accent/40 bg-accent/15">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-6 px-5 py-12 sm:px-8 sm:py-14 lg:grid lg:grid-cols-2 lg:items-center lg:gap-[56px]">
          {/* Desktop-only image column (left) */}
          <div className="hidden lg:block">
            <img
              src={communityCircleZoomAsset.url}
              alt="Children meeting together on a video call during a Story Pros Community Circle"
              loading="lazy"
              width={1447}
              height={1080}
              className="w-full rounded-[26px] border border-accent/40 object-cover"
            />
          </div>

          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-secondary-foreground/80">
              {COMMUNITY.eyebrow}
            </p>
            <h2 className="mt-2 font-display text-[29px] font-extrabold leading-[1.12] text-primary sm:text-[38px]">
              {COMMUNITY.heading}
            </h2>
            <p className="mt-3 text-[17px] font-semibold text-ink">{COMMUNITY.subheading}</p>
            <p className="mt-3 text-[15.5px] font-medium leading-relaxed text-ink-soft sm:text-base">
              {COMMUNITY.body}
            </p>

            {/* Mobile/tablet image sits between the body copy and the chips */}
            <img
              src={communityCircleZoomAsset.url}
              alt="Children meeting together on a video call during a Story Pros Community Circle"
              loading="lazy"
              width={1447}
              height={1080}
              className="mt-6 w-full rounded-[26px] border border-accent/40 object-cover md:max-h-[360px] lg:hidden"
            />

            <div className="mt-6">

            <ul className="grid gap-2.5 sm:grid-cols-2">
              {COMMUNITY.chips.map((chip) => {
                const Icon = SKILL_ICONS[chip.icon];
                return (
                  <li
                    key={chip.label}
                    className="flex items-center gap-2.5 rounded-2xl border border-accent/50 bg-card px-3.5 py-2.5"
                  >
                    {Icon && <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden />}
                    <span className="text-[14.5px] font-semibold text-ink">{chip.label}</span>
                  </li>
                );
              })}
            </ul>

            <p className="mt-4 text-[13.5px] font-medium leading-relaxed text-ink-soft">
              {COMMUNITY.note}
            </p>

            <a
              href="#membership"
              className="press-pop mt-6 inline-flex h-[52px] items-center justify-center whitespace-nowrap rounded-3xl bg-primary px-8 text-base font-extrabold text-primary-foreground shadow-[0_4px_0_0_var(--primary-deep)] transition-all hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2"
            >
              {COMMUNITY.cta}
            </a>
            </div>
          </div>
        </div>

      </section>


      {/* ── Family dashboard (product proof) ── */}
      <section className="scroll-mt-20 bg-card/40">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-6 sm:py-24">
          <Reveal>
            <div className="grid items-start gap-10 lg:grid-cols-[38fr_62fr] lg:gap-12">
              {/* Dashboard mockup — right on desktop */}
              <div className="order-2 lg:order-2">
                <div className="rounded-[28px] border border-accent/50 bg-accent/25 p-3 sm:p-5">
                  <img
                    src={familyDashboardAsset.url}
                    alt="The Story Pros Family Dashboard on a tablet, showing what a child practised this week, a next step for home, a story just completed, and saved retells"
                    loading="lazy"
                    className="w-full rounded-[18px] drop-shadow-[0_14px_34px_rgba(82,29,153,0.10)]"
                  />
                </div>
              </div>

              {/* Copy column — on mobile its children flow around the image */}
              <div className="contents lg:order-1 lg:block">
                <div className="order-1">
                  <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-secondary-foreground/80">
                    {DASHBOARD.eyebrow}
                  </p>
                  <h2 className="mt-2 font-display text-[29px] font-extrabold leading-[1.12] text-primary sm:text-[38px]">
                    {DASHBOARD.heading}
                  </h2>
                  <p className="mt-3.5 text-[16px] font-medium leading-relaxed text-ink-soft sm:text-[17px]">
                    {DASHBOARD.body}
                  </p>
                </div>

                {/* Two support items */}
                <ul className="order-3 space-y-5 lg:mt-8">
                  {DASHBOARD.points.map((point) => {
                    const Icon = SKILL_ICONS[point.icon];
                    return (
                      <li key={point.title} className="flex items-start gap-3.5">
                        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10">
                          {Icon && <Icon className="h-[18px] w-[18px] text-primary" aria-hidden />}
                        </span>
                        <div className="min-w-0">
                          <p className="font-display text-[16px] font-extrabold text-ink">
                            {point.title}
                          </p>
                          <p className="mt-1 text-[14.5px] font-medium leading-relaxed text-ink-soft">
                            {point.detail}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>

              </div>
            </div>


          </Reveal>
        </div>
      </section>


      {/* ── Who Story Pros is designed for (centered 2x3 grid) ── */}
      <section id="designed-for" className="scroll-mt-20">
        <div className="mx-auto w-full max-w-5xl px-4 py-16 pb-20 sm:px-6 sm:py-20 sm:pb-28">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-extrabold text-primary sm:text-4xl">
                {DESIGNED_FOR_HEADING}
              </h2>
              <p className="mt-3 text-[16px] font-medium leading-relaxed text-ink-soft sm:text-[17px]">
                {DESIGNED_FOR_INTRO}
              </p>
            </div>

            {/* Mobile: light checklist. sm+: card grid. */}
            <ul className="mt-8 overflow-hidden rounded-[20px] border border-accent/50 bg-card sm:mt-10 sm:grid sm:gap-4 sm:overflow-visible sm:rounded-none sm:border-0 sm:bg-transparent sm:grid-cols-2">
              {DESIGNED_FOR.map((item) => {
                const Icon = SKILL_ICONS[item.icon];
                return (
                  <li
                    key={item.text}
                    className="flex h-full items-start gap-3 border-b border-accent/40 px-4 py-3.5 last:border-b-0 sm:gap-3.5 sm:rounded-[20px] sm:border sm:border-accent/50 sm:bg-card sm:px-5 sm:py-4"
                  >
                    <span
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-accent/60 text-primary sm:h-9 sm:w-9 sm:rounded-xl"
                      aria-hidden
                    >
                      {Icon && <Icon className="h-[15px] w-[15px] sm:h-[18px] sm:w-[18px]" />}
                    </span>
                    <span className="text-[15px] font-semibold leading-snug text-ink sm:text-[15.5px]">
                      {item.text}
                    </span>
                  </li>
                );
              })}
            </ul>


            <p className="mx-auto mt-8 max-w-2xl text-center text-[13.5px] font-medium leading-relaxed text-ink-soft/80">
              {DESIGNED_FOR_NOTE}
            </p>
          </Reveal>
        </div>
      </section>


      {/* ── Built with expertise ── */}
      <section className="scroll-mt-20 bg-accent/25">
        <div className="mx-auto w-full max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-secondary-foreground/80">
            BUILT WITH EXPERTISE
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-primary sm:text-4xl">
            {FOUNDERS.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-medium leading-relaxed text-ink-soft">
            {FOUNDERS.body}
          </p>

          <div className="mt-8 grid gap-2.5 sm:mt-10 sm:gap-4 sm:grid-cols-3">
            {FOUNDERS.pillars.map((pillar, i) => {
              const Icon = PILLAR_ICONS[pillar.icon] ?? MessagesSquare;
              return (
                <Reveal key={pillar.title} delay={i * 90}>
                  {/* Mobile: compact icon + text row. sm+: centered card. */}
                  <div className="flex h-full items-start gap-3 rounded-[18px] bg-card/70 px-4 py-3.5 text-left sm:flex-col sm:items-center sm:rounded-[22px] sm:border sm:border-accent/50 sm:bg-card sm:px-5 sm:py-6 sm:text-center sm:shadow-card">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/60 sm:h-11 sm:w-11">
                      <Icon className="h-[18px] w-[18px] text-primary sm:h-5 sm:w-5" strokeWidth={1.75} aria-hidden />
                    </span>
                    <div className="min-w-0 sm:contents">
                      <p className="text-[15px] font-extrabold text-primary sm:mt-4 sm:text-base">
                        {pillar.title}
                      </p>
                      <p className="mt-0.5 text-[13.5px] font-medium leading-relaxed text-ink-soft sm:mt-1.5 sm:text-[14px]">
                        {pillar.detail}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>


          <p className="mx-auto mt-8 max-w-2xl text-[13.5px] font-medium leading-relaxed text-ink-soft/80">
            {FOUNDERS.close}
          </p>
        </div>
      </section>

      {/* ── Membership ── */}
      <section id="membership" className="scroll-mt-20 border-t border-accent/40">
        <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
          <p className="text-center text-xs font-extrabold uppercase tracking-[0.2em] text-secondary-foreground/80">
            Membership
          </p>
          <h2 className="mt-2 text-center font-display text-3xl font-extrabold text-primary sm:text-4xl">
            {PRICING_HEADLINE}
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-center text-base font-medium text-ink-soft">
            {PRICING_SUBHEAD}
          </p>

          <div className="mt-10 flex flex-col items-stretch gap-5 lg:flex-row">
            {/* Free */}
            <Reveal className="flex lg:w-[43%]">
              <div className="flex w-full flex-col rounded-[28px] border border-accent/70 bg-card p-6 shadow-card sm:p-7">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink-soft">
                  {FREE_TIER.note}
                </p>
                <p className="mt-3 font-display text-4xl font-extrabold leading-none text-primary">
                  {FREE_TIER.price}
                </p>
                <p className="mt-1.5 text-sm font-extrabold text-ink">{FREE_TIER.title}</p>
                <p className="mt-3 text-sm font-medium leading-relaxed text-ink-soft">
                  {FREE_TIER.body}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {FREE_TIER.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckMark />
                      <span className="text-[14px] font-bold leading-snug text-ink">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex-1" />
                <button
                  onClick={onDemo}
                  className="press-pop mt-6 inline-flex h-12 w-full items-center justify-center rounded-3xl border-2 border-primary/60 bg-card text-sm font-extrabold text-primary transition-colors hover:bg-primary/5"
                >
                  {FREE_TIER.cta}
                </button>
                <p className="mt-2 text-center text-xs font-bold text-ink-soft">
                  {FREE_TIER.reassurance}
                </p>
              </div>
            </Reveal>

            {/* Membership */}
            <Reveal delay={90} className="flex lg:w-[57%]">
              <div className="flex w-full flex-col rounded-[28px] border-2 border-primary/35 bg-primary/[0.04] p-6 shadow-soft sm:p-7">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary/80">
                  {MEMBERSHIP_TIER.note}
                </p>
                <p className="mt-3 font-display text-[2.75rem] font-extrabold leading-none text-primary">
                  {PRICE}
                  <span className="text-lg font-bold text-ink-soft">{PRICE_PERIOD}</span>
                </p>
                <p className="mt-1.5 text-sm font-extrabold text-ink">{MEMBERSHIP_TIER.title}</p>
                <p className="mt-3 text-sm font-medium leading-relaxed text-ink-soft">
                  {MEMBERSHIP_TIER.body}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {MEMBERSHIP_TIER.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckMark />
                      <span className="text-[14px] font-bold leading-snug text-ink">{f}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3.5 pl-[26px] text-[13px] font-medium leading-relaxed text-ink-soft/80">
                  {MEMBERSHIP_TIER.supporting}
                </p>
                <div className="flex-1" />
                <a
                  href={WAITLIST_URL}
                  target="_blank"
                  rel="noopener"
                  className="press-pop mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-3xl bg-primary text-sm font-extrabold text-primary-foreground shadow-[0_4px_0_0_var(--primary-deep)] transition-all hover:brightness-105"
                >
                  {MEMBERSHIP_TIER.cta}
                  <ChevronRightIcon className="h-4 w-4 text-secondary" />
                </a>
                <p className="mt-2 text-center text-xs font-bold text-ink-soft">
                  {MEMBERSHIP_TIER.reassurance}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>


      {/* ── FAQ ── */}
      <section id="faq" className="scroll-mt-20 border-y border-accent/40 bg-card/50">
        <div className="mx-auto w-full max-w-[820px] px-4 py-14 sm:px-6">
          <h2 className="text-center font-display text-3xl font-extrabold text-primary sm:text-4xl">
            Frequently Asked Questions
          </h2>

          <Reveal>
            <div className="mt-8 overflow-hidden rounded-[20px] border border-accent/50 bg-card">
              {FAQS.map((faq, i) => (
                <FaqItem
                  key={faq.q}
                  question={faq.q}
                  answer={faq.a}
                  isFirst={i === 0}
                  open={openFaq === i}
                  onToggle={() => setOpenFaq((cur) => (cur === i ? null : i))}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </section>


      {/* ── Final CTA: split banner, one product visual ── */}
      <section className="bg-accent/20">
        <div className="mx-auto w-full max-w-[1180px] px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
          <Reveal>
            <div className="overflow-hidden rounded-[32px] border border-accent/60 bg-card">
              <div className="grid lg:grid-cols-[minmax(0,45fr)_minmax(0,55fr)]">
                {/* Visual side */}
                <div className="relative h-[240px] sm:h-[300px] lg:h-auto lg:min-h-[440px]">
                  <img
                    src={familyCtaAsset.url}
                    alt="A mother and her son reading a Story Pros story together on a tablet at home"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-[50%_38%]"
                  />
                </div>


                {/* Copy side */}
                <div className="flex flex-col justify-center px-6 py-10 text-left sm:px-10 sm:py-12 lg:px-14 lg:py-16">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-secondary-foreground/80">
                    Ready to explore?
                  </p>
                  <h2 className="mt-3 max-w-[20ch] font-display text-[28px] font-extrabold leading-[1.12] text-primary sm:text-[34px] lg:text-[38px]">
                    See if Story Pros feels right for your child.
                  </h2>
                  <p className="mt-3.5 max-w-[38ch] text-base font-medium leading-relaxed text-ink">
                    Try one complete story free, or join the waitlist for launch updates.
                  </p>
                  <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                    <button
                      onClick={onDemo}
                      className="press-pop inline-flex h-[54px] items-center justify-center whitespace-nowrap rounded-3xl bg-primary px-7 text-base font-extrabold text-primary-foreground transition-all hover:brightness-105 sm:min-w-[204px]"
                    >
                      Try the Free Story
                    </button>
                    <a
                      href={WAITLIST_URL}
                      target="_blank"
                      rel="noopener"
                      className="press-pop inline-flex h-[54px] items-center justify-center whitespace-nowrap rounded-3xl border-2 border-primary/60 bg-card px-7 text-base font-extrabold text-primary transition-colors hover:bg-primary/5 sm:min-w-[188px]"
                    >
                      Join the Waitlist
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>


      {/* ── Footer ── */}
      <footer className="border-t border-accent/50 bg-accent/40">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <StoryProsLogo layout="row" size="sm" />
            <p className="mt-3 max-w-xs text-sm font-medium leading-relaxed text-ink-soft">
              Story-based language learning for ages 5–12.
            </p>
            <p className="mt-1 text-xs font-semibold text-ink-soft/80">By Empowered DLD</p>
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

function FaqItem({
  question,
  answer,
  isFirst,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  isFirst: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={cn(!isFirst && "border-t border-accent/40")}>
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-accent/10 sm:px-6 sm:py-5"
      >
        <span className="flex-1 text-[15px] font-bold leading-snug text-primary sm:text-base">
          {question}
        </span>
        <ChevronRightIcon
          className={cn(
            "h-5 w-5 shrink-0 text-ink-soft transition-transform duration-200",
            open && "rotate-90",
          )}
        />
      </button>
      {open && (
        <div className="space-y-3 px-5 pb-5 sm:px-6 sm:pb-6">
          {answer
            .split("\n")
            .filter(Boolean)
            .map((line, i) => (
              <p key={i} className="max-w-[68ch] text-sm leading-7 text-ink-soft">
                {line}
              </p>
            ))}
        </div>
      )}
    </div>
  );
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
