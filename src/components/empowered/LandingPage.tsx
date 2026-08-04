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
} from "lucide-react";
import { CharacterSection, Reveal } from "./CharacterSection";
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
  AGE_RANGE,
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
  DESIGNED_FOR_NOTE,
  FOUNDERS,
  IN_ACTION,
  APP_COMPARISON,
  MEMBERSHIP_FEATURES,
  INCLUDED,
  PRICING_HEADLINE,
  PRICING_SUBHEAD,
  FREE_TIER,
  MEMBERSHIP_TIER,
  FOUNDING_OFFER,
  FAQS,
} from "@/data/landingContent";

import danDariaReading from "@/assets/dan-daria-reading.webp";
import danDariaHighfive from "@/assets/dan-daria-highfive.webp";
import communityCircleZoomAsset from "@/assets/community-circle-zoom.png.asset.json";
import dariaPointing from "@/assets/daria-pointing.webp";
// TODO(art): swap for the new "Daria, chin in hand, looking up" illustration
// when it lands — this is the only import that needs changing.
import dariaLookingUp from "@/assets/daria-solo.png";
import storySlide from "@/assets/stories/dan-and-the-paper-cut/slide-01.webp";
import storyVocab from "@/assets/stories/dan-and-the-paper-cut/vocab-bandage.webp";

interface LandingPageProps {
  onGetStarted: () => void;
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
};


