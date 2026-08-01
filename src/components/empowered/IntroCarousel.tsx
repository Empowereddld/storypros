/* ─────────────────────────────────────────────
 * Intro / Onboarding Carousel
 *   1. Learn Through Stories
 *   2. Earn Coins & Rewards
 *   3. Meet Dan & Daria
 * ───────────────────────────────────────────── */


import { useEffect, useRef, useState, type ReactNode } from "react";
import { TactileButton } from "./TactileButton";
import { cn } from "@/lib/utils";
import danDariaCelebrate from "@/assets/dan-daria-celebrate.webp";
import danDariaReading from "@/assets/dan-daria-reading.webp";
import dariaSolo from "@/assets/daria-solo.png";
import childAvatar from "@/assets/child-avatar.png";
import { AuthBackdrop, StoryProsLogo } from "./StoryProsBrand";
import { CoinIcon } from "./StoryProsUi";

interface IntroCarouselProps {
  onComplete: () => void;
}

const SLIDE_COUNT = 3;

export function IntroCarousel({ onComplete }: IntroCarouselProps) {
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDE_COUNT - 1;
  const touchStartX = useRef<number | null>(null);

  const go = (next: number) => setIndex(Math.min(SLIDE_COUNT - 1, Math.max(0, next)));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index]);

  return (
    <div
      className="relative flex h-full flex-col"
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchStartX.current;
        const end = e.changedTouches[0]?.clientX;
        if (start == null || end == null) return;
        const dx = end - start;
        if (Math.abs(dx) > 48) go(dx < 0 ? index + 1 : index - 1);
        touchStartX.current = null;
      }}
    >
      <AuthBackdrop />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[620px] flex-col px-5 pb-6 pt-4 sm:px-8">
        {/* Header: logo + skip (Skip hidden on last slide, space preserved) */}
        <div className="flex min-h-[44px] items-center justify-between">
          <StoryProsLogo layout="row" size="sm" className="min-h-[44px] py-1" />
          <button
            onClick={onComplete}
            aria-label="Skip introduction and go to profile setup"
            className={cn(
              "flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-accent bg-card px-4 text-sm font-bold text-ink-soft transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              isLast && "invisible",
            )}
            tabIndex={isLast ? -1 : 0}
            aria-hidden={isLast}
          >
            Skip
          </button>
        </div>

        {/* Slide content */}
        <div
          key={index}
          className={cn(
            "motion-safe:animate-slide-up flex flex-1 flex-col overflow-y-auto pb-5",
            index === 0 ? "justify-start pt-10 sm:pt-12" : "justify-center",
          )}
        >
          {index === 0 && <SlidePurpose />}
          {index === 1 && <SlideRewards />}
          {index === 2 && <SlideMeet />}
        </div>

        {/* Progress dots */}
        <div
          className="flex items-center justify-center gap-2"
          role="group"
          aria-label={`Step ${index + 1} of ${SLIDE_COUNT}`}
        >
          {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-2.5 rounded-full transition-all",
                i === index ? "w-7 bg-primary" : "w-2.5 bg-accent",
              )}
            />
          ))}
        </div>

        <div className="mt-5 flex justify-center">
          <TactileButton
            className="w-full sm:max-w-[560px]"
            aria-label={isLast ? "Get started with profile setup" : "Next screen"}
            onClick={() => (isLast ? onComplete() : go(index + 1))}
          >
            {isLast ? "Get Started" : "Next"}
          </TactileButton>
        </div>
      </div>
    </div>
  );
}

/* ───────── Shared header pieces ───────── */

function Heading({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-center font-display text-[28px] font-extrabold leading-tight text-primary sm:text-[34px]">
      {children}
    </h2>
  );
}

function Support({ children }: { children: ReactNode }) {
  return (
    <p className="mx-auto mt-[11px] max-w-[500px] text-center text-base font-medium leading-snug text-ink-soft sm:text-[17px]">
      {children}
    </p>
  );
}

/* ───────── Slide 1: Learn Through Stories ───────── */

function SlidePurpose() {
  return (
    <div className="flex flex-col items-center">
      <img
        src={danDariaReading}
        alt=""
        aria-hidden
        className="w-[130px] object-contain sm:w-[150px]"
      />
      <div className="mt-5 sm:mt-6">
        <Heading>Learn Through Stories</Heading>
        <Support>
          Understand what happened, retell it in your own words, and connect it to your life.
        </Support>
      </div>

      <CardRow>
        <IconCard icon={<LightbulbIcon />} label="Understand the Story" />
        <IconCard icon={<SpeechIcon />} label="Retell in Your Words" />
        <IconCard icon={<PersonHeartIcon />} label="Connect to Your Life" />
      </CardRow>
    </div>
  );
}

/* ───────── Slide 3: Earn Coins & Rewards ───────── */

