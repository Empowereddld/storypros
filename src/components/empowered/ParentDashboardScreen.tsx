/* ─────────────────────────────────────────────
 * Parent Dashboard — Progress Insights
 * Rebuilt from the "Parent Dashboard" mockup: selected
 * child, today's progress, stories-this-week chart,
 * skill summary, recent activity, quick actions.
 * Reuses the progress + scoring services.
 * ───────────────────────────────────────────── */

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  getProgress,
  getCompletedStoryIds,
  getPaperPlanes,
  getCurrentLevel,
} from "@/services/progress";
import { scoreToLabel, labelToDisplayText } from "@/services/scoring";
import { getStory } from "@/services/stories";
import type { SkillDomain } from "@/types/story";
import { useAuth } from "@/contexts/AuthContext";
import { StoryProsLogo } from "./StoryProsBrand";

interface ParentDashboardScreenProps {
  onClose: () => void;
  onNavigate?: (destination: string) => void;
}

const DOMAINS: SkillDomain[] = ["listening", "story_structure", "vocabulary", "grammar"];
const DOMAIN_LABELS: Record<string, string> = {
  listening: "Listening",
  story_structure: "Story Structure",
  vocabulary: "Vocabulary",
  grammar: "Grammar",
};
const LABEL_COLORS: Record<string, string> = {
  strength: "bg-success",
  growing: "bg-primary",
  budding: "bg-secondary",
  needs_support: "bg-coral",
};
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export function ParentDashboardScreen({ onClose, onNavigate }: ParentDashboardScreenProps) {
  const { activeChild } = useAuth();
  const childName = activeChild?.name || "your storyteller";

  const progress = getProgress();
  const completedIds = getCompletedStoryIds();
  const paperPlanes = getPaperPlanes();
  const level = getCurrentLevel();

  const data = useMemo(() => {
    const completions = progress.completions;
    const bestByStory = new Map<string, (typeof completions)[number]>();
    for (const c of completions) {
      const ex = bestByStory.get(c.storyId);
      if (!ex || c.overallScore > ex.overallScore) bestByStory.set(c.storyId, c);
    }
    const best = Array.from(bestByStory.values());
    const avgScore = best.length
      ? Math.round(best.reduce((s, c) => s + c.overallScore, 0) / best.length)
      : 0;

    const avgDomains = {} as Record<SkillDomain, number>;
    for (const d of DOMAINS) {
      avgDomains[d] = best.length
        ? Math.round(best.reduce((s, c) => s + (c.domainScores[d] || 0), 0) / best.length)
        : 0;
    }

    const recent = [...completions]
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .slice(0, 4);

    const now = new Date();
    const week = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - i));
      const key = d.toISOString().slice(0, 10);
      const count = completions.filter((c) => (c.completedAt || "").slice(0, 10) === key).length;
      return { label: DAY_LABELS[d.getDay()], count };
    });
    const weekMax = Math.max(1, ...week.map((w) => w.count));
    const weekTotal = week.reduce((s, w) => s + w.count, 0);

    return { avgScore, avgDomains, recent, week, weekMax, weekTotal };
  }, [progress]);

  return (
    <div className="relative flex h-full flex-col bg-background">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-2 bg-card/95 px-4 py-3 backdrop-blur">
        <button
          onClick={onClose}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-soft transition-colors hover:bg-accent/60 active:scale-95"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <StoryProsLogo layout="row" size="sm" />
        <span className="w-9" />
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-8 pt-2">
        <h1 className="text-2xl font-extrabold text-primary">Parent Dashboard</h1>
        <p className="mt-0.5 text-sm text-ink-soft">Here's how {childName} is doing.</p>

        {/* Selected child */}
        <div className="mt-3 flex items-center justify-between rounded-3xl border border-accent/50 bg-card p-4 shadow-card">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-soft">Selected child</p>
            <p className="text-lg font-extrabold text-primary">{activeChild?.name || "—"}</p>
          </div>
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-primary">Level {level}</span>
        </div>

        {/* Today's progress */}
        <h2 className="mt-5 text-sm font-bold uppercase tracking-wider text-ink-soft/70">Progress at a glance</h2>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <StatTile icon="📖" value={completedIds.length} label="Stories completed" tone="primary" />
          <StatTile icon="🔥" value={progress.streak} label="Day streak" tone="secondary" />
          <StatTile icon="🎯" value={data.avgScore + "%"} label="Average score" tone="primary" />
          <StatTile icon="✈️" value={paperPlanes} label="Paper Planes" tone="secondary" />
        </div>

        {/* Stories this week */}
        <div className="mt-5 rounded-3xl border border-accent/50 bg-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <p className="font-bold text-primary">Stories this week</p>
            <span className="text-xs font-bold text-ink-soft">{data.weekTotal} total</span>
          </div>
          <div className="mt-4 flex h-28 items-end justify-between gap-2">
            {data.week.map((w, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-lg bg-primary/80 transition-all"
                    style={{ height: Math.round((w.count / data.weekMax) * 100) + "%", minHeight: w.count > 0 ? "8px" : "2px" }}
                  />
                </div>
                <span className="text-[10px] font-bold text-ink-soft">{w.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skill summary */}
        <h2 className="mt-5 text-sm font-bold uppercase tracking-wider text-ink-soft/70">Skill progress</h2>
        <div className="mt-2 space-y-3">
          {DOMAINS.map((d) => {
            const score = data.avgDomains[d];
            const label = scoreToLabel(score);
            return (
              <div key={d} className="rounded-2xl border border-accent/50 bg-card p-3.5 shadow-card">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">{DOMAIN_LABELS[d]}</span>
                  <span className="text-xs font-bold text-ink-soft">{labelToDisplayText(label)}</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-accent/60">
                  <div className={cn("h-full rounded-full transition-all", LABEL_COLORS[label])} style={{ width: Math.max(4, score) + "%" }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent activity */}
        {data.recent.length > 0 && (
          <>
            <h2 className="mt-5 text-sm font-bold uppercase tracking-wider text-ink-soft/70">Recent activity</h2>
            <div className="mt-2 space-y-2">
              {data.recent.map((c, i) => {
                const title = getStory(c.storyId)?.title ?? c.storyId;
                return (
                  <div key={i} className="flex items-center justify-between rounded-2xl border border-accent/50 bg-card p-3 shadow-card">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-ink">{title}</p>
                      <p className="text-[11px] text-ink-soft">{new Date(c.completedAt).toLocaleDateString()}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-accent px-2.5 py-1 text-xs font-extrabold text-primary">{Math.round(c.overallScore)}%</span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Quick actions */}
        <h2 className="mt-5 text-sm font-bold uppercase tracking-wider text-ink-soft/70">Quick actions</h2>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <QuickAction icon="📚" label="Browse stories" onClick={() => (onNavigate ? onNavigate("library") : onClose())} />
          <QuickAction icon="🏅" label="View rewards" onClick={() => (onNavigate ? onNavigate("achievements") : onClose())} />
          <QuickAction icon="⚙️" label="Settings" onClick={() => (onNavigate ? onNavigate("settings") : onClose())} />
          <QuickAction icon="🏠" label="Back to app" onClick={onClose} />
        </div>
      </div>
    </div>
  );
}

function StatTile({ icon, value, label, tone }: { icon: string; value: React.ReactNode; label: string; tone: "primary" | "secondary" }) {
  return (
    <div className="flex items-center gap-3 rounded-3xl border border-accent/50 bg-card p-3.5 shadow-card">
      <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl", tone === "primary" ? "bg-accent" : "bg-secondary/25")}>
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xl font-extrabold leading-none text-ink">{value}</p>
        <p className="mt-0.5 text-[11px] font-bold leading-tight text-ink-soft">{label}</p>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 rounded-2xl border border-accent/50 bg-card p-3.5 text-left shadow-card transition-transform active:scale-[0.98]">
      <span className="text-xl">{icon}</span>
      <span className="text-sm font-bold text-primary">{label}</span>
    </button>
  );
}
