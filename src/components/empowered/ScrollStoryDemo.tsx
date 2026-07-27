/* ─────────────────────────────────────────────
 * ScrollStoryDemo
 * A scroll-driven walkthrough of one real Story Pros
 * story. The tablet stays pinned while the steps scroll
 * past; whichever step is in view drives what the tablet
 * shows, so visitors watch the experience unfold.
 *
 * Every frame uses real content from
 * content/story-01-dan-and-the-paper-cut.json.
 * ───────────────────────────────────────────── */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { IN_ACTION } from "@/data/landingContent";
import slide01 from "@/assets/stories/dan-and-the-paper-cut/slide-01.webp";
import slide03 from "@/assets/stories/dan-and-the-paper-cut/slide-03.webp";
import slide05 from "@/assets/stories/dan-and-the-paper-cut/slide-05.webp";
import vocabBandage from "@/assets/stories/dan-and-the-paper-cut/vocab-bandage.webp";

interface DemoStep {
  label: string;
  body: string;
  frame: ReactNode;
}

/* ───────── the six frames ───────── */

function FrameRead() {
  return (
    <div>
      <img src={slide01} alt="" className="w-full" />
      <div className="p-4">
        <p className="text-[15px] font-bold leading-snug text-ink">
          On Friday, Dan and his mom went on a walk.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-extrabold text-primary-foreground">
            <SpeakerIcon />
            Listen again
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-accent px-4 py-2 text-xs font-extrabold text-primary">
            Look again
          </span>
        </div>
      </div>
    </div>
  );
}

