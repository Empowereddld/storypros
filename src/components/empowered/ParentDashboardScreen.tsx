import { useEffect, useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { getAllCompletions } from "@/services/progress";
import { getAllStories, getStory } from "@/services/stories";
import { resolveStoryImage } from "@/services/storyImages";
import { getRetellRecordings } from "@/services/retell";
import type { SkillDomain } from "@/types/story";

interface ParentDashboardScreenProps {
  onClose: () => void;
  onNavigate?: (destination: string) => void;
}

type Period = "week" | "month" | "all";

const PERIODS: { id: Period; label: string }[] = [
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
  { id: "all", label: "All time" },
];

const DOMAIN_LABELS: Record<SkillDomain, string> = {
  listening: "Understanding story events",
  story_structure: "Putting the story in order",
  vocabulary: "Using new words",
  grammar: "Building full sentences",
  retell: "Retelling the story",
  phonological: "Playing with sounds",
};

const DOMAIN_FOCUS: Record<SkillDomain, string> = {
  listening: "Understanding Story Events",
  story_structure: "Story Order",
  vocabulary: "Vocabulary in Context",
  grammar: "Sentence Building",
  retell: "Retelling",
  phonological: "Sound Awareness",
};

function observationFor(domain: SkillDomain, name: string): string {
  switch (domain) {
    case "vocabulary":
      return `${name} used new story words while answering questions about the story.`;
    case "listening":
      return `${name} answered questions about important story details.`;
    case "story_structure":
      return `${name} identified what happened first, next, and last.`;
    case "grammar":
      return `${name} put words together to build full sentences.`;
    case "phonological":
      return `${name} listened for sounds and rhymes inside words.`;
    case "retell":
      return `${name} retold parts of the story in their own words.`;
  }
}

const TIPS = [
  {
    tag: "Bedtime idea",
    ask: "“What was your favourite part and why?”",
    note: "Keep it short and fun.",
  },
  {
    tag: "Car ride idea",
    ask: "“What happened first today, and then what?”",
    note: "Two steps is plenty.",
  },
  {
    tag: "Dinner idea",
    ask: "“Tell me one thing that surprised you today.”",
    note: "Give them time to think.",
  },
];

export function ParentDashboardScreen({ onClose, onNavigate }: ParentDashboardScreenProps) {
  const { activeChild, children } = useAuth();
  const child = activeChild ?? children[0];
  const childFirstName = child?.name?.trim().split(/\s+/)[0] || "your child";
  const [period, setPeriod] = useState<Period>("week");
  const [retellCount, setRetellCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    if (!child?.id) {
      setRetellCount(0);
      return;
    }
    getRetellRecordings(child.id)
      .then((rows) => {
        if (!cancelled) setRetellCount(rows.length);
      })
      .catch(() => {
        if (!cancelled) setRetellCount(0);
      });
    return () => {
      cancelled = true;
    };
  }, [child?.id]);

  const view = useMemo(() => {
    const cutoff =
      period === "all" ? 0 : Date.now() - (period === "week" ? 7 : 30) * 24 * 60 * 60 * 1000;
    const all = [...getAllCompletions()].sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    );
    const inPeriod = all.filter((c) => new Date(c.completedAt).getTime() >= cutoff);
    const scoped = inPeriod.length > 0 ? inPeriod : all.slice(0, 1);
    const latest = scoped[0];
    const story = latest ? getStory(latest.storyId) : (getAllStories()[0] ?? null);

    // Practised domains: any domain with recorded activity in the scoped completions.
    const totals = new Map<SkillDomain, { sum: number; count: number }>();
    for (const c of scoped) {
      for (const [key, value] of Object.entries(c.domainScores ?? {})) {
        const domain = key as SkillDomain;
        if (domain === "retell") continue;
        if (typeof value !== "number" || value <= 0) continue;
        const entry = totals.get(domain) ?? { sum: 0, count: 0 };
        entry.sum += value;
        entry.count += 1;
        totals.set(domain, entry);
      }
    }
    const ranked = [...totals.entries()]
      .map(([domain, { sum, count }]) => ({ domain, avg: sum / count }))
      .sort((a, b) => b.avg - a.avg);

    const fallback: SkillDomain[] = ["vocabulary", "listening", "story_structure"];
    const observationDomains = (
      ranked.length > 0 ? ranked.map((r) => r.domain) : fallback
    ).slice(0, 3);

    // Current focus = the practised area where the most support was used.
    const focusDomain = ranked.length > 0 ? ranked[ranked.length - 1].domain : "vocabulary";

    return {
      story,
      completedAt: latest?.completedAt ?? null,
      storiesCompleted: inPeriod.length,
      skillAreas: totals.size > 0 ? totals.size : fallback.length,
      focusDomain,
      observationDomains,
    };
  }, [period]);

  const storyTitle = view.story?.title ?? "Dan and the Paper Cut";
  const cover = view.story
    ? resolveStoryImage(view.story.id, view.story.slides?.[0]?.image ?? undefined)
    : null;
  const completionLabel = view.completedAt
    ? formatCompleted(view.completedAt)
    : "Not completed yet";
  const tip = TIPS[new Date().getDay() % TIPS.length];

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[oklch(0.99_0.005_300)]">
      <header className="flex items-center justify-between gap-3 border-b border-border/70 bg-card px-5 py-3">
        <button
          onClick={onClose}
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-accent/50"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            aria-hidden
          >
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="w-10" />
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="mx-auto w-full max-w-[1100px] px-6 pb-20 pt-8 lg:px-10">
          {/* Page header */}
          <div className="flex flex-wrap items-end justify-between gap-5 border-b border-border/60 pb-6">
            <div>
              <h1 className="font-display text-[30px] font-bold leading-tight text-primary lg:text-[34px]">
                Family Dashboard
              </h1>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
                Support today. Stronger tomorrow.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {children.length > 1 &&
                children.map((item) => (
                  <span
                    key={item.id}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-[13px] font-semibold",
                      item.id === child?.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-ink-soft",
                    )}
                  >
                    {item.name?.trim().split(/\s+/)[0] ?? "Child"}
                  </span>
                ))}
              <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1">
                {PERIODS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPeriod(p.id)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors",
                      period === p.id
                        ? "bg-primary text-primary-foreground"
                        : "text-ink-soft hover:bg-accent/40",
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 1 — Weekly snapshot */}
          <Zone className="mt-8">
            <SectionLabel>Weekly snapshot</SectionLabel>
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
              <StatCard label="Stories completed" value={String(view.storiesCompleted)} />
              <StatCard label="Skill areas practised" value={String(view.skillAreas)} />
              <StatCard label="Current focus" value={DOMAIN_FOCUS[view.focusDomain]} small />
              <StatCard label="Saved retells" value={String(retellCount)} />
            </div>
          </Zone>

          {/* Section 2 — Support this week */}
          <Zone className="mt-10">
            <SectionLabel>Support this week</SectionLabel>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)]">
              {/* What we noticed */}
              <Card>
                <h3 className="text-[19px] font-bold leading-snug text-ink">
                  What we noticed this week
                </h3>
                <ul className="mt-5 space-y-5">
                  {view.observationDomains.map((domain) => (
                    <li key={domain} className="flex gap-3">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary/70" />
                      <div>
                        <p className="text-[15px] font-semibold text-ink">
                          {DOMAIN_LABELS[domain]}
                        </p>
                        <p className="mt-1 text-[14.5px] leading-relaxed text-ink-soft">
                          {observationFor(domain, childFirstName)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => onNavigate?.("achievements")}
                  className="mt-6 text-[14.5px] font-semibold text-primary underline-offset-4 hover:underline"
                >
                  View all insights →
                </button>
              </Card>

              {/* Next step for home — hero */}
              <Card className="border-primary/25 bg-accent/25 shadow-[0_10px_30px_-22px_oklch(0.35_0.12_300)]">
                <h3 className="text-[21px] font-bold leading-snug text-primary">
                  Next step for home
                </h3>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-soft">
                  A simple idea based on what your child practised.
                </p>

                <div className="mt-5 rounded-2xl border border-border/70 bg-card p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                    Recommended activity
                  </p>
                  <h4 className="mt-2 text-[18px] font-bold text-ink">Talk About the Why</h4>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                    After the story, ask:
                  </p>
                  <p className="mt-1 text-[16px] font-semibold leading-relaxed text-ink">
                    “Why do you think…?”
                  </p>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                    Encourage {childFirstName} to give a reason for what a character did.
                  </p>
                </div>

                <div className="mt-4 rounded-xl bg-muted/70 p-4">
                  <p className="text-[13px] font-semibold text-ink">Why this helps</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">
                    Explaining reasons supports children in connecting ideas and expressing their
                    thinking.
                  </p>
                </div>
              </Card>
            </div>

            {/* Try this week + encouragement */}
            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)]">
              <SmallCard>
                <h3 className="text-[16px] font-bold text-ink">Try this week</h3>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                  {tip.tag}
                </p>
                <p className="mt-1.5 text-[15px] font-semibold leading-relaxed text-ink">
                  {tip.ask}
                </p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">{tip.note}</p>
                <button
                  onClick={() => onNavigate?.("achievements")}
                  className="mt-4 text-[14px] font-semibold text-primary underline-offset-4 hover:underline"
                >
                  See tip →
                </button>
              </SmallCard>

              <SmallCard className="bg-accent/20">
                <h3 className="text-[16px] font-bold text-primary">You’re doing great!</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">
                  Small moments add up. Your support helps {childFirstName} grow every day.
                </p>
              </SmallCard>
            </div>
          </Zone>

          {/* Section 3 — Recent activity */}
          <Zone className="mt-10">
            <SectionLabel>Recent activity</SectionLabel>
            <div className="grid gap-6 lg:grid-cols-2">
              <SmallCard className="overflow-hidden p-0">
                <div className="sm:flex">
                  <div className="h-36 w-full shrink-0 bg-accent/40 sm:h-auto sm:w-44">
                    {cover ? (
                      <img
                        src={cover}
                        alt={storyTitle}
                        loading="lazy"
                        className="h-full w-full object-cover object-[50%_28%]"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5 p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                      Recent story
                    </p>
                    <h3 className="text-[17px] font-bold leading-snug text-ink">{storyTitle}</h3>
                    <p className="text-[13px] font-medium text-ink-soft">{completionLabel}</p>
                    <p className="text-[14px] leading-relaxed text-ink-soft">
                      Practised new words, story order, and story details.
                    </p>
                    <button
                      onClick={() => onNavigate?.("library")}
                      className="mt-2 self-start rounded-xl bg-primary px-4 py-2 text-[14px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      View story
                    </button>
                  </div>
                </div>
              </SmallCard>

              <SmallCard>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                  Saved retells
                </p>
                <h3 className="mt-2 text-[17px] font-bold text-ink">
                  {retellCount} {retellCount === 1 ? "retell" : "retells"} saved
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
                  Listen to your child’s saved story retells.
                </p>
                <button
                  onClick={() => onNavigate?.("retell-library")}
                  className="mt-4 self-start rounded-xl border border-primary/40 bg-card px-4 py-2 text-[14px] font-semibold text-primary transition-colors hover:bg-accent/40"
                >
                  Listen
                </button>
              </SmallCard>
            </div>
          </Zone>
        </div>
      </div>
    </div>
  );
}

function Zone({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <section className={cn("rounded-3xl bg-muted/40 p-6 lg:p-7", className)}>{children}</section>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-5 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
      {children}
    </h2>
  );
}

function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(16,12,40,0.04)] lg:p-7",
        className,
      )}
    >
      {children}
    </div>
  );
}

function SmallCard({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(16,12,40,0.04)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function StatCard({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-soft">{label}</p>
      <p
        className={cn(
          "mt-2 font-bold leading-none text-ink",
          small ? "text-[16px] leading-snug" : "text-[26px]",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function formatCompleted(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return "Completed today";
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Completed yesterday";
  return `Completed ${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
}