export function LandingPage({ onGetStarted, onLogin, onDemo }: LandingPageProps) {
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
              Try the Demo
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

      {/* ── Hero: one message, one explanation, two actions ── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1240px] items-center gap-7 px-5 pb-8 pt-4 sm:gap-10 sm:px-8 sm:pb-12 sm:pt-9 lg:grid-cols-[minmax(0,46fr)_minmax(0,54fr)] lg:gap-[80px] lg:pb-[88px] lg:pt-[80px]">
          {/* Text first on mobile, matching the requested order */}
          <div className="animate-slide-up text-center lg:text-left">
            <p className="inline-flex max-w-[30ch] items-center justify-center gap-2 rounded-full bg-primary/8 px-3 py-1.5 text-center text-[9px] font-bold uppercase leading-[1.7] tracking-[0.04em] text-primary text-balance sm:max-w-none sm:bg-card sm:px-4 sm:py-2 sm:text-[11px] sm:leading-[1.55] sm:tracking-[0.07em] sm:shadow-card">
              {HERO.eyebrow}
            </p>

            <h1 className="mx-auto mt-3 max-w-[17ch] text-balance font-display text-[33px] font-extrabold leading-[1.12] text-primary sm:mt-6 sm:max-w-[560px] sm:text-[44px] sm:leading-[1.06] lg:mx-0 lg:mt-7 lg:max-w-[600px] lg:text-[49px]">
              {HERO.heading}
            </h1>

            <p className="mx-auto mt-3 max-w-[30ch] text-[17.5px] font-semibold leading-[1.4] text-ink sm:mt-5 sm:max-w-[520px] sm:text-[21px] sm:leading-[1.35] lg:mx-0">
              {HERO.subheading}
            </p>

            <p className="mx-auto mt-2.5 max-w-[34ch] text-[15.5px] font-medium leading-[1.6] text-ink-soft sm:mt-4 sm:max-w-[560px] sm:text-[18px] sm:leading-[1.55] lg:mx-0 lg:max-w-[540px]">
              {HERO.body}
            </p>

            {/* Stacked so neither label ever wraps onto a second line */}
            <div className="mt-7 flex flex-col items-center gap-2.5 sm:mt-7 sm:gap-3 lg:items-start">

              <button
                onClick={onDemo}
                className="press-pop inline-flex h-[52px] w-full max-w-[264px] items-center justify-center gap-2 whitespace-nowrap rounded-3xl bg-primary px-8 text-base font-extrabold text-primary-foreground shadow-[0_4px_0_0_var(--primary-deep)] transition-all hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 sm:h-[56px] sm:max-w-[300px]"
              >
                Try the Demo
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
              Try the Demo
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
            <div className="grid items-start gap-10 lg:grid-cols-[62fr_38fr] lg:gap-12">
              {/* Dashboard mockup */}
              <div className="order-2 lg:order-1">
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
              <div className="contents lg:order-2 lg:block">
                <div className="order-1">
                  <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-secondary-foreground/80">
                    {DASHBOARD.eyebrow}
                  </p>
                  <h2 className="mt-2 font-display text-[26px] font-extrabold leading-tight text-primary sm:text-[32px]">
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


      {/* ── Who Story Pros is designed for (art right) ── */}
      <CharacterSection
        id="designed-for"
        side="right"
        image={danDariaHighfive}
        className="border-y border-accent/40 bg-card/50"
      >
        <h2 className="font-display text-3xl font-extrabold text-primary sm:text-4xl">
          Designed for children who may:
        </h2>
        <ul className="mt-6 space-y-2.5">
          {DESIGNED_FOR.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-[18px] border border-accent/50 bg-card px-4 py-2.5 shadow-card"
            >
              <CheckMark />
              <span className="text-sm font-bold leading-snug text-ink">{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 rounded-[24px] border border-accent/60 bg-card p-5 text-[15px] font-medium leading-relaxed text-ink-soft shadow-card">
          {DESIGNED_FOR_NOTE}
        </p>
      </CharacterSection>

      {/* ── Created by ── */}
      <section className="scroll-mt-20">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 text-center sm:px-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-secondary-foreground/80">
            {FOUNDERS.eyebrow}
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-primary sm:text-4xl">
            {FOUNDERS.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-medium leading-relaxed text-ink-soft">
            {FOUNDERS.body}
          </p>

          <div className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
            {FOUNDERS.people.map((person, i) => (
              <Reveal key={person.name} delay={i * 90}>
                <div className="h-full rounded-[26px] border border-accent/60 bg-card p-6 shadow-card">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent text-2xl">
                    {i === 0 ? "🩺" : "🍎"}
                  </span>
                  <p className="mt-4 text-lg font-extrabold text-primary">{person.name}</p>
                  <p className="mt-1 text-sm font-semibold text-ink-soft">{person.role}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mx-auto mt-8 max-w-2xl rounded-[24px] border border-accent/60 bg-card p-5 text-[15px] font-medium leading-relaxed text-ink-soft shadow-card">
            {FOUNDERS.close}
          </p>
        </div>
      </section>

      {/* ── How Story Pros differs from typical learning apps ── */}
      <section className="border-y border-accent/40 bg-card/50">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="text-center font-display text-3xl font-extrabold text-primary sm:text-4xl">
            What makes Story Pros different from typical learning apps?
          </h2>

          <div className="mt-10 space-y-3">
            <div className="hidden gap-4 px-5 sm:grid sm:grid-cols-2">
              <p className="text-xs font-extrabold uppercase tracking-wide text-ink-soft">
                Typical learning apps
              </p>
              <p className="text-xs font-extrabold uppercase tracking-wide text-primary">
                Story Pros
              </p>
            </div>

            {APP_COMPARISON.map((row, i) => (
              <Reveal key={row.typical} delay={i * 70}>
                <div className="grid gap-3 overflow-hidden rounded-[24px] border border-accent/60 bg-card shadow-card sm:grid-cols-2 sm:gap-0">
                  <p className="flex items-start gap-3 p-5 text-sm font-medium text-ink-soft">
                    <span className="mt-0.5 text-ink-soft/50" aria-hidden>
                      —
                    </span>
                    {row.typical}
                  </p>
                  <p className="flex items-start gap-3 bg-primary/5 p-5 text-sm font-bold text-ink">
                    <CheckMark />
                    {row.storyPros}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── What's included: Daria looks up at everything in the membership ── */}
      <IncludedSection />

      {/* ── Membership ── */}
      <section id="membership" className="scroll-mt-20">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <p className="text-center text-xs font-extrabold uppercase tracking-[0.2em] text-secondary-foreground/80">
            Membership
          </p>
          <h2 className="mt-2 text-center font-display text-3xl font-extrabold text-primary sm:text-4xl">
            {PRICING_HEADLINE}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-base font-medium text-ink-soft">
            {PRICING_SUBHEAD}
          </p>

          {/* Free / membership / founding */}
          <div className="mt-10" />

          <div className="mt-10 grid items-stretch gap-5 lg:grid-cols-3">
            {/* Free */}
            <Reveal className="flex">
              <div className="flex w-full flex-col rounded-[30px] border border-accent/60 bg-card p-7 text-center shadow-card">
                <p className="text-xs font-extrabold uppercase tracking-wide text-ink-soft">
                  {FREE_TIER.note}
                </p>
                <p className="mt-2 font-display text-4xl font-extrabold text-primary">
                  {FREE_TIER.price}
                </p>
                <p className="mt-1 text-sm font-extrabold text-primary">{FREE_TIER.title}</p>
                <p className="mt-3 text-sm font-medium leading-relaxed text-ink-soft">
                  {FREE_TIER.body}
                </p>
                <ul className="mt-4 space-y-2 text-left">
                  {FREE_TIER.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <CheckMark />
                      <span className="text-sm font-bold text-ink">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex-1" />
                <button
                  onClick={onGetStarted}
                  className="press-pop mt-6 inline-flex h-12 w-full items-center justify-center rounded-3xl border-2 border-primary/70 bg-card text-sm font-extrabold text-primary transition-colors hover:bg-primary/5"
                >
                  Create a free account
                </button>
              </div>
            </Reveal>

            {/* Membership */}
            <Reveal delay={90} className="flex">
              <div className="relative flex w-full flex-col overflow-hidden rounded-[30px] border-2 border-primary/30 bg-card p-7 text-center shadow-soft">
                <span
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-secondary/20 blur-2xl"
                  aria-hidden
                />
                <p className="relative text-xs font-extrabold uppercase tracking-wide text-ink-soft">
                  {MEMBERSHIP_TIER.note}
                </p>
                <p className="relative mt-2 font-display text-5xl font-extrabold leading-none text-primary">
                  {PRICE}
                  <span className="text-xl font-bold text-ink-soft">{PRICE_PERIOD}</span>
                </p>
                <p className="relative mt-1 text-sm font-extrabold text-primary">
                  {MEMBERSHIP_TIER.title}
                </p>
                <p className="relative mt-3 text-sm font-medium leading-relaxed text-ink-soft">
                  {MEMBERSHIP_TIER.body}
                </p>
                <div className="flex-1" />
                <button
                  onClick={onGetStarted}
                  className="press-pop relative mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-3xl bg-primary text-sm font-extrabold text-primary-foreground shadow-[0_4px_0_0_var(--primary-deep)] transition-all hover:brightness-105"
                >
                  Sign up
                  <ChevronRightIcon className="h-4 w-4 text-secondary" />
                </button>
                <p className="relative mt-2 text-xs font-bold text-ink-soft">Cancel anytime</p>
              </div>
            </Reveal>

            {/* Founding offer */}
            <Reveal delay={180} className="flex">
              <div className="flex w-full flex-col rounded-[30px] border-2 border-secondary bg-secondary/10 p-7 text-center shadow-card">
                <p className="inline-flex self-center rounded-full bg-secondary px-4 py-1.5 text-xs font-extrabold text-secondary-foreground shadow-[0_3px_0_0_var(--secondary-deep)]">
                  {FOUNDING_OFFER.title}
                </p>
                <p className="mt-4 font-display text-2xl font-extrabold leading-tight text-primary">
                  {FOUNDING_OFFER.heading}
                </p>
                <p className="mt-3 text-sm font-medium leading-relaxed text-ink-soft">
                  {FOUNDING_OFFER.body}
                </p>
                <div className="flex-1" />
                <a
                  href={WAITLIST_URL}
                  target="_blank"
                  rel="noopener"
                  className="press-pop mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-3xl bg-primary text-sm font-extrabold text-primary-foreground shadow-[0_4px_0_0_var(--primary-deep)] transition-all hover:brightness-105"
                >
                  {FOUNDING_OFFER.cta}
                  <ChevronRightIcon className="h-4 w-4 text-secondary" />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="scroll-mt-20 border-y border-accent/40 bg-card/50">
        <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="text-center font-display text-3xl font-extrabold text-primary sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-center text-base font-medium text-ink-soft">
            Everything you need to know
          </p>

          <div className="mt-8 space-y-3">
            {FAQS.map((faq, i) => (
              <Reveal key={faq.q} delay={i * 60}>
                <FaqItem question={faq.q} answer={faq.a} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section>
        <div className="mx-auto w-full max-w-4xl px-4 py-16 text-center sm:px-6">
          <img
            src={dariaPointing}
            alt=""
            loading="lazy"
            className="mx-auto h-28 w-auto animate-bob object-contain"
          />
          <h2 className="mt-4 font-display text-3xl font-extrabold text-primary sm:text-4xl">
            Start Building Language Skills Today
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base font-medium text-ink-soft">
            Join the families getting ready to start Story Pros with their children.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={WAITLIST_URL}
              target="_blank"
              rel="noopener"
              className="press-pop inline-flex h-14 items-center justify-center gap-2 rounded-3xl bg-primary px-8 text-base font-extrabold text-primary-foreground shadow-[0_5px_0_0_var(--primary-deep)] transition-all hover:brightness-105"
            >
              Join the Founding Member Waitlist
              <ChevronRightIcon className="h-5 w-5 text-secondary" />
            </a>
            <button
              onClick={onGetStarted}
              className="press-pop inline-flex h-14 items-center justify-center rounded-3xl border-2 border-primary/70 bg-card px-8 text-base font-extrabold text-primary transition-colors hover:bg-primary/5"
            >
              Start free with one story
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-accent/40">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <StoryProsLogo layout="row" size="sm" />
            <p className="mt-3 max-w-xs text-sm font-medium leading-relaxed text-ink-soft">
              Story Pros helps families and children connect with language through stories and
              trust. Made for {AGE_RANGE}.
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

/**
 * What's Included — Daria sits at the lower left, chin in hand,
 * looking up at the membership items as they float in above her.
 */
function IncludedSection() {
  return (
    <section id="included" className="scroll-mt-20 border-y border-accent/40 bg-card/60">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-center text-xs font-extrabold uppercase tracking-[0.2em] text-secondary-foreground/80">
          {INCLUDED.eyebrow}
        </p>
        <h2 className="mt-2 text-center font-display text-3xl font-extrabold text-primary sm:text-4xl">
          {INCLUDED.heading}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-base font-medium text-ink-soft">
          {INCLUDED.lead}
        </p>

        <div className="mt-12 grid items-end gap-8 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-12">
          {/* Daria, looking up at the list */}
          <div className="relative mx-auto w-full max-w-[300px] lg:mx-0">
            <span
              className="pointer-events-none absolute inset-x-4 bottom-0 h-24 rounded-full bg-primary/10 blur-2xl"
              aria-hidden
            />
            <img
              src={dariaLookingUp}
              alt="Daria looking up at everything included in a Story Pros membership"
              loading="lazy"
              className="relative z-10 mx-auto h-72 w-auto animate-bob object-contain object-bottom drop-shadow-[0_20px_32px_rgba(63,38,140,0.18)] lg:h-[380px]"
            />
          </div>

          {/* The items she's looking up at, drifting in one by one */}
          <ul className="grid gap-3 sm:grid-cols-2">
            {MEMBERSHIP_FEATURES.map((feature, i) => (
              <Reveal key={feature.title} delay={i * 110}>
                <li
                  className={cn(
                    "hover-lift flex h-full gap-3.5 rounded-[24px] border border-accent/60 bg-card p-4 shadow-card transition-all",
                    // gentle staircase so they read as floating above her
                    i % 2 === 0 ? "sm:-translate-y-2" : "sm:translate-y-2",
                  )}
                >
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-accent text-lg"
                    aria-hidden
                  >
                    {feature.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[15px] font-extrabold leading-snug text-primary">
                      {feature.title}
                    </p>
                    <p className="mt-1 text-xs font-medium leading-relaxed text-ink-soft">
                      {feature.benefit}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

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