function FrameVocab() {
  return (
    <div className="p-4">
      <p className="text-[11px] font-extrabold uppercase tracking-wide text-secondary-foreground/80">
        New word
      </p>
      <div className="mt-2 flex items-center gap-3">
        <img src={vocabBandage} alt="" className="h-16 w-16 rounded-2xl object-cover" />
        <div>
          <p className="font-display text-2xl font-extrabold text-primary">bandage</p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-[10px] font-extrabold text-primary">
            <SpeakerIcon />
            Hear it
          </span>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        {[
          ["What group?", "It belongs to the first aid item group."],
          ["What do you do with it?", "You put it on a cut to keep it clean."],
          ["Where do you find it?", "In a first aid kit at home or school."],
        ].map(([q, a]) => (
          <div key={q} className="rounded-2xl border border-accent/60 bg-accent/20 p-2.5">
            <p className="text-[10px] font-extrabold uppercase tracking-wide text-primary">{q}</p>
            <p className="mt-0.5 text-xs font-semibold leading-snug text-ink">{a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FrameQuestion() {
  return (
    <div className="p-4">
      <div className="flex items-start gap-2.5 rounded-2xl bg-sky/60 p-3">
        <SpeakerBadge />
        <p className="pt-1 text-[15px] font-extrabold leading-snug text-primary">
          Who is in the story?
        </p>
      </div>
      <div className="mt-3 space-y-2">
        {[
          { label: "Dan", correct: true },
          { label: "A robot", correct: false },
          { label: "A cat", correct: false },
        ].map((option) => (
          <div
            key={option.label}
            className={cn(
              "flex items-center gap-3 rounded-2xl border-2 p-3",
              option.correct ? "border-success bg-success/10" : "border-accent/60 bg-card",
            )}
          >
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold",
                option.correct ? "bg-success text-success-foreground" : "bg-accent text-primary",
              )}
            >
              {option.correct ? "✓" : ""}
            </span>
            <span className="text-sm font-bold text-ink">{option.label}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 rounded-2xl bg-accent/30 p-2.5 text-xs font-semibold text-ink-soft">
        Brain check: did you answer the WHO question with a PERSON?
      </p>
    </div>
  );
}

function FrameSequence() {
  const parts = [
    { img: slide01, text: "They went on a walk." },
    { img: slide03, text: "Dan got a papercut." },
    { img: slide05, text: "He asked for a bandage." },
  ];
  return (
    <div className="p-4">
      <p className="text-[15px] font-extrabold text-primary">Put the story in order</p>
      <div className="mt-3 space-y-2">
        {parts.map((part, i) => (
          <div
            key={part.text}
            className="flex items-center gap-3 rounded-2xl border-2 border-accent/60 bg-card p-2"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-primary-foreground">
              {i + 1}
            </span>
            <img src={part.img} alt="" className="h-11 w-16 rounded-lg object-cover" />
            <span className="text-xs font-bold leading-snug text-ink">{part.text}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-2xl bg-secondary/20 p-2.5">
        <MicIcon />
        <p className="text-xs font-bold text-ink">Now tell the story in your own words</p>
      </div>
    </div>
  );
}

function FrameConnect() {
  return (
    <div className="p-4">
      <div className="flex items-start gap-2.5 rounded-2xl bg-sky/60 p-3">
        <SpeakerBadge />
        <p className="pt-1 text-[14px] font-extrabold leading-snug text-primary">
          Has something ever hurt you, like a cut or a bump? Who helped you feel better?
        </p>
      </div>
      <div className="mt-3 rounded-2xl border-2 border-dashed border-accent bg-accent/15 p-4 text-center">
        <MicIcon className="mx-auto h-8 w-8 text-primary" />
        <p className="mt-2 text-xs font-bold text-ink-soft">Tap to tell your story</p>
      </div>
      <div className="mt-3 space-y-1.5">
        <p className="text-[10px] font-extrabold uppercase tracking-wide text-ink-soft">
          Sentence starters
        </p>
        {["One time I…", "I felt… so…", "Then ___ helped me by…"].map((s) => (
          <p key={s} className="rounded-xl bg-card px-3 py-1.5 text-xs font-semibold text-primary">
            {s}
          </p>
        ))}
      </div>
    </div>
  );
}

function FrameDashboard() {
  const skills = [
    { label: "Listening", value: 88 },
    { label: "Story structure", value: 83 },
    { label: "Vocabulary", value: 90 },
    { label: "Grammar", value: 76 },
  ];
  return (
    <div className="p-4">
      <p className="text-[11px] font-extrabold uppercase tracking-wide text-secondary-foreground/80">
        Family dashboard
      </p>
      <p className="mt-1 font-display text-lg font-extrabold text-primary">
        What Ava practised today
      </p>
      <div className="mt-3 space-y-2.5">
        {skills.map((skill) => (
          <div key={skill.label}>
            <div className="flex items-center justify-between text-[11px] font-extrabold">
              <span className="text-ink">{skill.label}</span>
              <span className="text-primary">{skill.value}%</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-accent/70">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${skill.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-2xl border border-accent/60 bg-accent/20 p-3">
        <p className="text-[10px] font-extrabold uppercase tracking-wide text-primary">
          Try at home
        </p>
        <p className="mt-1 text-xs font-semibold leading-snug text-ink">
          Ask Ava to tell you what happened first, next, and last in her day.
        </p>
      </div>
    </div>
  );
}

const STEPS: DemoStep[] = [
  {
    label: "Read & Listen",
    body: "The child reads or listens to the story, one clear page at a time, with narration they can replay.",
    frame: <FrameRead />,
  },
  {
    label: "Learn the words",
    body: "Important vocabulary is introduced in context and explored from several angles, not just defined.",
    frame: <FrameVocab />,
  },
  {
    label: "Understand",
    body: "Supported comprehension questions come with a brain check that teaches children to check their own thinking.",
    frame: <FrameQuestion />,
  },
  {
    label: "Sequence & retell",
    body: "Visuals help children organize what happened, then retell the story in their own words.",
    frame: <FrameSequence />,
  },
  {
    label: "Connect to real life",
    body: "The story links to the child's own experience, with sentence starters when they need a way in.",
    frame: <FrameConnect />,
  },
  {
    label: "You see what grew",
    body: "The family dashboard shows what your child practised, plus one simple thing to try together at home.",
    frame: <FrameDashboard />,
  },
];

export function ScrollStoryDemo() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const nodes = stepRefs.current.filter(Boolean) as HTMLDivElement[];
    if (nodes.length === 0 || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the middle of the viewport
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const index = nodes.indexOf(visible[0].target as HTMLDivElement);
          if (index >= 0) setActive(index);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.5, 1] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,460px)_1fr] lg:gap-14">
      {/* Pinned tablet */}
      <div className="lg:sticky lg:top-24 lg:h-fit">
        <div className="relative mx-auto w-full max-w-[420px]">
          <span
            className="pointer-events-none absolute inset-x-8 bottom-1 h-24 rounded-full bg-primary/10 blur-2xl"
            aria-hidden
          />
          <div className="relative rounded-[30px] border-[11px] border-ink/85 bg-cream shadow-[0_28px_60px_-18px_rgba(28,28,21,0.45)]">
            <div className="overflow-hidden rounded-[19px] bg-card">
              {/* Story header */}
              <div className="flex items-center justify-between gap-2 bg-primary px-4 py-2.5">
                <span className="truncate text-[11px] font-extrabold uppercase tracking-wide text-primary-foreground">
                  {IN_ACTION.storyTitle}
                </span>
                <span className="shrink-0 rounded-full bg-primary-foreground/15 px-2 py-0.5 text-[10px] font-extrabold text-primary-foreground">
                  Step {active + 1} of {STEPS.length}
                </span>
              </div>

              {/* Frame, cross-faded */}
              <div className="relative min-h-[330px]">
                {STEPS.map((step, i) => (
                  <div
                    key={step.label}
                    aria-hidden={i !== active}
                    className={cn(
                      "transition-all duration-500",
                      i === active
                        ? "relative opacity-100"
                        : "pointer-events-none absolute inset-0 translate-y-2 opacity-0",
                    )}
                  >
                    {step.frame}
                  </div>
                ))}
              </div>

              {/* Progress */}
              <div className="px-4 pb-3">
                <div className="h-2 w-full overflow-hidden rounded-full bg-accent/70">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${((active + 1) / STEPS.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Steps that drive it */}
      <ol className="space-y-6 lg:space-y-24 lg:py-16">
        {STEPS.map((step, i) => (
          <li key={step.label}>
            <div
              ref={(node) => {
                stepRefs.current[i] = node;
              }}
              className={cn(
                "rounded-[26px] border p-5 transition-all duration-500",
                i === active
                  ? "border-primary/40 bg-card shadow-soft"
                  : "border-accent/50 bg-card/60 shadow-card lg:opacity-55",
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold transition-colors",
                    i === active ? "bg-primary text-primary-foreground" : "bg-accent text-primary",
                  )}
                >
                  {i + 1}
                </span>
                <h3 className="text-lg font-extrabold text-primary">{step.label}</h3>
              </div>
              <p className="mt-2 text-[15px] font-medium leading-relaxed text-ink-soft">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ───────── tiny icons ───────── */

function SpeakerIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M11 5L6 9H3v6h3l5 4V5zm4.5 7a4 4 0 00-2-3.46v6.92A4 4 0 0015.5 12z" />
    </svg>
  );
}

function SpeakerBadge() {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
      <SpeakerIcon className="h-4 w-4" />
    </span>
  );
}

function MicIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 14a3 3 0 003-3V6a3 3 0 10-6 0v5a3 3 0 003 3z" />
      <path d="M18 11a6 6 0 01-12 0H4a8 8 0 007 7.93V22h2v-3.07A8 8 0 0020 11h-2z" />
    </svg>
  );
}
