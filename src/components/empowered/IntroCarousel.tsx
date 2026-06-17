/* ─────────────────────────────────────────────
 * Intro / Onboarding Carousel
 * Rebuilt from the selected onboarding mockups:
 *   1. Learn Through Stories  (what you'll practice)
 *   2. Earn Stars & Rewards   (motivation)
 *   3. Read, Watch & Listen   (how stories work)
 *   4. Meet Dan & Daria       (the characters)
 * ───────────────────────────────────────────── */

import { useState, type ReactNode } from "react";
import { TactileButton } from "./TactileButton";
import { cn } from "@/lib/utils";
import dariaAndFriend from "@/assets/daria-and-friend.webp";
import dariaSolo from "@/assets/daria-solo.png";
import childAvatar from "@/assets/child-avatar.png";
import { AuthBackdrop, StoryProsLogo, Star } from "./StoryProsBrand";

interface IntroCarouselProps {
  onComplete: () => void;
}

const SLIDE_COUNT = 4;

export function IntroCarousel({ onComplete }: IntroCarouselProps) {
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDE_COUNT - 1;

  return (
    <div className="relative flex h-full flex-col bg-cream">
      <AuthBackdrop />

      <div className="relative z-10 flex h-full flex-col px-6 pb-7 pt-5">
        {/* Top bar: logo + skip */}
        <div className="flex items-center justify-between">
          <StoryProsLogo layout="row" size="sm" />
          {!isLast && (
            <button
              onClick={onComplete}
              className="rounded-full border border-accent bg-card px-3.5 py-1.5 text-sm font-bold text-ink-soft hover:text-primary transition-colors"
            >
              Skip
            </button>
          )}
        </div>

        {/* Slide content */}
        <div key={index} className="flex flex-1 flex-col animate-slide-up">
          {index === 0 && <SlideLearn />}
          {index === 1 && <SlideRewards />}
          {index === 2 && <SlideModes />}
          {index === 3 && <SlideMeet />}
        </div>

        {/* Dots */}
        <div className="mt-4 flex items-center justify-center gap-2">
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

        <TactileButton
          className="mt-4"
          onClick={() => (isLast ? onComplete() : setIndex(index + 1))}
        >
          {isLast ? "Get Started" : "Next"}
        </TactileButton>
      </div>
    </div>
  );
}

/* ───────── Slide 1: Learn Through Stories ───────── */

function SlideLearn() {
  return (
    <div className="flex flex-1 flex-col justify-center">
      <h2 className="text-center font-display text-3xl font-extrabold leading-tight text-primary">
        Learn Through Stories
      </h2>
      <p className="mx-auto mt-1.5 max-w-[18rem] text-center text-sm font-medium text-ink-soft">
        Every adventure helps you practice language, thinking, and confidence.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <FeatureTile tone="primary" icon={<HeadphonesIcon />} title="Watch & Listen" subtitle="Stories come to life" />
        <FeatureTile tone="secondary" icon={<QuestionIcon />} title="Answer Questions" subtitle="Think, choose, learn" />
        <FeatureTile tone="primary" icon={<HeartIcon />} title="Check In on Feelings" subtitle="Notice and build empathy" />
        <FeatureTile tone="secondary" icon={<RetellIcon />} title="Retell the Story" subtitle="Make it yours" />
      </div>
    </div>
  );
}

/* ───────── Slide 2: Earn Stars & Rewards ───────── */

function SlideRewards() {
  return (
    <div className="flex flex-1 flex-col justify-center">
      <h2 className="text-center font-display text-3xl font-extrabold leading-tight text-primary">
        Earn Stars <span className="text-secondary">&amp; Rewards</span>
      </h2>
      <p className="mx-auto mt-1.5 max-w-[18rem] text-center text-sm font-medium text-ink-soft">
        Complete stories and challenges to unlock fun rewards.
      </p>

      <img src={dariaAndFriend} alt="" className="mx-auto mt-3 h-28 w-auto object-contain" />

      <div className="mt-3 rounded-3xl border border-accent/60 bg-card p-4 shadow-card">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 font-bold text-primary">
            <Star className="h-5 w-5 text-secondary" /> Stars
          </span>
          <span className="text-xl font-extrabold text-ink">1,250</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm font-bold">
          <span className="flex items-center gap-1.5 text-coral">🔥 7-day streak</span>
          <span className="text-primary">75%</span>
        </div>
        <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-accent/60">
          <div className="h-full w-[75%] rounded-full bg-success" />
        </div>
        <div className="mt-3 flex justify-center gap-2 text-xs font-bold text-ink-soft">
          <Pill>🏅 Badges</Pill>
          <Pill>⭐ Stickers</Pill>
          <Pill>✈️ Planes</Pill>
        </div>
      </div>
    </div>
  );
}

