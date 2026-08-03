import { useMemo, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { getAllCompletions, getCompletedStoryIds } from "@/services/progress";
import { getAllStories, getStory } from "@/services/stories";
import { resolveStoryImage } from "@/services/storyImages";
import { StoryProsLogo } from "./StoryProsBrand";

interface ParentDashboardScreenProps {
  onClose: () => void;
  onNavigate?: (destination: string) => void;
}

type SupportStatus = "independent" | "used_support" | "keep_practising";

const SUPPORT_LABELS: Record<SupportStatus, string> = {
  independent: "Practised independently",
  used_support: "Used support",
  keep_practising: "Keep practising",
};

interface PractisedSkill {
  name: string;
  detail: string;
  status?: SupportStatus;
}

export function ParentDashboardScreen({ onClose, onNavigate }: ParentDashboardScreenProps) {
  const { activeChild, children } = useAuth();
  const child = activeChild ?? children[0];
  const childFirstName = child?.name?.trim().split(/\s+/)[0] || "your child";
  const completedIds = getCompletedStoryIds();

  const view = useMemo(() => {
    const completions = [...getAllCompletions()].sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    );
    const latest = completions[0];
    const story = latest ? getStory(latest.storyId) : (getAllStories()[0] ?? null);
    const words = (story?.vocabulary_words ?? []).map((w) => w.word).filter(Boolean);
    const firstWord = words[0] ?? "new words";

    const skills: PractisedSkill[] = [
      {
        name: "Storytelling",
        detail: "Put events in order and retold what happened.",
        status: "used_support",
      },
      {
        name: "Vocabulary",
        detail: `Practised the word “${firstWord}” and what it means.`,
        status: "independent",
      },
      {
        name: "Understanding",
        detail: "Answered questions about important story details.",
        status: "keep_practising",
      },
    ];

    return {
      story,
      completedAt: latest?.completedAt ?? null,
      inProgress: !latest,
      skills,
      tip: `Ask ${childFirstName} to tell you something that happened today using first, next, and last.`,
      tipWhy: `It gives ${childFirstName} another chance to practise organizing and sharing an everyday story.`,
    };
  }, [childFirstName]);

  const completedCount = completedIds.length;
  const storyTitle = view.story?.title ?? "Dan and the Paper Cut";
  const cover = view.story
    ? resolveStoryImage(view.story.id, view.story.slides?.[0]?.image ?? undefined)
    : null;
  const completionLabel = view.inProgress
    ? "In progress"
    : formatCompleted(view.completedAt as string);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
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
        <StoryProsLogo layout="row" size="sm" />
        <span className="w-10" />
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="mx-auto w-full max-w-[1060px] px-5 pb-16 pt-8 lg:px-8">
          {/* Page header */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-[32px] font-bold leading-tight text-primary lg:text-[36px]">
                {childFirstName}’s Progress
              </h1>
              <p className="mt-2 max-w-[46ch] text-[16px] leading-relaxed text-ink-soft">
                See what {childFirstName} has been practising and how you can support the next step.
              </p>
            </div>
            {children.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {children.map((item) => (
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
              </div>
            )}
          </div>

          {/* Last story */}
          <Section title="Last story">
            <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm sm:flex">
              <div className="h-40 w-full shrink-0 bg-accent/40 sm:h-auto sm:w-56">
                {cover ? (
                  <img
                    src={cover}
                    alt={storyTitle}
                    className="h-full w-full object-cover object-[50%_28%]"
                  />
                ) : null}
              </div>
              <div className="flex flex-1 flex-col justify-center gap-2 p-6">
                <h3 className="text-[19px] font-bold leading-snug text-ink">{storyTitle}</h3>
                <p className="text-[13px] font-medium text-ink-soft">{completionLabel}</p>
                <p className="text-[15px] leading-relaxed text-ink-soft">
                  {childFirstName} practised story order, vocabulary, and understanding important
                  details.
                </p>
                <button
                  onClick={() => onNavigate?.(view.inProgress ? "library" : "achievements")}
                  className="mt-2 self-start rounded-xl bg-primary px-4 py-2.5 text-[15px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {view.inProgress ? "Continue story" : "View story progress"}
                </button>
              </div>
            </article>
          </Section>

          {/* What child practised */}
          <Section title={`What ${childFirstName} practised`}>
            <div className="grid gap-4 sm:grid-cols-3">
              {view.skills.map((skill) => (
                <div
                  key={skill.name}
                  className="rounded-2xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(16,12,40,0.04)]"
                >
                  <h3 className="text-[18px] font-bold text-ink">{skill.name}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{skill.detail}</p>
                  {skill.status && (
                    <span className="mt-4 inline-block rounded-full bg-muted px-2.5 py-1 text-[12px] font-medium text-ink-soft">
                      {SUPPORT_LABELS[skill.status]}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Section>

          {/* Try this together */}
          <Section title={null}>
            <div className="rounded-2xl border border-accent/70 bg-accent/30 p-6 lg:p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                Based on {childFirstName}’s last story
              </p>
              <h2 className="mt-3 text-[24px] font-bold leading-tight text-primary">
                Try this together
              </h2>
              <p className="mt-3 max-w-[62ch] text-[17px] leading-relaxed text-ink">{view.tip}</p>
              <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-ink-soft">
                <span className="font-semibold text-ink">Why this helps:</span> {view.tipWhy}
              </p>
            </div>
          </Section>

          {/* Recent progress */}
          <Section title="Recent progress">
            <div className="grid gap-4 sm:grid-cols-3">
              <SummaryTile value={String(completedCount)} label="Stories completed" />
              <SummaryTile value={String(view.skills.length + 1)} label="Skills practised" />
              <SummaryTile value="Storytelling" label="Recently practised" small />
            </div>
            <button
              onClick={() => onNavigate?.("achievements")}
              className="mt-5 text-[15px] font-semibold text-primary underline-offset-4 hover:underline"
            >
              View detailed progress →
            </button>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string | null; children: ReactNode }) {
  return (
    <section className="mt-11 lg:mt-14">
      {title && (
        <h2 className="mb-4 text-[22px] font-bold leading-tight text-primary lg:text-[24px]">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

function SummaryTile({
  value,
  label,
  small,
}: {
  value: string;
  label: string;
  small?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p
        className={cn(
          "font-bold leading-none text-ink",
          small ? "text-[19px] leading-snug" : "text-[30px]",
        )}
      >
        {value}
      </p>
      <p className="mt-2 text-[13px] font-medium text-ink-soft">{label}</p>
    </div>
  );
}

function formatCompleted(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  const sameDay = date.toDateString() === today.toDateString();
  if (sameDay) return "Completed today";
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Completed yesterday";
  return `Completed ${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
}
