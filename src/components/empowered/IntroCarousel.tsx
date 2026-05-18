import { useState } from "react";
import { TactileButton } from "./TactileButton";
import dariaAndFriend from "@/assets/daria-and-friend.webp";
import dariaSolo from "@/assets/daria-solo.png";
import { cn } from "@/lib/utils";

interface IntroCarouselProps {
  onComplete: () => void;
}

interface Slide {
  eyebrow?: string;
  title: string;
  body: string;
  illustration: "stories" | "vocab" | "adventure";
  titleColor: "primary" | "secondary";
}

const SLIDES: Slide[] = [
  {
    title: "Stories that grow with your child.",
    body: "Evidence-based reading adventures designed by speech-language pathologists for kids with DLD.",
    illustration: "stories",
    titleColor: "secondary",
  },
  {
    title: "Vocabulary, comprehension, and storytelling — all in one journey.",
    body: "Each story unlocks new words and skills.",
    illustration: "vocab",
    titleColor: "primary",
  },
  {
    title: "Adventure through every story.",
    body: "Earn coins, unlock new chapters, and celebrate every win.",
    illustration: "adventure",
    titleColor: "primary",
  },
];

export function IntroCarousel({ onComplete }: IntroCarouselProps) {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  return (
    <div className="flex h-full flex-col px-6 pb-8 pt-2">
      {/* Skip top-right (visible only mid-flow) */}
      <div className="flex justify-end h-6">
        {!isLast && (
          <button
            onClick={onComplete}
            className="text-sm font-semibold text-ink-soft hover:text-primary"
          >
            Skip
          </button>
        )}
      </div>

      {/* Illustration area */}
      <div key={`art-${index}`} className="flex-1 flex items-center justify-center min-h-0 animate-pop-in">
        <SlideIllustration kind={slide.illustration} />
      </div>

      {/* Text */}
      <div key={`text-${index}`} className="mt-4 space-y-3 animate-slide-up">
        <h2
          className={cn(
            "font-display text-[28px] leading-[1.2] font-extrabold tracking-tight",
            slide.titleColor === "secondary" ? "text-secondary-deep" : "text-ink",
          )}
        >
          {slide.title}
        </h2>
        <p className="text-base text-ink-soft leading-relaxed">{slide.body}</p>
      </div>

      {/* Dots */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {SLIDES.map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-2.5 rounded-full transition-all",
              i === index ? "w-8 bg-secondary-deep" : "w-2.5 bg-sky",
            )}
          />
        ))}
      </div>

      {/* CTA */}
      <div className="mt-5">
        <TactileButton
          onClick={() => (isLast ? onComplete() : setIndex(index + 1))}
        >
          {isLast ? "Get Started" : "Next"}
        </TactileButton>
      </div>
    </div>
  );
}

function SlideIllustration({ kind }: { kind: Slide["illustration"] }) {
  if (kind === "stories") {
    return (
      <div className="relative w-full max-w-[320px] aspect-square">
        <ForestBackdrop />
        <img
          src={dariaAndFriend}
          alt="Daria and her friend reading a glowing book in an enchanted forest"
          className="relative z-10 w-full h-full object-contain"
        />
      </div>
    );
  }
  if (kind === "vocab") {
    return (
      <div className="relative w-full max-w-[320px]">
        <div className="absolute -top-2 right-0 z-0 w-48 h-48 rounded-full bg-sky/70 blur-md" />
        <img
          src={dariaSolo}
          alt="Daria gesturing toward a speech bubble"
          className="relative z-10 mx-auto h-72 object-contain"
        />
        <SpeechBubble className="absolute top-6 right-0 z-20 w-40" words={["stick", "papercut", "airplane"]} />
      </div>
    );
  }
  return <AdventureMapArt />;
}

