/* ─────────────────────────────────────────────
 * Landing Page — the public front door
 *
 * Full-bleed, responsive marketing page shown at "/"
 * for signed-out visitors. Unlike the app shell, this
 * page uses the whole viewport like a website: stacked
 * on phones, two-column hero and card grids on
 * tablets/laptops.
 * ───────────────────────────────────────────── */

import { StoryProsLogo, Star, MiniPlane } from "./StoryProsBrand";
import { PaperPlaneIcon, ChevronRightIcon } from "./StoryProsUi";
import { FEATURES } from "@/config/features";
import danDariaAirplane from "@/assets/dan-daria-airplane.webp";
import danDariaReading from "@/assets/dan-daria-reading.webp";
import danDariaHighfive from "@/assets/dan-daria-highfive.webp";
import dariaPointing from "@/assets/daria-pointing.webp";

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  /** One click, straight into the live demo */
  onDemo: () => void;
}

const SKILLS = [
  { icon: "👂", label: "Understand stories" },
  { icon: "🗣️", label: "Retell in their own words" },
  { icon: "🔢", label: "Put events in order" },
  { icon: "💬", label: "Grow vocabulary" },
  { icon: "💜", label: "Connect stories to their lives" },
];

const STEPS = [
  {
    title: "Pick a story",
    body: "Dan and Daria go on everyday adventures your child recognizes: school, friends, the beach, the carnival.",
    image: danDariaReading,
  },
  {
    title: "Play through it",
    body: "Every story becomes a guided journey: listening, questions, word games, sentence building, and retelling, with a friendly voice reading everything aloud.",
    image: danDariaAirplane,
  },
  {
    title: "Watch skills grow",
    body: "Children earn Paper Planes and badges. You see progress across five language skills, story by story.",
    image: danDariaHighfive,
  },
];