function SlideRewards() {
  return (
    <div>
      <Heading>Earn Coins &amp; Rewards</Heading>
      <Support>Complete stories, collect coins, and unlock rewards.</Support>

      <img
        src={danDariaCelebrate}
        alt=""
        aria-hidden
        className="mx-auto mt-5 h-[110px] w-auto object-contain"
      />

      <div className="mt-5 rounded-3xl border border-accent/60 bg-card p-5 shadow-card">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 font-bold text-primary">
            <CoinIcon className="h-5 w-5 text-secondary" /> Coins
          </span>
          <span className="text-xl font-extrabold text-ink">120</span>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm font-bold">
          <span className="text-ink">Next reward</span>
          <span className="text-primary">75%</span>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-accent">
          <div className="h-full w-[75%] rounded-full bg-success" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs font-bold text-ink-soft">
          <Pill>Badges</Pill>
          <Pill>Wallpapers</Pill>
          <Pill>Planes</Pill>
        </div>
      </div>
    </div>
  );
}

/* ───────── Slide 4: Meet Dan & Daria ───────── */

function SlideMeet() {
  return (
    <div>
      <Heading>Meet Dan &amp; Daria</Heading>
      <Support>Two story friends who help you learn, express yourself, and grow.</Support>

      <div className="mt-7 grid grid-cols-2 gap-4">
        <CharacterCard name="Dan" img={childAvatar} />
        <CharacterCard name="Daria" img={dariaSolo} />
      </div>
    </div>
  );
}

/* ───────── Pieces ───────── */

function CardRow({ children }: { children: ReactNode }) {
  return (
    <div className="mt-[30px] flex flex-col gap-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:min-h-[170px]">
      {children}
    </div>
  );
}

function IconCard({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex h-[72px] items-center gap-3 rounded-2xl border border-accent/60 bg-card p-3 shadow-card sm:h-auto sm:min-h-[170px] sm:flex-col sm:justify-center sm:gap-4 sm:p-6">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
        {icon}
      </span>
      <p className="text-[15px] font-semibold leading-tight text-ink sm:text-center sm:text-[16px]">
        {label}
      </p>
    </div>
  );
}

function CharacterCard({ name, img }: { name: string; img: string }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-accent/60 bg-card shadow-card">
      <div className="flex h-44 items-end justify-center bg-gradient-to-b from-accent/30 to-accent/60">
        <img
          src={img}
          alt={`${name}, a Story Pros character`}
          className="h-40 w-auto object-contain object-bottom"
        />
      </div>
      <div className="px-5 py-3.5">
        <span className="font-extrabold text-primary">{name}</span>
      </div>
    </div>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-accent/50 px-2.5 py-1.5 text-center">{children}</span>
  );
}

/* ───────── Icons ───────── */

function LightbulbIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M9 18h6" strokeLinecap="round" />
      <path d="M10 21h4" strokeLinecap="round" />
      <path
        d="M12 3a6 6 0 00-6 6c0 2.22 1.21 4.16 3 5.2V17h6v-2.8c1.79-1.04 3-2.98 3-5.2a6 6 0 00-6-6z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PersonHeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M4 20c0-3 2.5-5 5-5s5 2 5 5" strokeLinecap="round" />
      <path d="M17 20s-3.5-2.5-4.5-4.5c-.5-1 .2-2.2 1.3-2.2.7 0 1.2.4 1.4 1 .2-.6.7-1 1.4-1 1.1 0 1.8 1.2 1.3 2.2C17.5 17.5 17 20 17 20z" />
    </svg>
  );
}

function HeadphonesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M4 13a8 8 0 0116 0" strokeLinecap="round" />
      <rect x="3" y="13" width="4" height="7" rx="2" />
      <rect x="17" y="13" width="4" height="7" rx="2" />
    </svg>
  );
}
function QuestionIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M9.2 9.5a2.8 2.8 0 015.4 1c0 1.8-2.6 2.2-2.6 4M12 17.2h.01" strokeLinecap="round" />
    </svg>
  );
}
function SpeechIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M4 5h16v11H7l-3 3V5z" strokeLinejoin="round" />
      <path d="M8 9h8M8 12h5" strokeLinecap="round" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
      <path d="M12 21s-7-4.5-9.5-9C1 8.5 2.5 5 6 5c2 0 3 1.2 6 4 3-2.8 4-4 6-4 3.5 0 5 3.5 3.5 7-2.5 4.5-9.5 9-9.5 9z" />
    </svg>
  );
}
function BookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M4 5h7v15H6a2 2 0 01-2-2V5zM20 5h-7v15h5a2 2 0 002-2V5z" strokeLinejoin="round" />
    </svg>
  );
}
function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
      <path d="M8 5l12 7-12 7z" />
    </svg>
  );
}
