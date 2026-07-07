import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  addNote,
  assignStory,
  deleteNote,
  getAssignments,
  getCaseload,
  getNotes,
  hydrateSlpFromCloud,
  redeemInviteCode,
  seedDemoCaseload,
  updateAssignment,
  type CaseloadChild,
  type SessionNote,
  type StoryAssignment,
} from "@/services/slp";
import { getStoriesByLevel } from "@/services/stories";
import { labelToDisplayText, scoreToLabel } from "@/services/scoring";
import type { SkillDomain } from "@/types/story";
import { MiniPlane, Star, StoryProsLogo, UserIcon } from "./StoryProsBrand";
import { BookCheckIcon, BookIcon, ChevronRightIcon, PaperPlaneIcon } from "./StoryProsUi";
import { TactileButton } from "./TactileButton";

const V1_DOMAINS: SkillDomain[] = ["listening", "story_structure", "vocabulary", "grammar"];

const DOMAIN_META: Record<
  SkillDomain,
  { label: string; icon: ReactNode; color: string; softColor: string }
> = {
  listening: {
    label: "Listening",
    icon: <EarIcon />,
    color: "bg-primary",
    softColor: "bg-accent text-primary",
  },
  story_structure: {
    label: "Story Structure",
    icon: <BookIcon className="h-5 w-5" />,
    color: "bg-secondary",
    softColor: "bg-secondary/25 text-secondary-foreground",
  },
  vocabulary: {
    label: "Vocabulary",
    icon: <TextIcon />,
    color: "bg-success",
    softColor: "bg-success/15 text-success",
  },
  grammar: {
    label: "Grammar",
    icon: <PencilIcon />,
    color: "bg-coral",
    softColor: "bg-coral/15 text-coral",
  },
  retell: {
    label: "Retell",
    icon: <RetellIcon />,
    color: "bg-primary",
    softColor: "bg-accent text-primary",
  },
  phonological: {
    label: "Sounds",
    icon: <SoundIcon />,
    color: "bg-sky",
    softColor: "bg-sky/30 text-primary",
  },
};

interface SlpDashboardScreenProps {
  onClose: () => void;
}

