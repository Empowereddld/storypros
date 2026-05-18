/* ─────────────────────────────────────────────
 * Parent Dashboard — Progress Insights
 * Shows per-story scores, skill breakdowns,
 * and progress trends for the active child.
 * ───────────────────────────────────────────── */

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  getProgress,
  getCompletedStoryIds,
  getStoryCompletions,
  getPaperPlanes,
  getCurrentLevel,
} from "@/services/progress";
import {
  scoreToLabel,
  labelToDisplayText,
} from "@/services/scoring";
import { getStory, getAllStories } from "@/services/stories";
import type { SkillDomain } from "@/types/story";
import { useAuth } from "@/contexts/AuthContext";

// ── Domain display config ──

const DOMAIN_META: Record<
  string,
  { label: string; icon: string; description: string }
> = {
  listening: {
    label: "Listening",
    icon: "👂",
    description: "Understanding the story and answering questions",
  },
  story_structure: {
    label: "Story Structure",
    icon: "📖",
    description: "Putting events in the right order",
  },
  vocabulary: {
    label: "Vocabulary",
    icon: "🔤",
    description: "Learning new words and their features",
  },
  grammar: {
    label: "Grammar",
    icon: "✏️",
    description: "Building sentences with connecting words",
  },
  phonological: {
    label: "Sounds",
    icon: "🔊",
    description: "Rhyming and identifying beginning sounds",
  },
  retell: {
    label: "Retell",
    icon: "🗣️",
    description: "Telling the story back in their own words",
  },
};

const LABEL_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  strength: { bg: "bg-success/15", text: "text-success", border: "border-success/30" },
  growing: { bg: "bg-sky", text: "text-primary", border: "border-primary/30" },
  budding: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-300" },
  needs_support: { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/30" },
};

type Tab = "overview" | "stories" | "skills";

interface ParentDashboardScreenProps {
  onClose: () => void;
}

