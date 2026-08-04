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
} from "lucide-react";

const PILLAR_ICONS: Record<string, typeof MessagesSquare> = {
  MessagesSquare,
  GraduationCap,
  Handshake,
};
import { Reveal } from "./CharacterSection";
import { StoryElementFramework } from "./StoryElementFramework";
import familyDashboardAsset from "@/assets/family-dashboard.png.asset.json";
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
  IN_ACTION,

  PRICING_HEADLINE,
  PRICING_SUBHEAD,
  FREE_TIER,
  MEMBERSHIP_TIER,
  
  FAQS,
} from "@/data/landingContent";

import danDariaReading from "@/assets/dan-daria-reading.webp";
import communityCircleZoomAsset from "@/assets/community-circle-zoom.png.asset.json";
// TODO(art): swap for the new "Daria, chin in hand, looking up" illustration
// when it lands — this is the only import that needs changing.
import storySlide from "@/assets/stories/dan-and-the-paper-cut/slide-01.webp";
import storyVocab from "@/assets/stories/dan-and-the-paper-cut/vocab-bandage.webp";

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
  return (
    <div className="min-h-dvh w-full bg-gradient-to-br from-cream-deep via-cream to-sky/40 text-ink">
      {/* ── Top nav ── */}
      <header className="sticky top-0 z-40 border-b border-accent/40 bg-cream/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-3 sm:gap-4 sm:px-6">
          <StoryProsLogo layout="row" size="sm" className="h-9" />
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
              className="press-pop hidden items-center gap-1.5 rounded-2xl bg-secondary px-4 py-2 text-sm font-extrabold text-secondary-foreground shadow-[0_3px_0_0_var(--secondary-deep)] transition-all hover:brightness-105 sm:inline-flex"
            >
              <PaperPlaneIcon className="h-4 w-4" />
              Try the Free Story
            </button>
            <button
              onClick={onLogin}
              className="press-pop hidden rounded-2xl px-4 py-2 text-sm font-extrabold text-primary transition-colors hover:bg-primary/5 sm:inline-flex"
            >
              Log in
            </button>
            <a
              href={WAITLIST_URL}
              target="_blank"
              rel="noopener"
              className="press-pop rounded-2xl bg-primary px-3 py-2 text-sm font-extrabold text-primary-foreground shadow-card transition-colors hover:bg-primary/95 sm:px-4"
            >
              Join the Waitlist
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero: audience → product → experience → action ── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1240px] items-center gap-7 px-5 pb-8 pt-4 sm:gap-10 sm:px-8 sm:pb-12 sm:pt-9 lg:grid-cols-[minmax(0,46fr)_minmax(0,54fr)] lg:gap-[80px] lg:pb-[80px] lg:pt-[64px]">
          {/* Text first on mobile, matching the requested order */}
          <div className="animate-slide-up text-center lg:text-left">
            <p className="inline-flex max-w-[34ch] items-center justify-center gap-2 rounded-full bg-primary/8 px-3 py-1.5 text-center text-[9px] font-bold uppercase leading-[1.7] tracking-[0.04em] text-primary text-balance sm:max-w-none sm:bg-card sm:px-4 sm:py-2 sm:text-[11px] sm:leading-[1.55] sm:tracking-[0.07em] sm:shadow-card">
              {HERO.eyebrow}
            </p>

            <h1 className="mx-auto mt-2.5 max-w-[17ch] text-balance font-display text-[33px] font-extrabold leading-[1.12] text-primary sm:mt-4 sm:max-w-[560px] sm:text-[44px] sm:leading-[1.06] lg:mx-0 lg:mt-5 lg:max-w-[600px] lg:text-[49px]">
              {HERO.heading}
            </h1>

            <p className="mx-auto mt-2 max-w-[30ch] text-[17.5px] font-semibold leading-[1.4] text-ink sm:mt-3 sm:max-w-[520px] sm:text-[21px] sm:leading-[1.35] lg:mx-0">
              {HERO.subheading}
            </p>

            {/* Stacked so neither label ever wraps onto a second line */}
            <div className="mt-5 flex flex-col items-center gap-2.5 sm:mt-6 sm:gap-3 lg:items-start">

              <button
                onClick={onDemo}
                className="press-pop inline-flex h-[52px] w-full max-w-[264px] items-center justify-center gap-2 whitespace-nowrap rounded-3xl bg-primary px-8 text-base font-extrabold text-primary-foreground shadow-[0_4px_0_0_var(--primary-deep)] transition-all hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 sm:h-[56px] sm:max-w-[300px]"
              >
                Try the Free Story
                <ChevronRightIcon className="h-5 w-5 shrink-0 text-secondary" />
              </button>
              <a
                href={WAITLIST_URL}
                target="_blank"
                rel="noopener"
                className="press-pop inline-flex h-[52px] w-full max-w-[264px] items-center justify-center whitespace-nowrap rounded-3xl border border-primary/35 bg-transparent px-8 text-base font-extrabold text-primary transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 sm:h-[56px] sm:max-w-[300px] sm:border-2 sm:border-primary/70 sm:bg-card"
              >
                Join the Waitlist
              </a>
            </div>
          </div>


          {/* The app preview does the visual talking */}
          <div className="relative mx-auto w-full max-w-[420px] sm:max-w-[560px]">
            <span
              className="pointer-events-none absolute inset-x-10 bottom-2 h-32 rounded-full bg-primary/10 blur-2xl"
              aria-hidden
            />
            <TabletMock className="animate-float" />
          </div>
        </div>
      </section>



      {/* ── Parent problem (two-column editorial) ── */}
      <section className="px-5 py-14 sm:px-6 sm:py-20 lg:py-24">
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
              <StoryElementFramework items={WHY_STORIES.framework} className="mt-8" />
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

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
        <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 sm:py-16">
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
      <section id="designed-for" className="scroll-mt-20 border-y border-accent/40 bg-card/50">
        <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-extrabold text-primary sm:text-4xl">
                {DESIGNED_FOR_HEADING}
              </h2>
              <p className="mt-3 text-[16px] font-medium leading-relaxed text-ink-soft sm:text-[17px]">
                {DESIGNED_FOR_INTRO}
              </p>
            </div>

            <ul className="mt-9 grid gap-3.5 sm:mt-10 sm:grid-cols-2 sm:gap-4">
              {DESIGNED_FOR.map((item) => {
                const Icon = SKILL_ICONS[item.icon];
                return (
                  <li
                    key={item.text}
                    className="flex h-full items-start gap-3.5 rounded-[20px] border border-accent/50 bg-card px-4 py-4 sm:px-5"
                  >
                    <span
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/60 text-primary"
                      aria-hidden
                    >
                      {Icon && <Icon className="h-[18px] w-[18px]" />}
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
      <section className="scroll-mt-20">
        <div className="mx-auto w-full max-w-5xl px-4 py-16 text-center sm:px-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-secondary-foreground/80">
            {FOUNDERS.eyebrow}
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-primary sm:text-4xl">
            {FOUNDERS.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-medium leading-relaxed text-ink-soft">
            {FOUNDERS.body}
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {FOUNDERS.pillars.map((pillar, i) => {
              const Icon = PILLAR_ICONS[pillar.icon] ?? MessagesSquare;
              return (
                <Reveal key={pillar.title} delay={i * 90}>
                  <div className="flex h-full flex-col items-center rounded-[22px] border border-accent/50 bg-card/70 px-5 py-6 text-center">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/60">
                      <Icon className="h-5 w-5 text-primary" strokeWidth={1.75} aria-hidden />
                    </span>
                    <p className="mt-4 text-base font-extrabold text-primary">{pillar.title}</p>
                    <p className="mt-1.5 text-[14px] font-medium leading-relaxed text-ink-soft">
                      {pillar.detail}
                    </p>
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
              <div className="grid lg:grid-cols-[minmax(0,46fr)_minmax(0,54fr)]">
                {/* Visual side */}
                <div className="relative flex items-end justify-center bg-accent/35 px-6 pb-0 pt-10 sm:px-10 sm:pt-12 lg:items-center lg:py-12">
                  <div className="w-full max-w-[360px] translate-y-4 lg:translate-y-0 lg:max-w-[400px]">
                    <TabletMock />
                  </div>
                </div>

                {/* Copy side */}
                <div className="px-6 py-10 text-left sm:px-10 sm:py-12 lg:px-14 lg:py-16">
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



/** A real Story Pros story shown on a tablet, so the product is the visual */
function TabletMock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[520px] rounded-[30px] border-[11px] border-ink/85 bg-cream shadow-[0_28px_60px_-18px_rgba(28,28,21,0.45)]",
        className,
      )}
    >
      <div className="overflow-hidden rounded-[18px] bg-card">
        {/* Story header */}
        <div className="flex items-center justify-between gap-2 bg-primary px-4 py-2.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wide text-primary-foreground">
            {IN_ACTION.storyTitle}
          </span>
          <span className="rounded-full bg-primary-foreground/15 px-2 py-0.5 text-[10px] font-extrabold text-primary-foreground">
            1 of 6
          </span>
        </div>

        {/* Story slide */}
        <img src={storySlide} alt="A page from a Story Pros story" className="w-full" />

        {/* Slide text */}
        <div className="px-4 pb-3 pt-3">
          <p className="text-[15px] font-bold leading-snug text-ink">
            On Friday, Dan and his mom went on a walk.
          </p>

          {/* Vocabulary chip */}
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-accent/60 bg-accent/30 p-2.5">
            <img src={storyVocab} alt="" className="h-10 w-10 rounded-xl object-cover" />
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-wide text-secondary-foreground/80">
                New word
              </p>
              <p className="text-sm font-extrabold text-primary">bandage</p>
            </div>
            <span className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                <path d="M11 5L6 9H3v6h3l5 4V5zm4.5 7a4 4 0 00-2-3.46v6.92A4 4 0 0015.5 12z" />
              </svg>
            </span>
          </div>

          {/* Progress */}
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-accent/70">
            <div className="h-full w-1/6 rounded-full bg-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}

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