export function SlpDashboardScreen({ onClose }: SlpDashboardScreenProps) {
  const { user, profile } = useAuth();
  const slpId = user?.id ?? "";
  const roleLabel = profile?.role === "slp" ? "SLP" : "Teacher";

  const [view, setView] = useState<"caseload" | "child-detail">("caseload");
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    if (!slpId) return;
    seedDemoCaseload(slpId);
    void hydrateSlpFromCloud(slpId);
  }, [slpId]);

  useEffect(() => {
    const onUpdate = () => refresh();
    window.addEventListener("storypros:slp-updated", onUpdate);
    return () => window.removeEventListener("storypros:slp-updated", onUpdate);
  }, []);

  void refreshKey;
  const caseload = getCaseload(slpId);
  const allAssignments = getAssignments(slpId);
  const allNotes = getNotes(slpId);
  const selectedChild = caseload.find((c) => c.childId === selectedChildId) ?? null;

  function openChild(childId: string) {
    setSelectedChildId(childId);
    setView("child-detail");
  }

  const isDetail = view === "child-detail";

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <DashboardBackdrop />

      <header className="relative z-30 flex items-center justify-between gap-2 px-5 pb-2 pt-4">
        <button
          onClick={isDetail ? () => setView("caseload") : onClose}
          aria-label={isDetail ? "Back to caseload" : "Back"}
          className="press-pop flex h-11 w-11 items-center justify-center rounded-full bg-card text-primary shadow-card"
        >
          <ChevronLeftIcon />
        </button>
        <StoryProsLogo layout="row" size="md" className="scale-90" />
        <span className="rounded-full bg-card px-3 py-2 text-xs font-extrabold text-primary shadow-card">
          {roleLabel}
        </span>
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar px-4 pb-8 pt-2">
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

      {showLinkForm && (
        <LinkParentModal
          slpId={slpId}
          onClose={() => setShowLinkForm(false)}
          onLinked={() => {
            setShowLinkForm(false);
            refresh();
          }}
        />
      )}
    </div>
  );
}

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
  const totalChildren = caseload.length;
  const activeAssignments = assignments.filter((a) => a.status !== "completed").length;
  const completedThisWeek = assignments.filter(
    (a) =>
      a.status === "completed" &&
      a.completedAt &&
      Date.now() - new Date(a.completedAt).getTime() < 7 * 86400000,
  ).length;
  const recentNotes = notes.filter(
    (n) => Date.now() - new Date(n.date).getTime() < 7 * 86400000,
  ).length;

  return (
    <div className="space-y-5">
      <section className="animate-slide-up">
        <h1 className="text-[38px] font-extrabold leading-none text-primary">Caseload Overview</h1>
        <p className="mt-2 text-base font-medium leading-snug text-ink-soft">
          Plan story practice, review progress, and keep families connected.
        </p>
      </section>

      <section className="rounded-[30px] bg-card p-4 shadow-soft animate-slide-up">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-secondary/25 text-secondary-foreground">
            <BriefcaseIcon />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-extrabold uppercase tracking-wide text-primary">
              {roleLabel} workspace
            </p>
            <h2 className="mt-1 text-[24px] font-extrabold leading-tight text-ink">
              {totalChildren} linked {totalChildren === 1 ? "child" : "children"}
            </h2>
            <p className="mt-1 text-sm font-semibold leading-snug text-ink-soft">
              {activeAssignments} active story{" "}
              {activeAssignments === 1 ? "assignment" : "assignments"}
            </p>
          </div>
        </div>
        <TactileButton
          variant="secondary"
          className="mt-4"
          leadingIcon={<PlusIcon />}
          onClick={onShowLink}
        >
          Link Parent Account
        </TactileButton>
      </section>

      <section className="grid grid-cols-2 gap-3 stagger-in">
        <MetricCard
          icon={<UserIcon className="h-6 w-6" />}
          value={totalChildren}
          label="Children"
        />
        <MetricCard
          icon={<ClipboardIcon />}
          value={activeAssignments}
          label="Active"
          tone="secondary"
        />
        <MetricCard icon={<BookCheckIcon />} value={completedThisWeek} label="Done This Week" />
        <MetricCard icon={<NoteIcon />} value={recentNotes} label="Recent Notes" tone="secondary" />
      </section>

      <section className="space-y-3 animate-slide-up">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-primary">Children</h2>
          <span className="text-sm font-extrabold text-ink-soft">{totalChildren} total</span>
        </div>

        {caseload.map((child) => {
          const childAssignments = assignments.filter((a) => a.childId === child.childId);
          const pending = childAssignments.filter((a) => a.status === "assigned").length;
          const completed = childAssignments.filter((a) => a.status === "completed").length;
          const childNotes = notes.filter((n) => n.childId === child.childId);
          const lastNote =
            childNotes.length > 0
              ? childNotes.sort(
                  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
                )[0]
              : null;

          return (
            <button
              key={child.childId}
              onClick={() => onSelectChild(child.childId)}
              className="press-pop w-full rounded-[26px] border border-accent/60 bg-card p-4 text-left shadow-card"
            >
              <div className="flex items-center gap-3">
                <ChildAvatar name={child.childName} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-extrabold text-ink">{child.childName}</p>
                  <p className="text-xs font-semibold text-ink-soft">
                    {child.tag && <span className="text-primary">{child.tag} - </span>}
                    {pending} assigned - {completed} completed
                  </p>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-primary">
                  <ChevronRightIcon />
                </span>
              </div>
              {lastNote && (
                <div className="mt-3 rounded-2xl bg-background/70 px-3 py-2">
                  <p className="line-clamp-1 text-xs font-semibold text-ink-soft">
                    <span className="font-extrabold text-primary">Last note:</span>{" "}
                    {lastNote.content}
                  </p>
                </div>
              )}
            </button>
          );
        })}

        {caseload.length === 0 && (
          <div className="rounded-[28px] bg-card p-6 text-center shadow-card">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent text-primary">
              <ClipboardIcon className="h-10 w-10" />
            </div>
            <h3 className="mt-4 text-xl font-extrabold text-primary">No children linked yet</h3>
            <p className="mt-2 text-sm font-semibold leading-snug text-ink-soft">
              Link a parent's account to start tracking a child's progress.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

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
    <div className="space-y-4">
      <section className="rounded-[30px] bg-card p-4 shadow-soft animate-slide-up">
        <div className="flex items-center gap-4">
          <ChildAvatar name={child.childName} size="lg" />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[30px] font-extrabold leading-none text-primary">
              {child.childName}
            </h1>
            <p className="mt-2 text-sm font-semibold text-ink-soft">
              {child.tag && <span className="text-primary">{child.tag} - </span>}
              Linked {new Date(child.linkedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-3 gap-1 rounded-[22px] bg-accent/50 p-1 shadow-card">
        {(["progress", "assignments", "notes"] as const).map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={cn(
              "rounded-[18px] px-2 py-3 text-[11px] font-extrabold capitalize transition-all",
              tab === item ? "bg-card text-primary shadow-card" : "text-ink-soft",
            )}
          >
            {item === "assignments"
              ? `Assigned (${assignments.length})`
              : item === "notes"
                ? `Notes (${notes.length})`
                : item}
          </button>
        ))}
      </div>

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
        <NotesTab slpId={slpId} childId={child.childId} notes={notes} onRefresh={onRefresh} />
      )}
    </div>
  );
}