export function ParentDashboardScreen({ onClose }: ParentDashboardScreenProps) {
  const [tab, setTab] = useState<Tab>("overview");
  const { activeChild } = useAuth();
  const childName = activeChild?.name || "Your child";

  const progress = getProgress();
  const completedIds = getCompletedStoryIds();
  const paperPlanes = getPaperPlanes();
  const level = getCurrentLevel();

  // ── Derived stats ──

  const stats = useMemo(() => {
    const completions = progress.completions;
    if (completions.length === 0) {
      return {
        storiesCompleted: 0,
        avgScore: 0,
        bestScore: 0,
        totalAttempts: progress.attempts.length,
        streak: progress.streak,
        avgDomains: {} as Record<SkillDomain, number>,
        recentCompletions: [] as typeof completions,
      };
    }

    // Use the best completion per story for averages
    const bestByStory = new Map<string, (typeof completions)[0]>();
    for (const c of completions) {
      const existing = bestByStory.get(c.storyId);
      if (!existing || c.overallScore > existing.overallScore) {
        bestByStory.set(c.storyId, c);
      }
    }
    const bestCompletions = Array.from(bestByStory.values());

    const avgScore =
      bestCompletions.reduce((s, c) => s + c.overallScore, 0) /
      bestCompletions.length;
    const bestScore = Math.max(...bestCompletions.map((c) => c.overallScore));

    // Average domain scores across best completions
    const domains: SkillDomain[] = [
      "listening",
      "story_structure",
      "vocabulary",
      "grammar",
      "phonological",
    ];
    const avgDomains = {} as Record<SkillDomain, number>;
    for (const d of domains) {
      avgDomains[d] =
        bestCompletions.reduce((s, c) => s + (c.domainScores[d] || 0), 0) /
        bestCompletions.length;
    }

    // Sort completions by date (most recent first)
    const recentCompletions = [...completions].sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    );

    return {
      storiesCompleted: bestByStory.size,
      avgScore,
      bestScore,
      totalAttempts: progress.attempts.length,
      streak: progress.streak,
      avgDomains,
      recentCompletions,
    };
  }, [progress]);

  // ── Progress trend data (score per completion in chronological order) ──

  const trendData = useMemo(() => {
    const sorted = [...progress.completions].sort(
      (a, b) =>
        new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime(),
    );
    return sorted.map((c, i) => ({
      index: i + 1,
      score: Math.round(c.overallScore),
      storyId: c.storyId,
      date: new Date(c.completedAt).toLocaleDateString(),
    }));
  }, [progress]);

  const hasData = stats.storiesCompleted > 0;

  return (
    <div className="flex h-full flex-col bg-cream">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-card active:scale-95 transition-transform"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 text-ink"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M15 19l-7-7 7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="font-display text-xl font-extrabold text-primary">
          {childName}'s Progress
        </h1>
        <div className="w-10" /> {/* spacer */}
      </div>

      {/* Level + Stats bar */}
      <div className="mx-5 mt-2 flex items-center gap-3">
        <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
          Level {level}
        </span>
        <span className="rounded-full bg-sky px-3 py-1 text-xs font-bold text-primary">
          ✈️ {paperPlanes} Paper Planes
        </span>
        {stats.streak > 0 && (
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-600">
            🔥 {stats.streak} streak
          </span>
        )}
      </div>

      {/* Tab bar */}
      <div className="mx-5 mt-4 flex gap-2">
        {(
          [
            ["overview", "Overview"],
            ["stories", "Stories"],
            ["skills", "Skills"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "flex-1 rounded-2xl py-2.5 text-sm font-bold transition-all",
              tab === key
                ? "bg-primary text-primary-foreground shadow-card"
                : "bg-card text-ink-soft",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 mt-4 pb-8">
        {!hasData ? (
          <EmptyState childName={childName} />
        ) : tab === "overview" ? (
          <OverviewTab stats={stats} trendData={trendData} />
        ) : tab === "stories" ? (
          <StoriesTab completions={stats.recentCompletions} />
        ) : (
          <SkillsTab avgDomains={stats.avgDomains} storiesCompleted={stats.storiesCompleted} />
        )}
      </div>
    </div>
  );
}

// ── Empty state ──

function EmptyState({ childName }: { childName: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-6xl mb-4">📊</span>
      <h2 className="font-display text-xl font-extrabold text-primary mb-2">
        No stories completed yet
      </h2>
      <p className="text-sm text-ink-soft max-w-[260px]">
        Once {childName} finishes a story, you'll see their scores, skill
        breakdowns, and progress trends here.
      </p>
    </div>
  );
}

// ── Overview Tab ──

function OverviewTab({
  stats,
  trendData,
}: {
  stats: {
    storiesCompleted: number;
    avgScore: number;
    bestScore: number;
    streak: number;
    avgDomains: Record<string, number>;
  };
  trendData: { index: number; score: number; storyId: string; date: string }[];
}) {
  return (
    <div className="space-y-4 animate-slide-up">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon="📚"
          label="Stories Done"
          value={`${stats.storiesCompleted}/${getAllStories().length}`}
        />
        <StatCard
          icon="🎯"
          label="Avg Score"
          value={`${Math.round(stats.avgScore)}%`}
          color={stats.avgScore >= 85 ? "green" : stats.avgScore >= 65 ? "blue" : "amber"}
        />
        <StatCard
          icon="⭐"
          label="Best Score"
          value={`${Math.round(stats.bestScore)}%`}
          color="green"
        />
        <StatCard
          icon="🔥"
          label="Streak"
          value={String(stats.streak)}
        />
      </div>

      {/* Quick skill snapshot */}
      <div className="rounded-3xl bg-card p-4 shadow-card">
        <h3 className="text-sm font-bold uppercase tracking-wider text-ink-soft mb-3">
          Skill Snapshot
        </h3>
        <div className="space-y-2.5">
          {(
            ["listening", "story_structure", "vocabulary", "grammar", "phonological"] as const
          ).map((domain) => {
            const score = stats.avgDomains[domain] || 0;
            const label = scoreToLabel(score);
            const meta = DOMAIN_META[domain];
            const colors = LABEL_COLORS[label];
            return (
              <div key={domain} className="flex items-center gap-3">
                <span className="text-lg">{meta.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-primary">
                      {meta.label}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-bold border",
                        colors.bg,
                        colors.text,
                        colors.border,
                      )}
                    >
                      {labelToDisplayText(label)}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        score >= 85
                          ? "bg-success"
                          : score >= 65
                            ? "bg-primary"
                            : score >= 40
                              ? "bg-amber-400"
                              : "bg-destructive",
                      )}
                      style={{ width: `${Math.min(score, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress trend */}
      {trendData.length > 1 && (
        <div className="rounded-3xl bg-card p-4 shadow-card">
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink-soft mb-3">
            Score Trend
          </h3>
          <MiniBarChart data={trendData} />
        </div>
      )}
    </div>
  );
}

// ── Stories Tab ──

function StoriesTab({
  completions,
}: {
  completions: {
    storyId: string;
    completedAt: string;
    overallScore: number;
    replayCount: number;
    domainScores: Record<string, number>;
  }[];
}) {
  return (
    <div className="space-y-3 animate-slide-up">
      {completions.map((c, i) => {
        const label = scoreToLabel(c.overallScore);
        const colors = LABEL_COLORS[label];
        const date = new Date(c.completedAt);
        const dateStr = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        return (
          <div
            key={`${c.storyId}-${i}`}
            className="rounded-3xl bg-card p-4 shadow-card"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-primary">
                  {getStory(c.storyId)?.title ?? c.storyId.replace(/-/g, " ")}
                </h3>
                <p className="text-xs text-ink-soft mt-0.5">
                  {dateStr}
                  {c.replayCount > 0 && ` · Replay #${c.replayCount}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-bold border",
                    colors.bg,
                    colors.text,
                    colors.border,
                  )}
                >
                  {Math.round(c.overallScore)}%
                </span>
              </div>
            </div>

            {/* Domain breakdown mini bars */}
            <div className="grid grid-cols-5 gap-1.5">
              {(
                [
                  "listening",
                  "story_structure",
                  "vocabulary",
                  "grammar",
                  "phonological",
                ] as const
              ).map((domain) => {
                const score = c.domainScores[domain] || 0;
                const meta = DOMAIN_META[domain];
                return (
                  <div key={domain} className="text-center">
                    <span className="text-sm">{meta.icon}</span>
                    <div className="h-1.5 rounded-full bg-muted mt-1 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          score >= 85
                            ? "bg-success"
                            : score >= 65
                              ? "bg-primary"
                              : score >= 40
                                ? "bg-amber-400"
                                : "bg-destructive",
                        )}
                        style={{ width: `${Math.min(score, 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-ink-soft mt-0.5 block">
                      {Math.round(score)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Skills Tab ──

function SkillsTab({
  avgDomains,
  storiesCompleted,
}: {
  avgDomains: Record<string, number>;
  storiesCompleted: number;
}) {
  const activeDomains: SkillDomain[] = [
    "listening",
    "story_structure",
    "vocabulary",
    "grammar",
    "phonological",
  ];

  return (
    <div className="space-y-3 animate-slide-up">
      <p className="text-xs text-ink-soft text-center mb-2">
        Averages across {storiesCompleted} completed{" "}
        {storiesCompleted === 1 ? "story" : "stories"}
      </p>

      {activeDomains.map((domain) => {
        const score = avgDomains[domain] || 0;
        const label = scoreToLabel(score);
        const colors = LABEL_COLORS[label];
        const meta = DOMAIN_META[domain];

        return (
          <div
            key={domain}
            className={cn(
              "rounded-3xl border-2 bg-card p-4 shadow-card",
              colors.border,
            )}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky text-xl">
                {meta.icon}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-primary">
                    {meta.label}
                  </h3>
                  <span className="text-lg font-extrabold text-primary">
                    {Math.round(score)}%
                  </span>
                </div>
                <p className="text-xs text-ink-soft">{meta.description}</p>
              </div>
            </div>

            {/* Full-width progress bar */}
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700",
                  score >= 85
                    ? "bg-success"
                    : score >= 65
                      ? "bg-primary"
                      : score >= 40
                        ? "bg-amber-400"
                        : "bg-destructive",
                )}
                style={{ width: `${Math.min(score, 100)}%` }}
              />
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-bold border",
                  colors.bg,
                  colors.text,
                  colors.border,
                )}
              >
                {labelToDisplayText(label)}
              </span>
              {domain === "retell" ? (
                <span className="text-[10px] text-ink-soft italic">
                  Coming in V2
                </span>
              ) : null}
            </div>
          </div>
        );
      })}

      {/* Retell placeholder */}
      <div className="rounded-3xl border-2 border-dashed border-muted bg-card/50 p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted text-xl opacity-50">
            🗣️
          </span>
          <div>
            <h3 className="text-base font-bold text-ink-soft">Retell</h3>
            <p className="text-xs text-ink-soft">
              Scored retell tracking coming in a future update
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Stat Card ──

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  color?: "green" | "blue" | "amber";
}) {
  return (
    <div className="rounded-3xl bg-card p-4 shadow-card text-center">
      <span className="text-2xl">{icon}</span>
      <p
        className={cn(
          "mt-1 text-2xl font-extrabold",
          color === "green"
            ? "text-success"
            : color === "amber"
              ? "text-amber-500"
              : "text-primary",
        )}
      >
        {value}
      </p>
      <p className="text-xs font-bold text-ink-soft">{label}</p>
    </div>
  );
}

// ── Mini Bar Chart (CSS-only, no dependencies) ──

function MiniBarChart({
  data,
}: {
  data: { index: number; score: number; storyId: string; date: string }[];
}) {
  const maxScore = 100;
  const barWidth = Math.min(40, Math.floor((280 - data.length * 4) / data.length));

  return (
    <div className="flex items-end justify-center gap-1" style={{ height: 100 }}>
      {data.map((d) => {
        const height = Math.max(4, (d.score / maxScore) * 88);
        return (
          <div
            key={`${d.storyId}-${d.index}`}
            className="flex flex-col items-center"
            style={{ width: barWidth }}
          >
            <span className="text-[9px] font-bold text-ink-soft mb-1">
              {d.score}
            </span>
            <div
              className={cn(
                "w-full rounded-t-lg transition-all duration-500",
                d.score >= 85
                  ? "bg-success"
                  : d.score >= 65
                    ? "bg-primary"
                    : d.score >= 40
                      ? "bg-amber-400"
                      : "bg-destructive",
              )}
              style={{ height }}
            />
            <span className="t