export function LandingPage({ onGetStarted, onLogin, onDemo }: LandingPageProps) {
  return (
    <div className="min-h-dvh w-full bg-gradient-to-br from-cream-deep via-cream to-sky/40 text-ink">
      {/* ── Top nav ── */}
      <header className="sticky top-0 z-40 border-b border-accent/40 bg-cream/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <StoryProsLogo layout="row" size="sm" />
          <nav className="hidden items-center gap-6 text-sm font-bold text-ink-soft md:flex">
            <a href="#how-it-works" className="transition-colors hover:text-primary">
              How it works
            </a>
            <a href="#families" className="transition-colors hover:text-primary">
              For families
            </a>
            {FEATURES.slp && (
              <a href="#clinicians" className="transition-colors hover:text-primary">
                For SLPs
              </a>
            )}
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
              className="press-pop rounded-2xl px-4 py-2 text-sm font-extrabold text-primary transition-colors hover:bg-primary/5"
            >
              Log in
            </button>
            <button
              onClick={onGetStarted}
              className="press-pop rounded-2xl bg-primary px-4 py-2 text-sm font-extrabold text-primary-foreground shadow-card transition-colors hover:bg-primary/95"
            >
              Get started
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <Star className="absolute left-[6%] top-16 h-5 w-5 text-secondary animate-sparkle" />
        <Star className="absolute right-[10%] top-28 h-4 w-4 text-primary/30 animate-sparkle" />
        <MiniPlane className="absolute right-[18%] top-14 hidden h-10 w-10 rotate-[16deg] text-secondary animate-float lg:block" />

        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-2 lg:gap-6 lg:pb-24 lg:pt-20">
          <div className="text-center lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide text-primary shadow-card">
              <PaperPlaneIcon className="h-4 w-4" />
              By Empowered DLD
            </p>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] text-primary sm:text-5xl lg:text-[56px]">
              Story time that builds language skills
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg font-medium leading-relaxed text-ink-soft lg:mx-0">
              The Story Pros App helps children understand stories, retell them in their own words,
              put events in order, grow their vocabulary, and connect stories to their own lives.
            </p>
            <p className="mx-auto mt-3 max-w-xl text-sm font-semibold text-ink-soft/80 lg:mx-0">
              Designed for children ages 4 to 10 with DLD, ADHD, autism, dyslexia, late talkers, and
              every child who benefits from a stronger foundation in language.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <button
                onClick={onGetStarted}
                className="press-pop inline-flex h-14 w-full items-center justify-center gap-2 rounded-3xl bg-primary px-8 text-lg font-extrabold text-primary-foreground shadow-card transition-colors hover:bg-primary/95 sm:w-auto"
              >
                Start free
                <ChevronRightIcon className="h-5 w-5" />
              </button>
              <button
                onClick={onDemo}
                className="press-pop inline-flex h-14 w-full items-center justify-center gap-2 rounded-3xl border-2 border-primary/70 bg-card px-8 text-lg font-extrabold text-primary transition-colors hover:bg-primary/5 sm:w-auto"
              >
                Try a demo
              </button>
            </div>
            <p className="mt-4 text-sm font-semibold text-ink-soft">
              The first story is free. No credit card needed.
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
              className="relative z-10 mx-auto w-full max-w-[420px] object-contain drop-shadow-[0_24px_40px_rgba(63,38,140,0.18)] lg:max-w-[520px]"
            />
          </div>
        </div>
      </section>

      {/* ── Credibility band ── */}
      <section className="border-y border-accent/40 bg-card/70">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 text-center sm:px-6">
          <p className="mx-auto max-w-3xl text-base font-semibold leading-relaxed text-ink">
            Built in collaboration with speech-language pathologists and educators, Story Pros uses
            evidence-based strategies to give every child the language skills and confidence they
            need to express themselves.
          </p>
          <p className="mt-3 text-sm font-bold text-primary">
            Camesha Russell, educator · Jinean Cheng, speech-language pathologist
          </p>
        </div>
      </section>

      {/* ── Five skills ── */}
      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-center font-display text-3xl font-extrabold text-primary">
          Five skills, one adventure at a time
        </h2>
        <div className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-3">
          {SKILLS.map((skill) => (
            <span
              key={skill.label}
              className="inline-flex items-center gap-2 rounded-full border border-accent/60 bg-card px-5 py-2.5 text-sm font-extrabold text-ink shadow-card"
            >
              <span aria-hidden>{skill.icon}</span>
              {skill.label}
            </span>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="bg-card/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center font-display text-3xl font-extrabold text-primary">
            How it works
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <div
                key={step.title}
                className="hover-lift rounded-[28px] border border-accent/60 bg-card p-6 text-center shadow-card transition-all"
              >
                <img src={step.image} alt="" className="mx-auto h-32 w-auto object-contain" />
                <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.18em] text-secondary-foreground/70">
                  Step {index + 1}
                </p>
                <h3 className="mt-1 text-xl font-extrabold text-primary">{step.title}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-ink-soft">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── For families (+ SLPs when enabled) ── */}
      <section
        className={
          FEATURES.slp
            ? "mx-auto grid w-full max-w-6xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-2"
            : "mx-auto grid w-full max-w-6xl gap-6 px-4 py-16 sm:px-6"
        }
      >
        <div
          id="families"
          className="rounded-[28px] border border-accent/60 bg-card p-8 shadow-card"
        >
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-display text-2xl font-extrabold text-primary">For families</h3>
            {!FEATURES.slp && (
              <img src={dariaPointing} alt="" className="h-16 w-auto object-contain" />
            )}
          </div>
          <ul className="mt-4 space-y-3 text-[15px] font-medium leading-relaxed text-ink-soft">
            <li>
              A clear dashboard shows how your child is growing across listening, story structure,
              vocabulary, grammar, and sounds.
            </li>
            <li>
              Every instruction is read aloud, so children who struggle with reading are never
              stuck.
            </li>
            <li>
              Progress saves automatically. Close the tab mid-story and pick up right where you left
              off.
            </li>
            <li>Works right in the browser on laptops and tablets. Nothing to install.</li>
          </ul>
        </div>
        {FEATURES.slp && (
          <div
            id="clinicians"
            className="rounded-[28px] border border-accent/60 bg-card p-8 shadow-card"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-2xl font-extrabold text-primary">
                For SLPs and teachers
              </h3>
              <img src={dariaPointing} alt="" className="h-16 w-auto object-contain" />
            </div>
            <ul className="mt-4 space-y-3 text-[15px] font-medium leading-relaxed text-ink-soft">
              <li>
                A caseload dashboard with real progress data for every child a family shares with
                you.
              </li>
              <li>
                Families stay in control: children join your caseload only through a
                parent-generated invite code.
              </li>
              <li>Assign stories, track completion, and keep session notes in one place.</li>
            </ul>
          </div>
        )}
      </section>

      {/* ── Pricing ── */}
      <section className="bg-card/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center sm:px-6">
          <h2 className="font-display text-3xl font-extrabold text-primary">
            Start free. Grow when you're ready.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base font-medium text-ink-soft">
            The first story is free for every family. Premium unlocks the full story library and
            detailed skill tracking for $9.99 a month per child.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={onGetStarted}
              className="press-pop inline-flex h-14 items-center justify-center gap-2 rounded-3xl bg-primary px-8 text-lg font-extrabold text-primary-foreground shadow-card transition-colors hover:bg-primary/95"
            >
              Create your free account
            </button>
            <button
              onClick={onDemo}
              className="press-pop inline-flex h-14 items-center justify-center rounded-3xl border-2 border-primary/70 bg-card px-8 text-lg font-extrabold text-primary transition-colors hover:bg-primary/5"
            >
              Explore the demo first
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-accent/40">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-4 py-8 text-center sm:px-6 md:flex-row md:justify-between md:text-left">
          <StoryProsLogo layout="row" size="sm" className="opacity-90" />
          <p className="text-xs font-semibold text-ink-soft">
            © {new Date().getFullYear()} Empowered DLD · Made with care for children finding their
            voice
          </p>
        </div>
      </footer>
    </div>
  );
}