function ProgressTab({ childId: _childId }: { childId: string }) {
  const demoScores: Record<SkillDomain, number> = {
    listening: 78,
    story_structure: 65,
    vocabulary: 82,
    grammar: 58,
    retell: 0,
    phonological: 0,
  };

  const overallScore = Math.round(
    V1_DOMAINS.reduce((sum, domain) => sum + (demoScores[domain] ?? 0), 0) / V1_DOMAINS.length,
  );

  return (
    <div className="space-y-4 animate-slide-up">
      <section className="rounded-[30px] bg-card p-5 shadow-soft">
        <div className="grid grid-cols-[126px_1fr] items-center gap-4">
          <ProgressRing value={overallScore} />
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wide text-primary">
              Overall score
            </p>
            <h2 className="mt-1 text-[24px] font-extrabold leading-tight text-ink">
              {labelToDisplayText(scoreToLabel(overallScore))}
            </h2>
            <p className="mt-2 text-sm font-semibold leading-snug text-ink-soft">
              Review strengths and supports before assigning the next story.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] bg-card p-4 shadow-card">
        <h2 className="text-xl font-extrabold text-primary">Skill Domains</h2>
        <div className="mt-4 space-y-3">
          {V1_DOMAINS.map((domain) => {
            const score = demoScores[domain] ?? 0;
            const meta = DOMAIN_META[domain];
            return (
              <div key={domain} className="rounded-[22px] bg-background/70 p-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
                        meta.softColor,
                      )}
                    >
                      {meta.icon}
                    </span>
                    <span className="truncate text-sm font-extrabold text-ink">{meta.label}</span>
                  </div>
                  <ScoreLabel score={score} />
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-accent/70">
                  <div
                    className={cn("h-full rounded-full transition-all", meta.color)}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-[28px] bg-card p-4 shadow-card">
        <div className="flex items-center gap-3">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] bg-secondary/25 text-secondary-foreground">
            <PaperPlaneIcon className="h-7 w-7" />
          </span>
          <div>
            <h2 className="text-lg font-extrabold text-primary">Level 1 to 2 Mastery</h2>
            <p className="mt-1 text-sm font-semibold leading-snug text-ink-soft">
              Needs 80%+ across 5 stories to advance. Currently tracking completed stories.
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-accent/70">
            <div className="h-full w-[20%] rounded-full bg-secondary" />
          </div>
          <span className="text-xs font-extrabold text-primary">1/5</span>
        </div>
      </section>
    </div>
  );
}

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
      {sorted.map((assignment) => (
        <div key={assignment.id} className="rounded-[24px] bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <AssignmentStatusIcon status={assignment.status} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-extrabold text-ink">{assignment.storyTitle}</p>
              <p className="text-xs font-semibold text-ink-soft">
                Assigned {new Date(assignment.assignedAt).toLocaleDateString()}
                {assignment.completedAt &&
                  ` - Completed ${new Date(assignment.completedAt).toLocaleDateString()}`}
              </p>
            </div>
            {assignment.status !== "completed" && (
              <button
                onClick={() => handleMarkComplete(assignment.id)}
                className="press-pop rounded-full bg-success/15 px-3 py-2 text-xs font-extrabold text-success"
              >
                Done
              </button>
            )}
          </div>
        </div>
      ))}

      {assignments.length === 0 && !showAssignForm && (
        <div className="rounded-[28px] bg-card p-6 text-center shadow-card">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-primary">
            <ClipboardIcon className="h-8 w-8" />
          </div>
          <p className="mt-3 text-sm font-extrabold text-ink-soft">No stories assigned yet</p>
        </div>
      )}

      {showAssignForm ? (
        <div className="rounded-[28px] border-2 border-primary/30 bg-card p-4 shadow-soft">
          <p className="text-xs font-extrabold uppercase tracking-wide text-primary">
            Assign a story
          </p>
          <div className="mt-3 space-y-2">
            {stories.map((story) => {
              const alreadyAssigned = assignments.some(
                (a) => a.storyId === story.id && a.status !== "completed",
              );
              return (
                <button
                  key={story.id}
                  onClick={() => !alreadyAssigned && handleAssign(story.id, story.title)}
                  disabled={alreadyAssigned}
                  className={cn(
                    "w-full rounded-[20px] border p-3 text-left transition-all",
                    alreadyAssigned
                      ? "cursor-not-allowed border-accent/30 bg-accent/20 opacity-55"
                      : "press-pop border-accent/60 bg-background/70",
                  )}
                >
                  <p className="text-sm font-extrabold text-ink">{story.title}</p>
                  <p className="mt-1 text-xs font-semibold text-ink-soft">
                    {alreadyAssigned ? "Already assigned" : `Level ${story.level} - ${story.theme}`}
                  </p>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setShowAssignForm(false)}
            className="mt-3 w-full py-2 text-center text-sm font-extrabold text-ink-soft"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowAssignForm(true)}
          className="press-pop w-full rounded-[24px] border-2 border-dashed border-primary/35 bg-card p-4 text-center text-sm font-extrabold text-primary shadow-card"
        >
          Add Story Assignment
        </button>
      )}
    </div>
  );
}

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
    const tagList = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
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

  const sorted = [...notes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-3 animate-slide-up">
      {showForm ? (
        <div className="rounded-[28px] border-2 border-primary/30 bg-card p-4 shadow-soft">
          <p className="text-xs font-extrabold uppercase tracking-wide text-primary">
            New session note
          </p>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Observations, goals, progress notes..."
            rows={4}
            className="mt-3 w-full resize-none rounded-[20px] border-2 border-accent/70 bg-background/80 p-3 text-sm font-semibold text-ink placeholder:text-ink-soft/45 focus:border-primary focus:outline-none"
          />
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated)"
            className="mt-3 w-full rounded-[20px] border-2 border-accent/70 bg-background/80 p-3 text-sm font-semibold text-ink placeholder:text-ink-soft/45 focus:border-primary focus:outline-none"
          />
          <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
            <TactileButton
              variant="primary"
              disabled={!noteText.trim()}
              className="h-12 rounded-2xl text-base"
              onClick={handleSave}
            >
              Save Note
            </TactileButton>
            <button
              onClick={() => {
                setShowForm(false);
                setNoteText("");
                setTags("");
              }}
              className="rounded-2xl bg-accent px-4 text-sm font-extrabold text-primary"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="press-pop w-full rounded-[24px] border-2 border-dashed border-primary/35 bg-card p-4 text-center text-sm font-extrabold text-primary shadow-card"
        >
          Add Session Note
        </button>
      )}

      {sorted.map((note) => (
        <div key={note.id} className="rounded-[24px] bg-card p-4 shadow-card">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-extrabold text-primary">
              {new Date(note.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <button
              onClick={() => handleDelete(note.id)}
              className="text-xs font-extrabold text-ink-soft/60 transition-colors hover:text-destructive"
            >
              Remove
            </button>
          </div>
          <p className="mt-2 text-sm font-semibold leading-relaxed text-ink">{note.content}</p>
          {note.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-extrabold text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}

      {notes.length === 0 && !showForm && (
        <div className="rounded-[28px] bg-card p-6 text-center shadow-card">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-primary">
            <NoteIcon className="h-8 w-8" />
          </div>
          <p className="mt-3 text-sm font-extrabold text-ink-soft">No session notes yet</p>
        </div>
      )}
    </div>
  );
}

function LinkParentModal({
  slpId,
  onClose,
  onLinked,
}: {
  slpId: string;
  onClose: () => void;
  onLinked: () => void;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [linkedName, setLinkedName] = useState<string | null>(null);

  async function handleLink(e: FormEvent) {
    e.preventDefault();
    if (code.trim().length < 6 || busy) return;
    setBusy(true);
    setError("");

    const result = await redeemInviteCode(slpId, code.trim());
    setBusy(false);

    if (result.success) {
      setLinkedName(result.childName ?? "the child");
      onLinked();
    } else {
      setError(result.error ?? "Something went wrong. Please try again.");
    }
  }

  return (
    <div
      className="absolute inset-0 z-50 flex items-end justify-center bg-ink/45 px-3 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-[34px] bg-card p-5 pb-7 shadow-soft animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-accent" />

        {linkedName ? (
          <div className="py-4 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary/25 text-secondary-foreground">
              <Star className="h-11 w-11" />
            </div>
            <h3 className="mt-4 text-xl font-extrabold text-primary">
              {linkedName} joined your caseload
            </h3>
            <p className="mt-2 text-sm font-semibold text-ink-soft">
              You can now see their progress and assign stories.
            </p>
            <TactileButton className="mt-5" onClick={onClose}>
              Done
            </TactileButton>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-extrabold leading-tight text-primary">
              Add a child with an invite code
            </h3>
            <p className="mt-2 text-sm font-semibold leading-snug text-ink-soft">
              Ask the parent to open Settings, choose Share with your SLP, and send the 6-character
              code. Codes expire after 7 days.
            </p>

            <form onSubmit={handleLink} className="mt-4 space-y-3">
              <label className="block text-xs font-extrabold uppercase tracking-wide text-primary">
                Invite code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="K7M2QX"
                maxLength={6}
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
                className="w-full rounded-[22px] border-2 border-accent bg-background p-4 text-center text-2xl font-extrabold tracking-[0.28em] text-ink placeholder:text-ink-soft/35 focus:border-primary focus:outline-none"
              />

              {error && <p className="text-sm font-extrabold text-destructive">{error}</p>}

              <TactileButton type="submit" disabled={code.trim().length < 6 || busy}>
                {busy ? "Checking Code..." : "Link Child"}
              </TactileButton>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-center text-sm font-extrabold text-ink-soft"
              >
                Cancel
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function DashboardBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-b from-white via-accent/10 to-accent/30" />
      <div className="absolute -right-16 top-32 h-56 w-60 rounded-full bg-accent/60 blur-3xl" />
      <div className="absolute -left-20 bottom-20 h-56 w-64 rounded-full bg-sky/45 blur-3xl" />
      <Star className="absolute left-10 top-32 h-4 w-4 text-secondary animate-sparkle" />
      <Star className="absolute right-12 top-44 h-5 w-5 text-secondary animate-sparkle" />
      <MiniPlane className="absolute right-16 top-24 h-10 w-10 rotate-12 text-secondary animate-float" />
    </div>
  );
}

function MetricCard({
  icon,
  value,
  label,
  tone = "primary",
}: {
  icon: ReactNode;
  value: ReactNode;
  label: string;
  tone?: "primary" | "secondary";
}) {
  return (
    <div className="rounded-[24px] bg-card p-3.5 shadow-card">
      <span
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-[20px]",
          tone === "primary"
            ? "bg-accent text-primary"
            : "bg-secondary/25 text-secondary-foreground",
        )}
      >
        {icon}
      </span>
      <p className="mt-3 text-2xl font-extrabold leading-none text-ink">{value}</p>
      <p className="mt-1 text-sm font-extrabold leading-tight text-primary">{label}</p>
    </div>
  );
}

function ChildAvatar({ name, size = "md" }: { name: string; size?: "md" | "lg" }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-accent text-primary shadow-card",
        size === "lg" ? "h-16 w-16 text-2xl" : "h-13 w-13 text-xl",
      )}
    >
      <span className="font-extrabold">{name.charAt(0).toUpperCase()}</span>
    </span>
  );
}

function ProgressRing({ value }: { value: number }) {
  return (
    <div
      className="relative flex h-[126px] w-[126px] items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(var(--primary) ${value * 3.6}deg, oklch(0.9 0.05 300) 0deg)`,
      }}
    >
      <div className="flex h-[102px] w-[102px] flex-col items-center justify-center rounded-full bg-card text-center shadow-inner">
        <span className="text-[30px] font-extrabold leading-none text-primary">{value}%</span>
        <span className="mt-1 text-[11px] font-extrabold leading-tight text-ink">Overall</span>
      </div>
    </div>
  );
}

