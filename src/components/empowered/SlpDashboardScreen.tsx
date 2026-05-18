/* ─────────────────────────────────────────────
 * SLP / Teacher Dashboard
 * Clinical view for speech-language pathologists
 * and teachers to monitor their caseload.
 *
 * Sections:
 *  1. Caseload overview (all linked children)
 *  2. Child detail (scores, domains, progress)
 *  3. Story assignments
 *  4. Session notes
 *  5. Link-parent flow
 * ───────────────────────────────────────────── */

import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  getCaseload,
  getAssignments,
  getNotes,
  addChildToCaseload,
  assignStory,
  updateAssignment,
  addNote,
  deleteNote,
  seedDemoCaseload,
  type CaseloadChild,
  type StoryAssignment,
  type SessionNote,
} from "@/services/slp";
import { getStoriesByLevel } from "@/services/stories";
import {
  scoreToLabel,
  labelToDisplayText,
} from "@/services/scoring";
import type { SkillDomain } from "@/types/story";

// ── Domain display config (same as parent dashboard) ──

const DOMAIN_META: Record<string, { label: string; icon: string; color: string }> = {
  listening: { label: "Listening", icon: "👂", color: "bg-blue-500" },
  story_structure: { label: "Story Structure", icon: "📖", color: "bg-purple-500" },
  vocabulary: { label: "Vocabulary", icon: "💬", color: "bg-green-500" },
  grammar: { label: "Grammar", icon: "✏️", color: "bg-amber-500" },
  retell: { label: "Retell", icon: "🗣️", color: "bg-pink-500" },
  phonological: { label: "Phonological", icon: "🔤", color: "bg-teal-500" },
};

const V1_DOMAINS: SkillDomain[] = ["listening", "story_structure", "vocabulary", "grammar"];

// ── Props ──

interface SlpDashboardScreenProps {
  onClose: () => void;
}