function ForestBackdrop() {
  return (
    <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-success/20 via-sky/40 to-cream-deep overflow-hidden">
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full opacity-50" aria-hidden>
        <circle cx="40" cy="160" r="22" fill="oklch(0.65 0.13 145)" />
        <circle cx="170" cy="170" r="24" fill="oklch(0.68 0.14 150)" />
        <circle cx="100" cy="180" r="18" fill="oklch(0.7 0.12 145)" />
        <circle cx="20" cy="40" r="10" fill="oklch(0.95 0.04 88 / 0.7)" />
        <circle cx="180" cy="50" r="6" fill="oklch(0.95 0.04 88 / 0.7)" />
      </svg>
    </div>
  );
}

function SpeechBubble({ className, words }: { className?: string; words: string[] }) {
  return (
    <div className={cn("relative", className)}>
      <div className="rounded-2xl border-2 border-secondary-deep/70 bg-white/85 backdrop-blur px-3 py-2 shadow-card">
        <ul className="font-script text-secondary-deep text-xl leading-tight space-y-0.5">
          {words.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      </div>
      <div className="absolute -bottom-2 left-3 h-4 w-4 rotate-45 border-r-2 border-b-2 border-secondary-deep/70 bg-white/85" />
    </div>
  );
}

function AdventureMapArt() {
  return (
    <div className="relative w-full max-w-[320px] aspect-square">
      <div className="absolute inset-0 rounded-[40%_50%_45%_55%] bg-sky/70" />
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full" aria-hidden>
        {/* Islands */}
        <path d="M30 90 Q40 60 70 70 Q90 80 80 110 Q60 120 40 115 Z" fill="oklch(0.78 0.1 130)" />
        <path d="M140 50 Q170 40 180 70 Q175 95 150 90 Q135 80 140 50 Z" fill="oklch(0.78 0.1 130)" />
        <path d="M130 150 Q160 140 175 165 Q170 185 145 180 Q125 170 130 150 Z" fill="oklch(0.78 0.1 130)" />
        {/* Path */}
        <path d="M55 100 C 80 60, 130 80, 150 70 S 170 130, 145 160" stroke="oklch(0.78 0.05 80)" strokeWidth="6" fill="none" strokeDasharray="2 5" strokeLinecap="round" />
        {/* Castle */}
        <g transform="translate(155 35)">
          <rect x="0" y="6" width="20" height="22" fill="oklch(0.85 0.05 30)" />
          <polygon points="0,6 10,-2 20,6" fill="oklch(0.6 0.18 25)" />
          <rect x="6" y="14" width="4" height="8" fill="oklch(0.4 0.06 254)" />
        </g>
        {/* Pins */}
        <Pin cx={92} cy={100} color="secondary" star />
        <Pin cx={118} cy={88} color="primary" />
        <Pin cx={135} cy={108} color="secondary" />
      </svg>
      {/* Boy on glowing pad */}
      <div className="absolute left-[14%] bottom-[14%] flex flex-col items-center">
        <div className="h-8 w-12 rounded-full bg-secondary blur-md absolute -bottom-1" />
        <span className="text-3xl">🧒🏻</span>
        <div className="mt-1 h-2 w-12 rounded-full bg-secondary" />
      </div>
    </div>
  );
}

function Pin({ cx, cy, color, star }: { cx: number; cy: number; color: "primary" | "secondary"; star?: boolean }) {
  const fill = color === "secondary" ? "oklch(0.86 0.16 88)" : "oklch(0.91 0.045 235)";
  const stroke = color === "secondary" ? "oklch(0.72 0.14 80)" : "oklch(0.38 0.09 254)";
  return (
    <g>
      <path
        d={`M ${cx} ${cy - 14} a 9 9 0 1 1 0 18 l -2 5 l -2 -5 a 9 9 0 0 1 4 -18 z`}
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
      />
      {star && (
        <text x={cx} y={cy - 5} textAnchor="middle" fontSize="9" fill={stroke} fontWeight="700">
          ★
        </text>
      )}
    </g>
  );
}