function ScoreLabel({ score }: { score: number }) {
  const label = scoreToLabel(score);
  const display = labelToDisplayText(label);

  const colorMap: Record<string, string> = {
    strength: "bg-success/15 text-success",
    growing: "bg-primary/15 text-primary",
    budding: "bg-secondary/25 text-secondary-foreground",
    needs_support: "bg-destructive/15 text-destructive",
  };

  return (
    <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-extrabold", colorMap[label])}>
      {score}% - {display}
    </span>
  );
}

function AssignmentStatusIcon({ status }: { status: StoryAssignment["status"] }) {
  const done = status === "completed";
  const inProgress = status === "in_progress";
  return (
    <span
      className={cn(
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-[20px]",
        done
          ? "bg-success/15 text-success"
          : inProgress
            ? "bg-accent text-primary"
            : "bg-secondary/25 text-secondary-foreground",
      )}
    >
      {done ? <CheckIcon /> : inProgress ? <BookIcon className="h-6 w-6" /> : <ClipboardIcon />}
    </span>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      aria-hidden
    >
      <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      aria-hidden
    >
      <path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      aria-hidden
    >
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function ClipboardIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden
    >
      <path d="M9 4h6l1 2h3v14H5V6h3l1-2z" strokeLinejoin="round" />
      <path d="M9 11h6M9 15h5" strokeLinecap="round" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-11 w-11"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden
    >
      <path d="M9 7V5h6v2M4 8h16v11H4V8z" strokeLinejoin="round" />
      <path d="M4 12h16M10 12v2h4v-2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NoteIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden
    >
      <path d="M5 4h14v16H5V4z" strokeLinejoin="round" />
      <path d="M8 9h8M8 13h8M8 17h5" strokeLinecap="round" />
    </svg>
  );
}

function EarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden
    >
      <path d="M7 10a5 5 0 1110 0c0 4-4 4-4 7a3 3 0 01-6 0" strokeLinecap="round" />
      <path d="M10 10a2 2 0 114 0" strokeLinecap="round" />
    </svg>
  );
}

function TextIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden
    >
      <path d="M4 7h16M8 7v10M16 7v10M7 17h4M13 17h4" strokeLinecap="round" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden
    >
      <path d="M4 20l4-1 11-11-3-3L5 16l-1 4z" strokeLinejoin="round" />
      <path d="M14 7l3 3" strokeLinecap="round" />
    </svg>
  );
}

function RetellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden
    >
      <path d="M5 7h10a4 4 0 010 8H8" strokeLinecap="round" />
      <path d="M9 11l-4 4 4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SoundIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden
    >
      <path d="M4 14h4l5 4V6L8 10H4v4z" strokeLinejoin="round" />
      <path d="M17 9c1 1 1 5 0 6M20 7c2 3 2 7 0 10" strokeLinecap="round" />
    </svg>
  );
}