export function SlpDashboardScreen({ onClose }: SlpDashboardScreenProps) {
  const { user, profile } = useAuth();
  const slpId = user?.id ?? "";
  const roleLabel = profile?.role === "slp" ? "SLP" : "Teacher";

  // Seed demo data on first load
  useEffect(() => {
    if (slpId) seedDemoCaseload(slpId);
  }, [slpId]);

  // State
  const [view, setView] = useState<"caseload" | "child-detail">("caseload");
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey((k) => k + 1);

  const caseload = useMemo(() => getCaseload(slpId), [slpId, refreshKey]);
  const allAssignments = useMemo(() => getAssignments(slpId), [slpId, refreshKey]);
  const allNotes = useMemo(() => getNotes(slpId), [slpId, refreshKey]);

  const selectedChild = caseload.find((c) => c.childId === selectedChildId) ?? null;

  function openChild(childId: string) {
    setSelectedChildId(childId);
    setView("child-detail");
  }

  return (
    <div className="relative flex h-full flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-2 bg-card/95 backdrop-blur px-4 py-3 rounded-b-2xl border-b-4 border-accent/60 shadow-card">
        <div className="flex items-center gap-2">
          {view === "child-detail" ? (
            <button
              onClick={() => setView("caseload")}
              className="text-sm font-bold text-primary hover:text-primary/80 transition-colors"
            >
              ← Caseload
            </button>
          ) : (
            <button
              onClick={onClose}
              className="text-sm font-bold text-primary hover:text-primary/80 transition-colors"
            >
              ← Back
            </button>
          )}
        </div>
        <h1 className="font-extrabold italic tracking-tight text-primary text-base">
          {roleLabel} Dashboard
        </h1>
        <div className="w-16" /> {/* spacer for centering */}
      </header>

      {/* Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {view === "caseload" && (
          <CaseloadView
            caseload={caseload}
            assignments={allAssignments}
            notes={allNotes}
            onSelectChild={openChild}
            onShowLink={() => setShowLinkForm(true)}
            roleLabel={roleLabel}
          />
        )}

        {view === "child-detail" && selectedChild && (
          <ChildDetailView
            slpId={slpId}
            child={selectedChild}
            assignments={allAssignments.filter((a) => a.childId === selectedChild.childId)}
            notes={allNotes.filter((n) => n.childId === selectedChild.childId)}
            onRefresh={refresh}
          />
        )}
      </div>

      {/* Link parent modal */}
      {showLinkForm && (
        <LinkParentModal
          slpId={slpId}
          onClose={() => setShowLinkForm(false)}
          onLinked={() => { setShowLinkForm(false); refresh(); }}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
 * CASELOAD OVERVIEW
 * ═══════════════════════════════════════════ */

function CaseloadView({
  caseload,
  assignments,
  notes,
  onSelectChild,
  onShowLink,
  roleLabel,
}: {
  caseload: CaseloadChild[];
  assignments: StoryAssignment[];
  notes: SessionNote[];
  onSelectChild: (id: string) => void;
  onShowLink: () => void;
  roleLabel: string;
}) {
  // Quick stats
  const totalChildren = caseload.length;
  const activeAssignments = assignments.filter((a) => a.status !== "completed").length;
  const completedThisWeek = assignments.filter(
    (a) => a.status === "completed" && a.completedAt &&
      Date.now() - new Date(a.completedAt).getTime() < 7 * 86400000,
  ).length;
  const recentNotes = notes.filter(
    (n) => Date.now() - new Date(n.date).getTime() < 7 * 86400000,
  ).length;

  return (
    <div className="px-4 py-4 space-y-5">
      {/* Greeting */}
      <div>
        <h2 className="text-xl font-extrabold text-ink">My Caseload</h2>
        <p className="text-sm text-ink-soft mt-0.5">
          {totalChildren} {totalChildren === 1 ? "child" : "children"} linked
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <StatCard value={totalChildren} label="Children" icon="👧" />
        <StatCard value={activeAssignments} label="Active" icon="📋" />
        <StatCard value={completedThisWeek} label="Done (7d)" icon="✅" />
      </div>

      {/* Children list */}
      <div className="space-y-2">
        {caseload.map((child) => {
          const childAssignments = assignments.filter((a) => a.childId === child.childId);
          const pending = childAssignments.filter((a) => a.status === "assigned").length;
          const completed = childAssignments.filter((a) => a.status === "completed").length;
          const childNotes = notes.filter((n) => n.childId === child.childId);
          const lastNote = childNotes.length > 0
            ? childNotes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
            : null;

          return (
            <button
              key={child.childId}
              onClick={() => onSelectChild(child.childId)}
              className="w-full rounded-2xl bg-card p-4 border-2 border-accent/40 shadow-card text-left transition-all hover:border-primary/40 active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-lg">
                  {child.childName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-ink text-base truncate">{child.childName}</p>
                  <p className="text-xs text-ink-soft">
                    {child.tag && <span className="text-primary font-semibold">{child.tag} · </span>}
                    {pending} assigned · {completed} completed
                  </p>
                </div>
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-ink-soft/50 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {lastNote && (
                <div className="mt-2 pt-2 border-t border-accent/30">
                  <p className="text-xs text-ink-soft line-clamp-1">
                    <span className="font-semibold">Last note:</span> {lastNote.content}
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Add child button */}
      <button
        onClick={onShowLink}
        className="w-full rounded-2xl border-2 border-dashed border-primary/30 p-4 text-center text-sm font-bold text-primary hover:bg-primary/5 transition-colors active:scale-[0.98]"
      >
        + Link a parent account
      </button>

      {/* Empty state */}
      {caseload.length === 0 && (
        <div className="text-center py-8">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-bold text-ink text-lg">No children linked yet</p>
          <p className="text-sm text-ink-soft mt-1 leading-relaxed">
            Link a parent's account to start tracking<br />their child's progress.
          </p>
        </div>
      )}

      <div className="h-8" />
    </div>
  );
}

/* ═══════════════════════════════════════════
 * CHILD DETAIL VIEW
 * ═══════════════════════════════════════════ */

function ChildDetailView({
  slpId,
  child,
  assignments,
  notes,
  onRefresh,
}: {
  slpId: string;
  child: CaseloadChild;
  assignments: StoryAssignment[];
  notes: SessionNote[];
  onRefresh: () => void;
}) {
  const [tab, setTab] = useState<"progress" | "assignments" | "notes">("progress");

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Child header */}
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
          {child.childName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-ink">{child.childName}</h2>
          <p className="text-xs text-ink-soft">
            {child.tag && <span className="text-primary font-semibold">{child.tag} · </span>}
            Linked {new Date(child.linkedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 rounded-2xl bg-accent/40 p-1">
        {(["progress", "assignments", "notes"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 rounded-xl py-2 text-xs font-bold transition-all capitalize",
              tab === t
                ? "bg-card text-primary shadow-card"
                : "text-ink-soft hover:text-ink",
            )}
          >
            {t === "assignments" ? `Assigned (${assignments.length})` : t === "notes" ? `Notes (${notes.length})` : t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "progress" && <ProgressTab childId={child.childId} />}
      {tab === "assignments" && (
        <AssignmentsTab
          slpId={slpId}
          childId={child.childId}
          assignments={assignments}
          onRefresh={onRefresh}
        />
      )}
      {tab === "notes" && (
        <NotesTab
          slpId={slpId}
          childId={child.childId}
          notes={notes}
          onRefresh={onRefresh}
        />
      )}

      <div className="h-8" />
    </div>
  );
}

/* ── Progress tab ── */

function ProgressTab({ childId }: { childId: string }) {
  // In real implementation, this would fetch from Supabase
  // using the child's ID. For now, show demo domain scores.
  const demoScores: Record<string, number> = {
    listening: 78,
    story_structure: 65,
    vocabulary: 82,
    grammar: 58,
  };

  const overallScore = Math.round(
    Object.values(demoScores).reduce((a, b) => a + b, 0) / Object.keys(demoScores).length,
  );

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Overall score */}
      <div className="rounded-2xl bg-card p-4 border-2 border-accent/40 shadow-card text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">Overall Score</p>
        <p className="text-4xl font-extrabold text-primary mt-1">{overallScore}%</p>
        <ScoreLabel score={overallScore} />
      </div>

      {/* Domain breakdown */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-ink-soft">Skill Domains</h3>
        {V1_DOMAINS.map((domain) => {
          const score = demoScores[domain] ?? 0;
          const meta = DOMAIN_META[domain];
          return (
            <div key={domain} className="rounded-2xl bg-card p-3 border border-accent/30">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">{meta?.icon}</span>
                  <span className="text-sm font-bold text-ink">{meta?.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-primary">{score}%</span>
                  <ScoreLabel score={score} size="sm" />
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-accent/60 overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", meta?.color ?? "bg-primary")}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Mastery criteria progress */}
      <div className="rounded-2xl bg-card p-4 border-2 border-accent/40 shadow-card">
        <h3 className="text-sm font-bold uppercase tracking-wider text-ink-soft mb-3">
          Level 1 → 2 Mastery
        </h3>
        <p className="text-xs text-ink-soft leading-relaxed">
          Needs 80%+ across 5 stories to advance. Currently tracking progress across completed stories.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-2.5 rounded-full bg-accent/60 overflow-hidden">
            <div className="h-full rounded-full bg-secondary transition-all" style={{ width: "20%" }} />
          </div>
          <span className="text-xs font-bold text-ink-soft">1/5</span>
        </div>
      </div>
    </div>
  );
}

/* ── Assignments tab ── */

function AssignmentsTab({
  slpId,
  childId,
  assignments,
  onRefresh,
}: {
  slpId: string;
  childId: string;
  assignments: StoryAssignment[];
  onRefresh: () => void;
}) {
  const [showAssignForm, setShowAssignForm] = useState(false);
  const stories = getStoriesByLevel(1);

  function handleAssign(storyId: string, title: string) {
    assignStory(slpId, childId, storyId, title);
    setShowAssignForm(false);
    onRefresh();
  }

  function handleMarkComplete(assignmentId: string) {
    updateAssignment(slpId, assignmentId, {
      status: "completed",
      completedAt: new Date().toISOString(),
    });
    onRefresh();
  }

  const sorted = [...assignments].sort((a, b) => {
    const order = { assigned: 0, in_progress: 1, completed: 2 };
    return order[a.status] - order[b.status];
  });

  return (
    <div className="space-y-3 animate-slide-up">
      {sorted.map((a) => (
        <div key={a.id} className="rounded-2xl bg-card p-3 border border-accent/30">
          <div className="flex items-center gap-3">
            <span className="text-lg">
              {a.status === "completed" ? "✅" : a.status === "in_progress" ? "📖" : "📋"}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-ink truncate">{a.storyTitle}</p>
              <p className="text-xs text-ink-soft">
                Assigned {new Date(a.assignedAt).toLocaleDateString()}
                {a.completedAt && ` · Completed ${new Date(a.completedAt).toLocaleDateString()}`}
              </p>
            </div>
            {a.status !== "completed" && (
              <button
                onClick={() => handleMarkComplete(a.id)}
                className="text-xs font-bold text-success bg-success/10 px-2.5 py-1 rounded-full hover:bg-success/20 transition-colors"
              >
                Done
              </button>
            )}
          </div>
        </div>
      ))}

      {assignments.length === 0 && !showAssignForm && (
        <div className="text-center py-6">
          <p className="text-3xl mb-2">📋</p>
          <p className="text-sm text-ink-soft">No stories assigned yet</p>
        </div>
      )}

      {showAssignForm ? (
        <div className="rounded-2xl bg-card p-4 border-2 border-primary/30 shadow-card space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">Assign a story</p>
          {stories.map((s) => {
            const alreadyAssigned = assignments.some((a) => a.storyId === s.id && a.status !== "completed");
            return (
              <button
                key={s.id}
                onClick={() => !alreadyAssigned && handleAssign(s.id, s.title)}
                disabled={alreadyAssigned}
                className={cn(
                  "w-full text-left rounded-xl p-3 border transition-all",
                  alreadyAssigned
                    ? "border-accent/20 bg-accent/10 opacity-50 cursor-not-allowed"
                    : "border-accent/40 bg-card hover:border-primary/40 active:scale-[0.98]",
                )}
              >
                <p className="text-sm font-bold text-ink">{s.title}</p>
                {alreadyAssigned && <p className="text-xs text-ink-soft">Already assigned</p>}
              </button>
            );
          })}
          <button
            onClick={() => setShowAssignForm(false)}
            className="w-full text-center text-xs font-semibold text-ink-soft py-2"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowAssignForm(true)}
          className="w-full rounded-2xl border-2 border-dashed border-primary/30 p-3 text-center text-sm font-bold text-primary hover:bg-primary/5 transition-colors active:scale-[0.98]"
        >
          + Assign a story
        </button>
      )}
    </div>
  );
}

/* ── Notes tab ── */

function NotesTab({
  slpId,
  childId,
  notes,
  onRefresh,
}: {
  slpId: string;
  childId: string;
  notes: SessionNote[];
  onRefresh: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [tags, setTags] = useState("");

  function handleSave() {
    if (!noteText.trim()) return;
    const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);
    addNote(slpId, childId, noteText.trim(), { tags: tagList });
    setNoteText("");
    setTags("");
    setShowForm(false);
    onRefresh();
  }

  function handleDelete(noteId: string) {
    deleteNote(slpId, noteId);
    onRefresh();
  }

  const sorted = [...notes].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="space-y-3 animate-slide-up">
      {/* New note form */}
      {showForm ? (
        <div className="rounded-2xl bg-card p-4 border-2 border-primary/30 shadow-card space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">New session note</p>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Observations, goals, progress notes..."
            rows={4}
            className="w-full rounded-xl border-2 border-muted bg-background p-3 text-sm text-ink placeholder:text-ink-soft/40 focus:border-primary focus:outline-none resize-none transition-colors"
          />
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated)"
            className="w-full rounded-xl border-2 border-muted bg-background p-3 text-sm text-ink placeholder:text-ink-soft/40 focus:border-primary focus:outline-none transition-colors"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={!noteText.trim()}
              className="flex-1 rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-bold disabled:opacity-40 transition-opacity active:scale-[0.98]"
            >
              Save note
            </button>
            <button
              onClick={() => { setShowForm(false); setNoteText(""); setTags(""); }}
              className="rounded-xl bg-accent/60 text-ink-soft px-4 py-2.5 text-sm font-bold active:scale-[0.98]"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full rounded-2xl border-2 border-dashed border-primary/30 p-3 text-center text-sm font-bold text-primary hover:bg-primary/5 transition-colors active:scale-[0.98]"
        >
          + Add session note
        </button>
      )}

      {/* Notes list */}
      {sorted.map((note) => (
        <div key={note.id} className="rounded-2xl bg-card p-4 border border-accent/30">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-bold text-ink-soft">
              {new Date(note.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
            <button
              onClick={() => handleDelete(note.id)}
              className="text-xs text-ink-soft/50 hover:text-destructive transition-colors"
            >
              Remove
            </button>
          </div>
          <p className="text-sm text-ink mt-1.5 leading-relaxed">{note.content}</p>
          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {note.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}

      {notes.length === 0 && !showForm && (
        <div className="text-center py-6">
          <p className="text-3xl mb-2">📝</p>
          <p className="text-sm text-ink-soft">No session notes yet</p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
 * LINK PARENT MODAL
 * ═══════════════════════════════════════════ */

function LinkParentModal({
  slpId,
  onClose,
  onLinked,
}: {
  slpId: string;
  onClose: () => void;
  onLinked: () => void;
}) {
  const [email, setEmail] = useState("");
  const [childName, setChildName] = useState("");
  const [error, setError] = useState("");

  function handleLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !childName.trim()) return;

    // In production, this would send an invitation to the parent
    // and link once they accept. For now, just create the link.
    addChildToCaseload(slpId, {
      childId: crypto.randomUUID(),
      childName: childName.trim(),
      parentEmail: email.trim(),
    });
    onLinked();
  }

  return (
    <div
      className="absolute inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-[32px] bg-card p-6 pb-8 shadow-soft animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted" />
        <h3 className="text-lg font-extrabold text-ink mb-1">Link a parent account</h3>
        <p className="text-sm text-ink-soft mb-4 leading-relaxed">
          Enter the parent's email and child's name. In the full version, this sends an invitation the parent can accept.
        </p>

        <form onSubmit={handleLink} className="space-y-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1">
              Parent's email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="parent@email.com"
              className="w-full rounded-2xl border-2 border-muted bg-background p-3 text-sm font-semibold text-ink placeholder:text-ink-soft/40 focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1">
              Child's name
            </label>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Enter child's name"
              className="w-full rounded-2xl border-2 border-muted bg-background p-3 text-sm font-semibold text-ink placeholder:text-ink-soft/40 focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm font-semibold text-destructive">{error}</p>
          )}

          <button
            type="submit"
            disabled={!email.trim() || !childName.trim()}
            className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-bold disabled:opacity-40 transition-opacity active:scale-[0.98]"
          >
            Link child
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full text-center text-sm font-semibold text-ink-soft py-2"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
 * SMALL COMPONENTS
 * ═══════════════════════════════════════════ */

function StatCard({ value, label, icon }: { value: number; label: string; icon: string }) {
  return (
    <div className="rounded-2xl bg-card p-3 border border-accent/30 text-center">
      <p className="text-lg mb-0.5">{icon}</p>
      <p className="text-xl font-extrabold text-primary">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">{label}</p>
    </div>
  );
}

function ScoreLabel({ score, size = "md" }: { score: number; size?: "sm" | "md" }) {
  const label = scoreToLabel(score);
  const display = labelToDisplayText(label);

  const colorMap: Record<string, string> = {
    strength: "bg-success/15 text-success",
    growing: "bg-blue-500/15 text-blue-600",
    budding: "bg-amber-500/15 text-amber-600",
    needs_support: "bg-destructive/15 text-destructive",
  };

  return (
    <span
      className={cn(
        "inline-block rounded-full font-bold",
        colorMap[label] ?? "bg-accent text-ink-soft",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs mt-1",
      )}
    >
      {display}
    </span>
  );
}