/* ───────── Slide 3: Read, Watch & Listen ───────── */

function SlideModes() {
  return (
    <div className="flex flex-1 flex-col justify-center">
      <img src={dariaAndFriend} alt="" className="mx-auto h-36 w-auto object-contain" />
      <h2 className="mt-3 text-center font-display text-3xl font-extrabold leading-tight text-primary">
        Read, Watch, <span className="text-secondary">&amp; Listen</span>
      </h2>
      <p className="mx-auto mt-1.5 max-w-[18rem] text-center text-sm font-medium text-ink-soft">
        Enjoy story adventures with voice, visuals, and guided learning.
      </p>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <ModeTile tone="primary" icon={<BookIcon />} label="Read Along" />
        <ModeTile tone="secondary" icon={<HeadphonesIcon />} label="Listen" />
        <ModeTile tone="primary" icon={<PlayIcon />} label="Watch" />
      </div>
    </div>
  );
}

/* ───────── Slide 4: Meet Dan & Daria ───────── */

function SlideMeet() {
  return (
    <div className="flex flex-1 flex-col justify-center">
      <h2 className="text-center font-display text-3xl font-extrabold leading-tight">
        <span className="text-ink">Meet </span>
        <span className="text-primary">Dan</span>
        <span className="text-ink"> &amp; </span>
        <span className="text-secondary">Daria</span>
      </h2>
      <p className="mx-auto mt-1.5 max-w-[18rem] text-center text-sm font-medium text-ink-soft">
        Two story friends who help kids explore, express, and grow.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <CharacterCard name="Dan" tone="primary" img={childAvatar} />
        <CharacterCard name="Daria" tone="secondary" img={dariaSolo} />
      </div>
    </div>
  );
}

/* ───────── Pieces ───────── */

function FeatureTile({ tone, icon, title, subtitle }: { tone: "primary" | "secondary"; icon: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="rounded-2xl border border-accent/60 bg-card p-3.5 shadow-card">
      <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", tone === "primary" ? "bg-accent text-primary" : "bg-secondary/25 text-secondary-foreground")}>
        {icon}
      </span>
      <p className="mt-2 text-sm font-extrabold leading-tight text-ink">{title}</p>
      <p className="text-[11px] leading-snug text-ink-soft">{subtitle}</p>
    </div>
  );
}

function ModeTile({ tone, icon, label }: { tone: "primary" | "secondary"; icon: ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-accent/60 bg-card p-3 shadow-card">
      <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", tone === "primary" ? "bg-accent text-primary" : "bg-secondary/25 text-secondary-foreground")}>
        {icon}
      </span>
      <span className="text-xs font-bold text-primary">{label}</span>
    </div>
  );
}

function CharacterCard({ name, tone, img }: { name: string; tone: "primary" | "secondary"; img: string }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-accent/60 bg-card shadow-card">
      <div className="flex h-40 items-end justify-center bg-gradient-to-b from-accent/30 to-accent/60">
        <img src={img} alt={name} className="h-36 w-auto object-contain object-bottom" />
      </div>
      <div className="flex items-center justify-between px-4 py-2.5">
        <span className="font-extrabold text-primary">{name}</span>
        <span className={cn("flex h-7 w-7 items-center justify-center rounded-full text-white", tone === "primary" ? "bg-primary" : "bg-secondary")}>
          <Star className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return <span className="rounded-full bg-accent/50 px-2.5 py-1">{children}</span>;
}

/* ───────── Icons ───────── */

function HeadphonesIcon() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M4 13a8 8 0 0116 0" strokeLinecap="round" /><rect x="3" y="13" width="4" height="7" rx="2" /><rect x="17" y="13" width="4" height="7" rx="2" /></svg>;
}
function QuestionIcon() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="12" cy="12" r="9" /><path d="M9.2 9.5a2.8 2.8 0 015.4 1c0 1.8-2.6 2.2-2.6 4M12 17.2h.01" strokeLinecap="round" /></svg>;
}
function HeartIcon() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden><path d="M12 21s-7-4.5-9.5-9C1 8.5 2.5 5 6 5c2 0 3 1.2 6 4 3-2.8 4-4 6-4 3.5 0 5 3.5 3.5 7-2.5 4.5-9.5 9-9.5 9z" /></svg>;
}
function RetellIcon() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M4 5h16v11H7l-3 3V5z" strokeLinejoin="round" /><path d="M8 9h8M8 12h5" strokeLinecap="round" /></svg>;
}
function BookIcon() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M4 5h7v15H6a2 2 0 01-2-2V5zM20 5h-7v15h5a2 2 0 002-2V5z" strokeLinejoin="round" /></svg>;
}
function PlayIcon() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden><path d="M8 5l12 7-12 7z" /></svg>;
}
